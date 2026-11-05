import { IAIProvider, GeneratePagePromptParams, EditPageInstructionParams, PageEditResult } from './types';
import { PageSchema } from '../../types/aiBuilder';
import { MistralProvider } from './MistralProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { MockAIProvider } from './MockAIProvider';
import { getSupabaseClient } from '../../lib/supabase';

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

  async saveConfig(config: Partial<AIServiceConfig>): Promise<void> {
    const current = this.getConfig();
    const updated: AIServiceConfig = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(updated));

    // Opcional: tenta sincronizar com a tabela ai_configurations do Supabase
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from('ai_configurations').upsert(
          {
            provider: updated.providerId,
            api_key: updated.apiKey,
            model: updated.model,
            temperature: updated.temperature,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'provider' }
        );
      }
    } catch (e) {
      // Ignora silenciosamente caso a tabela ainda não tenha sido criada no Supabase
      console.warn('Aviso: configuração salva localmente (Supabase indisponível ou tabela ausente).');
    }
  }

  getProvider(providerId?: string): IAIProvider {
    const id = providerId || this.getConfig().providerId;
    return this.providers.get(id) || this.providers.get('mock')!;
  }

  getStatus(): { providerId: string; providerName: string; isConfigured: boolean; isMock: boolean } {
    const cfg = this.getConfig();
    const isMock = cfg.providerId === 'mock';
    const isConfigured = isMock || Boolean(cfg.apiKey && cfg.apiKey.trim().length > 10);
    const names: Record<string, string> = {
      mistral: 'Mistral AI',
      openai: 'OpenAI',
      mock: 'Modo Local (Grátis)',
    };

    return {
      providerId: cfg.providerId,
      providerName: names[cfg.providerId] || 'Desconhecido',
      isConfigured,
      isMock,
    };
  }

  /**
   * Testa a conectividade da chave de API sem gastar tokens.
   */
  async testConnection(providerId: string, apiKey: string): Promise<{ ok: boolean; message: string }> {
    if (providerId === 'mock') {
      return {
        ok: true,
        message: 'Modo Local (Offline) ativo! Gera páginas completas instantaneamente sem custo e sem chave.',
      };
    }

    const key = (apiKey || '').trim();
    if (!key) {
      return {
        ok: false,
        message: 'Por favor, informe a Chave de API antes de testar.',
      };
    }

    try {
      if (providerId === 'mistral') {
        const response = await fetch('https://api.mistral.ai/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          return {
            ok: true,
            message: 'Conexão com a Mistral AI bem-sucedida! Chave ativa e pronta para gerar páginas.',
          };
        }

        if (response.status === 401) {
          return {
            ok: false,
            message: 'Chave da Mistral AI inválida ou não autorizada (401). Verifique a chave no console.mistral.ai.',
          };
        }

        if (response.status === 429) {
          return {
            ok: false,
            message: 'Limite de requisições excedido ou falta de créditos na sua conta Mistral (429).',
          };
        }

        return {
          ok: false,
          message: `Mistral retornou status ${response.status}. Verifique sua conta.`,
        };
      }

      if (providerId === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          return {
            ok: true,
            message: 'Conexão com a OpenAI bem-sucedida! Modelos GPT-4o disponíveis.',
          };
        }

        if (response.status === 401) {
          return {
            ok: false,
            message: 'Chave da OpenAI inválida ou não autorizada (401). Verifique em platform.openai.com.',
          };
        }

        if (response.status === 429) {
          return {
            ok: false,
            message: 'Cota de créditos da OpenAI esgotada ou limite de uso atingido (429).',
          };
        }

        return {
          ok: false,
          message: `OpenAI retornou status ${response.status}. Verifique sua conta.`,
        };
      }

      return { ok: true, message: 'Provedor verificado com sucesso.' };
    } catch (err: any) {
      return {
        ok: false,
        message: `Falha na requisição de rede: ${err?.message || 'Verifique sua conexão de internet.'}`,
      };
    }
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
