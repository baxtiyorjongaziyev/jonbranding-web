import type { ServiceQuote, ServiceVideo } from '@/components/service-landing/types';
import { staticTestimonials } from '@/lib/static-data';

/** Tasdiqlangan mijoz sharhi (`static-data.ts`) — kompaniya nomining boshi bo'yicha. */
export function quoteFrom(company: string): ServiceQuote | null {
  const t = staticTestimonials.find((item) => item.company.startsWith(company) && item.quote);
  return t ? { name: t.name, company: t.company, quote: t.quote } : null;
}

/** Video sharhlar (mp4 yoki Vimeo) — faqat videosi bor tasdiqlangan sharhlar. */
export function videosFrom(companies: string[]): ServiceVideo[] {
  return companies.flatMap((company) => {
    const t = staticTestimonials.find((item) => item.company.startsWith(company) && item.videoUrl);
    return t?.videoUrl ? [{ name: t.name, company: t.company, src: t.videoUrl, poster: t.image || undefined }] : [];
  });
}
