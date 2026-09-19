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
        `<b>⚠️ Hamkor bonusi — qo'lda tekshirish kerak</b>\nReferral: ${referral.leadName}\nXizmat aniqlanmadi: ${referral.serviceHint || '(bo\'sh)'}\nBonusni admin panelda qo'lda hisoblang.`,
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
        `<b>💰 Hamkor bonusi</b>\nReferral: ${referral.leadName}\nXizmat: ${service}\nSumma: ${payout.amount.toLocaleString('fr-FR')} so'm\nHolat: to'lanmagan`,
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
    console.error("CRITICAL: AMOCRM_WEBHOOK_SECRET is not set. Rejecting webhook for security.");
    return false;
  }

  const providedSecret = request.headers.get('x-jonbranding-webhook-secret');
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

    if (!(await rateLimit(`amocrm:${ip}`, 20, 60_000))) {
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

    try {
        const body = await request.json();

        try {
          await processAffiliatePayouts(body);
        } catch (error) {
          logger.error('Affiliate payout processing failed', {
            reason: error instanceof Error ? error.message : String(error),
          });
        }

        if (!botToken || !chatId) {
            logger.error('amoCRM webhook: Telegram bot token or chat ID is missing in environment variables. Affiliate processing still ran; notification skipped.');
            // Per the global constraint, this webhook must always return 200 to amoCRM —
            // affiliate payout processing above must not be blocked by a broken notification channel.
            return NextResponse.json(
                { ok: true, message: "Webhook processed, but Telegram sozlamalari mavjud emas." },
                { headers: corsHeaders }
            );
        }

        // Extract relevant data from the webhook payload.
        // AmoCRM's payload structure can be complex, so we'll look for the newest lead.
        const lead = body?.leads?.add?.[0] || body?.leads?.status?.[0];

        if (!lead) {
            // If no lead data is found, it might be a test or other type of webhook.
            // We'll just return a success response.
             return NextResponse.json(
                { ok: true, message: "Webhook received, but no lead data to process." },
                { headers: corsHeaders }
            );
        }

        const leadName = lead.name || 'Nomi yo\'q';
        const leadId = lead.id;
        const status = lead.status_id ? `Status ID: ${lead.status_id}` : 'Statusi noma\'lum';
        const price = lead.price ? `${lead.price} so'm` : 'Narxi kiritilmagan';
        
        const amocrmSubdomain = process.env.AMOCRM_SUBDOMAIN || 'your-subdomain';
        const leadUrl = `https://${amocrmSubdomain}.amocrm.ru/leads/detail/${leadId}`;


        const telegramMessage = `
ðŸ“¢ Yangi voqea (AmoCRM Webhook)

Sdelka: "${leadName}"
Status: ${status}
Narxi: ${price}

ðŸ”— Sdelkani ko'rish: ${leadUrl}
        `.trim();
        
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        // Send notification to Telegram but don't wait for the response
        fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: telegramMessage,
                parse_mode: 'Markdown'
            }),
        }).catch(e => console.error("Telegram API Error (from amoCRM webhook):", e));

        // IMPORTANT: AmoCRM requires a 2xx response with a valid JSON body.
        return NextResponse.json(
            { ok: true, message: "Webhook processed successfully." },
            { headers: corsHeaders }
        );

    } catch (error: any) {
        console.error("Error processing amoCRM webhook:", error);
        return NextResponse.json(
            { ok: false, error: "Webhook'ni qayta ishlashda ichki xatolik." }, 
            { 
                status: 500,
                headers: corsHeaders,
            }
        );
    }
}
