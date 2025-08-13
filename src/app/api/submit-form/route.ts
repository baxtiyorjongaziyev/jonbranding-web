
import { NextResponse } from 'next/server';

// Helper function to send a message to Telegram
async function sendToTelegram(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram environment variables are not set.");
        throw new Error("Server configuration error: Telegram bot not configured.");
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
    });

    const result = await response.json();
    if (!result.ok) {
        console.error("Telegram API Error:", result);
        throw new Error(`Failed to send message to Telegram. Response: ${JSON.stringify(result)}`);
    }
    return result;
}

export async function POST(request: Request) {
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
        
        // Prepare data for Telegram
        const telegramMessage = `
*🚀 Yangi buyurtma (Jon.Branding)*

*👤 Mijoz ma'lumotlari:*
  - *Ism:* ${fullName}
  - *Telefon:* \`${phone}\`
  - *Telegram:* ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
  - *Izoh:* ${notes || 'Kiritilmagan'}
${packageInfo}
        `;
        
        // Send the message to Telegram
        await sendToTelegram(telegramMessage.trim());

        return NextResponse.json({ ok: true, message: 'So\'rovingiz muvaffaqiyatli yuborildi.' });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: error.message || 'Ichki server xatoligi' }, { status: 500 });
    }
}
