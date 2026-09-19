import { createHmac } from 'node:crypto';
import { safeCompare } from '@/lib/security';

export const ADMIN_COOKIE = 'admin_session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload: string): string | null {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return null;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function createAdminSession(now: number = Date.now()): string {
  const exp = now + SESSION_TTL_MS;
  const sig = sign(String(exp));
  if (!sig) throw new Error('ADMIN_SECRET is not set');
  return `${exp}.${sig}`;
}

export function verifyAdminSession(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
): boolean {
  if (!cookieValue || typeof cookieValue !== 'string' || !cookieValue.includes('.')) return false;
  const [expPart, sigPart] = cookieValue.split('.');
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = sign(expPart);
  if (!expected || !sigPart) return false;
  return safeCompare(sigPart, expected);
}
