import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const leadSchema = z.object({
    fullName: z.string().min(2).max(100),
    phone: z.string().min(7).max(20).regex(/^[+\d\s\-()]+$/),
    telegram: z.string().max(50).optional(),
    role: z.string().max(100).optional(),
    revenue: z.string().max(100).optional(),
    ambition: z.string().max(500).optional(),
    pain: z.string().max(500).optional(),
    budget: z.string().max(100).optional(),
    source: z.string().max(100).optional(),
    lang: z.enum(['uz', 'ru', 'en', 'zh']).optional(),
    packageSummary: z.string().max(2000).optional(),
    totalPrice: z.number().nonnegative().optional(),
});

const UZS_TO_USD_RATE = 1 / 12700;

async function sendMetaConversionEvent(data: any) {
    const accessToken = process.env.META_API_ACCESS_TOKEN;
    const pixelId = process.env.META_PIXEL_ID;
    if (!accessToken || !pixelId) return;

    const url = `https://graph.facebook.com/v20.0/${pixelId}/events`;
    const valueInUzs = data.totalPrice || 0;
    const valueInUsd = (valueInUzs * UZS_TO_USD_RATE).toFixed(2);

    const payload = {
        data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
                ph: data.phone ? [data.phone] : [],
                fn: data.fullName ? [data.fullName] : [],
            },
            custom_data: {
                value: valueInUsd,
                currency: 'USD',
            }
        }],
        access_token: accessToken,
    };
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
    } catch (e) {
        console.error('Meta CAPI error:', e);
    }
}

