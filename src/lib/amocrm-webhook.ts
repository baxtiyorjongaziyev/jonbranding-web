import { escapeTelegramHtml } from './telegram-html';

export { escapeTelegramHtml };

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_FIELDS = 2000;

type Node = Record<string, unknown> | unknown[];

/**
 * amoCRM webhook'lari `application/x-www-form-urlencoded` ko'rinishida keladi:
 * `leads[status][0][id]=123&leads[status][0][status_id]=142`.
 * Bu funksiya ularni JSON bilan bir xil ichma-ich obyektga aylantiradi:
 * `{ leads: { status: [{ id: '123', status_id: '142' }] } }`.
 */
export function parseBracketForm(params: URLSearchParams): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let count = 0;

  params.forEach((value, rawKey) => {
    if (++count > MAX_FIELDS) return;
    const parts = rawKey.replace(/\]/g, '').split('[').filter((part) => part !== '');
    if (parts.length === 0 || parts.some((part) => UNSAFE_KEYS.has(part))) return;

    let node: Node = root;
    parts.forEach((part, index) => {
      const target = node as Record<string, unknown>;
      if (index === parts.length - 1) {
        target[part] = value;
        return;
      }
      const nextIsIndex = /^\d+$/.test(parts[index + 1]);
      if (target[part] === null || typeof target[part] !== 'object') {
        target[part] = nextIsIndex ? [] : {};
      }
      node = target[part] as Node;
    });
  });

  return root;
}

/** JSON (n8n/Make relay) yoki form-urlencoded (amoCRM'ning o'zi) tanani o'qiydi. */
export async function readWebhookBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') || '';
  const raw = await request.text();
  if (contentType.includes('application/json') || /^\s*[{[]/.test(raw)) {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  }
  return parseBracketForm(new URLSearchParams(raw));
}


/** AMOCRM_SUBDOMAIN "jonbranding" yoki "jonbranding.amocrm.ru" bo'lishi mumkin. */
export function amoCrmLeadUrl(leadId: unknown, rawDomain: string | undefined): string | null {
  const id = Number(leadId);
  const domain = String(rawDomain || '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
  if (!Number.isFinite(id) || id <= 0 || !domain) return null;
  const host = domain.includes('.') ? domain : `${domain}.amocrm.ru`;
  return `https://${host}/leads/detail/${id}`;
}
