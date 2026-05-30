import axios from 'axios';
import type { ParsedProject } from './types.js';

const API_URL = process.env.OISHA_API_URL!;
const SECRET = process.env.OISHA_SECRET_KEY!;
const BOT_USER_ID = 'portfolio-bot-parser';

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
    `${API_URL}/api/chat/send`,
    { user_id: BOT_USER_ID, text: PROMPT(messageText), secret_key: SECRET },
    { timeout: 30_000 }
  );

  const reply: string = res.data?.response || res.data?.text || '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Oisha JSON qaytarmadi: ${reply.slice(0, 200)}`);

  const parsed = JSON.parse(jsonMatch[0]) as ParsedProject;

  if (parsed.driveFolderUrl) {
    const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    parsed.driveFolderId = match ? match[1] : null;
  } else {
    parsed.driveFolderId = null;
  }

  return parsed;
}
