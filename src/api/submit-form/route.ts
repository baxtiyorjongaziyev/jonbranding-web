
import { NextResponse } from 'next/server';

const goalOptionsMap: Record<string, string> = {
    "Brending haqida ma'lumotga ega emasman, lekin biznesim uchun kerak.": "Brending haqida ma'lumotga ega emasman, lekin biznesim uchun kerak deb o'ylayman.",
    "Brendim bor, lekin u samarasiz, tahlil va maslahat kerak.": "Brendim bor, lekin u o'z samarasini bermayapti, tahlil va maslahat kerak.",
    "Brending kuchini tushunaman va aniq maqsad bilan keldim.": "Brending kuchini tushunaman va aniq maqsad bilan murojaat qilyapman.",
    exploring: "Brending haqida ma'lumotga ega emasman, lekin biznesim uchun kerak deb o'ylayman.",
    has_problem: "Brendim bor, lekin u o'z samarasini bermayapti, tahlil va maslahat kerak.",
    ready_to_start: "Brending kuchini tushunaman va aniq maqsad bilan murojaat qilyapman.",
};

const meetingPlaceMap: Record<string, string> = {
    our_office: "Jon.Branding ofisida",
    neutral: "Neytral hududda (kafe/restoran)",
    client_office: "Mijoz ofisida",
};

const pickTwoLabels: Record<string, string> = {
    cheap: 'Arzon',
    quality: 'Sifatli',
    fast: 'Tez',
};

const UZS_TO_USD_RATE = 1 / 12700;


async function sendMetaConversionEvent(data: any) {
    const accessToken = process.env.META_API_ACCESS_TOKEN;
    const pixelId = '1134785364752294';

    if (!accessToken || !pixelId) {
        console.warn("Meta Pixel ID or Access Token is not configured for server-side events.");
        return;
    }

    const url = `https://graph.facebook.com/v20.0/${pixelId}/events`;
    const eventId = `server-event-meta-${Date.now()}`;

    const valueInUzs = data.totalPrice || 0;
    const valueInUsd = (valueInUzs * UZS_TO_USD_RATE).toFixed(2);


    const payload = {
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_id: eventId,
                user_data: {
                    ph: data.phone ? [data.phone] : [],
                    fn: data.fullName ? [data.fullName] : [],
                },
                custom_data: {
                    value: valueInUsd,
                    currency: 'USD',
                }
            }
        ],
        access_token: accessToken,
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
           const errorData = await response.json();
           console.error('Failed to send Meta Conversion API event:', errorData);
        } else {
           console.log("Meta Conversion API event sent successfully.");
        }
    } catch (error) {
        console.error('Error sending Meta Conversion API event:', error);
    }
}

