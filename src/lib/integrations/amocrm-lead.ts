import { forceRefresh, getValidAccessToken } from '@/lib/amocrm-token';
import { buildAmoCrmContactFields } from '@/lib/lead-contact';
import { logger } from '@/lib/logger';

function cleanSecret(value: string | undefined) {
  return String(value || '')
    .replace(/^﻿/, '')
    .trim();
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
      '='
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

export function getAmoCrmBaseUrl(accessToken: string) {
  const configuredHost = getConfiguredAmoCrmHost();
  if (configuredHost) return `https://${configuredHost}`;

  const tokenApiDomain = getAmoCrmApiDomain(accessToken);
  if (tokenApiDomain) return `https://${tokenApiDomain}`;

  return null;
}

export type AmoCrmLeadInput = {
  /** Sdelka nomi. */
  name: string;
  /** Kontakt nomi (ism yoki @username). */
  contactName: string;
  phone?: string;
  telegram?: string;
  price?: number;
  tags?: string[];
  /** Sdelkaga qo'shiladigan izoh (note). */
  note?: string;
};

export type AmoCrmLeadResult =
  | { ok: true; leadId?: number; contactId?: number }
  | { ok: false; skipped?: true; error: string };

/**
 * AmoCRM'da lead + kontakt yaratadi (complex endpoint), keyin izoh qo'shadi.
 * Kalitlar sozlanmagan bo'lsa `skipped: true` qaytaradi — chaqiruvchi mock rejimda ishlashi mumkin.
 */
export async function createAmoCrmLead(input: AmoCrmLeadInput): Promise<AmoCrmLeadResult> {
  let accessToken: string;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    logger.warn('AmoCRM token fetch failed, falling back to env token', { error: String(error) });
    accessToken = parseAmoCrmAccessToken(process.env.AMOCRM_ACCESS_TOKEN);
  }

  let baseUrl = accessToken ? getAmoCrmBaseUrl(accessToken) : null;

  if (!accessToken || !baseUrl) {
    return { ok: false, skipped: true, error: 'AmoCRM configuration is missing' };
  }

  const contactFields = buildAmoCrmContactFields({
    phone: input.phone,
    telegram: input.telegram,
    telegramFieldId: process.env.AMOCRM_TELEGRAM_FIELD_ID,
  });

  const leadBody = JSON.stringify([
    {
      name: input.name,
      price: Number(input.price) || 0,
      ...(input.tags?.length ? { tags_to_add: input.tags.map((name) => ({ name })) } : {}),
      _embedded: {
        contacts: [
          {
            first_name: input.contactName,
            ...(contactFields.length ? { custom_fields_values: contactFields } : {}),
          },
        ],
      },
    },
  ]);

  const post = (token: string, url: string, body: string) =>
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

  try {
    let response = await post(accessToken, `${baseUrl}/api/v4/leads/complex`, leadBody);

    // Token eskirgan bo'lsa bir marta yangilab qayta urinamiz.
    if (response.status === 401) {
      const refreshed = await forceRefresh();
      accessToken = refreshed.access_token;
      baseUrl = getAmoCrmBaseUrl(accessToken) || baseUrl;
      response = await post(accessToken, `${baseUrl}/api/v4/leads/complex`, leadBody);
    }

    const result: any = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        result?.title || result?.detail || result?.message || `AmoCRM HTTP ${response.status}`;
      throw new Error(message);
    }

    const createdLead = Array.isArray(result)
      ? result[0]
      : result?._embedded?.items?.[0] || result?._embedded?.leads?.[0] || result;
    const leadId = createdLead?.id;

    if (leadId && input.note) {
      // Diagnostika javoblari, ball va prioritet aynan shu note'da saqlanadi.
      // 401/429 kabi HTTP xatoda fetch reject qilmaydi — statusni o'zimiz
      // tekshirib loglaymiz, aks holda ma'lumot jimgina yo'qoladi.
      try {
        const noteResponse = await post(
          accessToken,
          `${baseUrl}/api/v4/leads/${leadId}/notes`,
          JSON.stringify([{ note_type: 'common', params: { text: input.note } }])
        );
        if (!noteResponse.ok) {
          const detail = await noteResponse.text().catch(() => '');
          logger.error('AmoCRM note rejected', {
            leadId,
            status: noteResponse.status,
            detail: detail.slice(0, 300),
          });
        }
      } catch (error) {
        logger.error('AmoCRM note error', { leadId, error: String(error) });
      }
    }

    return { ok: true, leadId, contactId: createdLead?.contact_id };
  } catch (error) {
    logger.error('AmoCRM lead error', { error: String(error) });
    return { ok: false, error: String(error) };
  }
}
