import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProductBySlug } from '../../lib/supabase';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';
import { FloatingWhatsAppButton } from '../../components/common/FloatingWhatsAppButton';
import { initFacebookPixel } from '../../utils/pixel';
import { useSalesPageLanguage, translateProductSync, translateProductFull } from '../../utils/i18n';
import { RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export const SalesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLang] = useSalesPageLanguage();
  const [translatedProduct, setTranslatedProduct] = useState<Product | null>(null);

  // Helper para atualizar ou criar meta tag
  const setMetaTag = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await fetchProductBySlug(slug);
        setProduct(data);
        if (data) {
          // 1. Atualizar Título da Página
          document.title = `${data.name} | Digitall Pay`;

          // 2. Atualizar Open Graph (WhatsApp, Facebook, Telegram)
          setMetaTag('og:title', data.headline || data.name);
          setMetaTag('og:description', data.subheadline || 'Acesse a oferta exclusiva agora.');
          if (data.hero_media_url && !data.hero_media_url.includes('youtube') && !data.hero_media_url.includes('vimeo')) {
            setMetaTag('og:image', data.hero_media_url);
          }
          setMetaTag('og:url', window.location.href);

          // 3. Inicializar Meta Pixel se configurado
          if (data.facebook_pixel_id) {
            initFacebookPixel(data.facebook_pixel_id);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar página:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  // Efeito reativo para tradução completa do produto
  useEffect(() => {
    if (!product) {
      setTranslatedProduct(null);
      return;
    }

    // 1. Aplica imediatamente a versão síncrona com moedas e preços convertidos
    const instantVersion = translateProductSync(product, currentLang);
    setTranslatedProduct(instantVersion);

    // Se for variante do Português (Brasil, Moçambique ou Angola), a moeda já está 100% pronta
    if (currentLang === 'pt' || currentLang === 'pt-mz' || currentLang === 'pt-ao') {
      return;
    }

    // 2. Dispara tradução assíncrona profunda de 100% dos textos para EN e ES
    let isCancelled = false;

    translateProductFull(product, currentLang)
      .then((full) => {
        if (!isCancelled && full) {
          setTranslatedProduct(full);
        }
      })
      .catch((err) => {
        console.warn('Erro ao completar tradução dinâmica:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [product, currentLang]);

  const activeProduct = translatedProduct || (product ? translateProductSync(product, currentLang) : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <RefreshCw className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <p className="text-lg font-bold">Carregando oferta exclusiva...</p>
      </div>
    );
  }

  // Renderizar página clássica
  if (activeProduct) {
    return (
      <>
        <TemplateRenderer product={activeProduct} />
        {/* Botão de Suporte WhatsApp Flutuante */}
        {activeProduct.whatsapp_number && (
          <FloatingWhatsAppButton
            whatsappNumber={activeProduct.whatsapp_number}
            whatsappMessage={activeProduct.whatsapp_message}
            productName={activeProduct.name}
          />
        )}
      </>
    );
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
