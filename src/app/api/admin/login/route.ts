import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { safeCompare } from '@/lib/security';
import { ADMIN_COOKIE, createAdminSession } from '@/lib/admin/auth';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`admin-login:${ip}`, 5, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return NextResponse.json({ ok: false }, { status: 401 });

  let provided = '';
  try {
    provided = String((await request.json())?.secret || '');
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (provided.length !== secret.length || !safeCompare(provided, secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
