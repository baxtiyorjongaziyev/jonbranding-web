import { NextResponse } from 'next/server';
import { forceRefresh } from '@/lib/amocrm-token';

export async function POST(request: Request) {
  const cronSecret = process.env.AMOCRM_CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await forceRefresh();
    return NextResponse.json({ ok: true, expires_at: result.expires_at });
  } catch (error: any) {
    console.error('AmoCRM refresh endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
