# JonBranding Website — P0–P2 project brief

## Bir sahifalik brief

**Maqsad:** sayt premium Visual Identity System xizmatiga malakali lead olib keladi va leadni manbasi bilan AmoCRM/Telegramga yetkazadi.

**Asosiy offer:** logotip va firma uslubi + brendbuk + qadoq/tashuvchilar. Naming, patent va digital dizayn — add-on. Brand Audit/Tashxis — kirish mahsuloti, flagman offer emas.

**Asosiy auditoriya:** o‘sayotgan o‘rta biznes, ishlab chiqaruvchi, retail, oziq-ovqat, qurilish, ta’lim va tibbiyot kompaniyalari; qaror qabul qiluvchi owner yoki rahbar.

**Sahifalar vazifasi:** Homepage offerni 5 soniyada tushuntiradi va portfolio/suhbatga yo‘naltiradi. Narxlar scope, paket va to‘lov shartlarini aniqlashtiradi. Portfolio muammo → yechim → tizim → natija orqali isbotlaydi. Diagnostika ehtiyojni aniqlaydi va CRMga taklif qilinadigan xizmatlarni yuboradi. Admin KP Builder sotuvchiga standart narx va chegirma bilan taklif tayyorlaydi.

**Lead flow:** CTA → modal/diagnostika → validatsiya va spam himoyasi → Telegram + AmoCRM parallel → analytics → xato bo‘lsa Firestore queue → health/retry.

**Success metrics:** lead delivery success, qualified lead rate, booked call rate, proposal sent rate, won revenue, source/offer/CTA bo‘yicha conversion.

## Roadmap

### P0 — Savdo va ishonch

- Homepage’da flagman offerni asosiy qilish.
- Hero LCP’ni deterministik qilish.
- Xizmatlarni 3 ta asosiy natijaga yig‘ish.
- Lead taxonomy va UTM’ni CRM/Telegramga uzatish.
- Dalilsiz 500+/1000+ claimlarni production narxlar sahifasidan olib tashlash.

### P1 — Operatsion nazorat

- AmoCRM health endpoint orqali token, live API va failed queue holatini ko‘rish.
- Pending leadlarni xavfsiz qayta yuborish endpointi.
- Claim proof map va publish gate.
- Portfolio case’larni muammo → yechim → tizim → natija formatiga o‘tkazish.

### P2 — Sotuvchini tezlashtirish

- Admin KP/Invoice Builder MVP.
- 10% + 10% + 10% kaskad va $50/3 kun Arboun qoidasi.
- Copy/print-ready tijorat taklifi.
- Keyingi bosqich: serverda saqlash, PDF, invoice raqami va CRM deal bilan bog‘lash.

## 7 kunlik sprint

| Kun | Natija | Mas’ul |
|---|---|---|
| 1 | Offer, hero, 3 xizmat | Owner + Developer |
| 2 | Lead taxonomy va UTM | Developer + Performance |
| 3 | AmoCRM health/retry | Developer + Sales Ops |
| 4 | Claim proof map, claim cleanup | PM + Content |
| 5 | KP Builder MVP | Developer + Sales |
| 6 | Mobile, accessibility, form QA | QA + Developer |
| 7 | Build, production smoke, funnel checklist | PM + Developer |

## 30 kunlik sprint

1. 6 ta kuchli case’ni yagona storytelling formatida chiqarish.
2. GA4/AmoCRM dashboardda source → qualified → sale funnelini ko‘rsatish.
3. KP Builder’ga saqlash, PDF, invoice raqami va CRM deal ID qo‘shish.
4. Homepage/modal A/B test: “Loyihani muhokama qilish” va “Tashxisdan boshlash”.
5. Har hafta failed queue, form conversion va top CTA review.

## Kim nima qiladi

| Rol | Javobgarlik |
|---|---|
| Owner | Offer, minimal chek, claim va case nashriga final qaror |
| PM | Scope, deadline, claim dalili, case materiallari va acceptance |
| Sales | Lead qualification, KP yuborish, follow-up va CRM status |
| Developer | Forma, analytics, CRM delivery, health/retry, QA |
| Content | Tasdiqlangan claim, case matni va 4 til |
| Art Director | Portfolio tanlovi, vizual sifat, case’ning tizim sifatida ko‘rinishi |
| Performance | UTM standarti, kampaniya naming va conversion tahlili |

## Ownerdan kerak bo‘ladigan qarorlar

- Firma uslubi uchun minimal loyiha cheki.
- 3 asosiy paketning final scope’i va nomi.
- “3 konsepsiya” qaysi paketlarda majburiyligi.
- Qaysi 6 ta case birinchi navbatda qayta yozilishi.
- 2019, mijoz va loyiha soni uchun ishonchli dalil manbasi.
- Brand Audit bepul qoladimi yoki pullik diagnostikaga olib boradimi.
- KP Builder’dagi valyuta kursi va invoice rekvizitlari.
