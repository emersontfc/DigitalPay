import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  productName?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  whatsappNumber,
  whatsappMessage,
  productName,
}) => {
  if (!whatsappNumber) return null;

  // Limpa caracteres especiais do número
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber || cleanNumber.length < 8) return null;

  const defaultMessage = productName
    ? `Olá! Tenho interesse no "${productName}" e gostaria de tirar uma dúvida.`
    : 'Olá! Gostaria de mais informações sobre a oferta.';

  const finalMessage = whatsappMessage?.trim() || defaultMessage;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip informativo ao passar o cursor ou no mobile */}
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <span>💬 Dúvidas? Fale no WhatsApp</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento via WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_4px_25px_rgba(37,211,102,0.5)] hover:shadow-[0_6px_35px_rgba(37,211,102,0.7)] transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Efeito de onda pulsante */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* Ícone oficial WhatsApp em SVG */}
        <svg
          className="w-7 h-7 fill-white relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.418 0-8 3.582-8 8 0 1.411.365 2.738 1.004 3.891l-1.066 3.901 4.022-1.055c1.116.609 2.392.955 3.751.955 4.418 0 8-3.582 8-8s-3.582-8-8-8zm0 14.5c-1.227 0-2.378-.344-3.364-.945l-.241-.147-2.39.627.638-2.332-.161-.257c-.672-1.069-1.026-2.316-1.026-3.601 0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5z"/>
        </svg>
      </a>
    </div>
  );
};

