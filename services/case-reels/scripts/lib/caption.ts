/**
 * Reels caption: faqat Sanity faktlaridan, 4 tilda, Baxtiyorjon ovozida (F-05).
 *
 * Erkin matn emas — LLM qat'iy JSON qaytaradi: ilmoq + har biri bitta Sanity faktiga
 * bog'langan jumlalar. Har jumladagi raqamlar o'sha faktning o'zidan bo'lishi shart.
 * Bu semantik to'qishni to'liq yo'qotmaydi, shuning uchun caption baribir faqat
 * egasi tasdig'idan (F-06) keyin chiqadi — bu modul draft yozadi, xolos.
 */
import type { ReelLang } from '../../src/CaseReel';

export type CaptionFacts = {
  client: string;
  title: string;
  category?: string;
  city?: string;
  industry?: string;
  description?: string;
  result?: { metric: string; value: string; period: string } | null;
  url: string;
};

export type FactKey = 'client' | 'title' | 'category' | 'city' | 'industry' | 'description' | 'result';
export type Caption = { lang: ReelLang; text: string; hashtags: string[]; needsReview: string[] };
export type Draft = { hook: string; sentences: { text: string; fact: FactKey }[] };

const LANG_NAME: Record<ReelLang, string> = {
  uz: "o'zbek (lotin yozuvi)",
  ru: 'rus',
  en: 'ingliz',
  zh: 'xitoy (soddalashtirilgan)',
};

export const CTA: Record<ReelLang, string> = {
  uz: "Brendingiz ham shunday bo'lishini xohlaysizmi? Bepul audit — havola profilda",
  ru: 'Хотите так же для своего бренда? Бесплатный аудит — ссылка в профиле',
  en: 'Want this for your brand? Free brand audit — link in bio',
  zh: '想让您的品牌也焕然一新？免费品牌诊断——链接在主页',
};

const TEMPLATE_LABELS: Record<ReelLang, { project: string; result: string }> = {
  uz: { project: 'Loyiha', result: 'Natija' },
  ru: { project: 'Проект', result: 'Результат' },
  en: { project: 'Project', result: 'Result' },
  zh: { project: '项目', result: '成果' },
};

const BASE_TAGS = ['#jonbranding', '#branding', '#logo', '#brandbook'];
const FALLBACK_TAGS = ['#brandidentity', '#dizayn', '#uzbekistan', '#packagingdesign'];
export const MAX_CAPTION_CHARS = 1800; // Instagram 2200 limitidan zaxira bilan
export const MAX_SENTENCES = 2; // tone of voice: qisqa — ilmoq + 2 jumla + CTA

const CJK_NUMERAL = /[零〇一二三四五六七八九十百千万萬亿億两兩]+/g;

/**
 * Matndagi raqamlar, tillardan mustaqil: to'liq kenglikdagi raqamlar (５００) NFKC bilan
 * oddiyga aylanadi; "1 200" va "1,200" — 1200; "3,5" va "3.5" — 3.5 (vergul faqat
 * ortidan aynan 3 raqam kelsa minglik ajratuvchi); xitoycha raqamlar (五百) alohida token.
 */
export function numbersIn(text: string): string[] {
  const t = text.normalize('NFKC');
  const arabic = (t.match(/\d(?:[\d   ]|[.,]\d)*/g) ?? []).map((raw) =>
    raw
      .replace(/[   ]/g, '')
      .replace(/,(?=\d{3}(?!\d))/g, '')
      .replace(',', '.'),
  );
  return [...arabic, ...(t.match(CJK_NUMERAL) ?? [])];
}

const FACT_KEYS: readonly FactKey[] = ['client', 'title', 'category', 'city', 'industry', 'description', 'result'];

function factText(facts: CaptionFacts, key: FactKey): string | undefined {
  // LLM qaytargan kalit allowlist'da va o'z maydoni bo'lishi shart ("toString" kabi meros a'zolar emas).
  if (!FACT_KEYS.includes(key) || !Object.prototype.hasOwnProperty.call(facts, key)) return undefined;
  const v = facts[key];
  if (!v) return undefined;
  return typeof v === 'string' ? v : `${v.metric} ${v.value} ${v.period}`;
}

export function buildPrompt(facts: CaptionFacts, lang: ReelLang): string {
  const keys = FACT_KEYS.filter((k) =>
    factText(facts, k),
  );
  return [
    `Sen Jon Branding asoschisi Baxtiyorjon Gaziyev nomidan Instagram Reels caption yozasan.`,
    `Til: ${LANG_NAME[lang]}. Uslub: do'stona, sodda, qisqa, ishonchli; "yaratish" va "identitet" so'zlarini ishlatma.`,
    `Faqat JSON qaytar: {"hook": string, "sentences": [{"text": string, "fact": ${keys.map((k) => `"${k}"`).join(' | ')}}]}`,
    `- hook: 1 qisqa jumla, raqamsiz, faktga oid da'vosiz (savol yoki his).`,
    `- sentences: ko'pi bilan ${MAX_SENTENCES} ta. Har bir jumla FAQAT ko'rsatilgan bitta faktni o'z so'zing bilan aytadi; boshqa da'vo, raqam, foiz, muddat qo'shma.`,
    `- CTA va hashtag yozma — tizim o'zi qo'shadi.`,
    `FAKTLAR:`,
    JSON.stringify(facts, null, 2),
  ].join('\n');
}

