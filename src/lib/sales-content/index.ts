/**
 * Sotuv kontenti — til bo'yicha tanlash.
 *
 * `/narxlar` va `/credentials` shu yerdan o'qiydi.
 * Narxlar barcha tillarda bir xil (so'mda) — faqat matn tarjima qilinadi.
 */

import { uz, EXPERT_CHECK_SERVICE } from './uz';
import { ru } from './ru';
import { en } from './en';
import { zh } from './zh';
import type { SalesContent, ServiceId } from './types';

export type {
  Faq,
  Job,
  Package,
  ProcessStep,
  SalesContent,
  SalesUi,
  Service,
  ServiceId,
  ServiceGroup,
  WhyUsItem,
} from './types';

const BY_LOCALE: Record<string, SalesContent> = { uz, ru, en, zh };

/** Til bo'yicha kontent. Noma'lum til kelsa — o'zbekcha (asosiy til). */
export function getSalesContent(lang?: string): SalesContent {
  return BY_LOCALE[lang ?? 'uz'] ?? uz;
}

/**
 * Eski nomlar — o'zbekcha kontentga ishora qiladi.
 * Tilga bog'liq joylarda `getSalesContent(lang)` ishlatilsin.
 */
export { EXPERT_CHECK_SERVICE };

export const SERVICE_GROUPS = uz.serviceGroups;
export const PACKAGES = uz.packages;
export const FAQS = uz.faqs;
export const WHY_US = uz.whyUs;
export const GUARANTEES = uz.guarantees;
export const JOBS = uz.jobs;
export const PROCESS_STEPS = uz.processSteps;
export const PRICE_FACTORS = uz.priceFactors;

/** Kategoriyalar xizmat ID si bo'yicha — tarjima qilinsa ham buzilmaydi. */
export const SERVICE_CATEGORIES: Partial<Record<ServiceId, string[]>> = {
  naming: ['naming', 'brand-strategy'],
  logo: ['logo-design'],
  'visual-identity': ['corporate-style'],
  brandbook: ['brandbook', 'brand-strategy'],
  packaging: ['packaging'],
  'packaging-extra': ['packaging'],
};

export const ALL_SERVICES = uz.serviceGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title }))
);
