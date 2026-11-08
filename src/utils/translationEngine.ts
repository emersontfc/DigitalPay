import { Product, SupportedLanguage, ModuleItem, FaqItem, Testimonial } from '../types';
import { PRECOMPILED_MODEL_TRANSLATIONS } from './i18nCatalog';
import { convertCurrency } from './currencyConverter';

// Cache em memória para acesso síncrono ultra-rápido (0ms)
const memoryCache = new Map<string, string>();

/**
 * Retorna se o idioma é uma variante do português (Brasil, Moçambique ou Angola)
 */
export function isPortugueseLanguage(lang: SupportedLanguage): boolean {
  return lang === 'pt' || lang === 'pt-mz' || lang === 'pt-ao';
}

/**
 * Decodifica entidades HTML retornadas por serviços de tradução (&quot;, &#39;, &amp;, etc)
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Gera um hash leve e rápido para indexação no localStorage
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(36);
}

/**
 * Lê tradução em cache (Memória ou LocalStorage)
 */
function getCached(text: string, targetLang: SupportedLanguage): string | null {
  if (!text || isPortugueseLanguage(targetLang)) return text;
  const key = `${targetLang}_${hashString(text.trim())}`;

  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(`dp_tr_v2_${key}`);
      if (stored) {
        memoryCache.set(key, stored);
        return stored;
      }
    } catch {
      // Ignora erro de acesso ao localStorage (modo anônimo restrito)
    }
  }

  return null;
}

/**
 * Grava tradução em cache (Memória e LocalStorage)
 */
function setCached(text: string, translated: string, targetLang: SupportedLanguage): void {
  if (!text || !translated || isPortugueseLanguage(targetLang)) return;
  const key = `${targetLang}_${hashString(text.trim())}`;
  memoryCache.set(key, translated);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(`dp_tr_v2_${key}`, translated);
    } catch {
      // noop
    }
  }
}

/**
 * Tradutor léxico de contingência (caso o usuário esteja sem conexão)
 */
export function translateLexical(text: string, targetLang: SupportedLanguage): string {
  if (!text || isPortugueseLanguage(targetLang)) return text;

  let res = text;
  if (targetLang === 'en') {
    const rules: [RegExp, string][] = [
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
      [/Acesso Imediato/gi, 'Instant Access'],
      [/Garantia Incondicional de (\d+) Dias/gi, '$1-Day 100% Money-Back Guarantee'],
      [/Garantia Incondicional/gi, '100% Money-Back Guarantee'],
      [/Compra 100% Segura/gi, '100% Secure Purchase'],
      [/Oferta por Tempo Limitado/gi, 'Limited Time Offer'],
      [/Vagas Limitadas/gi, 'Limited Spots Available'],
      [/Edição Digital Atualizada/gi, 'Updated Digital Edition'],
      [/ao vivo/gi, 'live'],
    ];
    for (const [p, r] of rules) res = res.replace(p, r);
    return res;
  }

  if (targetLang === 'es') {
    const rules: [RegExp, string][] = [
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
      [/Acesso Imediato/gi, 'Acceso Inmediato'],
      [/Garantia Incondicional de (\d+) Dias/gi, 'Garantía Incondicional de $1 Días'],
      [/Garantia Incondicional/gi, 'Garantía Incondicional'],
      [/Compra 100% Segura/gi, 'Compra 100% Segura'],
      [/Oferta por Tempo Limitado/gi, 'Oferta por Tiempo Limitado'],
      [/Vagas Limitadas/gi, 'Cupos Limitados'],
      [/Edição Digital Atualizada/gi, 'Edición Digital Actualizada'],
      [/ao vivo/gi, 'en vivo'],
    ];
    for (const [p, r] of rules) res = res.replace(p, r);
    return res;
  }

  return res;
}

/**
 * Traduz um texto único consultando APIs de tradução resilientes com fallback
 */
