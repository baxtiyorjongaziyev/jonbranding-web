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
import { escapeTelegramHtml } from '@/lib/telegram-html';

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
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const { fullName, phone, telegramUsername } = parsed.data;

  try {
    const existing = await findAffiliateByPhone(phone);
    if (existing) {
      // Do NOT return promoCode/accessUrl here: anyone who knows a partner's
      // phone number could otherwise submit it to this public endpoint and
      // receive that partner's private dashboard token. Notify the existing
      // owner out-of-band instead, and tell the caller they're already registered.
      await notifyAdmin(
        `<b>Hamkor qayta ro'yxatdan o'tishga urindi</b>\nPromokod: <code>${escapeTelegramHtml(existing.promoCode)}</code>\nTelefon: ${escapeTelegramHtml(phone)}\nHavolani hamkorga admin panel orqali yuboring.`,
      );
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    const promoCode = await generatePromoCode(fullName, isPromoCodeTaken);
    const accessToken = randomBytes(16).toString('hex');

    const created = await createAffiliate({ fullName, phone, telegramUsername, promoCode, accessToken });
    if (!created) {
      // A concurrent request may have just inserted this phone (unique constraint) — check before failing.
      const concurrent = await findAffiliateByPhone(phone);
      if (concurrent) {
        return NextResponse.json({ ok: true, alreadyRegistered: true });
      }
      return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
    }

    await notifyAdmin(
      `<b>Yangi hamkor</b>\nIsm: ${escapeTelegramHtml(fullName)}\nPromokod: <code>${escapeTelegramHtml(created.promoCode)}</code>\nTelefon: ${escapeTelegramHtml(phone)}${
        telegramUsername ? `\nTelegram: @${escapeTelegramHtml(telegramUsername)}` : ''
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
