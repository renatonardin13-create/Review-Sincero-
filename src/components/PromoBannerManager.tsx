import React, { useState } from 'react';
import { PromoBannerSlide } from '../types';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Sliders,
  CheckCircle,
  AlertCircle,
  Copy,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Upload,
  Info,
  Layers,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  X
} from 'lucide-react';
import { PromoBannerCarousel } from './PromoBannerCarousel';

interface PromoBannerManagerProps {
  banners: PromoBannerSlide[];
  onUpdateBanners: (banners: PromoBannerSlide[]) => void;
  autoplaySpeed: number;
  onUpdateAutoplaySpeed: (speed: number) => void;
  carouselEnabled: boolean;
  onUpdateCarouselEnabled: (enabled: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  {
    name: 'Tech & Modern',
    desktopUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Fitness & Saúde',
    desktopUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gadgets & Smartwatch',
    desktopUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beleza & Cosméticos',
    desktopUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Moda & Acessórios',
    desktopUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Negócios & Cursos',
    desktopUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
  }
];

export const PromoBannerManager: React.FC<PromoBannerManagerProps> = ({
  banners,
  onUpdateBanners,
  autoplaySpeed,
  onUpdateAutoplaySpeed,
  carouselEnabled,
  onUpdateCarouselEnabled
}) => {
  const [editingBannerId, setEditingBannerId] = useState<string | null>(
    banners.length > 0 ? banners[0].id : null
  );
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const activeEditingBanner =
    banners.find((b) => b.id === editingBannerId) || banners[0] || null;

  const handleAddNewBanner = () => {
    const newSlide: PromoBannerSlide = {
      id: 'banner-' + Date.now(),
      title: 'Novo Produto em Oferta Exclusiva',
      description: 'Aproveite esta oportunidade única com desconto especial e frete grátis por tempo limitado.',
      imageUrl: PRESET_BACKGROUNDS[0].desktopUrl,
      desktopImageUrl: PRESET_BACKGROUNDS[0].desktopUrl,
      mobileImageUrl: PRESET_BACKGROUNDS[0].mobileUrl,
      affiliateUrl: 'https://seulinkdeafiliado.com',
      ctaText: 'Ver Oferta Agora',
      badgeText: '🔥 OFERTA LIMITADA',
      badgeColor: 'gold',
      active: true,
      targetBlank: true
    };
    const updated = [newSlide, ...banners];
    onUpdateBanners(updated);
    setEditingBannerId(newSlide.id);
  };

  const handleUpdateCurrentBanner = (updatedProps: Partial<PromoBannerSlide>) => {
    if (!activeEditingBanner) return;
    const updated = banners.map((b) =>
      b.id === activeEditingBanner.id ? { ...b, ...updatedProps } : b
    );
    onUpdateBanners(updated);
  };

  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      alert('Mantenha pelo menos um banner configurado.');
      return;
    }
    if (confirm('Deseja realmente remover este banner?')) {
      const filtered = banners.filter((b) => b.id !== id);
      onUpdateBanners(filtered);
      if (editingBannerId === id) {
        setEditingBannerId(filtered[0]?.id || null);
      }
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    onUpdateBanners(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const newArr = [...banners];
    const item = newArr.splice(index, 1)[0];
    newArr.splice(targetIndex, 0, item);
    onUpdateBanners(newArr);
  };

  const handleDesktopImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2.5MB para melhor desempenho.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        handleUpdateCurrentBanner({
          imageUrl: base64,
          desktopImageUrl: base64
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMobileImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2.5MB para melhor desempenho.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        handleUpdateCurrentBanner({
          mobileImageUrl: base64
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          DIMENSION & MONETIZATION SPECS CALLOUT BOX
         ========================================================================= */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SISTEMA DE MONETIZAÇÃO & BANNERS RESPONSIVOS</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Venda Seus Próprios Produtos ou de Afiliado no App Gratuito
            </h3>
            <p className="text-xs md:text-sm text-[#A1A1A1] leading-relaxed">
              Configure banners independentes para <strong>Desktop</strong> e para <strong>Celular/Tablet</strong> para que sua arte fique sempre nítida e perfeitamente enquadrada em qualquer dispositivo.
            </p>
          </div>

          {/* Master Enable/Disable Switch */}
          <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto bg-[#181818] p-4 rounded-2xl border border-[#2E2E2E]">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <span className="text-xs font-bold text-white">Exibir Slides no Dashboard</span>
              <button
                type="button"
                onClick={() => onUpdateCarouselEnabled(!carouselEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  carouselEnabled ? 'bg-[#22C55E]' : 'bg-[#333]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    carouselEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            <span className="text-[11px] text-[#8E8E8E]">
              {carouselEnabled ? '✅ Slides ativos na página inicial' : '⏸️ Slides ocultos'}
            </span>
          </div>
        </div>

        {/* DIMENSIONS BOX */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#222]">
          <div className="bg-[#181818] border border-[#F5C542]/30 rounded-2xl p-4 relative overflow-hidden">
            <div className="text-xs text-[#F5C542] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-4 h-4" />
              <span>📐 TAMANHO DESKTOP</span>
            </div>
            <div className="text-lg font-black text-white mt-1">1200 x 300 px</div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">
              Proporção 4:1 (ou 16:4 widescreen)
            </div>
          </div>

          <div className="bg-[#181818] border border-[#38BDF8]/30 rounded-2xl p-4 relative overflow-hidden">
            <div className="text-xs text-[#38BDF8] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>📱 TAMANHO MOBILE</span>
            </div>
            <div className="text-lg font-black text-white mt-1">600 x 300 px</div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">
              Proporção 2:1 (celulares e tablets)
            </div>
          </div>

          <div className="bg-[#181818] border border-[#22C55E]/30 rounded-2xl p-4">
            <div className="text-xs text-[#22C55E] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡ FORMATOS RECOMENDADOS</span>
            </div>
            <div className="text-lg font-black text-white mt-1">JPG, PNG, WEBP</div>
            <div className="text-[11px] text-[#8E8E8E] mt-0.5">
              Otimizados e com fundo contrastante
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LIVE PREVIEW OF CURRENT CAROUSEL WITH RESPONSIVE TOGGLE
         ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5C542]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Pré-Visualização Ao Vivo dos Slides
            </h4>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Preview Mode */}
            <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-[#2E2E2E]">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewMode === 'desktop'
                    ? 'bg-[#F5C542] text-[#080808] shadow-sm'
                    : 'text-[#8E8E8E] hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1200x300)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewMode === 'mobile'
                    ? 'bg-[#38BDF8] text-[#080808] shadow-sm'
                    : 'text-[#8E8E8E] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (600x300)</span>
              </button>
            </div>

            <span className="text-xs text-[#8E8E8E] hidden md:inline">
              Tempo: <strong className="text-white">{autoplaySpeed}s</strong>
            </span>
          </div>
        </div>

        <PromoBannerCarousel
          banners={banners}
          autoplaySpeed={autoplaySpeed}
          enabled={carouselEnabled}
          previewMode={previewMode}
        />
      </div>

      {/* =========================================================================
          SLIDES MANAGEMENT LIST & DETAILED EDITOR
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Slide Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
              Seus Slides ({banners.length})
            </h4>
            <button
              type="button"
              onClick={handleAddNewBanner}
              className="flex items-center gap-1.5 text-xs font-bold text-[#080808] bg-[#F5C542] hover:bg-[#FFD95A] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Novo Slide</span>
            </button>
          </div>

          <div className="space-y-2">
            {banners.map((banner, idx) => {
              const isSelected = activeEditingBanner?.id === banner.id;
              const displayImg = banner.desktopImageUrl || banner.imageUrl;
              return (
                <div
                  key={banner.id}
                  onClick={() => setEditingBannerId(banner.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1C1C1C] border-[#F5C542] shadow-lg shadow-[#F5C542]/5'
                      : 'bg-[#121212] border-[#242424] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={displayImg}
                      alt={banner.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-10 rounded-lg object-cover bg-black shrink-0 border border-[#333]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {banner.title || 'Sem título'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#8E8E8E] truncate">
                          {banner.ctaText || 'Ver Oferta'}
                        </span>
                        {banner.mobileImageUrl && (
                          <span className="text-[9px] bg-[#38BDF8]/15 text-[#38BDF8] px-1.5 py-0.2 rounded font-bold">
                            +Mobile
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & reorder */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
                        banner.active
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-[#222] text-[#666]'
                      }`}
                      title={banner.active ? 'Slide Ativo' : 'Slide Inativo'}
                    >
                      {banner.active ? 'ON' : 'OFF'}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 text-[#777] hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === banners.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 text-[#777] hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1 text-[#777] hover:text-[#EF4444] cursor-pointer"
                      title="Excluir slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Autoplay Speed slider */}
          <div className="bg-[#121212] border border-[#242424] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A1A1] font-semibold">Velocidade da Transição</span>
              <span className="text-[#F5C542] font-bold font-mono">{autoplaySpeed} segundos</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={autoplaySpeed}
              onChange={(e) => onUpdateAutoplaySpeed(Number(e.target.value))}
              className="w-full accent-[#F5C542] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#666]">
              <span>3s (Mais rápido)</span>
              <span>15s (Mais lento)</span>
            </div>
          </div>
        </div>

        {/* Right column: Edit Details for Selected Slide (8 cols) */}
        {activeEditingBanner ? (
          <div className="lg:col-span-8 bg-[#151515] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
              <div>
                <h4 className="text-base font-bold text-white">Editar Slide Selecionado</h4>
                <p className="text-xs text-[#8E8E8E]">
                  Preencha as informações do produto, links e as imagens para Desktop e Mobile.
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  activeEditingBanner.active
                    ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                    : 'bg-[#333] text-[#888] border-[#444]'
                }`}
              >
                {activeEditingBanner.active ? '● Ativo nos Slides' : '○ Inativo'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                  Nome do Produto / Título da Oferta
                </label>
                <input
                  type="text"
                  value={activeEditingBanner.title}
                  onChange={(e) => handleUpdateCurrentBanner({ title: e.target.value })}
                  placeholder="Ex: Treinamento Afiliado Pro 2026, Creatina 100% Pura, Fone ANC..."
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                  Descrição do Produto / Chamada Persuasiva (Copy)
                </label>
                <textarea
                  rows={3}
                  value={activeEditingBanner.description}
                  onChange={(e) => handleUpdateCurrentBanner({ description: e.target.value })}
                  placeholder="Ex: Domine as vendas orgânicas e automáticas com estratégias validadas. Oferta com 50% de desconto por tempo limitado."
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542] resize-none"
                />
              </div>

              {/* Affiliate Link & CTA Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                    Link de Afiliado / URL de Destino
                  </label>
                  <input
                    type="url"
                    value={activeEditingBanner.affiliateUrl}
                    onChange={(e) => handleUpdateCurrentBanner({ affiliateUrl: e.target.value })}
                    placeholder="https://hotm.art/seu-link ou https://shopee.com..."
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                    Texto do Botão (CTA)
                  </label>
                  <input
                    type="text"
                    value={activeEditingBanner.ctaText}
                    onChange={(e) => handleUpdateCurrentBanner({ ctaText: e.target.value })}
                    placeholder="Ex: Garantir Desconto, Comprar Agora, Acessar Oferta"
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              {/* Badge Text & Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                    Selo / Badge Promocional
                  </label>
                  <input
                    type="text"
                    value={activeEditingBanner.badgeText || ''}
                    onChange={(e) => handleUpdateCurrentBanner({ badgeText: e.target.value })}
                    placeholder="Ex: 🔥 OFERTA EXCLUSIVA, ⚡ 50% OFF, ⭐ MAIS VENDIDO"
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A1A1] uppercase tracking-wider mb-2">
                    Cor do Selo
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {(['gold', 'red', 'green', 'blue', 'purple'] as const).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleUpdateCurrentBanner({ badgeColor: col })}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          activeEditingBanner.badgeColor === col
                            ? 'ring-2 ring-white scale-110'
                            : 'opacity-70 hover:opacity-100'
                        } ${
                          col === 'gold'
                            ? 'bg-[#F5C542] border-[#FFD95A]'
                            : col === 'red'
                            ? 'bg-[#DC2626] border-[#EF4444]'
                            : col === 'green'
                            ? 'bg-[#16A34A] border-[#22C55E]'
                            : col === 'blue'
                            ? 'bg-[#2563EB] border-[#3B82F6]'
                            : 'bg-[#9333EA] border-[#A855F7]'
                        }`}
                      >
                        {activeEditingBanner.badgeColor === col && (
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  TWO IMAGE INPUT FIELDS: DESKTOP AND MOBILE / TABLET
                 ========================================================================= */}
              <div className="pt-4 border-t border-[#262626] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#F5C542]" />
                      <span>Imagens do Banner (Desktop e Mobile/Tablet)</span>
                    </h5>
                    <p className="text-xs text-[#8E8E8E] mt-0.5">
                      Suba duas imagens separadas para garantir o enquadramento perfeito em todas as telas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPresetModal(!showPresetModal)}
                    className="text-xs text-[#F5C542] hover:underline font-semibold cursor-pointer"
                  >
                    {showPresetModal ? 'Ocultar Fundos Prontos' : 'Fundos Prontos'}
                  </button>
                </div>

                {/* Preset background chooser */}
                {showPresetModal && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl animate-in fade-in">
                    {PRESET_BACKGROUNDS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          handleUpdateCurrentBanner({
                            imageUrl: preset.desktopUrl,
                            desktopImageUrl: preset.desktopUrl,
                            mobileImageUrl: preset.mobileUrl
                          });
                          setShowPresetModal(false);
                        }}
                        className="group relative rounded-xl overflow-hidden border border-[#333] hover:border-[#F5C542] text-left p-1.5 cursor-pointer bg-[#151515]"
                      >
                        <img
                          src={preset.desktopUrl}
                          alt={preset.name}
                          className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <span className="block text-[11px] font-bold text-white mt-1 px-1 truncate">
                          {preset.name}
                        </span>
                        <span className="block text-[9px] text-[#8E8E8E] px-1">
                          Desktop + Mobile
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* FIELD 1: DESKTOP BANNER */}
                <div className="bg-[#101010] border border-[#282828] hover:border-[#383838] transition-colors rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="text-xs font-black text-white uppercase tracking-wider block">
                          1. Banner para Desktop (Computadores & Notebooks)
                        </label>
                        <span className="text-[11px] text-[#F5C542] font-semibold">
                          Tamanho Recomendado: 1200 x 300 px (Proporção 4:1)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-full sm:w-28 h-14 rounded-xl overflow-hidden border border-[#333] bg-black shrink-0 relative group">
                      <img
                        src={activeEditingBanner.desktopImageUrl || activeEditingBanner.imageUrl}
                        alt="Desktop Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-black/80 text-white px-1 rounded">
                        1200x300
                      </span>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="url"
                        value={activeEditingBanner.desktopImageUrl || activeEditingBanner.imageUrl}
                        onChange={(e) =>
                          handleUpdateCurrentBanner({
                            imageUrl: e.target.value,
                            desktopImageUrl: e.target.value
                          })
                        }
                        placeholder="Cole a URL da imagem para Desktop (1200x300)..."
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F5C542]"
                      />
                    </div>

                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#222] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#F5C542]" />
                      <span>Upload Desktop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDesktopImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* FIELD 2: MOBILE / TABLET BANNER */}
                <div className="bg-[#101010] border border-[#282828] hover:border-[#383838] transition-colors rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="text-xs font-black text-white uppercase tracking-wider block">
                          2. Banner para Celular & Tablet (Mobile)
                        </label>
                        <span className="text-[11px] text-[#38BDF8] font-semibold">
                          Tamanho Recomendado: 600 x 300 px (Proporção 2:1)
                        </span>
                      </div>
                    </div>

                    {activeEditingBanner.mobileImageUrl && (
                      <button
                        type="button"
                        onClick={() => handleUpdateCurrentBanner({ mobileImageUrl: '' })}
                        className="text-[10px] text-[#EF4444] hover:underline self-start sm:self-auto cursor-pointer"
                      >
                        Remover Mobile (Usar Desktop)
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-full sm:w-20 h-14 rounded-xl overflow-hidden border border-[#333] bg-black shrink-0 relative group">
                      <img
                        src={
                          activeEditingBanner.mobileImageUrl ||
                          activeEditingBanner.desktopImageUrl ||
                          activeEditingBanner.imageUrl
                        }
                        alt="Mobile Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-black/80 text-white px-1 rounded">
                        600x300
                      </span>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="url"
                        value={activeEditingBanner.mobileImageUrl || ''}
                        onChange={(e) =>
                          handleUpdateCurrentBanner({ mobileImageUrl: e.target.value })
                        }
                        placeholder="Cole a URL da imagem para Mobile/Tablet (600x300)..."
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#222] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Upload Mobile</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMobileImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[11px] text-[#8E8E8E] flex items-center gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span>
                      {activeEditingBanner.mobileImageUrl
                        ? '✅ Imagem mobile exclusiva configurada. Celulares e tablets carregarão este arquivo.'
                        : '💡 Se você não colocar uma imagem mobile, o aplicativo adaptará a imagem de Desktop automaticamente.'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#151515] border border-[#2A2A2A] rounded-3xl p-12 text-center text-[#8E8E8E]">
            Selecione ou crie um slide na coluna ao lado para editar.
          </div>
        )}
      </div>
    </div>
  );
};
