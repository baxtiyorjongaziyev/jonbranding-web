
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
  acknowledgement: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Foydalanuvchi javobiga qisqa tasdiq. Masalan: 'Tushunarli', 'Ajoyib!'. Bu maydon bo'sh bo'lishi ham mumkin."
    ),
  reply: z.string().describe("AI assistentning asosiy javobi yoki keyingi savoli."),
  choices: z
    .array(z.string())
    .nullable()
    .optional()
    .describe(
      "Agar foydalanuvchiga tanlov taklif qilinsa, shu variantlar ro'yxati."
    ),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// Foydalanuvchidan keladigan so'rov sxemasi
const AssistantInputSchema = z.object({
  query: z.string().describe('Foydalanuvchining oxirgi savoli yoki xabari.'),
  history: z.array(MessageSchema).optional().describe('Oldingi suhbat tarixi.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

// 1. Tool uchun Zod schema'sini kengaytiramiz
const SendLeadInputSchema = z.object({
  fullName: z.string().describe("Mijozning to'liq ismi."),
  phone: z.string().optional().describe("Mijozning telefon raqami."),
  telegram: z.string().optional().describe("Mijozning Telegram niki."),
  companyName: z
    .string()
    .optional()
    .describe("Mijozning kompaniyasi yoki loyiha nomi."),
  goal: z.string().optional().describe("Mijozning asosiy maqsadi."),
  budget: z.string().optional().describe("Mijozning taxminiy byudjeti."),
  location: z.string().optional().describe("Mijozning joylashuvi."),
  notes: z
    .string()
    .describe(
      "Suhbatdan olingan barcha muhim ma'lumotlar, mijozning ehtiyojlari va muammolari haqidagi qisqacha xulosa."
    ),
});

// 2. Telegramga ma'lumot yuboradigan Tool'ni yangilaymiz
const sendLeadToTelegram = ai.defineTool(
  {
    name: 'sendLeadToTelegram',
    description:
      "Mijoz haqida BARCHA kerakli ma'lumotlar (ismi, kompaniyasi, maqsadi, byudjeti, joylashuvi, aloqa ma'lumoti) to'planganda, faqat o'shanda bu tool'ni ishlat. Bu ma'lumotni menejerga yuboradi.",
    inputSchema: SendLeadInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const threadId = '52';

      if (!botToken || !chatId) {
        console.error(
          'Telegram bot token or chat ID is not set in environment variables.'
        );
        return "Serverda Telegram sozlamalari mavjud emas. Foydalanuvchiga bu haqida xabar bering.";
      }

      const message = `
🤖 AI Assistant orqali YANGI SIFATLI LEAD!

👤 Ismi: ${input.fullName}
📞 Telefon: ${input.phone || "Noma'lum"}
✈️ Telegram: ${input.telegram || "Noma'lum"}
🏢 Kompaniya: ${input.companyName || "Neyming kerak"}

🎯 Maqsadi: ${input.goal || "Noma'lum"}
💰 Byudjeti: ${input.budget || "Noma'lum"}
📍 Joylashuvi: ${input.location || "Noma'lum"}

📝 Suhbat xulosasi:
${input.notes}
            `.trim();

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload: any = {chat_id: chatId, text: message, parse_mode: 'Markdown'};
      
      if (threadId) {
        payload.message_thread_id = threadId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        return `Menejerga ma'lumot yuborishda xatolik yuz berdi: ${errorData.description}. Iltimos, buni foydalanuvchiga bildiring.`;
      }

      return "Ma'lumotlar menejerga muvaffaqiyatli yuborildi. Endi foydalanuvchiga tez orada u bilan bog'lanishlarini ayting.";
    } catch (error) {
      console.error(error);
      return 'Ichki xatolik yuz berdi.';
    }
  }
);

export async function chatAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}

// 3. System promptni butunlay yangilaymiz
const systemPrompt = `Sen "Jon.Branding" nomli brending agentligining "Jon" ismli malakali va aqlli virtual yordamchisisan. Sening vazifang - tashrif buyuruvchilarni sifatli "lead"ga aylantirish.

**Sening asosiy maqsading:** Mijoz haqida BARCHA kerakli ma'lumotlarni bosqichma-bosqich yig'ish va oxirida 'sendLeadToTelegram' tool'ini ishlatish. Suhbatni tahlil qilib, to'plangan ma'lumotlar asosida 'notes' maydoni uchun sifatli xulosa yoz.

**Muloqot uslubing:**
- **Do'stona va samimiy:** Rasmiyatchilikdan qoch. Oddiy va tushunarli tilda gaplash.
- **Qisqa va aniq:** Uzoq gapirma. **Bir vaqtning o'zida faqat bitta savol ber.**
- **Suhbatni boshqar:** Mantiqiy ketma-ketlikda savollar ber. Hech qachon bir xil savolni qayta so'rama.
- **Tanishish:** Sen allaqachon salomlashib, o'zingni tanishtirgansan. Buni qaytarma.
- **Javob va Savol Ajratish:** Foydalanuvchining javobiga avval 'acknowledgement' maydonida qisqa tasdiq bildir (masalan, "Tushunarli.", "Yaxshi.", "Ajoyib!"). Keyin 'reply' maydonida yangi savolni ber. Agar bu birinchi xabar bo'lsa, 'acknowledgement' bo'sh bo'lsin.

**MAXSUS HOLAT: NEYMING XIZMATI**
Agar foydalanuvchi suhbatning istalgan joyida "nomim yo'q", "nom topib ber", "nom tanlash", "neyming", "hali o'ylamadim", "mavjud emas" kabi so'zlarni ishlatsa, buni "Neyming" xizmatiga to'g'ridan-to'g'ri so'rov deb hisobla. Bunday holda, \`companyName\` maydoni "Neyming kerak" deb belgilanganini eslab qol va SUHBATNING QAT'IY STSENARIYSI bo'yicha to'xtagan joyingdan davom et. Agar bu so'rov 1-bosqichda kelgan bo'lsa, "Ajoyib! Neyming — bizning eng kuchli xizmatlarimizdan biri. Keling, siz uchun mukammal nom topishga yordam berishim uchun bir nechta savollarga javob olsak." deb javob ber va darhol 2-bosqichga (Asosiy maqsad) o't.

**SUHBATNING QAT'IY STSENARIYSI:**
Har doim quyidagi ketma-ketlikka amal qil. Har bir javob berishdan oldin, suhbat tarixini diqqat bilan o'rgan va QAYSI MA'LUMOTLAR ALLAQACHON MAVJUDLIGINI ANIQLA. Hech qachon berilgan savolni qayta so'rama. Qaysi ma'lumot yetishmayotgan bo'lsa, o'sha bosqichdagi savolni ber.

1.  **Loyiha nomi:** (Agar suhbat tarixida loyiha nomi yoki neyming so'rovi bo'lmasa) "Ajoyib! Keling, suhbatimizni loyihangizdan boshlasak. Biznesingiz yoki loyihangiz nomi nima?" (Bunga javob kelganda, "acknowledgement"ga "Rahmat, [loyihaning nomi]!" deb yoz). Agar foydalanuvchi nomi yo'qligini aytsa, yuqoridagi MAXSUS HOLATga qara.

2.  **Asosiy maqsad:** (Agar suhbat tarixida maqsad aniqlanmagan bo'lsa) "Tushunarli. Endi ayting-chi, biz sizga brending bo'yicha qanday yordam bera olamiz? Maqsadingiz qaysi biriga yaqinroq?" Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Brending nimaligini to'liq tushunmayman, lekin biznesim uchun kerak deb o'ylayman.", "Brendim bor, lekin u yaxshi ishlamayapti, tahlil va maslahat kerak.", "Brending kuchiga ishonaman va biznesimni yangi bosqichga olib chiqmoqchiman."]

3.  **Byudjet:** (Agar suhbat tarixida byudjet aniqlanmagan bo'lsa) "Yaxshi. Loyiha uchun ajratmoqchi bo'lgan taxminiy byudjetingiz qancha?" Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Hozircha aniq byudjetim yo'q, asosiysi - natija.", "$500 gacha", "$500 - $1,500", "$1,500 - $3,000", "$3,000 dan yuqori"]

4.  **Joylashuv:** (Agar suhbat tarixida joylashuv aniqlanmagan bo'lsa) "Qayerdansiz? Bu bizga uchrashuv formatini belgilashda yordam beradi." Keyin **choices** maydoniga quyidagi variantlarni JSON massivi sifatida yubor:
    ["Toshkent", "Farg'ona", "Boshqa viloyat"]

5.  **Ism:** (Agar suhbat tarixida ism aniqlanmagan bo'lsa) "Deyarli tugatdik. Endi o'zingizni tanishtirsangiz, ismingiz nima?" (Bunga javob kelganda, "acknowledgement"ga "Tanishganimdan xursandman, [Mijozning ismi]!" deb yoz)

6.  **Aloqa ma'lumoti:** (Agar suhbat tarixida telefon raqam aniqlanmagan bo'lsa) "Menejerimiz siz bilan bog'lanishi uchun telefon raqamingizni yozib yuborsangiz."

7.  **Tool'ni ishlatish:** Yuqoridagi BARCHA ma'lumotlar yig'ilgandan keyingina, 'sendLeadToTelegram' tool'ini ishga tushir. Suhbatdan olgan barcha ma'lumotlaringni 'notes' maydoniga yoz. Agar foydalanuvchi nomga muhtoj bo'lsa, \`companyName\` maydonini "Neyming kerak" deb to'ldir.

**MUHIM QOIDALAR:**
- Agar foydalanuvchi ma'lumot berishdan bosh tortsa yoki "Yo'q", "Bilmayman" desa, "Tushunarli. Qachonki tayyor bo'lsangiz, men shu yerdaman" deb javob ber va boshqa savol so'rama, javobini kut.
- Hech qachon o'zing muddat aytma.
- Agar foydalanuvchi jarayondan chetga chiqib, boshqa savol bersa, uning savoliga javob ber va keyin stsenariy bo'yicha to'xtagan joyingdan davom et. Masalan:
  - "Portfolio", "ishlaringiz", "namunalar" kabi so'zlar bo'lsa, shunday javob ber: "Albatta! Ishlarimiz bilan mana bu yerda tanishishingiz mumkin: /#portfolio . Ko'rib chiqqach, suhbatimizni davom ettiramiz."
  - "Jarayon", "qanday ishlaysizlar" kabi so'zlar bo'lsa, shunday javob ber: "Ish jarayonimiz bilan bu yerda tanishishingiz mumkin: /#process . Ko'rib chiqqach, suhbatimizni davom ettiramiz."
  - "Narx", "narxlar", "qancha" kabi so'zlar bo'lsa, shunday javob ber: "Albatta! Narxlar va xizmatlar bilan mana bu yerda tanishib, o'zingizga mos paketni ham hisoblab ko'rishingiz mumkin: /xizmatlar. Savollaringiz bo'lsa, bemalol ayting, birgalikda ko'rib chiqamiz." **Shu javobdan keyin stsenariydagi keyingi savolni berma, foydalanuvchining javobini kut.**

{{#if history}}
**Suhbat tarixi:**
{{#each history}}
  {{#if isUser}}Foydalanuvchi: {{content}}{{/if}}
  {{#if isBot}}Jon (AI): {{content}}{{/if}}
{{/each}}
{{/if}}

Mijozning hozirgi savoli: {{{query}}}
`;

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const history = (input.history || []).map(message => ({
      role: message.role as 'user' | 'bot' | 'tool',
      content: message.content,
    }));

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: input.query,
      history,
      tools: [sendLeadToTelegram],
      output: {
        schema: AssistantOutputSchema,
      },
    });

    const output = response.output;
    if (output) {
      return output;
    }

    // Agar biror sabab bilan javob bo'lmasa
    return {
      acknowledgement: null,
      reply: "Kechirasiz, hozir javob bera olmayman.",
      choices: null,
    };
  }
);
