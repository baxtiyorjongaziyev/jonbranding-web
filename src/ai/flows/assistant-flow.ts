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

const AssistantInputSchema = z.object({
  query: z.string().describe('Foydalanuvchining oxirgi savoli yoki xabari.'),
  history: z.array(MessageSchema).optional().describe("Oldingi suhbat tarixi."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  reply: z.string().describe("AI assistentning javobi"),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


// 1. Tool uchun Zod schema'sini yaratamiz
const SendLeadInputSchema = z.object({
    fullName: z.string().describe("Mijozning to'liq ismi."),
    phone: z.string().optional().describe("Mijozning telefon raqami."),
    telegram: z.string().optional().describe("Mijozning Telegram niki."),
    companyName: z.string().optional().describe("Mijozning kompaniyasi yoki loyiha nomi."),
    notes: z.string().describe("Suhbatdan olingan barcha muhim ma'lumotlar, mijozning ehtiyojlari va muammolari haqidagi qisqacha xulosa."),
});

// 2. Telegramga ma'lumot yuboradigan Tool'ni aniqlaymiz
const sendLeadToTelegram = ai.defineTool(
    {
        name: 'sendLeadToTelegram',
        description: "Mijoz haqida yetarlicha ma'lumot to'planganda (ismi, kompaniyasi, ehtiyoji, aloqa ma'lumoti) bu tool'ni ishlat. Bu ma'lumotni menejerga yuboradi.",
        inputSchema: SendLeadInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
       try {
            const botToken = '7738413085:AAE_CYNnbpyoW5KiheUTJOPBmz_jHLVWgWc';
            const chatId = '-1002566480563';

            const message = `
🤖 AI Assistant orqali yangi LEAD!

👤 Ismi: ${input.fullName}
📞 Telefon: ${input.phone || "Noma'lum"}
✈️ Telegram: ${input.telegram || "Noma'lum"}
🏢 Kompaniya: ${input.companyName || "Noma'lum"}

📝 Suhbat xulosasi:
${input.notes}
            `.trim();

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const payload = { chat_id: chatId, text: message };
            
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

// 3. System promptni yangilaymiz
const systemPrompt = `Sen "Jon.Branding" nomli brending agentligining "Jon" ismli virtual yordamchisisan. Sen allaqachon salomlashib, o'zingni tanishtirding. Endi sening vazifang - tashrif buyuruvchilar bilan qisqa savol-javoblar orqali muloqot o'rnatib, ularni sifatli "lead" (potensial mijoz) holatiga olib kelish.

**Sening asosiy maqsading:** Mijoz haqida asosiy ma'lumotlarni (ismi, kompaniyasi, ehtiyojlari, aloqa ma'lumotlari) aniqlash va bu ma'lumotlarni menejerga yuborish uchun 'sendLeadToTelegram' tool'ini ishlatish.

**Muloqot uslubing:**
- **Qisqa va aniq:** Uzoq paragraflar yozma. **Bir vaqtning o'zida faqat bitta savol ber.**
- **Suhbatni boshqar:** Suhbatdan kelib chiqib, mantiqiy savollar ber. Javobni kutib o'tirma, suhbatni o'zing rivojlantir.
- **Ma'lumot yig'uvchi:** Asosiy maqsading - ma'lumot to'plash.
- **Takrorlama:** Hech qachon bir xil savolni qayta-qayta so'rama va "Assalomu alaykum, men Jon..." deb qayta tanishtirma.

**Suhbat mantig'i (QAT'IY AMAL QIL):**
1.  **Loyiha nomini so'ra:** Suhbatni darhol "Biznesingiz yoki loyihangiz nomi nima?" deb boshla. Agar allaqachon so'ragan bo'lsang, bu qadamni o'tkazib yubor.
2.  **Maqsadni aniqla:** Keyingi savoling "Brending sohasida qanday maqsadingiz yoki muammoingiz bor?" bo'lsin. (Masalan, "yangi logotip kerak", "sotuvlar tushib ketyapti"). Agar allaqachon so'ragan bo'lsang, bu qadamni o'tkazib yubor.
3.  **Ismini so'ra:** Keyin, "Tushunarli. O'zingizni tanishtirsangiz, ismingiz nima?" deb savol ber. Agar allaqachon so'ragan bo'lsang, bu qadamni o'tkazib yubor.
4.  **Aloqa ma'lumotini so'ra:** Ismini bilgandan so'ng, "Xursandman, [Mijozning ismi]. Endi menejerimiz siz bilan bog'lanishi uchun telefon raqamingizni yoki telegram linkingizni yozib yuboring" deb so'ra.
5.  **Tool'ni ishlatish:** Mijoz haqida yetarlicha ma'lumot (ismi, ehtiyoji va aloqa ma'lumoti) to'plaganingdan so'ng, darhol 'sendLeadToTelegram' tool'ini ishga tushir. Suhbatdan olgan barcha ma'lumotlaringni 'notes' maydoniga yoz.
6.  **Yakunlash:** Tool'dan "muvaffaqiyatli yuborildi" javobini olganingdan so'ng, foydalanuvchiga "Rahmat! Ma'lumotlaringizni menejerimizga yubordim. Tez orada siz bilan bog'lanishadi!" deb javob ber va suhbatni yakunla.

**Muhim qoidalar:**
- **Narxlar haqida savol berilsa, ALOHIDA-ALOHIDA SO'RA:** Agar foydalanuvchi narxlar haqida so'rasa va sen uning ismini hali bilmasang, "Bu haqda menejerimiz sizga batafsil ma'lumot beradi. Avval ismingizni bilsam bo'ladimi?" deb javob ber. Agar ismini bilsang, "Rahmat, [Mijozning ismi]. Endi telefon raqamingizni yozib yuboring, menejerimiz bog'lanib narxlar haqida to'liq ma'lumot beradi" deb so'ra. Hech qachon ism va telefonni birga so'rama.
- Hech qachon o'zing narx yoki muddat aytma.
- Agar foydalanuvchi ma'lumot berishdan bosh tortsa, "Tushunarli. Qachonki tayyor bo'lsangiz, men shu yerdaman" deb javob ber.

{{#if history}}
**Suhbat tarixi:**
{{#each history}}
  {{#if isUser}}Foydalanuvchi: {{content}}{{/if}}
  {{#if isBot}}Jon (AI): {{content}}{{/if}}
{{/each}}
{{/if}}

Mijozning hozirgi savoli: {{{query}}}`;


const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
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
      if (llmResponse.text) {
        return { reply: llmResponse.text };
      }

      const toolRequest = llmResponse.toolRequest();
      if (!toolRequest || !toolRequest.toolCalls.length) {
        // Should not happen, but as a fallback
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
