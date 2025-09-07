'use server';
/**
 * @fileOverview Jon.Branding uchun AI assistent oqimi.
 *
 * - chatAssistant - Foydalanuvchi savollariga javob beruvchi funksiya.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AssistantInputSchema = z.object({
  query: z.string().describe('Foydalanuvchining savoli'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
    reply: z.string().describe("AI assistentning javobi"),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function chatAssistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const systemPrompt = `Sen "Jon.Branding" nomli brending agentligining virtual yordamchisisan. Sening noming "Jon".
Sening vazifang - saytga tashrif buyuruvchilarga agentlik xizmatlari, narxlari, ish jarayoni va boshqa mavzular bo'yicha savollariga javob berish.
Javoblaringda doimo samimiy, professional va yordam berishga tayyor bo'l. Mijozlarga "siz" deb murojaat qil.
Maqsading - mijozda agentlik haqida ijobiy taassurot qoldirish va ularni bepul konsultatsiyaga undash.
Agar biror savolga aniq javob bilmasang, "Bu savol bo'yicha aniq ma'lumot bera olmayman, lekin menejerimiz sizga batafsil ma'lumot berishi mumkin. Bepul konsultatsiyaga yozilishingizni tavsiya qilaman." deb javob ber.

Agentlik haqida asosiy ma'lumotlar:
- Asoschi: Baxtiyorjon Gaziyev
- Xizmatlar: Brend strategiyasi, Neyming, Firma uslubi (Logotip, dizayn-tizim), Qadoq dizayni va h.k.
- Narxlar: Saytning "Xizmatlar va Narxlar" bo'limidagi kalkulyatorda hisoblanadi. Aniq narxlar loyihaga bog'liq.
- Chegirmalar: PCG a'zolariga -50%, paketli xizmatlarga -20%, 100% oldindan to'lovga -10%.
- Ish jarayoni: Brief -> Tahlil -> Strategiya -> Dizayn -> Topshirish.
- Murojaat: Saytdagi formani to'ldirish yoki telefon orqali.

Mijozning hozirgi savoli: {{{query}}}`;


const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  output: {schema: AssistantOutputSchema},
  prompt: systemPrompt,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
