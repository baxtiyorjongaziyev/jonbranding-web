import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getValidAccessToken, forceRefresh } from '@/lib/amocrm-token';
import { getDb } from '@/lib/firebase-admin';

const formSchema = z.object({
    fullName: z.string().min(2, 'Name is too short').max(100),
    phone: z.string().min(7, 'Phone is too short').max(30),
    telegram: z.string().optional(),
    role: z.string().optional(),
    revenue: z.string().optional(),
    ambition: z.string().optional(),
    pain: z.string().optional(),
    budget: z.string().optional(),
    source: z.string().optional(),
    lang: z.string().optional(),
    packageSummary: z.string().optional(),
    totalPrice: z.number().optional(),
    eventId: z.string().optional(),
    gaClientId: z.string().optional(),
    pageLocation: z.string().optional(),
    ctaSource: z.string().optional(),
});

const UZS_TO_USD_RATE = 1 / 12700;
const DEFAULT_GA_MEASUREMENT_ID = 'G-BTSGJQLMMV';
const AMOCRM_FAILED_LEADS_COLLECTION = 'amocrm_failed_leads';

function escapeTelegramHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanSecret(value: string | undefined) {
  return String(value || '').replace(/^\uFEFF/, '').trim();
}

function normalizePhone(phone: unknown) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

function sha256(value: unknown) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return '';
  return createHash('sha256').update(normalized).digest('hex');
}

function stripUndefined(value: any): any {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)]),
    );
  }
  return value;
}

function parseAmoCrmAccessToken(rawToken: string | undefined) {
  const cleanToken = cleanSecret(rawToken);
  if (!cleanToken) return '';

  try {
    const tokenBundle = JSON.parse(cleanToken);
    return String(tokenBundle.access_token || '').trim();
  } catch {
    return cleanToken;
  }
}

function getAmoCrmApiDomain(accessToken: string) {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    );
    const claims = JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf8'));
    return typeof claims.api_domain === 'string' ? claims.api_domain : null;
  } catch {
    return null;
  }
}

function getConfiguredAmoCrmHost() {
  const rawDomain = cleanSecret(process.env.AMOCRM_DOMAIN || process.env.AMOCRM_SUBDOMAIN);
  if (!rawDomain) return null;

  const cleanDomain = rawDomain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  if (!cleanDomain) return null;
  return cleanDomain.includes('.') ? cleanDomain : `${cleanDomain}.amocrm.ru`;
}

function getAmoCrmBaseUrl(accessToken: string) {
  const configuredHost = getConfiguredAmoCrmHost();
  if (configuredHost) return `https://${configuredHost}`;

  const tokenApiDomain = getAmoCrmApiDomain(accessToken);
  if (tokenApiDomain) return `https://${tokenApiDomain}`;

  return null;
}

async function sendTelegramMessage(botToken: string, payload: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result: any = await response.json().catch(() => null);

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.description || `Telegram HTTP ${response.status}`);
  }

  return result;
}

