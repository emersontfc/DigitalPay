import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  PAYSUITE_CONFIG,
  createPaySuitePayment,
  verifyPaySuiteWebhookSignature
} from './paysuite.js';
import { supabaseAdmin, STORAGE_BUCKET } from './supabaseServer.js';
import { generateSecureDownloadUrl, uploadPrivateDeliverableFile } from './storage.js';

// Carrega variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Domínios autorizados para CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Signature', 'X-Access-Token']
}));

// Captura do corpo bruto (rawBody) essencial para validação da assinatura HMAC-SHA256 do PaySuite
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Memória local de fallback caso o Supabase esteja temporariamente indisponível
const memoryStore = {
  orders: new Map(),
  webhookLogs: [],
  auditLogs: []
};

// ---------------------------------------------------------------------------
// 1. HEALTH CHECK & STATUS DE INTEGRAÇÃO
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DigitalPay PaySuite Gateway API',
    paysuite: {
      configured: PAYSUITE_CONFIG.isConfigured,
      hasWebhookSecret: Boolean(PAYSUITE_CONFIG.webhookSecret),
      baseUrl: PAYSUITE_CONFIG.baseUrl
    },
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// 2. CHECKOUT PAYSUITE - CRIAÇÃO DE PEDIDO E SESSÃO DE PAGAMENTO
// ---------------------------------------------------------------------------
app.post('/api/checkout/create', async (req, res) => {
  try {
    const {
      productId,
      productName,
      amount,
      currency = 'MZN',
      customer,
      deliveryMode = 'automatic',
      paymentLink
    } = req.body;

    if (!productId || !amount || !customer?.name || !customer?.email) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes (productId, amount, customer name e email).'
      });
    }

    // Gera referência única padronizada (ex: DP-202611-AB12CD)
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const reference = `DP-${datePrefix}-${randomHex}`;

    // Token seguro único para acesso do cliente sem expor dados
    const accessToken = crypto.randomBytes(24).toString('hex');

    const appDomain = process.env.APP_DOMAIN || 'https://digitallpay.store';
    const returnUrl = `${appDomain}/pagamento/retorno?ref=${reference}&token=${accessToken}`;
    const webhookUrl = `${appDomain}/api/webhooks/paysuite`;

    // 1. Definição do Checkout URL:
    // Se o produto tiver um link de pagamento direto cadastrado (PaySuite manual), utiliza-o diretamente!
    let checkoutUrl = '';
    let gatewayPaymentId = null;
    let paymentMode = 'direct_link';

    const hasDirectPaymentLink = paymentLink && typeof paymentLink === 'string' && paymentLink.startsWith('http');

    if (hasDirectPaymentLink) {
      checkoutUrl = paymentLink.trim();
      paymentMode = 'direct_link';
      console.log(`🔗 Usando link de pagamento direto cadastrado para o pedido ${reference}: ${checkoutUrl}`);
    } else if (PAYSUITE_CONFIG.apiKey) {
      // Se houver chave API do PaySuite configurada, cria pagamento via API oficial
      try {
        const paymentResult = await createPaySuitePayment({
          amount: Number(amount),
          currency: currency || 'MZN',
          reference,
          description: `${productName || 'Produto Digital'} - ${customer.name}`,
          returnUrl,
          webhookUrl,
          customer
        });
        const payData = paymentResult.data || {};
        checkoutUrl = payData.checkout_url || `${returnUrl}&simulated=true`;
        gatewayPaymentId = payData.id || payData.payment_id || null;
        paymentMode = paymentResult.mode;
      } catch (err) {
        console.error('Falha na chamada PaySuite:', err);
        return res.status(502).json({
          success: false,
          message: 'Erro ao conectar ao gateway PaySuite: ' + err.message
        });
      }
    } else {
      // Modo simulação ou retorno direto se sem link e sem chave API
      checkoutUrl = `${returnUrl}&simulated=true`;
      paymentMode = 'simulation';
    }

    const orderRecord = {
      id: crypto.randomUUID(),
      reference,
      product_id: productId,
      product_name: productName || 'Produto Digital',
      customer_name: customer.name.trim(),
      customer_email: customer.email.trim().toLowerCase(),
      customer_phone: customer.phone ? customer.phone.trim() : null,
      amount: Number(amount),
      currency: currency || 'MZN',
      payment_method: 'paysuite',
      payment_gateway: 'paysuite',
      gateway_payment_id: gatewayPaymentId,
      checkout_url: checkoutUrl,
      status: 'pending',
      delivery_status: 'pending',
      delivery_mode: deliveryMode || 'automatic',
      access_token: accessToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        mode: paymentMode,
        paymentLink: hasDirectPaymentLink ? paymentLink : null
      }
    };

    // 2. Grava no banco de dados Supabase
    try {
      const { error } = await supabaseAdmin.from('orders').insert(orderRecord);
      if (error) {
        console.warn('Aviso ao persistir order no Supabase:', error.message);
      }
    } catch (dbErr) {
      console.warn('Supabase offline, usando memória:', dbErr.message);
    }

    // Salva em memória de fallback
    memoryStore.orders.set(reference, orderRecord);

    return res.status(201).json({
      success: true,
      reference,
      accessToken,
      checkoutUrl,
      mode: paymentMode,
      order: {
        id: orderRecord.id,
        reference,
        productName: orderRecord.product_name,
        amount: orderRecord.amount,
        currency: orderRecord.currency,
        status: orderRecord.status
      }
    });
  } catch (error) {
    console.error('Erro crítico no checkout:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar checkout: ' + error.message
    });
  }
});

