import React, { useState, useEffect } from 'react';
import { aiOrchestrator, AIServiceConfig } from '../../services/ai/aiOrchestrator';
import {
  Sparkles,
  Key,
  Check,
  X,
  AlertCircle,
  Shield,
  Info,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Cpu,
  Wifi,
  Zap
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [config, setConfig] = useState<AIServiceConfig>(aiOrchestrator.getConfig());
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(aiOrchestrator.getConfig());
      setShowKey(false);
      setTestResult(null);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await aiOrchestrator.testConnection(config.providerId, config.apiKey);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err?.message || 'Erro inesperado ao testar conexão com IA.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await aiOrchestrator.saveConfig(config);
    setSaved(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Configurar Chave de IA</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Super Admin
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gerencie as chaves de API e motores de inteligência artificial do DigitalPay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Caixa Explicativa Amigável */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Como funciona a IA no Digitall Pay?</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              A IA cria títulos persuasivos, módulos de curso, tabelas de preços e páginas inteiras de alta conversão a partir de um comando em texto.
              Você pode inserir sua própria chave de API da <strong>Mistral AI</strong> ou <strong>OpenAI</strong>, ou usar o <strong>Modo Local Grátis</strong> sem custos.
            </p>
          </div>

          {/* Seleção do Provedor de IA */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Escolha o Provedor de IA
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'mistral',
                  label: 'Mistral AI',
                  badge: 'Recomendado',
                  desc: 'Magistral / Large • Excelente em português',
                },
                {
                  id: 'openai',
                  label: 'OpenAI',
                  badge: 'Popular',
                  desc: 'GPT-4o & Mini • Alta precisão',
                },
                {
                  id: 'mock',
                  label: 'Modo Local',
                  badge: '100% Grátis',
                  desc: 'Sem chave • Rápido e sem custos',
                },
              ].map((p) => {
                const isSelected = config.providerId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const newModel =
                        p.id === 'mistral'
                          ? 'mistral-large-latest'
                          : p.id === 'openai'
                          ? 'gpt-4o-mini'
                          : 'local-fast';
                      setConfig({ ...config, providerId: p.id as any, model: newModel });
                      setTestResult(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-xs sm:text-sm text-white">{p.label}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        p.id === 'mock'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo de Chave de API (Apenas Mistral ou OpenAI) */}
          {config.providerId !== 'mock' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Chave de API ({config.providerId === 'mistral' ? 'Mistral API Key' : 'OpenAI API Key'})
                </label>
                {config.providerId === 'mistral' ? (
                  <a
                    href="https://console.mistral.ai/api-keys/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Obter chave na Mistral</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Obter chave na OpenAI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder={
                    config.providerId === 'mistral'
                      ? 'Cole sua chave Mistral (ex: mis_...)'
                      : 'Cole sua chave OpenAI (ex: sk-...)'
                  }
                  value={config.apiKey}
                  onChange={(e) => {
                    setConfig({ ...config, apiKey: e.target.value });
                    setTestResult(null);
                  }}
                  className="w-full pl-4 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showKey ? 'Ocultar chave' : 'Exibir chave'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Sua chave é salva com segurança no navegador e utilizada apenas para gerar suas páginas.
                </span>
              </p>
            </div>
          ) : (
            /* Aviso do Modo Local */
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs leading-relaxed flex items-start gap-3">
              <Zap className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-0.5">
                  Modo Local Gratuito Selecionado
                </strong>
                <span>
                  Você não precisa de nenhuma chave de API ou cartão de crédito. O gerador inteligente local estruturará páginas completas para Moçambique (Metical MZN) e internacional instantaneamente sem gastar nada.
                </span>
              </div>
            </div>
          )}

          {/* Seleção do Modelo de IA */}
          {config.providerId !== 'mock' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Modelo de Inteligência Artificial
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              >
                {config.providerId === 'mistral' ? (
                  <>
                    <option value="mistral-large-latest">mistral-large-latest (Mais Avançado, Raciocínio Profundo - Recomendado)</option>
                    <option value="codestral-latest">codestral-latest (Rápido e Altamente Estruturado em JSON)</option>
                    <option value="mistral-small-latest">mistral-small-latest (Econômico e Ágil)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">gpt-4o-mini (Rápido, Econômico e Inteligente - Recomendado)</option>
                    <option value="gpt-4o">gpt-4o (Máxima Persuasão e Criatividade)</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Botão de Testar Conexão */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || (config.providerId !== 'mock' && !config.apiKey.trim())}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Testando conexão com o servidor de IA...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-purple-400" />
                  <span>Testar Conexão com IA Agora</span>
                </>
              )}
            </button>
          </div>

          {/* Resultado do Teste de Conexão */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 leading-relaxed ${
                testResult.ok
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.ok ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Feedback de Salvo */}
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Configurações salvas e ativadas com sucesso!</span>
            </div>
          )}

          {/* Ações Finais do Rodapé */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-purple-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Configuração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
