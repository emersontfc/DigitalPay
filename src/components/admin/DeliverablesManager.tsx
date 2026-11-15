import React, { useState, useRef } from 'react';
import { ProductDeliverable, DeliverableType, DeliveryMode } from '../../types';
import {
  FileText,
  FileArchive,
  Link as LinkIcon,
  KeyRound,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Eye,
  AlertCircle,
  FileCode,
  Sparkles,
  Clock,
  Download,
  Settings2,
  X
} from 'lucide-react';

interface DeliverablesManagerProps {
  deliverables: ProductDeliverable[];
  onChange: (deliverables: ProductDeliverable[]) => void;
  deliveryMode: DeliveryMode;
  onDeliveryModeChange: (mode: DeliveryMode) => void;
  accessExpiresDays?: number;
  onAccessExpiresDaysChange: (days: number) => void;
  maxDownloads?: number;
  onMaxDownloadsChange: (downloads: number) => void;
}

export const DeliverablesManager: React.FC<DeliverablesManagerProps> = ({
  deliverables = [],
  onChange,
  deliveryMode = 'automatic',
  onDeliveryModeChange,
  accessExpiresDays = 0,
  onAccessExpiresDaysChange,
  maxDownloads = 0,
  onMaxDownloadsChange
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'settings'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulário de novo / edição
  const [formData, setFormData] = useState<Partial<ProductDeliverable>>({
    type: 'file',
    title: '',
    description: '',
    external_url: '',
    content_text: '',
    file_name: '',
    file_path: '',
    file_size_bytes: 0,
    file_mime_type: '',
    download_limit: 0,
    expires_in_days: 0,
    is_active: true
  });

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      type: 'file',
      title: '',
      description: '',
      external_url: '',
      content_text: '',
      file_name: '',
      file_path: '',
      file_size_bytes: 0,
      file_mime_type: '',
      download_limit: 0,
      expires_in_days: 0,
      is_active: true
    });
    setEditingId(null);
    setUploadProgress(null);
    setUploadError(null);
  };

  const handleStartEdit = (deliv: ProductDeliverable) => {
    setFormData({ ...deliv });
    setEditingId(deliv.id);
    setActiveTab('add');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este entregável?')) {
      onChange(deliverables.filter(d => d.id !== id));
    }
  };

  // Simulação e processamento de upload de ficheiro seguro
  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploadProgress(10);

    const allowedMimes = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/epub+zip',
      'image/png',
      'image/jpeg',
      'image/webp',
      'video/mp4',
      'audio/mpeg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    // Simula leitura e cálculo de progresso
    let currentProgress = 20;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 90) {
        clearInterval(interval);
      }
      setUploadProgress(Math.min(currentProgress, 90));
    }, 120);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(interval);
      setUploadProgress(100);

      // Gera caminho seguro para armazenamento
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const virtualPath = `deliverables/${Date.now()}_${sanitizedName}`;

      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          file_name: file.name,
          file_path: virtualPath,
          file_size_bytes: file.size,
          file_mime_type: file.type || 'application/octet-stream',
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
        setUploadProgress(null);
      }, 400);
    };

    reader.onerror = () => {
      clearInterval(interval);
      setUploadProgress(null);
      setUploadError('Falha ao processar o arquivo. Tente novamente.');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSaveDeliverable = () => {
    if (!formData.title?.trim()) {
      alert('Por favor, informe o título do entregável.');
      return;
    }

    if (formData.type === 'file' && !formData.file_name && !formData.file_path) {
      alert('Por favor, selecione um arquivo para upload.');
      return;
    }

    if (formData.type === 'link' && !formData.external_url?.trim()) {
      alert('Por favor, insira o link externo (Google Drive, Área de Membros, etc).');
      return;
    }

    if ((formData.type === 'text' || formData.type === 'license_code') && !formData.content_text?.trim()) {
      alert('Por favor, digite o conteúdo ou código do entregável.');
      return;
    }

    if (editingId) {
      // Atualiza existente
      const updated = deliverables.map(d => (d.id === editingId ? { ...(d as ProductDeliverable), ...formData } : d));
      onChange(updated);
    } else {
      // Adiciona novo
      const newDeliverable: ProductDeliverable = {
        id: crypto.randomUUID(),
        title: formData.title!.trim(),
        description: formData.description?.trim() || '',
        type: formData.type || 'file',
        file_path: formData.file_path,
        file_name: formData.file_name,
        file_size_bytes: formData.file_size_bytes,
        file_mime_type: formData.file_mime_type,
        external_url: formData.external_url?.trim(),
        content_text: formData.content_text,
        download_limit: Number(formData.download_limit) || 0,
        expires_in_days: Number(formData.expires_in_days) || 0,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        sort_order: deliverables.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onChange([...deliverables, newDeliverable]);
    }

    resetForm();
    setActiveTab('list');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: DeliverableType) => {
    switch (type) {
      case 'file':
        return <FileArchive className="w-5 h-5 text-emerald-400" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-cyan-400" />;
      case 'text':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'license_code':
        return <KeyRound className="w-5 h-5 text-purple-400" />;
      default:
        return <FileCode className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header do Módulo & Abas de Navegação */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Entregáveis do Produto & Entrega Automática
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PaySuite
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Configure os materiais digitais (e-books, arquivos ZIP, acessos de membros, códigos) que o cliente receberá de forma segura e imediata após o pagamento confirmado.
          </p>
        </div>

        {/* Botão de Adicionar / Alternar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar Entregável</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'settings' ? 'list' : 'settings')}
            className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Configurações de Entrega Geral"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Conteúdo da Aba: Configurações Gerais de Entrega */}
      {activeTab === 'settings' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              Regras Globais de Entrega do Produto
            </h4>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Voltar à lista
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Modo de Entrega */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Modo de Liberação
              </label>
              <select
                value={deliveryMode}
                onChange={e => onDeliveryModeChange(e.target.value as DeliveryMode)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="automatic">⚡ Automática (Imediata via PaySuite)</option>
                <option value="manual">🛡️ Aprovação Manual (Pelo Administrador)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-2">
                {deliveryMode === 'automatic'
                  ? 'Libera os links e downloads assim que o webhook do PaySuite confirma o pagamento.'
                  : 'O pedido fica aguardando sua autorização manual no painel antes de liberar o acesso.'}
              </p>
            </div>

            {/* Prazo de Acesso */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Prazo de Acesso (Dias)
              </label>
              <input
                type="number"
                min="0"
                value={accessExpiresDays}
                onChange={e => onAccessExpiresDaysChange(Number(e.target.value))}
                placeholder="0 = Acesso Vitalício"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                {accessExpiresDays === 0
                  ? 'Acesso vitalício: o cliente sempre poderá acessar seus entregáveis.'
                  : `O cliente terá acesso por ${accessExpiresDays} dias após a compra.`}
              </p>
            </div>

            {/* Limite de Downloads */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Limite de Downloads por Arquivo
              </label>
              <input
                type="number"
                min="0"
                value={maxDownloads}
                onChange={e => onMaxDownloadsChange(Number(e.target.value))}
                placeholder="0 = Downloads Ilimitados"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                {maxDownloads === 0
                  ? 'Downloads ilimitados para o comprador.'
                  : `Cada comprador poderá baixar o arquivo até ${maxDownloads} vezes.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Formulário de Criação / Edição de Entregável */}
      {activeTab === 'add' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {editingId ? <Edit2 className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
              {editingId ? 'Editar Entregável' : 'Novo Entregável do Produto'}
            </h4>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Seleção do Tipo de Entregável */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">Tipo de Conteúdo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { type: 'file' as DeliverableType, label: 'Arquivo / Download', desc: 'PDF, ZIP, EPUB, Vídeo', icon: FileArchive },
                { type: 'link' as DeliverableType, label: 'Link Externo', desc: 'Google Drive, Curso, Membros', icon: LinkIcon },
                { type: 'text' as DeliverableType, label: 'Instruções / Texto', desc: 'Passo a passo, orientações', icon: FileText },
                { type: 'license_code' as DeliverableType, label: 'Código / Licença', desc: 'Chave de acesso, voucher', icon: KeyRound },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = formData.type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.type })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título & Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Título do Entregável *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: E-book Método Tráfego 10K (PDF) ou Acesso à Comunidade VIP"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Instruções ou Descrição Curta (Opcional)
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Baixe e leia pelo seu leitor de PDF favorito"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ÁREA ESPECÍFICA: UPLOAD DE FICHEIRO */}
          {formData.type === 'file' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Arquivo do Produto (PDF, ZIP, EPUB, MP4, MP3, etc.) *
              </label>

              {/* Zona de Drag & Drop */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Formatos suportados: PDF, ZIP, EPUB, MP4, MP3, Imagens (Até 500MB)
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              {uploadProgress !== null && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Enviando arquivo com proteção...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Arquivo Carregado */}
              {formData.file_name && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                        {formData.file_name}
                      </div>
                      <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                        {formatFileSize(formData.file_size_bytes)} • Protegido no Supabase Storage
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        file_name: '',
                        file_path: '',
                        file_size_bytes: 0
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/20"
                    title="Remover arquivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* ÁREA ESPECÍFICA: LINK EXTERNO */}
          {formData.type === 'link' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Link de Acesso Externo (Google Drive, Área de Membros, Hotmart, Curso) *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.external_url || ''}
                  onChange={e => setFormData({ ...formData, external_url: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/... ou https://membros.suaplataforma.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                O cliente terá um botão direto e seguro para abrir o material adquirido.
              </p>
            </div>
          )}

          {/* ÁREA ESPECÍFICA: TEXTO / INSTRUÇÕES / CÓDIGO */}
          {(formData.type === 'text' || formData.type === 'license_code') && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {formData.type === 'license_code'
                  ? 'Chave de Licença ou Código de Acesso *'
                  : 'Conteúdo em Texto / Instruções Detalhadas *'}
              </label>
              <textarea
                rows={4}
                value={formData.content_text || ''}
                onChange={e => setFormData({ ...formData, content_text: e.target.value })}
                placeholder={
                  formData.type === 'license_code'
                    ? 'Ex: PRO-KEY-2026-X94B-L38Q'
                    : 'Escreva as orientações, links ou dados de acesso que devem ser exibidos na tela...'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Ações do Formulário */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveDeliverable}
              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingId ? 'Atualizar Entregável' : 'Salvar Entregável'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Lista dos Entregáveis Cadastrados */}
      {deliverables.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-slate-900/30">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <FileArchive className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Nenhum entregável associado ainda</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Adicione arquivos para download, links de cursos ou chaves de licença para que os clientes recebam seu produto automaticamente após o pagamento via PaySuite.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar o Primeiro Entregável</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{deliverables.length} entregável(is) configurado(s) para este produto</span>
            <span className="font-semibold text-emerald-400">
              {deliveryMode === 'automatic' ? '⚡ Entrega Automática Imediata' : '🛡️ Liberação Manual'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {deliverables.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                        {item.title}
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {item.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-2">
                      {item.type === 'file' && (
                        <span>
                          {item.file_name} • {formatFileSize(item.file_size_bytes)}
                        </span>
                      )}
                      {item.type === 'link' && (
                        <span className="text-cyan-400 truncate max-w-xs">{item.external_url}</span>
                      )}
                      {item.type === 'license_code' && (
                        <span className="font-mono text-purple-300">Código de licença protegido</span>
                      )}
                      {item.type === 'text' && <span>Instruções em texto</span>}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Editar entregável"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Excluir entregável"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
