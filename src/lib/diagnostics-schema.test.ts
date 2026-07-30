import { describe, expect, it } from 'vitest';
import { diagnosticSubmissionSchema, splitContact } from './diagnostics-schema';

// Segment B = tarqoq: barcha 8 savol ko'rinadi, hammasi to'ldirilgan.
const validPayload = {
  fullName: 'Aziz Karimov',
  companyName: 'Oq Yoʻl MChJ',
  industry: 'Logistika',
  contact: '+998901234567',
  consent: true,
  answers: ['B', 'A', 'B', 'C', 'A', 'C', 'C', 'B'],
  source: 'tez-natija-6',
};

// Segment A = yangi: brendbuk (5-savol) ko'rinmaydi, shu katak null qoladi.
const yangiPayload = {
  ...validPayload,
  answers: ['A', 'A', 'B', 'C', null, 'C', 'C', 'B'],
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

  it('shoxlangan yo\'l: ko\'rinmaydigan savol null bo\'lsa ham qabul qilinadi', () => {
    expect(diagnosticSubmissionSchema.safeParse(yangiPayload).success).toBe(true);
  });

  it('segment tanlanmagan bo\'lsa rad etadi', () => {
    const answers = [null, null, null, null, null, null, null, null];
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, answers }).success).toBe(false);
  });

  it('ko\'rinadigan savol javobsiz bo\'lsa rad etadi', () => {
    // tarqoq bosqichda brendbuk (5-savol) ko'rinadi — null bo'lsa to'liq emas.
    const answers = ['B', 'A', 'B', 'C', null, 'C', 'C', 'B'];
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, answers }).success).toBe(false);
  });

  it('javoblar soni 8 bo\'lishi shart', () => {
    expect(diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: ['A', 'B', 'C'] }).success).toBe(false);
    expect(
      diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: [...validPayload.answers, 'A'] }).success
    ).toBe(false);
  });

  it('noto\'g\'ri javob kaliti rad etiladi', () => {
    expect(
      diagnosticSubmissionSchema.safeParse({ ...validPayload, answers: ['B', 'A', 'D', 'C', 'A', 'C', 'C', 'B'] })
        .success
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
