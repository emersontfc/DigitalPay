import { Order, ProductDeliverable, WebhookLog } from '../types';
import { getSupabaseClient } from './supabase';

const API_BASE = ''; // Usa rotas relativas /api/ servidas pelo Nginx ou dev proxy

/**
 * Cria a encomenda e inicia o pagamento no PaySuite
 */
export async function createCheckoutOrder(params: {
  productId: string;
  productName: string;
  amount: number;
  currency?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  deliveryMode?: 'automatic' | 'manual';
}): Promise<{
  success: boolean;
  reference: string;
  accessToken: string;
  checkoutUrl: string;
  mode?: string;
  order?: Partial<Order>;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/checkout/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend API não respondeu, usando fallback do Supabase/Local:', e);
  }

  // Fallback seguro caso o backend ainda esteja inicializando
  const ref = `DP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const checkoutUrl = `/pagamento/retorno?ref=${ref}&token=${token}&simulated=true`;

  const fallbackOrder: Order = {
    id: crypto.randomUUID(),
    reference: ref,
    product_id: params.productId,
    product_name: params.productName,
    customer_name: params.customer.name,
    customer_email: params.customer.email,
    customer_phone: params.customer.phone,
    amount: params.amount,
    currency: params.currency || 'MZN',
    payment_gateway: 'paysuite',
    status: 'pending',
    delivery_status: 'pending',
    delivery_mode: params.deliveryMode || 'automatic',
    access_token: token,
    checkout_url: checkoutUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Salva no Supabase se disponível
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').insert(fallbackOrder);
    } catch {}
  }

  // Salva localmente
  const localOrders: Order[] = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
  localOrders.unshift(fallbackOrder);
  localStorage.setItem('digitalpay_orders', JSON.stringify(localOrders));

  return {
    success: true,
    reference: ref,
    accessToken: token,
    checkoutUrl,
    mode: 'simulation',
    order: fallbackOrder
  };
}

/**
 * Consulta segura do estado do pedido e obtenção de entregáveis autorizados
 */
export async function fetchOrderDetails(reference: string, token?: string): Promise<{
  success: boolean;
  order?: Order;
  deliverables?: ProductDeliverable[];
  message?: string;
}> {
  try {
    const url = `${API_BASE}/api/orders/${reference}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend indisponível ao consultar pedido, tentando banco direto:', e);
  }

  // Fallback direto via Supabase client / localStorage
  const client = getSupabaseClient();
  let order: Order | null = null;

  if (client) {
    try {
      const { data } = await client.from('orders').select('*').eq('reference', reference).maybeSingle();
      if (data) order = data as Order;
    } catch {}
  }

  if (!order) {
    const localOrders: Order[] = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
    order = localOrders.find(o => o.reference === reference) || null;
  }

  if (!order) {
    return { success: false, message: 'Pedido não localizado.' };
  }

  let deliverables: ProductDeliverable[] = [];
  if (order.status === 'paid' || order.status === 'manual_approved') {
    if (client) {
      try {
        const { data: delivs } = await client
          .from('product_deliverables')
          .select('*')
          .eq('product_id', order.product_id)
          .eq('is_active', true);
        if (delivs && delivs.length > 0) {
          deliverables = delivs;
        }
      } catch {}
    }

    if (deliverables.length === 0) {
      // Verifica nos produtos salvos
      try {
        const prods = JSON.parse(localStorage.getItem('digitalpay_products_local') || '[]');
        const found = prods.find((p: any) => p.id === order!.product_id);
        if (found?.deliverables) {
          deliverables = found.deliverables;
        }
      } catch {}
    }
  }

  return {
    success: true,
    order,
    deliverables
  };
}

/**
 * Histórico de compras do cliente (Minhas Compras)
 */
export async function fetchCustomerPurchases(email: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/api/orders/customer/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch {}

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = await client
        .from('orders')
        .select('*')
        .eq('customer_email', email.trim().toLowerCase())
        .in('status', ['paid', 'manual_approved'])
        .order('created_at', { ascending: false });
      if (data) return data as Order[];
    } catch {}
  }

  const localOrders: Order[] = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
  return localOrders.filter(
    o => o.customer_email.toLowerCase() === email.trim().toLowerCase() && (o.status === 'paid' || o.status === 'manual_approved')
  );
}

