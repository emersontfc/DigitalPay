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
  | 'monochrome-editorial'
  | 'ebook-classic-ivory'
  | 'ebook-ocean-clean'
  | 'ebook-emerald-reader'
  | 'ebook-crimson-bestseller'
  | 'ebook-royal-plum'
  | 'ebook-midnight-gold';

export type SocialProofLayout = 'cards' | 'carousel' | 'gallery' | 'whatsapp' | 'mixed';
export type GuaranteeStyle = 'card' | 'badge-button' | 'seal' | 'minimal';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonThickness = 'thin' | 'normal' | 'thick' | 'extra-thick';
export type ButtonRounded = 'md' | 'xl' | 'full';

export interface SocialProofImage {
  id: string;
  url: string;
  caption?: string;
}

export interface PageDesignSettings {
  // 1. Temporizador
  countdown_color?: string; // 'auto' | 'red' | 'green' | 'gold' | 'blue' | 'orange' | 'purple' | 'rose' | 'black' | hex
  // 4 & 5 & 9. Botões CTA
  cta_color?: string; // 'auto' | preset ('emerald', 'green', 'red', 'gold', 'blue', 'purple', 'orange', 'rose', 'cyan', 'black', 'white') | hex ('#...')
  cta_text_color?: string; // 'auto' | '#ffffff' | '#020617' | hex
  cta_size?: ButtonSize;
  cta_thickness?: ButtonThickness;
  cta_rounded?: ButtonRounded;
  cta_pulse?: boolean;
  // 7. Provas Sociais
  social_proof_layout?: SocialProofLayout;
  social_proof_images?: SocialProofImage[];
  // 8. Garantia Ajustável
  guarantee_enabled?: boolean;
  guarantee_style?: GuaranteeStyle;
  guarantee_size?: 'sm' | 'md' | 'lg';
  guarantee_color?: string; // 'auto' | 'emerald' | 'gold' | 'blue' | 'red' | 'purple' | 'white' | hex
  guarantee_title?: string;
  guarantee_description?: string;
  guarantee_button_text?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  printImageUrl?: string;
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

// Bônus Exclusivos de Alta Conversão (Stack de Valor)
export interface BonusItem {
  id: string;
  title: string;
  description: string;
  original_value?: number; // Ex: 197
  image_url?: string;
  tag?: string; // Ex: "BÔNUS EXCLUSIVO #1"
}

// Público-Alvo: Qualificação e Desqualificação
export interface TargetAudience {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  for_whom: string[]; // ['Quer criar uma nova fonte de renda', ...]
  not_for_whom: string[]; // ['Quem busca dinheiro fácil sem esforço', ...]
}

// Sobre o Especialista / Bio do Instrutor / Autoridade
export interface InstructorProfile {
  enabled?: boolean;
  name: string;
  role_title: string;
  bio: string;
  avatar_url?: string;
  badges?: string[]; // ['+5.000 Alunos', '7 Dígitos Faturados', 'Suporte VIP']
}

// Plano de Estudos / Cronograma / Jornada
export interface StudyPlanStep {
  id: string;
  phase: string; // Ex: 'Semana 1' ou 'Fase 1'
  title: string;
  description: string;
  duration?: string; // Ex: '5 Aulas' ou '7 Dias'
}

export interface StudyPlan {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  steps: StudyPlanStep[];
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
  
  // Blocos de Alta Conversão (Padrão Top Infoprodutos Hotmart / Kiwify)
  bonuses?: BonusItem[];
  target_audience?: TargetAudience;
  instructor?: InstructorProfile;
  study_plan?: StudyPlan;
  
  // Extras opcionais de alta conversão
  whatsapp_number?: string;
  whatsapp_message?: string;
  facebook_pixel_id?: string;
  
  // Multi-idioma & Multi-moeda
  multilang_enabled?: boolean; // Se o seletor de idiomas está ativo na página
  translations?: {
    en?: ProductTranslation;
    es?: ProductTranslation;
    'pt-mz'?: ProductTranslation;
    'pt-ao'?: ProductTranslation;
  };
  
  // Personalização visual da página (cores, botões, temporizador, provas sociais, garantia)
  design_settings?: PageDesignSettings;

  // Entregáveis & Entrega Automática PaySuite
  deliverables?: import('./deliverables').ProductDeliverable[];
  delivery_mode?: import('./deliverables').DeliveryMode; // 'automatic' | 'manual'
  access_expires_days?: number; // 0 = ilimitado
  max_downloads?: number; // 0 = ilimitado

  created_at: string;
  updated_at: string;
}

export * from './deliverables';

export type SupportedLanguage = 'pt' | 'pt-mz' | 'pt-ao' | 'en' | 'es';

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
  bonuses?: BonusItem[];
  target_audience?: TargetAudience;
  instructor?: InstructorProfile;
  study_plan?: StudyPlan;
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
  category?: 'ebook' | 'vsl' | 'high-ticket' | 'brand';
  previewGradient: string;
  accentColor: string;
}
