import { z } from 'zod';
import { validIntakeName, intakePhone, intakeTelegram } from '@/lib/intake-validation';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from '@/lib/lead-contact';

const optionalPhoneSchema = z.preprocess((value) => {
  const raw = String(value ?? '').trim();
  return raw ? normalizePhone(raw) : undefined;
}, z.string().refine(isValidPhone, 'Phone must be in international format').optional());

const optionalTelegramSchema = z.preprocess((value) => {
  const raw = String(value ?? '').trim();
  return raw ? normalizeTelegramUsername(raw) : undefined;
}, z.string().refine(isValidTelegramUsername, 'Invalid Telegram username').optional());

export const submitFormSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Name is too short').max(100).refine(validIntakeName, 'Invalid name'),
    phone: optionalPhoneSchema,
    telegram: optionalTelegramSchema,
    role: z.string().max(200).optional(),
    revenue: z.string().max(200).optional(),
    ambition: z.string().max(500).optional(),
    pain: z.string().max(500).optional(),
    budget: z.string().max(100).optional(),
    source: z.string().max(100).optional(),
    lang: z.string().max(10).optional(),
    packageSummary: z.string().max(500).optional(),
    serviceKeys: z.array(z.string()).max(20).optional(),
    totalPrice: z.number().optional(),
    eventId: z.string().max(100).optional(),
    gaClientId: z.string().max(100).optional(),
    pageLocation: z.string().max(500).optional(),
    ctaSource: z.string().max(100).optional(),
    pagePath: z.string().max(300).optional(),
    referrer: z.string().max(500).optional(),
    section: z.string().max(100).optional(),
    offerType: z.string().max(100).optional(),
    ctaLabel: z.string().max(200).optional(),
    utmSource: z.string().max(200).optional(),
    utmMedium: z.string().max(200).optional(),
    utmCampaign: z.string().max(200).optional(),
    utmContent: z.string().max(200).optional(),
    utmTerm: z.string().max(200).optional(),
    /** Mehmon saytga birinchi kirgan sahifa (`src/lib/lead-attribution.ts`). */
    landingPage: z.string().max(300).optional(),
    // Tracking & cookie parametrlari
    fbp: z.string().max(200).optional(),
    fbc: z.string().max(200).optional(),
    // Bot himoyasi. Ikkalasi ham CRMga yuborilmaydi, faqat tekshiruv uchun.
    companyWebsite: z.string().optional(),
    turnstileToken: z.string().optional(),
    promoCode: z.string().max(40).optional(),
  })
  .superRefine((data, context) => {
    if (data.phone && !intakePhone(data.phone)) context.addIssue({ code: 'custom', message: 'Invalid phone', path: ['phone'] });
    if (data.telegram && !intakeTelegram(data.telegram)) context.addIssue({ code: 'custom', message: 'Invalid Telegram username', path: ['telegram'] });
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

export type SubmitFormData = z.infer<typeof submitFormSchema>;
