import { getSalesContent } from '@/lib/sales-content';
import { getServiceFact } from '@/lib/service-pages/localized-facts';

export type ServicesOverviewCopy = {
  title: string;
  intro: string;
  packagesTitle: string;
  packagesFrom: string;
  packagesDuration: string;
  packagesIncludes: string;
  packagesNote: string;
  processTitle: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  pricesLink: string;
};

export type ServicesSeoCopy = { title: string; description: string; keywords: string };

/**
 * `/xizmatlar` sharhi uchun shablonlarni yagona manbadan (`sales-content`) to'ldiradi.
 * Narx, muddat, paket nomi va tarkibi matnga qo'lda yozilmaydi.
 */
export function fillOverviewTokens(text: string, lang: string, currency: string): string {
  const c = getSalesContent(lang);
  // packages: [VIP, PREMIUM, STANDART] tartibida (docs/NARXLAR.md §3)
  const [vip, premium, standard] = c.packages;
  const steps = c.processSteps.map((s, i) => `${i + 1}) ${s.title}`).join('; ');
  const values: Record<string, string> = {
    currency,
    fromPrice: standard.price,
    standardName: standard.name,
    standardPrice: standard.price,
    standardDuration: standard.duration,
    standardFeatures: standard.features.join(', '),
    premiumName: premium.name,
    premiumPrice: premium.price,
    premiumDuration: premium.duration,
    premiumFeatures: premium.features.join(', '),
    vipName: vip.name,
    vipPrice: vip.price,
    vipDuration: vip.duration,
    vipFeatures: vip.features.join(', '),
    logoPrice: getServiceFact(lang, 'logo').price,
    identityPrice: getServiceFact(lang, 'visual-identity').price,
    brandbookPrice: getServiceFact(lang, 'brandbook').price,
    steps,
  };
  return text.replace(/\{([A-Za-z]+)\}/g, (m, k: string) => values[k] ?? m);
}

export function buildOverviewFaqs(lang: string, copy: ServicesOverviewCopy, currency: string) {
  return copy.faqs.map((f) => ({
    q: f.q,
    a: fillOverviewTokens(f.a, lang, currency),
  }));
}
