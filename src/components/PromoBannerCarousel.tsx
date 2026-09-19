import React, { useState, useEffect, useRef } from 'react';
import { PromoBannerSlide } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Flame,
  Tag,
  Gift,
  ShieldCheck,
  Zap,
  Pause,
  Play
} from 'lucide-react';

interface PromoBannerCarouselProps {
  banners?: PromoBannerSlide[];
  autoplaySpeed?: number; // em segundos
  enabled?: boolean;
  onManageClick?: () => void;
  previewMode?: 'auto' | 'desktop' | 'mobile';
}

export const PromoBannerCarousel: React.FC<PromoBannerCarouselProps> = ({
  banners = [],
  autoplaySpeed = 6,
  enabled = true,
  onManageClick,
  previewMode = 'auto'
}) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const speedMs = Math.max((autoplaySpeed || 6) * 1000, 3000);

  // Auto slide interval
  useEffect(() => {
    if (!enabled || activeBanners.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, activeBanners.length, isPaused, speedMs]);

  if (!enabled || activeBanners.length === 0) {
    return null;
  }

  const currentSlide = activeBanners[currentIndex] || activeBanners[0];
  const desktopImg = currentSlide.desktopImageUrl || currentSlide.imageUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';
  const mobileImg = currentSlide.mobileImageUrl || desktopImg;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'red':
        return 'bg-[#DC2626] text-white border-[#EF4444] shadow-[#DC2626]/30';
      case 'green':
        return 'bg-[#16A34A] text-white border-[#22C55E] shadow-[#16A34A]/30';
      case 'blue':
        return 'bg-[#2563EB] text-white border-[#3B82F6] shadow-[#2563EB]/30';
      case 'purple':
        return 'bg-[#9333EA] text-white border-[#A855F7] shadow-[#9333EA]/30';
      case 'gold':
      default:
        return 'bg-[#F5C542] text-[#080808] border-[#FFD95A] shadow-[#F5C542]/30';
    }
  };

  // Determine container styling if previewing as mobile or desktop
  const isForcedMobile = previewMode === 'mobile';
  const isForcedDesktop = previewMode === 'desktop';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#262626] bg-[#0E0E0E] shadow-2xl group transition-all mx-auto ${
        isForcedMobile ? 'max-w-[500px]' : 'max-w-full'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Container - Responsive Aspect Ratio */}
      <div className={`relative flex items-center overflow-hidden ${
        isForcedMobile 
          ? 'min-h-[260px]' 
          : 'min-h-[220px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[300px]'
      }`}>
        {/* Background Image with Dark Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 z-0">
          {isForcedMobile ? (
            <img
              key={currentSlide.id + '-mob-forced'}
              src={mobileImg}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = desktopImg;
              }}
            />
          ) : isForcedDesktop ? (
            <img
              key={currentSlide.id + '-desk-forced'}
              src={desktopImg}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
            />
          ) : (
            <picture className="w-full h-full">
              {currentSlide.mobileImageUrl && (
                <source
                  media="(max-width: 768px)"
                  srcSet={currentSlide.mobileImageUrl}
                />
              )}
              <img
                key={currentSlide.id + '-img'}
                src={desktopImg}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </picture>
          )}

          {/* Multi-stage dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between max-w-3xl">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Badge & Sponsor Pill */}
            <div className="flex flex-wrap items-center gap-2">
              {currentSlide.badgeText && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border shadow-md ${getBadgeStyle(
                    currentSlide.badgeColor
                  )}`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{currentSlide.badgeText}</span>
                </span>
              )}

              <span className="text-[10px] text-[#A1A1A1] uppercase tracking-widest font-bold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                Destaque Patrocinado
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
              {currentSlide.title}
            </h2>

            {/* Persuasive Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#D4D4D4] line-clamp-2 max-w-2xl leading-relaxed drop-shadow">
              {currentSlide.description}
            </p>
          </div>

          {/* CTA Button & Affiliate Link */}
          <div className="pt-3.5 sm:pt-6 flex flex-wrap items-center gap-3">
            <a
              href={currentSlide.affiliateUrl || '#'}
              target={currentSlide.targetBlank !== false ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-5 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-[#F5C542]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentSlide.ctaText || 'Acessar Oferta'}</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            {onManageClick && (
              <button
                type="button"
                onClick={onManageClick}
                className="text-[11px] text-[#A1A1A1] hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                Gerenciar Banners
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls (Arrows) */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#F5C542]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
          <span className="text-[10px] text-[#A1A1A1] font-mono ml-1">
            {currentIndex + 1}/{activeBanners.length}
          </span>
        </div>
      )}

      {/* Pause Indicator on Hover */}
      {isPaused && activeBanners.length > 1 && (
        <div className="absolute top-3 right-4 z-20 flex items-center gap-1 text-[10px] text-[#A1A1A1] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
          <Pause className="w-2.5 h-2.5" />
          <span>Pausado</span>
        </div>
      )}
    </div>
  );
};
