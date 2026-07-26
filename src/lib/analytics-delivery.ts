import { createHash } from 'node:crypto';
import { normalizePhone } from './lead-contact';

const UZS_TO_USD_RATE = 1 / 12700;
const DEFAULT_GA_MEASUREMENT_ID = 'G-BTSGJQLMMV';
const DEFAULT_META_PIXEL_ID = '1134785364752294';

type AnalyticsEnvironment = Record<string, string | undefined>;

export type DeliveryState = 'delivered' | 'failed' | 'skipped';

export interface ChannelDelivery {
  state: DeliveryState;
  durationMs: number;
  statusCode?: number;
  reason?: string;
}

export interface AnalyticsDeliveryReport {
  ok: boolean;
  summary: {
    delivered: number;
    failed: number;
    skipped: number;
  };
  channels: {
    meta: ChannelDelivery;
    ga4: ChannelDelivery;
    n8n: ChannelDelivery;
  };
}

interface AnalyticsDeliveryOptions {
  fetcher?: typeof fetch;
  env?: AnalyticsEnvironment;
}

function cleanSecret(value: string | undefined) {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
}

function sha256(value: unknown) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (!normalized) return '';
  return createHash('sha256').update(normalized).digest('hex');
}

function skipped(reason = 'not_configured'): ChannelDelivery {
  return { state: 'skipped', reason, durationMs: 0 };
}

async function deliver(request: () => Promise<Response>): Promise<ChannelDelivery> {
  const startedAt = Date.now();
  try {
    const response = await request();
    const durationMs = Date.now() - startedAt;
    if (!response.ok) {
      return {
        state: 'failed',
        statusCode: response.status,
        reason: `http_${response.status}`,
        durationMs,
      };
    }
    return { state: 'delivered', statusCode: response.status, durationMs };
  } catch (error) {
    return {
      state: 'failed',
      reason: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
    };
  }
}

export async function runAnalyticsDeliveries(
  data: Record<string, any>,
  options: AnalyticsDeliveryOptions = {},
): Promise<AnalyticsDeliveryReport> {
  const env = options.env ?? process.env;
  const fetcher = options.fetcher ?? fetch;

  const metaAccessToken = cleanSecret(env.META_API_ACCESS_TOKEN);
  const metaPixelId = cleanSecret(env.META_PIXEL_ID) || DEFAULT_META_PIXEL_ID;
  const gaApiSecret = cleanSecret(env.GA_API_SECRET);
  const gaMeasurementId = cleanSecret(env.NEXT_PUBLIC_GA_ID) || DEFAULT_GA_MEASUREMENT_ID;
  const n8nWebhookUrl = cleanSecret(env.N8N_WEBHOOK_URL);

  const valueInUzs = Number(data.totalPrice) || 0;
  const valueInUsd = (valueInUzs * UZS_TO_USD_RATE).toFixed(2);

  const metaPromise = metaAccessToken && metaPixelId
    ? deliver(() => fetcher(`https://graph.facebook.com/v20.0/${metaPixelId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: data.eventId,
            action_source: 'website',
            event_source_url: data.pageLocation,
            user_data: {
              ph: data.phone ? [sha256(normalizePhone(data.phone))] : [],
              fn: data.fullName ? [sha256(data.fullName)] : [],
            },
            custom_data: {
              value: valueInUsd,
              currency: 'USD',
              content_name: data.source || 'website_contact_form',
            },
          }],
          access_token: metaAccessToken,
        }),
      }))
    : Promise.resolve(skipped());

  const ga4Promise = gaApiSecret
    ? deliver(() => fetcher(
        `https://www.google-analytics.com/mp/collect?measurement_id=${gaMeasurementId}&api_secret=${gaApiSecret}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: data.gaClientId || data.eventId || '555.555',
            events: [{
              name: 'generate_lead',
              params: {
                event_id: data.eventId,
                value: valueInUzs,
                currency: 'UZS',
                source: data.source || 'website_contact_form',
                cta_source: data.ctaSource,
                page_location: data.pageLocation,
              },
            }],
          }),
        },
      ))
    : Promise.resolve(skipped());

  const n8nPromise = n8nWebhookUrl
    ? deliver(() => fetcher(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: data.source || 'website_contact_form',
          timestamp: new Date().toISOString(),
        }),
      }))
    : Promise.resolve(skipped());

  const [meta, ga4, n8n] = await Promise.all([metaPromise, ga4Promise, n8nPromise]);
  const values = [meta, ga4, n8n];
  const summary = {
    delivered: values.filter((item) => item.state === 'delivered').length,
    failed: values.filter((item) => item.state === 'failed').length,
    skipped: values.filter((item) => item.state === 'skipped').length,
  };

  return {
    ok: summary.delivered > 0 && summary.failed === 0,
    summary,
    channels: { meta, ga4, n8n },
  };
}
