import { getSalesContent } from '@/lib/sales-content';
import type { ServiceId } from '@/lib/sales-content';

export type ServiceFacts = { price: string; duration: string };

/** Narx va muddat — faqat `sales-content` dan (yagona manba). */
export function getServiceFacts(lang: string, id: ServiceId): ServiceFacts {
  const content = getSalesContent(lang);
  const service = content.serviceGroups.flatMap((g) => g.items).find((s) => s.id === id);
  if (!service) return { price: '', duration: '' };
  return { price: `${service.price} ${content.ui.currency}`, duration: service.duration ?? '' };
}

/** Matndagi `{price}` va `{duration}` belgilarini haqiqiy qiymat bilan almashtiradi. */
export function fillServiceFacts(text: string, facts: ServiceFacts): string {
  return text.replace(/\{price\}/g, facts.price).replace(/\{duration\}/g, facts.duration);
}
