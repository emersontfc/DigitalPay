-- =========================================================================
-- DIGITALPAY - TABELA DE ADMINISTRADORES E GESTÃO DE APROVAÇÕES
-- Execute este script no SQL Editor do Supabase (supabase.com)
-- =========================================================================

-- 1. Garante que a coluna currency exista na tabela products
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';
    END IF;
END $$;

-- 2. Criação da tabela de administradores e aprovação
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

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acesso
DROP POLICY IF EXISTS "Public Read and Write for Admin Users" ON public.admin_users;
CREATE POLICY "Public Read and Write for Admin Users" 
ON public.admin_users 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Inserir o Emerson Torres como Super Admin aprovado por padrão
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
