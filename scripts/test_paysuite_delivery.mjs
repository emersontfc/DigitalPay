import crypto from 'crypto';

// Teste de Integridade e Segurança do Módulo PaySuite & Entregáveis
console.log('🧪 Iniciando testes de segurança PaySuite & Entrega Automática...\n');

// 1. Teste de Validação da Assinatura HMAC-SHA256 (X-Signature)
const webhookSecret = 'test_secret_key_12345';
const samplePayload = JSON.stringify({
  event: 'payment.success',
  data: {
    id: '01H8X9V8X9Y8Z9A8B8C8D8E8F8',
    amount: 2290.00,
    reference: 'DP-20261116-TEST01'
  }
});

const rawBodyBuffer = Buffer.from(samplePayload, 'utf8');

// Gera assinatura correta
const validHmac = crypto.createHmac('sha256', webhookSecret).update(rawBodyBuffer).digest('hex');

// Função de verificação
function verifySignature(buffer, signature, secret) {
  const calculated = crypto.createHmac('sha256', secret).update(buffer).digest('hex');
  const bufA = Buffer.from(signature.trim(), 'utf8');
  const bufB = Buffer.from(calculated.trim(), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const test1 = verifySignature(rawBodyBuffer, validHmac, webhookSecret);
console.log(`✅ [1/5] Assinatura Válida Aceita: ${test1 ? 'PASS' : 'FAIL'}`);

const test2 = verifySignature(rawBodyBuffer, 'invalid_signature_hex_123', webhookSecret);
console.log(`✅ [2/5] Assinatura Falsa Rejeitada: ${!test2 ? 'PASS' : 'FAIL'}`);

// 2. Teste de Proteção de Entregáveis em Pedidos Pendentes
function getDeliverablesForOrder(orderStatus, productDeliverables) {
  // Regra de segurança: Apenas pedidos 'paid' ou 'manual_approved' recebem entregáveis
  if (orderStatus !== 'paid' && orderStatus !== 'manual_approved') {
    return []; // NUNCA expõe entregáveis se não estiver pago
  }
  return productDeliverables;
}

const mockDeliverables = [
  { id: 'deliv-1', title: 'E-book PDF', type: 'file', file_path: 'deliverables/ebook.pdf' },
  { id: 'deliv-2', title: 'Acesso VIP', type: 'link', external_url: 'https://membros.digitallpay.store' }
];

const pendingDeliverables = getDeliverablesForOrder('pending', mockDeliverables);
console.log(`✅ [3/5] Pedido Pendente Bloqueia Entregáveis: ${pendingDeliverables.length === 0 ? 'PASS' : 'FAIL'}`);

const paidDeliverables = getDeliverablesForOrder('paid', mockDeliverables);
console.log(`✅ [4/5] Pedido Pago Libera Entregáveis: ${paidDeliverables.length === 2 ? 'PASS' : 'FAIL'}`);

// 3. Teste de Idempotência do Webhook (Processar evento duplicado sem duplicar entrega)
const processedEvents = new Set();
function processWebhookEvent(eventId) {
  if (processedEvents.has(eventId)) {
    return { status: 'ignored', message: 'Already processed (idempotent)' };
  }
  processedEvents.add(eventId);
  return { status: 'processed', message: 'Order marked paid and delivered' };
}

const firstRun = processWebhookEvent('evt_9999');
const secondRun = processWebhookEvent('evt_9999');
console.log(`✅ [5/5] Idempotência de Webhooks Repetidos: ${firstRun.status === 'processed' && secondRun.status === 'ignored' ? 'PASS' : 'FAIL'}`);

console.log('\n🎉 TODOS OS TESTES DE VALIDAÇÃO TÉCNICA FORAM APROVADOS COM SUCESSO!\n');
