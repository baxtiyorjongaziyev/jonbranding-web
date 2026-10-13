# Audit tuzatish rejasi — 2026-10-13

Manba: `AUDIT.md` (13-okt 2026). Har bosqich alohida PR. Har PR: typecheck + lint + vitest + build yashil.

Belgilar: 🟢 kod, owner kerak emas · 🟡 owner tasdig'i/matn kerak · 🔴 boshqa repo (Oisha backend)

---

## PR-1 — Tez va xavfsiz tuzatishlar 🟢 (1 kun)

| # | Topilma | Ish | Fayl |
|---|---|---|---|
| 1 | #9 autosave va'dasi | "avtomatik saqlanadi" matnini 4 tilda olib tashlash (PR-4 draft tayyor bo'lguncha) | `src/locales/*.json` (~2199), `online-brief/page.tsx:72` |
| 2 | #4 xizmatlar hero | `AtHero`ga dictionary uzatish, fallback "Free Brand Audit" matnini o'chirish | `xizmatlar-interactive.tsx:15`, `at-hero.tsx:34–42` |
| 3 | #10 scroll dublikat | Bitta tracker qoldirish (layout'dagi), home'dagini o'chirish | `home-component.tsx:144`, `main-layout.tsx:29` |
| 4 | #10 brief source | brief → `source: online_brief`, builder → `package_builder` | `online-brief-wizard.tsx:149,574`, `contact-modal.tsx:164,186` |
| 5 | A15 | `/aloqa` "Online brief" CTA → `/online-brief` | `aloqa-client.tsx:100,167` |
| 6 | A16 | Gallery label "tashxis" → "Shunday loyihani muhokama qilish" | `uz.json:2090` + 3 til |
| 7 | A18 | Mobil menyu muted rangi ≥4.5:1 (masalan `#6B675B`) | `header-mobile-menu.tsx:175,193` |
| 8 | A21 | zh wizard uslub variantlari tarjimasi | `online-brief-wizard.tsx:164–171` |
| 9 | A24 | "Sotiladigan firma uslubi" → "Biznesingiz uchun yagona ko'rinish" | `uz.json:2067` + 3 til |

Qabul: unit test source qiymatlari uchun; scroll event bitta.

## PR-2 — Lead durable saqlash (web tomoni) 🟢 (2–3 kun) — eng muhim

1. `submit-form`: avval Supabase `leads_inbox` jadvaliga yozish (status `pending`, `request_id`, `idempotency_key`). Yozilmasa → 503, `ok:false`.
2. Yozilgandan keyin delivery (Telegram/CRM/n8n) — har biri timeout (`AbortSignal.timeout(8000)`), natija `delivered`/`failed` holatda saqlanadi.
3. Retry: Vercel cron (`/api/cron/lead-retry`, har 5 daq) `failed`/eski `pending`ni qayta yuboradi, 5 urinishdan keyin `dead`, Telegram'ga admin ogohlantirish.
4. `lead-modal.tsx`: faqat `{ok:true, requestId}` da success; aks holda xato + "Telegram orqali yozing" fallback.
5. Analytics `generate_lead` faqat durable accept'dan keyin.
6. A12: amoCRM lead ID va notes status tekshiruvi, note-only retry (ikkinchi lead yaratmaslik).
7. A22: barcha server tashqi fetch'larga deadline.

Qabul (vitest, mock): barcha downstream fail → 1 ta `pending` qator, UI success ko'rsatmaydi; bir xil idempotency key → dublikat yo'q; notes 500 → partial + retry.

## PR-3 — Cookie rozilik 🟢 (1 kun)

1. Banner: "Qabul qilish" / "Rad etish" / "Sozlamalar" (analytics, marketing toggle).
2. Mount'da hech narsa yozilmaydi; tanlov `localStorage` + cookie `consent=v1:analytics,marketing`.
3. GA/Metrika/Meta pixel faqat tegishli rozilikdan keyin yuklanadi (`layout.tsx:290`, `client-enhancements.tsx:192`). Google Consent Mode v2 default `denied`.
4. Footer'da "Cookie sozlamalari" havolasi — qayta o'zgartirish.
5. #10 page_view: GA `send_page_view:false` + bitta route listener (`gtag.ts`, `loader-script.ts:28`).

Qabul: Playwright — yangi sessiyada tanlovgacha GA/Metrika so'rovi yo'q; reject refreshdan keyin saqlanadi; page_view initial/navigatsiyada bittadan.

## PR-4 — Brief draft 🟢 (0.5 kun)

- `online-brief-wizard.tsx` state → `localStorage` (`jb-brief-draft-v1`, 7 kun TTL), qaytganda "Davom ettirish / Yangidan" tanlovi, yuborilgandan keyin tozalash.
- Shundan keyin PR-1da olingan va'dani to'g'ri matn bilan qaytarish: "Javoblar shu qurilmada saqlanadi".

## PR-5 — Accessibility 🟢 (1 kun)

