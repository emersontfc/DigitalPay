import React, { useState } from 'react';
import { Product } from '../../types';
import { Shield, ShieldCheck, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useSalesPageLanguage, UI_TRANSLATIONS } from '../../utils/i18n';

interface GuaranteeSectionProps {
  product: Product;
  defaultColor?: 'emerald' | 'gold' | 'indigo' | 'blue' | 'red' | 'purple' | 'rose' | 'orange' | 'cyan' | 'noir';
  lightMode?: boolean;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  product,
  defaultColor = 'emerald',
  lightMode = false,
}) => {
  const ds = product.design_settings || {};
  const [expanded, setExpanded] = useState(false);
  const [currentLang] = useSalesPageLanguage();
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.pt;

  // Permite desativar completamente ou ocultar se guarantee_days <= 0
  if (ds.guarantee_enabled === false || product.guarantee_days <= 0) {
    return null;
  }

  const style = ds.guarantee_style || 'card';
  const size = ds.guarantee_size || 'md';
  const colorChoice = ds.guarantee_color && ds.guarantee_color !== 'auto' ? ds.guarantee_color : defaultColor;
  const isHex = colorChoice.startsWith('#');

  const daysLabel = currentLang === 'en' ? 'DAYS' : currentLang === 'es' ? 'DÍAS' : 'DIAS';
  const title = ds.guarantee_title?.trim() || t.guarantee_title.replace('{days}', String(product.guarantee_days));
  const description = ds.guarantee_description?.trim() || t.guarantee_desc.replace('{days}', String(product.guarantee_days));
  const buttonText = ds.guarantee_button_text?.trim();

  const palette = ({
    emerald: {
      border: 'border-emerald-500/35',
      bg: lightMode ? 'bg-emerald-50' : 'bg-emerald-950/25',
      badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40',
      text: lightMode ? 'text-emerald-700' : 'text-emerald-400',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25',
    },
    gold: {
      border: 'border-amber-500/40',
      bg: lightMode ? 'bg-amber-50' : 'bg-amber-950/20',
      badge: 'bg-amber-500/15 text-amber-500 border-amber-500/40',
      text: lightMode ? 'text-amber-700' : 'text-amber-400',
      btn: 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/25',
    },
    indigo: {
      border: 'border-indigo-500/35',
      bg: lightMode ? 'bg-indigo-50' : 'bg-indigo-950/25',
      badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40',
      text: lightMode ? 'text-indigo-700' : 'text-indigo-400',
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25',
    },
    blue: {
      border: 'border-blue-500/35',
      bg: lightMode ? 'bg-blue-50' : 'bg-blue-950/25',
      badge: 'bg-blue-500/15 text-blue-500 border-blue-500/40',
      text: lightMode ? 'text-blue-700' : 'text-blue-400',
      btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25',
    },
    red: {
      border: 'border-red-500/35',
      bg: lightMode ? 'bg-red-50' : 'bg-red-950/25',
      badge: 'bg-red-500/15 text-red-500 border-red-500/40',
      text: lightMode ? 'text-red-700' : 'text-red-400',
      btn: 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/25',
    },
    purple: {
      border: 'border-purple-500/35',
      bg: lightMode ? 'bg-purple-50' : 'bg-purple-950/25',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
      text: lightMode ? 'text-purple-700' : 'text-purple-300',
      btn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25',
    },
    rose: {
      border: 'border-rose-500/35',
      bg: lightMode ? 'bg-rose-50' : 'bg-rose-950/25',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
      text: lightMode ? 'text-rose-700' : 'text-rose-300',
      btn: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25',
    },
    orange: {
      border: 'border-orange-500/35',
      bg: lightMode ? 'bg-orange-50' : 'bg-orange-950/25',
      badge: 'bg-orange-500/15 text-orange-500 border-orange-500/40',
      text: lightMode ? 'text-orange-700' : 'text-orange-400',
      btn: 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-orange-500/25',
    },
    cyan: {
      border: 'border-cyan-500/35',
      bg: lightMode ? 'bg-cyan-50' : 'bg-cyan-950/25',
      badge: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/40',
      text: lightMode ? 'text-cyan-700' : 'text-cyan-400',
      btn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25',
    },
    white: {
      border: lightMode ? 'border-slate-300' : 'border-zinc-600',
      bg: lightMode ? 'bg-white' : 'bg-zinc-900',
      badge: lightMode ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-zinc-800 text-white border-zinc-600',
      text: lightMode ? 'text-slate-900' : 'text-white',
      btn: 'bg-white hover:bg-zinc-200 text-black',
    },
    noir: {
      border: 'border-zinc-700',
      bg: 'bg-zinc-900/90',
      badge: 'bg-zinc-800 text-white border-zinc-600',
      text: 'text-zinc-200',
      btn: 'bg-white hover:bg-zinc-200 text-black',
    },
  } as Record<string, any>)[colorChoice] || {
    border: 'border-emerald-500/35',
    bg: lightMode ? 'bg-emerald-50' : 'bg-emerald-950/25',
    badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40',
    text: lightMode ? 'text-emerald-700' : 'text-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25',
  };

  const sizeConfig = {
    sm: {
      sectionPy: 'py-8',
      pad: 'p-4 sm:p-5',
      iconBox: 'w-14 h-14',
      icon: 'w-6 h-6',
      title: 'text-base sm:text-lg',
      desc: 'text-xs',
      btn: 'px-4 py-2 text-xs',
    },
    md: {
      sectionPy: 'py-12',
      pad: 'p-6 sm:p-8',
      iconBox: 'w-20 h-20',
      icon: 'w-9 h-9',
      title: 'text-lg sm:text-2xl',
      desc: 'text-xs sm:text-sm',
      btn: 'px-5 py-2.5 text-xs sm:text-sm',
    },
    lg: {
      sectionPy: 'py-16',
      pad: 'p-8 sm:p-10',
      iconBox: 'w-24 h-24',
      icon: 'w-12 h-12',
      title: 'text-xl sm:text-3xl',
      desc: 'text-sm sm:text-base',
      btn: 'px-6 py-3 text-sm sm:text-base',
    },
  }[size];

  const titleColor = lightMode ? 'text-slate-900' : 'text-white';
  const descColor = lightMode ? 'text-slate-600' : 'text-slate-300';

  const scrollToCheckout = () => {
    const el = document.getElementById('checkout-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ESTILO 1: BOTÃO-SELO AJUSTÁVEL (Compacto, clicável para ver os termos)
  if (style === 'badge-button') {
    return (
      <section className={`${sizeConfig.sectionPy} px-4 max-w-2xl mx-auto text-center`}>
        <div className="inline-flex flex-col items-center w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={isHex ? { backgroundColor: `${colorChoice}22`, borderColor: colorChoice, color: colorChoice } : undefined}
            className={`w-full ${sizeConfig.btn} rounded-2xl border-2 font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:scale-[1.02] ${
              isHex ? '' : `${palette.bg} ${palette.border} ${palette.text}`
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{buttonText || title}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div
              className={`mt-3 p-4 rounded-2xl border text-left animate-in fade-in slide-in-from-top-2 duration-200 ${
                lightMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/95 border-slate-800 text-slate-300'
              } ${sizeConfig.desc} leading-relaxed`}
            >
              <p>{description}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ESTILO 2: SELO PREMIUM CENTRALIZADO
  if (style === 'seal') {
    return (
      <section className={`${sizeConfig.sectionPy} px-4 max-w-2xl mx-auto text-center`}>
        <div
          style={isHex ? { borderColor: `${colorChoice}66` } : undefined}
          className={`${sizeConfig.pad} rounded-3xl border-2 ${isHex ? (lightMode ? 'bg-white' : 'bg-slate-900/80') : `${palette.bg} ${palette.border}`} flex flex-col items-center gap-4 shadow-xl`}
        >
          <div
            style={isHex ? { backgroundColor: `${colorChoice}20`, borderColor: colorChoice, color: colorChoice } : undefined}
            className={`${sizeConfig.iconBox} rounded-full border-2 flex flex-col items-center justify-center shrink-0 ${isHex ? '' : palette.badge}`}
          >
            <Shield className={sizeConfig.icon} />
            <span className="text-[11px] font-black leading-none mt-0.5">{product.guarantee_days} {daysLabel}</span>
          </div>
          <h3 className={`font-black ${sizeConfig.title} ${titleColor}`}>{title}</h3>
          <p className={`${sizeConfig.desc} ${descColor} max-w-lg leading-relaxed`}>{description}</p>
          {buttonText && (
            <button
              type="button"
              onClick={scrollToCheckout}
              style={isHex ? { backgroundColor: colorChoice, color: '#ffffff' } : undefined}
              className={`mt-1 ${sizeConfig.btn} rounded-xl font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer ${isHex ? '' : palette.btn}`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </section>
    );
  }

  // ESTILO 3: MINIMALISTA HORIZONTAL
  if (style === 'minimal') {
    return (
      <section className="py-8 px-4 max-w-3xl mx-auto">
        <div
          style={isHex ? { borderColor: `${colorChoice}55` } : undefined}
          className={`px-5 py-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            isHex ? (lightMode ? 'bg-slate-50' : 'bg-slate-900/60') : `${palette.bg} ${palette.border}`
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 style={isHex ? { color: colorChoice } : undefined} className={`w-6 h-6 shrink-0 ${isHex ? '' : palette.text}`} />
            <div>
              <h4 className={`font-bold text-sm ${titleColor}`}>{title}</h4>
              <p className={`text-xs ${descColor}`}>{description}</p>
            </div>
          </div>
          {buttonText && (
            <button
              type="button"
              onClick={scrollToCheckout}
              style={isHex ? { backgroundColor: colorChoice, color: '#ffffff' } : undefined}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer ${isHex ? '' : palette.btn}`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </section>
    );
  }

  // ESTILO 4 (PADRÃO): CARD COMPLETO COM ESCUDO + BOTÃO OPCIONAL
  return (
    <section className={`${sizeConfig.sectionPy} px-4 max-w-3xl mx-auto`}>
      <div
        style={isHex ? { borderColor: `${colorChoice}66` } : undefined}
        className={`${sizeConfig.pad} rounded-3xl border-2 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-xl ${
          isHex ? (lightMode ? 'bg-white' : 'bg-slate-900/80') : `${palette.bg} ${palette.border}`
        }`}
      >
        <div
          style={isHex ? { backgroundColor: `${colorChoice}20`, borderColor: colorChoice, color: colorChoice } : undefined}
          className={`${sizeConfig.iconBox} rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${isHex ? '' : palette.badge}`}
        >
          <Shield className={`${sizeConfig.icon} mb-0.5`} />
          <span className="text-[11px] font-black leading-none">
            {product.guarantee_days} {daysLabel}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <span style={isHex ? { color: colorChoice } : undefined} className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${isHex ? '' : palette.text}`}>
            <Sparkles className="w-3 h-3" />
            Risco Zero
          </span>
          <h3 className={`font-black ${sizeConfig.title} ${titleColor}`}>{title}</h3>
          <p className={`${sizeConfig.desc} ${descColor} leading-relaxed`}>{description}</p>
          {buttonText && (
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToCheckout}
                style={isHex ? { backgroundColor: colorChoice, color: '#ffffff' } : undefined}
                className={`${sizeConfig.btn} rounded-xl font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer ${isHex ? '' : palette.btn}`}
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
