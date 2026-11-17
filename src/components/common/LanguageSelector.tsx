import React, { useState, useRef, useEffect } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  useSalesPageLanguage,
  LanguageOption
} from '../../utils/i18n';
import { ChevronDown, Check, Coins } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'pills' | 'minimal' | 'currency-pill';
  lightMode?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  lightMode = false,
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

  const getShortCode = (code: SupportedLanguage) => {
    if (code === 'pt-mz') return 'MZ';
    if (code === 'pt-ao') return 'AO';
    if (code === 'pt') return 'PT';
    return code.toUpperCase();
  };

  // 1. VARIANTE PILLS (Bandeiras lado a lado)
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
              className={`px-1.5 sm:px-2 py-1 rounded-lg font-bold flex items-center gap-1 sm:gap-1.5 transition-all text-xs cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={`${opt.label} (${opt.currencySymbol})`}
            >
              <span className="text-sm">{opt.flag}</span>
              <span className="uppercase text-[10px] sm:text-[11px] font-black">{getShortCode(opt.code)}</span>
              <span className={`text-[9px] sm:text-[10px] opacity-80 ${isActive ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                {opt.currencySymbol}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. VARIANTE CURRENCY-PILL (Seletor de Moeda direto no bloco de Preço / CTA)
  if (variant === 'currency-pill') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border active:scale-95 ${
            lightMode
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
          }`}
          title="Alterar moeda do pagamento"
        >
          <Coins className={`w-3.5 h-3.5 ${lightMode ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <span>{currentLang === 'en' ? 'Currency:' : currentLang === 'es' ? 'Moneda:' : 'Moeda:'}</span>
          <span className="text-sm leading-none">{activeOption.flag}</span>
          <span className={`font-mono font-extrabold ${lightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {activeOption.currency} ({activeOption.currencySymbol})
          </span>
          <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
              {currentLang === 'en' ? 'Select Currency & Country' : currentLang === 'es' ? 'Seleccionar Moneda' : 'Mudar Moeda & País'}
            </div>
            <div className="space-y-0.5 max-h-64 overflow-y-auto">
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
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{opt.flag}</span>
                      <div className="min-w-0">
                        <span className="block leading-tight font-semibold truncate">{opt.currency} ({opt.currencySymbol})</span>
                        <span className="text-[10px] text-slate-400 block truncate">{opt.label}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. VARIANTE COMPACTA (Dropdown Elegante e 100% Responsivo)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-0.5 sm:py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
          lightMode
            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-slate-950/85 hover:bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
        }`}
        title="Alterar país, moeda e idioma da oferta"
      >
        <span className="text-xs sm:text-sm">{activeOption.flag}</span>
        <span className="uppercase tracking-wider text-[10px] font-black hidden sm:inline">
          {getShortCode(activeOption.code)}
        </span>
        <span className={`text-[10px] font-mono font-bold px-1 py-0.5 rounded border ${
          lightMode
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        }`}>
          {activeOption.currencySymbol}
        </span>
        <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu suspenso flutuante com clamp para não vazar a tela no celular */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1">
            País, Idioma & Moeda
          </div>

          <div className="space-y-0.5 max-h-72 overflow-y-auto">
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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{opt.flag}</span>
                    <div className="min-w-0">
                      <span className="block leading-tight font-semibold truncate">{opt.label}</span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        Moeda: {opt.currency} ({opt.currencySymbol})
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
