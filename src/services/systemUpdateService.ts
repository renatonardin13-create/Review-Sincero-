import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { SystemUpdate, AuthUser, ADMIN_EMAIL } from '../types';

const COLLECTION_NAME = 'system_updates';

export async function fetchSystemUpdates(): Promise<SystemUpdate[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items: SystemUpdate[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        message: data.message || '',
        imageUrl: data.imageUrl || '',
        ctaText: data.ctaText || 'Saiba mais',
        ctaUrl: data.ctaUrl || '',
        version: data.version || 'v1.0',
        published: data.published === true,
        createdAt: data.createdAt || new Date().toISOString(),
        publishedAt: data.publishedAt || '',
        createdBy: data.createdBy || ADMIN_EMAIL
      });
    });
    return items;
  } catch (e) {
    console.warn('[systemUpdateService] Error fetching system updates:', e);
    return [];
  }
}

export function subscribeToSystemUpdates(callback: (updates: SystemUpdate[]) => void): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: SystemUpdate[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          message: data.message || '',
          imageUrl: data.imageUrl || '',
          ctaText: data.ctaText || 'Saiba mais',
          ctaUrl: data.ctaUrl || '',
          version: data.version || 'v1.0',
          published: data.published === true,
          createdAt: data.createdAt || new Date().toISOString(),
          publishedAt: data.publishedAt || '',
          createdBy: data.createdBy || ADMIN_EMAIL
        });
      });
      callback(items);
    }, (error) => {
      console.warn('[systemUpdateService] Snapshot error:', error);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[systemUpdateService] Could not setup onSnapshot:', e);
    return () => {};
  }
}

export const subscribeSystemUpdates = subscribeToSystemUpdates;

export async function saveSystemUpdate(
  item: Partial<SystemUpdate>,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador pode gerenciar atualizações do sistema.' };
  }

  if (!item.title || !item.title.trim()) {
    return { success: false, error: 'O título da atualização é obrigatório.' };
  }

  const now = new Date().toISOString();

  try {
    if (item.id) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await updateDoc(docRef, {
        title: item.title.trim(),
        message: item.message?.trim() || '',
        imageUrl: item.imageUrl?.trim() || '',
        ctaText: item.ctaText?.trim() || 'Saiba mais',
        ctaUrl: item.ctaUrl?.trim() || '',
        version: item.version?.trim() || 'v1.0',
        published: item.published === true,
        publishedAt: item.published ? (item.publishedAt || now) : '',
        updatedAt: now
      });
    } else {
      await addDoc(collection(db, COLLECTION_NAME), {
        title: item.title.trim(),
        message: item.message?.trim() || '',
        imageUrl: item.imageUrl?.trim() || '',
        ctaText: item.ctaText?.trim() || 'Saiba mais',
        ctaUrl: item.ctaUrl?.trim() || '',
        version: item.version?.trim() || 'v1.0',
        published: item.published === true,
        createdAt: now,
        publishedAt: item.published ? now : '',
        createdBy: currentUser?.email || ADMIN_EMAIL
      });
    }
    return { success: true };
  } catch (e: any) {
    console.error('[systemUpdateService] Error saving system update:', e);
    return { success: false, error: e?.message || 'Erro ao salvar atualização no Firestore.' };
  }
}

export async function deleteSystemUpdate(
  id: string,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado.' };
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (e: any) {
    console.error('[systemUpdateService] Error deleting system update:', e);
    return { success: false, error: e?.message || 'Erro ao excluir atualização.' };
  }
}

export function subscribeToNotificationReads(
  uid: string,
  callback: (reads: Record<string, string>) => void
): () => void {
  if (!uid) return () => {};
  try {
    const readsColRef = collection(db, 'users', uid, 'notificationReads');
    const unsubscribe = onSnapshot(readsColRef, (snapshot) => {
      const readMap: Record<string, string> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        readMap[docSnap.id] = data.readAt || new Date().toISOString();
      });
      callback(readMap);
    }, (error) => {
      console.warn('[systemUpdateService] notificationReads snapshot error:', error);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[systemUpdateService] Could not setup notificationReads subscription:', e);
    return () => {};
  }
}

export async function markUpdateAsRead(uid: string, updateId: string): Promise<void> {
  if (!uid || !updateId) return;
  try {
    const docRef = doc(db, 'users', uid, 'notificationReads', updateId);
    await setDoc(docRef, {
      readAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('[systemUpdateService] Error marking update as read:', e);
  }
}
