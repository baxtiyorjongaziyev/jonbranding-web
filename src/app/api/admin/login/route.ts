import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { safeCompare } from '@/lib/security';
import { ADMIN_COOKIE, TEAM_COOKIE, createAdminSession, createTeamSession } from '@/lib/admin/auth';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`admin-login:${ip}`, 5, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let provided = '';
  let scope: 'admin' | 'team' = 'admin';
  try {
    const body = await request.json();
    provided = String(body?.secret || '');
    if (body?.scope === 'team') scope = 'team';
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // `team` — sotuv jamoasi paroli; admin paroli bilan ham kirish mumkin.
  const adminSecret = process.env.ADMIN_SECRET?.trim() || '';
  const teamSecret = scope === 'team' ? process.env.SALES_TEAM_SECRET?.trim() || '' : '';
  const matches = (secret: string) =>
    Boolean(secret) && provided.length === secret.length && safeCompare(provided, secret);

  const isAdmin = matches(adminSecret);
  if (!isAdmin && !matches(teamSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(isAdmin ? ADMIN_COOKIE : TEAM_COOKIE, isAdmin ? createAdminSession() : createTeamSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
