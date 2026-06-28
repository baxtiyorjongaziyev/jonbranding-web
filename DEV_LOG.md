# 📓 Dev Log — Jon Branding Web

Har sessiyada nima qilingani qayd etiladi. Bu fayl Google AI Studio ↔ Antigravity o'rtasidagi "xotira" vazifasini bajaradi.

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
