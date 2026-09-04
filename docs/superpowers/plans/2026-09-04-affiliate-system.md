# Hamkorlar (Affiliate) tizimi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ochiq roʻyxatdan oʻtadigan affiliate tizimi — hamkor promokod oladi, mijoz kalkulyatorda kiritadi, amoCRM bitim yopilganda hamkorga qatʼiy bonus hisoblanadi, hamkor maxfiy havolada statistikani koʻradi, admin parolli panelda toʻlovni belgilaydi.

**Architecture:** Supabase 3 jadval (`affiliates`, `referrals`, `payouts`) service-role key orqali server-only yoziladi. Attribution `submit-form` route ichida promokod boʻyicha. Bonus mavjud `amocrm-webhook` route kengaytmasi orqali `status_id` tekshirib. Hamkor sahifasi `/[lang]/hamkor/[token]` — force-dynamic, noindex. Admin `/admin/hamkorlar` — HMAC imzolangan cookie, `ADMIN_SECRET`.

**Tech Stack:** Next.js 16 App Router, TypeScript, `@supabase/ssr`, zod, vitest, Tailwind + ShadCN.

## Global Constraints

- **Uzbek-first**: har matn avval `src/locales/uz.json` da, keyin `ru.json`, `en.json`, `zh.json`. Dictionary pattern: `dictionary.section.key`.
- **TypeScript**: `FC<Props>` pattern. `ignoreBuildErrors: true` (build blok qilmaydi, lekin typecheck toza boʻlsin).
- **Testlar**: faqat `src/**/*.test.ts(x)`. `tests/**` vitest exclude qilingan. Test env `NODE_ENV=test` — `rate-limit.ts` local bucket ishlatadi, `FIREBASE_SERVICE_ACCOUNT_JSON` yoʻq deb hisoblanadi.
- **Rate-limit signature**: `rateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean>` — `false` = limitdan oshgan. `getClientIp(request: Request): string`. Ikkalasi `@/lib/rate-limit`.
- **Timing-safe compare**: `safeCompare(a: string, b: string): boolean` — `@/lib/security`.
- **Telefon normalizatsiya**: `normalizePhone(value: unknown): string` (9 xonali → `+998…`), `isValidPhone(value: unknown): boolean`, `normalizeTelegramUsername`, `isValidTelegramUsername` — `@/lib/lead-contact`.
- **Logger**: `logger.error(msg, meta?)`, `logger.warn`, `logger.info` — `@/lib/logger`.
- **Supabase env**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` mavjud. Yangi: `SUPABASE_SERVICE_ROLE_KEY`.
- **Affiliate xatolari hech qachon asosiy lead oqimini sindirmaydi** — attribution va payout bloklari `try/catch`, xato faqat `logger.error`.
- **Webhook har doim amoCRM ga HTTP 200 qaytaradi** (amoCRM talabi), Supabase xatosida ham.
- **Bonus jadvali (verbatim)**: `naming: 500_000`, `logo: 500_000`, `patent: 500_000`, `packaging: 800_000`, `full_branding: 1_200_000` (soʻm). Bir nechta xizmat → `full_branding` boʻlsa oʻsha, aks holda eng qimmati.
- **Spec**: `docs/superpowers/specs/2026-09-04-affiliate-system-design.md`.

---

## File Structure

**Yaratiladi:**
- `src/lib/affiliate/payouts.ts` — `PAYOUT_AMOUNTS` konstanta, `serviceFromHint()`, `payoutAmount()`. Sof funksiyalar, DB yoʻq.
- `src/lib/affiliate/promo-code.ts` — `generatePromoCode(fullName, isTaken)`. Sof + async band tekshiruv callback.
- `src/lib/affiliate/schema.ts` — `affiliateRegisterSchema` (zod).
- `src/lib/supabase/service.ts` — service-role klient factory, `null` qaytaradi agar key yoʻq.
- `src/lib/affiliate/store.ts` — Supabase CRUD, server-only. Barcha DB kirish shu yerda.
- `src/lib/admin/auth.ts` — cookie imzo/tekshir (`createAdminSession`, `verifyAdminSession`, `ADMIN_COOKIE`).
- `src/app/api/affiliate/register/route.ts`
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/payouts/[id]/mark-paid/route.ts`
- `src/app/[lang]/hamkor/qoshilish/page.tsx` + `src/app/[lang]/hamkor/qoshilish/register-form.tsx` (client)
- `src/app/[lang]/hamkor/[token]/page.tsx`
- `src/app/admin/hamkorlar/page.tsx` + `src/app/admin/hamkorlar/admin-client.tsx` (client) + `src/app/admin/hamkorlar/login-form.tsx` (client)

**Oʻzgartiriladi:**
- `src/app/api/submit-form/route.ts` — attribution bloki (amoCRM lead yaratilгач).
- `src/app/api/amocrm-webhook/route.ts` — won/lost → payout.
- `src/components/contact-modal.tsx` — `promoCode` propni submit-form body ga qoʻshish.
- `src/components/layout/client-enhancements.tsx` — `promoCode` ni `localStorage` dan oʻqib `ContactModal` ga uzatish.
- `src/components/sections/at-modal.tsx` — submit-form body ga `promoCode` (localStorage dan).
- `src/locales/{uz,ru,en,zh}.json` — `affiliate` boʻlimi.
- `.env.example` — yangi kalitlar.

**Test fayllar:**
- `src/lib/affiliate/payouts.test.ts`
- `src/lib/affiliate/promo-code.test.ts`
- `src/lib/affiliate/schema.test.ts`
- `src/lib/admin/auth.test.ts`
- `src/lib/affiliate/store.test.ts`
- `src/app/api/affiliate/register/route.test.ts`
- `src/app/api/amocrm-webhook/affiliate.test.ts`

---

## Task 1: Bonus mantiq — `payouts.ts`

**Files:**
- Create: `src/lib/affiliate/payouts.ts`
- Test: `src/lib/affiliate/payouts.test.ts`

**Interfaces:**
- Consumes: hech narsa (sof funksiyalar).
- Produces:
  - `export const PAYOUT_AMOUNTS: { naming: 500_000; logo: 500_000; patent: 500_000; packaging: 800_000; full_branding: 1_200_000 }`
  - `export type PayoutService = keyof typeof PAYOUT_AMOUNTS`
  - `export function serviceFromHint(hint: string | string[] | null | undefined): PayoutService | null`
  - `export function payoutAmount(service: PayoutService): number`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/affiliate/payouts.test.ts
import { describe, expect, it } from 'vitest';
import { PAYOUT_AMOUNTS, payoutAmount, serviceFromHint } from './payouts';

describe('PAYOUT_AMOUNTS', () => {
  it('holds the agreed bonus table', () => {
    expect(PAYOUT_AMOUNTS).toEqual({
      naming: 500_000,
      logo: 500_000,
      patent: 500_000,
      packaging: 800_000,
      full_branding: 1_200_000,
    });
  });
});

describe('payoutAmount', () => {
  it('returns the amount for a service', () => {
    expect(payoutAmount('packaging')).toBe(800_000);
    expect(payoutAmount('full_branding')).toBe(1_200_000);
  });
});

