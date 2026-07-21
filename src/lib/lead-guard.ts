import { logger } from '@/lib/logger';

/**
 * Bot himoyasi lead endpointlari uchun. Uch qatlam:
 *   1. Honeypot — yashirin maydon. Odam uni ko'rmaydi, bot to'ldiradi.
 *   2. Turnstile — kalitlar sozlanganda avtomat yoqiladi, aks holda o'tkazib
 *      yuboriladi. Shu sabab kalitsiz ham sayt ishlashda davom etadi.
 *   3. Origin — begona saytdan kelgan so'rovni belgilaydi.
 *
 * Origin faqat *belgilaydi*, bloklamaydi: ba'zi maxfiylik kengaytmalari
 * sarlavhani olib tashlaydi va haqiqiy mijozni yo'qotish spamdan qimmatroq.
 */

export const HONEYPOT_FIELD = 'companyWebsite';

const ALLOWED_ORIGIN_HOSTS = [
  'jonbranding.uz',
  'www.jonbranding.uz',
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
  // Vercel preview deploylari: <project>-<hash>-<scope>.vercel.app
  return host.endsWith('.vercel.app');
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

  const candidate = String(token || '').trim();
  if (!candidate) return { ok: false, skipped: false, reason: 'missing-token' };

  try {
    const form = new URLSearchParams({ secret, response: candidate });
    if (ip && ip !== 'unknown' && !ip.startsWith('anonymous:')) form.set('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const result: any = await response.json().catch(() => null);

    if (result?.success === true) return { ok: true, skipped: false };
    return {
      ok: false,
      skipped: false,
      reason: Array.isArray(result?.['error-codes'])
        ? result['error-codes'].join(',')
        : `http-${response.status}`,
    };
  } catch (error) {
    // Turnstile ishlamay qolsa haqiqiy leadni yo'qotmaymiz — o'tkazib yuboramiz.
    logger.error('Turnstile verification failed; allowing lead through', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: true, skipped: true, reason: 'verify-unavailable' };
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

  const origin = checkOrigin(request);
  if (!origin.trusted) {
    logger.warn(`Lead from untrusted origin (${context})`, {
      ip,
      host: origin.host || null,
      missing: origin.missing,
    });
  }

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
