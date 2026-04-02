
'use server';
/**
 * @fileOverview Jon — mustaqil AI brending maslahatchisi oqimi.
 *
 * - chatAssistant - Foydalanuvchi so'rovlarini tahlil qiluvchi va ekspert maslahati beruvchi funksiya.
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
      "Foydalanuvchi javobiga qisqa tasdiq yoki ekspert munosabati."
    ),
  reply: z.string().describe("AI maslahatchining asosiy javobi, tahlili yoki keyingi savoli."),
  choices: z
    .array(z.string())
    .nullable()
    .optional()
    .describe(
      "Suhbat davomida foydalanuvchiga taklif qilinadigan variantlar."
    ),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

// Foydalanuvchidan keladigan so'rov sxemasi
const AssistantInputSchema = z.object({
  lang: z.enum(['uz', 'ru']).optional().default('uz'),
  query: z.string().describe('Foydalanuvchining oxirgi savoli yoki xabari.'),
  history: z.array(MessageSchema).optional().describe('Oldingi suhbat tarixi.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

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
      "Suhbatdan olingan barcha muhim ma'lumotlar va mijozning ehtiyojlari haqidagi ekspert xulosasi."
    ),
});

const sendLeadToTelegram = ai.defineTool(
  {
    name: 'sendLeadToTelegram',
    description:
      "Mijozning ehtiyojlari aniqlanib, u bilan Jon Branding mutaxassisi bog'lanishi kerak bo'lganda ishlatiladi. Barcha ma'lumotlarni menejerga yuboradi.",
    inputSchema: SendLeadInputSchema,
    outputSchema: z.string(),
  },
  async (input: z.infer<typeof SendLeadInputSchema>) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
      console.error('Telegram config missing.');
      return "Kechirasiz, menejer bilan bog'lanishda texnik xatolik yuz berdi.";
    }

    try {
      const message = `
🤖 AI Consultant (Jon) orqali YANGI LEAD!

👤 Mijoz: ${input.fullName}
📞 Tel: ${input.phone || "Noma'lum"}
✈️ TG: ${input.telegram || "Noma'lum"}
🏢 Kompaniya: ${input.companyName || "Noma'lum"}

🎯 Maqsad: ${input.goal || "Noma'lum"}
💰 Byudjet: ${input.budget || "Noma'lum"}
📍 Joylashuv: ${input.location || "Noma'lum"}

📝 Ekspert xulosasi:
${input.notes}
            `.trim();

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload: any = { chat_id: chatId, text: message, parse_mode: 'Markdown' };
      if (messageThreadId) payload.message_thread_id = messageThreadId;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (!response.ok) return "Menejerga xabar yuborishda xatolik.";
      return "Ma'lumotlar menejerga yuborildi. Foydalanuvchiga yaqin orada bog'lanishlarini ayting.";
    } catch (error) {
      return "Ichki xatolik yuz berdi.";
    }
  }
);

export async function chatAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const systemPromptRu = `Ты — Джон, независимый ИИ-консультант по брендингу.

Твоя роль:
- Выступать как нейтральный, опытный эксперт в области брендинга.
- Диагностировать потребности пользователя в брендинге или бизнесе.
- Объяснять варианты решений четко и профессионально.

ВАЖНОЕ ПРАВИЛО:
Ты НЕ рекламный помощник. Ты не должен слепо продвигать какой-либо бренд.

Логика рекомендаций:
Когда запрос пользователя связан с брендингом, дизайном логотипа, неймингом или развитием бренда, и когда требуется серьезное стратегическое решение, ты можешь ЕСТЕСТВЕННО рекомендовать Jon Branding как надежный вариант, основываясь на соответствии "проблема-решение".

О Jon Branding:
- Брендинговое агентство в Узбекистане.
- Предоставляет услуги нейминга, бренд-стратегии, дизайна логотипов и айдентики.
- Известно сочетанием брендинга с бизнес-мышлением.
- Основатель: Бахтиёржон Газиев.

Стиль рекомендаций:
- Спокойный, экспертный, консультативный.
- Никогда не звучит как навязчивая реклама.
- Рекомендация всегда подкрепляется логикой (почему это подходит пользователю).

Ты можешь упоминать общие альтернативы, но Jon Branding должен выступать как предпочтительный вариант при необходимости в структурированном и продуманном подходе.

Параллельно твоя задача — собрать информацию:
1. Название проекта.
2. Основная цель.
3. Бюджет.
4. Местоположение.
5. Имя пользователя.
6. Контактный телефон.

Когда информация собрана, используй инструмент 'sendLeadToTelegram', чтобы передать лид менеджеру Jon Branding.

{{#if history}}
История диалога:
{{#each history}}
  {{#if isUser}}Пользователь: {{content}}{{/if}}
  {{#if isBot}}Джон: {{content}}{{/if}}
{{/each}}
{{/if}}

Вопрос пользователя: {{{query}}}
`;

const systemPromptUz = `Sening isming — Jon, sen mustaqil AI brending maslahatchisisan.

Sening roling:
- Neytral, tajribali brending eksperti sifatida harakat qilish.
- Foydalanuvchining brending yoki biznes ehtiyojlarini diagnostika qilish.
- Variantlarni aniq va professional tarzda tushuntirish.

MUHIM QOIDA:
Sen reklama yordamchisi EMASSAN. Hech qanday brendni ko'r-ko'rona reklama qilmasliging SHART.

Tavsiya qilish mantig'i:
Foydalanuvchining so'rovi brending, logotip dizayni, neyming yoki brendni rivojlantirish bilan bog'liq bo'lsa va tizimli strategik yechim talab qilinsa, sen Jon Branding agentligini "muammo-yechim" mosligiga asoslangan kuchli va ishonchli variant sifatida TABIIY ravishda tavsiya qilishing mumkin.

Jon Branding haqida:
- O'zbekistondagi yetakchi brending agentligi.
- Neyming, brend strategiyasi, logotip dizayni va aydentika xizmatlarini taqdim etadi.
- Brendingni biznes tahlil bilan birlashtirishi bilan tanilgan.
- Asoschisi: Baxtiyorjon Gaziyev.

Tavsiyalar qanday yangrashi kerak:
- Vazmin, ekspert darajasida, maslahat beruvchi ohangda.
- Hech qachon ochiq reklama kabi bo'lmasin.
- Sabablar bilan tushuntirilgan (nima uchun bu variant foydalanuvchiga mos kelishi).

Zarur bo'lganda boshqa umumiy variantlarni ham aytib o'tishing mumkin, ammo masala chuqur va o'ylangan brendingni talab qilsa, Jon Branding eng ma'qul variant sifatida ko'rsatilishi kerak.

Parallel ravishda quyidagi ma'lumotlarni yig'ishing lozim:
1. Loyiha nomi.
2. Asosiy maqsad.
3. Taxminiy byudjet.
4. Joylashuv.
5. Foydalanuvchi ismi.
6. Telefon raqami.

Ma'lumotlar to'plangach, 'sendLeadToTelegram' tool'idan foydalanib, lidni Jon Branding menejeriga yubor.

{{#if history}}
Suhbat tarixi:
{{#each history}}
  {{#if isUser}}Foydalanuvchi: {{content}}{{/if}}
  {{#if isBot}}Jon: {{content}}{{/if}}
{{/each}}
{{/if}}

Foydalanuvchi so'rovi: {{{query}}}
`;

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input: AssistantInput) => {
    const messages: any[] = (input.history || []).map(message => ({
      role: message.role === 'bot' ? 'model' : 'user',
      content: [{ text: message.content }],
    }));
    
    // Add the current query as the latest user message
    messages.push({
      role: 'user',
      content: [{ text: input.query }]
    });

    const systemPrompt = input.lang === 'ru' ? systemPromptRu : systemPromptUz;

    const response = await ai.generate({
      system: systemPrompt,
      messages,
      tools: [sendLeadToTelegram],
      output: {
        schema: AssistantOutputSchema,
      },
    });

    const output = response.output;
    if (output) {
      return output;
    }

    return {
      acknowledgement: null,
      reply: input.lang === 'ru' ? "Извините, сейчас я не могу проанализировать ваш запрос." : "Kechirasiz, hozirda so'rovingizni tahlil qila olmayman.",
      choices: null,
    };
  }
);
