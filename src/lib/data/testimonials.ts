import { client } from '@/sanity/lib/client';
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import type { Testimonial } from '@/lib/types';
import { logger } from '@/lib/logger';

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

const HIKMATULLOH_VIDEO_ID = '1205182267';
const HIKMATULLOH_COVER = '/images/testimonials/hikmatulloh-toxirov-cover.webp';

function applyLocalCovers(testimonials: Testimonial[]): Testimonial[] {
  return testimonials.map((testimonial) => {
    if (testimonial.videoUrl?.includes(HIKMATULLOH_VIDEO_ID)) {
      return { ...testimonial, image: HIKMATULLOH_COVER };
    }
    return testimonial;
  });
}

function getFallback(lang: string): Testimonial[] {
  if (lang === 'ru') return applyLocalCovers(staticTestimonialsRu);
  if (lang === 'en') return applyLocalCovers(staticTestimonialsEn);
  if (lang === 'zh') return applyLocalCovers(staticTestimonialsZh);
  return applyLocalCovers(staticTestimonials);
}

export async function fetchTestimonials(lang: string): Promise<Testimonial[]> {
  const fallback = getFallback(lang);
  try {
    const data: Testimonial[] = await client.fetch(QUERY, { lang }, { next: { revalidate: 30 } });
    if (data && data.length > 0) {
      const sanityNames = new Set(data.map((t) => t.name.toLowerCase().trim()));
      return [
        ...applyLocalCovers(data),
        ...fallback.filter((f) => !sanityNames.has(f.name.toLowerCase().trim())),
      ];
    }
  } catch (e) {
    logger.error('Sanity testimonials fetch failed, using fallback:', e);
  }
  return fallback;
}
