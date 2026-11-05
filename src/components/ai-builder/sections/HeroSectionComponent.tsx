import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { VideoPlayer } from '../../common/VideoPlayer';
import { CheckoutButton } from '../../common/CheckoutButton';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
  currency: string;
  promoPrice: number;
  checkoutUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  isEditor?: boolean;
}

export const HeroSectionComponent: React.FC<Props> = ({
  section,
  theme,
  currency,
  promoPrice,
  checkoutUrl,
  whatsappNumber,
  whatsappMessage,
}) => {
  const p = section.props || {};
  const badgeText = p.badgeText || 'OFERTA EXCLUSIVA';
  const headline = p.headline || section.title || 'Transforme Seus Resultados Hoje';
  const subtitle = p.subtitle || section.subtitle || 'Descubra a metodologia prática comprovada para alcançar seus objetivos com rapidez e segurança.';
  const mediaType = p.mediaType || 'video'; // 'video' | 'image'
  const mediaUrl = p.mediaUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  const primaryCtaText = p.primaryCtaText || 'QUERO GARANTIR MINHA VAGA AGORA';
  const showWhatsApp = p.showWhatsApp ?? Boolean(whatsappNumber);
  const highlights = p.highlights || ['Acesso Imediato', 'Garantia Incondicional', 'Certificado Incluso'];

  const getWaLink = () => {
    if (!whatsappNumber) return '#';
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const msg = encodeURIComponent(whatsappMessage || `Olá! Tenho interesse no ${p.productName || 'produto'}`);
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  };

  return (
    <div className="relative pt-8 sm:pt-14 pb-16 px-4 overflow-hidden text-center">
      {/* Glow de fundo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] blur-[140px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: theme.primaryColor }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Badge de Destaque */}
        {badgeText && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border animate-pulse"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
          {headline}
        </h1>

        {/* Subtítulo persuasivo */}
        {subtitle && (
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Mídia: Vídeo ou Imagem */}
        <div className="max-w-3xl mx-auto mb-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          {mediaType === 'image' ? (
            <img
              src={mediaUrl}
              alt={headline}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          ) : (
            <VideoPlayer url={mediaUrl} />
          )}
        </div>

        {/* Highlights rápidos abaixo do vídeo */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-xs sm:text-sm text-slate-300 font-semibold">
            {highlights.map((h: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Botão de Compra / WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
          {checkoutUrl && (
            <div className="w-full sm:w-auto flex-1">
              <CheckoutButton
                ctaUrl={checkoutUrl}
                ctaText={primaryCtaText}
                ctaSubtext="🔒 Compra 100% Segura • Acesso Imediato"
                variant={theme.preset === 'luxury-dark' ? 'gold' : 'neon'}
              />
            </div>
          )}

          {showWhatsApp && whatsappNumber && (
            <a
              href={getWaLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-extrabold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>Falar no WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
