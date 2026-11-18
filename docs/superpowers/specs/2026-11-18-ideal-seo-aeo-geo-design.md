# Ideal SEO, AEO va GEO Arxitektura Dizayni (`jonbranding.uz`)

- **Sana:** 2026-11-18
- **Holat:** Tasdiqlangan (foydalanuvchi tasdig‘i: `"ha"`, 2026-11-18)
- **Asos manbalar:** `docs/seo/gsc-2026-10.md`, `docs/SEO_AEO_GEO_OPERATIONS.md`, `docs/FAKTLAR.md`, `src/lib/sales-content/`

---

## 1. Maqsad va Chegaralar

### Maqsad
`jonbranding.uz` saytini Google Search (SEO), Google AI Overviews / Featured Snippets (AEO) va ChatGPT Search / Perplexity / Gemini / Claude (GEO) qidiruv tizimlari uchun eng yuqori texnik, tuzilmaviy va kontent tayyorgarligiga olib chiqish — bunda barcha faktlar, narxlar, muddatlar, mijoz sonlari va FAQ lar faqat rasmiy tasdiqlangan manbalardan (`company-facts.ts`, `sales-content/*`, `patent-certificates.ts`) olinadi.

### Anti-Goals & Qat’iy Cheklovlar
- **Nol uydirma (Zero Fabrication):** Yangi mijoz, uydirma review/reyting (`AggregateRating`), tasdiqlanmagan statistika yoki qo‘lda yozilgan narx kiritilmaydi.
- **Yashirin schema yo‘q:** Har bir `FAQPage`, `HowTo` va `Offer` JSON-LD ma’lumoti sahifaning ko‘rinadigan HTML DOM qismi bilan 1:1 mos bo‘lishi shart.
- **Uzbek-first & i18n paritet:** Barcha lug‘at o‘zgarishlari avval `src/locales/uz.json` da, so‘ng `ru.json`, `en.json`, `zh.json` da sinxron kiritiladi (`1373+` kalit pariteti saqlanadi).
- **2026-11-18 ishchi daraxtdagi Cloudflare KV/ISR tuzatishlarini saqlash:** Mavjud uncommitted KV/DO cache, `image-loader.ts` va `portfolio/[slug]` tuzatishlariga ziyon yetkazilmaydi.
- **Tashqi/billing cheklovi:** Google Search Console (`sitemap.xml` + `feed.xml` allaqachon yuborilgan va `Успешно`), tashqi backlinklar, Google Business Profile hamda Cloudflare Workers Paid (\$5/oy) to‘lov qarorlari alohida operatsion ro‘yxatda ko‘rsatiladi.

---

## 2. Arxitektura Qismlari

### Paket A — Texnik SEO, Schema Gigiyenasi & `500`/`404` Bartaraf Etish
1. **Bosh sahifa (`src/app/[lang]/page.tsx`, `src/components/home-component.tsx`):**
   - Muammo: `page.tsx` JSON-LD ichida `dictionary.answerHub.items` ni chiqaradi, lekin `HomeComponent` umuman boshqa savollar ro‘yxatini (`<AtFaq />` → `salesFlow.faq.faqs`) render qiladi.
   - Yechim: `HomeComponent` ichida `<AtAnswerHub />` (yoki `<AtFaq />` va `answerHub` qamrovi) ko‘rinadigan holga keltiriladi va `page.tsx` dagi `FAQPage` JSON-LD faqat sahifada haqiqatan ko‘rinadigan savol-javoblar (`[...salesFlow.faq.faqs, ...answerHub.items]` agar ikkalasi ko‘rinsa, yoki aniq ko‘rinadigan bloki) bilan 1:1 moslanadi.
   - Bosh sahifada GEO/AEO uchun AI tizimlar iqtibos oladigan ixcham xizmatlar va muddatlar solishtirma bloki (`Logotip` vs `Firma uslubi` vs `Brendbuk` vs `Qadoq`) hamda xizmat sahifalariga aniq ichki havolalar ko‘rsatiladi.
2. **Double-title tuzatishi (`src/app/[lang]/otzivlar/page.tsx`):**
   - Sarlavhalar `pageTitle()` dan o‘tkaziladi (endi `| Jon.Branding | Jon.Branding` chiqmaydi) va `CollectionPage` JSON-LD qo‘shiladi.
3. **Blog rasm `404` & Draft xavfsizligi (`src/posts/uz/den-aroma-case-study.md`, `src/lib/blog-markdown-index.json`, `src/app/[lang]/blog/page.tsx`):**
   - `404` qaytarayotgan `photo-1541643600914-78b084683702` havolasi haqiqiy `/images/cms/denaroma-hozir.webp` ga almashtiriladi.
   - `blog/page.tsx` Sanity query’siga `!(_id in path("drafts.**"))` filtri qo‘shiladi.
4. **Navigator `500`/`503` yopilishi (`src/app/[lang]/navigator/natija/page.tsx`, `src/app/[lang]/navigator/muammo/[slug]/page.tsx`):**
   - `natija/page.tsx` dan ishlatilmaydigan `searchParams` prop’i olinib statik prerender qilinadi (`500` yo‘qoladi). `navigator/muammo/[slug]/page.tsx` ga `generateStaticParams` / `revalidate = 3600` qo‘shiladi (`robots: noindex` saqlangan holda).

