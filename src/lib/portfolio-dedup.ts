import { createHash } from 'crypto';

/**
 * Telegram postidan Sanity hujjat ID'sini hisoblash.
 *
 * Ikkita tizim bir xil kanalni o'qiydi: `src/app/api/portfolio-telegram`
 * (webhook) va `services/portfolio-bot` (userbot). Ular postni har xil
 * kalit bilan belgilaydi — webhook `media_group_id`, bot esa `chatId` —
 * shuning uchun kalit bo'yicha dublikatni ushlab bo'lmaydi.
 *
 * Ikkalasi ham ko'radigan yagona umumiy narsa — postning o'z matni.
 * Shu matndan barqaror ID hisoblanadi va Sanity'ga `createIfNotExists`
 * bilan yoziladi: kim birinchi ulgursa o'sha yozadi, ikkinchisi hech narsa
 * qilmaydi. Sarlavha Gemini'dan kelgani uchun har safar boshqacha bo'lishi
 * mumkin, shuning uchun slug bo'yicha tekshirish bunga yetmaydi.
 *
 * DIQQAT: bu funksiyaning aynan nusxasi `services/portfolio-bot/src/sanity.ts`
 * da ham bor (u alohida TypeScript loyihasi, `src/` dan import qila olmaydi).
 * Algoritm o'zgarsa ikkalasi ham o'zgarishi shart — aks holda dublikat qaytadi.
 * `portfolio-dedup.test.ts` dagi golden qiymatlar shuni ushlab turadi.
 */
export function normalizeCaption(caption: string): string {
  // Lotin, kengaytirilgan lotin va kirill harflari saqlanadi, qolgani bo'shliq.
  // `\p{L}` ishlatilmaydi: typecheck konfiguratsiyasi eski ES maqsadida
  // unicode property escape'ni qabul qilmaydi.
  return caption
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u0400-\u04FF]+/g, ' ')
    .trim()
    .slice(0, 500);
}

/** Post matnidan barqaror Sanity `_id`. Bo'sh matn uchun `null`. */
export function portfolioDocId(caption: string): string | null {
  const normalized = normalizeCaption(caption);
  if (normalized.length < 20) return null;
  const hash = createHash('sha1').update(normalized).digest('hex').slice(0, 32);
  return `tg-${hash}`;
}
