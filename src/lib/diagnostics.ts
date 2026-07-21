/**
 * Brend diagnostikasi (/diagnostika) — savollar, ball tizimi va lead tasnifi.
 *
 * Matn va ball bitta joyda turadi: javob matni bilan ball hech qachon
 * ajralib qolmasligi kerak. Sahifa faqat o'zbek tilida ishlaydi.
 */

export type OptionKey = 'A' | 'B' | 'C';

export type DiagnosticOption = {
  key: OptionKey;
  text: string;
  score: number;
};

export type DiagnosticQuestion = {
  id: number;
  question: string;
  options: DiagnosticOption[];
};

export type ResultCategory = 'nurture' | 'potential' | 'qualified';
export type Priority = 'high' | 'normal';
export type SalesStatus = 'hot' | 'standard';

export type DiagnosticResult = {
  title: string;
  description: string;
  advice: string;
};

const OPTION_SCORES: Record<OptionKey, number> = { A: 0, B: 1, C: 2 };

function buildOptions(texts: Record<OptionKey, string>): DiagnosticOption[] {
  return (['A', 'B', 'C'] as const).map((key) => ({
    key,
    text: texts[key],
    score: OPTION_SCORES[key],
  }));
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Biznesingiz hozir qaysi bosqichda?',
    options: buildOptions({
      A: "G'oya yoki boshlang'ich bosqich",
      B: 'Savdo bor, lekin hali tizimli emas',
      C: 'Barqaror savdo va jamoa bor',
    }),
  },
  {
    id: 2,
    question: 'Keyingi 12 oydagi asosiy rejangiz qanday?',
    options: buildOptions({
      A: "Biznesni yo'lga qo'yish",
      B: 'Savdoni oshirish',
      C: 'Yangi mahsulot, filial yoki bozorga chiqish',
    }),
  },
  {
    id: 3,
    question: 'Hozirgi brendingiz qanday holatda?',
    options: buildOptions({
      A: "Hali to'liq shakllanmagan",
      B: "Logotip bor, lekin yagona tizim yo'q",
      C: "Brend bor, lekin hozirgi darajamizni ko'rsatmaydi",
    }),
  },
  {
    id: 4,
    question: 'Mijozlar kompaniyangizni qanday qabul qilmoqda?',
    options: buildOptions({
      A: 'Hali aniq bilmayman',
      B: 'Raqobatchilardan farqimizni tushunishmaydi',
      C: "Kompaniya kuchli, ammo tashqi ko'rinishi buni ko'rsatmaydi",
    }),
  },
  {
    id: 5,
    question: "Brending bo'yicha o'zgarish qachon kerak?",
    options: buildOptions({
      A: "Hozir rejamizda yo'q",
      B: "Yaqin 6–12 oy ichida",
      C: 'Yaqin 1–3 oy ichida',
    }),
  },
  {
    id: 6,
    question: "Brending bo'yicha yakuniy qarorni kim qabul qiladi?",
    options: buildOptions({
      A: 'Boshqa rahbar',
      B: 'Birgalikda qaror qilamiz',
      C: 'Men qaror qabul qilaman',
    }),
  },
  {
    id: 7,
    question: 'Oxirgi bir yil ichida marketing yoki brendingga investitsiya qilganmisiz?',
    options: buildOptions({
      A: "Yo'q",
      B: 'Alohida dizayn va reklama xizmatlariga',
      C: 'Professional mutaxassis yoki agentlik xizmatiga',
    }),
  },
];

export const TOTAL_QUESTIONS = DIAGNOSTIC_QUESTIONS.length;
export const MAX_SCORE = TOTAL_QUESTIONS * OPTION_SCORES.C;

