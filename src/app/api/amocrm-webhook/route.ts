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

  const leadEvents = [
    ...(Array.isArray(body?.leads?.status) ? body.leads.status : []),
    ...(Array.isArray(body?.leads?.update) ? body.leads.update : []),
  ];

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

    await markReferralWon(referral.id);

    const service = (serviceFromHint(referral.serviceHint) ?? 'full_branding') as PayoutService;
    const payout = await createPayoutIfAbsent({
      referralId: referral.id,
      affiliateId: referral.affiliateId,
      service,
    });
    if (payout) {
      await notifyAffiliateBonus(
        `<b>💰 Hamkor bonusi</b>\nReferral: ${referral.leadName}\nXizmat: ${service}\nSumma: ${payout.amount.toLocaleString('fr-FR')} so'm\nHolat: to'lanmagan`,
      );
    }
  }
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

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

    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in the environment variables for amoCRM webhook.");
        // Even on server error, return a CORS-friendly response
        return NextResponse.json(
            { ok: false, error: "Serverda Telegram sozlamalari mavjud emas." },
            { 
                status: 500,
                headers: corsHeaders,
            }
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
