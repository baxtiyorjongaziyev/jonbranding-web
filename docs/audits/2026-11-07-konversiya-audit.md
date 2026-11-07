# Konversiya yo'li auditi

**Sana:** 2026-11-07
**Savol:** mehmon saytga kirgandan lid qoldirguncha qayerda yo'qoladi?
**Usul:** kod (barcha CTA, forma, popup, analitika), lokal production build'dan skrinshotlar
(iPhone 13 va 1440 px desktop), har bir sahifaning sarlavha va CTA xaritasi, Amplitude ma'lumotlari.

**Cheklov:** haqiqiy konversiya raqamlari yo'q. Amplitude 4 oydan beri ma'lumot olmayapti (pastda K-2),
GA4 va Clarity'ga bu sessiyadan kirish imkoni yo'q. Shuning uchun topilmalar kod va ekran asosida.
Ta'sir kattaligini o'lchov yoqilgandan keyin tasdiqlash kerak.

---

## 1. Qisqa xulosa

Sotuv uchun asos kuchli:
- narxlar ochiq va muddat bilan berilgan: "Logotip — 8 000 000 so'm, 7 kun";
- e'tirozga to'g'ridan-to'g'ri javob bor: "Nega 8 mln, Instagramda 500 mingga logo qilishadi-ku?";
- forma qisqa: faqat telefon majburiy;
- asoschi videosi, ovozli sharhlar va 30+ keys bor.

Lidlar to'rt joyda yo'qolyapti:

1. **Mobil birinchi 15 soniya.** Cookie banner va "ilovani o'rnating" taklifi bir vaqtda chiqib,
   asosiy tugma va ishonch raqamlarini yopadi.
2. **O'lchov ko'r.** Amplitude 2026-07-11 dan beri jim. Qolgan analitika faqat cookie roziligidan keyin
   ishlaydi, GA4'ga server orqali lid uzatish kaliti esa yo'q. Natijada qaysi reklama lid olib kelayotganini
   bilib bo'lmaydi va Google Ads algoritmi to'liq signal olmaydi.
3. **CTA tarqoq.** Bosh sahifada bitta maqsad ("biz bilan bog'laning") uchun 5 xil matn va 3 xil oyna bor.
   Eng ko'zga tashlanadigan uchala tugma (header, hero, mobil panel) tashqi Oisha vidjetiga bog'liq va
   inglizcha/xitoycha mehmonga ruscha ochiladi.
4. **Narxlar juda chuqurda.** `/narxlar` mobilda ~33 ekran, paketlar sahifaning 74% chuqurligida.
   Bosh sahifada narx umuman ko'rinmaydi, portfolio ro'yxatida bitta ham "ariza" tugmasi yo'q.

---

## 2. Funnel xaritasi (hozirgi holat)

```
Kirish (reklama / qidiruv / Instagram)
   │
   ▼
Birinchi ekran ── mobil: 15 soniyada 2 ta overlay CTA'ni yopadi  ◄── K-1
   │
   ▼
Qiziqish (keyslar, narx, sharhlar) ── narx bosh sahifada yo'q, /narxlar 33 ekran  ◄── K-4, K-5
   │
   ▼
CTA bosish ── 5 xil matn, 3 xil oyna, asosiysi tashqi vidjetda  ◄── K-3
   │
   ├─► Oisha qo'ng'iroq vidjeti (header, hero, mobil panel) — natija Oisha'da, sayt analitikasida emas
   ├─► Sayt formasi "loyiha" (xizmatlar, galereya, jarayon, asoschi, FAQ)
   └─► Sayt formasi "maslahat" (final CTA, sticky)
   │
   ▼
Forma: ism (ixtiyoriy) + telefon + xizmat ── yaxshi, qisqa  ◄── K-7 (kichik tuzatishlar)
   │
   ▼
"Arizangiz qabul qilindi" ── qachon qo'ng'iroq bo'lishi va keyingi qadam aytilmagan  ◄── K-7
   │
   ▼
amoCRM + Telegram ── GA4 server uzatish o'chiq, Meta Oisha CAPI orqali ishlaydi  ◄── K-2
```

---

## 3. Topilmalar

### K-1 (P0). Mobil: birinchi soniyalarda overlay'lar asosiy tugmani yopadi

