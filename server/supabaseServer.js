import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qurmkmevghdosokyfbtc.supabase.co';
// Usa chave de serviço (service_role) no backend para operações administrativas se disponível, ou anon key
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vzEJCFJojdELMsCkztGfsw_2aiFgWMz';

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const STORAGE_BUCKET = 'digitalpay-deliverables';
