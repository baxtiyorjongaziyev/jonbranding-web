/**
 * Brend diagnostikasi (/diagnostika) — savollar, xizmat bo'shliqlari va lead tasnifi.
 *
 * Maqsad ikki tomonlama:
 *   1. Mijozga — qaysi xizmat unga kerakligini oddiy til bilan ko'rsatish.
 *      Mijozlarimiz "brendbuk" yoki "tovar belgisi" nima ekanini bilmaydi,
 *      shuning uchun savollarning o'zi ham tushuntirish vazifasini bajaradi.
 *   2. Sotuvga — nima taklif qilishni aniq ro'yxat qilib berish.
 *
 * Matn, ball va xizmat bog'lanishi bitta joyda turadi — ular hech qachon
 * ajralib qolmasligi kerak. Sahifa faqat o'zbek tilida ishlaydi.
 */

export type OptionKey = 'A' | 'B' | 'C';

/** Jon Branding xizmatlari. Kalitlar CRMga ham shu ko'rinishda tushadi. */
export type ServiceKey = 'naming' | 'patent' | 'logo' | 'firma-uslubi' | 'brandbook' | 'qadoq';

export type ServiceInfo = {
  /** Sotuv va mijoz uchun nom. */
  label: string;
  /** Nima ekani — atamasiz, bir jumlada. */
  what: string;
  /** Nega kerakligi — mijoz his qiladigan til bilan. */
  why: string;
};

/**
 * Tavsiya tartibi shu ro'yxat bo'yicha: nomdan boshlanadi, chunki nom
 * o'zgarsa logotip ham, qadoq ham qayta ishlanadi.
 */
export const SERVICE_ORDER: ServiceKey[] = [
  'naming',
  'patent',
  'logo',
  'firma-uslubi',
  'brandbook',
  'qadoq',
];

export const SERVICES: Record<ServiceKey, ServiceInfo> = {
  naming: {
    label: 'Nom ishlab chiqish',
    what: "Biznesingiz uchun eslab qolinadigan va band bo'lmagan nom tanlash.",
    why: "Nom keyinchalik o'zgarsa, logotip, qadoq va reklama — hammasi qaytadan qilinadi.",
  },
  patent: {
    label: "Tovar belgisini ro'yxatdan o'tkazish",
    what: "Nomingizni davlat reyestrida o'z nomingizga rasman biriktirish.",
    why: "Ro'yxatdan o'tmagan nomni istalgan odam o'zi ro'yxatdan o'tkazib, sizni o'z nomingizdan foydalanishni to'xtatishga majbur qilishi mumkin.",
  },
  logo: {
    label: 'Logotip dizayni',
    what: 'Kichik hajmda ham, katta bannerda ham bir xil ishlaydigan belgi.',
    why: "Tanishga chizdirilgan logotip ko'pincha bosmaga yaramaydi va kompaniyani arzon ko'rsatadi.",
  },
  'firma-uslubi': {
    label: 'Firma uslubi',
    what: "Ranglar, shriftlar va tayyor shablonlar to'plami.",
    why: "Busiz har bir post va banner boshqacha chiqadi, mijoz sizni ko'rib tanimaydi.",
  },
  brandbook: {
    label: 'Brendbuk',
    what: "Brendni qanday ishlatishni tushuntiruvchi hujjat — yangi dizayner ham shunga qarab ishlaydi.",
    why: "Xodim yoki dizayner almashganda brend ko'rinishi buzilmaydi.",
  },
  qadoq: {
    label: 'Qadoq dizayni',
    what: "Mahsulot qadog'i va yorlig'ining dizayni.",
    why: "Do'kon javonida mijoz avval qadoqni ko'radi, keyin mahsulotni.",
  },
};

export type DiagnosticOption = {
  key: OptionKey;
  text: string;
  score: number;
  /** Shu javob ochib beradigan xizmat bo'shliqlari. */
  gaps: ServiceKey[];
};