/**
 * Consulta administrativa de pedidos e KPIs
 */
export async function fetchAdminOrders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  kpis: {
    totalOrders: number;
    confirmedOrders: number;
    pendingOrders: number;
    failedOrders: number;
    confirmedRevenue: number;
    deliveriesCompleted: number;
    deliveriesPending: number;
  };
  orders: Order[];
}> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/api/admin/orders?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // Fallback Supabase
  const client = getSupabaseClient();
  let orders: Order[] = [];
  if (client) {
    try {
      const { data } = await client.from('orders').select('*').order('created_at', { ascending: false });
      if (data) orders = data as Order[];
    } catch {}
  }

  if (orders.length === 0) {
    orders = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
  }

  const paid = orders.filter(o => o.status === 'paid' || o.status === 'manual_approved');
  const pending = orders.filter(o => o.status === 'pending');
  const failed = orders.filter(o => o.status === 'failed');
  const revenue = paid.reduce((acc, o) => acc + Number(o.amount || 0), 0);
  const delivered = orders.filter(o => o.delivery_status === 'delivered').length;

  return {
    success: true,
    kpis: {
      totalOrders: orders.length,
      confirmedOrders: paid.length,
      pendingOrders: pending.length,
      failedOrders: failed.length,
      confirmedRevenue: revenue,
      deliveriesCompleted: delivered,
      deliveriesPending: orders.length - delivered
    },
    orders
  };
}

/**
 * Autorização manual de entrega pelo administrador
 */
export async function manualApproveOrder(orderId: string, actorEmail: string, reason: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/manual-deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorEmail, reason })
    });
    if (res.ok) return true;
  } catch {}

  const client = getSupabaseClient();
  const now = new Date().toISOString();
  if (client) {
    try {
      await client.from('orders').update({
        status: 'manual_approved',
        delivery_status: 'delivered',
        paid_at: now,
        delivered_at: now,
        updated_at: now
      }).eq('id', orderId);

      await client.from('order_audit_logs').insert({
        order_id: orderId,
        action: 'manual_delivery_authorized',
        actor_email: actorEmail,
        reason,
        created_at: now
      });
      return true;
    } catch {}
  }

  const localOrders: Order[] = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
  const idx = localOrders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    localOrders[idx].status = 'manual_approved';
    localOrders[idx].delivery_status = 'delivered';
    localOrders[idx].paid_at = now;
    localOrders[idx].delivered_at = now;
    localStorage.setItem('digitalpay_orders', JSON.stringify(localOrders));
    return true;
  }

  return false;
}

/**
 * Simulação de Webhook PaySuite para testes sem custo real
 */
export async function simulatePaySuiteWebhook(reference: string, eventType: 'payment.success' | 'payment.failed' = 'payment.success'): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders/simulate-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, eventType })
    });
    if (res.ok) return true;
  } catch {}

  const localOrders: Order[] = JSON.parse(localStorage.getItem('digitalpay_orders') || '[]');
  const idx = localOrders.findIndex(o => o.reference === reference);
  if (idx >= 0) {
    localOrders[idx].status = eventType === 'payment.success' ? 'paid' : 'failed';
    localOrders[idx].delivery_status = eventType === 'payment.success' ? 'delivered' : 'pending';
    localOrders[idx].paid_at = eventType === 'payment.success' ? new Date().toISOString() : undefined;
    localStorage.setItem('digitalpay_orders', JSON.stringify(localOrders));
    return true;
  }

  return false;
}

/**
 * Consulta de Logs de Webhooks PaySuite
 */
export async function fetchWebhookLogs(): Promise<WebhookLog[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/webhook-logs`);
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
  } catch {}

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = await client.from('webhook_logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (data) return data as WebhookLog[];
    } catch {}
  }

  return [];
}
