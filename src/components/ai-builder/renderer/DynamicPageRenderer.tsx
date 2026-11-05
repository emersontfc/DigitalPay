import React from 'react';
import { PageSchema, SectionData } from '../../../types/aiBuilder';
import { SalesPageTopBar } from '../../common/SalesPageTopBar';
import { HeroSectionComponent } from '../sections/HeroSectionComponent';
import { BenefitsSectionComponent } from '../sections/BenefitsSectionComponent';
import { PricingPlansComponent } from '../sections/PricingPlansComponent';
import { FaqAccordionComponent } from '../sections/FaqAccordionComponent';
import { TestimonialsComponent } from '../sections/TestimonialsComponent';
import { GuaranteeComponent } from '../sections/GuaranteeComponent';
import { BonusesComponent } from '../sections/BonusesComponent';
import { CurriculumModulesComponent } from '../sections/CurriculumModulesComponent';
import { AuthorityCreatorComponent } from '../sections/AuthorityCreatorComponent';
import { WhatsAppCtaComponent } from '../sections/WhatsAppCtaComponent';
import { CountdownSectionComponent } from '../sections/CountdownSectionComponent';
import { BeforeAfterComponent } from '../sections/BeforeAfterComponent';
import { FooterLegalComponent } from '../sections/FooterLegalComponent';
import { StickyCtaBar } from '../../common/StickyCtaBar';

interface DynamicPageRendererProps {
  page: PageSchema;
  isEditor?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  page,
  isEditor = false,
  selectedSectionId = null,
  onSelectSection,
}) => {
  const theme = page.theme;

  // Mapa de variantes para o topbar e sticky bar
  const topBarVariant =
    theme.preset === 'luxury-dark'
      ? 'gold'
      : theme.preset === 'modern-minimal'
      ? 'luxury'
      : 'neon';

  const renderSection = (section: SectionData) => {
    if (!section.isVisible) return null;

    const isSelected = isEditor && selectedSectionId === section.id;

    let content: React.ReactNode = null;

    switch (section.type) {
      case 'hero':
        content = (
          <HeroSectionComponent
            section={section}
            theme={theme}
            currency={page.currency}
            promoPrice={page.promoPrice}
            checkoutUrl={page.checkoutUrl}
            whatsappNumber={page.whatsappNumber}
            whatsappMessage={page.whatsappMessage}
            isEditor={isEditor}
          />
        );
        break;

      case 'benefits':
      case 'features':
        content = <BenefitsSectionComponent section={section} theme={theme} />;
        break;

      case 'pricing-plans':
      case 'special-offer':
        content = (
          <PricingPlansComponent
            section={section}
            theme={theme}
            currency={page.currency}
            originalPrice={page.originalPrice}
            promoPrice={page.promoPrice}
            installmentsText={page.installmentsText}
            checkoutUrl={page.checkoutUrl}
            whatsappNumber={page.whatsappNumber}
            whatsappMessage={page.whatsappMessage}
          />
        );
        break;

      case 'faq-accordion':
        content = <FaqAccordionComponent section={section} theme={theme} />;
        break;

      case 'testimonials':
        content = <TestimonialsComponent section={section} theme={theme} />;
        break;

      case 'guarantee':
        content = <GuaranteeComponent section={section} theme={theme} />;
        break;

      case 'bonuses':
        content = (
          <BonusesComponent
            section={section}
            theme={theme}
            currency={page.currency}
          />
        );
        break;

      case 'curriculum-modules':
        content = <CurriculumModulesComponent section={section} theme={theme} />;
        break;

      case 'authority-creator':
        content = <AuthorityCreatorComponent section={section} theme={theme} />;
        break;

      case 'before-after':
        content = <BeforeAfterComponent section={section} theme={theme} />;
        break;

      case 'whatsapp-cta':
        content = (
          <WhatsAppCtaComponent
            section={section}
            theme={theme}
            whatsappNumber={page.whatsappNumber}
            whatsappMessage={page.whatsappMessage}
          />
        );
        break;

      case 'countdown':
        content = <CountdownSectionComponent section={section} theme={theme} />;
        break;

      case 'footer-legal':
        content = (
          <FooterLegalComponent
            section={section}
            theme={theme}
            productTitle={page.title}
          />
        );
        break;

      default:
        content = (
          <div className="p-8 text-center border border-dashed border-slate-700 text-slate-500 rounded-xl my-4">
            Componente [{section.type}] em renderização
          </div>
        );
        break;
    }

    if (isEditor) {
      return (
        <div
          key={section.id}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectSection) onSelectSection(section.id);
          }}
          className={`relative group cursor-pointer transition-all ${
            isSelected
              ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950 shadow-2xl'
              : 'hover:ring-1 hover:ring-emerald-500/50'
          }`}
        >
          {/* Tag de identificação no editor */}
          <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {section.type} • {section.title || section.id}
          </div>
          {content}
        </div>
      );
    }

    return <div key={section.id}>{content}</div>;
  };

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-950"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* 1. Barra Oficial Digitall Pay no Topo */}
      <SalesPageTopBar variant={topBarVariant} />

      {/* 2. Seções dinâmicas renderizadas em ordem */}
      {page.sections.map((sec) => renderSection(sec))}

      {/* 3. Rodapé Legal (se nenhuma seção de rodapé for encontrada) */}
      {!page.sections.some((s) => s.type === 'footer-legal') && (
        <FooterLegalComponent
          section={{
            id: 'default-footer',
            type: 'footer-legal',
            isVisible: true,
            props: {},
            styles: { paddingY: 'md', fullWidth: false },
          }}
          theme={theme}
          productTitle={page.title}
        />
      )}

      {/* 4. Barra Flutuante de Conversão (apenas em produção / modo público) */}
      {!isEditor && page.checkoutUrl && (
        <StickyCtaBar
          product={{
            id: page.id,
            name: page.title,
            slug: page.slug,
            status: 'active',
            template: 'kiwify-neon',
            headline: page.title,
            subheadline: page.description,
            hero_type: 'video',
            hero_media_url: '',
            badge_text: '',
            currency: page.currency,
            original_price: page.originalPrice,
            promo_price: page.promoPrice,
            installments_text: page.installmentsText,
            cta_text: 'QUERO GARANTIR MINHA VAGA AGORA',
            cta_url: page.checkoutUrl,
            cta_subtext: '🔒 Acesso Imediato',
            guarantee_days: 7,
            countdown_enabled: true,
            countdown_minutes: 15,
            features: [],
            modules: [],
            testimonials: [],
            faqs: [],
            created_at: page.createdAt,
            updated_at: page.updatedAt,
          }}
          variant={topBarVariant}
        />
      )}
    </div>
  );
};

