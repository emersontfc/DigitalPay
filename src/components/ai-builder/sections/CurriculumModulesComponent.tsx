import React, { useState } from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { ChevronDown, BookOpen, Layers } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const CurriculumModulesComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Conteúdo Programático do Curso';
  const subtitle = p.subtitle || section.subtitle || 'Confira o que você vai dominar em cada etapa do treinamento:';
  const modules = p.items || [
    {
      title: 'Módulo 1: Fundamentos & Estrutura Inicial',
      lessonsCount: '4 Aulas Práticas',
      description: 'Como preparar suas ferramentas e criar bases sólidas para vendas consistentes.',
    },
    {
      title: 'Módulo 2: O Funil de Conversão Automático',
      lessonsCount: '6 Aulas Práticas',
      description: 'Passo a passo para atrair visitantes qualificados e transformar cliques em compradores.',
    },
    {
      title: 'Módulo 3: Escala & Otimização de Lucro',
      lessonsCount: '5 Aulas Práticas',
      description: 'Como multiplicar o faturamento sem aumentar seus custos na mesma proporção.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border"
          style={{
            backgroundColor: `${theme.primaryColor}15`,
            color: theme.primaryColor,
            borderColor: `${theme.primaryColor}30`,
          }}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Estrutura das Aulas</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {modules.map((m: any, idx: number) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{m.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {m.lessonsCount && (
                    <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                      {m.lessonsCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="p-5 pt-0 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50">
                  {m.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

