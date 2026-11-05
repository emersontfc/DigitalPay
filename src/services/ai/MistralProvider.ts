import { IAIProvider, GeneratePagePromptParams, EditPageInstructionParams, PageEditResult } from './types';
import { PageSchema, PageSchemaDefinition } from '../../types/aiBuilder';
import { MockAIProvider } from './MockAIProvider';

export class MistralProvider implements IAIProvider {
  id = 'mistral';
  name = 'Mistral AI (Magistral / Large)';

  private fallback = new MockAIProvider();

  async generatePage(
    params: GeneratePagePromptParams,
    apiKey?: string,
    model: string = 'mistral-large-latest'
  ): Promise<PageSchema> {
    if (!apiKey) {
      console.warn('Mistral API Key ausente. Usando gerador inteligente local.');
      return this.fallback.generatePage(params);
    }

    const systemPrompt = `
Você é o DigitalPay AI Builder, um arquiteto sênior e copywriter de páginas de vendas de alta conversão.
Sua missão é gerar um JSON RIGOROSO no formato PageSchema para a plataforma DigitalPay.

IMPORTANTE:
- Responda APENAS com um objeto JSON válido, sem markdown, sem explicações em volta.
- O JSON deve conter:
  schemaVersion: 1,
  id: string,
  slug: string (letras minúsculas e hífens),
  title: string,
  description: string,
  status: "draft",
  currency: string (ex: "MZN", "BRL", "USD"),
  originalPrice: number,
  promoPrice: number,
  installmentsText: string,
  checkoutUrl: string,
  whatsappNumber: string,
  whatsappMessage: string,
  theme: {
    preset: "luxury-dark" | "modern-minimal" | "digital-neon" | "corporate-clean" | "vibrant-marketing",
    primaryColor: string (hex),
    secondaryColor: string (hex),
    backgroundColor: string (hex),
    textColor: string (hex),
    accentColor: string (hex),
    surfaceColor: string (hex),
    borderRadius: "sm" | "md" | "lg" | "full",
    fontFamily: "sans" | "serif" | "mono"
  },
  sections: Array de seções com id, type ("hero" | "countdown" | "benefits" | "features" | "curriculum-modules" | "bonuses" | "pricing-plans" | "authority-creator" | "testimonials" | "guarantee" | "faq-accordion" | "whatsapp-cta" | "before-after" | "footer-legal"), title, isVisible: true, props: object, styles: object.
- Dê especial atenção ao português de Moçambique quando a moeda for MZN (Metical).
`;

    const userPrompt = `
Gere uma página de vendas completa com base nas seguintes especificações:
Prompt: ${params.prompt}
Nome do Produto: ${params.productName || 'Não especificado'}
Moeda: ${params.currency || 'MZN'}
Preço Promocional: ${params.promoPrice || 'Detectar no prompt'}
Preço Normal: ${params.originalPrice || 'Detectar no prompt'}
WhatsApp: ${params.whatsappNumber || ''}
Estilo Visual: ${params.visualStyle || 'luxury-dark'}
Tom de Comunicação: ${params.tone || 'profissional'}
`;

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: 'json_object' },
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Erro na API da Mistral:', response.status, errText);
        return this.fallback.generatePage(params);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      const parsed = JSON.parse(rawContent);

      return PageSchemaDefinition.parse(parsed);
    } catch (err) {
      console.error('Falha de execução Mistral AI, usando fallback:', err);
      return this.fallback.generatePage(params);
    }
  }

  async editPage(
    params: EditPageInstructionParams,
    apiKey?: string,
    model: string = 'mistral-large-latest'
  ): Promise<PageEditResult> {
    if (!apiKey) {
      return this.fallback.editPage(params);
    }

    const systemPrompt = `
Você é o assistente de edição do DigitalPay AI Builder.
Você recebe uma página existente em JSON e uma instrução de edição do usuário.
Você deve responder APENAS com um JSON contendo:
{
  "updatedPage": { ... (PageSchema completo atualizado) },
  "summaryOfChanges": "Resumo objetivo do que foi alterado",
  "modifiedSectionIds": ["id-da-secao-modificada"]
}
`;

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: 'json_object' },
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Instrução: ${params.instruction}\nPágina Atual:\n${JSON.stringify(params.currentPage)}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        return this.fallback.editPage(params);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      const parsed = JSON.parse(rawContent);

      return {
        updatedPage: PageSchemaDefinition.parse(parsed.updatedPage),
        summaryOfChanges: parsed.summaryOfChanges || 'Alterações aplicadas com sucesso.',
        modifiedSectionIds: parsed.modifiedSectionIds || [],
      };
    } catch (e) {
      console.warn('Erro ao editar com Mistral, usando fallback local:', e);
      return this.fallback.editPage(params);
    }
  }
}
