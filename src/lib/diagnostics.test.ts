import { describe, expect, it } from 'vitest';
import {
  calculateScore,
  collectGaps,
  createEmptyAnswerSheet,
  DEFAULT_SOURCE,
  describeAnswer,
  describeGaps,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_RESULTS,
  getPriority,
  getResultCategory,
  getSalesStatus,
  isAnswerSheetComplete,
  MAX_SCORE,
  resolveSource,
  resolveUtmParams,
  scoreDiagnostic,
  SERVICE_ORDER,
  SERVICES,
  TOTAL_QUESTIONS,
  type AnswerSheet,
  type OptionKey,
} from './diagnostics';

function sheet(...keys: OptionKey[]): AnswerSheet {
  return keys;
}

const allA = sheet('A', 'A', 'A', 'A', 'A', 'A', 'A');
const allB = sheet('B', 'B', 'B', 'B', 'B', 'B', 'B');
const allC = sheet('C', 'C', 'C', 'C', 'C', 'C', 'C');

describe('savollar tuzilishi', () => {
  it('7 ta savol, har birida 3 ta variant', () => {
    expect(DIAGNOSTIC_QUESTIONS).toHaveLength(7);
    expect(TOTAL_QUESTIONS).toBe(7);
    for (const question of DIAGNOSTIC_QUESTIONS) {
      expect(question.options.map((option) => option.key)).toEqual(['A', 'B', 'C']);
      expect(question.options.map((option) => option.score)).toEqual([0, 1, 2]);
    }
  });

  it('maksimal ball 14', () => {
    expect(MAX_SCORE).toBe(14);
    expect(calculateScore(allC)).toBe(14);
  });

  it('savol id lari 1 dan 7 gacha va takrorlanmaydi', () => {
    expect(DIAGNOSTIC_QUESTIONS.map((question) => question.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("tayyorlik savollari o'z o'rnida turadi", () => {
    // Tayyorlik 6- va 7-savoldan hisoblanadi. Ular boshqa mavzuga
    // almashtirilsa yoki tartib buzilsa, tasnif jimgina noto'g'ri ishlaydi.
    expect(DIAGNOSTIC_QUESTIONS[5].question).toMatch(/qachon/i);
    expect(DIAGNOSTIC_QUESTIONS[6].question).toMatch(/qaror/i);
  });
});

describe('calculateScore', () => {
  it('A=0, B=1, C=2 bo\'yicha yig\'adi', () => {
    expect(calculateScore(allA)).toBe(0);
    expect(calculateScore(allB)).toBe(7);
    expect(calculateScore(sheet('A', 'B', 'C', 'A', 'B', 'C', 'A'))).toBe(6);
  });

  it('javob berilmagan savolni 0 deb hisoblaydi', () => {
    expect(calculateScore(createEmptyAnswerSheet())).toBe(0);
    expect(calculateScore(['C', null, 'C', null, null, null, null])).toBe(4);
  });

  it('javobni almashtirish ballni ikki marta qo\'shmaydi (orqaga qaytish stsenariysi)', () => {
    const answers: AnswerSheet = createEmptyAnswerSheet();
    answers[0] = 'C';
    expect(calculateScore(answers)).toBe(2);

    // Foydalanuvchi orqaga qaytib boshqa javobni tanladi.
    answers[0] = 'A';
    expect(calculateScore(answers)).toBe(0);

    answers[0] = 'B';
    answers[0] = 'B';
    expect(calculateScore(answers)).toBe(1);
  });

  it('barcha 3^7 kombinatsiyada ball variantlar yig\'indisiga teng', () => {
    const keys: OptionKey[] = ['A', 'B', 'C'];
    const scoreByKey: Record<OptionKey, number> = { A: 0, B: 1, C: 2 };
    let checked = 0;

    const walk = (current: OptionKey[]) => {
      if (current.length === TOTAL_QUESTIONS) {
        const expected = current.reduce((total, key) => total + scoreByKey[key], 0);
        expect(calculateScore(current)).toBe(expected);
        expect(calculateScore(current)).toBeLessThanOrEqual(MAX_SCORE);
        checked += 1;
        return;
      }
      for (const key of keys) walk([...current, key]);
    };

    walk([]);
    expect(checked).toBe(3 ** 7);
  });
});

describe('getResultCategory', () => {
  // Tasnif faqat 6-savol (muddat) va 7-savol (qaror) dan kelib chiqadi.
  it('tayyorlik 3–4 → qualified', () => {
    expect(getResultCategory(sheet('A', 'A', 'A', 'A', 'A', 'C', 'C'))).toBe('qualified');
    expect(getResultCategory(sheet('A', 'A', 'A', 'A', 'A', 'C', 'B'))).toBe('qualified');
  });

  it('tayyorlik 2 → potential', () => {
    expect(getResultCategory(sheet('C', 'C', 'C', 'C', 'C', 'B', 'B'))).toBe('potential');
    expect(getResultCategory(sheet('C', 'C', 'C', 'C', 'C', 'C', 'A'))).toBe('potential');
  });

  it('tayyorlik 0–1 → nurture', () => {
    expect(getResultCategory(allA)).toBe('nurture');
    expect(getResultCategory(sheet('C', 'C', 'C', 'C', 'C', 'A', 'B'))).toBe('nurture');
  });

  it("yetuklik balli tasnifga ta'sir qilmaydi", () => {
    // Ikkala javob varaqasida ham muddat va qaror bir xil, faqat yetuklik farq qiladi.
    const yosh = sheet('A', 'A', 'A', 'A', 'A', 'C', 'C');
    const yetuk = sheet('C', 'C', 'C', 'C', 'C', 'C', 'C');
    expect(calculateScore(yosh)).toBeLessThan(calculateScore(yetuk));
    expect(getResultCategory(yosh)).toBe(getResultCategory(yetuk));
  });

  it('har bir kategoriya uchun matn mavjud', () => {
    for (const category of ['nurture', 'potential', 'qualified'] as const) {
      expect(DIAGNOSTIC_RESULTS[category].title.length).toBeGreaterThan(0);
      expect(DIAGNOSTIC_RESULTS[category].description.length).toBeGreaterThan(0);
      expect(DIAGNOSTIC_RESULTS[category].advice.length).toBeGreaterThan(0);
    }
  });
});

describe('collectGaps', () => {
  it("hech narsasi yo'q mijozga hamma xizmat kerak", () => {
    expect(collectGaps(allA)).toEqual([
      'naming',
      'patent',
      'logo',
      'firma-uslubi',
      'brandbook',
      'qadoq',
    ]);
  });

  it("hammasi joyida bo'lsa bo'shliq yo'q", () => {
    expect(collectGaps(allC)).toEqual([]);
  });

  it('takrorlanmaydi va SERVICE_ORDER tartibida qaytadi', () => {
    // 1-savol A → naming+patent, 2-savol A → yana patent.
    const gaps = collectGaps(sheet('A', 'A', 'C', 'C', 'C', 'A', 'A'));
    expect(gaps).toEqual(['naming', 'patent']);
    expect(new Set(gaps).size).toBe(gaps.length);
  });

  it("xizmat ko'rsatuvchi biznesga qadoq taklif qilinmaydi", () => {
    expect(collectGaps(sheet('C', 'C', 'C', 'C', 'B', 'C', 'C'))).toEqual([]);
  });

  it('faqat brendbuk yetishmasa bitta band qaytadi', () => {
    expect(collectGaps(sheet('C', 'C', 'C', 'B', 'C', 'C', 'C'))).toEqual(['brandbook']);
  });
});

describe('getPriority', () => {
  it("muddat 1–3 oy bo'lsa — high", () => {
    expect(getPriority(sheet('C', 'C', 'C', 'C', 'C', 'C', 'A'))).toBe('high');
  });

  it("o'zi qaror qiladi va 3+ bo'shliq bo'lsa — high", () => {
    expect(getPriority(sheet('A', 'A', 'A', 'A', 'A', 'B', 'C'))).toBe('high');
  });

  it("o'zi qaror qiladi, lekin bo'shliq kam — normal", () => {
    expect(getPriority(sheet('C', 'C', 'C', 'B', 'C', 'B', 'C'))).toBe('normal');
  });

  it("muddat yo'q va qaror boshqada — normal", () => {
    expect(getPriority(allA)).toBe('normal');
  });
});

describe('getSalesStatus', () => {
  it("muddat 1–3 oy va o'zi qaror qilsa — hot", () => {
    expect(getSalesStatus(sheet('A', 'A', 'A', 'A', 'A', 'C', 'C'))).toBe('hot');
    expect(getSalesStatus(allC)).toBe('hot');
  });

  it('muddat yaqin, lekin qaror boshqada — standard', () => {
    expect(getSalesStatus(sheet('C', 'C', 'C', 'C', 'C', 'C', 'A'))).toBe('standard');
  });

  it("o'zi qaror qiladi, lekin muddat yo'q — standard", () => {
    expect(getSalesStatus(sheet('C', 'C', 'C', 'C', 'C', 'A', 'C'))).toBe('standard');
  });
});

describe('scoreDiagnostic', () => {
  it("to'liq C javoblar: 14 ball, bo'shliq yo'q, qualified, hot", () => {
    expect(scoreDiagnostic(allC)).toEqual({
      totalScore: 14,
      readiness: 4,
      resultCategory: 'qualified',
      priority: 'high',
      salesStatus: 'hot',
      gaps: [],
    });
  });

  it("to'liq A javoblar: 0 ball, hamma xizmat kerak, lekin muddat yo'q", () => {
    expect(scoreDiagnostic(allA)).toEqual({
      totalScore: 0,
      readiness: 0,
      resultCategory: 'nurture',
      priority: 'normal',
      salesStatus: 'standard',
      gaps: ['naming', 'patent', 'logo', 'firma-uslubi', 'brandbook', 'qadoq'],
    });
  });

  it("g'oya bosqichi + yaqin muddat + o'zi qaror qiladi → qualified va hot", () => {
    // Aynan shu holat eski modelda 1/14 ball olib "sovuq" deb belgilanardi,
    // holbuki bunday mijozga barcha xizmatlar kerak.
    const answers = sheet('A', 'A', 'A', 'A', 'A', 'C', 'C');
    expect(scoreDiagnostic(answers)).toMatchObject({
      totalScore: 4,
      resultCategory: 'qualified',
      priority: 'high',
      salesStatus: 'hot',
    });
    expect(scoreDiagnostic(answers).gaps).toHaveLength(6);
  });

  it("to'liq B javoblar: 7 ball, potential", () => {
    expect(scoreDiagnostic(allB)).toMatchObject({ totalScore: 7, resultCategory: 'potential' });
  });
});

describe('describeGaps', () => {
  it("bo'shliqlarni o'qiladigan ro'yxatga aylantiradi", () => {
    expect(describeGaps(['naming', 'qadoq'])).toBe('Nom ishlab chiqish, Qadoq dizayni');
  });

  it("bo'shliq yo'q bo'lsa alohida matn", () => {
    expect(describeGaps([])).toBe("Jiddiy bo'shliq topilmadi");
  });
});

describe('SERVICES katalogi', () => {
  it('har bir xizmat uchun nom, tushuntirish va sabab bor', () => {
    for (const key of SERVICE_ORDER) {
      expect(SERVICES[key].label.length).toBeGreaterThan(0);
      expect(SERVICES[key].what.length).toBeGreaterThan(0);
      expect(SERVICES[key].why.length).toBeGreaterThan(0);
    }
  });

  it("savollardagi barcha bo'shliqlar katalogda mavjud", () => {
    for (const question of DIAGNOSTIC_QUESTIONS) {
      for (const option of question.options) {
        for (const gap of option.gaps) {
          expect(SERVICE_ORDER).toContain(gap);
        }
      }
    }
  });
});

describe('isAnswerSheetComplete', () => {
  it('bo\'sh yoki qisman to\'ldirilgan varaq — false', () => {
    expect(isAnswerSheetComplete(createEmptyAnswerSheet())).toBe(false);
    expect(isAnswerSheetComplete(['A', 'B', null, 'C', 'A', 'B', 'C'])).toBe(false);
    expect(isAnswerSheetComplete(['A', 'B', 'C'])).toBe(false);
  });

  it('to\'liq varaq — true', () => {
    expect(isAnswerSheetComplete(allA)).toBe(true);
  });
});

describe('describeAnswer', () => {
  it("savol matnini ham qaytaradi — CRMda nima so'ralgani ko'rinsin", () => {
    expect(describeAnswer(0, 'C')).toBe(
      "Biznesingiz yoki mahsulotingiz nomi bormi? → C: Bor va o'zgartirmoqchi emasmiz"
    );
    expect(describeAnswer(6, 'A')).toBe(
      'Yakuniy qarorni kim qabul qiladi? → A: Boshqa rahbar'
    );
  });

  it("javob yo'q bo'lsa savol qoladi", () => {
    expect(describeAnswer(0, null)).toBe(
      'Biznesingiz yoki mahsulotingiz nomi bormi? — javob berilmagan'
    );
  });

  it("mavjud bo'lmagan savol uchun bo'sh satr", () => {
    expect(describeAnswer(99, 'A')).toBe('');
  });
});

describe('resolveSource', () => {
  it('URL\'dagi source saqlanadi', () => {
    expect(resolveSource(new URLSearchParams('source=tez-natija-6'))).toBe('tez-natija-6');
  });

  it('source yo\'q bo\'lsa — website', () => {
    expect(resolveSource(new URLSearchParams('utm_source=instagram'))).toBe(DEFAULT_SOURCE);
    expect(resolveSource(new URLSearchParams('source='))).toBe(DEFAULT_SOURCE);
    expect(resolveSource(null)).toBe(DEFAULT_SOURCE);
    expect(resolveSource(undefined)).toBe(DEFAULT_SOURCE);
  });

  it('juda uzun qiymat qirqiladi', () => {
    expect(resolveSource(new URLSearchParams(`source=${'a'.repeat(200)}`))).toHaveLength(80);
  });
});

describe('resolveUtmParams', () => {
  it('uchala UTM parametrini o\'qiydi', () => {
    const params = new URLSearchParams('utm_source=instagram&utm_medium=cpc&utm_campaign=brand-q3');
    expect(resolveUtmParams(params)).toEqual({
      utm_source: 'instagram',
      utm_medium: 'cpc',
      utm_campaign: 'brand-q3',
    });
  });

  it('yo\'q parametrlar undefined bo\'ladi', () => {
    expect(resolveUtmParams(new URLSearchParams('utm_source=instagram'))).toEqual({
      utm_source: 'instagram',
      utm_medium: undefined,
      utm_campaign: undefined,
    });
    expect(resolveUtmParams(null)).toEqual({
      utm_source: undefined,
      utm_medium: undefined,
      utm_campaign: undefined,
    });
  });
});
