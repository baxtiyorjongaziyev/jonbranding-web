import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { getDb } from '@/lib/firebase-admin';
import { getTursoClient, isTursoConfigured } from '@/lib/turso';
import { createAmoCrmLead } from '@/lib/integrations/amocrm-lead';
import { safeCompare } from '@/lib/security';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const FIRESTORE_COLLECTION = 'amocrm_failed_leads';

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

function buildNote(lead: Record<string, unknown>, sourceTag: string) {
  return [
    `${sourceTag} backup queue retry`,
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

  let sent = 0;
  let failed = 0;
  let attempted = 0;

  // 1. Process from Turso failed_leads
  if (isTursoConfigured()) {
    try {
      const client = getTursoClient();
      if (client) {
        const res = await client.execute({
          sql: `SELECT event_id, lead_data, retry_count 
                FROM failed_leads 
                WHERE status = 'pending' 
                ORDER BY created_at ASC 
                LIMIT ?`,
          args: [limit],
        });

        for (const row of res.rows) {
          attempted += 1;
          const eventId = String(row.event_id);
          const lead = JSON.parse(String(row.lead_data || '{}')) as Record<string, unknown>;
          const fullName = String(lead.fullName || 'Website lead');

          const result = await createAmoCrmLead({
            name: `Jon.Branding site: ${fullName}`,
            contactName: fullName,
            phone: lead.phone ? String(lead.phone) : undefined,
            telegram: lead.telegram ? String(lead.telegram) : undefined,
            price: Number(lead.totalPrice) || 0,
            tags: ['jonbranding.uz', 'website', 'turso-retry', String(lead.source || 'website')],
            note: buildNote(lead, 'Turso'),
          });

          const now = new Date().toISOString();
          if (result.ok) {
            sent += 1;
            await client.execute({
              sql: `UPDATE failed_leads 
                    SET status = 'sent', amocrm_lead_id = ?, retried_at = ?, updated_at = ? 
                    WHERE event_id = ?`,
              args: [result.leadId || null, now, now, eventId],
            });
          } else {
            failed += 1;
            const currentRetries = Number(row.retry_count || 0);
            await client.execute({
              sql: `UPDATE failed_leads 
                    SET status = 'pending', retry_count = ?, error_message = ?, updated_at = ? 
                    WHERE event_id = ?`,
              args: [currentRetries + 1, result.error || 'Retry failed', now, eventId],
            });
          }
        }
      }
    } catch (tursoErr) {
      logger.error('[Turso] Error retrying leads from Turso:', tursoErr);
    }
  }

  // 2. Process legacy pending leads from Firestore if capacity remains
  const remainingLimit = limit - attempted;
  if (remainingLimit > 0 && process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
    try {
      const snapshot = await getDb()
        .collection(FIRESTORE_COLLECTION)
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'asc')
        .limit(remainingLimit)
        .get();

      for (const document of snapshot.docs) {
        attempted += 1;
        const data = document.data();
        const lead = (data.lead || {}) as Record<string, unknown>;
        const fullName = String(lead.fullName || 'Website lead');

        const result = await createAmoCrmLead({
          name: `Jon.Branding site: ${fullName}`,
          contactName: fullName,
          phone: lead.phone ? String(lead.phone) : undefined,
          telegram: lead.telegram ? String(lead.telegram) : undefined,
          price: Number(lead.totalPrice) || 0,
          tags: ['jonbranding.uz', 'website', 'firestore-retry', String(lead.source || 'website')],
          note: buildNote(lead, 'Firestore'),
        });

        const now = new Date().toISOString();
        if (result.ok) {
          sent += 1;
          await document.ref.update({
            status: 'sent',
            retriedAt: now,
            updatedAt: now,
            amoCrmLeadId: result.leadId || null,
          });
        } else {
          failed += 1;
          await document.ref.update({
            status: 'pending',
            lastRetryAt: now,
            updatedAt: now,
            lastRetryError: result.error,
            retryCount: Number(data.retryCount || 0) + 1,
          });
        }
      }
    } catch (fsErr) {
      logger.error('[Firestore] Error retrying leads from Firestore:', fsErr);
    }
  }

  return NextResponse.json({
    ok: failed === 0,
    attempted,
    sent,
    failed,
  }, { status: failed === 0 ? 200 : 502 });
}
