import React, { useState } from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const FaqAccordionComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Perguntas Frequentes (FAQ)';
  const subtitle = p.subtitle || section.subtitle || 'Tire todas as suas dúvidas antes de tomar sua decisão:';
  const faqs = p.items || [
    {
      question: 'Como e quando recebo meu acesso?',
      answer: 'O envio é imediato via e-mail ou WhatsApp logo após a confirmação do pagamento.',
    },
    {
      question: 'Quais são as formas de pagamento disponíveis?',
      answer: 'Aceitamos M-Pesa, E-Mola, Cartão de Crédito e Transferência Bancária.',
    },
    {
      question: 'E se eu tiver dúvidas durante o conteúdo?',
      answer: 'Você terá acesso ao nosso canal exclusivo de suporte para tirar qualquer dúvida.',
    },
    {
      question: 'Existe garantia de satisfação?',
      answer: 'Sim! Oferecemos garantia incondicional. Se não ficar satisfeito, devolvemos 100% do seu valor.',
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
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Dúvidas Comuns</span>
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
        {faqs.map((f: any, idx: number) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span>{f.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-5 pt-0 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50">
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

