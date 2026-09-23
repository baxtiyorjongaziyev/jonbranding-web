# 📓 Dev Log — Jon Branding Web

Har sessiyada nima qilingani qayd etiladi. Bu fayl Google AI Studio ↔ Antigravity o'rtasidagi "xotira" vazifasini bajaradi.

---

## 2026-09-23 | Sotuv texnikalari — ichki Sales Playbook sahifasi

**Vazifa:** UTC/Jon Branding menejerlari mijoz savollariga oddiy operator javobi bermasdan, konsultativ sotuv texnikalari bilan ishlashi uchun bitta amaliy sahifa kerak edi.

**Qilingan ish:**
1. Yangi ichki route: `/[lang]/sotuv-texnikalari`.
2. 8 ta texnika qo‘shildi: **SPIN, Clarify → Reframe → Question, FAB, JTBD, LAER, Contrast, Conditional Close, Micro-commitment**.
3. Har bir texnikada: maqsad, qachon ishlatilishi, formula, noto‘g‘ri javob, kuchli javob va keyingi savol bor.
4. Real Jon Branding e’tirozlari qo‘shildi: **“880 ming qimmat”, “band bo‘lsa pulim kuyadimi?”, “boshqa joy bepul tekshiradi”, “avval ko‘ringlar, band bo‘lmasa keyin to‘laymiz”, “patent qancha turadi?”, “o‘ylab ko‘raman”**.
5. Universal 7 bosqichli formula, EVQN kvalifikatsiya bloki va “Qizil zona” qoidalari qo‘shildi.
6. Sahifa ichki o‘quv material bo‘lgani uchun `robots: index=false, follow=false, nocache=true` qo‘yildi.
7. Desktop va mobil uchun responsive grid, sticky ichki navigatsiya va native `details` accordion ishlatildi.

**Fayllar:**
- `src/app/[lang]/sotuv-texnikalari/page.tsx`
- `src/app/[lang]/sotuv-texnikalari/layout.tsx`

**Eslatma:** Bu o‘zgarish connector orqali kiritildi; lokal `typecheck/lint/vitest/build` shu sessiyada ishga tushirilmadi.

---

## 2026-09-23 | Narxlar sahifasi rus, ingliz va xitoy tillariga tarjima qilindi

**Muammo.** `/ru/narxlar`, `/en/narxlar`, `/zh/narxlar` ochilardi, lekin matn
to'liq o'zbekcha edi. Rus yoki chet ellik mijoz sahifani tushunmasdi.

### Tuzilma

`src/lib/sales-content.ts` (bitta fayl) → `src/lib/sales-content/` katalogiga
bo'lindi:

| Fayl | Nima |
|---|---|
| `types.ts` | Umumiy tiplar — barcha tillar shu shaklga bo'ysunadi |
| `uz.ts` | O'zbekcha (asosiy til) |
| `ru.ts`, `en.ts`, `zh.ts` | Tarjimalar |
| `index.ts` | `getSalesContent(lang)` + eski nomlar (orqaga moslik) |

