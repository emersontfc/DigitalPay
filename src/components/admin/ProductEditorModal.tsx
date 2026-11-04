import React, { useState } from 'react';
import { Product, TemplateType, ModuleItem, Testimonial, FaqItem } from '../../types';
import { TemplateSelector } from './TemplateSelector';
import { TemplateRenderer } from '../templates/TemplateRenderer';
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
  MessageSquare,
  Clock,
  Shield,
  Video,
  Image as ImageIcon
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

  // Form states
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [status, setStatus] = useState<'active' | 'draft'>(product?.status || 'active');
  const [template, setTemplate] = useState<TemplateType>(product?.template || 'kiwify-neon');

  const [headline, setHeadline] = useState(product?.headline || '');
  const [subheadline, setSubheadline] = useState(product?.subheadline || '');
  const [heroType, setHeroType] = useState<'video' | 'image'>(product?.hero_type || 'video');
  const [heroMediaUrl, setHeroMediaUrl] = useState(product?.hero_media_url || '');
  const [badgeText, setBadgeText] = useState(product?.badge_text || 'OFERTA EXCLUSIVA');

  const [originalPrice, setOriginalPrice] = useState<number>(product?.original_price || 297);
  const [promoPrice, setPromoPrice] = useState<number>(product?.promo_price || 97);
  const [installmentsText, setInstallmentsText] = useState(product?.installments_text || 'ou 12x de R$ 9,70');
  const [ctaText, setCtaText] = useState(product?.cta_text || 'QUERO GARANTIR MINHA VAGA AGORA');
  const [ctaUrl, setCtaUrl] = useState(product?.cta_url || 'https://pay.kiwify.com.br');
  const [ctaSubtext, setCtaSubtext] = useState(product?.cta_subtext || '🔒 Compra 100% Segura • Acesso Imediato');

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
    headline: headline || 'Headline Principal de Alta Conversão',
    subheadline,
    hero_type: heroType,
    hero_media_url: heroMediaUrl,
    badge_text: badgeText,
    original_price: Number(originalPrice),
    promo_price: Number(promoPrice),
    installments_text: installmentsText,
    cta_text: ctaText || 'QUERO GARANTIR MINHA VAGA',
    cta_url: ctaUrl || '#',
    cta_subtext: ctaSubtext,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        id: product?.id,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        status,
        template,
        headline,
        subheadline,
        hero_type: heroType,
        hero_media_url: heroMediaUrl,
        badge_text: badgeText,
        original_price: Number(originalPrice),
        promo_price: Number(promoPrice),
        installments_text: installmentsText,
        cta_text: ctaText,
        cta_url: ctaUrl,
        cta_subtext: ctaSubtext,
        guarantee_days: Number(guaranteeDays),
        countdown_enabled: countdownEnabled,
        countdown_minutes: Number(countdownMinutes),
        features: features.filter(Boolean),
        modules,
        testimonials,
        faqs,
      });
      onClose();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {product ? `Editar: ${product.name}` : 'Criar Novo Produto & Página de Vendas'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure os templates, preços, links de pagamento e elementos persuasivos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'preview' ? 'geral' : 'preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{activeTab === 'preview' ? 'Voltar ao Editor' : 'Pré-visualizar Página'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (quando não estiver no preview) */}
        {activeTab !== 'preview' && (
          <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
            {[
              { id: 'geral', label: '1. Geral & Template', icon: Layers },
              { id: 'copy', label: '2. Copywriting & Mídia', icon: Video },
              { id: 'preco', label: '3. Preço & Link Checkout', icon: DollarSign },
              { id: 'conteudo', label: '4. Benefícios & Módulos', icon: Sparkles },
              { id: 'faq', label: '5. Garantia & FAQ', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6">
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
                <TemplateRenderer product={currentPreviewProduct} />
              </div>
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              {/* TAB 1: GERAL & TEMPLATE */}
              {activeTab === 'geral' && (
                <div className="space-y-6">
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
                      <span className="text-slate-500 font-mono">digitalpay.com/p/</span>
                      <input
                        type="text"
                        required
                        placeholder="nome-do-produto"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full bg-transparent text-emerald-400 font-mono font-semibold focus:outline-none pl-1"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Tipo de Mídia Destaque
                      </label>
                      <select
                        value={heroType}
                        onChange={(e) => setHeroType(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                      >
                        <option value="video">Vídeo (YouTube / Vimeo)</option>
                        <option value="image">Imagem de Capa</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        URL da Mídia ({heroType === 'video' ? 'Link do YouTube ou Vimeo' : 'URL da Imagem'})
                      </label>
                      <input
                        type="url"
                        placeholder={
                          heroType === 'video'
                            ? 'https://www.youtube.com/watch?v=...'
                            : 'https://images.unsplash.com/...'
                        }
                        value={heroMediaUrl}
                        onChange={(e) => setHeroMediaUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PREÇO & CHECKOUT */}
              {activeTab === 'preco' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
                    💡 <strong>Como funcionam os botões de pagamento:</strong> Coloque abaixo o link de checkout do produto (seja da Kiwify, Eduzz, Hotmart, Mercado Pago, Stripe ou WhatsApp). Quando o comprador clicar no botão da página, ele é direcionado imediatamente para o pagamento com efeito comemorativo.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Preço Original Riscado (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="497.00"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Preço Promocional Atual (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="197.00"
                        value={promoPrice}
                        onChange={(e) => setPromoPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Texto de Parcelamento
                      </label>
                      <input
                        type="text"
                        placeholder="ou 12x de R$ 19,78 no cartão"
                        value={installmentsText}
                        onChange={(e) => setInstallmentsText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
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
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              placeholder="Título do Módulo"
                              value={m.title}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[idx].title = e.target.value;
                                setModules(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Ex: 6 Aulas"
                              value={m.lessonsCount || ''}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[idx].lessonsCount = e.target.value;
                                setModules(updated);
                              }}
                              className="w-32 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveModule(m.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Nome do Aluno"
                              value={t.name}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].name = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-1/2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Cargo / Profissão"
                              value={t.role}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[idx].role = e.target.value;
                                setTestimonials(updated);
                              }}
                              className="w-1/2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveTestimonial(t.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'preview' ? 'geral' : 'preview')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{activeTab === 'preview' ? 'Editar Campos' : 'Ver Prévia'}</span>
            </button>

            <button
              type="submit"
              form="product-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Página de Vendas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

