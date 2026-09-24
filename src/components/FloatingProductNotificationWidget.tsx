import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ExternalLink } from 'lucide-react';
import { ProductNotification, AppSettings } from '../types';
import { subscribeToProductNotifications, fetchProductNotifications } from '../services/productNotificationService';

interface FloatingProductNotificationWidgetProps {
  settings?: AppSettings;
}

export const FloatingProductNotificationWidget: React.FC<FloatingProductNotificationWidgetProps> = ({
  settings
}) => {
  const [products, setProducts] = useState<ProductNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const productsRef = useRef<ProductNotification[]>([]);
  const currentIndexRef = useRef<number>(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync refs
  productsRef.current = products;
  currentIndexRef.current = currentIndex;

  useEffect(() => {
    let isMounted = true;

    const applyProducts = (items: ProductNotification[]) => {
      if (!isMounted) return;
      const active = (items || [])
        .filter(p => p && p.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setProducts(prev => {
        try {
          if (JSON.stringify(prev) === JSON.stringify(active)) {
            return prev;
          }
        } catch (e) {}
        return active;
      });
    };

    fetchProductNotifications().then(applyProducts);
    const unsubscribe = subscribeToProductNotifications(applyProducts);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const triggerDisplay = (customIndex?: number) => {
    const list = productsRef.current;
    if (!list || list.length === 0) return;

    if (typeof customIndex === 'number' && list[customIndex]) {
      setCurrentIndex(customIndex);
    }

    setIsVisible(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      // Advance to next product for the next round
      setCurrentIndex(prev => (prev + 1) % list.length);
    }, 7000);
  };

  // Main notification cycle:
  // Shows immediately (1.5s after load), stays for 7s, then waits interval (default 15-20s) and repeats
  useEffect(() => {
    if (products.length === 0) {
      setIsVisible(false);
      return;
    }

    // Trigger right away (1.5s)
    const initialTimer = setTimeout(() => {
      triggerDisplay();
    }, 1500);

    // Fast rotation so the user sees notifications continuously
    const intervalSeconds = (settings?.productNotificationIntervalMinutes && settings.productNotificationIntervalMinutes < 1)
      ? 15
      : (settings?.productNotificationIntervalMinutes ? Math.min(settings.productNotificationIntervalMinutes * 60, 45) : 18);
    const intervalMs = Math.max(intervalSeconds * 1000, 12000);

    const recurringTimer = setInterval(() => {
      triggerDisplay();
    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [products.length, settings?.productNotificationIntervalMinutes]);

  // Listener for manual test trigger from Admin
  useEffect(() => {
    const handleTestTrigger = (e: any) => {
      const customIndex = e.detail?.index;
      triggerDisplay(customIndex);
    };

    window.addEventListener('trigger_product_notification_test', handleTestTrigger);
    return () => {
      window.removeEventListener('trigger_product_notification_test', handleTestTrigger);
    };
  }, []);

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex % products.length];
  if (!currentProduct) return null;

  const handleProductClick = () => {
    if (currentProduct.url) {
      window.open(currentProduct.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  return (
    <div
      style={{ zIndex: 999999 }}
      className={`fixed bottom-5 left-5 max-w-[340px] sm:max-w-[380px] w-[calc(100vw-24px)] pointer-events-auto transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={handleProductClick}
        className="bg-[#121214]/98 border border-[#F5C542]/50 hover:border-[#F5C542] rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden group cursor-pointer transition-all duration-300 ring-1 ring-[#F5C542]/20"
      >
        {/* Glowing amber accent background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/15 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

        {/* Header: Badge, Product sequence number & Close button */}
        <div className="flex items-center justify-between mb-2.5 relative z-10">
          <div className="flex items-center gap-1.5 text-[#F5C542] text-[11px] font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Produto em destaque</span>
            <span className="px-2 py-0.5 rounded bg-[#27272a] text-[#F5C542] text-[10px] font-mono font-bold ml-1">
              #{currentProduct.order || (currentIndex + 1)}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Fechar notificação"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="flex items-center gap-3.5 relative z-10">
          {currentProduct.imageUrl ? (
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="w-14 h-14 rounded-xl object-cover border border-[#27272a] shrink-0 bg-[#18181b]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-[#1e1e24] border border-[#27272a] shrink-0 flex items-center justify-center text-gray-500">
              <Sparkles className="w-6 h-6 text-[#F5C542]" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight mb-2 group-hover:text-[#F5C542] transition-colors">
              {currentProduct.name}
            </h4>

            <div className="py-1 px-3 rounded-lg bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-[11px] font-extrabold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <span>{currentProduct.ctaText || 'Ver produto'}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
