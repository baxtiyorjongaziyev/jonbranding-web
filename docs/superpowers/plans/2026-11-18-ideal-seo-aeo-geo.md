# Ideal SEO, AEO & GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `jonbranding.uz` technical SEO, Google AEO (Answer Engine Optimization), and AI GEO (Generative Engine Optimization) to maximum verifiable standard across all 4 locales (`uz`, `ru`, `en`, `zh`) while closing remaining `500`/`404` edge issues and keeping all uncommitted `2026-11-18` Cloudflare KV/ISR work intact.

**Architecture:** Extend `src/lib/seo.ts` and `ServiceJsonLd` to serve one connected Schema.org entity graph with verified `sales-content` prices (`Offer`), `CollectionPage`/`ItemList`, `HowTo`, and 1:1 visible-DOM `FAQPage` schemas; unify multilingual commercial metadata/AEO blocks (`neyming`, `patent`, `xizmatlar`, `car-wrap`, `posm`, `brand-strategy`, `narxlar`, `haqimizda`, `otzivlar`, home `/`); and harden `navigator` SSR routes, blog image integrity, and `public/llms.txt`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Vitest, Cloudflare Workers (`@opennextjs/cloudflare`)

**Spec:** `docs/superpowers/specs/2026-11-18-ideal-seo-aeo-geo-design.md`

## Global Constraints
- **Zero Fabrication (`docs/FAKTLAR.md`, `src/lib/sales-content/`):** Only use verified numbers (`2018-11-27`, `600+` clients, `1200+` projects, real `sales-content` prices/durations, real `PATENT_CERTIFICATES`). Never add fake `AggregateRating` or unverified stats.
- **No Hidden Schema:** Every JSON-LD `FAQPage` / `HowTo` / `ItemList` item must match visible rendered HTML elements on that exact route & locale.
- **Uzbek-First & Locale Parity (`src/locales/*.json`):** All 4 locales (`uz`, `ru`, `en`, `zh`) must stay synchronized (`100%` key parity checked by `npm run verify:fast`); all prices/durations in SEO metadata/FAQs come via tokens (`fillServiceTokens` / `patentFaqs` / `fillFacts`), never hardcoded pricing strings in locale JSON.
- **60-30-10 Design System:** Any new UI section uses `#FFFFFF` canvas, `#0A0B0E` / `#4B5563` / `#E5E7EB` structure, `#2554FF` accent (`hover: #1D4ED8`), normal weight `Instrument Serif` (`400`), no `transition: all`.
- **Cloudflare Free Protection & Existing Workspace Edits:** Preserve all `2026-11-18` uncommitted Cloudflare KV/DO/loader files in the workspace. Avoid introducing unnecessary dynamic SSR (`cookies()`/`searchParams`) on public/cacheable pages.
- **Documentation Integrity:** Update `docs/DEV_LOG.md` before finishing.

## Review Focus
- `ServiceJsonLd` or `FAQPage` emitting hidden questions not rendered on the page (mismatch between JSON-LD `faqs` prop and client component DOM).
- Locale key drift breaking `npm run verify:fast` or raw hardcoded price numbers (`\d 000 000`) inside `uz/ru/en/zh.json` metadata/facts templates (`localized-facts.test.ts`).
- `getLocalizedAbsoluteUrl` / `getLocalizedPath` generating `/uz/...` prefixed URLs instead of canonical `/` root paths for Uzbek.
- `generateMetadata` in nested `page.tsx` shadowing parent `layout.tsx` `alternates` (`canonical` / `hreflang`) or `openGraph`.
- Cloudflare `blog-feed.test.ts` disk parity failing if `src/posts/uz/den-aroma-case-study.md` is edited without regenerating `src/lib/blog-markdown-index.json`.

---

### Task 1: Core Entity Graph, `ServiceJsonLd` Offer Support & `llms.txt`

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/components/structured-data/service-json-ld.tsx`
- Modify: `public/llms.txt`
- Test: `src/lib/seo.test.ts`, `src/lib/seo-assets.test.ts`

**Interfaces:**
- Produces: enriched `getSiteEntityGraph(locale)` with `foundingDate: '2018-11-27'` and expanded `hasOfferCatalog`; `ServiceJsonLd` optional `priceValue?: number`, `priceCurrency?: string`, `howToSteps?: { title: string; desc: string }[]`.

- [ ] **Step 1: Add failing assertions to `src/lib/seo.test.ts` and `src/lib/seo-assets.test.ts`**
  Assert:
  - `getSiteEntityGraph('uz')` organization node has `foundingDate: '2018-11-27'` and `hasOfferCatalog.itemListElement` includes `naming`, `brand-strategy`, and `patent` service URLs alongside logo/brandbook/packaging.
  - `public/llms.txt` contains `https://www.jonbranding.uz/xizmatlar/patent`, `https://www.jonbranding.uz/expert-tekshiruv`, `@baxtiyorjongaziyev`, and real starting prices (`8 000 000`, `10 000 000`, `20 000 000`).

