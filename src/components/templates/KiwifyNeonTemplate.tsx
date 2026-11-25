import React, { useState } from 'react';
import { Product } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { VideoPlayer } from '../common/VideoPlayer';
import { CheckoutButton } from '../common/CheckoutButton';
import { StickyCtaBar } from '../common/StickyCtaBar';
import { SalesPageTopBar } from '../common/SalesPageTopBar';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { SocialProofSection } from '../common/SocialProofSection';
import { GuaranteeSection } from '../common/GuaranteeSection';
import { BonusSection } from '../common/BonusSection';
import { TargetAudienceSection } from '../common/TargetAudienceSection';
import { InstructorSection } from '../common/InstructorSection';
import { StudyPlanSection } from '../common/StudyPlanSection';
import { useVslPitchDelay } from '../../hooks/useVslPitchDelay';
import { formatPrice } from '../../utils/currency';
import { useSalesPageLanguage, UI_TRANSLATIONS } from '../../utils/i18n';
import {
  CheckCircle2,
  Shield,
  Star,
  ChevronDown,
  Sparkles,
  Lock,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface TemplateProps {
  product: Product;
}

export const KiwifyNeonTemplate: React.FC<TemplateProps> = ({ product }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(product.faqs[0]?.id || null);
  const [openModule, setOpenModule] = useState<string | null>(product.modules[0]?.id || null);

  const { showOffer, revealNow, isDelayActive } = useVslPitchDelay({
    delaySeconds: product.vsl_pitch_delay_seconds,
    productId: product.id,
    enabled: product.hero_type === 'vsl',
  });

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id);
  };

  const [currentLang] = useSalesPageLanguage();
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.pt;
  const ds = product.design_settings || {};

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* 1. Barra de Identidade Visual Ultrafina Topo: Digitall Pay */}
      <SalesPageTopBar variant="neon" showLanguageSelector={Boolean(product.multilang_enabled)} />

      {/* 2. Barra de Contagem Regressiva Fina Topo */}
      {product.countdown_enabled && (
        <div className="sticky top-[30px] sm:top-[34px] z-20">
          <CountdownTimer
            initialMinutes={product.countdown_minutes}
            variant="neon"
            customColor={ds.countdown_color}
            label={t.countdown_label}
          />
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge de Urgência */}
          {product.badge_text && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{product.badge_text}</span>
            </div>
          )}

          {/* Headline Principal */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            {product.headline}
          </h1>

          {/* Subheadline */}
          {product.subheadline && (
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              {product.subheadline}
            </p>
          )}

          {/* Video Player ou Imagem Hero */}
          <div className="max-w-3xl mx-auto mb-10">
            <VideoPlayer
              url={product.hero_media_url}
              type={product.hero_type}
              title={product.name}
              glowColor="emerald"
              autoplay={product.vsl_autoplay}
            />
          </div>

          {/* Primeiro CTA com Pitch Delay */}
          {showOffer ? (
            <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CheckoutButton
                productId={product.id}
                ctaText={product.cta_text}
                ctaUrl={product.cta_url}
                ctaSubtext={product.cta_subtext}
                promoPrice={product.promo_price}
                productName={product.name}
                currency={product.currency}
                variant="neon"
                customColor={ds.cta_color}
                customTextColor={ds.cta_text_color}
                size={ds.cta_size || 'xl'}
                thickness={ds.cta_thickness || 'normal'}
                rounded={ds.cta_rounded || 'xl'}
                pulse={Boolean(ds.cta_pulse)}
              />
            </div>
          ) : (
            <div className="py-2 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Assista ao vídeo para desbloquear a oferta exclusiva...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2.5. Público-Alvo: Qualificação e Desqualificação (Para quem É vs Para quem NÃO é) */}
      <TargetAudienceSection product={product} />

      {/* 3. Benefícios / O que você vai receber */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tudo o que você vai ter acesso hoje:
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Uma esteira completa pronta para acelerar seus resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-slate-200 font-medium text-sm sm:text-base leading-snug">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Grade de Módulos / Conteúdo */}
      {product.modules && product.modules.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Conteúdo Programático</span>
              </div>
              <h2 className="text-3xl font-black text-white">
                O que você vai aprender passo a passo
              </h2>
            </div>

            <div className="space-y-4">
              {product.modules.map((mod, idx) => {
                const isOpen = openModule === mod.id;
                return (
                  <div
                    key={mod.id || idx}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-500/20">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-white text-base sm:text-lg">
                            {mod.title}
                          </h3>
                          {mod.lessonsCount && (
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              {mod.lessonsCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-emerald-400' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-800/60 text-slate-300 text-sm leading-relaxed">
                        {mod.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4.5. Plano de Estudos / Cronograma / Jornada */}
      <StudyPlanSection
        product={product}
        accentTextClass="text-emerald-400"
        accentBgClass="bg-emerald-500/10"
        accentBorderClass="border-emerald-500/30"
        cardBgClass="bg-slate-950/80"
        cardBorderClass="border-slate-800"
      />

      {/* 4.6. Bônus Exclusivos com Ancoragem de Valor */}
      <BonusSection
        product={product}
        accentTextClass="text-emerald-400"
        accentBgClass="bg-emerald-500/10"
        accentBorderClass="border-emerald-500/30"
        cardBgClass="bg-slate-950/90"
        cardBorderClass="border-slate-800"
      />

      {/* 5. Depoimentos / Prova Social (Carrossel de Prints, Galeria, WhatsApp, Cards) */}
      <SocialProofSection
        product={product}
        badgeText={t.testimonials_badge}
        titleText={t.testimonials_title}
        accentTextClass="text-emerald-400"
        accentBgClass="bg-emerald-500/20"
        accentBorderClass="border-emerald-500/40"
        cardBgClass="bg-slate-950/90"
        cardBorderClass="border-slate-800"
        starColorClass="fill-amber-400 text-amber-400"
        sectionBgClass="bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"
      />

      {/* 5.5. Sobre o Especialista / Bio do Instrutor */}
      <InstructorSection
        product={product}
        accentTextClass="text-emerald-400"
        accentBgClass="bg-emerald-500/10"
        accentBorderClass="border-emerald-500/30"
        cardBgClass="bg-slate-950/90"
        cardBorderClass="border-slate-800"
      />

      {/* 6. Garantia Incondicional Ajustável */}
      <GuaranteeSection product={product} defaultColor="emerald" />

      {/* 7. Caixa da Oferta Irrecusável (Pricing Card) */}
      {!showOffer && isDelayActive && (
        <section className="py-12 px-4 text-center max-w-lg mx-auto">
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex flex-col items-center gap-3 shadow-lg">
            <span>⏳ Assista ao vídeo acima para liberar a condição especial abaixo...</span>
            <button
              type="button"
              onClick={revealNow}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
            >
              🔓 Liberar Oferta e Preço Agora
            </button>
          </div>
        </section>
      )}

      {showOffer && (
        <section className="py-20 px-4 relative animate-in fade-in slide-in-from-bottom-8 duration-700" id="checkout-section">
          <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-slate-950 border-2 border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase px-5 py-1.5 rounded-full shadow-lg">
              Oferta Especial por Tempo Limitado
            </div>

            <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
            <p className="text-slate-400 text-sm mb-4">Acesso completo e imediato ao material</p>

            {/* Seletor de Moeda direto no bloco de preço / CTA */}
            {product.multilang_enabled !== false && (
              <div className="mb-4">
                <LanguageSelector variant="currency-pill" />
              </div>
            )}

            {/* Comparativo de Preço */}
            {product.original_price > product.promo_price && (
              <div className="text-slate-500 text-sm font-semibold mb-1 line-through">
                De {formatPrice(product.original_price, product.currency)} por apenas:
              </div>
            )}

            <div className="mb-2">
              <span className="text-slate-400 text-sm font-medium">Por apenas</span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight my-1">
                {formatPrice(product.promo_price, product.currency)}
              </div>
              <div className="text-emerald-400 font-bold text-sm sm:text-base">
                {product.installments_text}
              </div>
            </div>

            {/* Botão de Compra */}
            <div className="mt-8 mb-6">
              <CheckoutButton
                productId={product.id}
                ctaText={product.cta_text}
                ctaUrl={product.cta_url}
                ctaSubtext={product.cta_subtext}
                promoPrice={product.promo_price}
                productName={product.name}
                currency={product.currency}
                variant="neon"
                customColor={ds.cta_color}
                customTextColor={ds.cta_text_color}
                size={ds.cta_size || 'xl'}
                thickness={ds.cta_thickness || 'normal'}
                rounded={ds.cta_rounded || 'xl'}
                pulse={Boolean(ds.cta_pulse)}
              />
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Pagamento Seguro
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {product.guarantee_days} Dias de Garantia
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ Accordion */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dúvidas Comuns</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id || idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-slate-300 text-sm leading-relaxed border-t border-slate-800/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Rodapé Institucional com Logo Digitall Pay maior lá em baixo */}
      <footer className="py-12 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <BrandLogo size="lg" variant="neon" showText={true} />
          <p>© {new Date().getFullYear()} {product.name}. Todos os direitos reservados.</p>
          <p className="max-w-xl text-slate-600 text-[11px] leading-relaxed">
            Este site não é afiliado ao Facebook, Google ou a qualquer entidade de anúncios. Após sair dessas plataformas, a responsabilidade é estritamente desta página.
          </p>
        </div>
      </footer>

      {/* 10. Sticky Bottom Bar para Mobile/Desktop */}
      <StickyCtaBar product={product} variant="neon" show={showOffer} />
    </div>
  );
};

