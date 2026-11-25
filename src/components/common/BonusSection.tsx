import React from 'react';
import { Product, BonusItem } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface BonusSectionProps {
  product: Product;
  badgeText?: string;
  titleText?: string;
  subtitleText?: string;
  accentTextClass?: string;
  accentBgClass?: string;
  accentBorderClass?: string;
  cardBgClass?: string;
  cardBorderClass?: string;
  isLight?: boolean;
}

export const BonusSection: React.FC<BonusSectionProps> = ({
  product,
  badgeText = 'BÔNUS EXCLUSIVOS',
  titleText = 'Levando Hoje, Você Ganha Estes Bônus 100% Grátis',
  subtitleText = 'Ferramentas, materiais e conteúdos práticos que aceleram seus resultados desde o primeiro dia.',
  accentTextClass = 'text-emerald-400',
  accentBgClass = 'bg-emerald-500/10',
  accentBorderClass = 'border-emerald-500/30',
  cardBgClass = 'bg-slate-950/80',
  cardBorderClass = 'border-slate-800',
  isLight = false,
}) => {
  const bonuses: BonusItem[] = product.bonuses || [];

  if (!bonuses || bonuses.length === 0) {
    return null;
  }

  const totalBonusValue = bonuses.reduce((sum, b) => sum + (Number(b.original_value) || 0), 0);

  return (
    <section className={`py-16 sm:py-20 px-4 relative ${isLight ? 'bg-amber-50/40 text-slate-900' : 'text-slate-100'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${accentBgClass} ${accentBorderClass} ${accentTextClass}`}>
            <Gift className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {titleText}
          </h2>

          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {subtitleText}
          </p>
        </div>

        {/* Grade de Cards de Bônus */}
        <div className={`grid grid-cols-1 ${bonuses.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-2xl mx-auto'} gap-5 sm:gap-6`}>
          {bonuses.map((bonus, idx) => {
            const originalVal = Number(bonus.original_value) || 0;
            return (
              <div
                key={bonus.id || idx}
                className={`relative rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] shadow-xl overflow-hidden ${cardBgClass} ${cardBorderClass}`}
              >
                {/* Faixa / Tag do Bônus */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${accentBgClass} ${accentBorderClass} ${accentTextClass}`}>
                      {bonus.tag || `BÔNUS #${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      100% Grátis
                    </span>
                  </div>

                  {/* Imagem do Mockup / Capa do Bônus se houver */}
                  {bonus.image_url ? (
                    <div className="w-full h-40 sm:h-44 rounded-xl overflow-hidden mb-4 border border-slate-800/80 bg-slate-900/60 flex items-center justify-center">
                      <img
                        src={bonus.image_url}
                        alt={bonus.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-xl mb-4 bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900 border border-slate-800/60 flex items-center justify-center">
                      <Sparkles className={`w-8 h-8 opacity-40 ${accentTextClass}`} />
                    </div>
                  )}

                  <h3 className={`text-lg sm:text-xl font-bold mb-2.5 leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {bonus.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {bonus.description}
                  </p>
                </div>

                {/* Ancoragem de Valor: De R$ X por GRÁTIS */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="text-left">
                    {originalVal > 0 ? (
                      <div>
                        <span className="text-[11px] text-slate-500 line-through block">
                          Vendido por {formatPrice(originalVal, product.currency)}
                        </span>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                          Hoje: R$ 0,00 (Grátis)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                        Incluso 100% Grátis
                      </span>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra de Stack de Valor / Resumo Total */}
        {totalBonusValue > 0 && (
          <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/40 text-center shadow-2xl max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-300 font-medium mb-1.5">
              Valor Total dos Bônus se Comprados Separadamente:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl font-black">
              <span className="text-slate-500 line-through">
                {formatPrice(totalBonusValue, product.currency)}
              </span>
              <span className="text-emerald-400">➔</span>
              <span className="text-white bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-xl text-emerald-300 uppercase tracking-wider text-sm sm:text-base">
                R$ 0,00 (Leve Tudo Grátis Hoje)
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
