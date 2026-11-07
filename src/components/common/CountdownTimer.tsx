import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes = 15,
  variant = 'neon',
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

  // Variantes visuais
  const variantStyles = ({
    neon: {
      bar: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500 text-slate-950',
      digitBox: 'bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    luxury: {
      bar: 'bg-slate-900/90 border-indigo-500/30 text-indigo-200',
      badge: 'bg-indigo-600 text-white',
      digitBox: 'bg-slate-800/80 border border-indigo-500/30 text-white shadow-sm',
    },
    gold: {
      bar: 'bg-neutral-900/90 border-amber-500/40 text-amber-300',
      badge: 'bg-amber-500 text-neutral-950 font-black',
      digitBox: 'bg-neutral-800 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
    cyan: {
      bar: 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300',
      badge: 'bg-cyan-500 text-slate-950 font-black',
      digitBox: 'bg-cyan-900/50 border border-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    },
    crimson: {
      bar: 'bg-red-950/80 border-red-500/30 text-red-300',
      badge: 'bg-red-600 text-white font-black',
      digitBox: 'bg-red-900/50 border border-red-500/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    },
    rose: {
      bar: 'bg-rose-950/80 border-rose-500/30 text-rose-300',
      badge: 'bg-rose-500 text-white font-bold',
      digitBox: 'bg-rose-900/40 border border-rose-500/40 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
    },
    blue: {
      bar: 'bg-blue-950/80 border-blue-500/30 text-blue-300',
      badge: 'bg-blue-600 text-white font-bold',
      digitBox: 'bg-blue-900/50 border border-blue-500/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    },
    sunset: {
      bar: 'bg-orange-950/80 border-orange-500/30 text-orange-300',
      badge: 'bg-orange-500 text-slate-950 font-black',
      digitBox: 'bg-orange-900/50 border border-orange-500/40 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
    },
    violet: {
      bar: 'bg-purple-950/80 border-purple-500/30 text-purple-300',
      badge: 'bg-purple-600 text-white font-black',
      digitBox: 'bg-purple-900/50 border border-purple-500/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    },
    emerald: {
      bar: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300',
      badge: 'bg-emerald-600 text-white font-bold',
      digitBox: 'bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    noir: {
      bar: 'bg-zinc-950/90 border-zinc-700 text-zinc-300',
      badge: 'bg-zinc-200 text-black font-black',
      digitBox: 'bg-zinc-900 border border-zinc-700 text-white shadow-sm',
    },
  } as Record<string, any>)[variant] || {
    bar: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400',
    badge: 'bg-emerald-500 text-slate-950',
    digitBox: 'bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  };

  return (
    <div className={`w-full py-2.5 px-4 backdrop-blur-md border-b flex flex-wrap items-center justify-center gap-3 text-sm font-medium transition-all ${variantStyles.bar}`}>
      <div className="flex items-center gap-2 font-semibold">
        <Clock className="w-4 h-4 animate-spin text-inherit" style={{ animationDuration: '8s' }} />
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-base font-bold">
        {hours > 0 && (
          <>
            <div className={`px-2 py-0.5 rounded ${variantStyles.digitBox}`}>
              {pad(hours)}
            </div>
            <span>:</span>
          </>
        )}
        <div className={`px-2 py-0.5 rounded ${variantStyles.digitBox}`}>
          {pad(minutes)}
        </div>
        <span className="animate-pulse">:</span>
        <div className={`px-2 py-0.5 rounded ${variantStyles.digitBox}`}>
          {pad(seconds)}
        </div>
      </div>
    </div>
  );
};

