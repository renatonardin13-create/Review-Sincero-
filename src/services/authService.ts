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

export function getStoredUser(): AuthUser {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-enforce admin role if email matches
      if (parsed.email && parsed.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
        parsed.role = 'admin';
      }
      return parsed;
    }
  } catch (e) {
    console.error('[authService] Error parsing user:', e);
  }
  // Default to Admin in development so user can test everything immediately
  return DEFAULT_ADMIN_USER;
}

export function saveStoredUser(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    recordUserInDirectory(user);
  } catch (e) {
    console.error('[authService] Error saving user:', e);
  }
}

export function isUserAdmin(user?: AuthUser | null): boolean {
  if (!user) return false;
  return (
    user.role === 'admin' ||
    user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()
  );
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

export function logoutUser(): AuthUser {
  // Reset to guest free user or clear
  const guestUser: AuthUser = {
    ...DEFAULT_FREE_USER,
    id: 'usr-guest-' + Date.now(),
    email: 'convidado@review-sincero.app',
    name: 'Visitante Gratuito',
    role: 'user',
    lastLoginAt: new Date().toISOString()
  };
  saveStoredUser(guestUser);
  return guestUser;
}

export function getRegisteredUsersList(): AuthUser[] {
  try {
    const list = localStorage.getItem(USERS_LIST_STORAGE_KEY);
    if (list) {
      return JSON.parse(list);
    }
  } catch (e) {
    console.error(e);
  }
  return [DEFAULT_ADMIN_USER, DEFAULT_FREE_USER];
}

export function recordUserInDirectory(user: AuthUser): void {
  try {
    const list = getRegisteredUsersList();
    const existingIdx = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], lastLoginAt: new Date().toISOString() };
    } else {
      list.push(user);
    }
    localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}
