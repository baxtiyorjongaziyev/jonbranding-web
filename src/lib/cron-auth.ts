import { safeCompare } from '@/lib/security';

/**
 * Cron va ichki chaqiruvlar uchun yagona tekshiruv: faqat
 * `Authorization: Bearer <CRON_SECRET | AMOCRM_CRON_SECRET>`.
 *
 * Sir URL'da (`?secret=`) qabul qilinmaydi — u Vercel loglari, brauzer tarixi va
 * proxy'larda ochiq qolardi. Vercel Cron header'ni o'zi yuboradi; qo'lda:
 * `curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://www.jonbranding.uz/api/...`
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const configured = [process.env.CRON_SECRET, process.env.AMOCRM_CRON_SECRET]
    .map((secret) => secret?.trim())
    .filter((secret): secret is string => Boolean(secret));
  if (configured.length === 0) return false;

  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const token = header.slice('Bearer '.length).trim();

  return token.length > 0 && configured.some((secret) => safeCompare(token, secret));
}