describe('serviceFromHint', () => {
  it('maps a direct service key', () => {
    expect(serviceFromHint('logo')).toBe('logo');
    expect(serviceFromHint('naming')).toBe('naming');
  });

  it('maps calculator service ids to payout services', () => {
    expect(serviceFromHint('namingVIP')).toBe('naming');
    expect(serviceFromHint('namingPremium')).toBe('naming');
    expect(serviceFromHint('namingStandard')).toBe('naming');
    expect(serviceFromHint('namingCheck')).toBe('naming');
    expect(serviceFromHint('logoPremium')).toBe('logo');
    expect(serviceFromHint('logoVIP')).toBe('logo');
    expect(serviceFromHint('patentCheck')).toBe('patent');
  });

  it('picks full_branding when present among many', () => {
    expect(serviceFromHint(['logo', 'naming', 'full_branding'])).toBe('full_branding');
    expect(serviceFromHint(['logoVIP', 'packaging', 'fullBranding'])).toBe('full_branding');
  });

  it('picks the most valuable service when no full_branding', () => {
    expect(serviceFromHint(['naming', 'packaging'])).toBe('packaging');
    expect(serviceFromHint(['logo', 'naming'])).toBe('logo'); // tie → first-of-equal by table order is fine
  });

  it('parses a comma/plus separated string', () => {
    expect(serviceFromHint('naming, packaging')).toBe('packaging');
    expect(serviceFromHint('logoVIP + packaging')).toBe('packaging');
  });

  it('returns null for unknown or empty', () => {
    expect(serviceFromHint('')).toBeNull();
    expect(serviceFromHint(null)).toBeNull();
    expect(serviceFromHint('urgency')).toBeNull();
    expect(serviceFromHint(['nda', 'urgency'])).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/affiliate/payouts.test.ts`
Expected: FAIL — `Cannot find module './payouts'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/affiliate/payouts.ts
export const PAYOUT_AMOUNTS = {
  naming: 500_000,
  logo: 500_000,
  patent: 500_000,
  packaging: 800_000,
  full_branding: 1_200_000,
} as const;

export type PayoutService = keyof typeof PAYOUT_AMOUNTS;

// Kalkulyator xizmat id'lari (selectedServices kalitlari) → bonus xizmati.
const HINT_MAP: Record<string, PayoutService> = {
  naming: 'naming',
  namingcheck: 'naming',
  namingstandard: 'naming',
  namingpremium: 'naming',
  namingvip: 'naming',
  logo: 'logo',
  logostandard: 'logo',
  logopremium: 'logo',
  logovip: 'logo',
  patent: 'patent',
  patentcheck: 'patent',
  packaging: 'packaging',
  packagingdesign: 'packaging',
  qadoq: 'packaging',
  fullbranding: 'full_branding',
  full_branding: 'full_branding',
  branding: 'full_branding',
};

// Eng qimmatdan arzonga — "eng qimmati"ni tanlash uchun.
const VALUE_ORDER: PayoutService[] = ['full_branding', 'packaging', 'logo', 'naming', 'patent'];

export function payoutAmount(service: PayoutService): number {
  return PAYOUT_AMOUNTS[service];
}

function tokenize(hint: string | string[] | null | undefined): string[] {
  if (!hint) return [];
  const raw = Array.isArray(hint) ? hint : String(hint).split(/[,+/|;]+/);
  return raw
    .map((part) => String(part).trim().toLowerCase().replace(/[^a-z_]/g, ''))
    .filter(Boolean);
}

export function serviceFromHint(hint: string | string[] | null | undefined): PayoutService | null {
  const matched = new Set<PayoutService>();
  for (const token of tokenize(hint)) {
    const svc = HINT_MAP[token];
    if (svc) matched.add(svc);
  }
  if (matched.size === 0) return null;
  if (matched.has('full_branding')) return 'full_branding';
  for (const svc of VALUE_ORDER) {
    if (matched.has(svc)) return svc;
  }
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/affiliate/payouts.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliate/payouts.ts src/lib/affiliate/payouts.test.ts
git commit -m "feat(affiliate): bonus mantiq — PAYOUT_AMOUNTS va serviceFromHint

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: Promokod generatsiya — `promo-code.ts`

**Files:**
- Create: `src/lib/affiliate/promo-code.ts`
- Test: `src/lib/affiliate/promo-code.test.ts`

**Interfaces:**
- Consumes: hech narsa.
- Produces:
  - `export function normalizePromoBase(fullName: string): string` — ismdan asos kod (transliteratsiya, `[A-Z0-9]`, 4–20 belgi, boʻsh boʻlsa `HAMKOR`).
  - `export async function generatePromoCode(fullName: string, isTaken: (code: string) => Promise<boolean>): Promise<string>` — band boʻlmagan kod.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/affiliate/promo-code.test.ts
import { describe, expect, it } from 'vitest';
import { generatePromoCode, normalizePromoBase } from './promo-code';

describe('normalizePromoBase', () => {
  it('uppercases the first name word', () => {
    expect(normalizePromoBase('Sherbek Aliyev')).toBe('SHERBEK');
    expect(normalizePromoBase('  muborak  ')).toBe('MUBORAK');
  });

  it('transliterates common cyrillic', () => {
    expect(normalizePromoBase('Шербек')).toBe('SHERBEK');
  });

  it('strips non-alphanumerics', () => {
    expect(normalizePromoBase("O'ktam-99")).toBe('OKTAM99');
  });

  it('falls back to HAMKOR for empty or too-short input', () => {
    expect(normalizePromoBase('')).toBe('HAMKOR');
    expect(normalizePromoBase('Ali')).toBe('HAMKOR'); // < 4 belgi
    expect(normalizePromoBase('!!')).toBe('HAMKOR');
  });

  it('caps length at 20', () => {
    expect(normalizePromoBase('Abdurahmonqulovabdulla')).toHaveLength(20);
  });
});

describe('generatePromoCode', () => {
  it('returns the base when free', async () => {
    const code = await generatePromoCode('Sherbek', async () => false);
    expect(code).toBe('SHERBEK');
  });

  it('appends a numeric suffix when the base is taken', async () => {
    const taken = new Set(['SHERBEK', 'SHERBEK2']);
    const code = await generatePromoCode('Sherbek', async (c) => taken.has(c));
    expect(code).toBe('SHERBEK3');
  });

  it('falls back to a random suffix after 99 collisions', async () => {
    const code = await generatePromoCode('Sherbek', async (c) => c === 'SHERBEK' || /^SHERBEK\d{1,2}$/.test(c));
    expect(code).toMatch(/^SHERBEK[A-Z0-9]{3,4}$/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/affiliate/promo-code.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/affiliate/promo-code.ts
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => (ch in CYRILLIC_MAP ? CYRILLIC_MAP[ch] : ch))
    .join('');
}

export function normalizePromoBase(fullName: string): string {
  const firstWord = String(fullName || '').trim().split(/\s+/)[0] || '';
  const cleaned = transliterate(firstWord).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length < 4) return 'HAMKOR';
  return cleaned.slice(0, 20);
}

function randomSuffix(len: number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function generatePromoCode(
  fullName: string,
  isTaken: (code: string) => Promise<boolean>,
): Promise<string> {
  const base = normalizePromoBase(fullName);
  if (!(await isTaken(base))) return base;

  for (let n = 2; n <= 99; n++) {
    const candidate = `${base}${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `${base}${randomSuffix(attempt < 10 ? 3 : 4)}`.slice(0, 24);
    if (!(await isTaken(candidate))) return candidate;
  }

  // Deyarli imkonsiz — vaqt tamg'asi bilan.
  return `${base}${Date.now().toString(36).toUpperCase().slice(-4)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/affiliate/promo-code.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliate/promo-code.ts src/lib/affiliate/promo-code.test.ts
git commit -m "feat(affiliate): promokod generatsiya — asos + band tekshiruv

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Register formasi zod — `schema.ts`

**Files:**
- Create: `src/lib/affiliate/schema.ts`
- Test: `src/lib/affiliate/schema.test.ts`

**Interfaces:**
- Consumes: `@/lib/lead-contact` (`normalizePhone`, `isValidPhone`, `normalizeTelegramUsername`, `isValidTelegramUsername`).
- Produces:
  - `export const affiliateRegisterSchema` — zod object.
  - `export type AffiliateRegisterInput = z.infer<typeof affiliateRegisterSchema>` — `{ fullName: string; phone: string; telegramUsername?: string }`. `phone` normalizatsiyadan keyingi E.164.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/affiliate/schema.test.ts
import { describe, expect, it } from 'vitest';
import { affiliateRegisterSchema } from './schema';

describe('affiliateRegisterSchema', () => {
  it('accepts a valid payload and normalizes the phone', () => {
    const parsed = affiliateRegisterSchema.parse({
      fullName: 'Sherbek Aliyev',
      phone: '901234567',
      telegramUsername: '@sherbek_a',
    });
    expect(parsed.fullName).toBe('Sherbek Aliyev');
    expect(parsed.phone).toBe('+998901234567');
    expect(parsed.telegramUsername).toBe('sherbek_a');
  });

  it('allows omitting telegram', () => {
    const parsed = affiliateRegisterSchema.parse({ fullName: 'Muborak', phone: '+998907776655' });
    expect(parsed.telegramUsername).toBeUndefined();
  });

  it('rejects a short name', () => {
    expect(() => affiliateRegisterSchema.parse({ fullName: 'A', phone: '+998901234567' })).toThrow();
  });

  it('rejects an invalid phone', () => {
    expect(() => affiliateRegisterSchema.parse({ fullName: 'Sherbek', phone: '123' })).toThrow();
  });

  it('rejects an invalid telegram username', () => {
    expect(() =>
      affiliateRegisterSchema.parse({ fullName: 'Sherbek', phone: '+998901234567', telegramUsername: 'a b' }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/affiliate/schema.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/affiliate/schema.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/affiliate/schema.test.ts`
Expected: PASS.

If `normalizeTelegramUsername` returns a value with a leading `@` in this codebase, the test `expect(parsed.telegramUsername).toBe('sherbek_a')` reveals it — adjust the preprocess to `.replace(/^@/, '')` after normalization.

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliate/schema.ts src/lib/affiliate/schema.test.ts
git commit -m "feat(affiliate): register formasi zod sxemasi

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Admin cookie auth — `admin/auth.ts`

**Files:**
- Create: `src/lib/admin/auth.ts`
- Test: `src/lib/admin/auth.test.ts`

**Interfaces:**
- Consumes: `@/lib/security` (`safeCompare`), Node `crypto` (`createHmac`).
- Produces:
  - `export const ADMIN_COOKIE = 'admin_session'`
  - `export function createAdminSession(now?: number): string` — `"<expEpochMs>.<hexHmac>"`, 7 kun amal qiladi. HMAC kaliti `process.env.ADMIN_SECRET`.
  - `export function verifyAdminSession(cookieValue: string | undefined | null, now?: number): boolean`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/admin/auth.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ADMIN_COOKIE, createAdminSession, verifyAdminSession } from './auth';

const SECRET = 'test-admin-secret-value';

beforeEach(() => {
  process.env.ADMIN_SECRET = SECRET;
});
afterEach(() => {
  delete process.env.ADMIN_SECRET;
});

describe('admin session', () => {
  it('exposes the cookie name', () => {
    expect(ADMIN_COOKIE).toBe('admin_session');
  });

  it('round-trips a freshly created session', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    expect(verifyAdminSession(token, now + 1000)).toBe(true);
  });

  it('rejects an expired session', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const eightDays = 8 * 24 * 60 * 60 * 1000;
    expect(verifyAdminSession(token, now + eightDays)).toBe(false);
  });

  it('rejects a tampered signature', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const [exp] = token.split('.');
    expect(verifyAdminSession(`${exp}.deadbeef`, now)).toBe(false);
  });

  it('rejects a tampered expiry', () => {
    const now = 1_000_000_000_000;
    const token = createAdminSession(now);
    const [, sig] = token.split('.');
    const farFuture = now + 999 * 24 * 60 * 60 * 1000;
    expect(verifyAdminSession(`${farFuture}.${sig}`, now)).toBe(false);
  });

  it('rejects empty / malformed input', () => {
    expect(verifyAdminSession(undefined)).toBe(false);
    expect(verifyAdminSession('')).toBe(false);
    expect(verifyAdminSession('no-dot')).toBe(false);
  });

  it('rejects everything when ADMIN_SECRET is unset', () => {
    const token = createAdminSession(1_000_000_000_000);
    delete process.env.ADMIN_SECRET;
    expect(verifyAdminSession(token, 1_000_000_000_000)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/admin/auth.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/admin/auth.ts
import { createHmac } from 'node:crypto';
import { safeCompare } from '@/lib/security';

export const ADMIN_COOKIE = 'admin_session';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload: string): string | null {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return null;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function createAdminSession(now: number = Date.now()): string {
  const exp = now + SESSION_TTL_MS;
  const sig = sign(String(exp));
  if (!sig) throw new Error('ADMIN_SECRET is not set');
  return `${exp}.${sig}`;
}

export function verifyAdminSession(
  cookieValue: string | undefined | null,
  now: number = Date.now(),
): boolean {
  if (!cookieValue || typeof cookieValue !== 'string' || !cookieValue.includes('.')) return false;
  const [expPart, sigPart] = cookieValue.split('.');
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = sign(expPart);
  if (!expected || !sigPart) return false;
  return safeCompare(sigPart, expected);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/admin/auth.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/auth.ts src/lib/admin/auth.test.ts
git commit -m "feat(admin): HMAC imzolangan sessiya cookie mantigi

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Supabase service-role klient — `supabase/service.ts`

**Files:**
- Create: `src/lib/supabase/service.ts`

**Interfaces:**
- Consumes: `@supabase/supabase-js` `createClient` (allaqachon `@supabase/ssr` bogʻliqligi bilan keladi — agar yoʻq boʻlsa `@supabase/ssr` `createServerClient` cookie-siz variant ishlatiladi).
- Produces:
  - `export function getServiceClient(): SupabaseClient | null` — `SUPABASE_SERVICE_ROLE_KEY` yoki `NEXT_PUBLIC_SUPABASE_URL` yoʻq boʻlsa `null`. Server-only (`import 'server-only'`).

- [ ] **Step 1: Write the implementation** (bu task testsiz — sof factory, hulq-atvor Task 6 store testlarida mock orqali qamraladi)

```typescript
// src/lib/supabase/service.ts
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined;

export function getServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

// Testlar uchun — modul keshini tozalash.
export function __resetServiceClientForTests() {
  cached = undefined;
}
```

- [ ] **Step 2: Verify the package is available**

Run: `node -e "require.resolve('@supabase/supabase-js'); console.log('ok')"`
Expected: `ok`. Agar `MODULE_NOT_FOUND` — `npm install @supabase/supabase-js` va `package.json` ni commit ga qoʻsh (`@supabase/ssr` odatda uni peer sifatida talab qiladi, koʻpincha mavjud).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "supabase/service" || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/service.ts package.json package-lock.json 2>/dev/null
git commit -m "feat(supabase): server-only service-role klient factory

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Affiliate store (Supabase CRUD) — `affiliate/store.ts`

**Files:**
- Create: `src/lib/affiliate/store.ts`
- Test: `src/lib/affiliate/store.test.ts`

**Interfaces:**
- Consumes: `@/lib/supabase/service` (`getServiceClient`), `@/lib/affiliate/payouts` (`PayoutService`, `payoutAmount`).
- Produces (barcha `async`, Supabase klient `null` boʻlsa xavfsiz qiymat qaytaradi):
  - `findAffiliateByPromoCode(code: string): Promise<Affiliate | null>`
  - `findAffiliateByToken(token: string): Promise<Affiliate | null>`
  - `findAffiliateByPhone(phone: string): Promise<Affiliate | null>`
  - `isPromoCodeTaken(code: string): Promise<boolean>`
  - `createAffiliate(input: { fullName: string; phone: string; telegramUsername?: string; promoCode: string; accessToken: string }): Promise<Affiliate | null>`
  - `createReferral(input: { affiliateId: string; amocrmLeadId: number | null; leadName: string; leadPhone: string; serviceHint: string | null }): Promise<Referral | null>`
  - `findReferralByLeadId(amocrmLeadId: number): Promise<Referral | null>`
  - `markReferralWon(referralId: string): Promise<void>`
  - `markReferralLost(referralId: string): Promise<void>`
  - `createPayoutIfAbsent(input: { referralId: string; affiliateId: string; service: PayoutService }): Promise<Payout | null>`
  - `getAffiliateDashboard(affiliateId: string): Promise<{ referrals: Referral[]; payouts: Payout[]; stats: DashboardStats }>`
  - `listAffiliatesWithStats(): Promise<AffiliateWithStats[]>`
  - `listPayouts(filter: 'all' | 'unpaid' | 'paid'): Promise<PayoutRow[]>`
  - `markPayoutPaid(payoutId: string): Promise<void>`
  - Types: `Affiliate`, `Referral`, `Payout`, `DashboardStats`, `AffiliateWithStats`, `PayoutRow` (exported).

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/affiliate/store.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockClient = {
  from: vi.fn(),
};

vi.mock('@/lib/supabase/service', () => ({
  getServiceClient: () => (mockClient.__null ? null : mockClient),
}));

import * as store from './store';

function chain(result: unknown) {
  const c: any = {};
  for (const m of ['select', 'insert', 'update', 'eq', 'ilike', 'order', 'limit']) {
    c[m] = vi.fn(() => c);
  }
  c.single = vi.fn(async () => (result as any));
  c.maybeSingle = vi.fn(async () => (result as any));
  c.then = undefined;
  // `await chain` for list queries:
  c[Symbol.for('nodejs.util.inspect.custom')] = undefined;
  return c;
}

beforeEach(() => {
  (mockClient as any).__null = false;
  mockClient.from.mockReset();
});
afterEach(() => vi.clearAllMocks());

describe('store with no supabase client', () => {
  beforeEach(() => {
    (mockClient as any).__null = true;
  });

  it('findAffiliateByPromoCode returns null', async () => {
    await expect(store.findAffiliateByPromoCode('SHERBEK')).resolves.toBeNull();
  });

  it('createAffiliate returns null', async () => {
    await expect(
      store.createAffiliate({ fullName: 'X', phone: '+998900000000', promoCode: 'X', accessToken: 't' }),
    ).resolves.toBeNull();
  });

  it('getAffiliateDashboard returns empty shape', async () => {
    const dash = await store.getAffiliateDashboard('id');
    expect(dash.referrals).toEqual([]);
    expect(dash.payouts).toEqual([]);
    expect(dash.stats.totalReferrals).toBe(0);
  });

  it('listPayouts returns []', async () => {
    await expect(store.listPayouts('all')).resolves.toEqual([]);
  });
});

describe('findAffiliateByPromoCode', () => {
  it('queries affiliates by upper-cased promo_code', async () => {
    const row = { id: 'a1', full_name: 'Sherbek', phone: '+998900000000', telegram_username: null, promo_code: 'SHERBEK', access_token: 'tok', created_at: '2026-09-04T00:00:00Z' };
    const c = chain({ data: row, error: null });
    mockClient.from.mockReturnValue(c);

    const result = await store.findAffiliateByPromoCode('sherbek');
    expect(mockClient.from).toHaveBeenCalledWith('affiliates');
    expect(c.eq).toHaveBeenCalledWith('promo_code', 'SHERBEK');
    expect(result).toEqual({
      id: 'a1',
      fullName: 'Sherbek',
      phone: '+998900000000',
      telegramUsername: null,
      promoCode: 'SHERBEK',
      accessToken: 'tok',
      createdAt: '2026-09-04T00:00:00Z',
    });
  });

  it('returns null on error', async () => {
    const c = chain({ data: null, error: { message: 'boom' } });
    mockClient.from.mockReturnValue(c);
    await expect(store.findAffiliateByPromoCode('x')).resolves.toBeNull();
  });
});

describe('createPayoutIfAbsent', () => {
  it('inserts with the resolved amount and ignores unique-violation', async () => {
    const c = chain({ data: null, error: { code: '23505', message: 'duplicate key' } });
    mockClient.from.mockReturnValue(c);
    const result = await store.createPayoutIfAbsent({ referralId: 'r1', affiliateId: 'a1', service: 'logo' });
    expect(c.insert).toHaveBeenCalledWith(
      expect.objectContaining({ referral_id: 'r1', affiliate_id: 'a1', service: 'logo', amount: 500_000, paid: false }),
    );
    expect(result).toBeNull(); // dublikat — yangi qator yoʻq
  });
});
```

Eslatma: bu test faylni implementatsiyaga moslashtirish kerak boʻlishi mumkin (Supabase klient chaining shakli). Asosiy maqsad: (a) `null` klient → xavfsiz qiymatlar, (b) qator → camelCase map, (c) `23505` unique violation yutiladi.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/affiliate/store.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/affiliate/store.ts
import 'server-only';
import { getServiceClient } from '@/lib/supabase/service';
import { payoutAmount, type PayoutService } from '@/lib/affiliate/payouts';

export type Affiliate = {
  id: string;
  fullName: string;
  phone: string;
  telegramUsername: string | null;
  promoCode: string;
  accessToken: string;
  createdAt: string;
};

export type Referral = {
  id: string;
  affiliateId: string;
  amocrmLeadId: number | null;
  leadName: string;
  leadPhone: string;
  serviceHint: string | null;
  status: 'new' | 'won' | 'lost';
  createdAt: string;
  wonAt: string | null;
};

export type Payout = {
  id: string;
  referralId: string;
  affiliateId: string;
  service: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  createdAt: string;
};

export type DashboardStats = {
  totalReferrals: number;
  wonReferrals: number;
  totalBonus: number;
  paidBonus: number;
  pendingBonus: number;
};

export type AffiliateWithStats = Affiliate & {
  referralCount: number;
  totalBonus: number;
};

export type PayoutRow = Payout & {
  affiliatePromoCode: string;
  affiliateName: string;
  leadName: string;
};

function mapAffiliate(r: any): Affiliate {
  return {
    id: r.id,
    fullName: r.full_name,
    phone: r.phone,
    telegramUsername: r.telegram_username ?? null,
    promoCode: r.promo_code,
    accessToken: r.access_token,
    createdAt: r.created_at,
  };
}

function mapReferral(r: any): Referral {
  return {
    id: r.id,
    affiliateId: r.affiliate_id,
    amocrmLeadId: r.amocrm_lead_id ?? null,
    leadName: r.lead_name,
    leadPhone: r.lead_phone,
    serviceHint: r.service_hint ?? null,
    status: r.status,
    createdAt: r.created_at,
    wonAt: r.won_at ?? null,
  };
}

function mapPayout(r: any): Payout {
  return {
    id: r.id,
    referralId: r.referral_id,
    affiliateId: r.affiliate_id,
    service: r.service,
    amount: r.amount,
    paid: r.paid,
    paidAt: r.paid_at ?? null,
    createdAt: r.created_at,
  };
}

export async function findAffiliateByPromoCode(code: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('affiliates')
    .select('*')
    .eq('promo_code', code.trim().toUpperCase())
    .maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByToken(token: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('access_token', token).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function findAffiliateByPhone(phone: string): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from('affiliates').select('*').eq('phone', phone).maybeSingle();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function isPromoCodeTaken(code: string): Promise<boolean> {
  const db = getServiceClient();
  if (!db) return false;
  const { data } = await db
    .from('affiliates')
    .select('id')
    .eq('promo_code', code.trim().toUpperCase())
    .maybeSingle();
  return Boolean(data);
}

export async function createAffiliate(input: {
  fullName: string;
  phone: string;
  telegramUsername?: string;
  promoCode: string;
  accessToken: string;
}): Promise<Affiliate | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('affiliates')
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      telegram_username: input.telegramUsername ?? null,
      promo_code: input.promoCode,
      access_token: input.accessToken,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return mapAffiliate(data);
}

export async function createReferral(input: {
  affiliateId: string;
  amocrmLeadId: number | null;
  leadName: string;
  leadPhone: string;
  serviceHint: string | null;
}): Promise<Referral | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('referrals')
    .insert({
      affiliate_id: input.affiliateId,
      amocrm_lead_id: input.amocrmLeadId,
      lead_name: input.leadName,
      lead_phone: input.leadPhone,
      service_hint: input.serviceHint,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return mapReferral(data);
}

export async function findReferralByLeadId(amocrmLeadId: number): Promise<Referral | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('referrals')
    .select('*')
    .eq('amocrm_lead_id', amocrmLeadId)
    .maybeSingle();
  if (error || !data) return null;
  return mapReferral(data);
}

export async function markReferralWon(referralId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db
    .from('referrals')
    .update({ status: 'won', won_at: new Date().toISOString() })
    .eq('id', referralId);
}

export async function markReferralLost(referralId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.from('referrals').update({ status: 'lost' }).eq('id', referralId);
}

export async function createPayoutIfAbsent(input: {
  referralId: string;
  affiliateId: string;
  service: PayoutService;
}): Promise<Payout | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from('payouts')
    .insert({
      referral_id: input.referralId,
      affiliate_id: input.affiliateId,
      service: input.service,
      amount: payoutAmount(input.service),
      paid: false,
    })
    .select('*')
    .single();
  if (error) {
    // 23505 = unique_violation → payout allaqachon mavjud, bu normal (idempotentlik).
    return null;
  }
  return data ? mapPayout(data) : null;
}

function computeStats(referrals: Referral[], payouts: Payout[]): DashboardStats {
  const totalBonus = payouts.reduce((sum, p) => sum + p.amount, 0);
  const paidBonus = payouts.filter((p) => p.paid).reduce((sum, p) => sum + p.amount, 0);
  return {
    totalReferrals: referrals.length,
    wonReferrals: referrals.filter((r) => r.status === 'won').length,
    totalBonus,
    paidBonus,
    pendingBonus: totalBonus - paidBonus,
  };
}

export async function getAffiliateDashboard(affiliateId: string): Promise<{
  referrals: Referral[];
  payouts: Payout[];
  stats: DashboardStats;
}> {
  const db = getServiceClient();
  if (!db) return { referrals: [], payouts: [], stats: computeStats([], []) };

  const [refRes, payRes] = await Promise.all([
    db.from('referrals').select('*').eq('affiliate_id', affiliateId).order('created_at', { ascending: false }),
    db.from('payouts').select('*').eq('affiliate_id', affiliateId),
  ]);

  const referrals = (refRes.data ?? []).map(mapReferral);
  const payouts = (payRes.data ?? []).map(mapPayout);
  return { referrals, payouts, stats: computeStats(referrals, payouts) };
}

export async function listAffiliatesWithStats(): Promise<AffiliateWithStats[]> {
  const db = getServiceClient();
  if (!db) return [];
  const [affRes, refRes, payRes] = await Promise.all([
    db.from('affiliates').select('*').order('created_at', { ascending: false }),
    db.from('referrals').select('affiliate_id'),
    db.from('payouts').select('affiliate_id, amount'),
  ]);
  const affiliates = (affRes.data ?? []).map(mapAffiliate);
  const refCounts = new Map<string, number>();
  for (const r of refRes.data ?? []) refCounts.set(r.affiliate_id, (refCounts.get(r.affiliate_id) ?? 0) + 1);
  const bonusSums = new Map<string, number>();
  for (const p of payRes.data ?? []) bonusSums.set(p.affiliate_id, (bonusSums.get(p.affiliate_id) ?? 0) + p.amount);
  return affiliates.map((a) => ({
    ...a,
    referralCount: refCounts.get(a.id) ?? 0,
    totalBonus: bonusSums.get(a.id) ?? 0,
  }));
}

export async function listPayouts(filter: 'all' | 'unpaid' | 'paid'): Promise<PayoutRow[]> {
  const db = getServiceClient();
  if (!db) return [];
  let query = db
    .from('payouts')
    .select('*, affiliates(promo_code, full_name), referrals(lead_name)')
    .order('created_at', { ascending: false });
  if (filter === 'unpaid') query = query.eq('paid', false);
  if (filter === 'paid') query = query.eq('paid', true);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((r: any) => ({
    ...mapPayout(r),
    affiliatePromoCode: r.affiliates?.promo_code ?? '',
    affiliateName: r.affiliates?.full_name ?? '',
    leadName: r.referrals?.lead_name ?? '',
  }));
}

export async function markPayoutPaid(payoutId: string): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.from('payouts').update({ paid: true, paid_at: new Date().toISOString() }).eq('id', payoutId);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/affiliate/store.test.ts`
Expected: PASS. Agar Supabase chaining mock shakli sabab faylman siniqsa — mock `chain()` helper'ini haqiqiy zanjirга moslashtir (list querylari `await query` bilan hal boʻladi — `then` qoʻshib Promise qil).

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliate/store.ts src/lib/affiliate/store.test.ts
git commit -m "feat(affiliate): Supabase CRUD store (server-only)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6b: Supabase migratsiya SQL

**Files:**
- Create: `supabase/migrations/20260904120000_affiliates.sql`

**Interfaces:**
- Consumes: hech narsa.
- Produces: `affiliates`, `referrals`, `payouts` jadvallari + indekslar + RLS (to'liq deny).

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20260904120000_affiliates.sql

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  telegram_username text,
  promo_code text unique not null,
  access_token text unique not null,
  created_at timestamptz not null default now()
);
create index if not exists affiliates_promo_code_idx on public.affiliates (promo_code);
create index if not exists affiliates_access_token_idx on public.affiliates (access_token);
create index if not exists affiliates_phone_idx on public.affiliates (phone);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  amocrm_lead_id bigint,
  lead_name text not null,
  lead_phone text not null,
  service_hint text,
  status text not null default 'new' check (status in ('new', 'won', 'lost')),
  created_at timestamptz not null default now(),
  won_at timestamptz
);
create index if not exists referrals_affiliate_id_idx on public.referrals (affiliate_id);
create index if not exists referrals_amocrm_lead_id_idx on public.referrals (amocrm_lead_id);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid unique not null references public.referrals(id) on delete cascade,
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  service text not null,
  amount integer not null,
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists payouts_affiliate_id_idx on public.payouts (affiliate_id);
create index if not exists payouts_paid_idx on public.payouts (paid);

-- RLS: anon/authenticated uchun hech qanday policy yo'q — faqat service-role kirishi mumkin.
alter table public.affiliates enable row level security;
alter table public.referrals enable row level security;
alter table public.payouts enable row level security;
```

- [ ] **Step 2: Verify SQL parses locally (optional)**

Agar `supabase` CLI mavjud boʻlsa: `supabase db lint` yoki `supabase migration up --local`.
Boʻlmasa — SQL sintaksisini vizual tekshir va oʻt.

- [ ] **Step 3: Document the manual apply step**

`.env.example` yangilanishida (Task 12) eslatma qoʻshiladi: bu migratsiyani Supabase dashboard SQL editor'da yoki `supabase db push` bilan qoʻlda qoʻllash kerak.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260904120000_affiliates.sql
git commit -m "feat(affiliate): Supabase migratsiya — affiliates/referrals/payouts + RLS

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: Register API — `/api/affiliate/register`

**Files:**
- Create: `src/app/api/affiliate/register/route.ts`
- Test: `src/app/api/affiliate/register/route.test.ts`

**Interfaces:**
- Consumes: `@/lib/rate-limit` (`rateLimit`, `getClientIp`), `@/lib/affiliate/schema` (`affiliateRegisterSchema`), `@/lib/affiliate/promo-code` (`generatePromoCode`), `@/lib/affiliate/store` (`findAffiliateByPhone`, `isPromoCodeTaken`, `createAffiliate`).
- Produces: `POST` handler.
  - Muvaffaqiyat: `200 { ok: true, promoCode: string, accessUrl: string }` (`accessUrl` = `/hamkor/<token>`, til prefiksisiz — client kerak boʻlsa qoʻshadi).
  - Supabase yoʻq: `503 { ok: false, error: 'unavailable' }`.
  - Validatsiya xatosi: `400 { ok: false, error: 'invalid', details }`.
  - Rate-limit: `429 { ok: false, error: 'rate_limited' }`.

- [ ] **Step 1: Write the failing test**

```typescript
// src/app/api/affiliate/register/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => '1.2.3.4',
}));

const storeMocks = {
  findAffiliateByPhone: vi.fn(),
  isPromoCodeTaken: vi.fn(async () => false),
  createAffiliate: vi.fn(),
};
vi.mock('@/lib/affiliate/store', () => storeMocks);

// Telegram fetch — no-op
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  storeMocks.findAffiliateByPhone.mockResolvedValue(null);
  storeMocks.isPromoCodeTaken.mockResolvedValue(false);
  storeMocks.createAffiliate.mockResolvedValue({
    id: 'a1', fullName: 'Sherbek', phone: '+998901234567', telegramUsername: null,
    promoCode: 'SHERBEK', accessToken: 'tok_abc', createdAt: '2026-09-04T00:00:00Z',
  });
  global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as any;
});
afterEach(() => {
  global.fetch = originalFetch;
});

async function callRegister(body: unknown) {
  const { POST } = await import('./route');
  return POST(new Request('http://localhost/api/affiliate/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

describe('POST /api/affiliate/register', () => {
  it('creates a new affiliate and returns promo code + access url', async () => {
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, promoCode: 'SHERBEK', accessUrl: '/hamkor/tok_abc' });
    expect(storeMocks.createAffiliate).toHaveBeenCalledOnce();
  });

  it('returns the existing affiliate on duplicate phone (no new row)', async () => {
    storeMocks.findAffiliateByPhone.mockResolvedValue({
      id: 'a0', fullName: 'Sherbek', phone: '+998901234567', telegramUsername: null,
      promoCode: 'SHERBEKOLD', accessToken: 'tok_old', createdAt: '2026-01-01T00:00:00Z',
    });
    const res = await callRegister({ fullName: 'Sherbek', phone: '901234567' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, promoCode: 'SHERBEKOLD', accessUrl: '/hamkor/tok_old' });
    expect(storeMocks.createAffiliate).not.toHaveBeenCalled();
  });

  it('rejects invalid input', async () => {
    const res = await callRegister({ fullName: 'A', phone: 'nope' });
    expect(res.status).toBe(400);
  });

  it('returns 503 when supabase is unavailable', async () => {
    storeMocks.createAffiliate.mockResolvedValue(null);
    storeMocks.findAffiliateByPhone.mockResolvedValue(null);
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(503);
  });

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = await import('@/lib/rate-limit');
    (rateLimit as any).mockResolvedValueOnce(false);
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/affiliate/register/route.test.ts`
Expected: FAIL — `./route` not found.

- [ ] **Step 3: Write implementation**

```typescript
// src/app/api/affiliate/register/route.ts
import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { affiliateRegisterSchema } from '@/lib/affiliate/schema';
import { generatePromoCode } from '@/lib/affiliate/promo-code';
import {
  createAffiliate,
  findAffiliateByPhone,
  isPromoCodeTaken,
} from '@/lib/affiliate/store';
import { logger } from '@/lib/logger';

function cleanSecret(value: string | undefined) {
  return String(value || '').replace(/^﻿/, '').trim();
}

async function notifyAdmin(text: string) {
  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID);
  if (!botToken || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch (error) {
    logger.error('Affiliate admin notify failed', { reason: error instanceof Error ? error.message : String(error) });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`affiliate-register:${ip}`, 5, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid', details: 'bad json' }, { status: 400 });
  }

  const parsed = affiliateRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid', details: parsed.error.format() }, { status: 400 });
  }

  const { fullName, phone, telegramUsername } = parsed.data;

  try {
    const existing = await findAffiliateByPhone(phone);
    if (existing) {
      return NextResponse.json({
        ok: true,
        promoCode: existing.promoCode,
        accessUrl: `/hamkor/${existing.accessToken}`,
      });
    }

    const promoCode = await generatePromoCode(fullName, isPromoCodeTaken);
    const accessToken = randomBytes(16).toString('hex');

    const created = await createAffiliate({ fullName, phone, telegramUsername, promoCode, accessToken });
    if (!created) {
      return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
    }

    await notifyAdmin(
      `<b>Yangi hamkor</b>\nIsm: ${fullName}\nPromokod: <code>${created.promoCode}</code>\nTelefon: ${phone}${
        telegramUsername ? `\nTelegram: @${telegramUsername}` : ''
      }`,
    );

    return NextResponse.json({
      ok: true,
      promoCode: created.promoCode,
      accessUrl: `/hamkor/${created.accessToken}`,
    });
  } catch (error) {
    logger.error('Affiliate register failed', { reason: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/affiliate/register/route.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/affiliate/register
git commit -m "feat(affiliate): ochiq roʻyxatdan oʻtish API endpoint

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8: Register sahifasi — `/[lang]/hamkor/qoshilish`

**Files:**
- Create: `src/app/[lang]/hamkor/qoshilish/page.tsx`
- Create: `src/app/[lang]/hamkor/qoshilish/register-form.tsx`

**Interfaces:**
- Consumes: `POST /api/affiliate/register` (fetch), `getDictionary` (mavjud i18n loader — koʻrish uchun `src/app/[lang]/xizmatlar/page.tsx` qanday oladi).
- Produces: sahifa. Til prefiks bilan `accessUrl` toʻldiriladi (`/{lang}/hamkor/{token}`).

- [ ] **Step 1: Check the i18n loader pattern**

Run: `sed -n '1,40p' "src/app/[lang]/narxlar/page.tsx"`
Expected: `getDictionary(lang)` yoki shunga oʻxshash — shu patternni takrorla.

- [ ] **Step 2: Add i18n keys to `src/locales/uz.json`**

`affiliate` boʻlimini qoʻsh (obyektning eng yuqori darajasiga):

```json
"affiliate": {
  "join": {
    "title": "Hamkor bo'ling",
    "subtitle": "Mijoz olib keling — bitim yopilganda bonus oling. Ro'yxatdan o'ting, shaxsiy promokodingizni oling.",
    "nameLabel": "To'liq ism",
    "namePlaceholder": "Ism Familiya",
    "phoneLabel": "Telefon",
    "phonePlaceholder": "90 123 45 67",
    "telegramLabel": "Telegram (ixtiyoriy)",
    "telegramPlaceholder": "@username",
    "submit": "Promokod olish",
    "submitting": "Yuborilmoqda...",
    "errorGeneric": "Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.",
    "errorValidation": "Ma'lumotlarni tekshiring.",
    "successTitle": "Tayyor! Sizning promokodingiz:",
    "successCodeHint": "Bu kodni mijozga bering — u narx kalkulyatorida kiritadi.",
    "successLinkTitle": "Shaxsiy kabinet havolangiz:",
    "successLinkHint": "Bu havolani saqlang. Statistikangizni shu yerda ko'rasiz.",
    "copy": "Nusxa olish",
    "copied": "Nusxa olindi",
    "bonusTableTitle": "Bonuslar",
    "bonusNaming": "Naming — 500 000 so'm",
    "bonusLogo": "Logo — 500 000 so'm",
    "bonusPatent": "Patent — 500 000 so'm",
    "bonusPackaging": "Qadoq dizayn — 800 000 so'm",
    "bonusFull": "Full Branding — 1 200 000 so'm"
  },
  "dashboard": {
    "greeting": "Salom",
    "yourCode": "Promokodingiz",
    "shareHint": "Promokodni mijozga bering, u kalkulyatorda kiritsin.",
    "statTotal": "Jami takliflar",
    "statWon": "Yopilgan bitimlar",
    "statBonus": "Jami bonus",
    "statPaid": "To'langan",
    "statPending": "Kutilmoqda",
    "tableClient": "Mijoz",
    "tableDate": "Sana",
    "tableService": "Xizmat",
    "tableStatus": "Holat",
    "tableBonus": "Bonus",
    "tablePayout": "To'lov",
    "statusNew": "Yangi",
    "statusWon": "Mijoz bo'ldi",
    "statusLost": "Bekor",
    "payoutPaid": "To'langan",
    "payoutPending": "Kutilmoqda",
    "empty": "Hali takliflar yo'q. Promokodingizni ulashing!"
  }
}
```

Keyin `ru.json`, `en.json`, `zh.json` ga tarjima qilingan nusxa. (Xitoycha/inglizcha/ruscha tarjimani bevosita yoz — kalit tuzilishi bir xil.)

- [ ] **Step 3: Write the client form**

```tsx
// src/app/[lang]/hamkor/qoshilish/register-form.tsx
'use client';

import { FC, useState } from 'react';

type Dict = Record<string, string>;

const RegisterForm: FC<{ lang: string; dict: Dict }> = ({ lang, dict }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegram] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{ promoCode: string; accessUrl: string } | null>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, telegramUsername: telegramUsername || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setStatus('error');
        setErrorMsg(res.status === 400 ? dict.errorValidation : dict.errorGeneric);
        return;
      }
      setResult({ promoCode: json.promoCode, accessUrl: `/${lang}${json.accessUrl}` });
      setStatus('idle');
    } catch {
      setStatus('error');
      setErrorMsg(dict.errorGeneric);
    }
  };

  const copy = async (text: string, which: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  if (result) {
    const fullLink = typeof window !== 'undefined' ? `${window.location.origin}${result.accessUrl}` : result.accessUrl;
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.successTitle}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl font-black tracking-tight text-primary">{result.promoCode}</span>
            <button type="button" onClick={() => copy(result.promoCode, 'code')} className="rounded-full border px-4 py-2 text-sm font-bold">
              {copied === 'code' ? dict.copied : dict.copy}
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">{dict.successCodeHint}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.successLinkTitle}</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="rounded bg-slate-100 px-3 py-2 text-sm break-all">{fullLink}</code>
            <button type="button" onClick={() => copy(fullLink, 'link')} className="rounded-full border px-4 py-2 text-sm font-bold shrink-0">
              {copied === 'link' ? dict.copied : dict.copy}
            </button>
          </div>
          <p className="mt-1 text-sm font-bold text-amber-600">{dict.successLinkHint}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.nameLabel}</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} maxLength={80}
          placeholder={dict.namePlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.phoneLabel}</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel"
          placeholder={dict.phonePlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-600">{dict.telegramLabel}</label>
        <input value={telegramUsername} onChange={(e) => setTelegram(e.target.value)}
          placeholder={dict.telegramPlaceholder} className="mt-1 w-full rounded-xl border px-4 py-3" />
      </div>
      {status === 'error' && <p className="text-sm font-bold text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === 'submitting'}
        className="w-full rounded-full bg-primary py-4 text-base font-black text-white disabled:opacity-60">
        {status === 'submitting' ? dict.submitting : dict.submit}
      </button>
    </form>
  );
};

export default RegisterForm;
```

- [ ] **Step 4: Write the page**

```tsx
// src/app/[lang]/hamkor/qoshilish/page.tsx
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary'; // Step 1 da topilgan haqiqiy yoʻlga moslashtir
import RegisterForm from './register-form';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AffiliateJoinPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const dict = dictionary?.affiliate?.join ?? {};

  return (
    <main className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{dict.title}</h1>
      <p className="mt-3 text-slate-600">{dict.subtitle}</p>

      <div className="mt-10">
        <RegisterForm lang={lang} dict={dict} />
      </div>

      <div className="mt-14 rounded-2xl border bg-slate-50 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.bonusTableTitle}</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>{dict.bonusNaming}</li>
          <li>{dict.bonusLogo}</li>
          <li>{dict.bonusPatent}</li>
          <li>{dict.bonusPackaging}</li>
          <li>{dict.bonusFull}</li>
        </ul>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev` va `http://localhost:9002/uz/hamkor/qoshilish` ni och. Forma render boʻlsin. (Supabase env boʻlmasa yuborish 503 qaytaradi — kutilgan.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -i "hamkor/qoshilish" || echo clean`
Expected: `clean`.

- [ ] **Step 7: Commit**

```bash
git add "src/app/[lang]/hamkor/qoshilish" src/locales/uz.json src/locales/ru.json src/locales/en.json src/locales/zh.json
git commit -m "feat(affiliate): roʻyxatdan oʻtish sahifasi + i18n

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 9: Hamkor statistika sahifasi — `/[lang]/hamkor/[token]`

**Files:**
- Create: `src/app/[lang]/hamkor/[token]/page.tsx`

**Interfaces:**
- Consumes: `@/lib/affiliate/store` (`findAffiliateByToken`, `getAffiliateDashboard`), `getDictionary`.
- Produces: server component, `export const dynamic = 'force-dynamic'`, `metadata.robots = { index: false }`.

- [ ] **Step 1: Write the page**

```tsx
// src/app/[lang]/hamkor/[token]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary'; // haqiqiy yoʻlga moslashtir
import { findAffiliateByToken, getAffiliateDashboard } from '@/lib/affiliate/store';
import { serviceFromHint } from '@/lib/affiliate/payouts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

function shortenName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
}

function fmtSom(n: number): string {
  return `${n.toLocaleString('fr-FR')} so'm`;
}

export default async function AffiliateDashboardPage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  const { lang, token } = await params;
  const affiliate = await findAffiliateByToken(token);
  if (!affiliate) notFound();

  const dictionary = await getDictionary(lang);
  const d = dictionary?.affiliate?.dashboard ?? {};
  const { referrals, payouts, stats } = await getAffiliateDashboard(affiliate.id);

  const payoutByReferral = new Map(payouts.map((p) => [p.referralId, p]));

  const statusLabel = (s: string) =>
    s === 'won' ? d.statusWon : s === 'lost' ? d.statusLost : d.statusNew;

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-2xl font-black tracking-tight">
        {d.greeting}, {affiliate.fullName}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{d.yourCode}:</span>
        <span className="text-2xl font-black text-primary">{affiliate.promoCode}</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{d.shareHint}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          [d.statTotal, String(stats.totalReferrals)],
          [d.statWon, String(stats.wonReferrals)],
          [d.statBonus, fmtSom(stats.totalBonus)],
          [d.statPaid, fmtSom(stats.paidBonus)],
          [d.statPending, fmtSom(stats.pendingBonus)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto">
        {referrals.length === 0 ? (
          <p className="text-slate-500">{d.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">{d.tableClient}</th>
                <th className="py-2 pr-3">{d.tableDate}</th>
                <th className="py-2 pr-3">{d.tableService}</th>
                <th className="py-2 pr-3">{d.tableStatus}</th>
                <th className="py-2 pr-3">{d.tableBonus}</th>
                <th className="py-2 pr-3">{d.tablePayout}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => {
                const payout = payoutByReferral.get(r.id);
                const svc = serviceFromHint(r.serviceHint);
                return (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 pr-3 font-medium">{shortenName(r.leadName)}</td>
                    <td className="py-2 pr-3 text-slate-500">{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</td>
                    <td className="py-2 pr-3">{svc ?? '—'}</td>
                    <td className="py-2 pr-3">{statusLabel(r.status)}</td>
                    <td className="py-2 pr-3">{payout ? fmtSom(payout.amount) : '—'}</td>
                    <td className="py-2 pr-3">
                      {payout ? (payout.paid ? d.payoutPaid : d.payoutPending) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -i "hamkor/\[token\]" || echo clean`
Expected: `clean`.

- [ ] **Step 3: Manual smoke test**

`npm run dev`, `http://localhost:9002/uz/hamkor/nonexistent` → 404 sahifasi. (Haqiqiy token Supabase sozlangandan keyin sinaladi.)

- [ ] **Step 4: Commit**

```bash
git add "src/app/[lang]/hamkor/[token]"
git commit -m "feat(affiliate): hamkor maxfiy havola statistika sahifasi

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 10: Attribution — `submit-form` route + client wiring

**Files:**
- Modify: `src/app/api/submit-form/route.ts`
- Modify: `src/components/layout/client-enhancements.tsx`
- Modify: `src/components/contact-modal.tsx`
- Modify: `src/components/sections/at-modal.tsx`
- Modify: `src/lib/lead-form-schema.ts`
- Test: `src/app/api/submit-form/route.test.ts` (mavjud faylni kengaytir)

**Interfaces:**
- Consumes: `@/lib/affiliate/store` (`findAffiliateByPromoCode`, `createReferral`), `@/lib/affiliate/payouts` (`serviceFromHint`).
- Produces: `submit-form` javobi oʻzgarmaydi; yon taʼsir — `referrals` qatori yaratiladi. `leadFormSchema` ga `promoCode: z.string().optional()` qoʻshiladi.

- [ ] **Step 1: Add `promoCode` to the lead form schema**

`src/lib/lead-form-schema.ts` — `z.object({...})` ichiga qoʻsh:

```typescript
  promoCode: z.string().max(40).optional(),
```

- [ ] **Step 2: Write the failing test** (mavjud `route.test.ts` ga `describe` blok qoʻsh)

```typescript
// src/app/api/submit-form/route.test.ts — qoʻshimcha
import { vi } from 'vitest';

const affiliateStoreMock = {
  findAffiliateByPromoCode: vi.fn(),
  createReferral: vi.fn(),
};
vi.mock('@/lib/affiliate/store', () => affiliateStoreMock);

describe('affiliate attribution', () => {
  beforeEach(() => {
    affiliateStoreMock.findAffiliateByPromoCode.mockReset();
    affiliateStoreMock.createReferral.mockReset();
  });

  it('creates a referral when the promo code matches an affiliate', async () => {
    affiliateStoreMock.findAffiliateByPromoCode.mockResolvedValue({
      id: 'aff-1', promoCode: 'SHERBEK', fullName: 'Sherbek', phone: '+998900000000',
      telegramUsername: null, accessToken: 't', createdAt: '2026-09-04T00:00:00Z',
    });
    affiliateStoreMock.createReferral.mockResolvedValue({ id: 'ref-1' });

    // ... mavjud test setup bilan bir xil: fetch mock amoCRM leadId qaytaradi
    // POST body ga: promoCode: 'sherbek', packageSummary: 'Logo VIP + Packaging'
    // Kutamiz:
    expect(affiliateStoreMock.findAffiliateByPromoCode).toHaveBeenCalledWith('SHERBEK');
    expect(affiliateStoreMock.createReferral).toHaveBeenCalledWith(
      expect.objectContaining({ affiliateId: 'aff-1', serviceHint: expect.any(String) }),
    );
  });

  it('does not create a referral when no promo code is given', async () => {
    // POST body promoCode siz
    expect(affiliateStoreMock.findAffiliateByPromoCode).not.toHaveBeenCalled();
  });

  it('never fails the lead when the affiliate store throws', async () => {
    affiliateStoreMock.findAffiliateByPromoCode.mockRejectedValue(new Error('db down'));
    // POST body promoCode: 'SHERBEK'
    // Kutamiz: javob hali ham 200 { ok: true }
  });
});
```

(Bu test bloklarini mavjud `route.test.ts` dagi fetch/rate-limit/guard mocklariga moslab toʻldir — asosiy tekshiruvlar: `findAffiliateByPromoCode` chaqiruvi, `createReferral` argumentlari, va xatoda `200` javob.)

- [ ] **Step 3: Run test to verify new cases fail**

Run: `npx vitest run src/app/api/submit-form/route.test.ts`
Expected: yangi `affiliate attribution` testlari FAIL.

- [ ] **Step 4: Add the attribution block to `submit-form/route.ts`**

`sendToAmoCrm` chaqiruvidan keyin, `return NextResponse.json({ ok: true, ... })` dan oldin. `runLeadDeliveries` natijasidagi `amoCrmResult` mavjud:

```typescript
// import qismiga:
import { findAffiliateByPromoCode, createReferral } from '@/lib/affiliate/store';
import { serviceFromHint } from '@/lib/affiliate/payouts';

// ... POST ichida, amoCrmResult olingandan keyin:
try {
  const promoRaw = String((leadData as any).promoCode || '').trim();
  if (promoRaw) {
    const affiliate = await findAffiliateByPromoCode(promoRaw.toUpperCase());
    if (affiliate) {
      const serviceHintSource =
        (leadData as any).packageSummary ||
        (typeof (leadData as any).selectedServices === 'object'
          ? Object.keys((leadData as any).selectedServices || {}).join(',')
          : '') ||
        (leadData as any).role ||
        '';
      const hint = serviceFromHint(serviceHintSource);
      await createReferral({
        affiliateId: affiliate.id,
        amocrmLeadId: amoCrmResult?.leadId ?? null,
        leadName: String(fullName || 'Mijoz'),
        leadPhone: normalizePhone((leadData as any).phone) || '',
        serviceHint: hint ?? serviceHintSource || null,
      });
      logger.info('Affiliate referral recorded', { promoCode: affiliate.promoCode, leadId: amoCrmResult?.leadId ?? null });
    }
  }
} catch (error) {
  logger.error('Affiliate attribution failed', {
    reason: error instanceof Error ? error.message : String(error),
  });
}
```

Eslatma: `serviceHint` ga xom `packageSummary` matnini saqlash mumkin (Task 9/11 `serviceFromHint` bilan qayta parse qiladi). Bu payout xizmatini keyin webhook aniqlashiga imkon beradi.

- [ ] **Step 5: Forward `promoCode` from the client**

**`src/components/contact-modal.tsx`** — `onSubmit` ichidagi `fetch('/api/submit-form', ...)` body ga qoʻsh. `packageSummary` bilan bir joyда `promoCode` ni oʻqi:

```typescript
// body obyekti ichiga:
promoCode: typeof window !== 'undefined'
  ? (localStorage.getItem('promoCode') || '').replace(/"/g, '')
  : undefined,
```

**`src/components/sections/at-modal.tsx`** — xuddi shu qatorни `fetch('/api/submit-form')` body ga qoʻsh.

**`src/components/layout/client-enhancements.tsx`** — `handleOpenModal` allaqachon `promoCode` ni `localStorage` dan oʻqiydi (satr ~122). `ContactModal` ga `promoCode` prop uzatish shart emas, chunki modal oʻzi `localStorage` dan oladi. Agar `ContactModal` prop orqali olishni afzal koʻrsang — `packageSummary`/`totalPrice` yonida `promoCode` state qoʻshib uzat. Minimal yoʻl: modal `localStorage` dan oʻzi oʻqiydi (yuqoridagi 2 oʻzgarish yetarli).

- [ ] **Step 6: Run all affected tests**

Run: `npx vitest run src/app/api/submit-form/route.test.ts src/lib/lead-form-schema.test.ts 2>/dev/null; npx vitest run src/app/api/submit-form`
Expected: PASS (mavjud testlar + yangi attribution).

- [ ] **Step 7: Typecheck + build sanity**

Run: `npx tsc --noEmit 2>&1 | grep -iE "submit-form|contact-modal|at-modal|client-enhancements|lead-form-schema" || echo clean`
Expected: `clean`.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/submit-form/route.ts src/app/api/submit-form/route.test.ts src/lib/lead-form-schema.ts src/components/contact-modal.tsx src/components/sections/at-modal.tsx src/components/layout/client-enhancements.tsx
git commit -m "feat(affiliate): promokod attribution — submit-form + client wiring

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 11: Bonus hisoblash — `amocrm-webhook` won/lost

**Files:**
- Modify: `src/app/api/amocrm-webhook/route.ts`
- Test: `src/app/api/amocrm-webhook/affiliate.test.ts`

**Interfaces:**
- Consumes: `@/lib/affiliate/store` (`findReferralByLeadId`, `markReferralWon`, `markReferralLost`, `createPayoutIfAbsent`), `@/lib/affiliate/payouts` (`serviceFromHint`, `payoutAmount`, `PayoutService`).
- Produces: mavjud webhook hulq-atvori (Telegram xabari, HTTP 200) saqlanadi; qoʻshimcha yon taʼsir — `referrals.status` yangilanadi, `payouts` qatori yaratiladi.
- Env: `AMOCRM_WON_STATUS_ID` (vergul bilan koʻp id), `AMOCRM_LOST_STATUS_ID` (ixtiyoriy).

- [ ] **Step 1: Write the failing test**

```typescript
// src/app/api/amocrm-webhook/affiliate.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => '1.2.3.4',
}));

const storeMock = {
  findReferralByLeadId: vi.fn(),
  markReferralWon: vi.fn(async () => {}),
  markReferralLost: vi.fn(async () => {}),
  createPayoutIfAbsent: vi.fn(async () => ({ id: 'p1' })),
};
vi.mock('@/lib/affiliate/store', () => storeMock);

const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.AMOCRM_WEBHOOK_SECRET = 'secret';
  process.env.TELEGRAM_BOT_TOKEN = 'bot';
  process.env.TELEGRAM_CHAT_ID = 'chat';
  process.env.AMOCRM_WON_STATUS_ID = '142';
  process.env.AMOCRM_LOST_STATUS_ID = '143';
  global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as any;
  storeMock.findReferralByLeadId.mockResolvedValue({
    id: 'ref-1', affiliateId: 'aff-1', status: 'new', serviceHint: 'Logo VIP + Packaging',
    amocrmLeadId: 555, leadName: 'X', leadPhone: '+998900000000', createdAt: '2026-09-04T00:00:00Z', wonAt: null,
  });
});
afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.AMOCRM_WON_STATUS_ID;
  delete process.env.AMOCRM_LOST_STATUS_ID;
});

async function callWebhook(body: unknown) {
  const { POST } = await import('./route');
  return POST(new Request('http://localhost/api/amocrm-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-jonbranding-webhook-secret': 'secret' },
    body: JSON.stringify(body),
  }));
}

describe('amocrm-webhook affiliate payout', () => {
  it('marks referral won and creates a payout on won status', async () => {
    const res = await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(res.status).toBe(200);
    expect(storeMock.markReferralWon).toHaveBeenCalledWith('ref-1');
    expect(storeMock.createPayoutIfAbsent).toHaveBeenCalledWith({
      referralId: 'ref-1', affiliateId: 'aff-1', service: 'packaging', // Logo+Packaging → eng qimmati
    });
  });

  it('is idempotent — already-won referral does not re-pay', async () => {
    storeMock.findReferralByLeadId.mockResolvedValue({
      id: 'ref-1', affiliateId: 'aff-1', status: 'won', serviceHint: 'logo',
      amocrmLeadId: 555, leadName: 'X', leadPhone: 'x', createdAt: 'x', wonAt: '2026-09-04T01:00:00Z',
    });
    await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(storeMock.markReferralWon).not.toHaveBeenCalled();
    expect(storeMock.createPayoutIfAbsent).not.toHaveBeenCalled();
  });

  it('marks referral lost on lost status, no payout', async () => {
    await callWebhook({ leads: { status: [{ id: 555, status_id: 143 }] } });
    expect(storeMock.markReferralLost).toHaveBeenCalledWith('ref-1');
    expect(storeMock.createPayoutIfAbsent).not.toHaveBeenCalled();
  });

  it('does nothing affiliate-related for an unrelated lead', async () => {
    storeMock.findReferralByLeadId.mockResolvedValue(null);
    const res = await callWebhook({ leads: { status: [{ id: 999, status_id: 142 }] } });
    expect(res.status).toBe(200);
    expect(storeMock.markReferralWon).not.toHaveBeenCalled();
  });

  it('still returns 200 when the store throws', async () => {
    storeMock.findReferralByLeadId.mockRejectedValue(new Error('db down'));
    const res = await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/amocrm-webhook/affiliate.test.ts`
Expected: FAIL — new behavior not implemented.

- [ ] **Step 3: Add the payout block to `amocrm-webhook/route.ts`**

Mavjud Telegram xabari logikasi saqlanadi. `POST` ichida, `try` blokida `const body = await request.json();` dan keyin, `return NextResponse.json({ ok: true, ... })` dan oldin:

```typescript
// import qismiga:
import { logger } from '@/lib/logger';
import {
  createPayoutIfAbsent,
  findReferralByLeadId,
  markReferralLost,
  markReferralWon,
} from '@/lib/affiliate/store';
import { serviceFromHint, type PayoutService } from '@/lib/affiliate/payouts';

function parseStatusIds(raw: string | undefined): Set<number> {
  return new Set(
    String(raw || '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n)),
  );
}

async function notifyAffiliateBonus(text: string) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const c = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!t || !c) return;
  await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: c, text, parse_mode: 'HTML' }),
  }).catch(() => {});
}

async function processAffiliatePayouts(body: any) {
  const wonIds = parseStatusIds(process.env.AMOCRM_WON_STATUS_ID);
  const lostIds = parseStatusIds(process.env.AMOCRM_LOST_STATUS_ID);
  if (wonIds.size === 0 && lostIds.size === 0) return;

  const leadEvents = [
    ...(Array.isArray(body?.leads?.status) ? body.leads.status : []),
    ...(Array.isArray(body?.leads?.update) ? body.leads.update : []),
  ];

  for (const lead of leadEvents) {
    const leadId = Number(lead?.id);
    const statusId = Number(lead?.status_id);
    if (!Number.isFinite(leadId) || !Number.isFinite(statusId)) continue;

    const isWon = wonIds.has(statusId);
    const isLost = lostIds.has(statusId);
    if (!isWon && !isLost) continue;

    const referral = await findReferralByLeadId(leadId);
    if (!referral) continue;

    if (isLost) {
      if (referral.status !== 'lost') await markReferralLost(referral.id);
      continue;
    }

    // isWon
    if (referral.status === 'won') continue; // idempotent

    await markReferralWon(referral.id);

    const service = (serviceFromHint(referral.serviceHint) ?? 'full_branding') as PayoutService;
    const payout = await createPayoutIfAbsent({
      referralId: referral.id,
      affiliateId: referral.affiliateId,
      service,
    });
    if (payout) {
      await notifyAffiliateBonus(
        `<b>💰 Hamkor bonusi</b>\nReferral: ${referral.leadName}\nXizmat: ${service}\nSumma: ${payout.amount.toLocaleString('fr-FR')} so'm\nHolat: to'lanmagan`,
      );
    }
  }
}

// POST ichida, body olingandan keyin:
try {
  await processAffiliatePayouts(body);
} catch (error) {
  logger.error('Affiliate payout processing failed', {
    reason: error instanceof Error ? error.message : String(error),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/amocrm-webhook/affiliate.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the existing webhook test too**

Run: `npx vitest run src/app/api/amocrm-webhook`
Expected: PASS (mavjud testlar buzilmagan).

- [ ] **Step 6: Commit**

```bash
git add src/app/api/amocrm-webhook/route.ts src/app/api/amocrm-webhook/affiliate.test.ts
git commit -m "feat(affiliate): amoCRM won/lost → bonus hisoblash (idempotent)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 12: Admin API — login / logout / mark-paid

**Files:**
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`
- Create: `src/app/api/admin/payouts/[id]/mark-paid/route.ts`
- Test: `src/app/api/admin/login/route.test.ts`
- Test: `src/app/api/admin/payouts/mark-paid.test.ts`

**Interfaces:**
- Consumes: `@/lib/rate-limit`, `@/lib/security` (`safeCompare`), `@/lib/admin/auth` (`createAdminSession`, `verifyAdminSession`, `ADMIN_COOKIE`), `@/lib/affiliate/store` (`markPayoutPaid`).
- Produces:
  - `POST /api/admin/login` — `{ secret }` → cookie `admin_session` (`httpOnly`, `secure`, `sameSite=lax`, `path=/`, `maxAge=7d`). To'g'ri → `200 { ok: true }`. Noto'g'ri → `401 { ok: false }`.
  - `POST /api/admin/logout` — cookie o'chiradi, `200 { ok: true }`.
  - `POST /api/admin/payouts/[id]/mark-paid` — cookie tekshiradi. Yo'q/noto'g'ri → `401`. To'g'ri → `markPayoutPaid(id)` → `200 { ok: true }`.

- [ ] **Step 1: Write failing tests**

```typescript
// src/app/api/admin/login/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn(async () => true), getClientIp: () => 'ip' }));

beforeEach(() => { process.env.ADMIN_SECRET = 'top-secret-value'; });
afterEach(() => { delete process.env.ADMIN_SECRET; vi.clearAllMocks(); });

async function login(secret: string) {
  const { POST } = await import('./route');
  return POST(new Request('http://localhost/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret }),
  }));
}

describe('POST /api/admin/login', () => {
  it('sets a session cookie for the correct secret', async () => {
    const res = await login('top-secret-value');
    expect(res.status).toBe(200);
    const cookie = res.headers.get('set-cookie') || '';
    expect(cookie).toMatch(/admin_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('rejects a wrong secret with 401 and no cookie', async () => {
    const res = await login('wrong');
    expect(res.status).toBe(401);
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('rejects when ADMIN_SECRET is unset', async () => {
    delete process.env.ADMIN_SECRET;
    const res = await login('anything');
    expect(res.status).toBe(401);
  });
});
```

```typescript
// src/app/api/admin/payouts/mark-paid.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn(async () => true), getClientIp: () => 'ip' }));
const storeMock = { markPayoutPaid: vi.fn(async () => {}) };
vi.mock('@/lib/affiliate/store', () => storeMock);

let validCookie = '';
beforeEach(async () => {
  process.env.ADMIN_SECRET = 'sekret';
  const { createAdminSession } = await import('@/lib/admin/auth');
  validCookie = `admin_session=${createAdminSession()}`;
  vi.clearAllMocks();
});
afterEach(() => { delete process.env.ADMIN_SECRET; });

async function markPaid(id: string, cookie?: string) {
  const { POST } = await import('./[id]/mark-paid/route');
  return POST(
    new Request(`http://localhost/api/admin/payouts/${id}/mark-paid`, {
      method: 'POST',
      headers: cookie ? { cookie } : {},
    }),
    { params: Promise.resolve({ id }) },
  );
}

describe('POST /api/admin/payouts/[id]/mark-paid', () => {
  it('marks paid with a valid session', async () => {
    const res = await markPaid('p1', validCookie);
    expect(res.status).toBe(200);
    expect(storeMock.markPayoutPaid).toHaveBeenCalledWith('p1');
  });

  it('rejects without a session', async () => {
    const res = await markPaid('p1');
    expect(res.status).toBe(401);
    expect(storeMock.markPayoutPaid).not.toHaveBeenCalled();
  });

  it('rejects a tampered session', async () => {
    const res = await markPaid('p1', 'admin_session=123.deadbeef');
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/app/api/admin`
Expected: FAIL — routes not found.

- [ ] **Step 3: Implement the routes**

```typescript
// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { safeCompare } from '@/lib/security';
import { ADMIN_COOKIE, createAdminSession } from '@/lib/admin/auth';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`admin-login:${ip}`, 5, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return NextResponse.json({ ok: false }, { status: 401 });

  let provided = '';
  try {
    provided = String((await request.json())?.secret || '');
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (provided.length !== secret.length || !safeCompare(provided, secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
```

```typescript
// src/app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
```

```typescript
// src/app/api/admin/payouts/[id]/mark-paid/route.ts
import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { markPayoutPaid } from '@/lib/affiliate/store';

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!(await rateLimit(`admin-mark-paid:${ip}`, 30, 60_000))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  if (!verifyAdminSession(readCookie(request, ADMIN_COOKIE))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  await markPayoutPaid(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/app/api/admin`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin
git commit -m "feat(admin): login / logout / payout mark-paid API

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 13: Admin panel sahifasi — `/admin/hamkorlar`

**Files:**
- Create: `src/app/admin/hamkorlar/page.tsx`
- Create: `src/app/admin/hamkorlar/login-form.tsx`
- Create: `src/app/admin/hamkorlar/admin-client.tsx`

**Interfaces:**
- Consumes: `@/lib/admin/auth` (`ADMIN_COOKIE`, `verifyAdminSession`), `@/lib/affiliate/store` (`listAffiliatesWithStats`, `listPayouts`), `next/headers` (`cookies`).
- Produces: server component. Cookie yo'q/noto'g'ri → `<LoginForm />`. To'g'ri → `<AdminClient affiliates payouts />`.

- [ ] **Step 1: Write the login form (client)**

```tsx
// src/app/admin/hamkorlar/login-form.tsx
'use client';
import { FC, useState } from 'react';

const LoginForm: FC = () => {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    setBusy(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-xl font-black">Admin — Hamkorlar</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Parol"
          className="w-full rounded-xl border px-4 py-3"
          autoFocus
        />
        {error && <p className="text-sm font-bold text-red-600">Parol noto'g'ri</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-primary py-3 font-black text-white disabled:opacity-60">
          Kirish
        </button>
      </form>
    </main>
  );
};

export default LoginForm;
```

- [ ] **Step 2: Write the admin client**

```tsx
// src/app/admin/hamkorlar/admin-client.tsx
'use client';
import { FC, useState } from 'react';
import type { AffiliateWithStats, PayoutRow } from '@/lib/affiliate/store';

function fmtSom(n: number) {
  return `${n.toLocaleString('fr-FR')} so'm`;
}

const AdminClient: FC<{ affiliates: AffiliateWithStats[]; payouts: PayoutRow[] }> = ({ affiliates, payouts }) => {
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('unpaid');
  const [rows, setRows] = useState(payouts);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visible = rows.filter((p) => (filter === 'all' ? true : filter === 'paid' ? p.paid : !p.paid));
  const pendingTotal = rows.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);

  const markPaid = async (id: string) => {
    setPendingId(id);
    const res = await fetch(`/api/admin/payouts/${id}/mark-paid`, { method: 'POST' });
    setPendingId(null);
    if (res.ok) {
      setRows((prev) => prev.map((p) => (p.id === id ? { ...p, paid: true, paidAt: new Date().toISOString() } : p)));
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Admin — Hamkorlar</h1>
        <button onClick={logout} className="rounded-full border px-4 py-2 text-sm font-bold">Chiqish</button>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Kutilayotgan to'lovlar: <strong>{fmtSom(pendingTotal)}</strong>
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Bonuslar</h2>
        <div className="mt-3 flex gap-2">
          {(['unpaid', 'all', 'paid'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${filter === f ? 'bg-primary text-white' : 'border'}`}>
              {f === 'unpaid' ? "To'lanmagan" : f === 'paid' ? "To'langan" : 'Barchasi'}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">Hamkor</th>
                <th className="py-2 pr-3">Promokod</th>
                <th className="py-2 pr-3">Mijoz</th>
                <th className="py-2 pr-3">Xizmat</th>
                <th className="py-2 pr-3">Summa</th>
                <th className="py-2 pr-3">Sana</th>
                <th className="py-2 pr-3">Holat</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-3">{p.affiliateName}</td>
                  <td className="py-2 pr-3 font-mono">{p.affiliatePromoCode}</td>
                  <td className="py-2 pr-3">{p.leadName}</td>
                  <td className="py-2 pr-3">{p.service}</td>
                  <td className="py-2 pr-3">{fmtSom(p.amount)}</td>
                  <td className="py-2 pr-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-2 pr-3">
                    {p.paid ? (
                      <span className="font-bold text-green-600">To'langan</span>
                    ) : (
                      <button onClick={() => markPaid(p.id)} disabled={pendingId === p.id}
                        className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-60">
                        To'landi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Hamkorlar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-widest text-slate-500">
                <th className="py-2 pr-3">Ism</th>
                <th className="py-2 pr-3">Telefon</th>
                <th className="py-2 pr-3">Promokod</th>
                <th className="py-2 pr-3">Ro'yxat</th>
                <th className="py-2 pr-3">Takliflar</th>
                <th className="py-2 pr-3">Jami bonus</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2 pr-3">{a.fullName}</td>
                  <td className="py-2 pr-3">{a.phone}</td>
                  <td className="py-2 pr-3 font-mono">{a.promoCode}</td>
                  <td className="py-2 pr-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-2 pr-3">{a.referralCount}</td>
                  <td className="py-2 pr-3">{fmtSom(a.totalBonus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminClient;
```

- [ ] **Step 3: Write the page**

```tsx
// src/app/admin/hamkorlar/page.tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin/auth';
import { listAffiliatesWithStats, listPayouts } from '@/lib/affiliate/store';
import LoginForm from './login-form';
import AdminClient from './admin-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminAffiliatesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!verifyAdminSession(session)) {
    return <LoginForm />;
  }

  const [affiliates, payouts] = await Promise.all([
    listAffiliatesWithStats(),
    listPayouts('all'),
  ]);

  return <AdminClient affiliates={affiliates} payouts={payouts} />;
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -i "admin/hamkorlar" || echo clean`
Expected: `clean`.

- [ ] **Step 5: Manual smoke test**

`npm run dev`. `http://localhost:9002/admin/hamkorlar` → parol formasi. `.env.local` da `ADMIN_SECRET=test123` qoʻyib, parol kiritib kir → boʻsh jadvallar (Supabase yoʻq boʻlsa) render boʻlsin.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/hamkorlar
git commit -m "feat(admin): hamkorlar toʻlov paneli sahifasi

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 14: `.env.example` + hujjatlashtirish + toʻliq test oʻtkazish

**Files:**
- Modify: `.env.example`
- Modify: `CLAUDE.md` (arxitektura qarorlari boʻlimiga bitta qator)

- [ ] **Step 1: Update `.env.example`**

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Affiliate tizimi (Hamkorlar)
# Migratsiya: supabase/migrations/20260904120000_affiliates.sql — Supabase SQL editor yoki `supabase db push`
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AMOCRM_WON_STATUS_ID=142            # amoCRM "Muvaffaqiyatli yakunlandi" bosqichi id (vergul bilan bir nechta)
AMOCRM_LOST_STATUS_ID=143          # ixtiyoriy
ADMIN_SECRET=change-me-to-a-long-random-string
```

- [ ] **Step 2: Add a decision line to `CLAUDE.md`**

`## Arxitektura qarorlari (sessiya xotirasi)` roʻyxatiga:

```
- **Affiliate tizimi**: `src/lib/affiliate/*` + Supabase 3 jadval (`affiliates`/`referrals`/`payouts`, RLS to'liq deny, faqat service-role). Ro'yxat: `/[lang]/hamkor/qoshilish`. Hamkor kabineti: `/[lang]/hamkor/[token]` (login yo'q, maxfiy token). Admin: `/admin/hamkorlar` (`ADMIN_SECRET`, HMAC cookie). Attribution — `submit-form` promokod bo'yicha; bonus — `amocrm-webhook` `AMOCRM_WON_STATUS_ID` bo'yicha, idempotent. Bonuslar konstanta: `src/lib/affiliate/payouts.ts`.
```

- [ ] **Step 3: Run the full affiliate + admin + touched test suite**

Run:
```bash
npx vitest run src/lib/affiliate src/lib/admin src/app/api/affiliate src/app/api/admin src/app/api/amocrm-webhook src/app/api/submit-form
```
Expected: ALL PASS.

- [ ] **Step 4: Full typecheck**

Run: `npx tsc --noEmit`
Expected: yangi kod boʻyicha xato yoʻq (mavjud `ignoreBuildErrors` bilan aloqasi yoʻq shubhali joylar toza).

- [ ] **Step 5: Lint**

Run: `npm run lint 2>&1 | tail -20`
Expected: yangi fayllarда xato yoʻq.

- [ ] **Step 6: Build sanity**

Run: `npm run build 2>&1 | tail -30`
Expected: muvaffaqiyatli build; `/[lang]/hamkor/qoshilish`, `/[lang]/hamkor/[token]`, `/admin/hamkorlar` route'lari roʻyxatda.

- [ ] **Step 7: Commit**

```bash
git add .env.example CLAUDE.md
git commit -m "docs(affiliate): .env.example kalitlari + arxitektura qarori

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review

**1. Spec coverage:**

| Spec talabi | Task |
|---|---|
| Supabase 3 jadval + RLS | Task 6b |
| Bonus jadvali konstanta | Task 1 |
| `serviceFromHint` ko'p xizmat → eng qimmati | Task 1 |
| Promokod generatsiya + band tekshiruv | Task 2 |
| Register zod sxema | Task 3 |
| Admin HMAC cookie auth | Task 4 |
| Service-role klient (yo'q bo'lsa jim) | Task 5 |
| Store CRUD (yo'q klientda xavfsiz) | Task 6 |
| `POST /api/affiliate/register` (dublikat telefon, 503, rate-limit, Telegram) | Task 7 |
| Register sahifasi + muvaffaqiyat ekrani (promokod/havola nusxa) | Task 8 |
| i18n uz→ru/en/zh | Task 8 (+ 14) |
| Hamkor `/hamkor/[token]` (force-dynamic, noindex, maxfiylik) | Task 9 |
| Attribution `submit-form` (promokod→referral, xato lead'ni sindirmaydi) | Task 10 |
| `promoCode` client wiring (contact-modal, at-modal) | Task 10 |
| `leadFormSchema` `promoCode` | Task 10 |
| amoCRM webhook won→payout, lost→lost, idempotent, 200 har doim | Task 11 |
| `AMOCRM_WON_STATUS_ID` / `AMOCRM_LOST_STATUS_ID` (vergul bilan ko'p) | Task 11 |
| Admin login/logout/mark-paid API (rate-limit, 401) | Task 12 |
| Admin panel: hamkorlar jadvali, bonuslar jadvali, filtr, "To'landi", jami | Task 13 |
| `.env.example` yangi kalitlar | Task 14 |
| Testlar: payouts, promo-code, admin/auth, schema, store, webhook | Task 1,2,3,4,6,11 |
| Xato boshqaruv: affiliate xatosi asosiy oqimni sindirmaydi | Task 10, 11 |

Gap yo'q.

**2. Placeholder scan:** Task 6 va Task 10 testlarida "moslashtirish kerak boʻlishi mumkin" eslatmalari bор — bu real kod bilan keladi, lekin test tanasi toʻliq yozilgan. Task 8/9 `getDictionary` import yoʻli "haqiqiy yoʻlga moslashtir" deb belgilangan — Step 1 da aniqlanadi, chunki loyihada i18n loader nomi tekshirilishi kerak. Bu qabul qilinadigan (aniq step bilan). Boshqa TBD/TODO yoʻq.

**3. Type consistency:**
- `PayoutService` — Task 1 da eksport, Task 6/11 da ishlatiladi. ✓
- `Affiliate`/`Referral`/`Payout`/`AffiliateWithStats`/`PayoutRow` — Task 6 da eksport, Task 9/13 da import. ✓
- `createPayoutIfAbsent({ referralId, affiliateId, service })` — Task 6 signature, Task 11 chaqiruvi mos. ✓
- `findAffiliateByPromoCode` katta harfga oʻtkazadi (Task 6), Task 10 ham `.toUpperCase()` yuboradi — ikki marta, zararsiz. ✓
- `verifyAdminSession(cookieValue, now?)` — Task 4, Task 12/13 da 1-argument bilan chaqiriladi. ✓
- `accessUrl` = `/hamkor/<token>` (Task 7), client `/${lang}` prefiks qoʻshadi (Task 8). ✓

Nomuvofiqlik yoʻq.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-04-affiliate-system.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
