import { logger } from '@/lib/logger';
import { getValidAccessToken, forceRefresh } from '@/lib/amocrm-token';
import {
  buildAmoCrmContactFields,
  normalizePhone,
  normalizeTelegramUsername,
} from '@/lib/lead-contact';
import { type LeadData, type AmoCrmLeadResult, type AmoCrmErrorShape } from './lead-types';

function cleanSecret(value: string | undefined): string {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
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

interface ComplexItem {
  id?: number;
  contact_id?: number;
  merged?: boolean;
}

interface ComplexResponse {
  title?: string;
  detail?: string;
  message?: string;
  type?: string;
  id?: number;
  contact_id?: number;
  merged?: boolean;
  _embedded?: {
    items?: ComplexItem[];
    leads?: ComplexItem[];
  };
}

export async function sendToAmoCrm(data: LeadData): Promise<AmoCrmLeadResult> {
  if (process.env.MOCK_AMOCRM === 'true') {
    const mockLeadId = Math.floor(100000 + Math.random() * 900000);
    const mockContactId = Math.floor(100000 + Math.random() * 900000);
    logger.info('[HARNESS-MOCK] AmoCRM lead simulated (MOCK_AMOCRM=true)', {
      mockLeadId,
      mockContactId,
      phone: data.phone,
    });
    return {
      ok: true,
      leadId: mockLeadId,
      contactId: mockContactId,
    };
  }

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
    data.pagePath ? `Sahifa: ${data.pagePath}` : '',
    data.section ? `Section: ${data.section}` : '',
    data.offerType ? `Offer: ${data.offerType}` : '',
    data.ctaLabel ? `CTA matni: ${data.ctaLabel}` : '',
    data.referrer ? `Referrer: ${data.referrer}` : '',
    data.utmSource ? `UTM source: ${data.utmSource}` : '',
    data.utmMedium ? `UTM medium: ${data.utmMedium}` : '',
    data.utmCampaign ? `UTM campaign: ${data.utmCampaign}` : '',
    data.utmContent ? `UTM content: ${data.utmContent}` : '',
    data.utmTerm ? `UTM term: ${data.utmTerm}` : '',
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
        first_name: contactName,
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

  if (createResponse.status === 401) {
    try {
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

  const createResult = (await createResponse.json().catch(() => null)) as
    | ComplexResponse
    | ComplexItem[]
    | null;

  if (!createResponse.ok) {
    const single = createResult && !Array.isArray(createResult) ? createResult : null;
    const message =
      single?.title ||
      single?.detail ||
      single?.message ||
      `AmoCRM HTTP ${createResponse.status}`;
    const error = new Error(message) as Error & AmoCrmErrorShape;
    error.status = createResponse.status;
    error.detail = single?.detail;
    error.type = single?.type;
    throw error;
  }

  const createdLead: ComplexItem | null | undefined = Array.isArray(createResult)
    ? createResult[0]
    : createResult?._embedded?.items?.[0] || createResult?._embedded?.leads?.[0] || createResult;
  const leadId = createdLead?.id;
  const contactId = createdLead?.contact_id;

  if (leadId && details) {
    await fetch(`${baseUrl}/api/v4/leads/${leadId}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          note_type: 'common',
          params: { text: details },
        },
      ]),
    }).catch((error) => console.error('AmoCRM note error:', error));
  }

  return { ok: true, leadId, contactId, merged: createdLead?.merged === true };
}
