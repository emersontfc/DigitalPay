// Utilitário para injeção e rastreamento oficial do Meta Pixel (Facebook & Instagram)

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Inicializa o Meta Pixel no navegador
 * @param pixelId ID numérico do Pixel (ex: 123456789012345)
 */
export function initFacebookPixel(pixelId?: string) {
  if (!pixelId || typeof window === 'undefined') return;
  const cleanId = pixelId.trim();
  if (!cleanId || cleanId.length < 5) return;

  // Injeta o snippet oficial do Meta Pixel se ainda não existir
  if (!window.fbq) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
    console.log(`[DigitallPay Analytics] Meta Pixel ${cleanId} inicializado com sucesso.`);
  } catch (err) {
    console.warn('[DigitallPay Analytics] Erro ao inicializar Meta Pixel:', err);
  }
}

/**
 * Dispara o evento de início de compra (InitiateCheckout)
 */
export function trackInitiateCheckout(productName?: string, value?: number, currency?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', 'InitiateCheckout', {
        content_name: productName || 'Produto Digital',
        value: Number(value) || 0,
        currency: currency || 'BRL',
      });
      console.log(`[DigitallPay Analytics] Evento InitiateCheckout disparado para: ${productName}`);
    } catch (err) {
      console.warn('[DigitallPay Analytics] Erro ao disparar InitiateCheckout:', err);
    }
  }
}
