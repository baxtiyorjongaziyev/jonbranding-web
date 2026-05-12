import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const revalidate = 60;

export async function GET() {
  try {
    const comparisons = await client.fetch(`
      *[_type == "comparison" && defined(oldImg.asset) && defined(newImg.asset)]
        | order(coalesce(order, 999) asc, _createdAt asc) {
          _id,
          "brand": coalesce(brand, "Brand case"),
          "oldImg": oldImg.asset->url,
          "newImg": newImg.asset->url,
          "oldHint": coalesce(oldHint, "Before"),
          "newHint": coalesce(newHint, "After"),
          "order": coalesce(order, 999)
        }
    `);

    return NextResponse.json({ comparisons });
  } catch {
    return NextResponse.json({ comparisons: [] }, { status: 200 });
  }
}
