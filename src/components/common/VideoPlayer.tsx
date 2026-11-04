import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  type?: 'video' | 'image';
  title?: string;
  glowColor?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  type = 'video',
  title = 'Apresentação do Produto',
  glowColor = 'emerald',
}) => {
  // Converte URLs normais do YouTube para formato embed
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';

    // Já é embed
    if (rawUrl.includes('youtube.com/embed/')) return rawUrl;

    // Formato youtube.com/watch?v=ID
    const ytWatchMatch = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
    if (ytWatchMatch && ytWatchMatch[1]) {
      return `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }

    // Formato Vimeo
    const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return rawUrl;
  };

  const glowClass = {
    emerald: 'shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/30',
    indigo: 'shadow-[0_0_50px_rgba(79,70,229,0.25)] border-indigo-500/30',
    amber: 'shadow-[0_0_50px_rgba(245,158,11,0.3)] border-amber-500/40',
  }[glowColor] || 'shadow-2xl border-slate-700/50';

  if (type === 'image' || !url) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-slate-900 group`}>
        <img
          src={url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
          <p className="text-white/90 text-sm md:text-base font-semibold drop-shadow">{title}</p>
        </div>
      </div>
    );
  }

  const embedSrc = getEmbedUrl(url);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95`}>
      <iframe
        src={embedSrc}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

