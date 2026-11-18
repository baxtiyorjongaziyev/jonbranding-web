import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  isAuthorizedRevalidateRequest,
  revalidateSanityContent,
  type RevalidatePayload,
} from '@/lib/revalidate-sanity';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isAuthorizedRevalidateRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let payload: RevalidatePayload = {};
  try {
    const raw = await request.text();
    if (raw.trim()) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        payload = parsed as RevalidatePayload;
      }
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  try {
    const revalidated = revalidateSanityContent(payload);
    logger.info('[api/revalidate] Marked Sanity content stale', {
      type: payload._type ?? 'all',
      tags: revalidated.tags,
      pathCount: revalidated.paths.length,
    });
    return NextResponse.json({ ok: true, ...revalidated });
  } catch (error) {
    logger.error('[api/revalidate] Failed to revalidate tags/paths:', error);
    return NextResponse.json({ ok: false, error: 'Revalidation failed' }, { status: 500 });
  }
}
