import axios from 'axios';
import type { ParsedProject } from './types.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const PROMPT = (text: string) => `
Quyidagi Telegram postdan loyiha ma'lumotlarini ajratib, FAQAT JSON formatda qaytargil (boshqa hech narsa yozma):

POST MATNI:
"""
${text}
"""

Qaytarish formati (faqat JSON):
{
  "title": "loyiha nomi (qisqa, 2-5 so'z)",
  "client": "mijoz kompaniya/ism nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif",
  "tags": ["teg1", "teg2"],
  "results": [{"metric": "ko'rsatkich nomi", "value": "qiymat (masalan: +40%)"}],
  "driveFolderUrl": "https://drive.google.com/... yoki null"
}

Agar biron maydon postda yo'q bo'lsa — bo'sh string yoki bo'sh array qo'y. category faqat yuqoridagilardan biri bo'lishi shart.
`;

export async function parsePostWithOisha(messageText: string): Promise<ParsedProject> {
  const res = await axios.post(
    GEMINI_URL,
    {
      contents: [{ parts: [{ text: PROMPT(messageText) }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    },
    { timeout: 30_000 }
  );

  const reply: string = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]) as ParsedProject;

  if (parsed.driveFolderUrl) {
    const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    parsed.driveFolderId = match ? match[1] : null;
  } else {
    parsed.driveFolderId = null;
  }

  return parsed;
}

import fs from 'fs';

const DRIVE_PROMPT = (folderName: string, textContent: string, imageCount: number) => `
Quyidagi Telegram postdan loyiha ma'lumotlarini ajratib, FAQAT JSON formatda qaytargil (boshqa hech narsa yozma):

POST MATNI:
"""
${text}
"""

Qaytarish formati (faqat JSON):
{
  "title": "loyiha nomi (qisqa, 2-5 so'z)",
  "client": "mijoz kompaniya/ism nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif",
  "tags": ["teg1", "teg2"],
  "results": [{"metric": "ko'rsatkich nomi", "value": "qiymat (masalan: +40%)"}],
  "driveFolderUrl": "https://drive.google.com/... yoki null"
}

Agar biron maydon postda yo'q bo'lsa — bo'sh string yoki bo'sh array qo'y. category faqat yuqoridagilardan biri bo'lishi shart.
`;

export async function parsePostWithOisha(messageText: string): Promise<ParsedProject> {
  const res = await axios.post(
    GEMINI_URL,
    {
      contents: [{ parts: [{ text: PROMPT(messageText) }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    },
    { timeout: 30_000 }
  );

  const reply: string = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]) as ParsedProject;

  if (parsed.driveFolderUrl) {
    const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    parsed.driveFolderId = match ? match[1] : null;
  } else {
    parsed.driveFolderId = null;
  }

  return parsed;
}

import fs from 'fs';

const DRIVE_PROMPT = (folderName: string, textContent: string, imageCount: number) => `
Quyidagi ma'lumotlar Google Drive papkasidan olindi. Men senga ${imageCount} ta rasmni ham ilova qildim. 
Bularni vizual tahlil qilib, FAQAT JSON formatda qaytargil (boshqa hech narsa yozma).

PAPKA NOMI: "${folderName}"
MATNLI FAYL MA'LUMOTI (agar bo'lsa):
"""
${textContent}
"""

Qaytarish formati (faqat JSON):
{
  "title": "loyiha nomi (qisqa, 2-5 so'z, papka nomidan olinishi mumkin)",
  "client": "mijoz kompaniya/ism nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif",
  "tags": ["teg1", "teg2"],
  "results": [{"metric": "ko'rsatkich nomi", "value": "qiymat (masalan: +40%)"}],
  "driveFolderUrl": null,
  "coverImageIndex": 0,
  "imageOrder": [0, 1, 2]
}

QOIDALAR:
1. coverImageIndex: Rasmlar ichidan eng chiroyli, jozibador va muqova (cover) uchun mos bo'lgan bitta rasmning index raqami (0 dan boshlanadi).
2. imageOrder: Rasmlarni saytda qanday ketma-ketlikda joylashtirish optimal bo'lishini vizual tahlil qilib, ularning indexlarini shu arrayda qaytar. Mantiqiy ketma-ketlik qiling (masalan, logotip oldin, keyin qadoq, oxirida boshqa elementlar).
3. category faqat ruxsat etilganlardan biri bo'lishi shart. Agar ma'lumot yetishmasa mantiqan o'ylab toping.
`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, data: any, config: any, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.post(url, data, config);
    } catch (err: any) {
      if (err.response && err.response.status === 429 && i < retries - 1) {
        const waitTime = (i + 1) * 3000;
        console.warn(`[oisha] 429 Too Many Requests. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries reached");
}

export async function parseDriveFolderWithOisha(
  folderName: string, 
  textContent: string = '', 
  imageFiles: { path: string; mime: string }[] = []
): Promise<ParsedProject & { coverImageIndex?: number; imageOrder?: number[] }> {
  
  const parts: any[] = [];
  
  // Add image parts
  for (const img of imageFiles) {
    if (!fs.existsSync(img.path)) continue;
    const base64 = fs.readFileSync(img.path, { encoding: 'base64' });
    parts.push({
      inlineData: {
        mimeType: img.mime,
        data: base64
      }
    });
  }

  // Add text prompt part
  parts.push({
    text: DRIVE_PROMPT(folderName, textContent, imageFiles.length)
  });

  const res = await fetchWithRetry(
    GEMINI_URL,
    {
      contents: [{ parts }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    },
    { timeout: 60_000 }
  );

  const reply: string = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]) as ParsedProject & { coverImageIndex?: number; imageOrder?: number[] };
  parsed.driveFolderId = null; // Biz buni tashqaridan o'rnatamiz
  return parsed;
}
