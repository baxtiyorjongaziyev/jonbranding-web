# JonBranding Web — Codex to'liq sayt auditi

**Sana:** 2026-07-13
**Audit qamrovi:** Next.js arxitektura, build/test holati, performance, SEO, i18n, accessibility, security headers, UX/conversion, content/CMS va texnik qarz.
**Asosiy maqsad:** `jonbranding.uz` saytini premium “Sales Machine” sifatida barqaror, tez, ishonchli va konversiyaga yo'naltirilgan holatga olib chiqish.


## Change log note

Bu audit avval `docs/full-site-audit-2026-07-13.md` va `DEV_LOG.md` o'zgarishlari bilan kiritilgan edi. PR apply jarayonida aynan shu ikki faylda conflict chiqqani uchun audit conflict ehtimoli pastroq `docs/audits/2026-07-13-codex-full-site-audit.md` pathiga ko'chirildi va `DEV_LOG.md` diffdan chiqarildi.

## 1. Executive summary

Sayt poydevori kuchli: Next.js App Router, 4 til, Sanity CMS, structured data, sitemap/robots, testlar va security headerlar bor. Eng katta risklar kod bazasining ishlamasligida emas, balki **mobil performance**, **lokalizatsiya sifati**, **home page'ning haddan tashqari client-side bo'lishi**, va **lead capture tajribasining agressivligi** atrofida.

### Umumiy baho

| Yo'nalish | Baho | Holat |
|---|---:|---|
| Build/Test barqarorligi | 8/10 | Testlar o'tyapti; typecheck/lint uzoq ishlaydi yoki to'liq tekshiruvni sekinlashtiradi |
| Performance | 6/10 | Lighthouse performance 69; TBT 1.34s eng katta muammo |
| SEO | 9/10 | Sitemap, robots, metadata, hreflang bor; duplicate metadata va canonical tekshiruvi kerak |
| i18n | 6/10 | 4 til mavjud; ru/en/zh'da 6 tadan missing key, zh'da tarjima sifati muammolari bor |
| Accessibility | 7/10 | Lighthouse accessibility 89; modallar, motion va media control audit talab qiladi |
| Security | 7/10 | Headerlar yaxshi; CSP `unsafe-inline`, API env validation va rate-limit audit kerak |
| UX/Conversion | 7/10 | CTA ko'p va kuchli; pop-up/sticky/exit-intent bir-birini bosib ketishi mumkin |
| Maintainability | 6/10 | Juda ko'p `use client`, katta `atelier-sections.tsx`, eski/parallel komponentlar bor |

## 2. Tekshiruv natijalari

### 2.1 Build, test va tooling

**Kuchli tomonlar**
- `npm test` 5 test fayl / 40 testni muvaffaqiyatli o'tkazdi.
- `package.json`da build, lint, typecheck va test scriptlari bor.
- Next config security header, image remote patterns va standalone output bilan production'ga tayyorlangan.

**Muammolar / risklar**
1. `npm run build` Next 16 build jarayonida uzoq davom etadi; audit vaqtida warninglar chiqdi: custom Cache-Control header `/_next/static` uchun Next development behavior'ni buzishi mumkin.
2. `npm run lint` va `npm run typecheck` sekin yoki uzoq ishlaydi. CI'da timeout bo'lmasligi uchun ularni alohida job sifatida cache bilan ishga tushirish kerak.
3. `package-lock.json` va `pnpm-lock.yaml` bir repo ichida mavjud. Bu jamoa va CI uchun package manager drift xavfini oshiradi.

