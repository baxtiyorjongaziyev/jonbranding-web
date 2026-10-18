# 🏛️ JonBranding Web — Senior/Staff Codebase Detox & Refactoring Rejasi

> **Maqsad:** Loyihadagi AI agentlar qoldirib ketgan barcha axlatlar, o‘lik dependensiyalar, monolit fayllar va chalkash papkalarni tozalab, repozitoriyni dunyoning yetakchi kompaniyalari (Stripe, Vercel, Linear) standartidagi **toza, chiroyli va intizomli Senior/Staff arxitekturasi** holatiga keltirish.

---

## 📊 Hozirgi Muammolar va Ularning Yechimi

| Muammo | Hozirgi Holat | Senior Standartiga O‘tish |
| :--- | :--- | :--- |
| **O‘lik paketlar** | `styled-components` bor, lekin kodda 0 marta ishlatilgan | `package.json` dan butunlay o‘chirish |
| **O‘lik kodlar** | `archive/` papkasi gitda saqlanmoqda | `archive/` papkasini o‘chirish (git tarixi bor) |
| **37 ta o‘lik skript** | `scripts/` ichida bir martalik Python, Node, PS1 fayllar sochilgan | Faqat zarur harness va cron skriptlarini qoldirib, qolganini tozalash |
| **Noto‘g‘ri joylashgan fayllar** | `src/lib/headline.tsx` (komponent) va `src/lib/use-main-site-origin.ts` (hook) `lib/` da | `headline.tsx` -> `components/ui/`, `use-main-site-origin.ts` -> `hooks/` |
| **Ikkita alohida test papkasi** | `test/` (vitest) va `tests/` (playwright) | Bitta `tests/` ga birlashtirish (`tests/setup/` va `tests/e2e/`) |
| **800+ qatorlik Monolitlar** | `atelier-sections.tsx` (851 qator), `narxlar-client.tsx` (799 qator) | Kichik, o‘qilishi oson sub-komponentlarga ajratish |

---

## 🚀 4 Bosqichli Ijro Zanjiri

### 1-Bosqich: O‘lik Kodlar va Axlatxona Skriptlarni Tozalash (Quick Win)
- [ ] `archive/` papkasini va `.modified` kabi vaqtinchalik fayllarni o‘chirish.
- [ ] `scripts/` ichidagi 30+ ta bir martalik, tashlandiq skriptlarni yo‘qotish (faqat `verify.mjs`, `mock-lead.mjs` va `portfolio_drive_automation.py` qoldiriladi).
- [ ] `src/scripts/` ni asosiy `scripts/` bilan birlashtirib, chalkashlikni bartaraf etish.
- [ ] `package.json` dan foydalanilmayotgan `styled-components` paketini o‘chirish (`npm uninstall styled-components`).
- [ ] `npm run verify:fast` orqali hech narsa buzilmaganini tekshirish.

### 2-Bosqich: Noto‘g‘ri Joylashgan Fayllarni Arxitektura O‘rniga Ko‘chirish
- [ ] `src/lib/use-main-site-origin.ts` -> `src/hooks/use-main-site-origin.ts` ga ko‘chirish va barcha importlarni yangilash.
- [ ] `src/lib/headline.tsx` -> `src/components/ui/headline-renderer.tsx` ga ko‘chirish va importlarni to‘g‘rilash.
- [ ] `test/` papkasidagi `setup.ts` va `server-only-mock.ts` ni `tests/setup/` ga ko‘chirish, `vitest.config.ts` sozlamasini yangilash va ortiqcha `test/` papkasini o‘chirish.
- [ ] Barcha 446 ta test 100% yashil o‘tishini tasdiqlash.

### 3-Bosqich: "Xudo Fayllar" (God Objects) Dekompozitsiyasi
- [ ] `src/components/atelier/atelier-sections.tsx` (851 qator) ni kichik modullarga bo‘lish.
- [ ] `src/app/[lang]/narxlar/narxlar-client.tsx` (799 qator) ni qismlarga ajratish.

### 4-Bosqich: Yakuniy Harness, Linter va CI/CD Verifikatsiyasi
- [ ] `npm run lint` — 0 ogohlantirish, 0 xato.
- [ ] `npm run typecheck` — 0 TypeScript xatosi.
- [ ] `npm run verify` — barcha 446 ta test yashil.
- [ ] `docs/DEV_LOG.md` ga to‘liq refaktoring hisobotini kiritish.
