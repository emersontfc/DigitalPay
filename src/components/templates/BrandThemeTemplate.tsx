import React, { useState } from 'react';
import { Product } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { VideoPlayer } from '../common/VideoPlayer';
import { CheckoutButton } from '../common/CheckoutButton';
import { StickyCtaBar } from '../common/StickyCtaBar';
import { SalesPageTopBar } from '../common/SalesPageTopBar';
import { FloatingWhatsAppButton } from '../common/FloatingWhatsAppButton';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { SocialProofSection } from '../common/SocialProofSection';
import { GuaranteeSection } from '../common/GuaranteeSection';
import { BonusSection } from '../common/BonusSection';
import { TargetAudienceSection } from '../common/TargetAudienceSection';
import { InstructorSection } from '../common/InstructorSection';
import { StudyPlanSection } from '../common/StudyPlanSection';
import { useVslPitchDelay } from '../../hooks/useVslPitchDelay';
import { formatPrice } from '../../utils/currency';
import { useSalesPageLanguage, UI_TRANSLATIONS } from '../../utils/i18n';
import {
  CheckCircle2,
  ChevronDown,
  Layers,
  HelpCircle,
  Clock,
  Flame,
  Award,
  Cpu,
  Gem,
  HeartPulse,
  TrendingUp,
  Video,
  Bot,
  BookOpen,
  Sparkles,
  Crown
} from 'lucide-react';

interface BrandThemeTemplateProps {
  product: Product;
}

