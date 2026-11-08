import React, { useState, useRef, useEffect } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  useSalesPageLanguage,
  LanguageOption
} from '../../utils/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'pills' | 'minimal';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const [currentLang, setLang] = useSalesPageLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption: LanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (lang: SupportedLanguage) => {
    setLang(lang);
    setIsOpen(false);
  };

  // 1. VARIANTE PILLS (Bandeiras lado a lado, ótima para TopBar)
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs ${className}`}>
        {SUPPORTED_LANGUAGES.map((opt) => {
          const isActive = opt.code === currentLang;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => handleSelect(opt.code)}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={`${opt.label} (${opt.currencySymbol})`}
            >
              <span>{opt.flag}</span>
              <span className="uppercase text-[11px] font-black">{opt.code}</span>
              <span className={`text-[10px] opacity-80 ${isActive ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                {opt.currencySymbol}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. VARIANTE COMPACTA (Dropdown Elegante com Globo)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-700"
        title="Alterar idioma e moeda"
      >
        <span className="text-sm">{activeOption.flag}</span>
        <span className="uppercase tracking-wider text-[11px] font-black">{activeOption.code}</span>
        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
          {activeOption.currencySymbol}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu suspenso */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1">
            Idioma & Moeda
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((opt) => {
              const isSelected = opt.code === currentLang;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <div>
                      <span className="block leading-tight font-semibold">{opt.label}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Moeda: {opt.currency} ({opt.currencySymbol})
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
