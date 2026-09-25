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
