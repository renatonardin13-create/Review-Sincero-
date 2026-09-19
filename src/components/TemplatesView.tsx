import React from 'react';
import { TemplateType } from '../types';
import { LayoutTemplate, Check, Sparkles, Zap, Shield } from 'lucide-react';

interface TemplatesViewProps {
  defaultTemplate: TemplateType;
  onSelectDefaultTemplate: (template: TemplateType) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  defaultTemplate,
  onSelectDefaultTemplate
}) => {
  const templates = [
    {
      id: 'premium' as TemplateType,
      name: 'Template Premium',
      badge: 'Mais Popular',
      desc: 'Visual escuro sofisticado, ideal para produtos de alta tecnologia, eletrônicos e gadgets com foco em confiança e elegância.',
      features: ['Estética Dark Luxury', 'Análise Honesta destacada', 'Galeria de fotos imersiva', 'Seção de FAQ em accordion']
    },
    {
      id: 'clean' as TemplateType,
      name: 'Template Clean',
      badge: 'Editorial',
      desc: 'Visual editorial claro e arejado. Perfeito para skincare, beleza, livros e cursos digitais com foco em leitura confortável.',
      features: ['Tipografia refinada', 'Fundo claro de alta legibilidade', 'Cards minimalistas', 'Depoimentos em destaque']
    },
    {
      id: 'conversion' as TemplateType,
      name: 'Template Conversion',
      badge: 'Alta Conversão',
      desc: 'Visual mais forte e orientado para CTA. Ideal para ofertas de lançamento, suplementos e e-commerce de alta conversão.',
      features: ['CTAs duplos estratégicos', 'Gatilhos de urgência e preço', 'Veredito e nota em evidência', 'Badges de garantia e transparência']
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Templates de Review</h2>
        <p className="text-sm text-[#A1A1A1] mt-1">
          Escolha o design ideal para suas páginas de review. O conteúdo permanece idêntico, mudando apenas a apresentação visual e a experiência de leitura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isSelected = defaultTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`bg-[#151515] border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                isSelected ? 'border-[#F5C542] ring-2 ring-[#F5C542]/20 shadow-xl shadow-[#F5C542]/5' : 'border-[#2A2A2A] hover:border-[#2A2A2A]/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#0D0D0D] border border-[#2A2A2A] text-xs font-semibold text-[#F5C542]">
                    {tpl.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs text-[#22C55E] font-semibold bg-[#22C55E]/10 px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                      <Check className="w-3.5 h-3.5" /> Padrão Ativo
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{tpl.name}</h3>
                <p className="text-xs text-[#A1A1A1] leading-relaxed mb-6">{tpl.desc}</p>

                <div className="space-y-2.5 border-t border-[#2A2A2A] pt-4">
                  {tpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                      <Check className="w-3.5 h-3.5 text-[#F5C542]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#2A2A2A]">
                <button
                  onClick={() => onSelectDefaultTemplate(tpl.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                    isSelected
                      ? 'bg-[#F5C542] text-[#080808]'
                      : 'bg-[#0D0D0D] border border-[#2A2A2A] text-white hover:border-[#F5C542]'
                  }`}
                >
                  {isSelected ? 'Template Selecionado' : 'Definir como Padrão'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
