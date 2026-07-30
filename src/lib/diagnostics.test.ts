import { describe, expect, it } from 'vitest';
import {
  calculateReadiness,
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
  indexOfQuestion,
  isAnswerSheetComplete,
  maxScoreFor,
  resolveSegment,
  resolveSource,
  resolveUtmParams,
  scoreDiagnostic,
  SEGMENT_QUESTION_ID,
  SERVICE_ORDER,
  SERVICES,
  TOTAL_QUESTIONS,
  visibleQuestions,
  type AnswerSheet,
  type OptionKey,
} from './diagnostics';

/**
 * Javob varaqasini savol `id` -> kalit map'idan quradi. Ko'rsatilmagan
 * savollar `null` bo'lib qoladi — aynan shoxlangan yo'ldagidek.
 */
function sheetFrom(map: Record<number, OptionKey>): AnswerSheet {
  const answers = createEmptyAnswerSheet();
  for (const [id, key] of Object.entries(map)) {
    answers[indexOfQuestion(Number(id))] = key;
  }
  return answers;
}

/** Segment kaliti: A=yangi, B=tarqoq, C=kengayish. */
const SEG = SEGMENT_QUESTION_ID;

/** Har bir ko'rinadigan savolga `key` beruvchi to'liq varaq. */
function fullSheet(segmentKey: OptionKey, key: OptionKey): AnswerSheet {
  const answers = createEmptyAnswerSheet();
  answers[indexOfQuestion(SEG)] = segmentKey;
  const segment = resolveSegment(answers);
  for (const question of visibleQuestions(segment)) {
    answers[indexOfQuestion(question.id)] = key;
  }
  answers[indexOfQuestion(SEG)] = segmentKey;
  return answers;
}

