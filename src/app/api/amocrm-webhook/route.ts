import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { safeCompare } from '@/lib/security';
import { logger } from '@/lib/logger';
import {
  createPayoutIfAbsent,
  findReferralByLeadId,
  markReferralLost,
  markReferralWon,
} from '@/lib/affiliate/store';
import { serviceFromHint, type PayoutService } from '@/lib/affiliate/payouts';
import { amoCrmLeadUrl, escapeTelegramHtml, readWebhookBody } from '@/lib/amocrm-webhook';

function parseStatusIds(raw: string | undefined): Set<number> {
  return new Set(
    String(raw || '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n)),
  );
}

async function notifyAffiliateBonus(text: string) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const c = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!t || !c) return;
  await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: c, text, parse_mode: 'HTML' }),
  }).catch(() => {});
}

async function processAffiliatePayouts(body: any) {
  const wonIds = parseStatusIds(process.env.AMOCRM_WON_STATUS_ID);
  const lostIds = parseStatusIds(process.env.AMOCRM_LOST_STATUS_ID);
  if (wonIds.size === 0 && lostIds.size === 0) return;

  const allLeadEvents = [
    ...(Array.isArray(body?.leads?.status) ? body.leads.status : []),
    ...(Array.isArray(body?.leads?.update) ? body.leads.update : []),
  ];
  const MAX_LEAD_EVENTS = 50;
  if (allLeadEvents.length > MAX_LEAD_EVENTS) {
    logger.warn('amoCRM webhook lead batch exceeds cap, truncating', {
      total: allLeadEvents.length,
      cap: MAX_LEAD_EVENTS,
    });
  }
  const leadEvents = allLeadEvents.slice(0, MAX_LEAD_EVENTS);

  for (const lead of leadEvents) {
    const leadId = Number(lead?.id);
    const statusId = Number(lead?.status_id);
    if (!Number.isFinite(leadId) || !Number.isFinite(statusId)) continue;

    const isWon = wonIds.has(statusId);
    const isLost = lostIds.has(statusId);
    if (!isWon && !isLost) continue;

    const referral = await findReferralByLeadId(leadId);
    if (!referral) continue;

    if (isLost) {
      if (referral.status !== 'lost') await markReferralLost(referral.id);
      continue;
    }

    // isWon
    if (referral.status === 'won') continue; // idempotent

    const service = serviceFromHint(referral.serviceHint) as PayoutService | null;

    if (!service) {
      // Unknown/unmapped service hint (e.g. localized package text that
      // doesn't tokenize to a known calculator ID) — do NOT guess the
      // most expensive tier. Mark won so the deal isn't lost, but skip
      // automatic payout creation and flag it for a human to resolve.
      await markReferralWon(referral.id);
      logger.warn('Affiliate referral won with unmapped service hint — no automatic payout', {
        referralId: referral.id,
        serviceHint: referral.serviceHint,
      });
      await notifyAffiliateBonus(
        `<b>⚠️ Hamkor bonusi — qo'lda tekshirish kerak</b>\nReferral: ${escapeTelegramHtml(referral.leadName)}\nXizmat aniqlanmadi: ${escapeTelegramHtml(referral.serviceHint || '(bo\'sh)')}\nBonusni admin panelda qo'lda hisoblang.`,
      );
      continue;
    }

    const payout = await createPayoutIfAbsent({
      referralId: referral.id,
      affiliateId: referral.affiliateId,
      service,
    });

    await markReferralWon(referral.id);

    if (payout) {
      await notifyAffiliateBonus(
        `<b>💰 Hamkor bonusi</b>\nReferral: ${escapeTelegramHtml(referral.leadName)}\nXizmat: ${service}\nSumma: ${payout.amount.toLocaleString('fr-FR')} so'm\nHolat: to'lanmagan`,
      );
    }
  }
}

const ALLOWED_ORIGINS = new Set([
  'https://www.jonbranding.uz',
  'https://jonbranding.uz',
  'https://jonbranding-web--jonbranding-85662071-ea38e.us-central1.hosted.app',
]);

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://www.jonbranding.uz',
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-JonBranding-Webhook-Secret',
  };
}

function isAuthorizedWebhook(request: Request) {
  const expectedSecret = process.env.AMOCRM_WEBHOOK_SECRET?.trim();
  if (!expectedSecret) {
    logger.error('AMOCRM_WEBHOOK_SECRET is not set. Rejecting webhook for security.');
    return false;
  }

  // amoCRM webhook sozlamasida faqat URL bor, header qo'shib bo'lmaydi —
  // shuning uchun sir `?secret=` orqali ham qabul qilinadi.
  const providedSecret =
    request.headers.get('x-jonbranding-webhook-secret') ||
    new URL(request.url).searchParams.get('secret');
  if (!providedSecret) return false;

  return safeCompare(providedSecret, expectedSecret);
}

// Handle preflight requests for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request);
  const ip = getClientIp(request);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Sotuv jamoasi bir vaqtda ko'p sdelkani ko'chirsa, amoCRM ketma-ket
  // yuboradi. Past limit 429 beradi, amoCRM esa xato beruvchi webhook'ni o'chiradi.
  if (!(await rateLimit(`amocrm:${ip}`, 120, 60_000))) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests' },
      { status: 429, headers: corsHeaders },
    );
  }

  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized webhook' },
      { status: 401, headers: corsHeaders },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await readWebhookBody(request);
  } catch (error) {
    logger.warn('amoCRM webhook body could not be parsed', {
      reason: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400, headers: corsHeaders });
  }

  try {
    await processAffiliatePayouts(body);
  } catch (error) {
    logger.error('Affiliate payout processing failed', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  if (!botToken || !chatId) {
    logger.error('amoCRM webhook: Telegram bot token or chat ID is missing. Affiliate processing still ran; notification skipped.');
    // amoCRM'ga doim 2xx qaytariladi — aks holda u webhook'ni o'chirib qo'yadi.
    return NextResponse.json(
      { ok: true, message: 'Webhook processed, Telegram is not configured.' },
      { headers: corsHeaders },
    );
  }

  const leads = (body as { leads?: { add?: unknown[]; status?: unknown[] } }).leads;
  const lead = (leads?.add?.[0] || leads?.status?.[0]) as
    | { id?: unknown; name?: unknown; status_id?: unknown; price?: unknown }
    | undefined;

  if (!lead) {
    return NextResponse.json(
      { ok: true, message: 'Webhook received, but no lead data to process.' },
      { headers: corsHeaders },
    );
  }

  const leadUrl = amoCrmLeadUrl(lead.id, process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN);
  const telegramMessage = [
    '📢 <b>amoCRM: yangi voqea</b>',
    '',
    `<b>Sdelka:</b> ${escapeTelegramHtml(lead.name || "Nomi yo'q")}`,
    `<b>Status:</b> ${lead.status_id ? `ID ${escapeTelegramHtml(lead.status_id)}` : "noma'lum"}`,
    `<b>Narxi:</b> ${lead.price ? `${escapeTelegramHtml(lead.price)} so'm` : 'kiritilmagan'}`,
    ...(leadUrl ? ['', `🔗 <a href="${leadUrl}">Sdelkani ochish</a>`] : []),
  ].join('\n');

  // Serverless'da javob qaytgach jarayon to'xtatilishi mumkin — shuning uchun kutamiz.
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    logger.error('Telegram API error (amoCRM webhook)', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.json(
    { ok: true, message: 'Webhook processed successfully.' },
    { headers: corsHeaders },
  );
}
