import { Review } from '../types';

export function generatePurchaseNotificationRuntimeScript(review: Review): string {
  const config = review.notificationConfig || {
    enabled: true,
    mode: 'product_promotion',
    position: 'bottom-left',
    durationMs: 7000,
    intervalMs: 30000,
    maxPerSession: 3,
    showImage: true,
    showTimeAgo: true,
    showProductName: true,
    onlyConfirmedPurchases: true
  };

  if (!config.enabled) return '';

  return `
  <script>
    (function() {
      var config = ${JSON.stringify(config)};
      var reviewData = {
        productName: ${JSON.stringify(review.productName || '')},
        mainImage: ${JSON.stringify(review.mainImage || '')},
        currentPrice: ${JSON.stringify(review.currentPrice || '')},
        affiliateUrl: ${JSON.stringify(review.affiliateUrl || '')}
      };

      var sessionCount = 0;

      function renderNotification() {
        if (sessionCount >= config.maxPerSession) return;
        if (document.hidden) return;

        var existing = document.getElementById('rc-purchase-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.id = 'rc-purchase-toast';
        toast.style.position = 'fixed';
        toast.style.zIndex = '99999';
        toast.style.maxWidth = '360px';
        toast.style.width = 'calc(100vw - 24px)';
        toast.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        toast.style.transition = 'all 0.3s ease';

        if (config.position === 'bottom-center') {
          toast.style.bottom = '16px';
          toast.style.left = '50%';
          toast.style.transform = 'translateX(-50%)';
        } else if (config.position === 'bottom-right') {
          toast.style.bottom = '16px';
          toast.style.right = '16px';
        } else {
          toast.style.bottom = '16px';
          toast.style.left = '16px';
        }

        var isConfirmed = config.mode === 'purchase_confirmed';
        var badgeText = isConfirmed ? 'COMPRA CONFIRMADA' : (config.mode === 'demo' ? 'DEMONSTRAÇÃO' : 'PROMOÇÃO');
        var badgeColor = isConfirmed ? '#10B981' : (config.mode === 'demo' ? '#F5C542' : '#38BDF8');

        var imgHtml = (config.showImage && reviewData.mainImage) 
          ? '<img src="' + reviewData.mainImage + '" style="width: 52px; height: 52px; border-radius: 10px; object-fit: cover; border: 1px solid #27272a; flex-shrink: 0;" />' 
          : '';

        var subtitleText = isConfirmed 
          ? 'Uma compra foi confirmada recentemente' 
          : (config.mode === 'demo' ? 'Visualização em modo de teste' : 'Preço especial: R$ ' + reviewData.currentPrice);

        toast.innerHTML = 
          '<div style="background: rgba(18, 18, 20, 0.96); border: 1px solid #27272a; border-radius: 16px; padding: 12px 14px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); backdrop-filter: blur(12px); color: #ffffff; display: flex; flex-direction: column; gap: 8px;">' +
            '<div style="display: flex; align-items: center; justify-content: space-between;">' +
              '<span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ' + badgeColor + '; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 999px;">● ' + badgeText + '</span>' +
              '<button id="rc-toast-close" style="background: transparent; border: none; color: #888; font-size: 16px; cursor: pointer; padding: 0 4px;">✕</button>' +
            '</div>' +
            '<div id="rc-toast-cta" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">' +
              imgHtml +
              '<div style="flex: 1; min-width: 0;">' +
                (config.showProductName ? '<div style="font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #ffffff;">' + reviewData.productName + '</div>' : '') +
                '<div style="font-size: 11px; color: #a1a1a1; font-weight: 500;">' + subtitleText + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';

        document.body.appendChild(toast);
        sessionCount++;

        document.getElementById('rc-toast-close').onclick = function(e) {
          e.stopPropagation();
          toast.remove();
        };

        document.getElementById('rc-toast-cta').onclick = function() {
          if (reviewData.affiliateUrl) {
            window.open(reviewData.affiliateUrl, '_blank');
          }
        };

        setTimeout(function() {
          if (toast && toast.parentNode) {
            toast.remove();
          }
        }, config.durationMs || 7000);
      }

      setTimeout(renderNotification, 3000);
      setInterval(renderNotification, Math.max(config.intervalMs || 30000, 5000));
    })();
  </script>
  `;
}
