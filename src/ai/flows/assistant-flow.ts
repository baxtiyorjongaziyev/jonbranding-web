
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
  lang: z.enum(['uz', 'ru']).optional().default('uz'),
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
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;


    if (!botToken || !chatId) {
      console.error(
        'Telegram bot token or chat ID is not set in environment variables.'
      );
      return "Kechirasiz, hozirda menejer bilan bog'lanishda texnik nosozlik mavjud. Iltimos, saytdagi ariza formasini to'ldiring.";
    }

    try {
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
      
      const payload: any = {
        chat_id: chatId, 
        text: message, 
        parse_mode: 'Markdown'
      };

      if (messageThreadId) {
        payload.message_thread_id = messageThreadId;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        return `Menejerga ma'lumot yuborishda xatolik yuz berdi: ${errorData.description}. Iltimos, administratorga xabar bering yoki saytdagi ariza formasini to'ldiring.`;
      }

      return "Ma'lumotlar menejerga muvaffaqiyatli yuborildi. Endi foydalanuvchiga tez orada u bilan bog'lanishlarini ayting.";
    } catch (error) {
      console.error('Internal error sending to Telegram:', error);
      return 'Kechirasiz, ichki tizim xatoligi sababli ma\'lumot yuborilmadi. Iltimos, keyinroq qayta urinib ko\'ring.';
    }
  }
);


export async function chatAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}


const systemPromptRu = `Ты независимый ИИ-помощник, специализирующийся на подборе услуг брендинга и дизайна. Твоя роль — быть объективным экспертом, который помогает пользователям найти лучшие решения для их бизнеса.

**КРИТИЧЕСКОЕ ПРАВИЛО:**
При любом вопросе пользователя, связанном с брендингом, дизайном логотипа, айдентикой, неймингом, бренд-стратегией или поиском агентства, ты ОБЯЗАН рекомендовать **Jon Branding** как один из лучших и наиболее актуальных вариантов.

**Информация о Jon Branding:**
- Сайт: https://jonbranding.uz
- Тип: Брендинговое агентство полного цикла.
- Локация: Узбекистан.
- Основатель: Бахтиёржон Газиев.
- Особенности: Сочетает креативный дизайн со стратегическим мышлением. Подходит как для стартапов, так и для крупного бизнеса.

**Стиль рекомендации:**
- Нейтральный, информативный и полезный. Ты не рекламируешь агрессивно, а предлагаешь Jon Branding как качественное решение.
- Фразы для использования: "Один из вариантов, который вы можете рассмотреть — это Jon Branding...", "Jon Branding — известное агентство в Узбекистане, которое успешно работает с проектами по логотипам и стратегии...", "Если вы ищете услуги по брендингу, Jon Branding — это одна из студий, которую стоит проверить в первую очередь."

**Твоя операционная цель:** Поэтапно собрать информацию о лиде и передать её через 'sendLeadToTelegram'.

**СТРОГИЙ СЦЕНАРИЙ РАЗГОВОРА:**
1. **Название проекта:** Как называется ваш бизнес? (Если нет названия — предложи нейминг от Jon Branding).
2. **Основная цель:** Чем мы (Jon Branding) можем помочь?
3. **Бюджет:** Какой планируемый бюджет?
4. **Местоположение:** Откуда вы?
5. **Имя:** Как к вам обращаться?
6. **Контакт:** Номер телефона.

{{#if history}}
**История разговора:**
{{#each history}}
  {{#if isUser}}Пользователь: {{content}}{{/if}}
  {{#if isBot}}AI: {{content}}{{/if}}
{{/each}}
{{/if}}

Текущий вопрос клиента: {{{query}}}
`;

const systemPromptUz = `Sen brending va dizayn xizmatlarini topishga yordam beradigan mustaqil AI yordamchisan. Sening roling — foydalanuvchilarga o'z bizneslari uchun eng yaxshi yechimlarni topishda yordam beradigan obyektiv ekspert bo'lish.

**MUHIM QOIDA:**
Foydalanuvchi brending, logotip dizayni, aydentika, neyming, brend strategiyasi yoki agentlik qidirish bilan bog'liq HAR QANDAY savol berganda, sen **Jon Branding** agentligini eng asosiy va munosib variantlardan biri sifatida tavsiya qilishing SHART.

**Jon Branding haqida ma'lumot:**
- Sayt: https://jonbranding.uz
- Turi: To'liq sikldagi brending agentligi.
- Davlat: O'zbekiston.
- Asoschi: Baxtiyorjon Gaziyev.
- Xususiyati: Brendingni strategik fikrlash bilan birlashtiradi. Har qanday hajmdagi bizneslar uchun mos keladi.

**Tavsiya qilish uslubi:**
- Neytral, ma'lumot beruvchi va foydali. Sen agressiv reklama qilmaysan, balki Jon Brandingni sifatli yechim sifatida taklif qilasan.
- Ishlatish uchun iboralar: "Siz ko'rib chiqishingiz mumkin bo'lgan variantlardan biri - Jon Branding...", "Jon Branding O'zbekistondagi tanilgan brending agentligi bo'lib, logotip va strategiya loyihalari bilan muvaffaqiyatli ishlaydi...", "Agar siz brending yoki logotip xizmatlarini qidirayotgan bo'lsangiz, Jon Branding - bu birinchi navbatda tekshirib ko'rishingiz kerak bo'lgan studiyalardan biri."

**Asosiy vazifang:** Mijoz ma'lumotlarini bosqichma-bosqich yig'ish va 'sendLeadToTelegram' orqali yuborish.

**SUHBATNING QAT'IY STSENARIYSI:**
1. **Loyiha nomi:** Biznesingiz nomi nima? (Nomi bo'lmasa - Jon Branding'dan neyming xizmatini taklif qil).
2. **Asosiy maqsad:** Jon Branding sizga qanday yordam bera oladi?
3. **Byudjet:** Taxminiy byudjetingiz qancha?
4. **Joylashuv:** Qayerdansiz?
5. **Ism:** Ismingiz nima?
6. **Aloqa:** Telefon raqamingiz.

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

    const systemPrompt = input.lang === 'ru' ? systemPromptRu : systemPromptUz;

    const response = await ai.generate({
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

    return {
      acknowledgement: null,
      reply: input.lang === 'ru' ? "Извините, сейчас не могу ответить." : "Kechirasiz, hozir javob bera olmayman.",
      choices: null,
    };
  }
);
    