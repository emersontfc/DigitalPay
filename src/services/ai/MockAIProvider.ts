import { IAIProvider, GeneratePagePromptParams, EditPageInstructionParams, PageEditResult } from './types';
import { PageSchema, PageSchemaDefinition, SectionData } from '../../types/aiBuilder';

export class MockAIProvider implements IAIProvider {
  id = 'mock';
  name = 'Gerador Inteligente Local (Offline / Fallback)';

  async generatePage(params: GeneratePagePromptParams): Promise<PageSchema> {
    const prompt = params.prompt || '';
    const name = params.productName || this.extractProductName(prompt) || 'Curso Profissional de Alto Impacto';
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const currency = params.currency || (prompt.includes('MT') ? 'MZN' : prompt.includes('R$') ? 'BRL' : 'MZN');
    const promoPrice = params.promoPrice || this.extractPrice(prompt) || 2500;
    const originalPrice = params.originalPrice || Math.round(promoPrice * 1.8);
    const whatsapp = params.whatsappNumber || this.extractWhatsApp(prompt) || '+258 84 000 0000';
    const checkout = params.checkoutUrl || 'https://digitallpay.store';

    const isGold = prompt.toLowerCase().includes('dourado') || params.visualStyle === 'luxury-dark';

    const sections: SectionData[] = [
      {
        id: 'hero-main',
        type: 'hero',
        title: 'Hero Principal',
        isVisible: true,
        styles: { paddingY: 'lg', fullWidth: false },
        props: {
          badgeText: isGold ? 'SELEÇÃO VIP • VAGAS LIMITADAS' : 'MÉTODO DE ALTA CONVERSÃO',
          headline: `Domine ${name} e Multiplique Seus Resultados`,
          subtitle: `Um passo a passo prático desenhado especificamente para você alcançar metas reais com segurança, consistência e acompanhamento dedicado.`,
          mediaType: params.mediaType || 'video',
          mediaUrl: params.mediaUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          primaryCtaText: 'QUERO GARANTIR MINHA VAGA AGORA',
          highlights: ['Acesso Imediato no E-mail/WhatsApp', 'Garantia Incondicional de 7 Dias', 'Certificado Incluso'],
        },
      },
      {
        id: 'countdown-urgency',
        type: 'countdown',
        title: 'Contador de Escassez',
        isVisible: true,
        styles: { paddingY: 'sm', fullWidth: true },
        props: {
          minutes: 15,
          label: 'ATENÇÃO: CONDIÇÃO PROMOCIONAL ENCERRA EM BREVE:',
        },
      },
      {
        id: 'benefits-grid',
        type: 'benefits',
        title: 'Vantagens Exclusivas',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: 'Por Que Este Método É Diferente de Tudo?',
          subtitle: 'Você terá acesso a um ecossistema completo pensado na sua evolução diária:',
          items: [
            { title: 'Prática Desde o Dia 1', description: 'Chega de teoria vazia. Você coloca a mão na massa com exercícios práticos aplicáveis ao seu negócio.' },
            { title: 'Estratégias Validadas', description: 'Técnicas já testadas e comprovadas no mercado de Moçambique e internacional com alto retorno.' },
            { title: 'Comunidade VIP no WhatsApp', description: 'Networking direto com outros profissionais determinados para tirar dúvidas e fechar parcerias.' },
            { title: 'Acesso Vitalício e Atualizações', description: 'Acesse as aulas e todos os materiais complementares quando e onde quiser, sem expiração.' },
          ],
        },
      },
      {
        id: 'curriculum-list',
        type: 'curriculum-modules',
        title: 'Módulos do Curso',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: 'O Que Você Vai Aprender Passo a Passo',
          subtitle: 'Uma trilha de aprendizagem estruturada para levar você do zero ao nível avançado:',
          items: [
            { title: 'Módulo 1: Fundamentos & Posicionamento Estratégico', lessonsCount: '4 Aulas', description: 'Alinhamento dos pilares essenciais e configuração das ferramentas indispensáveis.' },
            { title: 'Módulo 2: O Motor de Atração de Clientes', lessonsCount: '6 Aulas', description: 'Como gerar demanda diária e atrair pessoas realmente interessadas na sua oferta.' },
            { title: 'Módulo 3: Fechamento de Vendas & Conversão no WhatsApp', lessonsCount: '5 Aulas', description: 'Scripts persuasivos e processos para fechar pedidos sem objeções.' },
            { title: 'Módulo 4: Escala e Otimização de Lucro', lessonsCount: '4 Aulas', description: 'Como aumentar o seu faturamento com consistência mantendo custos baixos.' },
          ],
        },
      },
      {
        id: 'bonuses-box',
        type: 'bonuses',
        title: 'Bónus Exclusivos',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: '3 Bónus Incríveis Inclusos na Sua Inscrição',
          subtitle: 'Ao se inscrever hoje você não paga nada a mais por estes conteúdos complementares:',
          items: [
            { title: 'Bónus 1: Pack de Modelos e Modelos Prontos', description: 'Modelos de alta conversão para você apenas preencher e usar.', value: `Valor: 1.500 ${currency}` },
            { title: 'Bónus 2: Aulão Secreto de Tráfego Pago', description: 'Como anunciar com orçamento baixo e obter máximo retorno.', value: `Valor: 2.000 ${currency}` },
            { title: 'Bónus 3: Suporte Direto com o Mentor', description: 'Canal prioritário para tirar dúvidas do seu projeto.', value: 'Inestimável' },
          ],
        },
      },
      {
        id: 'pricing-offer',
        type: 'pricing-plans',
        title: 'Tabela de Preço & Oferta',
        isVisible: true,
        styles: { paddingY: 'lg', fullWidth: false },
        props: {
          title: 'Garanta Sua Vaga Com Valor Promocional',
          subtitle: 'Aproveite o desconto de lançamento antes do encerramento do lote atual:',
          planName: 'Acesso Completo + Todos os Bónus',
          originalPrice,
          promoPrice,
          installmentsText: `ou em até 3x sem juros`,
          ctaText: 'QUERO APROVEITAR ESTA OPORTUNIDADE',
          guaranteeDays: 7,
          features: [
            'Acesso Imediato a Todas as Aulas em Alta Definição',
            '3 Bónus Exclusivos (Pack de Modelos + Aulão + Comunidade)',
            'Grupo VIP de Networking no WhatsApp',
            'Garantia Incondicional de 7 Dias',
            'Certificado Oficial de Conclusão',
          ],
        },
      },
      {
        id: 'authority-bio',
        type: 'authority-creator',
        title: 'Sobre o Criador',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          name: 'Emerson Torres',
          role: 'Especialista em Negócios Digitais & Marketing',
          bio: 'Empreendedor digital com anos de experiência prática, dedicado a capacitar profissionais e empresas a utilizarem a internet e a tecnologia para alavancarem suas receitas.',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          achievements: [
            '+500 Alunos e Mentorados Transformados',
            'Especialista em Estruturação de Ofertas de Alta Conversão',
            'Reconhecido pela Didática Prática e Foco em Resultados',
          ],
        },
      },
      {
        id: 'testimonials-reviews',
        type: 'testimonials',
        title: 'Prova Social',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: 'Histórias de Quem Já Teve Resultados',
          subtitle: 'Veja a experiência de pessoas reais que aplicaram o método:',
          items: [
            { name: 'Lucas Mabunda', role: 'Maputo', content: 'Apliquei o conteúdo do Módulo 2 e no mesmo fim de semana recuperei 3x o valor do curso!', rating: 5, isVerified: true },
            { name: 'Tânia Macamo', role: 'Matola', content: 'Didática impecável. Direto ao ponto, com suporte ágil e que realmente se importa com o nosso sucesso.', rating: 5, isVerified: true },
            { name: 'Jorge Nhantumbo', role: 'Beira', content: 'Melhor investimento do ano. As técnicas de WhatsApp dobraram o fechamento das minhas vendas.', rating: 5, isVerified: true },
          ],
        },
      },
      {
        id: 'guarantee-seal',
        type: 'guarantee',
        title: 'Garantia Incondicional',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          days: 7,
          title: 'Garantia Incondicional de 7 Dias',
          description: 'Você entra, assiste às aulas, baixa os materiais e avalia. Se achar que o conteúdo não é para você, devolvemos 100% do seu investimento sem complicações.',
        },
      },
      {
        id: 'faq-list',
        type: 'faq-accordion',
        title: 'Perguntas Frequentes',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: 'Perguntas Frequentes (FAQ)',
          subtitle: 'Respostas para as dúvidas mais comuns dos nossos alunos:',
          items: [
            { question: 'Como recebo o acesso ao curso?', answer: 'O envio é imediato via e-mail e WhatsApp logo após a aprovação do seu pagamento.' },
            { question: 'Quais métodos de pagamento são aceitos?', answer: 'Aceitamos M-Pesa, E-Mola, Cartão de Crédito e Transferência Bancária.' },
            { question: 'Preciso ter computador ou posso fazer pelo telemóvel?', answer: 'Pode assistir e aplicar todo o treinamento diretamente pelo seu telemóvel ou pelo computador.' },
            { question: 'Por quanto tempo terei acesso?', answer: 'O seu acesso é vitalício. Você pode rever todas as aulas quantas vezes quiser.' },
          ],
        },
      },
      {
        id: 'whatsapp-direct',
        type: 'whatsapp-cta',
        title: 'Chamada WhatsApp',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          title: 'Ainda Tem Alguma Dúvida?',
          subtitle: 'Converse agora com nossa equipe no WhatsApp para tirar dúvidas sobre pagamento ou conteúdo.',
          buttonText: 'Falar Com a Equipe no WhatsApp',
          whatsappNumber: whatsapp,
          whatsappMessage: `Olá! Tenho interesse no ${name} e gostaria de mais informações.`,
        },
      },
      {
        id: 'footer-main',
        type: 'footer-legal',
        title: 'Rodapé',
        isVisible: true,
        styles: { paddingY: 'md', fullWidth: false },
        props: {
          copyrightText: `© ${new Date().getFullYear()} ${name} • Digitall Pay. Todos os direitos reservados.`,
          legalDisclaimer: 'Este produto não garante a obtenção de resultados sem dedicação prática. Os resultados dependem do esforço individual de cada participante.',
        },
      },
    ];

    const generatedPage: PageSchema = {
      schemaVersion: 1,
      id: `ai-page-${Date.now()}`,
      slug,
      title: name,
      description: `Página de vendas profissional criada por IA para ${name}`,
      status: 'draft',
      currency,
      originalPrice,
      promoPrice,
      installmentsText: `ou 3x sem juros`,
      checkoutUrl: checkout,
      whatsappNumber: whatsapp,
      whatsappMessage: `Olá! Quero me inscrever no ${name}`,
      theme: {
        preset: isGold ? 'luxury-dark' : 'digital-neon',
        primaryColor: isGold ? '#f59e0b' : '#10b981',
        secondaryColor: isGold ? '#b45309' : '#047857',
        backgroundColor: '#07090e',
        textColor: '#f8fafc',
        accentColor: isGold ? '#fbbf24' : '#34d399',
        surfaceColor: '#0f172a',
        borderRadius: 'lg',
        fontFamily: 'sans',
      },
      sections,
      seo: {
        metaTitle: `${name} | Inscrições Abertas`,
        metaDescription: `Acesse o treinamento definitivo de ${name}. Vagas limitadas com preço promocional de ${promoPrice} ${currency}.`,
        keywords: [name, 'curso', 'vendas', 'digital', 'moçambique'],
        ogImage: '',
      },
      tracking: {
        facebookPixelId: '',
        googleTagId: '',
        tiktokPixelId: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return PageSchemaDefinition.parse(generatedPage);
  }

  async editPage(params: EditPageInstructionParams): Promise<PageEditResult> {
    const { instruction, currentPage } = params;
    const lower = instruction.toLowerCase();
    const updated: PageSchema = JSON.parse(JSON.stringify(currentPage));
    const modifiedIds: string[] = [];

    // Regra 1: Mudar fundo ou tema para escuro/dourado
    if (lower.includes('dourad') || lower.includes('ouro') || lower.includes('gold')) {
      updated.theme.preset = 'luxury-dark';
      updated.theme.primaryColor = '#f59e0b';
      updated.theme.accentColor = '#fbbf24';
      updated.theme.secondaryColor = '#b45309';
      modifiedIds.push('theme');
    } else if (lower.includes('verde') || lower.includes('neon') || lower.includes('kiwify')) {
      updated.theme.preset = 'digital-neon';
      updated.theme.primaryColor = '#10b981';
      updated.theme.accentColor = '#34d399';
      modifiedIds.push('theme');
    }

    // Regra 2: Alterar preço
    const extractedPrice = this.extractPrice(instruction);
    if (extractedPrice) {
      updated.promoPrice = extractedPrice;
      updated.originalPrice = Math.round(extractedPrice * 1.8);
      
      const pricingSection = updated.sections.find((s) => s.type === 'pricing-plans');
      if (pricingSection) {
        pricingSection.props.promoPrice = extractedPrice;
        pricingSection.props.originalPrice = Math.round(extractedPrice * 1.8);
        modifiedIds.push(pricingSection.id);
      }
    }

    // Regra 3: Adicionar WhatsApp
    const wa = this.extractWhatsApp(instruction);
    if (wa || lower.includes('whatsapp')) {
      if (wa) updated.whatsappNumber = wa;
      
      // Ativa WhatsApp no hero
      const hero = updated.sections.find((s) => s.type === 'hero');
      if (hero) {
        hero.props.showWhatsApp = true;
        modifiedIds.push(hero.id);
      }
      
      // Adiciona seção de WhatsApp caso não exista
      if (!updated.sections.some((s) => s.type === 'whatsapp-cta')) {
        updated.sections.push({
          id: `whatsapp-cta-${Date.now()}`,
          type: 'whatsapp-cta',
          title: 'Chamada WhatsApp',
          isVisible: true,
          styles: { paddingY: 'md', fullWidth: false },
          props: {
            title: 'Fale Conosco Diretamente no WhatsApp',
            subtitle: 'Tire qualquer dúvida em tempo real com nossos especialistas.',
            buttonText: 'Conversar no WhatsApp',
            whatsappNumber: updated.whatsappNumber,
          },
        });
        modifiedIds.push('whatsapp-cta');
      }
    }

    // Regra 4: Adicionar ou remover FAQ
    if (lower.includes('adiciona') && lower.includes('faq')) {
      if (!updated.sections.some((s) => s.type === 'faq-accordion')) {
        updated.sections.push({
          id: `faq-${Date.now()}`,
          type: 'faq-accordion',
          title: 'Perguntas Frequentes',
          isVisible: true,
          styles: { paddingY: 'md', fullWidth: false },
          props: {
            title: 'Perguntas Frequentes (FAQ)',
            subtitle: 'Respostas para as dúvidas mais comuns:',
            items: [
              { question: 'Como acesso o produto?', answer: 'Envio imediato por e-mail e WhatsApp.' },
              { question: 'Existe garantia?', answer: 'Sim, você tem 7 dias de garantia incondicional.' },
            ],
          },
        });
        modifiedIds.push('faq-accordion');
      }
    }

    // Regra 5: Melhorar título / Headline
    if (lower.includes('título') || lower.includes('headline')) {
      const hero = updated.sections.find((s) => s.type === 'hero');
      if (hero) {
        hero.props.headline = `O Método Definitivo Para Alavancar Seus Resultados Profissionais`;
        modifiedIds.push(hero.id);
      }
    }

    updated.updatedAt = new Date().toISOString();

    return {
      updatedPage: updated,
      summaryOfChanges: `IA aplicou: ${instruction}`,
      modifiedSectionIds: modifiedIds.length > 0 ? modifiedIds : ['page'],
    };
  }

  private extractProductName(text: string): string | null {
    const match = text.match(/(?:para|de|sobre)\s+(?:um\s+|uma\s+)?([A-Za-zÀ-ÿ0-9\s]+?)(?:\.|\,|$|\s+com|\s+onde|\s+preço)/i);
    return match ? match[1].trim() : null;
  }

  private extractPrice(text: string): number | null {
    const match = text.match(/(\d+[\.\,]?\d*)\s*(?:mt|mzn|kz|aoa|r\$|\$|eur|reais|meticais)/i) ||
                  text.match(/(?:preço|valor|custa)\s*(?:de|é)?\s*(\d+[\.\,]?\d*)/i);
    if (!match) return null;
    const clean = match[1].replace('.', '').replace(',', '.');
    return Number(clean) || null;
  }

  private extractWhatsApp(text: string): string | null {
    const match = text.match(/(?:\+?\d{2,3}\s*)?(?:8[2-7]\d{7}|9\d{8}|[1-9]\d{9,10})/);
    return match ? match[0] : null;
  }
}
