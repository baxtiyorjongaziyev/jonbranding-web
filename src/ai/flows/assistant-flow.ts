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
  acknowledgement: z.string().optional().describe("Foydalanuvchi javobiga qisqa tasdiq. Masalan: 'Tushunarli', 'Ajoyib!'. Bu maydon bo'sh bo'lishi ham mumkin."),
  reply: z.string().describe("AI assistentning asosiy javobi yoki keyingi savoli."),
  choices: z.array(z.string()).nullable().optional().describe("Agar foydalanuvchiga tanlov taklif qilinsa, shu variantlar ro'yxati."),
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
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
                console.error('Telegram bot token or chat ID is not set in environment variables.');
                return "Serverda Telegram sozlamalari mavjud emas. Foydalanuvchiga bu haqida xabar bering.";
            }

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
- **Do'stona va samimiy:** Rasmiyatchilikdan qoch. Oddiy va tushunarli tilda gaplash.
- **Qisqa va aniq:** Uzoq gapirma. **Bir vaqtning o'zida faqat bitta savol ber.**
- **Suhbatni boshqar:** Mantiqiy ketma-ketlikda savollar ber. Hech qachon bir xil savolni qayta so'rama.
- **Tanishish:** Sen allaqachon salomlashib, o'zingni tanishtirgansan. Buni qaytarma.
- **Javob va Savol Ajratish:** Foydalanuvchining javobiga avval 'acknowledgement' maydonida qisqa tasdiq bildir (masalan, "Tushunarli.", "Yaxshi.", "Ajoyib!"). Keyin 'reply' maydonida yangi savolni ber. Agar bu birinchi xabar bo'lsa, 'acknowledgement' bo'sh bo'lsin.

**SUHBATNING QAT'IY STSENARIYSI:**
Har doim quyidagi ketma-ketlikka amal qil. Agar biror ma'lumot allaqachon mavjud bo'lsa, keyingi bosqichga o't.

1.  **Loyiha nomi:** "Ajoyib! Keling, suhbatimizni loyihangizdan boshlasak. Biznesingiz yoki loyihangiz nomi nima?" (Bunga javob kelganda, "acknowledgement"ga "Rahmat, [loyihaning nomi]!" deb yoz)

2.  **Asosiy maqsad:** "Tushunarli. Endi ayting-chi, biz sizga brending bo'yicha qanday yordam bera olamiz? Maqsadingiz qaysi biriga yaqinroq?" Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Brending nimaligini to'liq tushunmayman, lekin biznesim uchun kerak deb o'ylayman.", "Brendim bor, lekin u yaxshi ishlamayapti, tahlil va maslahat kerak.", "Brending kuchiga ishonaman va biznesimni yangi bosqichga olib chiqmoqchiman."]

3.  **Byudjet:** "Yaxshi. Loyiha uchun ajratmoqchi bo'lgan taxminiy byudjetingiz qancha?" Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Hozircha aniq byudjetim yo'q, asosiysi - natija.", "$500 gacha", "$500 - $1,500", "$1,500 - $3,000", "$3,000 dan yuqori"]

4.  **Joylashuv:** "Qayerdansiz? Bu bizga uchrashuv formatini belgilashda yordam beradi." Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Toshkent", "Farg'ona", "Boshqa viloyat"]

5.  **Ism:** "Deyarli tugatdik. Endi o'zingizni tanishtirsangiz, ismingiz nima?" (Bunga javob kelganda, "acknowledgement"ga "Tanishganimdan xursandman, [Mijozning ismi]!" deb yoz)

6.  **Aloqa ma'lumoti:** "Menejerimiz siz bilan bog'lanishi uchun telefon raqamingizni yozib yuborsangiz."

7.  **Tool'ni ishlatish:** Yuqoridagi BARCHA ma'lumotlar yig'ilgandan keyingina, 'sendLeadToTelegram' tool'ini ishga tushir. Suhbatdan olgan barcha ma'lumotlaringni 'notes' maydoniga yoz.

**MUHIM QOIDALAR:**
- Agar foydalanuvchi ma'lumot berishdan bosh tortsa, "Tushunarli. Qachonki tayyor bo'lsangiz, men shu yerdaman" deb javob ber.
- Hech qachon o'zing narx yoki muddat aytma.
- Agar foydalanuvchi jarayondan chetga chiqib, boshqa savol bersa, uning savoliga javob ber va keyin stsenariy bo'yicha to'xtagan joyingdan davom et. Masalan:
  - "Portfolio", "ishlaringiz", "namunalar" kabi so'zlar bo'lsa, shunday javob ber: "Albatta! Ishlarimiz bilan mana bu havolada tanishishingiz mumkin: https://jonbranding.uz/#portfolio . Tanib-chiqib, suhbatimizni davom ettiramiz."
  - Narx haqida so'rasa, shunday javob ber: "Narxlar loyihaga qarab individual hisoblanadi. To'liqroq ma'lumot uchun menejerimiz sizga aloqaga chiqadi. Suhbatimizni davom ettirsak maylimi?"

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

    const llmResponse = await prompt(promptInput);

    // Genkit 1.x da .toolRequest() va .continue() o'rniga to'g'ridan-to'g'ri tool chaqiruvlari bilan ishlash
    // Bu yerda bizda loop shart emas, chunki prompt tool ishlatish yoki ishlatmaslikni o'zi hal qiladi.
    // Agar tool ishlatilsa, Genkit avtomatik ravishda uni bajaradi va natijani LLMga qaytaradi.
    
    if (llmResponse.toolRequest) {
      // Agar model tool ishlatishni so'rasa, biz uni bajaramiz.
      // Biroq, bizning logikada LLM oxirgi javobni o'zi berishi kerak.
      // Shuning uchun bu yerda toolni alohida chaqirib, natijasini LLMga yuborishimiz kerak.
      const toolCall = llmResponse.toolRequest.toolCalls[0];
      const toolResult = await ai.runTool(toolCall);

      // Tool natijasi bilan promptni davom ettiramiz
      const finalResponse = await llmResponse.continue({
        toolResult: {
          toolResult: {
            tool: toolCall.name,
            callId: toolCall.callId,
            result: toolResult as any,
          },
        },
      });
      return finalResponse.output!;
    }
    
    // Agar tool ishlatilmasa, shunchaki javobni qaytaramiz
    if (llmResponse.output) {
      return llmResponse.output;
    }

    // Agar biror sabab bilan javob bo'lmasa
    return { reply: "Kechirasiz, hozir javob bera olmayman.", choices: null };
  }
);

    