export async function translateSingleText(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (!text || !text.trim() || isPortugueseLanguage(targetLang)) return text;

  // 1. Verifica cache (0ms)
  const cached = getCached(text, targetLang);
  if (cached) return cached;

  // 2. Provedor Primário: MyMemory Free API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=pt|${targetLang}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const decoded = decodeHtmlEntities(data.responseData.translatedText.trim());
        if (decoded && decoded !== text) {
          setCached(text, decoded, targetLang);
          return decoded;
        }
      }
    }
  } catch {
    // Falha silenciosa, avança para provedor secundário
  }

  // 3. Provedor Secundário: Google Translate GTX (executado direto no navegador)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
    const gRes = await fetch(gUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (gRes.ok) {
      const gData = await gRes.json();
      if (Array.isArray(gData) && Array.isArray(gData[0])) {
        const joined = gData[0].map((s: any) => s[0]).join('').trim();
        if (joined) {
          const decoded = decodeHtmlEntities(joined);
          setCached(text, decoded, targetLang);
          return decoded;
        }
      }
    }
  } catch {
    // Falha silenciosa
  }

  // 4. Contingência final: Tradutor léxico
  const lexical = translateLexical(text, targetLang);
  setCached(text, lexical, targetLang);
  return lexical;
}

/**
 * Traduz um array de textos em lotes concorrentes controlados (4 por vez)
 */
export async function batchTranslate(texts: string[], targetLang: SupportedLanguage): Promise<string[]> {
  if (isPortugueseLanguage(targetLang) || !texts.length) return texts;

  const results: string[] = new Array(texts.length);
  const CHUNK_SIZE = 4;

  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    const slice = texts.slice(i, i + CHUNK_SIZE);
    const slicePromises = slice.map((t) => translateSingleText(t, targetLang));
    const settled = await Promise.allSettled(slicePromises);

    settled.forEach((res, idx) => {
      const originalIndex = i + idx;
      if (res.status === 'fulfilled') {
        results[originalIndex] = res.value;
      } else {
        results[originalIndex] = translateLexical(texts[originalIndex], targetLang);
      }
    });
  }

  return results;
}

/**
 * Tradução síncrona imediata (0ms) para renderização sem bloqueio de tela
 */
export function translateProductSync(product: Product, targetLang: SupportedLanguage): Product {
  if (!product) return product;

  // 1. Definição da Moeda de Destino
  const baseCurrency = (product.currency || 'BRL').toUpperCase();
  let targetCurrency = baseCurrency;
  if (targetLang === 'pt-mz') targetCurrency = 'MZN';
  else if (targetLang === 'pt-ao') targetCurrency = 'AOA';
  else if (targetLang === 'en') targetCurrency = 'USD';
  else if (targetLang === 'es') targetCurrency = 'EUR';
  else if (targetLang === 'pt') targetCurrency = 'BRL';

  // 2. Garante valores numéricos válidos para os preços
  const rawPromo = Number(product.promo_price);
  const rawOriginal = Number(product.original_price);
  const safePromo = !isNaN(rawPromo) && rawPromo > 0 ? rawPromo : 97;
  const safeOriginal = !isNaN(rawOriginal) && rawOriginal > 0 ? rawOriginal : safePromo * 2;

  // 3. Verifica se há tradução personalizada pré-definida
  const precompiled = PRECOMPILED_MODEL_TRANSLATIONS[product.id] ||
    (product.slug ? PRECOMPILED_MODEL_TRANSLATIONS[product.slug] : undefined);

  const customTrans = (precompiled && (precompiled as any)[targetLang]) || (product.translations && (product.translations as any)[targetLang]);
  if (customTrans?.currency) {
    targetCurrency = customTrans.currency;
  }

  // 4. Conversão de Preços
  const promoPrice = customTrans?.promo_price !== undefined
    ? customTrans.promo_price
    : convertCurrency(safePromo, baseCurrency, targetCurrency);

  const originalPrice = customTrans?.original_price !== undefined
    ? customTrans.original_price
    : convertCurrency(safeOriginal, baseCurrency, targetCurrency);

  // 4. Texto de Parcelamento / Pagamento Contextual
  let installmentsText = customTrans?.installments_text;
  if (!installmentsText) {
    if (targetLang === 'pt-mz') {
      installmentsText = 'Pagamento à vista via M-Pesa, E-Mola ou Cartão';
    } else if (targetLang === 'pt-ao') {
      installmentsText = 'Pagamento à vista via Multicaixa Express ou Cartão';
    } else if (targetLang === 'en') {
      const approxInst = (promoPrice / 12).toFixed(2);
      installmentsText = `or 12x of $ ${approxInst} on card • Single payment available`;
    } else if (targetLang === 'es') {
      const approxInst = (promoPrice / 12).toFixed(2);
      installmentsText = `o 12x de € ${approxInst} con tarjeta • Pago único disponible`;
    } else {
      installmentsText = product.installments_text || 'ou em até 12x no cartão de crédito';
    }
  }

  // 5. Se for português (Brasil, Moçambique ou Angola), preserva 100% dos textos originais
  if (isPortugueseLanguage(targetLang)) {
    return {
      ...product,
      currency: targetCurrency,
      promo_price: promoPrice,
      original_price: originalPrice,
      installments_text: installmentsText,
    };
  }

  // 6. Para EN e ES, aplica os textos traduzidos do cache
  const modules: ModuleItem[] = (customTrans?.modules || product.modules || []).map((m: ModuleItem) => ({
    ...m,
    title: getCached(m.title, targetLang) || translateLexical(m.title, targetLang),
    description: getCached(m.description, targetLang) || translateLexical(m.description, targetLang),
    lessonsCount: m.lessonsCount
      ? getCached(m.lessonsCount, targetLang) || translateLexical(m.lessonsCount, targetLang)
      : undefined,
  }));

  const faqs: FaqItem[] = (customTrans?.faqs || product.faqs || []).map((f: FaqItem) => ({
    ...f,
    question: getCached(f.question, targetLang) || translateLexical(f.question, targetLang),
    answer: getCached(f.answer, targetLang) || translateLexical(f.answer, targetLang),
  }));

  const testimonials: Testimonial[] = (customTrans?.testimonials || product.testimonials || []).map((t: Testimonial) => ({
    ...t,
    content: getCached(t.content, targetLang) || translateLexical(t.content, targetLang),
    role: getCached(t.role, targetLang) || translateLexical(t.role, targetLang),
  }));

  const features: string[] = (customTrans?.features || product.features || []).map(
    (feat: string) => getCached(feat, targetLang) || translateLexical(feat, targetLang)
  );

  return {
    ...product,
    currency: targetCurrency,
    promo_price: promoPrice,
    original_price: originalPrice,
    installments_text: installmentsText,
    headline: customTrans?.headline || getCached(product.headline, targetLang) || translateLexical(product.headline, targetLang),
    subheadline: customTrans?.subheadline || getCached(product.subheadline, targetLang) || translateLexical(product.subheadline, targetLang),
    badge_text: customTrans?.badge_text || getCached(product.badge_text, targetLang) || translateLexical(product.badge_text, targetLang),
    cta_text: customTrans?.cta_text || getCached(product.cta_text, targetLang) || translateLexical(product.cta_text, targetLang),
    cta_subtext: customTrans?.cta_subtext || getCached(product.cta_subtext, targetLang) || translateLexical(product.cta_subtext, targetLang),
    features,
    modules,
    faqs,
    testimonials,
  };
}

