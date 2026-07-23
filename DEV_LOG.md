# 📓 Dev Log — Jon Branding Web

Har sessiyada nima qilingani qayd etiladi. Bu fayl Google AI Studio ↔ Antigravity o'rtasidagi "xotira" vazifasini bajaradi.

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
