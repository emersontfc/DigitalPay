export type TemplateType =
  | 'kiwify-neon'
  | 'minimal-luxury'
  | 'vanguard-black-gold'
  | 'titanium-tech'
  | 'crimson-beast'
  | 'rose-gold-glamour'
  | 'sapphire-fintech'
  | 'sunset-creator'
  | 'midnight-violet'
  | 'emerald-prestige'
  | 'monochrome-editorial';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  lessonsCount?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'draft';
  template: TemplateType;
  
  // Hero & Copy
  headline: string;
  subheadline: string;
  hero_type: 'video' | 'image' | 'vsl';
  hero_media_url: string; // YouTube embed / mp4 / image url / Panda / VTurb / Data URL
  badge_text: string;
  
  // VSL & Vídeo Otimizado
  vsl_pitch_delay_seconds?: number; // Delay em segundos para exibir botões de checkout e oferta
  vsl_autoplay?: boolean; // Autoplay do vídeo VSL
  
  // Pricing & Checkout
  currency?: string; // BRL (R$), USD ($), EUR (€), AOA (Kz), MZN (MT), etc.
  original_price: number;
  promo_price: number;
  installments_text: string;
  cta_text: string;
  cta_url: string; // URL do checkout Kiwify / Stripe / etc.
  cta_subtext: string;
  
  // Trust & Urgency
  guarantee_days: number;
  countdown_enabled: boolean;
  countdown_minutes: number;
  
  // Content blocks
  features: string[];
  modules: ModuleItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  
  // Extras opcionais de alta conversão
  whatsapp_number?: string;
  whatsapp_message?: string;
  facebook_pixel_id?: string;
  
  // Multi-idioma & Multi-moeda
  multilang_enabled?: boolean; // Se o seletor de idiomas está ativo na página
  translations?: {
    en?: ProductTranslation;
    es?: ProductTranslation;
  };
  
  created_at: string;
  updated_at: string;
}

export type SupportedLanguage = 'pt' | 'en' | 'es';

export interface ProductTranslation {
  name?: string;
  headline?: string;
  subheadline?: string;
  badge_text?: string;
  cta_text?: string;
  cta_subtext?: string;
  cta_url?: string;
  installments_text?: string;
  promo_price?: number;
  original_price?: number;
  currency?: string;
  features?: string[];
  modules?: ModuleItem[];
  testimonials?: Testimonial[];
  faqs?: FaqItem[];
}

export interface PageModel {
  id: string;
  name: string;
  description: string;
  category: 'vsl' | 'ebook' | 'mentoria' | 'comunidade' | 'marca' | 'personalizado';
  template: TemplateType;
  productData: Partial<Product>;
  created_at: string;
}

export interface TemplateDefinition {
  id: TemplateType;
  name: string;
  description: string;
  badge: string;
  previewGradient: string;
  accentColor: string;
}