export type DiagnosticQuestion = {
  id: number;
  question: string;
  /** Atamani tushuntiruvchi qo'shimcha izoh — savol ostida ko'rsatiladi. */
  hint?: string;
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

function buildOptions(
  texts: Record<OptionKey, string>,
  gaps: Partial<Record<OptionKey, ServiceKey[]>> = {}
): DiagnosticOption[] {
  return (['A', 'B', 'C'] as const).map((key) => ({
    key,
    text: texts[key],
    score: OPTION_SCORES[key],
    gaps: gaps[key] ?? [],
  }));
}

/**
 * 1–5 — inventarizatsiya: mijozda nima yo'qligini aniqlaydi.
 * 6–7 — sotuv uchun: qachon va kim qaror qiladi.
 *
 * Variantlar har doim "hech narsa yo'q" dan "hammasi joyida" tomon
 * tartiblangan, shu sabab A=0, B=1, C=2 balli mantiqiy qoladi.
 */
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Biznesingiz yoki mahsulotingiz nomi bormi?',
    options: buildOptions(
      {
        A: "Yo'q — nom ustida hali ishlamaganmiz",
        B: "Bor, lekin unchalik yoqmaydi yoki o'zgartirmoqchimiz",
        C: "Bor va o'zgartirmoqchi emasmiz",
      },
      { A: ['naming', 'patent'], B: ['naming', 'patent'] }
    ),
  },
  {
    id: 2,
    question: "Raqobatchingiz ertaga sizning nomingiz bilan sotsa, uni to'xtata olasizmi?",
    hint: "Buni faqat tovar belgisi guvohnomasi beradi — nom O'zbekiston reyestrida sizga biriktirilgan bo'lishi kerak.",
    options: buildOptions(
      {
        A: "Yo'q — bu haqda o'ylamaganmiz",
        B: "Yo'q, lekin kerakligini bilamiz",
        C: 'Ha, guvohnomamiz bor',
      },
      { A: ['patent'], B: ['patent'] }
    ),
  },
  {
    id: 3,
    question: 'Logotipingiz qanday tayyorlangan?',
    options: buildOptions(
      {
        A: "Logotipimiz yo'q",
        B: "O'zimiz yoki tanishimiz qilib bergan",
        C: 'Professional dizayner yoki agentlik tayyorlagan',
      },
      { A: ['logo'], B: ['logo'] }
    ),
  },
  {
    id: 4,
    question:
      "Yangi banner yoki post kerak bo'lsa, ranglar va shriftlar yozilgan hujjatingiz bormi?",
    hint: "Bunday hujjat firma uslubi va brendbuk deb ataladi — u bo'lmasa har bir material boshqacha chiqadi.",
    options: buildOptions(
      {
        A: "Yo'q — har safar boshqacha chiqadi",
        B: "Ba'zi fayllar bor, lekin yagona hujjat emas",
        C: "Brendbukimiz bor, hamma shunga amal qiladi",
      },
      { A: ['firma-uslubi', 'brandbook'], B: ['brandbook'] }
    ),
  },
  {
    id: 5,
    question: 'Mahsulotingiz qadoq yoki yorliqda sotiladimi?',
    options: buildOptions(
      {
        A: "Ha, lekin qadoq dizayni ustida ishlanmagan",
        B: "Yo'q — biz xizmat ko'rsatamiz",
        C: 'Ha, qadoq dizayni professional tayyorlangan',
      },
      { A: ['qadoq'] }
    ),
  },
  {
    id: 6,
    question: "Brending bo'yicha ishni qachon boshlamoqchisiz?",
    options: buildOptions({
      A: "Hozir rejamizda yo'q",
      B: 'Yaqin 6–12 oy ichida',
      C: 'Yaqin 1–3 oy ichida',
    }),
  },
  {
    id: 7,
    question: 'Yakuniy qarorni kim qabul qiladi?',
    options: buildOptions({
      A: 'Boshqa rahbar',
      B: 'Birgalikda qaror qilamiz',
      C: 'Men qaror qabul qilaman',
    }),
  },
];

export const TOTAL_QUESTIONS = DIAGNOSTIC_QUESTIONS.length;
export const MAX_SCORE = TOTAL_QUESTIONS * OPTION_SCORES.C;

