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

## Arxitektura qarorlari (sessiya xotirasi)
Kelajakdagi sessiyalar kontekstni qayta so'ramasligi uchun asosiy qarorlar:

- **Dizayn tizimi**: Bosh sahifa "Atelier" tizimida — `src/components/atelier/atelier-sections.tsx` (AT* komponentlar), CSS tokenlar `src/app/atelier.css`da `.atelier-theme` klassi ichida scoped (`--bg`, `--paper`, `--ink`, `--accent`...). Global `--at-*` tokenlar `globals.css`da. AT* komponent ishlatish uchun `.atelier-theme` o'rami SHART.
- **Body fon qoidasi**: `body:has(.atelier-home)` — faqat bosh sahifa uchun (home-component.tsx'da `atelier-theme atelier-home`). Boshqa sahifalarda `.atelier-theme` o'rami body'ga ta'sir qilmaydi.
- **Testimonials birlashtirilgan**: bosh sahifa va narxlar sahifasi bitta `ATQuotes` (atelier-sections.tsx) ishlatadi. `src/components/sections/at-quotes.tsx` — O'LIK fayl, ishlatilmaydi. `sections/testimonials.tsx` (oq karusel) endi faqat zaxira.
- **Promokodlar**: faqat `VALID_PROMO_CODES` ro'yxati (`src/lib/pricing.ts`): RAMAZON, PCG, TEZNATIJA, KURSDOSH, SALOM, ISTISNO.
- **Fallback tizimlar**: comparisons (`comparison-fallbacks.ts`) va testimonials (`static-data.ts`) — Sanity bo'sh bo'lsa ishlaydi. CMS'dan rasmsiz yozuvlar `fetchComparisons`da filtrlash bilan tozalanadi (fallback merge'dan OLDIN).
- **Portfolio-bot** (`services/portfolio-bot/`): Telegram kanaldan keys nomini olib Gdrive'dan qidiradi (link kerak emas), Gemini cover tanlaydi, Sanity'ga SEO bilan yozadi. Ishga tushirish: `deploy/README.md` (Telegram sessiya + kalitlar hali sozlanmagan).
- **framer-motion 12**: `Variants` obyektlariga aniq `: Variants` tipi shart (`type: 'spring'` literal xatosi).
- **vitest**: `tests/` katalogi exclude qilingan (Playwright testlari), faqat `src/**/*.test.ts`.
- **CI**: GitHub Actions (`test.yml`) typecheck+lint+test+build; Vercel/Netlify preview. pnpm lockfile bilan sinxron bo'lishi shart.
- **Sandbox cheklovlari**: jonbranding.uz, cdn.sanity.io, instagram tarmoqdan bloklangan — lokal testda Sanity rasm xatolari soxta signal. Dev server tez-tez o'chadi, birinchi kompilyatsiya 1-3 daqiqa.

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
