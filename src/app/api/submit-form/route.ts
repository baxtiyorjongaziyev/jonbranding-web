
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
        console.error("Telegram environment variables not set.");
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
*📦 Tanlangan paket:*
\`\`\`
${packageSummary}
\`\`\`
*💰 Yakuniy narx: $${totalPrice.toLocaleString('en-US')}*
          `;
        }
        
        const telegramMessage = `
*🚀 Yangi buyurtma (Jon.Branding)*

*👤 Mijoz ma'lumotlari:*
  - *Ism:* ${fullName}
  - *Telefon:* \`${phone}\`
  - *Telegram:* ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
  - *Izoh:* ${notes || 'Kiritilmagan'}
${packageInfo}
        `.trim();
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const payload: any = {
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        };

        if (messageThreadId) {
            payload.message_thread_id = messageThreadId;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Telegram API Error:", result);
            return NextResponse.json({ ok: false, error: `Telegramga xabar yuborishda xatolik: ${result.description || 'Noma\'lum xato'}` }, { status: 500 });
        }

        return NextResponse.json({ ok: true, message: 'So\'rovingiz muvaffaqiyatli yuborildi.' });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: 'Ichki server xatoligi yuz berdi.' }, { status: 500 });
    }
}
