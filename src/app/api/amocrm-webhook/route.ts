import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { timingSafeEqual } from '@/lib/utils';

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

  const providedSecret = request.headers.get('x-jonbranding-webhook-secret') || '';
  return timingSafeEqual(providedSecret, expectedSecret);
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

    if (!rateLimit(`amocrm:${ip}`, 20, 60_000)) {
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
