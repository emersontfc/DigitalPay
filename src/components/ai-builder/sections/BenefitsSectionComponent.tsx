import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import {
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  Sparkles,
  Award,
  Shield,
  Clock,
  Flame,
  Star
} from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const BenefitsSectionComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Por Que Este Método Funciona?';
  const subtitle = p.subtitle || section.subtitle || 'Veja as vantagens exclusivas que você terá acesso imediatamente:';
  const items = p.items || [
    { title: 'Método Prático e Direto', description: 'Sem teorias cansativas. Você aprende aplicando em projetos reais passo a passo.' },
    { title: 'Resultados Comprovados', description: 'Estratégias testadas e validadas por centenas de alunos em Moçambique e no mundo.' },
    { title: 'Suporte VIP Individual', description: 'Tire suas dúvidas diretamente com nossa equipe de suporte dedicada.' },
    { title: 'Acesso Vitalício', description: 'Reveja todas as aulas, atualizações e materiais complementares quando quiser.' },
  ];

  const icons = [TrendingUp, Zap, Target, Award, Sparkles, Shield, Clock, Flame];

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any, idx: number) => {
          const Icon = icons[idx % icons.length];
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${theme.primaryColor}15`,
                    color: theme.primaryColor,
                    borderColor: `${theme.primaryColor}30`,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

