import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../../types';
import { PageSchema } from '../../types/aiBuilder';
import { fetchProductBySlug } from '../../lib/supabase';
import { fetchAIPageBySlug } from '../../services/ai/aiPageStorage';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';
import { DynamicPageRenderer } from '../../components/ai-builder/renderer/DynamicPageRenderer';
import { RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export const SalesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [aiPage, setAiPage] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        // 1. Tentar buscar página gerada por IA
        const aiData = await fetchAIPageBySlug(slug);
        if (aiData) {
          setAiPage(aiData);
          document.title = `${aiData.title} | Digitall Pay`;
          return;
        }

        // 2. Fallback para produto clássico
        const data = await fetchProductBySlug(slug);
        setProduct(data);
        if (data) {
          document.title = `${data.name} | Digitall Pay`;
        }
      } catch (err) {
        console.error('Erro ao buscar página:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <RefreshCw className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <p className="text-lg font-bold">Carregando oferta exclusiva...</p>
      </div>
    );
  }

  // Renderizar página dinâmica do AI Builder
  if (aiPage) {
    return <DynamicPageRenderer page={aiPage} />;
  }

  // Renderizar página clássica
  if (product) {
    return <TemplateRenderer product={product} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Página de Vendas Não Encontrada</h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        A página com o endereço <span className="text-emerald-400 font-mono">/p/{slug}</span> não está ativa ou foi modificada pelo administrador.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Início do Digitall Pay</span>
      </Link>
    </div>
  );
};

