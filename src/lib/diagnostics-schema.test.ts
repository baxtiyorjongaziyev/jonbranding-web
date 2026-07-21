import { describe, expect, it } from 'vitest';
import { diagnosticSubmissionSchema, splitContact } from './diagnostics-schema';

const validPayload = {
  fullName: 'Aziz Karimov',
  companyName: 'Oq Yoʻl MChJ',
  industry: 'Logistika',
  contact: '+998901234567',
  consent: true,
  answers: ['A', 'B', 'C', 'A', 'C', 'C', 'B'],
  source: 'tez-natija-6',
};

describe('diagnosticSubmissionSchema', () => {
  it('to\'g\'ri payloadni qabul qiladi', () => {
    expect(diagnosticSubmissionSchema.safeParse(validPayload).success).toBe(true);
  });

  it('roziliksiz payloadni rad etadi', () => {
    const result = diagnosticSubmissionSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
  });

  it('rozilik maydoni yo\'q bo\'lsa rad etadi', () => {
    const { consent, ...withoutConsent } = validPayload;
    expect(diagnosticSubmissionSchema.safeParse(withoutConsent).success).toBe(false);
  });

  it('ismsiz yoki juda qisqa ism bilan rad etadi', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, fullName: 'A' }).success).toBe(false);
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, fullName: '   ' }).success).toBe(false);
  });

  it('Telegram username\'ni qabul qiladi', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: '@azizkarimov' }).success).toBe(true);
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: 'https://t.me/azizkarimov' }).success).toBe(
      true
    );
  });

  it('mahalliy 9 xonali raqamni qabul qiladi', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: '901234567' }).success).toBe(true);
  });

  it('noto\'g\'ri aloqa ma\'lumotini rad etadi', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: 'ism familiya' }).success).toBe(false);
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: '123' }).success).toBe(false);
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: '' }).success).toBe(false);
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: 'ali' }).success).toBe(false);
  });

  // Saytdagi mavjud lead formalari bilan bir xil qoida: @ siz yozilgan 5+ belgili
  // so'z ham haqiqiy Telegram username bo'lishi mumkin, shuning uchun qabul qilinadi.
  it('@ siz yozilgan username qabul qilinadi', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, contact: 'azizkarimov' }).success).toBe(true);
  });

  it('kompaniya va soha ixtiyoriy', () => {
    const { companyName, industry, ...rest } = validPayload;
    expect(diagnosticSubmissionSchema.safeParse(rest).success).toBe(true);
    expect(diagnosticSubmissionSchema.safeParse({ ...rest, companyName: '', industry: '' }).success).toBe(true);
  });

  it('javoblar soni 7 bo\'lishi shart', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: ['A', 'B', 'C'] }).success).toBe(false);
    expect(
      diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: [...validPayload.answers, 'A'] }).success
    ).toBe(false);
  });

  it('noto\'g\'ri javob kaliti rad etiladi', () => {
    expect(
      diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: ['A', 'B', 'D', 'A', 'C', 'C', 'B'] }).success
    ).toBe(false);
    expect(
      diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: ['A', 'B', null, 'A', 'C', 'C', 'B'] }).success
    ).toBe(false);
  });

  it('source ixtiyoriy — bo\'lmasa ham qabul qilinadi', () => {
    const { source, ...rest } = validPayload;
    expect(diagnosticSubmissionSchema.safeParse(rest).success).toBe(true);
  });
});

describe('splitContact', () => {
  it('telefonni ajratadi va normalizatsiya qiladi', () => {
    expect(splitContact('+998 90 123 45 67')).toEqual({ phone: '+998901234567', telegram: '' });
    expect(splitContact('901234567')).toEqual({ phone: '+998901234567', telegram: '' });
  });

  it('Telegram username\'ni ajratadi', () => {
    expect(splitContact('@azizkarimov')).toEqual({ phone: '', telegram: 'azizkarimov' });
    expect(splitContact('https://t.me/azizkarimov')).toEqual({ phone: '', telegram: 'azizkarimov' });
  });

  it('noto\'g\'ri qiymatda bo\'sh natija qaytaradi', () => {
    expect(splitContact('???')).toEqual({ phone: '', telegram: '' });
  });
});
