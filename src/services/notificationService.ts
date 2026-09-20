import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { SystemNotification, APP_VERSION, ADMIN_EMAIL } from '../types';

const NOTIFICATIONS_COLLECTION = 'system_notifications';
const READ_STORAGE_KEY = 'review_sincero_read_notifications';
const LAST_SEEN_VERSION_KEY = 'review_sincero_last_seen_version';

// Built-in initial notifications in case Firestore is clean or offline
const INITIAL_SYSTEM_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-welcome',
    type: 'general',
    title: '👋 BEM-VINDO AO REVIEW SINCERO',
    message: 'Explore o gerador de PRDs e crie páginas de alta conversão sem precisar programar.',
    targetView: 'dashboard',
    ctaText: 'COMEÇAR AGORA',
    published: true,
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'notif-academy-launch',
    type: 'module',
    title: '📚 NOVO MÓDULO DISPONÍVEL',
    message: 'Um novo conteúdo foi adicionado à Academia: "MÓDULO 03: IA e Construção com PRD".',
    targetView: 'academia',
    ctaText: 'ACESSAR ACADEMIA',
    published: true,
    createdAt: '2026-03-03T14:00:00.000Z'
  },
  {
    id: 'notif-lesson-launch',
    type: 'lesson',
    title: '🎓 NOVA AULA DISPONÍVEL',
    message: 'Aula 02: Criando sua Página em 1 Minuto no Lovable e Google AI Studio.',
    targetView: 'academia',
    ctaText: 'ASSISTIR AULA',
    published: true,
    createdAt: '2026-03-03T15:00:00.000Z'
  }
];

// Helper to get read status map from local storage
export function getLocalReadNotifications(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Alias for getLocalReadNotifications
export const getReadNotificationsMap = getLocalReadNotifications;

// Listen to local read status updates
export function onNotificationReadsChanged(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('review_sincero_notifications_updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('review_sincero_notifications_updated', handler);
    window.removeEventListener('storage', handler);
  };
}

// Mark single notification as read in local storage
export function markNotificationAsRead(id: string): void {
  try {
    const current = getLocalReadNotifications();
    current[id] = true;
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('review_sincero_notifications_updated'));
  } catch (e) {
    console.warn('[notificationService] Failed to mark as read in localStorage:', e);
  }
}

// Mark all as read
export function markAllNotificationsAsRead(ids: string[]): void {
  try {
    const current = getLocalReadNotifications();
    ids.forEach((id) => {
      current[id] = true;
    });
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('review_sincero_notifications_updated'));
  } catch (e) {
    console.warn('[notificationService] Failed to mark all as read:', e);
  }
}

// Subscribe to real-time system notifications
export function subscribeSystemNotifications(
  callback: (notifications: SystemNotification[]) => void
): () => void {
  try {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SystemNotification[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.published !== false) {
            list.push({
              id: docSnap.id,
              type: data.type || 'general',
              title: data.title || '',
              message: data.message || '',
              targetView: data.targetView || '',
              targetId: data.targetId || '',
              ctaText: data.ctaText || 'VER AGORA',
              published: true,
              createdAt: data.createdAt || new Date().toISOString(),
              createdBy: data.createdBy || ADMIN_EMAIL
            });
          }
        });

        // Merge with auto-version update notification if applicable
        const versionNotif = checkSystemVersionUpdate();
        const finalList = versionNotif ? [versionNotif, ...list] : list;
        
        callback(finalList.length > 0 ? finalList : INITIAL_SYSTEM_NOTIFICATIONS);
      },
      (error) => {
        console.warn('[notificationService] Snapshot error, falling back to local list:', error);
        const versionNotif = checkSystemVersionUpdate();
        const fallback = versionNotif ? [versionNotif, ...INITIAL_SYSTEM_NOTIFICATIONS] : INITIAL_SYSTEM_NOTIFICATIONS;
        callback(fallback);
      }
    );
  } catch (e) {
    console.warn('[notificationService] Error setting up listener:', e);
    const versionNotif = checkSystemVersionUpdate();
    const fallback = versionNotif ? [versionNotif, ...INITIAL_SYSTEM_NOTIFICATIONS] : INITIAL_SYSTEM_NOTIFICATIONS;
    callback(fallback);
    return () => {};
  }
}

// Alias for subscribeSystemNotifications
export const subscribeToNotifications = subscribeSystemNotifications;

// Automated check for system updates via build version
export function checkSystemVersionUpdate(): SystemNotification | null {
  try {
    const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    if (!lastSeenVersion || lastSeenVersion !== APP_VERSION) {
      return {
        id: `version-update-${APP_VERSION}`,
        type: 'update',
        title: '🚀 NOVA ATUALIZAÇÃO DISPONÍVEL',
        message: 'Nova versão disponível.',
        targetView: 'dashboard',
        ctaText: 'VER NOVIDADES',
        published: true,
        createdAt: new Date().toISOString()
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Acknowledge system version
export function acknowledgeSystemVersion(): void {
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, APP_VERSION);
  } catch (e) {
    console.warn('Failed to save version to localStorage');
  }
}

// Create automated system notification (Admin or internal event)
export async function createAutomatedSystemNotification(
  item: Omit<SystemNotification, 'id' | 'createdAt' | 'published'> & { published?: boolean }
): Promise<boolean> {
  try {
    const id = 'notif-' + Date.now();
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, id);
    await setDoc(docRef, {
      id,
      type: item.type,
      title: item.title,
      message: item.message,
      targetView: item.targetView || '',
      targetId: item.targetId || '',
      ctaText: item.ctaText || 'VER AGORA',
      published: item.published !== false,
      createdAt: new Date().toISOString(),
      createdBy: ADMIN_EMAIL
    });
    return true;
  } catch (e) {
    console.warn('[notificationService] Failed to create automated notification in Firestore:', e);
    return false;
  }
}

// Delete notification (Admin only)
export async function deleteSystemNotification(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, id));
    return true;
  } catch (e) {
    console.error('[notificationService] Failed to delete notification:', e);
    return false;
  }
}
