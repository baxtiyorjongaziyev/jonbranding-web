import 'server-only';
import { getServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';
import type { LeadData } from '@/lib/services/lead-types';

export const MAX_LEAD_ATTEMPTS = 5;

export type InboxSaveResult =
  | { saved: true; duplicate: boolean; delivered: boolean }
  | { saved: false };

export type InboxRow = {
  event_id: string;
  payload: LeadData;
  telegram_ok: boolean;
  amocrm_ok: boolean;
  attempts: number;
};

/** Arizani delivery'dan oldin durable saqlaydi. Supabase yo'q/xato bo'lsa saved:false. */
export async function saveLeadToInbox(lead: LeadData): Promise<InboxSaveResult> {
  const db = getServiceClient();
  if (!db) return { saved: false };
  try {
    const { error } = await db
      .from('leads_inbox')
      .insert({ event_id: lead.eventId, payload: lead });
    if (!error) return { saved: true, duplicate: false, delivered: false };

    // 23505 = unique violation → shu eventId bilan ariza allaqachon bor (qayta yuborish).
    if (error.code === '23505') {
      const { data } = await db
        .from('leads_inbox')
        .select('status')
        .eq('event_id', lead.eventId)
        .maybeSingle();
      return { saved: true, duplicate: true, delivered: data?.status === 'delivered' };
    }
    logger.error('Lead inbox insert failed', { eventId: lead.eventId, error: error.message });
    return { saved: false };
  } catch (error) {
    logger.error('Lead inbox insert threw', { eventId: lead.eventId, error: String(error) });
    return { saved: false };
  }
}

/** Delivery natijasini yozadi. Telegram yoki AmoCRM yetib borsa — delivered. */
export async function markLeadDelivery(
  eventId: string,
  result: { telegram: boolean; amoCrm: boolean; error?: string },
  attempts?: number,
): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  const delivered = result.telegram || result.amoCrm;
  const status = delivered
    ? 'delivered'
    : attempts !== undefined && attempts >= MAX_LEAD_ATTEMPTS
      ? 'dead'
      : 'failed';
  try {
    const { error } = await db
      .from('leads_inbox')
      .update({
        status,
        telegram_ok: result.telegram,
        amocrm_ok: result.amoCrm,
        last_error: result.error ?? null,
        updated_at: new Date().toISOString(),
        ...(attempts !== undefined ? { attempts } : {}),
      })
      .eq('event_id', eventId);
    if (error) logger.error('Lead inbox update failed', { eventId, error: error.message });
  } catch (error) {
    logger.error('Lead inbox update threw', { eventId, error: String(error) });
  }
}

/** Qayta urinish kerak bo'lgan arizalar: failed yoki 2 daqiqadan eski pending. */
export async function listUndeliveredLeads(limit = 20): Promise<InboxRow[]> {
  const db = getServiceClient();
  if (!db) return [];
  const staleBefore = new Date(Date.now() - 2 * 60_000).toISOString();
  const { data, error } = await db
    .from('leads_inbox')
    .select('event_id, payload, telegram_ok, amocrm_ok, attempts')
    .or(`status.eq.failed,and(status.eq.pending,created_at.lt.${staleBefore})`)
    .lt('attempts', MAX_LEAD_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) {
    logger.error('Lead inbox list failed', { error: error.message });
    return [];
  }
  return (data ?? []) as InboxRow[];
}
