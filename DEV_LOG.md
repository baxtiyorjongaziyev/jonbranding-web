# 📓 Dev Log — Jon Branding Web

Har sessiyada nima qilingani qayd etiladi. Bu fayl Google AI Studio ↔ Antigravity o'rtasidagi "xotira" vazifasini bajaradi.

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
