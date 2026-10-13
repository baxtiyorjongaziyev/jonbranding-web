import type { ServiceQuote } from '@/components/service-landing/types';
import { staticTestimonials } from '@/lib/static-data';

/** Tasdiqlangan mijoz sharhi (`static-data.ts`) — kompaniya nomining boshi bo'yicha. */
export function quoteFrom(company: string): ServiceQuote | null {
  const t = staticTestimonials.find((item) => item.company.startsWith(company) && item.quote);
  return t ? { name: t.name, company: t.company, quote: t.quote } : null;
}
