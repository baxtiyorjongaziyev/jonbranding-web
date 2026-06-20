import axios from 'axios';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const PROMPT = (text) => `
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
export async function parsePostWithOisha(messageText) {
    const res = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: PROMPT(messageText) }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }, { timeout: 30_000 });
    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
        throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.driveFolderUrl) {
        const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
        parsed.driveFolderId = match ? match[1] : null;
    }
    else {
        parsed.driveFolderId = null;
    }
    return parsed;
}
