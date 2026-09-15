import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { findAffiliateByPromoCode } from '@/lib/affiliate/store';
import { logger } from '@/lib/logger';

// Public, read-only endpoint used by the pricing calculator to recognize
// dynamically-generated affiliate promo codes (e.g. "SHERBEK") in addition
// to the static VALID_PROMO_CODES list in pricing.ts. Intentionally returns
// only a boolean — never the affiliate's name, phone, or dashboard token.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`affiliate-validate-code:${ip}`, 20, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const code = String((body as any)?.code || '').trim().toUpperCase();
  if (!code || code.length > 40) {
    return NextResponse.json({ ok: true, valid: false });
  }

  try {
    const affiliate = await findAffiliateByPromoCode(code);
    return NextResponse.json({ ok: true, valid: Boolean(affiliate) });
  } catch (error) {
    logger.error('Affiliate code validation failed', {
      reason: error instanceof Error ? error.message : String(error),
    });
    // Fail closed on the calculator side (no discount), but don't error the request.
    return NextResponse.json({ ok: true, valid: false });
  }
}
