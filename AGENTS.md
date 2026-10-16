# jonbranding-web — AGENTS.md

## Loyiha haqida

**jonbranding.uz** — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.

- **Deploy**: Vercel — `git push origin main` qilganda avtomatik (yoki Vercel CLI)
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sanity CMS, Vercel
- **GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## 🌐 Jon Branding Unified Ecosystem

`jonbranding-web` va `oisha-os` — alohida mustaqil loyihalar EMAS, bitta Jon Branding biznes platformasining ikki qanoti:
1. **jonbranding-web** (Frontend & Public Interface): Mijozlar yuzi, portfolio, interaktiv formalar, tashqi lid intake.
2. **oisha-os** (`c:\Users\baxti\playground\oisha-os`) (Backend, Operations & AI Core): Markaziy operatsion tizim, AI agentlar, amoCRM / Meta CAPI / Instagram / Google Sheets integratsiyalari, Telegram userbot/bot.
- **Qat'iy qoida:** amoCRM tokenlari, webhooklar, field ID'lar yoki statuslar o'zgarganda ikkala loyiha ham bir vaqtda muvofiqlashtirilishi shart! Bitta AmoCRM integratsiyasida token bekor qilinmasligi (revoked bo'lmasligi) uchun OAuth boshqaruvi markazlashgan bo'lishi kerak.
- **Qat'iy Haqiqat, Soxta Ma'lumot va Galutsinatsiyani Mutlaq Taqiqlash (Zero Hallucination & Zero Fabrication):** Barcha AI agentlar uchun yolg'on, to'qima, soxta (fictional/simulated) yoki galutsinatsiya qilingan ma'lumot, keys, narx, mijoz dialogi, fayl yo'li, kod, statistika yoki fakt yozish **MUTLAQO VA QAT'IY TAQIQLANADI**! Agar fakt manbada aniq bo'lmasa, uni to'qimasdan "Bunday ma'lumot mavjud emas" deb ochiq aytish yoki foydalanuvchidan aniqlashtirish shart. Taxminni haqiqat deb taqdim etish qat'iyan man etiladi.


## Locks

- None

## Buyruqlar

```bash
npm run dev           # localhost:9002
npm run verify        # Sifat va Agent Harness tekshiruvi (docs/HARNESS.md)
npm run verify:fast   # Tezkor harness (i18n + kod standartlari + Vitest)
npm run build         # Build tekshirish
git push origin main  # Deploy (Vercel Integration orqali)
```

## Stack

```
Framework:  Next.js 16 (App Router)
Runtime:    React 19
Styling:    Tailwind CSS + ShadCN UI
CMS:        Sanity (project: h6ymmj0v, dataset: production)
Deploy:     Vercel (Git Integration)
i18n:       4 til: uz, ru, en, zh — src/locales/
Animations: Framer Motion
```

## Sahifalar

| URL | Fayl | Tavsif |
|---|---|---|
| `/[lang]/` | `src/app/[lang]/page.tsx` | Bosh sahifa |
| `/[lang]/xizmatlar/` | xizmatlar | 6 ta xizmat |
| `/[lang]/narxlar/` | `src/app/[lang]/narxlar/` | **Narxlar sahifasi** — matni `src/lib/sales-content.ts` da. Tegishdan oldin [`docs/NARXLAR.md`](docs/NARXLAR.md) ni o'qing |
| `/[lang]/credentials/` | `src/app/[lang]/credentials/` | Sotuvchi taqdimoti (slaydlar + PDF). Xuddi shu `sales-content.ts` dan o'qiydi |
| `/[lang]/blog/` | Markdown blog (`src/posts`); Sanity post schema migration uchun tayyor | |
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

0. **Narx yoki sotuv matniga tegishdan oldin [`docs/NARXLAR.md`](docs/NARXLAR.md) ni o'qing.**
   U `/narxlar` sahifasining hozirgi holatini, barcha narxlarni, paket tarkibini,
   kafolatlarni va egasining uslub talablarini bir joyda saqlaydi. Narxlar JSX'da
   emas, `src/lib/sales-content.ts` da — `/narxlar` va `/credentials` ikkalasi
   shu bitta fayldan o'qiydi.