- [ ] **Step 2: Run tests to verify failure**
  Run: `npx vitest run src/lib/seo.test.ts src/lib/seo-assets.test.ts`
  Expected: FAIL on missing catalog items, `foundingDate`, and `llms.txt` entries.

- [ ] **Step 3: Implement `src/lib/seo.ts`, `src/components/structured-data/service-json-ld.tsx`, and `public/llms.txt`**
  - Update `getSiteEntityGraph(locale)` in `src/lib/seo.ts` with `foundingDate: '2018-11-27'` and all 9 services in `hasOfferCatalog` (localized via map for `uz`, `ru`, `en`, `zh`).
  - Update `ServiceJsonLd` in `src/components/structured-data/service-json-ld.tsx`: accept optional `priceValue?: number`, `priceCurrency?: string` (`'UZS'`), and `howToSteps?: { title: string; desc?: string }[]`; attach `offers` to `Service` when `priceValue` is provided and emit `HowTo` node when `howToSteps?.length` is provided. Use localized `'Bosh sahifa'/'Xizmatlar'` fallback cleanly.
  - Update `public/llms.txt` with verified facts, patent & expert-check URLs, package/service price summaries from `sales-content/uz.ts`, and direct consultation `@baxtiyorjongaziyev`.

- [ ] **Step 4: Run tests to verify pass**
  Run: `npx vitest run src/lib/seo.test.ts src/lib/seo-assets.test.ts`
  Expected: PASS (`2` files).

---

### Task 2: Fix Homepage Hidden `FAQPage` Schema, `otzivlar` Double Title, Blog `404` Image, Draft Filter & Navigator `500`/`503`

**Files:**
- Modify: `src/app/[lang]/page.tsx`
- Modify: `src/components/home-component.tsx`
- Create: `src/components/sections/at-answer-hub.tsx` (or render visible AnswerHub cleanly inside `HomeComponent` matching 60-30-10 & typography rules)
- Modify: `src/app/[lang]/otzivlar/page.tsx`
- Modify: `src/posts/uz/den-aroma-case-study.md`
- Modify: `src/lib/blog-markdown-index.json`
- Modify: `src/app/[lang]/blog/page.tsx`
- Modify: `src/app/[lang]/navigator/natija/page.tsx`
- Modify: `src/app/[lang]/navigator/muammo/[slug]/page.tsx`
- Test: `src/lib/seo-pages.test.ts` (new Vitest file checking schema/DOM/title invariants)

- [ ] **Step 1: Write failing tests in `src/lib/seo-pages.test.ts` & `src/lib/blog-feed.test.ts`**
  Assert:
  - `src/lib/blog-markdown-index.json` has zero `photo-1541643600914-78b084683702` URLs (replaced with `/images/cms/denaroma-hozir.webp`) and still matches `src/posts/` disk parity.
  - Homepage `HomeComponent` / `AtAnswerHub` displays `answerHub` questions AND homepage `FAQPage` JSON-LD includes the visible FAQ questions (`salesFlow.faq.faqs` + `answerHub.items`).
  - `otzivlar/page.tsx` title metadata never produces doubled `Jon.Branding | Jon.Branding`.

- [ ] **Step 2: Run tests to verify failure**
  Run: `npx vitest run src/lib/seo-pages.test.ts src/lib/blog-feed.test.ts`
  Expected: FAIL on broken Unsplash URL and homepage / `otzivlar` assertions.

- [ ] **Step 3: Implement fixes cleanly**
  - Create `src/components/sections/at-answer-hub.tsx` (editorial 60-30-10 card grid rendering `dictionary.answerHub` + compact GEO comparison summary table for `Logotip` vs `Firma uslubi` vs `Brendbuk` using `sales-content` facts & links via `getLocalizedPath`) and render it inside `src/components/home-component.tsx`. Update `src/app/[lang]/page.tsx` `faqJsonLd` so `mainEntity` includes BOTH `dictionary.answerHub.items` AND `salesFlow.faq.faqs` (every single item 100% visible in the homepage DOM!).
  - Fix `src/app/[lang]/otzivlar/page.tsx` with `pageTitle(...)` and add `CollectionPage` + `BreadcrumbList` JSON-LD.
  - Replace broken Unsplash cover in `src/posts/uz/den-aroma-case-study.md` with `/images/cms/denaroma-hozir.webp` and update matching entry in `src/lib/blog-markdown-index.json`.
  - Add `!(_id in path("drafts.**"))` to `postsQuery` in `src/app/[lang]/blog/page.tsx`.
  - Remove unused `searchParams` await in `src/app/[lang]/navigator/natija/page.tsx` (making it static prerenderable) and add `generateStaticParams` (`[{ lang, slug: 'savdo-bor-pul-yoq' }]`) + `export const revalidate = 3600;` to `src/app/[lang]/navigator/muammo/[slug]/page.tsx`.

