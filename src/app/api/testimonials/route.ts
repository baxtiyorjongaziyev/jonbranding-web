import { NextRequest, NextResponse } from 'next/server';
import {
  syncTelegramTestimonials, readCachedTestimonials, syncAndProcessMedia, processPostMedia
} from '@/lib/telegram-testimonials';
import { staticTestimonials, staticTestimonialsRu, staticTestimonialsEn, staticTestimonialsZh } from '@/lib/static-data';
import { safeCompare } from '@/lib/security';

const CRON_SECRET = process.env.CRON_SECRET || process.env.AMOCRM_CRON_SECRET || '';

const FALLBACKS: Record<string, typeof staticTestimonials> = {
  uz: staticTestimonials,
  ru: staticTestimonialsRu,
  en: staticTestimonialsEn,
  zh: staticTestimonialsZh,
};

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang') || 'uz';
  const fallback = FALLBACKS[lang] || staticTestimonials;

  const telegram = readCachedTestimonials();

  const merged = [...telegram];

  for (const fb of fallback) {
    const exists = merged.some(
      (t) => t.name === fb.name && t.company === fb.company
    );
    if (!exists) merged.push(fb);
  }

  return NextResponse.json({ testimonials: merged });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const isAuthorized = Boolean(CRON_SECRET) && Boolean(bearerToken) && safeCompare(bearerToken!, CRON_SECRET);
  const secret = req.nextUrl.searchParams.get('secret');
  const isSecretValid = Boolean(CRON_SECRET) && Boolean(secret) && safeCompare(secret!, CRON_SECRET);

  if (!isAuthorized && !isSecretValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get('mode') || 'sync';

  if (mode === 'process-media') {
    const result = await syncAndProcessMedia();
    return NextResponse.json({ success: true, ...result });
  }

  const result = await syncTelegramTestimonials();
  return NextResponse.json({ success: true, ...result });
}
