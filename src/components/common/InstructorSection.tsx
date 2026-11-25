import React from 'react';
import { Product } from '../../types';
import { Award, Star, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface InstructorSectionProps {
  product: Product;
  isLight?: boolean;
  accentTextClass?: string;
  accentBgClass?: string;
  accentBorderClass?: string;
  cardBgClass?: string;
  cardBorderClass?: string;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({
  product,
  isLight = false,
  accentTextClass = 'text-emerald-400',
  accentBgClass = 'bg-emerald-500/10',
  accentBorderClass = 'border-emerald-500/30',
  cardBgClass = 'bg-slate-950/80',
  cardBorderClass = 'border-slate-800',
}) => {
  const inst = product.instructor;

  if (!inst || inst.enabled === false) {
    return null;
  }

  if (!inst.name && !inst.bio) {
    return null;
  }

  const badges = inst.badges && inst.badges.length > 0 ? inst.badges : [
    'Autoridade Reconhecida',
    '+5.000 Alunos Atendidos',
    'Suporte Humanizado'
  ];

  return (
    <section className={`py-16 sm:py-20 px-4 relative ${isLight ? 'bg-amber-50/30 text-slate-900' : 'text-slate-100'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${accentBgClass} ${accentBorderClass} ${accentTextClass}`}>
            <UserCheck className="w-3.5 h-3.5" />
            <span>Quem Será Seu Mentor</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Conheça Quem Criou Este Método
          </h2>
          <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Experiência prática testada no campo de batalha para entregar o melhor caminho a você.
          </p>
        </div>

        {/* Card do Especialista */}
        <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 ${cardBgClass} ${cardBorderClass}`}>
          {/* Foto / Avatar & Conquistas */}
          <div className="flex flex-col items-center shrink-0 text-center">
            <div className="relative mb-4">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 shadow-xl ${accentBorderClass} bg-slate-900 flex items-center justify-center`}>
                {inst.avatar_url ? (
                  <img
                    src={inst.avatar_url}
                    alt={inst.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                    <UserCheck className="w-12 h-12 mb-1" />
                    <span className="text-[10px] font-bold">Foto do Autor</span>
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md border ${accentBgClass} ${accentBorderClass} ${accentTextClass} whitespace-nowrap`}>
                Especialista
              </div>
            </div>

            {/* Badges / Selos Rápidos */}
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px] mt-2">
              {badges.map((b, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1"
                >
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Biografia & Credenciais */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {inst.name || 'Especialista & Produtor'}
              </h3>
              <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${accentTextClass}`}>
                {inst.role_title || 'Mentor, Estrategista e Criador do Conteúdo'}
              </p>
            </div>

            {/* Texto da Biografia */}
            <div className={`text-xs sm:text-sm leading-relaxed space-y-3 mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {(inst.bio || 'Dedicou os últimos anos ao desenvolvimento de metodologias práticas que geram resultados concretos. Seu objetivo com este treinamento é encurtar sua curva de aprendizado e te entregar o caminho direto ao resultado, sem enrolação.').split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>

            {/* Garantia do Mentor */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Compromisso real com a sua satisfação e o seu aprendizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
