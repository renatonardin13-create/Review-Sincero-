import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Review, ReviewNotificationConfig } from '../types';
import { getEffectiveNotificationConfig } from '../services/purchaseNotificationService';
import { PurchaseNotification } from './PurchaseNotification';

interface PurchaseNotificationPreviewProps {
  review: Review;
  configOverride?: ReviewNotificationConfig;
}

export const PurchaseNotificationPreview: React.FC<PurchaseNotificationPreviewProps> = ({
  review,
  configOverride
}) => {
  const config = configOverride || getEffectiveNotificationConfig(review);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);

  const previewData = {
    title: config.mode === 'purchase_confirmed' 
      ? '● Compra confirmada' 
      : config.mode === 'demo' 
      ? '● Modo Demonstração' 
      : '● Destaque do Produto',
    badgeLabel: config.mode === 'purchase_confirmed' 
      ? 'COMPRA CONFIRMADA' 
      : config.mode === 'demo' 
      ? 'DEMONSTRAÇÃO' 
      : 'PROMOÇÃO',
    badgeColor: config.mode === 'purchase_confirmed'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : config.mode === 'demo'
      ? 'text-[#F5C542] bg-[#F5C542]/10 border-[#F5C542]/20'
      : 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    productName: review.productName || 'Nome do produto',
    productImage: review.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    timeAgoText: 'há 3 minutos',
    subtitleText: config.mode === 'purchase_confirmed' 
      ? 'Mariana adquiriu este produto' 
      : config.mode === 'demo' 
      ? 'Visualização em modo de teste' 
      : `Preço especial: R$ ${review.currentPrice || '189,90'}`,
    isConfirmedPurchase: config.mode === 'purchase_confirmed'
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#F5C542] flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preview da Notificação</span>
        </span>
        <button
          type="button"
          onClick={() => setIsPreviewVisible(prev => !prev)}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 text-[#F5C542]" />
          <span>{isPreviewVisible ? 'Ocultar' : 'Disparar Teste'}</span>
        </button>
      </div>

      {isPreviewVisible && (
        <div className="relative py-2 flex items-center justify-center min-h-[100px]">
          <div className="w-full max-w-sm">
            <PurchaseNotification
              data={previewData}
              config={{
                ...config,
                position: 'bottom-left' // keep inline relative for preview
              }}
              onClose={() => setIsPreviewVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
