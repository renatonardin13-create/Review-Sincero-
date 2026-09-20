import { auth, db } from '../lib/firebase';
import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  signOut, 
  onAuthStateChanged,
  ActionCodeSettings 
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { AuthUser, UserRole, UserStatus, ADMIN_EMAIL } from '../types';

const USERS_COLLECTION = 'users';

export const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'usr-admin-master',
  email: ADMIN_EMAIL,
  name: 'Renato Nardin (Administrador Master)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  status: 'active',
  provider: 'email',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: new Date().toISOString()
};

export const DEFAULT_FREE_USER: AuthUser = {
  id: 'usr-member-free',
  email: 'usuario.comum@gmail.com',
  name: 'Aluno VIP (Acesso Gratuito)',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'user',
  status: 'active',
  provider: 'email',
  createdAt: '2026-02-15T00:00:00.000Z',
  lastLoginAt: new Date().toISOString()
};

export function isUserAdmin(user?: AuthUser | null): boolean {
  if (!user) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}

/**
 * Sends a passwordless sign-in email link to the user after validating authorization.
 */
export async function sendEmailLinkLogin(emailInput: string): Promise<{ success: boolean; message: string }> {
  const email = emailInput.trim().toLowerCase();
  if (!email) {
    return { success: false, message: 'Por favor, informe um e-mail válido.' };
  }

  // 1. Check if user is authorized (either admin or exists in Firestore / registered users)
  const isAdmin = email === ADMIN_EMAIL.toLowerCase().trim();
  let authorized = isAdmin;
  let userRecord: AuthUser | null = null;

  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      userRecord = {
        id: docSnap.id,
        email: data.email || email,
        name: data.name || email.split('@')[0],
        avatarUrl: data.avatarUrl || '',
        role: data.role || (isAdmin ? 'admin' : 'user'),
        status: data.status || 'active',
        provider: 'email',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt || new Date().toISOString()
      };
      if (userRecord.status === 'blocked') {
        return { success: false, message: 'Seu acesso está bloqueado. Entre em contato com o administrador.' };
      }
      authorized = true;
    }
  } catch (e) {
    console.warn('[authService] Error checking user in Firestore:', e);
  }

  if (!authorized) {
    return { success: false, message: 'Este e-mail não possui acesso ao sistema.' };
  }

  // 2. Prepare action code settings
  const actionCodeSettings: ActionCodeSettings = {
    url: window.location.origin + window.location.pathname,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true, message: 'Enviamos um link de acesso para seu e-mail.' };
  } catch (error: any) {
    console.error('[authService] Error sending email link:', error);
    return { success: false, message: error?.message || 'Erro ao enviar link para o e-mail.' };
  }
}

/**
 * Completes sign in with email link if URL contains sign-in link
 */
export async function completeEmailLinkSignIn(): Promise<AuthUser | null> {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Por favor, confirme seu e-mail para concluir o acesso:');
    }
    if (!email) return null;

    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      const firebaseUser = result.user;

      // Fetch or create user profile in Firestore
      const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);

      const isAdmin = firebaseUser.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

      let appUser: AuthUser;
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'blocked') {
          await signOut(auth);
          throw new Error('Seu acesso está bloqueado.');
        }
        appUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name: data.name || email.split('@')[0],
          avatarUrl: data.avatarUrl || '',
          role: isAdmin ? 'admin' : (data.role || 'user'),
          status: data.status || 'active',
          provider: 'email',
          createdAt: data.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
      } else {
        appUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name: isAdmin ? 'Renato Nardin' : email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          avatarUrl: isAdmin ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: isAdmin ? 'admin' : 'user',
          status: 'active',
          provider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
      }

      await setDoc(userDocRef, {
        uid: appUser.id,
        email: appUser.email,
        name: appUser.name,
        role: appUser.role,
        status: appUser.status,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return appUser;
    } catch (e) {
      console.error('[authService] Error completing sign in with email link:', e);
      return null;
    }
  }
  return null;
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('[authService] Logout error:', e);
  }
  localStorage.removeItem('review_sincero_auth_user');
}

export function getStoredUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem('review_sincero_auth_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.email && parsed.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
        parsed.role = 'admin';
      }
      return parsed;
    }
  } catch (e) {}
  return auth.currentUser ? {
    id: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    name: auth.currentUser.displayName || 'Usuário',
    role: auth.currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() ? 'admin' : 'user',
    status: 'active',
    provider: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  } : null;
}

export function saveStoredUser(user: AuthUser | null): void {
  if (!user) {
    localStorage.removeItem('review_sincero_auth_user');
  } else {
    if (user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
      user.role = 'admin';
    }
    localStorage.setItem('review_sincero_auth_user', JSON.stringify(user));
  }
}

export function getRegisteredUsersList(): AuthUser[] {
  return [DEFAULT_ADMIN_USER, DEFAULT_FREE_USER];
}

export function addUser(user: Omit<AuthUser, 'id' | 'createdAt' | 'lastLoginAt' | 'status'>): AuthUser {
  const newUser: AuthUser = {
    ...user,
    id: `usr-${Date.now()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    role: user.email === ADMIN_EMAIL ? 'admin' : 'user'
  };
  return newUser;
}

// User Management CRUD for Admin Panel
export async function fetchRegisteredUsers(): Promise<AuthUser[]> {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users: AuthUser[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      users.push({
        id: docSnap.id,
        email: data.email || '',
        name: data.name || '',
        role: data.role || 'user',
        status: data.status || 'active',
        provider: data.provider || 'email',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt || new Date().toISOString()
      });
    });
    if (users.length === 0) {
      return [DEFAULT_ADMIN_USER, DEFAULT_FREE_USER];
    }
    return users;
  } catch (e) {
    console.warn('[authService] Error fetching users from Firestore:', e);
    return [DEFAULT_ADMIN_USER, DEFAULT_FREE_USER];
  }
}

export async function saveUserAdmin(user: Partial<AuthUser>, currentUser: AuthUser | null): Promise<{ success: boolean; error?: string }> {
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Acesso negado.' };
  }
  try {
    if (user.id) {
      const docRef = doc(db, USERS_COLLECTION, user.id);
      await setDoc(docRef, {
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao salvar usuário.' };
  }
}

export async function checkUserReviewLimit(user: AuthUser, settings: any, reviewCount: number): Promise<boolean> {
  if (isUserAdmin(user)) return true;
  const limit = settings.usageLimits?.freeReviewLimit || 3;
  return reviewCount < limit;
}
