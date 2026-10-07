import { createHash } from 'node:crypto';
import { normalizePhone } from './lead-contact.ts';

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

const FBP_PATTERN = /^fb\.\d\.\d{10,13}\.\d+$/;
const FBC_PATTERN = /^fb\.\d\.\d{10,13}\.[\w-]+$/;

function cleanFbCookie(value: unknown, pattern: RegExp) {
  const normalized = String(value || '').trim();
  return pattern.test(normalized) ? normalized : undefined;
}

// Graph API xato javobidan faqat diagnostik maydonlarni oladi (token yoki
// so'rov tanasi hech qachon logga tushmaydi).
export async function describeMetaError(response: Response, secret = ''): Promise<string> {
  const redact = (text: string) => (secret ? text.split(secret).join('[redacted]') : text);
  try {
    const body = await response.json();
    const error = body?.error;
    if (!error || typeof error !== 'object') return `http_${response.status}`;
    const parts = [
      error.type,
      error.code !== undefined ? `code=${error.code}` : '',
      error.error_subcode !== undefined ? `subcode=${error.error_subcode}` : '',
      error.error_user_msg || error.message,
    ].filter(Boolean);
    return redact(`http_${response.status}: ${parts.join(' ')}`)
      .replace(/access_token=[^&\s]+/gi, 'access_token=[redacted]')
      .slice(0, 500);
  } catch {
    return `http_${response.status}`;
  }
}

async function deliver(
  request: () => Promise<Response>,
  describeError?: (response: Response) => Promise<string>,
): Promise<ChannelDelivery> {
  const startedAt = Date.now();
  try {
    const response = await request();
    const durationMs = Date.now() - startedAt;
    if (!response.ok) {
      return {
        state: 'failed',
        statusCode: response.status,
        reason: describeError ? await describeError(response) : `http_${response.status}`,
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

  const metaAccessToken = cleanSecret(env.META_CAPI_ACCESS_TOKEN || env.META_API_ACCESS_TOKEN);
  const metaPixelId = cleanSecret(env.META_PIXEL_ID) || DEFAULT_META_PIXEL_ID;
  const gaApiSecret = cleanSecret(env.GA_API_SECRET);
  const gaMeasurementId = cleanSecret(env.NEXT_PUBLIC_GA_ID) || DEFAULT_GA_MEASUREMENT_ID;
  const n8nWebhookUrl = cleanSecret(env.N8N_WEBHOOK_URL);

  const valueInUzs = Number(data.totalPrice) || 0;
  const valueInUsd = (valueInUzs * UZS_TO_USD_RATE).toFixed(2);

  const phoneHash = data.phone ? sha256(normalizePhone(data.phone)) : '';
  const nameHash = data.fullName ? sha256(data.fullName) : '';
  const testEventCode = cleanSecret(env.META_TEST_EVENT_CODE);

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
            event_source_url: data.pageLocation || undefined,
            user_data: {
              ph: phoneHash ? [phoneHash] : undefined,
              fn: nameHash ? [nameHash] : undefined,
              client_ip_address: data.clientIp || undefined,
              client_user_agent: data.userAgent || undefined,
              fbp: cleanFbCookie(data.fbp, FBP_PATTERN),
              fbc: cleanFbCookie(data.fbc, FBC_PATTERN),
            },
            custom_data: {
              value: Number(valueInUsd),
              currency: 'USD',
              content_name: data.source || 'website_contact_form',
            },
          }],
          ...(testEventCode ? { test_event_code: testEventCode } : {}),
          access_token: metaAccessToken,
        }),
      }), (response) => describeMetaError(response, metaAccessToken))
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
