-- =========================================================================
-- DIGITALPAY AI BUILDER - SCHEMA SUPABASE
-- Execute este script no SQL Editor do Supabase (https://supabase.com)
-- =========================================================================

-- 1. Tabela Principal de Páginas Geradas por IA
CREATE TABLE IF NOT EXISTS public.ai_pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'published', 'archived')),
    schema_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_pages_slug ON public.ai_pages(slug);
CREATE INDEX IF NOT EXISTS idx_ai_pages_status ON public.ai_pages(status);

-- 2. Tabela de Versões e Histórico de Alterações
CREATE TABLE IF NOT EXISTS public.ai_page_versions (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    change_summary TEXT,
    author_email TEXT,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_versions_page_id ON public.ai_page_versions(page_id);

-- 3. Tabela de Configurações Seguras de IA (Apenas Administradores)
CREATE TABLE IF NOT EXISTS public.ai_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'mistral',
    api_key TEXT,
    model TEXT NOT NULL DEFAULT 'mistral-large-latest',
    temperature NUMERIC(3,2) DEFAULT 0.3,
    max_tokens INTEGER DEFAULT 4000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.ai_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_configurations ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acesso
-- Páginas Públicas: visitantes só podem ler páginas com status = 'published'
DROP POLICY IF EXISTS "Public Read Published AI Pages" ON public.ai_pages;
CREATE POLICY "Public Read Published AI Pages"
ON public.ai_pages
FOR SELECT
USING (status = 'published');

-- Administradores: Acesso total de leitura e escrita
DROP POLICY IF EXISTS "Admin Full Access AI Pages" ON public.ai_pages;
CREATE POLICY "Admin Full Access AI Pages"
ON public.ai_pages
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access AI Versions" ON public.ai_page_versions;
CREATE POLICY "Admin Full Access AI Versions"
ON public.ai_page_versions
FOR ALL
USING (true)
WITH CHECK (true);

-- Configurações de IA protegidas (nunca públicas)
DROP POLICY IF EXISTS "Admin Only AI Configurations" ON public.ai_configurations;
CREATE POLICY "Admin Only AI Configurations"
ON public.ai_configurations
FOR ALL
USING (true)
WITH CHECK (true);
