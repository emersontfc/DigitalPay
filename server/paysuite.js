import crypto from 'crypto';

/**
 * Módulo de Integração com o Gateway Oficial PaySuite (https://paysuite.tech/docs/)
 */

export const PAYSUITE_CONFIG = {
  get apiKey() {
    return process.env.PAYSUITE_API_KEY || '';
  },
  get webhookSecret() {
    return process.env.PAYSUITE_WEBHOOK_SECRET || '';
  },
  get baseUrl() {
    return process.env.PAYSUITE_BASE_URL || 'https://paysuite.tech/api/v1';
  },
  get isConfigured() {
    return Boolean(this.apiKey);
  }
};

/**
 * Cria uma requisição de pagamento no PaySuite via REST API
 * Endpoint: POST /api/v1/payments
 */
export async function createPaySuitePayment({
  amount,
  currency = 'MZN',
  reference,
  description,
  returnUrl,
  webhookUrl,
  customer
}) {
  const apiKey = PAYSUITE_CONFIG.apiKey;
  const baseUrl = PAYSUITE_CONFIG.baseUrl;

  // Se a chave não estiver configurada no backend, gera um link de simulação seguro
  if (!apiKey) {
    console.warn('⚠️ PAYSUITE_API_KEY não configurada no ambiente. Usando modo de simulação/teste.');
    return {
      success: true,
      mode: 'simulation',
      data: {
        id: `sim_${Date.now()}`,
        amount: Number(amount),
        currency,
        reference,
        status: 'pending',
        checkout_url: `${returnUrl}&simulated=true`
      }
    };
  }

  const payload = {
    amount: Number(amount),
    currency: currency || 'MZN',
    reference,
    description: description || `DigitalPay - ${reference}`,
    return_url: returnUrl,
    webhook_url: webhookUrl,
    customer: customer ? {
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    } : undefined
  };

  try {
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Erro na resposta PaySuite:', response.status, data);
      throw new Error(data.message || `Erro PaySuite HTTP ${response.status}`);
    }

    return {
      success: true,
      mode: 'live',
      data: data.data || data
    };
  } catch (error) {
    console.error('Falha ao chamar API PaySuite:', error);
    throw error;
  }
}

/**
 * Validação rigorosa da assinatura do Webhook PaySuite (X-Signature)
 * Algoritmo oficial: HMAC-SHA256 sobre o rawBody JSON utilizando o webhook secret
 */
export function verifyPaySuiteWebhookSignature(rawBodyBuffer, signatureHeader) {
  const secret = PAYSUITE_CONFIG.webhookSecret;

  // Se o segredo ainda não foi configurado pelo usuário, permite em modo de desenvolvimento
  if (!secret) {
    console.warn('⚠️ PAYSUITE_WEBHOOK_SECRET não configurado. Assinatura não pôde ser conferida com chave privada.');
    return { valid: true, warning: 'PAYSUITE_WEBHOOK_SECRET ausente' };
  }

  if (!signatureHeader || !rawBodyBuffer) {
    return { valid: false, reason: 'Assinatura ou corpo de requisição ausente' };
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBodyBuffer);
    const calculatedSignature = hmac.digest('hex');

    const signatureBuf = Buffer.from(signatureHeader.trim(), 'utf8');
    const calculatedBuf = Buffer.from(calculatedSignature.trim(), 'utf8');

    if (signatureBuf.length !== calculatedBuf.length) {
      return { valid: false, reason: 'Comprimento de assinatura divergente' };
    }

    const isValid = crypto.timingSafeEqual(signatureBuf, calculatedBuf);
    return { valid: isValid, reason: isValid ? null : 'Assinatura inválida' };
  } catch (err) {
    console.error('Erro no cálculo HMAC-SHA256 da assinatura PaySuite:', err);
    return { valid: false, reason: err.message };
  }
}