/**
 * Sotuvga tayyorlik faqat shu ikki savoldan kelib chiqadi.
 *
 * Indeks qo'lda yozilmaydi — savol `id` sidan topiladi. Aks holda savollar
 * tartibi o'zgarsa yoki oraga yangi savol qo'shilsa, tayyorlik jimgina
 * boshqa javoblarni o'qiy boshlaydi.
 */
const TIMING_QUESTION_ID = 6;
const DECISION_QUESTION_ID = 7;

function indexOfQuestion(id: number) {
  const index = DIAGNOSTIC_QUESTIONS.findIndex((question) => question.id === id);
  if (index === -1) throw new Error(`Diagnostika: ${id}-savol topilmadi`);
  return index;
}

const TIMING_INDEX = indexOfQuestion(TIMING_QUESTION_ID);
const DECISION_INDEX = indexOfQuestion(DECISION_QUESTION_ID);

/** Javoblar massivi: index 0 → 1-savol. Javob berilmagan savol = null. */
export type AnswerSheet = (OptionKey | null)[];

export function createEmptyAnswerSheet(): AnswerSheet {
  return Array<OptionKey | null>(TOTAL_QUESTIONS).fill(null);
}

export function isAnswerSheetComplete(answers: AnswerSheet) {
  return (
    answers.length === TOTAL_QUESTIONS &&
    answers.every((answer) => answer === 'A' || answer === 'B' || answer === 'C')
  );
}

/**
 * Ballni har doim javoblar massividan qayta hisoblaymiz — hech qanday
 * yig'indi saqlanmaydi. Shu sabab "orqaga" qaytib javobni almashtirish
 * ballni ikki marta qo'shmaydi.
 *
 * Ball brend yetukligini bildiradi, sotib olishga tayyorlikni emas.
 */
export function calculateScore(answers: AnswerSheet) {
  return answers.reduce<number>((total, answer) => total + (answer ? OPTION_SCORES[answer] : 0), 0);
}

/**
 * Javoblardan kelib chiqadigan xizmat bo'shliqlari, SERVICE_ORDER tartibida
 * va takrorlanmagan holda.
 */
export function collectGaps(answers: AnswerSheet): ServiceKey[] {
  const found = new Set<ServiceKey>();

  answers.forEach((answer, index) => {
    if (!answer) return;
    const option = DIAGNOSTIC_QUESTIONS[index]?.options.find((item) => item.key === answer);
    option?.gaps.forEach((gap) => found.add(gap));
  });

  return SERVICE_ORDER.filter((service) => found.has(service));
}

/**
 * Sotib olishga tayyorlik: muddat + qaror qabul qiluvchi. 0–4.
 *
 * Bu ataylab balldan ajratilgan: g'oya bosqichidagi tadbirkorning yetuklik
 * balli past bo'ladi, lekin unga barcha xizmatlar kerak. Agar u "1–3 oy" va
 * "men qaror qilaman" desa — bu eng qimmatli lead, uni "sovuq" deb
 * belgilash xato bo'lardi.
 */
export function calculateReadiness(answers: AnswerSheet) {
  const timing = answers[TIMING_INDEX];
  const decision = answers[DECISION_INDEX];
  return (timing ? OPTION_SCORES[timing] : 0) + (decision ? OPTION_SCORES[decision] : 0);
}

export function getResultCategory(answers: AnswerSheet): ResultCategory {
  const readiness = calculateReadiness(answers);
  if (readiness >= 3) return 'qualified';
  if (readiness === 2) return 'potential';
  return 'nurture';
}

/** Muddat yaqin, yoki qaror shu odamda va ish ko'p bo'lsa — yuqori prioritet. */
export function getPriority(answers: AnswerSheet): Priority {
  const timingSoon = answers[TIMING_INDEX] === 'C';
  const decidesSelf = answers[DECISION_INDEX] === 'C';
  const gapCount = collectGaps(answers).length;
  return timingSoon || (decidesSelf && gapCount >= 3) ? 'high' : 'normal';
}

