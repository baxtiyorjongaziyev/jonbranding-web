import { z } from 'zod';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from './lead-contact';
import { TOTAL_QUESTIONS } from './diagnostics';

const answerKeySchema = z.enum(['A', 'B', 'C']);

/**
 * Aloqa maydoni bitta: telefon raqami YOKI Telegram username.
 * Ikkalasi ham normalizatsiya qilinadi, keyin qaysi biri to'g'ri kelsa o'sha qabul qilinadi.
 */
const contactSchema = z
  .string()
  .trim()
  .min(3, 'Aloqa maʼlumoti juda qisqa')
  .max(120)
  .refine(
    (value) => isValidPhone(normalizePhone(value)) || isValidTelegramUsername(normalizeTelegramUsername(value)),
    'Telefon raqami yoki Telegram username notoʻgʻri'
  );

export const diagnosticSubmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Ism juda qisqa').max(100),
  companyName: z.string().trim().max(120).optional().or(z.literal('')),
  industry: z.string().trim().max(120).optional().or(z.literal('')),
  contact: contactSchema,
  consent: z.literal(true, { message: 'Rozilik majburiy' }),
  answers: z.array(answerKeySchema).length(TOTAL_QUESTIONS, 'Barcha savollarga javob bering'),
  source: z.string().trim().max(80).optional(),
  pageUrl: z.string().trim().max(500).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  eventId: z.string().trim().max(120).optional(),
  gaClientId: z.string().trim().max(120).optional(),
});

export type DiagnosticSubmission = z.infer<typeof diagnosticSubmissionSchema>;

/** Aloqa satrini telefon/telegram sifatida ajratadi. */
export function splitContact(contact: string) {
  const phone = normalizePhone(contact);
  if (isValidPhone(phone)) return { phone, telegram: '' };

  const telegram = normalizeTelegramUsername(contact);
  if (isValidTelegramUsername(telegram)) return { phone: '', telegram };

  return { phone: '', telegram: '' };
}
