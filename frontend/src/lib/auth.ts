export const SESSION_COOKIE = 'xai_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 8;

const DEFAULT_ADMIN_PASSWORD = 'admin123';
const DEFAULT_AUTH_SECRET = 'xai-banking-session-secret';

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
}

export function getAuthSecret() {
  return process.env.AUTH_SECRET ?? DEFAULT_AUTH_SECRET;
}

export async function createSessionToken(password: string, secret: string) {
  const data = new TextEncoder().encode(`xai-banking:${password}:${secret}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