export function parseDraft(raw: string): Draft | null {
  const json = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  try {
    const d = JSON.parse(json) as Draft;
    if (typeof d?.hook !== 'string' || !Array.isArray(d.sentences)) return null;
    return d;
  } catch {
    return null;
  }
}

export type CaptionCheck = { ok: true } | { ok: false; reasons: string[] };
const HASHTAG = /#[\p{L}\p{N}_]/u;

/** Har jumla mavjud faktga bog'langan va undagi raqamlar faqat o'sha faktdan. */
export function validateDraft(d: Draft, facts: CaptionFacts): CaptionCheck {
  const reasons: string[] = [];
  if (numbersIn(d.hook).length) reasons.push('Ilmoqda raqam bor');
  if (HASHTAG.test(d.hook)) reasons.push('Ilmoqda hashtag bor');
  if (d.sentences.length > MAX_SENTENCES) reasons.push(`Jumlalar ko'p: ${d.sentences.length}`);
  for (const s of d.sentences) {
    const source = factText(facts, s.fact);
    if (!source) {
      reasons.push(`Mavjud bo'lmagan fakt: ${s.fact}`);
      continue;
    }
    const allowed = new Set(numbersIn(source));
    const invented = numbersIn(s.text).filter((n) => !allowed.has(n));
    if (invented.length) reasons.push(`"${s.fact}" faktida yo'q raqam: ${[...new Set(invented)].join(', ')}`);
    if (HASHTAG.test(s.text)) reasons.push('Jumlada hashtag bor');
  }
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function assemble(d: Draft, lang: ReelLang): string {
  return [d.hook.trim(), d.sentences.map((s) => s.text.trim()).join(' '), CTA[lang]].filter(Boolean).join('\n\n');
}

export function hashtagsFor(facts: CaptionFacts): string[] {
  const slugTag = (s?: string) => (s ? '#' + s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '') : null);
  const tags = [...new Set([...BASE_TAGS, slugTag(facts.industry), slugTag(facts.city)].filter(Boolean) as string[])];
  for (const t of FALLBACK_TAGS) if (tags.length < 5 && !tags.includes(t)) tags.push(t);
  return tags.slice(0, 8);
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

/**
 * LLM'siz caption — faqat faktlar, uzunligi chegaralangan. Faktlar Sanity'da o'zbekcha
 * bo'lgani uchun uz'dan boshqa tillarda matn tarjima qilinmagan: `needsReview` belgilanadi.
 */
export function templateCaption(facts: CaptionFacts, lang: ReelLang): { text: string; needsReview: string[] } {
  const L = TEMPLATE_LABELS[lang];
  const lines = [`${L.project}: ${clip(facts.client, 80)} — ${clip(facts.title, 160)}`];
  if (facts.category) lines.push(clip(facts.category, 80));
  if (facts.result) lines.push(`${L.result}: ${clip(facts.result.metric, 80)} ${clip(facts.result.value, 40)} (${clip(facts.result.period, 40)})`);
  const text = clip(`${lines.join('\n')}\n\n${CTA[lang]}`, MAX_CAPTION_CHARS);
  return { text, needsReview: lang === 'uz' ? [] : ['template-untranslated-facts'] };
}

export type Generate = (prompt: string) => Promise<string>;

/**
 * LLM orqali caption. Provayder xatosi yoki tekshiruvdan o'tmagan javob — 2 urinishgacha;
 * keyin shablon. Natija har doim draft: egasi tasdiqlamaguncha chiqmaydi.
 */
export async function makeCaption(
  facts: CaptionFacts,
  lang: ReelLang,
  generate?: Generate,
): Promise<Caption & { source: 'llm' | 'template'; errors: string[] }> {
  const hashtags = hashtagsFor(facts);
  const errors: string[] = [];
  if (generate) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const draft = parseDraft(await generate(buildPrompt(facts, lang)));
        if (!draft) {
          errors.push('JSON emas');
          continue;
        }
        const check = validateDraft(draft, facts);
        const text = assemble(draft, lang);
        if (check.ok && text.length <= MAX_CAPTION_CHARS) return { lang, text, hashtags, needsReview: [], source: 'llm', errors };
        errors.push(...(check.ok ? ['Juda uzun'] : check.reasons));
      } catch (e) {
        errors.push(`Provayder xatosi: ${(e as Error).message}`);
      }
    }
  }
  const t = templateCaption(facts, lang);
  return { lang, text: t.text, hashtags, needsReview: t.needsReview, source: 'template', errors };
}

/** Gemini REST (portfolio-bot bilan bir xil provayder); JSON rejimida, 20 s timeout. */
export function geminiGenerator(apiKey: string, model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite'): Generate {
  return async (prompt) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  };
}
