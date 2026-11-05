import { IAIProvider, GeneratePagePromptParams, EditPageInstructionParams, PageEditResult } from './types';
import { PageSchema } from '../../types/aiBuilder';
import { MistralProvider } from './MistralProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { MockAIProvider } from './MockAIProvider';

export interface AIServiceConfig {
  providerId: 'mistral' | 'openai' | 'mock';
  apiKey: string;
  model: string;
  temperature: number;
}

const STORAGE_KEY_AI_CONFIG = 'digitalpay_ai_builder_config';

export class AIOrchestrator {
  private providers: Map<string, IAIProvider> = new Map();

  constructor() {
    const mock = new MockAIProvider();
    const mistral = new MistralProvider();
    const openai = new OpenAIProvider();

    this.providers.set('mock', mock);
    this.providers.set('mistral', mistral);
    this.providers.set('openai', openai);
  }

  getConfig(): AIServiceConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Erro ao ler configuração de IA:', e);
    }

    return {
      providerId: 'mock',
      apiKey: '',
      model: 'mistral-large-latest',
      temperature: 0.3,
    };
  }

  saveConfig(config: Partial<AIServiceConfig>) {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(updated));
  }

  getProvider(providerId?: string): IAIProvider {
    const id = providerId || this.getConfig().providerId;
    return this.providers.get(id) || this.providers.get('mock')!;
  }

  async generatePage(params: GeneratePagePromptParams): Promise<PageSchema> {
    const config = this.getConfig();
    const provider = this.getProvider(config.providerId);
    return provider.generatePage(params, config.apiKey, config.model);
  }

  async editPage(params: EditPageInstructionParams): Promise<PageEditResult> {
    const config = this.getConfig();
    const provider = this.getProvider(config.providerId);
    return provider.editPage(params, config.apiKey, config.model);
  }
}

export const aiOrchestrator = new AIOrchestrator();

