import { Product, SupportedLanguage, ProductTranslation, ModuleItem, FaqItem, Testimonial } from '../types';
import { useState, useEffect } from 'react';

export type { SupportedLanguage };

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$' },
  { code: 'en', label: 'English', flag: '🇺🇸', currency: 'USD', currencySymbol: '$' },
  { code: 'es', label: 'Español', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€' },
];

/**
 * Conversor dinâmico de moedas para precificação internacional
 */
export function convertCurrency(amount: number, fromCurrency = 'BRL', toCurrency = 'USD'): number {
  if (!amount || amount <= 0) return 0;
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  if (from === to) return amount;

  // 1. Normalização para BRL
  let amountInBrl = amount;
  if (from === 'USD') amountInBrl = amount * 5.50;
  else if (from === 'EUR') amountInBrl = amount * 6.00;
  else if (from === 'GBP') amountInBrl = amount * 7.00;
  else if (from === 'AOA') amountInBrl = amount * 0.006;
  else if (from === 'MZN') amountInBrl = amount * 0.086;

  // 2. De BRL para a moeda de destino
  let converted = amountInBrl;
  if (to === 'USD') converted = amountInBrl / 5.50;
  else if (to === 'EUR') converted = amountInBrl / 6.00;
  else if (to === 'GBP') converted = amountInBrl / 7.00;
  else if (to === 'BRL') converted = amountInBrl;

  // 3. Arredondamento inteligente de alta conversão (.90 / inteiro)
  if (converted <= 15) return Math.round(converted * 2) / 2 || 9;
  if (converted <= 100) return Math.round(converted);
  return Math.round(converted);
}

