import { Product, SupportedLanguage } from '../types';
import { useState, useEffect } from 'react';
import {
  translateProductSync,
  translateProductFull,
  translateSingleText,
  batchTranslate,
  isPortugueseLanguage,
} from './translationEngine';
import { convertCurrency } from './currencyConverter';

export type { SupportedLanguage };
export { translateProductSync, translateProductFull, translateSingleText, batchTranslate, convertCurrency, isPortugueseLanguage };

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt', label: 'Português (Brasil)', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$' },
  { code: 'pt-mz', label: 'Moçambique (Metical)', flag: '🇲🇿', currency: 'MZN', currencySymbol: 'MT' },
  { code: 'pt-ao', label: 'Angola (Kwanza)', flag: '🇦🇴', currency: 'AOA', currencySymbol: 'Kz' },
  { code: 'en', label: 'English (US Dollar)', flag: '🇺🇸', currency: 'USD', currencySymbol: '$' },
  { code: 'es', label: 'Español (Euro)', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€' },
];

const BASE_PT_UI = {
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
  translating_status: 'Traduzindo página...',
  translated_status: 'Página traduzida',
};

/**
 * Dicionário de interface traduzida para os elementos estruturais das páginas de vendas
 */
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    ...BASE_PT_UI,
  },
  'pt-mz': {
    ...BASE_PT_UI,
    checkout_default_subtext: '🔒 Compra 100% Segura • Aceita M-Pesa, E-Mola e Cartão',
    installments_prefix: 'ou à vista via M-Pesa, E-Mola ou Cartão',
  },
  'pt-ao': {
    ...BASE_PT_UI,
    checkout_default_subtext: '🔒 Compra 100% Segura • Aceita Multicaixa Express e Cartão',
    installments_prefix: 'ou à vista via Multicaixa Express ou Cartão',
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
    translating_status: 'Translating page...',
    translated_status: 'Page translated',
  },
  es: {
    security_badge: 'Ambiente 100% Seguro • Pago Criptografado',
    security_short: 'Seguro',
    countdown_label: 'ATENCIÓN: CONDICIÓN ESPECIAL CON DESCONTO FINALIZA EN:',
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
    footer_rights: 'Todos os direitos reservados.',
    footer_platform: 'Plataforma Oficial de Pagos y Checkout: Digitall Pay',
    checkout_default_subtext: '🔒 Compra 100% Segura • Acceso Inmediato por E-mail',
    installments_prefix: 'o en cómodas cuotas con tarjeta de crédito / pago único',
    translating_status: 'Traduciendo página...',
    translated_status: 'Página traducida',
  },
};

/**
 * Tradutor principal de produtos: transforma dinamicamente o produto para o idioma e moeda selecionados.
 * Fornece compatibilidade síncrona com todas as páginas e templates existentes.
 */
export function translateProduct(product: Product, targetLang: SupportedLanguage): Product {
  return translateProductSync(product, targetLang);
}

/**
 * Recupera o idioma inicial a partir da URL (?lang=mz, ?lang=en) ou sessionStorage
 */
export function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'pt';

  // 1. Verifica parâmetro na URL (?lang=mz, ?lang=pt-mz, ?lang=ao, ?lang=en, ?lang=es, ?lang=pt)
  try {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang')?.toLowerCase();
    if (paramLang) {
      if (paramLang === 'mz' || paramLang === 'pt-mz') {
        sessionStorage.setItem('digitallpay_sales_lang', 'pt-mz');
        return 'pt-mz';
      }
      if (paramLang === 'ao' || paramLang === 'pt-ao') {
        sessionStorage.setItem('digitallpay_sales_lang', 'pt-ao');
        return 'pt-ao';
      }
      if (paramLang === 'en' || paramLang === 'es' || paramLang === 'pt') {
        sessionStorage.setItem('digitallpay_sales_lang', paramLang);
        return paramLang;
      }
    }
  } catch {
    // noop
  }

  // 2. Verifica preferência salva na sessão
  try {
    const saved = sessionStorage.getItem('digitallpay_sales_lang') as SupportedLanguage;
    if (saved && (saved === 'pt' || saved === 'pt-mz' || saved === 'pt-ao' || saved === 'en' || saved === 'es')) {
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
    const url = new URL(window.location.href);
    const param = lang === 'pt-mz' ? 'mz' : lang === 'pt-ao' ? 'ao' : lang;
    url.searchParams.set('lang', param);
    window.history.replaceState({}, '', url.toString());
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