async function sendMetaConversionEvent(data: any) {
  const accessToken = cleanSecret(process.env.META_API_ACCESS_TOKEN);
  const pixelId = '1134785364752294';
  if (!accessToken || !pixelId) return;

  const valueInUzs = data.totalPrice || 0;
  const valueInUsd = (valueInUzs * UZS_TO_USD_RATE).toFixed(2);

  try {
    await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events`, {
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
        access_token: accessToken,
      }),
    });
  } catch (error) {
    console.error('Meta CAPI error:', error);
  }
}

async function sendGAConversionEvent(data: any) {
  const gaApiSecret = cleanSecret(process.env.GA_API_SECRET);
  const gaMeasurementId = cleanSecret(process.env.NEXT_PUBLIC_GA_ID) || DEFAULT_GA_MEASUREMENT_ID;
  if (!gaApiSecret) return;

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${gaMeasurementId}&api_secret=${gaApiSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: data.gaClientId || data.eventId || '555.555',
        events: [{
          name: 'generate_lead',
          params: {
            event_id: data.eventId,
            value: data.totalPrice || 0,
            currency: 'UZS',
            source: data.source || 'website_contact_form',
            cta_source: data.ctaSource,
            page_location: data.pageLocation,
          },
        }],
      }),
    });
  } catch (error) {
    console.error('GA4 error:', error);
  }
}

async function sendToN8n(data: any) {
  const n8nWebhookUrl = cleanSecret(process.env.N8N_WEBHOOK_URL);
  if (!n8nWebhookUrl) return;

  try {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        source: data.source || 'website_contact_form',
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('n8n error:', error);
  }
}

function describeAmoCrmError(error: any) {
  const status = Number(error?.status || 0);
  const message = String(error?.message || error || 'Unknown error');

  if (status === 402 || /payment required/i.test(message)) {
    return "Payment Required: AmoCRM akkaunti yoki API access to'lanmagan";
  }

  return message;
}

async function queueFailedAmoCrmLead(data: any, error: any) {
  try {
    const eventId = String(data.eventId || `lead_${Date.now()}`);
    await getDb().collection(AMOCRM_FAILED_LEADS_COLLECTION).doc(eventId).set(stripUndefined({
      lead: data,
      status: 'pending',
      integration: 'amocrm',
      error: {
        message: String(error?.message || error || 'Unknown error'),
        status: Number(error?.status || 0) || null,
        detail: error?.detail || null,
        type: error?.type || null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }), { merge: true });
    return true;
  } catch (queueError) {
    console.error('AmoCRM failed lead queue error:', queueError);
    return false;
  }
}

async function sendToAmoCrm(data: any) {
  let accessToken: string;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    console.error('Firestore token fetch failed, falling back to static env token:', error);
    accessToken = parseAmoCrmAccessToken(process.env.AMOCRM_ACCESS_TOKEN);
  }

  let baseUrl = getAmoCrmBaseUrl(accessToken);

  if (!accessToken || !baseUrl) {
    return { ok: false, skipped: true, error: 'AmoCRM configuration is missing' };
  }

  const fullName = String(data.fullName || 'Website lead').trim();
  const phone = normalizePhone(data.phone);
  const telegram = String(data.telegram || '').replace(/^@/, '').trim();
  const source = data.source || 'website_contact_form';
  const price = Number(data.totalPrice) || 0;

  const details = [
    `Manba: ${source}`,
    data.lang ? `Til: ${String(data.lang).toUpperCase()}` : '',
    data.phone ? `Telefon: ${data.phone}` : '',
    telegram ? `Telegram: @${telegram}` : '',
    data.role ? `Rol: ${data.role}` : '',
    data.revenue ? `Oborot: ${data.revenue}` : '',
    data.ambition ? `Maqsad: ${data.ambition}` : '',
    data.pain ? `Tosiq: ${data.pain}` : '',
    data.budget ? `Byudjet: ${data.budget}` : '',
    data.packageSummary ? `Paket: ${data.packageSummary}` : '',
    price ? `Narx: ${price.toLocaleString('fr-FR')} som` : '',
  ].filter(Boolean).join('\n');

  const contactFields: any[] = [];
  if (phone) {
    contactFields.push({
      field_code: 'PHONE',
      values: [{ value: phone, enum_code: 'WORK' }],
    });
  }

  const leadBody = JSON.stringify([{
    name: `Jon.Branding site: ${fullName}`,
    price,
    tags_to_add: [
      { name: 'jonbranding.uz' },
      { name: 'website' },
      { name: String(source) },
    ],
    _embedded: {
      contacts: [{
        first_name: fullName,
        ...(contactFields.length ? { custom_fields_values: contactFields } : {}),
      }],
    },
  }]);

  let createResponse = await fetch(`${baseUrl}/api/v4/leads/complex`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: leadBody,
  });

  // Retry once with a fresh token if the current one is stale
  if (createResponse.status === 401) {
    try {
      console.log('AmoCRM returned 401. Triggering force token refresh...');
      const refreshed = await forceRefresh();
      accessToken = refreshed.access_token;
      baseUrl = getAmoCrmBaseUrl(accessToken) || baseUrl;
      createResponse = await fetch(`${baseUrl}/api/v4/leads/complex`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: leadBody,
      });
    } catch (refreshError) {
      console.error('Failed to refresh AmoCRM token on 401:', refreshError);
    }
  }

  const createResult: any = await createResponse.json().catch(() => null);

  if (!createResponse.ok) {
    const message = createResult?.title || createResult?.detail || createResult?.message || `AmoCRM HTTP ${createResponse.status}`;
    const error: any = new Error(message);
    error.status = createResponse.status;
    error.detail = createResult?.detail;
    error.type = createResult?.type;
    throw error;
  }

  const leadId = Array.isArray(createResult)
    ? createResult[0]?.id
    : createResult?._embedded?.items?.[0]?.id || createResult?._embedded?.leads?.[0]?.id || createResult?.id;

  if (leadId && details) {
    await fetch(`${baseUrl}/api/v4/leads/${leadId}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        note_type: 'common',
        params: { text: details },
      }]),
    }).catch((error) => console.error('AmoCRM note error:', error));
  }

  return { ok: true, leadId };
}

