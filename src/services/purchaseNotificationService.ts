import { ReviewNotificationConfig, PurchaseEvent, Review } from '../types';
import { DEFAULT_NOTIFICATION_CONFIG } from '../data/initialData';
import { getPublicSafePurchaseEvents } from './purchaseEventService';
import { fetchProductNotifications } from './productNotificationService';

export function getEffectiveNotificationConfig(review?: Review | null): ReviewNotificationConfig {
  if (!review || !review.notificationConfig) {
    return DEFAULT_NOTIFICATION_CONFIG;
  }
  return {
    ...DEFAULT_NOTIFICATION_CONFIG,
    ...review.notificationConfig
  };
}

export function formatTimeAgo(isoString: string): string {
  try {
    const past = new Date(isoString).getTime();
    const now = Date.now();
    const diffMin = Math.floor((now - past) / (1000 * 60));

    if (diffMin < 1) return 'há poucos segundos';
    if (diffMin === 1) return 'há 1 minuto';
    if (diffMin < 60) return `há ${diffMin} minutos`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours === 1) return 'há 1 hora';
    if (diffHours < 24) return `há ${diffHours} horas`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'há 1 dia';
    return `há ${diffDays} dias`;
  } catch (err) {
    return 'recentemente';
  }
}

export async function resolveNotificationItem(
  review: Review,
  config: ReviewNotificationConfig
): Promise<{
  title: string;
  badgeLabel: string;
  badgeColor: string;
  productName: string;
  productImage: string;
  timeAgoText: string;
  subtitleText: string;
  isConfirmedPurchase: boolean;
  ctaUrl?: string;
} | null> {
  if (!config.enabled) return null;

  // 1. Tenta buscar produto ativo cadastrado em "Notificações de Produtos" pelo ADM
  try {
    const adminProducts = await fetchProductNotifications();
    const activeAdminProducts = adminProducts.filter(p => p.active !== false);
    if (activeAdminProducts.length > 0) {
      // Sorteia um produto ativo cadastrado no Admin
      const selected = activeAdminProducts[Math.floor(Math.random() * activeAdminProducts.length)];
      return {
        title: '● Produto em Destaque',
        badgeLabel: 'DESTAQUE PLATAFORMA',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        productName: selected.name,
        productImage: selected.imageUrl,
        timeAgoText: 'Recomendação em destaque',
        subtitleText: selected.ctaText || 'Ver oferta especial',
        isConfirmedPurchase: false,
        ctaUrl: selected.url
      };
    }
  } catch (err) {
    console.warn('[purchaseNotificationService] Erro ao carregar produtos do admin:', err);
  }

  // 2. Se o modo for 'purchase_confirmed', verifica eventos de compras reais
  if (config.mode === 'purchase_confirmed') {
    const events = await getPublicSafePurchaseEvents(review.id, undefined, 5);
    if (events.length > 0) {
      const latest = events[Math.floor(Math.random() * events.length)];
      const buyerName = latest.customerFirstName ? `${latest.customerFirstName}` : 'Uma pessoa';
      return {
        title: '● Compra confirmada',
        badgeLabel: 'COMPRA CONFIRMADA',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        productName: latest.productName || review.productName,
        productImage: latest.productImage || review.mainImage,
        timeAgoText: formatTimeAgo(latest.createdAt || new Date().toISOString()),
        subtitleText: `${buyerName} adquiriu este produto`,
        isConfirmedPurchase: true
      };
    }
  }

  // 3. Modo Demonstração
  if (config.mode === 'demo') {
    return {
      title: '● Modo Demonstração',
      badgeLabel: 'DEMONSTRAÇÃO',
      badgeColor: 'text-[#F5C542] bg-[#F5C542]/10 border-[#F5C542]/20',
      productName: review.productName,
      productImage: review.mainImage,
      timeAgoText: 'há poucos minutos',
      subtitleText: 'Visualização de teste em demonstração',
      isConfirmedPurchase: false
    };
  }

  // 4. Promoção padrão do produto da review
  return {
    title: '● Destaque do Produto',
    badgeLabel: 'PROMOÇÃO',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    productName: review.productName,
    productImage: review.mainImage,
    timeAgoText: 'Oferta em destaque no review',
    subtitleText: `Preço especial: R$ ${review.currentPrice}`,
    isConfirmedPurchase: false
  };
}
