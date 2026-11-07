import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { CheckoutButton } from './CheckoutButton';
import { formatPrice } from '../../utils/currency';

interface StickyCtaBarProps {
  product: Product;
  variant?: 'neon' | 'luxury' | 'gold' | 'cyan' | 'crimson' | 'rose' | 'blue' | 'sunset' | 'violet' | 'emerald' | 'noir' | string;
  show?: boolean;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({
  product,
  variant = 'neon',
  show = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Exibe a barra após rolar 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show || !visible) return null;

  const bgStyles = ({
    neon: 'bg-slate-950/95 border-emerald-500/30 text-white',
    luxury: 'bg-slate-900/95 border-indigo-500/30 text-white',
    gold: 'bg-neutral-950/95 border-amber-500/40 text-white',
    cyan: 'bg-slate-950/95 border-cyan-500/30 text-white',
    crimson: 'bg-neutral-950/95 border-red-500/40 text-white',
    rose: 'bg-stone-950/95 border-rose-500/30 text-white',
    blue: 'bg-slate-950/95 border-blue-500/40 text-white',
    sunset: 'bg-neutral-950/95 border-orange-500/40 text-white',
    violet: 'bg-slate-950/95 border-purple-500/40 text-white',
    emerald: 'bg-stone-950/95 border-emerald-500/40 text-white',
    noir: 'bg-black/95 border-zinc-700 text-white',
  } as Record<string, string>)[variant] || 'bg-slate-950/95 border-emerald-500/30 text-white';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 border-t backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${bgStyles}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Info do produto & preço */}
        <div className="hidden sm:flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 line-clamp-1 font-semibold">
            {product.name}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-black text-white">
              {formatPrice(product.promo_price, product.currency)}
            </span>
            {product.original_price > product.promo_price && (
              <span className="text-xs line-through text-slate-500">
                {formatPrice(product.original_price, product.currency)}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-medium">
              ({product.installments_text})
            </span>
          </div>
        </div>

        {/* Botão de Ação Direta */}
        <div className="w-full sm:w-auto min-w-[280px]">
          <CheckoutButton
            ctaText={product.cta_text}
            ctaUrl={product.cta_url}
            productName={product.name}
            promoPrice={product.promo_price}
            currency={product.currency}
            variant={variant}
            size="normal"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
};

