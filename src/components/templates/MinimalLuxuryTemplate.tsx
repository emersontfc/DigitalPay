import React, { useState } from 'react';
import { Product } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { VideoPlayer } from '../common/VideoPlayer';
import { CheckoutButton } from '../common/CheckoutButton';
import { StickyCtaBar } from '../common/StickyCtaBar';
import { formatPrice } from '../../utils/currency';
import {
  Award,
  CheckCircle,
  Shield,
  Star,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface TemplateProps {
  product: Product;
}

export const MinimalLuxuryTemplate: React.FC<TemplateProps> = ({ product }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(product.faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* 1. Timer discreto e executivo */}
      {product.countdown_enabled && (
        <div className="sticky top-0 z-40">
          <CountdownTimer
            initialMinutes={product.countdown_minutes}
            variant="luxury"
            label="Condição exclusiva para novas inscrições expira em:"
          />
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="pt-16 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center">
          {product.badge_text && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs uppercase tracking-widest font-semibold mb-6">
              <Award className="w-3.5 h-3.5" />
              <span>{product.badge_text}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            {product.headline}
          </h1>

          {product.subheadline && (
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              {product.subheadline}
            </p>
          )}

          <div className="max-w-3xl mx-auto mb-12 shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
            <VideoPlayer
              url={product.hero_media_url}
              type={product.hero_type}
              title={product.name}
              glowColor="indigo"
            />
          </div>

          <div className="max-w-md mx-auto">
            <CheckoutButton
              ctaText={product.cta_text}
              ctaUrl={product.cta_url}
              ctaSubtext={product.cta_subtext}
              variant="luxury"
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* 3. Destaques Executivos */}
      {product.features && product.features.length > 0 && (
        <section className="py-20 px-4 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                O Que Está Incluído no Programa
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Metodologia estruturada com foco em execução prática e alto retorno.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-slate-200 text-sm sm:text-base font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Grade Curricular */}
      {product.modules && product.modules.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Plano de Ensino</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Estrutura Modular</h2>
          </div>

          <div className="space-y-4">
            {product.modules.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {m.title}
                  </h3>
                  {m.lessonsCount && (
                    <span className="text-xs text-slate-400 font-medium">
                      {m.lessonsCount}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-8">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Depoimentos */}
      {product.testimonials && product.testimonials.length > 0 && (
        <section className="py-20 px-4 bg-slate-900/20 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Casos de Sucesso</h2>
              <p className="text-slate-400 text-sm mt-2">
                Depoimentos de executivos e profissionais que transformaram seus resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.testimonials.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm italic mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.role}</p>
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
        <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Garantia de Satisfação de {product.guarantee_days} Dias
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Inicie a sua jornada com total tranquilidade. Se dentro do período de {product.guarantee_days} dias você avaliar que o conteúdo não superou suas expectativas, solicitamos o estorno integral do seu aporte.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Proposta de Valor / Checkout */}
      <section className="py-20 px-4" id="checkout-section">
        <div className="max-w-lg mx-auto p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl text-center">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Investimento
          </span>
          <h3 className="text-2xl font-bold text-white mt-1 mb-4">{product.name}</h3>

          {product.original_price > product.promo_price && (
            <div className="text-slate-500 text-sm line-through mb-1">
              De {formatPrice(product.original_price, product.currency)} por:
            </div>
          )}

          <div className="text-4xl font-black text-white my-2">
            {formatPrice(product.promo_price, product.currency)}
          </div>
          <div className="text-sm text-indigo-300 font-medium mb-8">
            {product.installments_text}
          </div>

          <CheckoutButton
            ctaText={product.cta_text}
            ctaUrl={product.cta_url}
            ctaSubtext={product.cta_subtext}
            variant="luxury"
            size="lg"
          />

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Ambiente Criptografado
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Garantia de {product.guarantee_days} dias
            </span>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-3">
            {product.faqs.map((f, idx) => {
              const isOpen = openFaq === f.id;
              return (
                <div
                  key={f.id || idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(f.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/80 transition-colors"
                  >
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {f.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50">
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
      <footer className="py-12 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">DIGITALPAY • PLATAFORMA DE VENDAS</p>
        <p className="mt-1">© {new Date().getFullYear()} {product.name}. Todos os direitos reservados.</p>
      </footer>

      <StickyCtaBar product={product} variant="luxury" />
    </div>
  );
};

