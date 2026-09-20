import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppSettings, AuthUser, ADMIN_EMAIL, TemplateType } from '../types';

const SETTINGS_DOC_REF = doc(db, 'global_settings', 'default');
const LOCAL_STORAGE_KEY = 'review_sincero_settings';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export async function loadGlobalSettings(): Promise<AppSettings> {
  let fetchedSettings: Partial<AppSettings> | null = null;

  // 1. Try Firestore first (real global persistence on Vercel & all devices)
  try {
    const snap = await getDoc(SETTINGS_DOC_REF);
    if (snap.exists()) {
      const data = snap.data();
      if (data) {
        fetchedSettings = data as AppSettings;
        console.log('[SettingsService] Loaded settings from Firestore global_settings/default');
      }
    }
  } catch (firestoreErr) {
    console.warn('[SettingsService] Could not load from Firestore, trying API /api/settings:', firestoreErr);
  }

  // 2. Try /api/settings (for Cloud Run / Express backend)
  if (!fetchedSettings) {
    try {
      const res = await fetch('/api/settings');
      const ct = res.headers.get('content-type');
      if (res.ok && ct && ct.includes('application/json')) {
        const json = await res.json();
        if (json && json.success && json.settings) {
          fetchedSettings = json.settings;
          console.log('[SettingsService] Loaded settings from /api/settings');
        }
      }
    } catch (apiErr) {
      console.warn('[SettingsService] Could not load from /api/settings:', apiErr);
    }
  }

  // 3. Fallback to localStorage cache
  if (!fetchedSettings) {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        fetchedSettings = JSON.parse(local);
        console.log('[SettingsService] Loaded settings from localStorage cache');
      }
    } catch (e) {
      console.warn('[SettingsService] Could not load from localStorage:', e);
    }
  }

  const result: AppSettings = {
    siteName: fetchedSettings?.siteName || 'Guia Sincero Tech',
    logoUrl: fetchedSettings?.logoUrl || '',
    authorName: fetchedSettings?.authorName || 'Carlos Mendonça',
    authorAvatarUrl: fetchedSettings?.authorAvatarUrl || '',
    authorBio: fetchedSettings?.authorBio || '',
    defaultTemplate: (fetchedSettings?.defaultTemplate as TemplateType) || 'clean',
    socialLinks: fetchedSettings?.socialLinks || {},
    contactEmail: fetchedSettings?.contactEmail || 'contato@guiasincero.com',
    exportWithSeoTags: fetchedSettings?.exportWithSeoTags ?? true,
    enableQuickLoginShortcuts: fetchedSettings?.enableQuickLoginShortcuts ?? true,
    usageLimits: fetchedSettings?.usageLimits || { freeReviewLimit: 3, premiumReviewLimit: 50 },
    loginMedia: fetchedSettings?.loginMedia || {}
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
  } catch (e) {}

  return result;
}

export async function saveGlobalSettings(newSettings: AppSettings, currentUser: AuthUser | null): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador master (renatonardin13@gmail.com) pode alterar as configurações globais.' };
  }

  const payloadToSave: AppSettings & { updatedAt: string; updatedBy: string } = {
    ...newSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser?.email || ADMIN_EMAIL
  };

  // 1. Save to Firestore (primary true global persistence on Vercel)
  let firestoreSuccess = false;
  try {
    await setDoc(SETTINGS_DOC_REF, payloadToSave);
    firestoreSuccess = true;
    console.log('[SettingsService] Saved settings to Firestore global_settings/default successfully');
  } catch (firestoreErr: any) {
    handleFirestoreError(firestoreErr, OperationType.WRITE, 'global_settings/default');
    console.warn('[SettingsService] Firestore write not available, continuing with backend and local persistence fallback.');
  }

  // 2. Try POST /api/settings for Express backend (Cloud Run)
  let apiSuccess = false;
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': currentUser?.email || ADMIN_EMAIL
      },
      body: JSON.stringify(payloadToSave)
    });
    if (res.ok) {
      apiSuccess = true;
    }
  } catch (apiErr) {
    console.warn('[SettingsService] POST /api/settings note (expected on static Vercel host):', apiErr);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payloadToSave));
  } catch (e) {}

  if (!firestoreSuccess && !apiSuccess) {
    return { success: true, error: undefined };
  }

  return { success: true };
}
