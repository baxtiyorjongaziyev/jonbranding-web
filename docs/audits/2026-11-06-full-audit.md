# JonBranding Web — to'liq audit

**Sana:** 2026-11-06 (Cloudflare'ga ko'chishdan bir kun keyin)
**Qamrov:** kod, xavfsizlik, maxfiy kalitlar, production sozlamalari, performance, SEO, i18n, CI/CD, kod gigiyenasi.
**Usul:** `npm ci` → typecheck, lint, 470 ta unit test, `next build`, `opennextjs-cloudflare build` + `wrangler deploy --dry-run`,
`npm audit`, git tarixini kalitlar bo'yicha skanerlash, API route'larni qo'lda o'qish.
Jonli sayt tekshirilmadi (sandbox'dan `jonbranding.uz` bloklangan), Cloudflare secret'lari faqat `docs/KOCHISH.md` bo'yicha baholandi.

Oldingi audit: [`2026-09-24-full-audit.md`](./2026-09-24-full-audit.md). Undagi P0'lar (canonical, CSP, Navigator,
buzilgan xitoycha sharhlar, Oisha offline, soxta mijozlar) **yopilgan** — tekshirildi.

---

## 1. Qisqa xulosa

Kod sog'lom: typecheck, lint (1 ta ogohlantirish), 470 ta test, Next build va Cloudflare build — hammasi yashil.
Tarjimalar 4 tilda to'liq (1153 kalit), canonical va hreflang to'g'ri.

**Lekin 3 ta joyda pul yoki obro' yo'qotish xavfi bor:**

1. **Git tarixida maxfiy kalitlar qolgan** — shu jumladan **Telegram akkauntingizning sessiyasi**. Bu kalit bilan
   akkauntingizga to'liq kirish mumkin. Bugun o'chirish kerak.
2. **Ko'chishdan keyin Worker'da 10+ secret yo'q.** Natija: cron'lar to'xtagan, admin panelga kirib bo'lmaydi,
   Turnstile o'chiq, hamkor bonuslari hisoblanmaydi, lead zaxirasi (Supabase/Firestore) ishlamayapti.
3. **Sayt Cloudflare Free tarifining chegarasida ishlayapti.** Kesh yo'q — har bir sahifa har so'rovda qaytadan
   render qilinadi (10 ms CPU limiti). Shu sabab Next.js eski versiyada qotib qolgan (`npm audit`: critical).

### Baholar

| Yo'nalish | Baho | Izoh |
|---|---:|---|
| Build / test / CI | 9/10 | Hammasi yashil. Deploy esa testlarni kutmaydi |
| Xavfsizlik (kod) | 7/10 | HMAC sessiya, timing-safe, rate-limit, honeypot bor. Oisha proxy ochiq |
| Maxfiy kalitlar | 3/10 | Telegram sessiya, Sanity token, Gemini kalit git tarixida |
| Production sozlamalari | 4/10 | Secret'lar ko'chirilmagan, cron'lar o'chiq |
| Performance | 5/10 | Kesh yo'q, ~520 KB (gzip) JS, 10 ta shrift fayli |
| SEO | 8/10 | Canonical/hreflang to'g'ri. Sitemap'da kichik kamchiliklar |
| i18n | 9/10 | Kalitlar to'liq. 1 sahifa faqat o'zbekcha |
| Kod gigiyenasi | 6/10 | 18 ta o'lik fayl, 97 ta `transition: all`, 150 ta `any` |

### Tekshiruv natijalari

