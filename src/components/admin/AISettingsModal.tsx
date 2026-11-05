import React, { useState, useEffect } from 'react';
import { aiOrchestrator, AIServiceConfig } from '../../services/ai/aiOrchestrator';
import {
  Sparkles,
  Key,
  Cpu,
  Sliders,
  Check,
  X,
  AlertCircle,
  Shield,
  Flame,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIServiceConfig>(aiOrchestrator.getConfig());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(aiOrchestrator.getConfig());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    aiOrchestrator.saveConfig(config);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Configurações do Motor de IA
              </h3>
              <p className="text-xs text-slate-400">
                Configure os provedores de inteligência artificial do DigitalPay AI Builder
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Provedor */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Provedor de IA Ativo
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'mistral', label: 'Mistral AI', desc: 'Magistral / Large' },
                { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / Mini' },
                { id: 'mock', label: 'Local (Offline)', desc: 'Sem Chave / Grátis' },
              ].map((p) => {
                const isSelected = config.providerId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const newModel = p.id === 'mistral' ? 'mistral-large-latest' : p.id === 'openai' ? 'gpt-4o-mini' : 'local-fast';
                      setConfig({ ...config, providerId: p.id as any, model: newModel });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-white mb-0.5">{p.label}</div>
                    <div className="text-[10px] text-slate-400">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chave de API */}
          {config.providerId !== 'mock' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Chave de API ({config.providerId === 'mistral' ? 'Mistral API Key' : 'OpenAI API Key'})
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Cole a chave do provedor aqui..."
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-xs font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                A chave é armazenada de forma segura e utilizada exclusivamente para as gerações.
              </p>
            </div>
          )}

          {/* Modelo */}
          {config.providerId !== 'mock' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Modelo
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              >
                {config.providerId === 'mistral' ? (
                  <>
                    <option value="mistral-large-latest">mistral-large-latest (Mais Avançado & Raciocínio)</option>
                    <option value="codestral-latest">codestral-latest (Rápido e Estruturado)</option>
                    <option value="mistral-small-latest">mistral-small-latest (Econômico)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">gpt-4o-mini (Rápido e Inteligente - Recomendado)</option>
                    <option value="gpt-4o">gpt-4o (Máxima Criatividade e Persuasão)</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Aviso do Modo Local */}
          {config.providerId === 'mock' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Modo Offline Ativo:</strong> Você pode testar e criar páginas completas mesmo sem fornecer chave de API. O gerador inteligente local constrói a estrutura completa em Moçambique e internacional.
              </span>
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Configurações de IA salvas com sucesso!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Configuração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