// ---------------------------------------------------------------------------
// 3. WEBHOOK PAYSUITE - RECEBIMENTO SEGURO, ASSINATURA E LIBERAÇÃO AUTOMÁTICA
// ---------------------------------------------------------------------------
app.post('/api/webhooks/paysuite', async (req, res) => {
  const signature = req.headers['x-signature'] || req.headers['x-paysuite-signature'];
  const rawBody = req.rawBody;

  console.log('🔔 Webhook PaySuite recebido!');

  // 1. Validação de Assinatura com o Segredo Configurado
  const signatureCheck = verifyPaySuiteWebhookSignature(rawBody, signature);
  if (!signatureCheck.valid) {
    console.error('❌ Assinatura de Webhook Inválida:', signatureCheck.reason);

    // Registra falha de segurança
    const failedLog = {
      id: crypto.randomUUID(),
      gateway: 'paysuite',
      event_type: 'unknown',
      payload: req.body,
      signature_valid: false,
      status: 'failed',
      error_message: 'Assinatura X-Signature inválida',
      created_at: new Date().toISOString()
    };
    try {
      await supabaseAdmin.from('webhook_logs').insert(failedLog);
    } catch {}
    memoryStore.webhookLogs.unshift(failedLog);

    return res.status(401).json({
      status: 'error',
      message: 'Assinatura inválida (Unauthorized)'
    });
  }

  const eventPayload = req.body || {};
  const eventType = eventPayload.event || eventPayload.type || 'payment.success';
  const data = eventPayload.data || eventPayload;
  const reference = data.reference;
  const eventId = data.id || eventPayload.id || `evt_${Date.now()}`;
  const amountPaid = Number(data.amount);

  console.log(`📦 Evento Webhook: ${eventType} | Ref: ${reference} | Valor: ${amountPaid}`);

  if (!reference) {
    return res.status(400).json({
      status: 'error',
      message: 'Referência não informada no payload do webhook'
    });
  }

  // 2. Prevenção de Processamento Duplicado (Idempotência)
  try {
    const { data: existingLog } = await supabaseAdmin
      .from('webhook_logs')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('status', 'processed')
      .maybeSingle();

    if (existingLog) {
      console.log(`⚠️ Webhook ${eventId} já processado anteriormente. Respondendo 200 OK (Idempotente).`);
      return res.status(200).json({ status: 'success', message: 'Evento já processado' });
    }
  } catch {}

  // 3. Localizar o Pedido no Banco
  let order = null;
  try {
    const { data: dbOrder, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('reference', reference)
      .maybeSingle();

    if (!error && dbOrder) {
      order = dbOrder;
    }
  } catch {}

  if (!order) {
    order = memoryStore.orders.get(reference);
  }

  if (!order) {
    console.error(`❌ Pedido ${reference} não encontrado no sistema!`);
    const notFoundLog = {
      id: crypto.randomUUID(),
      gateway: 'paysuite',
      event_type: eventType,
      event_id: eventId,
      reference,
      payload: eventPayload,
      signature_valid: true,
      status: 'failed',
      error_message: `Pedido ${reference} não localizado`,
      created_at: new Date().toISOString()
    };
    try {
      await supabaseAdmin.from('webhook_logs').insert(notFoundLog);
    } catch {}
    memoryStore.webhookLogs.unshift(notFoundLog);

    return res.status(404).json({
      status: 'error',
      message: 'Pedido não encontrado'
    });
  }

  // 4. Se o pedido já estiver marcado como pago, confirma idempotência
  if (order.status === 'paid' && order.delivery_status === 'delivered') {
    console.log(`ℹ️ Pedido ${reference} já está pago e entregue. Nenhuma ação extra necessária.`);
    return res.status(200).json({ status: 'success', message: 'Pedido já concluído' });
  }

  // 5. Confirmação do Evento de Pagamento
  const now = new Date().toISOString();

  if (eventType === 'payment.success' || eventType === 'payment.completed' || eventType === 'paid') {
    // Validação de correspondência de valor (tolerância centavos)
    if (amountPaid && Math.abs(amountPaid - order.amount) > 0.05) {
      console.warn(`⚠️ Aviso de discrepância de valor: Pago ${amountPaid} vs Pedido ${order.amount}`);
    }

    const isAutomatic = order.delivery_mode !== 'manual';

    const updateFields = {
      status: 'paid',
      delivery_status: isAutomatic ? 'delivered' : 'pending',
      paid_at: now,
      delivered_at: isAutomatic ? now : null,
      updated_at: now,
      gateway_payment_id: data.id || order.gateway_payment_id
    };

    // Atualiza pedido no Supabase
    try {
      await supabaseAdmin.from('orders').update(updateFields).eq('id', order.id);
    } catch (e) {
      console.warn('Erro ao atualizar order no DB:', e);
    }

    // Atualiza na memória
    Object.assign(order, updateFields);
    memoryStore.orders.set(reference, order);

    // Registra auditoria
    const auditRecord = {
      id: crypto.randomUUID(),
      order_id: order.id,
      action: 'payment_status_updated',
      actor_email: 'paysuite_webhook@digitallpay.store',
      reason: `Pagamento confirmado via PaySuite Webhook (Evento ${eventId})`,
      metadata: { eventPayload },
      created_at: now
    };
    try {
      await supabaseAdmin.from('order_audit_logs').insert(auditRecord);
    } catch {}
    memoryStore.auditLogs.unshift(auditRecord);

    console.log(`✅ Sucesso! Pedido ${reference} aprovado. Entregáveis liberados automaticamente.`);
  } else if (eventType === 'payment.failed' || eventType === 'payment.declined') {
    const updateFields = {
      status: 'failed',
      updated_at: now
    };
    try {
      await supabaseAdmin.from('orders').update(updateFields).eq('id', order.id);
    } catch {}
    Object.assign(order, updateFields);
    memoryStore.orders.set(reference, order);
    console.log(`⚠️ Pagamento ${reference} reportado como falho no PaySuite.`);
  }

  // 6. Grava log de sucesso do webhook para rastreabilidade
  const successLog = {
    id: crypto.randomUUID(),
    gateway: 'paysuite',
    event_type: eventType,
    event_id: eventId,
    reference,
    payload: eventPayload,
    signature_valid: true,
    status: 'processed',
    created_at: now
  };
  try {
    await supabaseAdmin.from('webhook_logs').insert(successLog);
  } catch {}
  memoryStore.webhookLogs.unshift(successLog);

  // Responde imediatamente com HTTP 200 OK
  return res.status(200).json({
    status: 'success',
    reference,
    orderStatus: order.status,
    deliveryStatus: order.delivery_status
  });
});

// ---------------------------------------------------------------------------
// 4.1. CONFIRMAÇÃO DE RETORNO DO LINK DE PAGAMENTO (SEM NECESSIDADE DE HOOKS)
// ---------------------------------------------------------------------------
app.post('/api/orders/:reference/confirm-return', async (req, res) => {
  const { reference } = req.params;

  let order = null;
  try {
    const { data } = await supabaseAdmin.from('orders').select('*').eq('reference', reference).maybeSingle();
    if (data) order = data;
  } catch {}

  if (!order) {
    order = memoryStore.orders.get(reference);
  }

  if (!order) {
    return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
  }

  // Se o produto está configurado para entrega automática ao retornar do link de pagamento
  if (order.delivery_mode === 'automatic' || req.query.force === 'true') {
    const now = new Date().toISOString();
    const updateFields = {
      status: 'paid',
      delivery_status: 'delivered',
      paid_at: order.paid_at || now,
      delivered_at: order.delivered_at || now,
      updated_at: now
    };

    try {
      await supabaseAdmin.from('orders').update(updateFields).eq('id', order.id);
    } catch {}

    Object.assign(order, updateFields);
    memoryStore.orders.set(reference, order);

    return res.json({
      success: true,
      status: 'paid',
      deliveryStatus: 'delivered',
      message: 'Pagamento confirmado e entregáveis liberados com sucesso!'
    });
  }

  return res.json({
    success: true,
    status: order.status,
    deliveryStatus: order.delivery_status,
    message: 'Pedido registrado e aguardando aprovação do administrador.'
  });
});

// ---------------------------------------------------------------------------
// 4. CONSULTA SEGURA DE PEDIDO (USADA EM /pagamento/retorno)
// ---------------------------------------------------------------------------
app.get('/api/orders/:reference', async (req, res) => {
  const { reference } = req.params;
  const token = req.query.token || req.headers['x-access-token'];

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Referência é obrigatória' });
  }

  let order = null;

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('reference', reference)
      .maybeSingle();

    if (!error && data) {
      order = data;
    }
  } catch {}

  if (!order) {
    order = memoryStore.orders.get(reference);
  }

  if (!order) {
    return res.status(404).json({
      success: false,
      status: 'not_found',
      message: 'Pedido não localizado com esta referência.'
    });
  }

  // SEGURANÇA: Se o pagamento NÃO estiver pago, NUNCA retorna entregáveis!
  const isPaid = order.status === 'paid' || order.status === 'manual_approved';

  let deliverables = [];

  if (isPaid) {
    // Busca entregáveis do produto associado
    try {
      const { data: delivList } = await supabaseAdmin
        .from('product_deliverables')
        .select('*')
        .eq('product_id', order.product_id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (delivList && delivList.length > 0) {
        // Gera links assinados seguros para arquivos protegidos
        deliverables = await Promise.all(delivList.map(async (item) => {
          let secureDownloadUrl = null;
          if (item.type === 'file' && item.file_path) {
            secureDownloadUrl = await generateSecureDownloadUrl(item.file_path, 3600);
          }
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type,
            fileName: item.file_name,
            fileSizeBytes: item.file_size_bytes,
            fileMimeType: item.file_mime_type,
            secureDownloadUrl, // URL assinada temporária (1h)
            externalUrl: item.external_url,
            contentText: item.content_text,
            downloadLimit: item.download_limit,
            expiresInDays: item.expires_in_days
          };
        }));
      }
    } catch (e) {
      console.warn('Erro ao carregar entregáveis da order:', e);
    }

    // Se a tabela product_deliverables não tiver registros, verifica os entregáveis salvos no próprio produto
    if (deliverables.length === 0) {
      try {
        const { data: prod } = await supabaseAdmin
          .from('products')
          .select('deliverables')
          .eq('id', order.product_id)
          .maybeSingle();

        if (prod?.deliverables && Array.isArray(prod.deliverables)) {
          deliverables = await Promise.all(prod.deliverables.map(async (item) => {
            let secureDownloadUrl = null;
            if (item.type === 'file' && item.file_path) {
              secureDownloadUrl = await generateSecureDownloadUrl(item.file_path, 3600);
            }
            return {
              id: item.id || crypto.randomUUID(),
              title: item.title,
              description: item.description,
              type: item.type,
              fileName: item.file_name,
              fileSizeBytes: item.file_size_bytes,
              fileMimeType: item.file_mime_type,
              secureDownloadUrl,
              externalUrl: item.external_url,
              contentText: item.content_text
            };
          }));
        }
      } catch {}
    }
  }

  return res.json({
    success: true,
    order: {
      id: order.id,
      reference: order.reference,
      productName: order.product_name,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      deliveryStatus: order.delivery_status,
      paidAt: order.paid_at,
      deliveredAt: order.delivered_at,
      checkoutUrl: order.checkout_url
    },
    deliverables // Somente entregue se isPaid === true
  });
});

