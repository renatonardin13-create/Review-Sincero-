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
  Timestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { ProductNotification, AuthUser, ADMIN_EMAIL } from '../types';

const COLLECTION_NAME = 'product_notifications';

export function normalizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  // remove trailing slash
  trimmed = trimmed.replace(/\/+$/, '');
  return trimmed.toLowerCase();
}

export function validateProductUrl(url: string): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: 'A URL do produto é obrigatória.' };
  }
  const lower = url.trim().toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return { valid: false, error: 'URLs do tipo javascript:, data: ou vbscript: são estritamente proibidas por segurança.' };
  }
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    return { valid: false, error: 'A URL deve iniciar obrigatoriamente com http:// ou https://.' };
  }
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname) {
      return { valid: false, error: 'URL inválida.' };
    }
  } catch (e) {
    return { valid: false, error: 'URL inválida ou malformada.' };
  }
  return { valid: true };
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
        url: data.url || '',
        active: data.active !== false,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        createdBy: data.createdBy || ADMIN_EMAIL
      });
    });
    return items;
  } catch (e) {
    console.warn('[ProductNotificationService] Error fetching product notifications:', e);
    // Fallback localStorage cache
    try {
      const cached = localStorage.getItem('review_sincero_product_notifications');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {}
    return [];
  }
}

export function subscribeToProductNotifications(callback: (notifications: ProductNotification[]) => void): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ProductNotification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          url: data.url || '',
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
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[ProductNotificationService] Could not setup onSnapshot:', e);
    return () => {};
  }
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

  const urlValidation = validateProductUrl(item.url || '');
  if (!urlValidation.valid) {
    return { success: false, error: urlValidation.error };
  }

  const normUrl = normalizeUrl(item.url!);
  // Check duplication
  const duplicate = existingList.find(p => p.id !== item.id && normalizeUrl(p.url) === normUrl);
  if (duplicate) {
    return { success: false, error: `Já existe um produto cadastrado com esta mesma URL (${duplicate.name}).` };
  }

  const now = new Date().toISOString();

  try {
    if (item.id) {
      // Update
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await updateDoc(docRef, {
        name: item.name.trim(),
        url: item.url!.trim(),
        active: item.active !== false,
        order: typeof item.order === 'number' ? item.order : 0,
        updatedAt: now
      });
    } else {
      // Create
      await addDoc(collection(db, COLLECTION_NAME), {
        name: item.name.trim(),
        url: item.url!.trim(),
        active: item.active !== false,
        order: typeof item.order === 'number' ? item.order : (existingList.length + 1),
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser?.email || ADMIN_EMAIL
      });
    }
    return { success: true };
  } catch (e: any) {
    console.error('[ProductNotificationService] Error saving product notification:', e);
    return { success: false, error: e?.message || 'Erro ao salvar no Firestore (PERMISSÃO NEGADA ou falha de rede).' };
  }
}

export async function deleteProductNotification(
  id: string,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador pode excluir notificações.' };
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (e: any) {
    console.error('[ProductNotificationService] Error deleting product notification:', e);
    return { success: false, error: e?.message || 'Erro ao excluir no Firestore.' };
  }
}
