import { NextResponse, after } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { logger } from '@/lib/logger';
import { containsContact, isOishaWebUserId } from '@/lib/oisha';
import { guardLeadRequest } from '@/lib/lead-guard';
import { shouldSendOishaAlert } from '@/lib/oisha-alert-throttle';

const LOCALES: readonly Locale[] = ['uz', 'ru', 'en', 'zh'];
// Telegram xabari 4096 belgidan oshsa rad etiladi.
const MAX_TEXT_LENGTH = 1500;
// Bot "e" kabi bo'sh xabarlarni yuboradi — bu uzunlikdan kichik matnni rad etadi.
const MIN_TEXT_LENGTH = 2;
// Yangi suhbat boshlash va xabar yuborish uchun IP bo'yicha qattiqroq limit.
const POST_LIMIT_PER_MIN = 10;
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

async function offlineReply(userId: string, text: string, lang: Locale, ip: string) {
    const hasContact = containsContact(text);
    // Telegram'ga yuborish javobni kechiktirmasin. Bir IP'dan ko'p xabar bo'lsa
    // alert'lar oralig'i cheklanadi, lekin kontakt (telefon/Telegram) bor xabar
    // doim yuboriladi — aks holda mehmonning aloqa ma'lumoti yo'qoladi.
    if (hasContact || shouldSendOishaAlert(ip)) {
        after(() => sendOishaFallbackToTelegram(userId, text, lang, hasContact));
    }
    const widget = (await getDictionary(lang)).oishaWidget;
    return NextResponse.json(
        { response: hasContact ? widget.offlineThanks : widget.offlineAskContact },
        { status: 200 },
    );
}

export async function GET(request: Request) {
    const ip = getClientIp(request);
    if (!(await rateLimit(`oisha:${ip}`, 30, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    if (!isOishaWebUserId(userId)) {
        return NextResponse.json({ error: 'valid user_id required' }, { status: 400 });
    }
    const { url, secret } = oishaConfig();
    if (!url || !secret) {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
    try {
        const res = await fetch(
            `${url}/api/chat/history/${userId}`,
            { headers: { 'X-Secret-Key': secret, Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(10_000) }
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch {
        return NextResponse.json({ history: [] }, { status: 200 });
    }
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (!(await rateLimit(`oisha-post:${ip}`, POST_LIMIT_PER_MIN, 60_000))) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    let body: { user_id?: unknown; text?: unknown; lang?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'invalid json' }, { status: 400 });
    }

    // Honeypot + Turnstile + origin (lead-guard). Honeypot to'ldirilgan bo'lsa
    // bot muvaffaqiyat ko'radi, lekin hech narsa yuborilmaydi.
    const guard = await guardLeadRequest(request, body, ip, 'oisha');
    if (guard.action === 'drop') {
        return NextResponse.json({ response: '' }, { status: 200 });
    }
    if (guard.action === 'reject') {
        return NextResponse.json({ error: 'verification failed' }, { status: 403 });
    }

    const { user_id, text } = body;
    if (!isOishaWebUserId(user_id) || typeof text !== 'string' || !text.trim()) {
        return NextResponse.json({ error: 'valid user_id and text required' }, { status: 400 });
    }
    const cleanText = text.trim().slice(0, MAX_TEXT_LENGTH);
    if (cleanText.length < MIN_TEXT_LENGTH) {
        return NextResponse.json({ error: 'text too short' }, { status: 400 });
    }
    const lang: Locale = LOCALES.includes(body.lang as Locale) ? (body.lang as Locale) : 'uz';

    const { url, secret } = oishaConfig();
    if (!url || !secret || Date.now() < backendDownUntil) {
        return offlineReply(user_id, cleanText, lang, ip);
    }
    try {
        const res = await fetch(`${url}/api/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Secret-Key': secret,
                Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify({ user_id, text: cleanText }),
            signal: AbortSignal.timeout(10_000),
        });
        if (res.status >= 500) throw new Error(`Oisha backend ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    } catch (err) {
        backendDownUntil = Date.now() + BACKEND_COOLDOWN_MS;
        logger.error('Oisha backend unavailable, using offline reply', {
            reason: err instanceof Error ? err.message : String(err),
        });
        return offlineReply(user_id, cleanText, lang, ip);
    }
}
