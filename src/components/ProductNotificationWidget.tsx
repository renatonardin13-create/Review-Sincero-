import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Sparkles } from 'lucide-react';
import { ProductNotification } from '../types';
import { subscribeToProductNotifications } from '../services/productNotificationService';

interface ProductNotificationWidgetProps {
  intervalMinutes?: number;
  // Optional preview mode for admin modal
  previewItem?: ProductNotification | null;
  onClosePreview?: () => void;
}

export const ProductNotificationWidget: React.FC<ProductNotificationWidgetProps> = ({
  intervalMinutes = 5,
  previewItem,
  onClosePreview
}) => {
  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dismissedCurrent, setDismissedCurrent] = useState<boolean>(false);

  useEffect(() => {
    if (previewItem) {
      setIsVisible(true);
      return;
    }
    const unsubscribe = subscribeToProductNotifications((items) => {
      const activeItems = items.filter(i => i.active).sort((a, b) => a.order - b.order);
      setNotifications(activeItems);
    });
    return () => unsubscribe();
  }, [previewItem]);

  // Timer for rotation if not preview
  useEffect(() => {
    if (previewItem) return;
    if (notifications.length === 0) {
      setIsVisible(false);
      return;
    }

    const intervalMs = (intervalMinutes && intervalMinutes > 0 ? intervalMinutes : 5) * 60 * 1000;

    const initialTimer = setTimeout(() => {
      if (notifications.length > 0 && !dismissedCurrent) {
        setIsVisible(true);
      }
    }, 1000);

    const timer = setInterval(() => {
      setDismissedCurrent(false);
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setIsVisible(true);
    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [notifications, intervalMinutes, dismissedCurrent, previewItem]);

  if (!isVisible && !previewItem) {
    return null;
  }

  const currentProduct = previewItem || notifications[currentIndex % notifications.length];
  if (!currentProduct && !previewItem) return null;
  if (!currentProduct) return null;

  const handleOpenProduct = () => {
    if (currentProduct.url) {
      window.open(currentProduct.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    if (previewItem && onClosePreview) {
      onClosePreview();
      return;
    }
    setIsVisible(false);
    setDismissedCurrent(true);
  };

  const ctaText = currentProduct.ctaText && currentProduct.ctaText.trim() ? currentProduct.ctaText.trim() : 'Ver produto';

  return (
    <div className={previewItem ? "relative w-full" : "fixed bottom-4 right-4 z-50 max-w-[360px] w-full mx-3 md:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-200"}>
      <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-3.5 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-opacity-95">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5C542]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

        {/* Top bar with close */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-1.5 text-[#F5C542] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Produto em destaque</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with Image and Info */}
        <div className="flex items-center gap-3 relative z-10">
          {currentProduct.imageUrl ? (
            <img 
              src={currentProduct.imageUrl} 
              alt={currentProduct.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-[#27272a] shrink-0 bg-[#18181b]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#1e1e24] border border-[#27272a] flex items-center justify-center text-gray-500 shrink-0 text-xs">
              Sem foto
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-2">
              {currentProduct.name || 'Nome do produto'}
            </h4>
            <button
              onClick={handleOpenProduct}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-xs font-bold transition-all shadow-md shadow-[#F5C542]/10 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
