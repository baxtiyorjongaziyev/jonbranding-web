# Jon Branding Web — Google AI Studio Context

Sen Jon Branding agentligining **jonbranding.uz** veb-saytini ishlab chiquvchi AI assistant san.

## Loyiha haqida

**jonbranding.uz** — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.
- **Deploy**: Firebase App Hosting (`brandboost-landing`)
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Sanity CMS
- **GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## Stack va muhit

```
Framework:  Next.js 14 (App Router)
Styling:    Tailwind CSS + ShadCN UI
CMS:        Sanity (project: h6ymmj0v, dataset: production)
Deploy:     Firebase App Hosting via GitHub Actions
i18n:       4 til (uz, ru, en, zh) — src/locales/
Animations: Framer Motion
```

## Sahifalar ro'yxati

| URL | Fayl | Tavsif |
|---|---|---|
| `/[lang]/` | `src/app/[lang]/page.tsx` | Bosh sahifa (HomeComponent) |
| `/[lang]/xizmatlar/` | xizmatlar sahifalari | 6 ta xizmat |
| `/[lang]/blog/` | Sanity CMS blog | |
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
