/** case-reels skriptlari uchun umumiy Sanity yordamchilari. */
import { createClient } from '@sanity/client';

export type Result = { metric?: string; value?: string; sourceUrl?: string; period?: string; approved?: boolean };

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Saytdagi qoida bilan bir xil (src/lib/portfolio-evidence.ts): faqat tasdiqlangan, manbali natija.
export const approvedResult = (results?: Result[]) =>
  (results ?? []).find((r) => {
    if (!r?.approved || !r.metric?.trim() || !r.value?.trim() || !r.period?.trim()) return false;
    try {
      return ['https:', 'http:'].includes(new URL(r.sourceUrl ?? '').protocol);
    } catch {
      return false;
    }
  });