| Tekshiruv | Natija |
|---|---|
| `npm run typecheck` | ✅ 0 xato |
| `npm run lint` | ✅ 0 xato, 1 ogohlantirish (`src/lib/integrations/firebase.ts:7` keraksiz `eslint-disable`) |
| `npm run test` | ✅ 74 fayl, 470 test |
| `npm run build` | ✅ 165 sahifa |
| `npm run build:cloudflare` | ✅ Worker: 50.9 MB / gzip 7.9 MB (limit 64 MB — muammo yo'q) |
| `npm audit --omit=dev` | ❌ 1 critical (`next`), 15 moderate |

---

## 2. 🔴 Kritik — darhol (P0)

### P0-1. Git tarixida maxfiy kalitlar (Telegram sessiya ham)

**Dalil:** commit `443d495` (2026-10-15) `scripts/portfolio_drive_automation.py` fayliga kalitlarni ochiq yozgan.
`c679ca5` (2026-10-18) ularni fayldan olib tashlagan, lekin **git tarixida qolgan**:

| Kalit | Xavf |
|---|---|
| `TG_SESSION` (Telethon StringSession) + `TG_API_ID` + `TG_API_HASH` | **Telegram akkauntingizga parolsiz to'liq kirish** — xabarlar, kontaktlar, kanallar |
| `SANITY_TOKEN` | Sanity CMS'ga yozish: portfolio va blogni o'zgartirish yoki o'chirish |
| `GEMINI_API_KEY` | Hisobingizdan pul sarflash |

Repo yopiq bo'lsa ham, unga ulangan har bir odam, CI va AI vosita bu tarixni ko'radi.

**Yechim (egasi qo'lda, bugun):**
1. Telegram → Sozlamalar → Qurilmalar → shu sessiyani (yoki "Boshqa sessiyalarni yakunlash") o'chirish.
   Keyin portfolio-bot uchun yangi sessiya olish.
2. sanity.io/manage → API → Tokens → eski tokenni o'chirib, yangisini berish.
3. Google AI Studio → API keys → eski kalitni o'chirish.
4. Yangi qiymatlarni faqat Worker secret / `.env.local`da saqlash.

Kalitlar o'chirilgandan keyin tarixni qayta yozish shart emas (o'chirilgan kalit zararsiz).

### P0-2. Ko'chishdan keyin Worker'da secret'lar yetishmaydi

`docs/KOCHISH.md` bo'yicha Worker'da faqat 10 ta secret bor. Kod ishlatadigan, lekin Worker'da **yo'q** secret'lar
va ularning hozirgi oqibati:

| Secret | Hozir nima ishlamayapti |
|---|---|
| `CRON_SECRET` | 3 ta cron (`content-agent`, `lead-retry`, `portfolio-telegram`) — endpoint'lar 401 qaytaradi; GitHub'da ham secret bo'lmasa `cron-cloudflare.yml` jim o'tib ketadi |
| `AMOCRM_CRON_SECRET` | `amocrm-keepalive.yml` (har oyning 1 va 15-sanasi) 401 oladi, `/api/amocrm-health` yopiq |
| `ADMIN_SECRET` | `/admin/hamkorlar`, `/admin/kp-builder`, `/admin/navigator` — kirib bo'lmaydi |
| `SALES_TEAM_SECRET` | `/sotuv-texnikalari` jamoa sahifasi |
| `AMOCRM_WEBHOOK_SECRET` | amoCRM webhook rad etiladi → **hamkor bonuslari hisoblanmaydi** |
| `TURNSTILE_SECRET_KEY` | Bot himoyasi o'chiq (faqat honeypot + rate-limit qolgan) |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Lead "inbox" (yetkazishdan oldin saqlash) o'chiq → `lead-retry` qayta yuboradigan narsa yo'q |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firestore zaxira navbati |
| `SANITY_TOKEN`, `SANITY_API_WRITE_TOKEN`, `GEMINI_API_KEY`, `APIFY_API_KEY` | Portfolio/blog/content avtomatikasi |
| `VIMEO_WEBHOOK_SECRET`, `TELEGRAM_WEBHOOK_SECRET`, `INSTAGRAM_*` | Tegishli webhook va OAuth |

**amoCRM'ni alohida tekshiring.** Token Turso'da saqlanadi (`src/lib/integrations/amocrm.ts`). Agar u oddiy
OAuth token bo'lsa (24 soatda eskiradi), yangilash uchun `AMOCRM_CLIENT_ID`, `AMOCRM_CLIENT_SECRET`,
`AMOCRM_REDIRECT_URI` kerak — ular ham ro'yxatda yo'q. Shunda token eskirgach **lidlar amoCRM'ga tushmay qoladi**
(Telegram'ga baribir boradi). Long-lived token ishlatilsa — muammo yo'q.

**Yechim:** Vercel → Settings → Environment Variables'dan to'liq ro'yxatni eksport qilib, `wrangler secret bulk`
bilan Worker'ga qo'yish. `CRON_SECRET` va `AMOCRM_CRON_SECRET`ni GitHub secret'larida ham bir xil qilish.
Keyin `docs/KOCHISH.md`dagi sinov ro'yxatidan o'tish (test lid → amoCRM + Telegram).

### P0-3. Next.js 16.3.8 — critical zaiflik va "Dependabot tuzog'i"

**Dalil:** `npm audit` → `next 16.0.0–16.4.0`: 2 ta critical RCE va 1 ta high DoS
([GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw),
[GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr),
[GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)). Tuzatilgan versiya — `16.4.5`.

**Hozirgi real xavf past**, chunki: rasmlarni Next emas, Cloudflare Images (OpenNext) optimallashtiradi, SVG
o'chiq, `'use cache'` va Server Actions kodda ishlatilmaydi. Lekin eski versiyada qotib qolish uzoq muddatli xavf.

Next yangilanmagan sababi (`docs/KOCHISH.md`): **16.4.1 Free tarifdagi 10 ms CPU limitidan oshadi → 500.**

**Ikkita tuzoq:**
- `package.json:83` → `"next": "^16.3.8"`. Kimdir `npm install` qilsa, 16.4.5 tushadi va production yiqiladi.
- `.github/dependabot.yml` security PR'larni guruhlab ochadi. Next uchun PR keladi, CI yashil bo'ladi
  (CI Node'da build qiladi, Worker CPU'ni tekshirmaydi), merge qilinsa `deploy-cloudflare.yml` uni darhol
  production'ga chiqaradi.

**Yechim:**
- Biznes qaror (tavsiya): **Workers Paid — $5/oy.** CPU limiti 10 ms → 30 s, subrequest 50 → 10 000.
  Next'ni 16.4.5'ga yangilash, keshni yoqish va cron'lar shunda xavfsiz bo'ladi.
- Paid'gacha: `next`ni aniq `16.3.8` qilib qo'yish va `dependabot.yml`ga `next` uchun `ignore` qo'shish.

### P0-4. Oisha chat proxy — boshqa foydalanuvchining yozishmasini o'qish mumkin

**Dalil:** `src/app/api/oisha/route.ts:75-83` har qanday `user_id`ni (`[a-zA-Z0-9_-]{3,80}`) qabul qiladi va
backend'ga **sizning secret kalitingiz bilan** uzatadi:
- `GET /api/oisha?user_id=X` → X'ning chat tarixi;
- `POST /api/oisha` → X nomidan xabar yuborish.

Sayt vidjeti `web_<UUID>` ishlatadi (taxmin qilib bo'lmaydi). Lekin Oisha backend Telegram bot
foydalanuvchilarini raqamli ID bilan saqlasa, ularning tarixini sayt orqali o'qish va ular nomidan yozish mumkin
bo'ladi. Backend tomonini tekshirish kerak.

**Yechim (5 daqiqa):** proxy faqat `^web_[0-9a-f-]{36}$` formatini qabul qilsin.

---

## 3. 🟠 Yuqori (P1)

### P1-1. Kesh yo'q — har sahifa har so'rovda render qilinadi

**Dalil:**
- `open-next.config.ts` → `defineCloudflareConfig()` sozlamasiz. OpenNext'da default `incrementalCache: "dummy"`
  (`node_modules/@opennextjs/cloudflare/dist/api/config.js:45`) — ya'ni **ISR/SSG ham keshlanmaydi**.
- Build jadvali: faqat bosh sahifa, blog va portfolio keyslari SSG (●). `narxlar`, `xizmatlar/*`, `haqimizda`,
  `aloqa`, `portfolio`, `blog` va boshqalar — dinamik (ƒ). Sabab: `generateStaticParams` faqat
  `src/app/[lang]/page.tsx:23`da bor, `[lang]/layout.tsx`da yo'q.
- Cloudflare hujjati: "SSR qiladigan Worker odatda 10–20 ms CPU ishlatadi". Free limit — 10 ms.

**Biznesga ta'siri:** trafik oshganda yoki og'ir sahifada `Error 1102 Worker exceeded resource limits` —
mijoz bo'sh sahifa ko'radi, reklama puli kuyadi.

**Yechim (Paid tarifdan keyin):**
1. `src/app/[lang]/layout.tsx`ga `generateStaticParams` (4 til) qo'shish — sahifalar statik bo'ladi.
2. `open-next.config.ts`da R2 incremental cache (+ regional cache) yoqish. Sanity yangilanishi `revalidate`
   orqali ishlaydi, kontent "muzlab qolmaydi".

### P1-2. Bosh sahifa og'ir (mobil internet uchun)

| Ko'rsatkich | Qiymat |
|---|---|
| HTML | 485 KB (gzip 64 KB) |
| JavaScript | 37 fayl, 1.58 MB (gzip ~520 KB) |
| CSS | 3 fayl, ~300 KB |
| Shrift fayllari (preload) | 10 ta |

5 ta Google shrift oilasi ulangan (`src/app/[lang]/layout.tsx:21-56`), Hanken Grotesk'ning o'zi 7 ta qalinlikda
(300–900). Oldingi auditda JS ~380 KB edi — o'sgan.

**Yechim:** Hanken'ni 3 qalinlikka (400/600/700) tushirish; Cormorant va JetBrains Mono faqat kerakli
sahifalarda; og'ir client bo'limlarni `dynamic()` bilan kechiktirish. Keyin Lighthouse bilan o'lchash.

### P1-3. Deploy testlarni kutmaydi

`.github/workflows/deploy-cloudflare.yml` `main`ga har push'da ishlaydi va `test.yml` natijasini kutmaydi.
Test qizil bo'lsa ham kod production'ga chiqadi (faqat build yiqilsa to'xtaydi). Yana: bu workflow
`actions/checkout@v4`, `setup-node@v4` va Node 24 ishlatadi, qolganlari `@v7/@v6` va Node 22.

**Yechim:** `workflow_run` (test.yml muvaffaqiyatli bo'lganda) yoki `needs` bilan bog'lash; versiyalarni bir xil qilish.

**Qo'shimcha (2026-11-07 tekshiruvi):**
- GitHub'da `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secret'lari yo'q — 2026-11-05 dagi deploy
  6 soniyada "muvaffaqiyatli" tugagan, aslida o'tkazib yuborilgan. Hozir deploy faqat qo'lda (`npx wrangler deploy`).
- `main`dagi CI kamida 2026-10-21 dan beri **har push'da qizil**. Oxirgi (2026-11-05) yiqilishning sababi bitta E2E test:
  `tests/p0-p1-regression.spec.ts:88` (Oisha vidjeti ishlamaganda inglizcha hero tugmasi zaxira lead formasini
  ochishi kerak, lekin formada `Service` maydoni topilmaydi). Typecheck, lint, unit test va build yashil.

### P1-4. Free tarif cron va integratsiyalarni ham cheklaydi

Free'da bitta so'rovga **50 ta subrequest**. `content-agent` (Instagram + Telegram + Gemini + Sanity) va
`portfolio-telegram` ko'p rasmni ketma-ket ishlaydi — limitga urilishi mumkin. `maxDuration = 60` Cloudflare'da
ta'sir qilmaydi (Vercel sozlamasi).

### P1-5. Sitemap va indekslash

- `/otzivlar` (mijozlar sharhlari) indekslanadi, lekin sitemap'da **yo'q** (`src/app/sitemap.ts:14`). Sharhlar —
  ishonch sahifasi, qidiruvda chiqishi kerak.
- `/pricing/sotuvchi-kartochka` sitemap'da 4 tilda (`src/app/sitemap.ts:27`). Sarlavha va description
  `layout.tsx`da 4 tilga tarjima qilingan, lekin sahifa matni (`'use client'`) faqat o'zbekcha, narxlar esa
  JSX'da qattiq yozilgan (`CLAUDE.md` qoidasiga zid). ru/en/zh URL'lar o'zbekcha matnning dublikati bo'lib qoladi.
  **Yechim:** sitemap'da faqat `uz` qoldirish yoki sahifani tarjima qilish; narxlarni `sales-content.ts`ga ko'chirish.
- `src/app/[lang]/layout.tsx:155` hamma sahifaga `<meta name="robots" content="index, follow">` qo'shadi.
  `noindex` sahifalarda ikkita qarama-qarshi teg chiqadi. Google qattiqrog'ini oladi, lekin signal chalkash.
  **Yechim:** bu qatorni olib tashlash (metadata o'zi beradi).

---

## 4. 🟡 O'rta (P2)

### Xavfsizlik va maxfiylik
- **Lead origin ro'yxati** (`src/lib/lead-guard.ts:16-36`): `patent.jonbranding.uz` yo'q (patent kalkulyator
  lidlari "begona" deb logga tushadi), `*.vercel.app` esa ishonchli hisoblanadi (Vercel endi ishlatilmaydi).
- **amoCRM webhook sirini URL'da qabul qiladi** (`src/app/api/amocrm-webhook/route.ts:133`). amoCRM header
  qo'ya olmagani uchun bu majburiy, lekin Cloudflare observability URL'ni logga yozadi. Sirni vaqti-vaqti bilan almashtiring.
- **Yandex `<noscript>` pikseli rozilikdan qat'i nazar ishlaydi** (`src/app/[lang]/layout.tsx:295`); skript esa
  rozilikni tekshiradi.
- `.env.example`da kod ishlatadigan **~40 ta o'zgaruvchi yo'q** (Telegram, amoCRM, Turnstile, Oisha, Supabase,
  cron...). Ko'chishda nima kerakligini aynan shu fayl ko'rsatishi kerak edi.

### Kod gigiyenasi
- **O'lik kod — 18 fayl, ~1600 qator:** `app/[lang]/pricing/pricing-client.tsx`, `components/exit-intent-popup.tsx`,
  `scroll-depth-trigger.tsx`, `contact-trigger-button.tsx`, `sections/at-pricing.tsx`, `sections/seo-answer-hub.tsx`,
  `sections/testimonials.tsx` (CLAUDE.md'da "zaxira"), `lib/data/settings.ts`, `ui/`dan 10 ta komponent
  (alert-dialog, alert, badge, calendar, collapsible, marquee, popover, sticky-cta, switch, tabs).
- **Ishlatilmaydigan paketlar:** `@sanity/cli` (moderate zaifliklarning asosiy manbai), `@vercel/frameworks`,
  `date-fns`, `node-fetch`, `@amplitude/analytics-browser`.
- **Loyiha qoidalari buzilgan:** 97 ta `transition: all` / `transition-all` (qoida 3), server kodida 18 ta
  `console.*` (qoida 5 — `logger` kerak), 150 ta `any`.
- **Hujjatlar eskirgan:** `CLAUDE.md` hali "Vercel auto-deploy" deydi; qoida 7dagi
  `.agents/skills/impeccable/scripts/detect.mjs` repoda yo'q (`.gitignore`da) — CI uni ishlata olmaydi.
  `portfolio:sync` skriptlari, `mcp.json`, `.claude.json` Windows yo'llariga bog'langan.
  AI ko'rsatmalari 4 joyda (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules`) — bir-biridan uzoqlashadi.
- `vercel.json` va `deploy.yml` (aslida Telegram xabarnoma) — Vercel to'xtagan, chalkashtiradi.
- `lighthouse.yml` `next start` ishlatadi, lekin `output: 'standalone'` — Cloudflare'dagi haqiqiy
  production'ni o'lchamaydi.

---

## 5. ✅ Yaxshi tomonlar

- Admin sessiyasi HMAC + muddat, admin va jamoa imzolari ajratilgan; barcha sirlar timing-safe solishtiriladi.
- Cron auth faqat `Authorization: Bearer` (URL'da sir yo'q).
- Rate-limit Turso orqali taqsimlangan (Worker instansiyalari o'rtasida umumiy).
- Lead oqimi to'g'ri o'ylangan: honeypot, Turnstile (kalit bo'lsa), idempotent `eventId`, hech qayerga
  saqlanmasa mijozga "muvaffaqiyat" ko'rsatilmaydi (503).
- Hamkor tokenlari 128 bit, Supabase'da RLS to'liq yopiq.
- `portability.test.ts` Cloudflare'ni buzadigan importlarni CI'da ushlaydi; `content-integrity.test.ts`
  soxta mijozlarni qaytarmaydi.
- Canonical, hreflang, OG teglar to'g'ri; mojibake yo'q; 4 tilda 1153 kalit to'liq.
- Kodda (HEAD) maxfiy kalit yo'q.

---

## 6. Bosqichma-bosqich reja

| Bosqich | Nima | Kim | Vaqt |
|---|---|---|---|
| **1. Bugun** | Telegram sessiya, Sanity token, Gemini kalitni o'chirish (P0-1) | Egasi | 15 daq |
| **1. Bugun** | Vercel'dan secret'larni Worker'ga ko'chirish, test lid (P0-2) | Egasi | 30 daq |
| **2. Shu hafta** | Oisha proxy'ni yopish (P0-4), `next` pin + Dependabot ignore (P0-3), deploy'ni CI'ga bog'lash (P1-3), sitemap + robots meta (P1-5), lead origin ro'yxati | Kod (Claude) | 1 PR |
| **3. Qaror** | Workers Paid ($5/oy) | Egasi | — |
| **4. Paid'dan keyin** | Next 16.4.5, R2 kesh + `generateStaticParams` (P1-1), shriftlar (P1-2) | Kod (Claude) | 1–2 PR |
| **5. Tozalash** | O'lik kod, keraksiz paketlar, `transition-all`, `.env.example`, hujjatlar | Kod (Claude) | 1 PR |

### 2-bosqich bajarildi (2026-11-07)

| Topilma | Nima qilindi | Tekshiruv |
|---|---|---|
| P0-4 Oisha proxy | Proxy faqat `web_<UUID>`ni qabul qiladi (`src/lib/oisha.ts` → `isOishaWebUserId`). Vidjet eski/buzilgan ID'ni yangisiga almashtiradi | 12 ta yangi test; ular eski kodda yiqiladi. Lokal server: begona ID → 400, vidjet ID → 200 |
| P0-3 Next tuzog'i | `next` aniq `16.3.8`; Dependabot `next >=16.4.0`ni taklif qilmaydi; `portability.test.ts` `^`/`~` qaytishini ushlaydi | Lockfile'da 1 qator o'zgardi |
| P1-3 Deploy | `deploy-cloudflare.yml` endi CI tugagach ishlaydi va faqat "Typecheck, lint, test, build" yashil bo'lsa deploy qiladi. Eski commit yangisini bosib ketmaydi. Node 22, `@v7/@v6` | Gate skripti 6 stsenariyda sinaldi |
| P1-5 SEO | `/otzivlar` sitemap'da; `sotuvchi-kartochka` faqat uz (boshqa tillarda `noindex` + uz canonical); layout'dagi qattiq `robots` meta olib tashlandi | Build + lokal HTML: `noindex` sahifada bitta robots teg |
| P2 Lead origin | `patent.` va `staging.jonbranding.uz` ishonchli. `*.vercel.app` qoldirildi (faqat log belgisi, Vercel qaytishi mumkin) | Yangi testlar, look-alike domenlar ishonchsiz |

Natija: typecheck ✅, lint ✅ (oldindan bor 1 ogohlantirish), testlar 470 → 488 ✅, build ✅.