/**
 * Tradutor Assíncrono Completo: traduz todo o texto da página de vendas (100% do conteúdo)
 */
export async function translateProductFull(product: Product, targetLang: SupportedLanguage): Promise<Product> {
  if (!product) return product;

  // 1. Se for variante do Português (Brasil, Moçambique ou Angola), retorna imediatamente com a moeda adaptada
  if (isPortugueseLanguage(targetLang)) {
    return translateProductSync(product, targetLang);
  }

  // 2. Se já houver tradução estática completa pré-compilada, retorna imediatamente
  const precompiled = PRECOMPILED_MODEL_TRANSLATIONS[product.id] ||
    (product.slug ? PRECOMPILED_MODEL_TRANSLATIONS[product.slug] : undefined);

  if (precompiled && (precompiled as any)[targetLang]) {
    return translateProductSync(product, targetLang);
  }

  // 3. Se o usuário salvou uma tradução completa manual no banco, usa ela
  if (product.translations && (product.translations as any)[targetLang]) {
    return translateProductSync(product, targetLang);
  }

  // 4. Coleta todos os textos da página para tradução dinâmica em lote
  const textQueue: string[] = [];
  const mapIndex: Record<string, number> = {};

  const queueText = (t?: string): number => {
    if (!t || !t.trim()) return -1;
    if (mapIndex[t] !== undefined) return mapIndex[t];
    const idx = textQueue.length;
    textQueue.push(t);
    mapIndex[t] = idx;
    return idx;
  };

  const nameIdx = queueText(product.name);
  const headlineIdx = queueText(product.headline);
  const subheadlineIdx = queueText(product.subheadline);
  const badgeIdx = queueText(product.badge_text);
  const ctaTextIdx = queueText(product.cta_text);
  const ctaSubtextIdx = queueText(product.cta_subtext);

  const featureIndices = (product.features || []).map((f) => queueText(f));

  const moduleIndices = (product.modules || []).map((m) => ({
    id: m.id,
    titleIdx: queueText(m.title),
    descIdx: queueText(m.description),
    lessonsIdx: m.lessonsCount ? queueText(m.lessonsCount) : -1,
  }));

  const testimonialIndices = (product.testimonials || []).map((t) => ({
    id: t.id,
    name: t.name,
    avatarUrl: t.avatarUrl,
    rating: t.rating,
    roleIdx: queueText(t.role),
    contentIdx: queueText(t.content),
  }));

  const faqIndices = (product.faqs || []).map((f) => ({
    id: f.id,
    questionIdx: queueText(f.question),
    answerIdx: queueText(f.answer),
  }));

  // 5. Executa a tradução em lote
  const translatedTexts = await batchTranslate(textQueue, targetLang);

  const getTranslated = (idx: number, fallback: string): string => {
    if (idx === -1) return fallback;
    return translatedTexts[idx] || fallback;
  };

  // 6. Moeda e Preços
  const baseCurrency = (product.currency || 'BRL').toUpperCase();
  let targetCurrency = 'USD';
  if (targetLang === 'es') targetCurrency = 'EUR';
  else if (targetLang === 'pt-mz') targetCurrency = 'MZN';
  else if (targetLang === 'pt-ao') targetCurrency = 'AOA';
  else if (targetLang === 'pt') targetCurrency = 'BRL';

  const rawPromo = Number(product.promo_price);
  const rawOriginal = Number(product.original_price);
  const safePromo = !isNaN(rawPromo) && rawPromo > 0 ? rawPromo : 97;
  const safeOriginal = !isNaN(rawOriginal) && rawOriginal > 0 ? rawOriginal : safePromo * 2;

  const promoPrice = convertCurrency(safePromo, baseCurrency, targetCurrency);
  const originalPrice = convertCurrency(safeOriginal, baseCurrency, targetCurrency);

  let installmentsText = '';
  if (targetLang === 'en') {
    const approxInst = (promoPrice / 12).toFixed(2);
    installmentsText = `or 12x of $ ${approxInst} on card • Single payment available`;
  } else {
    const approxInst = (promoPrice / 12).toFixed(2);
    installmentsText = `o 12x de € ${approxInst} con tarjeta • Pago único disponible`;
  }

  // 7. Montagem dos blocos
  const translatedFeatures = featureIndices.map((idx, i) =>
    getTranslated(idx, product.features[i])
  );

  const translatedModules: ModuleItem[] = moduleIndices.map((m, i) => {
    const orig = product.modules[i];
    return {
      id: m.id,
      title: getTranslated(m.titleIdx, orig?.title || ''),
      description: getTranslated(m.descIdx, orig?.description || ''),
      lessonsCount: orig?.lessonsCount ? getTranslated(m.lessonsIdx, orig.lessonsCount) : undefined,
    };
  });

  const translatedTestimonials: Testimonial[] = testimonialIndices.map((t, i) => {
    const orig = product.testimonials[i];
    return {
      id: t.id,
      name: t.name,
      avatarUrl: t.avatarUrl,
      rating: t.rating,
      role: getTranslated(t.roleIdx, orig?.role || ''),
      content: getTranslated(t.contentIdx, orig?.content || ''),
    };
  });

  const translatedFaqs: FaqItem[] = faqIndices.map((f, i) => {
    const orig = product.faqs[i];
    return {
      id: f.id,
      question: getTranslated(f.questionIdx, orig?.question || ''),
      answer: getTranslated(f.answerIdx, orig?.answer || ''),
    };
  });

  return {
    ...product,
    name: getTranslated(nameIdx, product.name),
    headline: getTranslated(headlineIdx, product.headline),
    subheadline: getTranslated(subheadlineIdx, product.subheadline),
    badge_text: getTranslated(badgeIdx, product.badge_text),
    cta_text: getTranslated(ctaTextIdx, product.cta_text),
    cta_subtext: getTranslated(ctaSubtextIdx, product.cta_subtext),
    currency: targetCurrency,
    promo_price: promoPrice,
    original_price: originalPrice,
    installments_text: installmentsText,
    features: translatedFeatures,
    modules: translatedModules,
    testimonials: translatedTestimonials,
    faqs: translatedFaqs,
  };
}
