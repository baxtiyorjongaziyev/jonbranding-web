# Keys nomlari standarti

Portfolio keyslarining nomi saytning hamma joyida (kartochka, keys sahifasi, Google, AI javoblari)
bir xil va tushunarli bo'lishi uchun. Kod: `src/lib/case-naming.ts`, test: `src/lib/case-naming.test.ts`.

## 1. Sarlavha (`title`)

**Format:** `{Brend} — {ish turi}`

| Til | Misol |
|---|---|
| uz | Rash Milk — qadoq dizayni |
| ru | Rash Milk — дизайн упаковки |
| en | Rash Milk — packaging design |
| zh | Rash Milk — 包装设计 |

Qoidalar:
- Ajratuvchi — faqat **` — `** (bo'shliq, uzun tire, bo'shliq). Ikki nuqta `:` ishlatilmaydi.
- **Ish turi** — kategoriyaning rasmiy nomi (pastdagi jadval), uz/ru/en'da kichik harf bilan.
  O'zimizcha "Premium", "Rebrending va Identika", "Samarqand xarakterida..." kabi so'zlar yozilmaydi.
- Uzunligi — **48 belgigacha**.
- `!`, `?`, qo'shtirnoq, emoji — yo'q. "Keys" so'zi ham yozilmaydi (sahifaning o'zi keys).
- Bitta keysda bir nechta ish qilingan bo'lsa — asosiysi (eng katta hajmlisi) yoziladi.
  Qolganlari teglarda va keys matnida.

Kod: `buildCaseTitle(brand, category, lang)`.

## 2. Brend (`client`)

- Brend **logotipda qanday yozilsa, shunday**: `Rash Milk`, `Fidda by Sevara`, `Shirona Café & Bakery`.
- Yuridik shakl yozilmaydi: ~~MChJ~~, ~~XK~~, ~~ООО~~, ~~LLC~~.
- **4 tilda bir xil** — brend nomi tarjima qilinmaydi va transliteratsiya qilinmaydi.
- Mijoz nomi faqat tasdiqlangan keysdan olinadi (`content-integrity.test.ts`).

## 3. Kartochkadagi nom

Kartochkada faqat **brend** ko'rinadi (`caseBrandName(title)` → `Rash Milk`).
Ish turi kartochkada alohida yorliq bo'lib chiqadi, shuning uchun takrorlanmaydi.

## 4. Kategoriyalar (rasmiy nomlar)

| `category` | uz | ru | en | zh |
|---|---|---|---|---|
| `brand-strategy` | Brend-strategiya | Бренд-стратегия | Brand strategy | 品牌战略 |
| `logo-design` | Logotip dizayni | Дизайн логотипа | Logo design | 标志设计 |
| `brandbook` | Brendbuk | Брендбук | Brandbook | 品牌手册 |
| `corporate-style` | Firma uslubi | Фирменный стиль | Corporate identity | 企业形象 |
| `packaging` | Qadoq dizayni | Дизайн упаковки | Packaging design | 包装设计 |
| `naming` | Neyming | Нейминг | Naming | 命名 |

`categoryLabel` maydoni shu jadvaldagi nom bilan bir xil bo'ladi.

## 5. Manzil (`slug`)

- Faqat brend, lotin harflarda, kichik harf, so'zlar orasida `-`: `rash-milk`, `den-aroma`.
- Ish turi slug'ga yozilmaydi — keys keyinroq kengaysa ham manzil o'zgarmaydi.
- E'lon qilingan slug **o'zgartirilmaydi** (o'zgarsa — eski manzildan 308 yo'naltirish).

## 6. SEO sarlavha (`metaTitle`) — ixtiyoriy

- Google uchun kengroq: `{Brend} — {ish turi}: {asosiy natija yoki farq}`, 60 belgigacha.
  Masalan: `Rash Milk — qadoq dizayni: sut mahsulotlari liniyasi`.
- Bo'sh qolsa, `title` ishlatiladi.

## 7. Qayerda tekshiriladi

- `npm test` — `case-naming.test.ts` saytdagi zaxira keyslarni (`portfolio-fallbacks.ts`) shu standartga tekshiradi.
- Portfolio-bot (`services/portfolio-bot`) Sanity'ga yozishda sarlavhani o'zi shu formatda yasaydi
  (`caseTitle`, `cleanBrandName` — `services/portfolio-bot/src/sanity.ts`).
- Sanity'da qo'lda kiritilgan eski keyslar avtomatik o'zgarmaydi — ularni Studio'da shu qoida bo'yicha tahrirlash kerak.
