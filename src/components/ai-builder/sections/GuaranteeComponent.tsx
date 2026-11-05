import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { ShieldCheck, Lock } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const GuaranteeComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const days = p.days || 7;
  const title = p.title || section.title || `Garantia Incondicional de ${days} Dias`;
  const description = p.description || section.subtitle || `Experimente todo o conteúdo por ${days} dias completos. Se por qualquer motivo você achar que não valeu a pena, basta nos enviar um e-mail ou mensagem no WhatsApp e devolveremos 100% do seu dinheiro, sem letras miúdas.`;

  return (
    <div className="py-14 px-4 max-w-4xl mx-auto">
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-xl text-center md:text-left">
        {/* Selo Visual de Garantia */}
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center border shrink-0 relative overflow-hidden"
          style={{
            backgroundColor: `${theme.primaryColor}15`,
            borderColor: `${theme.primaryColor}40`,
            color: theme.primaryColor,
          }}
        >
          <ShieldCheck className="w-10 h-10 mb-1" />
          <span className="text-xl font-black leading-none">{days} DIAS</span>
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">GARANTIA</span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Risco Zero Para Você • Satisfação Garantida</span>
          </div>
        </div>
      </div>
    </div>
  );
};

