import { z } from 'zod';

// ============================================================================
// 1. ESQUEMA DE TEMAS E ESTILOS
// ============================================================================
export const ThemePresetSchema = z.enum([
  'luxury-dark',       // Fundo escuro profundo, dourado/âmbar, alto padrão
  'modern-minimal',    // Limpo, cinza elegante, contraste sutil
  'digital-neon',      // Preto e verde neon, estilo Kiwify infoprodutos
  'corporate-clean',   // Azul marinho e branco corporativo
  'vibrant-marketing', // Cores vibrantes com gradientes de alta energia
  'education-premium', // Tons sóbrios, autoridade educacional
]);

export type ThemePreset = z.infer<typeof ThemePresetSchema>;

export const ThemeConfigSchema = z.object({
  preset: ThemePresetSchema.default('luxury-dark'),
  primaryColor: z.string().default('#10b981'), // Cor de destaque principal
  secondaryColor: z.string().default('#047857'),
  backgroundColor: z.string().default('#07090e'),
  textColor: z.string().default('#f8fafc'),
  accentColor: z.string().default('#f59e0b'), // Dourado/alerta
  surfaceColor: z.string().default('#0f172a'), // Cor de cards e superfícies
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']).default('md'),
  fontFamily: z.enum(['sans', 'serif', 'mono']).default('sans'),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// ============================================================================
// 2. TIPOS DE COMPONENTES REUTILIZÁVEIS DA PÁGINA
// ============================================================================
export const SectionTypeSchema = z.enum([
  'hero',                 // Hero com imagem ou vídeo
  'benefits',             // Grid ou lista de benefícios
  'features',             // Características técnicas/recursos
  'product-showcase',     // Apresentação detalhada do produto
  'pricing-plans',        // Tabela de preços ou oferta única
  'special-offer',        // Box de oferta com escassez e desconto
  'countdown',            // Contador regressivo de urgência
  'faq-accordion',        // Perguntas frequentes interativas
  'testimonials',         // Prova social e testemunhos reais/demo
  'image-gallery',        // Galeria de imagens/mockups
  'video-demo',           // Demonstração em vídeo ou aula grátis
  'stats',                // Números expressivos (alunos, países, faturamento)
  'guarantee',            // Selo de garantia (7, 15 ou 30 dias)
  'bonuses',              // Lista de bónus exclusivos
  'contact-form',         // Formulário de contacto/leads
  'whatsapp-cta',         // Botão ou banner direto para WhatsApp
  'checkout-cta',         // Botão principal de checkout com animação
  'authority-creator',    // Apresentação do criador/mentor/empresa
  'before-after',         // Comparativo Antes vs Depois
  'curriculum-modules',   // Conteúdo curricular/módulos de aulas
  'footer-legal',         // Rodapé com avisos legais e direitos
]);

export type SectionType = z.infer<typeof SectionTypeSchema>;

// ============================================================================
// 3. PROPRIEDADES ESPECÍFICAS DE CADA SEÇÃO (VALIDADAS COM ZOD)
// ============================================================================
export const SectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  title: z.string().optional(),
  subtitle: z.string().optional(),
  isVisible: z.boolean().default(true),
  props: z.record(z.string(), z.any()).default({}),
  styles: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
    fullWidth: z.boolean().default(false),
  }).default({ paddingY: 'md', fullWidth: false }),
});

export type SectionData = z.infer<typeof SectionSchema>;

// ============================================================================
// 4. ESQUEMA GERAL DA PÁGINA (VERSIONADO: SCHEMA VERSION 1)
// ============================================================================
export const PageSchemaDefinition = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.string(),
  slug: z.string().min(2),
  title: z.string().min(2),
  description: z.string().default(''),
  status: z.enum(['draft', 'in_review', 'published', 'archived']).default('draft'),
  
  // Produto vinculado (opcional)
  productId: z.string().optional(),
  
  // Dados de precificação e moeda
  currency: z.string().default('MZN'),
  originalPrice: z.number().default(0),
  promoPrice: z.number().default(0),
  installmentsText: z.string().default(''),
  
  // Ações de conversão
  checkoutUrl: z.string().default(''),
  whatsappNumber: z.string().default(''),
  whatsappMessage: z.string().default(''),
  
  // Tema visual
  theme: ThemeConfigSchema.default(() => ThemeConfigSchema.parse({})),
  
  // Seções da página
  sections: z.array(SectionSchema).default([]),
  
  // Metadados SEO e Rastreamento
  seo: z.object({
    metaTitle: z.string().default(''),
    metaDescription: z.string().default(''),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().default(''),
  }).default(() => ({
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    ogImage: '',
  })),
  
  tracking: z.object({
    facebookPixelId: z.string().default(''),
    googleTagId: z.string().default(''),
    tiktokPixelId: z.string().default(''),
  }).default(() => ({
    facebookPixelId: '',
    googleTagId: '',
    tiktokPixelId: '',
  })),

  // Timestamps
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
  publishedAt: z.string().optional(),
});

export type PageSchema = z.infer<typeof PageSchemaDefinition>;

// ============================================================================
// 5. HISTÓRICO DE VERSÕES
// ============================================================================
export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  changeSummary: string;
  authorEmail: string;
  snapshot: PageSchema;
  createdAt: string;
}

// ============================================================================
// 6. CHAT E COPILOT COM IA
// ============================================================================
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  appliedChangesSummary?: string;
  suggestedAction?: 'add_section' | 'modify_props' | 'change_theme' | 'regenerate';
}

// ============================================================================
// 7. CONFIGURAÇÃO DE PROVEDORES DE IA
// ============================================================================
export type AIProviderId = 'mistral' | 'openai' | 'mock';

export interface AIProviderConfig {
  provider: AIProviderId;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  isFallback?: boolean;
}
