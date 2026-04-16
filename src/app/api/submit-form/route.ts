import { NextResponse } from 'next/server';

const UZS_TO_USD_RATE = 1 / 12700;

async function sendMetaConversionEvent(data: any) {
    const accessToken = process.env.META_API_ACCESS_TOKEN;
    const pixelId = '1134785364752294';
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
    const gaMeasurementId = 'G-B3ZSKB40XY';
    if (!gaApiSecret) return;

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
    const n8nWebhookUrl = 'https://n8n-automation-agent-982617914297.us-central1.run.app/webhook/lead-capture';
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
             throw new Error(JSON.stringify(createResult));
        }

        const leadId = createResult?.[0]?.id;
        
        if (leadId) {
             // Step 2: Add Note to Lead
             await fetch(`https://${domain}.amocrm.ru/api/v4/leads/${leadId}/notes`, {
                 method: 'POST',
                 headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' 
                 },
                 body: JSON.stringify([
                     {
                         note_type: 'common',
                         params: {
                             text: note
                         }
                     }
                 ])
             });
             console.log('✅ Lead and Note synced to AmoCRM natively, Lead ID:', leadId);
        }
    } catch (e) {
        console.error('❌ AmoCRM sync error:', e);
    }
}

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
        return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { 
            fullName, phone, telegram, 
            role, revenue, ambition, pain, budget, 
            source, lang, packageSummary, totalPrice 
        } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
        }
        
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

        sendMetaConversionEvent(body).catch(() => {});
        sendGAConversionEvent(body).catch(() => {});
        sendToN8n(body).catch(() => {});
        sendToAmoCRM(body).catch(() => {});

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