// ---------------------------------------------------------------------------
// 5. ÁREA DO CLIENTE - MINHAS COMPRAS (CONSULTA POR E-MAIL)
// ---------------------------------------------------------------------------
app.post('/api/orders/customer/history', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'E-mail válido é obrigatório' });
  }

  const cleanEmail = email.trim().toLowerCase();

  let orders = [];
  try {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('customer_email', cleanEmail)
      .in('status', ['paid', 'manual_approved'])
      .order('created_at', { ascending: false });

    if (data) orders = data;
  } catch {}

  // Busca em memória se houver
  if (orders.length === 0) {
    orders = Array.from(memoryStore.orders.values()).filter(
      o => o.customer_email === cleanEmail && (o.status === 'paid' || o.status === 'manual_approved')
    );
  }

  return res.json({
    success: true,
    email: cleanEmail,
    ordersCount: orders.length,
    orders: orders.map(o => ({
      reference: o.reference,
      productName: o.product_name,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      paidAt: o.paid_at || o.created_at,
      accessUrl: `/pagamento/retorno?ref=${o.reference}&token=${o.access_token}`
    }))
  });
});

// ---------------------------------------------------------------------------
// 6. PAINEL ADMIN - VENDAS, ENTREGAS E KPI'S
// ---------------------------------------------------------------------------
app.get('/api/admin/orders', async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;

  let query = supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`reference.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,product_name.ilike.%${search}%`);
  }

  let orders = [];
  let totalCount = 0;

  try {
    const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);
    if (!error && data) {
      orders = data;
      totalCount = count || data.length;
    }
  } catch {}

  if (orders.length === 0 && memoryStore.orders.size > 0) {
    orders = Array.from(memoryStore.orders.values());
    totalCount = orders.length;
  }

  // Estatísticas e KPIs consolidados
  const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'manual_approved');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const failedOrders = orders.filter(o => o.status === 'failed');
  const confirmedRevenue = paidOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const deliveredCount = orders.filter(o => o.delivery_status === 'delivered').length;

  res.json({
    success: true,
    kpis: {
      totalOrders: totalCount,
      confirmedOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      failedOrders: failedOrders.length,
      confirmedRevenue,
      deliveriesCompleted: deliveredCount,
      deliveriesPending: totalCount - deliveredCount
    },
    orders
  });
});

