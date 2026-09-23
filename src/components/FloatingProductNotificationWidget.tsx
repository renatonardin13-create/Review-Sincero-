import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to real-time product notifications
  useEffect(() => {
    let isMounted = true;

    fetchProductNotifications().then((items) => {
      if (isMounted) {
        const active = items.filter(p => p.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
        setProducts(active);
      }
    });

    const unsubscribe = subscribeToProductNotifications((items) => {
      if (isMounted) {
        const active = items.filter(p => p.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
        setProducts(active);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Interval in milliseconds based on settings (default 2 minutes if not set, minimum 15 seconds)
  const intervalMs = settings?.productNotificationIntervalMinutes 
    ? Math.max(settings.productNotificationIntervalMinutes * 60 * 1000, 15000)
    : 120000; // 2 minutes default

  const showNextProduct = () => {
    if (document.hidden) return; // Do not display if user switched tabs
    setProducts(currentProducts => {
      if (currentProducts.length === 0) return currentProducts;
      
      setIsVisible(true);

      // Auto hide after 8 seconds
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      // Advance index for next time
      setCurrentIndex(prev => (prev + 1) % currentProducts.length);
      return currentProducts;
    });
  };

  // Initial trigger & recurring interval loop
  useEffect(() => {
    if (products.length === 0) {
      setIsVisible(false);
      return;
    }

    // Initial popup after 2.5 seconds
    const initialTimer = setTimeout(() => {
      showNextProduct();
    }, 2500);

    // Recurring interval
    const intervalTimer = setInterval(() => {
      showNextProduct();
    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    };
  }, [products.length, intervalMs]);

  // Listener for manual test trigger from Admin
  useEffect(() => {
    const handleTestTrigger = (e: any) => {
      const customIndex = e.detail?.index;
      if (typeof customIndex === 'number' && products[customIndex]) {
        setCurrentIndex(customIndex);
      }
      setIsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    window.addEventListener('trigger_product_notification_test', handleTestTrigger);
    return () => {
      window.removeEventListener('trigger_product_notification_test', handleTestTrigger);
    };
  }, [products]);

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
    <div className="fixed bottom-5 left-5 z-[99999] pointer-events-none max-w-[340px] sm:max-w-[360px] w-[calc(100vw-24px)]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto bg-[#121214]/95 border border-[#27272a] hover:border-[#F5C542]/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl relative overflow-hidden group cursor-pointer transition-all duration-300"
            onClick={handleProductClick}
          >
            {/* Glowing amber accent background */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5C542]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

            {/* Header: Badge & Close Button */}
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-1.5 text-[#F5C542] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span>Produto em destaque</span>
                <span className="px-1.5 py-0.2 rounded bg-[#27272a] text-[#F5C542] text-[10px] font-mono ml-1">
                  #{currentProduct.order || (currentIndex + 1)}
                </span>
              </div>

              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
                title="Fechar notificação"
                aria-label="Fechar notificação"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Product Body */}
            <div className="flex items-center gap-3 relative z-10">
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
                <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight mb-1.5 group-hover:text-[#F5C542] transition-colors">
                  {currentProduct.name}
                </h4>

                <div className="py-1 px-3 rounded-lg bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-[11px] font-extrabold text-center transition-all flex items-center justify-center gap-1 shadow-sm">
                  <span>{currentProduct.ctaText || 'Ver produto'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
