import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in the environment variables for amoCRM webhook.");
        // Even on server error, return a CORS-friendly response
        return NextResponse.json(
            { ok: false, error: "Serverda Telegram sozlamalari mavjud emas." },
            { 
                status: 500,
                headers: CORS_HEADERS,
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
                { headers: CORS_HEADERS }
            );
        }

        const leadName = lead.name || 'Nomi yo\'q';
        const leadId = lead.id;
        const status = lead.status_id ? `Status ID: ${lead.status_id}` : 'Statusi noma\'lum';
        const price = lead.price ? `${lead.price} so'm` : 'Narxi kiritilmagan';
        
        const amocrmSubdomain = process.env.AMOCRM_SUBDOMAIN || 'your-subdomain';
        const leadUrl = `https://${amocrmSubdomain}.amocrm.ru/leads/detail/${leadId}`;


        const telegramMessage = `
📢 Yangi voqea (AmoCRM Webhook)

Sdelka: "${leadName}"
Status: ${status}
Narxi: ${price}

🔗 Sdelkani ko'rish: ${leadUrl}
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
            { headers: CORS_HEADERS }
        );

    } catch (error: any) {
        console.error("Error processing amoCRM webhook:", error);
        return NextResponse.json(
            { ok: false, error: "Webhook'ni qayta ishlashda ichki xatolik." }, 
            { 
                status: 500,
                headers: CORS_HEADERS,
            }
        );
    }
}