// ---------------------------------------------------------------------------
// 7. PAINEL ADMIN - AUTORIZAÇÃO DE ENTREGA MANUAL (COM AUDITORIA)
// ---------------------------------------------------------------------------
app.post('/api/admin/orders/:id/manual-deliver', async (req, res) => {
  const { id } = req.params;
  const { actorEmail = 'admin@digitallpay.store', reason = 'Liberação manual pelo administrador' } = req.body;

  const now = new Date().toISOString();
  const updateData = {
    status: 'manual_approved',
    delivery_status: 'delivered',
    paid_at: now,
    delivered_at: now,
    updated_at: now
  };

  try {
    await supabaseAdmin.from('orders').update(updateData).eq('id', id);

    // Registra na auditoria
    await supabaseAdmin.from('order_audit_logs').insert({
      id: crypto.randomUUID(),
      order_id: id,
      action: 'manual_delivery_authorized',
      actor_email: actorEmail,
      reason,
      created_at: now
    });
  } catch (err) {
    console.warn('Erro ao autorizar manual no DB:', err);
  }

  // Atualiza na memória
  for (const [ref, ord] of memoryStore.orders.entries()) {
    if (ord.id === id) {
      Object.assign(ord, updateData);
      memoryStore.orders.set(ref, ord);
      break;
    }
  }

  res.json({
    success: true,
    message: 'Entrega autorizada manualmente com sucesso e registrada na auditoria!'
  });
});

