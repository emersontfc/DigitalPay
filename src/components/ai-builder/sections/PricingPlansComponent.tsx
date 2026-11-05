import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { CheckoutButton } from '../../common/CheckoutButton';
import { formatPrice } from '../../../utils/currency';
import { Check, ShieldCheck, Sparkles, MessageCircle, Lock, Flame } from 'lucide-react';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
  currency: string;
  originalPrice: number;
  promoPrice: number;
  installmentsText: string;
  checkoutUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export const PricingPlansComponent: React.FC<Props> = ({
  section,
  theme,
  currency,
  originalPrice,
  promoPrice,
  installmentsText,
  checkoutUrl,
  whatsappNumber,
  whatsappMessage,
}) => {
  const p = section.props || {};
  const title = p.title || section.title || 'Oferta Especial Por Tempo Limitado';
  const subtitle = p.subtitle || section.subtitle || 'Invista hoje no seu futuro com condição promocional imperdível:';
  const planName = p.planName || 'Acesso Completo VIP';
  const ctaText = p.ctaText || 'QUERO APROVEITAR ESSA OFERTA AGORA';
  const guaranteeDays = p.guaranteeDays || 7;
  const features = p.features || [
    'Acesso Imediato a Todas as Aulas e Atualizações',
    'Materiais Complementares e Modelos em PDF',
    'Comunidade Exclusiva para Networking',
    'Suporte Dedicado para Tirar Dúvidas',
    'Certificado Oficial de Conclusão',
  ];

  const currentOriginal = p.originalPrice ?? originalPrice;
  const currentPromo = p.promoPrice ?? promoPrice;
  const currentInstallments = p.installmentsText || installmentsText;
  const currentCheckoutUrl = p.checkoutUrl || checkoutUrl;

  const discountAmount = Math.max(0, currentOriginal - currentPromo);
  const discountPercent = currentOriginal > 0 ? Math.round((discountAmount / currentOriginal) * 100) : 0;

  const getWaLink = () => {
    if (!whatsappNumber) return '#';
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const msg = encodeURIComponent(whatsappMessage || `Olá! Quero garantir a oferta de ${formatPrice(currentPromo, currency)}`);
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  };

  return (
    <div className="py-20 px-4 relative overflow-hidden" id="oferta">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}30`,
            }}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Condição Exclusiva de Lançamento</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Card de Preço Premium */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border-2 border-slate-700 hover:border-emerald-500/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative transition-all duration-300">
          {discountPercent > 0 && (
            <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
              {discountPercent}% de Desconto
            </div>
          )}

          <div className="text-center pb-6 border-b border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              {planName}
            </h3>

            {currentOriginal > currentPromo && (
              <div className="text-slate-500 line-through text-sm sm:text-base font-semibold mb-1">
                De: {formatPrice(currentOriginal, currency)}
              </div>
            )}

            <div className="flex items-baseline justify-center gap-1.5 my-2">
              <span className="text-xs uppercase font-bold text-slate-400">Por Apenas:</span>
              <span className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                {formatPrice(currentPromo, currency)}
              </span>
            </div>

            {currentInstallments && (
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1">
                {currentInstallments}
              </p>
            )}
          </div>

          {/* Lista de Recursos Incluídos */}
          <div className="py-6 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              O que você recebe imediatamente:
            </p>
            {features.map((feat: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 space-y-3">
            {currentCheckoutUrl && (
              <CheckoutButton
                ctaUrl={currentCheckoutUrl}
                ctaText={ctaText}
                ctaSubtext={`🔒 Compra 100% Segura • Garantia de ${guaranteeDays} Dias`}
                variant="neon"
              />
            )}

            {whatsappNumber && (
              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-[#25D366] hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Prefiro Tirar Dúvidas ou Pagar via WhatsApp</span>
              </a>
            )}
          </div>

          {/* Selos de Segurança */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Pagamento Criptografado
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Garantia de {guaranteeDays} Dias
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Acesso Instantâneo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
