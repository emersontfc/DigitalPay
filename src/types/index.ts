export type TemplateType = 'kiwify-neon' | 'minimal-luxury' | 'vanguard-black-gold';

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
  hero_type: 'video' | 'image';
  hero_media_url: string; // YouTube embed / mp4 / image url
  badge_text: string;
  
  // Pricing & Checkout
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
  
  created_at: string;
  updated_at: string;
}

export interface TemplateDefinition {
  id: TemplateType;
  name: string;
  description: string;
  badge: string;
  previewGradient: string;
  accentColor: string;
}

