import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const OISHA_API_URL = process.env.OISHA_API_URL?.trim();
const OISHA_SECRET = process.env.OISHA_SECRET_KEY?.trim();

const escapeHtml = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

async function sendOishaFallbackToTelegram(userId: string, text: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const threadId = process.env.TELEGRAM_MESSAGE_THREAD_ID?.trim();

    if (!botToken || !chatId) return;

    const msg = `💬 <b>Oisha Chat — Yangi savol (AI offline):</b>\n\n<b>Foydalanuvchi:</b> <code>${escapeHtml(userId)}</code>\n<b>Xabar:</b>\n${escapeHtml(text)}`;

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: msg,
                parse_mode: 'HTML',
                ...(threadId ? { message_thread_id: Number(threadId) } : {}),
            }),
            signal: AbortSignal.timeout(5000),
        });
    } catch (err) {
        console.error('Failed to forward Oisha message to Telegram:', err);
    }
}

const normalizeUserId = (value: string | null) => {
    if (!value || !/^[a-zA-Z0-9_-]{3,80}$/.test(value)) {
        return null;
    }
    return encodeURIComponent(value);
};

const isValidUserId = (value: unknown): value is string =>
    typeof value === 'string' && /^[a-zA-Z0-9_-]{3,80}$/.test(value);

export async function GET(request: Request) {
    const ip = getClientIp(request);
    if (!(await rateLimit(`oisha:${ip}`, 30, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const userId = normalizeUserId(searchParams.get('user_id'));
    if (!userId) {
        return NextResponse.json({ error: 'valid user_id required' }, { status: 400 });
    }
    if (!OISHA_API_URL || !OISHA_SECRET) {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
    try {
        const res = await fetch(
            `${OISHA_API_URL}/api/chat/history/${userId}`,
            { headers: { 'X-Secret-Key': OISHA_SECRET }, signal: AbortSignal.timeout(10_000) }
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (!(await rateLimit(`oisha:${ip}`, 30, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const body = await request.json();
    const { user_id, text } = body;
    if (!isValidUserId(user_id) || typeof text !== 'string' || !text.trim()) {
        return NextResponse.json({ error: 'valid user_id and text required' }, { status: 400 });
    }
    if (!OISHA_API_URL || !OISHA_SECRET) {
        await sendOishaFallbackToTelegram(user_id, text.trim());
        return NextResponse.json({
            response: "Rahmat! Xabaringiz qabul qilindi. Tez orada mutaxassisimiz siz bilan bog'lanadi.",
        }, { status: 200 });
    }
    try {
        const res = await fetch(`${OISHA_API_URL}/api/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Secret-Key': OISHA_SECRET,
            },
            body: JSON.stringify({ user_id, text }),
            signal: AbortSignal.timeout(10_000),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch {
        await sendOishaFallbackToTelegram(user_id, text.trim());
        return NextResponse.json({
            response: "Rahmat! Xabaringiz qabul qilindi. Tez orada mutaxassisimiz siz bilan bog'lanadi.",
        }, { status: 200 });
    }
}
