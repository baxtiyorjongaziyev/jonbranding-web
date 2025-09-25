
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

// amoCRM uchun yordamchi funksiyalar
async function getAccessToken() {
    const subdomain = process.env.AMOCRM_SUBDOMAIN;
    const integrationId = process.env.AMOCRM_INTEGRATION_ID;
    const integrationSecret = process.env.AMOCRM_INTEGRATION_SECRET;
    const authCode = process.env.AMOCRM_AUTH_CODE;
    const redirectUri = process.env.AMOCRM_REDIRECT_URI;

    if (!subdomain || !integrationId || !integrationSecret || !authCode || !redirectUri) {
        console.error("amoCRM environment variables are not set");
        return null;
    }

    try {
        const url = `https://${subdomain}/oauth2/access_token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: integrationId,
                client_secret: integrationSecret,
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: redirectUri,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to get amoCRM access token:', errorData);
            return null;
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching amoCRM access token:', error);
        return null;
    }
}

async function createAmoCRMLEAD(data: any, telegramMessage: string, totalPrice: number) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("Could not create amoCRM lead due to missing access token.");
        return;
    }

    const subdomain = process.env.AMOCRM_SUBDOMAIN;
    const url = `https://${subdomain}/api/v4/leads/complex`;

    const leadData = [
        {
            name: `Saytdan yangi so'rov: ${data.fullName}`,
            price: totalPrice || 0,
            _embedded: {
                contacts: [
                    {
                        name: data.fullName,
                        custom_fields_values: [
                            {
                                field_code: "PHONE",
                                values: [
                                    {
                                        value: data.phone,
                                    },
                                ],
                            },
                            {
                                field_code: "EMAIL",
                                values: [
                                    {
                                        value: data.email || `${data.phone}@jonbranding.uz`,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            custom_fields_values: [
                {
                    field_id: 1108219, // Izoh maydoni ID'si
                    values: [
                        {
                            value: telegramMessage,
                        },
                    ],
                },
            ]
        },
    ];

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(leadData),
        });
    } catch (error) {
        console.error('Error creating amoCRM lead:', error);
    }
}

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

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
                // Format: ["S1: Answer 1", "S2: Answer 2"] -> "1. Answer 1 \n 2. Answer 2"
                formattedAnswers = answersArray.map((answer: string, index: number) => {
                    const answerText = answer.substring(answer.indexOf(':') + 2); // Get text after ": "
                    return `${index + 1}. ${answerText}`;
                }).join('\n');
            } catch (e) {
                console.error("Error parsing quiz answers:", e);
                // Fallback for safety
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
${projectDetails}
${pickTwoInfo}
${packageInfo}
`.trim();
        }
        
        // Parallel requests
        const promises = [];

        // 1. Send to Telegram
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const payload = { chat_id: chatId, text: telegramMessage };
        promises.push(
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(async (response) => {
                if (!response.ok) {
                    const result = await response.json();
                    console.error("Telegram API Error:", result);
                    // Don't throw, just log, so amoCRM can still proceed
                }
            })
        );
        
        // 2. Send to amoCRM
        if (process.env.AMOCRM_SUBDOMAIN) {
            promises.push(createAmoCRMLEAD(body, telegramMessage, totalPrice));
        }

        await Promise.all(promises);

        return NextResponse.json({ ok: true, message: "So'rovingiz muvaffaqiyatli yuborildi." });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: "Serverda ichki xatolik yuz berdi. Iltimos, administratorga murojaat qiling." }, { status: 500 });
    }
}
