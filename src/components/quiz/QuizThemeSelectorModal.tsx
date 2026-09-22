import React, { useState } from 'react';
import { Palette, Check, Sparkles, X, RotateCcw, Paintbrush, Sliders } from 'lucide-react';
import { QuizConfig, QuizThemeConfig, Review } from '../../types';
import {
  QUIZ_NICHE_THEMES,
  QuizNicheTheme,
  getRecommendedThemeForCategory,
  themePresetToConfig
} from '../../utils/quizThemePresets';

interface QuizThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizConfig: QuizConfig;
  review?: Partial<Review>;
  onApplyTheme: (themeConfig: QuizThemeConfig) => void;
}

export const QuizThemeSelectorModal: React.FC<QuizThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  quizConfig,
  review,
  onApplyTheme
}) => {
  const recommendedTheme = getRecommendedThemeForCategory(review?.category);

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    // try matching existing theme to preset
    if (quizConfig.theme?.primaryColor) {
      const match = QUIZ_NICHE_THEMES.find(
        (t) => t.primaryColor.toLowerCase() === quizConfig.theme?.primaryColor?.toLowerCase()
      );
      if (match) return match.id;
    }
    return recommendedTheme.id;
  });

  const [customTheme, setCustomTheme] = useState<QuizThemeConfig>(() => {
    if (quizConfig.theme) return { ...quizConfig.theme };
    return themePresetToConfig(recommendedTheme);
  });

  if (!isOpen) return null;

  const handleSelectPreset = (preset: QuizNicheTheme) => {
    setSelectedPresetId(preset.id);
    const newConfig = themePresetToConfig(preset);
    setCustomTheme(newConfig);
  };

  const handleConfirm = () => {
    onApplyTheme(customTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542]">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Temas Visuais de Quiz por Nicho</span>
                <span className="text-xs bg-[#222222] border border-[#333333] px-2.5 py-0.5 rounded-full text-[#F5C542] font-semibold">
                  12+ Estilos
                </span>
              </h2>
              <p className="text-xs text-[#A1A1A1] mt-0.5">
                Personalize a aparência do seu Quiz com temas otimizados para a psicologia visual de cada categoria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1F1F1F] text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A]">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'text-[#A1A1A1] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Temas por Nicho</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-[#F5C542] text-[#080808] shadow-md'
                  : 'text-[#A1A1A1] hover:text-white'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Editor de Cores Personalizado</span>
            </button>
          </div>

          {review?.category && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#A1A1A1] bg-[#1A1A1A] px-3.5 py-2 rounded-xl border border-[#2A2A2A]">
              <span>Categoria do produto:</span>
              <strong className="text-white">{review.category}</strong>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUIZ_NICHE_THEMES.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const isRecommended = recommendedTheme.id === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative rounded-2xl border p-4 transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#F5C542] bg-[#1E1C14] shadow-lg shadow-[#F5C542]/10 ring-1 ring-[#F5C542]'
                        : 'border-[#2A2A2A] bg-[#181818] hover:border-[#3A3A3A] hover:bg-[#1D1D1D]'
                    }`}
                  >
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#222222] border border-[#333333] text-white">
                        {preset.badge}
                      </span>
                      {isRecommended && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                          ★ Recomendado
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center justify-between">
                        <span>{preset.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#F5C542]" />}
                      </h4>
                      <p className="text-xs text-[#A1A1A1] mt-1 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Visual Color Palette Preview Box */}
                    <div
                      className="rounded-xl p-3 border text-xs space-y-2 mt-2 transition-transform duration-200 group-hover:scale-[1.01]"
                      style={{
                        backgroundColor: preset.bgColor,
                        borderColor: preset.borderColor,
                        color: preset.textColor
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold opacity-90">
                        <span>Exemplo de Pergunta</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: preset.primaryColor }}
                        >
                          100%
                        </span>
                      </div>

                      {/* Sample Option Button */}
                      <div
                        className="p-2 rounded-lg font-medium text-[11px] flex items-center justify-between border"
                        style={{
                          backgroundColor: preset.cardBgColor,
                          borderColor: preset.primaryColor,
                          color: preset.textColor
                        }}
                      >
                        <span>Opção Selecionada</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Colors Editor */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#181818] border border-[#2A2A2A] p-6 rounded-2xl">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#F5C542]" />
                  <span>Ajuste Fino de Cores e Estilo</span>
                </h3>

                {/* Primary Color */}
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Cor Principal / Destaques
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.primaryColor || '#F5C542'}
                      onChange={(e) => setCustomTheme({ ...customTheme, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.primaryColor || '#F5C542'}
                      onChange={(e) => setCustomTheme({ ...customTheme, primaryColor: e.target.value })}
                      className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Cor do Fundo Principal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.bgColor || '#0D0D0D'}
                      onChange={(e) => setCustomTheme({ ...customTheme, bgColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.bgColor || '#0D0D0D'}
                      onChange={(e) => setCustomTheme({ ...customTheme, bgColor: e.target.value })}
                      className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Card Background Color */}
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Cor dos Cards & Containers
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.cardBgColor || '#151515'}
                      onChange={(e) => setCustomTheme({ ...customTheme, cardBgColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.cardBgColor || '#151515'}
                      onChange={(e) => setCustomTheme({ ...customTheme, cardBgColor: e.target.value })}
                      className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Arredondamento dos Cantos
                  </label>
                  <select
                    value={customTheme.borderRadius || '16px'}
                    onChange={(e) => setCustomTheme({ ...customTheme, borderRadius: e.target.value })}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="8px">Discreto (8px)</option>
                    <option value="12px">Padrão Moderno (12px)</option>
                    <option value="16px">Elegante (16px)</option>
                    <option value="24px">Arredondado Suave (24px)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="flex flex-col justify-between space-y-4">
                <h3 className="text-sm font-bold text-white">Preview em Tempo Real</h3>

                <div
                  className="p-5 rounded-2xl border flex-1 space-y-4 flex flex-col justify-center"
                  style={{
                    backgroundColor: customTheme.bgColor || '#0D0D0D',
                    borderColor: customTheme.borderColor || '#2A2A2A',
                    color: customTheme.textColor || '#FFFFFF',
                    borderRadius: customTheme.borderRadius || '16px'
                  }}
                >
                  <div className="text-center space-y-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase"
                      style={{ backgroundColor: customTheme.primaryColor || '#F5C542' }}
                    >
                      Diagnóstico do Produto
                    </span>
                    <h4 className="text-base font-bold">Qual seu maior objetivo?</h4>
                  </div>

                  <div
                    className="p-3 rounded-xl border text-xs font-medium flex items-center justify-between"
                    style={{
                      backgroundColor: customTheme.cardBgColor || '#151515',
                      borderColor: customTheme.primaryColor || '#F5C542',
                      borderRadius: customTheme.borderRadius || '12px'
                    }}
                  >
                    <span>Obter o melhor resultado prático</span>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                      style={{ backgroundColor: customTheme.primaryColor || '#F5C542' }}
                    >
                      ✓
                    </div>
                  </div>

                  <button
                    className="w-full py-3 font-bold text-xs text-black rounded-xl shadow-lg cursor-default"
                    style={{
                      backgroundColor: customTheme.primaryColor || '#F5C542',
                      borderRadius: customTheme.borderRadius || '12px'
                    }}
                  >
                    CONTINUAR →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#222222] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              const rec = themePresetToConfig(recommendedTheme);
              setCustomTheme(rec);
              setSelectedPresetId(recommendedTheme.id);
            }}
            className="flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Recomendado</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] text-xs font-semibold text-[#A1A1A1] hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Aplicar Tema ao Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