**Dalil:** iPhone 13, bosh sahifa, 16-soniya. Ekranning pastki yarmini ikki oyna birga yopib turadi:
- **cookie banner** — 189 px, "Rad etish / Qabul qilish";
- uning ostida **PWA taklifi** — 162 px, "Jon.Branding ilovasi — telefoningizga o'rnating".

Natijada "Loyihani muhokama qilish" tugmasi va "7+ yil · 600+ mijoz · 1200+ loyiha" raqamlari ko'rinmaydi.

Doimiy suzuvchi elementlar ham bor: pastki panel (4 tugma), Oisha chat, Oisha qo'ng'iroq vidjeti,
`/xizmatlar` va blogda 45–90 soniyadan keyin Oisha proaktiv xabari. Tab sarlavhasi esa "(1) Yangi xabar!"ga
o'zgaradi.

**Biznesga ta'siri:** reklamadan kelgan mehmon birinchi soniyalarda taklifni emas, texnik oynalarni ko'radi.
Agentlik saytini "ilova qilib o'rnatish" sabab yo'q — bu taklif faqat diqqatni tortib oladi.

**Yechim:**
- PWA taklifini avtomatik ko'rsatmaslik. Faqat menyuda "Ilovani o'rnatish" bandi qolsin.
- Cookie bannerni bir qatorli pastki chiziqqa aylantirish: CTA va pastki panelni yopmasin, panel ustida tursin.
- Bir vaqtda bittadan ortiq suzuvchi vidjet bo'lmasin. Mobilda Oisha chat tugmasi pastki paneldagi
  "AI Yordamchi" bilan takrorlanadi.

### K-2 (P0). O'lchov ko'r: qaysi kanal lid olib kelayotgani noma'lum

**Dalil:**
- **Amplitude** (project 789774): oxirgi 90 kunda birorta ham event yo'q, oxirgi sahifa ko'rish 2026-07-11.
  `@amplitude/analytics-browser` paketi o'rnatilgan, lekin kodda hech qayerda chaqirilmaydi.
- **GA4, Google Ads, Meta Pixel, Clarity, Hotjar, Yandex** — hammasi faqat `cookie_consent_accepted=true`
  bo'lgandagina yuklanadi (`src/lib/analytics/loader-script.ts:52-53`, Yandex `layout.tsx:290`).
  "Rad etish" bosgan yoki bannerni yopib ketgan mehmonning konversiyasi reklama tizimlariga bormaydi.
