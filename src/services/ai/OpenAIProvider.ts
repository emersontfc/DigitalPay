import { IAIProvider, GeneratePagePromptParams, EditPageInstructionParams, PageEditResult } from './types';
import { PageSchema, PageSchemaDefinition } from '../../types/aiBuilder';
import { MockAIProvider } from './MockAIProvider';

export class OpenAIProvider implements IAIProvider {
  id = 'openai';
  name = 'OpenAI (GPT-4o / GPT-4o-mini)';

  private fallback = new MockAIProvider();

  async generatePage(
    params: GeneratePagePromptParams,
    apiKey?: string,
    model: string = 'gpt-4o-mini'
  ): Promise<PageSchema> {
    if (!apiKey) {
      console.warn('OpenAI API Key ausente. Usando gerador inteligente local.');
      return this.fallback.generatePage(params);
    }

    const systemPrompt = `
Você é o DigitalPay AI Builder, um especialista em copywriting e design de landing pages de alta conversão.
Gere um JSON RIGOROSO no formato PageSchema para o DigitalPay.
Responda APENAS com o objeto JSON correspondente, sem markdown.
`;

    const userPrompt = `
Gere uma página de vendas para:
Prompt: ${params.prompt}
Nome do Produto: ${params.productName || ''}
Moeda: ${params.currency || 'MZN'}
Preço Promocional: ${params.promoPrice || ''}
Preço Normal: ${params.originalPrice || ''}
WhatsApp: ${params.whatsappNumber || ''}
Estilo Visual: ${params.visualStyle || 'luxury-dark'}
Tom: ${params.tone || 'profissional'}
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        console.error('Erro na API OpenAI:', response.status);
        return this.fallback.generatePage(params);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      const parsed = JSON.parse(rawContent);

      return PageSchemaDefinition.parse(parsed);
    } catch (err) {
      console.error('Falha OpenAI, usando fallback local:', err);
      return this.fallback.generatePage(params);
    }
  }

  async editPage(
    params: EditPageInstructionParams,
    apiKey?: string,
    model: string = 'gpt-4o-mini'
  ): Promise<PageEditResult> {
    if (!apiKey) {
      return this.fallback.editPage(params);
    }

    const systemPrompt = `
Você é o assistente de edição do DigitalPay AI Builder.
Responda com um JSON contendo:
{
  "updatedPage": { ...PageSchema completo },
  "summaryOfChanges": "Resumo do que mudou",
  "modifiedSectionIds": ["ids-alterados"]
}
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `Instrução: ${params.instruction}\nPágina:\n${JSON.stringify(params.currentPage)}`,
            },
          ],
        }),
      });

      if (!response.ok) return this.fallback.editPage(params);

      const data = await response.json();
      const parsed = JSON.parse(data.choices?.[0]?.message?.content);

      return {
        updatedPage: PageSchemaDefinition.parse(parsed.updatedPage),
        summaryOfChanges: parsed.summaryOfChanges || 'Alterações aplicadas com sucesso.',
        modifiedSectionIds: parsed.modifiedSectionIds || [],
      };
    } catch {
      return this.fallback.editPage(params);
    }
  }
}
