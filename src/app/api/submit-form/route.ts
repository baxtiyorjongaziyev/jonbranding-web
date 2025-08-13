
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    // Hardcoding the thread ID for the CRM topic as identified from getUpdates.
    const messageThreadId = '52'; 

    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram environment variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) are not set.");
        return NextResponse.json({ ok: false, error: 'Serverda Telegram sozlamalari mavjud emas.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, telegram, notes, packageSummary, totalPrice } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ ok: false, error: 'Ism va telefon raqam kiritilishi shart' }, { status: 400 });
        }
        
        let packageInfo = '';
        if (packageSummary && totalPrice !== undefined) {
          packageInfo = `
*Tanlangan paket:*
\`\`\`
${packageSummary}
Yakuniy narx: $${totalPrice.toLocaleString('en-US')}
\`\`\`
          `;
        }
        
        const telegramMessage = `
*Yangi xabar (Jon.Branding)*

*Mijoz:* ${fullName}
*Telefon:* \`${phone}\`
*Telegram:* ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
*Izoh:* ${notes || 'Kiritilmagan'}
${packageInfo}
        `.trim();
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const payload: any = {
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        };

        // Always add the message_thread_id if it exists.
        if (messageThreadId) {
            payload.message_thread_id = messageThreadId;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram API Error:", result);
            return NextResponse.json({ ok: false, error: `Telegramga yuborishda xatolik: ${result.description || 'Noma\'lum xato'}` }, { status: response.status });
        }

        return NextResponse.json({ ok: true, message: 'So\'rovingiz muvaffaqiyatli yuborildi.' });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: 'Serverda ichki xatolik yuz berdi. Iltimos, administratorga murojaat qiling.' }, { status: 500 });
    }
}
