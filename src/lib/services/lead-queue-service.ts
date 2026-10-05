import { getDb } from '@/lib/firebase-admin';
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
  try {
    const err = error as AmoCrmErrorShape | undefined;
    const eventId = String(data.eventId || `lead_${Date.now()}`);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        { merge: true }
      );
    return true;
  } catch (queueError) {
    console.error('AmoCRM failed lead queue error:', queueError);
    return false;
  }
}