async function sendGAConversionEvent(data: any) {
    const gaApiSecret = process.env.GA_API_SECRET;
    const gaMeasurementId = process.env.GA_MEASUREMENT_ID;
    if (!gaApiSecret || !gaMeasurementId) return;

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${gaMeasurementId}&api_secret=${gaApiSecret}`;
    const payload = {
        client_id: data.phone || data.fullName || 'unknown',
        events: [{
            name: 'generate_lead',
            params: {
                value: data.totalPrice || 0,
                currency: 'UZS',
            }
        }],
    };

    try {
        await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
    } catch (e) {
        console.error('GA4 error:', e);
    }
}

async function sendToN8n(data: any) {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) return;
    try {
        await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                source: data.source || 'website_contact_form',
                timestamp: new Date().toISOString()
            }),
        });
    } catch (e) {
        console.error('n8n error:', e);
    }
}

async function sendToAmoCRM(data: any) {
    const domain = process.env.AMOCRM_DOMAIN;
    const accessToken = process.env.AMOCRM_ACCESS_TOKEN;
    
    if (!domain || !accessToken) {
        console.error('AmoCRM integration skipped: AMOCRM_DOMAIN or AMOCRM_ACCESS_TOKEN missing');
        return;
    }

    const { 
        fullName, phone, telegram, 
        role, revenue, ambition, pain, budget, 
        source, lang, packageSummary, totalPrice 
    } = data;

    const note = `
🎯 Strategic Session Form Result:

👤 MIJOZ:
- Telefon: ${phone || 'Noma\'lum'}
- Telegram: ${telegram ? '@' + telegram.replace('@', '') : 'Noma\'lum'}

🏢 BIZNES SNAPSHOT:
- Rol: ${role || 'Kiritilmagan'}
- Oborot: ${revenue || 'Kiritilmagan'}
- Maqsad: ${ambition || 'Kiritilmagan'}
- To'siq: ${pain || 'Kiritilmagan'}

💸 INVESTITSIYA:
- Byudjet: ${budget || 'Kiritilmagan'}

${packageSummary ? `--- \n📦 Paket: ${packageSummary} \n💰 Narx: ${totalPrice?.toLocaleString('fr-FR')} so'm` : ''}

🌍 Til: ${lang?.toUpperCase() || 'UZ'}
🚀 Manba: ${source || 'website'}
    `.trim();

    try {
        // Step 1: Create Lead + Contact using /leads/complex
        const createResponse = await fetch(`https://${domain}.amocrm.ru/api/v4/leads/complex`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify([
                {
                    name: `Yangi So'rov: ${fullName} (${source || 'website'})`,
                    price: totalPrice || 0,
                    _embedded: {
                        contacts: [
                            {
                                first_name: fullName
                            }
                        ]
                    }
                }
            ]),
        });

        const createResult = await createResponse.json();
        
        if (!createResponse.ok) {
            const isAuthError = createResponse.status === 401;
            if (isAuthError) {
                await notifyAmoCRMTokenExpired(domain);
            }
            throw new Error(JSON.stringify(createResult));
        }

        const leadId = createResult?.[0]?.id;

        if (leadId) {
            await fetch(`https://${domain}.amocrm.ru/api/v4/leads/${leadId}/notes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{ note_type: 'common', params: { text: note } }])
            });
        }
    } catch (e: any) {
        console.error('❌ AmoCRM sync error:', e);
    }
}

async function notifyAmoCRMTokenExpired(domain: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `🚨 AmoCRM TOKEN ESKIRDI!\n\nDomen: ${domain}.amocrm.ru\n\nLead saqlanmadi! Token'ni yangilang: https://${domain}.amocrm.ru/oauth`,
            parse_mode: 'HTML',
        }),
    }).catch(() => {});
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (!rateLimit(ip, 5, 60_000)) {
        return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
        return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
    }

    try {
        const raw = await request.json();
        const parsed = leadSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json({ ok: false, error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
        }
        const { fullName, phone, telegram, role, revenue, ambition, pain, budget, source, lang, packageSummary, totalPrice } = parsed.data;
        
        let telegramMessage = '';

        if (packageSummary && packageSummary.includes("Yangi patent arizasi")) {
            telegramMessage = `
<b>🔔 Yangi patent arizasi (Jon.Branding)</b>

${packageSummary.replace('Brend:', `🏢 Brend:`).replace('Faoliyat turlari:', `📄 Faoliyat turlari:`)}

👤 <b>Ism:</b> ${fullName}
📞 <b>Telefon:</b> ${phone}
            `.trim();

        } else if (packageSummary && packageSummary.includes("Brending-test natijasi")) {
            telegramMessage = `
<b>📝 Yangi Quiz Natijasi (Jon.Branding)</b>

<b>Mijoz:</b> ${fullName}
<b>Telefon:</b> ${phone}
<b>Natija:</b> ${packageSummary}
`.trim();
        } else {
            telegramMessage = `
🔥 <b>Yangi Kvalifikatsiyalangan Lead!</b>
🌍 Til: #${lang?.toUpperCase() || 'UZ'} | 🚀 Manba: #${source || 'website'} ${source?.includes('lead_magnet') ? '#LeadMagnet' : ''}

👤 <b>MIJOZ MA'LUMOTLARI:</b>
├ 📛 Ism: ${fullName}
├ 📞 Tel: ${phone}
└ ✈️ TG: ${telegram ? '@' + telegram.replace('@', '') : 'Noma\'lum'}

🏢 <b>BIZNES SNAPSHOT:</b>
├ 🎭 Rol: ${role || 'Kiritilmagan'}
├ 💰 Oborot: ${revenue || 'Kiritilmagan'}
├ 🎯 Maqsad: ${ambition || 'Kiritilmagan'}
└ ⚠️ To'siq: ${pain || 'Kiritilmagan'}

💸 <b>INVESTITSIYA:</b>
└ 💴 Byudjet: ${budget || 'Kiritilmagan'}

${packageSummary ? `--- \n📦 Paket: ${packageSummary} \n💰 Narx: ${totalPrice?.toLocaleString('fr-FR')} so'm` : ''}

#LeadQuality #StrategicSession
            `.trim();
        }

        const telegramPayload: any = { 
            chat_id: chatId, 
            text: telegramMessage,
            parse_mode: 'HTML'
        };
        if (messageThreadId) telegramPayload.message_thread_id = messageThreadId;
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramPayload),
        });

        sendMetaConversionEvent(parsed.data).catch(() => {});
        sendGAConversionEvent(parsed.data).catch(() => {});
        sendToN8n(parsed.data).catch(() => {});
        sendToAmoCRM(parsed.data).catch(() => {});

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
