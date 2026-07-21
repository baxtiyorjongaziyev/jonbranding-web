import { describe, expect, it } from 'vitest';
import {
  calculateScore,
  createEmptyAnswerSheet,
  DEFAULT_SOURCE,
  describeAnswer,
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
  it('0–6 → nurture, 7–10 → potential, 11–14 → qualified', () => {
    for (let score = 0; score <= 6; score += 1) expect(getResultCategory(score)).toBe('nurture');
    for (let score = 7; score <= 10; score += 1) expect(getResultCategory(score)).toBe('potential');
    for (let score = 11; score <= 14; score += 1) expect(getResultCategory(score)).toBe('qualified');
  });

  it('har bir kategoriya uchun matn mavjud', () => {
    for (const category of ['nurture', 'potential', 'qualified'] as const) {
      expect(DIAGNOSTIC_RESULTS[category].title.length).toBeGreaterThan(0);
      expect(DIAGNOSTIC_RESULTS[category].description.length).toBeGreaterThan(0);
      expect(DIAGNOSTIC_RESULTS[category].advice.length).toBeGreaterThan(0);
    }
  });
});

describe('getPriority', () => {
  it('2,3,5,6-savollar C bo\'lsa — high', () => {
    expect(getPriority(sheet('A', 'C', 'C', 'A', 'C', 'C', 'A'))).toBe('high');
    expect(getPriority(allC)).toBe('high');
  });

  it('to\'rttadan bittasi C bo\'lmasa — normal', () => {
    expect(getPriority(sheet('C', 'B', 'C', 'C', 'C', 'C', 'C'))).toBe('normal');
    expect(getPriority(sheet('C', 'C', 'C', 'C', 'C', 'B', 'C'))).toBe('normal');
    expect(getPriority(allB)).toBe('normal');
    expect(getPriority(allA)).toBe('normal');
  });

  it('1,4,7-savollar prioritetga ta\'sir qilmaydi', () => {
    expect(getPriority(sheet('A', 'C', 'C', 'A', 'C', 'C', 'A'))).toBe(
      getPriority(sheet('C', 'C', 'C', 'C', 'C', 'C', 'C'))
    );
  });
});

describe('getSalesStatus', () => {
  it('ball >= 11 va 5-savol C bo\'lsa — hot', () => {
    const answers = sheet('C', 'C', 'C', 'C', 'C', 'B', 'A'); // 2+2+2+2+2+1+0 = 11
    expect(calculateScore(answers)).toBe(11);
    expect(getSalesStatus(answers, calculateScore(answers))).toBe('hot');
  });

  it('ball 11 dan past bo\'lsa — standard (5-savol C bo\'lsa ham)', () => {
    const answers = sheet('A', 'A', 'B', 'B', 'C', 'B', 'A'); // 0+0+1+1+2+1+0 = 5
    expect(getSalesStatus(answers, calculateScore(answers))).toBe('standard');
  });

  it('ball yuqori, lekin 5-savol C emas — standard', () => {
    const answers = sheet('C', 'C', 'C', 'C', 'B', 'C', 'C'); // 13
    expect(calculateScore(answers)).toBe(13);
    expect(getSalesStatus(answers, 13)).toBe('standard');
  });
});

describe('scoreDiagnostic', () => {
  it('to\'liq C javoblar: 14 ball, qualified, high, hot', () => {
    expect(scoreDiagnostic(allC)).toEqual({
      totalScore: 14,
      resultCategory: 'qualified',
      priority: 'high',
      salesStatus: 'hot',
    });
  });

  it('to\'liq A javoblar: 0 ball, nurture, normal, standard', () => {
    expect(scoreDiagnostic(allA)).toEqual({
      totalScore: 0,
      resultCategory: 'nurture',
      priority: 'normal',
      salesStatus: 'standard',
    });
  });

  it('to\'liq B javoblar: 7 ball, potential', () => {
    expect(scoreDiagnostic(allB)).toMatchObject({ totalScore: 7, resultCategory: 'potential' });
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
  it('savol matnini ham qaytaradi — CRMda nima soralgani korinsin', () => {
    expect(describeAnswer(0, 'C')).toBe(
      'Biznesingiz hozir qaysi bosqichda? → C: Barqaror savdo va jamoa bor'
    );
    expect(describeAnswer(6, 'A')).toBe(
      "Oxirgi bir yil ichida marketing yoki brendingga investitsiya qilganmisiz? → A: Yo'q"
    );
  });

  it('javob yoq bolsa savol qoladi', () => {
    expect(describeAnswer(0, null)).toBe('Biznesingiz hozir qaysi bosqichda? — javob berilmagan');
  });

  it('mavjud bolmagan savol uchun bosh satr', () => {
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
