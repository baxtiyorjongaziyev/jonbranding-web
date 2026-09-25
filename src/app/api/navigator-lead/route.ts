import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { getServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';
import {
  ANSWER_OPTIONS,
  DESIRED_RESULTS,
  PAIN_POINTS,
  QUESTIONS,
  scoreNavigatorAnswers,
} from '@/lib/navigator-data';

const painIds = PAIN_POINTS.map((p) => p.id) as [string, ...string[]];
const resultIds = DESIRED_RESULTS.map((r) => r.id) as [string, ...string[]];
const questionIds = new Set(QUESTIONS.map((q) => q.id));
const answerValues = new Set(ANSWER_OPTIONS.map((o) => o.value));

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(40),
  companyName: z.string().trim().max(150).optional(),
  industry: z.string().trim().max(150).optional(),
  consent: z.literal(true),
  selectedPains: z.array(z.enum(painIds)).max(3),
  desiredResult: z.enum(resultIds),
  answers: z
    .record(z.string(), z.string())
    .refine(
      (answers) =>
        Object.entries(answers).every(([id, value]) => questionIds.has(id) && answerValues.has(value)),
      'Unknown question or answer',
    ),
});

/**
 * Navigator diagnostikasining to'liq javoblarini `navigator_leads` jadvaliga yozadi.
 * Brauzerdagi anon kalit o'rniga service-role ishlatiladi; ball serverda qayta
 * hisoblanadi. Lidning o'zi (Telegram/amoCRM) `/api/submit-form` orqali ketadi.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`navigator-lead:${ip}`, 5, 60_000))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    logger.warn('[navigator-lead] SUPABASE_SERVICE_ROLE_KEY yo\'q — diagnostika saqlanmadi');
    return NextResponse.json({ stored: false }, { status: 202 });
  }

  const data = parsed.data;
  const { error } = await supabase.from('navigator_leads').insert({
    full_name: data.fullName,
    company_name: data.companyName || null,
    industry: data.industry || null,
    contact: data.phone,
    consent: true,
    selected_pains: data.selectedPains,
    desired_results: [data.desiredResult],
    diagnostic_answers: data.answers,
    total_score: scoreNavigatorAnswers(data.answers),
    source: 'TezNatija_Diagnostic',
  });

  if (error) {
    logger.error('[navigator-lead] insert failed', { message: error.message });
    return NextResponse.json({ stored: false }, { status: 500 });
  }

  return NextResponse.json({ stored: true });
}