/** Foydalanuvchiga ko'rsatiladigan natijalar. Ichki tasnif bu yerda yo'q. */
export const DIAGNOSTIC_RESULTS: Record<ResultCategory, DiagnosticResult> = {
  nurture: {
    title: 'Brendingiz poydevor bosqichida',
    description:
      "Avvalo maqsadli mijoz, bozordagi pozitsiya va asosiy taklifni aniqlashtirish kerak. Shundan keyin vizual brending ustida ishlash samaraliroq bo'ladi.",
    advice: 'Mijoz segmentingiz va asosiy farqingizni bitta aniq jumlada ifodalang.',
  },
  potential: {
    title: "Brendingizda o'sish imkoniyati bor",
    description:
      "Biznesingiz ishlayapti, ammo brend elementlari yagona tizimga birlashmagan bo'lishi mumkin. Bu mijozlarning ishonchi va kompaniyani tanib olishiga ta'sir qiladi.",
    advice:
      'Logotip, ranglar, kommunikatsiya va savdo materiallarini yagona tizim sifatida tahlil qiling.',
  },
  qualified: {
    title: 'Biznesingiz yangi darajadagi brendga tayyor',
    description:
      "Biznesingiz o'sish bosqichida, ammo mavjud brendingiz kompaniyaning bugungi imkoniyati va kelajakdagi rejalarini to'liq ko'rsatmayotgan bo'lishi mumkin.",
    advice:
      "Kengayishdan oldin brend pozitsiyasi, identikasi va barcha aloqa nuqtalarini yagona tizimga keltiring.",
  },
};

/** Javoblar massivi: index 0 → 1-savol. Javob berilmagan savol = null. */
export type AnswerSheet = (OptionKey | null)[];

export function createEmptyAnswerSheet(): AnswerSheet {
  return Array<OptionKey | null>(TOTAL_QUESTIONS).fill(null);
}

export function isAnswerSheetComplete(answers: AnswerSheet) {
  return (
    answers.length === TOTAL_QUESTIONS && answers.every((answer) => answer === 'A' || answer === 'B' || answer === 'C')
  );
}

/**
 * Ballni har doim javoblar massividan qayta hisoblaymiz — hech qanday
 * yig'indi saqlanmaydi. Shu sabab "orqaga" qaytib javobni almashtirish
 * ballni ikki marta qo'shmaydi.
 */
export function calculateScore(answers: AnswerSheet) {
  return answers.reduce<number>(
    (total, answer) => total + (answer ? OPTION_SCORES[answer] : 0),
    0
  );
}

export function getResultCategory(totalScore: number): ResultCategory {
  if (totalScore <= 6) return 'nurture';
  if (totalScore <= 10) return 'potential';
  return 'qualified';
}

/** Q2, Q3, Q5, Q6 ning hammasi C bo'lsa — yuqori prioritet. */
export function getPriority(answers: AnswerSheet): Priority {
  const highIntentQuestionIds = [2, 3, 5, 6];
  const allHighIntent = highIntentQuestionIds.every((id) => answers[id - 1] === 'C');
  return allHighIntent ? 'high' : 'normal';
}

/** Ball >= 11 va 5-savol C bo'lsa — issiq lead. */
export function getSalesStatus(answers: AnswerSheet, totalScore: number): SalesStatus {
  return totalScore >= 11 && answers[4] === 'C' ? 'hot' : 'standard';
}

export type DiagnosticScoring = {
  totalScore: number;
  resultCategory: ResultCategory;
  priority: Priority;
  salesStatus: SalesStatus;
};

export function scoreDiagnostic(answers: AnswerSheet): DiagnosticScoring {
  const totalScore = calculateScore(answers);
  return {
    totalScore,
    resultCategory: getResultCategory(totalScore),
    priority: getPriority(answers),
    salesStatus: getSalesStatus(answers, totalScore),
  };
}

/** Javob kalitini CRM uchun o'qiladigan matnga aylantiradi: "C — Barqaror savdo...". */
export function describeAnswer(questionIndex: number, answer: OptionKey | null) {
  if (!answer) return '';
  const option = DIAGNOSTIC_QUESTIONS[questionIndex]?.options.find((item) => item.key === answer);
  return option ? `${option.key} — ${option.text}` : '';
}

export const DEFAULT_SOURCE = 'website';

/** URLSearchParams va Next'ning ReadonlyURLSearchParams'i uchun umumiy shakl. */
type ReadableSearchParams = { get(key: string): string | null };

/** URL'dagi ?source= ni oladi; bo'lmasa "website". */
export function resolveSource(searchParams: ReadableSearchParams | null | undefined) {
  const raw = searchParams?.get('source')?.trim();
  if (!raw) return DEFAULT_SOURCE;
  return raw.slice(0, 80);
}

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export function resolveUtmParams(searchParams: ReadableSearchParams | null | undefined): UtmParams {
  const read = (key: string) => {
    const value = searchParams?.get(key)?.trim();
    return value ? value.slice(0, 120) : undefined;
  };

  return {
    utm_source: read('utm_source'),
    utm_medium: read('utm_medium'),
    utm_campaign: read('utm_campaign'),
  };
}
