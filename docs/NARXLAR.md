# Narxlar sahifasi — barcha AI agentlar uchun ma'lumotnoma

> Bu fayl `/narxlar` sahifasining **hozirgi holati** haqida. ChatGPT, Claude, Claude Code,
> Gemini, Codex, Antigravity — kim ishlashidan qat'i nazar, narx yoki sotuv matniga
> tegishdan oldin shu faylni o'qisin.
>
> **Oxirgi yangilanish:** 2026-11-07

---

## 1. Qayerda joylashgan

| Narsa | Yo'l |
|---|---|
| Sahifa (server) | `src/app/[lang]/narxlar/page.tsx` |
| Sahifa (client) | `src/app/[lang]/narxlar/narxlar-client.tsx` |
| **Matn va narxlar** | **`src/lib/sales-content/{uz,ru,en,zh}.ts`** (`index.ts` eksporti) |
| Ariza formasi | `src/components/sales/lead-modal.tsx` |
| Sotuvchi taqdimoti | `src/app/[lang]/credentials/` |
| Brand Strategy sahifasi | `src/app/[lang]/brand-strategy/` |

**Eng muhim qoida:** narx, xizmat tarkibi, kafolat, FAQ — hammasi
`src/lib/sales-content/` dagi til modullarida. Eski `src/lib/sales-content.ts` manzili shu modulga ajratilgan. JSX ichida qattiq yozilgan narx **yo'q** va
bo'lmasligi kerak. `/narxlar` va `/credentials` ikkalasi shu moduldan o'qiydi,
shuning uchun bir joyda o'zgartirish ikkala sahifada ham aks etadi.

`/credentials` ning faqat slayd sarlavhalari, eyebrow va neyming sohalari
`src/lib/credentials-content/` da (4 til). Nomlar baribir `sales-content` dagi
naming `proof.items` dan olinadi — ikkinchi ro'yxat yo'q.

Eski manzillar: `/tariflar` → `/narxlar`, `/presentation` → `/credentials`
(`next.config.js` dagi 308 redirect).

---

## 2. Alohida xizmatlar

### Brend qurish

