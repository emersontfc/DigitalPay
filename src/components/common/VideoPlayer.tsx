import React from 'react';
import { Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  type?: 'video' | 'image' | 'vsl';
  title?: string;
  glowColor?: string;
  autoplay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url = '',
  type = 'video',
  title = 'Apresentação do Produto',
  glowColor = 'emerald',
  autoplay = false,
}) => {
  // 1. Extração segura de URL caso o utilizador tenha colado o código <iframe> inteiro
  const cleanRawInput = (raw: string): string => {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (trimmed.includes('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    return trimmed;
  };

  const processedUrl = cleanRawInput(url);

  // 2. Verifica se é um arquivo direto de vídeo HTML5 (.mp4, .webm, .ogg)
  const isDirectVideo = (u: string): boolean => {
    if (!u) return false;
    const clean = u.split('?')[0].toLowerCase();
    return (
      clean.endsWith('.mp4') ||
      clean.endsWith('.webm') ||
      clean.endsWith('.ogg') ||
      u.startsWith('data:video') ||
      u.startsWith('blob:')
    );
  };

  // 3. Converte links de plataformas conhecidas para URL de incorporação (embed)
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';

    // YouTube Shorts / Watch / Youtu.be
    const ytWatchMatch = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
    if (ytWatchMatch && ytWatchMatch[1]) {
      const videoId = ytWatchMatch[1];
      const autoPlayParams = autoplay ? '&autoplay=1&mute=0' : '&autoplay=0';
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${autoPlayParams}`;
    }

    if (rawUrl.includes('youtube.com/embed/')) {
      if (autoplay && !rawUrl.includes('autoplay=')) {
        return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}autoplay=1&mute=0`;
      }
      return rawUrl;
    }

    // Vimeo
    const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const autoPlayParam = autoplay ? '?autoplay=1&muted=0' : '';
      return `https://player.vimeo.com/video/${videoId}${autoPlayParam}`;
    }

    // Panda Video, VTurb, ConverteAI, Wistia já costumam vir como URL de player embed
    return rawUrl;
  };

  const glowClass = {
    emerald: 'shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/30',
    indigo: 'shadow-[0_0_50px_rgba(79,70,229,0.25)] border-indigo-500/30',
    amber: 'shadow-[0_0_50px_rgba(245,158,11,0.3)] border-amber-500/40',
    red: 'shadow-[0_0_55px_rgba(239,68,68,0.3)] border-red-500/40',
  }[type === 'vsl' ? 'red' : glowColor] || 'shadow-2xl border-slate-700/50';

  // Se for imagem
  if (type === 'image' || (!processedUrl && type !== 'video' && type !== 'vsl')) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-slate-900 group`}>
        <img
          src={processedUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
          <p className="text-white/90 text-sm md:text-base font-semibold drop-shadow">{title}</p>
        </div>
      </div>
    );
  }

  // Se for arquivo direto MP4 / WebM
  if (isDirectVideo(processedUrl)) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95 flex flex-col`}>
        {type === 'vsl' && (
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-black/90 border-b border-red-500/30 text-xs font-bold text-red-400 select-none">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="tracking-wider">VÍDEO EXCLUSIVO • ASSISTA ATÉ O FIM</span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-red-400" />
              <span>Verifique o seu áudio</span>
            </div>
          </div>
        )}
        <div className="flex-1 w-full h-full relative">
          <video
            src={processedUrl}
            controls
            playsInline
            autoPlay={autoplay}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  // Incorporação via Iframe (YouTube, Vimeo, Panda Video, VTurb, etc.)
  const embedSrc = getEmbedUrl(processedUrl);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95 flex flex-col`}>
      {type === 'vsl' && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-black/90 border-b border-red-500/30 text-xs font-bold text-red-400 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="tracking-wider">VÍDEO EXCLUSIVO • ASSISTA ATÉ O FINAL</span>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            <span>Ligue o seu áudio</span>
          </div>
        </div>
      )}
      <div className="flex-1 w-full h-full relative">
        <iframe
          src={embedSrc}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};
