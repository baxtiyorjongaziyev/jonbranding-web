import { logger } from '@/lib/logger';
import { safeIntakeObject, validIntakeName, intakePhone, intakeTelegram } from '@/lib/intake-validation';
import { validHumanSession } from '@/lib/human-verification';

/**
 * Bot himoyasi lead endpointlari uchun. Uch qatlam:
 *   1. Honeypot — yashirin maydon. Odam uni ko'rmaydi, bot to'ldiradi.
 *   2. Turnstile — kalitlar sozlanganda avtomat yoqiladi, aks holda o'tkazib
 *      yuboriladi. Shu sabab kalitsiz ham sayt ishlashda davom etadi.
 *   3. Origin — begona saytdan kelgan so'rovni rad etadi.
 * Cloudflare edge additionally requires a signed intake session for browser submissions.
 */

export const HONEYPOT_FIELD = 'companyWebsite';

const ALLOWED_ORIGIN_HOSTS = [
  'jonbranding.uz',
  'www.jonbranding.uz',
  // Menejer patent kalkulyatori (src/middleware.ts) va Cloudflare staging.
  'patent.jonbranding.uz',
  'staging.jonbranding.uz',
  'localhost',
  '127.0.0.1',
];

function hostFromUrl(value: string | null) {
  if (!value) return '';
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isAllowedHost(host: string) {
  if (!host) return false;
  if (ALLOWED_ORIGIN_HOSTS.includes(host)) return true;
  return host === 'patent.jonbranding.uz';
}

/**
 * Honeypot maydoni to'ldirilganmi. To'ldirilgan bo'lsa — bot.
 */
export function isHoneypotTripped(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim().length > 0;
}

export type OriginCheck = {
  trusted: boolean;
  /** Sarlavha umuman kelmagan — bot ham, maxfiylik kengaytmasi ham bo'lishi mumkin. */
  missing: boolean;
  host: string;
};

export function checkOrigin(request: Request): OriginCheck {
  const headers = request?.headers;
  const originHost = hostFromUrl(headers?.get?.('origin') ?? null);
  const refererHost = hostFromUrl(headers?.get?.('referer') ?? null);
  const host = originHost || refererHost;

  if (!host) return { trusted: false, missing: true, host: '' };
  return { trusted: isAllowedHost(host), missing: false, host };
}

export type TurnstileResult = {
  ok: boolean;
  /** Kalit sozlanmagan — tekshiruv o'tkazib yuborildi. */
  skipped: boolean;
  reason?: string;
};

/**
 * Cloudflare Turnstile tokenini tekshiradi.
 * TURNSTILE_SECRET_KEY yo'q bo'lsa tekshiruv o'tkazib yuboriladi, shuning uchun
 * bu kodni kalitlar qo'shilishidan oldin ham deploy qilish xavfsiz.
 */
export async function verifyTurnstile(token: unknown, ip?: string): Promise<TurnstileResult> {
  const secret = String(process.env.TURNSTILE_SECRET_KEY || '').trim();
  if (!secret) return { ok: true, skipped: true };

  const candidate = typeof token === 'string' ? token.trim() : '';
  if (!candidate || candidate.length > 2048) return { ok: false, skipped: false, reason: 'missing-token' };

  try {
    const form = new URLSearchParams({ secret, response: candidate });
    if (ip && ip !== 'unknown' && !ip.startsWith('anonymous:')) form.set('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const result: any = await response.json().catch(() => null);

    if (response.ok && result?.success === true && typeof result.hostname === 'string'
      && ALLOWED_ORIGIN_HOSTS.concat('patent.jonbranding.uz').includes(result.hostname.toLowerCase())) return { ok: true, skipped: false };

    // Verification outages cannot establish that the caller is human.
    if (!response.ok || result === null) {
      logger.error('Turnstile siteverify unavailable; rejecting unverified lead', {
        status: response.status,
      });
      return { ok: false, skipped: false, reason: 'verify-unavailable' };
    }

    return {
      ok: false,
      skipped: false,
      reason: Array.isArray(result?.['error-codes'])
        ? result['error-codes'].join(',')
        : `http-${response.status}`,
    };
  } catch (error) {
    logger.error('Turnstile verification failed; rejecting unverified lead', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, skipped: false, reason: 'verify-unavailable' };
  }
}

export type LeadGuardVerdict =
  | { action: 'allow' }
  | { action: 'drop'; reason: string }
  | { action: 'reject'; reason: string };

/**
 * Bitta joyda barcha tekshiruvlar.
 *
 * `drop` — botga muvaffaqiyat ko'rsatamiz, lekin hech qayerga yubormaymiz.
 * Shunda bot forma o'zgarganini bilmaydi va urinishini takrorlamaydi.
 * `reject` — foydalanuvchiga haqiqiy xato qaytariladi.
 */
export async function guardLeadRequest(
  request: Request,
  body: unknown,
  ip: string,
  context: string,
): Promise<LeadGuardVerdict> {
  if (isHoneypotTripped(body)) {
    logger.warn(`Lead blocked by honeypot (${context})`, { ip });
    return { action: 'drop', reason: 'honeypot' };
  }
  if (!safeIntakeObject(body) || !validIntakeName(body.fullName)) {
    return { action: 'reject', reason: 'invalid-input' };
  }
  if (body.phone && !intakePhone(body.phone)) return { action: 'reject', reason: 'invalid-phone' };
  if (body.telegram && !intakeTelegram(body.telegram)) return { action: 'reject', reason: 'invalid-telegram' };

  const origin = checkOrigin(request);
  if (!origin.trusted) {
    logger.warn(`Lead from untrusted origin (${context})`, {
      ip,
      host: origin.host || null,
      missing: origin.missing,
    });
    if (!origin.missing) return { action: 'reject', reason: 'untrusted-origin' };
  }

  if (await validHumanSession(request, { OISHA_SECRET_KEY: process.env.OISHA_SECRET_KEY })) return { action: 'allow' };
  const turnstile = await verifyTurnstile(
    (body as Record<string, unknown> | null)?.turnstileToken,
    ip,
  );
  if (!turnstile.ok) {
    logger.warn(`Lead blocked by Turnstile (${context})`, { ip, reason: turnstile.reason });
    return { action: 'reject', reason: turnstile.reason || 'turnstile' };
  }

  return { action: 'allow' };
}
