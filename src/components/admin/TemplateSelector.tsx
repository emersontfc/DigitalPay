import React from 'react';
import { TEMPLATES } from '../../data/templates';
import { TemplateType } from '../../types';
import { Check, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TEMPLATES.map((tpl) => {
        const isSelected = selected === tpl.id;
        return (
          <div
            key={tpl.id}
            onClick={() => onChange(tpl.id)}
            className={`group relative rounded-2xl p-4 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              isSelected
                ? 'bg-slate-900 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            {/* Top gradient preview */}
            <div
              className={`w-full h-20 rounded-xl bg-gradient-to-r ${tpl.previewGradient} mb-3 flex items-center justify-center relative overflow-hidden border border-white/10`}
            >
              <span className="text-xs font-black uppercase text-white/90 tracking-wider drop-shadow px-3 py-1 rounded bg-black/40 backdrop-blur-sm">
                {tpl.name.split(' ')[0]}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                  {tpl.name}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

