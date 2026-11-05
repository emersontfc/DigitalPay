import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { aiOrchestrator } from '../../services/ai/aiOrchestrator';
import { saveAIPage } from '../../services/ai/aiPageStorage';
import { PageSchema, ThemePreset } from '../../types/aiBuilder';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Sliders,
  DollarSign,
  MessageCircle,
  HelpCircle,
  Loader2,
  Eye,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AICreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [prompt, setPrompt] = useState(
    'Cria uma página de vendas para um curso prático de marketing digital. O preço é 2.500 MT. Quero um design premium, com fundo escuro, elementos dourados, secção de benefícios, apresentação do curso, oferta especial, perguntas frequentes e botão de compra pelo WhatsApp.'
  );

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Marketing & Vendas');
  const [currency, setCurrency] = useState('MZN');
  const [promoPrice, setPromoPrice] = useState<number | ''>(2500);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(4500);
  const [whatsappNumber, setWhatsappNumber] = useState('+258 84 123 4567');
  const [tone, setTone] = useState<'profissional' | 'premium' | 'emocional' | 'direto' | 'educativo' | 'persuasivo'>('profissional');
  const [visualStyle, setVisualStyle] = useState<ThemePreset>('luxury-dark');

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Por favor, informe a instrução da página.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedPage = await aiOrchestrator.generatePage({
        prompt,
        productName: productName.trim() || undefined,
        category,
        currency,
        promoPrice: promoPrice !== '' ? Number(promoPrice) : undefined,
        originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
        whatsappNumber: whatsappNumber.trim() || undefined,
        tone,
        visualStyle,
      });

      // Salva rascunho inicial
      await saveAIPage(generatedPage, 'Criação inicial com IA');

      // Redireciona diretamente para o Visual Editor
      navigate(`/admin/ai-builder/edit/${generatedPage.id}`);
    } catch (err: any) {
      console.error('Erro ao gerar com IA:', err);
      setError(err?.message || 'Falha ao gerar página com IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/ai-builder"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" variant="neon" showText={false} />
            <div>
              <h1 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>Assistente de Criação com IA</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                  AI Builder
                </span>
              </h1>
            </div>
          </div>
        </div>

        <Link
          to="/admin"
          className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          Voltar ao Painel
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Glow decorativo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Geração Inteligente de Páginas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Descreva o seu produto ou objetivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Nossa inteligência artificial cria a estrutura visual, copywriting de alta conversão, módulos, tabela de preços e botões de compra prontos para publicar.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            {/* Prompt Principal */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instrução para a IA *
              </label>
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Cria uma página de vendas para um curso de marketing digital com preço 2.500 MT, fundo escuro, módulos detalhados e WhatsApp..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm leading-relaxed"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] text-slate-500 font-semibold">Exemplos rápidos:</span>
                {[
                  'Curso de Marketing 2.500 MT',
                  'Mentoria Black Gold 15.000 MT',
                  'E-book Prático de Vendas 500 MT',
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(`Cria uma página profissional para um ${sug} com garantia e WhatsApp.`)}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 text-purple-300 hover:bg-slate-700 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Alternador Campos Avançados */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Ocultar Detalhes Específicos' : 'Personalizar Moeda, Preço e Estilo (Opcional)'}</span>
              </button>
            </div>

            {/* Campos Detalhados */}
            {showAdvanced && (
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Nome do Produto (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Método Marketing 10X"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Moeda
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="MZN">Metical (MZN - Moçambique)</option>
                      <option value="BRL">Real (BRL - Brasil)</option>
                      <option value="USD">Dólar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="AOA">Kwanza (AOA - Angola)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Preço Promocional ({currency})
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 2500"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      WhatsApp para Atendimento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +258 84 123 4567"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Estilo Visual
                    </label>
                    <select
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="luxury-dark">Luxury Dark (Preto Obsidiana & Dourado)</option>
                      <option value="digital-neon">Digital Neon (Dark & Verde Elétrico)</option>
                      <option value="modern-minimal">Modern Minimal (Minimalista & Executivo)</option>
                      <option value="corporate-clean">Corporate Clean (Azul & Confiabilidade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Tom da Copywriting
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="profissional">Profissional & Confiável</option>
                      <option value="premium">Premium & Alto Valor</option>
                      <option value="direto">Direto & Focado em Ação</option>
                      <option value="emocional">Emocional & Inspirador</option>
                      <option value="educativo">Educativo & Passo a Passo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link
                to="/admin/ai-builder"
                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 hover:opacity-95 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Construindo Página com IA...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Gerar Página Completa com IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
