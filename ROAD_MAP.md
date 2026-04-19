# 🗺️ Jon Branding Web — Road Map

> **Vazifa**: Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.
> **Stack**: Next.js 14 · Tailwind CSS · Sanity CMS · Firebase App Hosting
> **URL**: [jonbranding.uz](https://jonbranding.uz)

---

## ✅ Hozirgi holat (Bajarilgan)

| Funksiya | Holat |
|---|---|
| 3-tillik i18n (uz/ru/en) | ✅ Bajarilgan |
| Hero + Stats + BentoResults | ✅ Bajarilgan |
| Portfolio Gallery (static-data) | ✅ Bajarilgan |
| Before/After slider | ✅ Bajarilgan |
| Testimonials (Vimeo video) | ✅ Bajarilgan |
| Contact modal (AmoCRM webhook) | ✅ Bajarilgan |
| Opportunity Cost Calculator | ✅ Bajarilgan |
| Patent/Trademark Calculator | ✅ Bajarilgan |
| Package Builder | ✅ Bajarilgan |
| Quiz sahifasi | ✅ Bajarilgan |
| Blog (Sanity CMS) | ✅ Bajarilgan |
| Sanity Studio (/admin) | ✅ Bajarilgan |
| PWA manifest | ✅ Bajarilgan |
| Firebase App Hosting (CD) | ✅ Bajarilgan |
| GitHub CI/CD workflow | ✅ Bajarilgan |

---

## 🔜 Keyingi bosqich (Phase 2)

### 🎯 Konversiya oshirish
- [ ] **A/B testing infra** — Hero headline-ni test qilish uchun split framework
- [ ] **Exit-intent popup** — Sahifadan chiqishdan oldin lead capture
- [ ] **Scroll-triggered CTA** — 70% scroll depth-da floating CTA bar
- [ ] **Live chat widget** — Telegram Web App orqali real-time chat

### 🖼️ Kontent
- [ ] **Sanity portfolio schema kengaytirish** — category, tags, before/after images, case study body
- [ ] **Blog SEO** — Open Graph teglari, structured data (JSON-LD)
- [ ] **Video testimonials sahifasi** — Alohida `/testimonials` sahifasi
- [ ] **Case study sahifasi** — Har bir loyiha uchun `/portfolio/[slug]`

### ⚡ Performance
- [ ] **Core Web Vitals optimizatsiya** — LCP < 2.5s, CLS < 0.1
- [ ] **Image lazy loading** — Barcha portfolio rasmlari uchun blur placeholder
- [ ] **Font subsetting** — Faqat ishlatiladigan harflarni yuklash

### 🔧 Texnik
- [ ] **Dublikat route hal qilish** — `/xizmatlar/brand-strategiyasi` vs `/brand-strategy`
- [ ] **zh.json to'ldirish** — Xitoy tili tarjimasi tugallanmagan
- [ ] **Error boundary** — Har bir section uchun fallback UI

---

## 🛠️ Qaysi vositada qaysi vazifa

| Vazifa | Asbob |
|---|---|
| UI tweak, matn, rang | **Google AI Studio** (bepul, Gemini 3 Pro) |
| Yangi section prototipi | **Google AI Studio** |
| Blog/Portfolio kontent | **Sanity Studio** |
| CI/CD, infra, debug | **Antigravity** (bu yerda) |
| Murakkab bug | **Antigravity** |
| Testing (browser agent) | **Antigravity** |

---

## 📐 Arxitektura

```
src/
├── app/
│   ├── [lang]/           # i18n sahifalar (uz, ru, en, zh)
│   │   ├── page.tsx      # Bosh sahifa
│   │   ├── xizmatlar/    # Xizmat sahifalari (6 ta)
│   │   ├── blog/         # Sanity CMS blog
│   │   └── quiz/         # Brending testi
│   ├── admin/            # Sanity Studio
│   └── api/              # AmoCRM webhook, form handler
├── components/
│   ├── sections/         # 30+ section komponent
│   ├── layout/           # Header, Footer
│   └── ui/               # ShadCN (+custom) komponentlar
├── locales/              # uz.json, ru.json, en.json, zh.json
├── sanity/               # Sanity client + schema types
└── lib/                  # static-data, utils, types
```
