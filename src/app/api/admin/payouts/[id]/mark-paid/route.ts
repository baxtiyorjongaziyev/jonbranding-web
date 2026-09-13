import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { markPayoutPaid } from '@/lib/affiliate/store';

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`admin-mark-paid:${ip}`, 30, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  if (!verifyAdminSession(readCookie(request, ADMIN_COOKIE))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  await markPayoutPaid(id);
  return NextResponse.json({ ok: true });
}
