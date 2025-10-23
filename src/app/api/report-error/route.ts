
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in environment variables for error reporting.");
        return NextResponse.json({ ok: false, error: "Serverda Telegram sozlamalari mavjud emas." }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { message, stack, pathname, userInfo } = body;

        if (!message) {
            return NextResponse.json({ ok: false, error: "Xatolik matni mavjud emas" }, { status: 400 });
        }

        const telegramMessage = `
🆘 Jon.Branding Saytida Xatolik!

Sahifa: ${pathname || 'Noma\'lum'}

Xato:
\`\`\`
${message}
\`\`\`

Stack Trace:
\`\`\`
${stack || 'Mavjud emas'}
\`\`\`

Foydalanuvchi ma'lumoti:
\`\`\`
${userInfo || 'Noma\'lum'}
\`\`\`
        `.trim();
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const payload = {
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            console.error("Telegram API Error while reporting error:", errorResult);
            // Still return ok to prevent error loops on the client
            return NextResponse.json({ ok: true, reported: false });
        }

        return NextResponse.json({ ok: true, reported: true });

    } catch (error: any) {
        console.error("Internal Server Error in error reporting endpoint:", error);
        // Don't return an error to the client to avoid an error loop
        return NextResponse.json({ ok: true, reported: false });
    }
}
