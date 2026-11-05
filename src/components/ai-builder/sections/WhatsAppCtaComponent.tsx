import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
  whatsappNumber: string;
  whatsappMessage: string;
}

export const WhatsAppCtaComponent: React.FC<Props> = ({
  section,
  theme,
  whatsappNumber,
  whatsappMessage,
}) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Prefere Tirar Suas Dúvidas Diretamente no WhatsApp?';
  const subtitle = p.subtitle || section.subtitle || 'Nossa equipe está online para te ajudar a escolher a melhor opção e confirmar sua vaga com total segurança.';
  const buttonText = p.buttonText || 'Conversar com Atendente no WhatsApp';
  const targetNumber = p.whatsappNumber || whatsappNumber;
  const targetMessage = p.whatsappMessage || whatsappMessage;

  const getWaLink = () => {
    if (!targetNumber) return '#';
    const clean = targetNumber.replace(/\D/g, '');
    const msg = encodeURIComponent(targetMessage || 'Olá! Gostaria de mais informações.');
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="py-14 px-4 max-w-4xl mx-auto">
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto mb-4 border border-[#25D366]/30">
          <MessageCircle className="w-7 h-7 fill-[#25D366]" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
          {subtitle}
        </p>

        <a
          href={getWaLink()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm sm:text-base font-black bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-slate-950" />
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </a>
      </div>
    </div>
  );
};