/** Muddat 1–3 oy va qarorni o'zi qabul qilsa — issiq lead. */
export function getSalesStatus(answers: AnswerSheet): SalesStatus {
  return answers[TIMING_INDEX] === 'C' && answers[DECISION_INDEX] === 'C' ? 'hot' : 'standard';
}

/** Foydalanuvchiga ko'rsatiladigan sarlavha. Ichki tasnif bu yerda yo'q. */
export const DIAGNOSTIC_RESULTS: Record<ResultCategory, DiagnosticResult> = {
  nurture: {
    title: 'Brendingizda tuzatiladigan joylar bor',
    description:
      "Quyida biznesingizda hozir yetishmayotgan narsalar ro'yxati. Hammasini birdan qilish shart emas — yuqoridagisidan boshlash kifoya.",
    advice: "Birinchi bandni hal qiling, qolganini keyinroq bosqichma-bosqich qilsa bo'ladi.",
  },
  potential: {
    title: "Brendingizni tartibga solish vaqti keldi",
    description:
      "Quyida yetishmayotgan narsalar ro'yxati. Ular mijozning sizga ishonishiga va sizni raqobatchidan ajratishiga bevosita ta'sir qiladi.",
    advice: "Ro'yxatni yuqoridan pastga qarab bosqichma-bosqich yoping.",
  },
  qualified: {
    title: 'Ishni boshlash uchun hammasi tayyor',
    description:
      "Quyida yetishmayotgan narsalar ro'yxati. Muddatingiz yaqin bo'lgani uchun ularni ketma-ket emas, bitta loyiha sifatida qilish tezroq va arzonroq chiqadi.",
    advice: "Ro'yxatdagi ishlarni bitta loyihaga birlashtiring — alohida buyurtma qilishdan tejamli.",
  },
};

/** Bo'shliq topilmagan holat uchun alohida matn. */
export const NO_GAPS_RESULT: DiagnosticResult = {
  title: 'Brendingiz asosiy elementlari joyida',
  description:
    "Javoblaringizga ko'ra nom, himoya, logotip va vizual tizim bo'yicha jiddiy bo'shliq ko'rinmadi.",
  advice:
    "Keyingi qadam — brendni yangi bozor yoki mahsulotga moslashtirish. Buni bepul tahlilda muhokama qilamiz.",
};

export type DiagnosticScoring = {
  /** Brend yetukligi, 0–14. */
  totalScore: number;
  /** Sotib olishga tayyorlik, 0–4. */
  readiness: number;
  resultCategory: ResultCategory;
  priority: Priority;
  salesStatus: SalesStatus;
  /** Sotuvga taklif qilinadigan xizmatlar, tartiblangan. */
  gaps: ServiceKey[];
};

export function scoreDiagnostic(answers: AnswerSheet): DiagnosticScoring {
  return {
    totalScore: calculateScore(answers),
    readiness: calculateReadiness(answers),
    resultCategory: getResultCategory(answers),
    priority: getPriority(answers),
    salesStatus: getSalesStatus(answers),
    gaps: collectGaps(answers),
  };
}

/**
 * CRM yozuvi uchun javob matni. Savolning o'zi ham kiritiladi — aks holda
 * sotuv menejeri "A — Hali aniq bilmayman" ni ko'rib nima so'ralganini
 * bilmay qoladi.
 */
export function describeAnswer(questionIndex: number, answer: OptionKey | null | undefined) {
  const question = DIAGNOSTIC_QUESTIONS[questionIndex];
  if (!question) return '';
  if (!answer) return `${question.question} — javob berilmagan`;

  const option = question.options.find((item) => item.key === answer);
  return option ? `${question.question} → ${option.key}: ${option.text}` : question.question;
}

/** CRM uchun bo'shliqlar ro'yxati: "Nom ishlab chiqish, Logotip dizayni". */
export function describeGaps(gaps: ServiceKey[]) {
  if (!gaps.length) return "Jiddiy bo'shliq topilmadi";
  return gaps.map((gap) => SERVICES[gap].label).join(', ');
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