- [ ] **Step 4: Run tests to verify pass**
  Run: `npx vitest run src/lib/seo-pages.test.ts src/lib/blog-feed.test.ts`
  Expected: PASS.

---

### Task 3: Multilingual GSC-Priority Service Pages (`neyming`, `patent`, `xizmatlar`, `car-wrap-design`, `posm-materiallar`, `brand-strategy`)

**Files:**
- Modify: `src/locales/uz.json`, `src/locales/ru.json`, `src/locales/en.json`, `src/locales/zh.json` (add `namingPage.metadata` tokens, `namingPage.facts`; add `patentPage` metadata + `facts` in 4 locales)
- Modify: `src/app/[lang]/xizmatlar/neyming/layout.tsx`, `src/app/[lang]/xizmatlar/neyming/page.tsx`, `src/app/[lang]/xizmatlar/neyming/naming-client.tsx`
- Modify: `src/app/[lang]/xizmatlar/patent/page.tsx`, `src/components/service-landing/localized-service-facts.tsx` (extend `ServiceId` / allow `trademark-standard` + `patentFaq` token helpers if needed, keeping existing `#400/#406` services identical)
- Modify: `src/app/[lang]/xizmatlar/page.tsx`, `src/app/[lang]/xizmatlar/xizmatlar-interactive.tsx`
- Modify: `src/app/[lang]/xizmatlar/car-wrap-design/page.tsx`
- Modify: `src/app/[lang]/xizmatlar/posm-materiallar/page.tsx`
- Modify: `src/app/[lang]/brand-strategy/page.tsx`
- Modify: `src/lib/service-pages/localized-facts.test.ts`

- [ ] **Step 1: Add failing test cases in `src/lib/service-pages/localized-facts.test.ts` & `src/lib/seo-pages.test.ts`**
  Assert:
  - All 4 locales fill tokens cleanly for `namingPage` (`naming`) and `patentPage` (`trademark-standard`) without raw hardcoded `\d 000 000` numbers inside templates.
  - `neyming` renders `ServiceJsonLd` + `HowTo` + `LocalizedServiceFacts` for `ru`/`en`/`zh` and fixes `/uz/...` link.
  - `patent/page.tsx` uses localized `title`/`description` and `ServiceJsonLd` for `ru`/`en`/`zh`.
  - `car-wrap-design/page.tsx` and `posm-materiallar/page.tsx` emit `ServiceJsonLd` with visible `faqs`, and `car-wrap-design` includes `hreflang` alternates (`uz`, `ru`, `en`, `zh`, `x-default`).
  - `brand-strategy/page.tsx` links `provider: { '@id': ORGANIZATION_ID }` and emits `FAQPage` matching `brand-strategy/data.ts` `FAQS`.

- [ ] **Step 2: Run tests to verify failure**
  Run: `npx vitest run src/lib/service-pages/localized-facts.test.ts src/lib/seo-pages.test.ts`
  Expected: FAIL on missing `namingPage.facts`, missing `patentPage` locale keys, and missing JSON-LD/alternates checks.

- [ ] **Step 3: Implement translations (Uzbek-first -> `ru`, `en`, `zh`) and route upgrades**
  - Update `src/locales/uz.json` first, then `ru.json`, `en.json`, `zh.json` with `namingPage.metadata` (with `{price}`/`{duration}` + high-CTR GSC keywords `"brend nom tanlash"`, `"choosing a brand name"`, `"нейминг этапы"`), `namingPage.facts`, `patentPage` (`metadata`, `facts`, localized summary/comparison copy for `ru`/`en`/`zh`, `"сколько стоит патент"`, `"tovar belgisi ro'yxatdan o'tkazish narxi"`).
  - Update `neyming/layout.tsx` (use `getPageAlternates`), `neyming/page.tsx` (all 4 locales get `ServiceJsonLd` + `HowTo` + `priceValue`; `ru`/`en`/`zh` get `<LocalizedServiceFacts />` + complete metadata via `generateMetadata`), `neyming/naming-client.tsx` (`getLocalizedPath`).
  - Update `xizmatlar/patent/page.tsx`: localized `generateMetadata`, localized hero/comparison/facts view (`LocalizedServiceFacts` + standard vs express table) for `ru`/`en`/`zh` while preserving rich `ServiceLanding` + `CertificateCard` gallery for `uz`; wire `ServiceJsonLd` (`priceValue`, `faqs`, `faqLang`).
  - Update `xizmatlar/page.tsx` + `xizmatlar-interactive.tsx`: commercial CTR metadata targeting `"брендинг ташкент"` / `"brending agentligi Toshkent"`, `CollectionPage` + `OfferCatalog` + `FAQPage` JSON-LD matching a clean Answer-First service-selector & Q&A section in `xizmatlar-interactive.tsx`.
  - Update `car-wrap-design/page.tsx`, `posm-materiallar/page.tsx`, and `brand-strategy/page.tsx` with complete `alternates` (`getPageAlternates`), `ServiceJsonLd` (`faqs`), and `ORGANIZATION_ID` links.

