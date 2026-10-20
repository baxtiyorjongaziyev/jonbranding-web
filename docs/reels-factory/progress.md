# Reels Zavodi — progress

Har bir sessiya oxirida **yuqoriga** yangi yozuv qo'shiladi (eng yangisi tepada).
Format: sana · agent · vazifa · nima qilindi · dalil (buyruq + natija) · keyingi qadam.

---

## 2026-10-20 · claude · F-05 (review)
- Qilindi: `npm run caption -- <slug>` → `out/<slug>-captions.json` (uz/ru/en/zh). Prompt faqat Sanity faktlarini oladi;
  `validateCaption` Sanity'da yo'q raqamni, CTA yo'qligini, matn ichidagi hashtag va uzunlikni rad etadi. 2 urinishdan keyin faktlardan shablon.
  Provayder: Gemini (portfolio-bot bilan bir xil), `MOCK_LLM=true` rejimi. Sanity yordamchilari `scripts/lib/sanity.ts` ga ajratildi.
- Dalil: `cd services/case-reels && npx vitest run` → 10/10 ✅; `tsc` ✅; `verify.sh` ✅.
- Tekshirilmagan: haqiqiy Sanity va Gemini bilan ishga tushirish (sandbox'da cdn.sanity.io bloklangan) — egasi lokal sinashi kerak.
- Keyingi: Codex F-05 ni review qiladi. F-06 (Telegram preview) endi faqat F-03 ni kutyapti.

---

## 2026-10-20 · claude · F-04 (review)
- Qilindi: `src/sanity/schemaTypes/portfolio.ts` ga ixtiyoriy `reel` maydoni qo'shildi (holat, 4 til video URL, render/reja vaqti, post havolasi, izoh). Mavjud keyslar o'zgarmaydi.
  `REEL_STATUSES` / `REEL_LANGS` — `src/lib/reels.ts` (bog'liqliksiz); F-03, F-06, F-07 shuni ishlatadi.
- Dalil: `npx vitest run src/sanity` → 3/3 ✅; `npm run typecheck` ✅; `bash scripts/reels-factory/verify.sh` ✅.
- Shared fayl: `portfolio.ts` (Sanity schema) — CONTRIBUTING-agents.md bo'yicha PR'da aytildi.
- Keyingi: Codex F-04 ni review qiladi; Codex F-02 (sifat darvozasi) ni boshlashi mumkin.

---

## 2026-10-19 · claude · F-01 (done) + harness
- Qilindi: `services/case-reels` (Remotion shablon, 4 til, tasdiqlangan natija filtri, galereya GROQ tuzatildi).
  PRD, LOOP.md, feature_list.json va verify.sh yozildi.
- Dalil: `npx tsc --noEmit` ✅; ruscha CTA kadri `remotion still` bilan render qilindi; PR #381 CI yashil (CodeQL repo sozlamasi sababli qizil).
- Keyingi: F-02 (codex) va F-04 (claude) parallel boshlanishi mumkin, chunki ular bir-biriga bog'liq emas.
- Bloklar: PRD §10 dagi Q1–Q4 egasidan javob kutyapti.