### Paket B — GSC Yuqori Salohiyatli Tijoriy Sahifalar (AEO + CTR)
1. **`/xizmatlar/neyming` (`uz`, `ru`, `en`, `zh`) — eng yuqori GSC o‘rinlari (`4.0`–`7.1`):**
   - `neyming/layout.tsx`: `getPageAlternates(safeLang, '/xizmatlar/neyming')` bilan `x-default` hreflang tiklanadi.
   - `src/locales/*.json` (`namingPage.metadata`, `namingPage.facts`): `uz`, `ru`, `en`, `zh` da `{price}`, `{duration}`, `{currency}` tokenli CTR sarlavhalar va 4 ta AEO FAQ (`Nechta variant?`, `Muddat qancha?`, `Patent tekshiruvi kiradimi?`, `Neyming bosqichlari qanday?`) qo‘shiladi.
   - `neyming/page.tsx`: barcha 4 til uchun `ServiceJsonLd` (narx `Offer` + `FAQPage`) hamda `HowTo` (ko‘rinadigan `process.steps` / `process_steps` bosqichlari bilan bir xil) JSON-LD chiqariladi; `ru`/`en`/`zh` da `<LocalizedServiceFacts />` render qilinadi; `naming-client.tsx` dagi ichki havola `getLocalizedPath` ga o‘tkaziladi.
2. **`/xizmatlar/patent` (`uz`, `ru`, `en`, `zh`):**
   - `src/locales/*.json` (`patentPage`): `ru`, `en`, `zh` tillari uchun mahalliylashtirilgan `metadata`, hero/answer-first ta’rif va `patentCalculatorPage.faq` + `sales-content` asosidagi `facts` qo‘shiladi (yoki `patent/page.tsx` `ru`/`en`/`zh` da `LocalizedServiceFacts` + tarjima qilingan kirish va taqqoslash jadvalini ko‘rsatadi, `uz` da to‘liq `ServiceLanding` + guvohnomalar saqlanadi).
   - `patent/page.tsx` `metadata` har til uchun o‘z tilida (`"Регистрация товарного знака (патента) в Узбекистане — цены и сроки"` va h.k.) va `ServiceJsonLd` (`Offer` + `FAQPage`) bilan beriladi.
3. **`/xizmatlar` (`src/app/[lang]/xizmatlar/page.tsx`, `xizmatlar-interactive.tsx`):**
   - GSC `"брендинг ташкент"` (`9.3`), `"брендинговое агентство ташкент"` (`10.4`), `"brending agentligi Toshkent"` so‘rovlari uchun yuqori CTR `metadata` (`keywords` + `description` + `title`).
   - `CollectionPage` + `OfferCatalog` JSON-LD (barcha xizmatlar ro‘yxati va manba narxlari bilan) hamda ko‘rinadigan **"Qaysi xizmat kimga va qachon kerak?"** solishtirma jadvali + 4 tilda Q&A / `FAQPage`.
4. **`/brand-strategy`, `/xizmatlar/car-wrap-design`, `/xizmatlar/posm-materiallar`:**
   - `brand-strategy/page.tsx`: inline `Organization` o‘rniga `@id: ORGANIZATION_ID` ulanadi; `BrandStrategyClient` dagi ko‘rinadigan `FAQS` (`data.ts`) asosida `FAQPage` JSON-LD qo‘shiladi.
   - `car-wrap-design/page.tsx`: `getPageAlternates(..., '/xizmatlar/car-wrap-design')` (`hreflang` + `x-default`) va `ServiceJsonLd` (ko‘rinadigan `carWrapPage.faq.items` bilan) qo‘shiladi.
   - `posm-materiallar/page.tsx`: `ServiceJsonLd` (ko‘rinadigan `posm.faq.items` va `pricing.tiers` narxlari bilan) qo‘shiladi.

### Paket C — GEO (AI Search & Entity Graph) & Konversiya Sahifalari
1. **Rich Entity Graph (`src/lib/seo.ts`):**
   - `getSiteEntityGraph(locale)` ichida `foundingDate: '2018-11-27'`, `email`/`contactPoint`, va `hasOfferCatalog` da barcha asosiy xizmatlar (`Brand Strategy`, `Naming`, `Logo Design`, `Corporate Identity`, `Brandbook`, `Packaging`, `Trademark Registration`, `Car Wrap`, `POSM`) mahalliylashtirilgan nom va URL bilan bog‘lanadi.
   - `ServiceJsonLd` (`src/components/structured-data/service-json-ld.tsx`) ixtiyoriy `priceValue` / `priceCurrency` (`UZS`) orqali tasdiqlangan `Offer` chiqaradi.
2. **Conversion & Proof sahifalari (`/narxlar`, `/portfolio`, `/haqimizda`):**
   - `narxlar/page.tsx`: `getSalesContent(safeLang)` dan `OfferCatalog` (`Standart`, `Premium`, `VIP` + xizmatlar) va ko‘rinadigan `content.faqs` uchun `FAQPage` JSON-LD chiqariladi; breadcrumb matnlari 4 tilda lokalizatsiya qilinadi.
   - `portfolio/page.tsx`: `CollectionPage` + `ItemList` JSON-LD (ko‘rinadigan loyihalar ro‘yxati) va `BreadcrumbList`.
   - `haqimizda/page.tsx` + `haqimizda-client.tsx`: AI qidiruvlar uchun ko‘rinadigan qisqa **"Jon.Branding haqida ko‘p so‘raladigan savollar"** (`foundedYear`, `clientsLabel`, `projectsLabel`, joylashuv, aloqa) va `FAQPage` JSON-LD (`AboutPage` + `ORGANIZATION_ID` bilan ulangan).
3. **`public/llms.txt`:**
   - `/xizmatlar/patent`, `/expert-tekshiruv`, tasdiqlangan UZS narxlar diapazoni (`sales-content/uz.ts` bilan 1:1 mos) va bevosita konsultatsiya (`@baxtiyorjongaziyev`) qo‘shiladi.
