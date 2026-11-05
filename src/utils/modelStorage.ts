import { PageModel, Product } from '../types';
import { FACTORY_PAGE_MODELS } from '../data/pageModels';

const STORAGE_KEY_CUSTOM_MODELS = 'digitalpay_custom_page_models';

export function getCustomModels(): PageModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_MODELS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler modelos personalizados do localStorage:', e);
    return [];
  }
}

export function saveCustomModel(
  name: string,
  description: string,
  productData: Partial<Product>
): PageModel {
  const current = getCustomModels();
  
  // Clean productData to remove id, slug, created_at, updated_at
  const cleanData = { ...productData };
  delete cleanData.id;
  delete cleanData.slug;
  delete cleanData.created_at;
  delete cleanData.updated_at;

  const newModel: PageModel = {
    id: `custom-model-${Date.now()}`,
    name: name.trim() || 'Meu Modelo Personalizado',
    description: description.trim() || 'Modelo de página salvo para reutilização rápida.',
    category: 'personalizado',
    template: productData.template || 'kiwify-neon',
    productData: cleanData,
    created_at: new Date().toISOString(),
  };

  const updated = [newModel, ...current];
  localStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(updated));
  return newModel;
}

export function deleteCustomModel(id: string): void {
  const current = getCustomModels();
  const updated = current.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(updated));
}

export function getAllModels(): { factory: PageModel[]; custom: PageModel[] } {
  return {
    factory: FACTORY_PAGE_MODELS,
    custom: getCustomModels(),
  };
}
