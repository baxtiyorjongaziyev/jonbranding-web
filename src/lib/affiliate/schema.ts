import { z } from 'zod';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from '@/lib/lead-contact';

const phoneSchema = z.preprocess(
  (value) => normalizePhone(value),
  z.string().refine(isValidPhone, 'Telefon xalqaro formatda boʻlishi kerak'),
);

const telegramSchema = z
  .preprocess((value) => {
    const raw = String(value ?? '').trim();
    return raw ? normalizeTelegramUsername(raw) : undefined;
  }, z.string().refine(isValidTelegramUsername, 'Telegram username notoʻgʻri').optional());

export const affiliateRegisterSchema = z.object({
  fullName: z.string().trim().min(2, 'Ism juda qisqa').max(80),
  phone: phoneSchema,
  telegramUsername: telegramSchema,
});

export type AffiliateRegisterInput = z.infer<typeof affiliateRegisterSchema>;
