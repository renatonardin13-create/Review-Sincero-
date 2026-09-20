import React, { useState, useEffect } from 'react';
import { Bell, ExternalLink, X, Sparkles } from 'lucide-react';
import { ProductNotification } from '../types';
import { subscribeToProductNotifications } from '../services/productNotificationService';

interface ProductNotificationWidgetProps {
  intervalMinutes?: number;
}

export const ProductNotificationWidget: React.FC<ProductNotificationWidgetProps> = ({
  intervalMinutes = 5
}) => {
  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dismissedCurrent, setDismissedCurrent] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToProductNotifications((items) => {
      const activeItems = items.filter(i => i.active).sort((a, b) => a.order - b.order);
      setNotifications(activeItems);
    });
    return () => unsubscribe();
  }, []);

  // Timer for rotation
  useEffect(() => {
    if (notifications.length === 0) {
      setIsVisible(false);
      return;
    }

    const intervalMs = (intervalMinutes && intervalMinutes > 0 ? intervalMinutes : 5) * 60 * 1000;

    // Show first notification after a short initial delay (e.g. 10 seconds), then every interval
    const initialTimer = setTimeout(() => {
      if (notifications.length > 0 && !dismissedCurrent) {
        setIsVisible(true);
      }
    }, 10000);

    const timer = setInterval(() => {
      setDismissedCurrent(false);
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setIsVisible(true);
    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [notifications, intervalMinutes]);

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const currentProduct = notifications[currentIndex % notifications.length];
  if (!currentProduct) return null;

  const handleOpenProduct = () => {
    if (currentProduct.url) {
      window.open(currentProduct.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissedCurrent(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 md:mx-0 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-opacity-95">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/20 flex items-center justify-center text-[#F5C542] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#F5C542] uppercase tracking-wider block">🛍️ Produto em destaque</span>
              <h4 className="font-extrabold text-white text-sm line-clamp-1">{currentProduct.name}</h4>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 mt-2 mb-3 relative z-10">
          Confira este produto recomendado especialmente para você.
        </p>

        <div className="flex items-center justify-end gap-2 relative z-10">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Dispensar
          </button>
          <button
            onClick={handleOpenProduct}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-xs font-bold transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
          >
            <span>Ver produto</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
