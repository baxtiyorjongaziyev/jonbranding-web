'use server';
/**
 * @fileOverview Jon.Branding uchun AI assistent oqimi.
 *
 * - chatAssistant - Foydalanuvchi savollariga javob beruvchi funksiya.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

// AI'dan keladigan javob sxemasi
const AssistantOutputSchema = z.object({
  reply: z.string().describe("AI assistentning matnli javobi."),
  choices: z.array(z.string()).optional().describe("Agar foydalanuvchiga tanlov taklif qilinsa, shu variantlar ro'yxati."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// Foydalanuvchidan keladigan so'rov sxemasi
const AssistantInputSchema = z.object({
  query: z.string().describe('Foydalanuvchining oxirgi savoli yoki xabari.'),
  history: z.array(MessageSchema).optional().describe("Oldingi suhbat tarixi."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;


// 1. Tool uchun Zod schema'sini kengaytiramiz
const SendLeadInputSchema = z.object({
    fullName: z.string().describe("Mijozning to'liq ismi."),
    phone: z.string().optional().describe("Mijozning telefon raqami."),
    telegram: z.string().optional().describe("Mijozning Telegram niki."),
    companyName: z.string().optional().describe("Mijozning kompaniyasi yoki loyiha nomi."),
    goal: z.string().optional().describe("Mijozning asosiy maqsadi."),
    budget: z.string().optional().describe("Mijozning taxminiy byudjeti."),
    location: z.string().optional().describe("Mijozning joylashuvi."),
    notes: z.string().describe("Suhbatdan olingan barcha muhim ma'lumotlar, mijozning ehtiyojlari va muammolari haqidagi qisqacha xulosa."),
});

// 2. Telegramga ma'lumot yuboradigan Tool'ni yangilaymiz
const sendLeadToTelegram = ai.defineTool(
    {
        name: 'sendLeadToTelegram',
        description: "Mijoz haqida BARCHA kerakli ma'lumotlar (ismi, kompaniyasi, maqsadi, byudjeti, joylashuvi, aloqa ma'lumoti) to'planganda, faqat o'shanda bu tool'ni ishlat. Bu ma'lumotni menejerga yuboradi.",
        inputSchema: SendLeadInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
       try {
            const botToken = '7738413085:AAE_CYNnbpyoW5KiheUTJOPBmz_jHLVWgWc';
            const chatId = '-1002566480563';

            const message = `
🤖 AI Assistant orqali YANGI SIFATLI LEAD!

👤 Ismi: ${input.fullName}
📞 Telefon: ${input.phone || "Noma'lum"}
✈️ Telegram: ${input.telegram || "Noma'lum"}
🏢 Kompaniya: ${input.companyName || "Noma'lum"}

🎯 Maqsadi: ${input.goal || "Noma'lum"}
💰 Byudjeti: ${input.budget || "Noma'lum"}
📍 Joylashuvi: ${input.location || "Noma'lum"}

📝 Suhbat xulosasi:
${input.notes}
            `.trim();

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const payload = { chat_id: chatId, text: message, parse_mode: 'Markdown' };
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Telegram API Error:", await response.json());
                return "Menejerga ma'lumot yuborishda xatolik yuz berdi. Iltimos, buni foydalanuvchiga bildiring.";
            }

            return "Ma'lumotlar menejerga muvaffaqiyatli yuborildi. Endi foydalanuvchiga tez orada u bilan bog'lanishlarini ayting.";

       } catch (error) {
           console.error(error);
           return "Ichki xatolik yuz berdi.";
       }
    }
);

export async function chatAssistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}


// 3. System promptni butunlay yangilaymiz
const systemPrompt = `Sen "Jon.Branding" nomli brending agentligining "Jon" ismli malakali va aqlli virtual yordamchisisan. Sening vazifang - tashrif buyuruvchilarni sifatli "lead"ga aylantirish.

**Sening asosiy maqsading:** Mijoz haqida BARCHA kerakli ma'lumotlarni bosqichma-bosqich yig'ish va oxirida 'sendLeadToTelegram' tool'ini ishlatish.

**Muloqot uslubing:**
- **Qisqa va aniq:** Uzoq gapirma. **Bir vaqtning o'zida faqat bitta savol ber.**
- **Suhbatni boshqar:** Mantiqiy ketma-ketlikda savollar ber. Hech qachon bir xil savolni qayta so'rama.
- **Tanishish:** Sen allaqachon salomlashib, o'zingni tanishtirgansan. Buni qaytarma.

**SUHBATNING QAT'IY STSENARIYSI:**
Har doim quyidagi ketma-ketlikka amal qil. Agar biror ma'lumot allaqachon mavjud bo'lsa, keyingi bosqichga o't.

1.  **Loyiha nomi:** "Biznesingiz yoki loyihangiz nomi nima?" deb so'ra.

2.  **Asosiy maqsad:** "Brending sohasida qanday asosiy maqsadingiz bor?" deb so'ra va **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Brending haqida ma'lumotga ega emasman, lekin biznesim uchun kerak.", "Brendim bor, lekin u samarasiz, tahlil va maslahat kerak.", "Brending kuchini tushunaman va aniq maqsad bilan keldim."]

3.  **Byudjet:** "Loyiha uchun taxminiy byudjetingiz qanday?" deb so'ra va **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Hali mavjud emas / Faqat o'rganayapman", "$500 gacha", "$500 - $1,500", "$1,500 - $3,000", "$3,000 dan yuqori"]

4.  **Joylashuv:** "Qayerdansiz? Joylashuvingizni tanlang." deb so'ra va **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Toshkent", "Farg'ona", "Boshqa viloyat"]

5.  **Ism:** "Tushunarli. Endi o'zingizni tanishtirsangiz, ismingiz nima?" deb so'ra.

6.  **Aloqa ma'lumoti:** "Xursandman, [Mijozning ismi]. Menejerimiz siz bilan bog'lanishi uchun telefon raqamingizni yoki telegram linkingizni yozib yuboring." deb so'ra.

7.  **Tool'ni ishlatish:** Yuqoridagi BARCHA ma'lumotlar yig'ilgandan keyingina, 'sendLeadToTelegram' tool'ini ishga tushir. Suhbatdan olgan barcha ma'lumotlaringni 'notes' maydoniga yoz.

**MUHIM QOIDALAR:**
- Agar foydalanuvchi ma'lumot berishdan bosh tortsa, "Tushunarli. Qachonki tayyor bo'lsangiz, men shu yerdaman" deb javob ber.
- Hech qachon o'zing narx yoki muddat aytma.
- Agar foydalanuvchi jarayondan chetga chiqib, boshqa savol bersa (masalan, "Portfolioingizni ko'rsating"), avval uning savoliga javob ber, keyin stsenariy bo'yicha to'xtagan joyingdan davom et.

{{#if history}}
**Suhbat tarixi:**
{{#each history}}
  {{#if isUser}}Foydalanuvchi: {{content}}{{/if}}
  {{#if isBot}}Jon (AI): {{content}}{{/if}}
{{/each}}
{{/if}}

Mijozning hozirgi savoli: {{{query}}}`;

// Promptni aniqlaymiz, chiqish sxemasini qo'shamiz
const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  output: {schema: AssistantOutputSchema},
  prompt: systemPrompt,
  tools: [sendLeadToTelegram],
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    
    const augmentedHistory = input.history?.map(msg => ({
      ...msg,
      isUser: msg.role === 'user',
      isBot: msg.role === 'bot'
    }));

    const promptInput = { ...input, history: augmentedHistory };

    let llmResponse = await prompt(promptInput);

    while (true) {
      if (llmResponse.output()) {
        return llmResponse.output()!;
      }

      const toolRequest = llmResponse.toolRequest();
      if (!toolRequest || !toolRequest.toolCalls.length) {
        break;
      }
      
      const toolCall = toolRequest.toolCalls[0];
      const toolResult = await ai.runTool(toolCall);
      
      llmResponse = await llmResponse.continue({
        toolResult: {
          toolResult: {
            tool: toolCall.name,
            callId: toolCall.callId,
            result: toolResult as any,
          },
        },
      });
    }
    
    return { reply: "Kechirasiz, hozir javob bera olmayman." };
  }
);
