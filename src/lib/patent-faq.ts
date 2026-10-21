import type { Locale } from '@/lib/dictionaries';
import { getSalesContent } from '@/lib/sales-content';
import { certificateDays, PATENT_CERTIFICATES } from '@/lib/patent-certificates';

export type Faq = { q: string; a: string };

/** Savol-javob matnidagi {check}, {standard}... belgilarini narxlar manbasidan to'ldiradi. */
export function patentFaqs(lang: Locale, items: Faq[]): Faq[] {
  const services = getSalesContent(lang).serviceGroups.flatMap((g) => g.items);
  const find = (id: string) => services.find((sv) => sv.id === id);
  const check = find('trademark-search');
  const standard = find('trademark-standard');
  const express = find('trademark-express');
  const values: Record<string, string> = {
    check: check?.price ?? '',
    addon: check?.addon?.price ?? '',
    standard: standard?.price ?? '',
    express: express?.price ?? '',
    standardDuration: standard?.duration ?? '',
    expressDuration: express?.duration ?? '',
    count: String(PATENT_CERTIFICATES.length),
    fastest: String(Math.min(...PATENT_CERTIFICATES.map(certificateDays))),
  };
  const fill = (text: string) => text.replace(/\{(\w+)\}/g, (m, key: string) => values[key] ?? m);
  return items.map((f) => ({ q: fill(f.q), a: fill(f.a) }));
}
