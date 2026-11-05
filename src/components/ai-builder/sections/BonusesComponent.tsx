import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { Gift, Sparkles, Check } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
  currency: string;
}

export const BonusesComponent: React.FC<Props> = ({ section, theme, currency }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Bónus Exclusivos Para Inscrições Hoje';
  const subtitle = p.subtitle || section.subtitle || 'Ao garantir sua vaga agora, você também recebe estes bónus especiais sem nenhum custo extra:';
  const bonuses = p.items || [
    {
      title: 'Bónus #1: Pack de Modelos e Modelos Prontos de Anúncios',
      description: 'Templates prontos para você copiar, colar e começar a rodar suas campanhas hoje mesmo.',
      value: `Avaliado em 1.500 ${currency}`,
    },
    {
      title: 'Bónus #2: Gravação da Mentoria Fechada de Tráfego',
      description: 'Acesso completo aos bastidores e estratégias ao vivo com análise prática de campanhas.',
      value: `Avaliado em 2.000 ${currency}`,
    },
    {
      title: 'Bónus #3: Comunidade Secreta de Alunos no WhatsApp',
      description: 'Espaço exclusivo para tirar dúvidas, fazer parcerias de negócios e trocar experiências.',
      value: 'Inestimável',
    },
  ];

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border"
          style={{
            backgroundColor: `${theme.primaryColor}15`,
            color: theme.primaryColor,
            borderColor: `${theme.primaryColor}30`,
          }}
        >
          <Gift className="w-4 h-4" />
          <span>Presente Especial</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bonuses.map((b: any, idx: number) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Gift className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  GRÁTIS HOJE
                </span>
              </div>

              <h3 className="font-bold text-white text-base mb-2">{b.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {b.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 line-through">{b.value}</span>
              <span className="text-emerald-400 font-bold uppercase">Custo: 0 {currency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

