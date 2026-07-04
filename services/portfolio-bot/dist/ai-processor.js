import fs from 'fs';
import axios from 'axios';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const FULL_PROMPT = (text) => `
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
export async function parseWithAI(messageText) {
    const res = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: FULL_PROMPT(messageText) }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    }, { timeout: 30_000 });
    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
        throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);
    const parsed = JSON.parse(jsonMatch[0]);
    // Drive folder ID ni ajratib olish
    if (parsed.driveFolderUrl) {
        const match = parsed.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
        parsed.driveFolderId = match ? match[1] : null;
    }
    else {
        parsed.driveFolderId = null;
    }
    // Body matnni tayyorlash (Sanity block formatida)
    parsed.body = generateBodyContent(parsed);
    return parsed;
}
/**
 * AI dan olingan ma'lumotlardan Sanity block content yaratish
 */
function generateBodyContent(data) {
    const blocks = [];
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
const SEARCH_TERMS_PROMPT = (text) => `
Quyidagi Telegram postidan FAQAT ikkita narsani ajratib ol — loyiha nomi va mijoz nomi.
Bular Google Drive'da rasm papkasini nom bo'yicha qidirish uchun ishlatiladi, shuning
uchun qisqa va aniq bo'lsin (papka nomlariga o'xshash kalit so'zlar).

POST MATNI:
"""
${text}
"""

FAQAT JSON qaytar, boshqa hech narsa yozma:
{
  "title": "loyiha/brend nomi (2-4 so'z)",
  "client": "mijoz kompaniya yoki shaxs nomi"
}
`;
/**
 * Postdan tezkor ravishda faqat qidiruv uchun kerakli nom va mijozni oladi
 * (Google Drive'da papka qidirishdan OLDIN chaqiriladi, arzon va tez chaqiruv).
 */
export async function extractSearchTerms(postText) {
    const res = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: SEARCH_TERMS_PROMPT(postText) }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
    }, { timeout: 20_000 });
    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
        throw new Error(`Gemini qidiruv atamalarini qaytarmadi: ${reply.slice(0, 200)}`);
    const parsed = JSON.parse(jsonMatch[0]);
    return { title: parsed.title || '', client: parsed.client || '' };
}
const FULL_CASE_PROMPT = (postText, folderName, imageCount) => `
Siz Jon Branding premium brend-agentligining portfolio muharririsiz. Quyidagi Telegram
post matni VA ${imageCount} ta ilova qilingan loyiha rasmi asosida to'liq, SEO uchun
optimallashtirilgan portfolio case-study yarating.

POST MATNI:
"""
${postText}
"""

DRIVE PAPKA NOMI: "${folderName}"

FAQAT quyidagi JSON formatda javob ber (boshqa hech narsa yozma):
{
  "title": "loyiha nomi (qisqa, aniq, 2-5 so'z)",
  "client": "mijoz/kompaniya nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif (mijozga nima qilindi)",
  "detailedDescription": "3-5 jumlada batafsil tavsif (loyiha haqida to'liq)",
  "tags": ["3-5 ta teg: texnologiyalar, soha, uslub"],
  "results": [{"metric": "Ko'rsatkich nomi", "value": "Qiymat (masalan +40%)"}],
  "solution": "Loyihada qanday yechim taklif qilindi (2-3 jumla)",
  "targetAudience": "Maqsadli auditoriya kim edi",
  "testimonials": ["Mijozdan iqtiboslar (agar postda bo'lsa)"],
  "metaTitle": "SEO uchun sahifa sarlavhasi, 60 belgigacha, brend nomi + asosiy xizmat bilan",
  "metaDescription": "SEO uchun qidiruv natijasida chiqadigan tavsif, 150-160 belgi, jozibali va aniq",
  "seoKeywords": ["5-8 ta qidiruv kalit so'zi, o'zbek tilida, aniq va tegishli"],
  "coverImageIndex": 0,
  "imageOrder": [0, 1, 2]
}

QATTIQ QOIDALAR:
1. category FAQAT berilgan ro'yxatdan bo'lishi shart.
2. Faktlarni faqat post matnidan oling — o'zingizdan hech narsa to'qimang (gallyutsinatsiya qilmang).
3. coverImageIndex: rasmlar ichidan eng chiroyli, jozibali va muqova uchun mos bo'lgan bitta rasmning index raqami (0 dan boshlanadi).
4. imageOrder: barcha rasmlarning saytda ko'rsatilish tartibi (mantiqiy ketma-ketlik: logotip -> aydentika -> qadoq -> boshqa).
5. metaTitle va metaDescription qidiruv tizimlarida yaxshi ko'rinishi uchun jozibali, lekin haqiqatga mos yozilishi kerak.
`;
/**
 * Post matni + Drive'dan topilgan rasmlar asosida TO'LIQ case-study yaratadi:
 * boy matn, SEO meta-data, va rasmlar ichidan vizual tahlil bilan cover/tartib
 * tanlash — bittа multimodal chaqiruvda.
 */
export async function parseFullCase(postText, folderName, imageFiles) {
    const parts = [];
    for (const img of imageFiles) {
        if (!fs.existsSync(img.path))
            continue;
        const base64 = fs.readFileSync(img.path, { encoding: 'base64' });
        parts.push({ inlineData: { mimeType: img.mime, data: base64 } });
    }
    parts.push({ text: FULL_CASE_PROMPT(postText, folderName, imageFiles.length) });
    const res = await axios.post(GEMINI_URL, {
        contents: [{ parts }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 3072 },
    }, { timeout: 90_000 });
    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
        throw new Error(`Gemini JSON qaytarmadi: ${reply.slice(0, 200)}`);
    const parsed = JSON.parse(jsonMatch[0]);
    parsed.driveFolderUrl = null;
    parsed.driveFolderId = null;
    parsed.body = generateBodyContent(parsed);
    return parsed;
}
/**
 * Portfolio ma'lumotlarini ParsedProject formatiga o'tkazish
 */
export function toParsedProject(aiData) {
    return {
        title: aiData.title,
        client: aiData.client,
        category: aiData.category,
        description: aiData.description,
        tags: aiData.tags,
        results: aiData.results,
        driveFolderUrl: aiData.driveFolderUrl,
        driveFolderId: aiData.driveFolderId,
    };
}
