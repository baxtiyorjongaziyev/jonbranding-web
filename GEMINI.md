# Jon Branding Web — Google AI Studio Context

Sen Jon Branding agentligining **jonbranding.uz** veb-saytini ishlab chiquvchi AI assistant san.

## Loyiha haqida

**jonbranding.uz** — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.
- **Deploy**: Vercel — `git push origin main` qilganda avtomatik
- **Stack**: Next.js 16, TypeScript, Tailwind CSS, Sanity CMS, Vercel
- **GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## Stack va muhit

```
Framework:  Next.js 16 (App Router)
Styling:    Tailwind CSS + ShadCN UI
CMS:        Sanity (project: h6ymmj0v, dataset: production)
Deploy:     Vercel (Git Integration)
i18n:       4 til (uz, ru, en, zh) — src/locales/
Animations: Framer Motion
```

## Sahifalar ro'yxati

| URL | Fayl | Tavsif |
|---|---|---|
| `/[lang]/` | `src/app/[lang]/page.tsx` | Bosh sahifa (HomeComponent) |
| `/[lang]/xizmatlar/` | xizmatlar sahifalari | 6 ta xizmat |
| `/[lang]/blog/` | Markdown blog (`src/posts`); Sanity post schema migration uchun tayyor | |
| `/[lang]/quiz/` | Brending testi | |
| `/[lang]/pricing/sotuvchi-kartochka/` | Narxlar | |
| `/admin/` | Sanity Studio | |

## Asosiy komponentlar

```
src/components/
├── home-component.tsx      # Bosh sahifa assembler
├── contact-modal.tsx       # Lead capture modal (AmoCRM webhook)
├── oisha-widget.tsx        # AI chat widget
└── sections/               # 30+ section komponent
    ├── hero.tsx            # Hero section
    ├── bento-results-stats.tsx  # Natijalar
    ├── testimonials.tsx    # Mijoz fikrlari (Vimeo)
    ├── package-builder.tsx # Paket builder
    ├── before-after.tsx    # Portfolio before/after
    └── ...
```

## Muhim qoidalar

1. **Til kalitlari** — barcha matnlar `src/locales/uz.json` da, to'g'ridan-to'g'ri string yozma
2. **Rasmlar** — `next/image` + `cdn.sanity.io` yoki `public/` papkasidan
3. **Animatsiyalar** — `framer-motion` ishlatiladi, `motion.div` bilan
4. **Responsive** — Mobile-first, Tailwind breakpoints: `sm:`, `md:`, `lg:`
5. **TypeScript** — `ignoreBuildErrors: true` (build'da xato bo'lsa ham o'tadi, lekin yaxshi yoz)
6. **DEV_LOG.md** — push qilganda avtomatik yangilanadi
7. **Uzbek-first Policy** — O'zbek tili saytimizning asosiy tili hisoblanadi. Har qanday matn, xususiyat yoki o'zgarish birinchi navbatda o'zbek tilida (`uz.json` faylida) amalga oshiriladi, so'ngra boshqa 3 ta tilga (`ru.json`, `en.json`, `zh.json`) tarjima qilinadi. Har bir o'zgarish birinchi o'zbek tilida joriy etilishi shart.

## Sanity Schema

```typescript
// src/sanity/schemaTypes/
post.ts        // Blog postlar
comparison.ts  // Before/After (brend)
portfolio.ts   // Portfolio loyihalar (yangi, kengaytirilgan)
```

## Kodni yozish uslubi

- TypeScript `FC<Props>` pattern
- Tailwind class-lar — komponent ichida, `cn()` utility bilan birlashtir
- Yangi section: `src/components/sections/` ichiga, `export default` bilan
- i18n: `dictionary.section_name.key` pattern
- Rasmlar: har doim `alt` va `priority` prop'larini qo'sh

## Workflow

```bash
# Local ishga tushirish
npm run dev          # localhost:9002

# Build tekshirish
npm run build

# Deploy (GitHub Actions orqali avtomatik)
git push origin main
```

## Muhit o'zgaruvchilari

```
NEXT_PUBLIC_SANITY_PROJECT_ID=h6ymmj0v
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_OISHA_API_URL=https://oisha-master-bot-...run.app
```

<!-- BRAIN-CAPTURE -->
## brain — ikkinchi miya (majburiy)

Bu loyiha konteksti Obsidian vault'da: **`10-Projects/JonBranding.md`** (agentlik biznesi, sayt shu brendning bir qismi).

- Ish boshida `brain_context()`, keyin `brain_search("jonbranding-web")`.
- Bu loyiha haqida yangi fakt/qaror bilsang -> `brain_append("10-Projects/JonBranding.md", ...)`.
- Ish tugagach -> `brain_log(action, detail)` — boshqa AI agentlar ko'radi.
- Owner va biznes konteksti: `20-Areas/Baxtiyorjon.md`, `10-Projects/JonBranding.md`.
- `90-AI/Context.md` va tasdiqlangan qarorlarni o'zgartirma —
  `brain_memory_proposal()` ishlat.

Repo — kod uchun haqiqat manbai. Vault — biznes va qaror konteksti uchun.
<!-- BRAIN-CAPTURE -->
