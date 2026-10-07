import { NextResponse } from 'next/server';
import { forceRefresh } from '@/lib/amocrm-token';
import { safeCompare } from '@/lib/security';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const cronSecret = process.env.AMOCRM_CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ') || !safeCompare(authHeader.substring(7), cronSecret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await forceRefresh();

    // Verify token validity against live AmoCRM account endpoint
    const subdomain = (process.env.AMOCRM_SUBDOMAIN || process.env.AMOCRM_DOMAIN || 'jonbranding')
      .replace(/^https?:\/\//, '')
      .replace(/\..+$/, '');
    const probe = await fetch(`https://${subdomain}.amocrm.ru/api/v4/account`, {
      headers: { Authorization: `Bearer ${result.access_token}` },
      signal: AbortSignal.timeout(8000),
    });

    if (!probe.ok) {
      logger.error('AmoCRM keepalive probe failed', { status: probe.status });
      return NextResponse.json(
        { ok: false, error: `AmoCRM API probe returned HTTP ${probe.status}` },
        { status: probe.status === 401 ? 401 : 502 }
      );
    }

    return NextResponse.json({ ok: true, expires_at: result.expires_at });
  } catch (error: any) {
    logger.error('AmoCRM refresh endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

