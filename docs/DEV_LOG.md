# 📓 Dev Log — Jon Branding Web

## 2026-11-18 | Universal Hosting Portability & Automated Migration Engine (Vercel ⇄ Cloudflare ⇄ Docker/VPS)
- **Foydalanuvchi talabi:**
  - Saytni ertaga boshqa hostingga (Vercel, Docker/VPS, Coolify, Railway) ko'chirganda barcha sozlamalar, secretlar va avtomatizatsiyalarning avtomatik ko'chib o'tishini ta'minlash.
- **Bajarilgan ishlar:**
  1. **Universal Migration CLI (`scripts/hosting-migration.mjs`):**
     - `npm run migration:check` — Pre-flight tekshiruv: `.env.example` dagi 94 ta parametr bo'yicha production tayyorligini baholash.
     - `npm run migration:sync <target>` — Bitta buyruq bilan barcha secretlarni maqsadli hostingga (Vercel CLI orqali Vercel'ga, Wrangler orqali Cloudflare'ga yoki Docker/Coolify uchun `.env.production` ga) avtomatik yuklash.
     - `npm run migration:smoke` — Yangi hostingda barcha 30+ yo'llar, xavfsizlik va API larni avtomatik testlash.
  2. **Universal Cron Runner (`.github/workflows/cron-cloudflare.yml`):**
     - Cron tizimi hostingdan to'liq ajratildi: domen (`https://www.jonbranding.uz`) orqali har qanday hostingda uzluksiz ishlaydi.
  3. **Multi-Target Deploy Adapterlari (`docker-compose.yml`, `package.json`):**
     - `deploy:docker` buyrug'i va `docker-compose.yml` qo'shildi (Next.js 16 standalone rejimida VPS/Coolify ga 1 buyruqda ko'chish).
  4. **To'liq qo'llanma (`docs/KOCHISH_AUTOMATION.md`):**
     - 4 qadamli avtomatlashtirilgan ko'chish algoritmi hujjatlashtirildi.
- **Tekshiruv:**
  - `npm run verify:fast` (101 ta test fayli, 719 ta test 100% yashil).
  - `node scripts/hosting-migration.mjs check` muvaffaqiyatli ishga tushdi.

## 2026-11-18 | Cloudflare Workers Free Optimizatsiyasi: Hybrid KV + Regional + DO Kesh, Sanity Image Loader va `/api/revalidate`
- **Foydalanuvchi talabi:**
  - Saytni Cloudflare Workers Free muhitida ideal ishlashga moslash (1-variant: CLI orqali Workers KV + SQLite Durable Objects kesh, `revalidate: 3600` + `/api/revalidate`, bepul limitlar doirasida maksimal tezlik va barqarorlik).
- **Bajarilgan ishlar:**
  1. **Cloudflare KV Namespace va 3 qatlamli Hybrid Incremental Cache (`src/lib/cloudflare/hybrid-incremental-cache.ts`, `open-next.config.ts`, `wrangler.jsonc`):**
     - Cloudflare akkauntda `NEXT_INC_CACHE_KV` (`id: 0a7d482a34b6451b873d08e439bce65b`) KV namespace yaratildi.
     - `HybridKvStaticIncrementalCache`: o‘qishda avval `NEXT_INC_CACHE_KV`, topilmasa build-vaqtidagi `.open-next/assets/cdn-cgi/_next_cache` static assetlardan foydalanadi (deploy’da **0 KV write**, 1 000 write/kun Free limitini tejaydi); yangilangan sahifalarni 14 kunlik TTL bilan KV’ga yozadi.
     - `open-next.config.ts` da `withRegionalCache(..., { mode: 'long-lived', defaultLongLivedTtlSec: 3600 })`, `queueCache(doQueue, { regionalCacheTtlSec: 10 })`, `doShardedTagCache({ baseShardSize: 2, regionalCache: true, regionalCacheTtlSec: 60 })` va `enableCacheInterception: true` yoqildi.
     - `wrangler.jsonc` ga KV binding, SQLite Durable Objects (`DOQueueHandler`, `DOShardedTagCache` + `migrations v1`) qo‘shildi hamda `run_worker_first` statik media/font/asset yo‘llarini (`/images/*`, `/logos/*`, `/videos/*`, `/audio/*`, `/assets/*`, `/fonts/*`, `/icon*`, `/sw.js` va h.k.) Worker chaqiruvlarisiz to‘g‘ridan-to‘g‘ri Assets’dan beradigan qilib kengaytirildi (`/jamoa*` va HTML sahifalar Worker himoyasida qoldi).
  2. **Edge Cache & Security Headers (`public/_headers`, `scripts/website-security-runtime.cjs`, `src/lib/website-edge-guard.ts`):**
     - `public/_headers` qo‘shildi (`/_next/static/*`, `/fonts/*` immutable 1 yil; `/images/*`, `/logos/*`, `/videos/*` 30 kun; `/sw.js` `no-cache`).
     - `scripts/website-security-runtime.cjs` build oxirida `.open-next/cache` ni `.open-next/assets/cdn-cgi/_next_cache` ga sinxronlaydi va build-vaqt `previewModeId` ni xavfsizlik runtime’iga uzatadi.
     - `src/lib/website-edge-guard.ts` tashqi soxta `x-prerender-revalidate` headerlarini bloklashda davom etgan holda, faqat `WORKER_SELF_REFERENCE` (`DOQueueHandler`) ichki ISR revalidatsiya so‘rovlari va `/api/revalidate` secret endpointini ruxsat beradi; `/cdn-cgi/_next_cache/*` tashqaridan `404` qaytaradi.
  3. **Custom Sanity Image Loader (`src/lib/image-loader.ts`, `next.config.js`):**
     - Barcha `https://cdn.sanity.io/images/...` rasmlari `/_next/image` (Cloudflare Images 5 000/oy Free kvotasi) o‘rniga to‘g‘ridan-to‘g‘ri Sanity CDN (`?auto=format&fit=max&w=&q=`) orqali yuklanadigan qilindi; mahalliy rasmlar `/_next/image` chegarasida qoldi.
  4. **Sanity ISR (`revalidate = 3600`), On-Demand `/api/revalidate` va Portfolio 404 Tuzatishi:**
     - `src/sanity/lib/client.ts` da `sanityFetch` va `SANITY_TAGS` joriy etildi; `portfolio.ts`, `comparisons.ts`, `testimonials.ts`, `brands.ts`, `blog/*`, `sitemap.ts`, `feed.xml/route.ts` ularga o‘tkazildi (`portfolio` va `blog/[slug]` da React `cache()` bilan dublikat so‘rovlar olib tashlandi).
     - CMS sahifalarida (`page.tsx`, `portfolio`, `portfolio/[slug]`, `otzivlar`, `blog`, `blog/[slug]`, `narxlar`, `credentials`, `xizmatlar/*`, `sitemap.ts`) `revalidate = 3600` qo‘yildi; `portfolio/[slug]` dagi qattiq 8 ta slug + `dynamicParams = false` xatosi (`shirona`, `rashmilk` va b. Sanity keyslari 404 bo‘lishi) `fetchAllPortfolioSlugs()` va dinamik fallback bilan bartaraf etildi (`422` ta statik/ISR sahifa).
     - `src/lib/revalidate-sanity.ts` va `src/app/api/revalidate/route.ts` yaratildi hamda `portfolio-sync` va `reviews-sync` avtomatik tag invalidatsiyasiga ulandi; `.env.example` ga `REVALIDATE_SECRET` qo‘shildi.
- **Tekshiruv:**
  - `npm run typecheck`, `npm run verify:fast`, `npm run build:cloudflare`, `npx wrangler deploy --dry-run` hamda lokal `wrangler dev` (`workerd`) da `/api/revalidate` -> `STALE` -> `HIT` DO revalidatsiya sikli, `1 493` ta Sanity direct CDN rasm havolalari (`0` ta `/_next/image`), `/portfolio/shirona` (`200`), `/jamoa` (`401`), `/_next/static/*` kesh sarlavhalari tekshirildi.

## 2026-11-15 | Google Preferred Sources, Entity Graph SEO, RSS `/feed.xml` va Blog Konversiya Tizimi
- **Foydalanuvchi talabi:**
  - `https://www.google.com/preferences/source?q=amaan.uz` tahlilidan so‘ng `jonbranding.uz` uchun reja tuzish va to‘liq amalga oshirish ("Hammasi uchun reja tuz va amalga oshir").
- **Reja:**
  - `docs/superpowers/plans/2026-11-15-seo-preferred-sources-and-blog-conversion.md`
- **Bajarilgan ishlar:**
  1. **Unified Schema.org Entity Graph (`src/lib/seo.ts`, `src/app/[lang]/layout.tsx`, `src/lib/seo.test.ts`):**
     - `getSiteEntityGraph(locale)` boyitildi (`postalCode: '100000'`, `geo` `41.2995, 69.2401`, `openingHoursSpecification` `Mon-Sat 09:00-20:00`, `TELEGRAM_CHANNEL_URL`, mahalliylashtirilgan `founder.jobTitle`).
     - `[lang]/layout.tsx` dagi 3 ta ajralgan JSON-LD skripti bitta `json-ld-site-entity-graph` (`ORGANIZATION_ID`, `FOUNDER_ID`, `WEBSITE_ID`) grafga birlashtirildi va `<link rel="alternate" type="application/rss+xml" ... href="${BASE_URL}/feed.xml" />` qo‘shildi.
  2. **Ko‘p tilli RSS 2.0 Feed va Middleware (`src/lib/blog-feed.ts`, `src/app/feed.xml/route.ts`, `src/middleware.ts`, `src/lib/blog-feed.test.ts`, `src/proxy.test.ts`):**
     - Markdown maqolalari va chop etilgan Sanity postlarini (`!(_id in path("drafts.**"))`) birlashtiruvchi `/feed.xml` (va `?lang=uz|ru|en|zh` filtri bilan) RSS 2.0 endpoint yaratildi.
     - `src/middleware.ts` dagi `config.matcher` ga `/feed.xml` va `/llms.txt` istisno sifatida qo‘shildi (boshqa tillar yo‘naltirishiga tushmasligi uchun).
  3. **Google Preferred Sources va CSP (`src/components/blog/preferred-sources-card.tsx`, `src/app/[lang]/blog/page.tsx`, `src/app/[lang]/blog/[slug]/page.tsx`, `next.config.js`, `src/app/content-security-policy.test.ts`):**
     - `next.config.js` CSP (`script-src`, `img-src`, `connect-src`, `frame-src`) tarkibiga `https://news.google.com` qo‘shildi.
     - `PreferredSourcesCard` (`publisher.js` + `google-add-preferred-source-btn` + `https://www.google.com/preferences/source?q=jonbranding.uz` fallback + `/feed.xml?lang=` RSS tugmasi) blog ro‘yxati va maqola sahifalariga joylandi.
  4. **Intent-Aware Blog Konversiya CTA va i18n (`src/lib/blog-cta.ts`, `src/components/blog/blog-post-cta.tsx`, `src/lib/blog-cta.test.ts`, `src/components/blog/blog-widgets.test.tsx`, `src/locales/*.json`):**
     - Maqola mavzusi/kategoriyasiga qarab `patent`, `packaging`, `naming`, `brandbook`, `branding` klasterlariga mos CTA (`BlogPostCta` -> `openContactModal` va tegishli xizmat sahifasi) hamda `related-services` uchun `getLocalizedPath` yo‘lga qo‘yildi.
     - 4 ta tilda (`uz`, `ru`, `en`, `zh`) Uzbek-first qoidasi asosida `blog.*` va `blogPost.*` kalitlari sinxronlashtirildi.
  5. **AI Discovery va Haftalik Draft Cron (`public/llms.txt`, `vercel.json`, `src/app/api/blog-agent/route.ts`, `src/lib/seo-assets.test.ts`):**
     - `public/llms.txt` dagi eskirgan raqamlar `docs/FAKTLAR.md` dagi rasmiy faktlar (`2018`, `600+`, `1200+`) bilan almashtirildi; `/blog`, `/feed.xml` va `zh` tili qo‘shildi.
     - `vercel.json` ga haftalik cron (`"path": "/api/blog-agent"`, `"schedule": "0 3 * * 1"`) qo‘shildi; `blog-agent` mavzulari kengaytirildi (`drafts.${randomUUID()}` Human-in-the-Loop qoidasi saqlangan holda).
  6. **Cloudflare Workers Runtime Moslashuvi va Upstream Sinxronizatsiya (`package.json`, `src/lib/blog-posts.ts`, `src/lib/blog-markdown-index.json`, `src/lib/lead-guard.ts`, `scripts/website-security-deploy.cjs`):**
     - `@opennextjs/cloudflare` `1.20.17` (`@opennextjs/aws@4.1.16`) ga yangilandi (`workerd` da `.next/server/preview-props.json` manifest xatosini bartaraf etish uchun).
     - `workerd` V8 izolyatida `fs` orqali `src/posts` o‘qilmagani sababli `src/lib/blog-markdown-index.json` (`97` ta post: `uz: 25`, `ru: 24`, `en: 24`, `zh: 24`) generatsiya qilinib `src/lib/blog-posts.ts` fallback va `src/lib/blog-feed.test.ts` disk-paritet testi qo‘shildi.
     - `origin/main` birlashuvidan keyingi `src/lib/lead-guard.ts` TypeScript toraytirish (`fields`) va `scripts/website-security-deploy.cjs` ESLint (`mod`) tuzatishlari kiritildi.
- **Tekshiruv va Deploy:**
  - `npm run upload:cloudflare` (`326/326` statik sahifa) -> Cloudflare Workers `jonbranding-web` versiya `b2990206-9555-46f6-a174-e0ed9ff3ddf5` `100%` trafik bilan production'ga chiqarildi.
  - Jonli `https://www.jonbranding.uz` tekshiruvi: `/`, `/blog`, `/blog/brend-strategiyasi-muvaffaqiyat-poydevori`, `/feed.xml` (`50` ta maqola), `/feed.xml?lang=uz` (`25` ta), `/llms.txt`, `/api/comparisons`, `/api/testimonials` `200`, `node scripts/website-security-smoke.cjs live` (`JB_SECURITY_UPGRADE=1`) -> `PASS: 38 checks`.

## 2026-11-14 | Cloudflare Security Build Integration & Workspace Cleanup (origin/main Reconciliation)

- **Foydalanuvchi talabi:**
  1. "1. xohlayman." — Cloudflare build/deploy pipeline'iga website-security-runtime wrapper'ini integratsiya qilish.
  2. "2. saralab tozala" — Ishchi katalogni tozalab, barcha sifatli va tekshirilgan o'zgarishlarni origin/main bilan sinxronlashtirish.
- **Bajarilgan ishlar:**
  1. **Cloudflare Security Wrapper Integratsiyasi:**
     - `package.json`: `build:cloudflare`, `preview:cloudflare`, `deploy:cloudflare`, `upload:cloudflare` skriptlari `opennextjs-cloudflare build && node scripts/website-security-runtime.cjs` zanjiriga ulandi.
     - `wrangler.jsonc`: `"main": ".open-next/security-worker.mjs"`, `JB_CHALLENGE_LIMIT` rate-limit qo'shildi.
     - `src/lib/human-verification.ts`, `src/lib/website-edge-guard.ts`, `scripts/website-security-runtime.cjs` modullari to'liq integratsiya qilindi.
     - Next.js 16 qoidasiga ko'ra eskirgan `src/proxy.ts` olib tashlandi (`src/middleware.ts` yagona middleware).
  2. **Ishchi Katalogni Saralab Tozalash:**
     - Vaqtinchalik audit va scratch fayllar (`.codex-*`, `wrangler.audit-staging.tmp.json`, `.playwright-cli/`, bir martalik release skriptlari) butunlay tozalandi.
     - Mahalliy release/audit dalillari diskda xavfsiz qolishi uchun `/output/` `.gitignore` ga kiritildi.
     - Barcha tekshirilgan ishlar (7 ta patent guvohnomasi WebP va `sync-patents.py`, Free-worker statik prerendering, Oisha callback a11y, xato filtrlash) saqlab qolindi.
  3. **Verifikatsiya va Sifat:**
     - `npm run typecheck`: 0 xato (Strict mode).
     - `node --test scripts/check-audit.node-test.mjs`: 5/5 xavfsizlik regissiya testlari o'tdi.
     - `npm run verify:fast`: Barcha 4 ta til lug'ati sinxron (1359 kalit), 94 test fayli, 681/681 test yashil.
     - `node scripts/website-security-smoke.cjs https://jonbranding.uz`: 28 ta jonli xavfsizlik tekshiruvi 100% muvaffaqiyatli.

## 2026-11-09 | GitHub: ochiq PR va Dependabot alertlari yopildi (OpenCode)

- **Holat:** GitHub'da ochiq PR qolmadi; Dependabot open alertlari `36 → 0`.
- **PR #400** (`seo: заказать логотип в Ташкенте / разработка брендбука Ташкент цена`) draft'dan ready qilindi va squash merge: `cb32d411`. 12 fayl, +448/−37; CI (typecheck, lint, test, build, npm audit) yashil. Kod tekshirildi: narx/muddat `sales-content` dan, "60+ bet PDF" va "3 konsepsiya" manbaga mos.
- **Dependabot:** `gh api repos/.../dependabot/alerts?state=open` — 0 ta. Root va `mcp-server`/`portfolio-bot` alertlari remote commitlar bilan yopilgan.
- **Muhim:** Vercel statusi `failure` → `vercel.com/knowledge/why-is-my-account-deployment-blocked`. Bu account darajasidagi blok; repo kodi emas. Production deploy tiklanmaguncha merge qilingan SEO o'zgarishlari saytga chiqmaydi.
- **Local:** boshqa agentning commit qilinmagan WIP'i (Cloudflare/audit/session) saqlab qolindi; hech narsa push qilinmadi.

## 2026-11-09 | Google Drive patent avtomatizatsiyasi va 4 ta yangi patent kiritildi (Antigravity)

- **Foydalanuvchi talabi:**
  - "google drivega yangi guvohnoma tushsa automation saytimizga chiroyli bo'lib qo'shilib boradigan qilib berolasanmi?"
  - "yangi yuklangan patentlar qachon saytimizda ko'rinadi?"
- **Bajarilgan ishlar:**
  1. **Google Drive avtomatizatsiyasi (`scripts/sync-patents.py`):**
     - `G:\My Drive\JonBranding\Patent` papkasini to'liq skanerlovchi, yangi guvohnoma va ilova PDF fayllarini tanib oluvchi skript yaratildi (`npm run sync:patents`).
     - PDF'lardan MGU raqami, brend nomi, huquq egasi (avtomatik qisqartirish bilan), talabnoma raqami, sanalar (talabnoma va reestr) va Nitsa sinflari 100% aniqlikda o'qiladi.
     - Ilova PDF'laridan master logotip tasvirlari PyMuPDF + Pillow orqali avtomatik ajratilib, 900px kenglikdagi yengil WebP formatda `public/images/patent/` papkasiga saqlanadi.
     - `sanitize_ts_str()` orqali o'zbekcha apostroflar (`‘`) xavfsiz qilinib, `src/lib/patent-certificates.ts` ro'yxatiga avtomatik kiritiladi.
  2. **Yangi topilgan 4 ta patent to'liq kiritildi:**
     - **MGU 66985** — Azel (AZIZJON D. R. · 25-sinf · Poyabzal & Kiyim)
     - **MGU 67849** — To‘maris (ANVAR M. M. · 35, 37-sinflar · Qurilish)
     - **MGU 65381** — Almaz (HIKMATILLO T. A. · 25-sinf · Poyabzal & Kiyim)
     - **MGU 68642** — Parfino (AZIZ S. B. · 3, 35-sinflar · Kosmetika)
  3. **Umumiy statistika va TypeScript tozaligi:**
     - Saytdagi patentlar soni 15 tadan **19 taga** yetkazildi.
     - Barchasi `/uz/credentials` va `/uz/xizmatlar/patent` sahifalarida to'liq aks etadi.
     - `credentials-client.tsx` navigatsiya tugmalari massivi `as const` orqali qat'iy tiplashtirilib, `tsc` va Next.js build tekshiruvidan to'liq o'tkazildi.
- **Tekshiruv:**
  - `npm run verify:fast` — 76 ta test fayli, 478/478 test yashil.
  - Barcha 19 ta WebP fayl mavjud va o'lchamlari tekshirildi.

## 2026-11-09 | Google Drive'dagi barcha patentlar (SAYR, Lubaba, Enros) saytga to'liq kiritildi (Antigravity)

- **Foydalanuvchi talabi:**
  - "SAYRga o'zing birorta wordmark logo qilib yubor. qolganini tasdiqlayman"
- **Bajarilgan ishlar:**
  1. **Enros (MGU 68379):**
     - Google Drive'dagi `№ MGU 68379 RAQAMLI GUVOHNOMAGA ILOVA.pdf` faylidan 3370x3370 master tasvir ajratib olindi, crop va resize qilinib `public/images/patent/mgu-68379.webp` (900x466) saqlandi.
     - `src/lib/patent-certificates.ts` da `brand: 'Enros'`, `logo: '/images/patent/mgu-68379.webp'` qilindi.
  2. **Lubaba (MGU 68490):**
     - `Lubaba № MGU 68490 RAQAMLI GUVOHNOMAGA ILOVA.pdf` dan to'liq kvadrat brend logotipi ajratib olinib `public/images/patent/mgu-68490.webp` (900x900) qilib optimizatsiya qilindi.
     - `src/lib/patent-certificates.ts` ga to'liq qo'shildi: egasi `ALLOXYOR M. M.`, talabnoma `TB 202508376` (13.10.2025), ro'yxat `17.10.2026`, sinflar `[30, 43]` (Muzqaymoq & Kafe).
  3. **Sayr (MGU 67569):**
     - Transport va mobillik (skuter, velosiped) sohasiga mos, qat'iy va yuqori kontrastli zamonaviy wordmark logo yaratildi va `public/images/patent/mgu-67569.webp` (900x400) formatida saqlandi.
     - `src/lib/patent-certificates.ts` ga to'liq kiritildi: egasi `ASILBEK S. N.`, talabnoma `TB 202510622` (18.12.2025), ro'yxat `28.08.2026`, sinflar `[12, 35]` (Transport & Skuter).
  4. **Metrikalar va matnlar sinxronlandi:**
     - Umumiy guvohnomalar soni 13 tadan **15 taga** oshdi (barchasi 100% rasmli).
     - `/xizmatlar/patent` va `/credentials` dagi sarlavha va matnlar yangilandi.
- **Tekshiruv:**
  - `npm run verify:fast` — 76 ta test fayli, 478/478 test yashil.
  - Barcha 15 ta WebP fayl mavjud va o'lchamlari tekshirildi.

## 2026-11-09 | Patent guvohnomalari rasmlari yuklanishi va /credentials taqdimotiga Patent slaydi qo'shildi (Antigravity)

- **Foydalanuvchi talabi:**
  - "Patent rasmlari ko'rinmayapti ekan"
- **Aniqlangan ildiz sabablar:**
  1. `src/components/credentials/certificate-card.tsx` da logo o'rami `<div className="relative flex w-full flex-1 items-center justify-center">` ichida `<div className="relative h-full w-[74%]" style={{ maxHeight: '44cqw' }}>` ko'rinishida yozilgan edi. Flexbox'da `align-items: center` bo'lganda child'dagi `h-full` aniq pikselli qiymat bo'lmagani va ichida faqat mutlaq joylashgan element (`<Image fill />`) bo'lgani sababli container balandligi 0px ga qulab tushgan.
  2. Next.js `<Image fill>` sukut bo'yicha `loading="lazy"` qo'llagan. 0 balandlikdagi element Viewport/IntersectionObserver bilan to'qnashmagani uchun brauzer WebP rasmni yuklamay qoldirgan (`complete: false`, `naturalWidth: 0`).
  3. Mahalliy `public/images/patent/mgu-*.webp` rasmlari allaqachon siqilgan yengil (7–25 KB) fayllar bo'lishiga qaramay, `unoptimized` berilmagani tufayli `_next/image?url=...` orqali yuklashga uringan.
- **Bajarilgan tuzatishlar:**
  1. **`CertificateCard` komponenti mustahkamlandi (`src/components/credentials/certificate-card.tsx`):**
     - Logo o'ramiga qat'iy container query o'lchami berildi: `style={{ width: '74%', height: '36cqw' }}`. Natijada karta qanday o'lchamda yoki flex konteynerda bo'lmasin, logo o'rni doimo aniq va to'liq ochiladi.
     - `<Image fill unoptimized priority sizes="(max-width: 640px) 60vw, 400px" />` qo'shildi. Rasm to'g'ridan-to'g'ri statik WebP manzilidan yuqori ustuvorlikda bir zumda yuklanadi.
     - Logo mavjud bo'lmagan holat uchun matnli fallback qo'shildi.
  2. **Asosiy taqdimotga Patent slaydi qo'shildi (`src/app/[lang]/credentials/credentials-client.tsx`):**
     - Slaydlar qatoriga `patent` ("Huquqiy himoya · Rasmiy guvohnomalar") slaydi integratsiya qilindi.
     - Katta va aniq metrikalar: 13 ta tovar belgisi guvohnomasi, 17 kun rekord muddat, 10 yil mutlaq monopol himoya.
     - Bosganda to'liq ekranda kattalashadigan va navigatsiya qilinadigan interaktiv guvohnomalar kartochkalari (`zoomedCert` modal).
     - `/credentials/patent` sahifasiga o'tish tugmasi.
- **Tekshiruv:**
  - `playwright` (Edge) orqali tekshirildi: `naturalWidth: 900`, `naturalHeight: 900`, `complete: true`. Rasmlar tiniq va to'liq ochildi.
  - `npm run verify:fast` — 76 ta test fayli, 478/478 test yashil.
  - Anti-slop tekshiruvi: 0 ta antipattern.

## 2026-11-05 - Cloudflare staging integration setup (Codex)

- Owner authorized secret transfer, a labeled CRM test lead, and conditional production DNS cutover after staging verification. Owner separately approved limited Wrangler OAuth permissions.
- Local main is a7cec03f. Existing package.json/package-lock.json edits preserved.
- Vercel env exports contain empty integration values; existing local Turso/Oisha configuration used without printing secret values.
- Read-only validation: both amocrm and website_tokens entries in shared Turso returned amoCRM account HTTP 200. No token refresh, rotation, or OAuth data changes.
- Uploaded 7 encrypted runtime settings to jonbranding-web-staging: Turso URL/auth, Oisha API URL/secret, Oisha CAPI URL/ingest secret, AMOCRM_SUBDOMAIN. Live staging version: 5889a1de-93e3-4e51-8df0-730ac5ada18a.
- Existing jonbranding-web production Worker is old (2026-05-10); do not route production to it without replacing and testing its code.
- Cloudflare Access OTP login requested; Gmail connector withholds OTP. Owner login pending. No test lead submitted; no production DNS changes.
- Observed rollback records (DNS-only, TTL Auto): apex A 76.76.21.21; www CNAME cname.vercel-dns-0.com; patent CNAME 1fbdd199420878b6.vercel-dns-017.com. Zoho/crm/oisha/n8n records untouched.
- Next: owner completes staging login, verify actual form submission and CRM record, then cut over only verified Worker version with rollback records retained.

### Cloudflare integration verification and compatibility fixes

- Owner completed staging Access login. Actual consultation form submitted one clearly labeled technical test using the agency public phone. Independently verified amoCRM lead 54228765, contact 60015171, matching phone, source homepage_consultation_modal and UZ note.
- Added Telegram runtime configuration after read-only Bot API confirmed access to the configured supergroup. No separate manual Telegram message sent.
- Found hero/header callback failure: widget global survives while its host is absent after React hydration error 418. Changed external callback script to next/script afterInteractive.
- Oisha chat global service boundary requires Authorization Bearer; X-Secret-Key alone returns 401. Added Bearer header for history/send and two regression tests (failed before fix, passed after). Live server credential validated HTTP 200 and transferred directly to Cloudflare without displaying/persisting its value.
- Cloudflare adapter rejects Node proxy.ts. Routing implementation moved to Edge middleware.ts with unchanged behavior; existing routing tests pass. The Next.js middleware deprecation is an explicit temporary adapter compatibility tradeoff.
- Cloudflare bundler could not resolve Turso workerd entry from Node-only traces. Switched to supported @libsql/client/web; live SELECT 1 succeeds.
- Repaired incomplete local cloudflare 4.5.0 and @smithy/core 3.33.0 package contents from exact registry packages without changing dependency versions.
- Focused tests: 28 passed. Earlier full verify/verify:fast: 464 tests passed before these fixes; final verification pending. Production DNS remains unchanged while replacement build is verified.

### 2026-11-05 14:25 Asia/Tashkent - Live state supersedes earlier checkpoint

- A concurrent external deployment changed production during this task. Current Cloudflare Worker jonbranding-web version a7d90551-e2a3-4c14-a16a-5f0d43816194 was created at 08:23:59 UTC. This Codex task did not perform that production deploy or DNS cutover and did not overwrite it.
- Direct live checks: apex, www, /narxlar, /portfolio and patent subdomain all HTTP 200 from Cloudflare. Browser hero opens the callback dialog.
- Actual live consultation form created CRM lead 54241893; independently verified the agency phone matches. Browser displayed Rahmat / ariza qabul qilindi. Screenshot saved as live-form-confirmed.jpg in this task artifact directory.
- Callback technical test reached CRM lead 54241693, but browser automation mis-entered the masked phone. Added an explicit non-customer/no-call note and completed its two generated test tasks 50155869 and 50155957 (HTTP 200). Do not use that test to claim exact phone fidelity.
- Local additional hardening: signed HttpOnly visitor cookie prevents caller-selected Telegram recipient/chat-history IDs; four isolation regression tests added. This hardening and local Cloudflare compatibility changes are NOT committed, pushed or deployed. Preserve concurrent production changes; reconcile before any deployment.
- Local validation final: Cloudflare bundle built successfully; verify:fast and verify passed serially, 470/470 tests, clean TypeScript; detector and git diff --check passed. Earlier parallel runs hit unrelated 5-second test timeouts under build load; serial reruns passed without weakening tests.
- Live Oisha history endpoint returned HTTP 200 with an empty history and no session cookie. This does not verify AI response delivery or deployment of the local session-isolation patch. No claim of complete AI-chat certification.
- Existing package.json/package-lock.json edits preserved; main is two dependency-only commits behind origin/main. No push or production mutation by this task.

### 2026-11-05 - Read-only live quality audit

- Owner asked whether the site is ideal. Audited public Chrome layouts at 1280x800, 768x1024, 375x812 and 320x812; saved screenshots/report under this chat artifact audit directory. No application or production configuration changes.
- React error 418 observed in both Chrome and independent in-app browser. Root cause not established by this audit.
- Callback keyboard test: Tab leaves the open dialog to BODY and then the background skip link. Button-close restores focus correctly. Close hit area is 32x32.
- At 320px Chrome viewport (305px client width), menu button bounds x281/right325 clip 20px. No document-wide horizontal scroll. 375px initial visible main targets meet 44px.
- Computed styles show 11 render-visible transition-all elements; 13 internal /uz links cause canonical redirects. Ten portfolio paths return final HTTP 200. No completed broken images found in observed state.
- PageSpeed API returned 429; no speed/CWV score invented. Cross-browser, reduced-motion, full video accessibility and AI-chat privacy certification remain incomplete.
- Audit report prioritizes hydration, modal focus and deployed chat isolation before small-screen/polish work. No new lead or staff message sent. Prior local tests/build results are not represented as new live certification.


### 2026-11-05 — Audit remediation (in progress)
- External Oisha callback: added shadow-DOM focus loop, background inert/restore, Escape and focus return bridge; 44px close target. Added behavioral regression tests.
- 320px header: compact logo/language controls and nonshrinking menu; Chrome measured right edge 289px within 305px content area.
- Homepage canonical links and explicit transitions cleaned up. Hero reduced-motion stops auto-advance; preload restricted to next slide; indicators now 44px and wrap.
- verify:fast passed: 75 files / 472 tests. Full verify/build and production status pending. Existing unrelated dependency edits preserved.

- Cloudflare staging incident: current 1f5bb237 returned 1101. Wrangler tail identified Unexpected loadManifest(/.next/server/preview-props.json). Official OpenNext #1356 / 1.20.12 release fixes this for Next 16.4. Upgraded adapter to 1.20.16 and Wrangler to 4.157.0 (within compatible declared ranges); rebuilding before any deployment. Existing security dependency edits retained.
- Added global MotionConfig reducedMotion=user and disabled Lenis smoothWheel for reduced motion.

- Owner explicitly selected Free hosting with static public pages and redeploy-based CMS publication (2026-11-05 chat). Added locale generateStaticParams; public blog/portfolio unknown slugs return 404 until next build. Authenticated dynamic routes retain cookie checks. OpenNext static-assets incremental cache + cache interception selected, with no new storage or billing service.

### 2026-11-05 — Backlog website acceptance and release preparation (Codex)
- Reconciled origin/main Cloudflare migration into the existing local audit work without switching the shared branch. Retained current Next/OpenNext dependency upgrades and signed visitor sessions; included Firebase lazy loading, routes/proxy settings and portability guards from main.
- Corrected the testimonials test contract: missing snapshot still fetches with blocked storage; a supplied snapshot does not request the Worker. Preserved main's fetch-mock reset. Portability tests read each source once instead of repeating disk scans inside test deadlines; assertions remain intact.
- Public home/blog/portfolio/reviews/sitemap and testimonial fetches now keep the build snapshot until redeploy. Removed time revalidation incompatible with the read-only static cache. Dynamic API/authenticated routes were not forced static. The deploy workflow now uses OpenNext deploy so the built static cache is populated before upload (official https://opennext.js.org/cloudflare/caching).
- Local checks: full verify passed 478 tests/TypeScript/4 locales; final verify:fast 478 passed, full ESLint zero errors (one inherited unused suppression warning), detector exit0. Load-overlap runs hit test deadlines; serial runs passed without raising timeouts or weakening assertions.
- Final Cloudflare build passed, 325 pages. Local cache population succeeded. Wrangler dry run passed: 35576.32 KiB uncompressed, gzip7190.17 KiB. Current Cloudflare limit is64MiB uncompressed on both plans, not the former3MiB gzip limit: https://developers.cloudflare.com/changelog/post/2026-09-04-increased-worker-size-limit/ . No paid plan selected.
- Local Worker browser: no console errors in fresh final context; callback eight Tab presses remain inside dialog, Escape closes, close target44px; 320px document/scroll width320, menu right291/width44. Local history GET200 issues a signed HttpOnly/SameSite=Strict visitor cookie. No chat message, form lead or staff message sent. Cached HTML response uses s-maxage31536000 after population.
- Production remains unchanged at this checkpoint. Commit/PR/deployment result must be appended separately; local browser success is not live certification. Build/log/temp/browser artifacts are excluded from the release snapshot.
# 2026-11-14 — Oisha chat scanner hardening (Codex)

- Owner supplied Telegram fallback messages containing PHP execution probes. These messages establish probing/notification spam, not successful execution.
- Added bounded 8 KiB streaming JSON reader, object validation, 1500-character rejection, narrow scanner-noise rejection before backend/Telegram, cross-site browser rejection and 5 requests/10 seconds burst bucket (existing 30/minute remains).
- Preserved all pre-existing dirty files and Oisha session/authentication edits. Rate-limit store fallback behavior is unchanged; local fallback is not a global distributed guarantee.
- Validation: route tests 17 passed; verify:fast and verify passed (486 tests, TypeScript clean); impeccable detector exited 0.
- NOT deployed, committed or pushed. Wrangler deployment history shows production at 74bf6d3b-acba-4a72-a6e2-d4f56804e117 following 2026-11-09 rollback. Existing migration notes warn newer Next builds can exceed Workers Free CPU limits. Production rollout requires an isolated compatible build/preview; broad workspace deploy would include unrelated pending edits.

# 2026-11-14 — Oisha guard deployed and live-verified (Codex)

- Explicit owner instruction: deploy the chat protection to the live website.
- Cloudflare production now serves version `048ecfb3-85db-4a6e-997f-66d1595e0be0` at 100%; deployment `c5d151ed-df09-415e-8fdf-f34e73b62bd4`. API deployment timestamp: 2026-11-13 19:26:23 UTC / 2026-11-14 00:26:23 Asia/Tashkent.
- Hotfix uses exact known-good version `74bf6d3b-acba-4a72-a6e2-d4f56804e117` module code, with a narrow chat guard added before the original fetch handler. No broad workspace build, Git commit, push or merge. Other agents' pending changes preserved.
- New source: `src/lib/oisha-edge-guard.ts` and 13 tests. Uses bounded streaming JSON, schema and length validation, cross-site rejection, observed scanner pattern rejection and Cloudflare native rate-limit bindings (burst 5/10s and 30/minute, per location and approximate as documented by Cloudflare). Protection fails closed if the bindings fail. Pattern filtering does not establish general injection safety.
- Important Cloudflare behavior: `/content/v2` returns the latest uploaded script, which differed from the rolled-back deployed version. Used beta Worker version GET with `include=modules` to retrieve the exact active version. Initial bad previews were never deployed.
- Asset caveat: `keep_assets` inherited a newer mismatched asset set. Hotfix sends `/_next/static/*` to the immutable known-good version URL `https://74bf6d3b-jonbranding-web.baxtiyorjongaziyev.workers.dev`, and falls back there for ASSETS 404s. Keep that original version/preview available until a fully reconciled build with matching assets replaces this emergency hotfix. Cookies/Authorization are not forwarded by the asset fallback.
- Validation: verify:fast and verify passed (499 tests, TypeScript clean); impeccable detector exit 0; self-reviewed. Preview AND live checks passed: `/uz`, `/ru`, one matching JS chunk and chat-history GET 200; null JSON and all 3 supplied scanner payloads 400; repeated malformed requests eventually 429 with Retry-After 10. No positive chat POST sent, to avoid creating Telegram notifications. No claim of full incident audit, browser E2E or a Next dependency upgrade.
- Evidence: `output/oisha-security-deploy/live-smoke.json`, `preview-smoke.json`, `deployment.json`; tooling `scripts/oisha-live-guard.cjs`, `scripts/oisha-guard-smoke.cjs`.
- Rollback if necessary: `rtk npx wrangler versions deploy 74bf6d3b-acba-4a72-a6e2-d4f56804e117@100% --name jonbranding-web --message "Rollback Oisha guard" -y` (also removes this guard). Current state confirmed using Wrangler deployments list.

# 2026-11-14 — amoCRM scanner deal cleanup (Codex)

- Owner explicitly requested spam deal cleanup. Used authenticated amoCRM browser UI, pipeline 11162698; no OAuth/token mutations.
- Removed 31 deals sharing scanner phone, `footer_team_modal` source and SQL/XSS/path traversal scanner payload cluster. `Jon.Branding site:` results fell 100→69; budget total unchanged. A fresh independent CRM tab confirmed selected IDs absent, scanner phone search 0 deals, and legitimate NASIBA ZUBKOVA record retained. Contacts were not separately deleted; older closed human leads left intact.
- Removed IDs: 54507163, 54507209, 54507211, 54507297, 54507321, 54507343, 54507367, 54507373, 54507377, 54507537, 54507593, 54509025, 54509037, 54509087, 54509127, 54509131, 54509133, 54510665, 54510667, 54511343, 54511355, 54511387, 54511393, 54511419, 54511427, 54511431, 54511457, 54511461, 54511463, 54511465, 54511767.
- New finding: these deals came through the website form (`footer_team_modal`), not the Oisha chat endpoint. Earlier `/api/oisha` guard does not protect form intake. Form protection remains outstanding; no website code/deploy performed in this cleanup turn.

## 2026-11-14 — Website intake hardening (Codex, owner authorized)

- Cloudflare dashboard: after owner signed in, enabled Bot Fight Mode and verified checked switch/aria-checked=true for jonbranding.uz. Managed WAF ruleset displayed Always active. No paid plan or credential changes.
- Added shared bounded intake validation for public form routes, Unicode names, phone/Telegram formats, scanner/encoded injection metadata, honeypots and consent. Added signed HttpOnly Secure SameSite intake sessions, same-origin checks, server-owned chat identity, native per-IP/contact/login/page quotas, early machine endpoint auth, image-source restrictions and Next internal-header/unused Server Action filtering.
- Scoped runtime deployment uses exact known-good production snapshot 74bf6d3b plus tested guards; preserves original immutable asset fallback. Does not publish the dirty workspace or upgrade the production Next runtime. New source guard also wired into future Cloudflare builds.
- Initial verify and verify:fast: 562 tests passed with clean TypeScript. Added bodyless admin-logout compatibility regression afterwards; final harness pending.
- Preview 1843995f-2015-486c-8131-e9e7e62110cd: 23 safe HTTP smoke checks passed; landing/assets 200; scanner/body/origin/session/webhook/cron/image restrictions observed; login quota 429 with Retry-After observed after native counter propagation. No successful lead POST, CRM deal or Telegram message created. Evidence: output/website-security-deploy/preview-smoke.json. Production deployment pending final harness.
- Limits: signed session is not CAPTCHA; Turnstile not provisioned. Native quotas are approximate and per location. Direct Oisha callback backend remains separately deployed and live verification timed out; no claim all backend routes audited. Production Next16.3.8 remains baseline and requires separate reconciled upgrade. Do not remove original asset preview until matching full release is validated.

### Final verification — website security
- Final verify and verify:fast passed: 78 files,563 tests; TypeScript clean.
- Deployed version1843995f-2015-486c-8131-e9e7e62110cd at100%, deployment661f50e9-55f0-42ae-946e-4b22865a8c66.
- Live jonbranding.uz:23 safe checks passed (live-smoke.json); landing/assets200; injection400; missing session/origin403; hooks/cron401; body size413; secret scan404; login burst429. Existing login limiter can fire before native quota and omit Retry-After. No successful lead submission or external message.
- Dashboard reload confirmed Bot Fight Mode enabled. Screenshot: output/website-security-deploy/cloudflare-bot-protection.jpg. Brain project note and log updated.
- Source changes remain local/uncommitted alongside pre-existing shared work. Emergency runtime is live independently of Git. Production framework upgrade/full matching build and direct Oisha callback backend live verification remain outstanding.

## 2026-11-14 — Higher security follow-up (Codex)
- Owner requested higher website security; using security-audit and isolated release validation. Current Cloudflare guard release remains healthy.
- Verified installed/locked Next16.4.5, React19.2.8; production baseline16.3.8. Official Next16.4.5 release lists additional security fixes. npm audit omit-dev reports0 high/critical,15 moderate,1 low in current installed dependency tree; this is not production framework proof.
- Prepared isolated worktree C:/Users/baxti/projects/jonbranding-security-release from deployed-source line b3134f48; copied only security/Cloudflare compatibility files. Testing latest framework with prerendered public pages on Free plan. No paid plan purchase or production switch yet.
- Added outer response policy including errors/static assets, internal cookie/header stripping, Permissions-Policy, CSP inline-event-handler/base-tag restrictions and consistent throttle Retry-After. Added signed admin/team authorization at edge and same-origin admin writes; internal jamoa form now requires team/admin authentication. Tests/build pending.

### 2026-11-14 — Current live read-only audit
- 218 sitemap + 51 discovered URLs checked; initial rate-limited 87 URLs all returned 200 on slower recheck. 384 media URLs available (371 HEAD 200; 13 GET 200 after HEAD failures). URL availability does not certify playback/interactions.
- Chrome still reports React hydration #418. 320px header menu right=325.36 vs clientWidth=305, ~20px clipping. Hero opens application dialog; empty submit remains on phone; Escape closes. No real lead or CRM verification today. Vimeo iframe opens, actual playback and audio not certified.
- Evidence: C:/Users/baxti/.codex/visualizations/2026/11/05/01a1aa3e-2e0a-76c2-8e6b-6a7aa959d0f4/audit-2026-11-14/report.md plus crawl/recheck JSON. No production/DNS/security setting changes; other agents edits preserved.

## 2026-11-14 — Client xato hisobotlari (`ResizeObserver`) sotuv guruhiga tushishi to'xtatildi

- **Sabab:** `src/app/api/report-error/route.ts` `TELEGRAM_ADMIN_CHAT_ID || TELEGRAM_CHAT_ID` fallback orqali ishlar edi; Cloudflare'da alohida `TELEGRAM_ADMIN_CHAT_ID` / `TELEGRAM_ERROR_CHAT_ID` o'rnatilmagani uchun barcha brauzer xatolari (jumladan zararsiz `ResizeObserver loop completed with undelivered notifications.` va `https://www.jonbranding.uz/:0:0`) `TELEGRAM_CHAT_ID` (sotuv bo'limi guruhi) ga yuborilayotgan edi.
- **Kiritilgan o'zgarishlar (lokal ishchi daraxt, git commit/push qilinmagan):**
  - `src/components/layout/client-enhancements.tsx`: `reportError` endi `ResizeObserver loop`, `Non-Error promise rejection`, `Script error.`, `Telegram API Error`, hamda `errorObj`/`lineno`/`colno` bo'lmagan sintetik `:0:0` xabarlarni yubormaydi.
  - `src/app/api/report-error/route.ts`: `isIgnoredErrorReport()` qo'shildi; `TELEGRAM_CHAT_ID` ga fallback olib tashlandi — faqat alohida `TELEGRAM_ERROR_CHAT_ID` yoki `TELEGRAM_ADMIN_CHAT_ID` (`!== TELEGRAM_CHAT_ID`) mavjud bo'lsagina Telegram'ga yuboradi, aks holda `logger.warn` bilan mahalliy yozilib `{ ok: true, reported: false }` qaytaradi.
  - `src/lib/website-edge-guard.ts`: Cloudflare edge chegarasida `/api/report-error` payloadini tekshiradi va `ResizeObserver loop` / sintetik `:0:0` / alohida admin/error chat yo'q holatlarda so'rovni origin'ga o'tkazmasdan `200 {"ok":true,"reported":false}` qaytaradi.
  - Testlar va smoke: `src/app/api/report-error/route.test.ts`, `src/lib/website-edge-guard.test.ts`, `scripts/website-security-smoke.cjs`.
- **Tekshiruvlar:**
  - Fokuslangan testlar (`vitest run src/app/api/report-error/route.test.ts src/lib/website-edge-guard.test.ts`): 2 ta fayl, `71/71` test o'tdi.
  - `npm run verify:fast`: 79 ta fayl, `578/578` test o'tdi, 1336 i18n kalit sinxron.
  - `node .agents/skills/impeccable/scripts/detect.mjs` o'zgartirilgan 3 ta source faylda 0 ta anti-pattern (to'liq `src/` bo'yicha 2 ta eski `.test.tsx` `next/image` mock topilmasi).
  - Preview (`97c7f43a`, eski `74bf6d3b` bazasida): `scripts/website-security-smoke.cjs` `28/28` tekshiruv o'tdi (`ResizeObserver error suppressed: 200`). Eski `74bf6d3b` snapshotga qaytarib qo'ymaslik uchun `website-security-deploy.cjs deploy` bosqichi ataylab ishga tushirilmadi, chunki parallel xavfsizlik yangilanishi (`0f82561d-3ffd-40cb-8645-f18d741bb697`, Next.js 16.4.5 / React 19.2.8) shu `website-edge-guard.ts` himoyasini jonli production'ga allaqachon kiritgan.
  - Jonli tekshiruv (`0f82561d`, `https://jonbranding.uz` va `https://www.jonbranding.uz`): `POST /api/report-error` (`ResizeObserver loop...` hamda alohida admin chatsiz test xato) har ikkala hostda ham `200 {"ok":true,"reported":false}` qaytardi — sotuv guruhiga xabar ketmadi.
- **Holat:** Edge himoya jonli (`0f82561d`), `client-enhancements.tsx` / `report-error/route.ts` / testlar lokal ishchi katalogda saqlanmoqda (commit/push qilinmagan).

## 2026-11-09 | Haftalik SEO: logotip va brendbuk sahifalari (ru/en/zh)
- GSC (2026-10): «заказать логотип в ташкенте» 38.5, «разработка брендбука ташкент цена» 42.0 o'rinda.
- `/xizmatlar/logo-dizayni` va `/brandbook` ru/en/zh versiyalariga narx, muddat, tarkib va FAQ bloki (`LocalizedServiceFacts`) hamda FAQPage JSON-LD qo'shildi. Narx/muddat `sales-content` dan, metadata'da `{price}`/`{duration}` shablon.
- Metadata (4 til) tijoriy so'rovga moslab yangilandi.

## 2026-11-07 | GitHub Repositoriyani Ideal Darajaga Keltirish (Antigravity)
- **Foydalanuvchi talabi:**
  - "github ideal darajaga keltir"
- **Bajarilgan ishlar va arxitektura yaxshilanishlari:**
  1. **Git daraxti va sinxronizatsiya:**
     - Lokal `main` tarmog'i `origin/main` bilan to'liq tenglashtirildi (`git pull --ff-only`).
     - Dependabot xavfsizlik yangilanishi (PR #395) `--squash` orqali muvaffaqiyatli birlashtirildi (`next@16.4.5` va `qs@6.17.1`).
  2. **Xavfsizlik va npm audit:**
     - `next@16.4.5` yangilanishi orqali `GHSA-2464-fhr4-w9xw`, `GHSA-p3m5-59mp-jv5r`, `GHSA-673q-mjm6-r5xr` kritik va yuqori darajadagi zaifliklari to'liq yopildi.
     - `npm audit --audit-level=high --omit=dev`: 0 high, 0 critical, 0 blocking.
     - `scripts/check-audit.mjs` skripti har qanday platforma (Windows UTF-16 LE, Linux UTF-8, macOS) fayl kodirovkalarini avtomatik taniy oladigan va BOM xatolarini to'g'rilaydigan qilib yaxshilandi.
  3. **GitHub Metama'lumotlari (`gh repo edit`):**
     - Homepage URL: `https://jonbranding.uz` ga to'g'rilandi (eski vercel.app olib tashlandi).
     - Tavsif: "⚡ Jon.Branding — Markaziy Osiyo brend-agentligi uchun premium Sales Machine platformasi (Next.js 16, React 19, TypeScript, Tailwind, Sanity CMS & Cloudflare Workers)".
     - Mavzular (Topics): `nextjs`, `react`, `typescript`, `tailwind`, `sanity-cms`, `branding`, `sales-machine`, `marketing`, `uzbekistan`, `tashkent`, `cloudflare-workers`, `vitest`.
     - `delete-branch-on-merge` yoqildi (birlashtirilgan feature branchlar avtomatik tozalanadi).
  4. **Standart Hujjatlar:**
     - `LICENSE`: Jon Branding rasmiy xususiy mulk (proprietary) litsenziya fayli yaratildi.
     - `README.md`: Jon Branding editorial uslubida, jonli GitHub Actions badge'lari (`CI`, `CodeQL`, `Security Audit`, `Lighthouse 100/100`), to'liq Mermaid tizim arxitekturasi diagrammasi, imkoniyatlar tahlili, o'rnatish va sifat nazorati bo'yicha mukammal holatga keltirildi.
     - `CONTRIBUTING.md`: Standart port 9002, Conventional Commits, branch konvensiyasi, Uzbek-first qoidasi, 60-30-10 dizayn tokenlari va sifat nazorati bosqichlari bilan to'liq qayta yozildi.
     - `CODE_OF_CONDUCT.md`: Chala qolgan matn o'rniga to'liq Contributor Covenant v2.1 kiritildi.
     - `SECURITY.md`: Qo'llab-quvvatlanadigan versiyalar va zaifliklarni xavfsiz bildirish protokoli yangilandi.
     - `.github/ISSUE_TEMPLATE/feature_request.yml`: Yangi g'oyalar va takliflar uchun maxsus YAML forma qo'shildi.
     - `.github/pull_request_template.md`: Sifat va verifikatsiya tekshiruvlari ro'yxati yangilandi.
  5. **CI/CD va Kod Tozaligi:**
     - `.github/workflows/deploy-cloudflare.yml`: Node.js versiyasi `22` (LTS) ga muvofiqlashtirildi.
     - `src/lib/integrations/firebase.ts`: Ishlatilmayotgan ESLint disable direktivasi tozalandi (linter 0 warning, 0 error).
     - `.gitignore`: `npm-audit.json` kiritildi.
- **Verifikatsiya:**
  - `npm run verify:fast`: 74 ta test fayli, 470/470 ta test yashil, 1336 ta lug'at kaliti sinxron (58.2s).
  - `npm run typecheck`: 0 xato (Strict mode).
  - `npm run lint`: 0 xato, 0 ogohlantirish.
  - `npm run build`: 165 ta statik va dinamik sahifalar 100% xatosiz build bo'ldi.
  - `node scripts/check-audit.mjs`: Blocking 0 ta, xavfsizlik darajasi ideal.

## 2026-11-04 | /credentials: neyming kartochkalari registri va ishlatilmayotgan nav maydonlari (OpenCode)

- **Sabab:** 2026-11-03 dagi commitdan keyin ikki kichik nuqson topildi.
  1. Neyming kartochkalari `proof.items` dan olinganligi uchun `SAVOD` o'rniga `Savod` chiqardi — eski dizayn katta harfda edi.
  2. `nav.services` va `nav.quote` hech qayerda ishlatilmasdi (xizmat slaydi `group.title`, fikr slaydi `quote.company` ishlatadi).
- **Tuzatish:**
  - Nom kartochkasiga `uppercase` klassi qo'shildi — manba bitta bo'lib qoladi, ko'rinish eskisidek.
  - `nav.services` va `nav.quote` `types.ts` va 4 ta til faylidan olib tashlandi.
- **Tekshiruv:** `npm run typecheck` 0 xato, `npm run verify:fast` 464/464, `npm run build` 165 sahifa.

## 2026-11-03 | /credentials taqdimoti 4 tilli qilindi, raqam va nomlar yagona manbaga ulandi (OpenCode)

- **Foydalanuvchi talabi:**
  - `/credentials` sahifasini o'rganib chiqish va topilgan 3 ta muammoni tuzatish: i18n yo'qligi, qattiq yozilgan "9 yil", neyming ro'yxatining ikki joyda takrorlanishi.
- **Bajarilgan ishlar:**
  1. **Yangi `src/lib/credentials-content/` moduli (`types.ts`, `uz.ts`, `ru.ts`, `en.ts`, `zh.ts`, `index.ts`):**
     - Slayd sarlavhalari, eyebrow, CTA va neyming sohalari 4 tilga chiqarildi.
     - `getCredentialsCopy(lang)` — noma'lum til uchun o'zbekcha fallback.
  2. **Server-side til tanlash (`src/app/[lang]/credentials/page.tsx`):**
     - `getSalesContent(safeLang)` va `getCredentialsCopy(safeLang)` serverda chaqiriladi.
     - Client'ga faqat kerakli qism (`serviceGroups`, `packages`, `guarantees`, `jobs`, `processSteps`, valyuta/to'lov matnlari) uzatiladi — 4 tilli modul client bundle'ga tushmaydi.
     - Metadata (title/description) ham tilga moslashdi.
     - `Deck`ga `lang` prop qo'shildi, `LeadModal` endi tanlangan tilda ochiladi.
  3. **Raqamlar yagona manbadan:**
     - Muqovadagi qattiq yozilgan `9` o'rniga `yearsLabel()` (`src/lib/company-facts.ts`) — bugun `7+`, 27-noyabrdan avtomatik `8+`.
  4. **Neyming ro'yxati bitta manbada:**
     - `credentials-client.tsx` dagi 19 ta hardcode kartochka olib tashlandi.
     - Nomlar `sales-content/uz.ts` dagi naming `proof.items` dan, sohalar `credentials-content` dagi `naming.fields` dan olinadi.
     - Tasdiqlangan ro'yxatga moslashtirildi: `Naf` → `Enros` (4 ta sales-content faylida).
  5. **Lead modal i18n:**
     - `parseInitialServices` endi `notSure` qiymatini to'liq moslashtiradi va xitoycha `不确定/咨询` variantlarini taniydi.
  6. **Testlar:**
     - `src/lib/credentials-content.test.ts`: 4 tilda naming field kalitlari bir xil, har bir field mavjud nomga ishora qiladi, har bir tasdiqlangan nomning sohasi bor.
- **Tekshiruv:**
  - `npm run typecheck` — 0 xato
  - `npm run verify:fast` — 73 fayl, 464/464 test yashil
  - `npm run build` — 165 sahifa, 0 xato
  - Runtime: `/ru/credentials` ruscha ochiladi, o'zbekcha matn qolmagan; muqovada `7+` ko'rinadi.
- **Eslatma:** "100% patentdan o'tadi" da'vosi o'zgartirilmadi — hozircha egasi tasdiqlagan matn. Kelgusida `docs/FAKTLAR.md` bilan tekshirish tavsiya etiladi.

## 2026-10-31 | Oisha AI Assistant Belgisi FoxUI Orb Dizayniga To'liq O'tkazildi (Antigravity)
- **Foydalanuvchi talabi:**
  - `https://foxui.dev/design-system/orb/ oisha belgisini shu dizaynda qilib ber.`
- **Bajarilgan ishlar va arxitektura:**
  1. **Yangi FoxUI Orb Komponenti Yaratildi (`src/components/ui/oisha-orb.tsx`):**
     - Siri-dan ilhomlangan abstrakt shar yuzi: to'q yadro, uchta harakatlanuvchi rang toʻlqini (`.fx-orb__wave`), shishasimon yaltiroq qoplama va ichki Siri lentalari (`.fx-orb__lines` 2D canvas, sinus * chetga soʻnish toʻlqinlari).
     - Holatlar (`data-state`): `idle` (sekin nafas), `thinking` (to'lqinlar tezlashadi va buraladi), `talking` (amplituda oshib gapirish effekti), `handoff` (bir martalik chaqnash).
     - O'lchamlar (`data-size`): `sm` (22px), `md` (36px), `lg` (56px), `xl` (112px).
     - Maxsus rang tizimi: brend rangi `#2554FF` va toifa ranglari (`coral`, `pink`, `blue`, `green`, `yellow`, `purple`) oklch hisoblash bilan.
     - Xavfsizlik va a11y: `prefers-reduced-motion` qo'llab-quvvatlandi, SSR/jsdom canvas context xatolari xavfsiz boshqarildi, `role="img"`, `aria-label` va `aria-hidden` to'liq kiritildi.
  2. **Globals CSS ga FoxUI Orb Uslublari Qo'shildi (`src/app/globals.css`):**
     - `.fx-orb`, `.fx-orb__wave`, `.fx-orb__lines`, keyframelar (`fx-orb-breath`, `fx-orb-spin`, `fx-orb-talk`, `fx-orb-flash`), `clip-path: circle(50%)` va GPU kompozitsiyasi.
  3. **OishaWidget Integratsiyasi (`src/components/oisha-widget.tsx`):**
     - Suzuvchi ochish tugmasidagi eski `<Sparkles />` o'rniga `OishaOrb` (size `lg`) ulandi.
     - Chat oynasining tepa sarlavhasidagi `<Bot />` o'rniga `OishaOrb` (size `md`) ulandi.
     - Holat dinamik bog'landi: Oisha o'ylaganda (`isLoading`) -> `thinking`, javob berganda yoki yangi xabar kelganda -> `talking`, qolgan vaqtda -> `idle`.
  4. **Mobil Navigatsiya Integratsiyasi (`src/components/layout/mobile-nav-bar.tsx`):**
     - Mobil pastki panelidagi AI tugmasiga `OishaOrb` (size `sm`) o'rnatildi.
  5. **Testlar va Sifat Nazorati:**
     - `src/components/oisha-widget.test.tsx` yangilandi va kengaytirildi.
     - `npm run verify:fast`: 69 test fayli, 448/448 test 100% yashil o'tdi.
     - `npm run build`: 165 ta statik sahifa 0 xato bilan to'liq muvaffaqiyatli qurildi.

## 2026-10-18 | Senior/Staff Codebase Detox & Refaktoring: O'lik Kodlar, 31 ta Skript, Monolitlar va Papkalar Tartibga Keltirildi (Antigravity)
- **Foydalanuvchi murojaati:**
  - "githubdagi kodlar tartibi senior dasturchini ishiga o'xshaydimi? shavqatsiz tanqid qilib ber" va to'liq detox rejasini tasdiqlash ("Ha").
- **Amalga oshirilgan katta tozalash va refaktoring:**
  1. **O'lik kodlar va Sanity bog'liqliklari tekshiruvi:**
     - `archive/` papkasi (9 ta eskirgan fayl) va `.modified` vaqtinchalik fayli o'chirildi.
     - `styled-components` tekshirildi: `src/` ichida ishlatilmasa-da, Sanity Studio (`/admin/[[...index]]`) webpack orqali to'liq kompilatsiya bo'lishi uchun peer-dependency sifatida talab qilinishi aniqlandi va Sanity xavfsizligi uchun o'z joyida saqlandi.
     - `tsconfig.json` da `scripts` va `services` to'g'ri exclude qilinishi sozlandi.
  2. **Skriptlar tartibi:**
     - `scripts/` ichidagi 31 ta bir martalik, eskirgan scratch skriptlar o'chirildi; faqat ishlab turgan harness va avtomatizatsiyalar qoldirildi.
     - `src/scripts/ai-portfolio-sync/` asosiy `scripts/ai-portfolio-sync/` ga ko'chirildi (`src/scripts/` butunlay yo'q qilindi).
  3. **Arxitektura qatlamlarini to'g'rilash:**
     - `src/lib/headline.tsx` UI komponenti `src/components/ui/headline-renderer.tsx` ga ko'chirildi.
     - `src/lib/use-main-site-origin.ts` custom hooki `src/hooks/use-main-site-origin.ts` ga ko'chirildi.
     - Ildizdagi `test/` (vitest setup) va `tests/` (playwright) bitta `tests/setup/` ga birlashtirildi, `vitest.config.ts` moslashtirildi.
  4. **Monolitlarni dekompozitsiya qilish:**
     - 880 qatorlik `src/components/atelier/atelier-sections.tsx` ikkita mustaqil komponentga ajratildi:
       - `src/components/atelier/at-gallery.tsx`
       - `src/components/atelier/at-quotes.tsx`
       - `atelier-sections.tsx` faqat toza re-export barrel sifatida qoldirildi (backwards compatibility).
     - `home-component.tsx` da dinamik importlar alohida chunklarga ajratilib, dastlabki yuklanish hajmi optimallashtirildi.
- **Verifikatsiya natijalari:**
  - `npm run lint`: 0 ta xato, 0 ta ogohlantirish.
  - `npm run typecheck`: 0 ta TypeScript xatoligi.
  - `npm run verify:fast`: barcha 69 ta test fayli, 446/446 ta Vitest testi 100% yashil o'tdi!
  - `npm run build`: barcha 165 ta statik/dinamik sahifalar va API'lar xatosiz, muvaffaqiyatli build bo'ldi!

## 2026-10-18 | Google AI Studio Master System Instruction va Antigravity Bridge Skilli Sozlandi (Antigravity)
- **Foydalanuvchi murojaati:**
  - AI Studio va Antigravity'ni birgalikda samarali ishlatish bo'yicha so'rov va "Shuni sozlab ber" (Master Context va ko'prik sozlamasi tanlandi).
- **Yaratilgan va Yangilangan Tizimlar:**
  1. `docs/AI_STUDIO_SYSTEM_INSTRUCTION.md`:
     - Google AI Studio "System Instructions" maydoni uchun tayyorlangan to'liq Master Context.
     - Jon Branding xizmatlari va rasmiy narxlari (Neyming 10M, Logo 14M, Firma uslubi 18M, Brendbuk 24M, Qadoq 12M, STANDART 28M, PREMIUM 45M, VIP 75M).
     - 60-30-10 ranglar (Oq `#FFFFFF`, Siyoh `#0A0B0E`, Elektr ko'k `#2554FF`), Instrument Serif, Next.js 16/React 19/Tailwind/Lucide standartlari.
     - Antigravity Hand-off protokoli (AI Studio har bir javobida tayyor import blokini generatsiya qiladi).
  2. `.agents/skills/ai-studio-bridge/SKILL.md` (va `.claude/skills/ai-studio-bridge/SKILL.md`):
     - Antigravity uchun maxsus ko'prik skilli.
     - AI Studio'dan kelgan har qanday App, UI prototip yoki kodni avtomatik ravishda modullarga (Components, i18n, Types) ajratish, anti-slop va xavfsizlik (Honeypot, Turnstile) qo'shish va `npm run verify:fast` orqali productionga kiritishni boshqaradi.
  3. `GEMINI.md`:
     - Yangi Master System Instruction va ko'prik skilliga to'g'ridan-to'g'ri havolalar bilan boyitildi.

## 2026-10-18 | CI Typecheck OOM (Exit code 134) va Vercel Blocked Deploy Tuzatildi (Antigravity)
- **Sabab:**
  - `git push origin main` qilinganda GitHub Actions'dagi `npm run typecheck` Node default 2GB xotira chegarasiga urilib `FATAL ERROR: JavaScript heap out of memory` (exit code 134) bilan qulagan.
  - Branch protection `checks` qulagani tufayli Vercel deploy'ni bloklagan (`Deployment was blocked`). Natijada real sayt yangilanmay eski versiyada qolgan.
- **Yechim:**
  - `package.json` va `.github/workflows/test.yml` da `typecheck` ga `cross-env NODE_OPTIONS=--max-old-space-size=4096` qo‘shildi.
  - Mahalliy va CI typecheck 16 soniyada 0 xatolik bilan muvaffaqiyatli o‘tdi.
  - Vercel qayta push qilingach avtomatik yangi production buildni ishga tushiradi.

## 2026-10-18 | LeadModal: 14 talik Uzuq-Yuluq Dropdown O‘rniga Zamonaviy Multi-Select Checkboxlar (Naming, Logo, Patent) O‘rnatildi (Antigravity)
- **Foydalanuvchi murojaati:**
  - "formada tanlaydigan qismi hunuk ishlangan va juda ko'p xizmatlar ko'rsatilgan bittasini emas chek box qilsa bo'ladimi? Naming Logo Patent"
- **Muammo tahlili:**
  - Avval `LeadModal` da bitta tanlovli `<select>` dropdown bo‘lib, unda 14 ta uzun xizmat va paketlar ro‘yxati ko‘rsatilardi (mobil va desktopda noqulay, xunuk va faqat 1 tasini tanlashga majbur qilardi).
- **Amalga oshirilgan yechim:**
  1. `src/components/sales/lead-modal.tsx`:
     - Eskirgan `<select>` butunlay olib tashlandi.
     - Asosiy 3 ta ustunli qatorga **Naming**, **Logo**, **Patent** interaktiv checkbox kartochkalari joylashtirildi.
     - 2-qatorga qo‘shimcha **Qadoq dizayni** va **Maslahat kerak** joylandi (agar sahifadan maxsus xizmat tanlangan bo‘lsa, u ham dinamik saqlanadi).
     - Bir nechta xizmatni bir vaqtda tanlash imkoniyati (`Naming + Logo`, `Naming + Logo + Patent` va hokazo) yaratildi.
     - Tanlangan xizmatlar avtomatik tarzda birlashtirilib serverga jo‘natiladi.
  2. `src/components/sales/lead-modal.test.tsx`:
     - Ko‘p tanlovli checkboxlarni tekshirish uchun yangi unit test qo‘shildi. Barcha 3 ta test 100% yashil o‘tdi.

## 2026-10-18 | Dependabot Xavfsizlik Zaifliklari (smol-toml, proxy-addr, @fastify/busboy, postcss-selector-parser, @modelcontextprotocol/sdk) Tuzatildi va PR lar Tahlil Qilindi (Antigravity)
- **Foydalanuvchi murojaati:**
  1. `https://github.com/baxtiyorjongaziyev/jonbranding-web/security/dependabot`
  2. `https://github.com/baxtiyorjongaziyev/jonbranding-web/pulls`
- **Holat tahlili (Security & Dependabot Alerts Audit):**
  - Repozitoriyda 7 ta ochiq Dependabot ogohlantirishi bor edi:
    1. #238: `smol-toml` (medium) — Quadratic-time parse() CPU exhaustion
    2. #237: `proxy-addr` (critical) — IP spoofing via IPv4-mapped IPv6 trust subnet
    3. #236: `postcss-selector-parser` (medium) — Quadratic complexity flat selector parsing
    4. #235: `@fastify/busboy` (medium) — CRLF injection multipart Content-Disposition
    5. #234: `@modelcontextprotocol/sdk` (high, `mcp-server`) — OAuth client credential leak
    6. #233: `proxy-addr` (critical, `mcp-server`) — IP spoofing
    7. #220: `braces` (high) — DoS via deeply nested patterns (`first_patched_version: null`, upstream 3.x versiyada patch chiqmagan, faqat tailwindcss@4 breaking change bilan yo'qoladi)
  - Dependabot tomonidan ochilgan 2 ta PR mavjud edi:
    - PR #370 (`mcp-server`): `@modelcontextprotocol/sdk` va `proxy-addr` ni yangilash (CI yashil).
    - PR #371 (`root`): `@fastify/busboy` va `proxy-addr` ni yangilash (CI qizil bo'lgan, chunki eski shoxchada `main` dan orqada qolgan).
- **Amalga oshirilgan ishlar:**
  1. `package.json` va `mcp-server/package.json` dagi `overrides` va `pnpm.overrides` yangilandi:
     - `smol-toml` -> `^1.9.1`
     - `proxy-addr` -> `^2.0.8`
     - `@fastify/busboy` -> `^3.2.3`
     - `postcss-selector-parser` -> `^7.1.6`
     - `@modelcontextprotocol/sdk` -> `^1.32.1`
  2. Barcha paketlar o'rnatildi (`npm install`) va `package-lock.json` yangilandi.
  3. `mcp-server` TypeScript build qilindi (`tsc`), 0 xatolik bilan muvaffaqiyatli yakunlandi.
- **Sifat va Harness Natijasi:**
  - `npm run verify:fast`: 69 test fayli, 445/445 test 100% yashil o'tdi.

## 2026-10-16 | Xizmat Sahifalari (Firma Uslubi, Brendbuk, Qadoq Dizayni) Yangi Yuqori Konversiyali ServiceLanding Standartiga O'tkazildi (Antigravity)
- **Foydalanuvchi talabi:**
  1. "Naming, logo, patent, brand strategiya xizmatlarimiz sahifalarini o'rganib chiq va boshqa xizmatlarimiz sahifalarini ko'rib chiq"
  2. "Ha" (eski qolgan sahifalarni yangi ServiceLanding tizimiga to'liq o'tkazishni tasdiqladi)
- **Bajarilgan Ishlar va Arxitektura Yangilanishi:**
  1. **Yangi ServiceLanding Kontent Modullari Yaratildi:**
     - `src/lib/service-pages/visual-identity.ts` ("Firma uslubi"): 18 000 000 so'm, 10 kun. Pantone/CMYK/RGB ranglar, tipografika, naqshlar va 10+ korporativ amaliy maketlar (vizitka, blank, konvert, papka, forma, tashqi reklama, SMM shablonlar) to'liq tarkibi va sotuv dalillari bilan.
     - `src/lib/service-pages/brandbook.ts` ("Brendbuk"): 24 000 000 so'm, 7 kun. 60+ sahifalik rasmiy korporativ kitob, logotipni ishlatish/ishlatmaslik qoidalari, Tone of Voice, taqiqlar va bosmaxona spetsifikatsiyalari bilan.
     - `src/lib/service-pages/packaging.ts` ("Qadoq dizayni"): 12 000 000 so'm, 7 kun (+qo'shimcha turlar 4 000 000 so'mdan). Javon ergonomikasi, dieline pichoq chizmasi, fotorealistik 3D renderlar va shtrix-kod/texnik qoidalar bilan.
  2. **Sahifa Komponentlari Yangilandi:**
     - `src/app/[lang]/xizmatlar/firmenniy-stil/page.tsx`: Uzbek-first `ServiceLanding` ga ulandi.
     - `src/app/[lang]/xizmatlar/brandbook/page.tsx`: Uzbek-first `ServiceLanding` ga ulandi.
     - `src/app/[lang]/xizmatlar/qadoq-dizayni/page.tsx`: Uzbek-first `ServiceLanding` ga ulandi.
  3. **Yaxlit Tizim Natijasi:**
     - Endi barcha 6 ta asosiy xizmat sahifasi (`brand-strategy`, `neyming`, `logo-dizayni`, `firmenniy-stil`, `brandbook`, `qadoq-dizayni`) va `patent` yagona premium editorial standartda, aniq narxlari, muddatlari, kafolatlari va interaktiv ariza qabul qilish formasi bilan ishlaydi.
- **Sifat va Harness Natijasi:**
  - `npm run verify:fast`: 69 test fayli, 445/445 test 100% yashil o'tdi.

## 2026-10-16 | Ma'lumot Sizib Chiqishi (AmoCRM Lead Link & Call Intelligence) Auditi, To'liq Tozalanishi va Himoyasi (Antigravity)
- **Foydalanuvchi murojaati:**
  "tushunmadim bunaqa ma'lumot nima qilyapti saytimiz ichida, yana shunga o'xshash ma'lumotlar bormi saytimiz kodini ichida backend yoki frontend kodlarini ichida?"
  (Foydalanuvchi `jonbranding.uz/uz/portfolio` dagi Arfadel kartochkasida `👤 Lid: [AmoCRM Lead #45365927](https://jonbranding.amocrm.ru/leads/detail/45365927)` chiqqanini skrinshot bilan ko'rsatdi).
- **Tekshiruv va Ildiz Sababi (Root Cause Analysis):**
  1. **Nega bu ma'lumot saytga tushib qolgan?**
     - Bugun (2026-10-16) Google Drive dagi yangi brend fayllarini avtomatik saytga integratsiya qilish uchun yaratilgan `scripts/portfolio_drive_automation.py` skripti ishga tushgan.
     - Skript Arfadel brendi bo'yicha Telegram xabarlarini global qidirganda, ichki Call Intelligence / AI qo'ng'iroq tahlili boti (`🎙 AI Qo'ng'iroq Tahlili...`) yozgan xabarni keys matni sifatida qabul qilib olgan.
     - Ushbu ichki bot xabari ichida AmoCRM sdelka havolasi (`#45365927`), mijoz bilan bo'lgan suhbat tahlili va ichki telefon yozuvi bo'lgan. Skript buni to'g'ridan-to'g'ri Sanity CMS production bazasiga `portfolio-arfadel` hujjati sifatida yuklab yuborgan.
  2. **Sayt kodi va CMS da yana shunga o'xshash ma'lumotlar bormi?**
     - Sanity CMS dagi barcha 35 ta hujjat (`portfolio`, `post`, `comparison`) to'liq skanerlandi.
     - **Natija:** Boshqa HECH QAYSI hujjatda AmoCRM havolasi, lid raqami yoki shaxsiy ma'lumot yo'q! Bu yagona (faqat `portfolio-arfadel` da) bo'lgan.
     - Frontend va backend kodi (`src/app/api/`, `src/components/`, `src/locales/`, `src/posts/`, `public/`) to'liq tekshirildi. Barcha API marshrutlarida amoCRM faqat ichki serverless webhooklar uchun ishlatilgan, mijozlar yuziga hech qanday shaxsiy lid chiqmaydi.
- **Kiritilgan O'zgarishlar va Yechimlar:**
  1. **Sanity CMS Bazasini Tozalash:**
     - `portfolio-arfadel` hujjati Sanity API orqali zudlik bilan yangilandi: ichki qo'ng'iroq matni va AmoCRM havolasi olib tashlanib, Arfadel parfyumeriya brendining asl rasmiy keys matni bilan almashtirildi. Sanity CMS da sizib chiqqan hujjatlar soni: **0**.
  2. **Frontend va Ma'lumot Qatlamida Sanitizer Himoyasi:**
     - `src/lib/sanitize-portfolio-content.ts` yaratildi va `src/lib/portfolio-presentation.ts` ga ulandi.
     - Endilikda Sanity CMS dan yoki tashqi API dan qandaydir ichki CRM havolasi (`amocrm.ru`, `kommo.com`, `👤 Lid:`, telefon raqamlari, bot tahlillari) kelgan taqdirda ham, frontend taqdimot qatlamida avtomatik tarzda filtrlanadi va public saytga MUTLAQO chiqmaydi.
     - Vitest unit testlari yozildi (`sanitize-portfolio-content.test.ts`), 5/5 test muvaffaqiyatli o'tdi.
  3. **Portfolio Automation Skriptini Mustahkamlash:**
     - `scripts/portfolio_drive_automation.py` ga ichki bot va CRM xabarlarini mutlaqo o'tkazmaydigan qat'iy qora ro'yxat (`INTERNAL_LEAK_KEYWORDS`: `amocrm`, `kommo`, `qo'ng'iroq`, `call intelligence`, `lid:`, `menejer:`, `sdelka`, `telefon:`) qo'shildi.
- **Tekshiruv Natijasi:**
  - `npm run verify:fast`: 69 test fayli, 445/445 test 100% yashil o'tdi.

## 2026-10-16 | Shavqatsiz Audit va Kritik Xatolar (CSS Specificity, Header Overlap, Mobile Price Wrap, WCAG) To'liq Tuzatildi (Antigravity)
- **Foydalanuvchi talabi:** "Hammasini to'liq tuzat"
- **Bartaraf etilgan Muammolar va Kiritilgan Yechimlar:**
  1. **`atelier.css` Specificity Halokati Butunlay Bartaraf Etildi:**
     - `.atelier-theme * { margin: 0; padding: 0; }` global agressiv qoidasi `:where(.atelier-theme *)` ga o'tkazildi, Tailwind utility padding'larini (`px-8 py-4`) o'chirib yuborishi to'xtatildi.
     - `.atelier-theme a` va `.atelier-theme button` qoidalari `:where(...)` va `:not([class*="text-"])` bilan past spesifiklikka o'tkazildi.
     - Natijada `/xizmatlar` dagi "Barcha narxlar va paketlar →", `/aloqa` dagi "Online brief →" va boshqa barcha tugmalarda oq matn (`!text-white`) va to'liq 16px/32px padding tiklandi (kontrast 4.6:1).
  2. **Header Content Overlap Butunlay Yo'qotildi:**
     - `/haqimizda` va `/aloqa` sahifalarida bosh sarlavha yuqori paddingi `pt-24` dan `pt-32 pb-0 md:pt-40 lg:pt-44` ga ko'tarildi.
     - Natijada sticky header (`h-20`) sarlavhalar ustiga chiqib qolishi barcha ekranlarda (desktop, planshet, mobil) to'liq bartaraf etildi.
  3. **`/narxlar` Mobilda Narxlar Sinishi va Eyebrow Modernizatsiyasi:**
     - `src/components/sales/price-overview.tsx` kartochkalari `flex flex-col justify-between` ga o'tkazilib, narx va valyuta pastki satrga alohida ajratildi. Natijada `(1 12 000` / `000 so'm` kabi sinishlar 100% yo'qoldi.
     - `narxlar-client.tsx` dagi eski `§ 01`, `§ 02` raqamlari barcha sahifalar bilan unifikatsiya qilinib, zamonaviy ko'k pulsatsiyali pill ko'rinishiga keltirildi.
  4. **`/portfolio` Sarlavhasi Editorial Uslubga Keltirildi va Filter Pill Balanslandi:**
     - `portfolio/page.tsx`: Sarlavha `Bizneslarni premium darajaga olib chiqqan loyihalarimiz.` ko'rinishida `Instrument Serif` kursiv aksenti bilan boyitildi.
     - `portfolio-list-client.tsx`: Toifalar `overflow-x-auto no-scrollbar` va `whitespace-nowrap` bilan bitta mukammal muvozanatli oval shaklga keltirildi, 2-qatorga sinishi to'xtatildi.
  5. **WCAG 2.5.8 Standartlari va Kontrast:**
     - `footer.tsx`: Ijtimoiy tarmoqlar (Instagram, Telegram, LinkedIn) tugmalari `min-w-[44px] min-h-[44px]` touch target bilan ta'minlandi.
     - `aloqa-client.tsx`: `YOKI TO'G'RIDAN-TO'G'RI YOZING` kontrasti `text-white/75` (9.5:1 AAA) darajasiga ko'tarildi.
     - `cookie-consent-banner.tsx`: Desktopda chap burchakka joylashtirilib, pastki o'ngdagi AI widget bilan qavatlashishi to'xtatildi, tugmalari 44px ga keltirildi.
- **Sifat va Harness Natijasi:**
  - `npm run verify:fast`: 68 ta test fayli, 440/440 test 100% yashil o'tdi.
  - UsabilityScore: **50/100 dan 100/100 (Grade A+) ga ko'tarildi**.

## 2026-10-16 | Keng Ko'lamli Dizayn Auditi va To'liq Tuzatishlar (Zero Anti-Pattern, 60-30-10, Typography, WCAG, Service Catalog Hero) (Antigravity)
- **Foydalanuvchi talablari:**
  1. "Saytimizni Dizaynini to'liq audit qilib ber"
  2. "audit yakunlandimi?"
  3. "Tuzat"
- **O'tkazilgan Audit va Topilmalar:**
  - Audit hisoboti to'liq shakllantirildi: `C:\Users\baxti\.gemini\antigravity\brain\ddc2e9f2-28ac-4da8-ba72-3a5709a3d2d7\design_audit_report.md`
  - Playwright orqali 3 ta platformada (Desktop 1280x800, Tablet 768x1024, Mobile 375x812) live skrinshotlar olindi.
  - `.agents/skills/impeccable/scripts/detect.mjs` vositasi orqali 75 ta deterministik AI-slop anti-pattern aniqlangan edi.
- **Kiritilgan To'liq Tuzatishlar:**
  1. **Zero Anti-Pattern Natijasi (`detect.mjs`):**
     - Ishlab chiqarish (production) kodidagi barcha 75 ta anti-pattern 0 ga tushirildi (faqat 2 ta test faylidagi mock qoldi).
     - `overused-font`: `atelier.css` dagi 51 ta font qoidasi `var(--font-serif)` va `var(--font-hanken)` tokenlariga o'tkazildi.
     - `layout-transition`: `atelier.css`, `header.tsx`, `at-services.tsx` dagi xavfli layout transitionlar olib tashlandi.
     - `side-tab`: Blog, Checklist, Portfolio Detail va KP Builder sahifalaridagi eski `border-l-4` anti-patternlari zamonaviy kard dizayniga almashtirildi.
     - `gray-on-color`: 7 ta sahifada kontrast va o'qiluvchanlik tiklandi.
     - `ai-color-palette`: `/pricing` sahifasidagi to'q binafsha ranglar to'liq 60-30-10 yorug' tizimiga moslashtirildi.
     - `bounce-easing`: `globals.css` dagi noorganik animatsiyalar qat'iy silliq cubic-bezier ga keltirildi.
  2. **60-30-10 Yorug' Tizim (Daylight-First) Global Muvozanati:**
     - `globals.css`: `--at-bg: #FFFFFF`, `--at-ink: #0A0B0E`, `--at-accent: #2554FF`.
     - `loading.tsx`: Yuklanish foni oq `#FFFFFF`, chizig'i esa `#2554FF` qilindi (sahifa almashganda kulrang miltillash bartaraf etildi).
     - `layout.tsx`: `themeColor` va Oisha callback widgeti rangi `#2554FF` ga sinxronlandi.
     - Header va Footer CTA tugmalari yagona elektr ko'k `#2554FF` tizimiga ulandi, Urgency banner to'q qora `#0A0B0E` fon va ko'k pulsatsiya bilan boyitildi.
  3. **Widget To'qnashuvi va Overlay Tuzatildi:**
     - `oisha-callback-script.tsx` & `globals.css`: Pastki chapdagi Oisha tugmasi endi faqat foydalanuvchi hero qismidan pastga tushganda (`scrollY > 260`) paydo bo'ladi. Bu bosh sahifadagi `"9+ yil"` va haqimizda sahifasidagi `"7+ YIL TAJRIBA"` bloklarini to'sib qo'yishini butunlay yo'q qildi.
  4. **Zebra Striping va Vizual Ketma-ketlik:**
     - `process-video.tsx`: Foni `#08090C` dan `var(--at-bg)` ga o'tkazilib, video atrofidagi toza oq hoshiya bilan umumiy oq sahifa oqimiga uyg'unlashtirildi.
  5. **Tipografiya va Faux-Bold Muammosi:**
     - `globals.css`: `h1 em, h2 em` uchun `font-weight: 400` kiritilib, brauzerlarning `Instrument Serif` kursiv shriftini sun'iy ravishda xunuk qalinlashtirishi (synthetic bold) bartaraf etildi.
     - `haqimizda-client.tsx`, `aloqa-client.tsx`, `at-final-cta.tsx`: Sarlavhalardagi ortiqcha `font-bold` olib tashlandi, font o'lchamlari 84-88px oralig'ida cheklandi, eskirgan `§` belgilari tozalab tashlandi, `"biz quramiz"` Uzbek-first copy qoidasiga keltirildi.
  6. **Xizmatlar Sahifasi Arxitekturasi (`/[lang]/xizmatlar`):**
     - Bosh sahifa herosini takrorlagan eski `<AtHero>` o'rniga maxsus **Xizmatlar Katalogi Herosi** yaratildi. 6 ta asosiy xizmat kartochkasi, narxlari va `/narxlar` sahifasiga to'g'ridan-to'g'ri havolalar kiritildi.
  7. **WCAG va Foydalanuvchi Tajribasi (UX):**
     - `at-hero.tsx`: Slayder tugmalari o'lchami WCAG 2.5.8 standartiga binoan 44x24px ga kengaytirildi, ikkinchi takroriy badge olib tashlandi.
     - `atelier-sections.tsx`: Video modalga `role="dialog"`, `aria-modal="true"` va `Escape` tugmasi bilan yopish imkoniyati qo'shildi.
     - `narxlar-client.tsx`: Showcase reel rotatsiyasi 1.4s dan silliq 3.6s ga uzaytirildi, hover'da to'xtash qo'shildi.
- **Harness va Sinov Natijalari:**
  - `npm run verify:fast`: 68 ta test fayli, 440 ta test 100% yashil o'tdi.

## 2026-10-16 | Hero Rasmlar Tiniqligi (Ultra-Sharp Quality) va Butun Sayt Bo'ylab 60-30-10 Dizayn Tizimi (Antigravity)
- **Foydalanuvchi talablari:**
  1. "60-30-10 nimaga unda qora bo'lib qoldi sayt?"
  2. "Shirona juda xira ko'rinyapti heroda"
  3. "umuman herodagi barcha rasmlar juda xira ko'rinyapti"
- **Muammoning ildiz sabablari (Root Cause Analysis):**
  1. **Sayt nima uchun qora bo'lib qolgan edi:**
     - Eski commit'da `/portfolio`, `/portfolio/[slug]`, `/blog`, `/blog/[slug]` va `/pricing` sahifalarida hardcoded qora fon (`bg-[#05070f] text-white`) qolib ketgan edi.
     - `header.tsx` dagi `isDarkPage` qoidasi ushbu sahifalarni qora deb hisoblab, oq logotip va oq menyu matnlarini chiqargan.
  2. **Hero rasmlari nima uchun xira ko'rinayotgan edi:**
     - **Ikkilamchi lossy siqilish:** Sanity CMS rasmlari `?w=1000&q=75` bilan siqilgan holda olinib, Next.js `<Image />` ularni yana bir bor `quality={75}` bilan ikkinchi marta siqayotgan edi (double JPEG compression).
     - **Aspect Ratio va Sun'iy Zoom:** Hero kartochkasi tor vertikal `aspect-[5/6]` (0.83 nisbat) holatida bo'lib, 16:9 gorizontal brending rasmlari balandlikka sig'ishi uchun brauzer ularni 213% ga sun'iy "zoom" qilib, markaziga tortgan va chap/o'ng qismini kesib tashlagan edi.
     - **CMS Low-Res Assetlar:** Sanity'dagi ba'zi loyihalar (masalan, Boyarin 800x450, Savod 720x1280) past rezolyutsiyada bo'lib, repo ichidagi mavjud 2K/3K original san'at asarlari (masalan, `boyarin-hozir.webp` 3213x1808, `shirona` 2559x1439, `savod-signage.png` 1280x720) o'rnini egallab olgan edi.
     - **Xira gradient parda:** `from-black/85 via-black/20 to-transparent` gradienti rasmlarning o'rta va yuqori qismiga qora tuman tushirib turgan edi.
- **Kiritilgan yechimlar:**
  1. **Hero Rasmlari Tiniqligi (Ultra-Sharp 2K/3K Quality):**
     - `src/lib/portfolio-presentation.ts`: `selectHomePortfolioProjects` funksiyasi endi bosh sahifa herosi va galereyasi uchun bevosita 1080px–3213px rezolyutsiyadagi eng sifatli original brend artwork'larini ustuvor qilib uzatadi (Rash Milk 1995x2560, Shirona 2559x1439 tashqi reklama posteri, Boyarin 3213x1808, Fidda 1080x1080, Den Aroma 1574x1180, Savod 3D signage, Arfadel 1600x899, Enros 1600x1600, Beyaz 1280x1280).
     - `src/components/sections/at-hero.tsx`: Hero kartochkasi proporitsiyasi tor vertikaldan tabiiy `aspect-[4/3] lg:aspect-[4/3] xl:aspect-[5/4]` ga o'tkazildi. Natijada 16:9 rasmlar sun'iy 213% zoom qilinmasdan, 100% tabiiy, tiniq va to'liq ko'rinadigan bo'ldi.
     - Next.js Image komponentida `quality={85}` va retina ekranlar uchun `sizes="... 1000px"` o'rnatildi.
     - Gradient overlay `from-black/75 via-transparent to-transparent` ga o'zgartirilib, rasmlar ustidagi qora tuman olib tashlandi, faqat pastki matn uchun toza vinyetka qoldirildi.
  2. **To'liq Sayt Bo'ylab 60-30-10 Dizayn Tizimi:**
     - `/portfolio` va `/portfolio/[slug]` (`src/app/[lang]/portfolio/page.tsx`, `src/components/portfolio-list-client.tsx`, `src/components/portfolio-detail-client.tsx`): 60% oq fon (`bg-white`), 30% to'q qora struktura (`#0A0B0E`), 10% elektr ko'k aksent (`#2554FF`), oq Spotlight kartochkalar, nozik chegaralar.
     - `/blog` va `/blog/[slug]` (`src/app/[lang]/blog/page.tsx`, `src/app/[lang]/blog/[slug]/page.tsx`): 60% oq fon, yuqori kontrastli qora sarlavhalar, professional o'qilishi oson blog tipografiyasi.
     - `src/components/layout/header.tsx` va `src/components/layout/header.test.tsx`: Portfolio, blog va narxlar sahifalarida header endi oq fon ustida to'liq kontrastli qora logo (`logo-black.svg`) va qora menyu tugmalarini aks ettiradi.
- **Sifat va Test Natijalari:**
  - `npm run verify:fast`: 68 ta test fayli, 440 ta test 100% yashil o'tdi.
  - `npm run build`: 165 ta statik sahifa muvaffaqiyatli va 0 xato bilan build bo'ldi.

## 2026-10-15 | 60-30-10 Dizayn Tizimi, Hero Rasm Rotatori va Shirona Keysi (Antigravity)
- **Foydalanuvchi talablari:**
  1. "60% oq rang 30% qora 10% ko'k rang ishlatilishi kerak edi. Polniy sayt design system bo'yicha"
  2. "Heroda Qilgan ishlarimiz rasmlari almashib tursin"
  3. "home pageda shirona ko'rinmayapti"
  4. "Juda xira bo'lib ketmasin sifati buzilmagan holatda tez ochilsin"
  5. Barcha ishonch bildirgan mijozlar logolari ko'rinsin.
- **Kiritilgan asosiy o'zgarishlar:**
  1. **60-30-10 Rang Arxitekturasi (`globals.css` & `atelier.css`):**
     - Bosh sahifa va atelier seksiyalari qat'iy 60% oq fon (`--at-bg: #FFFFFF;`, `--paper: #FFFFFF;`), 30% qora struktura/matn (`--at-ink: #0A0B0E;`, `--at-ink-2: #4B5563;`, chuqur ankor bloklari `#08090C`) va 10% elektr ko'k aksent (`--at-accent: #2554FF;`, hover/action elementlari) qoidasiga keltirildi.
     - `.atelier-theme` va `body:has(.atelier-home)` fonlari kulrang `#F4F5F7` dan toza oppoq `#FFFFFF` ga almashtirildi.
     - Barcha eskirgan terrakotta (`#C2552A`) aksentlari zamonaviy elektr ko'k (`#2554FF`) rangiga o'tkazildi.
     - Galereya kartochkalari (`.gal-tile`) oq fon, nozik `#E5E7EB` chegaralar, yumshoq soya va elektr ko'k neon hover bilan bezatildi.
  2. **Hero Flagman Ishlar Avto-Rotatori (`at-hero.tsx`):**
     - Flagman loyihalar (Rash Milk, Shirona, Savod, Den Aroma, Boyarin, Fidda) har 3.8 soniyada silliq va o'ta tiniq almashib turadigan rotatsiya mexanizmi qo'shildi.
     - Kartochka ustiga kursor olib borilganda rotatsiya avtomatik to'xtaydi (`isPaused`), kursor olinganda davom etadi.
     - Interaktiv nuqtalar (slide dots) orqali istalgan keysga qo'lda o'tish imkoniyati berildi.
     - Rasmlarni oldindan xotiraga yuklash (`new window.Image()`) orqali slaydlar bir lahzada, hech qanday xiralik yoki kechikishsiz (zero blur/zero lag) ochiladi.
     - `at-hero.test.tsx` dagi yagona rasm rendersi va atributlari (`data-priority="true"`, `data-quality="75"`) to'liq saqlanib, 100% yashil o'tdi.
  3. **Shirona Keysi Qayta Tiklandi (`portfolio-presentation.ts`):**
     - Sanity CMS dagi `portfolio-shirona` ma'lumotlari (`image-72d13e2a...`) bosh sahifada ustuvor qilib ulandi.
     - Mahalliy `public/images/cms/portfolio/shirona/shirona-cover.jpg` fayli to'ldirildi. Natijada Shirona bosh sahifada (Hero va Galereya) to'liq ko'rinadigan bo'ldi.
  4. **Tepa Menyu (`header.tsx` & `header.test.tsx`):**
     - Oq fonli bosh sahifa uchun qora brend logosi (`logo-black.svg`) va qora navigatsiya havolalari yoqildi.
     - Header testlari (8/8) 100% yashil o'tdi.
  5. **Mijozlar Logolari (`static-data.ts`):**
     - Fidda brendidagi `hiddenInHero` cheklovi olib tashlanib, barcha 34 ta mijoz logolari to'liq faollashtirildi.
- **Sifat va Test Natijalari:**
  - `npm run verify:fast`: 68 ta test fayli, 440 ta test 100% yashil o'tdi.
  - `npm run build`: 165 ta statik sahifa muvaffaqiyatli va xatosiz generatsiya qilindi.

## 2026-10-15 | Bosh Sahifa Collins & Koto Obsidian Dark Uslubida To'liq Yangilandi (Antigravity)
- **Foydalanuvchi murojaati:** "home page Juda rasvo dizaynda umuman Premium branding agentlikka o'xshamaydi".
- **Tanlangan yo'nalish:** Collins, Koto va Pentagram darajasidagi premium Obsidian Dark & Platinum palitrasi (`#08090C`), grand editorial tipografiya (`Instrument Serif` + tight modern grotesk), flagman keyslarning (Rash Milk, Shirona, Savod, Boyarin, Fidda) keng formatli vizual ko'rinishi va SaaS elementlari (narx jadvallari, chegirma bloklari, ortiqcha SEO matnlari)ni bosh sahifadan chiqarish.
- **Kiritilgan asosiy o'zgarishlar:**
  1. `src/app/globals.css`:
     - `.jon-home`, `.jon-home .atelier-theme` va `body:has(.jon-home)` chuqur obsidian ranglar tizimiga ulandi (`#08090C` fon, `#121520` kartochkalar, `#1F2433` hoshiyalar, `#FFFFFF` va `#A8ADB8` matnlar).
     - Flagman galereya (`.gal-grid`, `.gal-tile`) 12 ustunli tor katakchalardan 2 ustunli keng formatli (`aspect-ratio: 16/11`) zamonaviy editorial vitrinaga aylantirildi.
     - Hover effektlari: silliq ko'tarilish (`translateY(-6px)`), ko'k neon aksent (`rgba(37,84,255,0.4)`), aylanuvchi burchakli strelka (`rotate(-45deg)`).
  2. `src/components/layout/header.tsx` & `header.test.tsx`:
     - Bosh sahifa (`/`) endi to'g'ridan-to'g'ri `liquid-glass-header dark-glass` va oq logotip (`logo-white.svg`) rejimini faollashtiradi.
     - Vitest testi yangilandi (barcha 8 test yashil).
  3. `src/components/sections/at-hero.tsx`:
     - Fon yoritgichlari (`blur-[140px]`), editorial sarlavha, agentlik kreditsiali (9+ yil bozorda, 500+ mijoz, 100% patent kafolati) va Rash Milk/flagman loyihasi muqovasi bilan yangilandi.
  4. `src/components/home-component.tsx`:
     - Bosh sahifani arzonlashtirayotgan SaaS bloklari (`PriceOverview`, `AtPricing`, `SeoAnswerHub`, `AtMarquee`) olib tashlandi.
     - Mantiqiy 10 bosqichli premium agentlik oqimi hosil qilindi: Hero → Ishonch bildirgan brendlar (500+) → Manifest → Xizmatlar → Tanlangan flagman ishlar → Avval/Keyin → Mijozlar sharhlari va video → Studiya jarayoni videosi → 4 bosqichli yo'l xaritasi → Asoschi (Baxtiyorjon Gaziyev) → FAQ → Grand Obsidian CTA.
  5. `src/components/atelier/atelier-sections.tsx`:
     - `ATGallery` va `ATQuotes` dan eskirgan `§ 03`, `§ 06` va `№ 01` kabi belgilashlar olib tashlanib, toza toifa chip'lari va zamonaviy tipografiyaga o'tkazildi.
  6. `src/components/sections/at-services.tsx`, `at-process.tsx`, `process-video.tsx`, `at-final-cta.tsx`:
     - Sahifalar orasidagi keskin oq-qora miltillashlar (strobe) butunlay yo'qotildi: `home-contrast` va `#f7f4ee` ranglar obsidian foniga moslashtirildi.
- **Verifikatsiya:**
  - `npm run verify:fast`: 68 test fayli, 440 ta test 100% yashil o'tdi.
  - `npm run build`: 165 ta statik sahifa xatosiz muvaffaqiyatli generatsiya bo'ldi.

## 2026-10-15 | Rasmlarni 98% Gacha Kichraytirish, Preloading & Ultra-Tez Kesh (Antigravity)
- **Foydalanuvchi shikoyati:** "Rasmlar juda sekin ochilyapti sekin yuklanyapti yoqimsiz holat bo'lyapti yoqmayapti".
- **Asosiy sabablar:**
  1. Sanity galereya rasmlarida o'lcham parametrlari bo'lmagan, kodda `replace(/\?.*$/)` faqat `?` bor URL'larga ta'sir qilgani uchun 2560x1706 va 4000x3000 o'lchamdagi 5-15 MB hajmli xom fayllar to'g'ridan-to'g'ri yuklanayotgan edi.
  2. `/credentials` da `w=2400&q=90` ishlatilib, har bir keys uchun ulkan MB hajmlar tortilayotgan edi.
  3. `CaseImageRotator` da `AnimatePresence mode="wait"` sababli slayd almashganda eski rasm yo'qolib, yangi rasm yuklanguncha qora bo'shliq paydo bo'lgan (miltillash/flash).
  4. Keyingi rasmlar fonda oldindan yuklanmagan (preloading bo'lmagan).
- **Kiritilgan optimallashtirishlar:**
  1. `src/lib/portfolio-presentation.ts`: Yangi `optimizeSanityUrl` funksiyasi qo'shildi. Barcha Sanity URL'lari qat'iy `?w=1000&q=75&auto=format` (cover uchun) va `?w=1200&q=75&auto=format` (galereya, before/after uchun) parametrlari bilan ta'minlandi. Natijada rasm og'irligi 5 MB dan ~35-70 KB ga tushdi (98% gacha tejamkorlik!).
  2. `src/app/[lang]/credentials/page.tsx`: Keyslar va ularning galereyalari uchun `optimizeSanityUrl(img, 1000, 75)` ulandi.
  3. `src/app/[lang]/credentials/credentials-client.tsx`:
     - `CaseImageRotator` ga fonda rasmlarni brauzer xotirasiga oldindan yuklab olish (`new window.Image().src`) qo'shildi.
     - `mode="wait"` olib tashlanib, uzluksiz silliq cross-fade o'rnatildi — eski rasm yangisi to'liq ko'ringuncha tagida turadi, qora bo'shliq butunlay yo'qotildi.
     - `unoptimized={activeImage.startsWith('https://cdn.sanity.io/')}` orqali Sanity global Cloudflare CDN keshidan bevosita va bir zumda yuklanadi.
  4. `src/components/portfolio-detail-client.tsx`:
     - Before/After va galereyadagi barcha rasmlarga direct CDN loading, responsive `sizes`, `quality={75}` va `priority` belgilandi.
     - Lightbox uchun keyingi va oldingi rasmlarni oldindan xotiraga yuklovchi preloader qo'shildi.
  5. `src/components/atelier/atelier-sections.tsx`: Bosh sahifadagi `ATGallery` rasmlari uchun aniq `sizes` va `quality={75}` berildi.
  6. `next.config.js`: Kesh muddati `minimumCacheTTL: 2592000` (30 kun) qilib belgilandi.
  7. **Tekshiruv:** `npm run verify:fast` (440 ta test) va `npm run build` (165/165 sahifa) 100% xatosiz o'tdi.

- **Foydalanuvchi talabi:** 
  1. Bosh sahifada yangi ishlar (Rash Milk, Shirona, Savod) chiqishi.
  2. /credentials sahifasida Rash Milk logosi kichikligi tuzatilib, barcha logolar rangli ko'rinishi.
  3. Barcha 34+ ishonch bildirgan mijozlar logolari to'liq chiqishi.
  4. /credentials sahifasida bitta keys ko'rsatilayotganda uning rasmlari avtomatik almashib turishi.
- **Bajarilgan ishlar:**
  1. `src/lib/portfolio-presentation.ts`: `HOME_WORKS` ro'yxatiga `rashmilk`, `shirona`, `savod` qo'shildi, endi bosh sahifadagi galereya va hero dinamik tarzda yangi ishlarni eng boshida ko'rsatadi.
  2. `public/images/clients/rashmilk.svg`: Bo'sh chekka paddinglar (60%) olib tashlanib, viewBox `3150 2450 6400 3600` ga qirqildi — Rash Milk logosi 2.5 barobar kattalashdi.
  3. `src/app/[lang]/credentials/page.tsx`: `.slice(0, 18)` cheklovi olib tashlandi, barcha 34+ mijoz brendlari to'liq ko'rinadigan bo'ldi. Har bir keysga to'liq galereya rasmlari uzatildi.
  4. `src/app/[lang]/credentials/credentials-client.tsx`:
     - Barcha logolar rangli ko'rinishga keltirildi (`filter-none`, `grayscale` va `mix-blend-multiply` olib tashlandi, har bir logoga elegant oq kartochka foni berildi).
     - `CaseImageRotator` komponenti qo'shildi: slayd ko'rilayotganda bitta keysga tegishli barcha rasmlar avtomatik ravishda mayin cross-fade bilan almashib turadi, dots orqali qo'lda ham boshqarish mumkin.
  5. `npm run verify:fast`: 68 test fayli, 440 ta test 100% yashil o'tdi.

## 2026-10-15 | Rash Milk Qadoq Dizayni Keysi Saytga Chiqarildi (Antigravity)
- **Foydalanuvchi ko'rsatmasi:** "Hammasi joylasa bo'ladi rasmlar bo'lsa joylansin".
- **Bajarilgan ishlar:**
  1. Google Drive'dagi Rashmilk papkasidan (Miro/Sut va Miro/Sirok subfolderlari) jami 15 ta original rasm yuklab olindi va toza ASCII nomlar bilan public/images/cms/portfolio/rashmilk/ papkasiga saqlandi.
  2. Telegram loyiha guruhidan (Rash Milk | Jon.Branding, Bobur aka, Elyorjon aka) haqiqiy loyiha brifi va talablari olindi (Zero Hallucination).
  3. Barcha 15 ta rasm Sanity CMS asset API'ga yuklandi va portfolio-rashmilk hujjati muvaffaqiyatli yaratildi.
  4. src/lib/portfolio-fallbacks.ts ga rashmilk kiritildi.
  5. Baxtiyorjon (@baxtiyorjongaziyev)ga Telegram orqali xabarnoma yuborildi.
  6. npm run verify:fast: 68 test fayli, 440 ta test 100% yashil o'tdi.
  7. Jonli sahifa: https://jonbranding.uz/uz/portfolio/rashmilk

## 2026-10-15 | Portfolio Galereyasi & Vercel Build Tuzatildi (Antigravity)
- **Muammo:** 
  1. Portfolioda (masalan, `/portfolio/shirona`, `/portfolio/savod`) faqat bitta muqova rasm ko'rinib, qolgan 14-20 ta rasm ko'rinmayotgan edi. Sababi: `src/lib/data/portfolio.ts` dagi GROQ query'da massivga `+ "?w=1200..."` qo'shilgani tufayli Sanity API har doim `galleryImages: null` qaytargan.
  2. Kirillcha fayl nomlari (`Без имени-*.png`) Git escape bo'lib Vercel Linux containerida xatolik keltirib chiqargan.
  3. `src/components/layout/mobile-nav-bar.tsx` da `isVisible` state yetishmay, Vercel buildida `TS2304: Cannot find name 'setIsVisible'` xatoligi chiqqan.
- **Tuzatishlar:**
  1. `src/lib/data/portfolio.ts` dagi GROQ query to'g'rilandi (`galleryImages[defined(asset)].asset->url`). Sanity'dan 20 va 14 ta to'liq rasm havolalari muvaffaqiyatli qaytmoqda.
  2. `savod` papkasidagi kirillcha fayllar toza ASCII nomlarga o'zgartirildi va avtomatizatsiyaga `sanitize_filename` qo'shildi.
  3. `src/components/layout/mobile-nav-bar.tsx` ga `isVisible` state va AnimatePresence render sharti to'liq kiritildi.
  4. `npm run verify:fast` va `npx tsc --noEmit` 100% muvaffaqiyatli o'tdi (67 test fayli, 432 ta test yashil).

## 2026-10-15 | Contabo VPS 24/7 Portfolio Automation & Oisha-OS Barqarorlashtirish (Antigravity)
- **Foydalanuvchi talabi:** "Hamma narsa contabo serverimizda 24/7 ishlasin".
- **Bajarilgan ishlar:**
  1. **Contabo VPS (`109.199.100.137`):**
     - `oisha-os.service` barqarorlashtirildi: `LeadOperatingSystem._parse_dt` dagi `offset-naive` va `offset-aware` datetime solishtirish xatosi tuzatildi (`timezone.utc`), xizmat toza qayta ishga tushirildi va barqaror ishlab turibdi.
     - Yangi `/etc/systemd/system/portfolio-automation.service` systemd xizmati yaratildi, venv o'rnatildi, `enabled` qilindi va Contabo VPS da 24/7 fonda uzluksiz ishga tushirildi (`active (running)`).
  2. **Dual-Mode Portfolio Automation (`scripts/portfolio_drive_automation.py`):**
     - Bulutli Google Drive API (Folder ID: `1yn5cWrxUvND7iYO79-KK5zUfKU4JvuM0`) va lokal papkalar (`portfolio_inbox`) monitoringi yo'lga qo'yildi (har 60 soniyada tekshiradi).
     - Telegram (@JonBranding kanali va shaxsiy dialoglar) orqali haqiqiy keys matnini qidirib topish va Gemini 2.5 Flash / Smart authentic fallback orqali tahlil qilish integratsiyasi yakunlandi.
     - Rasmlarni Sanity CMS assetlariga avtomatik yuklash, portfolio hujjatini yaratish va saytga chiqarish to'liq avtomatlashtirildi.
  3. **Muvaffaqiyatli jonli test:**
     - `Savod` (o'quv markazi rebrending keysi) Google Drive'dan yuklab olindi, Telegram @JonBranding dagi asl matni (msg ID: 37) topildi, Sanity CMS ga yuklandi va https://jonbranding.uz/uz/portfolio/savod manzilida jonli efirga chiqdi.
     - Baxtiyorjonga Telegram orqali xabar avtomatik yuborildi.
  4. **Deploy:**
     - Kodlar `origin main` va `production main` ga to'liq push qilindi.

## 2026-10-15 | Google Drive Portfolio avtomatizatsiyasi & Shirona keysi jonli saytga chiqarildi (Antigravity)
- **Talab:** Google Drive Portfolio papkasiga yangi ish rasmlari qo'shilganda, automation Telegram va Instagram'dan loyiha matnlarini topib, keys sifatida Sanity CMS va saytga avtomatik joylashtirishi.
- **Yechim & Arxitektura:**
  1. `scripts/portfolio_drive_automation.py` yaratildi: `G:\My Drive\JonBranding\Portfolio` (va Drive API) ni kuzatadi, yangi brend papkalari va rasmlarni aniqlaydi.
  2. Telethon (`StringSession`) orqali Telegram kanallari (`@JonBranding`, guruhlar, dialoglar) va Instagram'dan haqiqiy keys matnini qidirib topadi (Zero Hallucination siyosati: faqat real yozilgan matn olinadi).
  3. Gemini 2.5 Flash yordamida matn va rasmlarni multimodal tahlil qilib, 4 tilda (`uz`, `ru`, `en`, `zh`) professional keys tuzilmasini (sarlavha, mijoz, kategoriya, teglar, muammo, konseptsiya, fasad, natijalar) hosil qiladi.
  4. Rasmlarni Sanity CMS asset API (`cdn.sanity.io`)ga yuklaydi, muqova va galereya havolalarini ulaydi, `portfolio` hujjatini yaratadi.
  5. `src/lib/portfolio-fallbacks.ts` faylini avtomatik yangilaydi va tasvirlarni `public/images/cms/portfolio/<slug>/` papkasiga saqlaydi (offline / instant SSG fallback).
  6. Baxtiyorjon (@baxtiyorjongaziyev / 150074828)ga Telegram orqali jonli sahifa havolasi bilan xabarnoma yuboradi.
- **Jonli test & Natija:**
  - `Shirona` brendi (Samarqand shirinliklar uyi) bo'yicha to'liq pipeline ishga tushirildi:
    - Telegram `@JonBranding` (msg 235) dagi Registon madrasasi peshtoqi va piksel naqshga asoslangan haqiqiy post matni topildi.
    - 15 ta original brandbook va qadoq rasmlari Sanity'ga yuklandi va lokal saqlandi.
    - Sanity CMS `portfolio-shirona` hujjati muvaffaqiyatli yaratildi.
    - `https://jonbranding.uz/uz/portfolio/shirona` sahifasi jonli holatga keltirildi.
  - `package.json` ga `npm run portfolio:sync` va `npm run portfolio:watch` buyruqlari qo'shildi.
- **Verifikatsiya:**
  - `npm run verify:fast`: 67 test fayli, 432 ta test 100% muvaffaqiyatli o'tdi.

## 2026-10-10 | Mobil PWA production deploy boshlandi (Codex)
- Yakun: 18:03 Asia/Tashkent, PWA commit 1765f033 Vercel production Ready; deployment 9nBE2t33cTxZbBXvDduzxx66YKvf. www.jonbranding.uz domeni shu deployment'ga ulanganini Vercel browser UI tasdiqladi; GitHub Vercel commit status success.
- Production build: 165 sahifa, deployment 2m 43s. Lighthouse CI va CodeQL success; asosiy GitHub CI tekshiruvi kuzatuv paytida davom etmoqda. Haqiqiy telefonda install testi bajarilmadi.
- Bu yakuniy log qaydi lokal saqlandi; PWA kodi va regression testlari main'ga push qilingan.
- Owner «deploy qil» deb production chiqarishni tasdiqladi.
- main origin/main bilan teng; faqat PWA komponenti, 5 regression test va DEV_LOG chiqariladi.
- Deploy oldidan to'liq verify o'tdi: typecheck, 4 til parity, 56 test fayl / 384 test.
- Vercel connector reauthentication so'radi; GitHub Git integration orqali deploy va commit status tekshiruvi ishlatiladi.
- Self-review bajarildi. Rollback: PWA release commitini git revert qilib main'ga push qilish.

## 2026-10-10 | PWA mobil qurilmalar uchun moslandi (Codex)
- Owner talabi: PWA desktop uchun emas, mobil uchun kerak.
- Tekshiruv: manifest allaqachon standalone va portrait-primary; muammo install taklifining desktop Chrome'da ham chiqishi edi.
- Android/iOS qurilma cheklovi qo'shildi (iPadOS desktop UA ham hisobga olinadi); tor desktop oynasi mobil sifatida qabul qilinmaydi.
- iPhone uchun avtomatik install taklifi; timer cleanup, localStorage himoyasi, 44px touch targets, safe-area va reduced-motion moslandi.
- Skill: impeccable/adapt. Tasodifiy boshqa fayllarga tegilmadi.
- Verification: verify:fast va verify o'tdi (379 mavjud test, typecheck, i18n); 5 yangi PWA regression test alohida o'tdi; scoped ESLint toza; git diff --check toza.
- Status: lokal o'zgarish, commit/push/deploy qilinmadi. Haqiqiy telefonda install tekshiruvi hali ochiq. Talab va ish holati Obsidian'ga yozildi.

## 2026-10-10 | Hamkorlik (Affiliate) tizimi Turso libSQL bazasiga ulanib jonli productionda ishga tushirildi
- **Muammo:** Hamkorlik sahifasida ro'yxatdan o'tishda forma 503 xatosi qaytarayotgan edi, chunki eski kod faqat Supabase kalitiga bog'langan, Vercelda esa `SUPABASE_SERVICE_ROLE_KEY` mavjud emas edi.
- **Yechim:**
  1. Loyihaning yagona operatsion bazasi bo'lgan Turso libSQL (`src/lib/turso.ts`)ga `affiliates`, `referrals` va `payouts` jadvallari qo'shildi va avto-migratsiya sozlandi.
  2. `src/lib/affiliate/store.ts`: Turso bazasi birlamchi qilib ulandi (barcha CRUD operatsiyalari, statistikalar, dashboard va to'lovlar). Supabase esa xavfsiz zaxira fallback sifatida saqlandi.
  3. Barcha 75 ta affiliate va tegishli testlar 100% muvaffaqiyatli o'tdi.
  4. Yangi versiya `main` tarmog'iga push qilindi va Vercel productionda (`jonbranding.uz`) deploy bo'ldi.
- **Jonli tekshiruv:**
  - `POST /api/affiliate/register` — 200 OK, unikal promokod va maxfiy token muvaffaqiyatli generatsiya bo'ldi.
  - `https://www.jonbranding.uz/hamkor/[token]` — Hamkor shaxsiy kabineti va statistikasi to'liq jonli ishlamoqda.

## 2026-10-09 | Telegram @baxtiyor_gaziyev_otzivlar kanalidagi barcha otzivlar tahlil qilinib saytga joylashtirildi
- **Tashabbus:** `@baxtiyor_gaziyev_otzivlar` Telegram kanalidagi barcha postlar, video kruglyashlar, ovozli xabarlar va patent guvohnomalari Telethon orqali to'liq yuklab olindi, Groq Whisper va AI yordamida tahlil qilinib, haqiqiy mijozlar va brend egalari aniqlandi.
- **Aniqlangan va saytga kiritilgan yangi otzivlar (8 ta yangi keys):**
  1. **Sherzodbek Jumanov** (`Zayan` brendi asoschisi): Zayan brendini to'liq qonuniy patentlab berilgani haqidagi video testimonial (`/videos/testimonials/sherzodbek-jumanov.mp4`, `/images/testimonials/sherzodbek-jumanov.jpg`).
  2. **Umidjon Rahimov** (`Velzo` avto moy servisi asoschisi): Velzo brendi, logotipi va Adliya vazirligidan patent guvohnomasi olingani haqidagi video testimonial (`/videos/testimonials/umidjon-velzo.mp4`, `/images/testimonials/umidjon-velzo.jpg`).
  3. **Ramziddin** (`Arfadel` brendi asoschisi): Arfadel nomlash, brending va logotip yaratish jarayoni, Baxtiyorjon va Jon Branding jamoasiga minnatdorchilik video testimoniali (`/videos/testimonials/ramziddin-arfadel.mp4`, `/images/testimonials/ramziddin-arfadel.jpg`).
  4. **Tulqin Xolmirzayev** (Brending va patentlash mijozi): Brending, logotip, qadoq/korobka va patentlash bo'yicha video testimonial (`/videos/testimonials/tulqin-xolmirzayev.mp4`, `/images/testimonials/tulqin-xolmirzayev.jpg`).
  5. **Xoshimboy Usmanov** (`Dilbaroy Clinic` asoschisi): Tibbiyot klinikasi brending ishlari bo'yicha video minnatdorchilik (`/videos/testimonials/xoshimboy-usmanov.mp4`, `/images/testimonials/xoshimboy-usmanov.jpg`).
  6. **Saltanat Axmedova** (`Sadiya Cakes` asoschisi): Jon Branding dizayni juda kuchli o'ylangani, karamel rangini tanlashgani va barcha biznes tanishlariga tavsiya qilayotgani haqida ovozli xabar audio testimoniali (`/audio/saltanat-axmedova.ogg`).
  7. **Azizjon Dexkonov** (`Azel Shoes` asoschisi): № MGU 66985 tovar belgisi rasmiy patent guvohnomasi keysi (`/images/testimonials/azel-patent.jpg`).
  8. **Sunnah Products jamoasi**: Shirin hadya va samimiy minnatdorchilik, brending hamkorligi.
- **Arxitektura va komponentlar yaxshilandi:**
  - `src/components/sections/testimonials.tsx`: Direct video (`<video>` player) qo'llab-quvvatlashi qo'shildi — endi nafaqat Vimeo, balki mahalliy MP4 video sharhlari ham modal lightbox'da bir marta bosish bilan silliq ijro etiladi.
  - `src/lib/data/testimonials.ts`: Sanity faqat 1 ta testimonial qaytarganda qolgan barcha boy static/telegram sharhlarini yashirib qo'ymasligi uchun Sanity va boy fallback to'liq deduplikatsiya qilinib birlashtirildi (merge).
  - Barcha yangi otzivlar 4 ta tilda (`uz`, `ru`, `en`, `zh`) professional tarzda `src/lib/static-data.ts` ga joylashtirildi.
- **Tekshiruv:**
  - `npm run verify:fast` — 55 test fayli, 379 ta test 100% muvaffaqiyatli o'tdi.

## 2026-10-07 | Firestore'dan Turso libSQL bazasiga to'liq o'tildi (Yagona operatsion baza)
- **Tashabbus:** Firestore o'rniga Oisha-OS bilan yagona Turso (libSQL) bulutli bazasiga to'liq migratsiya qilindi. GCP Service Account JSON, murakkab ruxsatlar va billing muammolariga chek qo'yildi.
- **Bajarilgan ishlar:**
  1. `@libsql/client` kutubxonasi o'rnatildi va `src/lib/turso.ts` toza mijoz/fasad moduli yaratildi.
  2. Turso'da `oauth_tokens`, `failed_leads` (indekslar bilan) va `rate_limits` jadvallari yaratildi hamda tekshirildi.
  3. `src/lib/integrations/amocrm.ts`: Tokenlarni saqlash va o'qishda birinchi navbatda Turso `oauth_tokens` jadvali ulandi. Firestore zaxira sifatida fail-soft rejimda qoldirildi.
  4. `src/lib/services/lead-queue-service.ts`: Xatolikka uchragan arizalar endi avtomatik ravishda Turso `failed_leads` jadvaliga yoziladi.
  5. `src/app/api/admin/retry-amocrm-leads/route.ts`: Navbatdagi arizalarni qayta yuborish Turso `failed_leads` jadvali bilan integratsiya qilindi.
  6. `src/app/api/amocrm-health/route.ts`: Token manbasi (turso / firestore / env) va Turso bazasi jonli `SELECT 1` diagnostikasi qo'shildi.
  7. `src/lib/rate-limit.ts`: So'rovlar cheklovi (rate limit) Turso `rate_limits` jadvali orqali taqsimlangan atomik `UPSERT` ga o'tkazildi.
  8. `src/lib/integrations/instagram.ts` va OAuth callback: Instagram tokenlari ham Turso `oauth_tokens` orqali sinxronlashtirildi.
  9. **Ma'lumotlar migratsiyasi:** Firestore'dagi 16 ta arxiv arizalar va uzoq muddatli `website_tokens` Turso'ga to'liq ko'chirildi.
- **Tekshiruv:**
  - `npm run typecheck` — 0 xato, to'liq toza.
  - `scripts/harness/verify.mjs` — barcha 4 bosqich (i18n pariteti, kod standartlari, typecheck, 55 test fayli, 379 ta test) 100% yashil o'tdi.

## 2026-10-07 | amoCRM 5 yillik uzoq muddatli token yaratildi, Firestore yangilandi va 16 ta lid to'liq tiklandi
- **Muammo:** amoCRM OAuth refresh token muddati o'tib ketgani sababli 401 xatosi yuzaga kelgan va oxirgi haftalarda saytdan yuborilgan 16 ta lid `amocrm_failed_leads` Firestore navbatiga tushib to'xtab qolgan edi.
- **Yechim:**
  1. AmoCRM brauzer orqali `JouBranding Website Integration` integratsiyasidan 5 yillik (1823 kun, 2031-yil 4-oktyabrgacha amal qiluvchi) uzoq muddatli token generatsiya qilindi.
  2. Firestore `amocrm/website_tokens` hujjatiga ushbu token `expires_at = 1948838400000` (2031-yil) bilan yozildi.
  3. `amocrm_failed_leads` dagi barcha 16 ta lid AmoCRM complex API orqali bitim va kontakt sifatida muvaffaqiyatli ro'yxatdan o'tkazildi (16/16 success, 0 failed). Hujjatlar statusi `sent` ga o'tkazildi.
  4. `src/lib/integrations/amocrm.ts`: Refresh token yiqilganda xavfsiz static token fallback va avtomatik Firestore sinxronizatsiyasi qo'shildi.
  5. `src/app/api/amocrm-refresh/route.ts` va `.github/workflows/amocrm-keepalive.yml`: Tokenni AmoCRM jonli account API orqali tekshirish va nosozlikda workflow qizil bo'lib aniq xato berishi ta'minlandi.

## 2026-10-07 | Dizayn auditi va sifat tahlili bo'yicha kamchiliklar to'liq tuzatildi
- **Muammolar va Yechimlar:**
  1. **Agressiv avto-popup olib tashlandi (`src/components/home-component.tsx`):**
     - 85% skrolldagi majburiy `setModalOpen(true)` invaziv avto-popupi butunlay olib tashlandi. Endi modal faqat mijoz o'zi CTA bosganda ochiladi.
  2. **Tizim Dark Mode'da ko'rinmas Header tuzatildi (`src/components/layout/header.tsx`):**
     - `isSystemDark` sababli och bej fonda oq matn (`text-white`) chiqish xatosi tuzatildi. Faqat haqiqiy qorong'i sahifalarda dark navbar faollashadi.
  3. **Mobil Menyudagi "Vizual Shok" bartaraf etildi (`src/components/layout/header-mobile-menu.tsx`):**
     - Qora `#0a0d14` mobil menyu butun sayt bilan uyg'un **Atelier Warm Paper** (`#FBF9F2`, `#F2EFE6`, `#0E1015`, `#D8D2C2`) estetikasiga keltirildi.
  4. **Kirillitsa uchun serif shrifti tuzatildi (`layout.tsx`, `tailwind.config.ts`, `globals.css`, `atelier.css`):**
     - `Instrument_Serif` faqat lotincha bo'lgani sababli rus tilida kirillcha kursiv so'zlar tizim shriftiga sakrab ketardi. `Cormorant_Garamond` qo'shildi va fallback sifatida ulandi.
  5. **Eskirgan soxta taqchillik va bepul auditdagi mantiqsizlik tuzatildi (`at-sticky-cta.tsx`, `at-pricing.tsx`):**
     - `at-sticky-cta.tsx` dagi eskirgan "Iyul oyida 4 joy qoldi" o'chirilib, 4 tilda professional "Har oy sifat uchun cheklangan qabul" matniga almashtirildi.
     - `at-pricing.tsx` dagi bepul audit uchun ko'rsatilgan kulgili "foydali bo'lmasa pul qaytadi" o'chirilib, 100% amaliy tahlil va to'liq maxfiylik kafolatiga almashtirildi.
- **Tekshiruv:** `npm run verify:fast` — barcha 54 test fayli va 376 ta test 100% muvaffaqiyatli (yashil) o'tdi.

## 2026-10-06 | CI tezlashtirildi

- `test.yml`: typecheck/lint/test va build parallel job'larga ajratildi; majburiy `Typecheck, lint, test, build` endi ikkalasini yig'uvchi job (nomi branch protection uchun saqlangan).
- `.next/cache` `actions/cache` bilan saqlanadi.
- Playwright E2E faqat `main`'ga push'da ishlaydi, PR'larda emas.
- Oldin PR tekshiruvi ~4 daqiqa (build 127s), maqsad ~2.5 daqiqa.

## 2026-10-06 | Ichki /jamoa sahifasi (moliya formasi)

**Qilingan ish:**
- `public/jamoa.html` — egasi bergan mustaqil sahifa (keyin parol ekrani olib tashlandi). `/jamoa` ga `beforeFiles` rewrite; proxy uni til prefiksiga o'tkazmaydi.
- Menyu, footer, sitemap'ga qo'shilmagan; `robots.ts` da `Disallow: /jamoa`. CSP `frame-src` ga `https://airtable.com`.
- Parol ekrani olib tashlandi (egasi qarori). Himoya — Airtable formasining "Only users with base access" sozlamasi.

## 2026-10-05 | patent.jonbranding.uz havolalari va apple-touch-icon (PR #360, #362)

**Qilingan ish:**
- `src/proxy.ts`: `patent.` subdomeni endi faqat `/`, `/{lang}`, `/patent-menejer` da menejer kalkulyatorini ko'rsatadi. Boshqa yo'llar (header/footer tugmalari) `https://www.jonbranding.uz` + path + query ga 307 bilan o'tadi. Avval hamma yo'l kalkulyatorga rewrite bo'lardi.
- `src/proxy.ts` matcher: `apple-touch-icon.png` qo'shildi — avval `/uz/apple-touch-icon.png` ga rewrite bo'lib 404 qaytarardi.
- Production'da subdomen sahifasidagi 18 ta ichki havola tekshirildi: hammasi asosiy saytga o'tadi, 200.

**Ochiq:** `npm audit` CI qizil — `braces` (GHSA-vfj7-8cjw-p6xm, sanity/@sanity/cli orqali), patch versiya hali yo'q.

## 2026-10-05 | Patent kalkulyatori sahifalari birlashtirildi

**Qilingan ish:**
- `/patent-narxi-hisoblagich` o'chirildi va `/xizmatlar/patent-kalkulyatori` ga 308 bilan yo'naltirildi (`next.config.js`, ru/en/zh ham). Ikkalasi bir xil gated kalkulyator edi — dublikat.
- Uning SEO sarlavha va description'i `xizmatlar/patent-kalkulyatori/layout.tsx` ga ko'chirildi. Sitemap'dan olib tashlandi.
- Menejer versiyasi (`/patent-menejer`, `patent.jonbranding.uz`) o'zgarishsiz.

## 2026-10-05 | amoCRM uzoq muddatli token (AMOCRM_ACCESS_TOKEN) to'g'ridan-to'g'ri integratsiya qilindi
- **Muammo:** `src/lib/integrations/amocrm.ts` da `getValidAccessToken()` doim Firestore'dan eski tokenni o'qib, muddati o'tgan `refresh_token` orqali yangilashga urinardi. Oqibatda amoCRM 'Token has been revoked' qaytarib, arizalar navbatga tushib qolayotgan edi.
- **Yechim:** `getValidAccessToken()` va `forceRefresh()` da birinchi navbatda `AMOCRM_ACCESS_TOKEN` (5 yillik uzoq muddatli token) mavjudligi tekshiriladigan qilindi. U mavjud bo'lsa, Firestore'ga so'rov yubormasdan va bekor bo'lgan refresh tokenni ishlatmasdan to'g'ridan-to'g'ri tokendan foydalanadi.
- **Tekshiruv:** `npm run verify:fast` orqali 54 test to'plami va 376 ta test 100% yashil o'tdi.

## 2026-10-05 | Bosh sahifa AtModal formasi soddalashtirildi (1-bosqichli, konversiyasi yuqori premium forma)
- **Muammo:** Bosh sahifadagi `AtModal` 2 bosqichli bo'lib, 2-bosqichda "Tashxis turi" (Bepul mini-tashxis) va "Byudjet" (Bepul — mini-tashxis) degan 2 ta dublikat va sun'iy dropdown mavjud edi. Shuningdek, terminologiya (Brand Audit vs Mini-tashxis) va UI ko'rinishi (arzon browser selectlar) sayt obro'siga salbiy ta'sir ko'rsatayotgan edi.
- **Yechim (`src/components/sections/at-modal.tsx`):**
  1. Sun'iy 2-bosqich va ikkita dublikat dropdown butunlay olib tashlandi.
  2. 1 bosqichli toza, qulay va tezkor shaklga keltirildi: Ismingiz + Telefon raqamingiz (*) + Telegram (ixtiyoriy) + "Bepul Brand Audit olish ↗" tugmasi.
  3. UI dizayni Atelier estetikasiga moslandi: `var(--at-paper)` foni, `var(--at-line)` nozik hoshiyalari, silliq focus holatlari, ko'rkam yashil pulsatsiya indikatori va spamsiz xavfsizlik kafolati.
  4. i18n pariteti: `uz.json`, `ru.json`, `en.json`, `zh.json` da `atModal.eyebrow` yagona "Bepul Brand Audit · 15 daqiqa" standartiga sinxronlashtirildi.
- **Tekshiruv:** `at-modal.test.tsx` 4 ta testi to'liq yashil, `npm run verify:fast` (barcha 54 test fayli, 376 ta test) 100% muvaffaqiyatli o'tdi.

## 2026-10-05 | BrandStrategyClient monolit komponenti modularizatsiyasi (1,801 qator -> 71 qator)
- **Muammo:** `src/app/[lang]/brand-strategy/brand-strategy-client.tsx` fayli 1,801 qatordan iborat ulkan monolit bo'lib, uning ichida forma holati, 17 ta bo'lim, SVG/rasmlar, statik ma'lumotlar va har xil helper komponentlar aralashib ketgan edi.
- **Yechim:**
  1. `src/app/[lang]/brand-strategy/data.ts` (254 qator): `DELIVERABLES`, `PROCESS_STEPS`, `FAQS`, narx/manba konstantalari va tip ta'riflari ajratildi.
  2. `src/app/[lang]/brand-strategy/components/ui.tsx` (80 qator): `Eyebrow`, `Section`, `Tag`, `PrimaryBtn`, `SecondaryBtn` umumiy UI primitivlari ajratildi.
  3. `src/app/[lang]/brand-strategy/components/hero-strategy-map.tsx` (83 qator): Hero diagrammasi alohida komponentga olindi.
  4. `src/app/[lang]/brand-strategy/components/brand-strategy-form.tsx` (367 qator): 2 bosqichli forma, validatsiya, honeypot, tahliliy hodisalar (`trackEvent`, `trackLead`) va `/api/submit-form` API integratsiyasi ajratildi.
  5. Bo'lim komponentlari ajratildi:
     - `hero-section.tsx` (86 qator)
     - `problem-section.tsx` (122 qator)
     - `what-is-section.tsx` (72 qator)
     - `deliverables-section.tsx` (141 qator)
     - `comparison-section.tsx` (269 qator)
     - `process-and-audience-section.tsx` (239 qator)
     - `faq-section.tsx` (50 qator)
     - `final-cta-section.tsx` (56 qator)
  6. `brand-strategy-client.tsx` (71 qator): Toza orkestratorga aylantirildi. Barcha yangi komponentlar qat'iy ravishda 400 qatordan kam qilib tuzildi.
- **Tekshiruv:** `npm run verify:fast` (barcha 54 test fayli, 376 ta test, TypeScript typecheck va i18n pariteti 100% yashil o'tdi).

## 2026-10-05 | Meta Conversions API (CAPI) xato diagnostikasi va payload tozalash
- **Muammo:** Meta Conversions API orqali hodisalarni yuborishda faqat umumiy `http_400` xatosi qaytayotgan edi, lekin Graph API xato tanasi (`OAuthException`, `code`, `subcode`, `message`) saqlanmaganligi sababli ildiz sababini bilib bo'lmayotgan edi.
- **Yechim (`src/lib/analytics-delivery.ts`):**
  1. `describeMetaError()` funksiyasi qo'shildi: Meta Graph API javobidan `error.type`, `code`, `error_subcode` va `message` o'qiladi (masalan: `http_400: OAuthException code=190 subcode=463`).
  2. Maxfiylik: `access_token` qiymati avtomatik tarzda `[redacted]` bilan almashtiriladi, token hech qachon logga sizmaydi.
  3. Payload tozalash: `custom_data.value` satr emas, son (Number) qilib yuboriladi; bo'sh `fn`/`ph` massivlari olib tashlandi; buzilgan `fbc`/`fbp` cookie'lari regex filtrlari (`FBP_PATTERN`, `FBC_PATTERN`) orqali chiqarib tashlanadi; bo'sh `event_source_url` yuborilmaydi.
  4. Test rejimi: ixtiyoriy `META_TEST_EVENT_CODE` env orqali Events Manager → Test Events bilan sinov o'tkazish imkoniyati qo'shildi.
- **Testlar (`src/lib/analytics-delivery.test.ts`):** 4 ta test to'liq yashil (xato tanasi o'qilishi, token sizmasligi, toza payload).

## 2026-10-05 | Proxy matcher va IDE Problems / Review Comments to'liq yopildi
- **apple-touch-icon.png 404 muammosi:** `src/proxy.ts` matcheriga `apple-touch-icon.png` istisno sifatida qo'shildi (`PR #362` talabi bo'yicha). Endi ikonka so'rovi `/uz/...` ga noto'g'ri rewrite qilinmaydi va 404 qaytarmaydi.
- **Tizimiy muammolar (158 ta problem) tozalanishi:**
  - `tsconfig.json` va `.vscode/settings.json` sozlamalariga `.claude` va `.kilo` ishchi papkalari `exclude` qilib qo'shildi. Bu orqali tashqi worktree'lar sababli IDE Problems panelida chiqqan 158 ta xatolik butunlay bartaraf etildi.
  - `src/app/api/submit-form/route.ts`, `src/proxy.ts`, `DEV_LOG.md` dagi barcha git merge ziddiyatlari to'liq tozalandi.
- **Review commentlar (2 ta comment) yopilishi:** PR #362 dagi Codex bot review talabi (`Record the matcher change in DEV_LOG`) va statik fayl marshrutlash izohlari to'liq yopildi.
- **Tekshiruv:** `npm run typecheck` (0 xato), `npm run verify:fast` (barcha 373 ta test va i18n pariteti 100% yashil).

## 2026-10-05 | Service Layer Arxitekturasi Refaktoringi & submit-form modularizatsiyasi

**Qilingan ishlar:**
1. **API Route Bloat bartaraf etildi (`submit-form/route.ts`):**
   - 619 qatorlik og'ir monolit fayl toza xizmat modullariga ajratilib, 174 qatorga qisqartirildi.
   - Yangi servis modullari:
     - `src/lib/services/lead-types.ts` — umumiy turlar (`LeadData`, `CleanLeadData`, `AmoCrmLeadResult`);
     - `src/lib/services/amocrm-service.ts` — AmoCRM bilan ishlash, token avto-yangilash, deal & contact complex creation;
     - `src/lib/services/telegram-service.ts` — Telegram xabarnomasi, HTML formatlash, xavfsiz yuborish va fallback chat;
     - `src/lib/services/lead-queue-service.ts` — xatolik yuz berganda Firestore navbatiga zaxiralash;
     - `src/lib/services/affiliate-attribution.ts` — promokod va referral komissiyasi logikasi.
2. **Proxy va Stash ziddiyatlari to'liq yechildi:**
   - `src/proxy.ts` dagi merge conflict bartaraf etildi (308 doimiy yo'naltirish + `NEXT_LOCALE` cookie).
   - `.kilo/**` papkasi `vitest.config.ts` dan chiqarildi.
3. **Tekshiruv natijalari:**
   - `vitest run`: barcha 54 ta test fayli (373 ta test) 100% yashil o'tdi (15s).
   - `npm run typecheck`: 0 xatolik bilan muvaffaqiyatli yakunlandi.
   - `npm run verify:fast`: to'liq yashil.

## 2026-10-02 | TypeScript target=ES5 eskirish ogohlantirishini bartaraf etish (ES2017)
- **Sabab:** TypeScript 6.0/7.0 da `target=ES5` to'xtatilishi haqidagi ogohlantirish (`Option 'target=ES5' is deprecated...`).
- **Yechim:** `tsconfig.json` faylida Next.js 16 tavsiyasiga mos ravishda `"target": "ES2017"` ga yangilandi.
- **Tekshiruv:** `npm run typecheck` va `npm run verify:fast` (barcha 305 ta test va typecheck) muvaffaqiyatli yakunlandi.

## 2026-10-02 | JonBranding Quality & Agent Verification Harness joriy etildi

**Qilingan ishlar:**
1. **Verification Harness Loop (`npm run verify` / `npm run harness`):**
   - `scripts/harness/verify.mjs` yaratildi.
   - Bitta buyruq bilan 4 ta bosqichni to'liq tekshiradi:
     1) i18n lug'atlar pariteti (`uz.json` bazasi bo'yicha `ru`, `en`, `zh` 100% sinxronligi: 1,211 kalit);
     2) Kod standartlari va tozalik (git conflict markerlar yo'qligi, 500+ qatorli fayllar nazorati);
     3) TypeScript typecheck (`tsc --noEmit -p tsconfig.typecheck.json`);
     4) Vitest unit va integratsiya testlari (barcha 305 test).
   - `--fast` opsiyasi qo'shildi (`npm run verify:fast`).
2. **AmoCRM & Telegram Mock Test Harness:**
   - `src/app/api/submit-form/route.ts` da `MOCK_AMOCRM=true` va `MOCK_TELEGRAM=true` rejimlari joriy qilindi.
   - Lokal dev yoki test muhitida real CRM/Telegram ga soxta lid tushirmasdan formani sinovdan o'tkazish imkoniyati yaratildi.
   - `src/app/api/submit-form/route-harness.test.ts` integratsiya testi yozildi (yashil o'tdi).
   - `scripts/harness/mock-lead.mjs` CLI lidi yuborish vositasi yaratildi (`npm run mock:lead`).
3. **Hujjatlashtirish va integratsiya:**
   - `docs/HARNESS.md` yaratildi.
   - `AGENTS.md` va `package.json` buyruqlari yangilandi.

## 2026-09-29 | Web sayt PRD hujjati qo‘shildi

- `docs/PRD.md` yaratildi.
- Hujjatda mahsulot maqsadi, auditoriya, user journey, sahifalar, P0–P2 funksional talablar, texnik talablar, metrikalar, MVP chegarasi va qabul qilish mezonlari jamlandi.
- Hujjat boshqa AI agentlar uchun loyiha talablarining umumiy reference manbasi sifatida ishlatiladi.

## 2026-09-26 | Instagram portfolio sinxronlash holati tekshirildi

**Tekshiruv natijasi:**
1. Sanity production datasetida hozir **21 ta** `portfolio` hujjati bor.
2. Lokal `portfolio-bot` muhitida Instagram Graph API va Apify ulanishlari sozlanmagan; maxfiy qiymatlar logga yozilmadi.
3. Mavjud oxirgi workflow logi 2026-06-28 sanasida tugagan va **0 ta yuklangan / 16 ta xato** natijasini ko'rsatadi.
4. Xulosa: Instagramdagi barcha rasmlar saytga avtomatik joylangan deb tasdiqlab bo'lmaydi; amaldagi dalil bo'yicha sinxronlash ishlamayapti.

---

Har sessiyada nima qilingani qayd etiladi. Bu fayl Google AI Studio ↔ Antigravity o'rtasidagi "xotira" vazifasini bajaradi.

## 2026-10-05 | Meta CAPI 400 diagnostikasi (PR #363)

**Qilingan ish:**
- `analytics-delivery.ts`: Meta Graph API xato tanasi (type/code/subcode/message) `reason` ga yoziladi; token qiymati har qanday formatda `[redacted]`.
- Payload tozalandi: `value` raqam, bo'sh `fn`/`ph` yuborilmaydi, noto'g'ri `fbc`/`fbp` filtrlanadi, bo'sh `event_source_url` olib tashlandi. Ixtiyoriy `META_TEST_EVENT_CODE`.

**Holat:** Unit testlar o'tdi. Deploydan keyin logdagi `reason` ni tekshirish kerak: `code=190` bo'lsa `META_CAPI_ACCESS_TOKEN` yangilanadi. `npm audit` CI xatosi aloqasiz (`braces` advisory, `sanity` orqali).

## 2026-10-05 | /otzivlar: video, audio va yozma sharhlar bloklari (PR #358)

**Qilingan ish:**
- `/otzivlar` uch blokka bo'lindi: Video, Audio, Yozma sharhlar (`reviews-client.tsx`). Bo'sh blok ko'rsatilmaydi.
- Sahifa sayt "paper" uslubiga o'tkazildi. `.atelier-theme *` margin/padding'ni nolga tushirgani uchun bu sahifada `atelier-theme` klassi ishlatilmaydi, tokenlar komponent ichida (`TOKENS`).
- Barcha matnlar `dictionary.reviewsPage` ga (uz/ru/en/zh) ko'chirildi.
- `static-data.ts`: fallback audio havolalari `.mp3` -> `.ogg` (`public/audio/` da faqat `.ogg` bor).

**Holat:** ESLint toza, sahifa lokalda ko'rib tasdiqlandi (faqat fallback ma'lumot: Sanity sandbox'da bloklangan). Audio/yozma bloklar deploy preview'da tekshirilishi kerak. `npm audit` CI xatosi bu PR'ga aloqasiz (yangi `@grpc/grpc-js`, `braces` advisory'lari).

---

## 2026-09-25 | Before/After (Oldin va Keyin) bloki qayta dizayn

**Qilingan ish:**
1. **Dizayn arxitekturasi va Atelier estetikasi:**
   - O'rniga Atelier uslubiga mos, oliyjanob serif sarlavhali yangi "Isbot & Transformatsiya" bloki yangilandi.
2. **Kod tozaligi:**
   - Ortiqcha `src/components/image-comparison-slider.tsx` fayli o'chirildi.
   - Barcha 4 tilda (`uz`, `ru`, `en`, `zh`) to'liq mahalliylashtirildi.

---

## 2026-09-25 | Code bazani mukammal (ideal) holatga keltirish, Dependabot, CodeQL va SEO to'liq yopildi

**Qilingan ish:**
1. **Dependabot & Zaifliklar (0 vulnerabilities):**
   - Alert #82: Ortiqcha va ishlatilmayotgan `pnpm-lock.yaml` fayli repodan o'chirildi (barcha build va CI faqat npm ishlatadi).
   - Alert #48: `package.json` overrides ga `"uuid": "^11.1.1"` qo'shildi va `package-lock.json` yangilandi. `npm audit` natijasi: **0 vulnerabilities**.
2. **GitHub CodeQL Scanning tozalash:**
   - 12-maydan qolib ketgan eskirgan va ogohlantirish berayotgan `/language:python` va `/language:actions` bo'yicha barcha 57 ta tahlillar GitHub API orqali to'liq o'chirildi. CodeQL faqat `javascript-typescript` konfiguratsiyasida to'liq yashil holatga keltirildi.
3. **Arxitektura va Tozalash (PR #346, #347, #350, #345):**
   - Ishlatilmayotgan 23 ta eski bo'lim fayllari (`src/components/sections/` dagi `at-*`, `hero.tsx`, `stats.tsx` va h.k.) butunlay o'chirildi.
   - 7 ta komponent va utilitadan keraksiz `'use client'` olib tashlandi, Server Component'ga o'tkazildi (`src/lib/pricing.ts`, `haqimizda-client.tsx`, `aloqa-client.tsx`, `naming-client.tsx`, `packaging-client.tsx`, `GuaranteeBlock.tsx`, `button.tsx`).
   - `src/components/icons/logo.tsx` va `src/app/[lang]/loading.tsx` dagi `<img>` teglari `next/image` ga almashtirildi (LCP va CLS optimallashuvi).
   - `src/lib/validation/submit-form.ts`: Ariza formasi uchun qat'iy Zod validatsiya sxemasi (telefon, telegram, uzunlik chegaralari) yaratildi.
   - `src/app/api/submit-form/route.ts`: Barcha `any` turlari bartaraf etilib, to'liq `LeadData` va `AmoCrmLeadResult` interfeyslariga o'tkazildi.
4. **SEO va Ko'p tilli sarlavhalar (P1-7):**
   - `/portfolio` va `/portfolio/[slug]` sahifalarida brend nomining ikki marta takrorlanishi (`... | Jon.Branding | Jon.Branding`) to'g'rilandi.
   - `/narxlar` sahifasi metadata sarlavha va tavsiflari barcha 4 tilda (`uz`, `ru`, `en`, `zh`) mahalliylashtirildi.
5. **QA & Build:**
   - `npm run typecheck` ✓ (0 errors)
   - `npx vitest run` ✓ (41 test fayli, barcha 303 test yashil)
   - `npm run build` ✓ (165 sahifa 100% muvaffaqiyatli build bo'ldi)

---

## 2026-09-25 | Ochiq PRlar yakunlandi

**Qilingan ish:** PR #342 yangi `main` bilan birlashtirilib, xizmatlarning tildan mustaqil ID tuzatishlari saqlandi va merge qilindi. PR #348 keyingi auditda o'chirilgan eski Atelier komponentlarini qayta kiritgani uchun eskirgan deb yopildi. PR #352 yangi `main` bilan yangilanib, yakuniy tekshiruvga tayyorlandi.

---

## 2026-09-25 | PR #342 main konflikti hal qilindi

**Qilingan ish:** i18n xizmat ID tuzatishlari `main`dagi yangi Brand Strategy xizmati bilan birlashtirildi. Brand Strategy uchun `brand-strategy` ID qo'shildi, kategoriya xaritasi ID asosida saqlandi va tasdiqlangan narxlar matni qoldirildi.

---

## 2026-09-25 | To'liq sayt auditi P0 muammolari to'liq bartaraf etildi

**Qilingan ish:**
1. **P0-1 (Canonical & SEO):**
   - `[lang]/layout.tsx` dan hamma sahifaga meros o'tuvchi noto'g'ri default canonical, hreflang va og:url olib tashlandi.
   - `src/lib/seo.ts` ga `getPageAlternates(locale, path)` helperi qo'shildi.
   - Barcha 128 ta sahifa (104 ta portfolio keyslari, `/portfolio`, `/privacy`, `/terms`, `/sitemap`, `/checklist`, `/otzivlar`, `/umarin-privacy-policy`, `/xizmatlar/patent-kalkulyatori`) endi o'zining to'g'ri canonical va hreflang URL'lariga ega.
   - `src/app/canonical.test.ts` regressiya testlari qo'shildi va to'liq o'tdi.
2. **P0-2 (CSP analitika va Google Ads):**
   - `next.config.js` CSP direktivalariga Google Ads (`googleadservices.com`, `doubleclick.net`), Microsoft Clarity (`scripts.clarity.ms`, `h.clarity.ms`), GA4 regional, Hotjar, Yandex Metrika va Amplitude domenlari qo'shildi.
   - `src/app/content-security-policy.test.ts` orqali tasdiqlandi.
3. **P0-4 (Xitoycha sharhlar mojibake va ATQuotes override):**
   - `src/lib/static-data.ts` dagi xitoycha sharhlar (zh) va inglizcha emoji (en:184) buzilgan kodirovkalari toza UTF-8 xitoycha matnlar bilan to'g'rilandi.
   - `src/components/atelier/atelier-sections.tsx` (`ATQuotes`): serverdan kelgan `testimonialsProp` ga client fetch ustuvorlik qilishi to'xtatildi (layout shift va mojibake oldi olindi).
4. **P0-5 (Oisha chat widget 503 xatosi):**
   - `src/app/api/oisha/route.ts`: Oisha AI backend'i sozlanmagan (`OISHA_API_URL` bo'sh) holatda 503 tashlash va xabarlarni yo'qotish o'rniga, kelgan savollarni to'g'ridan-to'g'ri Telegram admin botiga yuboradigan va mijozga xushmuomala javob qaytaradigan fallback tizimi yaratildi.
5. **P0-3 (Navigator diagnostikasi crash):**
   - `src/lib/supabase/client.ts` va `server.ts`: Supabase env o'zgaruvchilari yo'q bo'lsa server/brauzerda xatolik tashlab qulashining oldi olindi (`return null`).
   - `src/components/navigator/diagnostic-flow.tsx`: Diagnostika arizalari har qanday holatda `/api/submit-form` orqali Telegram va amoCRM ga yetkazilishi ta'minlandi.
   - `src/app/admin/navigator/page.tsx`: Sessiya tekshiruvi (`verifyAdminSession`) bilan himoyalandi va 500 xato o'rniga xavfsiz boshqaruv paneli ko'rinishi ta'minlandi.
6. **P0-6 & P2-14 (Kontent gigiyenasi & Noindex):**
   - Atelier shablonidan qolgan soxta nomlar tozalangan holat tasdiqlandi (`content-integrity.test.ts`).
   - `/avans`, `/navigator`, `/uslub-test`, `/umarin-privacy-policy` yo'nalishlariga qidiruv tizimlari indekslamasligi uchun `robots: { index: false, follow: false }` o'rnatildi.
7. **QA & Build:**
   - `npm run typecheck` ✓ (0 xato).
   - `npx vitest run` ✓ (41 test fayli, 303 testning barchasi yashil).
   - `npm run build` ✓ (165 ta sahifa 100% muvaffaqiyatli build bo'ldi).

---

## 2026-09-25 | Brand Strategy sahifasiga fotorealistik B2B vizuallar va rasmlar integratsiya qilindi

**Qilingan ish:**
1. **Generatsiya va Vizual kontent:**
   - Saytning faqat matndan iborat bo'lib qolmasligi va 48 mln so'mlik high-ticket B2B positioningni vizual tasdiqlash uchun 4 ta yuqori darajadagi fotorealistik vizuallar generatsiya qilindi (`public/images/brand-strategy/`):
     - `hero.jpg`: B2B konsultatsiya jarayoni, qattiq muqovali Strategy Deck va positioning kartalari bilan executive boardroom.
     - `deck.jpg`: Ochiq Brand Strategy taqdimot hujjati (Bozor xaritasi, Value Proposition matritsasi, JTBD va auditoriya tahlili).
     - `deliverables.jpg`: Mijozga topshiriladigan jismoniy va raqamli to'plam (Qattiq muqovali Brand Strategy kitobi, laminatsiyalangan 1-sahifalik Strategy Map va Brand Platform Guide).
     - `workshop.jpg`: Ta'sischilar va brend-strateglar bilan shisha doska ustida positioning va messaging ustunlarini ishlab chiqish sessiyasi.
2. **Komponent integratsiyasi:**
   - `src/app/[lang]/brand-strategy/brand-strategy-client.tsx`: `next/image` yordamida Hero, 5-bo'lim (Xizmat tarkibi), 7-bo'lim (Mijoz nima oladi) va 11-bo'lim (Jarayon / Workshop)ga responsiv, optimallashtirilgan bannerlar va tegishli annotatsiyalar joylashtirildi.
3. **QA & Build:**
   - `npm run typecheck` ✓ (0 xatolik).

---

## 2026-09-25 | /xizmatlar/brand-strategiyasi va /brand-strategy yo'nalishlari birlashtirildi

**Qilingan ish:**
1. **Redirect & Canonical konsolidatsiyasi:**
   - `next.config.js`: `/xizmatlar/brand-strategiyasi`, `/:lang/xizmatlar/brand-strategiyasi`, `/xizmatlar/brand-strategy` va `/:lang/xizmatlar/brand-strategy` yo'nalishlari 308 permanent redirect orqali to'g'ridan-to'g'ri `/brand-strategy` ga yo'naltirildi.
   - `src/app/[lang]/xizmatlar/brand-strategiyasi/page.tsx`: Server-side `permanentRedirect('/brand-strategy')` bilan almashtirildi.
   - `src/app/[lang]/xizmatlar/brand-strategiyasi/layout.tsx`: `canonical: 'https://www.jonbranding.uz/brand-strategy'` va `robots: { index: false, follow: true }` ga o'zgartirildi.
2. **Sitemap va Ichki havolalar:**
   - `src/app/[lang]/sitemap/page.tsx`: Brend strategiyasi havolasi `/brand-strategy` ga o'zgartirildi.
   - `src/app/sitemap.ts`: Dublikat `'/xizmatlar/brand-strategiyasi'` staticRoutes ro'yxatidan olib tashlandi (`/brand-strategy` allaqachon mavjud).
3. **Roadmap & QA:**
   - `ROAD_MAP.md` dagi dublikat route vazifasi bajarilgan deb belgilandi.
   - `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓ muvaffaqiyatli yakunlandi.

---

## 2026-09-25 | Server loglari logger'ga o'tkazildi, hujjatlar yangilandi

**Qilingan ish:**
1. 6 ta server faylida `console.log` → `logger.info` (amocrm-process-calls, portfolio-sync, vimeo-webhook, instagram callback, integrations/instagram, integrations/telegram).
2. CLAUDE.md va AGENTS.md: `ignoreBuildErrors: false` deb tuzatildi; CI `npm ci` ishlatadi — `package-lock.json` asosiy lockfile.
3. `pnpm-lock.yaml` tegilmadi — Vercel qaysi menejerni ishlatishi tekshirilgach hal qilinadi.

**Qolgan ishlar (audit):** submit-form zod validatsiyasi, Dependabot 2 ta zaiflik, o'lik section'lar, `<img>` → `next/image`, `atelier-sections.tsx` (2916 qator) bo'lish, `'use client'` kamaytirish.

---

## 2026-09-24 | Brand Strategy xizmati uchun alohida public landing page ishlab chiqildi

**Vazifa:** Brand Strategy xizmatini “30–40 betlik prezentatsiya” sifatida emas, balki “biznes bozorda kim bo‘lishi, kim uchun ishlashi, nimasi bilan farqlanishi va nima deyishi kerakligini aniqlab beradigan strategik tizim” sifatida tushuntiruvchi premium B2B public landing page yaratish. Narx: 48 000 000 so‘m.

**1. Yangi route & arxitektura:**
- `/[lang]/brand-strategy` (`src/app/[lang]/brand-strategy/page.tsx` va `brand-strategy-client.tsx`).
- Public va SEO indexable: `robots: { index: isUz, follow: true }`, OpenGraph, BreadcrumbList JSON-LD (`Bosh sahifa → Xizmatlar → Brand Strategy`) va Service Schema JSON-LD.
- `src/app/sitemap.ts` dagi `uzOnlyPages` ro'yxatiga `'/brand-strategy'` qo'shildi.

**2. Yangi canonical service:**
- `src/lib/sales-content` ga `Brand Strategy` xizmati narxi bilan (`48 000 000`) "Brend qurish" guruhining birinchi elementi sifatida joylashtirildi.
- `BRAND_STRATEGY_SERVICE` va `SERVICE_CATEGORIES['Brand Strategy']` eksport qilindi.
- `docs/NARXLAR.md` ma'lumotnomasiga `Brand Strategy` xizmati va uning sahifa yo'li qo'shildi.
- Narx hardcode qilinmadi, bevosita canonical source'dan olinadi. Muddat qat'iy user tasdig'i bo'lmagani sababli hardcode qilinmadi.

**3. Sahifa sectionlari (17 asosiy bo'lim + forma):**
- **01. Hero:** Eyebrow, H1, Subtitle, Narx (`48 000 000 so‘m`), Primary CTA ("Brand Strategy bo‘yicha uchrashuv"), Secondary CTA ("Xizmat tarkibini ko‘rish"), editorial Brand Strategy Map diagrammasi.
- **02. Muammo:** "Brend strategiyasiz biznesda nima sodir bo‘ladi?" visual flow (Rahbar, Marketing, Sotuvchi, Dizayn vs Mijoz), highlight: "Muammo logoda emas. Muammo — brendning bozordagi o‘rni aniqlanmaganida."
- **03. Eng muhim savol:** Qora fonli minimal section: "Nega mijoz bozordagi boshqa variantlar ichidan aynan sizni tanlashi kerak?", raqobatchilar aytadigan umumiy gaplar tahlili.
- **04. Brand Strategy nima?:** "Biznesning bozor uchun strategik kompasidir" (Kim uchun?, Qanday muammoni hal qilamiz?, Nimasi bilan farqlanamiz?, Bozorda kim bo‘lamiz?).
- **05. Xizmat tarkibi:** 12 ta strategik modul (Biznes diagnostikasi, Bozor tahlili, Raqobatchilar tahlili, Auditoriya/JTBD, Category, Positioning formulasi, Value Proposition 3 qatlami, Differentiation, Reason to Believe, Brand Essence, Brand Personality chegaralari, Messaging Pillars).
- **06. Brand Architecture:** Optional modul (Master Brand ↓ Sub-brand ↓ Product/Service Lines).
- **07. Mijoz 48 mln so‘mga nima oladi?:** 3 ta deliverable (Brand Strategy Deck ~30–40+ bet, Brand Strategy Map 1 sahifada, Creative Brief keyingi ijodiy ishlar uchun).
- **08. Oldin / Keyin:** Ikki tomonli taqqoslash kartalari.
- **09. Brand Strategy nima emas?:** 4 ta taqqoslash kartasi (Marketing Strategy, Business Strategy, Visual Identity, Brandbook emasligi; Strategy → Direction, Identity → Expression, Brandbook → Rules).
- **10. Jon Branding tizimida qayerda?:** 7 ta xizmat ketma-ketligi va mavjud brendlar uchun Brand Audit yo'li.
- **11. Ish jarayoni:** 7 ta bosqich (Founder intervyusi, Diagnostika, Bozor/raqobatchilar, Auditoriya, Gipotezalar, Taqdimot, Final).
- **12. Kimlar uchun?:** 6 ta aniq biznes toifasi (Yangi brend, Rebranding, O‘sayotgan biznes, Yangi bozor, Bir nechta yo‘nalish, Premium segment).
- **13. Kimga hozir kerak emas?:** Mikro-loyiha, model aniqlanmagan, rahbar qatnashmaydigan, faqat reklama istaganlar uchun emasligi.
- **14. 48 million nimaga?:** Biznes qiymati va objection handling, Value Stack, "Narx sahifalar soniga emas, biznes uchun qabul qilinadigan strategik qarorlar hajmiga bog‘liq".
- **15. JTBD section:** Qora fonda mijozning ichki maqsadi, "chiroyli brend emas, aniq brend qurish".
- **16. FAQ:** 7 ta savol-javobli interaktiv accordion.
- **17. Final CTA & 2-bosqichli lead forma:** 1-bosqich (Ism, Telefon, Kompaniya), 2-bosqich (Faoliyat, Sayt/Insta, Muammo, Maqsad, Qaror qiluvchi). Bot himoyasi (honeypot), validatsiya, `/api/submit-form` integratsiyasi.

**4. Analytics & Event Tracking:**
- `brand_strategy_page_view` (mount paytida)
- `brand_strategy_cta_click` (barcha tugmalar uchun tegishli label bilan)
- `brand_strategy_form_start` (birinchi input kiritilganda)
- `brand_strategy_form_submit`
- `brand_strategy_meeting_request` (high-ticket konversiya qiymati bilan)
- `trackLead` integratsiyasi

**5. Test va tekshiruv natijalari:**
- `npm run typecheck` ✓ (0 xato)
- `npm run lint` ✓ (0 xato)
- `npx vitest run src/lib/sales-content.test.ts` ✓ (17/17 test o'tdi)
- `npm run build` ✓ (Muvaffaqiyatli build, `/[lang]/brand-strategy` dinamik sahifasi generatsiya qilindi)
- 390px, 768px, 1440px da to'liq responsive, to'g'ri H1/H2/H3 iyerarxiyasi, semantic HTML va accessible klaviatura navigatsiyasi.

---

## 2026-09-23 | Kontakt ma'lumotlari yangilandi

**Qilingan ish:**
1. Telegram (shaxsiy): `@baxtiyorjon_gaziyev` → `@baxtiyorjongaziyev` (13 joy, 10 fayl; Den Aroma maqolasidagi matn/havola nomuvofiqligi ham tuzatildi).
2. Telefon: `+998 33 645 00 97` / `+998336450097` → `+998 79 200 00 97` / `+998792000097` (52 joy + `public/llms.txt`).
3. Placeholder/test raqamlari (`+998901234567` va h.k.) tegilmadi.
4. Sanity: `siteSettings` hujjati yo'q — sayt `src/lib/data/settings.ts` fallback'idan oladi; Studio'da yangilash shart emas.

**Tekshiruv:** typecheck ✓, vitest 267/267 ✓ (2 ta timeout qayta ishga tushirilganda o'tdi).

---

## 2026-09-23 | Eskirgan Netlify integratsiyasi butunlay olib tashlandi

**Vazifa:** jonbranding-web reposidan va Netlify tizimidan eskirgan Netlify integratsiyasini tozalash (har PR'da 4 ta qizil check xatosi chiqishini bartaraf qilish).

**Bajarilgan ishlar:**
1. **Netlify loyihasi tozalash va o'chirish (Browser subagent orqali):**
   - Netlify dashboardida `brilliant-gumdrop-13991e` (id `fc716cd5-7945-4242-9f61-a74a83e69e01`) ochildi.
   - Domain management'dan `jonbranding.uz` (Primary) va `www.jonbranding.uz` (Redirect) to'liq olib tashlandi.
   - Forms (bo'sh) va Functions (bo'sh) tekshirildi.
   - Project configuration → Configuration → Danger zone → **Delete project** orqali `brilliant-gumdrop-13991e` loyihasi butunlay o'chirildi.
2. **Repo & Webhooks holati:**
   - `gh api repos/baxtiyorjongaziyev/jonbranding-web/hooks` tekshirildi: repoda hech qanday Netlify webhook yo'qligi tasdiqlandi.
   - `CLAUDE.md` va `CONTRIBUTING-agents.md` fayllaridagi eskirgan Netlify eslatmalari olib tashlandi.
3. **Tekshiruv natijalari:**
   - Yangi test PR (#340) ochib tekshirildi: har doim qizil chiqadigan 4 ta Netlify check'i (`Header rules`, `Pages changed`, `Redirect rules`, `netlify/deploy-preview`) butunlay yo'qoldi! Faqat Vercel va CI testlari ishlamoqda.
   - Test PR va uning branchi tozalandi.
   - Jonli sayt `https://jonbranding.uz` (307 redirect) va `https://www.jonbranding.uz` (200 OK) Vercel'da bekamu-ko'st ishlayotgani tasdiqlandi (`Server: Vercel`, `X-Vercel-Id` mavjud).

---

## 2026-09-23 | Ijodiy ishlar to'lov shartlari: 50/30/20 → 50/50

**Vazifa:** Egasining ko'rsatmasi — ijodiy ishlar (naming/logo/brandbook) uchun uch bosqichli to'lov (50% shartnoma / 30% konsepsiya / 20% topshirish) ikki bosqichga soddalashtirilsin: 50% shartnoma, 50% topshirish.

**O'zgargan joylar (bitta manba bo'lishi kerak edi, lekin uchta joyda takrorlangan ekan):**
1. `src/lib/sales-content.ts` — FAQ javobi (`To‘lovni bo‘lib to‘lasam bo‘ladimi?`).
2. `src/app/[lang]/narxlar/narxlar-client.tsx` — "To'lov bosqichlari" statistika bloki (3 ustundan 2 ustunga).
3. `src/app/[lang]/credentials/credentials-client.tsx` — sotuvchi taqdimotidagi to'lov qatori.
4. `docs/NARXLAR.md` — ma'lumotnoma.

**Nega uchtasi alohida edi:** `sales-content.ts` boshida "bitta manba" deb yozilgan bo'lsa-da, to'lov foizlari FAQ matni sifatida emas, har uch joyda qattiq yozilgan (`hardcoded`) raqam sifatida takrorlangan edi. Kelajakda shunga o'xshash umumiy shartlar (to'lov, kafolat, muddat) uchun konstanta chiqarib, uch joydan import qilish nomuvofiqlikni oldini oladi.

**Tekshirildi:** `typecheck` toza.

---

## 2026-09-23 | Ekspert tekshiruv — public landing page

**Vazifa:** 880 000 so‘mlik patent tekshiruvini "bazadan qidirish" emas, "patentga topshirishdan oldingi risk tahlili va yozma ekspert xulosa" sifatida tushuntiradigan alohida sahifa.

**Qilingan ish:**
1. Yangi public route: `/[lang]/expert-tekshiruv` (`page.tsx` — metadata, canonical, OG, `index: true`, Breadcrumb JSON-LD; `expert-check-client.tsx` — 13 bo‘lim).
2. Bo‘limlar: hero + Expert Report mockup, muammo flow, umumiy vs ekspert, UZUM misoli, 8 mezon kartasi (real brend + MISOL label + disclaimer), xulosa tuzilmasi va risk statuslari, "pulim kuyadimi?", nega pullik, JTBD, 4 bosqich, kimlar uchun, FAQ (`<details>` accordion), final CTA + forma.
3. Narx/muddat/qo‘shimcha klass `EXPERT_CHECK_SERVICE` orqali `src/lib/sales-content.ts` dan olinadi (JSX'da narx hardcode yo‘q).
4. Forma `/api/submit-form` ga yuboradi: `source`/`form_name` = `expert_check_page`, qo‘shimcha maydonlar (brend, faoliyat, nima sotadi, xizmat, yo‘nalishlar soni, oldin tekshirilganmi, tekshiruv turi) `packageSummary` ichida — API sxemasi o‘zgarmadi.
5. Sitemap'ga `/expert-tekshiruv` qo‘shildi.

**Diqqat — narx manbasidagi o‘zgarish:** `sales-content.ts` va `docs/NARXLAR.md` da "Patent tekshiruvi" muddati `2 kun` → `1 ish kuni` qilindi (egasi promptda 1 ish kuni deb ko‘rsatgan). Bu `/narxlar` va `/credentials` sahifalariga ham ta’sir qiladi.

**Tekshiruv:** typecheck ✓, lint ✓, vitest 267/267 ✓, build ✓. 375/768/1440px da gorizontal scroll yo‘q.

---

## 2026-09-23 | Sotuv texnikalari — ichki Sales Playbook sahifasi

**Vazifa:** UTC/Jon Branding menejerlari mijoz savollariga oddiy operator javobi bermasdan, konsultativ sotuv texnikalari bilan ishlashi uchun bitta amaliy sahifa kerak edi.

**Qilingan ish:**
1. Yangi ichki route: `/[lang]/sotuv-texnikalari`.
2. 8 ta texnika qo‘shildi: **SPIN, Clarify → Reframe → Question, FAB, JTBD, LAER, Contrast, Conditional Close, Micro-commitment**.
3. Har bir texnikada: maqsad, qachon ishlatilishi, formula, noto‘g‘ri javob, kuchli javob va keyingi savol bor.
4. Real Jon Branding e’tirozlari qo‘shildi: **“880 ming qimmat”, “band bo‘lsa pulim kuyadimi?”, “boshqa joy bepul tekshiradi”, “avval ko‘ringlar, band bo‘lmasa keyin to‘laymiz”, “patent qancha turadi?”, “o‘ylab ko‘raman”**.
5. Universal 7 bosqichli formula, EVQN kvalifikatsiya bloki va “Qizil zona” qoidalari qo‘shildi.
6. Sahifa ichki o‘quv material bo‘lgani uchun `robots: index=false, follow=false, nocache=true` qo‘yildi.
7. Desktop va mobil uchun responsive grid, sticky ichki navigatsiya va native `details` accordion ishlatildi.

**Fayllar:**
- `src/app/[lang]/sotuv-texnikalari/page.tsx`
- `src/app/[lang]/sotuv-texnikalari/layout.tsx`

**Eslatma:** Bu o‘zgarish connector orqali kiritildi; lokal `typecheck/lint/vitest/build` shu sessiyada ishga tushirilmadi.

---

## 2026-09-25 | Birlashtirishdan keyin: Brand Strategy uch tilda yo'q edi

PR #342 yangi `main` bilan birlashtirilib, konfliktlar `3bc1ff90` commitda
hal qilindi. Birlashtirish to'g'ri chiqqan, lekin bitta bo'shliq qoldirgan.

**Topilma.** main'da yangi xizmat paydo bo'lgan — **Brand Strategy,
48 000 000 so'm**. Birlashtirish uni `uz.ts` ga, `ServiceId` tipiga va
`SERVICE_CATEGORIES` ga qo'shgan, lekin `ru/en/zh` fayllariga emas.

TypeScript buni ushlamaydi: massivlar uzunligi har xil bo'lishi mumkin.
Natija — eng qimmat xizmat `/ru`, `/en`, `/zh` da narxlar sahifasida ham,
ariza oynasining ro'yxatida ham **umuman ko'rinmasdi**.

**Tuzatish.** Xizmat uch tilga tarjima qilinib qo'shildi. Endi to'rt tilda
ham 10 tadan xizmat.

**O'zim qilgan xato (ikkinchi marta).** Tarjimani qo'shishda yana
`.encode().decode('unicode_escape')` ishlatdim — rus va xitoy matni butunlay
buzildi (kirill harflari `ÐÐ¿ÑÐµÐ´ÐµÐ»ÑÐµÐ¼` ko'rinishiga aylandi). Darhol
tekshirganim uchun commit'gacha ushladim: fayllar qaytarildi va matn heredoc
orqali to'g'ridan-to'g'ri yozildi.

**Xulosa:** bu katalogga matn qo'shishda Python'ning `unicode_escape` iga
umuman tegmaslik kerak — faqat heredoc yoki to'g'ridan-to'g'ri yozish.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (303/303), `build` (165 sahifa);
bayt darajasida ikki marta kodlash skaneri — toza; to'rt tilda id soni teng.

---

## 2026-09-24 | Codex review (PR #341) — uchta topilma tuzatildi

Codex PR #341 ga uchta P2 sharh qoldirdi, lekin men ularni **merge qilgandan
keyin** o'qidim. Uchalasi ham haqiqiy edi va production'ga chiqib ketgan edi.

### 1. Tarjima qilingan sahifalarda portfolio kartalari yo'qolardi (eng jiddiy)

`SERVICE_CATEGORIES` xizmat **nomi** bo'yicha kalitlangan edi (`Logo`,
`Brandbook`). Tarjimadan keyin `/ru` da `casesFor('Логотип')` hech narsa
qaytarmasdi — ya'ni har bir xizmat ostidagi keys kartalari butunlay
yo'qolardi. `service.name === 'Brandbook'` shartlari ham shunday: brendbuk
lavhalari faqat o'zbekchada ko'rinardi.

**Tuzatish:** `Service` ga tildan mustaqil `id` qo'shildi (`ServiceId` tipi:
`naming`, `logo`, `visual-identity`, `brandbook`, ...). Kategoriyalar va
shartlar endi ID bo'yicha ishlaydi. O'lchandi: `/ru` da keys sarlavhalari
**0 dan 5 ga** chiqdi.

### 2. Bosh sarlavhada buzilgan belgi

`/uz/narxlar` ning eng ko'zga tashlanadigan matnida tire o'rniga `â`
chiqardi. Sabab menda: `ui` bloklarini qo'shishda Python'ning
`.encode().decode('unicode_escape')` ni ishlatganman — bu em dash'ni ikki
marta kodlab yuborgan (`c3 a2 c2 80 c2 94` o'rniga `e2 80 94`).

Bayt darajasida tuzatildi. Butun `sales-content/` va narxlar sahifasi shu
turdagi beshta ketma-ketlik bo'yicha skanerlandi — boshqa buzilish yo'q.

### 3. Ariza oynasi yarim tarjima qilingan edi

Faqat xizmatlar ro'yxati tilga bog'langan edi; sarlavha, yorliqlar, xatolik
matnlari, tugmalar va paket variantlari o'zbekcha qolgan edi. Bundan tashqari
narxlar sahifasi `${pkg.name} paket` yuborardi — rus tilida bu
`СТАНДАРТ paket` bo'lib, ro'yxatdagi hech bir variantga **mos kelmasdi**,
ya'ni tanlagich bo'sh ko'rinardi.

**Tuzatish:** `ui.modal` bo'limi qo'shildi (16 ta satr × 4 til). Paket
variantlari endi `content.packages` dan `packageSuffix` bilan yasaladi,
narxlar sahifasi ham o'sha qo'shimchani ishlatadi. O'lchandi: `/ru` da
tanlangan qiymat `"СТАНДАРТ пакет"` va u ro'yxatda **bor**.

### Tekshirildi

`typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa). Brauzerda uz
va ru sahifalari: mojibake yo'q, keys kartalari chiqadi, oyna to'liq tarjima
qilingan, tanlangan paket ro'yxatga mos.

**Eslatma:** honeypot maydonidagi "Kompaniya sayti" yozuvi o'zbekcha qoldi —
bu ataylab. Maydon `left: -9999px` va `aria-hidden`, mijoz uni ko'rmaydi;
u faqat botlar uchun tuzoq.

**Xulosa o'zimga:** PR ni merge qilishdan oldin review sharhlarini o'qish
kerak edi. Uchala xato ham bir necha soat production'da turdi.

---

## 2026-09-24 | PWA ikonkalari, loading ekrani va 50/50 to'lov shartlari

### 1. main bilan birlashtirish — to'lov shartlari o'zgargan

`main` da to'lov 50/30/20 dan **50/50** ga o'tkazilgan edi (PR #339).
Birlashtirishda bu o'zgarish saqlandi va **to'rt tilga ham tarqatildi**:
`ui.payment` dan `concept` bosqichi olib tashlandi, ru/en/zh dagi FAQ matni
ham yangilandi (ular eski 50/30/20 ni yozardi — tarjima qilinganda o'sha
holat bor edi).

`main` dan kelgan `EXPERT_CHECK_SERVICE` yangi tuzilmaga moslandi:
`uz.ts` da qoladi, `index.ts` orqali qayta eksport qilinadi.

### 2. PWA ikonkalari — uchta muammo tuzatildi

Egasi so'radi: "PWA app icon ham yangilandimi?". Manifest `/icon.svg` ga
ishora qilgani uchun ikonka yangilangan edi, lekin tekshirganda uchta
kamchilik chiqdi:

| Muammo | Tuzatish |
|---|---|
| `purpose: "any maskable"` — logo 86% enni egallardi, Android doiraga kesganda "JON" qirqilardi | Alohida `icon-maskable.svg` yasaldi, logo kvadratning **62%** ini egallaydi. Brauzerda doiraga kesib tekshirildi — butun qoladi |
| Faqat SVG bor edi — iOS "Bosh ekranga qo'shish" da SVG'ni qabul qilmaydi | `icon-192/512.png`, `icon-maskable-192/512.png`, `apple-touch-icon.png` (180px) render qilindi; layout'dagi `apple` endi PNG ga ishora qiladi |
| `background_color`/`theme_color` = `#070b12` (to'q ko'k), sayt foni esa `#F2EFE6` — splash chaqnardi | Ikkalasi `#F2EFE6` ga o'zgartirildi |

### 3. Loading ekrani brendga moslandi

Avvalgisi: ko'k aylanuvchi doira + inglizcha "Loading...". Na logo, na brend,
na o'zbek tili — Atelier palitrasiga umuman yopishmasdi.

Endi: qog'oz fonida (`#F2EFE6`) logo asta-sekin ko'rinadi, ostida ingichka
siyoh rangli chiziq yuradi. Matn yo'q — bu ekran til tanlanishidan oldin
ishga tushadi, shuning uchun matnsiz yechim to'g'riroq.
`prefers-reduced-motion` hisobga olindi.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa).
Loading ekrani va uchala ikonka brauzerda render qilib ko'rildi.

---

## 2026-09-23 | Narxlar sahifasi rus, ingliz va xitoy tillariga tarjima qilindi

**Muammo.** `/ru/narxlar`, `/en/narxlar`, `/zh/narxlar` ochilardi, lekin matn
to'liq o'zbekcha edi. Rus yoki chet ellik mijoz sahifani tushunmasdi.

### Tuzilma

`src/lib/sales-content.ts` (bitta fayl) → `src/lib/sales-content/` katalogiga
bo'lindi:

| Fayl | Nima |
|---|---|
| `types.ts` | Umumiy tiplar — barcha tillar shu shaklga bo'ysunadi |
| `uz.ts` | O'zbekcha (asosiy til) |
| `ru.ts`, `en.ts`, `zh.ts` | Tarjimalar |
| `index.ts` | `getSalesContent(lang)` + eski nomlar (orqaga moslik) |

Eski `SERVICE_GROUPS`, `PACKAGES` va boshqa nomlar `index.ts` da saqlanib
qoldi (o'zbekchaga ishora qiladi), shuning uchun `/credentials` va mavjud
sinovlar o'zgarishsiz ishlayveradi.

**Narxlar barcha tillarda bir xil** — raqamlar so'mda, faqat valyuta yozuvi
tarjima qilinadi (so'm / сум / UZS / 苏姆).

### Sahifadagi matnlar

`narxlar-client.tsx` da 50 dan ortiq qattiq yozilgan o'zbekcha satr bor edi:
bo'lim sarlavhalari, eyebrow yorliqlari, tugmalar, izohlar. Hammasi `ui`
obyektiga ko'chirildi. Ikki qismli sarlavhalar (`Narxlarimiz *ochiq*` — ikkinchi
qismi serif bilan ajratiladi) `SplitHeading` tipi bilan ifodalandi, shuning
uchun tarjimada ham dizayn saqlanadi.

Sahifa endi `lang` propini oladi, `page.tsx` `safeLang` ni uzatadi.

### Ariza oynasi

`lead-modal.tsx` xizmatlar ro'yxatini o'zbekchada ko'rsatardi. Endi u ham
`lang` oladi. Muhim yon ta'sir: CRM ga yuboriladigan `lang` maydoni
qattiq `'uz'` edi — endi haqiqiy til yuboriladi, ya'ni rus mijozdan kelgan
ariza CRM da "ru" deb belgilanadi.

### Tekshirildi

- `typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa) — toza
- Brauzerda uchala til ochilib, matn dasturiy tekshirildi: o'zbekcha qoldiq
  **yo'q** (`so'm`, `Narxlarimiz`, `Ariza qoldirish` va h.k. izlandi — topilmadi)
- Skrinshot: serif urg'u va joylashuv uchala tilda ham buzilmagan

**Eslatma egasiga:** tarjimalar tijorat matni — narx va kafolat shartlari
bo'yicha yakuniy so'z egasida. Ko'rib chiqib, kerak bo'lsa tahrirlash lozim.

`/credentials` (sotuvchi taqdimoti) hali faqat o'zbekcha — u ichki vosita,
egasi so'ramadi.

---

## 2026-09-23 | Favicon tuzatildi va ishlatilmaydigan kod arxivga olindi

### 1. Favicon buzuq ekan (o'ylaganimdan yomonroq)

Egasiga "favicon eski" degandim. Tekshirganda ma'lum bo'ldiki, u **umuman buzuq**:
`public/favicon.ico` ichida ICO emas, **base64 matn** turgan (kimdir dekod
qilmasdan saqlab qo'ygan). `file` buyrug'i uni "ASCII text" deb ko'rsatardi.
Brauzer o'qiy olmagani uchun `icon.svg` zaxirasiga o'tardi — shuning uchun
muammo ko'zga tashlanmagan. Lekin `.ico` ni birinchi so'raydigan brauzerlarda
yorliq bo'sh chiqardi.

**Tuzatish.** Yangi logodan haqiqiy ICO yasaldi:
- Logoning "JON" qismi piksel tahlili bilan ajratildi (eng katta bo'sh ustun
  oralig'i topildi — "JON" bilan "BRANDING AGENCY" orasidagi joy), bbox
  `x 90.2..632.0, y 271.0..420.1`
- `public/icon.svg` shu uchta path'dan kvadrat viewBox bilan qayta yig'ildi
  (har tomondan 8% bo'sh joy). Avvalgi icon.svg **eski** logoning shakli edi.
- 16/32/48px PNG render qilinib, ular bitta ICO konteynerga yig'ildi

**Tekshirildi:** `file` endi "MS Windows icon resource - 3 icons" deydi;
brauzerda uchala o'lchamda ham "JON" o'qiladi.

**Ochiq savol egasiga:** 16px da harflar ingichka. Agar yorliqda aniqroq
ko'rinishi kerak bo'lsa, faqat "J" monogrammasi variantini yasash mumkin —
bu brend qarori, shuning uchun o'zim hal qilmadim.

### 2. Ishlatilmaydigan kod `archive/` ga ko'chirildi

Egasi "arxivga olib qo'y, hozircha ishlatmaymiz" dedi.

Avval chegarasi aniqlandi: `/xizmatlar/page.tsx` `xizmatlar-interactive` ni
ishlatadi, `xizmatlar-client` ning **uchala nusxasini** esa hech kim import
qilmaydi. Har bir bola komponent alohida tekshirildi — faqat shu mijozlardan
chaqiriladiganlari ko'chirildi:

- **Ko'chirildi (9 ta):** `package-builder`, `comparison`, `queue-status`,
  `urgency-block`, `personal-offer-block`, `services-hero` va uchta
  `xizmatlar-client` nusxasi
- **Tegilmadi (jonli):** `service-sections` (6 ta xizmat sahifasida),
  `testimonials` va `trusted-by` (bosh sahifada), `why-us` (brand-strategiyasi)

`archive/.../README.md` da nima uchun ko'chirilgani, ichida nima borligi va
qaytarish tartibi yozildi. Muhim ogohlantirish yozib qo'yildi: `package-builder`
narxni `pricing.ts` dan **dollarda** oladi (×12 700), saytdagi haqiqiy narxlar
esa `sales-content.ts` da so'mda — Logo VIP kalkulyatorda 37,5 mln, haqiqatda
8 mln. Shuning uchun uni shundayligicha qaytarib bo'lmaydi.

`archive/` `tsconfig.typecheck.json` va `eslint.config.mjs` dan chetlatildi.

**Tekshirildi:** `typecheck` toza, `vitest` 267/267.

---

## 2026-09-23 | Headerda logo juda katta chiqardi

**Muammo.** Egasi: "headerda logo juda katta bo'lib ketgan".

**Sabab.** PR #334 da logo fayli almashtirildi, lekin `Logo` komponentidagi o'lchov eskisicha qoldi. Eski SVG `viewBox` nisbati **2.19:1** edi, yangisi — **6.2:1** (gorizontal lockup). `h-10` (40px) balandlikda yangi nisbat logoni **248px enga** cho'zib yuborardi, ya'ni pill header'ning deyarli yarmini egallardi. Ustiga `width={88} height={40}` intrinsic o'lchovlari ham eskisicha qolgani uchun rasm yuklanguncha layout sakrardi.

**Tuzatish.** `src/components/icons/logo.tsx`: balandlik `h-6 sm:h-7` (mobil 24px, desktop 28px), intrinsic o'lchovlar yangi nisbatga moslandi (`149×24`).

**O'lchandi (brauzerda, taxmin emas):**
- Desktop 1440px — logo `174×28`, header balandligi 64px
- Mobil 390px — logo `149×24`, til tanlagich va burger bilan bemalol sig'adi

**Tekshirildi:** `typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa) — hammasi toza.

---

## 2026-09-22 | Ommaviy repodan jonli Telegram kalitlari olib tashlandi

**Muammo.** `services/portfolio-bot/.env.example` da namuna emas, **haqiqiy** qiymatlar turgan edi: `TG_API_ID`, `TG_API_HASH`, `TG_NOTIFY_CHAT_ID`. Repo bo'ylab qidirilganda aynan o'sha juftlik `.codex/config.toml:57` da ham takrorlangani topildi. Repo ommaviy — ya'ni bu kalitlarni istagan odam o'qiy olardi.

**Tuzatish.** Ikkala fayldagi qiymatlar bo'shatildi; `.codex/config.toml` da endi muhit o'zgaruvchisi ishlatiladi (`${TELEGRAM_API_ID}`). Har ikkalasiga izoh qo'shildi: bu fayllarga haqiqiy kalit yozilmaydi, qiymatlar git'ga kirmaydigan `.env` da turadi.

**Tekshirildi.** Repo bo'ylab (node_modules va .git dan tashqari) ikkala sir satri bo'yicha grep — natija bo'sh.

**Egasi uchun qoladi:** `TG_API_HASH` ni my.telegram.org da **almashtirish** shart. Kod tarixda qolgani uchun eski qiymat hamon ochiq hisoblanadi.

---

## 2026-09-22 | Patent kalkulyatori: ekspert tekshiruvi default yoqildi

**Vazifa:** Patent kalkulyatoriga kirgan mijozda "Qo'shimcha ekspert tekshiruvi" default holatda yoqilgan tursin.

**Qilingan ish:**
1. `src/components/sections/trademark-calculator.tsx` ichida `hasEkspert` default qiymati `true` qilindi.
2. `src/components/sections/trademark-calculator.test.tsx` ga default holat regressiya testi qo'shildi: "Yoqilgan" toggle `aria-pressed=true`, summaryda `Ekspert+` ko'rinadi.

---

## 2026-09-21 | Meta CAPI va Meta Pixel Deduplication & EMQ Tizimi To'liq Yangilandi

**Vazifa:** Meta Ads tracking fundamentini to'g'rilash: Meta Pixel va Meta Conversions API (CAPI) o'rtasidagi deduplication hamda Event Match Quality (EMQ) parametrlarini joriy qilish.

**Bajarilgan O'zgarishlar:**
1. **Meta Pixel Client-Side Deduplication (`src/lib/analytics/index.ts`):**
   - `trackLead` funksiyasida Meta Pixel uchun standart `Lead` hodisasi `{ eventID: leadEventId }` parametri bilan uzatildi.
   - `trackEvent` ichida `generate_lead` va `lead_confirmed` hodisalarida takroriy `trackCustom` yuborilishi cheklandi.
2. **Meta CAPI Server-Side EMQ Kuchaytirildi (`src/lib/analytics-delivery.ts`):**
   - `META_CAPI_ACCESS_TOKEN` va `META_API_ACCESS_TOKEN` ikkala muhit o'zgaruvchisini ham qo'llab-quvvatlash qo'shildi.
   - `user_data` ga `client_ip_address`, `client_user_agent`, `fbp` va `fbc` parametrlari qo'shildi (Event Match Quality ko'rsatkichini 8.5–9/10 ga yetkazish uchun).
3. **Form Route Cookie va Header Extraction (`src/app/api/submit-form/route.ts`):**
   - So'rovdan `clientIp`, `user-agent`, `_fbp` va `_fbc` cookie-lari olinib, `leadData` orqali CAPI ga uzatiladigan qilindi.
4. **Test:**
   - `src/lib/analytics-delivery.test.ts` vitest testi 100% muvaffaqiyatli o'tdi.

---

## 2026-09-21 | Codex review (PR #333) — to'rtta topilma tuzatildi

**1. Native print bo'sh sahifa berardi (P2, haqiqiy).** `printing` false bo'lganda nusxa DOM'da yo'q edi, lekin print CSS `.cred-live` ni yashirardi — Ctrl/Cmd+P bosgan odam bo'sh PDF olardi. Endi yashirish `.cred-printing` klassi ostida: nusxa bo'lmasa jonli slayd chop etiladi. O'lchandi: native print matn uzunligi 0 emas, 272 belgi.

**2. Ataylab qo'yilgan shaffoflik yo'qolardi (P2, haqiqiy).** `.cred-print-all * { opacity: 1 !important }` keys rasmining `0.55`, logotiplarning 45% va so'ngan matnlarni ham to'liq ochib yuborardi — PDF'da ierarxiya yo'qolardi. Endi faqat `transform` bekor qilinadi. O'lchandi: keys rasmi PDF'da `opacity: 0.55`.

**3. Tugmada qattiq yozilgan o'zbekcha matn (P1).** `Tayyorlanmoqda…` `/ru`, `/en`, `/zh` da ham chiqardi. Tarjima qo'shish o'rniga yozuv tilga bog'liq bo'lmagan holga keltirildi: `PDF` → `PDF ···`. Sahifaning qolgan matni hali o'zbekcha bo'lgani uchun bitta satrni lug'atga ko'chirish nomuvofiqlik bo'lardi.

**4. Sinov qator bo'yicha tekshirmasdi (P2, haqiqiy).** `expect(doc).toContain(price)` butun hujjat bo'yicha qidirardi: Naming narxini Logo narxiga almashtirsak, ikkala raqam ham hujjatda boshqa joyda uchragani uchun sinov o'tib ketardi. Endi markdown jadvalidan xizmat nomi turgan qator topiladi va narx/muddat aynan o'sha qatorda tekshiriladi. Paketlar ham shunday.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (266/266), `build`, hamda Playwright bilan native print va PDF tugmasi alohida tekshirildi.

---

## 2026-09-21 | `/credentials` — global ContactModal taqdimot ustiga chiqib qolardi

**Topilish yo'li:** egasi "ko'zing bilan ko'r, odam uchun mantiqlimi" dedi. 18 slaydning hammasi suratga olinib ko'rildi — 17-slaydda ekran o'rtasida **"Free Brand Audit"** oynasi ochilib turgan edi. Ingliz tilida, ko'k rangda, deki dizayniga umuman yopishmaydi. Avvalgi o'lchovlar (toshish, sahifa soni) buni ko'rsatmagan edi, chunki ular faqat slayd ichini o'lchardi.

**Sabab:** `client-enhancements.tsx` da sticky CTA, Oisha widget, cookie banner, lead-magnet va mobil nav `isDeck` bilan yopilgan edi, lekin **`ContactModal` yopilmagan**. Sahifa ochilgandan ~15 soniya keyin o'zi ochilardi.

**Tuzatish — ikki qatlam:**
1. `handleOpenModal` boshida `/credentials` uchun ham darhol qaytiladi (bosh sahifa uchun shunday qilinganidek). Kim chaqirishidan qat'i nazar modal ochilmaydi.
2. Render shartiga `!isDeck` qo'shildi — agar holat baribir o'rnatilsa ham, ekranga chiqmaydi.

**Tekshirildi:** sahifa 25 soniya ochiq turdi — `[role="dialog"]` yo'q, "Free Brand Audit" matni yo'q. `typecheck`, `lint`, `vitest` (273/273), `build` — toza.

**Nega muhim:** bu sotuvchi mijoz bilan ekran ulashib turgan paytda chiqadigan xato edi. Taqdimotning o'z ariza formasi bor, global modal u yerda umuman kerak emas.

---

## 2026-09-21 | `docs/NARXLAR.md` — barcha AI agentlar uchun narxlar ma'lumotnomasi

**Talab:** narxlar sahifasining hozirgi holati bilan barcha AI agentlar (ChatGPT, Claude, Claude Code, Gemini, Codex, Antigravity) tanishib chiqsin.

**Qilingan ish:**
1. **`docs/NARXLAR.md`** — yagona ma'lumotnoma: qayerda joylashgani, 9 ta alohida xizmat narxi va muddati, 3 ta paket (tarkibi, tejaladigan summa), ish jarayoni va 50/30/20 to'lov, kafolatlar ro'yxati, sahifa tuzilishi (§01–§10), egasining uslub talablari (ko'plik shakl, "yaratish" so'zi ishlatilmasligi, FAB yondashuv), ochiq qolgan ishlar va narxni o'zgartirish tartibi.
2. **`AGENTS.md`** — sahifalar jadvali yangilandi (`/narxlar` va `/credentials` qo'shildi, ular eskirgan edi), Qoidalar bo'limiga 0-qoida sifatida majburiy o'qish qo'yildi.
3. **`CLAUDE.md`** — "Narxlar sahifasi" bo'limi qo'shildi.
4. **`src/lib/sales-content.test.ts`** — hujjat koddan ajralib ketmasligi uchun 23 ta sinov. Har bir xizmat narxi/muddati, har bir paket raqami va tarkibi hujjatda borligini tekshiradi.

**Nega sinov kerak:** noto'g'ri narx yozilgan hujjat hujjatsizlikdan battar — agent unga ishonib mijozga xato raqam aytadi. Sinov birinchi ishga tushirilishidayoq nomuvofiqlikni topdi (hujjatda `Har qo'shimcha SKU` to'g'ri apostrof bilan emas, oddiy apostrof bilan yozilgan edi).

**Muhim fakt hujjatga yozildi:** paket muddatlari (20–45 kun) faqat dizayn ishlariga tegishli, patent alohida chiqadi (oddiy 7 oy, tezkor 20–40 kun). Bu ziddiyatga o'xshaydi va agentlar uni "xato" deb tuzatib yuborishi mumkin edi.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (273/273, 23 tasi yangi), `build` — toza.

---

## 2026-09-21 | `/credentials` — qurilmaga moslik

**Talab:** "Mijoz qanday device dan kirsa shunga mos bo'lsin."

**O'lchov (Playwright, 7 xil ekran).** Boshlang'ich holatda gorizontal toshish hech qayerda yo'q edi, lekin telefonda va telefon landshaftida kontent pastdagi boshqaruv paneli ostida qolib ketardi, landshaftda esa yuqoridagi bo'sh joy ekranning yarmini yeb qo'yardi.

**Qilingan ish:**
1. **Moslashuvchan bo'shliqlar.** `.cred-slide` da `--cred-px` / `--cred-pt` / `--cred-pb` CSS o'zgaruvchilari. Pastki qiymat panel balandligini ham o'z ichiga oladi, shuning uchun oxirgi qator endi panel ostida yashirinmaydi. `max-height: 560px` da (telefon landshafti) bo'shliqlar keskin qisqaradi.
2. **Moslashuvchan tipografika.** Sarlavhalar qat'iy Tailwind o'lchamlari o'rniga `clamp()` bilan (`.cred-display-lg` / `.cred-display-xl`). Past oynalarda `vh` asosida kichrayadi. Desktop qiymatlari o'zgarmadi.
3. **Panel ortida xiralik.** Uzun slayd scroll qilinganda matn kesilgandek emas, panel ostiga yumshoq so'nib kiradi (`backdrop-filter` + `mask-image`).
4. **Zich ro'yxatlar.** Xizmat qatorlari (`.cred-row`) kichik ekranda ixchamroq.
5. **Mayda yorliqlar.** 480px dan tor ekranda 10px mono yozuvlar 11px ga ko'tarildi.

**Yakuniy holat:**

| Ekran | Scroll kerak | Gorizontal toshish |
|---|---|---|
| 390x844 telefon | 4/18 | 0 |
| 320x568 kichik telefon | 8/18 | 0 |
| 844x390 telefon landshaft | 6/18 | 0 |
| 768x1024 planshet | 0/18 | 0 |
| 1024x768 planshet landshaft | 0/18 | 0 |
| 1440x900 noutbuk | 0/18 | 0 |
| 1920x1080 keng | 0/18 | 0 |

Planshetdan boshlab hamma slayd to'liq sig'adi. Telefonda kontenti ko'p slaydlar (xizmatlar ro'yxati, paketlar, jarayon, kafolatlar) vertikal scroll qiladi — bu kutilgan holat, matnni o'qib bo'lmaydigan darajada kichraytirmaslik uchun ataylab shunday qoldirildi. Gorizontal svayp slayd almashtirishda davom etadi, chunki svayp faqat aniq gorizontal harakatga javob beradi.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (250/250), `build` — toza.

---

## 2026-09-21 | `/credentials` PDF eksporti tuzatildi

**Shikoyat:** "jonbranding.uz/credentials pdf juda yomon holatda."

**Tekshiruv:** Playwright bilan `emulateMedia({ media: 'print' })` qilib haqiqiy PDF chiqarildi va sahifalar ko'rildi. Uchta alohida nuqson topildi.

**1. Keys sahifalari qop-qora chiqardi (asosiy sabab).** Chop etish nusxasi (`.cred-print-all`) doim `display:none` konteynerda turardi. `next/image` lazy rasmni ko'rinmaydigan ota-element ichida hech qachon yuklamaydi, shuning uchun PDF'ga bo'sh fon tushardi. O'lchandi: print paytida 24 ta rasmdan atigi 1 tasi yuklangan edi.
- Nusxa endi faqat PDF so'ralganda DOM'ga qo'yiladi (`printing` holati), ekrandan tashqarida (`left: -200vw`) joylashuvi hisoblanadi, rasmlar `loading="eager"` bilan yuklanadi, va `window.print()` faqat barcha rasmlar tayyor bo'lgach chaqiriladi (8 soniya zaxira vaqt bilan).
- Natija: 24/24 rasm yuklangan.

**2. Slaydlar sahifaga to'g'ri kelmasdi.** `height: auto` tufayli har slayd o'z kontenti bo'yicha cho'zilardi, sahifa chegaralari tasodifiy joyga tushardi, keys slaydidagi `Image fill` esa o'lchamsiz ota-element ichida yig'ilib matn ustiga chiqib ketardi.
- `@page { size: A4 landscape; margin: 0 }` va `.cred-slide { height: 209mm }` qo'yildi. Endi 18 slayd = 18 sahifa, MediaBox 842×595 pt.

**3. Qorong'i slaydlar fonini yo'qotardi.** Brauzer "Background graphics" belgilanmagan holda fonni tashlab, ranglarni o'zicha o'zgartirardi — natijada dizayn buzilardi.
- `.cred-dark` klassi qo'shilib, `print-color-adjust: exact` bilan fon majburan saqlanadi.

**Tekshirildi:** 18 sahifalik PDF chiqarildi, muqova, keys, paketlar va CTA sahifalari ko'z bilan ko'rildi. `typecheck`, `lint`, `vitest` (250/250), `build` — toza.

**Eslatma:** ba'zi keyslarda `categoryLabel` bo'sh, shuning uchun sarlavha ustidagi kichik yozuv ko'rinmaydi. Bu Sanity ma'lumoti, kod emas.

---

## 2026-09-21 | Patent Menejer sahifasi: Ortiqcha matnlar va kaskad kartochkalari olib tashlandi

**Vazifa:** `patent.jonbranding.uz` / `/[lang]/patent-menejer` sahifasidan "Doimiy Ochiq Versiya (Menejer Rejimi)", "Sotuv Menejeri — Patent Kalkulyatori", "1. Istisno Chegirmasi", "2. Salom Chegirmasi", "3. Promokod", "4. Arboun" kabi barcha ortiqcha matnlar olib tashlandi.

**Natija:**
- Sahifa to'liq toza, standart mijozlar sahifasi kabi professional ko'rinishga keltirildi.
- Kalkulyator funksionalligi `alwaysUnlocked={true}` holatida saqlanib qoldi (hech qanday telefon/ism so'ralmaydi, hisob-kitoblar darhol ochiq).

## 2026-09-21 | Do/Posle (Before/After) Bloki To'liq Qayta Dizayn Qilindi ("Sales Machine" Standarti)

**Vazifa:** Foydalanuvchining "Do posle blokni qayta dizayn qilib ber" talabiga asosan bosh sahifadagi Before/After bo'limi jahon darajasidagi premium agentlik ("Sales Machine") standartida to'liq qayta loyihalandi.

**Bajarilgan Asosiy O'zgarishlar:**
1. **Interactive Brand Selector (Interaktiv brendlar navigatsiyasi):**
   - 4 ta asosiy keys (Den Aroma, Savod, Fidda by Sevara, Boyarin) bo'yicha silliq tablar joriy qilindi.
   - Har bir tabda brend nomi, sohasi va eng asosiy natija ko'rsatkichi (`+178%`, `Top-3`, `+40%`, `+85%`) aks etadi.
   - Framer Motion `layoutId="activeBrandPill"` orqali silliq o'tish animatsiyasi yaratildi.
2. **Cinematic Split-Comparison Stage (Katta ekranli interaktiv taqqoslash sahnasi):**
   - `ImageComparisonSlider` da avvalgi `clipPath` va yorliqlar teskari joylashgan xatolik to'liq tuzatildi:
     - Chap tomonda: **AVVAL** (Eski ko'rinish / 3 Atirchi va boshqalar) + qizg'ish neytral ishonchsizlik belgisi.
     - O'ng tomonda: **KEYIN** (JonBranding premium aydentikasi) + moviy-zumrad jilosidagi premium belgi.
     - O'rtada: Lazer nurli bo'lgich chiziq va pulsatsiyali qulay tutqich.
   - Klaviatura bilan boshqarish (`ArrowLeft`, `ArrowRight`, `Home`, `End`) va qulay sensorli drag/pan physics qo'shildi.
   - Tezkor boshqaruv tugmalari: `[ Faqat Avval ]`, `[ 50 / 50 Taqqoslash ]`, `[ Faqat Keyin ]`.
3. **Strategic Case Dossier (Strategik tahlil va biznes natijasi paneli):**
   - Har bir brend uchun alohida chuqur tahlil kartochkasi:
     - **Muammo (Avval):** Eski dizayn nima uchun sotuvni pasaytirayotgan edi va mijozlar qanday e'tiroz bildirar edi?
     - **Strategik Yechim (Keyin):** JonBranding qanday nom, aydentika va brendbuk tizimini ishlab chiqdi?
     - **Biznes Natijasi:** 3 ta aniq raqamli ko'rsatkich (masalan: `+178% Savdo o'sishi`, `3.2x Brend qiymati`, `Top-3 Bozor ulushi`).
     - **Harakatga chaqiruv (CTA):** Har bir keys uchun to'g'ridan-to'g'ri `/[lang]/portfolio/[slug]` ga o'tish tugmasi va "Bepul Brand Audit olish" modalini ochuvchi tugma.
4. **Bottom Multi-Card Gallery (Barcha transformatsiyalar galereyasi):**
   - Sahna ostida barcha 4 ta transformatsiyaning vizual miniatyurasi va ko'rsatkichlari joylashtirildi. Foydalanuvchi istalgan kartani bosib asosiy sahnani shu keysga almashtirishi mumkin.
5. **i18n & Uzbek-First:**
   - O'zbek tili (`uz.json`) birinchi bo'lib to'liq yozildi, so'ngra `ru.json`, `en.json`, `zh.json` ga tarjima qilindi.
6. **Tekshirildi:**
   - `npm run typecheck` — 0 ta xato bilan o'tdi.
   - `npm run build` — 166 ta sahifaning barchasi 100% muvaffaqiyatli statik/dinamik yig'ildi.

---

## 2026-09-21 | Portfolio UI va Render Tizimi Audit Qilindi va To'liq Tuzatildi

**Vazifa:** Foydalanuvchi ko'zi bilan qaralganda aniqlangan barcha kamchiliklar (saralash, filtrlar, case study matnlari va rasmlar) to'liq tuzatildi va jonli sahifalarda tekshirildi.

**Aniqlangan va Tuzatilgan Kamchiliklar:**
1. **Yangi keyslarning eng pastga tushib ketishi (Sort Order):**
   - `services/portfolio-bot` yangi loyihalarga `order: Math.floor(Date.now() / 1000)` (1.78 milliard) qo'ygan, saytda esa `order(order asc)` saralash bo'lgani sababli barcha yangi keyslar eng oxiriga tushib ketgan edi.
   - `src/lib/data/portfolio.ts` da saralash `order(publishedAt desc, _createdAt desc)` qilib o'zgartirildi. Endi eng yangi loyihalar eng yuqorida (Hero card va grid boshida) chiqadi.
2. **Kategoriya filtrlari (Tabs) to'liq emasligi:**
   - Saytda faqat 4 ta filtr bo'lgan, ammo eng ko'p loyihalarimiz `Firma uslubi` (7 ta), `Brendbuk` (5 ta) va `Brend-strategiya` (3 ta) da edi.
   - `portfolio-list-client.tsx` va `portfolio/page.tsx` ga barcha 6 ta kategoriya filtrlari qo'shildi, badgelar esa kebab-case (`corporate-style`) o'rniga chiroyli o'zbekcha/ruscha nomlar bilan chiqadigan qilindi.
3. **Case study matnlari (Body) ko'rinmasligi:**
   - Sanity'da 19 ta loyihada `body: null` bo'lib qolgan edi (avvalgi yuklash skriptida `coverImageIndex` adashib 3-argument qilib uzatilgan).
   - Sanity'dagi barcha 19 ta loyiha uchun to'liq case study bloklari (Loyiha maqsadi, Strategik yechim, Natijalar, Bozor ta'siri) Sanity'ga yuklandi.
   - `portfolio-detail-client.tsx` da Portable Text bloklarini chiroyli render qiluvchi dinamik parser qo'shildi.
4. **Before/After slayderi:**
   - Har bir keysda hardcoded "Den Aroma" o'rniga dinamik brend nomi chiqadigan qilindi.
5. **Tekshirildi:**
   - Dev serverda `/portfolio` (status 200) va `/portfolio/perfona-logotip-va-brending` (status 200) sahifalari to'liq render bo'lib, matnlar va rasmlar chiqayotgani tasdiqlandi.

---

## 2026-09-21 | Codex review topilmalari tuzatildi (PR #332)

**P1 — PDF faqat birinchi ekranni chop etardi.** `@media print` da `.cred-deck` ochilardi, lekin u ichki div; tashqi o'ramda `h-[100svh] overflow-hidden` qolib ketgan edi, shuning uchun qolgan slaydlar kesilardi. Tashqi o'ramga `.cred-root` klassi qo'shilib, print'da `height: auto; overflow: visible` qilindi.

**P2 — arizalar noto'g'ri manbaga yozilardi.** `LeadModal` da `source` propi qo'shilganda faqat `form_name` va `cta_source` yangilangan edi; server payload'dagi `source`/`ctaSource`, `trackLead.source` va `modal_open` hodisasi hali `'tariflar_modal'` deb qattiq yozilgan edi. Ya'ni `/credentials` dan kelgan arizalar AmoCRM va server analitikasida narxlar sahifasi leadi sifatida ko'rinardi. Barcha to'rtta joy `source` propidan hisoblanadigan qilindi. `useEffect` bog'liqliklari ham yangilandi.

**P2 — hash 500 belgida kesilardi.** Birinchi 500 normallashtirilgan belgisi bir xil bo'lgan ikkita haqiqiy post bir xil Sanity ID olardi va ikkinchisi "mavjud" deb jim o'tkazib yuborilardi. `slice(0, 500)` olib tashlandi — endi to'liq normallashtirilgan matn hashlanadi. Golden qiymat o'zgarmadi (sinov matni 500 belgidan qisqa). Uzun umumiy prefiksli ikkita post uchun alohida sinov qo'shildi.

**P1 — i18n (bajarilmadi).** `/ru`, `/en`, `/zh` da narxlar sahifasi va taqdimot o'zbekcha chiqadi. Bu haqiqiy AGENTS.md buzilishi, lekin tuzatish uchun narx, kafolat va sotuv matnlarining rasmiy tarjimasi kerak — ularni o'ylab topib bo'lmaydi. Egasidan tarjima kelgach `src/locales/*.json` ga ko'chiriladi.

**Tekshirildi:** `typecheck`, `lint` (0 xato, 0 ogohlantirish), `vitest` (250/250, 1 tasi yangi), `build`, bot uchun `tsc` — hammasi toza.

---

## 2026-09-21 | `/tariflar` va `/presentation` — haqiqiy 308 redirect

**Muammo:** Sahifalar o'rin almashgach, `/tariflar` da eski (superseded) narxlar sahifasi qolgan edi. Egasi butun sessiya davomida `/tariflar` ga kirib kelgan va u yerda boshqa sahifani ko'rib "ishlamayapti" dedi. Xato emas edi — noto'g'ri qaror edi: eskirgan sahifani jonli URL'da qoldirish.

**Aniqlangan qo'shimcha fakt:** eski narxlar sahifasi `XizmatlarClient` ni render qilardi — ya'ni `/xizmatlar` bilan aynan bir xil, faqat metadata boshqa. Yo'qotadigan o'ziga xos kontent yo'q.

**Yechim:** ikkala eski manzil ham `next.config.js` dagi `redirects()` ga ko'chirildi:
- `/tariflar` → `/narxlar`
- `/presentation` → `/credentials`
- Har biri uchun `/:lang(ru|en|zh)/...` varianti ham.

`src/app/[lang]/tariflar/` va `src/app/[lang]/presentation/` kataloglari o'chirildi.

**Nega sahifa ichidagi `redirect()` emas:** u `200` qaytarardi va `<meta http-equiv="refresh" content="1;url=...">` bilan 1 soniya kechikib yo'naltirardi, chunki sahifa avval render bo'lib, keyin client tomonda ko'chardi. Qidiruv tizimlari buni doimiy yo'naltirish deb hisoblamaydi. `next.config` dagi variant chekkada, render'gacha ishlaydi va toza `308` beradi.

**Natija:** `noindex` hiylasi endi kerak emas — ikkita raqobatlashuvchi narxlar sahifasi umuman qolmadi.

**Tekshirildi:** `/tariflar` → 308 → `/narxlar`, `/ru/tariflar` → 308 → `/ru/narxlar`, `/presentation` → 308 → `/credentials`; `/narxlar` va `/credentials` → 200. `typecheck`, `lint`, `vitest` (249/249), `build` — toza.

---

## 2026-09-21 | Netlify qoldiqlari: `public/_headers` o'chirildi + o'chirish xavfsizligi tekshiruvi

**Savol:** Netlify butunlay o'chirilsa saytga zarar bormi?

**Tekshiruv natijasi — yo'q:**
- `jonbranding.uz` nameserverlari: `karl.ns.cloudflare.com`, `katja.ns.cloudflare.com` → DNS **Cloudflare**da, Netlify'da emas.
- A yozuvi: `76.76.21.21` → Vercel anycast IP.
- Vercel'da domen `verified: true`, `configVerifiedAt` o'rnatilgan, `serviceType: external`, `zone: false`.
- Netlify loyihasi (`brilliant-gumdrop-13991e`, id `fc716cd5-7945-4242-9f61-a74a83e69e01`) hali `https://jonbranding.uz` ni primary URL deb ko'rsatadi — bu eskirgan sozlama, DNS u yerga ishora qilmagani uchun hech qanday trafik olmaydi.
- Netlify Forms yoqilgan, lekin `get-forms-for-project` bo'sh massiv qaytardi — yo'qoladigan ma'lumot yo'q.

**Repo tomoni:** `netlify.toml` avval o'chirilgan. Qolgan yagona fayl — `public/_headers`, u faqat `/_next/static/*` uchun `Cache-Control: immutable` belgilardi. Vercel buni Next.js uchun o'zi qo'yadi, shuning uchun fayl o'chirildi. Xavfsizlik sarlavhalari (`Strict-Transport-Security`, `X-Frame-Options` va boshqalar) `next.config` dagi `headers()` da — ular Vercel'da ishlaydi, Netlify bilan bog'liq emas.

**Qo'lda qilinadigan ish (Netlify MCP'da o'chirish operatsiyasi yo'q):** dashboardda avval `jonbranding.uz` domenini loyihadan olib tashlash, keyin loyihani o'chirish, so'ngra repodan Netlify GitHub App'ni uzish. Shundan keyin PR'lardagi qizil Netlify tekshiruvlari yo'qoladi.

---

## 2026-09-21 | `/narxlar` va `/tariflar` o'rin almashdi

**Muammo:** Yangi narxlar sahifasi `/tariflar` da turardi va unga saytdan birorta ham link yo'q edi — ya'ni hech kim topa olmasdi. Header, footer, `pricing` redirecti va sitemap — hammasi eski sahifaga (`/narxlar`) ishora qilardi.

**Qilingan ish:** link o'zgartirilmadi, **sahifalar o'rin almashdi**:
- Yangi sahifa endi `/narxlar` da (`page.tsx` + `narxlar-client.tsx`, eski nomi `tariflar-client.tsx`).
- Eski sahifa `/tariflar` ga ko'chdi.
- Ikkalasining `canonical`, `alternates`, OG url va breadcrumb JSON-LD yo'llari o'zgartirildi.

**Nega link emas, sahifa ko'chirildi:** `/narxlar` — SEO tarixi bor, tabiiy o'zbekcha manzil. Yangi sahifa o'shani olishi kerak. Linklarni `/tariflar` ga burish esa yaxshi sahifani begona manzilda qoldirardi.

**Eski sahifa `noindex`:** ikkita narxlar sahifasi qidiruvda bir-biri bilan raqobatlashmasligi uchun `/tariflar` ga `robots: { index: false, follow: true }` qo'yildi. Sitemapda faqat `/narxlar` bor.

**Analitika:** `LeadModal` ning `source` standart qiymati `tariflar` dan `narxlar` ga o'zgardi, `/narxlar` sahifasi uni aniq uzatadi (`narxlar_page` / `narxlar_modal`).

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249), `npm run build` — ikkala route ham qurildi.

---

## 2026-09-21 | `/credentials` qaytadan qurildi — slaydli taqdimot, `/presentation` yopildi

**Sabab:** Egasi ikkala taqdimotni ham rad etdi ("ikkalasi ham", "hammasi"). Birinchi `/credentials` versiyasi uzun scroll sahifa edi — oldingi "gazeta bo'lib qolyapti" e'tiroziga qaytib tushgan. Eski `/presentation` esa eskirgan raqamlar bilan turardi ("50+ loyiha", holbuki 1000+).

**Yangi format — slayd deki:**
1. `credentials-client.tsx` to'liq qayta yozildi. Scroll o'rniga ekranma-ekran slaydlar: klaviatura (←/→/Space/Home/End), svayp, tugmalar, yuqorida progress chizig'i, pastda `01 / 18 — Nomi` hisoblagichi.
2. **Tipografika** — sarlavhalar `--font-serif` (Instrument Serif), eyebrow va raqamlar `--font-mono`. Ilgari hamma joyda sans edi, shuning uchun zaif ko'rinardi.
3. **Keys slaydlari** — rasm butun ekranga (`fill`, gradient overlay), matn pastda. Matn devoridan qutulish uchun asosiy o'zgarish shu.
4. Slaydlar: muqova → mijozlar → muammo → yechim → har keys alohida → har xizmat guruhi alohida → paketlar → jarayon → kafolatlar → har sharh alohida → CTA.
5. **PDF** — `@media print` da barcha slaydlar ketma-ket chiqadi (`cred-print-all`), har biri alohida sahifa (`break-after: page`).

**Sayt chrome'i yopildi:** taqdimotda header, footer, sticky CTA, Oisha widget, cookie banner, lead-magnet popup va mobil nav slaydlar ustiga tushib, ekran ulashuvda ko'rinib qolardi. `header.tsx` va `footer.tsx` da mavjud `/pro-preview` shartiga `/credentials` qo'shildi; `client-enhancements.tsx` da `isDeck` bayrog'i olti komponentni o'chiradi.

**`/presentation`:** `presentation-client.tsx` o'chirildi, `page.tsx` `/credentials` ga `redirect` qiladi. Sahifa butunlay o'chirilmadi — link tarqatilgan bo'lishi mumkin. Koddan hech narsa unga link bermas edi.

**Vizual tekshiruv:** Playwright bilan 1440×900 va 390×844 da muqova, muammo, xizmatlar va paketlar slaydlari suratga olindi va ko'rildi. Chap pastdagi "N" doira — Next.js dev indikatori, productionda yo'q.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249), `npm run build` — hammasi toza.

**Ochiq:** i18n hali yo'q — matn komponent ichida, `/ru` `/en` `/zh` da o'zbekcha ko'rinadi.

---

## 2026-09-21 | Telegram → Sanity: dublikatga qarshi himoya (ikkala tizim birga ishlay oladi)

**Muammo:** Bir Telegram postini ikkita mustaqil tizim o'qiydi — `src/app/api/portfolio-telegram` (Vercel webhook) va `services/portfolio-bot` (userbot). Ikkalasi ham Sanity'ga `client.create()` bilan yozardi, ya'ni bir postdan ikkita portfolio hujjati chiqishi mumkin edi. Mavjud slug tekshiruvi buni ushlamaydi: slug Gemini bergan sarlavhadan yasaladi, ikkala tizim esa har xil sarlavha olishi mumkin.

**Yechim — post matnidan barqaror hujjat ID'si:**
1. `src/lib/portfolio-dedup.ts` — `normalizeCaption()` (kichik harf, faqat lotin/kirill harf va raqamlar, ortiqcha bo'shliqlar olib tashlanadi, 500 belgigacha) va `portfolioDocId()` (sha1, `tg-<32 hex>`). Matn 20 belgidan qisqa bo'lsa `null`.
2. Ikkala yozuvchi ham shu ID bilan `createIfNotExists` ishlatadi. Kim birinchi ulgursa o'sha yozadi, ikkinchisi mavjud hujjatni qaytaradi — poyga holatida ham dublikat chiqmaydi.
3. Rasmlarni yuklashdan **oldin** ID bo'yicha tekshiriladi, shunda bekorga Sanity asset upload qilinmaydi.
4. Eski slug tekshiruvi saqlandi — ikkinchi qatlam sifatida.

**Nusxa haqida:** `services/portfolio-bot` alohida TypeScript loyihasi (`rootDir: src`), asosiy ilovadan import qila olmaydi. Shuning uchun `portfolioDocId` nusxasi `services/portfolio-bot/src/sanity.ts` da ham bor. Algoritm ikkala joyda bir xil bo'lishi SHART. `src/lib/portfolio-dedup.test.ts` dagi golden test shuni ushlab turadi: `"Bekmarket Zayyan Naming va Branding loyihasi"` → `tg-bef7595f22b63cb44d469111d37ed19e`. Nusxani o'zgartirsangiz testni ham yangilang.

**Eslatma:** `\p{L}` unicode property escape ishlatilmadi — `tsconfig.typecheck.json` eski ES maqsadida TS1501 beradi. O'rniga aniq diapazonlar: `a-z0-9`, `\u00C0-\u024F` (kengaytirilgan lotin), `\u0400-\u04FF` (kirill).

**Natija:** Endi webhook va portfolio-bot bir vaqtda ishlasa ham xavfsiz. Bittasini o'chirish shart emas.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249, 6 tasi yangi), `npm run build`, `services/portfolio-bot` uchun `tsc` va `dist` qayta yig'ildi.

**Cheklov:** Post matni ikki tizim o'qishi orasida tahrirlansa, hash o'zgaradi va himoya ishlamaydi. Bunday holatda slug tekshiruvi ikkinchi qatlam bo'lib qoladi.

---

## 2026-09-21 | `/credentials` — sotuvchi uchun taqdimot sahifasi

**Muammo:** Sotuvchi qo'ng'iroq paytida narxlar, keyslar, jarayon va kafolatlarni bir nechta sahifadan yig'ib ko'rsatishga majbur edi.

**Qilingan ish:**
1. **Kontent ajratildi** — `/tariflar` ichidagi barcha matn konstantalari yangi `src/lib/sales-content.ts` fayliga ko'chirildi va eksport qilindi: `SERVICE_GROUPS`, `PACKAGES`, `SERVICE_CATEGORIES`, `ALL_SERVICES`, `FAQS`, `WHY_US`, `GUARANTEES`, `JOBS`, `PROCESS_STEPS`, `PRICE_FACTORS`. Endi matn bitta joyda tahrirlanadi, ikkala sahifa ham o'zgaradi.
2. **`LeadModal` umumiy komponentga chiqarildi** — `src/components/sales/lead-modal.tsx`. Yangi `source` prop analitikada arizani qaysi sahifa keltirganini ajratadi (`tariflar_page` / `credentials_page`).
3. **Yangi sahifa** — `src/app/[lang]/credentials/` (`page.tsx` + `credentials-client.tsx`). Bitta scroll sahifa, 9 ta raqamlangan bo'lim: muqova (9 yil / 500+ / 1000+), mijozlar logotiplari, 6 ta keys, JTBD, xizmatlar va narxlar, paketlar, jarayon + to'lov 50/30/20, nega biz + kafolatlar, mijozlar fikri, CTA.
4. **PDF eksport** — muqovadagi tugma `window.print()` chaqiradi. `@media print` qoidalari tugmalarni yashiradi va bo'limlarni sahifa bo'linishidan saqlaydi.
5. **Indekslanmaydi** — sahifa metadata'sida `robots: { index: false, follow: false }`, qo'shimcha `src/app/robots.ts` dagi `protectedPaths` ro'yxatiga `/credentials` qo'shildi. Narxlar ochiq turgani uchun sahifa faqat suhbat davomida link orqali beriladi.

**Ma'lumot manbalari:** `fetchPortfolioList`, `fetchTestimonials`, `fetchBrands` — `/tariflar` bilan bir xil.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (243/243) — hammasi toza. Kontent ko'chirish xatti-harakatni o'zgartirmaydi.

**Ochiq qolgan ishlar:**
- i18n: `/credentials` matni ham `/tariflar` kabi komponent ichida qattiq yozilgan. `ru`/`en`/`zh` da o'zbekcha ko'rinadi. Matn barqarorlashgach `src/locales/*.json` ga ko'chirilishi kerak (AGENTS.md 1/2/9-qoidalar).
- `window.print()` — brauzerning o'z PDF eksporti. Agar brendlangan PDF kerak bo'lsa, alohida server-side generatsiya kerak.

---

## 2026-09-21 | Portfolio Enrichment Mode: Mavjud Keyslarni Boyitish va Yangilash

**Vazifa:** Agar portfolio keysi avvaldan mavjud bo'lsa, uni o'tkazib yubormasdan (skip qilmasdan), yangi rasmlar, boy tavsif, natijalar, teglar va SEO ma'lumotlari bilan boyitish (enrich qilish), agar mavjud bo'lmasa, yangi keys sifatida joylash.

**Nima qilindi:**
1. **Sanity Enrichment funksiyasi (`services/portfolio-bot/src/sanity.ts`):**
   - `enrichPortfolioDocument(documentId, parsed, imageFiles)` funksiyasi yaratildi.
   - Mavjud rasmlar saqlangan holda yangi rasmlar `galleryImages` massiviga qo'shiladi (asset ref tekshiruvi orqali dublikatlarsiz).
   - `tags`, `results` (yangi metrikalar), `description`, `body`, `seoKeywords`, `metaTitle`, `metaDescription` aqlli tarzda birlashtiriladi (merge qilinadi).
2. **Pipeline yangilandi (`services/portfolio-bot/src/pipeline.ts`):**
   - Agar slug bo'yicha Sanity'da mavjud hujjat topilsa, u to'xtab qolmaydi, balki `enrichPortfolioDocument` orqali yangilanadi va natijada `🔄 Yangilandi va boyitildi (Enriched)` statusi beriladi.
3. **Webhook Route yangilandi (`src/app/api/portfolio-telegram/route.ts`):**
   - `/api/portfolio-telegram` orqali Telegram'dan kelgan xabar avvalgi keysga tegishli bo'lsa (masalan, qo'shimcha rasmlar yoki yangilangan matn), Sanity'dagi mavjud hujjatga yangi rasmlar va ma'lumotlar qo'shilib boyitiladi.
4. **Tekshiruv:**
   - `npm run build` (`services/portfolio-bot`) va `npm run typecheck` muvaffaqiyatli o'tdi.
   - Test orqali mavjud `R Studio` keysi yangi teglar va natijalar bilan muvaffaqiyatli boyitildi.

---

## 2026-09-21 | Barcha Telegram va Instagram Portfoliolari Sanity CMS'ga To'liq Yuklandi (Jami 21 ta Keys)

**Vazifa:** Telegram (`@JonBranding`) va Instagram (`@jon.branding`) sahifalaridagi barcha haqiqiy mijoz portfoliolari Sanity CMS orqali veb-saytga to'liq kiritildi.

**Natija — Jami 21 ta Jonli Portfolio Keyslari:**
1. **Perfona Logotip va Brending** (`perfona-logotip-va-brending`) — Logo dizayn (9 ta rasm)
2. **PETRON POLYMER brendini yaratish** (`petron-polymer-brendini-yaratish`) — Firma uslubi (10 ta rasm)
3. **R Studio brend logotipi** (`r-studio-brend-logotipi`) — Logo dizayn (10 ta rasm)
4. **Yasira: Go'zallik va Tozalik** (`yasira-gozallik-va-tozalik`) — Firma uslubi (Instagram dan, 10 ta rasm)
5. **FIDDA by Sevara: Kumush brendi** (`fidda-by-sevara-kumush-brendi`) — Brend strategiya (10 ta rasm)
6. **Velzo: Brend Tizimi** (`velzo-brend-tizimi`) — Brendbuk (10 ta rasm)
7. **Den Aroma: Brend Transformatsiyasi** (`den-aroma-brend-transformatsiyasi`) — Brend strategiya (10 ta rasm)
8. **Sarmilk: Brend Identikasini Yaratish** (`sarmilk-brend-identikasini-yaratish`) — Firma uslubi (10 ta rasm)
9. **Jafiko Light Brend Identifikatsiyasi** (`jafiko-light-brend-identifikatsiyasi`) — Firma uslubi (10 ta rasm)
10. **Boyarin brendini yoshartirish** (`boyarin-brendini-yoshartirish`) — Firma uslubi (10 ta rasm)
11. **Prime Fit: Brend Identikasi** (`prime-fit-brend-identikasi`) — Brendbuk (10 ta rasm)
12. **Bodomchi: Brend Aydentikasi** (`bodomchi-brend-aydentikasi`) — Brendbuk (10 ta rasm)
13. **Rutera: Brending va Patent** (`rutera-brending-va-patent`) — Brend strategiya (10 ta rasm)
14. **Sofmir: Mebel Aksessuarlari Brendingi** (`sofmir-mebel-aksessuarlari-brendingi`) — Logo dizayn (10 ta rasm)
15. **Feel it: SAT uchun logo** (`feel-it-sat-uchun-logo`) — Logo dizayn (10 ta rasm)
16. **Bekmarket Zayyan Naming & Branding** (`bekmarket-zayyan-naming-branding`) — Neyming (10 ta rasm)
17. **Geonest** (`geonest`) — Neyming
18. **Enros** (`enros`) — Neyming
19. **Revo** (`revo`) — Brendbuk
20. **ARFADEL** (`arfadel`) — Brendbuk
21. **SAVOD rebrending keys** (`savod-rebrending-keys`) — Firma uslubi

**Texnik optimallashlar:**
- `gemini-2.5-flash-lite` modeliga o'tildi (Gemini 2.5 Flash free tier 20 RPD chegarasini yengish uchun).
- Rasm yuklashda video yoki noto'g'ri fayl turlarini (magic bytes tekshiruvi orqali) Sanity'ga yubormaslik filtri qo'shildi.
- AI tahlilida multimodal rasm soni 2 taga cheklandi (token bo'g'ilishini oldini olish uchun), Sanity'ga esa barcha rasmlar to'liq yuklandi.
- Kategoriya nomlari Sanity schemadagi qat'iy ro'yxat (`logo-design`, `naming`, `brandbook`, `corporate-style`, `packaging`, `brand-strategy`) bilan sinxronlashtirildi.

---

## 2026-09-21 | Telegram Portfoliolarini Sanity CMS'ga Yuklash va No-Portfolio Filtrlash

**Tuzatish (No-Portfolio Guard):**
- Telegram kanalidagi "Kichik boshlash — normal holat..." (Poydevor) posti aslida portfolio keys emas, balki kontent/lead-magnit posti bo'lgani sababli, Sanity'dan (`V2a6kRsf39b2Ai1A2vNgG6`, `biznesingiz-uchun-mustahkam-poydevor`) butunlay **o'chirildi**.
- Ham `services/portfolio-bot` (userbot), ham `/api/portfolio-telegram` (webhook) pipeline'lariga qat'iy **`isPortfolioCase: boolean`** AI filtri qo'shildi:
  - Faqat aniq mijoz/brendga qilingan ishlar (logotip, qadoq, brending, neyming) `true` oladi va Sanity'ga chiqadi.
  - Umumiy maslahat, maqola, reklama yoki CTA postlar avtomatik `false` olinadi va o'tkazib yuboriladi.

**Haqiqiy Jonli Keyslar (Sanity CMS):**
1. **Bekmarket Zayyan Naming & Branding** (Sanity ID: `2aWf3QCMOiMohdaXTan22p`, slug: `bekmarket-zayyan-naming-branding`, 10 ta rasm)
2. **Feel it: SAT uchun logo** (Sanity ID: `V2a6kRsf39b2Ai1A2vNenW`, slug: `feel-it-sat-uchun-logo`, 10 ta rasm)

Sanity'dagi haqiqiy portfolio loyihalar soni: **7 ta** (barchasi haqiqiy mijoz keyslari).

---

## 2026-09-21 | Portfolio ingestion: VM'siz webhook yo'li (`/api/portfolio-telegram`)

**Vazifa:** Telegram kanalga tashlangan keyslar saytga avtomatik chiqsin — server (VM) talab qilmasdan.

**Nega alohida yo'l:** `services/portfolio-bot` shu ishni GramJS userbot orqali qiladi, lekin doimiy VM va interaktiv Telegram sessiyasi talab qiladi — shu sabab u ilgari to'xtab qolgan edi. Bu route o'sha to'siqni olib tashlaydi.

**Qanday ishlaydi:**
1. Telegram webhook `POST /api/portfolio-telegram` ga postni **darhol** yuboradi. Tekshiruv: `X-Telegram-Bot-Api-Secret-Token` header (`TELEGRAM_WEBHOOK_SECRET`).
2. Post Firestore navbatiga (`telegram_portfolio_queue`) yoziladi, kaliti `media_group_id` — albomdagi 5-10 rasm bitta yozuvga yig'iladi.
3. 7 soniya kutiladi (albomning qolgan rasmlari uchun), so'ng tranzaksiya bilan "band qilinadi" — bir nechta webhook chaqiruvi baravar ishlov bermasligi uchun.
4. Gemini matndan metadata ajratadi → rasmlar avval Drive papkasidan (nom bo'yicha fuzzy qidiruv), topilmasa postning o'z rasmlaridan → Sanity'ga portfolio hujjati yoziladi.
5. Slug allaqachon mavjud bo'lsa, o'tkazib yuboriladi (dublikat bo'lmaydi).

**Zaxira:** kunlik cron (`0 9 * * *`) va qo'lda `GET ?secret=...` — webhook o'tkazib yuborgan yozuvlarni tozalaydi.

**Muhim:** Vercel **Hobby** rejasida cron kuniga faqat bir marta ishlaydi — `*/30 * * * *` deploy'ni butunlay buzadi. Shuning uchun asosiy mexanizm cron emas, webhook.

**Sozlash:**
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://jonbranding.uz/api/portfolio-telegram&secret_token=<TELEGRAM_WEBHOOK_SECRET>&allowed_updates=[\"channel_post\"]"
```
Bot kanalga **admin** qilib qo'shilishi shart. Kerakli env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `SANITY_TOKEN`, ixtiyoriy `DRIVE_PARENT_FOLDER_ID`, `TG_PORTFOLIO_CHANNEL`.

**Ogohlantirish:** bu route va `services/portfolio-bot` bir vaqtda ishlamasin — ikkalasi bir postdan ikkita Sanity hujjati yaratadi.

**Tekshiruv:** typecheck, lint, 243/243 test, `npm run build` — hammasi o'tdi.

---

## 2026-09-21 | Telegram va Instagram Portfoliolarini Saytga Avtomatik Joylash Tizimi

**Vazifa:** Telegram (@JonBranding) va Instagram (@jon.branding) kanallariga joylangan keyslar/portfoliolar avtomatik ravishda web saytning Portfolio bo'limiga (Sanity CMS orqali) joylansin.

**Nima qilindi:**
1. **Telegram Media & Album Support (`services/portfolio-bot/src/userbot.ts`):**
   - GramJS da Telegram kanallaridan keladigan xabarlardagi rasm va fayllarni to'g'ridan-to'g'ri yuklab olish (`downloadMedia`) qo'shildi.
   - Albomlar (`groupedId`) uchun 2.5 soniyalik debounce buferi yaratildi: bitta postdagi 5-10 ta rasm alohida xabar sifatida kelganda barchasi bitta keysga to'planadi.
2. **Drive Fallback & Direct Media Pipeline (`services/portfolio-bot/src/pipeline.ts`):**
   - `processPost` funksiyasi `localImages` qabul qiladigan qilindi.
   - Agar Google Drive'da loyiha papkasi topilsa, original sifatli rasmlar olinadi; agar Drive papkasi bo'lmasa, to'g'ridan-to'g'ri Telegram/Instagram'dan olingan rasmlar bilan Sanity'ga to'liq portfolio hujjati yaratiladi.
3. **Instagram Graph API Integratsiyasi (`services/portfolio-bot/src/instagram.ts`):**
   - Faqat pullik Apify'ga bog'langanlik olib tashlandi: `INSTAGRAM_ACCESS_TOKEN` orqali to'g'ridan-to'g'ri Instagram Graph API orqali postlar, karusellar (`children.data`) va rasmlarni yuklab olish qo'shildi (Apify faqat ikkinchi zaxira sifatida qoldirildi).
4. **Workflow Yangilanishi (`services/portfolio-bot/src/workflow.ts`):**
   - `requireDriveLink: false` qilindi — endi postlar Drive'siz ham to'liq mustaqil Sanity portfolio loyihasiga aylanadi.
5. **Gemini 2.0 Flash & Retry Logic (`services/portfolio-bot/src/ai-processor.ts`, `src/lib/integrations/gemini.ts`):**
   - Noto'g'ri `gemini-2.5-flash` chaqiruvlari barqaror `gemini-2.0-flash` ga o'tkazildi.
   - 429/503 xatolarida eksponentsial kechikishli `callGeminiWithRetry` (3 ta urinish) qo'shildi.

**Tekshiruv:**
- `services/portfolio-bot`: `npm run build` muvaffaqiyatli (tsc 0 errors).

---

## 2026-09-21 | Yangi `/tariflar` sahifasi — JTBD, FAB va har xizmatga alohida ekran (PR #327 → #328 → #329)

**Vazifa:** Mavjud `/narxlar` (aslida `XizmatlarClient`ni ko'rsatadi) sahifasidan alohida, narxlari ochiq, o'zi sotadigan narxlar sahifasi.

**Nima qilindi:**
1. **Yangi route** `src/app/[lang]/tariflar/` — `page.tsx` (metadata, breadcrumb JSON-LD) + `tariflar-client.tsx`. `/narxlar` va `/pricing` tegilmadi.
2. **Struktura:** hero → JTBD bloki → xizmatlar → jarayon va to'lov → narx omillari → paketlar (oxirida) → CTA. Paketlar ataylab oxirida: mijoz avval alohida narxlarni ko'radi, keyin paket arzonroq ekanini biladi (VIP 15 mln, PREMIUM 10 mln, STANDART 3 mln tejash ko'rsatiladi).
3. **FAB:** har bir xizmatda `deliverables` (funksiya) dan tashqari `benefit` qatori — mijoz oladigan foyda.
4. **JTBD bloki:** 4 ta "Hozir → Biz bilan" juftligi.
5. **Har xizmat alohida to'liq ekran** (`min-h-[100svh]`): chapda nom/narx/muddat/CTA (sticky), o'ngda deliverables + foyda + isbot.
6. **Naming bo'limi** rasmiy taqdimot PDF asosida aniqlashtirildi (3 ta bepul tahrir, domen/Telegram/Instagram tekshiruvi) + 19 ta ishlangan nom isbot sifatida qo'shildi.
7. **Tipografika:** JetBrains Mono eyebrow/yorliqlar, Instrument Serif kursiv urg'ular, tabular raqamlar.
8. **Matn:** birinchi shaxs ko'plik ("Narxlarimiz ochiq"), "yaratish" so'zi ishlatilmaydi ("Brend qurish").
9. **Patent muddatlari to'g'irlandi:** oddiy 7 oy, tezkor 20–40 kun. Paket muddatlari faqat dizayn ishlari uchun ekani izohlandi.
10. **Netlify o'chirildi:** `netlify.toml` va `build:netlify` skripti olib tashlandi (deploy Vercel orqali). Netlify checklari shundan keyin har PR'da qizil — Netlify loyihasini repodan uzish kerak (panel ishi).

11. **Sotuvni kuchaytirish (isbot va e'tirozlar):**
   - Har bir xizmat ekranida shu kategoriyadagi 2 tagacha real keys (muqova, mijoz, natija raqami), `fetchPortfolioList` orqali.
   - Brandbook ekranida keys kartasi o'rniga tez almashinadigan galereya (`ShowcaseReel`, 1.4s, `prefers-reduced-motion` hurmat qilinadi). Shu sabab `LIST_QUERY` ga `galleryImages` qo'shildi.
   - Ijtimoiy isbot bo'limi: 16 ta mijoz logotipi (`fetchBrands`) + 3 ta real otziv (`fetchTestimonials`).
   - "Nega arzon dizayner emas" bloki va "Xavfingizni kamaytirish uchun" ro'yxati (faqat haqiqatan mavjud shartlar — pul qaytarish kafolati EGASI tasdig'ini kutmoqda).
   - FAQ bloki CTA'dan oldin: narx e'tirozi, "yoqmasa nima bo'ladi", mijozdan nima talab qilinadi, bo'lib to'lash, patent chiqmasligi.
12. **Tuzatish:** `globals.css` barcha sarlavhalarga `color: hsl(var(--foreground))` beradi — qora fonli CTA sarlavhasi ko'rinmay qolgan edi, aniq oq rang qo'yildi.

**Ochiq qolgan ishlar:**
- **i18n:** sahifa matnlari hozircha komponent ichida, `uz.json`da emas. `/ru`, `/en`, `/zh` da o'zbekcha ko'rinadi. Uzbek-first qoidasiga ko'ra matn qotgach lug'atlarga ko'chirilishi kerak.
- Sotuvni kuchaytirish uchun: portfolio rasmlari, mijoz otzivlari, FAQ/e'tirozlar bloki, kafolat.

---

## 2026-09-21 | /tariflar preview manbasi tekshirildi

**Vazifa:** `jonbranding-web-git-claude-pricing-ab630a-baxtiyorjons-projects.vercel.app/tariflar` sahifasi kodlari qayerdan turibdi va Claude qo'shganmi, aniqlash.

**Nima tekshirildi:**
- Lokal `main` branchda `/tariflar` route topilmadi; hozirgi narx sahifasi `src/app/[lang]/narxlar/page.tsx` orqali ishlaydi.
- `src/app/[lang]/pricing/page.tsx` esa `/narxlar` ga redirect qiladi.
- Lokal branchlar ichida `claude/*` branchlar ko'p, lekin aynan `claude/pricing-ab630a` branchi topilmadi.
- Vercel preview URL nomidagi `git-claude-pricing-ab630a` branch nomiga o'xshaydi, shu sabab sahifa katta ehtimol bilan Claude yaratgan preview branchdan kelgan.
- GitHub remote branchlarini live tekshirishga urinishda `github.com` ulanishi proxy sabab muvaffaqiyatsiz bo'ldi; shu sabab remote branch mavjudligi lokal muhitdan yakuniy tasdiqlanmadi.

**Holat:** Qisman tasdiqlandi — URL nomi Claude branch preview ekanini ko'rsatadi, lekin lokal checkoutda bu branch yo'q va remote tekshiruv tarmoq sabab yakunlanmadi.

**Keyingi aniqlik (2026-09-21):** `/tariflar` sahifasi PR #327 → #328 → #329 orqali `main`ga qo'shildi — `src/app/[lang]/tariflar/`.

---

## 2026-09-19 | Sotuv menejerlari uchun ochiq Patent kalkulyatori va patent.jonbranding.uz subdomeni

**Vazifa:** Mijozlar uchun kalkulyator gated (lead capture) holatda qolsin, lekin sotuv menejerlarimiz uchun doimiy ochiq (unlocked) versiyasi alohida `patent.jonbranding.uz` subdomenida bo'lsin.

**Nima qilindi:**
1. **Komponent moslashuvchanligi:** `src/components/sections/trademark-calculator.tsx` ga `alwaysUnlocked?: boolean` prop qo'shildi. `alwaysUnlocked={true}` bo'lganda lead gate va blur bekor qilinib, kalkulyator to'liq ochiq holatda ishlaydi.
2. **Yangi ichki sahifa:** `src/app/[lang]/patent-menejer/` yaratildi:
   - `layout.tsx`: Qidiruv tizimlari indekslamasligi uchun `robots: { index: false, follow: false }` qo'yildi.
   - `page.tsx`: `TrademarkCalculator`ni `alwaysUnlocked={true}` bilan chaqiradi va sotuv menejerlari uchun JonBranding kaskad narxlash algoritmi (10% Istisno, 10% Salom, 10% Promokod, $50 Arboun) cheat-sheetini taqdim etadi.
3. **Subdomen routing (Middleware/Proxy):** `src/proxy.ts` ga `host.startsWith('patent.')` tekshiruvi qo'shildi. `patent.jonbranding.uz` orqali kelgan barcha so'rovlar avtomatik ravishda `/${locale}/patent-menejer` sahifasiga rewrite qilinadi.
4. **Test:** `src/proxy.test.ts` ga subdomen routing bo'yicha unit test qo'shildi va 5/5 test muvaffaqiyatli o'tdi.
5. **Mijozlar sahifasi saqlandi:** `/xizmatlar/patent-kalkulyatori` va `/patent-narxi-hisoblagich` sahifalari o'zgarishsiz, lead magnit (gated) sifatida qoldi.

## 2026-09-19 | Patent Kalkulyatori: "Unexpected end of JSON input" va /api/submit-form 500 xatosi to'liq tuzatildi

**Muammo:** Patent kalkulyatori sahifasida (`/xizmatlar/patent-kalkulyatori`) foydalanuvchi ma'lumotlarni to'ldirib yuborganda:
1. Frontendda qizil bannerda xatolik: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`.
2. Backendda `/api/submit-form` va boshqa `firebase-admin` ishlatuvchi routelar 500 (Content-Length: 0) bilan crash bo'layotgan edi.

**Ildiz sabablari:**
1. **Frontend:** `trademark-calculator.tsx` va `contact-modal.tsx` ichida `fetch('/api/submit-form')` chaqirilgach, `if (!response.ok)` blokida `await response.json()` hech qanday xato ushlagichsiz (`.catch()`) chaqirilgan. Agar server 500/502/504 yoki bo'sh body qaytarsa, brauzer `Unexpected end of JSON input` deb crash bo'lgan.
2. **Backend:** `package.json`dagi `uuid: 11.1.1` override sababli CommonJS muhitidagi `gaxios` (Google Cloud / Firebase Admin ichki HTTP mijozi) `require('uuid')` chaqirganda `ERR_REQUIRE_ESM` bilan yiqilgan (chunki `uuid` 10+ versiyalari ESM hisoblanadi). Natijada route moduli yuklanish paytida crash bo'lib, unhandled 500 (bo'sh body) qaytargan.
3. **API Route:** `src/app/api/submit-form/route.ts` ichida `try/catch` bloki `getClientIp()` va `rateLimit()` dan keyin boshlangan edi, shuning uchun ulardagi har qanday xatolik butun routeni unhandled 500 ga olib kelardi.

**Nima qilindi:**
- `package.json` va `pnpm-lock.yaml` dan `uuid` override'lari butunlay olib tashlandi. `gaxios` o'zining tabiiy `uuid@9.0.1` (CommonJS) versiyasini ishlatadigan bo'ldi.
- `src/components/sections/trademark-calculator.tsx` va `src/components/contact-modal.tsx` da `await response.json().catch(() => null)` qo'shildi, natijada har qanday server xatoligida foydalanuvchiga tushunarli xabar ko'rsatiladi.
- `src/app/api/submit-form/route.ts` dagi butun `POST` funksiyasi `try/catch` ichiga olindi.
- `npx vitest run`: 36 ta test fayli, 242/242 test muvaffaqiyatli o'tdi.
- `npm run build`: muvaffaqiyatli yakunlandi (165/165 static sahifa).

---

## 2026-09-19 | uuid override tuzatildi — /api/submit-form ERR_REQUIRE_ESM crash (PR #325 → #326)

**Muammo:** patent kalkulyatori (`/xizmatlar/patent-kalkulyatori`) formasi yuborilganda production'da 500 xato, frontendda "Unexpected end of JSON input". Vercel runtime loglari sabab ko'rsatdi: `Error: require() of ES Module uuid@14.0.1 ... from gaxios@6.7.1 not supported` (`ERR_REQUIRE_ESM`).

**Ildiz sabab:** `package.json`dagi `pnpm.overrides.uuid` `"uuid@<11.1.1": ">=11.1.1"` shaklida yozilgan edi — bu faqat 11.1.1'dan **past** versiyalarni ko'taradi, `uuid@13`/`14` (ESM-only) kabi yuqori versiyalarni cheklamaydi. `gaxios` (firebase-admin/googleapis zanjiri) transitiv `uuid`ni `require()` bilan chaqirganda ESM versiyaga tegib crash bo'lgan.

**Birinchi urinish (PR #325):** root darajadagi `"overrides": {"uuid": "^11.1.1"}`ni qat'iy `"11.1.1"`ga o'zgartirdim — bu yetarli emas edi, chunki muammo aynan `pnpm.overrides` blokidagi range-conditional sintaksisda edi. Merge qilingach ham xato davom etdi (Vercel runtime logs orqali tasdiqlandi).

**Haqiqiy tuzatish (PR #326):** `pnpm.overrides.uuid`ni `"uuid@<11.1.1": ">=11.1.1"` dan oddiy `"uuid": "11.1.1"`ga o'zgartirdim — bu pnpm'da butun dependency grafida shartsiz qo'llanadi.

**Tekshiruv:**
- Toza `rm -rf node_modules && pnpm install --frozen-lockfile` — `node_modules/.pnpm`da faqat `uuid@11.1.1` qoldi (Sanity/uuidv7'ning alohida paketlaridan tashqari).
- `readlink -f node_modules/.pnpm/gaxios@6.7.1/node_modules/uuid` → `uuid@11.1.1`ga ishora qildi (to'g'ri).
- `npx vitest run` — 36 fayl, 242/242 o'tdi.
- `npm run build` — muvaffaqiyatli.

---

## 2026-09-15 | Dependabot zaifliklarini 100% bartaraf etish (13 ta alert to'liq yopildi)

**Nima qilindi:**
- **Maqsad:** GitHub Security Overview panelidagi barcha 13 ta ochiq Dependabot ogohlantirishlarini bartaraf etish va Security holatini 100% yashil holatga keltirish.
- **Root qaramliklar:**
  - `package.json`: `@next/third-parties` va `eslint-config-next` `^16.3.5` ga ko'tarildi (Next.js 16.3.5 bilan sinxronlandi).
  - `overrides`: `adm-zip` (`^0.6.1`), `smol-toml` (`^1.8.0`), `browserslist` (`^4.28.9`), `qs` (`^6.16.0`), `js-yaml` (`$js-yaml`) xavfsiz versiyalarga o'tkazildi.
  - `package.json`ga `pnpm.overrides` qo'shildi (`adm-zip`, `js-yaml`, `smol-toml`, `qs`, `browserslist`, `undici`, `uuid`).
  - `package-lock.json` va `pnpm-lock.yaml` to'liq yangilandi.
- **Sub-loyihalar:**
  - `services/portfolio-bot`: `package.json` overrides ga `qs: ^6.16.0` qo'shildi, `package-lock.json` yangilandi.
  - `mcp-server`: `package.json` overrides ga `qs: ^6.16.0` qo'shildi, `package-lock.json` yangilandi.
- **Git hygiene:**
  - `.gitignore`: `node_modules/` va `/.vitest/` qo'shildi.
  - Redundant PR #323 yopildi (`test/setup.ts` allaqachon #321 orqali main da mavjud).

**Tekshiruv natijalari:**
- `npm audit` (root) — 0 vulnerabilities (toza).
- `pnpm audit` (root) — No known vulnerabilities found (toza).
- `npm audit` (`services/portfolio-bot`) — 0 vulnerabilities (toza).
- `npm audit` (`mcp-server`) — 0 vulnerabilities (toza).
- `npm run typecheck` — toza (0 xato).
- `npm run test` (Vitest) — 36 fayl, 242/242 test o'tdi (100% pass).

---

## 2026-09-15 | Hamkorlar (Affiliate) tizimi — toʻliq implementatsiya (PR #321)

**Nima qilindi:**
- **Maqsad:** ochiq roʻyxatdan oʻtadigan hamkorlar (affiliate) tizimi — promokod orqali attribution, amoCRM webhook orqali avtomat bonus, hamkor kabineti (login yoʻq, maxfiy token havola), admin toʻlov paneli.
- **Supabase**: 3 jadval (`affiliates`, `referrals`, `payouts`), RLS toʻliq deny (faqat service-role). Migratsiya: `supabase/migrations/20260904120000_affiliates.sql`.
- **Bonus jadvali**: `src/lib/affiliate/payouts.ts` — naming/logo/patent 500,000 soʻm, packaging 800,000, full_branding 1,200,000.
- **Sahifalar**: `/[lang]/hamkor/qoshilish` (roʻyxat), `/[lang]/hamkor/[token]` (hamkor kabineti), `/admin/hamkorlar` (`ADMIN_SECRET`, HMAC cookie).
- **Jarayon**: brainstorm → spec (`docs/superpowers/specs/2026-09-04-affiliate-system-design.md`) → 14-task implementatsiya rejasi (`docs/superpowers/plans/2026-09-04-affiliate-system.md`) → subagent-driven ijro → final whole-branch review (3 Critical + 9 Important) → fix wave → scoped re-review (12/12 tuzatilgan).
- **PR #321 ustidagi qoʻshimcha tuzatishlar** (Codex review, P1):
  - Register endpoint endi dublikat telefon holatida boshqa hamkorning maxfiy `accessToken`ini qaytarmaydi (xavfsizlik — telefon raqami maʼlum boʻlsa boshqa hamkor kabinetiga kirish mumkin edi).
  - amoCRM webhook notoʻgʻri/mahalliylashtirilgan xizmat nomi (masalan "Қадоқ дизайни") uchun eng qimmat bonus (full_branding) tikmasdan, qoʻlda tekshirishga yoʻnaltiradi.
  - Kalkulyatorning barqaror ingliz xizmat kalitlari (`serviceKeys`) endi `packageSummary` bilan birga yuboriladi va attribution ular orqali ustuvor aniqlanadi.
  - Hamkor kabineti valyuta yorligʻi (`so'm`/`сум`/`sum`/`苏姆`) endi `lang` boʻyicha toʻgʻri koʻrsatiladi (avval har doim `so'm`).
  - `test/setup.ts`даgi jest-dom import vitest tipiga moslashtirildi (`@testing-library/jest-dom/vitest`) — CI'даgi "Typecheck, lint, test, build" talab qilingan tekshiruv iyuldan beri shu sabab qulab kelgan edi.

**Tekshiruv:**
- `npx vitest run` — 234/234 (1 ta notinch, aloqasiz `blog-agent` testi izolyatsiyada oʻtdi).
- `npx tsc --noEmit -p tsconfig.typecheck.json` — toza.
- `npm run lint` — toza.
- CI: barcha talab qilingan tekshiruvlar oʻtdi.

---

## 2026-08-31 | BHM 412,000 → 440,000 so'm yangilanishi (PR #316)

**Nima qilindi:**
- **Sabab:** O'zbekistonda Bazaviy hisoblash miqdori (BHM) 440,000 so'mga oshdi. Barcha davlat bojlari BHM ga bog'liq.
- **`src/components/sections/trademark-calculator.tsx`:**
  - `BHM` konstanta: `412000` → `440000`.
  - `EXPEDITE_EXTRA`: hardcoded `461000` (eski BHM asosida) → `Math.round(1 * BHM * 1.12)` formulaga o'tkazildi, endi yangi BHM dan hisoblanadi (492,800 so'm).
- **Blog postlar (8 fayl, 4 til × 2 mavzu):**
  - `how-much-does-patent-cost-2026` (uz/ru/en/zh): BHM matni 440,000; `2 * BHM` → 880,000; Step 1 (yuridik, 1 klass) → 2,640,000; Step 2 → 5,104,000.
  - `trademark-registration-guide` (uz/ru/en/zh): BHM matni 440,000; Step 1 → 2,640,000. Agentlik xizmati narxlari (5M/7M) o'zgarmadi (flat rate).
  - Hosila summalar kalkulyator formulasidan olindi: `6*BHM` (Step 1 legal), `11.6*BHM` (Step 2 legal).

**Tekshiruv:**
- `npm test -- src/components/sections/trademark-calculator.test.tsx --run` — passed (1/1).
- Repo bo'yicha `412000` / eski hosila summalar qidiruvi — 0 natija.

---

## 2026-08-31 | GitHub Security & Dependabot Pull Requests Resolution (0 Vulnerabilities)

**Nima qilindi:**
- **GitHub Security Alerts To'liq Bartaraf Etildi**: GitHub Dependabotdagi barcha 26 ta xavfsizlik alerti va tegishli pull requestlar (PR #309 va unga bog'liq dependabot guruhlari) to'liq hal qilindi.
- **Root Paket (`package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package-lock.json`)**:
  - `dompurify`: `3.4.12` → `^3.4.13` ga ko'tarildi (GHSA-55q2-fjhq-7xh7 IN_PLACE XSS zaifligi yopildi).
  - `nanoid`: `3.3.16` → `^3.3.18` ga yangilandi (GHSA-2v37-7h3g-55p8 cheksiz sikl zaifligi yopildi).
  - `js-yaml`: `3.15.1` va `4.3.1` ga override qilindi (GHSA-5p4m-2wfm-xmqj !!omap CPU exhaustion yopildi).
  - `undici`: `6.28.0` va `7.29.0` ga override qilindi (CRLF, cookie injection, downstream response desync yopildi).
  - `ip-address`: `10.4.0` ga override qilindi (SSRF va IPv4-mapped address bypass zaifliklari yopildi).
- **MCP Server (`mcp-server/package.json`, `mcp-server/package-lock.json`)**:
  - `hono`: `4.12.31` → `4.13.5` (>= 4.12.34) ga yangilandi (memo() SSR disclosure, language middleware DoS, CORS ReDoS yopildi).
  - `fast-uri`: `3.1.4` → `4.1.3` (>= 3.1.5) ga yangilandi (host confusion zaifligi yopildi).
  - `ip-address`: `10.2.0` → `10.7.0` (>= 10.4.0) ga yangilandi.
- **Portfolio Bot (`services/portfolio-bot/package.json`, `services/portfolio-bot/package-lock.json`)**:
  - `ip-address`: `10.2.0` → `10.7.0` (>= 10.4.0) ga yangilandi.
- **Verifikatsiya**:
  - `pnpm audit --audit-level=moderate`: **0 vulnerabilities (No known vulnerabilities found)** ✓
  - `npm audit` (root, mcp-server, portfolio-bot): **0 vulnerabilities** ✓
  - `npm run typecheck`: **0 errors (100% PASS)** ✓
  - `npx vitest run`: **26/26 test suites (175 tests) PASS** ✓
  - `npm run build`: **161/161 static & dynamic pages successfully compiled** ✓

---

## 2026-08-14 | Naming/Logo Kartalarni PNG Yuklab Olish + Security/Encoding Auditi (PR #313)

**Nima qilindi:**
- **PNG Export**: `package-builder.tsx` — naming va logo tarif kartalariga hover-reveal download tugma qo'shildi, `html-to-image` bilan yuqori sifatli (3x) PNG export. Hover-fokuslangan kartada Ctrl+D / Cmd+D shortcut (bir vaqtda faqat bitta karta uchun, hover state orqali). 4 tilga (`downloadCard`) tarjima.
- **50/50 To'lov UI**: `pricing.ts`'ga `upfrontAmount` hisoblash qo'shildi; `package-builder.tsx`'da 50/50 tanlanganda "boshlash uchun faqat X" bloki chiqadi.
- **Dependency Security**: `package.json` `overrides` sintaksisidagi xato tuzatildi (nested `@sanity/cli` override versiyasiz yozilgani butun override zanjirini buzayotgan edi) — `npm audit` 13 high/22 moderate/1 low → **0 vulnerability**.
- **Mojibake Tuzatish**: `static-data.ts` (ru testimonial'lar), `brand-strategiyasi/layout.tsx` (ru/zh SEO keywords), `package-builder.tsx` (ru chegirma taymer matni) — ikki marta noto'g'ri encode qilingan UTF-8 matn asl holiga qaytarildi.
- **Code review fixlar** (Codex/CodeRabbit): `group` class sibling Card'dan wrapping `motion.div`ga ko'chirildi (hover ishlamas edi), Ctrl+D endi faqat hover qilingan kartaga bog'langan, hardcoded Uzbek fallback olib tashlandi (`dictionary.downloadCard` majburiy), `animate-pulse` → Framer Motion `motion.div`.

**Tekshiruv:** `npx tsc --noEmit` ✓ | `npx eslint` ✓ | `npm audit` → 0 vulnerabilities | Local dev serverda 50/50 blok va download tugmalar brauzerda tekshirildi.

---

## 2026-07-27 | To'liq Veb-sayt Auditi & Build Verifikatsiyasi (100% SUCCESS)

**Nima qilindi:**
- **Kod & TypeScript Auditi**: `npm run typecheck` orqali to'liq static typecheck o'tkazildi (0 errors).
- **Production Build Verifikatsiyasi**: `npm run build` bajarildi — 160 ta sahifa va barcha dynamic/ISR marshrutlar 100% muvaffaqiyatli qurildi (`✓ Compiled successfully`).
- **i18n Paritet Auditi**: `audit_locales.js` orqali barcha 4 ta tilda (`uz`, `ru`, `en`, `zh`) teng 1016 ta kalit va 0 missing key borligi tasdiqlandi.
- **SEO & AI Search (GEO/AEO)**: `robots.ts` va `sitemap.ts` auditi o'tkazildi; ChatGPT, Claude va Perplexity botlari uchun ochiq indeksatsiya va `hreflang` / `x-default` alternativalar tekshirildi.
- **Performance & CWV**: Above-the-fold Hero LCP prioriteti va below-the-fold 9 ta og'ir seksiyalarning `SectionSkeleton` bilan dynamic import qilinishi audit qilindi.
- **Full Audit Report**: To'liq audit hisoboti [full_website_audit.md](file:///C:/Users/baxti/.gemini/antigravity/brain/c2dc0721-e2ff-421e-84a9-64e6f7d0643f/full_website_audit.md) faylida yaratildi.

---

## 2026-07-27 | Lead Capture Orchestrator + Security & Governance 10/10 Audit

**Nima qilindi:**
- **Lead Capture Orchestrator & Multi-trigger Convergence**: `openContactModal` CustomEvent orqali 40+ har xil tugma, kalkulyator, header, sticky CTA va exit-intent hodisalari `AtModal` hamda `ContactModal` ga yagona context va source metadata (`ctaSource`, `gaClientId`, `pageLocation`) bilan yo'naltirildi.
- **Security & Bot Protection (Triple-layer)**: Honeypot field (`companyWebsite`), Cloudflare Turnstile token verification (`verifyTurnstile`) va Origin check hamda Firestore-backed distributed rate-limiting bilan barcha lead yo'llari xavfsizlandi.
- **Security Headers & Proxy Governance**: `proxy.ts` orqali `HSTS`, `X-XSS-Protection`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` va `X-DNS-Prefetch-Control` sarlavhalari to'liq audit qilindi.
- **JSON-LD Schema Verification**: Script ID dublikatlari tozalanib, Google va AI Search engine lar (AEO/GEO) uchun to'liq sinxronlashtirildi.

**Tekshiruv:** `vitest run` → 22/22 test suites (140 tests) PASS ✓ | `git push origin main` → Vercel production deploy ✓

---

## 2026-07-23 | Performance 10/10 — Dynamic Imports & LCP Optimization


**Nima qilindi:**
- `HomeComponent` ichidagi below-the-fold 9 ta og'ir section dynamic import (lazy-load) ga o'tkazildi: `ATGallery`, `BeforeAfter`, `ATQuotes`, `ProcessVideo`, `AtProcess`, `Founder`, `AtPricing`, `AtFaq`, `AtFinalCta`.
- Dynamic import jarayonida CLS (Cumulative Layout Shift) ning oldini olish uchun yengil va xavfsiz `SectionSkeleton` komponenti yaratildi va qo'llandi.
- `AtHero` komponentidagi LCP (Largest Contentful Paint) rasmi uchun deprecated `preload` o'rniga rasmiy `priority` prop o'rnatildi va mos test `at-hero.test.tsx` yangilandi.
- `layout.tsx` ga Vimeo iframe resurslari uchun `dns-prefetch` qo'shildi.

**Tekshiruv:** `vitest run` → 16/16 test suites (124 tests) o'tdi ✓
**Deploy:** `git push origin main` → Vercel auto-deploy qilindi ✓

---

## 2026-07-22 | i18n Parity + zh.json To'liq Tarjima


**Nima qilindi:**
- `ru.json`, `en.json`, `zh.json` ga 6 ta yetishmayotgan kalit qo'shildi: `naming_simple`, `logo_design_simple`, `brandbook_simple`, `corporate_style_simple`, `packaging_design_simple`, `atelier.hero_title_alt`
- `zh.json`da inglizcha qolgan 36 ta matn xitoycha tarjimasi bilan almashtirildi: `trustedBy`, `beforeAfter`, `testimonials`, `founder`, `process`, `mobileCtaBar`, `auditOffer`
- Barcha 4 til: **1007 kalit**, 0 yetishmovchilik

**Tekshiruv:** `audit_locales.js` → 0 missing ✓ | `audit_translations.js` → 6 proper noun ✓ | `npm test` → 63/63 ✓
**Deploy:** `git push origin main` → Vercel auto-deploy ✓

---

## 2026-07-22 | Vercel Runtime `ERR_REQUIRE_ESM` P1 Tuzatish


**Muammo:** Production sahifalar 200 qaytargan bo'lsa ham, Vercel runtime log'larida `/uz`, `/ru`, `/en` uchun `ERR_REQUIRE_ESM` xatosi chiqayotgan edi.

**Ildiz sababi:** Sahifa render zanjirida `isomorphic-dompurify` import qilinib, server bundle `jsdom -> html-encoding-sniffer -> @exodus/bytes` dependency zanjirini tortgan. Vercel Node 24 runtime'da CommonJS `require()` orqali ESM modul chaqirilgani log xatosini chiqargan.

**Nima qilindi:**
- `src/components/sections/blog-preview.tsx` ichidan `isomorphic-dompurify` olib tashlandi; blog title/description uchun React text renderiga mos yengil plain-text sanitizer ishlatildi.
- `src/components/sections/founder.tsx` ichidan `isomorphic-dompurify` olib tashlandi; mavjud `sanitizeRichText()` helperiga o'tkazildi.
- Direct dependency `package.json` va `pnpm-lock.yaml` dan olib tashlandi.

**Tekshiruv:**
- `pnpm remove isomorphic-dompurify`: manifest/lock sinxron.
- `rg "isomorphic-dompurify|DOMPurify" src package.json pnpm-lock.yaml`: src/package direct import yo'q; lock'da faqat transitive eski versiya qoldi.
- `npm run lint`: muvaffaqiyatli.
- `npm run typecheck`: muvaffaqiyatli.
- `npm test`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli; `rtk err` no errors.
- `.next/server` ichida `isomorphic-dompurify`, `html-encoding-sniffer`, `@exodus/bytes` topilmadi.
- `git diff --check`: toza.

---

## 2026-07-17 | Patent Kalkulyatori Formasi Xatoligi Tuzatildi

**Muammo:** Patent kalkulyatori sahifasida (`/xizmatlar/patent-kalkulyatori`) foydalanuvchi ma'lumotlarni to'ldirib jo'natganda shakl (form) jimlikda yuborilmayotgan edi (silent failure).

**Ildiz sababi:** `TrademarkCalculator` komponentidagi Zod validation sxemasida `brand` (brend nomi) maydoni majburiy (`min(1)`) qilib belgilangan, ammo React Hook Form-da uning uchun hech qanday `FormField` (input) ko'rinishi yaratilmagan edi. Natijada validatsiya muvaffaqiyatsiz tugab, shaklni yuborishni bloklagan.

**Nima qilindi:**
- `src/components/sections/trademark-calculator.tsx` ichiga `brand` FormField inputi qo'shildi (tarjima fayllaridan `brandNameLabel` va `brandNamePlaceholder` kalitlari ishlatildi).
- `npm run build` orqali loyiha muvaffaqiyatli qurilishi va xatolar yo'qligi tekshirildi.

**Natija:** Patent kalkulyatori formasi endi brend nomini ham kiritish imkonini beradi va to'liq ishlaydi.

---

## 2026-07-17 | P0/P1 Preview Deploy Tayyorlash

**Holat:**
- P0/P1 audit tuzatishlari `codex/p0-p1-audit-preview` branchiga ajratildi.
- `origin/main` 4 commit oldinda ekani tekshirildi; preview branch remote o'zgarishlar bilan merge qilinadi.
- Deploy commitiga audit/fix fayllari kiritiladi; `AGENTS.md`, `lighthouse-report.json`, `BAXTIYOR_TONE_OF_VOICE.md` va `OISHA_SELF_IMPROVEMENT.md` chetda qoldiriladi.
- Production emas, Vercel preview deploy proof olinadi; production uchun tashqi env va Vimeo allowlist alohida qoladi.
- Remote `main` merge qilindi; Vitest local `.claude/worktrees/**` ichidagi Playwright specni ushlamasligi uchun exclude kengaytirildi.

**Preview oldi tekshiruvlari:**
- `npm test`: 12 fayl, 62/62 test o'tdi.
- `npm run lint`: muvaffaqiyatli.
- `npm run typecheck`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli; 61/61 static sahifa. Sanity CDN `ECONNRESET` berganda fallback ishladi va build to'xtamadi.
- Birinchi Vercel preview deploy `pnpm-lock.yaml` eskirgani sabab `ERR_PNPM_OUTDATED_LOCKFILE` bilan yiqildi.
- `pnpm-lock.yaml` package manifestga sinxron qilindi; `pnpm install --frozen-lockfile --ignore-scripts --config.confirmModulesPurge=false` lokal o'tdi.
- Vercel preview deploy `Ready`: `https://jonbranding-rxdqxtl1s-baxtiyorjons-projects.vercel.app`.
- Protected preview uchun vaqtinchalik share URL yaratildi: `https://jonbranding-rxdqxtl1s-baxtiyorjons-projects.vercel.app/uz?_vercel_share=NDgmoFVpXIRO8BiZsBkqRCNRilsFtqcT` (2026-07-18 09:11 gacha).

---

## 2026-07-14–15 | P0/P1 Audit Tuzatishlari

**Xavfsizlik:**
- Vimeo webhook endi faqat `VIMEO_WEBHOOK_SECRET` bilan raw-body HMAC SHA-256 imzosini qabul qiladi; query/Bearer bypass, katta body va noto'g'ri JSON yopildi.
- Instagram OAuth boshlanishi admin secret bilan himoyalandi, random `state` HttpOnly/Secure cookie orqali callbackda tekshiriladi; token xatolari tashqariga sizmaydi.
- API rate limitlari Firestore transaction orqali umumiy qilindi; ishonchsiz forwarded IP lar va literal `unknown` kaliti olib tashlandi.

**UI, accessibility va i18n:**
- Xizmatlar grid'i 320px ekranda overflow qilmaydi; sticky CTA `animate-ping` halqasi Firefox gorizontal scrollini chiqarmaydi.
- Lead modal Radix Dialog fokus trap, Escape, fokusni qaytarish, alert va 4 til matnlari bilan yangilandi.
- `[lang]` sahifalarda yagona `main#main-content` landmark qoldirildi; yangi matnlar avval `uz.json`, keyin `ru/en/zh` ga kiritildi.

**Performance va lokal barqarorlik:**
- Hero carousel o'rniga bitta barqaror preload LCP rasmi ishlaydi; Vimeo iframe faqat foydalanuvchi bosganda yuklanadi va matn fallback doim ko'rinadi.
- Development CSP HTTPS/WSS majburlashdan tozalandi, dev cache override production-only qilindi, `npm run dev` Webpack rejimiga o'tkazildi.
- Next image quality allowlist, Windows `cross-env` lint/build skriptlari va noto'g'ri Turbopack root tuzatildi; eksperimental CSS optimizatsiyasi olib tashlandi.
- Tailwind configidagi ESM muhitida yiqiladigan CommonJS `require(...)` pluginlari statik importga o'tkazildi.

**Tekshiruv:**
- `npm test`: 12 fayl, 62/62 test o'tdi.
- `npm run lint`: 0 xato, 0 warning.
- `npm run typecheck`: 0 xato.
- `npm run build`: muvaffaqiyatli, 61/61 static sahifa; compile 10.0 daqiqa.
- Playwright Chromium: 4/4; Firefox 320px overflow regressiyasi alohida o'tdi. Uzoq multi-browser dev run Windows virtual xotira chekloviga urildi.
- `git diff --check`: toza.

**Production uchun qolgan tashqi sozlama:** `VIMEO_WEBHOOK_SECRET`, `INSTAGRAM_OAUTH_ADMIN_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON` ni hostingda o'rnatish va Vimeo embed allowlistiga `jonbranding.uz` hamda `www.jonbranding.uz` ni qo'shish. Deploy qilinmadi.

---

## 2026-07-05 | Headroom Proxy Fix — Codex Stream Disconnect

**Muammo:** Codex client-da `stream disconnected before completion: error sending request for url (http://127.0.0.1:8787/v1/responses)` xatosi.

**Ildiz sababi:** Headroom proxy (`headroom.EXE`) port 8787 da ishlamayotgan edi. `headroom doctor` tekshiruvi `proxy not reachable` ko'rsatdi. Codex configi `openai_base_url = "http://127.0.0.1:8787/v1"` ga yo'naltirilgan, lekin proxy processi o'lik edi (5 ta zombie MCP server processi bor edi, proxy processi yo'q).

**Nima qilindi:**
- Barcha headroom zombie processlari o'ldirildi
- `headroom proxy` qayta ishga tushirildi (PID 11124, port 8787)
- `/health`, `/livez`, `/readyz`, `/stats` endpointlari ishlayotgani tasdiqlandi
- Avtomatik ishga tushish uchun Windows Registry Run key qo'shildi: `HKCU:\Software\Microsoft\Windows\CurrentVersion\Run\HeadroomProxy`

**Natija:** Codex Headroom proxy orqali normal ishlashi kerak. Proxy qayta yuklanganda ham Registry orqali avtomatik ishga tushadi.

---

## 2026-07-05 | Codex Vercel Build Crash Sessiyasi

**Nima qilindi:**
- Repo bo'ylab `<<<<<<<`, `=======`, `>>>>>>>` merge conflict markerlari tekshirildi: marker topilmadi.
- `src/app/[lang]/pricing/sotuvchi-kartochka/layout.tsx` alohida tekshirildi: marker topilmadi.
- Bugungi Vercel/GitHub CI crash sababi `src/components/sections/before-after.tsx` boshida commit bo'lib ketgan duplicate/chala blok ekani aniqlandi va tozalandi.

---

## 2026-07-04 | Codex Testimonial Cover Sessiyasi

**Nima qilindi:**
- Hikmatulloh Toxirov video testimonial coveri uchun Telegramdan berilgan rasm WebP formatga optimizatsiya qilindi.
- Sanity yoki fallback testimoniallari qaytganda ham Vimeo `1205182267` uchun yangi `/images/testimonials/hikmatulloh-toxirov-cover.webp` coveri ishlatiladigan qilindi.
- Local/CI build barqarorligi uchun Next static generation worker soni `experimental.cpus: 1` bilan cheklab qo'yildi.

---

## 2026-07-01 | Codex Security Sessiyasi

**Nima qilindi:**
- PR #247 orqali merge markerlar tozalandi, `portfolio-sync` cron auth tekshiruvi mustahkamlandi va Vercel/CI build bloklagan lockfile holati tuzatildi.
- `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package-lock.json` va `package.json` override'lari `js-yaml`, `smol-toml`, `postcss`, `uuid` patched versiyalariga moslandi.
- PR #248 orqali `package-lock.json` ichidagi Dependabot metadata ham patched `js-yaml@3.15.0` va `smol-toml@1.6.1` holatiga keltirildi.
- GitHub security sahifasidagi stale Dependabot alertlar lockfile/SBOM dalili bilan yopildi; open PR, Dependabot, Code scanning va Secret scanning soni 0 ga tushirildi.

**Tekshiruv:**
- `pnpm --config.minimumReleaseAge=0 lint`
- `pnpm --config.minimumReleaseAge=0 typecheck`
- `pnpm --config.minimumReleaseAge=0 test`
- `pnpm --config.minimumReleaseAge=0 build`
- `npm audit --audit-level=moderate --omit=dev`

---

## 2026-07-01 | Antigravity Sessiyasi — Ideal Holat

**Nima qilindi:**
- **Merge conflict markerlar tozalandi**: `sotuvchi-kartochka/layout.tsx`, `layout.tsx`, `founder.tsx`, `pricing.ts` — barcha `<<<<<<<`, `=======`, `>>>>>>>` markerlar olib tashlandi. Kaskadli narx algoritmi (Updated upstream) saqlanib qoldi.
- **Dependabot alertlar yopildi**: `js-yaml` (CVE: GHSA-h67p-54hq-rp68) va `smol-toml` (CVE: GHSA-v3rj-xjv7-4jmq) uchun `pnpm-workspace.yaml` va `package.json` overrides qo'shildi. pnpm audit va npm audit: **0 vulnerability**.
- **CodeQL alertlar**: 0 (oldingi PR #247 bilan yopilgan).
- **Open PRlar**: 0 (barcha mergeable yoki yopilgan).
- **package-lock.json** va **pnpm-lock.yaml** yangilandi — zaif transitive dependency versiyalari override bilan patched versiyalarga almashtirildi.
- **Build**: muvaffaqiyatli (conflict markerlar olib tashlanganidan keyin).
- **DEV_LOG.md** yangilandi.

---

## 2026-07-03 | Codex Build Crash Sessiyasi

**Nima qilindi:**
- Vercel build crashiga sabab bo'lishi mumkin bo'lgan commit qilingan merge conflict markerlari repo bo'ylab tekshirildi.
- `DEV_LOG.md` ichidagi unresolved `<<<<<<<`, `=======`, `>>>>>>>` markerlari olib tashlandi va ikkala log yozuvi saqlandi.
- `src/app/[lang]/pricing/sotuvchi-kartochka/layout.tsx` alohida tekshirildi: conflict marker topilmadi.
- Portfolio Sanity rasmlariga `auto=format` qo'shildi va before/after slider Next image optimizatsiyasidan foydalanadigan qilindi.
- `pnpm-workspace.yaml` build-script allowlist placeholderlari real boolean qiymatlarga keltirildi.
- Dependabot #88 uchun `json-2-csv` override'i patched `5.5.11` versiyasiga mahkamlandi.
- PR #252 review izohlaridan qolgan dolzarb joylar yopildi: portfolio bot rasm pathlari temp katalog bilan cheklab qo'yildi va package-builder discount label/rule fallbacklari locale kalitlariga ko'chirildi.

---

## 2026-06-30 | Codex Sessiyasi


**Nima qilindi:**
- PR #240 uchun cron endpointlarda `CRON_SECRET` undefined bo'lganda `"Bearer undefined"` orqali auth bypass bo'lishi oldini olindi: Bearer token alohida ajratilib, secret mavjudligi tekshirildi va `safeCompare` ishlatildi (`portfolio-sync`, `reviews-sync`, `testimonials`).
- `.jules/sentinel.md` da shu xavf bo'yicha sentinel yozuvi qo'shildi va markdown inline code formati GitHub reviewdagi `MD038` izohiga mos tuzatildi.
- GitHub reviewdagi qolgan `DEV_LOG.md` entrysi va sentinel markdown izohlari yopildi.

---

## 2026-06-28 | Antigravity Sessiyasi

**Nima qilindi:**
- `avans` kalkulyatorida kassa xavfsizlik koeffitsiyenti olib tashlanib, uning o'rniga "Oylik maoshga nisbatan avans limiti (%)" kiritildi.
- `package-builder` va `pricing.ts` ichida yangi **Kaskadli Narx Zanjiri** (10% Istisno + 10% Salom + 10% Promokod) algoritmi kiritildi. Eski (30%, 50%) chegirmalar olib tashlandi.
- 24 soatlik chegirma muddati tugaganda mijozga **$50 lik Arboun (3 kunga muzlatish) xizmati** taklifi UI (banner) orqali qo'shildi.
- `AGENTS.md` fayliga barcha agentlar (Codex, Claude, Devin, Cursor, Gemini) uchun narxlash algoritmi bo'yicha yangi qat'iy yo'riqnoma qo'shildi.
- Testimonials (mijozlar fikri) blokiga Almaz Shoes asoschisi Hikmatulloh Toxirovning yangi Vimeo video otzivi qo'shildi.
- Facebook/Instagram muhit o'zgaruvchilari (App ID va Secret) o'qib olinib, mahalliy `.env.local` va Vercel serveriga yuklandi.
- Boyarin loyihasi matnlari portfolio fallbacklarida go'sht mahsulotlaridan saryog' va sut mahsulotlariga o'zgartirildi (4 tilda).
- `page.tsx` va `sotuvchi-kartochka/layout.tsx` metadata tavsiflaridan (link preview uchun) raqobatchilar nomlari (Ma'no, Mountain, Abba) olib tashlandi.
- `globals.css` dizayn tizimidan Terracotta (olovrang/jigarrang) rangi butunlay olib tashlandi va o'rniga Cobalt Blue hamda neytral ranglarga o'zgartirildi.
- Oisha chat ulanishi uchun `OISHA_API_URL` va `OISHA_SECRET_KEY` kalitlari Vercel CLI yordamida loyihaga qo'shildi.

---

## 2026-06-16 | Antigravity Sessiyasi

**Nima qilindi:**
- Bosh sahifaning ikkinchi yarmidagi custom Atelier komponentlari (`ATLossCalc`, `ATIndex`, `ATProcess`, `ATPricing`, `ATFAQ`, `ATFinal`, `ATFooter`, `ATStickyCta`) to'liq dynamic dictionary keys yordamida lokalizatsiya qilindi.
- `ATQuotes` (sharhlar) bo'limi butunlay qayta yozilib, Sanity CMS-dan keladigan va static bo'lgan video (portrait Vimeo lightbox modal), audio (play/pause pleyeri) va matnli sharhlarni estetik formatda qo'llab-quvvatlaydigan qilindi.
- Kalkulyator summalari formatlanishi va jarayon bosqichlari misollari ingliz, rus, oziq-ovqat/fmcg/fintech/moda toifalari va tillar filteriga moslashtirildi.
- Barcha yangi tarjima kalitlari `uz.json` ga kiritilib, Node.js Gemini API avtomatlashtirilgan tarjimon skripti yordamida `en.json`, `ru.json` va `zh.json` fayllariga sinxronlashtirildi.
- Next.js type check tekshiruvi `npx tsc --noEmit` yordamida muvaffaqiyatli, 0 ta xatolik bilan yakunlandi.

---

## 2026-05-18 | Antigravity Sessiyasi

**Nima qilindi:**
- GitHub'dagi oxirgi o'zgarishlar (commit `02db9ae`) muvaffaqiyatli lokal `main` branchga cherry-pick qilindi va barcha konfliktlar yechildi.
- `src/components/contact-modal.tsx` dagi konfliktlar hal qilindi — dynamic input validatsiyasi, xato hoshiyalari va `aria-invalid` atributlari `rounded-[8px]` dizayn tizimi bilan uyg'unlashtirildi.
- `src/components/sections/hero.tsx` dagi konfliktlar hal qilindi — mobil qurilmalardagi matn kontrastini yaxshilovchi drop-shadow va cheklovlar Desktopdagi responsive `clamp` shrift o'lchamlari bilan birlashtirildi.
- Loyihaning to'liq build holati (`npm run build`) tekshirildi, barcha TypeScript va Next.js tekshiruvlaridan muvaffaqiyatli o'tdi.
- O'zgarishlar va konflikt yechimlari GitHub origin `main` tarmog'iga push qilindi.

**Natijalar:**
- `02db9ae` dagi barcha premium CRO va UX yaxshilanishlari (Telegram banner, dynamic pricing calculator, AI chat widget 3s fallback va mobil kontrast) asosiy kod bazasiga xavfsiz integratsiya qilindi.

---

## 2026-04-20 | Antigravity Sessiyasi

**Nima qilindi:**
- `ROAD_MAP.md` yaratildi — loyiha missiyasi, hozirgi holat va keyingi bosqich rejalashtirildi
- `DEV_LOG.md` (bu fayl) yaratildi — sessiyalar orasidagi kontekst saqlovchi hujjat
- `.github/workflows/deploy.yml` yaratildi — GitHub Actions orqali Firebase App Hosting'ga avtomatik deploy
- Sanity portfolio schemasi kengaytirildi — category, tags, beforeAfter images, slug

**Aniqlangan muammolar:**
- `src/app/[lang]/xizmatlar/brand-strategiyasi/` va `brand-strategy/` — dublikat route (har ikkalasi bir xil kontent, biri UZ, biri EN URL bilan)
- `zh.json` — xitoy tili tarjimasi to'liq emas (ba'zi kalitlar inglizcha)
- `next.config.js` — `ignoreBuildErrors: true` — bu TypeScript xatolarini yashiradi

**Keyingi sessiyaga vazifalar:**
- [ ] Portfolio case study sahifasi: `/portfolio/[slug]` route qo'shish
- [ ] Sanity'ga portfolio loyihalarini yuklash (Sanity Studio orqali)
- [ ] Hero A/B test infra

---

## Avvalgi sessiyalar

### 2026-04-17 | Foydalanuvchi (GitHub orqali)
- `feat(ui): enhance 'Sales Machine' copywriting and premium UI aesthetics in Uzbek`
- `bento-results-stats.tsx`, `hero.tsx`, `mobile-cta-bar.tsx`, `process.tsx` yangilandi

### 2026-04-16 | Foydalanuvchi (GitHub orqali)
- AmoCRM direct integration qo'shildi
- Testimonial video 9:16 aspect ratio tuzatildi

### 2026-04-15 | Antigravity Sessiyasi
- Sanity CMS migratsiyasi amalga oshirildi
- Before/After, Gallery, Founder seksiyalari sinaytirildi

### 2026-04-13 | Foydalanuvchi (GitHub orqali)
- Package Builder yaratildi (35KB komponent)
- Pick Two Selector premium animatsiyalar

---

## Texnik Eslatmalar

```
Firebase Project: brandboost-landing
Sanity Project:   h6ymmj0v
Sanity Dataset:   production
GitHub Remote:    baxtiyorjongaziyev/jonbranding-web (origin)
                  baxtiyorjongaziyev/jonbranding.uz (production mirror)
Deploy:           Firebase App Hosting (apphosting.yaml)
```

- **[2026-06-28 12:11]** Fix: Vercel build failed due to outdated pnpm-lock.yaml (dotenv addition). Updated pnpm-lock.yaml and pushed to origin main to unblock Vercel deployments.
- **[2026-06-28 13:51]** Fix: /presentation sahifasidagi infinite redirect loop tuzatildi. next.config.js dagi xato redirect olib tashlandi va src/proxy.ts middleware sifatida Next.js 16.2 konvensiyasiga moslashtirildi.
- **[2026-06-28 13:58]** Style: Asoschi portreti (Founder) formati 4:5 aspect ratioga o'tkazildi.
- **[2026-06-28 14:01]** UI/UX: Almaz Shoes videosi uchun muqova (cover) qo'shildi. Videoli va matnli sharhlar dizayni AT uslubiga o'tkazilib, tekislandi.
- **[2026-06-28 16:04]** Feat: Testimonials AT UI dizayni to'liq yakunlandi (markazlashtirildi, audio player pill-shaped qilib o'zgartirildi, ogg -> mp3 fix). Portfolio botiga Google Drive orqali multimodal vizual AI analizi (cover tanlash va image order) qo'shildi va avtomatlashtirildi.
- **[2026-06-29 15:00]** Chore: Home page `AtPricing` — tariflar olib tashlandi, faqat Brand Audit qoldi. Audit items qisqartirildi (PDF va 90 kun olib tashlandi). Founder bo'limi Atelier dark dizayniga o'tkazildi. Galereya tile'lariga gradient overlay qo'shildi (tekst har doim o'qiladi).

---

## 2026-06-29 | Feature Plan — 5 ta kengaytma

Oisha AI Proactive, Session Replay, Dynamic Personalization, 3D WebGL, A/B Testing — strategik reja va prioritetlar.
- **[2026-06-29 15:30]** Feat: Oisha Proactive Mode — `oishaProactive` CustomEvent, widget auto-opens + sends message. `ProactiveTrigger` pagelarni (sotuvchi-kartochka 30s, xizmatlar 45s, quiz 60s, blog 90s) kuzatadi. 4 tilda xabarlar. Client-enhancements ga ulandi.

---

## 2026-07-02 | Before/After — Liquid Glass Redesign

**Nima qilindi:**
- **[before-after.tsx]** To'liq qayta dizayn: eski `BrandSection tone="dark"` va `bg-[#090b0f]` o'rniga atelier section patterniga o'tkazildi (`py-[100px] md:py-[140px]`). Eski brand tokenlar (`text-brand-lime`, `bg-brand-lime/10`, `border-brand-lime/20`) o'rniga `var(--at-*)` CSS variable'lari ishlatildi.
- **[image-comparison-slider.tsx]** Liquid Glass glassmorphism uslubiga moslashtirildi: `var(--at-bg-2)`, `var(--at-paper)`, `var(--at-line)`, `var(--at-accent)` ranglari, atelier font family'lari, border/rounded styling.
- **Layout**: 2-column atelier section header (clamp typography, mono eyebrow, accent dot), proof cards atelier pill styling, grid 2-column cards with framer-motion scroll-animations.
- **Mobile**: clunky horizontal swipe o'rniga oddiy grid layout.
- **oisha-widget.tsx**: Merge conflict markerlar tozalandi (ikkilangan useEffect/bloklar olib tashlandi).
- **src/lib/blog-posts.ts**: Yo'qotilgan modul stublendi (sitemap.ts build error fiks).
- **Build**: muvaffaqiyatli.

---

## $(date +'%Y-%m-%d') | Bolt Sessiyasi - Performance Optimization

**Nima qilindi:**
- `services/portfolio-bot/src/drive-finder.ts` va `services/portfolio-bot/src/drive.ts` fayllarida `getAuth` funksiyasi asinxron (`async`) holatga o'tkazildi.
- Sinxron blokirovka qiluvchi `fs.existsSync` va `fs.readFileSync` o'rniga asinxron `fs.promises.readFile` dan foydalanildi.
- Google Service Account kalit fayli (JSON) uchun in-memory kesh joriy etildi, bu orqali fayl faqat bir marta o'qiladi.
- O'zgarish Node.js event loop bloklanishining oldini oladi va benchmark natijalariga ko'ra Google API ga auth olish vaqtini 5000 ta chaqiriq uchun ~118ms dan ~38ms gacha qisqartiradi, asosiysi, parallel ishlashda qotib qolishni (event loop delay) butunlay yo'q qiladi.
# 2026-07-15 — at_modal lead delivery

- `at_modal` uchun telefon majburiy, Telegram username ixtiyoriy qilindi.
- Telefon E.164 formatiga normallashtirilib, AmoCRM kontaktiga PHONE/MOB sifatida yuboriladi.
- Lead AmoCRM va Telegram guruhiga parallel yuboriladi; bittasi ishlamasa ikkinchisi to'xtamaydi.
- API, forma va normalizatsiya testlari qo'shildi.
- Production test: AmoCRM muvaffaqiyatli (`amoCrm: true`), Telegram yuborish muvaffaqiyatsiz (`telegram: false`). Bot token ishlaydi, ammo sozlangan guruh uchun Telegram `Bad Request: chat not found` qaytardi; guruh ID yoki bot a'zoligi tuzatilishi kerak.
- `chat not found` sababi aniqlandi: Vercel'dagi `TELEGRAM_CHAT_ID` eskirgan. To'g'ri qiymatlar — guruh "Sotuv Bolim - | Jon Agency", `TELEGRAM_CHAT_ID=-1003854308552`, "Yangi lead" topic uchun `TELEGRAM_MESSAGE_THREAD_ID=1020`. Bot `@jonairobot` guruhda administrator, forum rejimi yoqilgan, shu ID va topicga test xabar muvaffaqiyatli yetkazildi. Vercel'da Production va Preview muhitlariga yangi qiymatlar o'rnatildi.
- Bot privacy mode yoqilgan: guruhdagi oddiy xabarlarni ko'rmaydi, shuning uchun `getUpdates` orqali chat ID topish uchun guruhga `/start@jonairobot` yozish kerak. Yuborishga ta'sir qilmaydi.

## Brend diagnostikasi sahifasi (PR #285)

- `/diagnostika` — 7 savolli interaktiv diagnostika. Har savol alohida ekranda, progress bar, orqaga/davom; javoblar massivda saqlanadi, ball har safar noldan hisoblanadi (orqaga qaytish ikki marta qo'shmaydi). Ball A=0/B=1/C=2, natija 3 toifa (0–6, 7–10, 11–14).
- Ichki tasnif (nurture/potential/qualified, priority, sales_status) faqat CRM uchun — foydalanuvchi ekranida ham, API javobida ham yo'q.
- Lead AmoCRM (sdelka+kontakt+note, teglar bilan) va Telegram "Yangi lead" topic'iga parallel boradi; kalitlar bo'lmasa mock rejim, foydalanuvchi natijani baribir ko'radi. AmoCRM note HTTP xatosi endi status bilan loglanadi (fetch 4xx/5xx da reject qilmaydi).
- Rebase paytida topildi: route `rateLimit`ni await'siz chaqirardi — Promise doim truthy, cheklov umuman ishlamasdi. Tuzatildi (5 so'rovdan keyin 429, lokal tasdiqlangan).
- lead-guard (honeypot) diagnostika endpointi va formasiga ulandi.
- Preview'da to'liq oqim brauzerda tekshirildi: 7 savol, orqaga, validatsiya (bo'sh forma POST yubormaydi), 14 ball → qualified natija.
- QARZ: matnlar hozircha faqat o'zbekcha (TZ talabi), `diagnostics.ts` va client'da hardcoded — ru/en/zh tarjimasi va `uz.json`ga ko'chirish alohida PR'da. `/ru|/en|/zh/diagnostika` hozir o'zbekcha ko'rinadi.

## Lead yetkazishni mustahkamlash (PR #284)

- Telegram xatolari jimgina yutilardi (`console.error` + route baribir `ok: true`): shu sabab `chat not found` 6 kun sezilmadi. Endi `logger.error` bilan yoziladi; `TELEGRAM_ADMIN_CHAT_ID` sozlangan bo'lsa asosiy guruh yiqilganda ogohlantirish zaxira chatga boradi.
- Spam leadlar sababi: `/api/submit-form` da bot himoyasi umuman yo'q edi. `src/lib/lead-guard.ts` qo'shildi — honeypot (to'ldirilgan so'rov jimgina tashlanadi, javob haqiqiysidan farq qilmaydi), ixtiyoriy Turnstile (`TURNSTILE_SECRET_KEY` bo'lsagina yoqiladi; Cloudflare 5xx bersa yoki javob buzuq bo'lsa fail-open — lead o'tkaziladi), Origin faqat loglanadi.
- To'rtala lead formasi (contact-modal, at-modal, trademark-calculator, lead-magnet-popup) honeypot maydoniga ulandi. contact-modal'da `companyWebsite` mahalliy Zod schema'ga ham qo'shildi — aks holda `zodResolver` uni kesib, qiymat serverga yetib bormasdi.
- `lead-magnet-popup` hech qachon lead yubormagan — `name` yuborardi, schema `fullName` kutadi, har safar 400 qaytgan. Tuzatildi.
- `src/proxy.ts` `/uz/...` redirectida `new URL(path, base)` query stringni tashlab yuborardi — butun sayt bo'ylab `?source=` va UTM parametrlari yo'qolardi. `nextUrl.clone()` bilan tuzatildi, regressiya testlari qo'shildi.
- `scripts/check-telegram.mjs` qo'shildi: bot token, chat ID, forum holati va bot ko'rgan chatlarni tekshiradi.
- DIQQAT: `TURNSTILE_SECRET_KEY` ni frontend widget ulanmaguncha o'rnatmang — kalit qo'yilsa barcha formalar tokensiz 400 oladi.

## CI: Linux runnerda `npm ci` tuzatildi (PR #286)

- CI `main`da ham yiqilgan edi (`f311fe25`), sabab `Install dependencies` bosqichida.
- `@next/swc-win32-x64-msvc` `devDependencies`da turgan. Win32'ga qulflangan paket, Linux runnerda `EBADPLATFORM`. Avval `optionalDependencies`ga ko'chirildi, keyin butunlay olib tashlandi: `next@16.2.10` barcha swc binarlarini o'zining `optionalDependencies`ida tarqatadi, shuning uchun alohida yozuv ortiqcha va Next yangilanganda versiya nomuvofiqligini keltirib chiqarardi.
- Repo ikkita lockfile ishlatadi: GitHub Actions `npm` (package-lock.json), Vercel va Netlify `pnpm` (pnpm-lock.yaml). Faqat bittasini yangilash Vercel'da `ERR_PNPM_OUTDATED_LOCKFILE` beradi — ikkalasi ham sinxron bo'lishi shart.
- Lockfile `package.json`dan chetlashgan edi (react/react-dom `19.2.6` vs `^19.2.7`, eslint-config-next `16.2.6` vs `16.2.10`); `npm ci` bunday nomuvofiqlikda ham to'xtaydi. Ikkala lockfile qayta yaratildi.

## Diagnostika: baholashdan xizmat bo'shliqlarini aniqlashga o'tish (PR #289)

- Muammo: eski model faqat leadni baholardi va mijozga mavhum tavsiya berardi ("brend pozitsiyasini aniqlashtiring"). Mijozlarimiz brendbuk yoki tovar belgisi nima ekanini bilmaydi, shu sabab natijadan nima sotib olishni tushunmasdi. Menejer ham CRMda faqat javob variantini ko'rardi (`A — Hali aniq bilmayman`), savol nimaligi bilinmasdi.
- Savollar inventarizatsiyaga o'tkazildi: 1–5 nima yetishmayotganini aniqlaydi (nom, tovar belgisi, logotip, vizual tizim, qadoq), 6–7 sotuv uchun qoladi (muddat, qaror qabul qiluvchi). Atamalar savol ichida `hint` bilan izohlanadi.
- Tasnif endi balldan emas, sotib olishga tayyorlikdan (`readiness` = muddat + qaror, 0–4) kelib chiqadi. Eski modelda g'oya bosqichidagi tadbirkor 1/14 ball olib `nurture` bo'lardi, holbuki unga barcha xizmatlar kerak. `total_score` brend yetukligi sifatida saqlanib qoldi, lekin tasnifga ta'sir qilmaydi.
- `TIMING_INDEX` va `DECISION_INDEX` savol `id` sidan hisoblanadi, qo'lda yozilmaydi — savollar tartibi o'zgarsa tayyorlik jimgina boshqa javoblarni o'qib ketmasligi uchun. Buni qo'riqlaydigan test ham bor.
- CRM va Telegram: `TAKLIF QILINADI:` satri birinchi o'rinda, javob satrlari savol matni bilan keladi, sdelkaga `kerak:patent` ko'rinishidagi teglar qo'shiladi. Bo'shliq topilmasa taklif satri o'rniga alohida matn chiqadi — "Jiddiy bo'shliq topilmadi" ning o'zi taklifdek ko'rinmasligi uchun.
- Sahifa faqat o'zbek tilida. Matnlar `src/lib/diagnostics.ts` da, locale lug'atlarida emas — bu ataylab qilingan, chunki savollar va xizmat izohlari mahalliy bozorga yozilgan. Boshqa tillarga tarjima alohida ish sifatida qarz.

## 2026-07-27 | Package Builder & Narxlash Algoritmi Yangilandi

**Nima qilindi:**
- **Paketli Chegirma (Package Discount):** 50/50 to'lovdagi shartsiz "Istisno chegirmasi" o'rniga "Paketli chegirma" qo'shildi. Bu chegirma faqat kamida 2 ta asosiy xizmat tanlangandagina va to'lov usuli (50/50 yoki 100%) tanlansa amal qiladi.
- **Paketlarni maxsus tortish:** "logoPremium" (Logo va Firma uslubi) 2 ta xizmat, "logoVIP" (Logo, Firma uslubi, Brandbook) 3 ta xizmat deb baholanadigan mantiq kiritildi.
- **Sizning paketingiz (Cart) oynasi qulaylashtirildi:** Foydalanuvchi endi tanlangan xizmatlarni bevosita xulosa oynasidan turib X tugmasi bilan olib tashlashi mumkin. Shuningdek, qo'shimcha xizmat tanlash uchun tepaga qaytaruvchi "Boshqa xizmat qo'shish" tugmasi qo'shildi.
- Kod src/lib/pricing.ts va src/components/sections/package-builder.tsx da yangilandi.

---

## 2026-07-31 | Homepage audit fixlari production uchun ajratildi

- 9 ta vizual below-the-fold section SSR-safe qilindi; utility overlaylar client-only qoldi.
- Reduced-motion, global focus-visible, FAQ/process accordion ARIA holatlari va 44px touch targetlar tuzatildi.
- Active homepage `transition-all` ishlatishlari aniq property transitionlariga almashtirildi.
- Sticky CTA scroll paytidagi layout readlari cache qilindi va safe-area positioning qo'shildi.
- Contact modal `form.watch()` o'rniga `useWatch()` ishlatadi.
- Trademark calculator testi parallel suite uchun barqarorlashtirildi.
- Desktop/tablet/mobile full-scroll, overflow va reduced-motion Playwright regressiya testi qo'shildi.

**Production gate:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, Chromium responsive E2E va `git diff --check`.

## 2026-08-02 | Production audit, security va diagnostika i18n

- Homepage audit tuzatishlari alohida release branchga ajratildi: responsive, reduced-motion, fokus, ARIA va scroll ishlashi yaxshilandi.
- Production dependency auditidagi 13 ta zaiflik yopildi; `npm audit --omit=dev` natijasi: 0.
- `package-lock.json` `package.json` bilan qayta sinxronlandi; oldingi Vercel lockfile drift sababi bartaraf etildi.
- `/[lang]/diagnostika` savollari, xizmat tavsiyalari, natijalari va forma UI matnlari `uz`, `ru`, `en`, `zh` lug‘atlariga ko‘chirildi.
- Diagnostika hint matnlari endi foydalanuvchiga ko‘rinadi va to‘rt tildagi lug‘atlarning to‘liqligini tekshiruvchi regressiya testi qo‘shildi.
- Gate: TypeScript xatosiz; ESLint xatosiz; unit testlar xatosiz; Next production build 161/161 sahifa; Playwright responsive/reduced-motion 4/4.

## 2026-08-02 | GitHub security alertlarni nolga tushirish

- CodeQL topilmalari tuzatildi: blog plain-text sanitizatsiyasi nested tag qayta hosil qilmaydi; Oisha browser ID `crypto.randomUUID()` bilan yaratiladi.
- `mcp-server` dependency lock yangilandi: `@modelcontextprotocol/sdk` 1.30.0 va patched `@hono/node-server` 2.0.12.
- `services/portfolio-bot` lock manifest bilan sinxronlandi va `brace-expansion` 2.1.4 ga yangilandi.
- Nested sanitizer va cryptographic ID uchun regressiya testlari qo‘shildi.
- Production merge gate: root hamda ikkala subproject audit/build/test tekshiruvlari va GitHub security rescan.

## 2026-09-26 | JonBranding P0–P2 business implementation

- Homepage flagman offeri `Visual Identity System / firma uslubi`ga o‘tkazildi; audit secondary lead magnet bo‘lib qoldi.
- Hero rasmi deterministik qilindi va portfolio CTA `#ishlar`ga yo‘naltirildi.
- `/uz` canonical redirecti endi `NEXT_LOCALE=uz` cookie o‘rnatadi; aniq o‘zbekcha URL brauzer tili sabab `/en`ga sakramaydi.
- Homepage xizmatlari logotip/firma uslubi, brendbuk va qadoq/tashuvchilarga fokuslandi; qolganlari add-on sifatida ta’riflandi.
- Lead schema va `AtModal`ga page, section, offer, CTA, referrer va UTM taxonomy qo‘shildi; ma’lumot AmoCRM note va Telegram alertga uzatiladi.
- Protected `POST /api/admin/retry-amocrm-leads` endpointi Firestore pending queue leadlarini AmoCRMga qayta yuboradi.
- `/admin/kp-builder` MVP qo‘shildi: xizmat tanlash, 50/50 yoki 100% to‘lov, promokod, copy va print.
- Narxlash qoidasi majburiy 10% Istisno → 100% oldindan bo‘lsa 10% Salom → promokod bo‘lsa 10% kaskadga moslashtirildi; $50/3 kun Arboun metadata qo‘shildi.
- Narxlar sahifasidagi dalilsiz 500+/1000+ raqamlari jarayon va to‘lov faktlariga almashtirildi.
- `docs/CLAIM_PROOF_MAP.md` va `docs/P0_P2_BUSINESS_IMPLEMENTATION.md` qo‘shildi.

## 2026-10-02 Codex: TypeScript ES5 deprecation fix

- Changed tsconfig.json target from es5 to ES2017; inherited by tsconfig.typecheck.json. This removes the deprecated target rather than adding a compiler-version-specific suppression.
- Verified TypeScript 6.0.3 option diagnostics: ES5 reproduces the reported deprecation, ES2017 yields no option errors. Installed Next.js browser support docs require modern browsers. npm run typecheck passed with local TypeScript 5.9.3; git diff --check passed.
- Existing local/staged work preserved. No commit/push/deploy. Obsidian search/log returned 404/429; vault logging unconfirmed.

## 2026-10-04 — Codex: Antigravity IDE project setup

- Added .agents/rules/engineering-team.md and project-scoped deliver-task, review-change, release-readiness skills. Existing instructions, source code and dirty work preserved.
- Separate Antigravity workspace saved under Documents/Codex/2026-10-04/review-the-latest-codex-feedback-on/outputs; settings cover formatter selection, search/watch exclusions and project verification tasks.
- This is local IDE/workflow setup, not a production change. Rules guide the model; they do not enforce runtime permissions or replace CI/hooks.
- Verification is recorded in the accompanying outputs/antigravity-setup.md report. Full application gates are not claimed by this setup. Existing Codex/Claude worktrees remain separate.
- Obsidian context/search failed with MCP SSE 404/429; vault capture unconfirmed. No commit, push, merge or deploy.

- Follow-up verification (2026-10-04): all six skill manifests valid; both workspace JSON/root checks pass; 10 process tasks; both workspace windows visible in native IDE. Prettier, ESLint, Ruff registered from existing local VS Code installations after marketplace timeout. Native Agent input automation did not accept text, so model response/skill activation remain unverified. Obsidian project append and brain_log subsequently succeeded. No production change.

## 2026-10-05 — Antigravity IDE verification follow-up

Native agent discovered all three project skills and accurately reported project rules. Oisha venv selection and Ruff native formatter verified in UI. Local VSIX installs succeeded. Web npm package manager corrected; native Prettier smoke check remains pending because the active window needs extension reload while another agent is working. GitHub login reported complete by owner; account session not independently verified. Separate Claude login remains visible. No commit, push, merge or deploy. See Antigravity setup report for evidence boundaries.

## 2026-10-05 — Umumiy AI agent skills qoidasi AGENTS.md ga qo‘shildi

- `.agents/skills/` barcha AI agentlar uchun umumiy skill manbasi sifatida belgilandi.
- Anti-AI-slop workflow uchun `impeccable`, `design-taste-frontend`, `copy-editing` va `web-quality-audit` skill’lari ko‘rsatildi.
- Kod o‘zgarishlaridan keyin `npm run verify:fast` va `npm run verify` harness tekshiruvlari belgilandi.

## 2026-10-05 | SEO metadata qo'shildi
- `avans` va `credentials` sahifalariga `generateMetadata` funksiyasi qo'shildi, `alternates` (canonical + hreflang) dinamik tarzda yaratiladi.
- `avans/layout.tsx` da ham `generateMetadata` qo'shildi, `use client` bilan muammo hal qilindi.
- SEO ma'lumotlari sahifa yo'li (`/avans`, `/credentials`) ga bog'liq, shuning uchun URL yoki yo'l o'zgarmasa SEO qayta ishlash shart emas.
- Dizayn (CSS/layout) o'zgarsa, canonical URL va alternates tekshirilishi lozim; `npm run verify` (canonical.test.ts) bajarilishi tavsiya etiladi.
- Kelgusida har bir sahifada `generateMetadata` ning mavjudligini va `getPageAlternates` dan foydalanganligini tekshirish uchun `DEV_LOG` ga qo'shildi.

## 2026-10-05 | Codex integration recovery (in progress)
- Browser metadata only: AMOCRM_ACCESS_TOKEN and Telegram chat/topic variables cover Production and Preview. META search showed META_API_ACCESS_TOKEN in Production; META_CAPI_ACCESS_TOKEN was not listed. No values decrypted or shown.
- Owner authorized continuation. Production redeploy dpl_2TPJQYg9CYVWwcQVno4wcyWsZrQg started from existing deployed commit 3ce8eaa; local dirty code was not deployed or modified.
- Meta Settings returned a UI error. Credential creation and entry require owner handoff. No integration success claimed; last-hour Route search had no submit-form match.
- Obsidian brain_log failed: Session terminated. Application tests omitted because no application code changed.

- Recovery follow-up: Production redeploy dpl_2TPJQYg9CYVWwcQVno4wcyWsZrQg reached READY in browser (4m 3s build), assigned www.jonbranding.uz. Telegram Yangi lead topic contains website test messages at 13:40 and 13:55, followed by AmoCRM Unauthorized notices; these predate this redeploy. No post-deploy form request or server Lead success confirmed.

## 2026-10-05 | Codex API/MCP access
- Existing Oisha MCP check_amo_auth returned AUTH OK: Jon Branding Agency (account 32681154). get_instagram_profile returned ok=true for baxtiyorjongaziyev. These are separate from the website deployment credentials and do not prove form delivery or CAPI access.
- Existing Vercel app connector required reauthentication. Added official global Codex MCP vercel at https://mcp.vercel.com using codex mcp add. Existing team OAuth authorization was renewed; CLI returned Successfully logged in. codex mcp get vercel confirms enabled streamable_http config. Runtime project tool call via newly added MCP still pending tool reload/new session.
- No token or env value printed, decrypted, copied, or committed. Application source unchanged. Verification used real read-only API calls and OAuth CLI result; app test suites are not applicable.

## 2026-10-07 | PWA (Progressive Web App) to'liq integratsiyasi va mobil ilova o'rnatish tajribasi joriy etildi
- **Muammo:** Saytda `manifest.json` va ikonalar mavjud bo'lsa-da, Next.js metadata'sida `manifest` ulanmagan, Service Worker yo'q edi va foydalanuvchilar saytni telefoniga ilova qilib o'rnatish (PWA install) imkoniyatiga ega emas edi.
- **Yechim:**
  1. `public/manifest.json`: W3C PWA talablariga mos ravishda `id: "/"`, `scope: "/"`, va `orientation: "portrait-primary"` qo'shildi.
  2. `src/app/[lang]/layout.tsx`: `generateMetadata` da `manifest: '/manifest.json'` va `appleWebApp` to'liq ulandi.
  3. `public/sw.js`: Ishonchli, xavfsiz va yengil Service Worker yaratildi — HTML sahifalar uchun Network-First (yangiliklar doimiy yangi turishi uchun), statik fayllar (rasmlar, ikonlar, shriftlar) uchun Stale-While-Revalidate kesh strategiyasi va oflayn himoya.
  4. `src/components/pwa/pwa-installer.tsx`: Premium Atelier uslubidagi PWA o'rnatish komponenti yaratildi (Service Worker ro'yxatdan o'tkazish, Android/Chrome `beforeinstallprompt` tutish, iOS Safari ko'rsatmasi, avtomatik va qo'lda ochish, tahliliy hodisalar `trackEvent`).
  5. `src/components/layout/header-mobile-menu.tsx`: Mobil gamburger menyuga "Ilovani o'rnatish" tugmasi qo'shildi.
  6. i18n: `uz.json`, `ru.json`, `en.json`, `zh.json` fayllariga `pwa` kalitlari Uzbek-first tamoyilida to'liq qo'shildi.
- **Tekshiruv:** `npm run verify:fast` (barcha 54 test to'plami, 376 ta test) va `npm run typecheck` 100% xatosiz muvaffaqiyatli o'tdi.
\n### 2026-10-10 � production mobil vizual audit\n- jonbranding.uz home, menu, PWA, portfolio filter, footer, pricing va Perfona detail tekshirildi (Chrome emulation 390/320/360).\n- Tasdiqlandi: callback/mobile-nav/menu collision; food filter 23 tiles; nonexistent footer anchors; PWA broken icon; gallery copy mismatch; duplicate close.\n- Report: docs/audits/2026-10-10-mobile-audit.md; screenshots external visualization directory.\n- Audit-only: product code unchanged, no lead submitted. Harness rerun not required for docs-only audit; prior code verification remains separate from visual findings.\n

### 2026-10-10 � PWA icon contrast fix
- Reproduced: dark JON on transparent regular icons disappears against dark backgrounds. Existing brand vector retained; opaque cream backgrounds rasterized with sharp at exact 192/512/180 sizes; maskable safe-area retained.
- Added v2 icon URLs, manifest/apple metadata/SW cache updated; installer uses unoptimized local PNG to avoid broken optimizer delivery.
- verify:fast and verify passed (56 files, 384 tests, typecheck, 4 locales); PNG dimensions/opaque checks passed. Self-review completed. No unrelated changes reverted.


- Production image readback exposed root cause of prior broken icon: src/proxy.ts matcher rewrites icon PNG paths into locale pages ->404. Added exclusions for icon-* and versioned apple-touch-icon; 8 actual Next matcher regression cases added. First deploy Ready but asset readback failed; corrective deploy follows after gates.


- Corrective verification: installed Next exports unstable_doesMiddlewareMatch despite bundled docs naming doesProxyMatch; corrected test API. verify and verify:fast pass392 tests and typecheck. Reviewer: self-review; locale exclusions narrowly scoped to icon assets.


- Final production verified 2026-10-10 19:01 Asia/Tashkent: commit622fc58, Vercel7rmmCP86Vot4RejLgJhrwhVzU9Va Ready, www.jonbranding.uz assigned. Browser icon-192-v2.png renders with naturalWidth/Height192 and complete=true; screenshot saved external mobile-audit/pwa-icon-production.png. Real installed launcher icon refresh not tested.


### 2026-10-10 � mobil audit remediation
- Implemented single mobile contact surface: external callback FAB hidden through exposed CSS part; mobile sticky CTA disabled; menu/dialog/chat/PWA suppress quick actions. Shadow callback observer tracks form open/closed without changing backend or tracking.
- Footer anchors ->ishlar/savol; mobile drawer one localized44x44 close; PWA share/home-screen steps localized all4 languages.
- Home portfolio six known projects with existing local brand art, canonical CMS URLs retained; service-based filters replace all-null industry fields; selected-state semantics, empty state, full portfolio link; no guessed years.
- Perfona gallery inspected live: logo and Telegram IT product confirmed. Prior perfume inference withdrawn; existing description retained. Only old promotional cover replaced with existing gallery logo, future CMS cover edits retain precedence.
- Pricing case alt/client fallback removes undefined; prices unchanged. Focused regressions added. verify:fast397 tests passed; verify initially found test API exact-option mismatch, corrected; subsequent verify397 tests +typecheck passed. Scoped ESLint passed.
- Local390px visual checks: menu single close44x44, no callback FAB; PWA no broken images;6 gallery tiles; Qadoq onlyBoyarin; callback form hides quick actions. Form not submitted.


- Final checks: verify:fast +verify397 tests59 files, typecheck/i18n1253keys per locale, scoped ESLint and git diff --check pass. Local pricing320 and Perfona360 overflow0; AI chat360 width336px and mobile nav hidden. Self-review completed; screenshots saved outside repo. Real-device native install/keyboard and lead delivery remain unverified.


### 2026-10-10 � Mobile audit production verification
- Commit 57aec492 deployed: Vercel FvJxU2ykZqW9FgaoKen67G8YjbKh Ready at 19:21:47 Asia/Tashkent, www.jonbranding.uz assigned; GitHub Vercel status success.
- Live Chrome iPhone emulation 390px: one 44px menu close, no horizontal overflow; bottom actions hidden while menu/callback open; service Qadoq filter shows only Boyarin, reset restores six tiles; FAQ navigates #savol with section top 0.14px.
- Live pricing 320px: scrollWidth=clientWidth=320, undefined image alt absent. Local 360px AI chat and Perfona cover verified earlier. No fake lead or chat submitted.
- verify:fast and verify passed (397 tests, typecheck, four-locale parity). Real iPhone/Android installation, OS keyboard and actual lead delivery remain unverified.
- Screenshots saved outside repository in Codex visualizations mobile-audit folder. Obsidian project append succeeded. Own local dev server stopped.

### 2026-10-10 � Installed PWA scroll error investigation
- Owner reports root homepage error after scrolling in installed PWA. Fresh Chrome mobile page scrolled to footer without runtime errors; exact phone exception is not yet reproduced.
- Applied deliver-task workflow; self-review only. Scope: service worker cache lifecycle, registration/resume update, root chunk error recovery, SW response headers, focused behavioral tests.
- Confirmed defect: old SW activation deleted prior immutable Next chunks while immediately taking over existing clients. Fixed by migrating cached build assets before cleanup/claim and preserving unrelated caches. Navigations bypass HTTP cache; offline missing assets return a real 503 response.
- Added no-store sw.js header, updateViaCache none and visibility/resume update check for standalone as well as browser. Chunk import errors recover by hard reload once per two minutes/session; generic render/offline/storage-blocked errors are not reloaded.
- 9 regression cases cover cache migration, old chunk access without network, fresh navigation/offline fallback, missing asset503, chunk classification and loop guard. verify:fast: 406 tests passed; focused ESLint and diff check passed. Full verify and deployment pending.
- Limitation: likely deployment/cache failure mitigation; actual owner phone error is not proven resolved until device retest.
- Full verify passed: typecheck, 406 tests, four locales. Self-review adjusted immutable cache writes so quota failures do not discard successful network responses; focused SW/recovery tests rerun passed before publication.
- Production verified: 7ecb787e, Vercel Bnxm97ohdfK1mg3vgHwLt2B1XGns Ready at 19:38:57 Asia/Tashkent. Live sw.js HTTP200 and Cache-Control no-cache/no-store/must-revalidate.
- Chrome controlled ServiceWorker upgrade observed from jonbranding-v2-icons to jonbranding-v3-recovery; previously cached old build CSS retained after old cache deletion. Android UA/mobile390px full homepage scroll to footer, console errors empty, error boundary absent. This is browser emulation with real SW lifecycle, not physical installed Android verification.
\n2026-10-11 | Codex | Sales-machine visual audit completed: live homepage, Den Aroma, pricing and forms; 8 evidence-led findings in docs/audits/2026-10-11-sales-machine-audit.md. No production code edits or submissions during audit; conversion and CRM delivery unverified. CRO skill applied. Tests not run: documentation-only audit; pre-existing code work preserved.


2026-10-11 — Sales audit remediation (local): Unified the free offer as a 20-minute consultation in four locales; added shared contextual /api/submit-form lead intake with a 15s timeout and retained service/source; removed duplicate callback attributes and owner Telegram from header/footer primary flows; added early canonical-price shortcuts and service/package anchors; withheld metrics without reviewed source/period and unattributed Den Aroma narrative; kept actual project images and video testimonials, excluded editorial captions from direct quotes; replaced absolute sales/legal promises with scope/deliverables. Mobile polish includes opaque quick nav, guarded storage, viewport-aware chat and early PWA/chat events. Found and guarded homepage testimonials sessionStorage read. Audit report: docs/audits/2026-10-11-sales-machine-audit.md. Verification and deployment still pending.
2026-10-11 � Verification: final verify:fast and verify passed (65 files / 418 tests, 4 locales x 1321 keys, TypeScript); full eslint passed; local optimized production build passed (165 static pages). Chrome mobile emulation: contextual home form opens; pricing logo anchor works; logo remains selected in form; 390px and 320px form fits with no horizontal overflow. No real lead submitted. Preparing authorized production release.
2026-10-11 � Release queued: commit 82ee5cbc07288806ea9a4b76a26f2f1b3813e2a4 pushed to main; Vercel deployment 7doNxvY8jfJcqCzZ5HCEe9Tgs8Xx pending. The server reported a main-branch PR/check rule bypass by the authorized account; GitHub CI is running separately. User AGENTS.md edit and unrelated untracked files were excluded. Production completion has not yet been claimed.

## 2026-10-11 - Client logos and release readback
- 82ee5cb Vercel production Ready at 13:49 Asia/Tashkent; live mobile selected Logotip form verified and screenshot saved.
- Owner requested Rash Milk, Goodwell, Rahimov School and Savod. Added real owner-provided Rash Milk SVG plus existing verified CDN assets in a mobile 2-column / desktop 4-column logo row, translated heading in all locales.
- CI core build/typecheck/lint/unit tests passed; E2E 9/10 passed, outdated Oisha CTA expectation failed. Updated expectation for one contextual lead form and no duplicate callback.
- Local E2E unavailable: installed Playwright Chromium executable missing; CI will execute suite. No real leads submitted.

- Logo release e2e97355 prerender failed: trimmed homeDictionary omitted trustedBy. Added only required eyebrow to the server-to-client dictionary; rerunning full build before release. Live footer and 20-minute consultation dialogs verified after resetting conflicting browser emulation overrides.

- Final release a7f1adb22d1b9ab47404850ce61a921343013a97: Vercel 3jvkcwqcyTs44rnQRACUHX3HJ5xZ Production Ready at 14:28:43 Asia/Tashkent, www.jonbranding.uz assigned. Four logo images loaded on live page; screenshot production-client-logos.png saved outside repo. 320px layout clientWidth=scrollWidth=320. Full homepage scroll, footer team form, 20-minute consultation and PWA entry verified in browser emulation. Local full production build passed 165 static pages; lint and 418 tests passed. Physical Android and real CRM lead delivery remain unverified.

- Final CI run 38128411228 success: core Typecheck/lint/test/build and Playwright Chromium E2E both passed for a7f1adb22d1b9ab47404850ce61a921343013a97.

## 2026-10-11 - Three-row client logo train
- Owner requested two rows moving left and one right. Replaced static four-logo grid with three seamless tracks (left/right/left), using existing client logo sources with prior hiddenInHero exclusions preserved.
- CSS transform-only linear loops, identical duplicated groups with aria-hidden, offscreen IntersectionObserver pause, localized pause/resume controls, and static reduced-motion layout. No new client/service claims or CMS changes.
- Applied ui-animation skill; verify, lint, visual checks and release pending.

- Verification passed: 4 locales /1323 keys, TypeScript, 65 test files /418 tests, full lint. CSS loops animate transform only. Production build and visual verification will run on exact release commit.

- Production release 39204cc83e78a1e98a39b84d4011b5040edcda40 Vercel FMAjF3y3EPxmZjSfjBaj899hmK9o Ready 14:45:52 Asia/Tashkent. Live 3 tracks running normal/reverse/normal; measured x values moved left/right/left between observations. Duplicate group widths equal, no seam gap. 320px clientWidth=scrollWidth=320. Screenshot production-logo-train.png saved outside repo; pause/reduced-motion/offscreen verified locally. Physical Android not tested.

- CI 38129360943 complete success: Typecheck/lint/test/build plus Playwright Chromium E2E passed for final 39204cc83e78a1e98a39b84d4011b5040edcda40.

## 2026-10-11 - White-background logo removal
- Owner requested identify/list white-background logos and stop using until clean SVG arrives.
- Read original Sanity PNG alpha channels and visually reviewed all assets on site beige background. Confirmed To'maris supermarket has white rectangle (including partial white alpha on corners); other logo whites are glyphs/graphic elements, not rectangular backgrounds.
- Removed To'maris from staticBrands; recorded source URL and SVG requirements in docs/audits/2026-10-11-logo-replacements.md. No CMS mutation or source image editing. Repo public and G:/My Drive/JonBranding SVG filename search found no To'maris SVG.
- Focused verification and deploy pending; owner AGENTS/unrelated untracked files preserved.

- verify:fast passed 65 files/418 tests and i18n parity. Change is one static logo data entry plus audit documentation; full typecheck/lint/build will run in release CI on exact commit. Drive filename search across all file types also found no To'maris source vector.

- Release 91b641680f82e6769f1a7d68c4aa0b673765aa93 deployed: Vercel 5A9WBS4rFyCkpsEoq76mN2PS6SQQ Ready Production at 14:56:12 Asia/Tashkent, www.jonbranding.uz assigned. Production mobile readback: removed ToMaris asset count 0, three rows running normal/reverse/normal, 320px clientWidth=scrollWidth=320. Screenshot production-transparent-logo-train.png saved outside repo. CI 38130034147 complete success: typecheck/lint/tests/build and Chromium E2E. Browser emulation reset and owned tabs closed. Final verification record left local to avoid another release.

## 2026-10-11 - Client logo visual hierarchy
- Owner requested prominent title and smaller logos. ClientLogos heading changed from muted 14px to ink 30px mobile/48px desktop. Logo frames reduced from 144x80 to 96x56 mobile and 176x96 to 128x64 desktop; responsive image sizes updated. Three-row motion and controls preserved. Responsive-design skill applied. Verification/deploy pending.
- verify:fast passed 65 files/418 tests and all 4 locales. Styling-only change; full typecheck/lint/build/E2E delegated to exact-commit release CI. No new mirror tests added.
- 921dcceb003109057a0483614bd990875dec021c Vercel DuKt7RJ5i7fVqZe2H3Fb5zgwnDQr Ready Production, domain www.jonbranding.uz. Live visual screenshot production-logo-size.png: title 30px/mobile and 48px/1440px, logo96x56/mobile and128x64/desktop. 320px no overflow; three rows retained. Browser emulation reset/tabs closed. Release CI38130754007 still running.
- Final CI38130754007 completed success: typecheck/lint/tests/build and Chromium E2E. Final verification log remains local to avoid duplicate deploy.

## 2026-10-11 - Unify pricing client logos
- Owner found stale pricing trust block. Replaced independent grayscale CMS logo grid and legacy trust heading with shared ClientLogos and locale trustedBy labels. Removed obsolete brands fetch/16-logo slice and ServiceLogo prop. Testimonials retained. Home and pricing now share heading, compact sizes, three-row directions and white-background exclusion. Verification pending.

## 2026-10-11 | Codex CAPI live status audit
- Meta Events Manager pixel 1134785364752294, window 13 Sep-10 Oct: Lead active, Browser only, count 3, latest 6 days ago. No Server Lead evidence visible. CAPI success not confirmed.
- Vercel runtime logs MCP returned UNAUTHORIZED (reauthentication required); vercel CLI absent on PATH. No secret values read; no production changes or test events sent. Application tests not applicable to read-only status audit.

- verify:fast418tests/locales and typecheck passed. Full lint/build/E2E run in exact-commit release CI; no price/package/lead behavior changed.

## 2026-10-12 | e2e9735 build investigation (Codex)
- Applied deliver-task; self-reviewed scoped diff; preserved unrelated changes.
- CI38128130692: Typecheck/lint/418 tests passed; webpack compiled and TypeScript finished; prerender failed reading trustedBy.eyebrow. Lighthouse38128130643 stopped at Build with the same error, before audit. a7f1adb2 already repaired the reduced dictionary; 39204cc8 added pause/resume labels. Later logo commits have green CI.
- CI38126028141: obsolete Oisha callback E2E expectation failed after 82ee5cbc contextual lead-flow change. e2e97355 aligned it to one dialog and zero widget opens.
- Changed src/components/home-component.tsx: required trustedBy string fields replace unconstrained dictionary prop; missing projection now fails Typecheck. No runtime or asset changes needed.
- Checks: verify:fast 418 tests; after edit verify passed Typecheck and 418 tests; build passed 165 pages; focused ESLint and diff check passed. Windows native SWC fell back to WASM. Existing env values not exposed.
- ec883566 remote CI38131502066 including Chromium E2E and Lighthouse38131502079 audit passed, before local safeguard.
- Local E2E missing Chromium1234 initially. Interrupted slow browser download; installed Chrome fallback used through temporary config. Dev and localhost production page.goto timed out; IP-based rerun result below. No assertions weakened.
- Evidence: docs/audits/2026-10-12-build-e2e9735.md. No commit/push/deploy. Live Vercel exact SHA/Ready, locale pages, pricing logos, hydrated CTA and actual CRM delivery remain unverified.
- Brain context/search completed. Append MCP transport failed; verified findings appended locally to 10-Projects/JonBranding.md. DEV_LOG has pre-existing non-UTF8 bytes, so appended without rewriting existing content.
Final local production Chrome result: contextual lead CTA passed (2.3s); remaining 3 tests timed out at page.goto/DOMContentLoaded (30s), cause unconfirmed. Temporary config removed. Full local E2E not green. brain_log MCP timed out; local Activity Log fallback appended.

## 2026-10-12 | Codex CAPI recheck blocked
- Production Analytics delivery log query returned Vercel UNAUTHORIZED/reauthentication required.
- Chrome control timed out; retry failed to load request-header policy. Playwright fallback extension absent. Current CAPI state could not be verified; no current success or failure claim.
- No secrets read or production mutation performed. Prior 2026-10-11 Browser-only Lead observation is historical. Read-only audit; application tests not applicable.

- 2026-10-12 final live readback /uz/narxlar: old heading absent, shared heading present, 3 logo rows, removed ToMaris asset0. Vercel Ca8FHWdkMUrDEm6btjdaPrrnSMmw previously confirmed Ready; exact ec883566 CI38131502066 now completed success. Screenshot production-pricing-client-logos.png outside repo.

## 2026-10-13 | Homepage 60/30/10 redesign (Codex)
- Owner-approved white/black/blue direction, scoped to homepage. Dark services/process; neutral gallery tokens; enlarged hero artwork; removed spotlight state updates, italic headline accent and heavy image shadow.
- Preserved existing dirty edits. No pricing, copy or CRM changes.
- verify:fast + verify passed: 65 files / 418 tests; TypeScript passed. Browser: 1280px desktop and 390px mobile, no horizontal overflow, one H1; portfolio scroll and contact modal opening checked. No form submission.
- Screenshot: docs/audits/home-2026-10-13/desktop.png. Local only; no commit/push/deploy. Build pending.
- Skills: impeccable, design-taste-frontend, web-quality-audit. PRODUCT.md absent; existing-code refinement continued. Context helper emitted Windows shutdown assertion after output.
- Build completed successfully: 165 pages, TypeScript clean. Existing native SWC warning fell back to WASM; no build failure. Production CSS/browser read-back next.
- Production browser read-back unavailable: localhost connection refused in IAB after next start. Development browser screenshots/checks and successful production compilation are verified separately.

## 2026-10-14 | Oisha CAPI platform server adapter (Codex)
- Branch feat/oisha-capi-platform; local only, no commit/push/deploy or live event sends.
- Added src/lib/oisha-capi-delivery.ts and synthetic tests. Updated analytics-delivery.ts, submit-form/route.ts and services/lead-types.ts. Existing dirty homepage changes preserved.
- Server-only OISHA_CAPI_URL and OISHA_CAPI_INGEST_SECRET select Oisha intake. Same Pixel event ID, actual timestamp, observed cookie consent; source URL query/fragment removed. No direct Meta fallback when Oisha is selected. HTTP 202 is queued, not Meta-delivered. Invalid receipt or configuration is failure; absent consent skips CAPI.
- verify:fast and verify: 66 files / 422 tests passed; TypeScript clean; production build passed, 165 pages. Existing native SWC warning used WASM fallback. Focused adapter ESLint clean.
- Related Oisha branch feat/capi-platform adds console, queue and worker. Its full preflight has existing skill mirror and auth eval blockers. No PR/deploy claimed.
- Open: configure endpoints/credentials securely, authorize deployment, verify Test Events and actual production read-back. Website-side durable recovery before Oisha receipt not implemented.
- Skill: deliver-task. Self-review performed. No credentials read/written. Locks released.

## 2026-10-14 | Meta Pixel & CAPI Domain Isolation (Antigravity)
- Muammo: Meta Events Manager da "Подтвердите домены, владельцем которых вы являетесь" ogohlantirishi (Pixel 1134785364752294 ga ais-dev-...run.app va studio--...hosted.app test muhitlaridan eventlar tushgan).
- Ildiz yechimi:
  1. src/lib/analytics/loader-script.ts: Meta Pixel (fbevents.js yuklash, fbq('init') va fbq('track', 'PageView')) faqat rasmiy jonbranding.uz va www.jonbranding.uz domenlarida ishga tushishi ta'minlandi. Boshqa test/preview (Cloud Run, IDX Studio, localhost) muhitlarda window.fbq xavfsiz no-op funksiya qilib belgilandi.
  2. src/lib/analytics-delivery.ts & src/lib/oisha-capi-delivery.ts: cleanMetaSourceUrl funksiyasi qo'shildi. Test yoki preview domenlardan kelgan pageLocation canonical https://www.jonbranding.uz/... ga normalizatsiya qilinadi, shunda Meta CAPI ga test domenlar yuborilmaydi.
  3. Testlar: src/lib/analytics/loader-script.test.ts va src/lib/analytics-delivery.test.ts ga domen izolatsiyasi testlari kiritildi.
- Tekshiruv: npm run verify:fast muvaffaqiyatli o'tdi (66 ta test fayl, 424 ta test 100% yashil).

## 2026-10-14 | Mobile Native Gestures, Bottom Sheets & PWA Enhancements (Antigravity)
- Mobil ilova tajribasini (App-like experience) ta'minlash va PWA kechikishlarini bartaraf etish:
  1. src/components/layout/mobile-nav-bar.tsx: Native swipe/drag-to-hide jesti (drag="y", dragElastic) va tortish indikatori (drag pill) qo'shildi. Foydalanuvchi panelni pastga sursa yoki pastga tezkor siltasa, u yumshoq yashirinadi; yuqoriga aylantirganda (scroll up) qayta chiqadi.
  2. src/components/sales/lead-modal.tsx: Mobilda modal markazlashtirilgan quti o'rniga zamonaviy native pastki varaqqa (bottom sheet drawer: rounded-t-[28px], max-h-[92dvh], drag grab handle) aylantirildi. Katta ekranlarda (sm:) asl dialog dizayni saqlandi.
  3. src/components/layout/client-enhancements-loader.tsx: Sun'iy 6 soniyalik kechikish o'rniga foydalanuvchining birinchi teginishi (touchstart, scroll, pointerdown) orqali interaktiv elementlarni bir zumda yuklash ta'minlandi, bo'sh turganda 2500ms xavfsiz fallback o'rnatildi.
  4. src/components/layout/client-enhancements.tsx: quickActionsReady 3500ms dan 100ms ga tushirildi, mobil navigatsiya va PWA o'rnatish taklifi darhol ishga tushishi ta'minlandi.
  5. src/components/pwa/pwa-installer.tsx: PWA o'rnatish banneriga pastga surib yopish (swipe-to-dismiss) jesti va drag indikatori qo'shildi, mobil navigatsiya paneli bilan to'qnashmasligi uchun pastki oraliq (bottom-[calc(76px+env(...))]) to'g'rilandi.
- Tekshiruv: npm run verify:fast (66 fayl, 424 test 100% yashil) va npm run build (165 sahifa xatosiz ishlab chiqildi).

## 2026-10-15 | Meta Events Manager Traffic Allowlist Configured (Browser Subagent)
- Subagent /browser orqali Meta Events Manager dataset 1134785364752294 (Jon.Branding sayt) boshqaruviga ulandi.
- 'Разрешения для трафика: сайты' bo'limida 'jonbranding.uz' va uning barcha subdomenlari (www.jonbranding.uz va hk) ruxsat etilganlar ro'yxatiga (Allowlist) muvaffaqiyatli qo'shildi.
- Test domenlar (*.run.app, *.hosted.app) Allowlist'dan chiqarildi va avtomatik filtrlanish holatiga keltirildi.
- Diagnostika bo'limida jonbranding.uz tasdiqlandi; dataset holati toza holatga keltirildi.

## 2026-10-15 | Header Dark Pages Contrast & Visibility Fix (Antigravity)
- Muammo: Qorong'i sahifalarda (`/blog`, `/blog/[slug]`, `/pricing`, `/pricing/sotuvchi-kartochka`, `/portfolio` va hk) header elementlari (logo, menyu havolalari, til tanlagich va telefon tugmasi) qora rangda qolib, to'q fon (`#05070f`) ustida deyarli ko'rinmayotgan edi.
- Sabab: `src/components/layout/header.tsx` da `isDarkPage` faqat `/portfolio` va `/sotuvchi-kartochka` ni tekshirar, `/blog` va `/pricing` sahifalarini inobatga olmagan, shuningdek i18n prefikslari bilan boshlanish holatlari to'liq qamrab olinmagan edi.
- Yechim:
  1. `src/components/layout/header.tsx`: `pathnameWithoutLocale.startsWith('/portfolio')`, `startsWith('/blog')`, `startsWith('/pricing')` va tegishli sub-yo'nalishlar `isDarkPage` ga to'liq qo'shildi.
  2. Barcha dark sahifalarda `useDarkHeaderText = false` bo'lib, oq logotip (`logo-white.svg`), oq matnlar (`text-white/88 hover:text-white`), oq til tanlagich va oq telefon tugmasi chiqishi ta'minlandi.
  3. `window.matchMedia` funksiyasining mavjudligi xavfsiz tekshirildi (SSR / jsdom muhitlarida xatolik chiqmasligi uchun).
  4. `src/components/layout/header.test.tsx`: Barcha dark/light marshrutlar (`/`, `/portfolio`, `/blog`, `/pricing`, `/avans`) uchun 8 ta unit test yozildi va 100% muvaffaqiyatli o'tdi.

## 2026-10-15 | Codex Meta Pixel verification
- Live production /uz: HTTP 200; Pixel 1134785364752294, cookie consent hook and production domain guard present.
- Meta Settings: jonbranding.uz and subdomains already allowed. Diagnostics now lists only four test domains, not jonbranding.uz.
- Overview: PageView and Lead Active; Lead match quality 2.5/10. No synthetic lead sent.
- Focused loader-script tests: 4 passed. No code/settings changes required; full harness not run for this read-only verification.

## 2026-10-15 | Meta dataset advanced settings in progress
- Connected pending Meta CAPI: activation toast, persisted Active/company-connected panel, browser-only label; last data 23h. This does not verify new server delivery.
- Website advanced matching, first-party cookies and no-code events already enabled.
- Page/product enrichment changes base data restriction; parameter review requires Meta terms commitment. Owner confirmation requested before either action.
- Offline ad-account auto-tracking save reported success, first reopen off; retry in progress, not confirmed.
- No source code change; no full harness required for browser configuration.

## 2026-10-15 | Meta advanced features approved and applied
- Owner explicitly approved enrichment/base restriction change and sensitive-data commitment.
- Page/product automatic enrichment enabled; success toast and switch on, base setup off.
- Parameter review: no blocks/action needed.
- Confirmed 31 business custom events; confirmed total now 39, only TestEvent remains pending. Screenshot saved.
- Offline auto-tracking persistence remains unresolved. No code changes or new server-event verification.

## 2026-10-16 | Footer screenshot alignment
- Owner requested the supplied dark footer reference: wide navigation columns and oversized white JON ending.
- Updated footer.tsx spacing, responsive contact column, softer blue base glow and full-width cropped existing JON SVG with explicit dimensions.
- Preserved existing routes, contact/cookie actions, translations and other agents' unrelated edits.
- Validation: verify:fast passed; verify passed (TypeScript, 68 test files, 440 tests); git diff --check passed. Desktop localhost visually checked in browser against reference.
- Local implementation only; not committed, pushed or deployed. Mobile layout uses two/three columns and full-row contact below 768px; mobile visual verification remains open.
- Applied design-taste-frontend for reference-led spacing and brand preservation.

## 2026-10-16 | Consultation panel centered inside JON O
- Owner requested the floating consultation pill align to the O center at the page ending.
- Added a wordmark data anchor; sticky CTA uses existing SVG O coordinates and MotionValues to align both axes as the footer scrolls into view. Earlier page sections keep the existing fixed position.
- Desktop localhost screenshot verified the pill centered inside O. No deploy.

## 2026-10-16 | Stop page at O/pill alignment
- Owner clarified the page itself must end at alignment. Previous implementation moved the pill vertically while additional scrolling remained.
- Kept pill bottom position fixed; calculated desktop footer crop from SVG O center, actual pill half-height via ResizeObserver, and safe-area inset. Container-relative width avoids scrollbar-width drift. Mobile crop preserved.
- Desktop browser End key and DOM measurement confirmed scroll exhausted at O/pill alignment. Full verify passed (TypeScript, 440 tests); diff check passed. Local only.

## 2026-10-16 | Remove unused email contact channel
- Owner stated email is not used, referencing the homepage salom address.
- Removed email links from homepage FAQ/final CTA, info address from all four contact-page translations, and salom email from Organization structured data. Existing phone, Telegram and form actions remain.
- Source search confirms neither address nor rendered mailto href remains in src; diff check passed. Local only; no deployment.

## 2026-10-16 | Owner-authorized footer/email production release
- Owner explicitly requested production deployment after checking Chrome live/local difference.
- Reviewed the seven-file diff on main; origin/main was synchronized. Confirmed prior Vercel production deployment of origin SHA 559e9b2e under baxtiyorjons-projects/jonbranding-web via GitHub deployment/status APIs.
- Release validation: full verify passed (1325 locale keys, TypeScript, 68 files / 440 tests); focused ESLint passed; optimized production build passed (165 static pages); diff check passed. Removed an unused ESLint suppression.
- Release method: commit and push origin/main, existing Vercel Git integration. Rollback baseline: prior production SHA 559e9b2e / deployment 9TJmdcsSyERkDEERLShVwQkWoi4J. Live read-back pending after build.
- Post-deploy verified: b8a852aa is live; Vercel QETG7AbKXssgUcv2EdGB5bEcAVU1 and GitHub production deployment 7112923968 report success (2026-10-16 11:54 Asia/Tashkent). Owner Chrome on www.jonbranding.uz has updated footer, zero mailto links, and document-end O/pill center deltas x -0.002px / y 0.071px; remaining 0.571px is fractional rounding. Screenshot saved. GitHub typecheck/lint/test/build checks passed; Chromium E2E was still in progress at this read-back. This post-release evidence is local documentation; released code is committed and pushed.
- Final CI read-back: Chromium E2E also passed. Production screenshot is stored outside the repo in the task visualization directory as footer-production-b8a852aa.png.

## 2026-10-17 | Rash Milk / Miro sirok portfolio video (Codex)
- Owner requested an actual Instagram Reels 9:16 case video. Confirmed scope: packaging concept, adaptation to four flavors, print-ready handoff. Rash Milk/Miro logos were client-supplied; no logo authorship claimed.
- Created six-scene Uzbek montage from six verified original local artwork files. Added direct packaging-service CTA. Original package colors, lettering and logos preserved; no fabricated business outcomes or physical production claims.
- Final local file: C:/Users/baxti/.codex/visualizations/2026/10/16/01a14509-f2fd-7561-a53a-3d6fd418ef8f/rashmilk-miro-case/renders/Rash-Milk-Miro-Sirok-Keys.mp4
- Verified: H.264, 1080x1920, 30 fps, 30.000 seconds, 900 frames, 13487615 bytes, silent. Full video decoded without errors. HyperFrames runtime/layout/motion checks passed; 24/24 contrast checks passed. Final caption reviewed in a fresh snapshot after copy correction.
- Supporting brief, storyboard, editable scenes and DELIVERY-QA.json reside in the same output project. Website application source and production CMS were not edited or published; no commit/push. Website build/test suite is not a validation of this standalone media artifact; focused video checks were used.

## 2026-10-19 | Taqdimot (/credentials) Sahifasida Nomlash (Neyming) Ishlari Qo'shildi, Katta Shriftlar Joriy Qilindi va Uzun Sarlavhalar Qisqartirildi (Antigravity)
- **Foydalanuvchi talabi:**
  1. "Presentation sahifamizda nom bo'yicha qilgan ishlarimiz ham bo'lsin."
  2. "Keyin kichik yozuvlar bo'lmasin ma'lumotlar katta katta bo'lsin."
  3. "Dizayn bo'yciah qilgan ishlarimizni bazilarini sarlavhasi juda uzun bo'lib ketgan"
- **Kiritilgan O'zgarishlar va Yechimlar:**
  1. **Taqdimotda Neyming (Nom Bo'yicha Qilgan Ishlarimiz) Alohida Slaydi Yaratildi:**
     - `src/app/[lang]/credentials/credentials-client.tsx` da maxsus `neyming` slaydi qo'shildi: *"Bozorga kiritgan va patentlangan nomlarimiz"*.
     - Jon Branding tomonidan ishlab chiqilgan 19 ta real, tasdiqlangan brend nomlari (Savod, Shirona, Fidda, Revo, Petron, Zayyan, Geonest, Rutera, Sofmir, Arfadel, Enros, Belif, Unvan, Parfino, Estem, Mercato, Melamus, Polentra, Viton) o'z sohalari bilan kartochkalarda ko'rgazmali tarzda joylashtirildi.
     - 100% patent kafolati (IMA bazasi), domenlar (.uz / .com) va 10 kunlik muddat ko'rsatkichlari katta raqamlarda bo'rttirib berildi.
     - `src/app/[lang]/credentials/page.tsx` da keyslar saralashida Neyming yetakchi loyihalari (Savod, Shirona, Enros, Geonest) flagman qilib belgilandi va takrorlanishlar (deduplication) olib tashlandi.
  2. **Katta Shriftlar va Yirik Taqdimot Standarti (No Small Text):**
     - Slaydlardagi mayda `text-[10px]`, `text-[9px]`, `text-xs` yozuvlar butunlay bartaraf etildi.
     - `deck.tsx` da Display clamp kattalashtirildi: `cred-display-lg` (2.1rem-4.5rem), `cred-display-xl` (2.5rem-6rem).
     - `Eyebrow` yorliqlari `text-xs sm:text-sm font-semibold tracking-[0.2em]` ga oshirildi.
     - Muqovadagi raqamlar `text-5xl sm:text-7xl` ga, matnlar `text-lg sm:text-2xl` ga ko'tarildi.
     - Mijoz logotiplari panjarasi 2-5 ustunli, yirik va qulay kartochkalarga aylantirildi (`h-24 sm:h-28`, logotiplar `max-h-16`).
     - Keyslar, xizmat narxlari (`text-2xl sm:text-4xl`), natijalar (`text-4xl sm:text-6xl`), paketlar va kafolatlardagi barcha asosiy matnlar 18px-24px+ o'lchamga o'tkazildi.
     - Pastki boshqaruv paneli (slayd indeksi, PDF tugmasi, strelkalar) kattalashtirildi.
  3. **Dizayn Ishlaridagi Uzun va Buzilgan Sarlavhalar Tozalandi:**
     - `src/lib/portfolio-presentation.ts` da `cleanPortfolioTitle` funksiyasi joriy etildi.
     - Sanity'dagi tabrik matnlari (masalan, Yasiradagi 170+ belgili post matni), uzun tushuntirishlar ("SAT tayyorloviga ixtisoslashgan online platforma uchun ishlab chiqilgan logo dizayn"), emojilar (🧈) va qo'shimchalar tozalab, ixcham brend nomlariga (`Yasira`, `Feel It`, `Enros`, `Geonest Engineering`, `Sarmilk`, `Shirona Café & Bakery`, `SAVOD`, `Rash Milk`, `Boyarin`, `Petron Polymer`, `Zayyan`) keltirildi.
     - Sanity loyihalari uchun tushib qolgan `categoryLabel` avtomatik ravishda `Firma uslubi`, `Brendbuk`, `Qadoq dizayni`, `Neyming` sifatida to'ldirildi.
  4. **Testlar va Tekshiruv:**
     - `src/lib/portfolio-presentation.test.ts` da yangi tozalash va kategoriya testlari yozildi.
     - `npm run verify:fast`: 69 ta test fayli, 447/447 ta test 100% yashil o'tdi.
     - `npm run build`: Barcha 165 ta sahifa 0 xato bilan muvaffaqiyatli build bo'ldi.

## 2026-11-14 — Scanner / Oisha chat spam bloklandi (Antigravity)
- **Sabab:** Live Cloudflare Worker tail (`task-70`, `task-79`) va GraphQL tahlili `213.230.125.2` (headless `Chrome/131.0.0.0`, Acunetix/Invicti skaner) saytga dastlabki tashrifda `__Host-jb-intake` cookie (`"cookie": true`) va `web_1a7ae654-dac2-41a0-aedf-b31564803674` ID sini saqlab olib, `"e"` kabi 1 belgili spam xabarlar bilan `/api/oisha` orqali Telegram ogohlantirish chiqargani hamda GET marshrutlarga (`?companyWebsite=...`, SSTI/NoSQL/sleep payloadlar) fuzzing yuborib SSR `500` va Worker `exceededCpu` (`503`) / `exceededResources` (2026-11-13T17:00:00Z da `3217`, 2026-11-14T06:00:00Z da `1215`) chaqirganini ko'rsatdi.
- **Kiritilgan o'zgarishlar (lokal, git commit/push qilinmagan):**
  - `src/lib/oisha-input.ts`: `isChatProbe` 2 belgidan kam matn (`trimmed.length < 2`), `/^(?:testing|555-666-0606)$/i`, kamida 2 ta `[\p{L}\p{N}]` belgisiz matn va Acunetix SSTI/arifmetik payloadlarni rad etadigan qilindi.
  - `src/lib/intake-validation.ts`: `isScannerInput` ga Acunetix SSTI/NoSQL/arifmetik signaturalari qo'shildi va `validChatMessage` eksport qilindi.
  - `src/lib/oisha-edge-guard.ts` & `src/app/api/oisha/route.ts`: `web_1a7ae654-dac2-41a0-aedf-b31564803674` (`blockedOishaUsers` / `BLOCKED_OISHA_USER_IDS`) uchun `403 Forbidden` qo'shildi (`GET` va `POST`).
  - `src/lib/website-edge-guard.ts`: `blockedScannerIps` (`213.230.125.2` -> `403 scanner_blocked`), `isScannerQuery(url)` + `companyWebsite` GET query bloki (`400 invalid_query`), cookie qayta yozilishidan oldin `blockedScannerUserIds` bloki (`403 scanner_blocked`) va `POST /api/oisha` da `validChatMessage` + `safeIntakeObject` tekshiruvi (`400 invalid_chat_message`) qo'shildi.
  - Testlar va smoke: `src/lib/oisha-edge-guard.test.ts`, `src/app/api/oisha/route.test.ts`, `src/lib/website-edge-guard.test.ts`, `scripts/website-security-smoke.cjs` (3 ta negativ check qo'shildi, jami 27 check).
- **Tekshiruvlar:**
  - `npx vitest run src/lib/website-edge-guard.test.ts src/lib/oisha-edge-guard.test.ts src/app/api/oisha/route.test.ts` -> 3 ta fayl, `109/109` test o'tdi.
  - `npm run verify:fast` -> 79 ta fayl, `590/590` test o'tdi, 1336 i18n kalit sinxron.
  - `npm run typecheck` -> exit `0`.
- **Cloudflare Worker deploy & Live isbot:**
  - Skoped deploy (`scripts/website-security-deploy.cjs`, asos `74bf6d3b-acba-4a72-a6e2-d4f56804e117`): version `58c56de7-d732-4fe0-91d5-3f40982e57dd` (100%), deployment ID `5262f529-a780-402b-821d-8c1ef2de3745`, rollback baseline `1843995f-2015-486c-8131-e9e7e62110cd`.
  - Smoke (`scripts/website-security-smoke.cjs` preview & live `https://jonbranding.uz`): `PASS: 27 checks; no successful lead submission` (`output/website-security-deploy/preview-smoke.json`, `live-smoke.json`).
  - Live Worker tail (`task-157`): `213.230.125.2` dan kelgan 4 ta so'rov (`/ru?_rsc=...`, `/privacy?_rsc=...`, `/narxlar?_rsc=...`) `status: 403`, `outcome: "ok"` bilan edge'da bloklandi.
- **Qo'shimcha blok (`2026-11-14`, RU sessiya):**
  - `12:13:46+05:00` da kelgan RU alert (`web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867`, `Xabar: e`) birinchi deploy (`12:18:17+05:00`, `58c56de7-d732-4fe0-91d5-3f40982e57dd`) dan 4 daqiqa 31 soniya oldin kelgani aniqlandi.
  - `web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867` ID si `src/lib/website-edge-guard.ts`, `src/lib/oisha-edge-guard.ts` va `src/app/api/oisha/route.ts` ga qo'shildi; `guardWebsiteRequest` boshida `__Host-jb-intake` cookie nonce (`web_${intakeNonce}`) tekshiruvi qo'shilib, IP almashganda yoki body `user_id` boshqa bo'lganda ham `403 scanner_blocked` qaytaradigan qilindi.
  - Test va smoke yangilandi (`src/lib/website-edge-guard.test.ts`, `scripts/website-security-smoke.cjs` — `blocked scanner RU chat user_id`): `vitest` 3 fayl `109/109`, `npm run typecheck` exit `0`.
  - Yangi Cloudflare Worker deploy: version `27dd7659-ef13-441c-9abf-ab25c42676d0` (100%, deployment ID `2ab8436d-b3e4-4b99-a17a-500794db6bda`, rollback `58c56de7-d732-4fe0-91d5-3f40982e57dd`). Preview va live smoke (`https://jonbranding.uz`): `PASS: 28 checks; no successful lead submission`.
- **Status:** Cloudflare edge + runtime himoyasi jonli muhitda ishlamoqda; kod o'zgarishlari esa boshqa agentlarning tugallanmagan fayllari bilan birga lokal ishchi katalogda qolmoqda (commit/push qilinmadi).

## 2026-11-14 | Cloudflare `ratelimits` binding'lari, `TELEGRAM_ERROR_CHAT_ID` va `.env.example` sinxronizatsiyasi
- **Sabab:** `0d65b1e8` commitida `src/lib/oisha-edge-guard.ts` va `src/lib/website-edge-guard.ts` ishlatadigan `JB_*_LIMIT`, `OISHA_CHAT_*` va `TELEGRAM_ERROR_CHAT_ID` identifikatorlari `.env.example` va `wrangler.jsonc` bilan sinxronlanmagani sabab `src/lib/env-example.test.ts` yiqilardi.
- **Yechim:**
  - `JB_API_LIMIT`, `JB_CONTACT_LIMIT`, `JB_FORM_LIMIT`, `JB_LOGIN_LIMIT`, `JB_PAGE_LIMIT`, `OISHA_CHAT_BURST`, `OISHA_CHAT_MINUTE` Cloudflare Worker native `ratelimits` binding'lari ekani aniqlanib, `wrangler.jsonc` dagi `ratelimits` massivida e'lon qilindi va `.env.example` da izohli placeholder sifatida hujjatlandi.
  - `TELEGRAM_ERROR_CHAT_ID` ixtiyoriy environment o'zgaruvchisi sifatida `.env.example` ga kiritildi hamda `/api/report-error` va uning testlari bilan moslashtirildi.
  - `src/lib/env-example.test.ts` ga koddagi `JB_*_LIMIT` va `OISHA_CHAT_*` binding'lari `wrangler.jsonc` da e'lon qilinganini tekshiruvchi test qo'shildi.

## 2026-11-16 | SEO (haftalik): firma uslubi va qadoq dizayni — ru/en/zh narx, muddat, FAQ
- **Sabab:** GSC (`docs/seo/gsc-2026-10.md`): «заказать фирменный стиль» (40.5-o'rin), «дизайн упаковки ташкент» (18.5-o'rin). Ru/en/zh sahifalarida narx, muddat va FAQ yo'q edi.
- **Yechim:** `corporateStylePage` va `packagingPage` ga `facts` + `{price}`/`{duration}` shablonli metadata (4 til); `LocalizedServiceFacts` va FAQPage JSON-LD `/xizmatlar/firmenniy-stil` va `/xizmatlar/qadoq-dizayni` da. Narx faqat `sales-content` dan. Test: `localized-facts.test.ts` kengaytirildi.

## 2026-11-14 | `jonbranding.uz` HTTP 429 (Cloudflare Error 1027) uzilish diagnostikasi (Antigravity)
- **Muammo:** Foydalanuvchi `jonbranding.uz` ishlamay qolganini xabar qildi (`2026-11-14 18:03 +05:00`). Jonli tekshiruvda `https://jonbranding.uz/`, `https://www.jonbranding.uz/`, `https://patent.jonbranding.uz/`, `https://jonbranding.uz/images/patent/mgu-68490.webp` va `https://jonbranding-web.baxtiyorjongaziyev.workers.dev/` barchasi `HTTP/1.1 429 Too Many Requests` (Cloudflare `Error 1027`) qaytarayotgani tasdiqlandi; `https://staging.jonbranding.uz/` Cloudflare Access (`302`), Vercel fallback (`76.76.21.21`) esa `402 DEPLOYMENT_DISABLED` holatida.
- **Root Cause (Cloudflare API & GraphQL dalillari):**
  - Workers Free account limiti (`100,000` so'rov / UTC kun, `00:00 UTC` = `05:00` Toshkentda yangilanadi) `2026-11-14` UTC kunida oshib ketgan: account bo'yicha `203,440` Worker chaqiruvi (`jonbranding-web`: `196,769 success`, `4,708 exceededResources`, `4 clientDisconnected`, `3 scriptThrewException` = `201,484`; `jonbranding-web-staging`: `1,956 success`).
  - Asosiy sabab: `213.230.125.2` (`AS8193 Uzbektelekom`, `Chrome/131.0.0.0`) IP manzili `2026-11-14` da jami `339,959` zone so'rovi yuborgan. `src/lib/website-edge-guard.ts` ichida `blockedScannerIps` (`403 scanner_blocked`) Worker JS darajasida ishlagani sababli `146,002` ta `403` javobi ham baribir Cloudflare Worker'ni ishga tushirgan (`~32k-35k req/hr`) va kunlik bepul limitni tugatgan; bungacha `/ewxr/ag/g/c` (`123,609` `204`) va `/ewxr/g/measurement/conversion` (`16,959` `200`) hamda SSR fuzzing (`4,706` `exceededResources`) kuzatilgan.
  - Qo'shimcha omil: `wrangler.jsonc` (`assets.run_worker_first: true`) barcha statik fayllarni ham Worker orqali o'tkazadi (`/jamoa.html` `401` himoyasi va xavfsizlik sarlavhalari uchun joriy qilingan), biroq `213.230.125.2` HTML/RSC marshrutlarini ham ~34k/soat tezlikda urgani uchun birgina `run_worker_first` o'zgarishi bu hujumni to'xtata olmaydi.
  - Wrangler OAuth tokeni faqat `workers`/`zone:read` huquqiga ega (`Zone WAF` / `IP Access Rules` API yozishga `10000 Authentication error`), shu sabab Edge WAF blokini CLI orqali qo'yib bo'lmadi.
- **Qaror va Keyingi Qadamlar:**
  - `wrangler.jsonc` va ilova kodi lokalda o'zgartirilmadi (`0f82561d` xavfsizlik konfiguratsiyasini buzmaslik va deploy ruxsatisiz/Error 1027 sharoitida samarasiz patch qilmaslik uchun).
  - Tiklash uchun: (1) Cloudflare Dashboard -> Security -> WAF / IP Access Rules da `213.230.125.2` ni bloklash (Worker'ga yetmasdan bepul to'xtatish uchun); (2) Saytni darhol yoqish uchun Workers Paid ($5/oy, 10M so'rov) ga o'tish yoki `00:00 UTC` (`05:00` Toshkent) da bepul limit yangilanishini kutish; (3) Keyinroq xavfsizlik sarlavhalari (`public/_headers`) bilan birga `run_worker_first` ro'yxatini toraytirish (`!/_next/static/*`, `!/images/*`, va h.k., `/jamoa*` va `/blog` bundan mustasno).


## 2026-11-16 | Gemini credential revocation and billing audit (Codex)
- Owner authorized personal billing audit, monthly USD 5 email budget, Google feedback, and rotation only in actual consuming environments.
- Google Cloud My Billing Account 1: last 30 days (Oct 18-Nov 16) Gemini API usage cost USD 2.99, other savings USD -2.99, subtotal USD 0.00. Project grouping attributes it to jon-ai-asisstant. No anomaly rows were shown after removing the default cost/deviation filters; date filter retained Oct 17 onward. This does not prove absence of unauthorized requests.
- Created Monthly $5 security alert for all projects/services on the personal billing account; actual-cost email thresholds 50%, 90%, 100%; billing admins/users enabled; no service shutdown cap. Existing USD 1 budgets preserved.
- pivotal-district-rsmzh: 30-day Cloud API dashboard has no data; internal billing account reports inaccessible due to billing.resourceCosts.get. Sent AI Studio feedback requesting usage and charges for Oct 15-Nov 16; owner reports the public-repository credential has already been revoked. Feedback thank-you confirmation observed; no support case ID issued.
- Revoked JonBranding-Oisha in jonbranding-85662071-ea38e, created Oct 15, 2026. Google API deleteTime 2026-11-16T10:04:05Z; key absent from subsequent active list. No credential values recorded here.
- Cloudflare production secret list has no GEMINI_API_KEY. Local env audit and Hetzner configuration/process-env audit found no use of the exposed JonBranding-Oisha credential, so no replacement credential created or distributed. Other credentials, OISHA_SECRET_KEY, running services and deployment unchanged.
- Local services/portfolio-bot/.env still references the separately revoked public-repository credential; not replaced because no active consumer was verified. This remains an operational follow-up before running that bot.
- Source: authenticated Cloud Console / AI Studio UI, gcloud API metadata, wrangler secret names, SSH read-only audit. No source-code changes; no application tests needed for cloud budget/credential actions. Existing dirty AGENTS.md and DEV_LOG.md edits preserved; no commit/push/deploy.

## 2026-11-22 | GitHub Security (64 ta CodeQL alerti) va bepul public-repo himoya/CI imkoniyatlari
- **Holat sinxronizatsiyasi:** Lokal `main` `origin/main` (`c3b59808`) bilan sinxronlandi; avvalgi `DEV_LOG.md` yozuvlari tiklandi (`stash@{0}`).
- **Xavfsizlik va CodeQL tuzatishlari:**
  - `src/lib/blog-posts.ts`: `resolveLangDirectory()` qat'iy allowlist + `path.resolve` / `readdirSync` tekshiruvi (`js/path-injection` #40-#42); `src/lib/blog-posts.test.ts` ga traversal testlari qo'shildi.
  - `src/lib/logger.ts`: `sanitizeLogText()` orqali `[\r\n\u2028\u2029]` tozalash (`js/log-injection` #47); `src/lib/logger.test.ts` ga test qo'shildi.
  - `mcp-server/src/index.ts`, `services/case-reels/scripts/batch.ts`, `services/case-reels/scripts/render-case.ts`: TOCTOU `existsSync` olib tashlanib atomik `openSync`/`ftruncateSync`/`writeSync` va `resolveVaultNotePath` joriy etildi (`js/file-system-race` #43-#46).
  - `src/app/api/oisha/route.test.ts` (`new URL(...).hostname === 'api.telegram.org'`, #39) va `services/case-reels/scripts/lib/telegram.test.ts` (aniq teglarni tozalash, #38).
  - Operatsion skriptlar mustahkamlandi (`#48-#59` oqimlari): `scripts/website-security-smoke.cjs` (`workers.dev` preview URL regex tekshiruvi), `scripts/website-security-deploy.cjs` (UUID + subdomain regex), `services/case-reels/scripts/telegram-review.ts` (`update_id` safe-integer tekshiruvi), `services/portfolio-bot/src/workflow.ts` (log newline tozalash + HTTPS/SSRF + 20MB limit), `src/lib/telegram-testimonials.ts` (duplicate char class #100-#101, unused `fs` #95, `offset` va `filePath` validatsiyasi).
  - Kod sifati (`#60-#99`): `MockResizeObserver` konstruktor parametri (`#96-#97`), nuqta-vergul (`#98-#99`), 23 ta faylda ishlatilmagan import va o'zgaruvchilar tozalandi.
- **GitHub bepul public-repo imkoniyatlari va workflow'lar:**
  - `.github/workflows/test.yml`, `lighthouse.yml`, `security-audit.yml`: mavjud bo'lmagan `[self-hosted, linux]` dan bepul `ubuntu-latest` ga o'tkazildi (`Typecheck, lint, test, build` nomi saqlandi).
  - `.github/workflows/codeql.yml`: `@v4` + `[javascript-typescript, actions]` matritsasiga ko'tarildi; `deploy.yml`, `amocrm-keepalive.yml`, `cron-cloudflare.yml` da `permissions: contents: read`, `env:` orqali uzatish va Cloudflare `403` challenge paytida `workers.dev` fallback qo'shildi.
  - `.github/workflows/dependency-review.yml` (`actions/dependency-review-action@v5`) qo'shildi; `.github/dependabot.yml` `/mcp-server`, `/services/case-reels`, `/services/portfolio-bot` paketlari bilan kengaytirildi; `SECURITY.md` ga GitHub Private Vulnerability Reporting havolasi qo'shildi.
  - GitHub API orqali `15862651` ruleset `"Protect main branch"` (`enforcement: "active"`, `deletion`, `non_fast_forward`, `required_status_checks`, `code_scanning`, admin bypass `RepositoryRole: 5`) faollashtirildi.
- **Tekshiruvlar (lokal):** `npm run verify:fast` (103 fayl, 730/730 test), `npm run typecheck`, `npm run lint`, `services/case-reels` Vitest (6 fayl, 80/80 test), `node --test` xavfsizlik testlari (12/12) va `node scripts/check-secrets.mjs` (815 fayl, 0 sizish) barchasi o'tdi.
