import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getValidAccessToken } from '@/lib/amocrm-token';
import { getDb } from '@/lib/firebase-admin';
import { submitFormSchema, type SubmitFormData } from '@/lib/validation/submit-form';
import { guardLeadRequest } from '@/lib/lead-guard';
import { logger } from '@/lib/logger';
import { runAnalyticsDeliveries } from '@/lib/analytics-delivery';
import {
  buildAmoCrmContactFields,
  normalizePhone,
  normalizeTelegramUsername,
  runLeadDeliveries,
} from '@/lib/lead-contact';
import { findAffiliateByPromoCode, createReferral } from '@/lib/affiliate/store';
import { serviceFromHint } from '@/lib/affiliate/payouts';

const AMOCRM_FAILED_LEADS_COLLECTION = 'amocrm_failed_leads';

export type ProcessedLeadData = Omit<SubmitFormData, 'companyWebsite' | 'turnstileToken'> & {
  eventId: string;
  clientIp: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
};

interface AmoCrmResult {
  ok: boolean;
  skipped?: boolean;
  queued?: boolean;
  leadId?: number;
  contactId?: number;
  merged?: boolean;
  error?: string;
}

interface TelegramResponse {
  ok?: boolean;
  description?: string;
  result?: unknown;
}

interface AmoCrmLeadResponseItem {
  id: number;
  contact_id?: number;
  merged?: boolean;
}

function escapeTelegramHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanSecret(value: string | undefined): string {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefined) as unknown as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)])
    ) as unknown as T;
  }
  return value;
}

function parseAmoCrmAccessToken(rawToken: string | undefined): string {
  const cleanToken = cleanSecret(rawToken);
  if (!cleanToken) return '';

  try {
    const tokenBundle = JSON.parse(cleanToken);
    return String(tokenBundle.access_token || '').trim();
  } catch {
    return cleanToken;
  }
}

function getAmoCrmApiDomain(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );
    const claims = JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf8'));
    return typeof claims.api_domain === 'string' ? claims.api_domain : null;
  } catch {
    return null;
  }
}

function getConfiguredAmoCrmHost(): string | null {
  const rawDomain = cleanSecret(process.env.AMOCRM_DOMAIN || process.env.AMOCRM_SUBDOMAIN);
  if (!rawDomain) return null;

  const cleanDomain = rawDomain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  if (!cleanDomain) return null;
  return cleanDomain.includes('.') ? cleanDomain : `${cleanDomain}.amocrm.ru`;
}

function getAmoCrmBaseUrl(accessToken: string): string | null {
  const configuredHost = getConfiguredAmoCrmHost();
  if (configuredHost) return `https://${configuredHost}`;

  const tokenApiDomain = getAmoCrmApiDomain(accessToken);
  if (tokenApiDomain) return `https://${tokenApiDomain}`;

  return null;
}

async function sendTelegramMessage(botToken: string, payload: Record<string, unknown>): Promise<TelegramResponse> {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => null)) as TelegramResponse | null;

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.description || `Telegram HTTP ${response.status}`);
  }

  return result ?? { ok: true };
}

function hasTelegramConfig(botToken: string, chatId: string): boolean {
  return Boolean(botToken && chatId);
}

async function sendTelegramIfConfigured(
  botToken: string,
  chatId: string,
  payload: Record<string, unknown>,
  context: string
): Promise<boolean> {
  if (!hasTelegramConfig(botToken, chatId)) {
    logger.error(`Telegram skipped for ${context}: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID`);
    return false;
  }

  try {
    await sendTelegramMessage(botToken, payload);
    return true;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    logger.error(`Telegram ${context} failed`, { chatId, reason });

    const adminChatId = cleanSecret(process.env.TELEGRAM_ADMIN_CHAT_ID);
    if (adminChatId && adminChatId !== chatId) {
      try {
        await sendTelegramMessage(botToken, {
          ...payload,
          chat_id: adminChatId,
          message_thread_id: undefined,
          text: `<b>Asosiy guruhga yuborilmadi</b>\nSabab: ${escapeTelegramHtml(reason)}\n\n${payload.text}`,
        });
        logger.warn(`Telegram ${context} delivered to fallback chat`, { adminChatId });
      } catch (fallbackError) {
        logger.error(`Telegram ${context} fallback failed`, {
          adminChatId,
          reason: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });
      }
    }

    return false;
  }
}

function describeAmoCrmError(error: unknown): string {
  const errObj = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : null;
  const status = Number(errObj?.status || 0);
  const message = error instanceof Error
    ? error.message
    : (errObj?.message ? String(errObj.message) : String(error || 'Unknown error'));

  if (status === 402 || /payment required/i.test(message)) {
    return "Payment Required: AmoCRM akkaunti yoki API access to'lanmagan";
  }

  return message;
}

