import { client } from '@/sanity/lib/client';
import { staticBrands } from '@/lib/static-data';
import type { Brand } from '@/lib/types';

const QUERY = `
  *[_type == "brand"] | order(coalesce(order, 999) asc) {
    _id,
    "name": name,
    "logo": coalesce(logoUrl, logo.asset->url),
    "hiddenInHero": coalesce(hiddenInHero, false)
  }
`;

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const data: Brand[] = await client.fetch(QUERY);
    if (data && data.length > 0) return data;
  } catch (e) {
    console.error('Sanity brands fetch failed, using fallback:', e);
  }
  return staticBrands;
}
