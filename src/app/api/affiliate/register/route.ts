import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { affiliateRegisterSchema } from '@/lib/affiliate/schema';
import { generatePromoCode } from '@/lib/affiliate/promo-code';
import {
  createAffiliate,
  findAffiliateByPhone,
  isPromoCodeTaken,
} from '@/lib/affiliate/store';
import { logger } from '@/lib/logger';

function cleanSecret(value: string | undefined) {
  return String(value || '').replace(/^\uFEFF/, '').trim();
}

async function notifyAdmin(text: string) {
  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID);
  if (!botToken || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch (error) {
    logger.error('Affiliate admin notify failed', { reason: error instanceof Error ? error.message : String(error) });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`affiliate-register:${ip}`, 5, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid', details: 'bad json' }, { status: 400 });
  }

  const parsed = affiliateRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid', details: parsed.error.format() }, { status: 400 });
  }

  const { fullName, phone, telegramUsername } = parsed.data;

  try {
    const existing = await findAffiliateByPhone(phone);
    if (existing) {
      return NextResponse.json({
        ok: true,
        promoCode: existing.promoCode,
        accessUrl: `/hamkor/${existing.accessToken}`,
      });
    }

    const promoCode = await generatePromoCode(fullName, isPromoCodeTaken);
    const accessToken = randomBytes(16).toString('hex');

    const created = await createAffiliate({ fullName, phone, telegramUsername, promoCode, accessToken });
    if (!created) {
      return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
    }

    await notifyAdmin(
      `<b>Yangi hamkor</b>\nIsm: ${fullName}\nPromokod: <code>${created.promoCode}</code>\nTelefon: ${phone}${
        telegramUsername ? `\nTelegram: @${telegramUsername}` : ''
      }`,
    );

    return NextResponse.json({
      ok: true,
      promoCode: created.promoCode,
      accessUrl: `/hamkor/${created.accessToken}`,
    });
  } catch (error) {
    logger.error('Affiliate register failed', { reason: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }
}
