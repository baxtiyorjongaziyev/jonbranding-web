const E164_PHONE_PATTERN = /^\+\d{7,15}$/;
const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z0-9_]{5,32}$/;

export type AmoCrmContactField = {
  field_code?: 'PHONE';
  field_id?: number;
  values: Array<{
    value: string;
    enum_code?: 'MOB';
  }>;
};

export function normalizePhone(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  // Jon.Branding auditoriyasining asosiy bozori O'zbekiston:
  // 9 xonali mahalliy raqamni xalqaro formatga keltiramiz.
  if (digits.length === 9) digits = `998${digits}`;

  return digits ? `+${digits}` : '';
}

export function isValidPhone(value: unknown) {
  return E164_PHONE_PATTERN.test(normalizePhone(value));
}

export function normalizeTelegramUsername(value: unknown) {
  return String(value ?? '')
    .trim()
    .replace(/^https?:\/\/(?:t\.me|telegram\.me)\//i, '')
    .replace(/^@+/, '')
    .replace(/[/?#].*$/, '');
}

export function isValidTelegramUsername(value: unknown) {
  return TELEGRAM_USERNAME_PATTERN.test(normalizeTelegramUsername(value));
}

function parsePositiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function buildAmoCrmContactFields({
  phone,
  telegram,
  telegramFieldId,
}: {
  phone?: unknown;
  telegram?: unknown;
  telegramFieldId?: unknown;
}) {
  const fields: AmoCrmContactField[] = [];
  const normalizedPhone = normalizePhone(phone);
  const telegramUsername = normalizeTelegramUsername(telegram);
  const parsedTelegramFieldId = parsePositiveInteger(telegramFieldId);

  if (isValidPhone(normalizedPhone)) {
    fields.push({
      field_code: 'PHONE',
      values: [{ value: normalizedPhone, enum_code: 'MOB' }],
    });
  }

  if (isValidTelegramUsername(telegramUsername) && parsedTelegramFieldId) {
    fields.push({
      field_id: parsedTelegramFieldId,
      values: [{ value: `https://t.me/${telegramUsername}` }],
    });
  }

  return fields;
}

export async function runLeadDeliveries<TTelegram, TAmoCrm>(
  deliverToTelegram: () => Promise<TTelegram>,
  deliverToAmoCrm: () => Promise<TAmoCrm>,
): Promise<[TTelegram, TAmoCrm]> {
  return Promise.all([deliverToTelegram(), deliverToAmoCrm()]);
}