- [ ] **Step 4: Run tests and i18n parity check**
  Run: `npx vitest run src/lib/service-pages/localized-facts.test.ts src/lib/seo-pages.test.ts && npm run verify:fast`
  Expected: PASS with 100% locale key parity.

---

### Task 4: Conversion & Proof Schemas (`/narxlar`, `/portfolio`, `/haqimizda`)

**Files:**
- Modify: `src/app/[lang]/narxlar/page.tsx`
- Modify: `src/app/[lang]/portfolio/page.tsx`
- Modify: `src/app/[lang]/haqimizda/page.tsx`
- Modify: `src/app/[lang]/haqimizda/haqimizda-client.tsx`
- Test: `src/lib/seo-pages.test.ts`

- [ ] **Step 1: Add failing assertions in `src/lib/seo-pages.test.ts`**
  Assert:
  - `narxlar/page.tsx` generates `OfferCatalog` (linking `PACKAGES` & `getSalesContent(safeLang).faqs`) and localized `BreadcrumbList` + `FAQPage`.
  - `portfolio/page.tsx` generates `CollectionPage` + `ItemList` + `BreadcrumbList`.
  - `haqimizda/page.tsx` generates `AboutPage` + `BreadcrumbList` + `FAQPage` matching visible company Q&A rendered in `haqimizda-client.tsx`.

- [ ] **Step 2: Run test to verify failure**
  Run: `npx vitest run src/lib/seo-pages.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implement schemas & visible AEO block**
  - Update `src/app/[lang]/narxlar/page.tsx`: use `getSalesContent(safeLang)` to emit `OfferCatalog` (Standart, Premium, VIP + core services with verified `UZS` prices) and `FAQPage` (`content.faqs` already rendered visibly in `NarxlarClient`), plus localized `BreadcrumbList`.
  - Update `src/app/[lang]/portfolio/page.tsx`: emit `CollectionPage` + `ItemList` JSON-LD using `projects` (`CreativeWork` URLs) + `BreadcrumbList`.
  - Update `src/app/[lang]/haqimizda/haqimizda-client.tsx` & `haqimizda/page.tsx`: export shared localized `ABOUT_FAQS` (founded `2018`, `600+` clients, `1200+` projects, Tashkent location, pricing starting points — strictly from `company-facts.ts` & `sales-content`), render them cleanly in editorial style in `HaqimizClient`, and emit `FAQPage` + `BreadcrumbList` alongside `AboutPage` in `haqimizda/page.tsx`.

- [ ] **Step 4: Run test to verify pass**
  Run: `npx vitest run src/lib/seo-pages.test.ts`
  Expected: PASS.

---

### Task 5: Full Verification, Documentation (`DEV_LOG.md`), Git Reconciliation, Cloudflare Deploy & Live Sweep

**Files:**
- Modify: `docs/DEV_LOG.md`

- [ ] **Step 1: Update `docs/DEV_LOG.md`**
  Append a clear entry for the Ideal SEO, AEO & GEO implementation alongside the existing `2026-11-18` Cloudflare Workers KV/ISR section.

- [ ] **Step 2: Run full local verification suite**
  Run:
  - `npm run typecheck`
  - `npm run lint`
  - `node --test scripts/check-audit.node-test.mjs`
  - `npm run verify:fast`
  Expected: Exit 0, zero TypeScript/ESLint errors, 4-locale parity green, all Vitest suites passing.

- [ ] **Step 3: Build & deploy to Cloudflare Workers (`deploy:cloudflare` / `upload:cloudflare` + `versions deploy`)**
  Run `npm run upload:cloudflare`, inspect preview URL & `node scripts/website-security-smoke.cjs <previewUrl>` (`JB_SECURITY_UPGRADE=1`), then promote to `100%` live production (`npx wrangler versions deploy ...@100 --name jonbranding-web --yes`) and re-run live sweep (`verify-live-post-deploy.mjs`) + security smoke test (`live`) to confirm `0` `404`s, `0` `500`s, clean `FAQPage`/`Service`/`OfferCatalog`/`HowTo`/`CollectionPage` JSON-LD in live HTML, and zero broken blog images.

- [ ] **Step 4: Commit cleanly & push to `origin/main`**
  Stage carefully (excluding scratch/temporary files), run `git commit`, push `git push origin main`.
