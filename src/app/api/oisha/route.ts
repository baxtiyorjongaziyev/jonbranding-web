import { NextResponse, after } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { logger } from '@/lib/logger';
import { containsContact } from '@/lib/oisha';
import { getOishaSession } from '@/lib/oisha-session';
import { isChatProbe, readChatBody } from '@/lib/oisha-input';

const LOCALES: readonly Locale[] = ['uz', 'ru', 'en', 'zh'];
// Telegram xabari 4096 belgidan oshsa rad etiladi.
const MAX_TEXT_LENGTH = 1500;
// Backend yiqilgan bo'lsa har xabarda timeout kutmaslik uchun shu muddat
// davomida to'g'ridan-to'g'ri offline javob beriladi.
const BACKEND_COOLDOWN_MS = 60_000;
let backendDownUntil = 0;

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
    // Telegram'ga yuborish javobni kechiktirmasin.
    after(() => sendOishaFallbackToTelegram(userId, text, lang, hasContact));
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

const BLOCKED_OISHA_USER_IDS = new Set([
    'web_1a7ae654-dac2-41a0-aedf-b31564803674',
    'web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867',
]);

export async function GET(request: Request) {
    const ip = getClientIp(request);
    if (!(await rateLimit(`oisha:${ip}`, 30, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('user_id');
    if (requestedUserId && BLOCKED_OISHA_USER_IDS.has(requestedUserId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!normalizeUserId(requestedUserId)) {
        return NextResponse.json({ error: 'valid user_id required' }, { status: 400 });
    }
    const { url, secret } = oishaConfig();
    const session = getOishaSession(request, secret);
    if (!url || !secret) {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
    try {
        const res = await fetch(
            `${url}/api/chat/history/${session.userId}`,
            { headers: { 'X-Secret-Key': secret, Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(10_000) }
        );
        const data = await res.json();
        return session.attach(NextResponse.json(data, { status: res.ok ? 200 : res.status }));
    } catch {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
        return NextResponse.json({ error: 'JSON required' }, { status: 415 });
    }
    if (!(await rateLimit(`oisha:burst:${ip}`, 5, 10_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '10' } });
    }
    if (!(await rateLimit(`oisha:${ip}`, 30, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    let body: { user_id?: unknown; text?: unknown; lang?: unknown };
    try {
        const parsed = await readChatBody(request);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new SyntaxError('invalid object');
        body = parsed;
    } catch (error) {
        return NextResponse.json({ error: 'invalid request body' }, { status: error instanceof RangeError ? 413 : 400 });
    }
    const { user_id, text } = body;
    if (typeof user_id === 'string' && BLOCKED_OISHA_USER_IDS.has(user_id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!isValidUserId(user_id) || typeof text !== 'string' || !text.trim()) {
        return NextResponse.json({ error: 'valid user_id and text required' }, { status: 400 });
    }
    const lang: Locale = LOCALES.includes(body.lang as Locale) ? (body.lang as Locale) : 'uz';
    const cleanText = text.trim().slice(0, MAX_TEXT_LENGTH);
    if (text.length > MAX_TEXT_LENGTH) {
        return NextResponse.json({ error: 'text too long' }, { status: 413 });
    }
    if (isChatProbe(cleanText)) {
        return NextResponse.json({ error: 'Invalid chat message' }, { status: 400 });
    }

    const { url, secret } = oishaConfig();
    const session = getOishaSession(request, secret);
    if (!url || !secret || Date.now() < backendDownUntil) {
        return session.attach(await offlineReply(session.userId, cleanText, lang));
    }
    try {
        const res = await fetch(`${url}/api/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Secret-Key': secret,
                Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify({ user_id: session.userId, text: cleanText }),
            signal: AbortSignal.timeout(10_000),
        });
        if (res.status >= 500) throw new Error(`Oisha backend ${res.status}`);
        const data = await res.json();
        return session.attach(NextResponse.json(data, { status: res.ok ? 200 : res.status }));
    } catch (err) {
        backendDownUntil = Date.now() + BACKEND_COOLDOWN_MS;
        logger.error('Oisha backend unavailable, using offline reply', {
            reason: err instanceof Error ? err.message : String(err),
        });
        return session.attach(await offlineReply(session.userId, cleanText, lang));
    }
}