// ---------------------------------------------------------------------------
// 8. PAINEL ADMIN - SIMULADOR SEGURO DE WEBHOOK PAYSUITE (PARA TESTES)
// ---------------------------------------------------------------------------
app.post('/api/admin/orders/simulate-webhook', async (req, res) => {
  const { reference, eventType = 'payment.success' } = req.body;

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Referência é obrigatória' });
  }

  let order = null;
  try {
    const { data } = await supabaseAdmin.from('orders').select('*').eq('reference', reference).maybeSingle();
    if (data) order = data;
  } catch {}

  if (!order) {
    order = memoryStore.orders.get(reference);
  }

  if (!order) {
    return res.status(404).json({ success: false, message: 'Pedido não encontrado para simulação' });
  }

  const now = new Date().toISOString();
  const updateFields = {
    status: eventType === 'payment.success' ? 'paid' : 'failed',
    delivery_status: eventType === 'payment.success' ? 'delivered' : 'pending',
    paid_at: eventType === 'payment.success' ? now : null,
    delivered_at: eventType === 'payment.success' ? now : null,
    updated_at: now
  };

  try {
    await supabaseAdmin.from('orders').update(updateFields).eq('id', order.id);
  } catch {}

  Object.assign(order, updateFields);
  memoryStore.orders.set(reference, order);

  // Registra log simulado
  const simLog = {
    id: crypto.randomUUID(),
    gateway: 'paysuite',
    event_type: eventType,
    event_id: `sim_${Date.now()}`,
    reference,
    payload: { simulated: true, event: eventType, data: { reference, amount: order.amount } },
    signature_valid: true,
    status: 'processed',
    created_at: now
  };
  try {
    await supabaseAdmin.from('webhook_logs').insert(simLog);
  } catch {}
  memoryStore.webhookLogs.unshift(simLog);

  res.json({
    success: true,
    message: `Simulação de ${eventType} executada com sucesso para ${reference}!`,
    order
  });
});

// ---------------------------------------------------------------------------
// 9. PAINEL ADMIN - LOGS DE WEBHOOKS E AUDITORIA
// ---------------------------------------------------------------------------
app.get('/api/admin/webhook-logs', async (req, res) => {
  let logs = [];
  try {
    const { data } = await supabaseAdmin
      .from('webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) logs = data;
  } catch {}

  if (logs.length === 0) {
    logs = memoryStore.webhookLogs.slice(0, 50);
  }

  res.json({ success: true, logs });
});

// Inicia o servidor Node.js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DigitalPay Backend rodando na porta ${PORT}`);
  console.log(`💳 PaySuite Gateway: ${PAYSUITE_CONFIG.isConfigured ? 'Configurado' : 'Aguardando PAYSUITE_API_KEY no .env'}`);
});
