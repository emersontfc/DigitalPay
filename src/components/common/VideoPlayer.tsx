import React, { useMemo } from 'react';
import { Volume2, Play, AlertCircle } from 'lucide-react';

export interface ResolvedVideoSource {
  type: 'iframe' | 'direct-video' | 'raw-html' | 'empty';
  url?: string;
  html?: string;
  provider: 'vturb' | 'pandavideo' | 'youtube' | 'vimeo' | 'wistia' | 'html5' | 'generic-iframe' | 'custom-html' | 'unknown';
  detectedLabel: string;
}

/**
 * Normalizador universal inteligente de URLs, Iframes e Scripts de VSL / Vídeo.
 * Suporta VTurb, Panda Video, YouTube, Vimeo, Wistia, MP4 direto e qualquer código de incorporação HTML.
 */
export function resolveVideoSource(raw: string, autoplay: boolean = false): ResolvedVideoSource {
  if (!raw || typeof raw !== 'string') {
    return { type: 'empty', provider: 'unknown', detectedLabel: '' };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { type: 'empty', provider: 'unknown', detectedLabel: '' };
  }

  // 1. VTurb / ConverteAI (Suporta script tag completo, link player.js, link embed.html, smartplayer e iframe)
  // Padrão CDN ConverteAI: converteai.net/{accountId}/players/{playerId}
  const vturbMatch = trimmed.match(/(?:scripts\.converteai\.net|cdn\.converteai\.net|converteai\.net)\/([a-zA-Z0-9_-]+)\/players\/([a-zA-Z0-9_-]+)/i);
  if (vturbMatch && vturbMatch[1] && vturbMatch[2]) {
    const accountId = vturbMatch[1];
    const playerId = vturbMatch[2];
    const autoParam = autoplay ? '?autoplay=1' : '';
    return {
      type: 'iframe',
      url: `https://scripts.converteai.net/${accountId}/players/${playerId}/embed.html${autoParam}`,
      provider: 'vturb',
      detectedLabel: 'VTurb / ConverteAI Player',
    };
  }

  // Padrão de domínio direto VTurb
  const vturbDomainMatch = trimmed.match(/(?:player\.)?vturb\.com(?:\.br)?\/([a-zA-Z0-9_-]+)/i);
  if (vturbDomainMatch && vturbDomainMatch[1]) {
    const autoParam = autoplay ? '?autoplay=1' : '';
    return {
      type: 'iframe',
      url: `https://player.vturb.com.br/${vturbDomainMatch[1]}${autoParam}`,
      provider: 'vturb',
      detectedLabel: 'VTurb Player',
    };
  }

  // 2. Panda Video
  if (trimmed.includes('pandavideo.com.br')) {
    const pandaSrcMatch = trimmed.match(/src=["']([^"']*pandavideo\.com\.br[^"']*)["']/i);
    let pandaUrl = pandaSrcMatch ? pandaSrcMatch[1] : trimmed;
    pandaUrl = pandaUrl.replace(/["'<>]/g, '').trim();
    if (autoplay && !pandaUrl.includes('autoplay=')) {
      pandaUrl += (pandaUrl.includes('?') ? '&' : '?') + 'autoplay=true';
    }
    return {
      type: 'iframe',
      url: pandaUrl,
      provider: 'pandavideo',
      detectedLabel: 'Panda Video Player',
    };
  }

  // 3. YouTube (Links padrão, shorts, youtu.be, embed e iframes)
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const autoParams = autoplay ? '&autoplay=1&mute=0' : '&autoplay=0';
    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${autoParams}`,
      provider: 'youtube',
      detectedLabel: 'YouTube Player',
    };
  }

  // 4. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const autoParam = autoplay ? '?autoplay=1&muted=0' : '';
    return {
      type: 'iframe',
      url: `https://player.vimeo.com/video/${videoId}${autoParam}`,
      provider: 'vimeo',
      detectedLabel: 'Vimeo Player',
    };
  }

  // 5. Wistia
  const wistiaMatch = trimmed.match(/(?:wistia\.(?:com|net)\/(?:embed\/iframe|medias)\/)([a-zA-Z0-9_-]+)/i);
  if (wistiaMatch && wistiaMatch[1]) {
    const videoId = wistiaMatch[1];
    return {
      type: 'iframe',
      url: `https://fast.wistia.net/embed/iframe/${videoId}${autoplay ? '?autoPlay=true' : ''}`,
      provider: 'wistia',
      detectedLabel: 'Wistia Player',
    };
  }

  // 6. Iframe genérico (captura o atributo src de qualquer <iframe ... src="...">)
  const genericIframeMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i) || trimmed.match(/src=["']([^"']+)["']/i);
  if (genericIframeMatch && genericIframeMatch[1]) {
    const extractedUrl = genericIframeMatch[1].replace(/&amp;/g, '&');
    return {
      type: 'iframe',
      url: extractedUrl,
      provider: 'generic-iframe',
      detectedLabel: 'Iframe Incorporado',
    };
  }

  // 7. Arquivo direto de vídeo HTML5 (.mp4, .webm, .ogg, data:video, blob)
  const cleanUrl = trimmed.split('?')[0].toLowerCase();
  if (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    trimmed.startsWith('data:video') ||
    trimmed.startsWith('blob:')
  ) {
    return {
      type: 'direct-video',
      url: trimmed,
      provider: 'html5',
      detectedLabel: 'Vídeo HTML5 / MP4',
    };
  }

  // 8. Código HTML ou Script de Embed Arbitrário
  if (
    trimmed.includes('<script') ||
    trimmed.includes('<iframe') ||
    trimmed.includes('<div') ||
    trimmed.includes('<embed') ||
    trimmed.includes('<video') ||
    trimmed.includes('<object')
  ) {
    return {
      type: 'raw-html',
      html: trimmed,
      provider: 'custom-html',
      detectedLabel: 'Código HTML / Script Personalizado',
    };
  }

  // 9. Se for URL web padrão (http:// ou https://)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'iframe',
      url: trimmed,
      provider: 'unknown',
      detectedLabel: 'Player Web',
    };
  }

  return {
    type: 'empty',
    provider: 'unknown',
    detectedLabel: '',
  };
}

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
  const resolved = useMemo(() => {
    return resolveVideoSource(url, autoplay);
  }, [url, autoplay]);

  const glowClass = ({
    emerald: 'shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/30',
    indigo: 'shadow-[0_0_50px_rgba(79,70,229,0.25)] border-indigo-500/30',
    amber: 'shadow-[0_0_50px_rgba(245,158,11,0.3)] border-amber-500/40',
    red: 'shadow-[0_0_55px_rgba(239,68,68,0.35)] border-red-500/40',
    cyan: 'shadow-[0_0_50px_rgba(6,182,212,0.3)] border-cyan-500/30',
    rose: 'shadow-[0_0_50px_rgba(244,63,94,0.3)] border-rose-500/30',
    blue: 'shadow-[0_0_50px_rgba(59,130,246,0.3)] border-blue-500/30',
  } as Record<string, string>)[type === 'vsl' ? 'red' : glowColor] || 'shadow-2xl border-slate-700/50';

  // Barra de cabeçalho chamativa exclusiva de VSL
  const renderVslHeader = () => (
    <div className="flex items-center justify-between px-3.5 py-2 bg-black/95 border-b border-red-500/30 text-xs font-bold text-red-400 select-none shrink-0">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="tracking-wider uppercase font-black">VÍDEO EXCLUSIVO • ASSISTA ATÉ O FINAL</span>
      </div>
      <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
        <Volume2 className="w-3.5 h-3.5 text-red-400" />
        <span>Ligue o seu som</span>
      </div>
    </div>
  );

  // 1. SE FOR TIPO IMAGEM
  if (type === 'image') {
    const fallbackImage = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80';
    const imageSrc = resolved.type === 'empty' && url && !url.includes('<') ? url : (resolved.url || fallbackImage);

    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-slate-900 group`}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
          <p className="text-white/90 text-sm md:text-base font-semibold drop-shadow">{title}</p>
        </div>
      </div>
    );
  }

  // 2. SE NENHUM VÍDEO FOI CONFIGURADO AINDA
  if (resolved.type === 'empty') {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-400`}>
        <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <Play className="w-6 h-6 ml-1" />
        </div>
        <p className="text-sm font-bold text-white mb-1">Vídeo / VSL Pendente</p>
        <p className="text-xs text-slate-400 max-w-sm">
          Cole o link ou código de incorporação do seu vídeo (VTurb, Panda Video, YouTube ou Vimeo) no painel.
        </p>
      </div>
    );
  }

  // 3. SE FOR VÍDEO HTML5 DIRETO (.mp4, .webm)
  if (resolved.type === 'direct-video' && resolved.url) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95 flex flex-col`}>
        {type === 'vsl' && renderVslHeader()}
        <div className="flex-1 w-full h-full relative">
          <video
            src={resolved.url}
            controls
            playsInline
            autoPlay={autoplay}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  // 4. SE FOR CÓDIGO HTML BRUTO / SCRIPT CUSTOMIZADO (Renderização Isolada via srcDoc)
  if (resolved.type === 'raw-html' && resolved.html) {
    const sandboxDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    iframe, video, .smartplayer-container, [id^="vid_"] {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      border: none !important;
    }
  </style>
</head>
<body>
  ${resolved.html}
</body>
</html>`;

    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95 flex flex-col`}>
        {type === 'vsl' && renderVslHeader()}
        <div className="flex-1 w-full h-full relative">
          <iframe
            srcDoc={sandboxDoc}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // 5. SE FOR IFRAME PADRÃO (VTurb embed.html, Panda Video, YouTube, Vimeo, etc.)
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border ${glowClass} aspect-video bg-black/95 flex flex-col`}>
      {type === 'vsl' && renderVslHeader()}
      <div className="flex-1 w-full h-full relative">
        <iframe
          src={resolved.url}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};
