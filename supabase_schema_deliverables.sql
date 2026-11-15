-- =========================================================================
-- DIGITALPAY - GESTÃO DE ENTREGÁVEIS E ENTREGA AUTOMÁTICA PAYSUITE
-- Execute este script no SQL Editor do Supabase (https://supabase.com)
-- =========================================================================

-- 1. Estender a tabela products com suporte nativo a entregáveis e entrega
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_mode TEXT DEFAULT 'automatic' CHECK (delivery_mode IN ('automatic', 'manual'));
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS access_expires_days INTEGER DEFAULT 0;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS max_downloads INTEGER DEFAULT 0;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 2. Tabela de Entregáveis do Produto (Arquivos, Links, Textos, Códigos)
CREATE TABLE IF NOT EXISTS public.product_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('file', 'link', 'text', 'license_code')),
    file_path TEXT, -- Caminho no bucket privado do Supabase Storage
    file_name TEXT, -- Nome original do arquivo
    file_size_bytes BIGINT, -- Tamanho em bytes
    file_mime_type TEXT, -- application/pdf, etc.
    external_url TEXT, -- Google Drive, Área de Membros, Hotmart, etc.
    content_text TEXT, -- Instruções, credenciais ou códigos
    download_limit INTEGER DEFAULT 0, -- 0 = ilimitado
    expires_in_days INTEGER DEFAULT 0, -- 0 = ilimitado
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para carregamento rápido
CREATE INDEX IF NOT EXISTS idx_deliverables_product ON public.product_deliverables(product_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_active ON public.product_deliverables(is_active);

-- 3. Tabela de Encomendas / Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT UNIQUE NOT NULL, -- Ex: DP-20261116-A1B2C3
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MZN',
    payment_method TEXT DEFAULT 'paysuite', -- mpesa, emola, card, paysuite
    payment_gateway TEXT DEFAULT 'paysuite',
    gateway_payment_id TEXT, -- ID retornado pelo PaySuite
    checkout_url TEXT, -- URL de checkout do PaySuite
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'manual_approved')),
    delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'revoked')),
    delivery_mode TEXT NOT NULL DEFAULT 'automatic' CHECK (delivery_mode IN ('automatic', 'manual')),
    access_token TEXT UNIQUE NOT NULL, -- Token criptográfico único para o comprador acessar sem senha
    access_expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_token ON public.orders(access_token);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 4. Tabela de Acessos e Downloads de Entregáveis por Pedido
CREATE TABLE IF NOT EXISTS public.order_deliverables_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    deliverable_id UUID REFERENCES public.product_deliverables(id) ON DELETE CASCADE,
    downloads_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_deliv_access ON public.order_deliverables_access(order_id, deliverable_id);

-- 5. Tabela de Logs de Webhooks (Idempotência e Rastreabilidade PaySuite)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL DEFAULT 'paysuite',
    event_type TEXT NOT NULL,
    event_id TEXT, -- ID do evento ou transação PaySuite para prevenir duplicatas
    reference TEXT,
    payload JSONB NOT NULL,
    headers JSONB,
    signature_valid BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('processed', 'ignored', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhooks_ref ON public.webhook_logs(reference);
CREATE INDEX IF NOT EXISTS idx_webhooks_event ON public.webhook_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_created ON public.webhook_logs(created_at DESC);

-- 6. Tabela de Auditoria de Entregas e Ações Administrativas
CREATE TABLE IF NOT EXISTS public.order_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- manual_delivery_authorized, payment_status_updated, access_revoked, access_resent
    actor_email TEXT NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_order ON public.order_audit_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.order_audit_logs(created_at DESC);

-- 7. Triggers de atualização automática de updated_at
DROP TRIGGER IF EXISTS on_deliverables_updated ON public.product_deliverables;
CREATE TRIGGER on_deliverables_updated
    BEFORE UPDATE ON public.product_deliverables
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Habilitar RLS em todas as novas tabelas
ALTER TABLE public.product_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_deliverables_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. Políticas de Segurança (Row Level Security)
-- Acesso público controlado: Compradores podem ler status de seu pedido por referência ou access_token
DROP POLICY IF EXISTS "Public Read Order by Reference" ON public.orders;
CREATE POLICY "Public Read Order by Reference" 
ON public.orders 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin Full Access Orders" ON public.orders;
CREATE POLICY "Admin Full Access Orders" 
ON public.orders 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Deliverables" ON public.product_deliverables;
CREATE POLICY "Admin Full Access Deliverables" 
ON public.product_deliverables 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Webhooks" ON public.webhook_logs;
CREATE POLICY "Admin Full Access Webhooks" 
ON public.webhook_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Audit" ON public.order_audit_logs;
CREATE POLICY "Admin Full Access Audit" 
ON public.order_audit_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Access" ON public.order_deliverables_access;
CREATE POLICY "Admin Full Access Access" 
ON public.order_deliverables_access 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 10. Bucket Privado do Supabase Storage para Arquivos Protegidos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'digitalpay-deliverables',
    'digitalpay-deliverables',
    false, -- Bucket PRIVADO: downloads apenas via signed URLs seguras
    524288000, -- Limite de 500MB por arquivo
    ARRAY[
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/epub+zip',
        'image/png',
        'image/jpeg',
        'image/webp',
        'video/mp4',
        'audio/mpeg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false;

-- Política de storage: Leitura e escrita controladas
DROP POLICY IF EXISTS "Allow Admin Upload Deliverables" ON storage.objects;
CREATE POLICY "Allow Admin Upload Deliverables"
ON storage.objects
FOR ALL
USING (bucket_id = 'digitalpay-deliverables')
WITH CHECK (bucket_id = 'digitalpay-deliverables');
