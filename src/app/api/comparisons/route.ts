import { NextResponse } from 'next/server';
import { fetchComparisons } from '@/lib/data/comparisons';

export const revalidate = 60;

export async function GET() {
  const comparisons = await fetchComparisons();
  return NextResponse.json({ comparisons });
}
