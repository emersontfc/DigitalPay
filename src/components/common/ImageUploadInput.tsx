import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Imagem',
  placeholder = 'https://...',
  compact = false,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(
    value && !value.startsWith('data:') && !value.startsWith('blob:') ? 'url' : 'upload'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redimensiona e otimiza imagens muito pesadas no navegador antes de transformar em DataURL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, WEBP, etc).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        return;
      }

      // Se for SVG ou menor que 300KB, salva direto
      if (file.type === 'image/svg+xml' || file.size < 300 * 1024) {
        onChange(result);
        setIsProcessing(false);
        return;
      }

      // Otimização inteligente via Canvas para imagens maiores
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1440;
        const MAX_HEIGHT = 1440;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange(compressedDataUrl);
        } else {
          onChange(result);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        onChange(result);
        setIsProcessing(false);
      };
      img.src = result;
    };

    reader.onerror = () => {
      alert('Erro ao carregar imagem.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-[11px] font-bold text-slate-300 uppercase">{label}</label>}
        <div className="flex items-center gap-2">
          {value ? (
            <div className="relative group w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg border border-dashed border-slate-700 bg-slate-950/60 flex items-center justify-center text-slate-500 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1 flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
            >
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{value ? 'Trocar Foto' : 'Upload Foto'}</span>
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                title="Remover foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Cabeçalho com Seletor de Modo */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload de Arquivo</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'url'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Link da Web</span>
          </button>
        </div>
      </div>

      {/* Modo Upload */}
      {mode === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            className="hidden"
          />

          {!value ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950'
              }`}
            >
              <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {isProcessing ? 'Processando imagem...' : 'Clique para selecionar imagem'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ou arraste o arquivo do seu computador / celular (PNG, JPG, WEBP)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center gap-4 p-3">
              <div className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black shrink-0">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Imagem Carregada com Sucesso</span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {value.startsWith('data:') ? 'Arquivo local armazenado com sucesso' : value}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                  >
                    <Upload className="w-3 h-3 text-emerald-400" />
                    <span>Substituir</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors border border-rose-500/20"
                  >
                    <X className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modo URL */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder={placeholder}
              value={value.startsWith('data:') ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Limpar URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {value && !value.startsWith('data:') && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-950 border border-slate-800">
              <img
                src={value}
                alt="Preview"
                className="w-16 h-10 object-cover rounded border border-slate-700"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs text-slate-400 truncate">Pré-visualização do link</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

