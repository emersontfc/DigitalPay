import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProducts } from '../../lib/supabase';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  Database,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(data.filter((p) => p.status === 'active'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Header do Portal */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-emerald-400 text-lg">DP</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                Digital<span className="text-emerald-400">Pay</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel do Administrador</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero DigitalPay */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden text-center">
        {/* Glow ambient */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Plataforma de Páginas de Vendas Estilo Kiwify</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Crie Páginas de Alta Conversão Para Seus Produtos no{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              DigitalPay
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Painel administrativo completo: escolha templates prontos para cada produto, personalize preços, textos, vídeos e adicione seus links de pagamento com facilidade.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/admin"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
            >
              <span>Acessar Painel Administrativo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Destaques rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <Layers className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Templates Prontos</div>
              <div className="text-xs text-slate-400 mt-0.5">3 Estilos de alta conversão</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <Zap className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Botões de Pagamento</div>
              <div className="text-xs text-slate-400 mt-0.5">Kiwify, Stripe, etc.</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <Database className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Banco Supabase</div>
              <div className="text-xs text-slate-400 mt-0.5">PostgreSQL em nuvem</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Responsivo</div>
              <div className="text-xs text-slate-400 mt-0.5">Mobile & Desktop</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vitrine de Páginas de Produtos Ativos */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
              Exemplos Ativos
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Páginas de Vendas Criadas no DigitalPay
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Clique em qualquer uma das páginas abaixo para testar a experiência do comprador:
            </p>
          </div>

          <Link
            to="/admin"
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Gerenciar Páginas no Admin</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Carregando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <p className="text-slate-400 text-sm">Nenhuma página ativa no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={
                      p.hero_type === 'image' && p.hero_media_url
                        ? p.hero_media_url
                        : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-between">
                    <span className="self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
                      Template: {p.template}
                    </span>
                    <span className="text-lg font-black text-white drop-shadow">
                      R$ {p.promo_price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.headline}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {p.installments_text}
                    </span>
                    <Link
                      to={`/p/${p.slug}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                    >
                      <span>Acessar Página</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Rodapé */}
      <footer className="py-12 px-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
        <p className="font-black text-slate-300 text-sm tracking-wider">
          DIGITAL<span className="text-emerald-400">PAY</span>
        </p>
        <p className="mt-1">
          Plataforma de Páginas de Vendas e Checkout de Alta Conversão.
        </p>
      </footer>
    </div>
  );
};

