import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const BeforeAfterComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'A Transformação Que Você Vai Viver';
  const subtitle = p.subtitle || section.subtitle || 'Veja a diferença entre continuar no mesmo caminho ou dar o próximo passo:';
  const beforeTitle = p.beforeTitle || 'Sem Este Método (Antes)';
  const afterTitle = p.afterTitle || 'Com o Método Digitall Pay (Depois)';
  
  const beforePoints = p.beforePoints || [
    'Tentativas frustradas sem saber por onde começar',
    'Gastos com testes desnecessários que não geram retorno',
    'Insegurança sobre precificação e atração de clientes',
    'Sensação de trabalhar muito e ter pouco resultado',
  ];

  const afterPoints = p.afterPoints || [
    'Passo a passo claro e validado desde o primeiro dia',
    'Economia de tempo e recursos focando apenas no que converte',
    'Oferta estruturada e confiança total no seu posicionamento',
    'Vendas previsíveis e consistência de faturamento',
  ];

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Lado Antes / Negativo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-6">
            <XCircle className="w-6 h-6 text-rose-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">{beforeTitle}</h3>
          </div>

          <div className="space-y-4">
            {beforePoints.map((pt: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Depois / Positivo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">{afterTitle}</h3>
          </div>

          <div className="space-y-4">
            {afterPoints.map((pt: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

