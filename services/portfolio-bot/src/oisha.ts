import axios from 'axios';
import type { ParsedProject } from './types.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const VALID_CATEGORIES = [
  'logo-design', 'naming', 'brandbook', 'corporate-style', 'packaging', 'brand-strategy',
] as const;

type Category = typeof VALID_CATEGORIES[number];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  'logo-design': ['logo', 'логотип', 'logotip', 'логотипи', 'логотипы'],
  'naming': ['naming', 'нейминг', 'neyming', 'ism', 'бренд-нейм'],
  'brandbook': ['brandbook', 'брендбук', 'brendbuk', 'brand book'],
  'corporate-style': ['corporate', 'корпоратив', 'korporativ', 'фирменный стиль', 'фирстиль'],
  'packaging': ['packaging', 'упаковка', 'qadoqlash', 'paket', 'пакет'],
  'brand-strategy': ['strategy', 'стратегия', 'strategiya', 'позиционирование', 'positioning'],
};

function inferCategory(text: string, suggested: string): Category {
  const lower = (text + ' ' + suggested).toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  if (VALID_CATEGORIES.includes(suggested as Category)) return suggested as Category;
  return 'logo-design';
}

function extractJson(text: string): string | null {
  // Strip markdown code fences
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const match = stripped.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

const PROMPT = (text: string) => `Extract branding project data from the Telegram post below. Reply ONLY with valid JSON — no markdown, no explanation.

POST:
"""
${text}
"""

Return exactly this JSON structure:
{
  "title": "short project name (2-5 words, keep original language)",
  "client": "client company or person name",
  "category": "one of: logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 sentence project description",
  "tags": ["tag1", "tag2"],
  "results": [{"metric": "metric name", "value": "value e.g. +40%"}],
  "driveFolderUrl": "https://drive.google.com/... or null"
}

Rules:
- If a field is missing from the post, use empty string or empty array.
- category MUST be one of the listed values — infer from context if not stated.
- tags should be lowercase, hyphenated (e.g. "food-branding", "startup").
- results: only include if post mentions concrete metrics/results; otherwise empty array.
- driveFolderUrl: full Google Drive folder URL or null.`;

export async function parsePostWithOisha(messageText: string): Promise<ParsedProject> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await axios.post(
        GEMINI_URL,
        {
          contents: [{ parts: [{ text: PROMPT(messageText) }] }],
          generationConfig: { temperature: attempt === 1 ? 0.1 : 0.3, maxOutputTokens: 1024 },
        },
        { timeout: 30_000 }
      );

      const reply: string = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonStr = extractJson(reply);
      if (!jsonStr) {
        lastError = new Error(`Gemini returned no JSON (attempt ${attempt}): ${reply.slice(0, 200)}`);
        continue;
      }

      const raw = JSON.parse(jsonStr) as Record<string, unknown>;
      const parsed: ParsedProject = {
        title: String(raw.title ?? '').trim() || 'Untitled Project',
        client: String(raw.client ?? '').trim(),
        category: inferCategory(messageText, String(raw.category ?? '')),
        description: String(raw.description ?? '').trim(),
        tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
        results: Array.isArray(raw.results)
          ? raw.results
              .filter((r): r is { metric: unknown; value: unknown } => r && typeof r === 'object')
              .map((r) => ({ metric: String(r.metric ?? ''), value: String(r.value ?? '') }))
          : [],
        driveFolderUrl: typeof raw.driveFolderUrl === 'string' ? raw.driveFolderUrl : null,
        driveFolderId: null,
      };

      if (parsed.driveFolderUrl) {
        const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
        parsed.driveFolderId = match ? match[1] : null;
      }

      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }

  throw lastError ?? new Error('parsePostWithOisha: all attempts failed');
}
