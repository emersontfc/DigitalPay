import React from 'react';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { useSalesPageLanguage, UI_TRANSLATIONS } from '../../utils/i18n';
import { Lock } from 'lucide-react';

interface SalesPageTopBarProps {
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  showLanguageSelector?: boolean;
}

export const SalesPageTopBar: React.FC<SalesPageTopBarProps> = ({
  variant = 'neon',
  showLanguageSelector = false,
}) => {
  const [currentLang] = useSalesPageLanguage();
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.pt;

  const styles = ({
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
    cyan: {
      bar: 'bg-[#040812]/95 border-b border-cyan-950/40',
      badge: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
      icon: 'text-cyan-400',
    },
    crimson: {
      bar: 'bg-[#0b0507]/95 border-b border-red-950/40',
      badge: 'bg-red-500/10 text-red-300 border border-red-500/20',
      icon: 'text-red-400',
    },
    rose: {
      bar: 'bg-[#0e070a]/95 border-b border-rose-950/40',
      badge: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
      icon: 'text-rose-400',
    },
    blue: {
      bar: 'bg-[#030917]/95 border-b border-blue-950/40',
      badge: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
      icon: 'text-blue-400',
    },
    sunset: {
      bar: 'bg-[#0d0703]/95 border-b border-orange-950/40',
      badge: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
      icon: 'text-orange-400',
    },
    violet: {
      bar: 'bg-[#090514]/95 border-b border-purple-950/40',
      badge: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
      icon: 'text-purple-400',
    },
    emerald: {
      bar: 'bg-[#040d08]/95 border-b border-emerald-950/40',
      badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
      icon: 'text-emerald-400',
    },
    noir: {
      bar: 'bg-[#050505]/95 border-b border-zinc-800',
      badge: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
      icon: 'text-zinc-300',
      isLight: false,
    },
    ivory: {
      bar: 'bg-[#fbf8f3]/95 border-b border-amber-900/10',
      badge: 'bg-amber-900/5 text-amber-900 border border-amber-900/15',
      icon: 'text-amber-800',
      isLight: true,
    },
    'ocean-light': {
      bar: 'bg-white/95 border-b border-slate-200',
      badge: 'bg-sky-50 text-sky-800 border border-sky-200',
      icon: 'text-sky-600',
      isLight: true,
    },
  } as Record<string, any>)[variant] || {
    bar: 'bg-[#07090e]/95 border-b border-slate-800/80',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    icon: 'text-emerald-400',
    isLight: false,
  };

  const logoVariant = styles.isLight
    ? 'light'
    : ((['neon', 'luxury', 'gold'].includes(variant) ? variant : 'neon') as 'neon' | 'luxury' | 'gold');

  return (
    <div className={`w-full py-1 sm:py-1.5 px-3 sm:px-5 ${styles.bar} backdrop-blur-md sticky top-0 z-30 transition-all`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo Digitall Pay ultrafina no Topo */}
        <div className="flex items-center gap-1.5">
          <BrandLogo
            size="xs"
            variant={logoVariant}
            showText={true}
          />
        </div>

        {/* Lado Direito: Selo de Segurança discreto + Seletor de Idioma & Moeda (se ativado) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
            <Lock className="w-2.5 h-2.5" />
            <span>{t.security_badge}</span>
          </div>

          {showLanguageSelector && (
            <LanguageSelector variant="compact" lightMode={Boolean(styles.isLight)} />
          )}
        </div>
      </div>
    </div>
  );
};
