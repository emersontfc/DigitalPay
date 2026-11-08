import React, { useState } from 'react';
import { Product, TemplateType, ModuleItem, Testimonial, FaqItem, PageModel } from '../../types';
import { TemplateSelector } from './TemplateSelector';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ModelManagerModal } from './ModelManagerModal';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { VideoPlayer, resolveVideoSource } from '../common/VideoPlayer';
import { useSalesPageLanguage, translateProduct } from '../../utils/i18n';
import {
  X,
  Save,
  Eye,
  Plus,
  Trash2,
  DollarSign,
  Link,
  Sparkles,
  Layers,
  HelpCircle,
  Video,
  Coins,
  Check,
  Bookmark,
  AlertCircle,
  Loader2,
  Upload,
  Play,
  Film,
  Clock,
  Volume2,
  BarChart3,
  MessageCircle,
  Globe
} from 'lucide-react';

interface ProductEditorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'copy' | 'preco' | 'conteudo' | 'faq' | 'preview'>('geral');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [status, setStatus] = useState<'active' | 'draft'>(product?.status || 'active');
  const [template, setTemplate] = useState<TemplateType>(product?.template || 'kiwify-neon');

  const [headline, setHeadline] = useState(product?.headline || '');
  const [subheadline, setSubheadline] = useState(product?.subheadline || '');
  const [heroType, setHeroType] = useState<'video' | 'image' | 'vsl'>(product?.hero_type || 'video');
  const [heroMediaUrl, setHeroMediaUrl] = useState(product?.hero_media_url || '');
  const [badgeText, setBadgeText] = useState(product?.badge_text || 'OFERTA EXCLUSIVA');
  const [vslPitchDelay, setVslPitchDelay] = useState<number>(product?.vsl_pitch_delay_seconds || 0);
  const [vslAutoplay, setVslAutoplay] = useState<boolean>(product?.vsl_autoplay !== undefined ? product.vsl_autoplay : false);

  const [currency, setCurrency] = useState<string>(product?.currency || 'BRL');
  const [originalPrice, setOriginalPrice] = useState<number>(product?.original_price || 297);
  const [promoPrice, setPromoPrice] = useState<number>(product?.promo_price || 97);
  const [installmentsText, setInstallmentsText] = useState(product?.installments_text || 'ou 12x no cartão');
  const [ctaText, setCtaText] = useState(product?.cta_text || 'QUERO GARANTIR MINHA VAGA AGORA');
  const [ctaUrl, setCtaUrl] = useState(product?.cta_url || 'https://pay.kiwify.com.br');
  const [ctaSubtext, setCtaSubtext] = useState(product?.cta_subtext || '🔒 Compra 100% Segura • Acesso Imediato');
  const [facebookPixelId, setFacebookPixelId] = useState(product?.facebook_pixel_id || '');
  const [whatsappNumber, setWhatsappNumber] = useState(product?.whatsapp_number || '');
  const [whatsappMessage, setWhatsappMessage] = useState(product?.whatsapp_message || '');
  const [multilangEnabled, setMultilangEnabled] = useState<boolean>(product?.multilang_enabled !== false);
  const [previewLang] = useSalesPageLanguage();

  const [guaranteeDays, setGuaranteeDays] = useState<number>(product?.guarantee_days || 7);
  const [countdownEnabled, setCountdownEnabled] = useState<boolean>(product?.countdown_enabled !== undefined ? product.countdown_enabled : true);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(product?.countdown_minutes || 15);

  const [features, setFeatures] = useState<string[]>(
    product?.features?.length ? [...product.features] : ['Acesso Imediato ao Treinamento', 'Materiais Complementares em PDF', 'Comunidade de Alunos']
  );

  const [modules, setModules] = useState<ModuleItem[]>(
    product?.modules?.length
      ? [...product.modules]
      : [
          {
            id: 'm-1',
            title: 'Módulo 1: Fundamentos Práticos',
            description: 'Conceitos essenciais para começar com o pé direito.',
            lessonsCount: '5 Aulas',
          },
        ]
  );

  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    product?.testimonials?.length
      ? [...product.testimonials]
      : [
          {
            id: 't-1',
            name: 'Lucas Silva',
            role: 'Empreendedor Digital',
            content: 'Excelente material, mudou a forma como eu estruturo meus produtos digitais.',
            rating: 5,
          },
        ]
  );

  const [faqs, setFaqs] = useState<FaqItem[]>(
    product?.faqs?.length
      ? [...product.faqs]
      : [
          {
            id: 'f-1',
            question: 'Como recebo o acesso?',
            answer: 'O envio é imediato via e-mail logo após a confirmação da compra.',
          },
        ]
  );

  if (!isOpen) return null;

  // Handlers
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        id: crypto.randomUUID(),
        title: `Novo Módulo ${modules.length + 1}`,
        description: 'Descrição do que será abordado neste módulo.',
        lessonsCount: '4 Aulas',
      },
    ]);
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        id: crypto.randomUUID(),
        question: 'Qual é a forma de pagamento?',
        answer: 'Cartão de crédito em até 12x, PIX à vista ou boleto bancário.',
      },
    ]);
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: crypto.randomUUID(),
        name: 'Novo Aluno',
        role: 'Cliente Satisfeito',
        content: 'Recomendo demais! Conteúdo direto ao ponto e entrega muito mais do que promete.',
        rating: 5,
      },
    ]);
  };

  const handleRemoveTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  // Preview object
  const currentPreviewProduct: Product = {
    id: product?.id || 'preview-id',
    name: name || 'Nome do Produto',
    slug: slug || 'produto',
    status,
    template,
    currency,
    headline: headline || 'Headline Principal de Alta Conversão',
    subheadline,
    hero_type: heroType,
    hero_media_url: heroMediaUrl,
    badge_text: badgeText,
    vsl_pitch_delay_seconds: Number(vslPitchDelay) || 0,
    vsl_autoplay: Boolean(vslAutoplay),
    original_price: Number(originalPrice),
    promo_price: Number(promoPrice),
    installments_text: installmentsText,
    cta_text: ctaText || 'QUERO GARANTIR MINHA VAGA',
    cta_url: ctaUrl || '#',
    cta_subtext: ctaSubtext,
    facebook_pixel_id: facebookPixelId,
    whatsapp_number: whatsappNumber,
    whatsapp_message: whatsappMessage,
    multilang_enabled: multilangEnabled,
    guarantee_days: Number(guaranteeDays),
    countdown_enabled: countdownEnabled,
    countdown_minutes: Number(countdownMinutes),
    features: features.filter(Boolean),
    modules,
    testimonials,
    faqs,
    created_at: product?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleApplyModel = (model: PageModel) => {
    const d = model.productData;
    if (d.template) setTemplate(d.template);
    if (d.headline) setHeadline(d.headline);
    if (d.subheadline !== undefined) setSubheadline(d.subheadline);
    if (d.badge_text) setBadgeText(d.badge_text);
    if (d.hero_type) setHeroType(d.hero_type);
    if (d.hero_media_url) setHeroMediaUrl(d.hero_media_url);
    if (d.vsl_pitch_delay_seconds !== undefined) setVslPitchDelay(d.vsl_pitch_delay_seconds);
    if (d.vsl_autoplay !== undefined) setVslAutoplay(d.vsl_autoplay);
    if (d.currency) setCurrency(d.currency);
    if (d.original_price !== undefined) setOriginalPrice(d.original_price);
    if (d.promo_price !== undefined) setPromoPrice(d.promo_price);
    if (d.installments_text) setInstallmentsText(d.installments_text);
    if (d.cta_text) setCtaText(d.cta_text);
    if (d.cta_url) setCtaUrl(d.cta_url);
    if (d.cta_subtext) setCtaSubtext(d.cta_subtext);
    if (d.facebook_pixel_id !== undefined) setFacebookPixelId(d.facebook_pixel_id);
    if (d.whatsapp_number !== undefined) setWhatsappNumber(d.whatsapp_number);
    if (d.whatsapp_message !== undefined) setWhatsappMessage(d.whatsapp_message);
    if (d.guarantee_days !== undefined) setGuaranteeDays(d.guarantee_days);
    if (d.countdown_enabled !== undefined) setCountdownEnabled(d.countdown_enabled);
    if (d.countdown_minutes !== undefined) setCountdownMinutes(d.countdown_minutes);
    if (d.features) setFeatures([...d.features]);
    if (d.modules) setModules([...d.modules]);
    if (d.testimonials) setTestimonials([...d.testimonials]);
    if (d.faqs) setFaqs([...d.faqs]);
  };

  const handleManualSave = async () => {
    setErrorMessage(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setActiveTab('geral');
      setErrorMessage('Por favor, informe o Nome do Produto na aba "1. Geral & Template" antes de gravar.');
      return;
    }

    setLoading(true);
    try {
      const generatedSlug = (slug || cleanName)
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      await onSave({
        id: product?.id,
        name: cleanName,
        slug: generatedSlug,
        status,
        template,
        currency,
        headline: headline.trim() || cleanName,
        subheadline: subheadline.trim(),
        hero_type: heroType,
        hero_media_url: heroMediaUrl.trim(),
        badge_text: badgeText.trim(),
        vsl_pitch_delay_seconds: Number(vslPitchDelay) || 0,
        vsl_autoplay: Boolean(vslAutoplay),
        original_price: Number(originalPrice) || 0,
        promo_price: Number(promoPrice) || 0,
        installments_text: installmentsText.trim(),
        cta_text: ctaText.trim() || 'QUERO GARANTIR MINHA VAGA AGORA',
        cta_url: ctaUrl.trim() || 'https://pay.kiwify.com.br',
        cta_subtext: ctaSubtext.trim(),
        facebook_pixel_id: facebookPixelId.trim() || undefined,
        whatsapp_number: whatsappNumber.trim() || undefined,
        whatsapp_message: whatsappMessage.trim() || undefined,
        multilang_enabled: multilangEnabled,
        guarantee_days: Number(guaranteeDays) || 7,
        countdown_enabled: countdownEnabled,
        countdown_minutes: Number(countdownMinutes) || 15,
        features: features.filter((f) => f.trim().length > 0),
        modules,
        testimonials,
        faqs,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao gravar produto:', err);
      setErrorMessage(err?.message || 'Falha ao gravar página no banco de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleManualSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border-0 sm:border border-slate-700 w-full max-w-5xl sm:rounded-2xl rounded-none shadow-2xl flex flex-col h-full sm:h-[94vh] overflow-hidden relative">
        {/* Header Modal */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-lg truncate">
                {product ? `Editar: ${product.name}` : 'Criar Nova Página'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                Configure template, mídias, preços e botões persuasivos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botão Biblioteca de Modelos */}
            <button
              type="button"
              onClick={() => setIsModelModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Carregar modelos prontos de alta conversão"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Modelos</span>
            </button>

            {/* Pré-visualizar Página */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'preview' ? 'geral' : 'preview')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeTab === 'preview' ? 'Voltar' : 'Prévia'}</span>
            </button>

            {/* Botão Gravar Rápido no Topo */}
            <button
              type="button"
              onClick={handleManualSave}
              disabled={loading}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                saveSuccess
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              }`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{loading ? 'Salvando...' : saveSuccess ? 'Gravado!' : 'Gravar'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback de Erro ou Sucesso */}
        {errorMessage && (
          <div className="mx-3.5 sm:mx-6 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button type="button" onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {saveSuccess && (
          <div className="mx-3.5 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Página gravada com sucesso! Atualizando catálogo...</span>
          </div>
        )}

        {/* Tab Navigation (quando não estiver no preview) */}
        {activeTab !== 'preview' && (
          <div className="px-3 sm:px-6 border-b border-slate-800 bg-slate-950/70 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 py-2 no-scrollbar scroll-smooth">
            {[
              { id: 'geral', label: '1. Geral', fullLabel: '1. Geral & Template', icon: Layers },
              { id: 'copy', label: '2. Mídia & VSL', fullLabel: '2. Copy & Mídia', icon: Video },
              { id: 'preco', label: '3. Preço & Pixels', fullLabel: '3. Preço & Checkout', icon: DollarSign },
              { id: 'conteudo', label: '4. Conteúdo', fullLabel: '4. Benefícios & Módulos', icon: Sparkles },
              { id: 'faq', label: '5. Garantia & FAQ', fullLabel: '5. Garantia & FAQ', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 overscroll-contain">
          {activeTab === 'preview' ? (
            /* Modo Pré-visualização ao vivo */
            <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-black">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Pré-visualização Ao Vivo • Template: {template}
                </span>
                <span>URL pública: /p/{slug || 'produto'}</span>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <TemplateRenderer product={translateProduct(currentPreviewProduct, previewLang)} />
              </div>
            </div>
          ) : (
            <form id="product-form" noValidate onSubmit={handleSubmit} className="space-y-6">
              {/* TAB 1: GERAL & TEMPLATE */}
              {activeTab === 'geral' && (
                <div className="space-y-6">
                  {/* Banner de Modelos Rápidos */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Bookmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          Biblioteca de Modelos & Presets de Venda
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold uppercase">
                            Modelos Prontos
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Carregue modelos prontos (VSL, E-book/PLR, Mentoria High Ticket) ou aplique seus modelos salvos com 1 clique.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsModelModalOpen(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer border border-purple-500/30"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Ver Modelos Prontos</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Método Tráfego Automático 10K"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!product) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Status da Página
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                      >
                        <option value="active">🟢 Ativo (Pública)</option>
                        <option value="draft">🟡 Rascunho (Oculta)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Slug da URL da Página de Vendas (/p/:slug) *
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm">
                      <span className="text-slate-500 font-mono text-xs sm:text-sm shrink-0 hidden sm:inline">digitallpay.store/p/</span>
                      <span className="text-slate-500 font-mono text-xs sm:text-sm shrink-0 sm:hidden">/p/</span>
                      <input
                        type="text"
                        required
                        placeholder="nome-do-produto"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full bg-transparent text-emerald-400 font-mono font-semibold focus:outline-none pl-1 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Escolha o Template Visual Desta Página
                      </label>
                      <span className="text-xs text-emerald-400 font-medium">
                        Cada produto pode ter seu próprio estilo!
                      </span>
                    </div>
                    <TemplateSelector selected={template} onChange={setTemplate} />
                  </div>
                </div>
              )}

              {/* TAB 2: COPY & MÍDIA */}
              {activeTab === 'copy' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Badge de Urgência no Topo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 🔥 OFERTA EXCLUSIVA - TURMA LIMITADA 2026"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Headline Principal (A promessa mais forte) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Ex: Descubra o Sistema Invisível Para Vender Todos os Dias No Piloto Automático"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Subheadline (Complemento persuasivo)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Copie e cole o funil validado que já gerou múltiplos 6 dígitos no mercado digital..."
                      value={subheadline}
                      onChange={(e) => setSubheadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* SELEÇÃO DO FORMATO DE MÍDIA */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Formato de Mídia em Destaque
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setHeroType('vsl')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            heroType === 'vsl'
                              ? 'bg-red-500/10 border-red-500/50 text-white shadow-lg shadow-red-500/10 ring-1 ring-red-500/50'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              VSL de Vendas
                            </span>
                            <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">Alta Conversão</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug">
                            Vídeo Sales Letter com Panda Video, VTurb, YouTube, MP4 e delay de pitch
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHeroType('video')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            heroType === 'video'
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5" />
                              Vídeo Padrão
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug">
                            Vídeo institucional ou demonstrativo via YouTube ou Vimeo convencional
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHeroType('image')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                            heroType === 'image'
                              ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-blue-400 flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              Upload de Imagem
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug">
                            Upload do seu computador / celular ou link de mockup da web
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* SE FOR IMAGEM */}
                    {heroType === 'image' && (
                      <div className="pt-2">
                        <ImageUploadInput
                          value={heroMediaUrl}
                          onChange={setHeroMediaUrl}
                          label="Imagem ou Banner Principal da Página"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    )}

                    {/* SE FOR VSL OU VÍDEO */}
                    {(heroType === 'vsl' || heroType === 'video') && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                              {heroType === 'vsl' ? 'Código Embed ou Link da VSL (VTurb / Panda / YouTube)' : 'Link ou Código do Vídeo'}
                            </label>
                            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">VTurb 100%</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Panda Video</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">YouTube</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Vimeo / MP4</span>
                            </div>
                          </div>
                          <textarea
                            rows={3}
                            placeholder={
                              heroType === 'vsl'
                                ? 'Cole aqui o código do VTurb (script ou iframe completo), link do Panda Video, YouTube, Vimeo ou arquivo MP4...'
                                : 'https://www.youtube.com/watch?v=...'
                            }
                            value={heroMediaUrl}
                            onChange={(e) => setHeroMediaUrl(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:border-emerald-500 focus:outline-none"
                          />

                          {/* Indicador de reconhecimento inteligente de Player */}
                          {heroMediaUrl.trim() && (
                            <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-bold text-white">
                                  {resolveVideoSource(heroMediaUrl, vslAutoplay).detectedLabel || 'Código Reconhecido'}
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                                Integrado & Pronto
                              </span>
                            </div>
                          )}

                          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                            💡 <strong className="text-emerald-400">Suporte Total ao VTurb:</strong> Você pode colar o código de script completo do VTurb (com a tag <code className="text-slate-300">&lt;script&gt;</code> e <code className="text-slate-300">&lt;div id="vid_..."&gt;</code>), o link direto do player (<code className="text-slate-300">embed.html</code> ou <code className="text-slate-300">player.js</code>), ou tags <code className="text-slate-300">&lt;iframe&gt;</code> do Panda Video e YouTube. O sistema converte e renderiza automaticamente.
                          </p>
                        </div>

                        {/* CONFIGURAÇÕES EXCLUSIVAS DE VSL */}
                        {heroType === 'vsl' && (
                          <div className="p-4 rounded-xl bg-slate-900 border border-red-500/25 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Configurações de VSL (Video Sales Letter)
                              </span>
                              <span className="text-[11px] text-slate-400">Delay & Autoplay</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Delay do Pitch */}
                              <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                  Delay para Revelar Botão de Compra (Segundos)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    step={5}
                                    placeholder="0 (Exibe imediatamente)"
                                    value={vslPitchDelay}
                                    onChange={(e) => setVslPitchDelay(parseInt(e.target.value, 10) || 0)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-bold focus:border-red-500 focus:outline-none"
                                  />
                                  <span className="text-xs text-slate-400 whitespace-nowrap">segundos</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  {vslPitchDelay > 0
                                    ? `⏳ Os botões de checkout serão revelados após ${Math.floor(vslPitchDelay / 60)}m ${vslPitchDelay % 60}s.`
                                    : 'Deixe 0 para exibir os botões e preços imediatamente.'}
                                </p>
                              </div>

                              {/* Autoplay */}
                              <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                  Reprodução Automática
                                </label>
                                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={vslAutoplay}
                                    onChange={(e) => setVslAutoplay(e.target.checked)}
                                    className="w-4 h-4 rounded text-red-500 focus:ring-0 bg-slate-900 border-slate-700"
                                  />
                                  <span className="text-xs text-slate-300 font-semibold">
                                    Iniciar vídeo automaticamente (Autoplay)
                                  </span>
                                </label>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  Inicia o vídeo assim que o visitante carregar a página.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PRÉ-VISUALIZAÇÃO DO PLAYER */}
                        {heroMediaUrl && (
                          <div className="space-y-1.5 pt-1">
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Pré-visualização do Player
                            </label>
                            <div className="max-w-md mx-auto">
                              <VideoPlayer
                                url={heroMediaUrl}
                                type={heroType}
                                title={name || 'Demonstração'}
                                glowColor={heroType === 'vsl' ? 'red' : 'emerald'}
                                autoplay={false}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PREÇO & CHECKOUT */}
              {activeTab === 'preco' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
                    💡 <strong>Como funcionam os botões de pagamento:</strong> Coloque abaixo o link de checkout do produto (seja da Kiwify, Eduzz, Hotmart, Mercado Pago, Stripe ou WhatsApp). Quando o comprador clicar no botão da página, ele é direcionado imediatamente para o pagamento com efeito comemorativo.
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 truncate">
                        <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Moeda</span>
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      >
                        {SUPPORTED_CURRENCIES.map((cur) => (
                          <option key={cur.code} value={cur.code}>
                            {cur.symbol} - {cur.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 truncate">
                        Preço Promocional *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="197.00"
                        value={promoPrice}
                        onChange={(e) => setPromoPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-bold text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 truncate">
                        Preço Original Riscado
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="497.00"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 truncate">
                        Parcelamento
                      </label>
                      <input
                        type="text"
                        placeholder="ou 12x no cartão"
                        value={installmentsText}
                        onChange={(e) => setInstallmentsText(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Link className="w-4 h-4 text-emerald-400" />
                      Configuração do Botão CTA (Chamada Para Ação)
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Link de Destino / Checkout de Pagamento (URL da Kiwify ou Gateway) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://pay.kiwify.com.br/seucodigo"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-mono text-sm focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Texto Principal do Botão
                        </label>
                        <input
                          type="text"
                          placeholder="QUERO GARANTIR MINHA VAGA AGORA"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Subtexto de Segurança / Garantia
                        </label>
                        <input
                          type="text"
                          placeholder="🔒 Compra 100% Segura • Acesso Imediato no E-mail"
                          value={ctaSubtext}
                          onChange={(e) => setCtaSubtext(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO META PIXEL & RASTREAMENTO */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span>Rastreamento de Tráfego: Meta Pixel (Facebook & Instagram Ads)</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Otimização de ROI
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Dispara automaticamente os eventos oficiais <code className="text-blue-300">PageView</code> ao abrir a página e <code className="text-emerald-300">InitiateCheckout</code> no clique do botão de compra.
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        ID do Pixel do Facebook (Apenas os Números)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 104928392019283"
                        value={facebookPixelId}
                        onChange={(e) => setFacebookPixelId(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Deixe em branco caso não vá veicular anúncios de tráfego pago no Facebook/Instagram.
                      </p>
                    </div>
                  </div>

                  {/* SEÇÃO SUPORTE & WHATSAPP FLUTUANTE */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>Botão Flutuante de Suporte via WhatsApp</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        +40% Conversão
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Ativa um botão oficial do WhatsApp flutuando no canto inferior direito da página de vendas para tirar dúvidas e fechar pagamentos via M-Pesa, E-Mola, Multicaixa ou PIX.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Número do WhatsApp (Com DDI + DDD)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 258841234567 ou 5511999998888"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Mensagem Inicial de Contato
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Olá! Gostaria de tirar uma dúvida sobre a oferta..."
                          value={whatsappMessage}
                          onChange={(e) => setWhatsappMessage(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO MULTI-IDIOMA & MULTI-MOEDA INTERNACIONAL */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-white text-sm">
                          Tradução Internacional & Multi-Moeda (PT, EN, ES)
                        </h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={multilangEnabled}
                          onChange={(e) => setMultilangEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Quando ativado, exibe o seletor de idiomas (<span className="text-white font-semibold">🇧🇷 PT • 🇺🇸 EN • 🇪🇸 ES</span>) no topo da sua página. Ao mudar a língua, a moeda e os preços se convertem automaticamente (ex: <span className="text-emerald-400 font-mono">R$ 197</span> ➔ <span className="text-emerald-400 font-mono">$ 36</span> ➔ <span className="text-emerald-400 font-mono">€ 33</span>) com tradução contextual de toda a copy.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-medium">
                        <span>🇧🇷</span> Português ➔ Real (BRL • R$)
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-medium">
                        <span>🇺🇸</span> English ➔ Dólar (USD • $)
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-medium">
                        <span>🇪🇸</span> Español ➔ Euro (EUR • €)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONTEÚDO & MÓDULOS */}
              {activeTab === 'conteudo' && (
                <div className="space-y-6">
                  {/* Benefícios */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">Benefícios e Diferenciais (Bullets)</h4>
                        <p className="text-xs text-slate-400">Pontos que aparecem na lista de vantagens da oferta</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Benefício</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ex: Acesso Vitalício + Atualizações Sem Custo"
                            value={feat}
                            onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Módulos */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">Módulos ou Seções do Conteúdo</h4>
                        <p className="text-xs text-slate-400">Grade curricular exibida no accordion da página</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Módulo</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {modules.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="Título do Módulo"
                              value={m.title}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[idx].title = e.target.value;
                                setModules(updated);
                              }}
                              className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Ex: 6 Aulas"
                                value={m.lessonsCount || ''}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[idx].lessonsCount = e.target.value;
                                  setModules(updated);
                                }}
                                className="flex-1 sm:w-28 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(m.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 shrink-0"
                                title="Remover módulo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="O que o aluno aprenderá neste módulo..."
                            value={m.description}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[idx].description = e.target.value;
                              setModules(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: GARANTIA, DEPOIMENTOS & FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  {/* Garantia & Contador */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Dias de Garantia
                      </label>
                      <select
                        value={guaranteeDays}
                        onChange={(e) => setGuaranteeDays(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-semibold"
                      >
                        <option value={7}>7 Dias Incondicionais</option>
                        <option value={15}>15 Dias de Garantia</option>
                        <option value={30}>30 Dias Blindados</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Cronômetro Regressivo
                      </label>
                      <select
                        value={countdownEnabled ? 'true' : 'false'}
                        onChange={(e) => setCountdownEnabled(e.target.value === 'true')}
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                      >
                        <option value="true">✅ Ativado no Topo</option>
                        <option value="false">❌ Desativado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Minutos do Contador
                      </label>
                      <input
                        type="number"
                        value={countdownMinutes}
                        onChange={(e) => setCountdownMinutes(parseInt(e.target.value, 10) || 15)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Depoimentos */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-sm">Depoimentos de Alunos</h4>
                      <button
                        type="button"
                        onClick={handleAddTestimonial}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Depoimento</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {testimonials.map((t, idx) => (
                        <div key={t.id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="Nome do Aluno"
                              value={t.name}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].name = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-semibold"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Cargo / Profissão"
                                value={t.role}
                                onChange={(e) => {
                                  const updated = [...testimonials];
                                  updated[idx].role = e.target.value;
                                  setTestimonials(updated);
                                }}
                                className="flex-1 sm:w-44 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTestimonial(t.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 shrink-0"
                                title="Remover depoimento"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Texto do depoimento..."
                            value={t.content}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].content = e.target.value;
                              setTestimonials(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                          />

                          {/* Foto do Aluno (Upload ou URL) */}
                          <div className="pt-1">
                            <ImageUploadInput
                              compact
                              value={t.avatarUrl || ''}
                              onChange={(val) => {
                                const updated = [...testimonials];
                                updated[idx].avatarUrl = val;
                                setTestimonials(updated);
                              }}
                              label="Foto do Aluno / Avatar"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-sm">Perguntas Frequentes (FAQ)</h4>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Pergunta</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {faqs.map((f, idx) => (
                        <div key={f.id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder="Pergunta"
                              value={f.question}
                              onChange={(e) => {
                                const updated = [...faqs];
                                updated[idx].question = e.target.value;
                                setFaqs(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(f.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Resposta da dúvida..."
                            value={f.answer}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[idx].answer = e.target.value;
                              setFaqs(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions Responsivo Mobile/Desktop */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 border-t border-slate-800 bg-slate-950/95 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-block px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setIsModelModalOpen(true)}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Carregar modelos prontos"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modelos</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'preview' ? 'geral' : 'preview')}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{activeTab === 'preview' ? 'Editar' : 'Prévia'}</span>
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              disabled={loading}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                saveSuccess
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gravando...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Gravado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Gravar Página</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal de Gerenciamento de Modelos */}
        <ModelManagerModal
          isOpen={isModelModalOpen}
          onClose={() => setIsModelModalOpen(false)}
          onApplyModel={handleApplyModel}
          currentProductData={currentPreviewProduct}
        />
      </div>
    </div>
  );
};

