import { z } from 'zod';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from './lead-contact';

const optionalPhoneSchema = z.preprocess((value) => {
  const raw = String(value ?? '').trim();
  return raw ? normalizePhone(raw) : undefined;
}, z.string().refine(isValidPhone, 'Phone must be in international format').optional());

const optionalTelegramSchema = z.preprocess((value) => {
  const raw = String(value ?? '').trim();
  return raw ? normalizeTelegramUsername(raw) : undefined;
}, z.string().refine(isValidTelegramUsername, 'Invalid Telegram username').optional());

export const leadFormSchema = z.object({
  fullName: z.string().min(2, 'Name is too short').max(100),
  phone: optionalPhoneSchema,
  telegram: optionalTelegramSchema,
  role: z.string().optional(),
  revenue: z.string().optional(),
  ambition: z.string().optional(),
  pain: z.string().optional(),
  budget: z.string().optional(),
  source: z.string().optional(),
  lang: z.string().optional(),
  packageSummary: z.string().optional(),
  totalPrice: z.number().optional(),
  eventId: z.string().optional(),
  gaClientId: z.string().optional(),
  pageLocation: z.string().optional(),
  ctaSource: z.string().optional(),
}).superRefine((data, context) => {
  if (!data.phone && !data.telegram) {
    context.addIssue({
      code: 'custom',
      message: 'Either phone or telegram is required',
      path: ['phone'],
    });
  }

  if (data.source === 'at_modal' && !data.phone) {
    context.addIssue({
      code: 'custom',
      message: 'Phone is required for this form',
      path: ['phone'],
    });
  }
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
