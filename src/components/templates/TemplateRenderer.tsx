import React from 'react';
import { Product } from '../../types';
import { KiwifyNeonTemplate } from './KiwifyNeonTemplate';
import { MinimalLuxuryTemplate } from './MinimalLuxuryTemplate';
import { VanguardBlackGoldTemplate } from './VanguardBlackGoldTemplate';
import { BrandThemeTemplate } from './BrandThemeTemplate';

interface TemplateRendererProps {
  product: Product;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ product }) => {
  switch (product.template) {
    case 'minimal-luxury':
      return <MinimalLuxuryTemplate product={product} />;
    case 'vanguard-black-gold':
      return <VanguardBlackGoldTemplate product={product} />;
    case 'titanium-tech':
    case 'crimson-beast':
    case 'rose-gold-glamour':
    case 'sapphire-fintech':
    case 'sunset-creator':
    case 'midnight-violet':
    case 'emerald-prestige':
    case 'monochrome-editorial':
    case 'ebook-classic-ivory':
    case 'ebook-ocean-clean':
    case 'ebook-emerald-reader':
    case 'ebook-crimson-bestseller':
    case 'ebook-royal-plum':
    case 'ebook-midnight-gold':
      return <BrandThemeTemplate product={product} />;
    case 'kiwify-neon':
    default:
      return <KiwifyNeonTemplate product={product} />;
  }
};

