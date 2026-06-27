export interface CallAnalysisResult {
  transcript: string;
  summary: string;
  category: 'Mijoz' | 'Jamoa' | 'Shaxsiy' | 'Oila' | 'Boshqa';
}

/**
 * Sends audio to Gemini 1.5 Flash on Google AI Studio to transcribe, summarize, and categorize.
 * Uses the free tier API key of Google AI Studio.
 * NOTE: We do NOT use responseSchema here because Gemini returns empty output when
 * responseSchema is combined with short/silent audio files. Instead, we ask for JSON
 * in the prompt and parse it ourselves, which is more robust.
 */
export async function analyzeCallAudio(
  audioBuffer: Buffer,
  mimeType: string = 'audio/mp3'
): Promise<CallAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const base64Audio = audioBuffer.toString('base64');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Siz Jon Branding premium brend-agentligining aqlli yordamchisisiz.
Ushbu audio yozuvni diqqat bilan eshitib chiqib, FAQAT quyidagi JSON formatida javob bering (boshqa hech narsa yozmang):

{
  "transcript": "Nutqning o'zbek tilidagi to'liq matni. Sheva va og'zaki nutq so'zlarini (masalan, 'obti', 'qgan', 'opti', 'yashmi') eshitilishiga qarab eng to'g'ri o'zbekcha so'zlarga ('olibdi', 'qilgan', 'olibdi', 'yaxshimi') silliqlab, imloviy jihatdan toza va tiniq o'zbekcha matn holatiga keltiring.",
  "summary": "Suhbat kimlar o'rtasida bo'lgani va asosiy kelishuvlar/muhokama mavzulari yuzasidan o'zbek tilida juda lo'nda, aniq va professional 2-3 jumlali xulosa.",
  "category": "Quyidagilardan faqat BITTASI: Mijoz | Jamoa | Shaxsiy | Oila | Boshqa"
}

Toifalar:
- "Mijoz": mijozlar bilan brending, xizmatlar, narx, kelishuvlar, feedback, hamkorlik muhokamalari
- "Jamoa": menejerlar, kadrlar, nomzodlar, recruitment, jamoa ishi, ish jarayonlari va topshiriqlar
- "Shaxsiy": tanishlar, do'stlar bilan norasmiy va shaxsiy masalalar, bozor-ochar, shaxsiy ishlar
- "Oila": oila a'zolari, uy va qarindoshlar bilan muloqotlar
- "Boshqa": qisqa, tushunarsiz, adashib tushgan yoki noto'g'ri raqam qo'ng'iroqlari, shovqin faqat

MUHIM: Agar audio juda qisqa, bo'sh yoki faqat shovqin bo'lsa:
{
  "transcript": "Audio aniq emas yoki juda qisqa.",
  "summary": "Audio yozuvi qisqa yoki sifatsiz bo'lganligi sababli tahlil qilishning iloji bo'lmadi.",
  "category": "Boshqa"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Audio,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  // Check for blocked/filtered responses
  const finishReason = result.candidates?.[0]?.finishReason;
  if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
    return {
      transcript: 'Xavfsizlik filtri tufayli tahlil qilinmadi.',
      summary: 'Kontent xavfsizlik filtriga tushdi, tahlil qilishning iloji bo\'lmadi.',
      category: 'Boshqa',
    };
  }

  // Extract text from response
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse || textResponse.trim() === '') {
    // If finish reason is OTHER or MAX_TOKENS, handle gracefully
    console.warn(
      `Empty Gemini response. finishReason: ${finishReason}. Full response:`,
      JSON.stringify(result, null, 2)
    );
    return {
      transcript: 'Model javob bermadi (bo\'sh audio yoki texnik muammo).',
      summary: 'Gemini audio faylni tahlil qila olmadi.',
      category: 'Boshqa',
    };
  }

  // Parse JSON from text response (handle markdown code blocks too)
  try {
    const cleaned = textResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as CallAnalysisResult;

    // Validate category
    const validCategories = ['Mijoz', 'Jamoa', 'Shaxsiy', 'Oila', 'Boshqa'] as const;
    if (!validCategories.includes(parsed.category as any)) {
      parsed.category = 'Boshqa';
    }

    return parsed;
  } catch (parseError) {
    console.error('JSON parse error from Gemini response:', textResponse);
    // Return a fallback instead of throwing
    return {
      transcript: textResponse.substring(0, 1000),
      summary: 'JSON formatlash xatosi yuz berdi, lekin model javob qaytardi.',
      category: 'Boshqa',
    };
  }
}