async function queueFailedAmoCrmLead(data: ProcessedLeadData, error: unknown): Promise<boolean> {
  try {
    const eventId = String(data.eventId || `lead_${Date.now()}`);
    const errObj = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : null;
    await getDb()
      .collection(AMOCRM_FAILED_LEADS_COLLECTION)
      .doc(eventId)
      .set(
        stripUndefined({
          lead: data,
          status: 'pending',
          integration: 'amocrm',
          error: {
            message: error instanceof Error ? error.message : String(errObj?.message || error || 'Unknown error'),
            status: Number(errObj?.status || 0) || null,
            detail: errObj?.detail || null,
            type: errObj?.type || null,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        { merge: true }
      );
    return true;
  } catch (queueError) {
    logger.error('AmoCRM failed lead queue error', {
      reason: queueError instanceof Error ? queueError.message : String(queueError),
    });
    return false;
  }
}

async function sendToAmoCrm(data: ProcessedLeadData): Promise<AmoCrmResult> {
  let accessToken: string;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    logger.error('Firestore token fetch failed, falling back to static env token', {
      reason: error instanceof Error ? error.message : String(error),
    });
    accessToken = parseAmoCrmAccessToken(process.env.AMOCRM_ACCESS_TOKEN);
  }

  const baseUrl = getAmoCrmBaseUrl(accessToken);

  if (!accessToken || !baseUrl) {
    return { ok: false, skipped: true, error: 'AmoCRM configuration is missing' };
  }

  const fullName = String(data.fullName || 'Website lead').trim();
  const phone = normalizePhone(data.phone);
  const telegram = normalizeTelegramUsername(data.telegram);
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
  ]
    .filter(Boolean)
    .join('\n');

  const contactFields = buildAmoCrmContactFields({
    phone,
    telegram,
    telegramFieldId: process.env.AMOCRM_TELEGRAM_FIELD_ID,
  });
  const contactName = fullName === 'Mijoz' && telegram ? `@${telegram}` : fullName;

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
        name: contactName,
        custom_fields_values: contactFields,
      }],
    },
    custom_fields_values: [
      {
        field_id: 1162383,
        values: [{ value: `jonbranding.uz | ${source}` }],
      },
      {
        field_id: 1162385,
        values: [{ value: 'Website lead form' }],
      },
    ],
  }]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const createResponse = await fetch(`${baseUrl}/api/v4/leads/complex`, {
    method: 'POST',
    headers,
    body: leadBody,
  });

  const createResult = (await createResponse.json().catch(() => null)) as AmoCrmLeadResponseItem[] | null;

  if (!createResponse.ok || !Array.isArray(createResult) || !createResult[0]?.id) {
    const rawResult = createResult as unknown as Record<string, unknown> | null;
    const errorDetail = rawResult?.['validation-errors'] || rawResult;
    const errorType = rawResult?.title || rawResult?.type;
    const message =
      rawResult?.detail ||
      rawResult?.title ||
      `AmoCRM create lead failed with status ${createResponse.status}`;

    const error = Object.assign(new Error(String(message)), {
      status: createResponse.status,
      detail: errorDetail,
      type: errorType,
    });
    throw error;
  }

  const createdLead = createResult[0];
  const leadId = createdLead.id;
  const contactId = createdLead.contact_id;

  if (details) {
    try {
      const noteResponse = await fetch(`${baseUrl}/api/v4/leads/${leadId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify([{
          note_type: 'common',
          params: { text: details },
        }]),
      });

      if (!noteResponse.ok) {
        logger.error(`AmoCRM note add failed with status ${noteResponse.status}`);
      }
    } catch (noteError) {
      logger.error('AmoCRM note add error', {
        reason: noteError instanceof Error ? noteError.message : String(noteError),
      });
    }
  }

  return { ok: true, leadId, contactId, merged: createdLead?.merged === true };
}

function buildTelegramMessage(data: ProcessedLeadData): string {
  const fullName = escapeTelegramHtml(data.fullName);
  const phone = data.phone ? escapeTelegramHtml(data.phone) : null;
  const telegram = data.telegram
    ? `@${escapeTelegramHtml(String(data.telegram).replace('@', ''))}`
    : 'Nomalum';
  const packageSummary = data.packageSummary ? escapeTelegramHtml(data.packageSummary) : '';
  const totalPrice = Number(data.totalPrice) || 0;

  return `
<b>Yangi lead: Jon.Branding</b>

<b>Mijoz:</b> ${fullName}
${phone ? `<b>Telefon:</b> ${phone}\n` : ''}<b>Telegram:</b> ${telegram}

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
  try {
    const ip = getClientIp(request);
    if (!(await rateLimit(`submit-form:${ip}`, 5, 60_000))) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
    const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON request' },
        { status: 400 }
      );
    }

    const guard = await guardLeadRequest(request, body, ip, 'submit-form');
    if (guard.action === 'drop') {
      return NextResponse.json({
        ok: true,
        eventId: `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        integrations: {
          telegram: true,
          amoCrm: true,
          amoCrmQueued: false,
          analytics: false,
          analyticsDelivery: null,
        },
      });
    }
    if (guard.action === 'reject') {
      return NextResponse.json(
        { ok: false, error: 'Verification failed. Please reload the page and try again.' },
        { status: 400 }
      );
    }

    const validatedData = submitFormSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input data', details: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { companyWebsite: _honeypot, turnstileToken: _turnstile, ...cleanData } =
      validatedData.data;

    const cookieHeader = request.headers.get('cookie') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const fbpMatch = cookieHeader.match(/(?:^|;\s*)_fbp=([^;]*)/);
    const fbcMatch = cookieHeader.match(/(?:^|;\s*)_fbc=([^;]*)/);
    const fbp = validatedData.data.fbp || (fbpMatch ? decodeURIComponent(fbpMatch[1]) : undefined);
    const fbc = validatedData.data.fbc || (fbcMatch ? decodeURIComponent(fbcMatch[1]) : undefined);

    const leadData: ProcessedLeadData = {
      ...cleanData,
      eventId: cleanData.eventId || `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      clientIp: ip,
      userAgent,
      fbp,
      fbc,
    };

    const { fullName, phone } = leadData;
    const threadId = cleanSecret(process.env.TELEGRAM_MESSAGE_THREAD_ID);

    const telegramPayload: Record<string, unknown> = {
      chat_id: chatId,
      text: buildTelegramMessage(leadData),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(threadId ? { message_thread_id: Number(threadId) } : {}),
    };

    const [telegramSuccess, amoCrmResult]: [boolean, AmoCrmResult] = await runLeadDeliveries(
      () => sendTelegramIfConfigured(
        botToken,
        chatId,
        telegramPayload,
        'lead alert',
      ),
      () => sendToAmoCrm(leadData).catch(async (error) => {
        logger.error('AmoCRM lead error', {
          reason: error instanceof Error ? error.message : String(error),
        });
        const queued = await queueFailedAmoCrmLead(leadData, error);
        const reason = describeAmoCrmError(error);

        await sendTelegramIfConfigured(
          botToken,
          chatId,
          {
            ...telegramPayload,
            text: [
              '<b>AmoCRMga lead tushmadi</b>',
              '',
              `Sabab: ${escapeTelegramHtml(reason)}`,
              `Backup: ${queued ? 'Firestore queue saqlandi' : 'Firestore queue xato'}`,
              `Mijoz: ${escapeTelegramHtml(fullName)}`,
              ...(phone ? [`Telefon: ${escapeTelegramHtml(phone)}`] : []),
            ].join('\n'),
          },
          'AmoCRM failure alert',
        );

        return { ok: false, queued, error: error instanceof Error ? error.message : String(error) };
      }),
    );

    const analyticsDelivery = await runAnalyticsDeliveries(leadData);
    for (const [channel, delivery] of Object.entries(analyticsDelivery.channels)) {
      if (delivery.state === 'failed') {
        logger.error('Analytics delivery failed', {
          channel,
          eventId: leadData.eventId,
          statusCode: delivery.statusCode,
          reason: delivery.reason,
          durationMs: delivery.durationMs,
        });
      }
    }

    try {
      const promoRaw = String(leadData.promoCode || '').trim();
      if (promoRaw) {
        const affiliate = await findAffiliateByPromoCode(promoRaw.toUpperCase());
        if (affiliate) {
          // Prefer stable, locale-independent calculator IDs (serviceKeys, e.g.
          // "logoPremium") over localized display text (packageSummary), which
          // may not tokenize to a known service in every language/script.
          const serviceHintSource =
            (Array.isArray(leadData.serviceKeys) && leadData.serviceKeys.length
              ? leadData.serviceKeys.join(',')
              : '') ||
            leadData.packageSummary ||
            leadData.role ||
            '';
          const hint = serviceFromHint(serviceHintSource);
          if (!amoCrmResult?.leadId) {
            logger.warn('Affiliate referral created without amoCRM lead id — will not auto-match on webhook', {
              promoCode: affiliate.promoCode,
            });
          }
          await createReferral({
            affiliateId: affiliate.id,
            amocrmLeadId: amoCrmResult?.leadId ?? null,
            leadName: String(fullName || 'Mijoz'),
            leadPhone: normalizePhone(leadData.phone) || '',
            serviceHint: hint ?? (serviceHintSource || null),
          });
          logger.info('Affiliate referral recorded', {
            promoCode: affiliate.promoCode,
            leadId: amoCrmResult?.leadId ?? null,
          });
        }
      }
    } catch (error) {
      logger.error('Affiliate attribution failed', {
        reason: error instanceof Error ? error.message : String(error),
      });
    }

    return NextResponse.json({
      ok: true,
      eventId: leadData.eventId,
      integrations: {
        telegram: telegramSuccess,
        amoCrm: amoCrmResult.ok === true,
        amoCrmQueued: amoCrmResult.queued === true,
        analytics: analyticsDelivery.ok,
        analyticsDelivery,
      },
    });
  } catch (error: unknown) {
    logger.error('Submit form error', {
      reason: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