**Tavsiya**
- Bitta package manager tanlash: agar pnpm ishlatilsa `package-lock.json`ni olib tashlash yoki npm ishlatilsa `pnpm-lock.yaml`ni olib tashlash.
- CI joblari: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` alohida bosqichlarda cache bilan.
- Build profiling: `ANALYZE=true` yoki bundle analyzer qo'shib client bundle'ni o'lchash.

### 2.2 Performance

`lighthouse-report.json` bo'yicha mavjud mobil audit:

| Metric | Qiymat | Baholash |
|---|---:|---|
| Performance score | 69/100 | O'rtacha |
| FCP | 1.9s | Qabul qilsa bo'ladi |
| LCP | 2.6s | Chegarada; 2.5s dan pastga tushirish kerak |
| Speed Index | 3.9s | O'rtacha |
| TBT | 1,340ms | Kritik |
| CLS | 0 | A'lo |
| Total byte weight | 273 KiB | Yaxshi |

**Asosiy sabablar**
- `HomeComponent` butun home page'ni client component qiladi. Natijada statik bo'lishi mumkin bo'lgan ko'p sectionlar hydration narxini oshiradi.
- Home page ko'p client sectionlardan iborat: Framer Motion, modal, exit intent, scroll analytics, sticky CTA, gallery, testimonials, process video.
- `src/components/atelier/atelier-sections.tsx` juda katta fayl; unda ko'p UI va `dangerouslySetInnerHTML` bloklari jamlangan. Bu maintainability va bundle splitting uchun risk.
- `next/font/google` ishlatilgani yaxshi, ammo fonts va visual effects audit qilinishi kerak.

**Tavsiya — prioritet**
1. Home page'ni server-first arxitekturaga ajratish: faqat modal trigger, carousel/video, scroll analytics kabi interaktiv leaf komponentlar `use client` bo'lsin.
2. Heavy sectionlarni dynamic import bilan lazy-load qilish: testimonials, gallery, process video, before/after slider.
3. Exit-intent, auto scroll modal va sticky CTA triggerlarini bitta `LeadCaptureOrchestrator`ga birlashtirish; bir sessionda faqat bitta agressiv trigger ishlasin.
4. Motion uchun `prefers-reduced-motion` va mobile throttle qo'shish.
5. Hero LCP image uchun `priority`, `sizes`, optimal width va blur placeholder audit qilish.

### 2.3 SEO va indeksatsiya

**Kuchli tomonlar**
- `src/app/sitemap.ts` 4 til bo'yicha static routes, blog sluglar va portfolio sluglarni sitemap'ga qo'shadi.
- `src/app/robots.ts` sitemap URL va allow qoidasini qaytaradi.
- `[lang]/layout.tsx` metadataBase, OpenGraph, Twitter metadata, canonical va language alternates beradi.
- JSON-LD ProfessionalService va FAQPage mavjud.

**Risklar**
1. `[lang]/layout.tsx` va `[lang]/page.tsx` ikkalasida metadata bor; page metadata layout metadata ustiga chiqadi. Bu duplicate/nomuvofiq title-description strategiyasini keltirishi mumkin.
2. Root `/` redirect `/en`ga ketgani lighthouse'da ko'rinyapti. O'zbek-first policy uchun root default `uz` bo'lishi maqsadga muvofiq bo'lishi mumkin.
3. FAQ JSON-LD layout darajasida barcha sahifalarda chiqsa, har bir route mazmuni bilan mos kelmasligi mumkin.
4. Static route ro'yxatini real routes bilan avtomatik solishtirish yo'q; route qo'shilsa sitemap unutib qolinishi mumkin.

**Tavsiya**
- Metadata ownership matrix tuzish: global layout faqat brand defaults, har sahifa esa sahifa-specific title/description.
- Root locale negotiation siyosatini tasdiqlash: Uzbekistan bozori uchun `/` → `/uz` yaxshiroq.
- FAQ schema faqat FAQ mavjud sahifalarda chiqsin.
- Sitemap test qo'shish: `src/app` routes bilan `staticRoutes` farqini ko'rsatsin.

### 2.4 i18n / localization

`node scripts/audit_locales.js` natijasi:

| Locale | Total keys | Missing from uz | Extra |
|---|---:|---:|---:|
| uz | 977 | - | - |
| ru | 971 | 6 | 0 |
| en | 971 | 6 | 0 |
| zh | 971 | 6 | 0 |

Missing keylar:
- `header.naming_simple`
- `header.logo_design_simple`
- `header.brandbook_simple`
- `header.corporate_style_simple`
- `header.packaging_design_simple`
- `atelier.hero_title_alt`

`node scripts/audit_translations.js` natijasi:
- `zh.json`da kamida 36 ta inglizcha qolib ketgan yoki xitoycha belgilar yo'q qiymat bor.
- Empty/null value yo'q.

**Tavsiya**
1. Uzbek-first qoida bo'yicha avval `uz.json` source-of-truth sifatida saqlansin, keyin missing 6 key `ru/en/zh`ga qo'shilsin.
2. `zh.json`dagi inglizcha qolgan qiymatlar professional xitoycha tarjima bilan to'ldirilsin.
3. Locale key parity testini CI'ga qo'shish; missing key bo'lsa PR fail bo'lsin.
4. Hardcoded visible string audit: `rg` orqali komponentlarda to'g'ridan-to'g'ri matnlar aniqlanib, locale fayllarga o'tkazilsin.

### 2.5 UX / Conversion

**Kuchli tomonlar**
- Home page conversion funnel kuchli: hero → proof/gallery → testimonials → process → founder → pricing/audit → final CTA.
- Modal, sticky CTA, exit intent, scroll-depth analytics mavjud.
- Audit offer yo'nalishi premium agency positioning bilan mos.

**Risklar**
1. 85% scroll auto-popup + exit intent + sticky CTA foydalanuvchini charchatishi mumkin.
2. Lead capture orchestration markazlashmagan: modal ochilish signalari turli komponentlarda tarqalgan.
3. “Free Brand Audit” taklifi ko'p joyda bor, ammo benefit/expectation har sectionda bir xil aniqlikda emas.
4. Mobile'da sticky CTA va modal interaction tekshiruvi zarur: keyboard, safe area, close affordance.

**Tavsiya**
- Trigger prioritization: sticky CTA doim passiv; exit-intent faqat desktop; 85% scroll popup faqat user engagement 60s+ bo'lsa.
- Modal fieldlarini kamaytirish: ism + telefon/Telegram + bitta muammo. Qolganini follow-upda olish.
- Har CTA yonida microcopy: “15 daqiqa, bepul, sotish salohiyati bo'yicha 3 ta aniq tavsiya”.
- A/B test: hero headline, CTA label, modal field count.

### 2.6 Accessibility

`lighthouse-report.json` accessibility score: **89/100**.

**Tavsiya**
- Dialoglar: focus trap, ESC close, aria-labelledby/aria-describedby va return focus tekshirilsin.
- Video/audio: captions/transcript yoki matnli summary qo'shilsin.
- Motion: `prefers-reduced-motion` bo'yicha animatsiyalar keskin kamaytirilsin.
- Contrast: beige/cream atelier fonlarda small text kontrasti tekshirilsin.
- Keyboard navigation: header nav, language switcher, portfolio carousel va modal to'liq keyboard bilan boshqarilsin.

### 2.7 Security / privacy

**Kuchli tomonlar**
- HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP bor.
- JSON-LD `safeJsonStringify` bilan chiqariladi.
- HTML sanitization util mavjud va bir nechta joyda ishlatilgan.

**Risklar**
1. CSP `script-src`da `unsafe-inline` bor. Next/analytics sababli tushunarli, lekin risk kamaytirish rejasi kerak.
2. API route'lar ko'p: submit-form, oisha, amocrm, content-agent, blog-agent, sync endpoints. Ularning auth/rate-limit/env validation holatini alohida audit qilish kerak.
3. `dangerouslySetInnerHTML` ko'p ishlatiladi. Sanitization bir xil standartda bo'lishi shart.
4. Analytics/cookie consent: cookie banner bor, lekin third-party scriptlar consentdan oldin ishlashi tekshirilishi kerak.

**Tavsiya**
- API route security checklist: method allowlist, zod validation, rate-limit, env guard, auth token, safe logging.
- CSP nonce/hash strategiyasini rejalash.
- `dangerouslySetInnerHTML` uchun yagona wrapper komponent: `SafeHtml`.
- Cookie consent bilan analytics init gating.

### 2.8 CMS / content operations

**Kuchli tomonlar**
- Sanity schema: post, comparison, portfolio, testimonial/settings mavjud.
- Fallback data va fetch wrappers bor.
- Portfolio sync/bot service mavjud.

**Risklar**
- CMS fetch fallbacklari UX uchun yaxshi, lekin monitoring yo'q bo'lsa real CMS failure yashirin qoladi.
- Portfolio/bot service alohida package manager va dist artifactlar bilan repo ichida katta maintenance risk.

**Tavsiya**
- CMS fetch failure uchun server-side structured logging va alerting.
- Sanity schema migrations/documentation.
- `services/portfolio-bot`ni workspace sifatida aniq ajratish yoki deploy artifactlarni repodan chiqarish.

## 3. 30 kunlik remediation plan

### Hafta 1 — Stabilizatsiya
- Missing locale keylarni to'ldirish.
- `zh.json`dagi inglizcha qolgan qiymatlarni tarjima qilish.
- Package manager lock qarorini qabul qilish.
- API route security checklistni tuzish va eng muhim `submit-form`, `oisha`, `amocrm-webhook` route'larni tekshirish.

### Hafta 2 — Performance
- Home page server/client split rejasini amalga oshirish.
- Gallery/testimonials/process video dynamic import.
- Lead capture triggerlarni orchestratorga birlashtirish.
- Lighthouse qayta o'lchash: maqsad performance 85+, TBT < 300ms, LCP < 2.5s.

### Hafta 3 — SEO/i18n/content
- Metadata ownership refactor.
- FAQ schema'ni sahifa-specific qilish.
- Sitemap route parity test.
- Uzbek-first content review: CTA, modal, hero, pricing/audit copy.

### Hafta 4 — Accessibility va analytics
- Keyboard-only test.
- Modal accessibility fixes.
- Consent-gated analytics.
- Conversion event taxonomy: `cta_click`, `modal_open`, `form_submit`, `audit_request`, `scroll_depth`.

## 4. Top 10 prioritet vazifa

1. **TBT 1.34s ni kamaytirish** — home page client bundle/hydration qisqartirish.
2. **Locale parity fix** — ru/en/zh missing 6 keyni qo'shish.
3. **Chinese translation QA** — 36 ta muammoli qiymatni tarjima qilish.
4. **Lead capture orchestrator** — pop-up, exit intent va sticky CTA'ni boshqarish.
5. **API route security audit** — submit/oisha/amocrm/content endpoints.
6. **Package manager drift fix** — bitta lockfile.
7. **FAQ schema scope fix** — globaldan sahifa-specificga.
8. **`atelier-sections.tsx` split** — maintainability va bundle splitting.
9. **Accessibility pass** — modal, media, keyboard, reduced motion.
10. **Fresh Lighthouse run** — local/prod URL bo'yicha yangi hisobot.

## 5. Auditda ishlatilgan komandalar

```bash
npm run build
npm run lint
npm run typecheck
npm test
node scripts/audit_locales.js
node scripts/audit_translations.js
node -e "const r=require('./lighthouse-report.json'); console.log(r.categories)"
find src/app -maxdepth 4 -type f \( -name 'page.tsx' -o -name 'layout.tsx' -o -name 'route.ts' -o -name 'sitemap.ts' -o -name 'robots.ts' \) -print | sort
rg "export default|<Image|img |dangerouslySetInnerHTML|TODO|FIXME|use client|h-screen|min-h-screen|window.addEventListener|localStorage|sessionStorage|fetch\(" src/components src/app src/lib -n
```
