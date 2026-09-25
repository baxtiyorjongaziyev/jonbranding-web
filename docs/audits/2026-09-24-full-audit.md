# JonBranding Web — to'liq audit

**Sana:** 2026-09-24
**Qamrov:** kod (API, xavfsizlik, arxitektura), production sayt (`www.jonbranding.uz`), SEO, performance, i18n, CI/CD, repo gigiyenasi.
**Usul:** kodni o'qish + typecheck/lint/test/`npm audit` + jonli saytni tekshirish (sitemap'dagi 299 URL'ning har biri alohida yuklab ko'rildi, API'lar faqat o'qish rejimida sinaldi, hech qanday lead yoki yozuv qo'shilmadi).

---

## 1. Qisqa xulosa

Kod bazasi texnik jihatdan sog'lom: typecheck, lint va 269 ta test o'tadi, sirlar repoda yo'q, API'larda auth va rate-limit bor, tarjimalar 4 tilda to'liq (1214 kalit). Oldingi auditdagi ko'p muammolar yopilgan.

**Lekin pul yo'qotayotgan joylar bor.** Ular kodning "sinishi"da emas, balki sozlama va SEO'da:

1. **Portfolio Google uchun ko'rinmaydi.** 299 ta sitemap URL'dan 128 tasining `canonical`i boshqa sahifaga (asosan bosh sahifaga) qaragan. Shulardan 104 tasi portfolio keyslari. Agentlikning eng kuchli sotuv quroli qidiruvda ishlamayapti.
2. **Google Ads konversiyasi va Microsoft Clarity CSP tomonidan bloklangan.** Reklama algoritmi ko'r ishlayapti.
3. **Uchta ko'rinadigan funksiya production'da ishlamaydi:** Navigator diagnostikasi (sahifa yiqiladi), Oisha chat (xabarlar yo'qoladi), xitoycha sharhlar (buzilgan belgilar).
4. **Bosh sahifadagi "Qumri Coffee +41% sotuv" kabi natijalar** portfolio'da yo'q mijozlarga tegishli — agar ular dizayn shablonidan qolgan bo'lsa, bu ishonchga zarba.

### Baholar

| Yo'nalish | Baho | Izoh |
|---|---:|---|
| Build / test / CI | 9/10 | Hammasi yashil, faqat Node 20 (EOL) va "hech qachon fail bo'lmaydigan" security job |
| Xavfsizlik (kod) | 8/10 | Auth, HMAC, timing-safe compare, rate-limit bor. Mayda kamchiliklar |
| Production sozlamalari | 4/10 | Supabase kaliti bo'sh, Oisha sozlanmagan, Turnstile o'chiq, CSP analitikani bloklaydi |
| SEO | 5/10 | Canonical xatosi portfolio'ni o'chirib qo'ygan, title'lar dublikat |
| Performance | 6/10 | ~380 KB (siqilgan) JS, butun lug'at client'ga yuboriladi, 7 ta analitika skripti |
| i18n | 8/10 | Kalitlar to'liq. Portfolio/narxlar title'lari 4 tilda o'zbekcha |
| Kontent ishonchliligi | 5/10 | Tasdiqlanmagan natijalar, buzilgan xitoycha sharhlar |
| Repo gigiyenasi | 3/10 | 10 000+ `node_modules` fayli va 49 MB arxiv git'da, 54 ta o'lik fayl |

---

## 2. 🔴 Kritik — darhol tuzatish (P0)

### P0-1. 128 ta URL'da canonical xato → portfolio indekslanmaydi

**Dalil (jonli sayt):**
- `/portfolio`, `/portfolio/*` (26 keys × 4 til = 104 URL) → `canonical: https://www.jonbranding.uz` (yoki `/ru`, `/en`, `/zh`)
- `/privacy`, `/terms`, `/checklist`, `/sitemap` → bosh sahifaga
- `/online-brief/wizard` → `/online-brief`, `/xizmatlar/patent-kalkulyatori` → `/xizmatlar`
- Sitemap'da yo'q, lekin `index, follow`: `/otzivlar`, `/navigator`, `/avans`, `/umarin-privacy-policy` → bosh sahifaga

**Sabab:** `src/app/[lang]/layout.tsx:108-111` hamma sahifaga `alternates.canonical = bosh sahifa` beradi. O'z `canonical`ini yozmagan sahifa uni meros oladi. `hreflang` va `og:url` ham xuddi shunday bosh sahifaga qaraydi.

**Biznesga ta'siri:** Google "bu sahifa bosh sahifaning nusxasi" deb tushunadi va keyslarni indeksdan chiqaradi. "logo dizayni Toshkent", "qadoq dizayni keys" kabi so'rovlarda portfolio chiqmaydi.

**Yechim:** layout'dan `canonical` va `og:url`ni olib tashlash, har sahifaga `buildPageMetadata(lang, path)` helper orqali o'z canonical'ini berish. Sitemap'dagi har URL uchun "canonical = o'zi" testini qo'shish.

### P0-2. Google Ads konversiyasi va Clarity CSP tomonidan bloklangan

`next.config.js:116-135` dagi CSP:
- **Clarity:** teg `https://scripts.clarity.ms/0.8.70/clarity.js`ni yuklaydi va `h.clarity.ms`ga yuboradi. `script-src`da faqat `www.clarity.ms`, `connect-src`da faqat `o.clarity.ms` bor → **Clarity umuman ishlamaydi.**
- **Google Ads (`AW-389056476`):** `www.googleadservices.com`, `googleads.g.doubleclick.net`, `pagead2.googlesyndication.com` hech bir direktivada yo'q → **konversiya va remarketing signallari yo'qoladi.**
- Hotjar va Yandex Webvisor ham qisman bloklanishi mumkin (brauzer konsolida tekshirish kerak).

**Biznesga ta'siri:** Google Ads "qaysi reklama lead olib keldi"ni bilmaydi → Smart Bidding ko'r ishlaydi, byudjet samarasiz sarflanadi.

**Yechim:** CSP'ga yetishmayotgan domenlarni qo'shish (`script-src`, `img-src`, `connect-src`, `frame-src`). Keyin Google Tag Assistant va Clarity dashboard'da "data kelyapti"ni tekshirish.

### P0-3. Navigator diagnostikasi production'da yiqiladi

- Production bundle'da `createBrowserClient("https://wpzdmfafnksgxmcbvuir.supabase.co", "")` — **`NEXT_PUBLIC_SUPABASE_ANON_KEY` bo'sh**. `@supabase/ssr` bo'sh kalitda xato tashlaydi → `/navigator/diagnostika` SSR'da yiqiladi (`data-dgst` xato digest), forma chiqmaydi.
- Kalit qo'yilsa ham: `src/components/navigator/diagnostic-flow.tsx:71` `insert(...).select().single()` qiladi, lekin RLS anonim `SELECT`ga ruxsat bermaydi (`supabase_schema.sql:62`) → insert baribir xato qaytaradi.
- Lead faqat Supabase'ga yoziladi — Telegram/amoCRM'ga xabar ketmaydi.
- `/admin/navigator` production'da **500** qaytaradi va unda **auth tekshiruvi izohga olingan** (`src/app/admin/navigator/page.tsx:14-16`).

**Yechim:** Vercel'da Supabase kalitini qo'shish, `.select()`ni olib tashlash yoki lead'ni `/api/submit-form` orqali yuborish (Telegram + amoCRM'ga ham tushadi), `/admin/navigator`ni `ADMIN_SECRET` sessiyasi bilan yopish. Agar "Tez Natija 6 Navigator" loyihasi to'xtagan bo'lsa — sahifalarni o'chirish.

