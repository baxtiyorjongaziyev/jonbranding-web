# SEO, Google Preferred Sources & Blog Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Jon.Branding's Schema.org entity graph across all pages, expose a multilingual RSS 2.0 feed, integrate Google Preferred Sources (`publisher.js` + deeplink), add intent-aware lead CTAs to blog articles, schedule weekly draft-only blog generation, and fix `llms.txt` facts & proxy exclusions.

**Architecture:** All SEO entity schemas consolidate into `getSiteEntityGraph(locale)` in `src/lib/seo.ts` so homepage, services, and blog schemas resolve `@id` links cleanly. A new RSS feed builder (`src/lib/blog-feed.ts`) and Next.js Route Handler (`src/app/feed.xml/route.ts`) combine repository Markdown posts and published Sanity posts, while `src/middleware.ts` excludes `/feed.xml` and `/llms.txt` from locale rewriting. Blog pages gain Google Preferred Sources integration (CSP-approved `news.google.com` + direct `google.com/preferences/source?q=jonbranding.uz` fallback) and topic-matched CTAs wired to `openContactModal`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sanity CMS, Vitest.

## Global Constraints

- **Uzbek-first & i18n parity:** Every new UI string must be added to `src/locales/uz.json` first and mirrored with identical keys in `ru.json`, `en.json`, and `zh.json`.
- **Zero fabrication / official facts (`docs/FAKTLAR.md`):** Use only verified figures (`2018` founded, `7+` / dynamic `yearsLabel()`, `600+` clients, `1200+` projects); never reintroduce banned legacy numbers (`9+ yil`, `150+ loyiha`, etc.).
- **Human-in-the-Loop CMS safety:** Automated `/api/blog-agent` must save strictly as `drafts.*` in Sanity — never auto-publish.
- **No layout transitions (`src/app/no-layout-transitions.test.ts`):** Never use `transition-all` or `transition: all`; touch targets must be `>= 44px` (`min-h-[44px]`).
- **Canonical layout rule (`src/app/canonical.test.ts`):** Do not add `canonical:` or `languages:` to `src/app/[lang]/layout.tsx`.

## Review Focus

1. Requests from English/Russian browsers to `/feed.xml` or `/llms.txt` must not be 307/308 redirected to `/en/feed.xml` or `/en/llms.txt` by `src/middleware.ts`.
2. XML output from `/feed.xml` must escape `<`, `>`, `&`, `"`, `'` in titles/descriptions and exclude Sanity draft IDs (`drafts.*`).
3. `src/app/[lang]/layout.tsx` must render `@id: ORGANIZATION_ID`, `FOUNDER_ID`, and `WEBSITE_ID` without introducing `canonical:` or `languages:` inside `layout.tsx`.
4. Google Preferred Sources must work even when third-party JS (`news.google.com`) is blocked (always-present deeplink fallback), and CSP tests must verify `https://news.google.com` allowance.
5. Contextual blog CTAs must gracefully handle Uzbek, Russian, English, and Chinese posts and fallback safely when keywords/slug don't match a specialized cluster.

---

### Task 1: Unify Site Entity Graph (`src/lib/seo.ts` & `src/app/[lang]/layout.tsx`)

**Files:**
- Modify: `src/lib/seo.ts:71-168`
- Modify: `src/lib/seo.test.ts:33-53`
- Modify: `src/app/[lang]/layout.tsx:1-259`

- [ ] **Step 1: Add failing test assertions for unified entity graph metadata in `src/lib/seo.test.ts`**
  Assert `getSiteEntityGraph('uz')` includes `geo`, `openingHoursSpecification`, localized `founder.jobTitle`, and `WebSite.publisher === { '@id': ORGANIZATION_ID }`.
- [ ] **Step 2: Run `npx vitest run src/lib/seo.test.ts` to verify failure (RED)**
- [ ] **Step 3: Enrich `getSiteEntityGraph` in `src/lib/seo.ts` and replace the 3 inline JSON-LD `<Script>` blocks in `src/app/[lang]/layout.tsx` with `getSiteEntityGraph(lang)` plus `<link rel="alternate" type="application/rss+xml" ... />`**
- [ ] **Step 4: Run `npx vitest run src/lib/seo.test.ts src/app/canonical.test.ts` (GREEN)**

---

### Task 2: Multilingual RSS 2.0 Feed (`/feed.xml`) & Middleware Exclusions

**Files:**
- Create: `src/lib/blog-feed.ts`
- Create: `src/lib/blog-feed.test.ts`
- Create: `src/app/feed.xml/route.ts`
- Modify: `src/middleware.ts:86-90`
- Modify: `src/proxy.test.ts:10-20`

