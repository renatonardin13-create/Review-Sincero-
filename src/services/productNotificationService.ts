import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { ProductNotification, AuthUser, ADMIN_EMAIL } from '../types';

const COLLECTION_NAME = 'product_notifications';

export const DEFAULT_PRODUCT_NOTIFICATIONS: ProductNotification[] = [
  {
    id: 'pn-default-1',
    name: 'adaptador starlink',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80',
    url: 'https://meli.la/2p9BAh4',
    ctaText: 'Ver produto',
    active: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'pn-default-2',
    name: 'Cadeira De Escritório Gamer Nitro Ergonômica Estofado Couro Sintético',
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=300&q=80',
    url: 'https://meli.la/2RzCZhJ',
    ctaText: 'Ver produto',
    active: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'pn-default-3',
    name: 'Creatina 100% Pura Integralmedica 300g',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    url: 'https://meli.la/2JzLEbn',
    ctaText: 'Ver produto',
    active: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: ADMIN_EMAIL
  }
];

export function normalizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  trimmed = trimmed.replace(/\/+$/, '');
  return trimmed.toLowerCase();
}

export function validateProductUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, error: 'A URL é obrigatória.' };
  }
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'A URL deve utilizar o protocolo http:// ou https://.' };
    }
    if (!parsed.hostname) {
      return { valid: false, error: 'URL inválida.' };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'URL inválida ou malformada (deve iniciar com http:// ou https://).' };
  }
}

export async function fetchProductNotifications(): Promise<ProductNotification[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const items: ProductNotification[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || '',
        imageUrl: data.imageUrl || '',
        url: data.url || '',
        ctaText: data.ctaText || 'Ver produto',
        active: data.active !== false,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        createdBy: data.createdBy || ADMIN_EMAIL
      });
    });
    if (items.length === 0) {
      try {
        const cached = localStorage.getItem('review_sincero_product_notifications');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {}
      return DEFAULT_PRODUCT_NOTIFICATIONS;
    }
    try {
      localStorage.setItem('review_sincero_product_notifications', JSON.stringify(items));
    } catch (e) {}
    return items;
  } catch (e) {
    console.warn('[ProductNotificationService] Error fetching product notifications:', e);
    try {
      const cached = localStorage.getItem('review_sincero_product_notifications');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {}
    return DEFAULT_PRODUCT_NOTIFICATIONS;
  }
}

export function subscribeToProductNotifications(callback: (notifications: ProductNotification[]) => void): () => void {
  // 1. Initial immediate local cache response
  try {
    const cached = localStorage.getItem('review_sincero_product_notifications');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        callback(parsed);
      } else {
        callback(DEFAULT_PRODUCT_NOTIFICATIONS);
      }
    } else {
      callback(DEFAULT_PRODUCT_NOTIFICATIONS);
    }
  } catch (e) {
    callback(DEFAULT_PRODUCT_NOTIFICATIONS);
  }

  // 2. Local custom event listener
  const handleLocalUpdate = () => {
    fetchProductNotifications().then(callback);
  };
  window.addEventListener('product_notifications_updated', handleLocalUpdate);

  // 3. Firestore snapshot subscription
  let unsubscribeFirestore = () => {};
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const items: ProductNotification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          imageUrl: data.imageUrl || '',
          url: data.url || '',
          ctaText: data.ctaText || 'Ver produto',
          active: data.active !== false,
          order: typeof data.order === 'number' ? data.order : 0,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          createdBy: data.createdBy || ADMIN_EMAIL
        });
      });
      try {
        localStorage.setItem('review_sincero_product_notifications', JSON.stringify(items));
      } catch (e) {}
      callback(items);
    }, (error) => {
      console.warn('[ProductNotificationService] Snapshot error:', error);
      fetchProductNotifications().then(callback);
    });
  } catch (e) {
    console.warn('[ProductNotificationService] Could not setup onSnapshot:', e);
    fetchProductNotifications().then(callback);
  }

  return () => {
    unsubscribeFirestore();
    window.removeEventListener('product_notifications_updated', handleLocalUpdate);
  };
}

