import { getSalesContent, type ServiceId } from '@/lib/sales-content';

/**
 * Narx va muddatni yagona manbadan (`sales-content/{til}.ts`) olib, matn
 * shablonlariga qo'yadi. Metadata va FAQ matnlarida narx qo'lda yozilmaydi:
 * `{price}`, `{duration}` va `{currency}` o'rniga haqiqiy qiymat qo'yiladi.
 */
export function getServiceFact(lang: string, id: ServiceId) {
  const content = getSalesContent(lang);
  const service = content.serviceGroups.flatMap((g) => g.items).find((s) => s.id === id);
  if (!service) throw new Error(`Service "${id}" not found in sales content`);
  return service;
}

export function fillServiceTokens(text: string, lang: string, id: ServiceId, currency: string): string {
  const s = getServiceFact(lang, id);
  return text
    .replaceAll('{price}', s.price)
    .replaceAll('{duration}', s.duration ?? '')
    .replaceAll('{currency}', currency);
}
