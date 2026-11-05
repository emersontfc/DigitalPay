import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'neon' | 'luxury' | 'gold' | 'default';
  showText?: boolean;
  linkTo?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'neon',
  showText = true,
  linkTo,
  className = '',
}) => {
  // Configurações de tamanho
  const sizeConfig = {
    sm: {
      box: 'w-7 h-7 rounded-lg p-0.5',
      inner: 'rounded-[6px]',
      textIcon: 'text-xs',
      brandText: 'text-base',
      subText: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9 rounded-xl p-0.5',
      inner: 'rounded-[10px]',
      textIcon: 'text-sm font-black',
      brandText: 'text-lg',
      subText: 'text-[10px]',
    },
    lg: {
      box: 'w-11 h-11 rounded-2xl p-0.5',
      inner: 'rounded-[14px]',
      textIcon: 'text-lg font-black',
      brandText: 'text-2xl',
      subText: 'text-xs',
    },
  }[size];

  // Configurações de cores por variante
  const variantConfig = {
    neon: {
      gradient: 'from-emerald-500 via-teal-400 to-emerald-600',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      iconText: 'text-emerald-400',
      primaryText: 'text-white',
      accentText: 'text-emerald-400',
      badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    },
    luxury: {
      gradient: 'from-indigo-400 via-slate-200 to-indigo-600',
      shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      iconText: 'text-indigo-300',
      primaryText: 'text-white',
      accentText: 'text-indigo-400',
      badge: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300',
    },
    gold: {
      gradient: 'from-amber-400 via-yellow-200 to-amber-600',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      iconText: 'text-amber-400',
      primaryText: 'text-white',
      accentText: 'text-amber-400',
      badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    },
    default: {
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      iconText: 'text-emerald-400',
      primaryText: 'text-white',
      accentText: 'text-emerald-400',
      badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    },
  }[variant];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Símbolo DP com Gradiente e Glow */}
      <div
        className={`${sizeConfig.box} bg-gradient-to-tr ${variantConfig.gradient} ${variantConfig.shadow} transition-transform duration-200 group-hover:scale-105 shrink-0`}
      >
        <div className={`w-full h-full bg-slate-950 ${sizeConfig.inner} flex items-center justify-center`}>
          <span className={`${variantConfig.iconText} ${sizeConfig.textIcon} font-black tracking-tight`}>
            DP
          </span>
        </div>
      </div>

      {/* Tipografia da Marca: Digitall Pay */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`${sizeConfig.brandText} font-black tracking-tight ${variantConfig.primaryText} flex items-center gap-1`}>
            Digitall<span className={variantConfig.accentText}>Pay</span>
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
