import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { Award, CheckCircle2 } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const AuthorityCreatorComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const name = p.name || 'Emerson Torres';
  const role = p.role || 'Especialista em Negócios Digitais & Marketing';
  const bio = p.bio || 'Com mais de 5 anos de experiência no mercado digital, já ajudou centenas de empreendedores a destravarem suas vendas através da internet, utilizando métodos práticos e validados de alta conversão.';
  const imageUrl = p.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
  const achievements = p.achievements || [
    '+10.000 Horas de Prática no Mercado',
    'Mentor de Mais de 500 Alunos',
    'Criador de Diversas Marcas de Sucesso',
  ];

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-8 sm:gap-12 shadow-2xl">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-700 shadow-xl">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center md:text-left">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}30`,
            }}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Quem Será o Seu Mentor</span>
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {name}
          </h3>
          <p className="text-sm font-semibold text-emerald-400 mb-4">
            {role}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {bio}
          </p>

          <div className="space-y-2">
            {achievements.map((ach: string, idx: number) => (
              <div key={idx} className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
