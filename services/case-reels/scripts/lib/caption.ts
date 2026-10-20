/**
 * Reels caption: faqat Sanity faktlaridan, 4 tilda, Baxtiyorjon ovozida (F-05).
 * LLM faqat matnni chiroyli qiladi; yangi fakt yoki raqam qo'sha olmaydi —
 * `validateCaption` Sanity'da yo'q har qanday raqamni rad etadi.
 */
import type { ReelLang } from '../../src/CaseReel';

export type CaptionFacts = {
  client: string;
  title: string;
  category: string;
  city?: string;
  industry?: string;
  description?: string;
  result?: { metric: string; value: string; period: string } | null;
  url: string;
};

export type Caption = { lang: ReelLang; text: string; hashtags: string[] };

const LANG_NAME: Record<ReelLang, string> = {
  uz: "o'zbek (lotin yozuvi)",
  ru: 'rus',
  en: 'ingliz',
  zh: 'xitoy (soddalashtirilgan)',
};

const CTA: Record<ReelLang, string> = {
  uz: "Brendingiz ham shunday bo'lishini xohlaysizmi? Bepul audit — havola profilda",
  ru: 'Хотите так же для своего бренда? Бесплатный аудит — ссылка в профиле',
  en: 'Want this for your brand? Free brand audit — link in bio',
  zh: '想让您的品牌也焕然一新？免费品牌诊断——链接在主页',
};

const BASE_TAGS = ['#jonbranding', '#branding', '#logo', '#brandbook'];

export const MAX_CAPTION_CHARS = 1800; // Instagram 2200 limitidan zaxira bilan

/** Matndagi barcha raqamlar (1 200, 40%, 3.5 → "1200", "40", "3.5"). */
export function numbersIn(text: string): string[] {
  return (text.match(/\d[\d\s.,]*\d|\d/g) ?? []).map((n) => n.replace(/[\s,]/g, '').replace(/\.$/, ''));
}

export function buildPrompt(facts: CaptionFacts, lang: ReelLang): string {
  return [
    `Sen Jon Branding agentligi asoschisi Baxtiyorjon Gaziyev nomidan Instagram Reels caption yozasan.`,
    `Til: ${LANG_NAME[lang]}. Uslub: do'stona, sodda, qisqa jumlalar, ishonchli; "yaratish" va "identitet" so'zlarini ishlatma; haddan tashqari rasmiy yoki badiiy bo'lma.`,
    `Tuzilma: 1) ilmoq (1 jumla) 2) mijoz va vazifa (2-3 jumla) 3) natija — FAQAT quyida berilgan bo'lsa 4) CTA aynan: "${CTA[lang]}".`,
    `QAT'IY: faqat quyidagi faktlardan foydalan. Yangi raqam, foiz, muddat, mijoz nomi yoki da'vo QO'SHMA. Bilmasang — yozma.`,
    `Hashtag yozma, ularni tizim o'zi qo'shadi. Emoji ko'pi bilan 2 ta. ${MAX_CAPTION_CHARS} belgidan oshma.`,
    `FAKTLAR (JSON):`,
    JSON.stringify(facts, null, 2),
  ].join('\n');
}

export type CaptionCheck = { ok: true } | { ok: false; reasons: string[] };

/** Caption faqat faktlardagi raqamlarni ishlatganini va CTA bor-yo'qligini tekshiradi. */
export function validateCaption(text: string, facts: CaptionFacts, lang: ReelLang): CaptionCheck {
  const reasons: string[] = [];
  const allowed = new Set(numbersIn(JSON.stringify(facts)));
  const invented = numbersIn(text).filter((n) => !allowed.has(n));
  if (invented.length) reasons.push(`Sanity'da yo'q raqam: ${[...new Set(invented)].join(', ')}`);
  if (!text.includes(CTA[lang])) reasons.push('CTA yo\'q yoki o\'zgartirilgan');
  if (text.length > MAX_CAPTION_CHARS) reasons.push(`Juda uzun: ${text.length} belgi`);
  if (/#\w/.test(text)) reasons.push('Hashtag matn ichida bo\'lmasligi kerak');
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function hashtagsFor(facts: CaptionFacts): string[] {
  const slugTag = (s?: string) =>
    s ? '#' + s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '') : null;
  const tags = [...BASE_TAGS, slugTag(facts.industry), slugTag(facts.city)].filter(Boolean) as string[];
  return [...new Set(tags)].slice(0, 8);
}

/** API kaliti bo'lmasa yoki MOCK rejimida — LLM'siz, faqat faktlardan shablon caption. */
export function templateCaption(facts: CaptionFacts, lang: ReelLang): string {
  const result = facts.result ? `\n\n${facts.result.metric}: ${facts.result.value} (${facts.result.period})` : '';
  return `${facts.client} — ${facts.title}.\n${facts.category}.${result}\n\n${CTA[lang]}`;
}

export type Generate = (prompt: string) => Promise<string>;

/** LLM orqali caption; tekshiruvdan o'tmasa 1 marta qayta urinadi, yana o'tmasa shablonga qaytadi. */
export async function makeCaption(facts: CaptionFacts, lang: ReelLang, generate?: Generate): Promise<Caption & { source: 'llm' | 'template' }> {
  const hashtags = hashtagsFor(facts);
  if (generate) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const text = (await generate(buildPrompt(facts, lang))).trim();
      if (validateCaption(text, facts, lang).ok) return { lang, text, hashtags, source: 'llm' };
    }
  }
  return { lang, text: templateCaption(facts, lang), hashtags, source: 'template' };
}

/** Gemini REST (portfolio-bot bilan bir xil provayder). */
export function geminiGenerator(apiKey: string, model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite'): Generate {
  return async (prompt) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  };
}
