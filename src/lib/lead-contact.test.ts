import { describe, expect, it, vi } from 'vitest';
import {
  buildAmoCrmContactFields,
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
  runLeadDeliveries,
} from './lead-contact';
import { leadFormSchema } from './lead-form-schema';

describe('lead contact normalization', () => {
  it('normalizes Uzbek local and formatted international phone numbers', () => {
    expect(normalizePhone('90 123 45 67')).toBe('+998901234567');
    expect(normalizePhone('+998 (90) 123-45-67')).toBe('+998901234567');
    expect(isValidPhone('+998901234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  it('normalizes Telegram usernames and links', () => {
    expect(normalizeTelegramUsername('@Sardor')).toBe('Sardor');
    expect(normalizeTelegramUsername('https://t.me/Sardor?start=site')).toBe('Sardor');
    expect(isValidTelegramUsername('@Sardor')).toBe(true);
    expect(isValidTelegramUsername('@a!')).toBe(false);
  });
});

describe('AmoCRM contact fields', () => {
  it('builds phone and configured Telegram URL fields', () => {
    expect(buildAmoCrmContactFields({
      phone: '90 123 45 67',
      telegram: '@Sardor',
      telegramFieldId: '12345',
    })).toEqual([
      {
        field_code: 'PHONE',
        values: [{ value: '+998901234567', enum_code: 'MOB' }],
      },
      {
        field_id: 12345,
        values: [{ value: 'https://t.me/Sardor' }],
      },
    ]);
  });

  it('keeps a valid phone when Telegram field ID is not configured', () => {
    expect(buildAmoCrmContactFields({
      phone: '+998901234567',
      telegram: '@Sardor',
      telegramFieldId: '',
    })).toEqual([
      {
        field_code: 'PHONE',
        values: [{ value: '+998901234567', enum_code: 'MOB' }],
      },
    ]);
  });
});

describe('lead form rules', () => {
  it('requires a phone for at_modal and normalizes accepted contacts', () => {
    const rejected = leadFormSchema.safeParse({
      fullName: 'Sardor',
      telegram: '@Sardor',
      source: 'at_modal',
    });
    expect(rejected.success).toBe(false);

    const accepted = leadFormSchema.parse({
      fullName: 'Sardor',
      phone: '90 123 45 67',
      telegram: '@Sardor',
      source: 'at_modal',
    });
    expect(accepted.phone).toBe('+998901234567');
    expect(accepted.telegram).toBe('Sardor');
  });

  it('keeps Telegram-only support for other lead forms', () => {
    expect(leadFormSchema.parse({
      fullName: 'Sardor',
      telegram: '@Sardor',
      source: 'website_contact_form',
    }).telegram).toBe('Sardor');
  });
});

describe('parallel lead deliveries', () => {
  it('starts both deliveries before either one resolves', async () => {
    let resolveTelegram!: (value: boolean) => void;
    const telegram = vi.fn(() => new Promise<boolean>((resolve) => {
      resolveTelegram = resolve;
    }));
    const amoCrm = vi.fn(async () => ({ ok: true }));

    const deliveries = runLeadDeliveries(telegram, amoCrm);

    expect(telegram).toHaveBeenCalledOnce();
    expect(amoCrm).toHaveBeenCalledOnce();

    resolveTelegram(true);
    await expect(deliveries).resolves.toEqual([true, { ok: true }]);
  });
});
