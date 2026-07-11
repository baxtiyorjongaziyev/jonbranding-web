import { client } from '@/sanity/lib/client';
import { FALLBACK_COMPARISONS, withFallbackComparisons } from '@/lib/comparison-fallbacks';

export type Comparison = (typeof FALLBACK_COMPARISONS)[number];

const QUERY = `
  *[_type == "comparison"] | order(coalesce(order, 999) asc, _createdAt asc) {
    _id,
    "brand": coalesce(brand, name, title, "Loyiha"),
    "oldImg": coalesce(oldImg.asset->url, beforeImage.asset->url),
    "newImg": coalesce(newImg.asset->url, afterImage.asset->url),
    "oldHint": coalesce(oldHint, "Before"),
    "newHint": coalesce(newHint, "After"),
    "order": coalesce(order, 999)
  }
`;

export async function fetchComparisons(): Promise<Comparison[]> {
  try {
    const data = await client.fetch(QUERY);
    const withImages = (data as Comparison[]).filter((item) => item.oldImg && item.newImg);
    return withFallbackComparisons(withImages);
  } catch {
    return withFallbackComparisons([]);
  }
}
