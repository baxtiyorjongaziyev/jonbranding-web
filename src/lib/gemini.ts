export interface CallAnalysisResult {
  transcript: string;
  summary: string;
  category: 'Mijoz' | 'Jamoa' | 'Shaxsiy' | 'Oila' | 'Boshqa';
}

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
  "transcript": "Nutqning o'zbek tilidagi to'liq matni. Sheva va og'zaki nutq so'zlarini silliqlab, imloviy jihatdan toza va tiniq o'zbekcha matn holatiga keltiring.",
  "summary": "Suhbat kimlar o'rtasida bo'lgani va asosiy kelishuvlar/muhokama mavzulari yuzasidan o'zbek tilida juda lo'nda, aniq va professional 2-3 jumlali xulosa.",
  "category": "Quyidagilardan faqat BITTASI: Mijoz | Jamoa | Shaxsiy | Oila | Boshqa"
}

Toifalar:
- "Mijoz": mijozlar bilan brending, xizmatlar, narx, kelishuvlar, feedback, hamkorlik muhokamalari
- "Jamoa": menejerlar, kadrlar, nomzodlar, recruitment, jamoa ishi, ish jarayonlari va topshiriqlar
- "Shaxsiy": tanishlar, do'stlar bilan norasmiy va shaxsiy masalalar
- "Oila": oila a'zolari, uy va qarindoshlar bilan muloqotlar
- "Boshqa": qisqa, tushunarsiz, adashib tushgan yoki noto'g'ri raqam qo'ng'iroqlari

MUHIM: Agar audio juda qisqa, bo'sh yoki faqat shovqin bo'lsa:
{
  "transcript": "Audio aniq emas yoki juda qisqa.",
  "summary": "Audio yozuvi qisqa yoki sifatsiz bo'lganligi sababli tahlil qilishning iloji bo'lmadi.",
  "category": "Boshqa"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Audio } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
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

  const finishReason = result.candidates?.[0]?.finishReason;
  if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
    return {
      transcript: 'Xavfsizlik filtri tufayli tahlil qilinmadi.',
      summary: 'Kontent xavfsizlik filtriga tushdi.',
      category: 'Boshqa',
    };
  }

  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse?.trim()) {
    return {
      transcript: "Model javob bermadi (bo'sh audio yoki texnik muammo).",
      summary: 'Gemini audio faylni tahlil qila olmadi.',
      category: 'Boshqa',
    };
  }

  try {
    const cleaned = textResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned) as CallAnalysisResult;
    const valid = ['Mijoz', 'Jamoa', 'Shaxsiy', 'Oila', 'Boshqa'] as const;
    if (!valid.includes(parsed.category as any)) parsed.category = 'Boshqa';
    return parsed;
  } catch {
    return {
      transcript: textResponse.substring(0, 1000),
      summary: 'JSON formatlash xatosi yuz berdi.',
      category: 'Boshqa',
    };
  }
}
