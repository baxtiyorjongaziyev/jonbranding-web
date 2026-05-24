export interface CallAnalysisResult {
  transcript: string;
  summary: string;
  category: 'Mijoz' | 'Jamoa' | 'Shaxsiy' | 'Oila' | 'Boshqa';
}

/**
 * Sends audio to Gemini 1.5 Flash on Google AI Studio to transcribe, summarize, and categorize.
 * Uses the free tier API key of Google AI Studio.
 */
export async function analyzeCallAudio(audioBuffer: Buffer, mimeType: string = 'audio/mp3'): Promise<CallAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const base64Audio = audioBuffer.toString('base64');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `Siz Jon Branding premium brend-agentligining aqlli yordamchisisiz. 
Ushbu audio yozuvni diqqat bilan eshitib chiqib, quyidagi amallarni bajaring va faqatgina so'ralgan JSON formatida javob bering:

1. **Transkritsiya (transcript)**: Nutqni o'zbek tilida to'liq matnga aylantiring. Sheva va og'zaki nutq so'zlarini (masalan, "obti", "qgan", "opti", "yashmi") eshitilishiga qarab eng to'g'ri o'zbekcha so'zlarga ("olibdi", "qilgan", "olibdi", "yaxshimi") silliqlab, imloviy jihatdan toza va tiniq o'zbekcha matn holatiga keltiring.
2. **Suhbat xulosasi (summary)**: Suhbat kimlar o'rtasida bo'lgani va asosiy kelishuvlar/muhokama mavzulari yuzasidan o'zbek tilida juda lo'nda, aniq va professional 2-3 jumlali xulosa yozing.
3. **Toifa / Kategoriya (category)**: Suhbat mohiyatiga qarab uni faqatgina quyidagi toifalardan biriga ajrating:
   - "Mijoz" (mijozlar bilan brending, xizmatlar, narx, kelishuvlar, feedback, hamkorlik muhokamalari)
   - "Jamoa" (menejerlar, kadrlar, nomzodlar, recruitment, jamoa ishi, ish jarayonlari va topshiriqlar)
   - "Shaxsiy" (tanishlar, do'stlar bilan norasmiy va shaxsiy masalalar, bozor-ochar, shaxsiy ishlar)
   - "Oila" (oila a'zolari, uy va qarindoshlar bilan muloqotlar)
   - "Boshqa" (qisqa, tushunarsiz, adashib tushgan yoki noto'g'ri raqam qo'ng'iroqlari)`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Audio
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            transcript: { type: 'STRING' },
            summary: { type: 'STRING' },
            category: {
              type: 'STRING',
              enum: ['Mijoz', 'Jamoa', 'Shaxsiy', 'Oila', 'Boshqa']
            }
          },
          required: ['transcript', 'summary', 'category']
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error('Empty response from Gemini API');
  }

  return JSON.parse(textResponse) as CallAnalysisResult;
}
