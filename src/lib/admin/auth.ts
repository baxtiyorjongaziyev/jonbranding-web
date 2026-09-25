import { createHmac } from 'node:crypto';
import { safeCompare } from '@/lib/security';

export const ADMIN_COOKIE = 'admin_session';
/** Ichki jamoa sahifalari (masalan, /sotuv-texnikalari) uchun alohida sessiya. */
export const TEAM_COOKIE = 'team_session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SessionSecret = 'ADMIN_SECRET' | 'SALES_TEAM_SECRET';

function sign(exp: string, secretName: SessionSecret): string | null {
  const secret = process.env[secretName]?.trim();
  if (!secret) return null;
  // Jamoa imzosi alohida domen bilan: parollar bir xil qo'yilsa ham team cookie
  // admin cookie sifatida o'tmaydi. Admin formati eski sessiyalar uchun o'zgarmagan.
  const payload = secretName === 'SALES_TEAM_SECRET' ? `team:${exp}` : exp;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function createSession(secretName: SessionSecret, now: number): string {
  const exp = now + SESSION_TTL_MS;
  const sig = sign(String(exp), secretName);
  if (!sig) throw new Error(`${secretName} is not set`);
  return `${exp}.${sig}`;
}

function verifySession(
  secretName: SessionSecret,
  cookieValue: string | undefined | null,
  now: number,
): boolean {
  if (!cookieValue || typeof cookieValue !== 'string' || !cookieValue.includes('.')) return false;
  const [expPart, sigPart] = cookieValue.split('.');
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = sign(expPart, secretName);
  if (!expected || !sigPart) return false;
  return safeCompare(sigPart, expected);
}

export function createAdminSession(now: number = Date.now()): string {
  return createSession('ADMIN_SECRET', now);
}

export function verifyAdminSession(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
): boolean {
  return verifySession('ADMIN_SECRET', cookieValue, now);
}

/** Sotuv jamoasi paroli (`SALES_TEAM_SECRET`) — admin parolidan alohida. */
export function createTeamSession(now: number = Date.now()): string {
  return createSession('SALES_TEAM_SECRET', now);
}

export function verifyTeamSession(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
): boolean {
  return verifySession('SALES_TEAM_SECRET', cookieValue, now);
}
