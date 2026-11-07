-- =========================================================================
-- DIGITALPAY - SCHEMA SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase (supabase.com)
-- =========================================================================

-- Adiciona colunas extras e suporte a VSL caso a tabela já tenha sido criada anteriormente
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vsl_pitch_delay_seconds INTEGER DEFAULT 0;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vsl_autoplay BOOLEAN DEFAULT false;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS facebook_pixel_id TEXT;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS whatsapp_message TEXT;
        ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_hero_type_check;
        ALTER TABLE public.products ADD CONSTRAINT products_hero_type_check CHECK (hero_type IN ('video', 'image', 'vsl'));
    END IF;
END $$;

-- 1. Criação da tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
    template TEXT NOT NULL DEFAULT 'kiwify-neon' CHECK (template IN ('kiwify-neon', 'minimal-luxury', 'vanguard-black-gold')),
    
    -- Copy & Hero
    headline TEXT NOT NULL,
    subheadline TEXT,
    hero_type TEXT NOT NULL DEFAULT 'video' CHECK (hero_type IN ('video', 'image', 'vsl')),
    hero_media_url TEXT,
    badge_text TEXT DEFAULT 'Oferta Exclusiva por Tempo Limitado',
    vsl_pitch_delay_seconds INTEGER DEFAULT 0,
    vsl_autoplay BOOLEAN DEFAULT false,
    
    -- Preço e Checkout
    currency TEXT NOT NULL DEFAULT 'BRL',
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 297.00,
    promo_price NUMERIC(10, 2) NOT NULL DEFAULT 97.00,
    installments_text TEXT DEFAULT 'ou 12x de R$ 9,74 no cartão',
    cta_text TEXT NOT NULL DEFAULT 'QUERO GARANTIR MINHA VAGA AGORA',
    cta_url TEXT NOT NULL DEFAULT 'https://kiwify.com.br',
    cta_subtext TEXT DEFAULT '🔒 Compra 100% Segura • Acesso Imediato no E-mail',
    
    -- Garantia & Escassez
    guarantee_days INTEGER NOT NULL DEFAULT 7,
    countdown_enabled BOOLEAN NOT NULL DEFAULT true,
    countdown_minutes INTEGER NOT NULL DEFAULT 15,
    
    -- Dados em JSON
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    testimonials JSONB NOT NULL DEFAULT '[]'::jsonb,
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Extras de Conversão e Rastreamento
    whatsapp_number TEXT,
    whatsapp_message TEXT,
    facebook_pixel_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índice rápido para busca por Slug (URLs amigáveis /p/:slug)
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acesso
-- Permitir leitura pública de produtos ativos (para os compradores na página de vendas)
CREATE POLICY "Public Read Access for Active Products" 
ON public.products 
FOR SELECT 
USING (true);

-- Permitir criação, edição e exclusão (para o painel de admin da DigitalPay)
CREATE POLICY "Admin Full Access Products" 
ON public.products 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Função de atualização automática do updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_products_updated
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- DADOS INICIAIS DE EXEMPLO (SEED DATA)
-- =========================================================================
INSERT INTO public.products (
    id,
    name,
    slug,
    status,
    template,
    headline,
    subheadline,
    hero_type,
    hero_media_url,
    badge_text,
    original_price,
    promo_price,
    installments_text,
    cta_text,
    cta_url,
    cta_subtext,
    guarantee_days,
    countdown_enabled,
    countdown_minutes,
    features,
    modules,
    testimonials,
    faqs
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Método Tráfego Automático 10K',
    'metodo-trafego-automatico',
    'active',
    'kiwify-neon',
    'Descubra o Sistema Invisível Para Vender Todos os Dias Sem Precisar Aparecer',
    'Copie e cole o funil validado que já gerou múltiplos 6 dígitos no mercado digital com apenas 30 minutos por dia.',
    'video',
    'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1',
    '🔥 TURMA EXCLUSIVA 2026 - ÚLTIMAS VAGAS DISPONÍVEIS',
    497.00,
    197.00,
    'ou 12x de R$ 19,78 no cartão de crédito',
    'SIM! QUERO ACESSAR O MÉTODO AGORA',
    'https://pay.kiwify.com.br',
    '⚡ Acesso liberado imediatamente após a confirmação do pagamento',
    7,
    true,
    15,
    '[
        "Funil de Vendas Perpétuo Pronto Para Importar",
        "Scripts de Anúncios de Alta Conversão (CTR +3.5%)",
        "Planilha de Gestão e Escala de Tráfego",
        "Comunidade Secreta de Networking e Suporte Vitalício",
        "Acesso Vitalício + Todas as Atualizações Futuras"
    ]'::jsonb,
    '[
        {
            "id": "mod-1",
            "title": "Módulo 1: A Estrutura Secreta do Tráfego Perpétuo",
            "description": "Entenda os fundamentos que 99% dos afiliados e produtores ignoram ao rodar tráfego direto.",
            "lessonsCount": "6 Aulas Práticas"
        },
        {
            "id": "mod-2",
            "title": "Módulo 2: Criativos Magnéticos Que Não Tomam Bloqueio",
            "description": "Aprenda a criar imagens e vídeos impossíveis de serem ignorados no feed do Instagram e TikTok.",
            "lessonsCount": "8 Aulas Práticas"
        },
        {
            "id": "mod-3",
            "title": "Módulo 3: Otimização e Escala Horizontal",
            "description": "Como transformar R$ 50/dia em R$ 1.000/dia mantendo o ROI positivo de forma previsível.",
            "lessonsCount": "10 Aulas Práticas"
        }
    ]'::jsonb,
    '[
        {
            "id": "test-1",
            "name": "Rafael Albuquerque",
            "role": "Infoprodutor & Gestor",
            "content": "Apliquei o módulo 2 logo no primeiro final de semana e fiz R$ 4.200 em vendas automáticas. O conteúdo é direto ao ponto e não tem enrolação!",
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "rating": 5
        },
        {
            "id": "test-2",
            "name": "Mariana Castro",
            "role": "Mentora de Negócios",
            "content": "Eu nunca tinha conseguido um ROI consistente até entender a esteira ensinada na aula 4. Mudou completamente meu jogo no digital.",
            "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
            "rating": 5
        }
    ]'::jsonb,
    '[
        {
            "id": "faq-1",
            "question": "Como vou receber o acesso?",
            "answer": "Imediatamente após a aprovação do seu pagamento, os dados de acesso chegarão diretamente no seu e-mail cadastrado."
        },
        {
            "id": "faq-2",
            "question": "Serve para quem está começando do zero absoluto?",
            "answer": "Sim! O método foi estruturado passo a passo, mostrando desde o básico na tela do computador até estratégias avançadas de escala."
        },
        {
            "id": "faq-3",
            "question": "E se eu não gostar?",
            "answer": "Você tem garantia incondicional de 7 dias. Basta enviar um e-mail que devolvemos 100% do seu dinheiro, sem perguntas."
        }
    ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- =========================================================================
-- 6. TABELA DE USUÁRIOS ADMINISTRADORES E GESTÃO DE APROVAÇÕES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read and Write for Admin Users" ON public.admin_users;
CREATE POLICY "Public Read and Write for Admin Users" 
ON public.admin_users 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Cadastra o Emerson Torres como Super Admin aprovado
INSERT INTO public.admin_users (id, email, name, password, role, status)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'emersontorres42@gmail.com',
    'Emerson Torres',
    '112212',
    'super_admin',
    'approved'
) ON CONFLICT (email) DO UPDATE SET
    role = 'super_admin',
    status = 'approved',
    password = '112212';