- [ ] **Step 1: Write failing tests in `src/lib/blog-feed.test.ts` and `src/proxy.test.ts`**
  - Verify `buildRssFeedXml` escapes XML special chars, formats RFC-822 `pubDate`, generates localized canonical links (`/blog/...` for `uz`, `/ru/blog/...` for `ru`, etc.), and sorts newest-first.
  - Verify `unstable_doesMiddlewareMatch` returns `false` for `/feed.xml` and `/llms.txt`.
- [ ] **Step 2: Run tests to verify failure (RED)**
- [ ] **Step 3: Implement `src/lib/blog-feed.ts`, `src/app/feed.xml/route.ts`, and update `src/middleware.ts` `config.matcher`**
- [ ] **Step 4: Run `npx vitest run src/lib/blog-feed.test.ts src/proxy.test.ts` (GREEN)**

---

### Task 3: Contextual Blog CTA Mapping + i18n Keys

**Files:**
- Create: `src/lib/blog-cta.ts`
- Create: `src/lib/blog-cta.test.ts`
- Create: `src/components/blog/blog-post-cta.tsx`
- Modify: `src/locales/uz.json`
- Modify: `src/locales/ru.json`
- Modify: `src/locales/en.json`
- Modify: `src/locales/zh.json`

- [ ] **Step 1: Write failing tests in `src/lib/blog-cta.test.ts`**
  Verify `resolveBlogCtaCluster` classifies patent/trademark, packaging, naming, brandbook, and general branding posts across `uz`/`ru`/`en`/`zh` slugs and keywords.
- [ ] **Step 2: Run test to verify failure (RED)**
- [ ] **Step 3: Implement `src/lib/blog-cta.ts`, add synchronized `blog.preferredSources*` and `blogPost.*` keys to `uz.json` first then `ru.json`, `en.json`, `zh.json`, and build `src/components/blog/blog-post-cta.tsx`**
- [ ] **Step 4: Run `npx vitest run src/lib/blog-cta.test.ts` (GREEN)**

---

### Task 4: Google Preferred Sources Component, CSP & Blog Pages

**Files:**
- Modify: `next.config.js:18-139`
- Modify: `src/app/content-security-policy.test.ts`
- Create: `src/components/blog/preferred-sources-card.tsx`
- Modify: `src/app/[lang]/blog/page.tsx`
- Modify: `src/app/[lang]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add failing CSP test for `https://news.google.com/swg/js/v1/publisher.js` in `src/app/content-security-policy.test.ts`**
- [ ] **Step 2: Run `npx vitest run src/app/content-security-policy.test.ts` to verify failure (RED)**
- [ ] **Step 3: Allow `https://news.google.com` in `next.config.js` CSP (`script-src`, `connect-src`, `frame-src`), create `src/components/blog/preferred-sources-card.tsx`, and mount it + `BlogPostCta` on blog pages**
- [ ] **Step 4: Run `npx vitest run src/app/content-security-policy.test.ts` (GREEN)**

---

### Task 5: Weekly Draft Blog Cron & `public/llms.txt` Facts Sync

**Files:**
- Modify: `src/app/api/blog-agent/route.ts`
- Modify: `vercel.json`
- Modify: `public/llms.txt`
- Create: `src/lib/seo-assets.test.ts`

- [ ] **Step 1: Write failing tests in `src/lib/seo-assets.test.ts` verifying `public/llms.txt` has no banned legacy numbers (`9+`, `150+`), includes all 4 locales + `/blog` + `/feed.xml`, and `vercel.json` schedules `/api/blog-agent`**
- [ ] **Step 2: Run test to verify failure (RED)**
- [ ] **Step 3: Expand `blog-agent` topic pool with `SEO_AEO_GEO_OPERATIONS.md` top queries (keeping `drafts.*` Human-in-the-Loop rule), add weekly cron to `vercel.json`, and update `public/llms.txt`**
- [ ] **Step 4: Run `npx vitest run src/lib/seo-assets.test.ts src/app/api/blog-agent/route.test.ts` (GREEN)**

---

### Task 6: Update `docs/DEV_LOG.md` & Run Full Verification Gate

**Files:**
- Modify: `docs/DEV_LOG.md`

- [ ] **Step 1: Run `npm run verify:fast`, `npm run typecheck`, `npm run lint`, and `npm run build`**
- [ ] **Step 2: Log verified changes and exact verification counts in `docs/DEV_LOG.md`**
- [ ] **Step 3: Confirm `git status` and final clean pass after last edit**
