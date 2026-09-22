import { PurchaseEvent } from '../types';

const LOCAL_STORAGE_PURCHASE_EVENTS_KEY = 'review_sincero_purchase_events';

// Initial sample confirmed purchase events for demonstration/local testing
const SAMPLE_PURCHASE_EVENTS: PurchaseEvent[] = [
  {
    id: 'pe-101',
    productId: 'prod-01',
    reviewId: 'rev-001',
    productName: 'Fone Bluetooth Pro Wireless ANC X9',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
    amount: 189.90,
    currency: 'BRL',
    source: 'Checkout Afiliado',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    customerFirstName: 'Mariana'
  },
  {
    id: 'pe-102',
    productId: 'prod-01',
    reviewId: 'rev-001',
    productName: 'Fone Bluetooth Pro Wireless ANC X9',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
    amount: 189.90,
    currency: 'BRL',
    source: 'Checkout Afiliado',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    customerFirstName: 'Rodrigo'
  },
  {
    id: 'pe-103',
    productId: 'prod-02',
    reviewId: 'rev-002',
    productName: 'Air Fryer Digital 4L Inox Touch',
    productImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=80',
    amount: 349.90,
    currency: 'BRL',
    source: 'Mercado Livre Integrador',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    customerFirstName: 'Beatriz'
  }
];

export function getStoredPurchaseEvents(): PurchaseEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PURCHASE_EVENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar eventos de compra do localStorage', err);
  }
  // Initialize with sample events if empty
  savePurchaseEventsToStorage(SAMPLE_PURCHASE_EVENTS);
  return SAMPLE_PURCHASE_EVENTS;
}

export function savePurchaseEventsToStorage(events: PurchaseEvent[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PURCHASE_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Erro ao salvar eventos de compra no localStorage', err);
  }
}

export async function fetchPurchaseEvents(reviewId?: string, productId?: string): Promise<PurchaseEvent[]> {
  const all = getStoredPurchaseEvents();
  return all.filter(event => {
    if (event.status !== 'confirmed') return false;
    if (reviewId && event.reviewId && event.reviewId !== reviewId) return false;
    if (productId && event.productId && event.productId !== productId) return false;
    return true;
  });
}

export async function addPurchaseEvent(payload: Omit<PurchaseEvent, 'id' | 'createdAt'>): Promise<PurchaseEvent> {
  const all = getStoredPurchaseEvents();
  const newEvent: PurchaseEvent = {
    ...payload,
    id: 'pe-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };
  const updated = [newEvent, ...all];
  savePurchaseEventsToStorage(updated);
  return newEvent;
}

export async function getPublicSafePurchaseEvents(
  reviewId?: string,
  productId?: string,
  limit: number = 5
): Promise<Array<Partial<PurchaseEvent>>> {
  // 1. Tenta consultar o endpoint público da API no servidor se disponível
  try {
    const params = new URLSearchParams();
    if (reviewId) params.append('reviewId', reviewId);
    if (productId) params.append('productId', productId);
    params.append('limit', String(limit));

    const res = await fetch(`/api/public/purchase-notifications?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.ok && Array.isArray(json.events) && json.events.length > 0) {
        return json.events;
      }
    }
  } catch (err) {
    // Fallback silencioso para localStorage em ambientes offline / estáticos
  }

  // 2. Fallback para dados em localStorage local
  const events = await fetchPurchaseEvents(reviewId, productId);
  return events.slice(0, limit).map(event => ({
    id: event.id,
    productName: event.productName,
    productImage: event.productImage,
    createdAt: event.createdAt,
    status: 'confirmed',
    customerFirstName: event.customerFirstName ? event.customerFirstName.split(' ')[0] : undefined
  }));
}
