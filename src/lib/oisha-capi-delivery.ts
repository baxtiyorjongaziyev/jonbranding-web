import { type ChannelDelivery, cleanMetaSourceUrl } from './analytics-delivery';

/** Server-only transport: an Oisha receipt confirms queueing, not Meta delivery. */
export async function deliverOishaCapi(
  data: Record<string, unknown>,
  env: Record<string, string | undefined>,
  fetcher: typeof fetch,
): Promise<ChannelDelivery> {
  const startedAt = Date.now();
  const result = (state: ChannelDelivery['state'], reason?: string, statusCode?: number) =>
    ({ state, reason, statusCode, durationMs: Date.now() - startedAt });
  const endpoint = env.OISHA_CAPI_URL?.trim();
  const secret = env.OISHA_CAPI_INGEST_SECRET?.trim();
  if (!endpoint || !secret) return result('failed', 'oisha_not_configured');
  if (data.analyticsConsent !== true) return result('skipped', 'consent_required');
  try {
    const target = new URL(endpoint);
    if (target.protocol !== 'https:' || target.username || target.password) {
      return result('failed', 'invalid_oisha_endpoint');
    }
    const pageUrl = cleanMetaSourceUrl(data.pageLocation) || 'https://www.jonbranding.uz';
    const response = await fetcher(target, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        source: 'website', event_name: 'Lead', event_id: data.eventId,
        event_time: Math.floor(Date.now() / 1000), consent: true,
        event_source_url: pageUrl, client_user_agent: data.userAgent,
        phone: data.phone || '',
        fbp: /^fb\.\d\.\d{10,13}\.\d+$/.test(String(data.fbp || '')) ? data.fbp : undefined,
        fbc: /^fb\.\d\.\d{10,13}\.[\w-]+$/.test(String(data.fbc || '')) ? data.fbc : undefined,
      }),
    });
    if (response.status !== 202) return result('failed', 'oisha_intake_rejected', response.status);
    const receipt = await response.json();
    if (!['queued', 'duplicate'].includes(receipt.status) || receipt.event_id !== data.eventId) {
      return result('failed', 'oisha_receipt_unconfirmed', response.status);
    }
    return result('queued', 'meta_acceptance_pending', response.status);
  } catch {
    // URL and transport exceptions can contain secrets; return a fixed code.
    return result('failed', 'oisha_transport_failure');
  }
}
