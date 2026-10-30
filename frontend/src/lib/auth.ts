export const ADMIN_PASSWORD = 'admin123';

export const AUTH_STORAGE_KEY = 'xai_admin_authenticated';

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function signIn(password: string) {
  if (password !== ADMIN_PASSWORD) return false;
  window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  return true;
}

export function signOut() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
