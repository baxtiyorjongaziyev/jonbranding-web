import { client } from '@/sanity/lib/client';
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import type { Testimonial } from '@/lib/types';

const QUERY = `
  *[_type == "testimonial"] | order(coalesce(order, 999) asc) {
    _id,
    "name": name,
    "avatar": coalesce(avatar, "??"),
    "image": image.asset->url,
    "imageHint": coalesce(imageHint, name),
    "videoUrl": videoUrl,
    "audioUrl": audioUrl,
    "audioFileUrl": audioFile.asset->url,
    "videoFileUrl": videoFile.asset->url,
    "company": coalesce(company[$lang], company.uz, company.en, ""),
    "quote": coalesce(quote[$lang], quote.uz, quote.en, "")
  }
`;

function getFallback(lang: string): Testimonial[] {
  if (lang === 'ru') return staticTestimonialsRu;
  if (lang === 'en') return staticTestimonialsEn;
  if (lang === 'zh') return staticTestimonialsZh;
  return staticTestimonials;
}

export async function fetchTestimonials(lang: string): Promise<Testimonial[]> {
  try {
    const data: Testimonial[] = await client.fetch(QUERY, { lang }, { next: { revalidate: 30 } });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.error('Sanity testimonials fetch failed, using fallback:', e);
  }
  return getFallback(lang);
}
