import React from 'react';
import confetti from 'canvas-confetti';
import { ShoppingCart, Zap, ArrowRight, Lock } from 'lucide-react';
import { trackInitiateCheckout } from '../../utils/pixel';
import { ButtonSize, ButtonThickness, ButtonRounded } from '../../types';

interface CheckoutButtonProps {
  productId?: string;
  ctaText: string;
  ctaUrl: string;
  ctaSubtext?: string;
  promoPrice?: number;
  installmentsText?: string;
  productName?: string;
  currency?: string;
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  customColor?: string; // 'auto' | preset | '#hex'
  customTextColor?: string; // 'auto' | '#hex'
  size?: ButtonSize | 'normal';
  thickness?: ButtonThickness;
  rounded?: ButtonRounded;
  pulse?: boolean;
  fullWidth?: boolean;
  className?: string;
}

function getContrastColor(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#ffffff';
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#020617' : '#ffffff';
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId,
  ctaText,
  ctaUrl,
  ctaSubtext,
  promoPrice,
  productName,
  currency = 'BRL',
  variant = 'neon',
  customColor,
  customTextColor,
  size = 'xl',
  thickness = 'normal',
  rounded = 'xl',
  pulse = false,
  fullWidth = true,
  className = '',
}) => {
  const handleClick = () => {
    // 1. Rastreamento oficial Meta Pixel
    trackInitiateCheckout(productName, promoPrice, currency);

    // 2. Dispara efeito de confetes
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignora silenciosamente se o canvas não estiver disponível
    }

    // 3. Salva produto no localStorage para recuperação imediata de entregáveis no retorno do PaySuite
    try {
      localStorage.setItem('digitalpay_last_checkout_product', JSON.stringify({
        productId,
        productName,
        promoPrice,
        currency,
        ctaUrl,
        timestamp: Date.now()
      }));
    } catch {}

    // 4. Redirecionamento DIRETO para o Link de Pagamento do PaySuite / Gateway
    // Pula qualquer formulário intermediário, pois o PaySuite já pede Nome, E-mail e Telemóvel
    if (ctaUrl && (ctaUrl.startsWith('http://') || ctaUrl.startsWith('https://'))) {
      window.location.href = ctaUrl;
      return;
    }

    if (ctaUrl && ctaUrl !== '#' && ctaUrl !== 'paysuite') {
      window.location.href = ctaUrl;
      return;
    }

    // Se o link ainda não foi configurado pelo administrador
    window.location.href = '/pagamento/retorno';
  };

  // Mapeia apelidos de cores escolhidas pelo usuário no editor
  const colorMap: Record<string, string> = {
    green: 'neon',
    red: 'crimson',
    purple: 'violet',
    orange: 'sunset',
    black: 'black-solid',
    white: 'noir',
  };

  const isHexColor = Boolean(customColor && customColor.startsWith('#'));
  const resolvedVariant =
    customColor && customColor !== 'auto' && !isHexColor
      ? colorMap[customColor] || customColor
      : variant;

  const variantStyles = ({
    neon: {
      btn: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)]',
      subtext: 'text-emerald-400/90',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    luxury: {
      btn: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:from-indigo-500 hover:to-slate-800 text-white font-bold shadow-xl hover:shadow-indigo-500/20 border border-indigo-400/30',
      subtext: 'text-slate-400',
      icon: <ArrowRight className="w-5 h-5 shrink-0" />,
    },
    gold: {
      btn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] border-2 border-amber-300',
      subtext: 'text-amber-400/90 font-medium',
      icon: <ShoppingCart className="w-5 h-5 fill-current shrink-0" />,
    },
    cyan: {
      btn: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)]',
      subtext: 'text-cyan-400/90 font-medium',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    crimson: {
      btn: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] border border-red-400/30',
      subtext: 'text-red-400/90 font-medium',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    rose: {
      btn: 'bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 hover:from-rose-300 hover:to-pink-400 text-white font-black shadow-[0_0_35px_rgba(244,63,94,0.5)] hover:shadow-[0_0_50px_rgba(244,63,94,0.7)]',
      subtext: 'text-rose-300 font-medium',
      icon: <ShoppingCart className="w-5 h-5 fill-current shrink-0" />,
    },
    blue: {
      btn: 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 hover:from-blue-400 hover:to-indigo-500 text-white font-black shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] border border-blue-400/30',
      subtext: 'text-blue-400 font-medium',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    sunset: {
      btn: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)]',
      subtext: 'text-orange-400 font-medium',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    violet: {
      btn: 'bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-600 hover:from-purple-400 hover:to-violet-500 text-white font-black shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] border border-purple-400/30',
      subtext: 'text-purple-400 font-medium',
      icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
    },
    emerald: {
      btn: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]',
      subtext: 'text-emerald-400 font-medium',
      icon: <ShoppingCart className="w-5 h-5 fill-current shrink-0" />,
    },
    noir: {
      btn: 'bg-gradient-to-r from-zinc-100 via-white to-zinc-200 hover:from-white hover:to-zinc-100 text-black font-black shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] border-2 border-white',
      subtext: 'text-zinc-400 font-medium',
      icon: <ShoppingCart className="w-5 h-5 fill-current shrink-0" />,
    },
    'black-solid': {
      btn: 'bg-gradient-to-r from-zinc-900 via-black to-zinc-900 hover:from-zinc-800 hover:to-zinc-900 text-white font-black shadow-xl border border-zinc-700',
      subtext: 'text-zinc-400 font-medium',
      icon: <ShoppingCart className="w-5 h-5 fill-current shrink-0" />,
    },
  } as Record<string, any>)[resolvedVariant] || {
    btn: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)]',
    subtext: 'text-emerald-400/90',
    icon: <Zap className="w-5 h-5 fill-current shrink-0" />,
  };

  // Tamanho (escala de texto e padding horizontal)
  const sizeTextClasses: Record<string, string> = {
    sm: 'px-4 text-xs sm:text-sm max-w-xs',
    md: 'px-5 sm:px-6 text-sm sm:text-base max-w-md',
    normal: 'px-4 sm:px-6 text-sm sm:text-base',
    lg: 'px-5 sm:px-8 text-sm sm:text-lg',
    xl: 'px-6 sm:px-9 text-base sm:text-lg md:text-xl',
  };

  // Espessura vertical (altura do botão)
  const thicknessClasses: Record<ButtonThickness, string> = {
    thin: 'py-2 sm:py-2.5',
    normal: 'py-3 sm:py-3.5',
    thick: 'py-4 sm:py-5',
    'extra-thick': 'py-5 sm:py-6',
  };

  // Arredondamento das bordas
  const roundedClasses: Record<ButtonRounded, string> = {
    md: 'rounded-lg',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  const inlineStyle: React.CSSProperties | undefined = isHexColor
    ? {
        background: `linear-gradient(135deg, ${customColor}, ${customColor}dd)`,
        color:
          customTextColor && customTextColor !== 'auto'
            ? customTextColor
            : getContrastColor(customColor!),
        boxShadow: `0 10px 30px -5px ${customColor}66`,
      }
    : customTextColor && customTextColor !== 'auto'
    ? { color: customTextColor }
    : undefined;

  return (
    <div className={`flex flex-col items-center gap-2 ${fullWidth ? 'w-full' : 'inline-flex'} ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        style={inlineStyle}
        className={`group relative flex items-center justify-center gap-2 sm:gap-3 font-black transition-all duration-300 transform active:scale-95 cursor-pointer uppercase tracking-wider text-center ${
          roundedClasses[rounded] || 'rounded-2xl'
        } ${sizeTextClasses[size] || sizeTextClasses.xl} ${
          thicknessClasses[thickness] || thicknessClasses.normal
        } ${isHexColor ? 'hover:brightness-110' : variantStyles.btn} ${
          pulse ? 'animate-cta-pulse' : ''
        } ${fullWidth ? 'w-full' : ''}`}
      >
        <span className="shrink-0">{variantStyles.icon}</span>
        <span className="font-extrabold drop-shadow-sm leading-tight text-center">{ctaText}</span>
        <span className="shrink-0 group-hover:translate-x-1.5 transition-transform duration-200">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
      </button>

      {ctaSubtext && (
        <div className={`flex items-center justify-center gap-1.5 text-xs sm:text-sm text-center ${variantStyles.subtext}`}>
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>{ctaSubtext}</span>
        </div>
      )}
    </div>
  );
};

