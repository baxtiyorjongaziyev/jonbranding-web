/**
 * Sayt vidjeti beradigan ID: `web_` + crypto.randomUUID(). Proxy faqat shu
 * formatni backend'ga uzatadi. Aks holda istalgan ID (masalan, Telegram
 * foydalanuvchisining raqamli ID'si) bilan boshqa odamning tarixini o'qish yoki
 * uning nomidan yozish mumkin bo'lardi — proxy so'rovga bizning secret'imizni qo'shadi.
 */
const OISHA_WEB_USER_ID = /^web_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isOishaWebUserId(value: unknown): value is string {
  return typeof value === 'string' && OISHA_WEB_USER_ID.test(value);
}

/**
 * Mehmon xabarida telefon yoki Telegram bormi. Kontaktsiz xabarga
 * "bog'lanamiz" deb va'da berib bo'lmaydi — avval kontakt so'raladi.
 */
export function containsContact(text: string): boolean {
  const hasPhone = (text.match(/\+?\d[\d\s().-]{7,}\d/g) || []).some(
    (candidate) => candidate.replace(/\D/g, '').length >= 9,
  );
  const hasTelegram =
    /(^|[\s(])@[a-zA-Z][a-zA-Z0-9_]{4,31}\b/.test(text) || /t\.me\/[a-zA-Z0-9_]{5,}/i.test(text);
  return hasPhone || hasTelegram;
}
