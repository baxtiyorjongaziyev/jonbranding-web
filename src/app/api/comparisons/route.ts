import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { withFallbackComparisons } from '@/lib/comparison-fallbacks';

export const revalidate = 60;

export async function GET() {
  try {
    const comparisons = await client.fetch(`
      *[_type == "comparison"]
        | order(coalesce(order, 999) asc, _createdAt asc) {
          _id,
          "brand": coalesce(brand, name, title, "Loyiha"),
          "oldImg": coalesce(oldImg.asset->url, beforeImage.asset->url),
          "newImg": coalesce(newImg.asset->url, afterImage.asset->url),
          "oldHint": coalesce(oldHint, "Before"),
          "newHint": coalesce(newHint, "After"),
          "order": coalesce(order, 999)
        }
    `);

    return NextResponse.json({ comparisons: withFallbackComparisons(comparisons) });
  } catch {
    return NextResponse.json({ comparisons: withFallbackComparisons([]) }, { status: 200 });
  }
}
