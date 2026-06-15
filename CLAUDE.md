# jonbranding-web

**jonbranding.uz** — Markaziy Osiyo brend-agentligi. Next.js 16, TypeScript, Tailwind, Sanity, Vercel.
**GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## Buyruqlar
```bash
npm run dev        # localhost:9002
npm run build
git push origin main  # → Vercel auto-deploy
```

## Stack
- Framework: Next.js 16 App Router
- Styling: Tailwind CSS + ShadCN UI + `cn()` utility
- CMS: Sanity (project: h6ymmj0v, dataset: production)
- i18n: uz, ru, en, zh — `src/locales/[lang].json`
- Animations: Framer Motion + Lenis smooth scroll

## Asosiy fayllar
```
src/app/[lang]/page.tsx          # Bosh sahifa
src/components/home-component.tsx # Section assembler
src/components/sections/         # 30+ section (hero, founder, process…)
src/components/layout/           # header, footer, main-layout
src/locales/                     # i18n JSON fayllar
src/lib/static-data.ts           # staticBrands, staticTestimonials
```

## Qoidalar
1. Matnlar — `src/locales/uz.json` (va boshqa tillar). Dictionary pattern: `dictionary.section.key`
2. Rasmlar — `next/image`, CDN: `cdn.sanity.io` yoki `public/`
3. Animatsiyalar — `framer-motion` (`motion.div`, `whileInView`)
4. Yangi section — `src/components/sections/` + `export default FC<Props>`
5. TypeScript: `FC<Props>` pattern, `ignoreBuildErrors: true`
6. **Uzbek-first Policy** — O'zbek tili saytimizning asosiy tili. Har qanday matn yoki o'zgarish birinchi navbatda o'zbek tilida (uz.json da) amalga oshiriladi, so'ngra boshqa 3 ta tilga tarjima qilinadi.

## Muhim ogohlantirishlar
- `git push` → HTTP 403 (local proxy bloklaydi). MCP `mcp__github__push_files` ishlatish
- `src/locales/uz.json` 74KB — to'liq o'qima, `grep` ishlat
- `src/locales/` fayllarini o'qish o'rniga grep bilan key topib, kerak qismini o'qi

## Env
```
NEXT_PUBLIC_SANITY_PROJECT_ID=h6ymmj0v
NEXT_PUBLIC_SANITY_DATASET=production
```
