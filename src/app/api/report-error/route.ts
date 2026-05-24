
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const errorReportSchema = z.object({
    message: z.string().max(1000),
    stack: z.string().max(2000).optional(),
    pathname: z.string().max(500).optional(),
    userInfo: z.string().max(500).optional(),
});

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (!rateLimit(`report-error:${ip}`, 10, 60_000)) {
        return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in environment variables for error reporting.");
        return NextResponse.json({ ok: false, error: "Serverda Telegram sozlamalari mavjud emas." }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Validate input using Zod
        const validatedData = errorReportSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { ok: false, error: "Xatolik matni mavjud emas yoxud juda uzun" },
                { status: 400 }
            );
        }

        const { message, stack, pathname, userInfo } = validatedData.data;

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