1. **Tillar** — barcha matnlar `src/locales/uz.json` (va boshqa til fayllar) da. To'g'ridan-to'g'ri string yozma.
2. **i18n pattern** — `dictionary.section_name.key`
3. **Rasmlar** — `next/image`, CDN: `cdn.sanity.io` yoki `public/`
4. **Animatsiyalar** — `framer-motion`, `motion.div` bilan
5. **Responsive** — Mobile-first, Tailwind: `sm:`, `md:`, `lg:`
6. **TypeScript** — `ignoreBuildErrors: false` (tip xatosi build'ni to'xtatadi). Server log uchun `console.log` emas, `logger` (`src/lib/logger.ts`)
7. **Yangi section** — `src/components/sections/` ichiga, `export default FC<Props>`
8. **Tailwind class birlashtirish** — `cn()` utility
9. **Uzbek-first Policy** — O'zbek tili saytimizning asosiy tili hisoblanadi. Har qanday matn, xususiyat yoki o'zgarish birinchi navbatda o'zbek tilida (`uz.json` faylida) amalga oshiriladi, so'ngra boshqa 3 ta tilga (`ru.json`, `en.json`, `zh.json`) tarjima qilinadi. Har bir o'zgarish birinchi o'zbek tilda joriy etilishi shart.
10. **Agent Log Majburiyati** — Har bir o'zgarish, qadam va jarayon holati mutlaqo `DEV_LOG.md` fayliga yozib, yangilab ketilishi SHART. Bu qoida barcha AI agentlar (Codex, Claude, Devin, Cursor, Gemini va boshqalar) uchun qat'iy majburiydir! Loyihadagi boshqa agentlar sinxron ishlashi uchun doimo loglarni yangilang.
11. **Narxlash Algoritmi (Kaskad + Arboun)** — Mijozlarga narx hisoblash qat'iy kaskad tizimiga asoslanadi: (1) Barchaga avtomatik 10% Istisno chegirmasi (2) 100% oldindan to'lov bo'lsa qoldiqdan 10% Salom chegirmasi (3) Promokod bo'lsa oxirgi qoldiqdan yana 10%. Barcha chegirmalar 24 soat ichida to'lov qilinganda amal qiladi. Agar ulgurmasa, $50 to'lab 3 kunga muzlatish (Arboun) taklif qilinadi.

## Muhit o'zgaruvchilari

```
NEXT_PUBLIC_SANITY_PROJECT_ID=h6ymmj0v
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_OISHA_API_URL=https://oisha-master-bot-...run.app
```

## NotebookLM Integratsiya

AI agentlar loyiha kontekstini samarali olish uchun **NotebookLM MCP server** dan foydalanishi mumkin.

- **Notebook nomi**: `jonbranding-dev-context`
- **MCP server**: `notebooklm-mcp-cli` (v0.8.6)
- **Foydalanish**: Katta kontekst kerak bo'lganda, fayllarni qayta o'qish o'rniga NotebookLM ga savol bering
- **CLI**: `nlm` buyrug'i orqali notebook yaratish, source qo'shish, savol berish mumkin
- **Eslatma**: Unofficial tool — Google rasmiy API si emas

## Eslatmalar

- `DEV_LOG.md` — push qilganda avtomatik yangilanadi
- TypeScript: `FC<Props>` pattern ishlating

## JonBranding AI Memory Pack

Barcha AI agentlar (Claude, Gemini, ChatGPT va boshqalar) **JonBranding agentligi** kontekstida harakat qilishi uchun qat'iy ko'rsatmalar:

1. **System Prompt**: Har qanday vazifada avval `jonbranding_ai_memory_pack/jonbranding_ai_memory_pack/02_AI_Agent_System_Prompt.md` faylidagi uslub, yondashuv va maqsadlarga rioya qiling.
2. **Master Context**: Biznes, Baxtiyorjon, maqsadlar, qadriyatlar va xizmatlar haqidagi ma'lumotlar uchun `jonbranding_ai_memory_pack/jonbranding_ai_memory_pack/01_JonBranding_Master_Context.md` faylini o'qib chiqing va shu asosda qaror qabul qiling.
3. **Agent Roles**: Maxsus vazifalar (Sales, PM, Finance, Content) uchun `07_AI_Agent_Roles.md` dagi agent profillariga moslashing.
4. Javoblar doimo **qisqa, amaliy, tadbirkor tilida** va **Baxtiyorjonni operatsiyadan chiqarish** hamda **$10K/oy, $300K/yil maqsadlariga xizmat qilish** tamoyillariga mos bo'lishi shart!

## AI agent skills — Barcha Agentlar Uchun Majburiy Foydalanish (Antigravity, Codex, Claude, Cursor)

Repo ichidagi `.agents/skills/` va `.claude/skills/` barcha AI agentlar uchun umumiy skill manbasi hisoblanadi.
Har qanday frontend, UI/UX, animatsiya, sahifa yoki komponent ustida ishlaganda har bir agent quyidagi **Master Design & Craftsmanship Protocol**ga qat'iy amal qilishi SHART:

### 1. Vizual Uslub va Yo'nalish (Conception & Mood)
- `.agents/skills/design-taste-frontend/SKILL.md` — Premium, brend xarakteriga ega va shablondan butunlay xoli frontend.
- `.agents/skills/ui-craft/SKILL.md` — Discovery bosqichi, anti-slop qoidalari, proporsiyalar va qulay iyerarxiya.
- `.agents/skills/ui-craft-editorial/SKILL.md` — **Jon Branding agentligi uchun asosiy uslub:** Jurnal estetikasi, nafis serif shriftlar, katta bo'shliqlar (whitespace) va yuqori darajadagi brending taqdimoti.
- `.agents/skills/ui-craft-minimal/SKILL.md` — Linear/Notion uslubidagi toza monoxrom, nozik chegaralar (hairline borders).
- `.agents/skills/ui-ux-pro-max/SKILL.md` — 50 ta uslub, 21 ta rang palitrasi va 50 ta font pairing intellekti.

### 2. 60-30-10 Rang va Tipografiya Arxitekturasi
- `.agents/skills/colorize/SKILL.md` — Rang strategiyasi:
  - **60% Fon:** Toza oq `#FFFFFF` (`--at-bg`, `--paper`).
  - **30% Struktura:** To'q qora siyoh `#0A0B0E` (`--at-ink`), neytral matn `#4B5563`, nozik chegaralar `#E5E7EB`.
  - **10% Elektr Aksent:** Elektr ko'k `#2554FF` (`--at-accent`), hover `#1D4ED8`. Boshqa ranglar bilan bulg'anmaslik.
- `.agents/skills/tokens/SKILL.md` — 3 qatlamli tokenlar tizimi.
- `.agents/skills/kinetic-typography/SKILL.md` — Display sarlavhalarga split-text va dinamik xarakter berish.
- **Qat'iy Tipografiya Qoidasi:** `Instrument Serif` kursiv sarlavhalarida sun'iy qalinlashuv (synthetic/faux-bold) taqiqlanadi (`h1 em, h2 em { font-weight: 400; }`). Display shriftlar 72px–88px bilan cheklanadi.

### 3. Animatsiya va Oqim (Motion & Interaction)
- `.agents/skills/ui-animation/SKILL.md` — Framer Motion orqali 60fps tezlikdagi prujinali (spring) o'tishlar.
- `.agents/skills/gsap-scrolltrigger/SKILL.md` va `.agents/skills/gsap-timeline/SKILL.md` — Skroll bilan sinxronlashgan AWWWARDS darajasidagi animatsiyalar, pinning va sekinlashtirilgan xarakterli rotatsiyalar (hover'da to'xtaydigan).
- **Qat'iy Motion Qoidasi:** Layout siljishiga sabab bo'luvchi `transition: all`, `width`, `height` o'tishlari taqiqlanadi; faqat GPU `transform` va `opacity` ishlatiladi.

### 4. Anti-AI-Slop Filtrlash (Zero Tolerance)
- `.agents/skills/impeccable/SKILL.md` — Sun'iy, shablon AI dizayn illatlarini yo'qotish.
- Ish tugagach, har bir agent detektor skriptini ishga tushirishi shart:
  ```bash
  node .agents/skills/impeccable/scripts/detect.mjs
  ```
  Ishlab chiqarish kodida aniqlangan qoidabuzarliklar soni **0** bo'lishi shart!

### 5. Sifat Nazorati va Pre-Ship Gate
- `.agents/skills/finalize/SKILL.md` — 10 bosqichli yakuniy sifat tekshiruvi.
- `.agents/skills/heuristic/SKILL.md` — Nilsonning 10 ta UX qonuni asosidagi baholash.
- `.agents/skills/responsive-design/SKILL.md` va `accessibility/` — Mobil (375px), Planshet (768px), Desktop (1280px+) va WCAG 2.5.8 (touch targets >= 44px) standartlari.
- Har qanday o'zgarishdan keyin repo testlari yashil bo'lishi shart:
  ```bash
  npm run verify:fast
  npm run verify
  ```

## Obsidian "Ikkinchi Miya" Qoidalari (Barcha Agentlar Uchun!)

Barcha AI agentlari (Claude, Cursor, ChatGPT, Gemini, Antigravity) Baxtiyorjon yoki uning loyihalari (JonBranding, Oisha va hk) haqida har qanday yangi ma'lumot, qoida, arxitektura yoki xulosa olsa, buni avtomatik tarzda **Obsidian Vault** ga (MCP Server orqali yoki to'g'ridan-to'g'ri `obsidian-vault/` papkasiga) kiritib qo'yishi **SHART**. Siz topgan yechimlar faqat hozirgi chatda qolib ketmasin, doimo "Ikkinchi Miya"ga yozib borilsin!

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


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