export async function saveProductNotification(
  item: Partial<ProductNotification>,
  currentUser: AuthUser | null,
  existingList: ProductNotification[]
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador pode gerenciar notificações de produtos.' };
  }

  if (!item.name || !item.name.trim()) {
    return { success: false, error: 'O nome do produto é obrigatório.' };
  }

  const imgValidation = validateProductUrl(item.imageUrl || '');
  if (!imgValidation.valid) {
    return { success: false, error: 'A foto do produto (URL da imagem) é obrigatória e deve iniciar com http:// ou https://.' };
  }

  const urlValidation = validateProductUrl(item.url || '');
  if (!urlValidation.valid) {
    return { success: false, error: urlValidation.error };
  }

  const normUrl = normalizeUrl(item.url!);
  const duplicate = existingList.find(p => p.id !== item.id && normalizeUrl(p.url) === normUrl);
  if (duplicate) {
    return { success: false, error: `Já existe um produto cadastrado com esta mesma URL (${duplicate.name}).` };
  }

  const ctaText = item.ctaText && item.ctaText.trim() ? item.ctaText.trim() : 'Ver produto';
  const now = new Date().toISOString();

  try {
    if (item.id) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await updateDoc(docRef, {
        name: item.name.trim(),
        imageUrl: item.imageUrl!.trim(),
        url: item.url!.trim(),
        ctaText,
        active: item.active !== false,
        order: typeof item.order === 'number' ? item.order : 0,
        updatedAt: now
      });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), {
        name: item.name.trim(),
        imageUrl: item.imageUrl!.trim(),
        url: item.url!.trim(),
        ctaText,
        active: item.active !== false,
        order: typeof item.order === 'number' ? item.order : (existingList.length + 1),
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser?.email || ADMIN_EMAIL
      });
    }
    window.dispatchEvent(new CustomEvent('product_notifications_updated'));
    return { success: true };
  } catch (e: any) {
    console.warn('[ProductNotificationService] Firestore error, falling back to local persistence:', e);
    
    // Resilient local storage fallback
    try {
      let updatedList: ProductNotification[] = [...existingList];
      if (item.id) {
        updatedList = updatedList.map(p => p.id === item.id ? {
          ...p,
          name: item.name!.trim(),
          imageUrl: item.imageUrl!.trim(),
          url: item.url!.trim(),
          ctaText,
          active: item.active !== false,
          order: typeof item.order === 'number' ? item.order : p.order,
          updatedAt: now
        } : p);
      } else {
        const newItem: ProductNotification = {
          id: 'pn-local-' + Date.now(),
          name: item.name!.trim(),
          imageUrl: item.imageUrl!.trim(),
          url: item.url!.trim(),
          ctaText,
          active: item.active !== false,
          order: typeof item.order === 'number' ? item.order : (existingList.length + 1),
          createdAt: now,
          updatedAt: now,
          createdBy: currentUser?.email || ADMIN_EMAIL
        };
        updatedList.unshift(newItem);
      }
      localStorage.setItem('review_sincero_product_notifications', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('product_notifications_updated'));
      return { success: true };
    } catch (localErr) {
      return { success: false, error: 'Erro ao salvar o produto.' };
    }
  }
}

export async function deleteProductNotification(
  id: string,
  currentUser: AuthUser | null,
  existingList: ProductNotification[] = []
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador pode excluir notificações.' };
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    window.dispatchEvent(new CustomEvent('product_notifications_updated'));
    return { success: true };
  } catch (e: any) {
    console.warn('[ProductNotificationService] Error deleting in Firestore, updating local storage fallback:', e);
    try {
      const updatedList = existingList.filter(p => p.id !== id);
      localStorage.setItem('review_sincero_product_notifications', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('product_notifications_updated'));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Erro ao excluir produto.' };
    }
  }
}