export interface ParsedPortfolioProject {
  title: string;
  client: string;
  category: 'logo-design' | 'naming' | 'brandbook' | 'corporate-style' | 'packaging' | 'brand-strategy';
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
}

export async function parsePortfolioMetadata(
  text: string
): Promise<ParsedPortfolioProject> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Siz Jon Branding premium brend-agentligining yordamchisisiz.
Quyidagi matndan portfolio loyihasi uchun ma'lumotlarni ajratib, FAQAT quyidagi JSON formatida javob bering (boshqa hech narsa yozmang):

{
  "title": "loyiha nomi (qisqa, 2-5 so'z)",
  "client": "mijoz kompaniya/ism nomi",
  "category": "Quyidagilardan faqat bittasi: logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "Loyiha haqida o'zbek tilida qisqa, 1-2 jumlali professional tavsif",
  "tags": ["teg1", "teg2"],
  "results": [{"metric": "ko'rsatkich nomi", "value": "qiymat (masalan: +40%)"}]
}

Kategoriyalar tavsifi:
- "logo-design": logotip loyihalari
- "naming": neyming, nom tanlash
- "brandbook": brendbuk, batafsil qoidalar to'plami
- "corporate-style": firma uslubi, korporativ aydentika
- "packaging": qadoq dizayni, packaging
- "brand-strategy": brend strategiyasi, tadqiqotlar

Juda MUHIM qoidalar:
1. Loyiha nomi, mijoz, sanoat va faktlarni FAQAT berilgan matndan oling.
2. O'zingizdan aslo hech narsa to'qib yozmang (gallyutsinatsiya qilmang). Agar mijoz haqida yozilmagan bo'lsa, "Noma'lum" deb bering.
3. Loyiha faoliyatini yoki natijalarni bo'rttirmang. Faqat hujjatda bor faktlarni yozing.

MATN:
"""
${text}
"""
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse || textResponse.trim() === '') {
    throw new Error('Empty response from Gemini');
  }

  try {
    const cleaned = textResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as ParsedPortfolioProject;

    // Validate category fallback
    const validCategories = ['logo-design', 'naming', 'brandbook', 'corporate-style', 'packaging', 'brand-strategy'];
    if (!validCategories.includes(parsed.category)) {
      parsed.category = 'logo-design';
    }

    return parsed;
  } catch (e) {
    console.error('JSON parse error from Gemini response:', textResponse);
    throw new Error('Failed to parse portfolio metadata JSON from Gemini: ' + e);
  }
}

export interface ParsedTestimonial {
  name: string;
  company: {
    uz: string;
    ru: string;
    en: string;
    zh: string;
  };
  quote: {
    uz: string;
    ru: string;
    en: string;
    zh: string;
  };
  rating: number;
}

export async function parseReviewMetadata(
  text: string
): Promise<ParsedTestimonial> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Siz Jon Branding premium brend-agentligining yordamchisisiz.
Quyidagi mijoz sharhi matnini tahlil qiling. Undan mijozning ismi, kompaniya nomini ajrating va sharh matnini 4 ta tilga (o'zbek, rus, ingliz, xitoy) mukammal professional darajada tarjima qilib, FAQAT quyidagi JSON formatida javob bering (boshqa hech narsa yozmang):

{
  "name": "Mijoz ismi (masalan: Akmal)",
  "company": {
    "uz": "Kompaniya nomi (masalan: Qumri Coffee)",
    "ru": "Название компании на русском",
    "en": "Company name in English",
    "zh": "中文公司名称"
  },
  "quote": {
    "uz": "Sharh matni o'zbek tilida (asl matndan olingan, agar sheva bo'lsa silliqlangan)",
    "ru": "Перевод отзыва на русский язык (профессиональный, качественный)",
    "en": "Professional translation of the review into English",
    "zh": "中文专业翻译的客户评价"
  },
  "rating": 5
}

Muhim qoidalar:
1. Ism, kompaniya va sharh mazmunini faqat berilgan matndan oling. O'zingizdan fakt to'qimang.
2. Agar reyting (yulduzchalar) ko'rsatilmagan bo'lsa, avtomatik ravishda 5 deb oling.
3. Tarjimalar o'ta professional, imloviy va uslubiy jihatdan xatosiz, premium brend darajasiga mos bo'lishi shart.

MATN:
"""
${text}
"""
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse || textResponse.trim() === '') {
    throw new Error('Empty response from Gemini');
  }

  try {
    const cleaned = textResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as ParsedTestimonial;
    return parsed;
  } catch (e) {
    console.error('JSON parse error from Gemini response:', textResponse);
    throw new Error('Failed to parse review metadata JSON from Gemini: ' + e);
  }
}