function buildTelegramMessage(data: any) {
  const fullName = escapeTelegramHtml(data.fullName);
  const phone = escapeTelegramHtml(data.phone);
  const telegram = data.telegram
    ? `@${escapeTelegramHtml(String(data.telegram).replace('@', ''))}`
    : 'Nomalum';
  const packageSummary = data.packageSummary ? escapeTelegramHtml(data.packageSummary) : '';
  const totalPrice = Number(data.totalPrice) || 0;

  return `
<b>Yangi lead: Jon.Branding</b>

<b>Mijoz:</b> ${fullName}
<b>Telefon:</b> ${phone}
<b>Telegram:</b> ${telegram}

<b>Rol:</b> ${escapeTelegramHtml(data.role || 'Kiritilmagan')}
<b>Oborot:</b> ${escapeTelegramHtml(data.revenue || 'Kiritilmagan')}
<b>Maqsad:</b> ${escapeTelegramHtml(data.ambition || 'Kiritilmagan')}
<b>Tosiq:</b> ${escapeTelegramHtml(data.pain || 'Kiritilmagan')}
<b>Byudjet:</b> ${escapeTelegramHtml(data.budget || 'Kiritilmagan')}

<b>Til:</b> ${escapeTelegramHtml(String(data.lang || 'uz').toUpperCase())}
<b>Manba:</b> ${escapeTelegramHtml(data.source || 'website')}
${data.ctaSource ? `<b>CTA:</b> ${escapeTelegramHtml(data.ctaSource)}\n` : ''}
${data.eventId ? `<b>Event ID:</b> ${escapeTelegramHtml(data.eventId)}\n` : ''}
${packageSummary ? `\n<b>Paket:</b> ${packageSummary}` : ''}
${totalPrice ? `\n<b>Narx:</b> ${escapeTelegramHtml(totalPrice.toLocaleString('fr-FR'))} som` : ''}
  `.trim();
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`submit-form:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);

  if (!botToken || !chatId) {
    return NextResponse.json({ ok: false, error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    
    // Validate input using Zod
    const validatedData = formSchema.safeParse(body);
    if (!validatedData.success) {
        return NextResponse.json(
            { ok: false, error: "Invalid input data", details: validatedData.error.format() }, 
            { status: 400 }
        );
    }

    const leadData = {
      ...validatedData.data,
      eventId: validatedData.data.eventId || `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    };

    const { fullName, phone } = leadData;

    const telegramPayload: any = {
      chat_id: chatId,
      text: buildTelegramMessage(leadData),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    await sendTelegramMessage(botToken, telegramPayload);

    const amoCrmResult: any = await sendToAmoCrm(leadData).catch(async (error) => {
      console.error('AmoCRM lead error:', error);
      const queued = await queueFailedAmoCrmLead(leadData, error);
      const reason = describeAmoCrmError(error);
      await sendTelegramMessage(botToken, {
        ...telegramPayload,
        text: [
          '<b>AmoCRMga lead tushmadi</b>',
          '',
          `Sabab: ${escapeTelegramHtml(reason)}`,
          `Backup: ${queued ? 'Firestore queue saqlandi' : 'Firestore queue xato'}`,
          `Mijoz: ${escapeTelegramHtml(fullName)}`,
          `Telefon: ${escapeTelegramHtml(phone)}`,
        ].join('\n'),
      }).catch((telegramError) => console.error('AmoCRM failure Telegram alert error:', telegramError));
      return { ok: false, queued, error: error?.message || String(error) };
    });

    sendMetaConversionEvent(leadData).catch(() => {});
    sendGAConversionEvent(leadData).catch(() => {});
    sendToN8n(leadData).catch(() => {});

    return NextResponse.json({
      ok: true,
      eventId: leadData.eventId,
      integrations: {
        telegram: true,
        amoCrm: amoCrmResult.ok === true,
        amoCrmQueued: amoCrmResult.queued === true,
        analytics: true,
      },
    });
  } catch (error: any) {
    console.error('Submit form error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
