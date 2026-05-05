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



function escapeHtml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
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
- Ism: ${fullName || 'Noma\'lum'}
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
        const payload = [
            {
                name: `🔥 Lead: ${fullName || 'Noma\'lum'} [${source || 'web'}]`,
                price: Number(totalPrice) || 0,
                custom_fields_values: [
                    {
                        field_code: 'SOURCE',
                        values: [{ value: source || 'website' }]
                    }
                ],
                _embedded: {
                    contacts: [
                        {
                            first_name: fullName || 'Noma\'lum',
                            custom_fields_values: [
                                ...(phone ? [{
                                    field_code: 'PHONE',
                                    values: [{ value: phone, enum_code: 'WORK' }]
                                }] : []),
                                ...(telegram ? [{
                                    field_code: 'IM',
                                    values: [{ value: telegram.replace('@', ''), enum_code: 'TELEGRAM' }]
                                }] : []),
                            ]
                        }
                    ]
                }
            }
        ];

        console.log('📤 Sending to AmoCRM:', JSON.stringify(payload));

        const createResponse = await fetch(`https://${domain}.amocrm.ru/api/v4/leads/complex`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        const createResult = await createResponse.json();
        
        if (!createResponse.ok) {
             console.error('❌ AmoCRM Lead Creation Error Status:', createResponse.status);
             console.error('❌ AmoCRM Lead Creation Error Body:', JSON.stringify(createResult));
             return;
        }

        const leadId = createResult?.[0]?.id;
        
        if (leadId) {
             const noteResponse = await fetch(`https://${domain}.amocrm.ru/api/v4/leads/${leadId}/notes`, {
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
             
             if (noteResponse.ok) {
                console.log('✅ Lead and Note synced to AmoCRM, Lead ID:', leadId);
             } else {
                console.warn('⚠️ Lead created but Note failed to sync. Lead ID:', leadId);
             }
        }
    } catch (e) {
        console.error('❌ AmoCRM sync exception:', e);
    }
}

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
        console.error("Missing Telegram configuration");
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
        
        // Escape fields for Telegram HTML
        const eName = escapeHtml(fullName);
        const ePhone = escapeHtml(phone);
        const eTg = telegram ? escapeHtml(telegram.replace('@', '')) : '';
        const eRole = escapeHtml(role);
        const eRev = escapeHtml(revenue);
        const eAmb = escapeHtml(ambition);
        const ePain = escapeHtml(pain);
        const eBud = escapeHtml(budget);
        const eSummary = escapeHtml(packageSummary);

        let telegramMessage = '';

        if (packageSummary && packageSummary.includes("Yangi patent arizasi")) {
            telegramMessage = `
<b>🔔 Yangi patent arizasi (Jon.Branding)</b>

${eSummary.replace('Brend:', `🏢 Brend:`).replace('Faoliyat turlari:', `📄 Faoliyat turlari:`)}

👤 <b>Ism:</b> ${eName}
📞 <b>Telefon:</b> ${ePhone}
            `.trim();

        } else if (packageSummary && packageSummary.includes("Brending-test natijasi")) {
            telegramMessage = `
<b>📝 Yangi Quiz Natijasi (Jon.Branding)</b>

<b>Mijoz:</b> ${eName}
<b>Telefon:</b> ${ePhone}
<b>Natija:</b> ${eSummary}
`.trim();
        } else {
            telegramMessage = `
🔥 <b>Yangi Kvalifikatsiyalangan Lead!</b>
🌍 Til: #${lang?.toUpperCase() || 'UZ'} | 🚀 Manba: #${source || 'website'} ${source?.includes('lead_magnet') ? '#LeadMagnet' : ''}

👤 <b>MIJOZ MA'LUMOTLARI:</b>
├ 📛 Ism: ${eName}
├ 📞 Tel: ${ePhone}
└ ✈️ TG: ${eTg ? '@' + eTg : 'Noma\'lum'}

🏢 <b>BIZNES SNAPSHOT:</b>
├ 🎭 Rol: ${eRole || 'Kiritilmagan'}
├ 💰 Oborot: ${eRev || 'Kiritilmagan'}
├ 🎯 Maqsad: ${eAmb || 'Kiritilmagan'}
└ ⚠️ To'siq: ${ePain || 'Kiritilmagan'}

💸 <b>INVESTITSIYA:</b>
└ 💴 Byudjet: ${eBud || 'Kiritilmagan'}

${eSummary ? `--- \n📦 Paket: ${eSummary} \n💰 Narx: ${totalPrice?.toLocaleString('fr-FR')} so'm` : ''}

#LeadQuality #StrategicSession
            `.trim();
        }

        // Prepare all integration tasks
        const integrationTasks = [
            // 1. Telegram Notification (Most immediate feedback)
            (async () => {
                try {
                    const telegramPayload: any = { 
                        chat_id: chatId, 
                        text: telegramMessage,
                        parse_mode: 'HTML',
                        disable_web_page_preview: true
                    };
                    if (messageThreadId) telegramPayload.message_thread_id = messageThreadId;
                    
                    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(telegramPayload),
                    });

                    if (!tgRes.ok) {
                        const tgErr = await tgRes.json();
                        console.error('❌ Telegram Notification Failed:', tgErr);
                    } else {
                        console.log('✅ Telegram Notification Sent');
                    }
                } catch (e) {
                    console.error('❌ Telegram Exception:', e);
                }
            })(),

            // 2. AmoCRM Integration
            sendToAmoCRM(body),

            // 3. Analytics & Marketing
            sendMetaConversionEvent(body),
            sendGAConversionEvent(body)
        ];

        // Run all integrations in parallel without blocking the main response
        // We use allSettled to ensure that even if one fails, others finish
        // We also don't 'await' the whole block if we want ultra-fast response, 
        // but for lead reliability, we await them to ensure they at least started.
        await Promise.allSettled(integrationTasks);

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        console.error('❌ POST handler error:', error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