async function sendGAConversionEvent(data: any) {
    const gaApiSecret = process.env.GA_API_SECRET;
    const gaMeasurementId = 'G-B3ZSKB40XY';

    if (!gaApiSecret) {
        console.warn("Google Analytics API Secret is not configured for server-side events.");
        return;
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${gaMeasurementId}&api_secret=${gaApiSecret}`;
    const eventId = `server-event-ga-${Date.now()}`;
    
    const valueInUzs = data.totalPrice || 0;
    const clientIdentifier = data.phone || data.fullName || `client_${Date.now()}`;


    const payload = {
        client_id: clientIdentifier,
        events: [
            {
                name: 'purchase',
                params: {
                    transaction_id: eventId,
                    value: valueInUzs,
                    currency: 'UZS',
                    items: [{
                       item_id: data.packageSummary ? 'brending_package' : 'contact_form',
                       item_name: data.packageSummary || 'Standard Request',
                       price: valueInUzs,
                       quantity: 1
                    }]
                }
            }
        ],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
           const errorData = await response.text();
           console.error('Failed to send Google Analytics event:', response.status, errorData);
        } else {
           console.log("Google Analytics event sent successfully.");
        }
    } catch (error) {
        console.error('Error sending Google Analytics event:', error);
    }
}


export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;


    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in the environment variables.");
        return NextResponse.json({ ok: false, error: "Serverda Telegram sozlamalari mavjud emas." }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, telegram, notes, packageSummary, totalPrice, companyName, website, goal, budget, location, meetingPlace, pickTwoPreference } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ ok: false, error: "Ism va telefon raqam kiritilishi shart" }, { status: 400 });
        }
        
        let telegramMessage = '';

        if (packageSummary && packageSummary.includes("Yangi patent arizasi")) {
            // This is a patent calculator submission
            telegramMessage = `
${packageSummary.replace('Brend:', `🏢 Brend:`).replace('Faoliyat turlari:', `📄 Faoliyat turlari:`)}

👤 Ism: ${fullName}
📞 Telefon: ${phone}
            `.trim();

        } else if (packageSummary && packageSummary.includes("Brending-test natijasi")) {
            // This is a quiz submission
            const parts = packageSummary.split(' | ');
            const answersJsonString = parts[0].replace("Brending-test natijasi. Javoblar: ", "");
            const scoreString = parts[1] || "Ball: N/A";
            
            let formattedAnswers = '';
            try {
                const answersArray: string[] = JSON.parse(answersJsonString);
                formattedAnswers = answersArray.map((answer: string, index: number) => {
                    const answerText = answer.substring(answer.indexOf(':') + 2);
                    return `${index + 1}. ${answerText}`;
                }).join('\n');
            } catch (e) {
                console.error("Error parsing quiz answers:", e);
                formattedAnswers = "Javoblarni formatlashda xatolik yuz berdi.";
            }

            const totalScore = parseInt(scoreString.replace('Ball: ', ''));
            
            let resultCategory = '';
            let communicationScript = '';

            if (totalScore <= 8) {
                resultCategory = 'Zaif';
                communicationScript = `"Assalomu alaykum, ${fullName}. Ismim Baxtiyorjon, Jon.Branding agentligidan. Saytimizda brendingga tayyorlik bo'yicha mini-test topshirgan edingiz. Natijangiz ${resultCategory} chiqdi. Brendingiz poydevori hozircha zaif ko'rinadi. Raqobatchilardan ajralib turish va mijozlar mehrini qozonish uchun nimalar qilish kerakligi haqida sizga shaxsiy maslahatlar berish uchun qo'ng'iroq qilyapman. Vaqtingiz bormi?"`;
            } else if (totalScore <= 12) {
                resultCategory = 'O\'rta';
                communicationScript = `"Assalomu alaykum, ${fullName}. Ismim Baxtiyorjon, Jon.Branding agentligidan. Saytimizda brendingga tayyorlik bo'yicha mini-test topshirgan edingiz. Natijangiz ${resultCategory} chiqdi. Sizda yaxshi poydevor bor, lekin brendingizni yanada kuchliroq qilish uchun bir nechta bo'shliqlar mavjud. Shu haqida sizga shaxsiy maslahatlar berish uchun qo'ng'iroq qilyapman. Vaqtingiz bormi?"`;
            } else {
                resultCategory = 'A\'lo';
                 communicationScript = `"Assalomu alaykum, ${fullName}. Ismim Baxtiyorjon, Jon.Branding agentligidan. Saytimizda brendingga tayyorlik bo'yicha mini-test topshirganingizni ko'rdim. Tabriklayman, natijangiz ${resultCategory} chiqdi! Bu sizning brending borasida to'g'ri yo'lda ekaningizni ko'rsatadi. Endi bu poydevorni yanada mustahkamlab, bozor yetakchisiga aylanish uchun nimalarga e'tibor berish kerakligi haqida gaplashib olsak. Vaqtingiz bormi?"`;
            }

            const finalResultText = `Natija: ${resultCategory} (${totalScore} ball)`;


            telegramMessage = `
📝 Yangi Quiz Natijasi (Jon.Branding)

Mijoz: ${fullName}
Telefon: ${phone}
Telegram: ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}

${finalResultText}
---
Javoblar:
${formattedAnswers}
---
📞 ALOQA SKRIPTI:
${communicationScript}
`.trim();

        } else {
            // This is a standard contact/package submission
            let packageInfo = '';
            if (packageSummary && totalPrice !== undefined && totalPrice > 0) {
              packageInfo = `
---
🛒 Tanlangan xizmatlar xulosasi:
${packageSummary}

💰 Yakuniy narx: ${totalPrice.toLocaleString('fr-FR')} so'm
              `.trim();
            }

            let pickTwoInfo = '';
            if (pickTwoPreference && Array.isArray(pickTwoPreference) && pickTwoPreference.length > 0) {
                const translatedPreferences = pickTwoPreference.map(p => pickTwoLabels[p] || p).join(', ');
                pickTwoInfo = `
---
⚖️ Mijoz ustuvorliklari: ${translatedPreferences}
                `.trim();
            }
            
            const meetingType = (location === 'Toshkent' || location === 'Farg\'ona') ? 'OFLAYN' : 'ONLAYN';
            const goalText = goalOptionsMap[goal] || goal || 'Kiritilmagan';
            const meetingPlaceText = meetingPlace ? meetingPlaceMap[meetingPlace] || meetingPlace : 'Belgilanmagan';

            const projectDetails = `
---
ℹ️ Proyekti haqida ma'lumot:
Kompaniya: ${companyName || 'Kiritilmagan'}
Veb-sayt: ${website || 'Kiritilmagan'}
Maqsad: ${goalText}
Byudjet: ${budget || 'Kiritilmagan'}
Joylashuv: ${location || 'Kiritilmagan'}
Uchrashuv turi: ${meetingType}
${meetingType === 'OFLAYN' ? `Uchrashuv joyi: ${meetingPlaceText}` : ''}
            `.trim();
            
            telegramMessage = `
🔔 Yangi so'rov (Jon.Branding)

👤 Mijoz: ${fullName}
📞 Telefon: ${phone}
✈️ Telegram: ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
${notes ? `\n📝 Qo'shimcha izoh:\n${notes}` : ''}
${projectDetails}
${pickTwoInfo}
${packageInfo}
`.trim();
        }
        
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramPayload: any = { 
            chat_id: chatId, 
            text: telegramMessage,
            parse_mode: 'Markdown'
        };

        if (messageThreadId) {
          telegramPayload.message_thread_id = messageThreadId;
        }
        
        // Don't await, send in background
        fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramPayload),
        }).catch(e => console.error("Telegram API Error:", e));


        // Send analytics events in the background
        sendMetaConversionEvent(body).catch(e => {
            console.error("Failed to send Meta CAPI event in background:", e);
        });
        sendGAConversionEvent(body).catch(e => {
            console.error("Failed to send GA event in background:", e);
        });

        return NextResponse.json({ ok: true, message: "So'rovingiz muvaffaqiyatli yuborildi." });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: "Serverda ichki xatolik yuz berdi. Iltimos, administratorga murojaat qiling." }, { status: 500 });
    }
}

    