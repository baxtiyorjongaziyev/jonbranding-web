import type { ParsedProject } from './types.js';
import axios from 'axios';

/**
 * AI Processor — Telegram/Instagram postlaridan to'liq portfolio case study yaratadi
 * Gemini 2.0 Flash orqali ishlaydi
 */

export interface AIEnrichedData {
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
  body: Array<{ style: string; children: Array<{ text: string }> }>;
  driveFolderUrl: string | null;
  driveFolderId: string | null;
  detailedDescription: string;
  targetAudience: string;
  solution: string;
  testimonials: string[];
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const FULL_PROMPT = (text: string) => `
Quyidagi postdan loyiha ma'lumotlarini ajratib, FAQAT JSON formatda qaytar (boshqa hech narsa yozma):

POST MATNI:
"""
${text}
"""

Qaytarish formati (faqat JSON, hech qanday izohsiz):
{
  "title": "Loyiha nomi (qisqa, aniq, 2-5 so'z)",
  "client": "Mijoz/kompaniya nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif (mijozga nima qilindi)",
  "detailedDescription": "3-5 jumlada batafsil tavsif (loyiha haqida to'liq)",
  "tags": ["3-5 ta teg: texnologiyalar, soha, uslub"],
  "results": [
    {"metric": "Ko'rsatkich nomi (masalan: 'Brend xabardorligi')", "value": "Qiymat (masalan: '+40%')"}
  ],
  "solution": "Loyihada qanday yechim taklif qilindi (2-3 jumla)",
  "targetAudience": "Maqsadli auditoriya kim edi",
  "testimonials": ["Mijozdan iqtiboslar (agar postda bo'lsa)"],
  "driveFolderUrl": "https://drive.google.com/... yoki null"
}

QATTIQ QOIDALAR:
1. category FAQAT berilgan ro'yxatdan bo'lishi shart
2. Agar postda category haqida ma'lumot bo'lmasa, eng mosini tanlang
3. results bo'sh bo'lishi mumkin, lekin bo'lmasa yaxshi
4. Agar postda Google Drive linki bo'lmasa, driveFolderUrl ni null qiling
5. Ma'lumotlar aniq va to'liq bo'lishi kerak
`;

/**
 * Postdan AI orqali to'liq portfolio ma'lumotlarini ajratib olish
 */
export async function parseWithAI(messageText: string): Promise<AIEnrichedData> {
  const res = await axios.post(
    GEMINI_URL,
    {
      contents: [{ parts: [{ text: FULL_PROMPT(messageText) }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    },
    { timeout: 30_000 }
  );

  const reply: string = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]) as AIEnrichedData;

  // Drive folder ID ni ajratib olish
  if (parsed.driveFolderUrl) {
    const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    parsed.driveFolderId = match ? match[1] : null;
  } else {
    parsed.driveFolderId = null;
  }

  // Body matnni tayyorlash (Sanity block formatida)
  parsed.body = generateBodyContent(parsed);

  return parsed;
}

/**
 * AI dan olingan ma'lumotlardan Sanity block content yaratish
 */
function generateBodyContent(data: AIEnrichedData): Array<{ style: string; children: Array<{ text: string }> }> {
  const blocks: Array<{ style: string; children: Array<{ text: string }> }> = [];

  // Title block
  blocks.push({
    style: 'h2',
    children: [{ text: `Loyiha: ${data.title}` }],
  });

  // Description
  if (data.detailedDescription) {
    blocks.push({
      style: 'normal',
      children: [{ text: data.detailedDescription }],
    });
  }

  // Solution
  if (data.solution) {
    blocks.push({
      style: 'h3',
      children: [{ text: 'Yechim' }],
    });
    blocks.push({
      style: 'normal',
      children: [{ text: data.solution }],
    });
  }

  // Target Audience
  if (data.targetAudience) {
    blocks.push({
      style: 'h3',
      children: [{ text: 'Maqsadli auditoriya' }],
    });
    blocks.push({
      style: 'normal',
      children: [{ text: data.targetAudience }],
    });
  }

  // Testimonials
  if (data.testimonials && data.testimonials.length > 0) {
    blocks.push({
      style: 'h3',
      children: [{ text: 'Mijoz fikri' }],
    });
    for (const quote of data.testimonials) {
      blocks.push({
        style: 'blockquote',
        children: [{ text: quote }],
      });
    }
  }

  return blocks;
}

/**
 * Portfolio ma'lumotlarini ParsedProject formatiga o'tkazish
 */
export function toParsedProject(aiData: AIEnrichedData): ParsedProject {
  return {
    title: aiData.title,
    client: aiData.client,
    category: aiData.category as ParsedProject['category'],
    description: aiData.description,
    tags: aiData.tags,
    results: aiData.results,
    driveFolderUrl: aiData.driveFolderUrl,
    driveFolderId: aiData.driveFolderId,
  };
}