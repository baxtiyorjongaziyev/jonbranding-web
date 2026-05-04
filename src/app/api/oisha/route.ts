import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const OISHA_API_URL = process.env.OISHA_API_URL || 'http://localhost:8080';
const OISHA_SECRET = process.env.OISHA_SECRET_KEY || '';

export async function GET(request: Request) {
    const ip = getClientIp(request);
    if (!rateLimit(ip, 30, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    if (!userId) {
        return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    }
    const res = await fetch(
        `${OISHA_API_URL}/api/chat/history/${userId}?secret_key=${OISHA_SECRET}`
    );
    const data = await res.json();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (!rateLimit(ip, 30, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const body = await request.json();
    const { user_id, text } = body;
    if (!user_id || !text) {
        return NextResponse.json({ error: 'user_id and text required' }, { status: 400 });
    }
    const res = await fetch(`${OISHA_API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, text, secret_key: OISHA_SECRET }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}
