import React from 'react';
import { Product, StudyPlanStep } from '../../types';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StudyPlanSectionProps {
  product: Product;
  isLight?: boolean;
  accentTextClass?: string;
  accentBgClass?: string;
  accentBorderClass?: string;
  cardBgClass?: string;
  cardBorderClass?: string;
}

export const StudyPlanSection: React.FC<StudyPlanSectionProps> = ({
  product,
  isLight = false,
  accentTextClass = 'text-emerald-400',
  accentBgClass = 'bg-emerald-500/10',
  accentBorderClass = 'border-emerald-500/30',
  cardBgClass = 'bg-slate-950/80',
  cardBorderClass = 'border-slate-800',
}) => {
  const plan = product.study_plan;

  if (!plan || plan.enabled === false) {
    return null;
  }

  const steps: StudyPlanStep[] = plan.steps || [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 sm:py-20 px-4 relative ${isLight ? 'bg-slate-100/40 text-slate-900' : 'text-slate-100'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${accentBgClass} ${accentBorderClass} ${accentTextClass}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>Cronograma & Jornada Prática</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {plan.title || 'Seu Plano de Estudos e Execução'}
          </h2>

          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {plan.subtitle || 'Uma trajetória estruturada passo a passo para você aplicar o conhecimento sem se perder no caminho:'}
          </p>
        </div>

        {/* Linha do Tempo / Etapas */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8 sm:space-y-10">
          {steps.map((step, idx) => (
            <div key={step.id || idx} className="relative group">
              {/* Marcador Numérico na Linha */}
              <div className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-black text-xs shadow-lg transition-transform group-hover:scale-110 ${
                isLight
                  ? 'bg-white border-emerald-500 text-emerald-600'
                  : 'bg-slate-950 border-emerald-400 text-emerald-400'
              }`}>
                {idx + 1}
              </div>

              {/* Card da Etapa */}
              <div className={`rounded-2xl p-5 sm:p-6 border shadow-xl transition-all duration-300 hover:border-emerald-500/50 ${cardBgClass} ${cardBorderClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${accentBgClass} ${accentBorderClass} ${accentTextClass}`}>
                    {step.phase || `Etapa ${idx + 1}`}
                  </span>

                  {step.duration && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{step.duration}</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {step.title}
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
