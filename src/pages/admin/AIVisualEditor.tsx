import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchAIPageById, saveAIPage, fetchPageVersions } from '../../services/ai/aiPageStorage';
import { aiOrchestrator } from '../../services/ai/aiOrchestrator';
import { PageSchema, SectionData, PageVersion } from '../../types/aiBuilder';
import { DynamicPageRenderer } from '../../components/ai-builder/renderer/DynamicPageRenderer';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Undo2,
  Redo2,
  Send,
  Sparkles,
  Layers,
  Settings,
  Palette,
  History,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Wand2,
  Loader2,
  Check,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const AIVisualEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<PageSchema | null>(null);
  const [history, setHistory] = useState<PageSchema[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<'sections' | 'add' | 'theme' | 'versions'>('sections');
  const [rightTab, setRightTab] = useState<'inspector' | 'chat'>('chat');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // AI Chat states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou o seu Copilot de IA do DigitalPay. Peça qualquer alteração como: "Muda o fundo para dourado", "Coloca o botão do WhatsApp", "Adiciona garantia de 30 dias" ou "Melhora a copy do título".',
      time: 'Agora',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);

  // Save / Publish feedback
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [publishedFeedback, setPublishedFeedback] = useState(false);
  const [versions, setVersions] = useState<PageVersion[]>([]);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const loaded = await fetchAIPageById(id);
      if (loaded) {
        setPage(loaded);
        setHistory([loaded]);
        setHistoryIdx(0);
        setSelectedSectionId(loaded.sections[0]?.id || null);
        const v = await fetchPageVersions(loaded.id);
        setVersions(v);
      }
    }
    load();
  }, [id]);

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
        <p className="text-sm font-bold">Carregando editor visual...</p>
      </div>
    );
  }

  // Histórico Undo / Redo
  const updatePage = (newPage: PageSchema, recordHistory = true) => {
    setPage(newPage);
    if (recordHistory) {
      const nextHistory = history.slice(0, historyIdx + 1);
      nextHistory.push(newPage);
      setHistory(nextHistory);
      setHistoryIdx(nextHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setPage(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setPage(next);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveAIPage(page, 'Rascunho salvo no editor');
      setPage(saved);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1500);
      const v = await fetchPageVersions(saved.id);
      setVersions(v);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const published = await saveAIPage({ ...page, status: 'published', publishedAt: new Date().toISOString() }, 'Publicação da página');
      setPage(published);
      setPublishedFeedback(true);
      setTimeout(() => setPublishedFeedback(false), 2000);
      const v = await fetchPageVersions(published.id);
      setVersions(v);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Reordenar Seções
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= page.sections.length) return;
    const updatedSections = [...page.sections];
    const [moved] = updatedSections.splice(index, 1);
    updatedSections.splice(newIdx, 0, moved);
    updatePage({ ...page, sections: updatedSections });
  };

  const toggleVisibility = (sectionId: string) => {
    const updatedSections = page.sections.map((s) => (s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s));
    updatePage({ ...page, sections: updatedSections });
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = page.sections.filter((s) => s.id !== sectionId);
    updatePage({ ...page, sections: updatedSections });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(updatedSections[0]?.id || null);
    }
  };

  const addSection = (type: any) => {
    const newSec: SectionData = {
      id: `${type}-${Date.now()}`,
      type,
      title: `Nova Seção (${type})`,
      isVisible: true,
      styles: { paddingY: 'md', fullWidth: false },
      props: {},
    };
    updatePage({ ...page, sections: [...page.sections, newSec] });
    setSelectedSectionId(newSec.id);
    setLeftTab('sections');
    setRightTab('inspector');
  };

  // AI Chat Submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || aiProcessing) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg, time: 'Agora' }]);
    setAiProcessing(true);

    try {
      const result = await aiOrchestrator.editPage({
        instruction: userMsg,
        currentPage: page,
        targetSectionId: selectedSectionId || undefined,
      });

      updatePage(result.updatedPage);

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `✨ ${result.summaryOfChanges || 'Alterações aplicadas com sucesso à página!'}`,
          time: 'Agora',
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Desculpe, tive um problema ao aplicar essa instrução: ${err?.message || 'Falha na IA'}.`,
          time: 'Agora',
        },
      ]);
    } finally {
      setAiProcessing(false);
    }
  };

  const selectedSection = page.sections.find((s) => s.id === selectedSectionId) || page.sections[0];

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/ai-builder"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Voltar ao AI Builder"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <BrandLogo size="sm" variant="neon" showText={false} />

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={page.title}
              onChange={(e) => updatePage({ ...page, title: e.target.value }, false)}
              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 font-bold text-white text-sm px-1 py-0.5 outline-none max-w-[200px] sm:max-w-[320px] truncate"
            />
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                page.status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {page.status === 'published' ? 'Publicada' : 'Rascunho'}
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Undo/Redo, Save & Publish */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 pr-2">
            <button
              onClick={handleUndo}
              disabled={historyIdx <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIdx >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Refazer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            to={`/p/${page.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Prévia</span>
          </Link>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedFeedback ? 'Salvo!' : 'Salvar'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
          >
            {publishedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>No Ar!</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Publicar Página</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. THREE-PANE MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: Estrutura, Biblioteca de Seções e Tema */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
          <div className="flex border-b border-slate-800 text-xs font-bold bg-slate-950/60">
            <button
              onClick={() => setLeftTab('sections')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                leftTab === 'sections' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Seções ({page.sections.length})
            </button>
            <button
              onClick={() => setLeftTab('add')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                leftTab === 'add' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              + Adicionar
            </button>
            <button
              onClick={() => setLeftTab('theme')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                leftTab === 'theme' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tema
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* TAB SEÇÕES */}
            {leftTab === 'sections' && (
              <div className="space-y-1.5">
                {page.sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        setRightTab('inspector');
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-500/80 text-white shadow'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-purple-400 uppercase bg-purple-500/10 px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </span>
                        <span className="font-semibold truncate">{sec.title || sec.type}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === page.sections.length - 1}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(sec.id)}
                          className="p-1 text-slate-500 hover:text-white cursor-pointer"
                        >
                          {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(sec.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB ADICIONAR SEÇÃO */}
            {leftTab === 'add' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 mb-2">Clique em um componente para adicionar à página:</p>
                {[
                  { type: 'hero', label: 'Hero com Vídeo/Imagem', desc: 'Apresentação principal e CTA' },
                  { type: 'benefits', label: 'Benefícios', desc: 'Vantagens em cards visuais' },
                  { type: 'curriculum-modules', label: 'Módulos de Aulas', desc: 'Estrutura curricular' },
                  { type: 'pricing-plans', label: 'Tabela de Preço & Oferta', desc: 'Preço promocional e garantia' },
                  { type: 'bonuses', label: 'Bónus Exclusivos', desc: 'Caixas de bónus grátis' },
                  { type: 'authority-creator', label: 'Biografia do Mentor', desc: 'Autoridade e conquistas' },
                  { type: 'testimonials', label: 'Depoimentos / Prova Social', desc: 'Avaliações com estrelas' },
                  { type: 'guarantee', label: 'Garantia Incondicional', desc: 'Selo de 7/15/30 dias' },
                  { type: 'faq-accordion', label: 'Perguntas Frequentes (FAQ)', desc: 'Acordeão de dúvidas' },
                  { type: 'whatsapp-cta', label: 'Chamada WhatsApp', desc: 'Atendimento e fechamento' },
                  { type: 'before-after', label: 'Antes vs Depois', desc: 'Comparativo de transformação' },
                  { type: 'countdown', label: 'Contador de Urgência', desc: 'Barra regressiva de escassez' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addSection(item.type)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500 hover:bg-slate-900 text-left transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-xs text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                      <span>{item.label}</span>
                      <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB TEMA & CORES */}
            {leftTab === 'theme' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Estilo Predefinido</label>
                  <select
                    value={page.theme.preset}
                    onChange={(e) => {
                      const preset = e.target.value as any;
                      const primary = preset === 'luxury-dark' ? '#f59e0b' : preset === 'modern-minimal' ? '#6366f1' : '#10b981';
                      updatePage({
                        ...page,
                        theme: {
                          ...page.theme,
                          preset,
                          primaryColor: primary,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="luxury-dark">Luxury Dark (Dourado & Preto)</option>
                    <option value="digital-neon">Digital Neon (Verde & Glow)</option>
                    <option value="modern-minimal">Modern Minimal (Índigo & Cinza)</option>
                    <option value="corporate-clean">Corporate Clean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Cor Principal (Accent)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={page.theme.primaryColor}
                      onChange={(e) => updatePage({ ...page, theme: { ...page.theme, primaryColor: e.target.value } })}
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={page.theme.primaryColor}
                      onChange={(e) => updatePage({ ...page, theme: { ...page.theme, primaryColor: e.target.value } })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Slug da URL</label>
                  <div className="flex items-center rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-400">
                    <span>/p/</span>
                    <input
                      type="text"
                      value={page.slug}
                      onChange={(e) => updatePage({ ...page, slug: e.target.value }, false)}
                      className="bg-transparent text-white font-semibold outline-none flex-1 ml-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANE: PRÉ-VISUALIZAÇÃO INTERATIVA AO VIVO */}
        <main className="flex-1 bg-black flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 relative">
          <div
            className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 ${
              viewport === 'mobile'
                ? 'w-[375px] min-h-[700px]'
                : viewport === 'tablet'
                ? 'w-[768px] min-h-[850px]'
                : 'w-full max-w-5xl min-h-[900px]'
            }`}
          >
            <DynamicPageRenderer
              page={page}
              isEditor={true}
              selectedSectionId={selectedSectionId}
              onSelectSection={(secId) => {
                setSelectedSectionId(secId);
                setRightTab('inspector');
              }}
            />
          </div>
        </main>

        {/* RIGHT PANE: INSPETOR DE PROPRIEDADES + CHAT COPILOT IA */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="flex border-b border-slate-800 text-xs font-bold bg-slate-950/60">
            <button
              onClick={() => setRightTab('chat')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Copilot IA</span>
            </button>
            <button
              onClick={() => setRightTab('inspector')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'inspector' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Propriedades</span>
            </button>
          </div>

          {/* TAB 1: COPILOT IA CONVERSACIONAL */}
          {rightTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white ml-6 rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 mr-4 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-60 block mt-1 text-right">{msg.time}</span>
                  </div>
                ))}
                {aiProcessing && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-purple-300 flex items-center gap-2 mr-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A IA está aplicando as alterações na página...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950/80">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Peça à IA: 'Muda para dourado', 'Adiciona WhatsApp'..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || aiProcessing}
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: INSPETOR DE PROPRIEDADES DA SEÇÃO */}
          {rightTab === 'inspector' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedSection ? (
                <>
                  <div className="pb-3 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      Editando: {selectedSection.type}
                    </span>
                    <input
                      type="text"
                      value={selectedSection.title || ''}
                      onChange={(e) => {
                        const updatedSections = page.sections.map((s) => (s.id === selectedSection.id ? { ...s, title: e.target.value } : s));
                        updatePage({ ...page, sections: updatedSections }, false);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white mt-1"
                    />
                  </div>

                  {/* Campos do Hero */}
                  {selectedSection.type === 'hero' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título Principal (Headline)</label>
                        <textarea
                          rows={2}
                          value={selectedSection.props.headline || ''}
                          onChange={(e) => {
                            const updated = page.sections.map((s) => s.id === selectedSection.id ? { ...s, props: { ...s.props, headline: e.target.value } } : s);
                            updatePage({ ...page, sections: updated }, false);
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtítulo</label>
                        <textarea
                          rows={3}
                          value={selectedSection.props.subtitle || ''}
                          onChange={(e) => {
                            const updated = page.sections.map((s) => s.id === selectedSection.id ? { ...s, props: { ...s.props, subtitle: e.target.value } } : s);
                            updatePage({ ...page, sections: updated }, false);
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">URL do Vídeo (YouTube embed)</label>
                        <input
                          type="text"
                          value={selectedSection.props.mediaUrl || ''}
                          onChange={(e) => {
                            const updated = page.sections.map((s) => s.id === selectedSection.id ? { ...s, props: { ...s.props, mediaUrl: e.target.value } } : s);
                            updatePage({ ...page, sections: updated }, false);
                          }}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Campos de Preço */}
                  {(selectedSection.type === 'pricing-plans' || selectedSection.type === 'special-offer') && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preço Promocional ({page.currency})</label>
                        <input
                          type="number"
                          value={page.promoPrice}
                          onChange={(e) => updatePage({ ...page, promoPrice: Number(e.target.value) }, false)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link do Checkout</label>
                        <input
                          type="text"
                          value={page.checkoutUrl}
                          onChange={(e) => updatePage({ ...page, checkoutUrl: e.target.value }, false)}
                          placeholder="https://pay.kiwify.com.br..."
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp de Contato</label>
                    <input
                      type="text"
                      value={page.whatsappNumber}
                      onChange={(e) => updatePage({ ...page, whatsappNumber: e.target.value }, false)}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Selecione uma seção para editar propriedades.
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
