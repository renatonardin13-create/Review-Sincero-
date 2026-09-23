import React from 'react';
import { X, ShoppingBag, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { ReviewNotificationConfig } from '../types';

export interface NotificationVisualData {
  title: string;
  badgeLabel: string;
  badgeColor: string;
  productName: string;
  productImage: string;
  timeAgoText: string;
  subtitleText: string;
  isConfirmedPurchase: boolean;
  ctaUrl?: string;
}

interface PurchaseNotificationProps {
  data: NotificationVisualData;
  config: ReviewNotificationConfig;
  onClose?: () => void;
  onClickCta?: () => void;
}

export const PurchaseNotification: React.FC<PurchaseNotificationProps> = ({
  data,
  config,
  onClose,
  onClickCta
}) => {
  const getPositionClass = () => {
    switch (config.position) {
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] md:w-[360px]';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50 w-[calc(100vw-24px)] md:w-[360px]';
      case 'bottom-left':
      default:
        return 'fixed bottom-4 left-4 z-50 w-[calc(100vw-24px)] md:w-[360px]';
    }
  };

  return (
    <div className={`${getPositionClass()} animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto`}>
      <div className="bg-[#121214]/95 border border-[#27272a] rounded-2xl p-3.5 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-[#3f3f46] transition-all">
        {/* Glow ambient background accent */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5C542]/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${data.badgeColor}`}>
            {data.isConfirmedPurchase ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : config.mode === 'demo' ? (
              <Sparkles className="w-3 h-3 text-[#F5C542] shrink-0" />
            ) : (
              <ShoppingBag className="w-3 h-3 text-sky-400 shrink-0" />
            )}
            <span>{data.badgeLabel}</span>
          </div>

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
              aria-label="Fechar notificação"
              title="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Product Details Row */}
        <div
          onClick={onClickCta}
          className={`flex items-center gap-3 relative z-10 ${onClickCta ? 'cursor-pointer hover:opacity-95' : ''}`}
        >
          {config.showImage && data.productImage && (
            <img
              src={data.productImage}
              alt={data.productName}
              className="w-14 h-14 rounded-xl object-cover border border-[#27272a] shrink-0 bg-[#18181b]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}

          <div className="flex-1 min-w-0">
            {config.showProductName && (
              <h4 className="font-bold text-white text-xs line-clamp-1 leading-snug mb-0.5">
                {data.productName}
              </h4>
            )}

            <p className="text-[11px] text-gray-300 font-medium line-clamp-1">
              {data.subtitleText}
            </p>

            {config.showTimeAgo && (
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping shrink-0" />
                <span>{data.timeAgoText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
