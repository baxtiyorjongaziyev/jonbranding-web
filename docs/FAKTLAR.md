# Jon.Branding — rasmiy faktlar

Saytdagi yil, tajriba, mijoz va loyiha raqamlari uchun **yagona manba**.
Egasi tasdiqlagan: Baxtiyorjon Gaziyev, 2026-yil oktabr.

## Asosiy raqamlar

| Fakt | Qiymat | Izoh |
|---|---|---|
| Professional faoliyat boshlangan sana | **2018-yil 27-noyabr** | Agentlik ham, asoschi ham shu sanadan hisoblanadi |
| Tajriba | **To'liq yillar soni + "+"** | Avtomatik hisoblanadi: 2026-yil 27-noyabrgacha "7+", shu kundan "8+", va hokazo |
| Mijozlar | **600+** | Ish topshirilgan mijozlar |
| Loyihalar | **1200+** | Topshirilgan loyihalar |

Alohida ko'rsatkich (yuqoridagilar bilan aralashtirilmaydi):
- **240+ tashxis** — o'tkazilgan brend tashxislari soni (`atelier.hero_stat_conducted_val`, kafolat bloki).

## Kodda qanday ishlatiladi

- Raqamlar: `src/lib/company-facts.ts`
  - `FOUNDED_AT`, `FOUNDED_YEAR`, `CLIENTS_COUNT`, `PROJECTS_COUNT`
  - `yearsOfExperience()`, `yearsLabel()` → `"7+"`, `clientsLabel` → `"600+"`, `projectsLabel` → `"1200+"`
- TSX'da: `import { yearsLabel, clientsLabel, projectsLabel, FOUNDED_YEAR } from '@/lib/company-facts'`
- Lug'atda (`src/locales/*.json`) raqam qattiq yozilmaydi, belgi ishlatiladi:
  - `{{years}}` → tajriba (`7+`)
  - `{{clients}}` → `600+`
  - `{{projects}}` → `1200+`
  - `{{founded}}` → `2018`
  
  Belgilarni `getDictionary()` (`src/lib/dictionaries.ts`) to'ldiradi.
  Lug'atni `getDictionary` siz to'g'ridan-to'g'ri import qiladigan fayl (masalan `sales-flow.ts`)
  bu belgilarni ishlatadigan bo'limni o'qisa, `fillFacts()` ga o'rash shart.

## Qoidalar

1. Raqam o'zgarsa — faqat `company-facts.ts` va shu faylni yangilang. Matnlarga qo'lda yozmang.
2. "9 yil", "2017", "2019", "500+ mijoz", "240+ loyiha", "120+ brend" kabi eski raqamlar **noto'g'ri**, qaytarilmasin.
3. Statik sahifalar raqamni build vaqtida hisoblaydi — 27-noyabrdan keyingi birinchi deploy'da yangi yil chiqadi.
