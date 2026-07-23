# jonbranding-web — AGENTS.md

## Loyiha haqida

**jonbranding.uz** — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-sayt.

- **Deploy**: Vercel — `git push origin main` qilganda avtomatik (yoki Vercel CLI)
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sanity CMS, Vercel
- **GitHub**: `baxtiyorjongaziyev/jonbranding-web`

## Locks

- None

## Buyruqlar

```bash
npm run dev        # localhost:9002
npm run build      # Build tekshirish
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

1. **Tillar** — barcha matnlar `src/locales/uz.json` (va boshqa til fayllar) da. To'g'ridan-to'g'ri string yozma.
2. **i18n pattern** — `dictionary.section_name.key`
3. **Rasmlar** — `next/image`, CDN: `cdn.sanity.io` yoki `public/`
4. **Animatsiyalar** — `framer-motion`, `motion.div` bilan
5. **Responsive** — Mobile-first, Tailwind: `sm:`, `md:`, `lg:`
6. **TypeScript** — `ignoreBuildErrors: true` (build'da xato o'tadi, lekin yaxshi yoz)
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
