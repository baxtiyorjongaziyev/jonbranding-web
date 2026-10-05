import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { getDb } from '@/lib/firebase-admin';
import { createAmoCrmLead } from '@/lib/integrations/amocrm-lead';
import { safeCompare } from '@/lib/security';

export const dynamic = 'force-dynamic';

const COLLECTION = 'amocrm_failed_leads';

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get('cookie') || '';
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function isAuthorized(request: Request) {
  if (verifyAdminSession(readCookie(request, ADMIN_COOKIE))) return true;

  const secret = String(process.env.AMOCRM_CRON_SECRET || process.env.CRON_SECRET || '').trim();
  const authorization = request.headers.get('authorization') || '';
  return Boolean(secret && authorization.startsWith('Bearer '))
    && safeCompare(authorization.slice(7), secret);
}

function buildNote(lead: Record<string, unknown>) {
  return [
    'Firestore backup queue retry',
    lead.source ? `Manba: ${lead.source}` : '',
    lead.lang ? `Til: ${String(lead.lang).toUpperCase()}` : '',
    lead.phone ? `Telefon: ${lead.phone}` : '',
    lead.telegram ? `Telegram: @${String(lead.telegram).replace(/^@/, '')}` : '',
    lead.role ? `Xizmat: ${lead.role}` : '',
    lead.budget ? `Byudjet: ${lead.budget}` : '',
    lead.pagePath ? `Sahifa: ${lead.pagePath}` : '',
    lead.section ? `Section: ${lead.section}` : '',
    lead.offerType ? `Offer: ${lead.offerType}` : '',
    lead.utmSource ? `UTM source: ${lead.utmSource}` : '',
    lead.utmCampaign ? `UTM campaign: ${lead.utmCampaign}` : '',
  ].filter(Boolean).join('\n');
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const requestedLimit = Number((body as { limit?: number }).limit) || 10;
  const limit = Math.min(Math.max(requestedLimit, 1), 25);
  const snapshot = await getDb()
    .collection(COLLECTION)
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'asc')
    .limit(limit)
    .get();

  let sent = 0;
  let failed = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    const lead = (data.lead || {}) as Record<string, unknown>;
    const fullName = String(lead.fullName || 'Website lead');
    const result = await createAmoCrmLead({
      name: `Jon.Branding site: ${fullName}`,
      contactName: fullName,
      phone: lead.phone ? String(lead.phone) : undefined,
      telegram: lead.telegram ? String(lead.telegram) : undefined,
      price: Number(lead.totalPrice) || 0,
      tags: ['jonbranding.uz', 'website', 'queue-retry', String(lead.source || 'website')],
      note: buildNote(lead),
    });

    if (result.ok) {
      sent += 1;
      await document.ref.update({
        status: 'sent',
        retriedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        amoCrmLeadId: result.leadId || null,
      });
    } else {
      failed += 1;
      await document.ref.update({
        status: 'pending',
        lastRetryAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastRetryError: result.error,
        retryCount: Number(data.retryCount || 0) + 1,
      });
    }
  }

  return NextResponse.json({
    ok: failed === 0,
    attempted: snapshot.size,
    sent,
    failed,
  }, { status: failed === 0 ? 200 : 502 });
}
