import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Método Tráfego Automático 10K',
    slug: 'metodo-trafego-automatico',
    status: 'active',
    template: 'kiwify-neon',
    headline: 'Descubra o Sistema Invisível Para Vender Todos os Dias No Piloto Automático',
    subheadline: 'Copie e cole o funil validado que já gerou múltiplos 6 dígitos no mercado digital com apenas 30 minutos por dia.',
    hero_type: 'video',
    hero_media_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    badge_text: '🔥 OFERTA EXCLUSIVA - ÚLTIMAS VAGAS DISPONÍVEIS',
    original_price: 497.00,
    promo_price: 197.00,
    installments_text: 'ou 12x de R$ 19,78 no cartão de crédito',
    cta_text: 'SIM! QUERO GARANTIR MINHA VAGA AGORA',
    cta_url: 'https://pay.kiwify.com.br',
    cta_subtext: '🔒 Compra 100% Segura • Acesso Imediato no E-mail',
    guarantee_days: 7,
    countdown_enabled: true,
    countdown_minutes: 15,
    features: [
      'Funil de Vendas Perpétuo Pronto Para Importar',
      'Scripts de Anúncios de Alta Conversão (CTR +3.5%)',
      'Planilha de Gestão e Escala de Tráfego 2026',
      'Comunidade Secreta de Networking e Alunos',
      'Acesso Vitalício + Atualizações Sem Custo Extra'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1: A Estrutura Secreta do Tráfego Perpétuo',
        description: 'Entenda os fundamentos que 99% dos afiliados e produtores ignoram ao rodar tráfego direto.',
        lessonsCount: '6 Aulas Práticas'
      },
      {
        id: 'mod-2',
        title: 'Módulo 2: Criativos Magnéticos Que Não Tomam Bloqueio',
        description: 'Aprenda a criar imagens e vídeos impossíveis de serem ignorados no feed do Instagram e TikTok.',
        lessonsCount: '8 Aulas Práticas'
      },
      {
        id: 'mod-3',
        title: 'Módulo 3: Otimização e Escala Horizontal',
        description: 'Como transformar R$ 50/dia em R$ 1.000/dia mantendo o ROI positivo de forma previsível.',
        lessonsCount: '10 Aulas Práticas'
      }
    ],
    testimonials: [
      {
        id: 'test-1',
        name: 'Rafael Albuquerque',
        role: 'Infoprodutor & Gestor de Tráfego',
        content: 'Apliquei o módulo 2 logo no primeiro final de semana e fiz R$ 4.200 em vendas automáticas. O método é direto ao ponto e não tem enrolação!',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5
      },
      {
        id: 'test-2',
        name: 'Mariana Castro',
        role: 'Mentora de Negócios Digitais',
        content: 'Eu nunca tinha conseguido um ROI consistente até entender a esteira ensinada na aula 4. Mudou completamente meus resultados.',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        rating: 5
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question: 'Como vou receber o meu acesso?',
        answer: 'Imediatamente após a aprovação do seu pagamento, os dados de login e senha são enviados direto para o seu e-mail cadastrado.'
      },
      {
        id: 'faq-2',
        question: 'Serve para quem está começando do zero absoluto?',
        answer: 'Com certeza! O curso foi gravado com passo a passo detalhado, com cliques na tela, mesmo se você nunca tiver anunciado na vida.'
      },
      {
        id: 'faq-3',
        question: 'E se eu não gostar do treinamento?',
        answer: 'Você tem garantia total de 7 dias. Basta enviar um simples e-mail para nossa equipe que reembolsamos 100% do seu valor.'
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    name: 'Executive High-Ticket Masterclass',
    slug: 'executive-masterclass',
    status: 'active',
    template: 'minimal-luxury',
    headline: 'Estratégias de Posicionamento e Vendas de Alto Valor Para Especialistas',
    subheadline: 'O protocolo refinado para atrair clientes dispostos a pagar R$ 5k, R$ 10k e R$ 20k por mentorias e consultorias.',
    hero_type: 'image',
    hero_media_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    badge_text: 'MASTERCLASS EXCLUSIVA • TURMA LIMITADA',
    original_price: 1997.00,
    promo_price: 997.00,
    installments_text: 'ou 12x de R$ 99,50 no cartão',
    cta_text: 'APLICAR PARA A MASTERCLASS AGORA',
    cta_url: 'https://pay.kiwify.com.br',
    cta_subtext: 'Entrevista de alinhamento e confirmação imediata',
    guarantee_days: 15,
    countdown_enabled: true,
    countdown_minutes: 30,
    features: [
      'Estrutura de Pitch e Apresentação Irrecusável',
      'Roteiros de Qualificação para Fechamento no 1 a 1',
      'Templates de Propostas Comerciais de Luxo',
      'Sessões Quinzenais de Hotseat com Análise de Negócios',
      'Acesso à Rede Privada de Líderes do Mercado'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Fase 1: O Posicionamento de Autoridade Inquestionável',
        description: 'Como elevar a percepção de valor dos seus serviços para eliminar objeções de preço logo no primeiro contato.',
        lessonsCount: '4 Encontros Gravados'
      },
      {
        id: 'm2',
        title: 'Fase 2: Funil Sem Atrito Para Clientes Qualificados',
        description: 'Construa uma máquina de prospecção inbound que traz leads com alto poder aquisitivo prontos para comprar.',
        lessonsCount: '5 Frameworks Práticos'
      }
    ],
    testimonials: [
      {
        id: 't1',
        name: 'Dr. Leonardo Vasconcelos',
        role: 'Consultor Empresarial',
        content: 'Fechei dois contratos de R$ 15.000 cada utilizando rigorosamente a estrutura apresentada no Módulo de Propostas. O retorno foi imediato.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 5
      }
    ],
    faqs: [
      {
        id: 'f1',
        question: 'Quem deve participar deste programa?',
        answer: 'Ideal para consultores, mentores, agências e prestadores de serviços que já faturam e querem escalar o ticket médio.'
      },
      {
        id: 'f2',
        question: 'Terei acesso direto ao suporte?',
        answer: 'Sim, você terá canal direto com nosso time e grupo reservado de acompanhamento.'
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    name: 'Protocolo Vanguard: Conversão Acelerada',
    slug: 'protocolo-vanguard',
    status: 'active',
    template: 'vanguard-black-gold',
    headline: 'O Guia Definitivo Para Criar Ofertas Impossíveis de Serem Ignoradas',
    subheadline: 'Aprenda os segredos da psicologia de vendas e copywriting militar para transformar tráfego frio em faturamento recorde.',
    hero_type: 'image',
    hero_media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    badge_text: '⚡ OFERTA RELÂMPAGO • APENAS HOJE COM 67% OFF',
    original_price: 297.00,
    promo_price: 97.00,
    installments_text: 'ou 12x de R$ 9,70',
    cta_text: 'QUERO O PROTOCOLO COM 67% DE DESCONTO',
    cta_url: 'https://pay.kiwify.com.br',
    cta_subtext: '⚡ Download Imediato em PDF + Planilhas e Bônus',
    guarantee_days: 30,
    countdown_enabled: true,
    countdown_minutes: 10,
    features: [
      'Manual Completo de Gatilhos Mentais de Choque',
      'Mais de 50 Modelos de Headlines Prontas Para Copiar',
      'Checklist de Auditoria de Páginas de Alta Conversão',
      'Bônus: Swipe File Secreto com Campanhas de 7 Dígitos',
      'Garantia Incondicional de 30 Dias'
    ],
    modules: [
      {
        id: 'mod-v1',
        title: 'Arsenal 1: Psicologia Oculta de Tomada de Decisão',
        description: 'Os gatilhos biológicos que fazem o cliente sacar o cartão sem pensar duas vezes.',
        lessonsCount: 'Guia Completo'
      },
      {
        id: 'mod-v2',
        title: 'Arsenal 2: A Anatomia da Oferta Irrecusável',
        description: 'Como empilhar valor de modo que o seu preço pareça ridículo perto do que ele recebe.',
        lessonsCount: 'Templates Editáveis'
      }
    ],
    testimonials: [
      {
        id: 'test-v1',
        name: 'Camila Menezes',
        role: 'Copywriter Profissional',
        content: 'O Swipe File sozinho já vale 10x o valor do produto. Economizei semanas de trabalho e bati recorde de conversão.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        rating: 5
      }
    ],
    faqs: [
      {
        id: 'faq-v1',
        question: 'O material é online ou físico?',
        answer: '100% digital com download instantâneo para ler no computador, tablet ou celular.'
      },
      {
        id: 'faq-v2',
        question: 'Possui garantia?',
        answer: 'Sim, você tem 30 dias para testar todo o material. Se não gostar, devolvemos seu dinheiro.'
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

