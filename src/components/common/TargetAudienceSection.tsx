import React from 'react';
import { Product } from '../../types';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

interface TargetAudienceSectionProps {
  product: Product;
  isLight?: boolean;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({
  product,
  isLight = false,
}) => {
  const ta = product.target_audience;

  if (!ta || ta.enabled === false) {
    return null;
  }

  const forWhom = ta.for_whom || [];
  const notForWhom = ta.not_for_whom || [];

  if (forWhom.length === 0 && notForWhom.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 sm:py-20 px-4 relative ${isLight ? 'bg-slate-100/60 text-slate-900' : 'text-slate-100'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <Users className="w-3.5 h-3.5" />
            <span>Público-Alvo & Alinhamento</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {ta.title || 'Será que este produto é para você?'}
          </h2>

          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {ta.subtitle || 'Transparência total: veja com clareza para quem este conteúdo foi desenvolvido e quem NÃO deve entrar.'}
          </p>
        </div>

        {/* Comparativo em 2 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Coluna 1: Para quem É (Positivo / Verde) */}
          {forWhom.length > 0 && (
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-xl flex flex-col justify-between ${
              isLight
                ? 'bg-emerald-50/70 border-emerald-300/80 shadow-emerald-500/5'
                : 'bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-500/40 shadow-emerald-500/5'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      Qualificação
                    </span>
                    <h3 className={`text-lg sm:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Este produto É para você se:
                    </h3>
                  </div>
                </div>

                <ul className="space-y-4">
                  {forWhom.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className={isLight ? 'text-slate-800 font-medium' : 'text-slate-200'}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Encaixe perfeito com seu objetivo atual</span>
              </div>
            </div>
          )}

          {/* Coluna 2: Para quem NÃO É (Desqualificação / Vermelho) */}
          {notForWhom.length > 0 && (
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-xl flex flex-col justify-between ${
              isLight
                ? 'bg-rose-50/70 border-rose-300/80 shadow-rose-500/5'
                : 'bg-gradient-to-b from-rose-950/20 to-slate-950 border-rose-500/30 shadow-rose-500/5'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
                      Desqualificação
                    </span>
                    <h3 className={`text-lg sm:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Este produto NÃO é para você se:
                    </h3>
                  </div>
                </div>

                <ul className="space-y-4">
                  {notForWhom.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <XCircle className="w-4 h-4" />
                <span>Preferimos sua honestidade a uma venda errada</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