// Configurações visuais e cromáticas de cada tema de marca e E-book
interface ThemeConfig {
  bg: string;
  isLight?: boolean;
  selection: string;
  topBarVariant: string;
  timerVariant: string;
  checkoutVariant: string;
  guaranteeDefaultColor: 'emerald' | 'gold' | 'indigo' | 'blue' | 'red' | 'purple' | 'rose' | 'orange' | 'cyan' | 'noir';
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
    guaranteeDefaultColor: 'cyan',
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
    guaranteeDefaultColor: 'red',
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
    guaranteeDefaultColor: 'rose',
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
    guaranteeDefaultColor: 'blue',
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
    guaranteeDefaultColor: 'orange',
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
    guaranteeDefaultColor: 'purple',
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
    guaranteeDefaultColor: 'emerald',
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
    guaranteeDefaultColor: 'noir',
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
  // === 6 TEMPLATES DEDICADOS PARA E-BOOKS ===
  'ebook-classic-ivory': {
    bg: 'bg-[#faf6ef]',
    isLight: true,
    selection: 'selection:bg-amber-600 selection:text-white',
    topBarVariant: 'ivory',
    timerVariant: 'gold',
    checkoutVariant: 'gold',
    guaranteeDefaultColor: 'gold',
    glow1: 'bg-amber-400/15',
    glow2: 'bg-orange-300/15',
    badgeBg: 'bg-amber-900/10',
    badgeBorder: 'border-amber-700/30',
    badgeText: 'text-amber-900',
    badgeIcon: <BookOpen className="w-3.5 h-3.5" />,
    headlineGradient: 'from-stone-900 via-amber-950 to-amber-800',
    subheadlineColor: 'text-stone-600',
    videoGlow: 'amber',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-900/15',
    cardHoverBorder: 'hover:border-amber-600/50',
    accentText: 'text-amber-800',
    accentBorder: 'border-amber-700/30',
    accentBg: 'bg-amber-100',
    starColor: 'fill-amber-500 text-amber-500',
    guaranteeBadge: 'bg-amber-100 text-amber-900 border-amber-500/40',
    priceColor: 'text-amber-800',
    faqActiveBorder: 'border-amber-600/50',
    faqActiveBg: 'bg-amber-50',
  },
  'ebook-ocean-clean': {
    bg: 'bg-[#f4f8fc]',
    isLight: true,
    selection: 'selection:bg-sky-600 selection:text-white',
    topBarVariant: 'ocean-light',
    timerVariant: 'blue',
    checkoutVariant: 'blue',
    guaranteeDefaultColor: 'blue',
    glow1: 'bg-sky-400/15',
    glow2: 'bg-blue-400/10',
    badgeBg: 'bg-sky-100',
    badgeBorder: 'border-sky-300',
    badgeText: 'text-sky-800',
    badgeIcon: <BookOpen className="w-3.5 h-3.5" />,
    headlineGradient: 'from-slate-900 via-blue-950 to-sky-700',
    subheadlineColor: 'text-slate-600',
    videoGlow: 'indigo',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-sky-400',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-300',
    accentBg: 'bg-sky-100',
    starColor: 'fill-amber-400 text-amber-400',
    guaranteeBadge: 'bg-sky-50 text-sky-800 border-sky-300',
    priceColor: 'text-sky-700',
    faqActiveBorder: 'border-sky-400',
    faqActiveBg: 'bg-sky-50/70',
  },
  'ebook-emerald-reader': {
    bg: 'bg-[#04100b]',
    selection: 'selection:bg-emerald-500 selection:text-slate-950',
    topBarVariant: 'emerald',
    timerVariant: 'emerald',
    checkoutVariant: 'neon',
    guaranteeDefaultColor: 'emerald',
    glow1: 'bg-emerald-500/15',
    glow2: 'bg-teal-500/10',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-400/35',
    badgeText: 'text-emerald-300',
    badgeIcon: <BookOpen className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-emerald-100 to-emerald-400',
    subheadlineColor: 'text-slate-300',
    videoGlow: 'emerald',
    cardBg: 'bg-slate-900/75',
    cardBorder: 'border-emerald-900/60',
    cardHoverBorder: 'hover:border-emerald-400/50',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/35',
    accentBg: 'bg-emerald-500/15',
    starColor: 'fill-amber-400 text-amber-400',
    guaranteeBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35',
    priceColor: 'text-emerald-400',
    faqActiveBorder: 'border-emerald-500/40',
    faqActiveBg: 'bg-emerald-950/30',
  },
  'ebook-crimson-bestseller': {
    bg: 'bg-[#0c0506]',
    selection: 'selection:bg-red-600 selection:text-white',
    topBarVariant: 'crimson',
    timerVariant: 'crimson',
    checkoutVariant: 'crimson',
    guaranteeDefaultColor: 'red',
    glow1: 'bg-red-600/15',
    glow2: 'bg-amber-500/10',
    badgeBg: 'bg-red-600/15',
    badgeBorder: 'border-red-500/40',
    badgeText: 'text-red-300',
    badgeIcon: <Flame className="w-3.5 h-3.5 fill-red-400 text-red-400" />,
    headlineGradient: 'from-white via-amber-100 to-red-400',
    subheadlineColor: 'text-neutral-300',
    videoGlow: 'red',
    cardBg: 'bg-neutral-900/80',
    cardBorder: 'border-red-950/80',
    cardHoverBorder: 'hover:border-red-500/50',
    accentText: 'text-red-400',
    accentBorder: 'border-red-500/35',
    accentBg: 'bg-red-500/15',
    starColor: 'fill-amber-400 text-amber-400',
    guaranteeBadge: 'bg-red-500/10 text-red-400 border-red-500/35',
    priceColor: 'text-amber-400',
    faqActiveBorder: 'border-red-500/40',
    faqActiveBg: 'bg-red-950/25',
  },
  'ebook-royal-plum': {
    bg: 'bg-[#0d0614]',
    selection: 'selection:bg-purple-500 selection:text-white',
    topBarVariant: 'violet',
    timerVariant: 'violet',
    checkoutVariant: 'violet',
    guaranteeDefaultColor: 'purple',
    glow1: 'bg-fuchsia-600/15',
    glow2: 'bg-purple-600/15',
    badgeBg: 'bg-fuchsia-500/15',
    badgeBorder: 'border-fuchsia-400/35',
    badgeText: 'text-fuchsia-300',
    badgeIcon: <Sparkles className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-fuchsia-100 to-purple-300',
    subheadlineColor: 'text-slate-300',
    videoGlow: 'indigo',
    cardBg: 'bg-purple-950/35',
    cardBorder: 'border-purple-800/40',
    cardHoverBorder: 'hover:border-fuchsia-400/40',
    accentText: 'text-fuchsia-300',
    accentBorder: 'border-fuchsia-400/35',
    accentBg: 'bg-fuchsia-500/15',
    starColor: 'fill-amber-300 text-amber-300',
    guaranteeBadge: 'bg-purple-500/15 text-fuchsia-300 border-purple-500/35',
    priceColor: 'text-fuchsia-300',
    faqActiveBorder: 'border-fuchsia-400/40',
    faqActiveBg: 'bg-purple-950/40',
  },
  'ebook-midnight-gold': {
    bg: 'bg-[#09090b]',
    selection: 'selection:bg-amber-400 selection:text-black',
    topBarVariant: 'gold',
    timerVariant: 'gold',
    checkoutVariant: 'gold',
    guaranteeDefaultColor: 'gold',
    glow1: 'bg-amber-500/15',
    glow2: 'bg-yellow-500/10',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-300',
    badgeIcon: <Crown className="w-3.5 h-3.5" />,
    headlineGradient: 'from-white via-amber-100 to-amber-400',
    subheadlineColor: 'text-zinc-300',
    videoGlow: 'amber',
    cardBg: 'bg-zinc-900/80',
    cardBorder: 'border-amber-500/20',
    cardHoverBorder: 'hover:border-amber-400/50',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/35',
    accentBg: 'bg-amber-500/15',
    starColor: 'fill-amber-400 text-amber-400',
    guaranteeBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/35',
    priceColor: 'text-amber-400',
    faqActiveBorder: 'border-amber-400/40',
    faqActiveBg: 'bg-amber-950/20',
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
  const isLight = Boolean(theme.isLight);
  const ds = product.design_settings || {};

  const discountAmount = Math.max(0, product.original_price - product.promo_price);
  const discountPercent = product.original_price > 0
    ? Math.round((discountAmount / product.original_price) * 100)
    : 0;

  const [currentLang] = useSalesPageLanguage();
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.pt;

  const headingText = isLight ? 'text-slate-900' : 'text-white';
  const bodyText = isLight ? 'text-slate-600' : 'text-slate-300';
  const mutedText = isLight ? 'text-slate-500' : 'text-slate-400';
  const sectionBorder = isLight ? 'border-slate-200/80' : 'border-slate-800/80';
  const sectionBgAlt = isLight ? 'bg-black/[0.03]' : 'bg-black/40';

  return (
    <div className={`min-h-screen ${theme.bg} ${isLight ? 'text-slate-900' : 'text-slate-100'} ${theme.selection} font-sans`}>
      {/* 1. Barra de Identidade Visual Ultrafina Topo: Digitall Pay */}
      <SalesPageTopBar variant={theme.topBarVariant} showLanguageSelector={Boolean(product.multilang_enabled)} />

      {/* 2. Barra de Contagem Regressiva Fina Topo */}
      {product.countdown_enabled && (
        <div className="sticky top-[30px] sm:top-[34px] z-20">
          <CountdownTimer
            initialMinutes={product.countdown_minutes}
            variant={theme.timerVariant}
            customColor={ds.countdown_color}
            label={t.countdown_label}
          />
        </div>
      )}

      {/* 3. Hero Section Principal */}
      <section className="relative pt-10 sm:pt-12 pb-16 sm:pb-20 px-4 overflow-hidden">
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
            <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CheckoutButton
                productId={product.id}
                ctaText={product.cta_text}
                ctaUrl={product.cta_url}
                ctaSubtext={product.cta_subtext}
                productName={product.name}
                promoPrice={product.promo_price}
                currency={product.currency}
                variant={theme.checkoutVariant}
                customColor={ds.cta_color}
                customTextColor={ds.cta_text_color}
                size={ds.cta_size || 'xl'}
                thickness={ds.cta_thickness || 'normal'}
                rounded={ds.cta_rounded || 'xl'}
                pulse={Boolean(ds.cta_pulse)}
              />
            </div>
          ) : isDelayActive ? (
            <div className={`max-w-md mx-auto p-4 rounded-xl ${isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/50 border-slate-800 text-slate-400'} border text-xs flex items-center justify-center gap-2`}>
              <Clock className="w-4 h-4 animate-spin" />
              <span>{t.vsl_delay_waiting}</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* 3.5. Público-Alvo: Qualificação e Desqualificação */}
      <TargetAudienceSection product={product} isLight={isLight} />

      {/* 4. Grade de Diferenciais & O Que Está Incluso */}
      {product.features && product.features.length > 0 && (
        <section className={`py-16 px-4 border-y ${sectionBorder} ${sectionBgAlt} relative`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className={`text-xs font-black uppercase tracking-widest ${theme.accentText} block mb-2`}>
                {t.features_badge}
              </span>
              <h2 className={`text-2xl sm:text-4xl font-black ${headingText}`}>
                {t.features_title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} ${theme.cardHoverBorder} transition-all duration-300 flex items-start gap-4 group shadow-sm`}
                >
                  <div className={`p-2.5 rounded-xl ${theme.accentBg} ${theme.accentText} shrink-0 group-hover:scale-110 transition-transform`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${headingText} text-base leading-snug`}>
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
              <span>{t.modules_badge}</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingText} tracking-tight`}>
              {t.modules_title}
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
                      : `${theme.cardBg} ${theme.cardBorder}`
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
                        <h4 className={`font-bold ${headingText} text-base truncate`}>{mod.title}</h4>
                        {mod.lessonsCount && (
                          <span className={`text-xs ${mutedText} block mt-0.5`}>{mod.lessonsCount}</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 ${mutedText} transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && mod.description && (
                    <div className={`px-5 pb-5 pt-2 text-sm ${bodyText} leading-relaxed border-t ${sectionBorder}`}>
                      {mod.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5.5. Plano de Estudos / Cronograma */}
      <StudyPlanSection
        product={product}
        isLight={isLight}
        accentTextClass={theme.accentText}
        accentBgClass={theme.accentBg}
        accentBorderClass={theme.accentBorder}
        cardBgClass={theme.cardBg}
        cardBorderClass={theme.cardBorder}
      />

      {/* 5.6. Bônus Exclusivos de Alto Valor */}
      <BonusSection
        product={product}
        isLight={isLight}
        accentTextClass={theme.accentText}
        accentBgClass={theme.accentBg}
        accentBorderClass={theme.accentBorder}
        cardBgClass={theme.cardBg}
        cardBorderClass={theme.cardBorder}
      />

      {/* 6. Prova Social & Depoimentos (Carrossel de Prints, Galeria, WhatsApp, Cards, Misto) */}
      <SocialProofSection
        product={product}
        badgeText={t.testimonials_badge}
        titleText={t.testimonials_title}
        accentTextClass={theme.accentText}
        accentBgClass={theme.accentBg}
        accentBorderClass={theme.accentBorder}
        cardBgClass={theme.cardBg}
        cardBorderClass={theme.cardBorder}
        starColorClass={theme.starColor}
        sectionBgClass={`${sectionBgAlt} border-y ${sectionBorder}`}
        lightMode={isLight}
      />

      {/* 6.5. Sobre o Especialista */}
      <InstructorSection
        product={product}
        isLight={isLight}
        accentTextClass={theme.accentText}
        accentBgClass={theme.accentBg}
        accentBorderClass={theme.accentBorder}
        cardBgClass={theme.cardBg}
        cardBorderClass={theme.cardBorder}
      />

      {/* 7. Caixa de Preço & Oferta Principal com Seletor de Moeda Integrado */}
      <section className="py-20 px-4 relative overflow-hidden" id="checkout-section">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] ${theme.glow1} blur-[150px] rounded-full pointer-events-none`} />

        <div className="max-w-xl mx-auto relative z-10">
          <div className={`rounded-3xl ${theme.cardBg} border-2 ${theme.cardBorder} p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl space-y-6`}>
            {discountPercent > 0 && (
              <div className="inline-block">
                <span className={`px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.accentText} text-xs font-black uppercase tracking-wider`}>
                  {t.pricing_save.replace('{percent}', String(discountPercent))}
                </span>
              </div>
            )}

            <div>
              <h3 className={`text-2xl font-black ${headingText}`}>{product.name}</h3>
              <p className={`text-xs ${mutedText} mt-1`}>{t.pricing_subtext}</p>
            </div>

            {/* Bloco de Preço + Seletor de Moeda Direto no Campo de CTA */}
            <div className={`p-5 rounded-2xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/60 border-slate-800/80'} border space-y-2`}>
              {product.multilang_enabled !== false && (
                <div className="pb-1">
                  <LanguageSelector variant="currency-pill" lightMode={isLight} />
                </div>
              )}

              {product.original_price > product.promo_price && (
                <div className={`text-xs sm:text-sm ${mutedText} line-through`}>
                  {t.pricing_was.replace('{original}', formatPrice(product.original_price, product.currency))}
                </div>
              )}
              <div className={`text-4xl sm:text-5xl font-black ${theme.priceColor}`}>
                {formatPrice(product.promo_price, product.currency)}
              </div>
              <div className={`text-xs sm:text-sm ${bodyText} font-semibold`}>
                {product.installments_text}
              </div>
            </div>

            {/* Botão de Fechamento */}
            <CheckoutButton
              productId={product.id}
              ctaText={product.cta_text}
              ctaUrl={product.cta_url}
              ctaSubtext={product.cta_subtext}
              productName={product.name}
              promoPrice={product.promo_price}
              currency={product.currency}
              variant={theme.checkoutVariant}
              customColor={ds.cta_color}
              customTextColor={ds.cta_text_color}
              size={ds.cta_size || 'xl'}
              thickness={ds.cta_thickness || 'normal'}
              rounded={ds.cta_rounded || 'xl'}
              pulse={Boolean(ds.cta_pulse)}
            />
          </div>
        </div>
      </section>

      {/* 8. Selo / Botão de Garantia Ajustável */}
      <GuaranteeSection
        product={product}
        defaultColor={theme.guaranteeDefaultColor}
        lightMode={isLight}
      />

      {/* 9. Perguntas Frequentes (FAQ) */}
      {product.faqs && product.faqs.length > 0 && (
        <section className={`py-16 px-4 max-w-3xl mx-auto border-t ${sectionBorder}`}>
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.accentBg} ${theme.accentText} text-xs font-bold uppercase tracking-wider mb-2`}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.faq_badge}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${headingText}`}>{t.faq_title}</h2>
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
                      : `${theme.cardBg} ${theme.cardBorder}`
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`font-bold ${headingText} text-sm sm:text-base`}>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 ${mutedText} transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className={`px-5 pb-5 pt-2 text-xs sm:text-sm ${bodyText} leading-relaxed border-t ${sectionBorder}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. Rodapé Institucional com Logo Digitall Pay maior lá em baixo */}
      <footer className={`py-12 px-4 border-t ${sectionBorder} text-center text-xs ${mutedText} space-y-3`}>
        <div className="flex justify-center pb-1">
          <BrandLogo
            size="lg"
            variant={isLight ? 'light' : 'neon'}
            showText={true}
          />
        </div>
        <p>© {new Date().getFullYear()} {product.name}. {t.footer_rights}</p>
        <p className="text-[11px] opacity-75">
          {t.footer_platform}
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
