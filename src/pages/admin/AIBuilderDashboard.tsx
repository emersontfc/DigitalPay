import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAIPages, deleteAIPage, saveAIPage } from '../../services/ai/aiPageStorage';
import { PageSchema } from '../../types/aiBuilder';
import { formatPrice } from '../../utils/currency';
import { BrandLogo } from '../../components/common/BrandLogo';
import { AISettingsModal } from '../../components/admin/AISettingsModal';
import {
  Sparkles,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Sliders,
  Search,
  Globe,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Wand2,
  Check,
  CheckCircle2,
  Key
} from 'lucide-react';

export const AIBuilderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAIPages();
      setPages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Deseja realmente excluir a página "${title}" criada por IA?`)) {
      await deleteAIPage(id);
      await loadData();
    }
  };

  const handleDuplicate = async (original: PageSchema) => {
    const copy: PageSchema = {
      ...original,
      id: `ai-page-${Date.now()}`,
      slug: `${original.slug}-copia-${Date.now().toString().slice(-4)}`,
      title: `${original.title} (Cópia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveAIPage(copy, 'Cópia duplicada');
    await loadData();
  };

  const handleTogglePublish = async (page: PageSchema) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    await saveAIPage({ ...page, status: newStatus }, `Status alterado para ${newStatus}`);
    await loadData();
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = pages.filter((p) => p.status === 'published').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* 1. Header do AI Builder */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" variant="neon" linkTo="/admin" />
          <div className="hidden sm:block border-l border-slate-800 pl-3">
            <span className="text-sm font-black text-white flex items-center gap-1.5">
              <span>AI Page Builder</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                2.0
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              Geração de Páginas de Alta Conversão com IA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Painel Clássico
          </Link>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Configurações de Provedores de IA (Mistral, OpenAI)"
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Chave de IA</span>
          </button>

          <Link
            to="/admin/ai-builder/new"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 hover:opacity-95 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
          >
            <Wand2 className="w-4 h-4 stroke-[3]" />
            <span>Criar Página com IA</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner Hero do Módulo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligência Artificial Generativa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Construa Páginas de Vendas em Segundos
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Diga o nome do seu produto, o preço e a IA escreve a copy persuasiva, monta o design com componentes seguros e publica no ar no Digitall Pay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Key className="w-4 h-4 text-purple-400" />
              <span>Configurar Chave de IA</span>
            </button>

            <Link
              to="/admin/ai-builder/new"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-black bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Wand2 className="w-4 h-4" />
              <span>Criar Nova Página com IA</span>
            </Link>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{pages.length}</div>
              <div className="text-xs text-slate-400 font-medium">Total de Páginas Geradas</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{publishedCount}</div>
              <div className="text-xs text-slate-400 font-medium">Páginas Publicadas no Ar</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 col-span-2 sm:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium">Taxa de Otimização IA</div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por título ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['all', 'published', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  filterStatus === status
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status === 'all' ? 'Todas as Páginas' : status === 'published' ? 'Publicadas' : 'Rascunhos'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Páginas do AI Builder */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 animate-spin text-purple-400 mb-2" />
            <span>Carregando páginas de vendas...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
            <Wand2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhuma página de IA encontrada</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Comece agora criando sua primeira página de vendas com inteligência artificial em segundos!
            </p>
            <Link
              to="/admin/ai-builder/new"
              className="px-6 py-3 rounded-xl text-xs font-black bg-purple-500 hover:bg-purple-400 text-slate-950 inline-flex items-center gap-2 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Criar Primeira Página com IA</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((pg) => {
              const isPublished = pg.status === 'published';
              return (
                <div
                  key={pg.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isPublished ? 'Publicada no Ar' : 'Rascunho'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {pg.sections.length} seções
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 mb-1">
                      {pg.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {pg.description || 'Página de vendas otimizada com inteligência artificial.'}
                    </p>

                    {/* Preço e URL */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="text-slate-400">Preço da Oferta:</span>
                        <span className="font-bold text-white text-sm">
                          {formatPrice(pg.promoPrice, pg.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-purple-400">
                        <span>/p/{pg.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card Actions */}
                  <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                    <Link
                      to={`/admin/ai-builder/edit/${pg.id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-slate-950 transition-all flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(pg.slug)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copiar Link da Página"
                      >
                        {copiedSlug === pg.slug ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <Link
                        to={`/p/${pg.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                        title="Visualizar Página Pública"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleTogglePublish(pg)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isPublished ? 'text-emerald-400 hover:text-amber-400' : 'text-slate-400 hover:text-emerald-400'
                        }`}
                        title={isPublished ? 'Despublicar Página' : 'Publicar Página'}
                      >
                        <Globe className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(pg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Duplicar Página"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(pg.id, pg.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Excluir Página"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Configurações de IA */}
      <AISettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

