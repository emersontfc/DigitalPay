import React, { useState } from 'react';
import { Product } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { VideoPlayer } from '../common/VideoPlayer';
import { CheckoutButton } from '../common/CheckoutButton';
import { StickyCtaBar } from '../common/StickyCtaBar';
import { SalesPageTopBar } from '../common/SalesPageTopBar';
import { FloatingWhatsAppButton } from '../common/FloatingWhatsAppButton';
import { useVslPitchDelay } from '../../hooks/useVslPitchDelay';
import { formatPrice } from '../../utils/currency';
import {
  CheckCircle2,
  Shield,
  Star,
  ChevronDown,
  Sparkles,
  Lock,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Check,
  Cpu,
  Gem,
  HeartPulse,
  TrendingUp,
  Video,
  Bot
} from 'lucide-react';

interface BrandThemeTemplateProps {
  product: Product;
}

// Configurações visuais e cromáticas de cada tema de marca
interface ThemeConfig {
  bg: string;
  selection: string;
  topBarVariant: string;
  timerVariant: string;
  checkoutVariant: string;
  glow1: string;
  glow2: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  headlineGradient: string;
  subheadlineColor: string;
  videoGlow: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  starColor: string;
  guaranteeBadge: string;
  priceColor: string;
  faqActiveBorder: string;
  faqActiveBg: string;
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  'titanium-tech': {
    bg: 'bg-[#050811]',
    selection: 'selection:bg-cyan-500 selection:text-slate-950',
    topBarVariant: 'cyan',
    timerVariant: 'cyan',
    checkoutVariant: 'cyan',
    glow1: 'bg-cyan-500/10',
    glow2: 'bg-sky-500/10',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    badgeIcon: <Cpu className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-cyan-100 to-cyan-400',
    subheadlineColor: 'text-slate-300',
    videoGlow: 'indigo',
    cardBg: 'bg-slate-900/60',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-cyan-500/40',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    starColor: 'fill-cyan-400 text-cyan-400',
    guaranteeBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    priceColor: 'text-cyan-400',
    faqActiveBorder: 'border-cyan-500/40',
    faqActiveBg: 'bg-cyan-950/20',
  },
  'crimson-beast': {
    bg: 'bg-[#080405]',
    selection: 'selection:bg-red-600 selection:text-white',
    topBarVariant: 'crimson',
    timerVariant: 'crimson',
    checkoutVariant: 'crimson',
    glow1: 'bg-red-600/15',
    glow2: 'bg-rose-600/10',
    badgeBg: 'bg-red-600/15',
    badgeBorder: 'border-red-600/40',
    badgeText: 'text-red-400',
    badgeIcon: <Flame className="w-3.5 h-3.5 fill-red-400 text-red-400" />,
    headlineGradient: 'from-white via-red-100 to-red-500',
    subheadlineColor: 'text-neutral-300',
    videoGlow: 'red',
    cardBg: 'bg-neutral-900/70',
    cardBorder: 'border-neutral-800',
    cardHoverBorder: 'hover:border-red-500/50',
    accentText: 'text-red-400',
    accentBorder: 'border-red-500/30',
    accentBg: 'bg-red-500/10',
    starColor: 'fill-red-500 text-red-500',
    guaranteeBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    priceColor: 'text-red-400',
    faqActiveBorder: 'border-red-500/40',
    faqActiveBg: 'bg-red-950/25',
  },
  'rose-gold-glamour': {
    bg: 'bg-[#0b0609]',
    selection: 'selection:bg-rose-400 selection:text-slate-950',
    topBarVariant: 'rose',
    timerVariant: 'rose',
    checkoutVariant: 'rose',
    glow1: 'bg-rose-500/15',
    glow2: 'bg-pink-500/10',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-400/30',
    badgeText: 'text-rose-300',
    badgeIcon: <Gem className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-rose-100 to-rose-300',
    subheadlineColor: 'text-stone-300',
    videoGlow: 'amber',
    cardBg: 'bg-stone-900/60',
    cardBorder: 'border-stone-800',
    cardHoverBorder: 'hover:border-rose-400/40',
    accentText: 'text-rose-300',
    accentBorder: 'border-rose-400/30',
    accentBg: 'bg-rose-500/10',
    starColor: 'fill-rose-400 text-rose-400',
    guaranteeBadge: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
    priceColor: 'text-rose-300',
    faqActiveBorder: 'border-rose-400/40',
    faqActiveBg: 'bg-rose-950/20',
  },
  'sapphire-fintech': {
    bg: 'bg-[#030712]',
    selection: 'selection:bg-blue-600 selection:text-white',
    topBarVariant: 'blue',
    timerVariant: 'blue',
    checkoutVariant: 'blue',
    glow1: 'bg-blue-600/15',
    glow2: 'bg-indigo-600/10',
    badgeBg: 'bg-blue-600/15',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    badgeIcon: <TrendingUp className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-blue-100 to-blue-400',
    subheadlineColor: 'text-slate-300',
    videoGlow: 'indigo',
    cardBg: 'bg-slate-900/70',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-blue-500/40',
    accentText: 'text-blue-400',
    accentBorder: 'border-blue-500/30',
    accentBg: 'bg-blue-500/10',
    starColor: 'fill-blue-400 text-blue-400',
    guaranteeBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    priceColor: 'text-blue-400',
    faqActiveBorder: 'border-blue-500/40',
    faqActiveBg: 'bg-blue-950/25',
  },
  'sunset-creator': {
    bg: 'bg-[#0b0603]',
    selection: 'selection:bg-orange-500 selection:text-slate-950',
    topBarVariant: 'sunset',
    timerVariant: 'sunset',
    checkoutVariant: 'sunset',
    glow1: 'bg-orange-500/15',
    glow2: 'bg-amber-500/10',
    badgeBg: 'bg-orange-500/15',
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    badgeIcon: <Video className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-orange-100 to-orange-400',
    subheadlineColor: 'text-neutral-300',
    videoGlow: 'amber',
    cardBg: 'bg-neutral-900/65',
    cardBorder: 'border-neutral-800',
    cardHoverBorder: 'hover:border-orange-500/40',
    accentText: 'text-orange-400',
    accentBorder: 'border-orange-500/30',
    accentBg: 'bg-orange-500/10',
    starColor: 'fill-orange-400 text-orange-400',
    guaranteeBadge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    priceColor: 'text-orange-400',
    faqActiveBorder: 'border-orange-500/40',
    faqActiveBg: 'bg-orange-950/20',
  },
  'midnight-violet': {
    bg: 'bg-[#080412]',
    selection: 'selection:bg-purple-600 selection:text-white',
    topBarVariant: 'violet',
    timerVariant: 'violet',
    checkoutVariant: 'violet',
    glow1: 'bg-purple-600/15',
    glow2: 'bg-violet-600/10',
    badgeBg: 'bg-purple-600/15',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-300',
    badgeIcon: <Bot className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-purple-100 to-purple-400',
    subheadlineColor: 'text-slate-300',
    videoGlow: 'indigo',
    cardBg: 'bg-slate-900/70',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-purple-500/40',
    accentText: 'text-purple-300',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
    starColor: 'fill-purple-400 text-purple-400',
    guaranteeBadge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    priceColor: 'text-purple-300',
    faqActiveBorder: 'border-purple-500/40',
    faqActiveBg: 'bg-purple-950/25',
  },
  'emerald-prestige': {
    bg: 'bg-[#040c07]',
    selection: 'selection:bg-emerald-500 selection:text-slate-950',
    topBarVariant: 'emerald',
    timerVariant: 'emerald',
    checkoutVariant: 'emerald',
    glow1: 'bg-emerald-600/15',
    glow2: 'bg-teal-600/10',
    badgeBg: 'bg-emerald-600/15',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    badgeIcon: <HeartPulse className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-emerald-100 to-emerald-400',
    subheadlineColor: 'text-stone-300',
    videoGlow: 'emerald',
    cardBg: 'bg-stone-900/70',
    cardBorder: 'border-stone-800',
    cardHoverBorder: 'hover:border-emerald-500/40',
    accentText: 'text-emerald-300',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
    starColor: 'fill-emerald-400 text-emerald-400',
    guaranteeBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    priceColor: 'text-emerald-300',
    faqActiveBorder: 'border-emerald-500/40',
    faqActiveBg: 'bg-emerald-950/25',
  },
  'monochrome-editorial': {
    bg: 'bg-[#050505]',
    selection: 'selection:bg-white selection:text-black',
    topBarVariant: 'noir',
    timerVariant: 'noir',
    checkoutVariant: 'noir',
    glow1: 'bg-zinc-700/10',
    glow2: 'bg-zinc-500/10',
    badgeBg: 'bg-zinc-900',
    badgeBorder: 'border-zinc-700',
    badgeText: 'text-zinc-200',
    badgeIcon: <Award className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-zinc-200 to-zinc-400',
    subheadlineColor: 'text-zinc-400',
    videoGlow: 'amber',
    cardBg: 'bg-zinc-950',
    cardBorder: 'border-zinc-800',
    cardHoverBorder: 'hover:border-zinc-500',
    accentText: 'text-zinc-200',
    accentBorder: 'border-zinc-700',
    accentBg: 'bg-zinc-900',
    starColor: 'fill-white text-white',
    guaranteeBadge: 'bg-zinc-900 text-white border-zinc-700',
    priceColor: 'text-white',
    faqActiveBorder: 'border-zinc-500',
    faqActiveBg: 'bg-zinc-900/40',
  },
};

