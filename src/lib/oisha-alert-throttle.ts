/**
 * Bitta IP'dan Telegram alert'lar oralig'ini cheklaydi. Bot bir daqiqada yuzlab
 * xabar yuborsa, har biri alohida alert bo'lib egasining Telegram'ini to'ldirmasin.
 * Holat xotirada: serverless instansiyada u instansiya doirasida ishlaydi — bu
 * to'liq himoya emas, lekin shovqinni keskin kamaytiradi.
 */

export const ALERT_WINDOW_MS = 60_000;
const MAX_TRACKED_IPS = 1000;
const lastAlertAt = new Map<string, number>();

export function shouldSendOishaAlert(ip: string, now: number = Date.now()): boolean {
  const last = lastAlertAt.get(ip);
  if (last !== undefined && now - last < ALERT_WINDOW_MS) return false;

  if (lastAlertAt.size >= MAX_TRACKED_IPS) lastAlertAt.clear();
  lastAlertAt.set(ip, now);
  return true;
}

/** Faqat testlar uchun. */
export function resetOishaAlertThrottle() {
  lastAlertAt.clear();
}
