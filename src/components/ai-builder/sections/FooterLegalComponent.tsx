import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { BrandLogo } from '../../common/BrandLogo';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
  productTitle?: string;
}

export const FooterLegalComponent: React.FC<Props> = ({ section, theme, productTitle }) => {
  const p = section.props || {};
  const copyrightText = p.copyrightText || `© ${new Date().getFullYear()} ${productTitle || 'Digitall Pay'}. Todos os direitos reservados.`;
  const legalDisclaimer = p.legalDisclaimer || 'Este site não é afiliado ao Facebook, Google ou a qualquer entidade de anúncios. Após sair dessas plataformas, a responsabilidade é estritamente desta página. Os resultados variam de pessoa para pessoa.';

  return (
    <footer className="py-12 px-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <BrandLogo size="sm" variant="neon" showText={true} />
        
        <p className="text-slate-400 font-medium">
          {copyrightText}
        </p>

        <p className="max-w-2xl text-[11px] text-slate-600 leading-relaxed">
          {legalDisclaimer}
        </p>
      </div>
    </footer>
  );
};