### P0-4. Xitoycha sharhlar buzilgan belgilar bilan ko'rsatiladi

- `src/lib/static-data.ts:184` (en) va `:260-300` (zh) — kodirovka buzilgan (mojibake): `å¦‚æžœä½ è¿˜è®°å¾—...`, `ðŸ¤ ðŸ »`.
- `ATQuotes` (`src/components/atelier/atelier-sections.tsx:1838-1860`) sahifa yuklangandan keyin `/api/testimonials`ni chaqiradi va **server'dan kelgan to'g'ri Sanity sharhlari o'rniga** shu static ro'yxatni qo'yadi. Jonli `/api/testimonials?lang=zh` 4 ta buzilgan sharh qaytaradi.
- Qo'shimcha: hydration'dan keyin kontent almashadi → layout shift va SEO nomuvofiqligi.

**Yechim:** zh/en matnlarni qayta tiklash; `ATQuotes`da API ma'lumotini faqat server ma'lumoti bo'sh bo'lganda ishlatish (yoki client fetch'ni butunlay olib tashlash).

### P0-5. Oisha chat ko'rinadi, lekin ishlamaydi

- `OishaWidget` hamma sahifada chiqadi (`client-enhancements.tsx:252`), lekin `/api/oisha` production'da `503 Oisha assistant is not configured yet` qaytaradi.
- Tashrif buyuruvchi savol yozadi → xato toast chiqadi → **savol hech kimga yetmaydi**. Proaktiv xabar ham avtomatik yuboriladi va xato beradi.

**Yechim:** `OISHA_API_URL`/`OISHA_SECRET_KEY` sozlanmaguncha vidjetni yashirish yoki fallback: xabarni `/api/submit-form` orqali Telegram'ga yuborish.

### P0-6. Tasdiqlanmagan mijoz natijalari (ishonch va huquqiy risk)

Bosh sahifa marquee, `ATQuotes`, `at-process`, `at-sample-report`'da: **Qumri Coffee +41% sotuv, Teshabay Osh 3× takroriy mijoz, Humo Fintech 180K foydalanuvchi, Oltin Bulut +31%, Nur Sopol 2×, Chilla**, hamda "Sardor Ro'ziyev", "Malika Karimova", "Rustam Xolmatov" sharhlari (`src/locales/*.json`, `src/components/sections/at-*.tsx`).

Bu brendlar Sanity portfolio'sida (21 keys) va haqiqiy sharhlarda (6 ta) yo'q. Agar ular "Atelier" dizayn shablonidan qolgan namunalar bo'lsa:
- mijoz "Qumri Coffee keysini ko'rsating" desa — javob yo'q;
- reklama qonunchiligi bo'yicha asossiz raqamli da'volar risk tug'diradi;
- eng muhimi — ishonchga asoslangan brendga zarba.

**Yechim:** haqiqiy keyslar bilan almashtirish (Den Aroma, Perfona, Sarmilk, FIDDA, Rutera — raqamlari tasdiqlanganlari bilan). Agar bular haqiqiy mijozlar bo'lsa — portfolio'ga keys sifatida qo'shish.

---

## 3. 🟠 Yuqori (P1)

### P1-1. amoCRM webhook va hamkor bonuslari

`src/app/api/amocrm-webhook/route.ts`:
- `request.json()` kutadi va `X-JonBranding-Webhook-Secret` header talab qiladi. amoCRM'ning o'z webhook'lari `application/x-www-form-urlencoded` yuboradi va maxsus header qo'ya olmaydi. **Agar amoCRM to'g'ridan-to'g'ri shu URL'ga ulangan bo'lsa (n8n/Make relay'siz), hamkor bonuslari hech qachon hisoblanmaydi.** Tekshirish kerak.
- 206 va 212-qatorlarda emoji buzilgan (`ðŸ“¢`, `ðŸ”—`).
- `parse_mode: 'Markdown'` + sdelka nomi (`_`, `*` bo'lsa) → Telegram xabarni rad etadi.
- Telegram `fetch` "fire-and-forget" (`await`siz) — serverless'da javobdan keyin jarayon o'ldirilishi mumkin. `after()` ishlatish kerak.

### P1-2. blog-agent: avtomatik AI kontent SEO'ga xavf

`vercel.json` har kuni 08:00 UTC'da `/api/blog-agent`ni chaqiradi:
- faqat **5 ta qattiq yozilgan mavzu**dan tasodifiy tanlab, **4 tilda odam tekshiruvisiz** e'lon qiladi → yiliga ~1460 ta takrorlanuvchi AI maqola. Google'ning "scaled content abuse" siyosatiga to'g'ri keladi.
- `slugify` kirill va xitoy harflarini o'chiradi: ruscha maqola slug'i `--ru`, xitoycha `-zh` bo'ladi → **hamma ru/zh maqolalar bitta slug'da to'qnashadi**.
- `source.unsplash.com` 2024'da yopilgan; `imageUrl` baribir ishlatilmaydi.
- Markdown → Portable Text konvertatsiyasi `**qalin**`, ro'yxatlarni xom matn qilib qo'yadi.
- Hozir Sanity'da `post` hujjatlari **0 ta** — cron ishlamayapti yoki token yo'q. Ya'ni hozircha zarar yo'q, lekin token qo'yilgan kuni boshlanadi.

**Yechim:** cron'ni o'chirish yoki "draft" rejimiga o'tkazish (e'lon faqat qo'lda tasdiqlangandan keyin).

### P1-3. Bot himoyasi: Turnstile production'da o'chiq

`POST /api/submit-form` `{}` bilan → `Invalid input data` (Turnstile tekshiruvi o'tkazib yuborildi). Demak `TURNSTILE_SECRET_KEY` sozlanmagan. Himoya faqat honeypot + 5 so'rov/daqiqa/IP. Spam lead'lar amoCRM va Telegram'ni to'ldirishi mumkin.

### P1-4. Uzun lead maydonlari xabarni "yutib yuboradi"

`src/lib/lead-form-schema.ts`: `role`, `revenue`, `ambition`, `pain`, `budget`, `packageSummary`, `source`, `ctaSource`, `eventId` va boshqalarda `.max()` yo'q. Telegram xabari 4096 belgidan oshsa rad etiladi (fallback ham), amoCRM note ham shishadi. `eventId` Firestore hujjat ID'si sifatida ishlatiladi — `/` belgisi bo'lsa backup queue ham yiqiladi.

### P1-5. Til bo'yicha avtomatik redirect canonical URL'larda

- `en-US` brauzer `/narxlar`ga kirsa → **307** `/en/narxlar`. `ru` brauzer `/` → **307** `/ru`. Googlebot (tilsiz) → 200, lekin `Accept-Language: en` bilan → `/en`.
- Rossiya/Qozog'istondagi o'zbek auditoriya o'zbekcha havolani bossa, ruscha sahifaga tushadi.
- `/uz/*` → `/` redirect **307** (vaqtinchalik), `jonbranding.uz` → `www` ham **307**. SEO uchun 308/301 bo'lishi kerak.

**Yechim:** avtomatik redirectni faqat `/` uchun qoldirish (yoki banner "Sizga ruscha versiya qulayroqmi?" bilan almashtirish); `/uz/*` va apex redirectni 308 qilish (apex — Vercel Domains sozlamasida).

### P1-6. Bosh sahifa og'ir

- `src/app/[lang]/page.tsx:60` butun lug'atni (`uz.json` 112 KB, `ru.json` 170 KB) `'use client'` `HomeComponent`ga beradi → HTML ichida **164 KB RSC payload** (sahifa HTML'ining 44%).
- Bosh sahifada ~26 ta JS chunk, **~380 KB siqilgan JS**.
- 7 ta analitika vositasi: GTM, GA4, Google Ads, Meta Pixel, Hotjar, Clarity, Yandex Metrika (Webvisor bilan), + Amplitude. Oldingi auditda TBT 1.34 s edi.

**Yechim:** faqat kerakli lug'at bo'laklarini uzatish; analitikani 3-4 taga qisqartirish (GA4 + Meta + Yandex yetarli, Hotjar va Clarity bir-birini takrorlaydi).

### P1-7. Title'lar dublikat va lokalizatsiya qilinmagan

- 100+ URL'da brend ikki marta: `Revo | Jon.Branding Portfolio | Jon.Branding`, `... | Jon Branding | Jon.Branding`. Sabab: `title.template: "%s | Jon.Branding"` + sahifa o'zi ham brend qo'shadi.
- Portfolio keyslari, `/narxlar` ("Narxlar — Baxtiyor Gaziyev"), `/diagnostika`, POSM title'lari **4 tilda bir xil, o'zbekcha**.
- Portfolio sahifalarida o'z OG rasmi yo'q — ijtimoiy tarmoqda ulashganda umumiy rasm chiqadi.

---

## 4. 🟡 O'rta (P2)

| # | Muammo | Joy | Tavsiya |
|---|---|---|---|
| P2-1 | Sirlar URL query'da (`?secret=`) — Vercel loglari va proxy'larda qoladi | `content-agent`, `blog-agent`, `portfolio-sync`, `reviews-sync`, `testimonials`, `portfolio-telegram` | Faqat `Authorization: Bearer` qoldirish |
| P2-2 | FAQPage schema layout'da **har sahifada** (portfolio'da ham); bosh sahifada 2 ta FAQPage | `layout.tsx:216` | Faqat FAQ ko'rinadigan sahifalarda chiqarish |
| P2-3 | Sitemap'da canonical bo'lmagan URL'lar, `lastmod` yo'q; bitta keys ikki URL'da (`den-aroma` + `den-aroma-brend-transformatsiyasi`, `fidda` + `fidda-by-sevara-kumush-brendi`) | `src/app/sitemap.ts`, `portfolio-fallbacks.ts` | Fallback slug'larni Sanity bilan birlashtirish, `lastmod` qo'shish |
| P2-4 | `/ru/xizmatlar/brand-strategiyasi` → `/brand-strategy` (til yo'qoladi). Redirect ikki joyda (next.config + proxy). Eski sahifa fayli qolgan | `next.config.js:27-46`, `proxy.ts:29-35`, `xizmatlar/brand-strategiyasi/` | Bitta joyda, tilni saqlab redirect |
| P2-5 | Security header'lar ikki joyda turli qiymat bilan (HSTS 1 yil vs 2 yil, Referrer-Policy farqli); `X-Powered-By: Next.js` ochiq; `X-XSS-Protection` eskirgan | `proxy.ts:9-14`, `next.config.js` | Faqat `next.config.js`da qoldirish, `poweredByHeader: false` |
| P2-6 | `/api/report-error` Markdown parse_mode + stack trace (`_`, `*`) → Telegram rad etadi, xato hisobotlari yo'qoladi. Ochiq endpoint admin Telegram'ga spam qilishi mumkin | `report-error/route.ts` | HTML parse_mode + escape |
| P2-7 | Affiliate ro'yxatda `fullName` HTML'ga escape'siz qo'yiladi → `<` bo'lsa admin xabari yetmaydi | `affiliate/register/route.ts:79` | `escapeTelegramHtml` |
| P2-8 | Ichki sotuv texnikalari (`/sotuv-texnikalari`) ochiq URL — noindex, lekin havolasi bor har kim ko'radi | `src/app/[lang]/sotuv-texnikalari` | Admin sessiyasi orqasiga olish |
| P2-9 | 4 ta parallel portfolio pipeline: `content-agent` (IG+TG+Gemini), `portfolio-telegram`, `portfolio-sync`, `services/portfolio-bot`. `content-agent`da `maxDuration` yo'q, post boshiga 20 tagacha rasm ketma-ket | `src/app/api/*`, `services/` | Bittasini tanlash, qolganini o'chirish |
| P2-10 | `h1`: `/diagnostika`da 2 ta, `/xizmatlar/patent-kalkulyatori` va `/patent-narxi-hisoblagich`da 0 ta | tegishli sahifalar | Har sahifada bitta `h1` |
| P2-11 | CI Node 20 da (2026-aprelda EOL). `security-audit.yml` natijadan qat'i nazar o'tadi (`\|\| true`) — hech qachon fail bo'lmaydi | `.github/workflows/` | Node 22; high/critical'da fail |
| P2-12 | Blog rasmlari 0.7–1 MB webp | `public/blog/*.webp` | 200 KB'gacha siqish |
| P2-13 | `/api/instagram` production'da `400 Token missing` | env | Token qo'yish yoki route'ni o'chirish |
| P2-14 | `/umarin-privacy-policy` (boshqa ilova siyosati) va `/uslub-test` indekslanadi | metadata | `noindex` |

---

## 5. 🔵 Past / texnik qarz (P3)

1. **Repo og'irligi:** `services/portfolio-bot/node_modules` (10 019 fayl) + `node_modules.zip` (26 MB) + `node_modules.tar.gz` (23 MB) git'da. `.git` hajmi 91 MB. `.gitignore`da `node_modules/` bor, lekin fayllar undan oldin commit qilingan.
2. **Keraksiz fayllar root'da:** `*.bak-20260722-0951` (3 ta), `homepage-check.png` (1.6 MB), `lighthouse-report.json`, `JonBranding_AI_Memory_Pack.zip`, `graphify-out/` (6 MB), `.agent/.agents/.trae/.kilocode/.aider-desk/.jules` (AI tooling), `package-lock.json` + `pnpm-lock.yaml` birga.
3. **54 ta o'lik fayl (~6 000 qator):** `sections/hero.tsx`, `dashboard-hero.tsx`, `at-awards.tsx`, `at-sample-report.tsx`, `instagram-feed.tsx`, `at-quotes.tsx`, `ui/chart.tsx`, `ui/menubar.tsx`, `blog-post-client.tsx`, `home-deferred-content.tsx`, `hooks/use-exit-intent.ts` va boshqalar — hech qayerdan import qilinmaydi.
4. **Ishlatilmaydigan paketlar:** `@amplitude/analytics-node`, `@next/third-parties`, `@vercel/frameworks`, `dompurify` (+ `@types/dompurify`), `hls.js` (faqat webpack alias'da), `html-to-image`, `node-fetch`, `patch-package`.
5. `atelier-sections.tsx` — 2 916 qator bitta faylda.
6. 229 ta `any`, `src/app/api` va `src/lib`da 56 ta `console.*` (CLAUDE.md qoidasi `logger`ni talab qiladi).
7. `npm audit`: 11 ta moderate (hammasi `uuid` orqali `firebase-admin` va `sanity`dan). High/critical yo'q.
8. `next.config.js` `images.remotePatterns`da eski `cdn.prod.website-files.com` (Webflow) va `images.unsplash.com`.
9. `deploy.yml` workflow'da shaxsiy Telegram `chat_id` ochiq yozilgan.

---

## 6. ✅ Yaxshi tomonlar

- Typecheck, ESLint — 0 xato; Vitest — 38 fayl, 269 test o'tdi.
- Repo va git tarixida API kalit/token topilmadi.
- Admin sessiya HMAC bilan, timing-safe taqqoslash, Firestore'da taqsimlangan rate-limit.
- Lead yo'qolmasligi uchun o'ylangan: Telegram fallback chat, amoCRM xato bo'lsa Firestore queue, 401'da token yangilash.
- Instagram OAuth: `state` cookie + admin auth.
- Vimeo webhook HMAC imzo bilan tekshiriladi.
- Markdown blog'da xom HTML o'chirilgan (stored XSS'dan himoya), `sanitizeRichText` allowlist bilan.
- Analitika cookie roziligidan keyin yuklanadi.
- Tarjimalar paritetda: 4 tilda 1214 kalit, bo'sh qiymat yo'q.
- HTML darajasida accessibility yaxshi: bosh sahifada alt'siz rasm, nomsiz tugma/havola yo'q, bitta `h1`.
- Affiliate RLS to'liq deny, faqat service-role.

---

## 7. Tuzatish rejasi

### 1-hafta — pulni qaytarish (P0)
1. ✅ Canonical: layout'dan olib tashlash, har sahifaga o'z canonical'i + test (P0-1) — shu PR'da tuzatildi; `/online-brief/wizard` sitemap'dan chiqarildi (canonical'i `/online-brief`ga qaraydi)
2. ✅ CSP'ga Google Ads, Clarity, GA4 regional, Hotjar, Yandex va Amplitude domenlari (P0-2) — shu PR'da tuzatildi + test
3. Oisha vidjetini yashirish yoki Telegram fallback (P0-5)
4. `ATQuotes` client override'ni o'chirish + zh/en sharhlarni tiklash (P0-4)
5. Tasdiqlanmagan natijalarni haqiqiy keyslar bilan almashtirish (P0-6) — **egasining qarori kerak**
6. Navigator: yo tuzatish, yo o'chirish (P0-3) — **egasining qarori kerak**

### 2-hafta — himoya va ishonchlilik (P1)
7. amoCRM webhook ulanish usulini tekshirish, form-urlencoded qo'llab-quvvatlash, emoji va parse_mode (P1-1)
8. blog-agent cron'ni o'chirish / draft rejimi (P1-2)
9. Turnstile kalitlarini Vercel'ga qo'shish (P1-3)
10. Lead schema'ga `.max()` cheklovlari (P1-4)
11. Title template dublikatlarini tozalash, portfolio title/OG lokalizatsiyasi (P1-7)

### 3–4-hafta — tezlik va tartib (P1-P3)
12. Bosh sahifaga faqat kerakli lug'at bo'laklari (P1-6)
13. Analitikani qisqartirish (P1-6)
14. Til redirect siyosati va 308 (P1-5)
15. P2 ro'yxati
16. Repo tozalash: `node_modules`/arxivlarni git'dan chiqarish, o'lik fayllar, ishlatilmaydigan paketlar (P3)

---

## 8. Egasi (Vercel/Supabase paneli) tomonidan qilinadigan ishlar

Kod o'zgarishisiz, faqat sozlama:

| Sozlama | Qayerda | Nima uchun |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env | Navigator ishlashi uchun |
| `OISHA_API_URL`, `OISHA_SECRET_KEY` | Vercel env | Oisha chat |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel env | Spam himoyasi |
| `INSTAGRAM_ACCESS_TOKEN` | Vercel env | `/api/instagram` |
| `jonbranding.uz` → `www` redirect turi | Vercel Domains | 307 → 308 |
| amoCRM webhook manzili va formati | amoCRM / n8n | Hamkor bonuslari |