| Xizmat | Narx (so'm) | Muddat |
|---|---|---|
| Brend strategiyasi | 48 000 000 | — |
| Neyming — nom ishlab chiqish | 10 000 000 | 10 kun |
| Logotip | 8 000 000 | 7 kun |
| Firma uslubi | 18 000 000 | 10 kun |
| Brendbuk — qo‘llash qoidalari | 24 000 000 | 7 kun |

### Qadoq

| Xizmat | Narx (so'm) | Muddat |
|---|---|---|
| Qadoq dizayni (1 mahsulot turi) | 12 000 000 | 7 kun |
| Har qo‘shimcha mahsulot turi | 4 000 000 dan | +3 kun |

### Huquqiy himoya

| Xizmat | Narx (so'm) | Muddat |
|---|---|---|
| Patent tekshiruvi | 880 000 | 1 ish kuni |
| Patent (oddiy) | 5 000 000 | **7 oy** |
| Patent (tezkor) | 7 000 000 | **20–40 kun** |

Patent tekshiruviga qo'shimcha: **har qo‘shimcha sinf +440 000 so'm**.
Bu alohida xizmat emas — ekspert tekshiruviga qo'shilib ketadigan summa.

---

## 3. Paketlar

| Paket | Narx | Alohida olinsa | Tejaladi | Tarkibi | Muddat |
|---|---|---|---|---|---|
| VIP | 70 000 000 | 85 000 000 | 15 000 000 | Neyming, Logotip, Firma uslubi, Brendbuk, Patent, Qadoq dizayni (3 mahsulot turi) | 35–45 kun |
| **PREMIUM** *(ko'p tanlanadi)* | 55 000 000 | 65 000 000 | 10 000 000 | Neyming, Logotip, Firma uslubi, Brendbuk, Patent | 30–35 kun |
| STANDART | 20 000 000 | 23 000 000 | 3 000 000 | Neyming, Logotip, Patent | 20–25 kun |

**Diqqat — ziddiyatga o'xshaydi, lekin to'g'ri:** paket muddatlari (20–45 kun) faqat
dizayn ishlariga tegishli. Patent guvohnomasi alohida chiqadi: oddiy tartibda 7 oy,
tezkorda 20–40 kun. Sahifada shu izoh bor, uni olib tashlamang.

---

## 4. Ish jarayoni va to'lov

1. **Brif va tahlil** — biznes, raqobatchilar, auditoriya o'rganiladi
2. **Konsepsiya** — 3 ta yo'nalish taqdim etiladi, mijoz bittasini tanlaydi
3. **Ishlab chiqish** — tanlangan yo'nalish sayqallanadi
4. **Topshirish** — barcha fayllar va hujjatlar mijozda

To'lov ikki bosqichda: **50%** shartnoma imzolanganda, **50%** loyiha topshirilganda.

---

## 5. Kafolatlar (`GUARANTEES`)

Sahifada aytilgan va shartnomada yoziladigan narsalar:

- Shartnoma: muddat, hajm va topshiriladigan fayllar oldindan yoziladi
- Mijoz tasdiqlamaguncha keyingi bosqichga o'tilmaydi
- Konsepsiya bittada emas — 3 ta yo'nalishdan tanlanadi
- Naming bo'yicha 3 ta bepul tahrir
- To'lov bosqichma-bosqich

**Bu ro'yxatga pul qaytarish kafolati YO'Q va uni o'zingizdan qo'shmang.**
Kafolat — biznes majburiyati, uni faqat egasi (Baxtiyorjon) belgilaydi.

---

## 6. Sahifa tuzilishi

2026-11-07 dan (konversiya auditi, K-5) tartib shunday — eng foydali taklif (paket) va
eng kuchli e'tiroz javobi ("nega arzon dizayner emas") yuqorida:

1. Hero — "Narxlarimiz ochiq, hamma uchun birdek"; darhol 4 narx yo‘li va barcha xizmat/paketga havolalar
2. **Paketlar** (`#packages`) — tejaladigan summa ko'rsatilgan holda
3. **Nega arzon dizayner emas** + kafolatlar
4. **Xizmatlar — yig'iladigan ro'yxat.** Har xizmat bitta qator (nom, narx, muddat);
   bosilganda lead, foyda, kimga, tarkib, dalil, keyslar va xizmatga bog'langan tugma ochiladi.
   Qator `id="service-{id}"`: `/narxlar#service-logo` havolasi shu qatorni ochib beradi
5. JTBD — mijoz qaysi azobdan qutuladi, qaysi natijaga keladi
6. Ijtimoiy isbot — logotiplar, mijoz fikrlari
7. Jarayon + to'lov
8. Narxga ta'sir qiluvchi omillar
9. FAQ
10. Suhbat (CTA)

**Tugmalar:** umumiy "Ariza qoldirish" yo'q. Har xizmat tugmasi o'z matni bilan
(`Service.cta`, masalan "Logotip bo‘yicha maslahat"), paketlarda `ui.packages.cta`.
Hammasi maslahat formasini ochadi, xizmat oldindan belgilangan bo'ladi.

---

## 7. Matnga tegishda qoidalar

Egasining uslub talablari — bularni buzmang:

- **Ko'plik, birinchi shaxs**: "Narxlarimiz ochiq", "shaffof ishlaymiz". Birlik emas.
- **"Yaratish" so'zi ishlatilmaydi** — o'rniga: qurish, ishlab chiqish, tayyorlash.
- **"Legenda"** kabi tushunarsiz jargon yo'q.
- Sodda jumlalar, jonli til, ortiqcha badiiylik yo'q.
- Har bir xizmat FAB bo'yicha yozilgan: funksiya emas, **mijoz oladigan foyda**.
- Raqamlar bo'shliq bilan ajratiladi: `10 000 000`, `tabular-nums`.

---

## 8. Ochiq qolgan ishlar

- **i18n**: narx matnlari 4 til modulida. Bosh sahifa maslahat/FAQ/jarayon matnlari `src/locales/*.json` dagi `salesFlow` bo‘limidan olinadi.
- **Paket kalkulyatori** (`PackageBuilder`) hozir hech qayerdan chaqirilmaydi —
  eski narxlar sahifasi olib tashlanganda o'lik kodga aylandi. Qarori kutilmoqda.

---

## 9. Narxni o'zgartirish kerak bo'lsa

1. `src/lib/sales-content/uz.ts` va boshqa uchta til modulini tahrirlang.
2. Paket narxini o'zgartirsangiz, `separate` va `saving` ni ham qayta hisoblang —
   ular avtomatik hisoblanmaydi.
3. `npm run typecheck && npm run lint && npx vitest run && npm run build`.
4. O'zgarishni `DEV_LOG.md` ga yozing (AGENTS.md 10-qoida).
