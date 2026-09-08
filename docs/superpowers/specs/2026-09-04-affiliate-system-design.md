# Hamkorlar (Affiliate) tizimi — dizayn hujjati

**Sana**: 2026-09-04
**Status**: Tasdiqlangan (brainstorm)
**Loyiha**: jonbranding-web

## Maqsad

Hamkorlar jonbranding.uz ga mijoz olib kelishi va bitim yopilганда qat'iy bonus
ishlashi uchun to'liq avtomatik affiliate tizimi. Ochiq ro'yxatdan o'tish,
promokod orqali attribution, amoCRM webhook orqali bonus, hamkor uchun maxfiy
havolali statistika sahifasi, admin uchun parolli to'lov paneli.

**Yangi infratuzilma xarajati: 0** — Supabase (bepul tier, allaqachon ulangan),
mavjud amoCRM webhook, mavjud Vercel hosting.

## Asosiy qarorlar (brainstorm)

| Savol | Qaror |
|---|---|
| Tizim turi | Affiliate (hamkor komissiya ishlaydi) |
| Ro'yxatdan o'tish | Ochiq — forma to'ldiradi, darrov promokod oladi |
| Attribution | Promokod orqali (kalkulyatorda mijoz kiritadi) |
| Komissiya | Xizmat turi bo'yicha qat'iy bonus, faqat bitim yopilганда |
| Bitim yopilishi aniqlash | Avtomat — amoCRM webhook (status_id) |
| Hamkor natijalarni ko'rishi | Maxfiy havolali ko'rish sahifasi (login yo'q) |
| To'lov holati boshqaruvi | Admin panel |
| Admin himoyasi | Bitta maxfiy parol (`ADMIN_SECRET`), imzolangan cookie |

## Bonus jadvali

| Xizmat | `service` kaliti | Bonus (so'm) |
|---|---|---:|
| Naming | `naming` | 500 000 |
| Logo | `logo` | 500 000 |
| Patent | `patent` | 500 000 |
| Qadoq dizayn | `packaging` | 800 000 |
| Full Branding | `full_branding` | 1 200 000 |

Bir nechta xizmat tanlansa: `full_branding` bo'lsa o'sha; aks holda eng qimmat
xizmat bonusi olinadi.

## Ma'lumotlar bazasi (Supabase)

Migratsiya: `supabase/migrations/xxxx_affiliates.sql`

### `affiliates`
| ustun | tur | izoh |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| full_name | text not null | |
| phone | text not null | E.164 (`normalizePhone`) |
| telegram_username | text null | |
| promo_code | text unique not null | katta harf, `[A-Z0-9]{4,20}` |
| access_token | text unique not null | 32 belgi hex (`crypto.randomBytes(16).toString('hex')`) |
| created_at | timestamptz not null default now() | |

Indeks: `promo_code`, `access_token`, `phone`.

### `referrals`
| ustun | tur | izoh |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| affiliate_id | uuid not null references affiliates(id) | |
| amocrm_lead_id | bigint null | submit-form javobidan |
| lead_name | text not null | |
| lead_phone | text not null | |
| service_hint | text null | kalkulyatordan (`naming`/`logo`/...) |
| status | text not null default 'new' | `new` / `won` / `lost` |
| created_at | timestamptz not null default now() | |
| won_at | timestamptz null | |

Indeks: `affiliate_id`, `amocrm_lead_id`.

### `payouts`
| ustun | tur | izoh |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| referral_id | uuid unique not null references referrals(id) | har referralga bitta bonus (idempotentlik) |
| affiliate_id | uuid not null references affiliates(id) | |
| service | text not null | bonus jadvali kaliti |
| amount | integer not null | so'm |
| paid | boolean not null default false | |
| paid_at | timestamptz null | |
| created_at | timestamptz not null default now() | |

Indeks: `affiliate_id`, `paid`.

### RLS
Barcha 3 jadval: RLS yoqilgan, anon/authenticated uchun **hech qanday policy yo'q**
(to'liq deny). Faqat server service-role key bilan yozadi/o'qiydi. Hamkor sahifasi
ham serverда token bo'yicha so'rov qiladi.

## Komponentlar

### 1. Supabase service-role klient — `src/lib/supabase/service.ts`
Server-only. `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
`SUPABASE_SERVICE_ROLE_KEY` yo'q bo'lsa `null` qaytaradi — chaqiruvchilar buni
tekshirib, affiliate funksiyalarini jim o'tkazib yuboradi.

### 2. Affiliate store — `src/lib/affiliate/store.ts`
Server-only CRUD:
- `findAffiliateByPromoCode(code)`
- `findAffiliateByToken(token)`
- `findAffiliateByPhone(phone)`
- `createAffiliate({ fullName, phone, telegramUsername, promoCode, accessToken })`
- `createReferral({ affiliateId, amocrmLeadId, leadName, leadPhone, serviceHint })`
- `findReferralByLeadId(amocrmLeadId)`
- `markReferralWon(referralId)` / `markReferralLost(referralId)`
- `createPayoutIfAbsent({ referralId, affiliateId, service, amount })` — unique(referral_id) tufayli idempotent
- `getAffiliateDashboard(affiliateId)` — referrals + payouts join, statistika
- `listAllAffiliatesWithStats()` / `listPayouts(filter)` / `markPayoutPaid(id)`

Har funksiya Supabase klient `null` bo'lsa xavfsiz qiymat (`null` / `[]`) qaytaradi.

### 3. Payout mantiq — `src/lib/affiliate/payouts.ts`
```
export const PAYOUT_AMOUNTS = {
  naming: 500_000, logo: 500_000, patent: 500_000,
  packaging: 800_000, full_branding: 1_200_000,
} as const;

export function serviceFromHint(hint: string | null | string[]): keyof typeof PAYOUT_AMOUNTS | null
// bir nechta xizmat → full_branding bo'lsa o'sha, aks holda eng qimmati
export function payoutAmount(service): number
```

### 4. Promokod generatsiya — `src/lib/affiliate/promo-code.ts`
`generatePromoCode(fullName, isTaken: (code) => Promise<boolean>)`:
- Ismdan birinchi so'z → transliteratsiya/tozalash → `[A-Z0-9]` → 4–20 belgi
- Bo'sh/juda qisqa bo'lsa `HAMKOR` asos
- Band bo'lsa `<ASOS>2`, `<ASOS>3` ... `<ASOS>99`, keyin tasodifiy suffiks

### 5. Admin auth — `src/lib/admin/auth.ts`
- `createAdminSession()` → HMAC-SHA256(`ADMIN_SECRET`) imzolangan token (`<exp>.<sig>`), 7 kun
- `verifyAdminSession(cookieValue)` → bool, `safeCompare` (mavjud `security.ts`), muddat tekshiruvi
- `ADMIN_COOKIE = 'admin_session'`, httpOnly, secure, sameSite=lax

### 6. Register formasi zod — `src/lib/affiliate/schema.ts`
`affiliateRegisterSchema`: `fullName` (2–80), `phone` (normalizatsiyadan keyin
`isValidPhone`), `telegramUsername` (ixtiyoriy, `isValidTelegramUsername`).
Mavjud `lead-form-schema.ts` uslubi.

## API endpointlar

### `POST /api/affiliate/register`
1. Rate-limit `affiliate-register:${ip}` (5 / 60s)
2. `affiliateRegisterSchema` validatsiya, telefon normalizatsiya
3. Supabase yo'q → 503 `{ ok:false, error:'unavailable' }`
4. Telefon bo'yicha dublikat → mavjud `{ promoCode, accessUrl }` qaytar (yangi yaratma)
5. `generatePromoCode`, `crypto.randomBytes(16).toString('hex')` token
6. `createAffiliate`
7. Telegram admin kanalга xabar: "Yangi hamkor: SHERBEK, +998..., @user"
8. `200 { ok:true, promoCode, accessUrl: '/hamkor/<token>' }`

### `POST /api/admin/login`
`{ secret }` → `safeCompare(secret, ADMIN_SECRET)`. To'g'ri → `admin_session` cookie
o'rnatiladi. Rate-limit `admin-login:${ip}` (5 / 60s). Noto'g'ri → 401.

### `POST /api/admin/logout`
Cookie o'chiradi.

### `POST /api/admin/payouts/[id]/mark-paid`
Cookie auth majburiy. Rate-limit. `markPayoutPaid(id)` → `paid=true`, `paid_at=now()`.
Cookie yo'q/noto'g'ri → 401.

## Mavjud kod o'zgartirishlari

### `src/app/api/submit-form/route.ts` — attribution bloki
amoCRM lead muvaffaqiyatli yaratilgandan keyin (`amoCrmResult.ok && amoCrmResult.leadId`),
`leadData.promoCode` bo'lsa:
1. `findAffiliateByPromoCode(promoCode.toUpperCase())`
2. Topilsa:
   - `createReferral({ affiliateId, amocrmLeadId: leadId, leadName: fullName, leadPhone: phone, serviceHint })`
     - `serviceHint` — `leadData.packageSummary` yoki tanlangan xizmatlar ro'yxatidan `serviceFromHint`
   - amoCRM leadга tag qo'sh: `ref:<PROMO_CODE>` (mavjud `tags_to_add` yoki alohida PATCH)
   - Telegram lead xabariga qator qo'sh: `Hamkor: <PROMO_CODE>`
3. Butun blok `try/catch` — xato faqat `logger.error`, lead/Telegram/analytics oqimi sinmaydi.

Eslatma: `pricing.ts` hamkor kodini chegirma sifatida HISOBLAMAYDI. `VALID_PROMO_CODES`
o'zgarmaydi. Hamkor kodi kalkulyatorда 0 so'm chegirma beradi, faqat `promoCode`
maydonida `submit-form`ga uzatiladi. (Agar hozirgi UI noma'lum kodni rad etsa —
kalkulyator promokod maydonini "har qanday kodni qabul qil, faqat statik ro'yxat
chegirma beradi" ga moslashtirish; aks holda o'zgarish shart emas.)

### `src/app/api/amocrm-webhook/route.ts` — won/lost → payout
Mavjud Telegram xabari saqlanadi. Qo'shiladi:
1. `body.leads.status` (va `body.leads.update`) massividagi har lead uchun `status_id`
2. `AMOCRM_WON_STATUS_ID` — vergul bilan bir nechta id bo'lishi mumkin
3. `status_id` won ro'yxatida:
   - `findReferralByLeadId(lead.id)`
   - `referral` bор va `status !== 'won'`:
     - `markReferralWon(referral.id)`
     - `service = referral.service_hint` (yo'q bo'lsa `full_branding` fallback yoki skip + admin xabari)
     - `createPayoutIfAbsent({ referralId, affiliateId, service, amount: payoutAmount(service) })`
     - Telegram admin: "Bonus: SHERBEK — Logo — 500 000 so'm (to'lanmagan)"
4. `AMOCRM_LOST_STATUS_ID` (ixtiyoriy) ro'yxatida: `markReferralLost(referral.id)`, bonus yo'q
5. Idempotent: `payouts.referral_id` unique — takroriy webhook dublikat yaratmaydi
6. Supabase yo'q / xato → `logger.error`, webhook baribir 200 qaytaradi (amoCRM talabi)

## Sahifalar

### `/[lang]/hamkor/qoshilish` — ochiq ro'yxatdan o'tish
- Server component + client forma
- Maydonlar: ism, telefon, Telegram (ixtiyoriy)
- Yuborilгач muvaffaqiyat ekrani:
  - Promokod **katta** + nusxa tugmasi
  - Maxfiy havola (`jonbranding.uz/hamkor/<token>`) + nusxa tugmasi
  - Ogohlantirish: "Bu havolani saqlang — u sizning shaxsiy kabinetingiz"
- 4 til (uz asosiy)

### `/[lang]/hamkor/[token]` — hamkor statistikasi
- Server component, `export const dynamic = 'force-dynamic'`, `noindex`
- `findAffiliateByToken(token)` → topilmasa `notFound()`
- `getAffiliateDashboard(affiliateId)`
- Ko'rsatiladi:
  - Salom, {ism}. Promokod: **SHERBEK** (nusxa)
  - "Promokodni mijozga bering, u kalkulyatorda kiritsin"
  - Statistika kartalari: jami takliflar / yopilgan bitimlar / jami bonus / to'langan / kutilayotgan
  - Jadval: mijoz (`Sardor A.` — qisqartirilgan), sana, xizmat, status
    (`Yangi`/`Mijoz bo'ldi`/`Bekor`), bonus summa, to'lov holati
- **Maxfiylik**: telefon ko'rsatilmaydi, mijoz ismi qisqartiriladi (`<Ism> <Familiya[0]>.`)
- 4 til

### `/admin/hamkorlar` — admin panel
- Til prefiksisiz, `noindex`
- Server component cookie tekshiradi (`verifyAdminSession`)
- Cookie yo'q/noto'g'ri → parol formasi (`POST /api/admin/login`)
- Panel:
  - Hamkorlar jadvali: ism, telefon, promokod, ro'yxat sanasi, takliflar soni, jami bonus
  - Bonuslar jadvali (asosiy): hamkor, mijoz, xizmat, summa, sana, `paid` + "To'landi" tugmasi
    → `POST /api/admin/payouts/[id]/mark-paid`
  - Filtr: Barchasi / To'lanmagan / To'langan
  - Jami: kutilayotgan to'lovlar summasi
  - "Chiqish" tugmasi (`POST /api/admin/logout`)

## `.env` yangi kalitlar (`.env.example` ga qo'shiladi)

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AMOCRM_WON_STATUS_ID=142          # amoCRM "Muvaffaqiyatli yakunlandi" bosqichi id (vergul bilan ko'p)
AMOCRM_LOST_STATUS_ID=143         # ixtiyoriy
ADMIN_SECRET=long-random-string
```

## Testlar (`src/**/*.test.ts`, vitest)

- `promo-code.test.ts` — generatsiya, band bo'lganda suffiks, sanitizatsiya, bo'sh ism
- `payouts.test.ts` — `serviceFromHint` xaritasi, summalar, ko'p xizmat → eng qimmati / full_branding
- `admin/auth.test.ts` — cookie imzo yaroqli/yaroqsiz/muddati o'tgan, `safeCompare` timing
- `affiliate-schema.test.ts` — zod validatsiya (telefon normalizatsiya, ism uzunligi, telegram)
- `affiliate-webhook.test.ts` — mock `status_id` → won/lost/hech narsa; idempotentlik (2 marta won → 1 payout)

Har test Supabase klientni mock qiladi (`src/lib/supabase/service.ts`).

## Xatolarni boshqarish

- Attribution (submit-form) va payout (webhook) Supabase xatosi → faqat `logger.error`;
  lead, Telegram, analytics oqimlari sinmaydi
- `SUPABASE_SERVICE_ROLE_KEY` yo'q → affiliate funksiyalari jim o'tkazib yuboriladi,
  sayt to'liq normal ishlaydi (register endpoint 503)
- Barcha `/api/admin/*` va `/api/affiliate/*` → rate-limit majburiy
- Admin auth → timing-safe `safeCompare`, noto'g'ri parolда 401
- Webhook → Supabase xatosida ham amoCRM ga 200 qaytaradi

## Ish tartibi (implementatsiya bosqichlari, yuqori daraja)

1. Supabase migratsiya + service-role klient
2. `payouts.ts`, `promo-code.ts`, `schema.ts` + testlar (sof funksiyalar)
3. `store.ts` (Supabase CRUD)
4. `admin/auth.ts` + testlar
5. `POST /api/affiliate/register` + qoshilish sahifasi
6. `/hamkor/[token]` sahifasi
7. `submit-form` attribution bloki
8. `amocrm-webhook` won/lost → payout + testlar
9. Admin login/logout/mark-paid API + `/admin/hamkorlar` sahifasi
10. i18n matnlari (uz → ru/en/zh), `.env.example`, hujjatlar

## Doiradan tashqarida (YAGNI)

- Hamkor login/parol (keyinchalik token yetarli bo'lmasa qo'shiladi)
- Havola orqali attribution / cookie tracking (faqat promokod)
- Foizli komissiya (faqat qat'iy summa)
- To'lov avtomatlashtiruvi (admin qo'lda "to'landi" belgilaydi)
- Ko'p admin / rollar
- Hamkor darajalari, referral zanjiri (multi-level)