/**
 * Dicionário de interface traduzida para os elementos fixos das páginas de vendas
 */
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    security_badge: 'Ambiente Seguro • Checkout Criptografado',
    security_short: 'Seguro',
    countdown_label: 'ATENÇÃO: CONDIÇÃO ESPECIAL COM DESCONTO ENCERRA EM:',
    countdown_luxury: 'Condição exclusiva para novas inscrições expira em:',
    countdown_urgency: '⚠️ ATENÇÃO: ESSA OFERTA COM DESCONTO EXPIRA EM:',
    vsl_exclusive: 'VÍDEO EXCLUSIVO • ASSISTA ATÉ O FINAL',
    vsl_unmute: 'Ligue o seu áudio',
    vsl_delay_waiting: 'Aguarde o vídeo para liberar a condição especial abaixo...',
    features_badge: 'Por que escolher nossa marca',
    features_title: 'Tudo o que você precisa para alcançar o resultado desejado',
    modules_badge: 'Estrutura do Conteúdo',
    modules_title: 'O que você vai encontrar por dentro',
    testimonials_badge: 'Depoimentos Reais',
    testimonials_title: 'Quem já aplicou recomenda os resultados',
    guarantee_title: 'Garantia Incondicional de {days} Dias',
    guarantee_desc: 'Você tem {days} dias para testar todo o conteúdo. Se por qualquer motivo você não ficar 100% satisfeito, basta enviar um e-mail para receber todo o seu investimento de volta, sem burocracias.',
    faq_badge: 'Dúvidas Frequentes',
    faq_title: 'Perguntas e Respostas',
    pricing_save: 'ECONOMIZE {percent}% HOJE',
    pricing_was: 'De {original} por apenas:',
    pricing_subtext: 'Acesso completo e imediato ao conteúdo',
    footer_rights: 'Todos os direitos reservados.',
    footer_platform: 'Plataforma de Pagamentos e Checkout Oficial: Digitall Pay',
    checkout_default_subtext: '🔒 Compra 100% Segura • Acesso Imediato no E-mail',
    installments_prefix: 'ou em até 12x no cartão de crédito',
  },
  en: {
    security_badge: '100% Secure Environment • Encrypted Checkout',
    security_short: 'Secure',
    countdown_label: 'ATTENTION: SPECIAL DISCOUNT OFFER EXPIRES IN:',
    countdown_luxury: 'Exclusive enrollment offer expires in:',
    countdown_urgency: '⚠️ ATTENTION: SPECIAL DISCOUNT CONDITION ENDS IN:',
    vsl_exclusive: 'EXCLUSIVE PRESENTATION • WATCH UNTIL THE END',
    vsl_unmute: 'Unmute your sound',
    vsl_delay_waiting: 'Watch the video to unlock your exclusive offer below...',
    features_badge: 'Why Choose Our Brand',
    features_title: 'Everything you need to reach your breakthrough results',
    modules_badge: 'Curriculum & Program',
    modules_title: "What's included inside the training",
    testimonials_badge: 'Real Testimonials',
    testimonials_title: 'Hear from our verified students and clients',
    guarantee_title: '{days}-Day 100% Money-Back Guarantee',
    guarantee_desc: 'You have {days} full days to test everything risk-free. If for any reason you are not completely satisfied, simply reach out to receive a 100% full refund with zero questions asked.',
    faq_badge: 'Frequently Asked Questions',
    faq_title: 'Got Questions? We Have Answers',
    pricing_save: 'SAVE {percent}% TODAY',
    pricing_was: 'Regular price {original} • Now only:',
    pricing_subtext: 'Instant digital access • Lifetime updates',
    footer_rights: 'All rights reserved.',
    footer_platform: 'Official Checkout & Payment Gateway: Digitall Pay',
    checkout_default_subtext: '🔒 100% Secure Purchase • Instant Access by Email',
    installments_prefix: 'or flexible installments on credit card / single payment',
  },
  es: {
    security_badge: 'Ambiente 100% Seguro • Pago Criptografado',
    security_short: 'Seguro',
    countdown_label: 'ATENCIÓN: CONDICIÓN ESPECIAL CON DESCUENTO FINALIZA EN:',
    countdown_luxury: 'Oferta exclusiva de inscripción finaliza en:',
    countdown_urgency: '⚠️ ATENCIÓN: ESTA OFERTA CON DESCUENTO EXPIRA EN:',
    vsl_exclusive: 'VIDEO EXCLUSIVO • MIRA HASTA EL FINAL',
    vsl_unmute: 'Enciende tu audio',
    vsl_delay_waiting: 'Mira el video para desbloquear la oferta especial abajo...',
    features_badge: 'Por qué elegir nuestra marca',
    features_title: 'Todo lo que necesitas para alcanzar los resultados deseados',
    modules_badge: 'Estructura del Contenido',
    modules_title: 'Lo que encontrarás por dentro',
    testimonials_badge: 'Testimonios Reales',
    testimonials_title: 'Quienes ya lo aplicaron recomiendan los resultados',
    guarantee_title: 'Garantía Incondicional de {days} Días',
    guarantee_desc: 'Tienes {days} días completos para probar todo el contenido. Si por cualquier motivo no estás 100% satisfecho, simplemente envía un mensaje para recibir el reembolso total de tu dinero, sin trámites complicados.',
    faq_badge: 'Preguntas Frecuentes',
    faq_title: 'Preguntas y Respuestas',
    pricing_save: 'AHORRA {percent}% HOY',
    pricing_was: 'Precio regular {original} • Por solo:',
    pricing_subtext: 'Acceso inmediato y completo al contenido',
    footer_rights: 'Todos los derechos reservados.',
    footer_platform: 'Plataforma Oficial de Pagos y Checkout: Digitall Pay',
    checkout_default_subtext: '🔒 Compra 100% Segura • Acceso Inmediato por E-mail',
    installments_prefix: 'o en cómodas cuotas con tarjeta de crédito / pago único',
  },
};

/**
 * Tradutor contextual de termos comuns em infoprodutos (PT -> EN / ES)
 */
