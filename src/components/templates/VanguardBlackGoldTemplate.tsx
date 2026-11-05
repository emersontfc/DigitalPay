import React, { useState } from 'react';
import { Product } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { VideoPlayer } from '../common/VideoPlayer';
import { CheckoutButton } from '../common/CheckoutButton';
import { StickyCtaBar } from '../common/StickyCtaBar';
import { formatPrice } from '../../utils/currency';
import {
  Flame,
  CheckCircle2,
  ShieldAlert,
  Star,
  ChevronDown,
  Gift,
  HelpCircle,
  Zap,
  Lock,
  Percent
} from 'lucide-react';

interface TemplateProps {
  product: Product;
}

export const VanguardBlackGoldTemplate: React.FC<TemplateProps> = ({ product }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(product.faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const discountAmount = Math.max(0, product.original_price - product.promo_price);
  const discountPercent = product.original_price > 0
    ? Math.round((discountAmount / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      {/* 1. Barra de Escassez Ouro e Preto */}
      {product.countdown_enabled && (
        <div className="sticky top-0 z-40 shadow-xl">
          <CountdownTimer
            initialMinutes={product.countdown_minutes}
            variant="gold"
            label="⚠️ ATENÇÃO: ESSA OFERTA COM DESCONTO EXPIRA EM:"
          />
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-10 pb-16 px-4 overflow-hidden">
        {/* Glow dourado */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {product.badge_text && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-6 animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.badge_text}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-200 to-amber-400 tracking-tight leading-[1.12] mb-6 drop-shadow-sm">
            {product.headline}
          </h1>

          {product.subheadline && (
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              {product.subheadline}
            </p>
          )}

          <div className="max-w-3xl mx-auto mb-10">
            <VideoPlayer
              url={product.hero_media_url}
              type={product.hero_type}
              title={product.name}
              glowColor="amber"
            />
          </div>

          <div className="max-w-xl mx-auto">
            <CheckoutButton
              ctaText={product.cta_text}
              ctaUrl={product.cta_url}
              ctaSubtext={product.cta_subtext}
              variant="gold"
              size="xl"
            />
          </div>
        </div>
      </section>

      {/* 3. Benefícios / Arsenal */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 px-4 bg-neutral-900/60 border-y border-amber-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
                <Zap className="w-3.5 h-3.5" />
                <span>Vantagens Imediatas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Veja Tudo O Que Você Vai Desbloquear:
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-4 hover:border-amber-500/40 transition-colors"
                >
                  <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-neutral-200 font-semibold text-sm sm:text-base leading-snug">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Módulos / Treinamento */}
      {product.modules && product.modules.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">
              Conteúdo Detalhado do Treinamento
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Direto ao ponto, sem enrolação e pronto para execução.
            </p>
          </div>

          <div className="space-y-4">
            {product.modules.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                      {idx + 1}
                    </span>
                    {m.title}
                  </h3>
                  {m.lessonsCount && (
                    <span className="text-xs text-amber-400/90 font-medium">
                      {m.lessonsCount}
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 text-sm pl-9">{m.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Depoimentos */}
      {product.testimonials && product.testimonials.length > 0 && (
        <section className="py-20 px-4 bg-neutral-900/30 border-t border-neutral-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white">Resultados Reais</h2>
              <p className="text-neutral-400 text-sm mt-2">
                Veja o que os membros têm a dizer sobre o impacto prático.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.testimonials.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
                >
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-300 text-sm italic mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-neutral-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Garantia */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-neutral-950 to-neutral-900 flex flex-col sm:flex-row items-center gap-6 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Compromisso Inabalável
            </span>
            <h3 className="text-2xl font-black text-white mt-1 mb-2">
              Garantia de {product.guarantee_days} Dias de Satisfação
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Você tem até {product.guarantee_days} dias para aplicar tudo. Se você não ficar 100% satisfeito, basta nos mandar uma mensagem que estornamos cada centavo pago. Sem perguntas embaraçosas.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Caixa da Oferta Final */}
      <section className="py-20 px-4" id="checkout-section">
        <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-neutral-950 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center relative">
          {discountPercent > 0 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-black text-xs uppercase px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" />
              <span>{discountPercent}% DE DESCONTO HOJE</span>
            </div>
          )}

          <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
          <p className="text-neutral-400 text-sm mb-6">Aproveite enquanto as vagas ainda estão abertas</p>

          {product.original_price > product.promo_price && (
            <div className="text-neutral-500 text-sm line-through font-semibold mb-1">
              De {formatPrice(product.original_price, product.currency)} por apenas:
            </div>
          )}

          <div className="text-4xl sm:text-5xl font-black text-amber-400 my-2">
            {formatPrice(product.promo_price, product.currency)}
          </div>
          <div className="text-sm text-neutral-300 font-bold mb-8">
            {product.installments_text}
          </div>

          <CheckoutButton
            ctaText={product.cta_text}
            ctaUrl={product.cta_url}
            ctaSubtext={product.cta_subtext}
            variant="gold"
            size="xl"
          />

          <div className="flex items-center justify-center gap-6 text-xs text-neutral-400 mt-6 pt-4 border-t border-neutral-800">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Checkout 100% Blindado
            </span>
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Garantia de {product.guarantee_days} Dias
            </span>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-3">
            {product.faqs.map((f, idx) => {
              const isOpen = openFaq === f.id;
              return (
                <div
                  key={f.id || idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(f.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/80 transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">
                      {f.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-neutral-300 text-sm leading-relaxed border-t border-neutral-800/60">
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Rodapé */}
      <footer className="py-12 px-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
        <p className="font-black text-neutral-300 tracking-wider">DIGITALPAY</p>
        <p className="mt-1">© {new Date().getFullYear()} {product.name}. Todos os direitos reservados.</p>
      </footer>

      <StickyCtaBar product={product} variant="gold" />
    </div>
  );
};