- **Server orqali lid uzatish** (`src/lib/analytics-delivery.ts`):
  - **Meta** — Oisha CAPI orqali ishlaydi ✅ (`OISHA_CAPI_URL` Worker'da bor);
  - **GA4** — `GA_API_SECRET` talab qiladi, `docs/KOCHISH.md` ro'yxatida u yo'q → o'tkazib yuboriladi.
- **Hero CTA** Oisha vidjetini ochadi. U orqali kelgan lidlar sayt formasi statistikasiga tushmaydi.

**Biznesga ta'siri:** Google Ads "Lead" konversiyasini kam ko'radi va Smart Bidding noto'g'ri
auditoriyaga pul sarflaydi. Sayt o'zgartirishlarining samarasini o'lchab bo'lmaydi.

**Yechim (egasi qarori bilan):**
1. Worker'ga `GA_API_SECRET` qo'shish — GA4 lidni server orqali oladi.
2. Google Consent Mode v2: rozilikkacha cookie'siz signal ketadi, Google yo'qolgan konversiyalarni modellaydi.
   Bu huquqiy qaror: O'zbekiston shaxsga doir ma'lumotlar qonuni va kelajakdagi xalqaro mijozlarni hisobga olib
   tanlang.
3. Amplitude: yo ulash, yo hisobini va paketni olib tashlash. Ikki analitika tizimini yuritish shart emas,
   GA4 + Clarity yetadi.
4. Haftalik bitta jadval: manba (UTM) → lid → amoCRM'da sotuv. Lid ma'lumotida `source` maydoni bor;
   amoCRM'da UTM saqlanishini tekshirish kerak.

### K-3 (P1). CTA tarqoq: bitta maqsad, 5 xil matn, 3 xil oyna

**Dalil (bosh sahifa, desktop, yuqoridan pastga):**

| Joy | Matn | Nima ochiladi |
|---|---|---|
| Header | "20 daqiqalik bepul maslahat" | **Oisha tashqi vidjeti** (yuklanmasa — sayt formasi) |
| Hero | "Loyihani muhokama qilish" | **Oisha tashqi vidjeti** (yuklanmasa — sayt formasi) |
| Galereya | "Maslahatga yozilish" | Sayt formasi (loyiha) |
| Jarayon | "Loyihani muhokama qilish ↗" | Sayt formasi (loyiha) |
| Asoschi | "Jamoa bilan bog'lanish" | Sayt formasi (loyiha) |
| FAQ | "Jamoaga savol berish ↗" | Sayt formasi (loyiha) |
| Final | "Maslahatga yozilish ↗" | Sayt formasi (maslahat) |
| Mobil panel | Qo'ng'iroq · Telegram · AI Yordamchi · **Maslahatga yozilish** | telefon, Telegram, Oisha chat, **Oisha tashqi vidjeti** |

Eng ko'zga tashlanadigan uchala tugma — header, hero va mobil paneldagi asosiysi — tashqi Oisha vidjetini
ochadi. Vidjet faqat `uz`/`ru` tillarini qo'llaydi: `layout.tsx:307` → `data-lang={lang === 'uz' ? 'uz' : 'ru'}`.
Inglizcha va xitoycha mehmon asosiy tugmani bosganda **ruscha forma** ko'radi. Bu tugmalar orqali kelgan lidlar
sayt formasi statistikasida ko'rinmaydi.

**Biznesga ta'siri:** har xil matn har xil va'da beradi ("muhokama", "maslahat", "savol"). Mehmon nima
olishini aniq bilmaydi. Xalqaro mijoz uchun eng muhim tugma o'z tilida ishlamaydi.

**Yechim:**
- Bitta asosiy taklif — **"20 daqiqalik bepul maslahat"**. U eng aniq: vaqt va narx ("bepul") ko'rsatilgan.
  Hamma asosiy tugmalar shu matn bilan, yonida bitta ikkinchi darajali "Ishlarni ko'rish".
- Header, hero va mobil panel tugmalari `en`/`zh`da sayt formasini ochsin (Oisha `uz`/`ru` uchun qoladi).
  Yoki ikkala yo'lni 2 hafta A/B qilish — buning uchun avval K-2 kerak.

### K-4 (P1). "Narxlarimiz ochiq" — lekin bosh sahifada narx yo'q

**Dalil:** bosh sahifa 14 549 px. Narxga birinchi havola ("Xizmatlar va narxlar") 11 866 px'da, asoschi
bo'limida. Narx raqami bosh sahifada umuman yo'q. `/narxlar` sarlavhasi esa "Narxlarimiz ochiq" — bu
raqobatchilardan katta farq, lekin mehmon uni ko'rmaydi.

**Biznesga ta'siri:** reklamadan kelgan odamning birinchi savoli — "qancha turadi?". Javobni topa olmasa,
yo chiqib ketadi, yo "narx so'rash" uchun yozadi. Ikkinchi holatda menejer vaqti narx aytishga ketadi.

**Yechim — tayyor matn** (xizmatlar bo'limidan keyin bitta qator):

> **Narxlar ochiq.** Logotip — 8 mln so'm, 7 kun · Firma uslubi — 18 mln so'm · Qadoq dizayni — 12 mln so'm ·
> STANDART paket — 20 mln so'm. [Barcha narxlar →]

Raqamlar `src/lib/sales-content.ts`dan olinadi, qo'lda yozilmaydi.

### K-5 (P1). `/narxlar` juda uzun, eng kuchli bloklar oxirida

**Dalil:** desktop 20 380 px (~23 ekran), mobil ~33 ekran. Tuzilma:

| Chuqurlik | Blok |
|---|---|
| 0% | Sarlavha + tez tanlov kartochkalari ✅ |
| 10–68% | 10 ta xizmat, har birida bir xil "Ariza qoldirish" tugmasi (10 marta) |
| **74%** | **Paketlar (STANDART / PREMIUM / VIP) — "Paket arzonroq"** |
| **85%** | **"Nega arzon dizayner emas"** — shartnoma, patent, fayllar sizda |
| 90% | FAQ, final CTA |

**Biznesga ta'siri:** eng foydali taklif (paket) va eng kuchli e'tiroz javobi ("nega qimmat")ga kam odam yetib
boradi. Bir xil "Ariza qoldirish" 10 marta takrorlangani uchun ko'zga tashlanmay qoladi.

**Yechim:**
- Yangi tartib: sarlavha → tez tanlov → **Paketlar** → **"Nega arzon dizayner emas"** → xizmatlar
  (yig'iladigan ro'yxat, ochilganda tafsilot) → FAQ → final CTA.
- Tugma matnini xizmatga bog'lash: "Ariza qoldirish" o'rniga "Logotip bo'yicha maslahat",
  "Patent bo'yicha maslahat" va hokazo.

### K-6 (P1). Portfolio ro'yxatida lid tugmasi yo'q

**Dalil:** `/portfolio` (7 162 px, 30+ keys). Sahifadagi barcha tugmalar — filtr va "Keysni ko'rish".
Har kartochkada bu tugma ikki marta takrorlanadi. "Menga ham shunday kerak" degan joy yo'q.

**Biznesga ta'siri:** portfolioni ko'rayotgan odam eng "issiq" mehmon. Unga keyingi qadam taklif qilinmaydi.

**Yechim — tayyor matn** (har 6–9 keysdan keyin va sahifa oxirida):

> **Biznesingizga ham shunday ko'rinish kerakmi?** 20 daqiqada vaziyatingizni ko'rib chiqamiz va qaysi xizmat
> kerakligini aytamiz. Bepul. [20 daqiqalik bepul maslahat]

### K-7 (P2). Forma yaxshi, lekin keyingi qadam aytilmagan

**Yaxshi tomonlari:** 3 ta maydon, faqat telefon majburiy, maxfiylik izohi bor, xizmat oldindan belgilanadi.

**Kamchiliklari:**
- Sarlavha umumiy: "Ariza qoldirish". Tugma matni kuchsiz: "Bog'lanishni so'rash".
- Javob vaqti va'da qilinmagan. Yuborilgandan keyin faqat "Arizangiz qabul qilindi. Jamoamiz suhbat vaqtini
  kelishish uchun bog'lanadi." chiqadi — qachon bog'lanishi noma'lum, darhol qilinadigan qadam yo'q.
- Telegram orqali bog'lanish varianti yo'q (kod `telegram` maydonini qo'llaydi, lekin formada so'ralmaydi).

**Yechim — tayyor matn** (`[X]`ni jamoa haqiqatda bajara oladigan vaqtga almashtiring):

> Sarlavha: **20 daqiqalik bepul maslahat**
> Tugma: **Maslahatga yozilish**
> Yuborilgandan keyin: **Rahmat! Ish vaqtida [X] daqiqa ichida qo'ng'iroq qilamiz. Kutishni xohlamasangiz,
> Telegram'da yozing: @JonBranding** [Telegram'da yozish]

### K-8 (P2). `/checklist` matni brend ohangiga zid; lead-magnet popup o'lik kod

**Dalil:**
- `/checklist` (sitemap'da bor) `leadMagnet.magnets` matnidan foydalanadi: "Secret Blueprint (PDF)",
  "Raqobatchilarni 'Nokaut' qilish", "7 ta shafqatsiz xato". Lug'atda yana "Godfather Offer sirlari" va
  "Video-Masterclass" bor (`href: "#video"` — sahifalarda `id="video"` yo'q).
- `LeadMagnetPopup` faqat unga uzatilgan lug'atda (`leadMagnetPopup`) `roleSelection` bo'lsa chiqadi. Bu kalit 4 tilning hech birida yo'q,
  ya'ni popup **hech qachon ko'rinmaydi**. Ichidagi PDF havolasi `/downloads/jonbranding-checklist.pdf`
  ham mavjud emas (fayllar `public/checklists/` ichida).

**Biznesga ta'siri:** sayt pozitsiyasi — "premium firma uslubi agentligi". Agressiv info-biznes uslubidagi
so'zlar ishonchni pasaytiradi va sizning sodda, samimiy ohangingizga to'g'ri kelmaydi.

**Yechim — tayyor matn:**

> **Brendingdagi 7 ta keng tarqalgan xato (PDF)**
> Bizneslar ko'p yo'l qo'yadigan va pulga tushadigan xatolar. 5 daqiqada o'qiladi.

Popup kodi yo ishga tushiriladi (`roleSelection` va to'g'ri PDF havolasi bilan), yo olib tashlanadi.
K-1 sabab olib tashlashni tavsiya qilaman.

### K-9 (P2). Xizmat sahifalari: birinchi ekranda ish namunasi yo'q

**Dalil:** `/xizmatlar/logo-dizayni` desktop birinchi ekrani — sarlavha, narx, muddat, 2 tugma.
O'ng yarmi bo'sh, bitta ham logo namunasi yo'q. Hero tugmasidan (569 px) keyingi tugma faqat 7 574 px'da —
oradagi ~7 000 px'da (muammo, nimalar topshiriladi, sharhlar, jarayon, FAQ) CTA yo'q.

**Yechim:**
- Hero'ning o'ng tomoniga 2–3 ta logo ishi (portfolio'dan).
- Sharhlar bo'limidan keyin bitta "Logotip bo'yicha maslahat" tugmasi.

---

### K-10 (P0). "Telegram'da yozing" tugmalari yozib bo'lmaydigan kanalga olib boradi

*B bosqichda topildi.*

**Dalil:** `t.me/jonbranding` — **kanal** ("Jon.Branding Agency | Portfolio", 79 obunachi, "Preview channel").
Kanalga xabar yozib bo'lmaydi. Unga olib boradigan joylar:
- **"Aloqa" sahifasi** — Telegram kontakti va tugma;
- **mobil pastki panel** — "Telegram orqali";
- **kontakt formasi** — online-brief, quiz, uslub-test;
- **diagnostika natijasi**.

Xizmat sahifalari va taqdimotlar esa allaqachon yoziladigan `t.me/baxtiyorjongaziyev`ni ishlatadi.
Sozlamalarda ham bu ikkisi ajratilgan: `telegramPersonal` va `telegramChannel` (`src/lib/data/settings.ts`).

**Biznesga ta'siri:** "Telegram orqali yozaman" degan mijoz kanalga tushadi, yoza olmaydi va chiqib ketadi.
O'zbekistonda Telegram — eng ko'p ishlatiladigan aloqa kanali.

**Yechim (bajarildi):** kontakt tugmalari `src/lib/contacts.ts` → `TELEGRAM_CONTACT_URL`ga o'tkazildi.
Kanal faqat "kuzatish" joylarida qoldi: footer ikonkasi va `sameAs`. Qaytib qolmasligi uchun
`src/lib/contacts.test.ts` qo'riqchi testi bor.

---

## 4. Saqlash kerak bo'lgan kuchli tomonlar

- **Ochiq narx + muddat + jarayon** ("3 ta konsepsiya → tanlov → sayqal → fayllar"). O'zbekiston bozorida kam uchraydi.
- **E'tirozga to'g'ridan-to'g'ri javob** — logo FAQ'dagi "Nega 8 mln, Instagramda 500 mingga…".
- **Qisqa forma**, faqat telefon majburiy.
- **Patent kalkulyatori** — o'zi lid olib keladigan vosita.
- **Asoschi videosi va ovozli sharhlar** — shaxsiy brend orqali ishonch.
- **"Shartnoma va rasmiy to'lov", "Fayllar sizda qoladi"** — korporativ mijoz uchun muhim.

---

## 5. Bosqichma-bosqich reja

| Bosqich | Nima | Kim | Hajm |
|---|---|---|---|
| **A. O'lchov** (birinchi bo'lib) | K-2: `GA_API_SECRET`, Consent Mode qarori, Amplitude qarori, UTM → amoCRM | Egasi + kod | Kichik |
| **B. Tez tuzatishlar** | K-1 (PWA o'chirish, ixcham cookie bar), K-7 (forma matni va keyingi qadam), K-8 (`/checklist` matni, o'lik popup), K-6 (portfolio CTA) | Kod (Claude) | 1 PR |
| **C. Taklif** | K-3 (bitta CTA, en/zh uchun sayt formasi), K-4 (bosh sahifada narx qatori) | Kod + egasi tasdig'i | 1 PR |
| **D. Narxlar sahifasi** | K-5 (yangi tartib, yig'iladigan xizmatlar, aniq tugmalar), K-9 | Kod + dizayn ko'rib chiqish | 1 PR |
| **E. Natija** | A bosqichdan 2 hafta keyin: manba bo'yicha lid, forma ochildi → yuborildi nisbati | Egasi + Claude | — |

**Egasidan kerakli qarorlar:**
1. Javob vaqti va'dasi: ish vaqtida necha daqiqada qo'ng'iroq qilasiz?
2. Consent Mode v2 yoqiladimi?
3. Amplitude ulanadimi yoki olib tashlanadimi?
4. Hero tugmasi: Oisha vidjeti qoladimi (uz/ru) yoki hammasi sayt formasiga o'tadimi?


### B bosqich bajarildi (2026-11-07)

| Topilma | Nima qilindi | Tekshiruv |
|---|---|---|
| K-1 PWA | "Ilovani o'rnating" taklifi avtomatik chiqmaydi, faqat menyudagi "Ilovani o'rnatish" orqali ochiladi | Testlar eski kodda yiqiladi; mobil skrinshot 16-soniyada PWA yo'q |
| K-1 Cookie | Mobilda bitta ixcham qator (189 → 79 px), pastki panel ustida turadi va hech narsani yopmaydi. Qatlam formadan pastda | Skrinshot: "Loyihani muhokama qilish" ko'rinadi |
| K-7 Forma | Tugma "Maslahatga yozilish". Yuborilgandan keyin "Telegram'da yozish" tugmasi (yoziladigan akkaunt), 4 tilda | Unit test; mobil skrinshot |
| K-8 `/checklist` | "Secret Blueprint (PDF) / Nokaut / shafqatsiz" → "Brending chek-listi: 7 ta keng tarqalgan xato". 4 tilda "PDF" olib tashlandi (sahifa interaktiv) | Skrinshot |
| K-8 Popup | Hech qachon chiqmaydigan `LeadMagnetPopup` va uning prop zanjiri o'chirildi | Typecheck, testlar |
| K-6 Portfolio | 9-keysdan keyin va oxirida "20 daqiqalik bepul maslahat" CTA (kamida 6 keys bo'lsa), 4 tilda | 3 ta test; desktop skrinshot |
| K-10 Telegram | Kontakt tugmalari kanal o'rniga yoziladigan akkauntga | Qo'riqchi test; lokal tekshiruv |

Natija: typecheck ✅, lint ✅, testlar 492 → 502 ✅, build ✅, E2E 12/12 ✅.

**Hali ochiq:** formadagi javob vaqti va'dasi (`[X] daqiqa`) — egasi raqam bersa qo'shiladi.

### C bosqich bajarildi (2026-11-07)

| Topilma | Nima qilindi | Tekshiruv |
|---|---|---|
| K-3 Oisha tili | Oisha vidjeti skripti faqat `uz`/`ru` sahifalarda yuklanadi. `en`/`zh`da header, hero va mobil panel tugmalari o'z tilidagi sayt formasini ochadi (mavjud zaxira yo'li) | E2E: `/ru` — Oisha, `/en` — skript yo'q, forma "Free 20-minute consultation" |
| K-3 Bitta taklif | Hero va "Jarayon" tugmasi headerdagi "20 daqiqalik bepul maslahat" bilan bir xil (4 tilda). Bosh sahifadagi barcha sayt formasi tugmalari maslahat formasini ochadi (avval "Maslahatga yozilish" "Ariza qoldirish" formasini ochardi) | Lokal: en hero → maslahat formasi |
| K-4 Narx qatori | "Xizmatlar"dan keyin: Logotip, Firma uslubi, Qadoq dizayni va eng arzon paket. Narx, valyuta, muddat va nom `sales-content`dan olinadi (qo'lda yozilmagan), har karta `/narxlar`ning o'z bo'limiga olib boradi | 7 ta test (4 tilda); desktop + mobil skrinshot |
| Shrift | Bosh sahifa ildizida shrift ro'yxatiga umumiy `sans-serif` zaxira qo'shildi. Hanken'da kirill/xitoy harflari yo'q, Arial bo'lmagan qurilmada ular serif'ga tushardi | Mobil `ru` skrinshot |

Natija: typecheck ✅, lint ✅, testlar 502 → 509 ✅, build ✅, E2E 12/12 ✅.

**Alohida topildi:** E2E "320px services stay inside the viewport" testi 20–40 tadan bitta yugurishda yiqiladi. Sabab — galereya
filtr tugmalari (`ind-pill`) lazy bo'lim CSS'i yuklanguncha sahifani ~1 px kengaytiradi. Bu C bosqichdan oldin ham bo'lgan:
narx qatorisiz 2/40, u bilan 1/40; eski shrift ro'yxati bilan 6/30, yangisi bilan 1/30. Alohida tuzatish kerak.

### D bosqich bajarildi (2026-11-07)

| Topilma | Nima qilindi | Tekshiruv |
|---|---|---|
| K-5 Tartib | `/narxlar`: sarlavha + tez tanlov → **paketlar** → **"Nega arzon dizayner emas"** + kafolatlar → xizmatlar → vazifa → ishonch → jarayon → omillar → FAQ → suhbat | Unit test (DOM tartibi); o'lchov pastda |
| K-5 Xizmatlar | Har xizmat 100svh ekran emas, yig'iladigan qator: yopiqligida nom, narx, muddat. Ochilganda lead, foyda, kimga, tarkib, dalil, keyslar. Matn DOM'da qoladi (SEO, sahifa ichida qidiruv) | Skrinshot desktop + mobil |
| K-5 Havolalar | `/narxlar#service-logo` qatorni ochadi: bosh sahifa narx qatori va tez tanlov (sahifa ichida oddiy `<a>`, `hashchange`) | Brauzer: bosh sahifa → logo ochiq; tez tanlov → qadoq ochiq; 2 ta unit test |
| K-5 Tugmalar | "Ariza qoldirish" (10 marta) o'rniga xizmatga bog'langan matn: "Logotip bo'yicha maslahat", "Patent bo'yicha maslahat"…, paketlarda "Paket bo'yicha maslahat". 4 tilda (`Service.cta`). Barcha tugmalar maslahat formasini ochadi, xizmat oldindan belgilangan | Unit test 4 tilda; mobil: oyna "20 daqiqalik bepul maslahat" |
| i18n | JSX'dagi o'zbekcha "Kimga" va "Muddat:" yorliqlari ru/en/zh'ga chiqardi — tarjimaga o'tdi | Unit test |
| K-9 Ish namunasi | 5 ta xizmat sahifasi (logo, firma uslubi, qadoq, brendbuk, neyming): birinchi ekranda portfolio'dagi 3 ta tasdiqlangan ish, keysga havola. Desktop: o'ng ustun; mobil: tugmalardan keyin 3 ta kichik kartochka. Patentda portfolio kategoriyasi yo'q — o'zgarmagan | Brauzer: 5 sahifada 3 tadan, gorizontal toshish 0 |
| K-9 Tugma | Sharhlar bo'limidan keyin xizmat maslahati tugmasi (6 sahifa, patent ham) | Brauzer; unit test |
| Bitta so'z | Xizmat sahifalarida "konsultatsiya" → "maslahat", forma tugmasi "Ariza qoldirish" → "Maslahatga yozilish" (K-3 bilan bir xil) | — |

**O'lchov (lokal production build):**

| | Oldin | Keyin |
|---|---|---|
| `/narxlar` desktop balandligi | 20 380 px | **10 463 px** (−49%) |
| `/narxlar` mobil (iPhone 13) | ~33 ekran | **16 ekran** |
| Paketlar chuqurligi | 74% | **12%** |
| "Nega arzon dizayner emas" | 85% | **24%** (mobil 29%) |
| Bir xil "Ariza qoldirish" tugmasi | 10 + 3 | **0** |

Natija: typecheck ✅, lint ✅, testlar 509 → 525 ✅, build ✅.

**Egasi ko'rib chiqsin (dizayn):** JTBD bo'limi ("Biz aslida nimani hal qilamiz") xizmatlardan keyinga tushdi.
Audit tartibida u yo'q edi; olib tashlash biznes qarori bo'lgani uchun saqlab qolindi.
