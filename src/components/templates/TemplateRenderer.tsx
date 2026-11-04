import React from 'react';
import { Product } from '../../types';
import { KiwifyNeonTemplate } from './KiwifyNeonTemplate';
import { MinimalLuxuryTemplate } from './MinimalLuxuryTemplate';
import { VanguardBlackGoldTemplate } from './VanguardBlackGoldTemplate';

interface TemplateRendererProps {
  product: Product;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ product }) => {
  switch (product.template) {
    case 'minimal-luxury':
      return <MinimalLuxuryTemplate product={product} />;
    case 'vanguard-black-gold':
      return <VanguardBlackGoldTemplate product={product} />;
    case 'kiwify-neon':
    default:
      return <KiwifyNeonTemplate product={product} />;
  }
};

