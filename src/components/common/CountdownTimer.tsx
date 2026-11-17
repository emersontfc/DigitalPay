import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  customColor?: string; // 'auto' | 'red' | 'green' | 'gold' | 'blue' | 'orange' | 'purple' | 'rose' | 'black' | '#hex'
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes = 15,
  variant = 'neon',
  customColor,
  label = 'Esta condição especial encerra em:',
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = sessionStorage.getItem(`digitalpay_countdown_${initialMinutes}`);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return initialMinutes * 60;
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        sessionStorage.setItem(`digitalpay_countdown_${initialMinutes}`, next.toString());
        return next > 0 ? next : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, initialMinutes]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Mapeia nomes amigáveis de cor do editor para variantes
  const colorAlias: Record<string, string> = {
    red: 'red-solid',
    green: 'green-solid',
    gold: 'gold',
    blue: 'blue',
    orange: 'sunset',
    purple: 'violet',
    rose: 'rose',
    black: 'noir',
    cyan: 'cyan',
  };

  const effectiveVariant =
    customColor && customColor !== 'auto' && !customColor.startsWith('#')
      ? colorAlias[customColor] || customColor
      : variant;

  const isCustomHex = Boolean(customColor && customColor.startsWith('#'));

  // Variantes visuais
  const variantStyles = ({
    'red-solid': {
      bar: 'bg-red-700/95 border-red-500/60 text-white',
      badge: 'bg-white text-red-700',
      digitBox: 'bg-red-950/70 border border-red-300/40 text-white shadow-sm',
    },
    'green-solid': {
      bar: 'bg-emerald-700/95 border-emerald-400/60 text-white',
      badge: 'bg-white text-emerald-700',
      digitBox: 'bg-emerald-950/70 border border-emerald-300/40 text-white shadow-sm',
    },
    neon: {
      bar: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500 text-slate-950',
      digitBox: 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300',
    },
    luxury: {
      bar: 'bg-slate-900/95 border-indigo-500/30 text-indigo-200',
      badge: 'bg-indigo-600 text-white',
      digitBox: 'bg-slate-800/80 border border-indigo-500/30 text-white',
    },
    gold: {
      bar: 'bg-neutral-900/95 border-amber-500/40 text-amber-300',
      badge: 'bg-amber-500 text-neutral-950 font-black',
      digitBox: 'bg-neutral-800 border border-amber-500/50 text-amber-400',
    },
    cyan: {
      bar: 'bg-cyan-950/90 border-cyan-500/30 text-cyan-300',
      badge: 'bg-cyan-500 text-slate-950 font-black',
      digitBox: 'bg-cyan-900/60 border border-cyan-500/40 text-cyan-200',
    },
    crimson: {
      bar: 'bg-red-950/90 border-red-500/40 text-red-200',
      badge: 'bg-red-600 text-white font-black',
      digitBox: 'bg-red-900/60 border border-red-500/50 text-white',
    },
    rose: {
      bar: 'bg-rose-950/90 border-rose-500/30 text-rose-200',
      badge: 'bg-rose-500 text-white font-bold',
      digitBox: 'bg-rose-900/50 border border-rose-500/40 text-rose-100',
    },
    blue: {
      bar: 'bg-blue-950/90 border-blue-500/30 text-blue-200',
      badge: 'bg-blue-600 text-white font-bold',
      digitBox: 'bg-blue-900/60 border border-blue-500/40 text-white',
    },
    sunset: {
      bar: 'bg-orange-950/90 border-orange-500/35 text-orange-200',
      badge: 'bg-orange-500 text-slate-950 font-black',
      digitBox: 'bg-orange-900/60 border border-orange-500/40 text-white',
    },
    violet: {
      bar: 'bg-purple-950/90 border-purple-500/35 text-purple-200',
      badge: 'bg-purple-600 text-white font-black',
      digitBox: 'bg-purple-900/60 border border-purple-500/40 text-white',
    },
    emerald: {
      bar: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
      badge: 'bg-emerald-600 text-white font-bold',
      digitBox: 'bg-emerald-900/60 border border-emerald-500/40 text-white',
    },
    noir: {
      bar: 'bg-zinc-950/95 border-zinc-700 text-zinc-200',
      badge: 'bg-zinc-200 text-black font-black',
      digitBox: 'bg-zinc-900 border border-zinc-700 text-white',
    },
  } as Record<string, any>)[effectiveVariant] || {
    bar: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400',
    badge: 'bg-emerald-500 text-slate-950',
    digitBox: 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300',
  };

  return (
    <div
      style={
        isCustomHex
          ? { backgroundColor: customColor, borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }
          : undefined
      }
      className={`w-full py-1 sm:py-1.5 px-2.5 sm:px-4 backdrop-blur-md border-b flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-medium transition-all ${
        isCustomHex ? '' : variantStyles.bar
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 font-semibold text-center">
        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-inherit shrink-0" style={{ animationDuration: '8s' }} />
        <span className="leading-tight">{label}</span>
      </div>

      <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold shrink-0">
        {hours > 0 && (
          <>
            <div
              className={`px-1.5 py-0.5 rounded leading-none ${
                isCustomHex ? 'bg-black/30 border border-white/25 text-white' : variantStyles.digitBox
              }`}
            >
              {pad(hours)}
            </div>
            <span>:</span>
          </>
        )}
        <div
          className={`px-1.5 py-0.5 rounded leading-none ${
            isCustomHex ? 'bg-black/30 border border-white/25 text-white' : variantStyles.digitBox
          }`}
        >
          {pad(minutes)}
        </div>
        <span className="animate-pulse">:</span>
        <div
          className={`px-1.5 py-0.5 rounded leading-none ${
            isCustomHex ? 'bg-black/30 border border-white/25 text-white' : variantStyles.digitBox
          }`}
        >
          {pad(seconds)}
        </div>
      </div>
    </div>
  );
};