1. #8 Video kartalar: `<button>` + Radix `Dialog` (focus trap, Escape, return focus, `aria-label`), yopilganda iframe unmount. `atelier-sections.tsx:432,744,809`.
2. A17 Marquee: pause tugmasi, klonlarga `aria-hidden`, reduced-motion'da statik. `at-marquee.tsx`.

Qabul: Playwright keyboard test — Tab/Enter ochadi, Escape yopadi, fokus kartaga qaytadi.

## PR-6 — Ishonch da'volari 🟡 (owner manbalariga bog'liq)

1. `src/lib/claims.ts` — evidence registry: `{ id, text, value, source, date, scope }`. Komponentlar raqamni faqat shu yerdan oladi.
2. `content-integrity.test.ts`ga qoida: registrydagi `source` bo'sh claim render qilinmaydi.
3. Owner manba bermagunicha: 90% (`uz.json:143`) va 70% (`:1487`) → oddiy muammo tavsifi (audit misollari); 120+/240+/514/37/5.0 va badge'lar → manba/sana bilan yoki yashirish.

**Owner'dan kerak:** har raqam uchun manba, sana, hisob ta'rifi; badge'lar issuer/yil/havola; 5.0 platforma va sharhlar soni.

## PR-7 — Asosiy taklif va matnlar 🟡

1. Bitta taklif: "20 daqiqalik bepul maslahat" — home, xizmatlar, modal, CTA'lar bir xil.
2. #7 jargon: `sales-content/uz.ts` — oddiy natija birinchi, termin qavsda (audit jadvalidagi misollar). "SERVICES SYSTEM", "silent seller" o'zbekchaga.
3. A14: naming/patent scope — trademark qidiruv, klass, davlat boji alohida qator. `docs/NARXLAR.md` bilan moslash.
4. A15: "24 soat online" → "Arizani istalgan payt qoldiring. Du–Sha 09:00–19:00 javob beramiz".
5. Uzbek-first: avval `uz`, keyin ru/en/zh.

**Owner'dan kerak:** taklif tasdig'i, haqiqiy ish vaqti, patent scope/boji.

## PR-8 — Privacy siyosati 🟡 (PR-2, PR-3 dan keyin)

- Data map jadvali: ma'lumot turi → oluvchi (amoCRM, Telegram, Supabase, GA, Metrika, Meta, n8n) → maqsad → saqlash muddati → o'chirish so'rovi aloqasi.
- "Uchinchi shaxsga berilmaydi" → "Sotilmaydi; faqat xizmat ko'rsatish uchun quyidagi processorlarga uzatiladi".
- Formalar ostiga qisqa izoh + privacy havolasi. 4 til.

**Owner'dan kerak:** production'da qaysi integratsiyalar yoqilgan, saqlash muddati.

## PR-9 — Narxlar UX 🟢 (1 kun)

- A13: `/narxlar` tepasida kompakt taqqoslash jadvali (xizmat · narx · muddat · tarkib) + paketlar; batafsil kartalar expand. `min-height:100svh` olib tashlash.

## PR-10 — Performance / SEO / palette 🟢 (1 kun)

1. A19: font preload faqat birinchi ekran fontlari (10 → 2–3), qolganlari `preload:false`.
2. A20: robots — bitta metadata siyosati; locale `credentials`/`brand-strategy` uchun bitta `noindex`, `robots.ts` 4 til prefiksini qamrasin, sitemap'dan chiqarish.
3. A23: palette tokenlarini bitta joyga (`atelier.css`), qattiq yozilgan cream ranglarni token'ga.

Qabul: Lighthouse oldin/keyin, HTML'da bitta robots meta.

## 🔴 Oisha backend (alohida repo)

- #1 callback widget: in-memory task → durable queue (DB outbox), 202 faqat yozilgandan keyin; in-memory dedup → DB unique constraint.
- A11: amoCRM token refresh — web va Oisha bitta grant ishlatsa, refresh egasi bitta bo'lsin (distributed lock / version). Avval grant identity tekshirish.

---

## Navbat

```
PR-1 ─┬─ PR-2 (lead) ─┬─ PR-8 (privacy)
      ├─ PR-3 (cookie)┘
      ├─ PR-4 (draft)
      ├─ PR-5 (a11y)
      ├─ PR-9, PR-10
      └─ PR-6, PR-7  ← owner javobi kutiladi
Oisha — parallel, alohida sessiya
```

Kod ishlari (🟢): ~8–9 kun. Owner javoblari kelishi bilan 🟡 qismlar.

## Owner uchun savollar (bir martada)

1. Asosiy taklif — "20 daqiqalik bepul maslahat"mi?
2. 90%, 70%, 120+/240+, 514/37, 150+, 5.0, badge'lar — manbalari bormi? Yo'q bo'lsa olib tashlaymizmi?
3. Haqiqiy javob vaqti: Du–Sha 09–19?
4. Patent/trademark: narxga nima kiradi, davlat boji alohidami?
5. Production'da qaysi integratsiyalar yoqilgan (n8n, Meta CAPI)? Lead ma'lumotlari qancha saqlanadi?
6. Lead inbox uchun Supabase ishlatsak bo'ladimi (affiliate jadvallar bilan bir loyiha)?