function translatePhrase(text: string, targetLang: SupportedLanguage): string {
  if (!text || targetLang === 'pt') return text;

  let result = text;

  if (targetLang === 'en') {
    const map: [RegExp, string][] = [
      [/Quero Começar Agora Mesmo/gi, 'Get Instant Access Now'],
      [/Quero Garantir Minha Vaga Agora/gi, 'Claim My Spot Now'],
      [/Garantir Minha Vaga/gi, 'Secure My Enrollment'],
      [/Baixar o Manual Digital Agora/gi, 'Download The Digital Guide Now'],
      [/Aplicar Para a Mentoria Exclusiva/gi, 'Apply For Exclusive Mentorship'],
      [/Entrar no Clube VIP Agora/gi, 'Join The VIP Club Now'],
      [/Reservar Minha Peça Numerada/gi, 'Claim My Limited Edition Piece'],
      [/Ativar Acesso à Plataforma/gi, 'Activate Platform Access'],
      [/Iniciar Meu Reset/gi, 'Start My Reset Now'],
      [/Acessar o Método/gi, 'Access The Method Now'],
      [/Experimentar o Ritual/gi, 'Experience The Ritual Now'],
      [/Módulo (\d+)/gi, 'Module $1'],
      [/Aulas Práticas/gi, 'Practical Lessons'],
      [/Aulas/gi, 'Lessons'],
      [/Aula/gi, 'Lesson'],
      [/Semana (\d+)/gi, 'Week $1'],
      [/Etapa (\d+)/gi, 'Step $1'],
      [/Fase (\d+)/gi, 'Phase $1'],
      [/Capítulo (\d+)/gi, 'Chapter $1'],
      [/ou 12x de/gi, 'or 12x of'],
      [/ou em até 12x/gi, 'or flexible payments'],
      [/no cartão de crédito/gi, 'on card'],
      [/no cartão/gi, 'on credit card'],
      [/por mês/gi, 'per month'],
      [/Acesso Imediato/gi, 'Instant Access'],
      [/Garantia Incondicional/gi, 'Money-Back Guarantee'],
      [/Compra 100% Segura/gi, '100% Secure Purchase'],
      [/Oferta por Tempo Limitado/gi, 'Limited Time Offer'],
      [/Vagas Limitadas/gi, 'Limited Spots Available'],
      [/Edição Digital Atualizada/gi, 'Updated Digital Edition'],
      [/ao vivo/gi, 'live'],
    ];

    for (const [pattern, replacement] of map) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  if (targetLang === 'es') {
    const map: [RegExp, string][] = [
      [/Quero Começar Agora Mesmo/gi, 'Quiero Empezar Ahora Mismo'],
      [/Quero Garantir Minha Vaga Agora/gi, 'Quiero Reservar Mi Lugar Ahora'],
      [/Garantir Minha Vaga/gi, 'Asegurar Mi Cupo'],
      [/Baixar o Manual Digital Agora/gi, 'Descargar La Guía Digital Ahora'],
      [/Aplicar Para a Mentoria Exclusiva/gi, 'Aplicar a la Mentoría Exclusiva'],
      [/Entrar no Clube VIP Agora/gi, 'Unirme al Club VIP Ahora'],
      [/Reservar Minha Peça Numerada/gi, 'Reservar Mi Pieza Numerada'],
      [/Ativar Acesso à Plataforma/gi, 'Activar Acceso a la Plataforma'],
      [/Iniciar Meu Reset/gi, 'Iniciar Mi Reset Ahora'],
      [/Acessar o Método/gi, 'Acceder al Método Ahora'],
      [/Experimentar o Ritual/gi, 'Probar el Ritual Ahora'],
      [/Módulo (\d+)/gi, 'Módulo $1'],
      [/Aulas Práticas/gi, 'Lecciones Prácticas'],
      [/Aulas/gi, 'Lecciones'],
      [/Aula/gi, 'Lección'],
      [/Semana (\d+)/gi, 'Semana $1'],
      [/Etapa (\d+)/gi, 'Etapa $1'],
      [/Fase (\d+)/gi, 'Fase $1'],
      [/Capítulo (\d+)/gi, 'Capítulo $1'],
      [/ou 12x de/gi, 'o 12x de'],
      [/ou em até 12x/gi, 'o en hasta 12x'],
      [/no cartão de crédito/gi, 'con tarjeta de crédito'],
      [/no cartão/gi, 'con tarjeta'],
      [/por mês/gi, 'al mes'],
      [/Acesso Imediato/gi, 'Acceso Inmediato'],
      [/Garantia Incondicional/gi, 'Garantía Incondicional'],
      [/Compra 100% Segura/gi, 'Compra 100% Segura'],
      [/Oferta por Tempo Limitado/gi, 'Oferta por Tiempo Limitado'],
      [/Vagas Limitadas/gi, 'Cupos Limitados'],
      [/Edição Digital Atualizada/gi, 'Edición Digital Actualizada'],
      [/ao vivo/gi, 'en vivo'],
    ];

    for (const [pattern, replacement] of map) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  return result;
}

/**
 * Tradutor principal de produtos: transforma dinamicamente o produto para o idioma e moeda selecionados
 */
export function translateProduct(product: Product, targetLang: SupportedLanguage): Product {
  if (!product) return product;
  if (targetLang === 'pt') return product;

  const customTrans: ProductTranslation | undefined = product.translations?.[targetLang];

  // 1. Definição da moeda alvo do idioma
  const targetCurrency = customTrans?.currency || (targetLang === 'en' ? 'USD' : 'EUR');

  // 2. Conversão de Preços
  const baseCurrency = product.currency || 'BRL';
  const promoPrice = customTrans?.promo_price !== undefined
    ? customTrans.promo_price
    : convertCurrency(product.promo_price, baseCurrency, targetCurrency);

  const originalPrice = customTrans?.original_price !== undefined
    ? customTrans.original_price
    : convertCurrency(product.original_price, baseCurrency, targetCurrency);

  // 3. Tradução das Parcelas
  let installmentsText = customTrans?.installments_text;
  if (!installmentsText) {
    if (targetLang === 'en') {
      const approxInst = (promoPrice / 12).toFixed(2);
      installmentsText = `or 12x of $ ${approxInst} on card • Single payment available`;
    } else {
      const approxInst = (promoPrice / 12).toFixed(2);
      installmentsText = `o 12x de € ${approxInst} con tarjeta • Pago único disponible`;
    }
  }

  // 4. Tradução dos Módulos
  const translatedModules: ModuleItem[] = (customTrans?.modules || product.modules || []).map((m) => ({
    ...m,
    title: translatePhrase(m.title, targetLang),
    description: translatePhrase(m.description, targetLang),
    lessonsCount: m.lessonsCount ? translatePhrase(m.lessonsCount, targetLang) : undefined,
  }));

  // 5. Tradução dos FAQs
  const translatedFaqs: FaqItem[] = (customTrans?.faqs || product.faqs || []).map((f) => ({
    ...f,
    question: translatePhrase(f.question, targetLang),
    answer: translatePhrase(f.answer, targetLang),
  }));

  // 6. Tradução dos Recursos / Features
  const translatedFeatures: string[] = (customTrans?.features || product.features || []).map((feat) =>
    translatePhrase(feat, targetLang)
  );

  return {
    ...product,
    currency: targetCurrency,
    promo_price: promoPrice,
    original_price: originalPrice,
    installments_text: installmentsText,
    headline: customTrans?.headline || translatePhrase(product.headline, targetLang),
    subheadline: customTrans?.subheadline || translatePhrase(product.subheadline, targetLang),
    badge_text: customTrans?.badge_text || translatePhrase(product.badge_text, targetLang),
    cta_text: customTrans?.cta_text || translatePhrase(product.cta_text, targetLang),
    cta_subtext: customTrans?.cta_subtext || translatePhrase(product.cta_subtext, targetLang),
    cta_url: customTrans?.cta_url || product.cta_url,
    features: translatedFeatures,
    modules: translatedModules,
    faqs: translatedFaqs,
    testimonials: customTrans?.testimonials || product.testimonials,
  };
}

/**
 * Recupera o idioma inicial a partir da URL (?lang=en) ou sessionStorage
 */
export function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'pt';

  // 1. Verifica parâmetro na URL (?lang=en, ?lang=es, ?lang=pt)
  try {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang')?.toLowerCase();
    if (paramLang === 'en' || paramLang === 'es' || paramLang === 'pt') {
      sessionStorage.setItem('digitallpay_sales_lang', paramLang);
      return paramLang;
    }
  } catch {
    // noop
  }

  // 2. Verifica preferência salva na sessão
  try {
    const saved = sessionStorage.getItem('digitallpay_sales_lang') as SupportedLanguage;
    if (saved === 'en' || saved === 'es' || saved === 'pt') {
      return saved;
    }
  } catch {
    // noop
  }

  return 'pt';
}

/**
 * Atualiza o idioma e notifica toda a aplicação
 */
export function setSalesPageLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('digitallpay_sales_lang', lang);
    window.dispatchEvent(new CustomEvent('digitallpay_lang_change', { detail: lang }));
  } catch {
    // noop
  }
}

/**
 * Hook para escutar mudanças no idioma em qualquer componente
 */
export function useSalesPageLanguage(): [SupportedLanguage, (lang: SupportedLanguage) => void] {
  const [lang, setLangState] = useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLanguage>;
      if (customEvent.detail) {
        setLangState(customEvent.detail);
      }
    };

    window.addEventListener('digitallpay_lang_change', handleLangChange);
    return () => window.removeEventListener('digitallpay_lang_change', handleLangChange);
  }, []);

  const changeLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    setSalesPageLanguage(newLang);
  };

  return [lang, changeLang];
}
