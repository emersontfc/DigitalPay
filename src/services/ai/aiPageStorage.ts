import { PageSchema, PageVersion, PageSchemaDefinition } from '../../types/aiBuilder';
import { getSupabaseClient } from '../../lib/supabase';

const STORAGE_KEY_AI_PAGES = 'digitalpay_ai_pages_storage';
const STORAGE_KEY_AI_VERSIONS = 'digitalpay_ai_page_versions';

// Helper local
function getLocalPages(): PageSchema[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_PAGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler ai_pages do localStorage:', e);
    return [];
  }
}

function saveLocalPages(pages: PageSchema[]) {
  localStorage.setItem(STORAGE_KEY_AI_PAGES, JSON.stringify(pages));
}

function getLocalVersions(): PageVersion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_VERSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveLocalVersions(versions: PageVersion[]) {
  localStorage.setItem(STORAGE_KEY_AI_VERSIONS, JSON.stringify(versions));
}

export async function fetchAIPages(): Promise<PageSchema[]> {
  const client = getSupabaseClient();
  const local = getLocalPages();

  if (!client) {
    return local;
  }

  try {
    const { data, error } = await client
      .from('ai_pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return local;
    }

    // Mapear dados retornados do Supabase
    const remotePages: PageSchema[] = data.map((row: any) => {
      const parsed = typeof row.schema_json === 'string' ? JSON.parse(row.schema_json) : row.schema_json;
      return parsed;
    });

    return remotePages;
  } catch (e) {
    console.warn('Falha Supabase ai_pages, usando cache local:', e);
    return local;
  }
}

export async function fetchAIPageBySlug(slug: string): Promise<PageSchema | null> {
  const client = getSupabaseClient();
  const local = getLocalPages();
  const localMatch = local.find((p) => p.slug === slug);

  if (!client) {
    return localMatch || null;
  }

  try {
    const { data, error } = await client
      .from('ai_pages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return localMatch || null;
    }

    const parsed = typeof data.schema_json === 'string' ? JSON.parse(data.schema_json) : data.schema_json;
    return parsed as PageSchema;
  } catch {
    return localMatch || null;
  }
}

export async function fetchAIPageById(id: string): Promise<PageSchema | null> {
  const local = getLocalPages();
  const found = local.find((p) => p.id === id);
  if (found) return found;

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = await client.from('ai_pages').select('*').eq('id', id).maybeSingle();
      if (data) {
        return typeof data.schema_json === 'string' ? JSON.parse(data.schema_json) : data.schema_json;
      }
    } catch {}
  }

  return null;
}

export async function saveAIPage(page: PageSchema, changeSummary = 'Edição salva'): Promise<PageSchema> {
  const now = new Date().toISOString();
  const validatedPage: PageSchema = PageSchemaDefinition.parse({
    ...page,
    updatedAt: now,
  });

  // 1. Salvar no cache LocalStorage
  const local = getLocalPages();
  const existingIdx = local.findIndex((p) => p.id === validatedPage.id);
  if (existingIdx >= 0) {
    local[existingIdx] = validatedPage;
  } else {
    local.unshift(validatedPage);
  }
  saveLocalPages(local);

  // 2. Criar Snapshot de Versão
  const versions = getLocalVersions();
  const newVersion: PageVersion = {
    id: `ver-${Date.now()}`,
    pageId: validatedPage.id,
    versionNumber: versions.filter((v) => v.pageId === validatedPage.id).length + 1,
    changeSummary,
    authorEmail: 'admin@digitallpay.store',
    snapshot: validatedPage,
    createdAt: now,
  };
  versions.unshift(newVersion);
  saveLocalVersions(versions);

  // 3. Sincronizar com Supabase se a tabela existir
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('ai_pages').upsert(
        {
          id: validatedPage.id,
          slug: validatedPage.slug,
          title: validatedPage.title,
          status: validatedPage.status,
          schema_json: validatedPage,
          updated_at: now,
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Aviso ao sincronizar ai_pages no Supabase:', e);
    }
  }

  return validatedPage;
}

export async function deleteAIPage(id: string): Promise<void> {
  const local = getLocalPages().filter((p) => p.id !== id);
  saveLocalPages(local);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('ai_pages').delete().eq('id', id);
    } catch {}
  }
}

export async function fetchPageVersions(pageId: string): Promise<PageVersion[]> {
  const versions = getLocalVersions();
  return versions.filter((v) => v.pageId === pageId);
}

