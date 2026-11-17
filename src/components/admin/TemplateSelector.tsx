import React, { useState } from 'react';
import { TEMPLATES } from '../../data/templates';
import { TemplateType } from '../../types';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selected,
  onChange,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ebook' | 'vsl' | 'high-ticket' | 'brand'>('all');

  const filteredTemplates = TEMPLATES.filter(
    (tpl) => categoryFilter === 'all' || tpl.category === categoryFilter
  );

  const counts = {
    all: TEMPLATES.length,
    ebook: TEMPLATES.filter((t) => t.category === 'ebook').length,
    vsl: TEMPLATES.filter((t) => t.category === 'vsl').length,
    'high-ticket': TEMPLATES.filter((t) => t.category === 'high-ticket').length,
    brand: TEMPLATES.filter((t) => t.category === 'brand').length,
  };

  return (
    <div className="space-y-3">
      {/* Filtro de Categorias de Templates */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: `Todos (${counts.all})` },
          { id: 'ebook', label: `📚 E-books & Guias (${counts.ebook})` },
          { id: 'vsl', label: `🔥 VSL & Conversão (${counts.vsl})` },
          { id: 'high-ticket', label: `💎 High Ticket (${counts['high-ticket']})` },
          { id: 'brand', label: `🎨 Marcas & Nichos (${counts.brand})` },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoryFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
              categoryFilter === cat.id
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredTemplates.map((tpl) => {
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
                <span className="text-xs font-black uppercase text-white/95 tracking-wider drop-shadow px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
                  {tpl.badge}
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
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

