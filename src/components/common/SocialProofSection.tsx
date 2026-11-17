import React, { useState, useRef } from 'react';
import { Product, SocialProofLayout } from '../../types';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  ZoomIn,
  X,
  MessageSquareQuote,
  Image as ImageIcon,
} from 'lucide-react';

interface SocialProofSectionProps {
  product: Product;
  badgeText?: string;
  titleText?: string;
  subtitleText?: string;
  accentTextClass?: string;
  accentBgClass?: string;
  accentBorderClass?: string;
  cardBgClass?: string;
  cardBorderClass?: string;
  starColorClass?: string;
  sectionBgClass?: string;
  lightMode?: boolean;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  product,
  badgeText = 'Provas Sociais',
  titleText = 'Resultados reais de quem já aplicou',
  subtitleText,
  accentTextClass = 'text-emerald-400',
  accentBgClass = 'bg-emerald-500/15',
  accentBorderClass = 'border-emerald-500/30',
  cardBgClass = 'bg-slate-950/90',
  cardBorderClass = 'border-slate-800',
  starColorClass = 'fill-amber-400 text-amber-400',
  sectionBgClass = 'bg-black/40 border-y border-slate-800/80',
  lightMode = false,
}) => {
  const ds = product.design_settings || {};
  const layout: SocialProofLayout = ds.social_proof_layout || 'cards';
  const printImages = (ds.social_proof_images || []).filter((img) => img.url && img.url.trim().length > 0);
  const testimonials = product.testimonials || [];

  // Prints embutidos em depoimentos individuais também entram na lista visual
  const allPrints = [
    ...printImages,
    ...testimonials
      .filter((t) => t.printImageUrl)
      .map((t) => ({
        id: `tp-${t.id}`,
        url: t.printImageUrl!,
        caption: `${t.name}${t.role ? ` • ${t.role}` : ''}`,
      })),
  ];

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ url: string; caption?: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (testimonials.length === 0 && allPrints.length === 0) {
    return null;
  }

  const scrollCarousel = (dir: 'prev' | 'next') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const step = Math.min(340, container.clientWidth * 0.85);
      container.scrollBy({
        left: dir === 'next' ? step : -step,
        behavior: 'smooth',
      });
    }
    const total = allPrints.length > 0 ? allPrints.length : testimonials.length;
    if (total > 0) {
      setCarouselIdx((prev) => (dir === 'next' ? (prev + 1) % total : (prev - 1 + total) % total));
    }
  };

  const titleColor = lightMode ? 'text-slate-900' : 'text-white';
  const bodyColor = lightMode ? 'text-slate-600' : 'text-slate-300';
  const mutedColor = lightMode ? 'text-slate-500' : 'text-slate-400';

  const renderPrintCarousel = () => {
    if (allPrints.length === 0) return null;
    return (
      <div className="relative">
        {/* Botões Esquerda / Direita */}
        {allPrints.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollCarousel('prev')}
              aria-label="Anterior"
              className={`hidden sm:flex absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center shadow-xl border transition-all cursor-pointer ${
                lightMode
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('next')}
              aria-label="Próximo"
              className={`hidden sm:flex absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center shadow-xl border transition-all cursor-pointer ${
                lightMode
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Faixa deslizante horizontal (Swipe no celular + scroll suave) */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 no-scrollbar scroll-smooth"
        >
          {allPrints.map((img, i) => (
            <div
              key={img.id || i}
              onClick={() => setLightboxImg(img)}
              className={`snap-center shrink-0 w-[260px] sm:w-[300px] md:w-[320px] rounded-2xl overflow-hidden border ${cardBorderClass} ${cardBgClass} shadow-lg group cursor-pointer transition-all hover:scale-[1.02]`}
            >
              <div className="relative aspect-[4/5] bg-black/20 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.caption || `Prova Social ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-black/75 text-white text-xs font-bold flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Ampliar Print
                  </span>
                </div>
              </div>
              {img.caption && (
                <div className={`px-3.5 py-2.5 text-xs font-medium ${bodyColor} border-t ${cardBorderClass} truncate`}>
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Indicadores mobile */}
        {allPrints.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {allPrints.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === carouselIdx ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-600/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTestimonialCards = (isCarousel = false) => {
    if (testimonials.length === 0) return null;
    const containerClass = isCarousel
      ? 'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar scroll-smooth'
      : 'grid grid-cols-1 md:grid-cols-2 gap-5';

    return (
      <div className={containerClass} ref={isCarousel && allPrints.length === 0 ? scrollRef : undefined}>
        {testimonials.map((test, idx) => (
          <div
            key={test.id || idx}
            className={`${isCarousel ? 'snap-center shrink-0 w-[290px] sm:w-[340px]' : ''} p-5 sm:p-6 rounded-2xl ${cardBgClass} border ${cardBorderClass} flex flex-col justify-between space-y-4 transition-all hover:shadow-xl`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: test.rating || 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${starColorClass}`} />
                ))}
              </div>
              <p className={`text-sm italic leading-relaxed ${bodyColor}`}>
                "{test.content}"
              </p>
              {test.printImageUrl && (
                <div
                  onClick={() => setLightboxImg({ url: test.printImageUrl!, caption: test.name })}
                  className="mt-2 rounded-xl overflow-hidden border border-slate-700/50 cursor-pointer relative group"
                >
                  <img
                    src={test.printImageUrl}
                    alt={`Print de ${test.name}`}
                    className="w-full max-h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </div>

            <div className={`flex items-center gap-3 pt-3 border-t ${lightMode ? 'border-slate-200' : 'border-slate-800/60'}`}>
              {test.avatarUrl ? (
                <img
                  src={test.avatarUrl}
                  alt={test.name}
                  className={`w-10 h-10 rounded-full object-cover border-2 ${accentBorderClass}`}
                />
              ) : (
                <div className={`w-10 h-10 rounded-full ${accentBgClass} ${accentTextClass} font-bold flex items-center justify-center text-sm border ${accentBorderClass}`}>
                  {test.name.charAt(0)}
                </div>
              )}
              <div>
                <h5 className={`font-bold text-sm ${titleColor}`}>{test.name}</h5>
                <span className={`text-xs ${mutedColor}`}>{test.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGallery = () => (
    <div className="space-y-6">
      {allPrints.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {allPrints.map((img, i) => (
            <div
              key={img.id || i}
              onClick={() => setLightboxImg(img)}
              className={`rounded-2xl overflow-hidden border ${cardBorderClass} ${cardBgClass} group cursor-pointer shadow-md hover:shadow-xl transition-all`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-black/20">
                <img
                  src={img.url}
                  alt={img.caption || `Resultado ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/65 text-white opacity-80 group-hover:opacity-100">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>
              {img.caption && (
                <p className={`px-3 py-2 text-[11px] font-medium ${bodyColor} truncate`}>{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {testimonials.length > 0 && allPrints.length === 0 && renderTestimonialCards(false)}
    </div>
  );

  const renderWhatsAppStyle = () => (
    <div className="space-y-6">
      {allPrints.length > 0 && renderPrintCarousel()}
      {testimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((test, idx) => (
            <div
              key={test.id || idx}
              className="p-4 rounded-2xl bg-[#0b141a] border border-emerald-500/25 shadow-lg space-y-2.5 text-left"
            >
              {/* Cabeçalho estilo WhatsApp */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                {test.avatarUrl ? (
                  <img src={test.avatarUrl} alt={test.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#00a884]/20 text-[#00a884] font-bold flex items-center justify-center text-xs">
                    {test.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#e9edef] truncate">{test.name}</div>
                  <div className="text-[10px] text-[#00a884] font-medium truncate">{test.role || 'Cliente verificado'}</div>
                </div>
              </div>
              {/* Balão de mensagem */}
              <div className="p-3 rounded-xl rounded-tl-none bg-[#005c4b] text-[#e9edef] text-xs sm:text-sm leading-relaxed relative shadow">
                <p>{test.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200/70">
                  <span>14:{String((12 + idx * 7) % 59).padStart(2, '0')}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className={`py-16 sm:py-20 px-4 ${sectionBgClass}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${accentTextClass} mb-2`}>
            {allPrints.length > 0 ? <ImageIcon className="w-3.5 h-3.5" /> : <MessageSquareQuote className="w-3.5 h-3.5" />}
            {badgeText}
          </span>
          <h2 className={`text-2xl sm:text-4xl font-black ${titleColor}`}>
            {titleText}
          </h2>
          {subtitleText && (
            <p className={`text-sm mt-2 ${mutedColor}`}>{subtitleText}</p>
          )}
        </div>

        {/* Renderização conforme o formato escolhido */}
        {layout === 'carousel' && (
          <div className="space-y-6">
            {allPrints.length > 0 ? renderPrintCarousel() : renderTestimonialCards(true)}
          </div>
        )}

        {layout === 'gallery' && renderGallery()}

        {layout === 'whatsapp' && renderWhatsAppStyle()}

        {layout === 'mixed' && (
          <div className="space-y-8">
            {allPrints.length > 0 && renderPrintCarousel()}
            {testimonials.length > 0 && renderTestimonialCards(false)}
          </div>
        )}

        {layout === 'cards' && (
          <div className="space-y-8">
            {renderTestimonialCards(false)}
            {allPrints.length > 0 && renderPrintCarousel()}
          </div>
        )}
      </div>

      {/* Lightbox para ampliar prints de resultados */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-2xl max-h-[88vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImg.url}
              alt={lightboxImg.caption || 'Print ampliado'}
              className="max-h-[80vh] w-auto rounded-2xl border border-slate-700 shadow-2xl object-contain"
            />
            {lightboxImg.caption && (
              <p className="text-xs sm:text-sm text-slate-200 font-medium text-center bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-700">
                {lightboxImg.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
