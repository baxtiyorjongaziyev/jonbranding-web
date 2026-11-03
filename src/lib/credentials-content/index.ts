/**
 * `/credentials` slayd matnlari — til bo'yicha tanlash.
 *
 * Narx va xizmat tarkibi `src/lib/sales-content/` dan olinadi.
 * Bu modul faqat taqdimotga xos sarlavha va yorliqlarni saqlaydi.
 */

import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';
import { zh } from './zh';
import type { CredentialsCopy } from './types';

export type { CredentialsCopy } from './types';

const BY_LOCALE: Record<string, CredentialsCopy> = { uz, ru, en, zh };

/** Til bo'yicha taqdimot matni. Noma'lum til kelsa — o'zbekcha. */
export function getCredentialsCopy(lang?: string): CredentialsCopy {
  return BY_LOCALE[lang ?? 'uz'] ?? uz;
}
