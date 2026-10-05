# JonBranding Web Sayti — Product Requirements Document

**Status:** Draft  
**Product:** jonbranding.uz  
**Primary language:** O‘zbek tili  
**Last updated:** 2026-09-29

## 1. Mahsulot maqsadi

JonBranding saytini Markaziy Osiyodagi premium brend-agentlik uchun asosiy
sales machine qilish:

- agentlikka bo‘lgan ishonchni oshirish;
- xizmat va paketlarni tushunarli ko‘rsatish;
- sifatli lead yig‘ish va CRM’ga yuborish;
- tashrifchini konsultatsiya yoki arizaga olib kelish;
- egasining operatsion yukini kamaytirish.

## 2. Maqsadli auditoriya

- o‘rta va yirik biznes egalari;
- marketing va brand menejerlar;
- yangi biznes boshlayotgan tadbirkorlar;
- rebranding, firma uslubi, qadoqlash yoki brandbook’ga muhtoj kompaniyalar.

## 3. Asosiy user journey

1. Tashrifchi saytga kiradi.
2. JonBranding qiymatini va asosiy taklifni tushunadi.
3. Portfolio, natijalar va testimonials orqali ishonch hosil qiladi.
4. Xizmat yoki paketni tanlaydi.
5. Narx, jarayon va kafolatlarni ko‘rib chiqadi.
6. Forma, quiz yoki konsultatsiya CTA orqali lead qoldiradi.
7. Lead CRM va xabarnoma tizimiga yuboriladi.
8. Sotuvchi follow-up qiladi.

## 4. Sahifalar

- Bosh sahifa
- Xizmatlar
- Narxlar
- Portfolio va case study’lar
- Credentials / sotuvchi taqdimoti
- Blog
- Brending testi / diagnostika
- Kontakt va konsultatsiya formasi
- Admin va CMS

## 5. Funksional talablar

### P0 — majburiy

- 4 til: `uz`, `ru`, `en`, `zh`;
- mobile-first responsive interfeys;
- asosiy CTA’lar: konsultatsiya, audit, ariza va WhatsApp/Telegram aloqa;
- forma validatsiyasi va xatolik holatlari;
- lead’ni AmoCRM’ga yuborish;
- Sanity CMS’dan portfolio va blog kontentini boshqarish;
- narxlar va paketlar uchun yagona kontent manbasi;
- SEO metadata, canonical va hreflang;
- production build va deploy xavfsizligi.

### P1 — muhim

- paket builder va narx kalkulyatori;
- brending diagnostikasi va lead qualification;
- Vimeo testimonials;
- credentials PDF yoki slayd taqdimoti;
- UTM, source, page, section va CTA tracking;
- analytics eventlari;
- accessibility: keyboard navigation, focus states, semantic labels.

### P2 — keyingi bosqich

- avtomatik lead scoring;
- interaktiv case study’lar;
- AI konsultantni chuqurroq integratsiya qilish;
- A/B testing;
- mijoz uchun shaxsiy kabinet.

## 6. Kontent va til qoidalari

- O‘zbek tili birinchi va asosiy versiya hisoblanadi.
- Yangi matn avval `src/locales/uz.json` ga yoziladi, keyin boshqa tillarga tarjima qilinadi.
- Narx va sales matnlari `src/lib/sales-content.ts` hamda tegishli hujjatlashtirilgan pricing qoidalariga mos bo‘ladi.
- Portfolio, case va biznes natijalari dalilsiz raqamlar bilan to‘ldirilmaydi.

## 7. Texnik talablar

- Next.js 16 App Router;
- React 19 va TypeScript;
- Tailwind CSS va ShadCN UI;
- Sanity CMS;
- Framer Motion;
- Vercel deployment;
- server loglari uchun `src/lib/logger.ts`;
- rasmlar uchun `next/image`;
- `ignoreBuildErrors: false`.

## 8. Muvaffaqiyat metrikalari

- form conversion: 3–5% yoki undan yuqori;
- qualified lead ulushi: 40% yoki undan yuqori;
- bosh sahifadan xizmat/narxlar sahifasiga o‘tish: 25% yoki undan yuqori;
- mobile Lighthouse Performance: 85+;
- asosiy sahifa LCP: 2.5 soniyadan kam;
- valid lead’larning CRM’ga yetib borishi: 99%+;
- duplicate lead’lar: 0 ga yaqin.

## 9. MVP chegarasi

MVP quyidagilarni qamrab oladi: bosh sahifa, xizmatlar, narxlar, portfolio,
kontakt forma, CRM integratsiyasi, 4 til, SEO metadata va analytics.

AI konsultantni kengaytirish, A/B testing, mijoz kabineti va avtomatik lead
scoring MVP’dan keyingi bosqich hisoblanadi.

## 10. Qabul qilish mezonlari

Mahsulot tayyor hisoblanadi, agar:

- barcha asosiy sahifalar 4 tilda ishlasa;
- formalar validatsiya va CRM yuborishni to‘g‘ri bajarsa;
- pricing va paketlar yagona manbaga mos bo‘lsa;
- mobil, tablet va desktop QA’dan o‘tsa;
- typecheck, lint, test va production build muvaffaqiyatli tugasa;
- SEO metadata, canonical, hreflang va analytics ishlasa;
- Vercel production deploy tekshirilsa.

## 11. Ochiq masalalar

- Yakuniy conversion va revenue target’larini owner tasdiqlashi kerak.
- Analytics uchun asosiy platforma va event naming yakuniy tasdiqlanishi kerak.
- Portfolio case’lari uchun tasdiqlangan proof/source ro‘yxati doimiy yangilanadi.
