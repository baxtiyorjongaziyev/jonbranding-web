# Jon.Branding — mobil vizual audit

2026-10-10. Manba: jonbranding.uz production, Chrome mobil emulyatsiyasi. Bosh sahifa, menyu, PWA taklifi, portfolio filtrlari, footer, narxlar va Perfona keys sahifasi tekshirildi. 390×844, 320×568 va 360×800 o‘lchamlar qo‘llandi. Bu haqiqiy Safari/Android qurilmasidagi test emas. Ariza yuborilmadi; real PWA o‘rnatish, backend yetkazilishi va Core Web Vitals o‘lchanmadi.

## Hukm

Mobil UX bo‘yicha subyektiv baho: **5/10**. Brend uslubi va asosiy matn o‘qilishi yaxshi. Lekin kontakt qatlamlari to‘qnashuvi, noto‘g‘ri portfolio filtrlari va ishlamaydigan footer havolalari premium taassurotni buzadi. P0 aniqlanmadi; ko‘rilgan muammolar quyida.

| Daraja | Dalil va ta’sir | Tavsiya va joy |
|---|---|---|
| P1 | Ko‘k “Qo‘ng‘iroq qiling” vidjeti pastki navigatsiyadagi Qo‘ng‘iroq/Telegram/AI tugmalari ustiga chiqadi. Menyu ochilganda ham Telegram kartasini yopadi. 320px narxlar ekranida katta qismni egallaydi. | Bitta mobil kontakt paneli; drawer/dialog vaqtida boshqa fixed CTA qatlamlarini yashirish. `mobile-nav-bar.tsx`, `oisha-callback-script.tsx`, tashqi callback vidjeti. |
| P1 | “Oziq-ovqat” filtrida barcha 23 loyiha, jumladan Perfona, PETRON, FIDDA va Velzo qoladi. “Fintech”da 0 loyiha, lekin “Sizga ham shunday natija mumkin” taklifi qoladi. | Haqiqiy industry qiymatlarini moslashtirish; noma’lum industryni food deb belgilamaslik; bo‘sh natija holati. `atelier-sections.tsx:108`. |
| P1 | Footer Portfolio va Ishlarni ko‘rish `/#portfolio`ga boradi, lekin DOM’da bunday id yo‘q. Bosilganda portfolio ko‘rinmadi. FAQ `/#faq` ham mavjud bo‘lmagan idga bog‘langan. | Mavjud `#ishlar` va `#savol` identifikatorlariga moslash. `footer.tsx:133,137,168`. |
| P2 | PWA kartasi va iOS yo‘riqnomasida logo singan. `/_next/image?url=%2Ficon-192.png&w=96&q=75` tasviri complete=true, naturalWidth=0. Lokal asset mavjud, demak yetkazilish/optimizer tekshirilishi kerak. | Production image javobini tekshirish, logo tiklash. `pwa-installer.tsx:215`. |
| P2 | “Tanlangan 6 ta loyiha, 2023—2025” matni ostida 23 loyiha bor; ko‘rsatilgan yillar orasida 2026 ham bor. Portfolio eyebrow “Xizmatlar” deb turadi. | Copy va real katalogni moslash; portfolioga tegishli sarlavha. `uz.json:2083`, ATGallery. |
| P2 | 390px bosh sahifa taxminan 28 756px uzun. Portfolio o‘zi 10 542px — 12 ekran bo‘yi. Mijoz keyingi ishonch dalillarigacha juda ko‘p skroll qiladi. | Home’da eng kuchli 4–6 keys; qolganlari portfolio sahifasida. Bu uzunlikning o‘zi texnik xato emas, sotuv iyerarxiyasi muammosi. |
| P2 | Hero va Perfona kartasida brend ishidan ko‘ra “Sifatli kontent obuna talab qiladi” yozuvli muqova ko‘rinadi. Perfona detail sahifasi uni “IT startap” deb ta’riflaydi; katalog tavsiflari bir xil emas. | CMS muqova va kategoriya/tavsifni egasi tasdiqlagan haqiqiy loyiha bilan tekshirish. Hozirgi matnni biznes fakti sifatida qabul qilmaslik. |
| P2 | Menyuda ikki X yonma-yon ustma-ust turadi. Custom close kengligi 36px. | Sheet default close yoki custom close’dan bittasini qoldirish; 44×44px target. `header-mobile-menu.tsx:88`, Sheet. |
| P3 | Uzbek PWA yo‘riqnomasida “1. Share / 2. Add to Home Screen”; accessible close nomlari inglizcha. Narxlar keyslarining alt matnida `undefined` chiqadi. | Locale orqali matn; mavjud bo‘lmagan qiymat uchun toza fallback. |

## Yaxshi ishlayotgan tomonlar

