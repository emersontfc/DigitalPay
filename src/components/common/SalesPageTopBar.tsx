import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Lock } from 'lucide-react';

interface SalesPageTopBarProps {
  variant?: 'neon' | 'luxury' | 'gold';
}

export const SalesPageTopBar: React.FC<SalesPageTopBarProps> = ({ variant = 'neon' }) => {
  const styles = {
    neon: {
      bar: 'bg-[#07090e]/95 border-b border-slate-800/80',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      icon: 'text-emerald-400',
    },
    luxury: {
      bar: 'bg-[#0b0f19]/95 border-b border-slate-800/60',
      badge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
      icon: 'text-indigo-400',
    },
    gold: {
      bar: 'bg-[#080808]/95 border-b border-amber-950/40',
      badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
      icon: 'text-amber-400',
    },
  }[variant];

  return (
    <div className={`w-full py-2.5 px-4 sm:px-6 ${styles.bar} backdrop-blur-md sticky top-0 z-30 transition-all`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo Digitall Pay no Topo */}
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" variant={variant} showText={true} />
        </div>

        {/* Selo de Segurança e Confiança Oficial */}
        <div className="flex items-center gap-2">
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
            <Lock className="w-3 h-3" />
            <span>Ambiente Seguro • Checkout Criptografado</span>
          </div>

          <div className="sm:hidden flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <ShieldCheck className={`w-3.5 h-3.5 ${styles.icon}`} />
            <span>Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
