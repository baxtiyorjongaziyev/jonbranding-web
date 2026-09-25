import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { logger } from '@/lib/logger';
import { containsContact } from '@/lib/oisha';

const LOCALES: readonly Locale[] = ['uz', 'ru', 'en', 'zh'];
// Telegram xabari 4096 belgidan oshsa rad etiladi.
const MAX_TEXT_LENGTH = 1500;

function oishaConfig() {
    return {
        url: process.env.OISHA_API_URL?.trim(),
        secret: process.env.OISHA_SECRET_KEY?.trim(),
    };
}

const escapeHtml = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

async function sendOishaFallbackToTelegram(userId: string, text: string, lang: Locale, hasContact: boolean) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const threadId = process.env.TELEGRAM_MESSAGE_THREAD_ID?.trim();

    if (!botToken || !chatId) return;

    const msg = [
        `💬 <b>Oisha chat — yangi xabar</b>${hasContact ? '' : ' (kontakt hali yo\'q)'}`,
        '',
        `<b>Til:</b> ${lang.toUpperCase()}`,
        `<b>Foydalanuvchi:</b> <code>${escapeHtml(userId)}</code>`,
        '<b>Xabar:</b>',
        escapeHtml(text),
    ].join('\n');

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: msg,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                ...(threadId ? { message_thread_id: Number(threadId) } : {}),
            }),
            signal: AbortSignal.timeout(5000),
        });
    } catch (err) {
        logger.error('Failed to forward Oisha message to Telegram', {
            reason: err instanceof Error ? err.message : String(err),
        });
    }
}

async function offlineReply(userId: string, text: string, lang: Locale) {
    const hasContact = containsContact(text);
    await sendOishaFallbackToTelegram(userId, text, lang, hasContact);
    const widget = (await getDictionary(lang)).oishaWidget;
    return NextResponse.json(
        { response: hasContact ? widget.offlineThanks : widget.offlineAskContact },
        { status: 200 },
    );
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
    const { url, secret } = oishaConfig();
    if (!url || !secret) {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
    try {
        const res = await fetch(
            `${url}/api/chat/history/${userId}`,
            { headers: { 'X-Secret-Key': secret }, signal: AbortSignal.timeout(10_000) }
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
    let body: { user_id?: unknown; text?: unknown; lang?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'invalid json' }, { status: 400 });
    }
    const { user_id, text } = body;
    if (!isValidUserId(user_id) || typeof text !== 'string' || !text.trim()) {
        return NextResponse.json({ error: 'valid user_id and text required' }, { status: 400 });
    }
    const lang: Locale = LOCALES.includes(body.lang as Locale) ? (body.lang as Locale) : 'uz';
    const cleanText = text.trim().slice(0, MAX_TEXT_LENGTH);

    const { url, secret } = oishaConfig();
    if (!url || !secret) {
        return offlineReply(user_id, cleanText, lang);
    }
    try {
        const res = await fetch(`${url}/api/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Secret-Key': secret,
            },
            body: JSON.stringify({ user_id, text: cleanText }),
            signal: AbortSignal.timeout(10_000),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch {
        return offlineReply(user_id, cleanText, lang);
    }
}
