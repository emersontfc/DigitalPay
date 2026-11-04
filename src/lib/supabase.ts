import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEY_PRODUCTS = 'digitalpay_products_local';
const STORAGE_KEY_SUPABASE_URL = 'digitalpay_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'digitalpay_supabase_anon_key';

export function getSupabaseConfig(): { url: string; key: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
  };
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, key.trim());
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return null;
  }

  if (supabaseInstance && url === lastUrl && key === lastKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key);
    lastUrl = url;
    lastKey = key;
    return supabaseInstance;
  } catch (err) {
    console.error('Erro ao instanciar cliente Supabase:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
}

// -------------------------------------------------------------
// OPERAÇÕES LOCAIS (FALLBACK DE ALTA CONFIABILIDADE)
// -------------------------------------------------------------
function getLocalProducts(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler produtos do localStorage:', e);
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

// -------------------------------------------------------------
// SERVIÇO DE PRODUTOS UNIFICADO (SUPABASE + LOCAL STORAGE)
// -------------------------------------------------------------
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'URL e Anon Key do Supabase não configurados.' };
  }

  try {
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
    if (error) {
      return { success: false, message: `Erro ao consultar tabela products: ${error.message}` };
    }
    return { success: true, message: 'Conexão com o Supabase estabelecida com sucesso!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Falha na conexão com Supabase.' };
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) {
    return getLocalProducts();
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar do Supabase, usando fallback local:', error.message);
      return getLocalProducts();
    }

    if (!data || data.length === 0) {
      // Se a tabela estiver vazia no Supabase, podemos inicializar com os dados de exemplo
      console.log('Tabela vazia no Supabase, exibindo inicial e salvando...');
      return getLocalProducts();
    }

    return data as Product[];
  } catch (err) {
    console.warn('Falha de rede Supabase, usando fallback local:', err);
    return getLocalProducts();
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const client = getSupabaseClient();
  if (!client) {
    const products = getLocalProducts();
    return products.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const local = getLocalProducts().find(p => p.slug === slug);
      return local || null;
    }

    return data as Product;
  } catch {
    return getLocalProducts().find(p => p.slug === slug) || null;
  }
}

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  const now = new Date().toISOString();
  const client = getSupabaseClient();

  const isNew = !product.id;
  const targetId = product.id || crypto.randomUUID();

  const fullProduct: Product = {
    id: targetId,
    name: product.name || 'Novo Produto Digital',
    slug: (product.slug || product.name || 'produto')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
    status: product.status || 'active',
    template: product.template || 'kiwify-neon',
    headline: product.headline || 'Aprenda o Método Definitivo Para Ter Resultados',
    subheadline: product.subheadline || '',
    hero_type: product.hero_type || 'image',
    hero_media_url: product.hero_media_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    badge_text: product.badge_text || 'Oferta Especial',
    original_price: Number(product.original_price) || 197,
    promo_price: Number(product.promo_price) || 97,
    installments_text: product.installments_text || 'ou 12x de R$ 9,70',
    cta_text: product.cta_text || 'QUERO GARANTIR MINHA VAGA AGORA',
    cta_url: product.cta_url || 'https://pay.kiwify.com.br',
    cta_subtext: product.cta_subtext || '🔒 Compra 100% Segura • Acesso Imediato',
    guarantee_days: Number(product.guarantee_days) || 7,
    countdown_enabled: product.countdown_enabled !== undefined ? product.countdown_enabled : true,
    countdown_minutes: Number(product.countdown_minutes) || 15,
    features: product.features || [],
    modules: product.modules || [],
    testimonials: product.testimonials || [],
    faqs: product.faqs || [],
    created_at: product.created_at || now,
    updated_at: now,
  };

  // Sempre sincroniza no LocalStorage como cache e fallback
  const localList = getLocalProducts();
  const existingIdx = localList.findIndex(p => p.id === fullProduct.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = fullProduct;
  } else {
    localList.unshift(fullProduct);
  }
  saveLocalProducts(localList);

  if (client) {
    try {
      const { error } = await client
        .from('products')
        .upsert(fullProduct, { onConflict: 'id' });

      if (error) {
        console.error('Aviso ao sincronizar produto no Supabase:', error.message);
      }
    } catch (e) {
      console.error('Falha de conexão Supabase ao salvar:', e);
    }
  }

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const client = getSupabaseClient();

  // Remove do local
  const localList = getLocalProducts().filter(p => p.id !== id);
  saveLocalProducts(localList);

  if (client) {
    try {
      const { error } = await client.from('products').delete().eq('id', id);
      if (error) {
        console.error('Erro ao deletar no Supabase:', error.message);
      }
    } catch (e) {
      console.error('Falha de rede Supabase ao deletar:', e);
    }
  }
}

export function resetLocalData() {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
}

