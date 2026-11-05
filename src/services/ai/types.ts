import { PageSchema, ThemePreset } from '../../types/aiBuilder';

export interface GeneratePagePromptParams {
  prompt: string;
  productName?: string;
  category?: string;
  description?: string;
  targetAudience?: string;
  market?: string; // Ex: 'Moçambique', 'Brasil', 'Angola', 'Global'
  currency?: string; // 'MZN', 'BRL', 'USD', 'EUR', 'AOA'
  originalPrice?: number;
  promoPrice?: number;
  benefits?: string[];
  features?: string[];
  mediaType?: 'video' | 'image';
  mediaUrl?: string;
  checkoutUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  tone?: 'profissional' | 'premium' | 'emocional' | 'direto' | 'educativo' | 'persuasivo';
  visualStyle?: ThemePreset;
}

export interface EditPageInstructionParams {
  instruction: string;
  currentPage: PageSchema;
  targetSectionId?: string;
}

export interface PageEditResult {
  updatedPage: PageSchema;
  summaryOfChanges: string;
  modifiedSectionIds: string[];
}

export interface IAIProvider {
  id: string;
  name: string;
  generatePage(params: GeneratePagePromptParams, apiKey?: string, model?: string): Promise<PageSchema>;
  editPage(params: EditPageInstructionParams, apiKey?: string, model?: string): Promise<PageEditResult>;
}

