# JonBranding Web — Verification & Agent Harness

Ushbu hujjat `jonbranding-web` loyihasida sifat nazorati, AI agentlar (Codex, Claude, Antigravity, Gemini) va ishlab chiquvchilar uchun tekshiruv harness tizimini belgilaydi.

---

## 1. Asosiy Buyruqlar

```bash
# To'liq harness tekshiruvi (i18n + kod standartlari + Typecheck + Vitest)
npm run verify
# yoki
npm run harness

# Tezkor tekshiruv (Typechecksiz: i18n + kod standartlari + Vitest)
npm run verify:fast

# Qat'iy rejim (500 qatordan oshgan fayllar bo'lsa xatolik beradi)
node scripts/harness/verify.mjs --strict
```

---

## 2. Harness Bosqichlari

1. **i18n Parity (Lug'atlar sinxronligi)**:
   - `uz.json` asosiy lug'at hisoblanadi.
   - `ru.json`, `en.json`, `zh.json` fayllari `uz.json` bilan 100% bir xil kalitlarga ega bo'lishi shart.
   - Har qanday tushib qolgan yoki ortiqcha kalit aniqlanganda harness ogohlantiradi yoki xatolik qaytaradi.

2. **Code Standards & Architecture Guard**:
   - `src/` ichida git merge ziddiyatlari (`<<<<<<<`, `>>>>>>>`) qolmaganligi tekshiriladi.
   - 500 qatordan oshgan fayllar aniqlanib, agentlarga refaktoring qilish tavsiya etiladi.

3. **TypeScript Typecheck (`tsc`)**:
   - `tsconfig.typecheck.json` orqali to'liq TypeScript tekshiruvi (0 ta xatolik talabi).

4. **Unit & Integration Tests (`vitest`)**:
   - Barcha narx formulalari (`docs/NARXLAR.md` bilan mosligi).
   - Form validatsiyasi, xavfsizlik regressiya testlari.
   - Barcha testlar 100% yashil o'tishi shart.

---

## 3. AmoCRM & Telegram Mock Harness

Lokal ishlab chiqish yoki testlash paytida tashqi AmoCRM / Telegram tizimlariga soxta lidlar tushmasligi uchun muhit o'zgaruvchilari orqali mock rejim qo'llab-quvvatlanadi:

```env
# .env.local yoki test muhitida
MOCK_AMOCRM=true
MOCK_TELEGRAM=true
```

- `MOCK_AMOCRM=true`: AmoCRM API ga so'rov yubormasdan, tasodifiy `mockLeadId` va `mockContactId` bilan muvaffaqiyatli 200 javob qaytaradi.
- `MOCK_TELEGRAM=true`: Xabarni Telegram chatga yubormasdan, server loggeriga mock log yozadi.
- Test: `src/app/api/submit-form/route-harness.test.ts`.
