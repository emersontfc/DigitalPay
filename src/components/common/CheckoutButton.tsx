import React from 'react';
import confetti from 'canvas-confetti';
import { ShoppingCart, ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';
import { trackInitiateCheckout } from '../../utils/pixel';

interface CheckoutButtonProps {
  ctaText: string;
  ctaUrl: string;
  ctaSubtext?: string;
  promoPrice?: number;
  installmentsText?: string;
  productName?: string;
  currency?: string;
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  size?: 'lg' | 'xl' | 'normal';
  fullWidth?: boolean;
  className?: string;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  ctaText,
  ctaUrl,
  ctaSubtext,
  promoPrice,
  installmentsText,
  productName,
  currency = 'BRL',
  variant = 'neon',
  size = 'xl',
  fullWidth = true,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
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

    // 3. Se a URL for um link válido, abre em nova aba
    if (ctaUrl) {
      window.open(ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const variantStyles = ({
    neon: {
      btn: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)]',
      subtext: 'text-emerald-400/90',
      icon: <Zap className="w-6 h-6 fill-slate-950 text-slate-950 animate-bounce" />,
    },
    luxury: {
      btn: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:from-indigo-500 hover:to-slate-800 text-white font-bold shadow-xl hover:shadow-indigo-500/20 border border-indigo-400/30',
      subtext: 'text-slate-400',
      icon: <ArrowRight className="w-5 h-5 text-indigo-300" />,
    },
    gold: {
      btn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] border-2 border-amber-300',
      subtext: 'text-amber-400/90 font-medium',
      icon: <ShoppingCart className="w-6 h-6 fill-neutral-950 text-neutral-950" />,
    },
    cyan: {
      btn: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)]',
      subtext: 'text-cyan-400/90 font-medium',
      icon: <Zap className="w-6 h-6 fill-slate-950 text-slate-950 animate-bounce" />,
    },
    crimson: {
      btn: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] border border-red-400/30',
      subtext: 'text-red-400/90 font-medium',
      icon: <Zap className="w-6 h-6 fill-white text-white animate-bounce" />,
    },
    rose: {
      btn: 'bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 hover:from-rose-300 hover:to-pink-400 text-white font-black shadow-[0_0_35px_rgba(244,63,94,0.5)] hover:shadow-[0_0_50px_rgba(244,63,94,0.7)]',
      subtext: 'text-rose-300 font-medium',
      icon: <ShoppingCart className="w-6 h-6 fill-white text-white" />,
    },
    blue: {
      btn: 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 hover:from-blue-400 hover:to-indigo-500 text-white font-black shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] border border-blue-400/30',
      subtext: 'text-blue-300 font-medium',
      icon: <Zap className="w-6 h-6 fill-white text-white animate-bounce" />,
    },
    sunset: {
      btn: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)]',
      subtext: 'text-orange-300 font-medium',
      icon: <Zap className="w-6 h-6 fill-slate-950 text-slate-950 animate-bounce" />,
    },
    violet: {
      btn: 'bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-600 hover:from-purple-400 hover:to-violet-500 text-white font-black shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] border border-purple-400/30',
      subtext: 'text-purple-300 font-medium',
      icon: <Zap className="w-6 h-6 fill-white text-white animate-bounce" />,
    },
    emerald: {
      btn: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]',
      subtext: 'text-emerald-300 font-medium',
      icon: <ShoppingCart className="w-6 h-6 fill-slate-950 text-slate-950" />,
    },
    noir: {
      btn: 'bg-gradient-to-r from-zinc-100 via-white to-zinc-200 hover:from-white hover:to-zinc-100 text-black font-black shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] border-2 border-white',
      subtext: 'text-zinc-300 font-medium',
      icon: <ShoppingCart className="w-6 h-6 fill-black text-black" />,
    },
  } as Record<string, any>)[variant] || {
    btn: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)]',
    subtext: 'text-emerald-400/90',
    icon: <Zap className="w-6 h-6 fill-slate-950 text-slate-950 animate-bounce" />,
  };

  const sizeClasses = {
    normal: 'py-2.5 sm:py-3 px-3.5 sm:px-6 text-sm sm:text-base',
    lg: 'py-3.5 sm:py-4 px-4 sm:px-8 text-sm sm:text-lg',
    xl: 'py-3.5 sm:py-5 px-4 sm:px-8 text-sm sm:text-lg md:text-xl',
  }[size];

  return (
    <div className={`flex flex-col items-center gap-2.5 ${fullWidth ? 'w-full' : 'inline-flex'} ${className}`}>
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-2 sm:gap-3 rounded-2xl transition-all duration-300 transform active:scale-95 cursor-pointer uppercase tracking-wider text-center ${sizeClasses} ${variantStyles.btn} ${fullWidth ? 'w-full' : ''}`}
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

