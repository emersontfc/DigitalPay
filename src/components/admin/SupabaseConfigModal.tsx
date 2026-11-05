import React, { useState, useEffect } from 'react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured
} from '../../lib/supabase';
import { Database, CheckCircle, AlertTriangle, ExternalLink, X, Copy, Check } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setKey(cfg.key);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTestResult(null);

    saveSupabaseConfig(url, key);

    const res = await testSupabaseConnection();
    setTestResult(res);
    setLoading(false);
    onConfigChanged();
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setKey('');
    setTestResult({ success: true, message: 'Configuração removida. O sistema está no modo local persistente.' });
    onConfigChanged();
  };

  const handleTestOnly = async () => {
    setLoading(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Conexão com o Supabase</h3>
              <p className="text-xs text-slate-400">
                Conecte seu banco de dados PostgreSQL do Supabase em segundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
            <p className="font-semibold text-white flex items-center gap-1.5">
              💡 Como funciona o Digitall Pay:
            </p>
            <p className="text-slate-400">
              O sistema funciona imediatamente mesmo sem Supabase (usando armazenamento local com produtos reais para teste). Quando quiser persistência em nuvem, basta colocar as credenciais abaixo e rodar o arquivo <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">supabase_schema.sql</code> no SQL Editor do Supabase.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-mono"
              />
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm">{testResult.message}</div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              >
                Limpar e Usar Modo Local
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestOnly}
                  disabled={loading || !url || !key}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Testando...' : 'Testar Conexão'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Configuração'}
                </button>
              </div>
            </div>
          </form>

          {/* Dica do SQL Schema */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Script SQL do Banco</p>
              <p className="text-[11px] text-slate-400">
                O arquivo <span className="text-emerald-400 font-mono">supabase_schema.sql</span> já está pronto na raiz do projeto.
              </p>
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <span>Abrir Supabase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

