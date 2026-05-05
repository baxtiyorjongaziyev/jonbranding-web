# jonbranding-web — CLAUDE.md

## Loyiha haqida

**jonbranding.uz** — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.

- **Deploy**: Firebase App Hosting (`brandboost-landing`) — `git push origin main` qilganda avtomatik
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Sanity CMS, Firebase
- **GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## Buyruqlar

```bash
npm run dev        # localhost:9002
npm run build      # Build tekshirish
git push origin main  # Deploy (GitHub Actions → Firebase)
```

## Stack

```
Framework:  Next.js 14 (App Router)
Styling:    Tailwind CSS + ShadCN UI
CMS:        Sanity (project: h6ymmj0v, dataset: production)
Deploy:     Firebase App Hosting via GitHub Actions
i18n:       4 til: uz, ru, en, zh — src/locales/
Animations: Framer Motion
```

## Sahifalar

| URL | Fayl | Tavsif |
|---|---|---|
| `/[lang]/` | `src/app/[lang]/page.tsx` | Bosh sahifa |
| `/[lang]/xizmatlar/` | xizmatlar | 6 ta xizmat |
| `/[lang]/blog/` | Sanity CMS blog | |
| `/[lang]/quiz/` | Brending testi | |
| `/[lang]/pricing/sotuvchi-kartochka/` | Narxlar | |
| `/admin/` | Sanity Studio | |

## Komponentlar

```
src/components/
├── home-component.tsx      # Bosh sahifa assembler
├── contact-modal.tsx       # Lead capture (AmoCRM webhook)
├── oisha-widget.tsx        # AI chat widget
└── sections/               # 30+ section
    ├── hero.tsx
    ├── bento-results-stats.tsx
    ├── testimonials.tsx    # (Vimeo)
    ├── package-builder.tsx
    ├── before-after.tsx
    └── ...
```

## Sanity Schema

```
src/sanity/schemaTypes/
├── post.ts          # Blog postlar
├── comparison.ts    # Before/After (brend)
└── portfolio.ts     # Portfolio loyihalar
```

## Qoidalar

1. **Tillar** — barcha matnlar `src/locales/uz.json` (va boshqa til fayllar) da. To'g'ridan-to'g'ri string yozma.
2. **i18n pattern** — `dictionary.section_name.key`
3. **Rasmlar** — `next/image`, CDN: `cdn.sanity.io` yoki `public/`
4. **Animatsiyalar** — `framer-motion`, `motion.div` bilan
5. **Responsive** — Mobile-first, Tailwind: `sm:`, `md:`, `lg:`
6. **TypeScript** — `ignoreBuildErrors: true` (build'da xato o'tadi, lekin yaxshi yoz)
7. **Yangi section** — `src/components/sections/` ichiga, `export default FC<Props>`
8. **Tailwind class birlashtirish** — `cn()` utility

## Muhit o'zgaruvchilari

```
NEXT_PUBLIC_SANITY_PROJECT_ID=h6ymmj0v
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_OISHA_API_URL=https://oisha-master-bot-...run.app
```

## Eslatmalar

- `DEV_LOG.md` — push qilganda avtomatik yangilanadi
- TypeScript: `FC<Props>` pattern ishlating
