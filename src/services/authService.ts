import { AuthUser, UserRole, ADMIN_EMAIL } from '../types';

const AUTH_STORAGE_KEY = 'review_sincero_auth_user';
const USERS_LIST_STORAGE_KEY = 'review_sincero_registered_users';

export const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'usr-admin-master',
  email: ADMIN_EMAIL,
  name: 'Renato Nardin (Administrador Master)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  provider: 'google',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: new Date().toISOString()
};

export const DEFAULT_FREE_USER: AuthUser = {
  id: 'usr-member-free',
  email: 'usuario.comum@gmail.com',
  name: 'Aluno VIP (Acesso Gratuito)',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'user',
  provider: 'google',
  createdAt: '2026-02-15T00:00:00.000Z',
  lastLoginAt: new Date().toISOString()
};

export function getStoredUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-enforce admin role if email matches
      if (parsed.email && parsed.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
        parsed.role = 'admin';
      } else {
        parsed.role = 'user';
      }
      return parsed;
    }
  } catch (e) {
    console.error('[authService] Error parsing user:', e);
  }
  // Return null if not logged in to enforce authentication flow
  return null;
}

export function saveStoredUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    if (user.email && user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
      user.role = 'admin';
    } else {
      user.role = 'user';
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    recordUserInDirectory(user);
  } catch (e) {
    console.error('[authService] Error saving user:', e);
  }
}

export function isUserAdmin(user?: AuthUser | null): boolean {
  if (!user) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}

export function loginWithGoogleAccount(customEmail?: string, customName?: string): AuthUser {
  const email = (customEmail || ADMIN_EMAIL).trim().toLowerCase();
  const isAdmin = email === ADMIN_EMAIL.toLowerCase().trim();
  
  const name =
    customName ||
    (isAdmin
      ? 'Renato Nardin'
      : email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

  const user: AuthUser = {
    id: 'usr-' + Date.now(),
    email,
    name,
    avatarUrl: isAdmin
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: isAdmin ? 'admin' : 'user',
    provider: 'google',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  saveStoredUser(user);
  return user;
}

export function loginWithEmailAccount(emailInput: string, nameInput?: string): AuthUser {
  const email = emailInput.trim().toLowerCase();
  const isAdmin = email === ADMIN_EMAIL.toLowerCase().trim();

  const name =
    nameInput?.trim() ||
    (isAdmin
      ? 'Renato Nardin'
      : email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

  const user: AuthUser = {
    id: 'usr-' + Date.now(),
    email,
    name,
    avatarUrl: isAdmin
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: isAdmin ? 'admin' : 'user',
    provider: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  saveStoredUser(user);
  return user;
}

export function logoutUser(): null {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
}

export function getRegisteredUsersList(): AuthUser[] {
  try {
    const list = localStorage.getItem(USERS_LIST_STORAGE_KEY);
    console.log(`[authService] getRegisteredUsersList - saved: ${list ? 'yes' : 'no'}`);
    if (list) {
      const parsed = JSON.parse(list);
      console.log(`[authService] getRegisteredUsersList - parsed length: ${parsed.length}`);
      return parsed;
    }
  } catch (e) {
    console.error('[authService] Error parsing users list:', e);
  }
  console.log(`[authService] getRegisteredUsersList - returning default fallback`);
  return [DEFAULT_ADMIN_USER, DEFAULT_FREE_USER];
}

export function recordUserInDirectory(user: AuthUser): void {
  try {
    const list = getRegisteredUsersList();
    const existingIdx = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIdx !== -1) {
      // Preserve blocked status if it exists
      const blocked = (list[existingIdx] as any).blocked || false;
      list[existingIdx] = { ...user, lastLoginAt: new Date().toISOString(), blocked };
    } else {
      list.push({ ...user, blocked: false } as any);
    }
    localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

export function deleteUserFromDirectory(email: string): void {
  try {
    const list = getRegisteredUsersList();
    const newList = list.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(newList));
  } catch (e) {
    console.error(e);
  }
}

export function toggleUserBlockStatus(email: string): void {
  try {
    const list = getRegisteredUsersList();
    const newList = list.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, blocked: !(u as any).blocked };
      }
      return u;
    });
    localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(newList));
  } catch (e) {
    console.error(e);
  }
}

export function addNewUserManual(name: string, email: string): string {
  const password = Math.random().toString(36).slice(-8);
  const newUser: AuthUser = {
    id: 'usr-' + Date.now(),
    email: email.toLowerCase(),
    name,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    provider: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  
  const list = getRegisteredUsersList();
  console.log(`[authService] addNewUserManual - list before push: ${list.length}`);
  list.push({ ...newUser, blocked: false, tempPassword: password } as any);
  console.log(`[authService] addNewUserManual - list after push: ${list.length}`);
  localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(list));
  console.log(`[authService] addNewUserManual - saved to storage`);
  
  return password;
}

export function checkUserReviewLimit(user: AuthUser, settings: any, reviewCount: number): boolean {
  if (isUserAdmin(user)) return true;
  const limit = settings.usageLimits?.freeReviewLimit || 3;
  return reviewCount < limit;
}
