import React, { useState, useEffect } from 'react';
import { Product, PageModel } from '../../types';
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  isSupabaseConfigured
} from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/currency';
import { ProductEditorModal } from '../../components/admin/ProductEditorModal';
import { SupabaseConfigModal } from '../../components/admin/SupabaseConfigModal';
import { AdminUsersModal } from '../../components/admin/AdminUsersModal';
import { ModelManagerModal } from '../../components/admin/ModelManagerModal';
import { ChangePasswordModal } from '../../components/admin/ChangePasswordModal';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Check,
  Database,
  Layers,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  LogOut,
  Settings,
  UserCheck,
  Users,
  Bookmark,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user, logout, pendingCount } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modais
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Status Supabase
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured());
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleApplyModelFromDashboard = (model: PageModel) => {
    const d = model.productData;
    setEditingProduct({
      id: '',
      name: d.name || model.name,
      slug: (d.name || model.name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      status: 'active',
      template: model.template,
      currency: d.currency || 'BRL',
      headline: d.headline || '',
      subheadline: d.subheadline || '',
      hero_type: d.hero_type || 'video',
      hero_media_url: d.hero_media_url || '',
      badge_text: d.badge_text || 'OFERTA EXCLUSIVA',
      vsl_pitch_delay_seconds: d.vsl_pitch_delay_seconds || 0,
      vsl_autoplay: Boolean(d.vsl_autoplay),
      original_price: d.original_price || 197,
      promo_price: d.promo_price || 97,
      installments_text: d.installments_text || 'ou 12x no cartão',
      cta_text: d.cta_text || 'QUERO GARANTIR MINHA VAGA AGORA',
      cta_url: d.cta_url || 'https://pay.kiwify.com.br',
      cta_subtext: d.cta_subtext || '🔒 Compra 100% Segura • Acesso Imediato',
      facebook_pixel_id: d.facebook_pixel_id,
      whatsapp_number: d.whatsapp_number,
      whatsapp_message: d.whatsapp_message,
      guarantee_days: d.guarantee_days || 7,
      countdown_enabled: d.countdown_enabled !== undefined ? d.countdown_enabled : true,
      countdown_minutes: d.countdown_minutes || 15,
      features: d.features || [],
      modules: d.modules || [],
      testimonials: d.testimonials || [],
      faqs: d.faqs || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsEditorOpen(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setSupabaseConnected(isSupabaseConfigured());
  }, []);

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      await saveProduct(productData);
      await loadData();
      setIsEditorOpen(false);
      setEditingProduct(null);
      setToastMessage(`Página "${productData.name}" gravada com sucesso!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Erro ao gravar produto:', err);
      alert('Erro ao gravar página: ' + (err?.message || 'Falha ao salvar'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a página de vendas "${name}"?`)) {
      await deleteProduct(id);
      await loadData();
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    const copy: Partial<Product> = {
      ...prod,
      id: undefined,
      name: `${prod.name} (Cópia)`,
      slug: `${prod.slug}-copia-${Date.now().toString().slice(-4)}`,
    };
    await saveProduct(copy);
    await loadData();
  };

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.headline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTemplate = filterTemplate === 'all' || p.template === filterTemplate;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesTemplate && matchesStatus;
  });

  const activeCount = products.filter((p) => p.status === 'active').length;
  const avgPrice =
    products.length > 0
      ? products.reduce((acc, p) => acc + p.promo_price, 0) / products.length
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Header do Painel Responsivo */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Linha 1: Marca + Identidade do Usuário + Ações de Sessão */}
          <div className="py-3 flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2.5 group">
                <BrandLogo size="md" variant="neon" showText={false} />
                <div>
                  <span className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1">
                    Digitall<span className="text-emerald-400">Pay</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">
                      Admin
                    </span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                    Painel de Administração
                  </span>
                </div>
              </Link>
            </div>

            {/* Lado Direito da Linha 1: Status DB, Perfil e Sair */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Configuração Discreta do Banco */}
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                title={supabaseConnected ? 'Banco de Dados Conectado' : 'Configurações de Banco de Dados'}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Alterar Senha */}
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                title="Alterar Minha Senha"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              {/* Perfil do Usuário & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-white truncate max-w-[120px]">{user?.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  title="Sair da Conta"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Linha 2: Barra de Ações Responsiva (Scroll horizontal suave no mobile sem quebra feia) */}
          <div className="py-2.5 border-t border-slate-800/70 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {/* Botão Principal: Criar Nova Página */}
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Nova Página</span>
            </button>

            {/* Biblioteca de Modelos */}
            <button
              onClick={() => setIsModelModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700/60 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
              <span>Modelos & Templates</span>
            </button>

            {/* Gestão de Administradores (Exclusivo Emerson) */}
            {(user?.role === 'super_admin' || user?.email === 'emersontorres42@gmail.com') && (
              <button
                onClick={() => setIsUsersModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 border border-slate-700/60 shrink-0 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aprovações</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Ver Vitrine Geral */}
            <Link
              to="/"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 shrink-0 ml-auto"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span>Ver Vitrine</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner de Boas-Vindas & KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total de Produtos</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{products.length}</div>
            <p className="text-xs text-slate-500 mt-1">Páginas cadastradas no sistema</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Páginas Ativas</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{activeCount}</div>
            <p className="text-xs text-slate-500 mt-1">Disponíveis publicamente para venda</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Ticket Médio</span>
              <span className="text-xs font-mono font-bold text-slate-400">R$</span>
            </div>
            <div className="text-3xl font-black text-white">
              R$ {avgPrice.toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Valor médio das ofertas ativas</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Templates Prontos</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-indigo-400">3 Estilos</div>
            <p className="text-xs text-slate-500 mt-1">Neon Kiwify, Minimal & Gold</p>
          </div>
        </div>

        {/* Banner Construtor Manual de Páginas */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Construtor de Páginas Digitall Pay</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pronto para Vender
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monte páginas de vendas profissionais no estilo Kiwify com checkout direto, vídeos, depoimentos reais e suporte via WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsModelModalOpen(true)}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Modelos Prontos</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsEditorOpen(true);
              }}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Nova Página</span>
            </button>
          </div>
        </div>

        {/* 3. Filtros & Busca */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por produto, slug ou headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={filterTemplate}
              onChange={(e) => setFilterTemplate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none"
            >
              <option value="all">Todos os Templates</option>
              <option value="kiwify-neon">Kiwify Neon (Dark Glow)</option>
              <option value="minimal-luxury">Minimal Luxury (High Ticket)</option>
              <option value="vanguard-black-gold">Vanguard Black & Gold</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Apenas Ativos</option>
              <option value="draft">Apenas Rascunhos</option>
            </select>

            <button
              onClick={loadData}
              title="Atualizar lista"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4. Lista de Produtos / Páginas */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
            <p className="font-semibold text-sm">Carregando suas páginas de vendas...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 px-4 rounded-3xl border border-dashed border-slate-800 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nenhuma página de vendas encontrada</h3>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm || filterTemplate !== 'all' || filterStatus !== 'all'
                  ? 'Tente ajustar os filtros ou termo de busca acima.'
                  : 'Comece criando o primeiro produto para gerar a sua página de alta conversão!'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsEditorOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Primeira Página Agora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const templateBadge = {
                'kiwify-neon': { label: 'Kiwify Neon', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                'minimal-luxury': { label: 'Minimal Luxury', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
                'vanguard-black-gold': { label: 'Vanguard Gold', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
              }[prod.template] || { label: prod.template, color: 'bg-slate-800 text-slate-300' };

              return (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl"
                >
                  {/* Visual Top Preview */}
                  <div className="relative h-36 bg-slate-950 overflow-hidden border-b border-slate-800">
                    <img
                      src={
                        prod.hero_type === 'image' && prod.hero_media_url
                          ? prod.hero_media_url
                          : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={prod.name}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60 p-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${templateBadge.color}`}>
                          {templateBadge.label}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prod.status === 'active'
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {prod.status === 'active' ? 'PUBLICADA' : 'RASCUNHO'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                          /p/{prod.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {prod.headline}
                      </p>
                    </div>

                    {/* Preço e link de checkout */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Preço Promocional:</span>
                        <span className="text-base font-black text-white">
                          {formatPrice(prod.promo_price, prod.currency)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Gateway:</span>
                        <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                          {prod.cta_url.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    </div>

                    {/* Copiar Link Rápido */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(prod.slug)}
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                      >
                        {copiedSlug === prod.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Link Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Link da Página</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/p/${prod.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir página pública de vendas"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors border border-slate-700/60 shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsEditorOpen(true);
                      }}
                      className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar Página</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicateProduct(prod)}
                        title="Duplicar Página"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        title="Excluir Página"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modais */}
      {isEditorOpen && (
        <ProductEditorModal
          product={editingProduct}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          onConfigChanged={() => {
            setSupabaseConnected(isSupabaseConfigured());
            loadData();
          }}
        />
      )}

      {isUsersModalOpen && (
        <AdminUsersModal
          isOpen={isUsersModalOpen}
          onClose={() => setIsUsersModalOpen(false)}
        />
      )}

      {isModelModalOpen && (
        <ModelManagerModal
          isOpen={isModelModalOpen}
          onClose={() => setIsModelModalOpen(false)}
          onApplyModel={handleApplyModelFromDashboard}
          currentProductData={{}}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}

      {/* Toast de Notificação de Sucesso */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