- Asosiy sarlavha, oq/cream fon va ko‘k CTA o‘qilishi aniq; umumiy brend uslubi esda qoladi.
- “Loyihani muhokama qilish” formasi ochildi; telefon maydoni tel/inputmode tel/autocomplete tel. Forma yuborilmadi.
- Narxlar 390 va 320px hamda Perfona 360px DOM tekshiruvida gorizontal overflow yo‘q. Bu barcha sahifa/holatlar uchun kafolat emas.
- Narxlar yuqori qismidagi 4, 50/50, 100% bloklari tor ekranda sig‘adi.

## Skill audit ko‘rsatkichlari

0–4 shkalada faqat tekshirilgan qism: Responsive 2/4; vizual/theming izchilligi 2/4; kontent va UI anti-patterns 2/4. Accessibility to‘liq audit emas: target, accessible label va alt kamchiliklari qayd etildi, yakuniy ball berilmadi. Performance o‘lchanmadi. Deterministik impeccable detector scoped 5 komponentda [] qaytardi; bu live xatolar yo‘qligini anglatmaydi.

## Dalillar

Skrinshotlar: `C:/Users/baxti/.codex/visualizations/2026/10/10/01a125d8-9e57-78d0-b604-89f8a40b7b0c/mobile-audit/`.

- `menu-390.png`: ikki X va Telegram ustidagi callback.
- `ios-guide-390.png`: singan logo, guide va pastki kontakt qatlamlari.
- `portfolio-390.png`: portfolio muqovasi.
- `fintech-empty-390.png`: bo‘sh filter holati.
- `footer-broken-anchor-390.png`: #portfolio bosilgandan keyingi footer.
- `pricing-390.png`, `pricing-320.png`: narxlar va fixed CTA to‘qnashuvi.
- `callback-390.png`: asosiy forma ochilgan holat.

`perfona-360.png` emulyatsiya o‘tishidagi vaqtinchalik noto‘g‘ri screenshot bo‘lgani uchun vizual dalil sifatida ishlatilmadi. DOM tavsifi o‘qildi. `install-behind-menu-390.png` transient holat; o‘rnatish menyu ortida qoladi degan doimiy xulosa chiqarilmadi.

## Tuzatish tartibi

1. Kontakt qatlamlarini birlashtirish va footer havolalarini tiklash.
2. Portfolio industry/muqova/copy ma’lumotlarini tozalash.
3. PWA logo va menu close’ni tuzatish.
4. Home’ni eng kuchli keyslar va asosiy sotuv yo‘liga qisqartirish.
5. Keyin haqiqiy iPhone Safari va Android Chrome’da keyboard, safe-area, o‘rnatish va formaning real yetkazilishini tekshirish.

Audit davomida mahsulot kodi o‘zgartirilmadi. Qo‘llangan skill’lar: impeccable audit va web-quality-audit; severity, responsive, accessibility va dalil chegaralarini tartiblash uchun.

## 2026-10-10 — tuzatishlar

PWA icon avvalgi 622fc58 deploy’da tuzatildi. Ushbu auditning qolgan tuzatishlari kodga kiritildi: mobil kontakt qatlamlari, footer targetlari, bitta44px menu close, Uzbek-first4til guide,6keys home selection va barcha loyihalar havolasi, mos copy, unknown year fallback yo‘q, pricing alt/client fallback.

CMS’dagi21loyihaning industry qiymatlari null. Sohani taxmin qilish o‘rniga, filtrlar haqiqiy category xizmat qiymatlariga bog‘landi. Noma’lum industry food deb belgilanmaydi. Home’dagi ishlar6ta; galereya390px’da3197px, avval10542px.

**Auditdagi taxmin tuzatildi:** Perfona galereyasida Telegram IT mahsuloti va uning logotipi ko‘rildi. Uni atir brendi deb talqin qilish asoslanmagan; IT tavsifi o‘zgartirilmadi. Eski promo muqova o‘rniga shu galereyadagi haqiqiy logo qo‘yildi; kelajakdagi CMS cover o‘zgarishlari ustidan yozilmaydi.

Lokal Chrome390/320/360tekshiruvi: bitta44×44close; menu/forma/PWA vaqtida quick actions yashirin; callback FAB mobile’da yo‘q; Qadoq filtri faqatBoyarin; footerPortfolio ->#ishlar va galereya top≈0; narxlar320px’da undefinedalt yo‘q, overflowyo‘q; Perfona360px’da overflowyo‘q. Screenshotlar `fixed-*-local-*.png`.

397test +typecheck +i18n passed. Haqiqiy iPhone/Android, OSkeyboard, nativeinstall va ariza real backend yetkazilishi **ochiq** — qurilma mavjud emas, soxta lid yuborilmadi. Performance/CWV o‘lchanmadi.
