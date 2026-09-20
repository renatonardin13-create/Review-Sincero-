import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppSettings, AuthUser, ADMIN_EMAIL, TemplateType } from '../types';
import { DEFAULT_PROMO_BANNERS } from '../data/initialData';

const SETTINGS_DOC_REF = doc(db, 'global_settings', 'default');
const LOCAL_STORAGE_KEY = 'review_sincero_settings';

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

  // Sanitize promoBanners strictly
  const rawBanners = fetchedSettings?.promoBanners;
  const promoBanners = Array.isArray(rawBanners) && rawBanners.length > 0
    ? rawBanners
    : DEFAULT_PROMO_BANNERS;

  const result: AppSettings = {
    siteName: fetchedSettings?.siteName || 'Guia Sincero Tech',
    logoUrl: fetchedSettings?.logoUrl || '',
    authorName: fetchedSettings?.authorName || 'Carlos Mendonça',
    defaultTemplate: (fetchedSettings?.defaultTemplate as TemplateType) || 'clean',
    socialLinks: fetchedSettings?.socialLinks || {},
    contactEmail: fetchedSettings?.contactEmail || 'contato@guiasincero.com',
    exportWithSeoTags: fetchedSettings?.exportWithSeoTags ?? true,
    promoBanners,
    bannerAutoplaySpeed: typeof fetchedSettings?.bannerAutoplaySpeed === 'number' ? fetchedSettings.bannerAutoplaySpeed : 6,
    enableBannerCarousel: fetchedSettings?.enableBannerCarousel !== false,
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

  const sanitizedBanners = Array.isArray(newSettings.promoBanners) ? newSettings.promoBanners : DEFAULT_PROMO_BANNERS;
  const payloadToSave: AppSettings & { updatedAt: string; updatedBy: string } = {
    ...newSettings,
    promoBanners: sanitizedBanners,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser?.email || ADMIN_EMAIL
  };

  // 1. Save to Firestore (primary true global persistence on Vercel)
  try {
    await setDoc(SETTINGS_DOC_REF, payloadToSave);
    console.log('[SettingsService] Saved settings to Firestore global_settings/default successfully');
  } catch (firestoreErr: any) {
    console.error('[SettingsService] Error saving to Firestore:', firestoreErr);
    return { success: false, error: 'Não foi possível sincronizar com o banco de dados global (Firestore).' };
  }

  // 2. Try POST /api/settings for Express backend (Cloud Run)
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': currentUser?.email || ADMIN_EMAIL
      },
      body: JSON.stringify(payloadToSave)
    });
  } catch (apiErr) {
    console.warn('[SettingsService] POST /api/settings note (expected on static Vercel host):', apiErr);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payloadToSave));
  } catch (e) {}

  return { success: true };
}
