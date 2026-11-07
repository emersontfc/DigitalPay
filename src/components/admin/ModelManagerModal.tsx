import React, { useState, useEffect } from 'react';
import { PageModel, Product } from '../../types';
import { getAllModels, saveCustomModel, deleteCustomModel } from '../../utils/modelStorage';
import {
  Sparkles,
  BookOpen,
  Crown,
  Users,
  Bookmark,
  Trash2,
  Check,
  X,
  Plus,
  ArrowRight,
  Award
} from 'lucide-react';

interface ModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyModel: (model: PageModel) => void;
  currentProductData: Partial<Product>;
}

export const ModelManagerModal: React.FC<ModelManagerModalProps> = ({
  isOpen,
  onClose,
  onApplyModel,
  currentProductData,
}) => {
  const [activeTab, setActiveTab] = useState<'prontos' | 'salvos' | 'criar'>('prontos');
  const [models, setModels] = useState(getAllModels());

  // Form para salvar modelo atual
  const [newModelName, setNewModelName] = useState('');
  const [newModelDesc, setNewModelDesc] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModels(getAllModels());
      setSaveSuccess(false);
      setNewModelName(currentProductData.name ? `Modelo ${currentProductData.name}` : '');
    }
  }, [isOpen, currentProductData]);

  if (!isOpen) return null;

  const handleSaveCurrentAsModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;

    saveCustomModel(newModelName, newModelDesc, currentProductData);
    setModels(getAllModels());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('salvos');
    }, 900);
  };

  const handleDeleteModel = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o modelo "${name}"?`)) {
      deleteCustomModel(id);
      setModels(getAllModels());
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'vsl':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'ebook':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'mentoria':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'marca':
        return <Award className="w-4 h-4 text-rose-400" />;
      case 'comunidade':
        return <Users className="w-4 h-4 text-teal-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border-0 sm:border border-slate-700 w-full max-w-3xl sm:rounded-2xl rounded-none shadow-2xl flex flex-col h-full sm:h-auto max-h-full sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-lg truncate">
                Biblioteca de Modelos & Templates
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                Carregue estruturas prontas de alta conversão ou salve o seu próprio modelo
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

        {/* Abas */}
        <div className="px-3 sm:px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 pt-2.5 pb-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('prontos')}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'prontos'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modelos Prontos ({models.factory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('salvos')}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'salvos'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Meus Modelos ({models.custom.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('criar')}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'criar'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Salvar Atual</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: MODELOS PRONTOS DO SISTEMA */}
          {activeTab === 'prontos' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                💡 Ao selecionar um modelo pronto, toda a estrutura persuasiva (headline, copy, módulos de aulas, perguntas frequentes e garantia) será aplicada à sua página. Você poderá editar cada palavra como desejar!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.factory.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {getCategoryIcon(m.category)}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          Template: {m.template}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {m.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyModel(m);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Aplicar este Modelo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MEUS MODELOS SALVOS */}
          {activeTab === 'salvos' && (
            <div className="space-y-4">
              {models.custom.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/50 border border-slate-800 border-dashed">
                  <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h4 className="font-bold text-white text-sm mb-1">
                    Nenhum modelo personalizado salvo ainda
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Você pode salvar qualquer página que montar com suas copies, módulos e preços para reutilizar sempre que criar um novo produto!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('criar')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Salvar Página Atual como Modelo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.custom.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Bookmark className="w-4 h-4 text-purple-400" />
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteModel(m.id, m.name)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Excluir modelo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="font-bold text-white text-sm mb-1">{m.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {m.description}
                        </p>
                        <span className="text-[10px] text-slate-500 block mb-4">
                          Criado em: {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onApplyModel(m);
                          onClose();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Aplicar Meu Modelo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SALVAR COMO MODELO */}
          {activeTab === 'criar' && (
            <form onSubmit={handleSaveCurrentAsModel} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-400" />
                  Salvar esta Página como um Modelo Reutilizável
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Os textos atuais de headline, subheadline, preços, módulos, depoimentos e perguntas frequentes serão salvos como um novo template na sua biblioteca pessoal.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Nome do Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Meu Modelo VSL de Infoproduto 10K"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Descrição / Observações (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Modelo com foco em vídeo longo e 3 depoimentos em texto."
                      value={newModelDesc}
                      onChange={(e) => setNewModelDesc(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Modelo salvo com sucesso na sua biblioteca!</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('prontos')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newModelName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Salvar Modelo na Biblioteca</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
