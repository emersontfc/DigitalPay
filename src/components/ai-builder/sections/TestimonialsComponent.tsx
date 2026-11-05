import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const TestimonialsComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'O Que Dizem Nossos Alunos & Clientes';
  const subtitle = p.subtitle || section.subtitle || 'Depoimentos reais de quem aplicou o método e colheu resultados extraordinários:';
  const items = p.items || [
    {
      name: 'Manuel Cossa',
      role: 'Empreendedor • Maputo',
      content: 'O conteúdo é direto e sem enrolação. Consegui estruturar minhas primeiras vendas online em menos de 1 semana!',
      rating: 5,
      isVerified: true,
    },
    {
      name: 'Carla Muchanga',
      role: 'Profissional Liberal • Matola',
      content: 'Excelente suporte e material de primeiríssima qualidade. Recomendo a todos que querem resultados de verdade.',
      rating: 5,
      isVerified: true,
    },
    {
      name: 'Helder Sitoe',
      role: 'Criador de Conteúdo • Beira',
      content: 'Mudou completamente a minha visão estratégica. O retorno sobre o investimento foi mais de 10 vezes o valor pago.',
      rating: 5,
      isVerified: true,
    },
  ];

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((t: any, idx: number) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
          >
            <div>
              {/* Estrelas */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Texto do depoimento */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                "{t.content}"
              </p>
            </div>

            {/* Autor */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <p className="text-[11px] text-slate-400">{t.role}</p>
              </div>

              {t.isVerified && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verificado</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