describe('savollar tuzilishi', () => {
  it('har savolda 3 ta variant, ball 0/1/2', () => {
    for (const question of DIAGNOSTIC_QUESTIONS) {
      expect(question.options.map((option) => option.key)).toEqual(['A', 'B', 'C']);
      expect(question.options.map((option) => option.score)).toEqual([0, 1, 2]);
    }
  });

  it('savol id lari ketma-ket va takrorlanmaydi', () => {
    const ids = DIAGNOSTIC_QUESTIONS.map((question) => question.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(TOTAL_QUESTIONS).toBe(8);
  });

  it('birinchi savol — segment savoli, hammaga ko\'rinadi', () => {
    expect(DIAGNOSTIC_QUESTIONS[0].id).toBe(SEGMENT_QUESTION_ID);
    expect(DIAGNOSTIC_QUESTIONS[0].segments).toBeUndefined();
  });

  it("tayyorlik savollari o'z o'rnida turadi", () => {
    // Tasnif oxirgi ikki savoldan hisoblanadi; tartib buzilsa jimgina xato.
    const timing = DIAGNOSTIC_QUESTIONS.find((q) => q.id === 7);
    const decision = DIAGNOSTIC_QUESTIONS.find((q) => q.id === 8);
    expect(timing?.question).toMatch(/qachon/i);
    expect(decision?.question).toMatch(/qaror/i);
  });

  it('timing savolida "hoziroq" varianti bor', () => {
    const timing = DIAGNOSTIC_QUESTIONS.find((q) => q.id === 7);
    expect(timing?.options.some((o) => /hoziroq/i.test(o.text))).toBe(true);
  });
});

describe('shoxlanish', () => {
  it('segment tanlanmaguncha faqat birinchi savol ko\'rinadi', () => {
    expect(visibleQuestions(null)).toHaveLength(1);
    expect(visibleQuestions(null)[0].id).toBe(SEGMENT_QUESTION_ID);
  });

  it('resolveSegment javobni bosqichga aylantiradi', () => {
    expect(resolveSegment(sheetFrom({ [SEG]: 'A' }))).toBe('yangi');
    expect(resolveSegment(sheetFrom({ [SEG]: 'B' }))).toBe('tarqoq');
    expect(resolveSegment(sheetFrom({ [SEG]: 'C' }))).toBe('kengayish');
    expect(resolveSegment(createEmptyAnswerSheet())).toBeNull();
  });

  it('yangi bosqichga brendbuk savoli berilmaydi', () => {
    const ids = visibleQuestions('yangi').map((q) => q.id);
    expect(ids).not.toContain(5); // brendbuk (segments: tarqoq, kengayish)
    expect(ids).toContain(2); // nom
    expect(ids).toContain(4); // logo
  });

  it('kengayish bosqichiga nom va logo savollari berilmaydi', () => {
    const ids = visibleQuestions('kengayish').map((q) => q.id);
    expect(ids).not.toContain(2); // nom
    expect(ids).not.toContain(4); // logo
    expect(ids).toContain(5); // brendbuk
  });

  it('tarqoq bosqichi hamma inventarizatsiya savolini ko\'radi', () => {
    const ids = visibleQuestions('tarqoq').map((q) => q.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('timing va decision hamma bosqichda bor', () => {
    for (const seg of ['yangi', 'tarqoq', 'kengayish'] as const) {
      const ids = visibleQuestions(seg).map((q) => q.id);
      expect(ids).toContain(7);
      expect(ids).toContain(8);
    }
  });
});

describe('calculateScore', () => {
  it('faqat ko\'rinadigan javob berilgan savollarni yig\'adi', () => {
    // yangi bosqichda 7 ta savol ko'rinadi (brendbuksiz), hammasi C → maksimal.
    expect(calculateScore(fullSheet('A', 'C'))).toBe(maxScoreFor('yangi'));
    expect(calculateScore(fullSheet('C', 'C'))).toBe(maxScoreFor('kengayish'));
  });

  it('eski yo\'ldagi javob hisobga olinmaydi (orqaga qaytish)', () => {
    // Segment "kengayish" — nom/logo ko'rinmaydi. Massivda ular to'ldirilgan
    // bo'lsa ham (mijoz avval boshqa segmentda edi), ball ularni sanamaydi.
    const answers = createEmptyAnswerSheet();
    answers[indexOfQuestion(SEG)] = 'C'; // kengayish
    answers[indexOfQuestion(2)] = 'A'; // nom — ko'rinmaydi
    answers[indexOfQuestion(4)] = 'A'; // logo — ko'rinmaydi
    // Segment savoli ballga kirmaydi, ko'rinadigan boshqa savollar javobsiz.
    expect(calculateScore(answers)).toBe(0);
  });

  it('javob berilmagan savolni 0 deb hisoblaydi', () => {
    expect(calculateScore(createEmptyAnswerSheet())).toBe(0);
  });
});

describe('collectGaps', () => {
  it('yangi bosqich, hammasi A: brendbuk chiqmaydi (savol berilmagan)', () => {
    expect(collectGaps(fullSheet('A', 'A'))).toEqual([
      'naming',
      'patent',
      'logo',
      'qadoq',
    ]);
  });

  it('tarqoq bosqich, hammasi A: barcha xizmat chiqadi', () => {
    expect(collectGaps(fullSheet('B', 'A'))).toEqual([
      'naming',
      'patent',
      'logo',
      'firma-uslubi',
      'brandbook',
      'qadoq',
    ]);
  });

  it('kengayish bosqich, hammasi A: nom/logo chiqmaydi', () => {
    expect(collectGaps(fullSheet('C', 'A'))).toEqual(['patent', 'firma-uslubi', 'brandbook', 'qadoq']);
  });

  it('hammasi joyida bo\'lsa bo\'shliq yo\'q', () => {
    expect(collectGaps(fullSheet('B', 'C'))).toEqual([]);
  });

  it('SERVICE_ORDER tartibida va takrorlanmaydi', () => {
    const gaps = collectGaps(fullSheet('B', 'A'));
    expect(new Set(gaps).size).toBe(gaps.length);
    expect(gaps).toEqual(SERVICE_ORDER.filter((s) => gaps.includes(s)));
  });
});

describe('getResultCategory (tayyorlikdan)', () => {
  it('tayyorlik 3–4 → qualified', () => {
    expect(getResultCategory(sheetFrom({ [SEG]: 'A', 7: 'C', 8: 'C' }))).toBe('qualified');
    expect(getResultCategory(sheetFrom({ [SEG]: 'A', 7: 'C', 8: 'B' }))).toBe('qualified');
  });

  it('tayyorlik 2 → potential', () => {
    expect(getResultCategory(sheetFrom({ [SEG]: 'C', 7: 'B', 8: 'B' }))).toBe('potential');
    expect(getResultCategory(sheetFrom({ [SEG]: 'C', 7: 'C', 8: 'A' }))).toBe('potential');
  });

  it('tayyorlik 0–1 → nurture', () => {
    expect(getResultCategory(sheetFrom({ [SEG]: 'A' }))).toBe('nurture');
    expect(getResultCategory(sheetFrom({ [SEG]: 'C', 7: 'A', 8: 'B' }))).toBe('nurture');
  });

  it('yetuklik balli tasnifga ta\'sir qilmaydi', () => {
    const yosh = sheetFrom({ [SEG]: 'A', 7: 'C', 8: 'C' });
    const yetuk = fullSheet('B', 'C');
    yetuk[indexOfQuestion(7)] = 'C';
    yetuk[indexOfQuestion(8)] = 'C';
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

describe('getPriority', () => {
  it('muddat hoziroq bo\'lsa — high', () => {
    expect(getPriority(sheetFrom({ [SEG]: 'C', 7: 'C', 8: 'A' }))).toBe('high');
  });

  it('o\'zi qaror qiladi va 3+ bo\'shliq bo\'lsa — high', () => {
    // yangi + hammasi A → 4 bo'shliq, decision C
    const answers = fullSheet('A', 'A');
    answers[indexOfQuestion(8)] = 'C';
    expect(getPriority(answers)).toBe('high');
  });

  it('muddat yo\'q va qaror boshqada — normal', () => {
    expect(getPriority(sheetFrom({ [SEG]: 'A', 7: 'A', 8: 'A' }))).toBe('normal');
  });
});

describe('getSalesStatus', () => {
  it('muddat hoziroq va o\'zi qaror qilsa — hot', () => {
    expect(getSalesStatus(sheetFrom({ [SEG]: 'A', 7: 'C', 8: 'C' }))).toBe('hot');
  });

  it('muddat yaqin, lekin qaror boshqada — standard', () => {
    expect(getSalesStatus(sheetFrom({ [SEG]: 'C', 7: 'C', 8: 'A' }))).toBe('standard');
  });
});

describe('calculateReadiness', () => {
  it('muddat + qaror, 0–4', () => {
    expect(calculateReadiness(sheetFrom({ [SEG]: 'A', 7: 'C', 8: 'C' }))).toBe(4);
    expect(calculateReadiness(sheetFrom({ [SEG]: 'A', 7: 'A', 8: 'A' }))).toBe(0);
    expect(calculateReadiness(sheetFrom({ [SEG]: 'A', 7: 'B', 8: 'C' }))).toBe(3);
  });
});

describe('scoreDiagnostic', () => {
  it("g'oya bosqichi + hoziroq + o'zi qaror → qualified, hot, barcha bo'shliq", () => {
    // Eski modelda bu 1/14 ball olib "sovuq" bo'lardi.
    const answers = sheetFrom({ [SEG]: 'A', 2: 'A', 3: 'A', 4: 'A', 6: 'A', 7: 'C', 8: 'C' });
    const scoring = scoreDiagnostic(answers);
    expect(scoring.segment).toBe('yangi');
    expect(scoring.resultCategory).toBe('qualified');
    expect(scoring.salesStatus).toBe('hot');
    expect(scoring.priority).toBe('high');
    expect(scoring.gaps).toEqual(['naming', 'patent', 'logo', 'qadoq']);
    expect(scoring.maxScore).toBe(maxScoreFor('yangi'));
  });

  it('maxScore bosqichga qarab farq qiladi', () => {
    expect(scoreDiagnostic(fullSheet('A', 'C')).maxScore).toBe(maxScoreFor('yangi'));
    expect(scoreDiagnostic(fullSheet('B', 'C')).maxScore).toBe(maxScoreFor('tarqoq'));
    expect(maxScoreFor('tarqoq')).toBeGreaterThan(maxScoreFor('kengayish'));
  });
});

describe('isAnswerSheetComplete', () => {
  it('segment tanlanmagan bo\'lsa — false', () => {
    expect(isAnswerSheetComplete(createEmptyAnswerSheet())).toBe(false);
  });

  it('ko\'rinadigan savol javobsiz bo\'lsa — false', () => {
    const answers = fullSheet('B', 'A');
    answers[indexOfQuestion(5)] = null; // brendbuk (tarqoqda ko'rinadi)
    expect(isAnswerSheetComplete(answers)).toBe(false);
  });

  it('ko\'rinmaydigan savol javobsiz bo\'lsa ham — true', () => {
    // yangi bosqichda brendbuk (id 5) ko'rinmaydi, u null bo'lsa ham to'liq.
    const answers = fullSheet('A', 'B');
    expect(answers[indexOfQuestion(5)]).toBeNull();
    expect(isAnswerSheetComplete(answers)).toBe(true);
  });
});

describe('describeAnswer', () => {
  it('savol matnini ham qaytaradi', () => {
    expect(describeAnswer(indexOfQuestion(SEGMENT_QUESTION_ID), 'A')).toContain('qaysi bosqichda');
  });

  it("javob yo'q bo'lsa savol qoladi", () => {
    expect(describeAnswer(indexOfQuestion(SEGMENT_QUESTION_ID), null)).toContain(
      'javob berilmagan'
    );
  });

  it("mavjud bo'lmagan savol uchun bo'sh satr", () => {
    expect(describeAnswer(99, 'A')).toBe('');
  });
});

describe('describeGaps', () => {
  it('bo\'shliqlarni o\'qiladigan ro\'yxatga aylantiradi', () => {
    expect(describeGaps(['naming', 'qadoq'])).toBe('Nom ishlab chiqish, Qadoq dizayni');
  });

  it('bo\'shliq yo\'q bo\'lsa alohida matn', () => {
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

  it('savollardagi barcha bo\'shliqlar katalogda mavjud', () => {
    for (const question of DIAGNOSTIC_QUESTIONS) {
      for (const option of question.options) {
        for (const gap of option.gaps) {
          expect(SERVICE_ORDER).toContain(gap);
        }
      }
    }
  });
});

describe('resolveSource', () => {
  it("URL'dagi source saqlanadi", () => {
    expect(resolveSource(new URLSearchParams('source=tez-natija-6'))).toBe('tez-natija-6');
  });

  it("source yo'q bo'lsa — website", () => {
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
  it("uchala UTM parametrini o'qiydi", () => {
    const params = new URLSearchParams('utm_source=instagram&utm_medium=cpc&utm_campaign=brand-q3');
    expect(resolveUtmParams(params)).toEqual({
      utm_source: 'instagram',
      utm_medium: 'cpc',
      utm_campaign: 'brand-q3',
    });
  });

  it("yo'q parametrlar undefined bo'ladi", () => {
    expect(resolveUtmParams(null)).toEqual({
      utm_source: undefined,
      utm_medium: undefined,
      utm_campaign: undefined,
    });
  });
});
