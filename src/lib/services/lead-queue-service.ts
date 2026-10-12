import { getDb } from '@/lib/firebase-admin';
import { getTursoClient, isTursoConfigured } from '@/lib/turso';
import { logger } from '@/lib/logger';
import { type LeadData, type AmoCrmErrorShape } from './lead-types';

export const AMOCRM_FAILED_LEADS_COLLECTION = 'amocrm_failed_leads';

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripUndefined) as unknown as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)])
    ) as unknown as T;
  }
  return value;
}

export function describeAmoCrmError(error: unknown): string {
  const err = error as AmoCrmErrorShape | undefined;
  const status = Number(err?.status || 0);
  const message = String(err?.message || error || 'Unknown error');

  if (status === 402 || /payment required/i.test(message)) {
    return "Payment Required: AmoCRM akkaunti yoki API access to'lanmagan";
  }

  return message;
}

export async function queueFailedAmoCrmLead(data: LeadData, error: unknown): Promise<boolean> {
  const err = error as AmoCrmErrorShape | undefined;
  const eventId = String(data.eventId || `lead_${Date.now()}`);
  const now = new Date().toISOString();

  // Primary: Turso libSQL table
  if (isTursoConfigured()) {
    try {
      const client = getTursoClient();
      if (client) {
        await client.execute({
          sql: `INSERT INTO failed_leads 
                (event_id, lead_data, status, integration, error_message, error_status, error_detail, error_type, created_at, updated_at)
                VALUES (?, ?, 'pending', 'amocrm', ?, ?, ?, ?, ?, ?)
                ON CONFLICT(event_id) DO UPDATE SET
                  status = 'pending',
                  error_message = excluded.error_message,
                  error_status = excluded.error_status,
                  error_detail = excluded.error_detail,
                  error_type = excluded.error_type,
                  updated_at = excluded.updated_at`,
          args: [
            eventId,
            JSON.stringify(stripUndefined(data)),
            String(err?.message || error || 'Unknown error'),
            Number(err?.status || 0) || null,
            err?.detail ? (typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail)) : null,
            err?.type ? String(err.type) : null,
            now,
            now,
          ],
        });
        return true;
      }
    } catch (tursoErr) {
      logger.error('[Turso] Failed to queue lead to Turso:', tursoErr);
    }
  }

  // Fallback: Firestore collection
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
      await getDb()
        .collection(AMOCRM_FAILED_LEADS_COLLECTION)
        .doc(eventId)
        .set(
          stripUndefined({
            lead: data,
            status: 'pending',
            integration: 'amocrm',
            error: {
              message: String(err?.message || error || 'Unknown error'),
              status: Number(err?.status || 0) || null,
              detail: err?.detail || null,
              type: err?.type || null,
            },
            createdAt: now,
            updatedAt: now,
          }),
          { merge: true }
        );
      return true;
    }
  } catch (queueError) {
    logger.error('AmoCRM failed lead Firestore queue error:', queueError);
  }

  return false;
}