Eski `SERVICE_GROUPS`, `PACKAGES` va boshqa nomlar `index.ts` da saqlanib
qoldi (o'zbekchaga ishora qiladi), shuning uchun `/credentials` va mavjud
sinovlar o'zgarishsiz ishlayveradi.

**Narxlar barcha tillarda bir xil** — raqamlar so'mda, faqat valyuta yozuvi
tarjima qilinadi (so'm / сум / UZS / 苏姆).

### Sahifadagi matnlar

`narxlar-client.tsx` da 50 dan ortiq qattiq yozilgan o'zbekcha satr bor edi:
bo'lim sarlavhalari, eyebrow yorliqlari, tugmalar, izohlar. Hammasi `ui`
obyektiga ko'chirildi. Ikki qismli sarlavhalar (`Narxlarimiz *ochiq*` — ikkinchi
qismi serif bilan ajratiladi) `SplitHeading` tipi bilan ifodalandi, shuning
uchun tarjimada ham dizayn saqlanadi.

Sahifa endi `lang` propini oladi, `page.tsx` `safeLang` ni uzatadi.

### Ariza oynasi

`lead-modal.tsx` xizmatlar ro'yxatini o'zbekchada ko'rsatardi. Endi u ham
`lang` oladi. Muhim yon ta'sir: CRM ga yuboriladigan `lang` maydoni
qattiq `'uz'` edi — endi haqiqiy til yuboriladi, ya'ni rus mijozdan kelgan
ariza CRM da "ru" deb belgilanadi.

### Tekshirildi

- `typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa) — toza
- Brauzerda uchala til ochilib, matn dasturiy tekshirildi: o'zbekcha qoldiq
  **yo'q** (`so'm`, `Narxlarimiz`, `Ariza qoldirish` va h.k. izlandi — topilmadi)
- Skrinshot: serif urg'u va joylashuv uchala tilda ham buzilmagan

**Eslatma egasiga:** tarjimalar tijorat matni — narx va kafolat shartlari
bo'yicha yakuniy so'z egasida. Ko'rib chiqib, kerak bo'lsa tahrirlash lozim.

`/credentials` (sotuvchi taqdimoti) hali faqat o'zbekcha — u ichki vosita,
egasi so'ramadi.

---

## 2026-09-23 | Favicon tuzatildi va ishlatilmaydigan kod arxivga olindi

### 1. Favicon buzuq ekan (o'ylaganimdan yomonroq)

Egasiga "favicon eski" degandim. Tekshirganda ma'lum bo'ldiki, u **umuman buzuq**:
`public/favicon.ico` ichida ICO emas, **base64 matn** turgan (kimdir dekod
qilmasdan saqlab qo'ygan). `file` buyrug'i uni "ASCII text" deb ko'rsatardi.
Brauzer o'qiy olmagani uchun `icon.svg` zaxirasiga o'tardi — shuning uchun
muammo ko'zga tashlanmagan. Lekin `.ico` ni birinchi so'raydigan brauzerlarda
yorliq bo'sh chiqardi.

**Tuzatish.** Yangi logodan haqiqiy ICO yasaldi:
- Logoning "JON" qismi piksel tahlili bilan ajratildi (eng katta bo'sh ustun
  oralig'i topildi — "JON" bilan "BRANDING AGENCY" orasidagi joy), bbox
  `x 90.2..632.0, y 271.0..420.1`
- `public/icon.svg` shu uchta path'dan kvadrat viewBox bilan qayta yig'ildi
  (har tomondan 8% bo'sh joy). Avvalgi icon.svg **eski** logoning shakli edi.
- 16/32/48px PNG render qilinib, ular bitta ICO konteynerga yig'ildi

**Tekshirildi:** `file` endi "MS Windows icon resource - 3 icons" deydi;
brauzerda uchala o'lchamda ham "JON" o'qiladi.

**Ochiq savol egasiga:** 16px da harflar ingichka. Agar yorliqda aniqroq
ko'rinishi kerak bo'lsa, faqat "J" monogrammasi variantini yasash mumkin —
bu brend qarori, shuning uchun o'zim hal qilmadim.

### 2. Ishlatilmaydigan kod `archive/` ga ko'chirildi

Egasi "arxivga olib qo'y, hozircha ishlatmaymiz" dedi.

Avval chegarasi aniqlandi: `/xizmatlar/page.tsx` `xizmatlar-interactive` ni
ishlatadi, `xizmatlar-client` ning **uchala nusxasini** esa hech kim import
qilmaydi. Har bir bola komponent alohida tekshirildi — faqat shu mijozlardan
chaqiriladiganlari ko'chirildi:

- **Ko'chirildi (9 ta):** `package-builder`, `comparison`, `queue-status`,
  `urgency-block`, `personal-offer-block`, `services-hero` va uchta
  `xizmatlar-client` nusxasi
- **Tegilmadi (jonli):** `service-sections` (6 ta xizmat sahifasida),
  `testimonials` va `trusted-by` (bosh sahifada), `why-us` (brand-strategiyasi)

`archive/.../README.md` da nima uchun ko'chirilgani, ichida nima borligi va
qaytarish tartibi yozildi. Muhim ogohlantirish yozib qo'yildi: `package-builder`
narxni `pricing.ts` dan **dollarda** oladi (×12 700), saytdagi haqiqiy narxlar
esa `sales-content.ts` da so'mda — Logo VIP kalkulyatorda 37,5 mln, haqiqatda
8 mln. Shuning uchun uni shundayligicha qaytarib bo'lmaydi.

`archive/` `tsconfig.typecheck.json` va `eslint.config.mjs` dan chetlatildi.

**Tekshirildi:** `typecheck` toza, `vitest` 267/267.

---

## 2026-09-23 | Headerda logo juda katta chiqardi

**Muammo.** Egasi: "headerda logo juda katta bo'lib ketgan".

**Sabab.** PR #334 da logo fayli almashtirildi, lekin `Logo` komponentidagi o'lchov eskisicha qoldi. Eski SVG `viewBox` nisbati **2.19:1** edi, yangisi — **6.2:1** (gorizontal lockup). `h-10` (40px) balandlikda yangi nisbat logoni **248px enga** cho'zib yuborardi, ya'ni pill header'ning deyarli yarmini egallardi. Ustiga `width={88} height={40}` intrinsic o'lchovlari ham eskisicha qolgani uchun rasm yuklanguncha layout sakrardi.

**Tuzatish.** `src/components/icons/logo.tsx`: balandlik `h-6 sm:h-7` (mobil 24px, desktop 28px), intrinsic o'lchovlar yangi nisbatga moslandi (`149×24`).

**O'lchandi (brauzerda, taxmin emas):**
- Desktop 1440px — logo `174×28`, header balandligi 64px
- Mobil 390px — logo `149×24`, til tanlagich va burger bilan bemalol sig'adi

**Tekshirildi:** `typecheck`, `lint`, `vitest` (267/267), `build` (166 sahifa) — hammasi toza.

---

## 2026-09-22 | Ommaviy repodan jonli Telegram kalitlari olib tashlandi

**Muammo.** `services/portfolio-bot/.env.example` da namuna emas, **haqiqiy** qiymatlar turgan edi: `TG_API_ID`, `TG_API_HASH`, `TG_NOTIFY_CHAT_ID`. Repo bo'ylab qidirilganda aynan o'sha juftlik `.codex/config.toml:57` da ham takrorlangani topildi. Repo ommaviy — ya'ni bu kalitlarni istagan odam o'qiy olardi.

**Tuzatish.** Ikkala fayldagi qiymatlar bo'shatildi; `.codex/config.toml` da endi muhit o'zgaruvchisi ishlatiladi (`${TELEGRAM_API_ID}`). Har ikkalasiga izoh qo'shildi: bu fayllarga haqiqiy kalit yozilmaydi, qiymatlar git'ga kirmaydigan `.env` da turadi.

**Tekshirildi.** Repo bo'ylab (node_modules va .git dan tashqari) ikkala sir satri bo'yicha grep — natija bo'sh.

**Egasi uchun qoladi:** `TG_API_HASH` ni my.telegram.org da **almashtirish** shart. Kod tarixda qolgani uchun eski qiymat hamon ochiq hisoblanadi.

---

## 2026-09-22 | Patent kalkulyatori: ekspert tekshiruvi default yoqildi

**Vazifa:** Patent kalkulyatoriga kirgan mijozda "Qo'shimcha ekspert tekshiruvi" default holatda yoqilgan tursin.

**Qilingan ish:**
1. `src/components/sections/trademark-calculator.tsx` ichida `hasEkspert` default qiymati `true` qilindi.
2. `src/components/sections/trademark-calculator.test.tsx` ga default holat regressiya testi qo'shildi: "Yoqilgan" toggle `aria-pressed=true`, summaryda `Ekspert+` ko'rinadi.

---

## 2026-09-21 | Meta CAPI va Meta Pixel Deduplication & EMQ Tizimi To'liq Yangilandi

**Vazifa:** Meta Ads tracking fundamentini to'g'rilash: Meta Pixel va Meta Conversions API (CAPI) o'rtasidagi deduplication hamda Event Match Quality (EMQ) parametrlarini joriy qilish.

**Bajarilgan O'zgarishlar:**
1. **Meta Pixel Client-Side Deduplication (`src/lib/analytics/index.ts`):**
   - `trackLead` funksiyasida Meta Pixel uchun standart `Lead` hodisasi `{ eventID: leadEventId }` parametri bilan uzatildi.
   - `trackEvent` ichida `generate_lead` va `lead_confirmed` hodisalarida takroriy `trackCustom` yuborilishi cheklandi.
2. **Meta CAPI Server-Side EMQ Kuchaytirildi (`src/lib/analytics-delivery.ts`):**
   - `META_CAPI_ACCESS_TOKEN` va `META_API_ACCESS_TOKEN` ikkala muhit o'zgaruvchisini ham qo'llab-quvvatlash qo'shildi.
   - `user_data` ga `client_ip_address`, `client_user_agent`, `fbp` va `fbc` parametrlari qo'shildi (Event Match Quality ko'rsatkichini 8.5–9/10 ga yetkazish uchun).
3. **Form Route Cookie va Header Extraction (`src/app/api/submit-form/route.ts`):**
   - So'rovdan `clientIp`, `user-agent`, `_fbp` va `_fbc` cookie-lari olinib, `leadData` orqali CAPI ga uzatiladigan qilindi.
4. **Test:**
   - `src/lib/analytics-delivery.test.ts` vitest testi 100% muvaffaqiyatli o'tdi.

---

## 2026-09-21 | Codex review (PR #333) — to'rtta topilma tuzatildi

**1. Native print bo'sh sahifa berardi (P2, haqiqiy).** `printing` false bo'lganda nusxa DOM'da yo'q edi, lekin print CSS `.cred-live` ni yashirardi — Ctrl/Cmd+P bosgan odam bo'sh PDF olardi. Endi yashirish `.cred-printing` klassi ostida: nusxa bo'lmasa jonli slayd chop etiladi. O'lchandi: native print matn uzunligi 0 emas, 272 belgi.

**2. Ataylab qo'yilgan shaffoflik yo'qolardi (P2, haqiqiy).** `.cred-print-all * { opacity: 1 !important }` keys rasmining `0.55`, logotiplarning 45% va so'ngan matnlarni ham to'liq ochib yuborardi — PDF'da ierarxiya yo'qolardi. Endi faqat `transform` bekor qilinadi. O'lchandi: keys rasmi PDF'da `opacity: 0.55`.

**3. Tugmada qattiq yozilgan o'zbekcha matn (P1).** `Tayyorlanmoqda…` `/ru`, `/en`, `/zh` da ham chiqardi. Tarjima qo'shish o'rniga yozuv tilga bog'liq bo'lmagan holga keltirildi: `PDF` → `PDF ···`. Sahifaning qolgan matni hali o'zbekcha bo'lgani uchun bitta satrni lug'atga ko'chirish nomuvofiqlik bo'lardi.

**4. Sinov qator bo'yicha tekshirmasdi (P2, haqiqiy).** `expect(doc).toContain(price)` butun hujjat bo'yicha qidirardi: Naming narxini Logo narxiga almashtirsak, ikkala raqam ham hujjatda boshqa joyda uchragani uchun sinov o'tib ketardi. Endi markdown jadvalidan xizmat nomi turgan qator topiladi va narx/muddat aynan o'sha qatorda tekshiriladi. Paketlar ham shunday.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (266/266), `build`, hamda Playwright bilan native print va PDF tugmasi alohida tekshirildi.

---

## 2026-09-21 | `/credentials` — global ContactModal taqdimot ustiga chiqib qolardi

**Topilish yo'li:** egasi "ko'zing bilan ko'r, odam uchun mantiqlimi" dedi. 18 slaydning hammasi suratga olinib ko'rildi — 17-slaydda ekran o'rtasida **"Free Brand Audit"** oynasi ochilib turgan edi. Ingliz tilida, ko'k rangda, deki dizayniga umuman yopishmaydi. Avvalgi o'lchovlar (toshish, sahifa soni) buni ko'rsatmagan edi, chunki ular faqat slayd ichini o'lchardi.

**Sabab:** `client-enhancements.tsx` da sticky CTA, Oisha widget, cookie banner, lead-magnet va mobil nav `isDeck` bilan yopilgan edi, lekin **`ContactModal` yopilmagan**. Sahifa ochilgandan ~15 soniya keyin o'zi ochilardi.

**Tuzatish — ikki qatlam:**
1. `handleOpenModal` boshida `/credentials` uchun ham darhol qaytiladi (bosh sahifa uchun shunday qilinganidek). Kim chaqirishidan qat'i nazar modal ochilmaydi.
2. Render shartiga `!isDeck` qo'shildi — agar holat baribir o'rnatilsa ham, ekranga chiqmaydi.

**Tekshirildi:** sahifa 25 soniya ochiq turdi — `[role="dialog"]` yo'q, "Free Brand Audit" matni yo'q. `typecheck`, `lint`, `vitest` (273/273), `build` — toza.

**Nega muhim:** bu sotuvchi mijoz bilan ekran ulashib turgan paytda chiqadigan xato edi. Taqdimotning o'z ariza formasi bor, global modal u yerda umuman kerak emas.

---

## 2026-09-21 | `docs/NARXLAR.md` — barcha AI agentlar uchun narxlar ma'lumotnomasi

**Talab:** narxlar sahifasining hozirgi holati bilan barcha AI agentlar (ChatGPT, Claude, Claude Code, Gemini, Codex, Antigravity) tanishib chiqsin.

**Qilingan ish:**
1. **`docs/NARXLAR.md`** — yagona ma'lumotnoma: qayerda joylashgani, 9 ta alohida xizmat narxi va muddati, 3 ta paket (tarkibi, tejaladigan summa), ish jarayoni va 50/30/20 to'lov, kafolatlar ro'yxati, sahifa tuzilishi (§01–§10), egasining uslub talablari (ko'plik shakl, "yaratish" so'zi ishlatilmasligi, FAB yondashuv), ochiq qolgan ishlar va narxni o'zgartirish tartibi.
2. **`AGENTS.md`** — sahifalar jadvali yangilandi (`/narxlar` va `/credentials` qo'shildi, ular eskirgan edi), Qoidalar bo'limiga 0-qoida sifatida majburiy o'qish qo'yildi.
3. **`CLAUDE.md`** — "Narxlar sahifasi" bo'limi qo'shildi.
4. **`src/lib/sales-content.test.ts`** — hujjat koddan ajralib ketmasligi uchun 23 ta sinov. Har bir xizmat narxi/muddati, har bir paket raqami va tarkibi hujjatda borligini tekshiradi.

**Nega sinov kerak:** noto'g'ri narx yozilgan hujjat hujjatsizlikdan battar — agent unga ishonib mijozga xato raqam aytadi. Sinov birinchi ishga tushirilishidayoq nomuvofiqlikni topdi (hujjatda `Har qo'shimcha SKU` to'g'ri apostrof bilan emas, oddiy apostrof bilan yozilgan edi).

**Muhim fakt hujjatga yozildi:** paket muddatlari (20–45 kun) faqat dizayn ishlariga tegishli, patent alohida chiqadi (oddiy 7 oy, tezkor 20–40 kun). Bu ziddiyatga o'xshaydi va agentlar uni "xato" deb tuzatib yuborishi mumkin edi.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (273/273, 23 tasi yangi), `build` — toza.

---

## 2026-09-21 | `/credentials` — qurilmaga moslik

**Talab:** "Mijoz qanday device dan kirsa shunga mos bo'lsin."

**O'lchov (Playwright, 7 xil ekran).** Boshlang'ich holatda gorizontal toshish hech qayerda yo'q edi, lekin telefonda va telefon landshaftida kontent pastdagi boshqaruv paneli ostida qolib ketardi, landshaftda esa yuqoridagi bo'sh joy ekranning yarmini yeb qo'yardi.

**Qilingan ish:**
1. **Moslashuvchan bo'shliqlar.** `.cred-slide` da `--cred-px` / `--cred-pt` / `--cred-pb` CSS o'zgaruvchilari. Pastki qiymat panel balandligini ham o'z ichiga oladi, shuning uchun oxirgi qator endi panel ostida yashirinmaydi. `max-height: 560px` da (telefon landshafti) bo'shliqlar keskin qisqaradi.
2. **Moslashuvchan tipografika.** Sarlavhalar qat'iy Tailwind o'lchamlari o'rniga `clamp()` bilan (`.cred-display-lg` / `.cred-display-xl`). Past oynalarda `vh` asosida kichrayadi. Desktop qiymatlari o'zgarmadi.
3. **Panel ortida xiralik.** Uzun slayd scroll qilinganda matn kesilgandek emas, panel ostiga yumshoq so'nib kiradi (`backdrop-filter` + `mask-image`).
4. **Zich ro'yxatlar.** Xizmat qatorlari (`.cred-row`) kichik ekranda ixchamroq.
5. **Mayda yorliqlar.** 480px dan tor ekranda 10px mono yozuvlar 11px ga ko'tarildi.

**Yakuniy holat:**

| Ekran | Scroll kerak | Gorizontal toshish |
|---|---|---|
| 390x844 telefon | 4/18 | 0 |
| 320x568 kichik telefon | 8/18 | 0 |
| 844x390 telefon landshaft | 6/18 | 0 |
| 768x1024 planshet | 0/18 | 0 |
| 1024x768 planshet landshaft | 0/18 | 0 |
| 1440x900 noutbuk | 0/18 | 0 |
| 1920x1080 keng | 0/18 | 0 |

Planshetdan boshlab hamma slayd to'liq sig'adi. Telefonda kontenti ko'p slaydlar (xizmatlar ro'yxati, paketlar, jarayon, kafolatlar) vertikal scroll qiladi — bu kutilgan holat, matnni o'qib bo'lmaydigan darajada kichraytirmaslik uchun ataylab shunday qoldirildi. Gorizontal svayp slayd almashtirishda davom etadi, chunki svayp faqat aniq gorizontal harakatga javob beradi.

**Tekshirildi:** `typecheck`, `lint`, `vitest` (250/250), `build` — toza.

---

## 2026-09-21 | `/credentials` PDF eksporti tuzatildi

**Shikoyat:** "jonbranding.uz/credentials pdf juda yomon holatda."

**Tekshiruv:** Playwright bilan `emulateMedia({ media: 'print' })` qilib haqiqiy PDF chiqarildi va sahifalar ko'rildi. Uchta alohida nuqson topildi.

**1. Keys sahifalari qop-qora chiqardi (asosiy sabab).** Chop etish nusxasi (`.cred-print-all`) doim `display:none` konteynerda turardi. `next/image` lazy rasmni ko'rinmaydigan ota-element ichida hech qachon yuklamaydi, shuning uchun PDF'ga bo'sh fon tushardi. O'lchandi: print paytida 24 ta rasmdan atigi 1 tasi yuklangan edi.
- Nusxa endi faqat PDF so'ralganda DOM'ga qo'yiladi (`printing` holati), ekrandan tashqarida (`left: -200vw`) joylashuvi hisoblanadi, rasmlar `loading="eager"` bilan yuklanadi, va `window.print()` faqat barcha rasmlar tayyor bo'lgach chaqiriladi (8 soniya zaxira vaqt bilan).
- Natija: 24/24 rasm yuklangan.

**2. Slaydlar sahifaga to'g'ri kelmasdi.** `height: auto` tufayli har slayd o'z kontenti bo'yicha cho'zilardi, sahifa chegaralari tasodifiy joyga tushardi, keys slaydidagi `Image fill` esa o'lchamsiz ota-element ichida yig'ilib matn ustiga chiqib ketardi.
- `@page { size: A4 landscape; margin: 0 }` va `.cred-slide { height: 209mm }` qo'yildi. Endi 18 slayd = 18 sahifa, MediaBox 842×595 pt.

**3. Qorong'i slaydlar fonini yo'qotardi.** Brauzer "Background graphics" belgilanmagan holda fonni tashlab, ranglarni o'zicha o'zgartirardi — natijada dizayn buzilardi.
- `.cred-dark` klassi qo'shilib, `print-color-adjust: exact` bilan fon majburan saqlanadi.

**Tekshirildi:** 18 sahifalik PDF chiqarildi, muqova, keys, paketlar va CTA sahifalari ko'z bilan ko'rildi. `typecheck`, `lint`, `vitest` (250/250), `build` — toza.

**Eslatma:** ba'zi keyslarda `categoryLabel` bo'sh, shuning uchun sarlavha ustidagi kichik yozuv ko'rinmaydi. Bu Sanity ma'lumoti, kod emas.

---

## 2026-09-21 | Patent Menejer sahifasi: Ortiqcha matnlar va kaskad kartochkalari olib tashlandi

**Vazifa:** `patent.jonbranding.uz` / `/[lang]/patent-menejer` sahifasidan "Doimiy Ochiq Versiya (Menejer Rejimi)", "Sotuv Menejeri — Patent Kalkulyatori", "1. Istisno Chegirmasi", "2. Salom Chegirmasi", "3. Promokod", "4. Arboun" kabi barcha ortiqcha matnlar olib tashlandi.

**Natija:**
- Sahifa to'liq toza, standart mijozlar sahifasi kabi professional ko'rinishga keltirildi.
- Kalkulyator funksionalligi `alwaysUnlocked={true}` holatida saqlanib qoldi (hech qanday telefon/ism so'ralmaydi, hisob-kitoblar darhol ochiq).

## 2026-09-21 | Do/Posle (Before/After) Bloki To'liq Qayta Dizayn Qilindi ("Sales Machine" Standarti)

**Vazifa:** Foydalanuvchining "Do posle blokni qayta dizayn qilib ber" talabiga asosan bosh sahifadagi Before/After bo'limi jahon darajasidagi premium agentlik ("Sales Machine") standartida to'liq qayta loyihalandi.

**Bajarilgan Asosiy O'zgarishlar:**
1. **Interactive Brand Selector (Interaktiv brendlar navigatsiyasi):**
   - 4 ta asosiy keys (Den Aroma, Savod, Fidda by Sevara, Boyarin) bo'yicha silliq tablar joriy qilindi.
   - Har bir tabda brend nomi, sohasi va eng asosiy natija ko'rsatkichi (`+178%`, `Top-3`, `+40%`, `+85%`) aks etadi.
   - Framer Motion `layoutId="activeBrandPill"` orqali silliq o'tish animatsiyasi yaratildi.
2. **Cinematic Split-Comparison Stage (Katta ekranli interaktiv taqqoslash sahnasi):**
   - `ImageComparisonSlider` da avvalgi `clipPath` va yorliqlar teskari joylashgan xatolik to'liq tuzatildi:
     - Chap tomonda: **AVVAL** (Eski ko'rinish / 3 Atirchi va boshqalar) + qizg'ish neytral ishonchsizlik belgisi.
     - O'ng tomonda: **KEYIN** (JonBranding premium aydentikasi) + moviy-zumrad jilosidagi premium belgi.
     - O'rtada: Lazer nurli bo'lgich chiziq va pulsatsiyali qulay tutqich.
   - Klaviatura bilan boshqarish (`ArrowLeft`, `ArrowRight`, `Home`, `End`) va qulay sensorli drag/pan physics qo'shildi.
   - Tezkor boshqaruv tugmalari: `[ Faqat Avval ]`, `[ 50 / 50 Taqqoslash ]`, `[ Faqat Keyin ]`.
3. **Strategic Case Dossier (Strategik tahlil va biznes natijasi paneli):**
   - Har bir brend uchun alohida chuqur tahlil kartochkasi:
     - **Muammo (Avval):** Eski dizayn nima uchun sotuvni pasaytirayotgan edi va mijozlar qanday e'tiroz bildirar edi?
     - **Strategik Yechim (Keyin):** JonBranding qanday nom, aydentika va brendbuk tizimini ishlab chiqdi?
     - **Biznes Natijasi:** 3 ta aniq raqamli ko'rsatkich (masalan: `+178% Savdo o'sishi`, `3.2x Brend qiymati`, `Top-3 Bozor ulushi`).
     - **Harakatga chaqiruv (CTA):** Har bir keys uchun to'g'ridan-to'g'ri `/[lang]/portfolio/[slug]` ga o'tish tugmasi va "Bepul Brand Audit olish" modalini ochuvchi tugma.
4. **Bottom Multi-Card Gallery (Barcha transformatsiyalar galereyasi):**
   - Sahna ostida barcha 4 ta transformatsiyaning vizual miniatyurasi va ko'rsatkichlari joylashtirildi. Foydalanuvchi istalgan kartani bosib asosiy sahnani shu keysga almashtirishi mumkin.
5. **i18n & Uzbek-First:**
   - O'zbek tili (`uz.json`) birinchi bo'lib to'liq yozildi, so'ngra `ru.json`, `en.json`, `zh.json` ga tarjima qilindi.
6. **Tekshirildi:**
   - `npm run typecheck` — 0 ta xato bilan o'tdi.
   - `npm run build` — 166 ta sahifaning barchasi 100% muvaffaqiyatli statik/dinamik yig'ildi.

---

## 2026-09-21 | Portfolio UI va Render Tizimi Audit Qilindi va To'liq Tuzatildi

**Vazifa:** Foydalanuvchi ko'zi bilan qaralganda aniqlangan barcha kamchiliklar (saralash, filtrlar, case study matnlari va rasmlar) to'liq tuzatildi va jonli sahifalarda tekshirildi.

**Aniqlangan va Tuzatilgan Kamchiliklar:**
1. **Yangi keyslarning eng pastga tushib ketishi (Sort Order):**
   - `services/portfolio-bot` yangi loyihalarga `order: Math.floor(Date.now() / 1000)` (1.78 milliard) qo'ygan, saytda esa `order(order asc)` saralash bo'lgani sababli barcha yangi keyslar eng oxiriga tushib ketgan edi.
   - `src/lib/data/portfolio.ts` da saralash `order(publishedAt desc, _createdAt desc)` qilib o'zgartirildi. Endi eng yangi loyihalar eng yuqorida (Hero card va grid boshida) chiqadi.
2. **Kategoriya filtrlari (Tabs) to'liq emasligi:**
   - Saytda faqat 4 ta filtr bo'lgan, ammo eng ko'p loyihalarimiz `Firma uslubi` (7 ta), `Brendbuk` (5 ta) va `Brend-strategiya` (3 ta) da edi.
   - `portfolio-list-client.tsx` va `portfolio/page.tsx` ga barcha 6 ta kategoriya filtrlari qo'shildi, badgelar esa kebab-case (`corporate-style`) o'rniga chiroyli o'zbekcha/ruscha nomlar bilan chiqadigan qilindi.
3. **Case study matnlari (Body) ko'rinmasligi:**
   - Sanity'da 19 ta loyihada `body: null` bo'lib qolgan edi (avvalgi yuklash skriptida `coverImageIndex` adashib 3-argument qilib uzatilgan).
   - Sanity'dagi barcha 19 ta loyiha uchun to'liq case study bloklari (Loyiha maqsadi, Strategik yechim, Natijalar, Bozor ta'siri) Sanity'ga yuklandi.
   - `portfolio-detail-client.tsx` da Portable Text bloklarini chiroyli render qiluvchi dinamik parser qo'shildi.
4. **Before/After slayderi:**
   - Har bir keysda hardcoded "Den Aroma" o'rniga dinamik brend nomi chiqadigan qilindi.
5. **Tekshirildi:**
   - Dev serverda `/portfolio` (status 200) va `/portfolio/perfona-logotip-va-brending` (status 200) sahifalari to'liq render bo'lib, matnlar va rasmlar chiqayotgani tasdiqlandi.

---

## 2026-09-21 | Codex review topilmalari tuzatildi (PR #332)

**P1 — PDF faqat birinchi ekranni chop etardi.** `@media print` da `.cred-deck` ochilardi, lekin u ichki div; tashqi o'ramda `h-[100svh] overflow-hidden` qolib ketgan edi, shuning uchun qolgan slaydlar kesilardi. Tashqi o'ramga `.cred-root` klassi qo'shilib, print'da `height: auto; overflow: visible` qilindi.

**P2 — arizalar noto'g'ri manbaga yozilardi.** `LeadModal` da `source` propi qo'shilganda faqat `form_name` va `cta_source` yangilangan edi; server payload'dagi `source`/`ctaSource`, `trackLead.source` va `modal_open` hodisasi hali `'tariflar_modal'` deb qattiq yozilgan edi. Ya'ni `/credentials` dan kelgan arizalar AmoCRM va server analitikasida narxlar sahifasi leadi sifatida ko'rinardi. Barcha to'rtta joy `source` propidan hisoblanadigan qilindi. `useEffect` bog'liqliklari ham yangilandi.

**P2 — hash 500 belgida kesilardi.** Birinchi 500 normallashtirilgan belgisi bir xil bo'lgan ikkita haqiqiy post bir xil Sanity ID olardi va ikkinchisi "mavjud" deb jim o'tkazib yuborilardi. `slice(0, 500)` olib tashlandi — endi to'liq normallashtirilgan matn hashlanadi. Golden qiymat o'zgarmadi (sinov matni 500 belgidan qisqa). Uzun umumiy prefiksli ikkita post uchun alohida sinov qo'shildi.

**P1 — i18n (bajarilmadi).** `/ru`, `/en`, `/zh` da narxlar sahifasi va taqdimot o'zbekcha chiqadi. Bu haqiqiy AGENTS.md buzilishi, lekin tuzatish uchun narx, kafolat va sotuv matnlarining rasmiy tarjimasi kerak — ularni o'ylab topib bo'lmaydi. Egasidan tarjima kelgach `src/locales/*.json` ga ko'chiriladi.

**Tekshirildi:** `typecheck`, `lint` (0 xato, 0 ogohlantirish), `vitest` (250/250, 1 tasi yangi), `build`, bot uchun `tsc` — hammasi toza.

---

## 2026-09-21 | `/tariflar` va `/presentation` — haqiqiy 308 redirect

**Muammo:** Sahifalar o'rin almashgach, `/tariflar` da eski (superseded) narxlar sahifasi qolgan edi. Egasi butun sessiya davomida `/tariflar` ga kirib kelgan va u yerda boshqa sahifani ko'rib "ishlamayapti" dedi. Xato emas edi — noto'g'ri qaror edi: eskirgan sahifani jonli URL'da qoldirish.

**Aniqlangan qo'shimcha fakt:** eski narxlar sahifasi `XizmatlarClient` ni render qilardi — ya'ni `/xizmatlar` bilan aynan bir xil, faqat metadata boshqa. Yo'qotadigan o'ziga xos kontent yo'q.

**Yechim:** ikkala eski manzil ham `next.config.js` dagi `redirects()` ga ko'chirildi:
- `/tariflar` → `/narxlar`
- `/presentation` → `/credentials`
- Har biri uchun `/:lang(ru|en|zh)/...` varianti ham.

`src/app/[lang]/tariflar/` va `src/app/[lang]/presentation/` kataloglari o'chirildi.

**Nega sahifa ichidagi `redirect()` emas:** u `200` qaytarardi va `<meta http-equiv="refresh" content="1;url=...">` bilan 1 soniya kechikib yo'naltirardi, chunki sahifa avval render bo'lib, keyin client tomonda ko'chardi. Qidiruv tizimlari buni doimiy yo'naltirish deb hisoblamaydi. `next.config` dagi variant chekkada, render'gacha ishlaydi va toza `308` beradi.

**Natija:** `noindex` hiylasi endi kerak emas — ikkita raqobatlashuvchi narxlar sahifasi umuman qolmadi.

**Tekshirildi:** `/tariflar` → 308 → `/narxlar`, `/ru/tariflar` → 308 → `/ru/narxlar`, `/presentation` → 308 → `/credentials`; `/narxlar` va `/credentials` → 200. `typecheck`, `lint`, `vitest` (249/249), `build` — toza.

---

## 2026-09-21 | Netlify qoldiqlari: `public/_headers` o'chirildi + o'chirish xavfsizligi tekshiruvi

**Savol:** Netlify butunlay o'chirilsa saytga zarar bormi?

**Tekshiruv natijasi — yo'q:**
- `jonbranding.uz` nameserverlari: `karl.ns.cloudflare.com`, `katja.ns.cloudflare.com` → DNS **Cloudflare**da, Netlify'da emas.
- A yozuvi: `76.76.21.21` → Vercel anycast IP.
- Vercel'da domen `verified: true`, `configVerifiedAt` o'rnatilgan, `serviceType: external`, `zone: false`.
- Netlify loyihasi (`brilliant-gumdrop-13991e`, id `fc716cd5-7945-4242-9f61-a74a83e69e01`) hali `https://jonbranding.uz` ni primary URL deb ko'rsatadi — bu eskirgan sozlama, DNS u yerga ishora qilmagani uchun hech qanday trafik olmaydi.
- Netlify Forms yoqilgan, lekin `get-forms-for-project` bo'sh massiv qaytardi — yo'qoladigan ma'lumot yo'q.

**Repo tomoni:** `netlify.toml` avval o'chirilgan. Qolgan yagona fayl — `public/_headers`, u faqat `/_next/static/*` uchun `Cache-Control: immutable` belgilardi. Vercel buni Next.js uchun o'zi qo'yadi, shuning uchun fayl o'chirildi. Xavfsizlik sarlavhalari (`Strict-Transport-Security`, `X-Frame-Options` va boshqalar) `next.config` dagi `headers()` da — ular Vercel'da ishlaydi, Netlify bilan bog'liq emas.

**Qo'lda qilinadigan ish (Netlify MCP'da o'chirish operatsiyasi yo'q):** dashboardda avval `jonbranding.uz` domenini loyihadan olib tashlash, keyin loyihani o'chirish, so'ngra repodan Netlify GitHub App'ni uzish. Shundan keyin PR'lardagi qizil Netlify tekshiruvlari yo'qoladi.

---

## 2026-09-21 | `/narxlar` va `/tariflar` o'rin almashdi

**Muammo:** Yangi narxlar sahifasi `/tariflar` da turardi va unga saytdan birorta ham link yo'q edi — ya'ni hech kim topa olmasdi. Header, footer, `pricing` redirecti va sitemap — hammasi eski sahifaga (`/narxlar`) ishora qilardi.

**Qilingan ish:** link o'zgartirilmadi, **sahifalar o'rin almashdi**:
- Yangi sahifa endi `/narxlar` da (`page.tsx` + `narxlar-client.tsx`, eski nomi `tariflar-client.tsx`).
- Eski sahifa `/tariflar` ga ko'chdi.
- Ikkalasining `canonical`, `alternates`, OG url va breadcrumb JSON-LD yo'llari o'zgartirildi.

**Nega link emas, sahifa ko'chirildi:** `/narxlar` — SEO tarixi bor, tabiiy o'zbekcha manzil. Yangi sahifa o'shani olishi kerak. Linklarni `/tariflar` ga burish esa yaxshi sahifani begona manzilda qoldirardi.

**Eski sahifa `noindex`:** ikkita narxlar sahifasi qidiruvda bir-biri bilan raqobatlashmasligi uchun `/tariflar` ga `robots: { index: false, follow: true }` qo'yildi. Sitemapda faqat `/narxlar` bor.

**Analitika:** `LeadModal` ning `source` standart qiymati `tariflar` dan `narxlar` ga o'zgardi, `/narxlar` sahifasi uni aniq uzatadi (`narxlar_page` / `narxlar_modal`).

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249), `npm run build` — ikkala route ham qurildi.

---

## 2026-09-21 | `/credentials` qaytadan qurildi — slaydli taqdimot, `/presentation` yopildi

**Sabab:** Egasi ikkala taqdimotni ham rad etdi ("ikkalasi ham", "hammasi"). Birinchi `/credentials` versiyasi uzun scroll sahifa edi — oldingi "gazeta bo'lib qolyapti" e'tiroziga qaytib tushgan. Eski `/presentation` esa eskirgan raqamlar bilan turardi ("50+ loyiha", holbuki 1000+).

**Yangi format — slayd deki:**
1. `credentials-client.tsx` to'liq qayta yozildi. Scroll o'rniga ekranma-ekran slaydlar: klaviatura (←/→/Space/Home/End), svayp, tugmalar, yuqorida progress chizig'i, pastda `01 / 18 — Nomi` hisoblagichi.
2. **Tipografika** — sarlavhalar `--font-serif` (Instrument Serif), eyebrow va raqamlar `--font-mono`. Ilgari hamma joyda sans edi, shuning uchun zaif ko'rinardi.
3. **Keys slaydlari** — rasm butun ekranga (`fill`, gradient overlay), matn pastda. Matn devoridan qutulish uchun asosiy o'zgarish shu.
4. Slaydlar: muqova → mijozlar → muammo → yechim → har keys alohida → har xizmat guruhi alohida → paketlar → jarayon → kafolatlar → har sharh alohida → CTA.
5. **PDF** — `@media print` da barcha slaydlar ketma-ket chiqadi (`cred-print-all`), har biri alohida sahifa (`break-after: page`).

**Sayt chrome'i yopildi:** taqdimotda header, footer, sticky CTA, Oisha widget, cookie banner, lead-magnet popup va mobil nav slaydlar ustiga tushib, ekran ulashuvda ko'rinib qolardi. `header.tsx` va `footer.tsx` da mavjud `/pro-preview` shartiga `/credentials` qo'shildi; `client-enhancements.tsx` da `isDeck` bayrog'i olti komponentni o'chiradi.

**`/presentation`:** `presentation-client.tsx` o'chirildi, `page.tsx` `/credentials` ga `redirect` qiladi. Sahifa butunlay o'chirilmadi — link tarqatilgan bo'lishi mumkin. Koddan hech narsa unga link bermas edi.

**Vizual tekshiruv:** Playwright bilan 1440×900 va 390×844 da muqova, muammo, xizmatlar va paketlar slaydlari suratga olindi va ko'rildi. Chap pastdagi "N" doira — Next.js dev indikatori, productionda yo'q.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249), `npm run build` — hammasi toza.

**Ochiq:** i18n hali yo'q — matn komponent ichida, `/ru` `/en` `/zh` da o'zbekcha ko'rinadi.

---

## 2026-09-21 | Telegram → Sanity: dublikatga qarshi himoya (ikkala tizim birga ishlay oladi)

**Muammo:** Bir Telegram postini ikkita mustaqil tizim o'qiydi — `src/app/api/portfolio-telegram` (Vercel webhook) va `services/portfolio-bot` (userbot). Ikkalasi ham Sanity'ga `client.create()` bilan yozardi, ya'ni bir postdan ikkita portfolio hujjati chiqishi mumkin edi. Mavjud slug tekshiruvi buni ushlamaydi: slug Gemini bergan sarlavhadan yasaladi, ikkala tizim esa har xil sarlavha olishi mumkin.

**Yechim — post matnidan barqaror hujjat ID'si:**
1. `src/lib/portfolio-dedup.ts` — `normalizeCaption()` (kichik harf, faqat lotin/kirill harf va raqamlar, ortiqcha bo'shliqlar olib tashlanadi, 500 belgigacha) va `portfolioDocId()` (sha1, `tg-<32 hex>`). Matn 20 belgidan qisqa bo'lsa `null`.
2. Ikkala yozuvchi ham shu ID bilan `createIfNotExists` ishlatadi. Kim birinchi ulgursa o'sha yozadi, ikkinchisi mavjud hujjatni qaytaradi — poyga holatida ham dublikat chiqmaydi.
3. Rasmlarni yuklashdan **oldin** ID bo'yicha tekshiriladi, shunda bekorga Sanity asset upload qilinmaydi.
4. Eski slug tekshiruvi saqlandi — ikkinchi qatlam sifatida.

**Nusxa haqida:** `services/portfolio-bot` alohida TypeScript loyihasi (`rootDir: src`), asosiy ilovadan import qila olmaydi. Shuning uchun `portfolioDocId` nusxasi `services/portfolio-bot/src/sanity.ts` da ham bor. Algoritm ikkala joyda bir xil bo'lishi SHART. `src/lib/portfolio-dedup.test.ts` dagi golden test shuni ushlab turadi: `"Bekmarket Zayyan Naming va Branding loyihasi"` → `tg-bef7595f22b63cb44d469111d37ed19e`. Nusxani o'zgartirsangiz testni ham yangilang.

**Eslatma:** `\p{L}` unicode property escape ishlatilmadi — `tsconfig.typecheck.json` eski ES maqsadida TS1501 beradi. O'rniga aniq diapazonlar: `a-z0-9`, `\u00C0-\u024F` (kengaytirilgan lotin), `\u0400-\u04FF` (kirill).

**Natija:** Endi webhook va portfolio-bot bir vaqtda ishlasa ham xavfsiz. Bittasini o'chirish shart emas.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (249/249, 6 tasi yangi), `npm run build`, `services/portfolio-bot` uchun `tsc` va `dist` qayta yig'ildi.

**Cheklov:** Post matni ikki tizim o'qishi orasida tahrirlansa, hash o'zgaradi va himoya ishlamaydi. Bunday holatda slug tekshiruvi ikkinchi qatlam bo'lib qoladi.

---

## 2026-09-21 | `/credentials` — sotuvchi uchun taqdimot sahifasi

**Muammo:** Sotuvchi qo'ng'iroq paytida narxlar, keyslar, jarayon va kafolatlarni bir nechta sahifadan yig'ib ko'rsatishga majbur edi.

**Qilingan ish:**
1. **Kontent ajratildi** — `/tariflar` ichidagi barcha matn konstantalari yangi `src/lib/sales-content.ts` fayliga ko'chirildi va eksport qilindi: `SERVICE_GROUPS`, `PACKAGES`, `SERVICE_CATEGORIES`, `ALL_SERVICES`, `FAQS`, `WHY_US`, `GUARANTEES`, `JOBS`, `PROCESS_STEPS`, `PRICE_FACTORS`. Endi matn bitta joyda tahrirlanadi, ikkala sahifa ham o'zgaradi.
2. **`LeadModal` umumiy komponentga chiqarildi** — `src/components/sales/lead-modal.tsx`. Yangi `source` prop analitikada arizani qaysi sahifa keltirganini ajratadi (`tariflar_page` / `credentials_page`).
3. **Yangi sahifa** — `src/app/[lang]/credentials/` (`page.tsx` + `credentials-client.tsx`). Bitta scroll sahifa, 9 ta raqamlangan bo'lim: muqova (9 yil / 500+ / 1000+), mijozlar logotiplari, 6 ta keys, JTBD, xizmatlar va narxlar, paketlar, jarayon + to'lov 50/30/20, nega biz + kafolatlar, mijozlar fikri, CTA.
4. **PDF eksport** — muqovadagi tugma `window.print()` chaqiradi. `@media print` qoidalari tugmalarni yashiradi va bo'limlarni sahifa bo'linishidan saqlaydi.
5. **Indekslanmaydi** — sahifa metadata'sida `robots: { index: false, follow: false }`, qo'shimcha `src/app/robots.ts` dagi `protectedPaths` ro'yxatiga `/credentials` qo'shildi. Narxlar ochiq turgani uchun sahifa faqat suhbat davomida link orqali beriladi.

**Ma'lumot manbalari:** `fetchPortfolioList`, `fetchTestimonials`, `fetchBrands` — `/tariflar` bilan bir xil.

**Tekshirildi:** `npm run typecheck`, `npm run lint`, `npx vitest run` (243/243) — hammasi toza. Kontent ko'chirish xatti-harakatni o'zgartirmaydi.

**Ochiq qolgan ishlar:**
- i18n: `/credentials` matni ham `/tariflar` kabi komponent ichida qattiq yozilgan. `ru`/`en`/`zh` da o'zbekcha ko'rinadi. Matn barqarorlashgach `src/locales/*.json` ga ko'chirilishi kerak (AGENTS.md 1/2/9-qoidalar).
- `window.print()` — brauzerning o'z PDF eksporti. Agar brendlangan PDF kerak bo'lsa, alohida server-side generatsiya kerak.

---

## 2026-09-21 | Portfolio Enrichment Mode: Mavjud Keyslarni Boyitish va Yangilash

**Vazifa:** Agar portfolio keysi avvaldan mavjud bo'lsa, uni o'tkazib yubormasdan (skip qilmasdan), yangi rasmlar, boy tavsif, natijalar, teglar va SEO ma'lumotlari bilan boyitish (enrich qilish), agar mavjud bo'lmasa, yangi keys sifatida joylash.

**Nima qilindi:**
1. **Sanity Enrichment funksiyasi (`services/portfolio-bot/src/sanity.ts`):**
   - `enrichPortfolioDocument(documentId, parsed, imageFiles)` funksiyasi yaratildi.
   - Mavjud rasmlar saqlangan holda yangi rasmlar `galleryImages` massiviga qo'shiladi (asset ref tekshiruvi orqali dublikatlarsiz).
   - `tags`, `results` (yangi metrikalar), `description`, `body`, `seoKeywords`, `metaTitle`, `metaDescription` aqlli tarzda birlashtiriladi (merge qilinadi).
2. **Pipeline yangilandi (`services/portfolio-bot/src/pipeline.ts`):**
   - Agar slug bo'yicha Sanity'da mavjud hujjat topilsa, u to'xtab qolmaydi, balki `enrichPortfolioDocument` orqali yangilanadi va natijada `🔄 Yangilandi va boyitildi (Enriched)` statusi beriladi.
3. **Webhook Route yangilandi (`src/app/api/portfolio-telegram/route.ts`):**
   - `/api/portfolio-telegram` orqali Telegram'dan kelgan xabar avvalgi keysga tegishli bo'lsa (masalan, qo'shimcha rasmlar yoki yangilangan matn), Sanity'dagi mavjud hujjatga yangi rasmlar va ma'lumotlar qo'shilib boyitiladi.
4. **Tekshiruv:**
   - `npm run build` (`services/portfolio-bot`) va `npm run typecheck` muvaffaqiyatli o'tdi.
   - Test orqali mavjud `R Studio` keysi yangi teglar va natijalar bilan muvaffaqiyatli boyitildi.

---

## 2026-09-21 | Barcha Telegram va Instagram Portfoliolari Sanity CMS'ga To'liq Yuklandi (Jami 21 ta Keys)

**Vazifa:** Telegram (`@JonBranding`) va Instagram (`@jon.branding`) sahifalaridagi barcha haqiqiy mijoz portfoliolari Sanity CMS orqali veb-saytga to'liq kiritildi.

**Natija — Jami 21 ta Jonli Portfolio Keyslari:**
1. **Perfona Logotip va Brending** (`perfona-logotip-va-brending`) — Logo dizayn (9 ta rasm)
2. **PETRON POLYMER brendini yaratish** (`petron-polymer-brendini-yaratish`) — Firma uslubi (10 ta rasm)
3. **R Studio brend logotipi** (`r-studio-brend-logotipi`) — Logo dizayn (10 ta rasm)
4. **Yasira: Go'zallik va Tozalik** (`yasira-gozallik-va-tozalik`) — Firma uslubi (Instagram dan, 10 ta rasm)
5. **FIDDA by Sevara: Kumush brendi** (`fidda-by-sevara-kumush-brendi`) — Brend strategiya (10 ta rasm)
6. **Velzo: Brend Tizimi** (`velzo-brend-tizimi`) — Brendbuk (10 ta rasm)
7. **Den Aroma: Brend Transformatsiyasi** (`den-aroma-brend-transformatsiyasi`) — Brend strategiya (10 ta rasm)
8. **Sarmilk: Brend Identikasini Yaratish** (`sarmilk-brend-identikasini-yaratish`) — Firma uslubi (10 ta rasm)
9. **Jafiko Light Brend Identifikatsiyasi** (`jafiko-light-brend-identifikatsiyasi`) — Firma uslubi (10 ta rasm)
10. **Boyarin brendini yoshartirish** (`boyarin-brendini-yoshartirish`) — Firma uslubi (10 ta rasm)
11. **Prime Fit: Brend Identikasi** (`prime-fit-brend-identikasi`) — Brendbuk (10 ta rasm)
12. **Bodomchi: Brend Aydentikasi** (`bodomchi-brend-aydentikasi`) — Brendbuk (10 ta rasm)
13. **Rutera: Brending va Patent** (`rutera-brending-va-patent`) — Brend strategiya (10 ta rasm)
14. **Sofmir: Mebel Aksessuarlari Brendingi** (`sofmir-mebel-aksessuarlari-brendingi`) — Logo dizayn (10 ta rasm)
15. **Feel it: SAT uchun logo** (`feel-it-sat-uchun-logo`) — Logo dizayn (10 ta rasm)
16. **Bekmarket Zayyan Naming & Branding** (`bekmarket-zayyan-naming-branding`) — Neyming (10 ta rasm)
17. **Geonest** (`geonest`) — Neyming
18. **Enros** (`enros`) — Neyming
19. **Revo** (`revo`) — Brendbuk
20. **ARFADEL** (`arfadel`) — Brendbuk
21. **SAVOD rebrending keys** (`savod-rebrending-keys`) — Firma uslubi

**Texnik optimallashlar:**
- `gemini-2.5-flash-lite` modeliga o'tildi (Gemini 2.5 Flash free tier 20 RPD chegarasini yengish uchun).
- Rasm yuklashda video yoki noto'g'ri fayl turlarini (magic bytes tekshiruvi orqali) Sanity'ga yubormaslik filtri qo'shildi.
- AI tahlilida multimodal rasm soni 2 taga cheklandi (token bo'g'ilishini oldini olish uchun), Sanity'ga esa barcha rasmlar to'liq yuklandi.
- Kategoriya nomlari Sanity schemadagi qat'iy ro'yxat (`logo-design`, `naming`, `brandbook`, `corporate-style`, `packaging`, `brand-strategy`) bilan sinxronlashtirildi.

---

## 2026-09-21 | Telegram Portfoliolarini Sanity CMS'ga Yuklash va No-Portfolio Filtrlash

**Tuzatish (No-Portfolio Guard):**
- Telegram kanalidagi "Kichik boshlash — normal holat..." (Poydevor) posti aslida portfolio keys emas, balki kontent/lead-magnit posti bo'lgani sababli, Sanity'dan (`V2a6kRsf39b2Ai1A2vNgG6`, `biznesingiz-uchun-mustahkam-poydevor`) butunlay **o'chirildi**.
- Ham `services/portfolio-bot` (userbot), ham `/api/portfolio-telegram` (webhook) pipeline'lariga qat'iy **`isPortfolioCase: boolean`** AI filtri qo'shildi:
  - Faqat aniq mijoz/brendga qilingan ishlar (logotip, qadoq, brending, neyming) `true` oladi va Sanity'ga chiqadi.
  - Umumiy maslahat, maqola, reklama yoki CTA postlar avtomatik `false` olinadi va o'tkazib yuboriladi.

**Haqiqiy Jonli Keyslar (Sanity CMS):**
1. **Bekmarket Zayyan Naming & Branding** (Sanity ID: `2aWf3QCMOiMohdaXTan22p`, slug: `bekmarket-zayyan-naming-branding`, 10 ta rasm)
2. **Feel it: SAT uchun logo** (Sanity ID: `V2a6kRsf39b2Ai1A2vNenW`, slug: `feel-it-sat-uchun-logo`, 10 ta rasm)

Sanity'dagi haqiqiy portfolio loyihalar soni: **7 ta** (barchasi haqiqiy mijoz keyslari).

---

## 2026-09-21 | Portfolio ingestion: VM'siz webhook yo'li (`/api/portfolio-telegram`)

**Vazifa:** Telegram kanalga tashlangan keyslar saytga avtomatik chiqsin — server (VM) talab qilmasdan.

**Nega alohida yo'l:** `services/portfolio-bot` shu ishni GramJS userbot orqali qiladi, lekin doimiy VM va interaktiv Telegram sessiyasi talab qiladi — shu sabab u ilgari to'xtab qolgan edi. Bu route o'sha to'siqni olib tashlaydi.

**Qanday ishlaydi:**
1. Telegram webhook `POST /api/portfolio-telegram` ga postni **darhol** yuboradi. Tekshiruv: `X-Telegram-Bot-Api-Secret-Token` header (`TELEGRAM_WEBHOOK_SECRET`).
2. Post Firestore navbatiga (`telegram_portfolio_queue`) yoziladi, kaliti `media_group_id` — albomdagi 5-10 rasm bitta yozuvga yig'iladi.
3. 7 soniya kutiladi (albomning qolgan rasmlari uchun), so'ng tranzaksiya bilan "band qilinadi" — bir nechta webhook chaqiruvi baravar ishlov bermasligi uchun.
4. Gemini matndan metadata ajratadi → rasmlar avval Drive papkasidan (nom bo'yicha fuzzy qidiruv), topilmasa postning o'z rasmlaridan → Sanity'ga portfolio hujjati yoziladi.
5. Slug allaqachon mavjud bo'lsa, o'tkazib yuboriladi (dublikat bo'lmaydi).

**Zaxira:** kunlik cron (`0 9 * * *`) va qo'lda `GET ?secret=...` — webhook o'tkazib yuborgan yozuvlarni tozalaydi.

**Muhim:** Vercel **Hobby** rejasida cron kuniga faqat bir marta ishlaydi — `*/30 * * * *` deploy'ni butunlay buzadi. Shuning uchun asosiy mexanizm cron emas, webhook.

**Sozlash:**
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://jonbranding.uz/api/portfolio-telegram&secret_token=<TELEGRAM_WEBHOOK_SECRET>&allowed_updates=[\"channel_post\"]"
```
Bot kanalga **admin** qilib qo'shilishi shart. Kerakli env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `SANITY_TOKEN`, ixtiyoriy `DRIVE_PARENT_FOLDER_ID`, `TG_PORTFOLIO_CHANNEL`.

**Ogohlantirish:** bu route va `services/portfolio-bot` bir vaqtda ishlamasin — ikkalasi bir postdan ikkita Sanity hujjati yaratadi.

**Tekshiruv:** typecheck, lint, 243/243 test, `npm run build` — hammasi o'tdi.

---

## 2026-09-21 | Telegram va Instagram Portfoliolarini Saytga Avtomatik Joylash Tizimi

**Vazifa:** Telegram (@JonBranding) va Instagram (@jon.branding) kanallariga joylangan keyslar/portfoliolar avtomatik ravishda web saytning Portfolio bo'limiga (Sanity CMS orqali) joylansin.

**Nima qilindi:**
1. **Telegram Media & Album Support (`services/portfolio-bot/src/userbot.ts`):**
   - GramJS da Telegram kanallaridan keladigan xabarlardagi rasm va fayllarni to'g'ridan-to'g'ri yuklab olish (`downloadMedia`) qo'shildi.
   - Albomlar (`groupedId`) uchun 2.5 soniyalik debounce buferi yaratildi: bitta postdagi 5-10 ta rasm alohida xabar sifatida kelganda barchasi bitta keysga to'planadi.
2. **Drive Fallback & Direct Media Pipeline (`services/portfolio-bot/src/pipeline.ts`):**
   - `processPost` funksiyasi `localImages` qabul qiladigan qilindi.
   - Agar Google Drive'da loyiha papkasi topilsa, original sifatli rasmlar olinadi; agar Drive papkasi bo'lmasa, to'g'ridan-to'g'ri Telegram/Instagram'dan olingan rasmlar bilan Sanity'ga to'liq portfolio hujjati yaratiladi.
3. **Instagram Graph API Integratsiyasi (`services/portfolio-bot/src/instagram.ts`):**
   - Faqat pullik Apify'ga bog'langanlik olib tashlandi: `INSTAGRAM_ACCESS_TOKEN` orqali to'g'ridan-to'g'ri Instagram Graph API orqali postlar, karusellar (`children.data`) va rasmlarni yuklab olish qo'shildi (Apify faqat ikkinchi zaxira sifatida qoldirildi).
4. **Workflow Yangilanishi (`services/portfolio-bot/src/workflow.ts`):**
   - `requireDriveLink: false` qilindi — endi postlar Drive'siz ham to'liq mustaqil Sanity portfolio loyihasiga aylanadi.
5. **Gemini 2.0 Flash & Retry Logic (`services/portfolio-bot/src/ai-processor.ts`, `src/lib/integrations/gemini.ts`):**
   - Noto'g'ri `gemini-2.5-flash` chaqiruvlari barqaror `gemini-2.0-flash` ga o'tkazildi.
   - 429/503 xatolarida eksponentsial kechikishli `callGeminiWithRetry` (3 ta urinish) qo'shildi.

**Tekshiruv:**
- `services/portfolio-bot`: `npm run build` muvaffaqiyatli (tsc 0 errors).

---

## 2026-09-21 | Yangi `/tariflar` sahifasi — JTBD, FAB va har xizmatga alohida ekran (PR #327 → #328 → #329)

**Vazifa:** Mavjud `/narxlar` (aslida `XizmatlarClient`ni ko'rsatadi) sahifasidan alohida, narxlari ochiq, o'zi sotadigan narxlar sahifasi.

**Nima qilindi:**
1. **Yangi route** `src/app/[lang]/tariflar/` — `page.tsx` (metadata, breadcrumb JSON-LD) + `tariflar-client.tsx`. `/narxlar` va `/pricing` tegilmadi.
2. **Struktura:** hero → JTBD bloki → xizmatlar → jarayon va to'lov → narx omillari → paketlar (oxirida) → CTA. Paketlar ataylab oxirida: mijoz avval alohida narxlarni ko'radi, keyin paket arzonroq ekanini biladi (VIP 15 mln, PREMIUM 10 mln, STANDART 3 mln tejash ko'rsatiladi).
3. **FAB:** har bir xizmatda `deliverables` (funksiya) dan tashqari `benefit` qatori — mijoz oladigan foyda.
4. **JTBD bloki:** 4 ta "Hozir → Biz bilan" juftligi.
5. **Har xizmat alohida to'liq ekran** (`min-h-[100svh]`): chapda nom/narx/muddat/CTA (sticky), o'ngda deliverables + foyda + isbot.
6. **Naming bo'limi** rasmiy taqdimot PDF asosida aniqlashtirildi (3 ta bepul tahrir, domen/Telegram/Instagram tekshiruvi) + 19 ta ishlangan nom isbot sifatida qo'shildi.
7. **Tipografika:** JetBrains Mono eyebrow/yorliqlar, Instrument Serif kursiv urg'ular, tabular raqamlar.
8. **Matn:** birinchi shaxs ko'plik ("Narxlarimiz ochiq"), "yaratish" so'zi ishlatilmaydi ("Brend qurish").
9. **Patent muddatlari to'g'irlandi:** oddiy 7 oy, tezkor 20–40 kun. Paket muddatlari faqat dizayn ishlari uchun ekani izohlandi.
10. **Netlify o'chirildi:** `netlify.toml` va `build:netlify` skripti olib tashlandi (deploy Vercel orqali). Netlify checklari shundan keyin har PR'da qizil — Netlify loyihasini repodan uzish kerak (panel ishi).

11. **Sotuvni kuchaytirish (isbot va e'tirozlar):**
   - Har bir xizmat ekranida shu kategoriyadagi 2 tagacha real keys (muqova, mijoz, natija raqami), `fetchPortfolioList` orqali.
   - Brandbook ekranida keys kartasi o'rniga tez almashinadigan galereya (`ShowcaseReel`, 1.4s, `prefers-reduced-motion` hurmat qilinadi). Shu sabab `LIST_QUERY` ga `galleryImages` qo'shildi.
   - Ijtimoiy isbot bo'limi: 16 ta mijoz logotipi (`fetchBrands`) + 3 ta real otziv (`fetchTestimonials`).
   - "Nega arzon dizayner emas" bloki va "Xavfingizni kamaytirish uchun" ro'yxati (faqat haqiqatan mavjud shartlar — pul qaytarish kafolati EGASI tasdig'ini kutmoqda).
   - FAQ bloki CTA'dan oldin: narx e'tirozi, "yoqmasa nima bo'ladi", mijozdan nima talab qilinadi, bo'lib to'lash, patent chiqmasligi.
12. **Tuzatish:** `globals.css` barcha sarlavhalarga `color: hsl(var(--foreground))` beradi — qora fonli CTA sarlavhasi ko'rinmay qolgan edi, aniq oq rang qo'yildi.

**Ochiq qolgan ishlar:**
- **i18n:** sahifa matnlari hozircha komponent ichida, `uz.json`da emas. `/ru`, `/en`, `/zh` da o'zbekcha ko'rinadi. Uzbek-first qoidasiga ko'ra matn qotgach lug'atlarga ko'chirilishi kerak.
- Sotuvni kuchaytirish uchun: portfolio rasmlari, mijoz otzivlari, FAQ/e'tirozlar bloki, kafolat.

---

## 2026-09-21 | /tariflar preview manbasi tekshirildi

**Vazifa:** `jonbranding-web-git-claude-pricing-ab630a-baxtiyorjons-projects.vercel.app/tariflar` sahifasi kodlari qayerdan turibdi va Claude qo'shganmi, aniqlash.

**Nima tekshirildi:**
- Lokal `main` branchda `/tariflar` route topilmadi; hozirgi narx sahifasi `src/app/[lang]/narxlar/page.tsx` orqali ishlaydi.
- `src/app/[lang]/pricing/page.tsx` esa `/narxlar` ga redirect qiladi.
- Lokal branchlar ichida `claude/*` branchlar ko'p, lekin aynan `claude/pricing-ab630a` branchi topilmadi.
- Vercel preview URL nomidagi `git-claude-pricing-ab630a` branch nomiga o'xshaydi, shu sabab sahifa katta ehtimol bilan Claude yaratgan preview branchdan kelgan.
- GitHub remote branchlarini live tekshirishga urinishda `github.com` ulanishi proxy sabab muvaffaqiyatsiz bo'ldi; shu sabab remote branch mavjudligi lokal muhitdan yakuniy tasdiqlanmadi.

**Holat:** Qisman tasdiqlandi — URL nomi Claude branch preview ekanini ko'rsatadi, lekin lokal checkoutda bu branch yo'q va remote tekshiruv tarmoq sabab yakunlanmadi.

**Keyingi aniqlik (2026-09-21):** `/tariflar` sahifasi PR #327 → #328 → #329 orqali `main`ga qo'shildi — `src/app/[lang]/tariflar/`.

---

## 2026-09-19 | Sotuv menejerlari uchun ochiq Patent kalkulyatori va patent.jonbranding.uz subdomeni

**Vazifa:** Mijozlar uchun kalkulyator gated (lead capture) holatda qolsin, lekin sotuv menejerlarimiz uchun doimiy ochiq (unlocked) versiyasi alohida `patent.jonbranding.uz` subdomenida bo'lsin.

**Nima qilindi:**
1. **Komponent moslashuvchanligi:** `src/components/sections/trademark-calculator.tsx` ga `alwaysUnlocked?: boolean` prop qo'shildi. `alwaysUnlocked={true}` bo'lganda lead gate va blur bekor qilinib, kalkulyator to'liq ochiq holatda ishlaydi.
2. **Yangi ichki sahifa:** `src/app/[lang]/patent-menejer/` yaratildi:
   - `layout.tsx`: Qidiruv tizimlari indekslamasligi uchun `robots: { index: false, follow: false }` qo'yildi.
   - `page.tsx`: `TrademarkCalculator`ni `alwaysUnlocked={true}` bilan chaqiradi va sotuv menejerlari uchun JonBranding kaskad narxlash algoritmi (10% Istisno, 10% Salom, 10% Promokod, $50 Arboun) cheat-sheetini taqdim etadi.
3. **Subdomen routing (Middleware/Proxy):** `src/proxy.ts` ga `host.startsWith('patent.')` tekshiruvi qo'shildi. `patent.jonbranding.uz` orqali kelgan barcha so'rovlar avtomatik ravishda `/${locale}/patent-menejer` sahifasiga rewrite qilinadi.
4. **Test:** `src/proxy.test.ts` ga subdomen routing bo'yicha unit test qo'shildi va 5/5 test muvaffaqiyatli o'tdi.
5. **Mijozlar sahifasi saqlandi:** `/xizmatlar/patent-kalkulyatori` va `/patent-narxi-hisoblagich` sahifalari o'zgarishsiz, lead magnit (gated) sifatida qoldi.

## 2026-09-19 | Patent Kalkulyatori: "Unexpected end of JSON input" va /api/submit-form 500 xatosi to'liq tuzatildi

**Muammo:** Patent kalkulyatori sahifasida (`/xizmatlar/patent-kalkulyatori`) foydalanuvchi ma'lumotlarni to'ldirib yuborganda:
1. Frontendda qizil bannerda xatolik: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`.
2. Backendda `/api/submit-form` va boshqa `firebase-admin` ishlatuvchi routelar 500 (Content-Length: 0) bilan crash bo'layotgan edi.

**Ildiz sabablari:**
1. **Frontend:** `trademark-calculator.tsx` va `contact-modal.tsx` ichida `fetch('/api/submit-form')` chaqirilgach, `if (!response.ok)` blokida `await response.json()` hech qanday xato ushlagichsiz (`.catch()`) chaqirilgan. Agar server 500/502/504 yoki bo'sh body qaytarsa, brauzer `Unexpected end of JSON input` deb crash bo'lgan.
2. **Backend:** `package.json`dagi `uuid: 11.1.1` override sababli CommonJS muhitidagi `gaxios` (Google Cloud / Firebase Admin ichki HTTP mijozi) `require('uuid')` chaqirganda `ERR_REQUIRE_ESM` bilan yiqilgan (chunki `uuid` 10+ versiyalari ESM hisoblanadi). Natijada route moduli yuklanish paytida crash bo'lib, unhandled 500 (bo'sh body) qaytargan.
3. **API Route:** `src/app/api/submit-form/route.ts` ichida `try/catch` bloki `getClientIp()` va `rateLimit()` dan keyin boshlangan edi, shuning uchun ulardagi har qanday xatolik butun routeni unhandled 500 ga olib kelardi.

**Nima qilindi:**
- `package.json` va `pnpm-lock.yaml` dan `uuid` override'lari butunlay olib tashlandi. `gaxios` o'zining tabiiy `uuid@9.0.1` (CommonJS) versiyasini ishlatadigan bo'ldi.
- `src/components/sections/trademark-calculator.tsx` va `src/components/contact-modal.tsx` da `await response.json().catch(() => null)` qo'shildi, natijada har qanday server xatoligida foydalanuvchiga tushunarli xabar ko'rsatiladi.
- `src/app/api/submit-form/route.ts` dagi butun `POST` funksiyasi `try/catch` ichiga olindi.
- `npx vitest run`: 36 ta test fayli, 242/242 test muvaffaqiyatli o'tdi.
- `npm run build`: muvaffaqiyatli yakunlandi (165/165 static sahifa).

---

## 2026-09-19 | uuid override tuzatildi — /api/submit-form ERR_REQUIRE_ESM crash (PR #325 → #326)

**Muammo:** patent kalkulyatori (`/xizmatlar/patent-kalkulyatori`) formasi yuborilganda production'da 500 xato, frontendda "Unexpected end of JSON input". Vercel runtime loglari sabab ko'rsatdi: `Error: require() of ES Module uuid@14.0.1 ... from gaxios@6.7.1 not supported` (`ERR_REQUIRE_ESM`).

**Ildiz sabab:** `package.json`dagi `pnpm.overrides.uuid` `"uuid@<11.1.1": ">=11.1.1"` shaklida yozilgan edi — bu faqat 11.1.1'dan **past** versiyalarni ko'taradi, `uuid@13`/`14` (ESM-only) kabi yuqori versiyalarni cheklamaydi. `gaxios` (firebase-admin/googleapis zanjiri) transitiv `uuid`ni `require()` bilan chaqirganda ESM versiyaga tegib crash bo'lgan.

**Birinchi urinish (PR #325):** root darajadagi `"overrides": {"uuid": "^11.1.1"}`ni qat'iy `"11.1.1"`ga o'zgartirdim — bu yetarli emas edi, chunki muammo aynan `pnpm.overrides` blokidagi range-conditional sintaksisda edi. Merge qilingach ham xato davom etdi (Vercel runtime logs orqali tasdiqlandi).

**Haqiqiy tuzatish (PR #326):** `pnpm.overrides.uuid`ni `"uuid@<11.1.1": ">=11.1.1"` dan oddiy `"uuid": "11.1.1"`ga o'zgartirdim — bu pnpm'da butun dependency grafida shartsiz qo'llanadi.

**Tekshiruv:**
- Toza `rm -rf node_modules && pnpm install --frozen-lockfile` — `node_modules/.pnpm`da faqat `uuid@11.1.1` qoldi (Sanity/uuidv7'ning alohida paketlaridan tashqari).
- `readlink -f node_modules/.pnpm/gaxios@6.7.1/node_modules/uuid` → `uuid@11.1.1`ga ishora qildi (to'g'ri).
- `npx vitest run` — 36 fayl, 242/242 o'tdi.
- `npm run build` — muvaffaqiyatli.

---

## 2026-09-15 | Dependabot zaifliklarini 100% bartaraf etish (13 ta alert to'liq yopildi)

**Nima qilindi:**
- **Maqsad:** GitHub Security Overview panelidagi barcha 13 ta ochiq Dependabot ogohlantirishlarini bartaraf etish va Security holatini 100% yashil holatga keltirish.
- **Root qaramliklar:**
  - `package.json`: `@next/third-parties` va `eslint-config-next` `^16.3.5` ga ko'tarildi (Next.js 16.3.5 bilan sinxronlandi).
  - `overrides`: `adm-zip` (`^0.6.1`), `smol-toml` (`^1.8.0`), `browserslist` (`^4.28.9`), `qs` (`^6.16.0`), `js-yaml` (`$js-yaml`) xavfsiz versiyalarga o'tkazildi.
  - `package.json`ga `pnpm.overrides` qo'shildi (`adm-zip`, `js-yaml`, `smol-toml`, `qs`, `browserslist`, `undici`, `uuid`).
  - `package-lock.json` va `pnpm-lock.yaml` to'liq yangilandi.
- **Sub-loyihalar:**
  - `services/portfolio-bot`: `package.json` overrides ga `qs: ^6.16.0` qo'shildi, `package-lock.json` yangilandi.
  - `mcp-server`: `package.json` overrides ga `qs: ^6.16.0` qo'shildi, `package-lock.json` yangilandi.
- **Git hygiene:**
  - `.gitignore`: `node_modules/` va `/.vitest/` qo'shildi.
  - Redundant PR #323 yopildi (`test/setup.ts` allaqachon #321 orqali main da mavjud).

**Tekshiruv natijalari:**
- `npm audit` (root) — 0 vulnerabilities (toza).
- `pnpm audit` (root) — No known vulnerabilities found (toza).
- `npm audit` (`services/portfolio-bot`) — 0 vulnerabilities (toza).
- `npm audit` (`mcp-server`) — 0 vulnerabilities (toza).
- `npm run typecheck` — toza (0 xato).
- `npm run test` (Vitest) — 36 fayl, 242/242 test o'tdi (100% pass).

---

## 2026-09-15 | Hamkorlar (Affiliate) tizimi — toʻliq implementatsiya (PR #321)

**Nima qilindi:**
- **Maqsad:** ochiq roʻyxatdan oʻtadigan hamkorlar (affiliate) tizimi — promokod orqali attribution, amoCRM webhook orqali avtomat bonus, hamkor kabineti (login yoʻq, maxfiy token havola), admin toʻlov paneli.
- **Supabase**: 3 jadval (`affiliates`, `referrals`, `payouts`), RLS toʻliq deny (faqat service-role). Migratsiya: `supabase/migrations/20260904120000_affiliates.sql`.
- **Bonus jadvali**: `src/lib/affiliate/payouts.ts` — naming/logo/patent 500,000 soʻm, packaging 800,000, full_branding 1,200,000.
- **Sahifalar**: `/[lang]/hamkor/qoshilish` (roʻyxat), `/[lang]/hamkor/[token]` (hamkor kabineti), `/admin/hamkorlar` (`ADMIN_SECRET`, HMAC cookie).
- **Jarayon**: brainstorm → spec (`docs/superpowers/specs/2026-09-04-affiliate-system-design.md`) → 14-task implementatsiya rejasi (`docs/superpowers/plans/2026-09-04-affiliate-system.md`) → subagent-driven ijro → final whole-branch review (3 Critical + 9 Important) → fix wave → scoped re-review (12/12 tuzatilgan).
- **PR #321 ustidagi qoʻshimcha tuzatishlar** (Codex review, P1):
  - Register endpoint endi dublikat telefon holatida boshqa hamkorning maxfiy `accessToken`ini qaytarmaydi (xavfsizlik — telefon raqami maʼlum boʻlsa boshqa hamkor kabinetiga kirish mumkin edi).
  - amoCRM webhook notoʻgʻri/mahalliylashtirilgan xizmat nomi (masalan "Қадоқ дизайни") uchun eng qimmat bonus (full_branding) tikmasdan, qoʻlda tekshirishga yoʻnaltiradi.
  - Kalkulyatorning barqaror ingliz xizmat kalitlari (`serviceKeys`) endi `packageSummary` bilan birga yuboriladi va attribution ular orqali ustuvor aniqlanadi.
  - Hamkor kabineti valyuta yorligʻi (`so'm`/`сум`/`sum`/`苏姆`) endi `lang` boʻyicha toʻgʻri koʻrsatiladi (avval har doim `so'm`).
  - `test/setup.ts`даgi jest-dom import vitest tipiga moslashtirildi (`@testing-library/jest-dom/vitest`) — CI'даgi "Typecheck, lint, test, build" talab qilingan tekshiruv iyuldan beri shu sabab qulab kelgan edi.

**Tekshiruv:**
- `npx vitest run` — 234/234 (1 ta notinch, aloqasiz `blog-agent` testi izolyatsiyada oʻtdi).
- `npx tsc --noEmit -p tsconfig.typecheck.json` — toza.
- `npm run lint` — toza.
- CI: barcha talab qilingan tekshiruvlar oʻtdi.

---

## 2026-08-31 | BHM 412,000 → 440,000 so'm yangilanishi (PR #316)

**Nima qilindi:**
- **Sabab:** O'zbekistonda Bazaviy hisoblash miqdori (BHM) 440,000 so'mga oshdi. Barcha davlat bojlari BHM ga bog'liq.
- **`src/components/sections/trademark-calculator.tsx`:**
  - `BHM` konstanta: `412000` → `440000`.
  - `EXPEDITE_EXTRA`: hardcoded `461000` (eski BHM asosida) → `Math.round(1 * BHM * 1.12)` formulaga o'tkazildi, endi yangi BHM dan hisoblanadi (492,800 so'm).
- **Blog postlar (8 fayl, 4 til × 2 mavzu):**
  - `how-much-does-patent-cost-2026` (uz/ru/en/zh): BHM matni 440,000; `2 * BHM` → 880,000; Step 1 (yuridik, 1 klass) → 2,640,000; Step 2 → 5,104,000.
  - `trademark-registration-guide` (uz/ru/en/zh): BHM matni 440,000; Step 1 → 2,640,000. Agentlik xizmati narxlari (5M/7M) o'zgarmadi (flat rate).
  - Hosila summalar kalkulyator formulasidan olindi: `6*BHM` (Step 1 legal), `11.6*BHM` (Step 2 legal).

**Tekshiruv:**
- `npm test -- src/components/sections/trademark-calculator.test.tsx --run` — passed (1/1).
- Repo bo'yicha `412000` / eski hosila summalar qidiruvi — 0 natija.

---

## 2026-08-31 | GitHub Security & Dependabot Pull Requests Resolution (0 Vulnerabilities)

**Nima qilindi:**
- **GitHub Security Alerts To'liq Bartaraf Etildi**: GitHub Dependabotdagi barcha 26 ta xavfsizlik alerti va tegishli pull requestlar (PR #309 va unga bog'liq dependabot guruhlari) to'liq hal qilindi.
- **Root Paket (`package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package-lock.json`)**:
  - `dompurify`: `3.4.12` → `^3.4.13` ga ko'tarildi (GHSA-55q2-fjhq-7xh7 IN_PLACE XSS zaifligi yopildi).
  - `nanoid`: `3.3.16` → `^3.3.18` ga yangilandi (GHSA-2v37-7h3g-55p8 cheksiz sikl zaifligi yopildi).
  - `js-yaml`: `3.15.1` va `4.3.1` ga override qilindi (GHSA-5p4m-2wfm-xmqj !!omap CPU exhaustion yopildi).
  - `undici`: `6.28.0` va `7.29.0` ga override qilindi (CRLF, cookie injection, downstream response desync yopildi).
  - `ip-address`: `10.4.0` ga override qilindi (SSRF va IPv4-mapped address bypass zaifliklari yopildi).
- **MCP Server (`mcp-server/package.json`, `mcp-server/package-lock.json`)**:
  - `hono`: `4.12.31` → `4.13.5` (>= 4.12.34) ga yangilandi (memo() SSR disclosure, language middleware DoS, CORS ReDoS yopildi).
  - `fast-uri`: `3.1.4` → `4.1.3` (>= 3.1.5) ga yangilandi (host confusion zaifligi yopildi).
  - `ip-address`: `10.2.0` → `10.7.0` (>= 10.4.0) ga yangilandi.
- **Portfolio Bot (`services/portfolio-bot/package.json`, `services/portfolio-bot/package-lock.json`)**:
  - `ip-address`: `10.2.0` → `10.7.0` (>= 10.4.0) ga yangilandi.
- **Verifikatsiya**:
  - `pnpm audit --audit-level=moderate`: **0 vulnerabilities (No known vulnerabilities found)** ✓
  - `npm audit` (root, mcp-server, portfolio-bot): **0 vulnerabilities** ✓
  - `npm run typecheck`: **0 errors (100% PASS)** ✓
  - `npx vitest run`: **26/26 test suites (175 tests) PASS** ✓
  - `npm run build`: **161/161 static & dynamic pages successfully compiled** ✓

---

## 2026-08-14 | Naming/Logo Kartalarni PNG Yuklab Olish + Security/Encoding Auditi (PR #313)

**Nima qilindi:**
- **PNG Export**: `package-builder.tsx` — naming va logo tarif kartalariga hover-reveal download tugma qo'shildi, `html-to-image` bilan yuqori sifatli (3x) PNG export. Hover-fokuslangan kartada Ctrl+D / Cmd+D shortcut (bir vaqtda faqat bitta karta uchun, hover state orqali). 4 tilga (`downloadCard`) tarjima.
- **50/50 To'lov UI**: `pricing.ts`'ga `upfrontAmount` hisoblash qo'shildi; `package-builder.tsx`'da 50/50 tanlanganda "boshlash uchun faqat X" bloki chiqadi.
- **Dependency Security**: `package.json` `overrides` sintaksisidagi xato tuzatildi (nested `@sanity/cli` override versiyasiz yozilgani butun override zanjirini buzayotgan edi) — `npm audit` 13 high/22 moderate/1 low → **0 vulnerability**.
- **Mojibake Tuzatish**: `static-data.ts` (ru testimonial'lar), `brand-strategiyasi/layout.tsx` (ru/zh SEO keywords), `package-builder.tsx` (ru chegirma taymer matni) — ikki marta noto'g'ri encode qilingan UTF-8 matn asl holiga qaytarildi.
- **Code review fixlar** (Codex/CodeRabbit): `group` class sibling Card'dan wrapping `motion.div`ga ko'chirildi (hover ishlamas edi), Ctrl+D endi faqat hover qilingan kartaga bog'langan, hardcoded Uzbek fallback olib tashlandi (`dictionary.downloadCard` majburiy), `animate-pulse` → Framer Motion `motion.div`.

**Tekshiruv:** `npx tsc --noEmit` ✓ | `npx eslint` ✓ | `npm audit` → 0 vulnerabilities | Local dev serverda 50/50 blok va download tugmalar brauzerda tekshirildi.

---

## 2026-07-27 | To'liq Veb-sayt Auditi & Build Verifikatsiyasi (100% SUCCESS)

**Nima qilindi:**
- **Kod & TypeScript Auditi**: `npm run typecheck` orqali to'liq static typecheck o'tkazildi (0 errors).
- **Production Build Verifikatsiyasi**: `npm run build` bajarildi — 160 ta sahifa va barcha dynamic/ISR marshrutlar 100% muvaffaqiyatli qurildi (`✓ Compiled successfully`).
- **i18n Paritet Auditi**: `audit_locales.js` orqali barcha 4 ta tilda (`uz`, `ru`, `en`, `zh`) teng 1016 ta kalit va 0 missing key borligi tasdiqlandi.
- **SEO & AI Search (GEO/AEO)**: `robots.ts` va `sitemap.ts` auditi o'tkazildi; ChatGPT, Claude va Perplexity botlari uchun ochiq indeksatsiya va `hreflang` / `x-default` alternativalar tekshirildi.
- **Performance & CWV**: Above-the-fold Hero LCP prioriteti va below-the-fold 9 ta og'ir seksiyalarning `SectionSkeleton` bilan dynamic import qilinishi audit qilindi.
- **Full Audit Report**: To'liq audit hisoboti [full_website_audit.md](file:///C:/Users/baxti/.gemini/antigravity/brain/c2dc0721-e2ff-421e-84a9-64e6f7d0643f/full_website_audit.md) faylida yaratildi.

---

## 2026-07-27 | Lead Capture Orchestrator + Security & Governance 10/10 Audit

**Nima qilindi:**
- **Lead Capture Orchestrator & Multi-trigger Convergence**: `openContactModal` CustomEvent orqali 40+ har xil tugma, kalkulyator, header, sticky CTA va exit-intent hodisalari `AtModal` hamda `ContactModal` ga yagona context va source metadata (`ctaSource`, `gaClientId`, `pageLocation`) bilan yo'naltirildi.
- **Security & Bot Protection (Triple-layer)**: Honeypot field (`companyWebsite`), Cloudflare Turnstile token verification (`verifyTurnstile`) va Origin check hamda Firestore-backed distributed rate-limiting bilan barcha lead yo'llari xavfsizlandi.
- **Security Headers & Proxy Governance**: `proxy.ts` orqali `HSTS`, `X-XSS-Protection`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` va `X-DNS-Prefetch-Control` sarlavhalari to'liq audit qilindi.
- **JSON-LD Schema Verification**: Script ID dublikatlari tozalanib, Google va AI Search engine lar (AEO/GEO) uchun to'liq sinxronlashtirildi.

**Tekshiruv:** `vitest run` → 22/22 test suites (140 tests) PASS ✓ | `git push origin main` → Vercel production deploy ✓

---

## 2026-07-23 | Performance 10/10 — Dynamic Imports & LCP Optimization


**Nima qilindi:**
- `HomeComponent` ichidagi below-the-fold 9 ta og'ir section dynamic import (lazy-load) ga o'tkazildi: `ATGallery`, `BeforeAfter`, `ATQuotes`, `ProcessVideo`, `AtProcess`, `Founder`, `AtPricing`, `AtFaq`, `AtFinalCta`.
- Dynamic import jarayonida CLS (Cumulative Layout Shift) ning oldini olish uchun yengil va xavfsiz `SectionSkeleton` komponenti yaratildi va qo'llandi.
- `AtHero` komponentidagi LCP (Largest Contentful Paint) rasmi uchun deprecated `preload` o'rniga rasmiy `priority` prop o'rnatildi va mos test `at-hero.test.tsx` yangilandi.
- `layout.tsx` ga Vimeo iframe resurslari uchun `dns-prefetch` qo'shildi.

**Tekshiruv:** `vitest run` → 16/16 test suites (124 tests) o'tdi ✓
**Deploy:** `git push origin main` → Vercel auto-deploy qilindi ✓

---

## 2026-07-22 | i18n Parity + zh.json To'liq Tarjima


**Nima qilindi:**
- `ru.json`, `en.json`, `zh.json` ga 6 ta yetishmayotgan kalit qo'shildi: `naming_simple`, `logo_design_simple`, `brandbook_simple`, `corporate_style_simple`, `packaging_design_simple`, `atelier.hero_title_alt`
- `zh.json`da inglizcha qolgan 36 ta matn xitoycha tarjimasi bilan almashtirildi: `trustedBy`, `beforeAfter`, `testimonials`, `founder`, `process`, `mobileCtaBar`, `auditOffer`
- Barcha 4 til: **1007 kalit**, 0 yetishmovchilik

**Tekshiruv:** `audit_locales.js` → 0 missing ✓ | `audit_translations.js` → 6 proper noun ✓ | `npm test` → 63/63 ✓
**Deploy:** `git push origin main` → Vercel auto-deploy ✓

---

## 2026-07-22 | Vercel Runtime `ERR_REQUIRE_ESM` P1 Tuzatish


**Muammo:** Production sahifalar 200 qaytargan bo'lsa ham, Vercel runtime log'larida `/uz`, `/ru`, `/en` uchun `ERR_REQUIRE_ESM` xatosi chiqayotgan edi.

**Ildiz sababi:** Sahifa render zanjirida `isomorphic-dompurify` import qilinib, server bundle `jsdom -> html-encoding-sniffer -> @exodus/bytes` dependency zanjirini tortgan. Vercel Node 24 runtime'da CommonJS `require()` orqali ESM modul chaqirilgani log xatosini chiqargan.

**Nima qilindi:**
- `src/components/sections/blog-preview.tsx` ichidan `isomorphic-dompurify` olib tashlandi; blog title/description uchun React text renderiga mos yengil plain-text sanitizer ishlatildi.
- `src/components/sections/founder.tsx` ichidan `isomorphic-dompurify` olib tashlandi; mavjud `sanitizeRichText()` helperiga o'tkazildi.
- Direct dependency `package.json` va `pnpm-lock.yaml` dan olib tashlandi.

**Tekshiruv:**
- `pnpm remove isomorphic-dompurify`: manifest/lock sinxron.
- `rg "isomorphic-dompurify|DOMPurify" src package.json pnpm-lock.yaml`: src/package direct import yo'q; lock'da faqat transitive eski versiya qoldi.
- `npm run lint`: muvaffaqiyatli.
- `npm run typecheck`: muvaffaqiyatli.
- `npm test`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli; `rtk err` no errors.
- `.next/server` ichida `isomorphic-dompurify`, `html-encoding-sniffer`, `@exodus/bytes` topilmadi.
- `git diff --check`: toza.

---

## 2026-07-17 | Patent Kalkulyatori Formasi Xatoligi Tuzatildi

**Muammo:** Patent kalkulyatori sahifasida (`/xizmatlar/patent-kalkulyatori`) foydalanuvchi ma'lumotlarni to'ldirib jo'natganda shakl (form) jimlikda yuborilmayotgan edi (silent failure).

**Ildiz sababi:** `TrademarkCalculator` komponentidagi Zod validation sxemasida `brand` (brend nomi) maydoni majburiy (`min(1)`) qilib belgilangan, ammo React Hook Form-da uning uchun hech qanday `FormField` (input) ko'rinishi yaratilmagan edi. Natijada validatsiya muvaffaqiyatsiz tugab, shaklni yuborishni bloklagan.

**Nima qilindi:**
- `src/components/sections/trademark-calculator.tsx` ichiga `brand` FormField inputi qo'shildi (tarjima fayllaridan `brandNameLabel` va `brandNamePlaceholder` kalitlari ishlatildi).
- `npm run build` orqali loyiha muvaffaqiyatli qurilishi va xatolar yo'qligi tekshirildi.

**Natija:** Patent kalkulyatori formasi endi brend nomini ham kiritish imkonini beradi va to'liq ishlaydi.

---

## 2026-07-17 | P0/P1 Preview Deploy Tayyorlash

**Holat:**
- P0/P1 audit tuzatishlari `codex/p0-p1-audit-preview` branchiga ajratildi.
- `origin/main` 4 commit oldinda ekani tekshirildi; preview branch remote o'zgarishlar bilan merge qilinadi.
- Deploy commitiga audit/fix fayllari kiritiladi; `AGENTS.md`, `lighthouse-report.json`, `BAXTIYOR_TONE_OF_VOICE.md` va `OISHA_SELF_IMPROVEMENT.md` chetda qoldiriladi.
- Production emas, Vercel preview deploy proof olinadi; production uchun tashqi env va Vimeo allowlist alohida qoladi.
- Remote `main` merge qilindi; Vitest local `.claude/worktrees/**` ichidagi Playwright specni ushlamasligi uchun exclude kengaytirildi.

**Preview oldi tekshiruvlari:**
- `npm test`: 12 fayl, 62/62 test o'tdi.
- `npm run lint`: muvaffaqiyatli.
- `npm run typecheck`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli; 61/61 static sahifa. Sanity CDN `ECONNRESET` berganda fallback ishladi va build to'xtamadi.
- Birinchi Vercel preview deploy `pnpm-lock.yaml` eskirgani sabab `ERR_PNPM_OUTDATED_LOCKFILE` bilan yiqildi.
- `pnpm-lock.yaml` package manifestga sinxron qilindi; `pnpm install --frozen-lockfile --ignore-scripts --config.confirmModulesPurge=false` lokal o'tdi.
- Vercel preview deploy `Ready`: `https://jonbranding-rxdqxtl1s-baxtiyorjons-projects.vercel.app`.
- Protected preview uchun vaqtinchalik share URL yaratildi: `https://jonbranding-rxdqxtl1s-baxtiyorjons-projects.vercel.app/uz?_vercel_share=NDgmoFVpXIRO8BiZsBkqRCNRilsFtqcT` (2026-07-18 09:11 gacha).

---

## 2026-07-14–15 | P0/P1 Audit Tuzatishlari

**Xavfsizlik:**
- Vimeo webhook endi faqat `VIMEO_WEBHOOK_SECRET` bilan raw-body HMAC SHA-256 imzosini qabul qiladi; query/Bearer bypass, katta body va noto'g'ri JSON yopildi.
- Instagram OAuth boshlanishi admin secret bilan himoyalandi, random `state` HttpOnly/Secure cookie orqali callbackda tekshiriladi; token xatolari tashqariga sizmaydi.
- API rate limitlari Firestore transaction orqali umumiy qilindi; ishonchsiz forwarded IP lar va literal `unknown` kaliti olib tashlandi.

**UI, accessibility va i18n:**
- Xizmatlar grid'i 320px ekranda overflow qilmaydi; sticky CTA `animate-ping` halqasi Firefox gorizontal scrollini chiqarmaydi.
- Lead modal Radix Dialog fokus trap, Escape, fokusni qaytarish, alert va 4 til matnlari bilan yangilandi.
- `[lang]` sahifalarda yagona `main#main-content` landmark qoldirildi; yangi matnlar avval `uz.json`, keyin `ru/en/zh` ga kiritildi.

**Performance va lokal barqarorlik:**
- Hero carousel o'rniga bitta barqaror preload LCP rasmi ishlaydi; Vimeo iframe faqat foydalanuvchi bosganda yuklanadi va matn fallback doim ko'rinadi.
- Development CSP HTTPS/WSS majburlashdan tozalandi, dev cache override production-only qilindi, `npm run dev` Webpack rejimiga o'tkazildi.
- Next image quality allowlist, Windows `cross-env` lint/build skriptlari va noto'g'ri Turbopack root tuzatildi; eksperimental CSS optimizatsiyasi olib tashlandi.
- Tailwind configidagi ESM muhitida yiqiladigan CommonJS `require(...)` pluginlari statik importga o'tkazildi.

**Tekshiruv:**
- `npm test`: 12 fayl, 62/62 test o'tdi.
- `npm run lint`: 0 xato, 0 warning.
- `npm run typecheck`: 0 xato.
- `npm run build`: muvaffaqiyatli, 61/61 static sahifa; compile 10.0 daqiqa.
- Playwright Chromium: 4/4; Firefox 320px overflow regressiyasi alohida o'tdi. Uzoq multi-browser dev run Windows virtual xotira chekloviga urildi.
- `git diff --check`: toza.

**Production uchun qolgan tashqi sozlama:** `VIMEO_WEBHOOK_SECRET`, `INSTAGRAM_OAUTH_ADMIN_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON` ni hostingda o'rnatish va Vimeo embed allowlistiga `jonbranding.uz` hamda `www.jonbranding.uz` ni qo'shish. Deploy qilinmadi.

---

## 2026-07-05 | Headroom Proxy Fix — Codex Stream Disconnect

**Muammo:** Codex client-da `stream disconnected before completion: error sending request for url (http://127.0.0.1:8787/v1/responses)` xatosi.

**Ildiz sababi:** Headroom proxy (`headroom.EXE`) port 8787 da ishlamayotgan edi. `headroom doctor` tekshiruvi `proxy not reachable` ko'rsatdi. Codex configi `openai_base_url = "http://127.0.0.1:8787/v1"` ga yo'naltirilgan, lekin proxy processi o'lik edi (5 ta zombie MCP server processi bor edi, proxy processi yo'q).

**Nima qilindi:**
- Barcha headroom zombie processlari o'ldirildi
- `headroom proxy` qayta ishga tushirildi (PID 11124, port 8787)
- `/health`, `/livez`, `/readyz`, `/stats` endpointlari ishlayotgani tasdiqlandi
- Avtomatik ishga tushish uchun Windows Registry Run key qo'shildi: `HKCU:\Software\Microsoft\Windows\CurrentVersion\Run\HeadroomProxy`

**Natija:** Codex Headroom proxy orqali normal ishlashi kerak. Proxy qayta yuklanganda ham Registry orqali avtomatik ishga tushadi.

---

## 2026-07-05 | Codex Vercel Build Crash Sessiyasi

**Nima qilindi:**
- Repo bo'ylab `<<<<<<<`, `=======`, `>>>>>>>` merge conflict markerlari tekshirildi: marker topilmadi.
- `src/app/[lang]/pricing/sotuvchi-kartochka/layout.tsx` alohida tekshirildi: marker topilmadi.
- Bugungi Vercel/GitHub CI crash sababi `src/components/sections/before-after.tsx` boshida commit bo'lib ketgan duplicate/chala blok ekani aniqlandi va tozalandi.

---

## 2026-07-04 | Codex Testimonial Cover Sessiyasi

**Nima qilindi:**
- Hikmatulloh Toxirov video testimonial coveri uchun Telegramdan berilgan rasm WebP formatga optimizatsiya qilindi.
- Sanity yoki fallback testimoniallari qaytganda ham Vimeo `1205182267` uchun yangi `/images/testimonials/hikmatulloh-toxirov-cover.webp` coveri ishlatiladigan qilindi.
- Local/CI build barqarorligi uchun Next static generation worker soni `experimental.cpus: 1` bilan cheklab qo'yildi.

---

## 2026-07-01 | Codex Security Sessiyasi

**Nima qilindi:**
- PR #247 orqali merge markerlar tozalandi, `portfolio-sync` cron auth tekshiruvi mustahkamlandi va Vercel/CI build bloklagan lockfile holati tuzatildi.
- `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package-lock.json` va `package.json` override'lari `js-yaml`, `smol-toml`, `postcss`, `uuid` patched versiyalariga moslandi.
- PR #248 orqali `package-lock.json` ichidagi Dependabot metadata ham patched `js-yaml@3.15.0` va `smol-toml@1.6.1` holatiga keltirildi.
- GitHub security sahifasidagi stale Dependabot alertlar lockfile/SBOM dalili bilan yopildi; open PR, Dependabot, Code scanning va Secret scanning soni 0 ga tushirildi.

**Tekshiruv:**
- `pnpm --config.minimumReleaseAge=0 lint`
- `pnpm --config.minimumReleaseAge=0 typecheck`
- `pnpm --config.minimumReleaseAge=0 test`
- `pnpm --config.minimumReleaseAge=0 build`
- `npm audit --audit-level=moderate --omit=dev`

---

## 2026-07-01 | Antigravity Sessiyasi — Ideal Holat

**Nima qilindi:**
- **Merge conflict markerlar tozalandi**: `sotuvchi-kartochka/layout.tsx`, `layout.tsx`, `founder.tsx`, `pricing.ts` — barcha `<<<<<<<`, `=======`, `>>>>>>>` markerlar olib tashlandi. Kaskadli narx algoritmi (Updated upstream) saqlanib qoldi.
- **Dependabot alertlar yopildi**: `js-yaml` (CVE: GHSA-h67p-54hq-rp68) va `smol-toml` (CVE: GHSA-v3rj-xjv7-4jmq) uchun `pnpm-workspace.yaml` va `package.json` overrides qo'shildi. pnpm audit va npm audit: **0 vulnerability**.
- **CodeQL alertlar**: 0 (oldingi PR #247 bilan yopilgan).
- **Open PRlar**: 0 (barcha mergeable yoki yopilgan).
- **package-lock.json** va **pnpm-lock.yaml** yangilandi — zaif transitive dependency versiyalari override bilan patched versiyalarga almashtirildi.
- **Build**: muvaffaqiyatli (conflict markerlar olib tashlanganidan keyin).
- **DEV_LOG.md** yangilandi.

---

## 2026-07-03 | Codex Build Crash Sessiyasi

**Nima qilindi:**
- Vercel build crashiga sabab bo'lishi mumkin bo'lgan commit qilingan merge conflict markerlari repo bo'ylab tekshirildi.
- `DEV_LOG.md` ichidagi unresolved `<<<<<<<`, `=======`, `>>>>>>>` markerlari olib tashlandi va ikkala log yozuvi saqlandi.
- `src/app/[lang]/pricing/sotuvchi-kartochka/layout.tsx` alohida tekshirildi: conflict marker topilmadi.
- Portfolio Sanity rasmlariga `auto=format` qo'shildi va before/after slider Next image optimizatsiyasidan foydalanadigan qilindi.
- `pnpm-workspace.yaml` build-script allowlist placeholderlari real boolean qiymatlarga keltirildi.
- Dependabot #88 uchun `json-2-csv` override'i patched `5.5.11` versiyasiga mahkamlandi.
- PR #252 review izohlaridan qolgan dolzarb joylar yopildi: portfolio bot rasm pathlari temp katalog bilan cheklab qo'yildi va package-builder discount label/rule fallbacklari locale kalitlariga ko'chirildi.

---

## 2026-06-30 | Codex Sessiyasi


**Nima qilindi:**
- PR #240 uchun cron endpointlarda `CRON_SECRET` undefined bo'lganda `"Bearer undefined"` orqali auth bypass bo'lishi oldini olindi: Bearer token alohida ajratilib, secret mavjudligi tekshirildi va `safeCompare` ishlatildi (`portfolio-sync`, `reviews-sync`, `testimonials`).
- `.jules/sentinel.md` da shu xavf bo'yicha sentinel yozuvi qo'shildi va markdown inline code formati GitHub reviewdagi `MD038` izohiga mos tuzatildi.
- GitHub reviewdagi qolgan `DEV_LOG.md` entrysi va sentinel markdown izohlari yopildi.

---

## 2026-06-28 | Antigravity Sessiyasi

**Nima qilindi:**
- `avans` kalkulyatorida kassa xavfsizlik koeffitsiyenti olib tashlanib, uning o'rniga "Oylik maoshga nisbatan avans limiti (%)" kiritildi.
- `package-builder` va `pricing.ts` ichida yangi **Kaskadli Narx Zanjiri** (10% Istisno + 10% Salom + 10% Promokod) algoritmi kiritildi. Eski (30%, 50%) chegirmalar olib tashlandi.
- 24 soatlik chegirma muddati tugaganda mijozga **$50 lik Arboun (3 kunga muzlatish) xizmati** taklifi UI (banner) orqali qo'shildi.
- `AGENTS.md` fayliga barcha agentlar (Codex, Claude, Devin, Cursor, Gemini) uchun narxlash algoritmi bo'yicha yangi qat'iy yo'riqnoma qo'shildi.
- Testimonials (mijozlar fikri) blokiga Almaz Shoes asoschisi Hikmatulloh Toxirovning yangi Vimeo video otzivi qo'shildi.
- Facebook/Instagram muhit o'zgaruvchilari (App ID va Secret) o'qib olinib, mahalliy `.env.local` va Vercel serveriga yuklandi.
- Boyarin loyihasi matnlari portfolio fallbacklarida go'sht mahsulotlaridan saryog' va sut mahsulotlariga o'zgartirildi (4 tilda).
- `page.tsx` va `sotuvchi-kartochka/layout.tsx` metadata tavsiflaridan (link preview uchun) raqobatchilar nomlari (Ma'no, Mountain, Abba) olib tashlandi.
- `globals.css` dizayn tizimidan Terracotta (olovrang/jigarrang) rangi butunlay olib tashlandi va o'rniga Cobalt Blue hamda neytral ranglarga o'zgartirildi.
- Oisha chat ulanishi uchun `OISHA_API_URL` va `OISHA_SECRET_KEY` kalitlari Vercel CLI yordamida loyihaga qo'shildi.

---

## 2026-06-16 | Antigravity Sessiyasi

**Nima qilindi:**
- Bosh sahifaning ikkinchi yarmidagi custom Atelier komponentlari (`ATLossCalc`, `ATIndex`, `ATProcess`, `ATPricing`, `ATFAQ`, `ATFinal`, `ATFooter`, `ATStickyCta`) to'liq dynamic dictionary keys yordamida lokalizatsiya qilindi.
- `ATQuotes` (sharhlar) bo'limi butunlay qayta yozilib, Sanity CMS-dan keladigan va static bo'lgan video (portrait Vimeo lightbox modal), audio (play/pause pleyeri) va matnli sharhlarni estetik formatda qo'llab-quvvatlaydigan qilindi.
- Kalkulyator summalari formatlanishi va jarayon bosqichlari misollari ingliz, rus, oziq-ovqat/fmcg/fintech/moda toifalari va tillar filteriga moslashtirildi.
- Barcha yangi tarjima kalitlari `uz.json` ga kiritilib, Node.js Gemini API avtomatlashtirilgan tarjimon skripti yordamida `en.json`, `ru.json` va `zh.json` fayllariga sinxronlashtirildi.
- Next.js type check tekshiruvi `npx tsc --noEmit` yordamida muvaffaqiyatli, 0 ta xatolik bilan yakunlandi.

---

## 2026-05-18 | Antigravity Sessiyasi

**Nima qilindi:**
- GitHub'dagi oxirgi o'zgarishlar (commit `02db9ae`) muvaffaqiyatli lokal `main` branchga cherry-pick qilindi va barcha konfliktlar yechildi.
- `src/components/contact-modal.tsx` dagi konfliktlar hal qilindi — dynamic input validatsiyasi, xato hoshiyalari va `aria-invalid` atributlari `rounded-[8px]` dizayn tizimi bilan uyg'unlashtirildi.
- `src/components/sections/hero.tsx` dagi konfliktlar hal qilindi — mobil qurilmalardagi matn kontrastini yaxshilovchi drop-shadow va cheklovlar Desktopdagi responsive `clamp` shrift o'lchamlari bilan birlashtirildi.
- Loyihaning to'liq build holati (`npm run build`) tekshirildi, barcha TypeScript va Next.js tekshiruvlaridan muvaffaqiyatli o'tdi.
- O'zgarishlar va konflikt yechimlari GitHub origin `main` tarmog'iga push qilindi.

**Natijalar:**
- `02db9ae` dagi barcha premium CRO va UX yaxshilanishlari (Telegram banner, dynamic pricing calculator, AI chat widget 3s fallback va mobil kontrast) asosiy kod bazasiga xavfsiz integratsiya qilindi.

---

## 2026-04-20 | Antigravity Sessiyasi

**Nima qilindi:**
- `ROAD_MAP.md` yaratildi — loyiha missiyasi, hozirgi holat va keyingi bosqich rejalashtirildi
- `DEV_LOG.md` (bu fayl) yaratildi — sessiyalar orasidagi kontekst saqlovchi hujjat
- `.github/workflows/deploy.yml` yaratildi — GitHub Actions orqali Firebase App Hosting'ga avtomatik deploy
- Sanity portfolio schemasi kengaytirildi — category, tags, beforeAfter images, slug

**Aniqlangan muammolar:**
- `src/app/[lang]/xizmatlar/brand-strategiyasi/` va `brand-strategy/` — dublikat route (har ikkalasi bir xil kontent, biri UZ, biri EN URL bilan)
- `zh.json` — xitoy tili tarjimasi to'liq emas (ba'zi kalitlar inglizcha)
- `next.config.js` — `ignoreBuildErrors: true` — bu TypeScript xatolarini yashiradi

**Keyingi sessiyaga vazifalar:**
- [ ] Portfolio case study sahifasi: `/portfolio/[slug]` route qo'shish
- [ ] Sanity'ga portfolio loyihalarini yuklash (Sanity Studio orqali)
- [ ] Hero A/B test infra

---

## Avvalgi sessiyalar

### 2026-04-17 | Foydalanuvchi (GitHub orqali)
- `feat(ui): enhance 'Sales Machine' copywriting and premium UI aesthetics in Uzbek`
- `bento-results-stats.tsx`, `hero.tsx`, `mobile-cta-bar.tsx`, `process.tsx` yangilandi

### 2026-04-16 | Foydalanuvchi (GitHub orqali)
- AmoCRM direct integration qo'shildi
- Testimonial video 9:16 aspect ratio tuzatildi

### 2026-04-15 | Antigravity Sessiyasi
- Sanity CMS migratsiyasi amalga oshirildi
- Before/After, Gallery, Founder seksiyalari sinaytirildi

### 2026-04-13 | Foydalanuvchi (GitHub orqali)
- Package Builder yaratildi (35KB komponent)
- Pick Two Selector premium animatsiyalar

---

## Texnik Eslatmalar

```
Firebase Project: brandboost-landing
Sanity Project:   h6ymmj0v
Sanity Dataset:   production
GitHub Remote:    baxtiyorjongaziyev/jonbranding-web (origin)
                  baxtiyorjongaziyev/jonbranding.uz (production mirror)
Deploy:           Firebase App Hosting (apphosting.yaml)
```

- **[2026-06-28 12:11]** Fix: Vercel build failed due to outdated pnpm-lock.yaml (dotenv addition). Updated pnpm-lock.yaml and pushed to origin main to unblock Vercel deployments.
- **[2026-06-28 13:51]** Fix: /presentation sahifasidagi infinite redirect loop tuzatildi. next.config.js dagi xato redirect olib tashlandi va src/proxy.ts middleware sifatida Next.js 16.2 konvensiyasiga moslashtirildi.
- **[2026-06-28 13:58]** Style: Asoschi portreti (Founder) formati 4:5 aspect ratioga o'tkazildi.
- **[2026-06-28 14:01]** UI/UX: Almaz Shoes videosi uchun muqova (cover) qo'shildi. Videoli va matnli sharhlar dizayni AT uslubiga o'tkazilib, tekislandi.
- **[2026-06-28 16:04]** Feat: Testimonials AT UI dizayni to'liq yakunlandi (markazlashtirildi, audio player pill-shaped qilib o'zgartirildi, ogg -> mp3 fix). Portfolio botiga Google Drive orqali multimodal vizual AI analizi (cover tanlash va image order) qo'shildi va avtomatlashtirildi.
- **[2026-06-29 15:00]** Chore: Home page `AtPricing` — tariflar olib tashlandi, faqat Brand Audit qoldi. Audit items qisqartirildi (PDF va 90 kun olib tashlandi). Founder bo'limi Atelier dark dizayniga o'tkazildi. Galereya tile'lariga gradient overlay qo'shildi (tekst har doim o'qiladi).

---
## 2026-06-29 | Feature Plan — 5 ta kengaytma

Oisha AI Proactive, Session Replay, Dynamic Personalization, 3D WebGL, A/B Testing — strategik reja va prioritetlar.
- **[2026-06-29 15:30]** Feat: Oisha Proactive Mode — `oishaProactive` CustomEvent, widget auto-opens + sends message. `ProactiveTrigger` pagelarni (sotuvchi-kartochka 30s, xizmatlar 45s, quiz 60s, blog 90s) kuzatadi. 4 tilda xabarlar. Client-enhancements ga ulandi.

---
## 2026-07-02 | Before/After — Liquid Glass Redesign

**Nima qilindi:**
- **[before-after.tsx]** To'liq qayta dizayn: eski `BrandSection tone="dark"` va `bg-[#090b0f]` o'rniga atelier section patterniga o'tkazildi (`py-[100px] md:py-[140px]`). Eski brand tokenlar (`text-brand-lime`, `bg-brand-lime/10`, `border-brand-lime/20`) o'rniga `var(--at-*)` CSS variable'lari ishlatildi.
- **[image-comparison-slider.tsx]** Liquid Glass glassmorphism uslubiga moslashtirildi: `var(--at-bg-2)`, `var(--at-paper)`, `var(--at-line)`, `var(--at-accent)` ranglari, atelier font family'lari, border/rounded styling.
- **Layout**: 2-column atelier section header (clamp typography, mono eyebrow, accent dot), proof cards atelier pill styling, grid 2-column cards with framer-motion scroll-animations.
- **Mobile**: clunky horizontal swipe o'rniga oddiy grid layout.
- **oisha-widget.tsx**: Merge conflict markerlar tozalandi (ikkilangan useEffect/bloklar olib tashlandi).
- **src/lib/blog-posts.ts**: Yo'qotilgan modul stublendi (sitemap.ts build error fiks).
- **Build**: muvaffaqiyatli.

---

## $(date +'%Y-%m-%d') | Bolt Sessiyasi - Performance Optimization

**Nima qilindi:**
- `services/portfolio-bot/src/drive-finder.ts` va `services/portfolio-bot/src/drive.ts` fayllarida `getAuth` funksiyasi asinxron (`async`) holatga o'tkazildi.
- Sinxron blokirovka qiluvchi `fs.existsSync` va `fs.readFileSync` o'rniga asinxron `fs.promises.readFile` dan foydalanildi.
- Google Service Account kalit fayli (JSON) uchun in-memory kesh joriy etildi, bu orqali fayl faqat bir marta o'qiladi.
- O'zgarish Node.js event loop bloklanishining oldini oladi va benchmark natijalariga ko'ra Google API ga auth olish vaqtini 5000 ta chaqiriq uchun ~118ms dan ~38ms gacha qisqartiradi, asosiysi, parallel ishlashda qotib qolishni (event loop delay) butunlay yo'q qiladi.
# 2026-07-15 — at_modal lead delivery

- `at_modal` uchun telefon majburiy, Telegram username ixtiyoriy qilindi.
- Telefon E.164 formatiga normallashtirilib, AmoCRM kontaktiga PHONE/MOB sifatida yuboriladi.
- Lead AmoCRM va Telegram guruhiga parallel yuboriladi; bittasi ishlamasa ikkinchisi to'xtamaydi.
- API, forma va normalizatsiya testlari qo'shildi.
- Production test: AmoCRM muvaffaqiyatli (`amoCrm: true`), Telegram yuborish muvaffaqiyatsiz (`telegram: false`). Bot token ishlaydi, ammo sozlangan guruh uchun Telegram `Bad Request: chat not found` qaytardi; guruh ID yoki bot a'zoligi tuzatilishi kerak.
- `chat not found` sababi aniqlandi: Vercel'dagi `TELEGRAM_CHAT_ID` eskirgan. To'g'ri qiymatlar — guruh "Sotuv Bolim - | Jon Agency", `TELEGRAM_CHAT_ID=-1003854308552`, "Yangi lead" topic uchun `TELEGRAM_MESSAGE_THREAD_ID=1020`. Bot `@jonairobot` guruhda administrator, forum rejimi yoqilgan, shu ID va topicga test xabar muvaffaqiyatli yetkazildi. Vercel'da Production va Preview muhitlariga yangi qiymatlar o'rnatildi.
- Bot privacy mode yoqilgan: guruhdagi oddiy xabarlarni ko'rmaydi, shuning uchun `getUpdates` orqali chat ID topish uchun guruhga `/start@jonairobot` yozish kerak. Yuborishga ta'sir qilmaydi.

## Brend diagnostikasi sahifasi (PR #285)

- `/diagnostika` — 7 savolli interaktiv diagnostika. Har savol alohida ekranda, progress bar, orqaga/davom; javoblar massivda saqlanadi, ball har safar noldan hisoblanadi (orqaga qaytish ikki marta qo'shmaydi). Ball A=0/B=1/C=2, natija 3 toifa (0–6, 7–10, 11–14).
- Ichki tasnif (nurture/potential/qualified, priority, sales_status) faqat CRM uchun — foydalanuvchi ekranida ham, API javobida ham yo'q.
- Lead AmoCRM (sdelka+kontakt+note, teglar bilan) va Telegram "Yangi lead" topic'iga parallel boradi; kalitlar bo'lmasa mock rejim, foydalanuvchi natijani baribir ko'radi. AmoCRM note HTTP xatosi endi status bilan loglanadi (fetch 4xx/5xx da reject qilmaydi).
- Rebase paytida topildi: route `rateLimit`ni await'siz chaqirardi — Promise doim truthy, cheklov umuman ishlamasdi. Tuzatildi (5 so'rovdan keyin 429, lokal tasdiqlangan).
- lead-guard (honeypot) diagnostika endpointi va formasiga ulandi.
- Preview'da to'liq oqim brauzerda tekshirildi: 7 savol, orqaga, validatsiya (bo'sh forma POST yubormaydi), 14 ball → qualified natija.
- QARZ: matnlar hozircha faqat o'zbekcha (TZ talabi), `diagnostics.ts` va client'da hardcoded — ru/en/zh tarjimasi va `uz.json`ga ko'chirish alohida PR'da. `/ru|/en|/zh/diagnostika` hozir o'zbekcha ko'rinadi.

## Lead yetkazishni mustahkamlash (PR #284)

- Telegram xatolari jimgina yutilardi (`console.error` + route baribir `ok: true`): shu sabab `chat not found` 6 kun sezilmadi. Endi `logger.error` bilan yoziladi; `TELEGRAM_ADMIN_CHAT_ID` sozlangan bo'lsa asosiy guruh yiqilganda ogohlantirish zaxira chatga boradi.
- Spam leadlar sababi: `/api/submit-form` da bot himoyasi umuman yo'q edi. `src/lib/lead-guard.ts` qo'shildi — honeypot (to'ldirilgan so'rov jimgina tashlanadi, javob haqiqiysidan farq qilmaydi), ixtiyoriy Turnstile (`TURNSTILE_SECRET_KEY` bo'lsagina yoqiladi; Cloudflare 5xx bersa yoki javob buzuq bo'lsa fail-open — lead o'tkaziladi), Origin faqat loglanadi.
- To'rtala lead formasi (contact-modal, at-modal, trademark-calculator, lead-magnet-popup) honeypot maydoniga ulandi. contact-modal'da `companyWebsite` mahalliy Zod schema'ga ham qo'shildi — aks holda `zodResolver` uni kesib, qiymat serverga yetib bormasdi.
- `lead-magnet-popup` hech qachon lead yubormagan — `name` yuborardi, schema `fullName` kutadi, har safar 400 qaytgan. Tuzatildi.
- `src/proxy.ts` `/uz/...` redirectida `new URL(path, base)` query stringni tashlab yuborardi — butun sayt bo'ylab `?source=` va UTM parametrlari yo'qolardi. `nextUrl.clone()` bilan tuzatildi, regressiya testlari qo'shildi.
- `scripts/check-telegram.mjs` qo'shildi: bot token, chat ID, forum holati va bot ko'rgan chatlarni tekshiradi.
- DIQQAT: `TURNSTILE_SECRET_KEY` ni frontend widget ulanmaguncha o'rnatmang — kalit qo'yilsa barcha formalar tokensiz 400 oladi.

## CI: Linux runnerda `npm ci` tuzatildi (PR #286)

- CI `main`da ham yiqilgan edi (`f311fe25`), sabab `Install dependencies` bosqichida.
- `@next/swc-win32-x64-msvc` `devDependencies`da turgan. Win32'ga qulflangan paket, Linux runnerda `EBADPLATFORM`. Avval `optionalDependencies`ga ko'chirildi, keyin butunlay olib tashlandi: `next@16.2.10` barcha swc binarlarini o'zining `optionalDependencies`ida tarqatadi, shuning uchun alohida yozuv ortiqcha va Next yangilanganda versiya nomuvofiqligini keltirib chiqarardi.
- Repo ikkita lockfile ishlatadi: GitHub Actions `npm` (package-lock.json), Vercel va Netlify `pnpm` (pnpm-lock.yaml). Faqat bittasini yangilash Vercel'da `ERR_PNPM_OUTDATED_LOCKFILE` beradi — ikkalasi ham sinxron bo'lishi shart.
- Lockfile `package.json`dan chetlashgan edi (react/react-dom `19.2.6` vs `^19.2.7`, eslint-config-next `16.2.6` vs `16.2.10`); `npm ci` bunday nomuvofiqlikda ham to'xtaydi. Ikkala lockfile qayta yaratildi.

## Diagnostika: baholashdan xizmat bo'shliqlarini aniqlashga o'tish (PR #289)

- Muammo: eski model faqat leadni baholardi va mijozga mavhum tavsiya berardi ("brend pozitsiyasini aniqlashtiring"). Mijozlarimiz brendbuk yoki tovar belgisi nima ekanini bilmaydi, shu sabab natijadan nima sotib olishni tushunmasdi. Menejer ham CRMda faqat javob variantini ko'rardi (`A — Hali aniq bilmayman`), savol nimaligi bilinmasdi.
- Savollar inventarizatsiyaga o'tkazildi: 1–5 nima yetishmayotganini aniqlaydi (nom, tovar belgisi, logotip, vizual tizim, qadoq), 6–7 sotuv uchun qoladi (muddat, qaror qabul qiluvchi). Atamalar savol ichida `hint` bilan izohlanadi.
- Tasnif endi balldan emas, sotib olishga tayyorlikdan (`readiness` = muddat + qaror, 0–4) kelib chiqadi. Eski modelda g'oya bosqichidagi tadbirkor 1/14 ball olib `nurture` bo'lardi, holbuki unga barcha xizmatlar kerak. `total_score` brend yetukligi sifatida saqlanib qoldi, lekin tasnifga ta'sir qilmaydi.
- `TIMING_INDEX` va `DECISION_INDEX` savol `id` sidan hisoblanadi, qo'lda yozilmaydi — savollar tartibi o'zgarsa tayyorlik jimgina boshqa javoblarni o'qib ketmasligi uchun. Buni qo'riqlaydigan test ham bor.
- CRM va Telegram: `TAKLIF QILINADI:` satri birinchi o'rinda, javob satrlari savol matni bilan keladi, sdelkaga `kerak:patent` ko'rinishidagi teglar qo'shiladi. Bo'shliq topilmasa taklif satri o'rniga alohida matn chiqadi — "Jiddiy bo'shliq topilmadi" ning o'zi taklifdek ko'rinmasligi uchun.
- Sahifa faqat o'zbek tilida. Matnlar `src/lib/diagnostics.ts` da, locale lug'atlarida emas — bu ataylab qilingan, chunki savollar va xizmat izohlari mahalliy bozorga yozilgan. Boshqa tillarga tarjima alohida ish sifatida qarz.

## 2026-07-27 | Package Builder & Narxlash Algoritmi Yangilandi

**Nima qilindi:**
- **Paketli Chegirma (Package Discount):** 50/50 to'lovdagi shartsiz "Istisno chegirmasi" o'rniga "Paketli chegirma" qo'shildi. Bu chegirma faqat kamida 2 ta asosiy xizmat tanlangandagina va to'lov usuli (50/50 yoki 100%) tanlansa amal qiladi.
- **Paketlarni maxsus tortish:** "logoPremium" (Logo va Firma uslubi) 2 ta xizmat, "logoVIP" (Logo, Firma uslubi, Brandbook) 3 ta xizmat deb baholanadigan mantiq kiritildi.
- **Sizning paketingiz (Cart) oynasi qulaylashtirildi:** Foydalanuvchi endi tanlangan xizmatlarni bevosita xulosa oynasidan turib X tugmasi bilan olib tashlashi mumkin. Shuningdek, qo'shimcha xizmat tanlash uchun tepaga qaytaruvchi "Boshqa xizmat qo'shish" tugmasi qo'shildi.
- Kod src/lib/pricing.ts va src/components/sections/package-builder.tsx da yangilandi.

---

## 2026-07-31 | Homepage audit fixlari production uchun ajratildi

- 9 ta vizual below-the-fold section SSR-safe qilindi; utility overlaylar client-only qoldi.
- Reduced-motion, global focus-visible, FAQ/process accordion ARIA holatlari va 44px touch targetlar tuzatildi.
- Active homepage `transition-all` ishlatishlari aniq property transitionlariga almashtirildi.
- Sticky CTA scroll paytidagi layout readlari cache qilindi va safe-area positioning qo'shildi.
- Contact modal `form.watch()` o'rniga `useWatch()` ishlatadi.
- Trademark calculator testi parallel suite uchun barqarorlashtirildi.
- Desktop/tablet/mobile full-scroll, overflow va reduced-motion Playwright regressiya testi qo'shildi.

**Production gate:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, Chromium responsive E2E va `git diff --check`.
## 2026-08-02 | Production audit, security va diagnostika i18n

- Homepage audit tuzatishlari alohida release branchga ajratildi: responsive, reduced-motion, fokus, ARIA va scroll ishlashi yaxshilandi.
- Production dependency auditidagi 13 ta zaiflik yopildi; `npm audit --omit=dev` natijasi: 0.
- `package-lock.json` `package.json` bilan qayta sinxronlandi; oldingi Vercel lockfile drift sababi bartaraf etildi.
- `/[lang]/diagnostika` savollari, xizmat tavsiyalari, natijalari va forma UI matnlari `uz`, `ru`, `en`, `zh` lug‘atlariga ko‘chirildi.
- Diagnostika hint matnlari endi foydalanuvchiga ko‘rinadi va to‘rt tildagi lug‘atlarning to‘liqligini tekshiruvchi regressiya testi qo‘shildi.
- Gate: TypeScript xatosiz; ESLint xatosiz; unit testlar xatosiz; Next production build 161/161 sahifa; Playwright responsive/reduced-motion 4/4.
## 2026-08-02 | GitHub security alertlarni nolga tushirish

- CodeQL topilmalari tuzatildi: blog plain-text sanitizatsiyasi nested tag qayta hosil qilmaydi; Oisha browser ID `crypto.randomUUID()` bilan yaratiladi.
- `mcp-server` dependency lock yangilandi: `@modelcontextprotocol/sdk` 1.30.0 va patched `@hono/node-server` 2.0.12.
- `services/portfolio-bot` lock manifest bilan sinxronlandi va `brace-expansion` 2.1.4 ga yangilandi.
- Nested sanitizer va cryptographic ID uchun regressiya testlari qo‘shildi.
- Production merge gate: root hamda ikkala subproject audit/build/test tekshiruvlari va GitHub security rescan.
