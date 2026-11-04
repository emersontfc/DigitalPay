import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  variant?: 'neon' | 'luxury' | 'gold';
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
  const variantStyles = {
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
  }[variant];

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