export const BrandThemeTemplate: React.FC<BrandThemeTemplateProps> = ({ product }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(product.faqs[0]?.id || null);
  const [openModule, setOpenModule] = useState<string | null>(product.modules[0]?.id || null);

  const { showOffer, isDelayActive } = useVslPitchDelay({
    delaySeconds: product.vsl_pitch_delay_seconds,
    productId: product.id,
    enabled: product.hero_type === 'vsl',
  });

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id);
  };

  const theme: ThemeConfig = THEME_CONFIGS[product.template] || THEME_CONFIGS['titanium-tech'];

  const discountAmount = Math.max(0, product.original_price - product.promo_price);
  const discountPercent = product.original_price > 0
    ? Math.round((discountAmount / product.original_price) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${theme.bg} text-slate-100 ${theme.selection} font-sans`}>
      {/* 1. Barra de Identidade Visual e Segurança Topo: Digitall Pay */}
      <SalesPageTopBar variant={theme.topBarVariant} />

      {/* 2. Barra de Contagem Regressiva Topo */}
      {product.countdown_enabled && (
        <div className="sticky top-11 z-20">
          <CountdownTimer
            initialMinutes={product.countdown_minutes}
            variant={theme.timerVariant}
            label="ATENÇÃO: OFERTA EXCLUSIVA COM CONDIÇÃO ESPECIAL ENCERRA EM:"
          />
        </div>
      )}

      {/* 3. Hero Section Principal */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Glows de ambientação do tema */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] ${theme.glow1} blur-[140px] rounded-full pointer-events-none`} />
        <div className={`absolute top-1/3 right-10 w-[400px] h-[400px] ${theme.glow2} blur-[130px] rounded-full pointer-events-none`} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge Temático */}
          {product.badge_text && (
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 animate-pulse`}>
              {theme.badgeIcon}
              <span>{product.badge_text}</span>
            </div>
          )}

          {/* Headline Principal */}
          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.14] mb-6 bg-gradient-to-r ${theme.headlineGradient} bg-clip-text text-transparent drop-shadow-sm`}>
            {product.headline}
          </h1>

          {/* Subheadline Persuasiva */}
          {product.subheadline && (
            <p className={`text-base sm:text-xl ${theme.subheadlineColor} max-w-2xl mx-auto mb-10 font-normal leading-relaxed`}>
              {product.subheadline}
            </p>
          )}

          {/* Player de Apresentação (Vídeo, Imagem ou VSL) */}
          <div className="max-w-3xl mx-auto mb-10 shadow-2xl rounded-2xl overflow-hidden">
            <VideoPlayer
              url={product.hero_media_url}
              type={product.hero_type}
              title={product.name}
              glowColor={theme.videoGlow}
              autoplay={product.vsl_autoplay}
            />
          </div>

          {/* Botão de Ação Imediato com Pitch Delay Inteligente */}
          {showOffer ? (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CheckoutButton
                ctaText={product.cta_text}
                ctaUrl={product.cta_url}
                ctaSubtext={product.cta_subtext}
                productName={product.name}
                promoPrice={product.promo_price}
                currency={product.currency}
                variant={theme.checkoutVariant}
                size="xl"
              />
            </div>
          ) : isDelayActive ? (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-slate-400" />
              <span>Aguarde o vídeo para liberar a condição especial abaixo...</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* 4. Grade de Diferenciais & O Que Está Incluso */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 px-4 border-t border-b border-slate-800/80 bg-black/40 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className={`text-xs font-black uppercase tracking-widest ${theme.accentText} block mb-2`}>
                Por que escolher nossa marca
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Tudo o que você precisa para alcançar o resultado desejado
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 flex items-start gap-4 group`}
                >
                  <div className={`p-2.5 rounded-xl ${theme.accentBg} ${theme.accentText} shrink-0 group-hover:scale-110 transition-transform`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-snug group-hover:text-white transition-colors">
                      {feature}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Módulos & Etapas do Conteúdo */}
      {product.modules && product.modules.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.accentBg} ${theme.accentText} text-xs font-bold uppercase tracking-wider mb-3`}>
              <Layers className="w-3.5 h-3.5" />
              <span>Estrutura do Conteúdo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              O que você vai encontrar por dentro
            </h2>
          </div>

          <div className="space-y-3">
            {product.modules.map((mod, index) => {
              const isOpen = openModule === mod.id;
              return (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? `${theme.cardBg} ${theme.accentBorder} shadow-lg`
                      : `${theme.cardBg} ${theme.cardBorder} hover:border-slate-700`
                  }`}
                >
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`w-8 h-8 rounded-xl ${theme.accentBg} ${theme.accentText} flex items-center justify-center text-xs font-black shrink-0`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate">{mod.title}</h4>
                        {mod.lessonsCount && (
                          <span className="text-xs text-slate-400 block mt-0.5">{mod.lessonsCount}</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && mod.description && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {mod.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Prova Social & Depoimentos de Clientes */}
      {product.testimonials && product.testimonials.length > 0 && (
        <section className="py-20 px-4 bg-black/50 border-t border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className={`text-xs font-black uppercase tracking-widest ${theme.accentText} block mb-2`}>
                Depoimentos Reais
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Quem já aplicou recomenda os resultados
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.testimonials.map((test) => (
                <div
                  key={test.id}
                  className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${theme.starColor}`} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{test.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60">
                    <div className={`w-10 h-10 rounded-full ${theme.accentBg} ${theme.accentText} font-bold flex items-center justify-center text-sm border ${theme.accentBorder}`}>
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{test.name}</h5>
                      <span className="text-xs text-slate-400">{test.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Caixa de Preço & Oferta Principal */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] ${theme.glow1} blur-[150px] rounded-full pointer-events-none`} />

        <div className="max-w-xl mx-auto relative z-10">
          <div className={`rounded-3xl ${theme.cardBg} border-2 ${theme.cardBorder} p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl space-y-6`}>
            {discountPercent > 0 && (
              <div className="inline-block">
                <span className={`px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.accentText} text-xs font-black uppercase tracking-wider`}>
                  ECONOMIZE {discountPercent}% HOJE
                </span>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-black text-white">{product.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Acesso completo e imediato ao conteúdo</p>
            </div>

            {/* Bloco de Preço */}
            <div className="p-5 rounded-2xl bg-black/60 border border-slate-800/80 space-y-1">
              {product.original_price > product.promo_price && (
                <div className="text-xs sm:text-sm text-slate-500 line-through">
                  De {formatPrice(product.original_price, product.currency)} por apenas:
                </div>
              )}
              <div className={`text-4xl sm:text-5xl font-black ${theme.priceColor}`}>
                {formatPrice(product.promo_price, product.currency)}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold">
                {product.installments_text}
              </div>
            </div>

            {/* Botão de Fechamento */}
            <CheckoutButton
              ctaText={product.cta_text}
              ctaUrl={product.cta_url}
              ctaSubtext={product.cta_subtext}
              productName={product.name}
              promoPrice={product.promo_price}
              currency={product.currency}
              variant={theme.checkoutVariant}
              size="xl"
            />
          </div>
        </div>
      </section>

      {/* 8. Selo de Garantia Incondicional */}
      {product.guarantee_days > 0 && (
        <section className="py-12 px-4 max-w-3xl mx-auto">
          <div className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left`}>
            <div className={`w-20 h-20 rounded-2xl ${theme.guaranteeBadge} flex flex-col items-center justify-center shrink-0 border-2`}>
              <Shield className="w-8 h-8 mb-1" />
              <span className="text-xs font-black">{product.guarantee_days} DIAS</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">Garantia Incondicional de {product.guarantee_days} Dias</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Você tem {product.guarantee_days} dias para testar todo o conteúdo. Se por qualquer motivo você não ficar 100% satisfeito, basta enviar um e-mail para receber todo o seu investimento de volta, sem burocracias.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 9. Perguntas Frequentes (FAQ) */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.accentBg} ${theme.accentText} text-xs font-bold uppercase tracking-wider mb-2`}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dúvidas Frequentes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Perguntas e Respostas</h2>
          </div>

          <div className="space-y-3">
            {product.faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? `${theme.faqActiveBg} ${theme.faqActiveBorder}`
                      : `${theme.cardBg} ${theme.cardBorder} hover:border-slate-700`
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. Rodapé Institucional */}
      <footer className="py-10 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
        <p>© {new Date().getFullYear()} {product.name}. Todos os direitos reservados.</p>
        <p className="text-[11px] text-slate-600">
          Plataforma de Pagamentos e Checkout Oficial: <span className="text-slate-400 font-bold">Digitall Pay</span>
        </p>
      </footer>

      {/* 11. Botão Flutuante de WhatsApp (se configurado) */}
      {product.whatsapp_number && (
        <FloatingWhatsAppButton
          whatsappNumber={product.whatsapp_number}
          whatsappMessage={product.whatsapp_message}
          productName={product.name}
        />
      )}

      {/* 12. Barra de Conversão Inferior Fixa */}
      <StickyCtaBar
        product={product}
        variant={theme.checkoutVariant}
        show={showOffer}
      />
    </div>
  );
};
