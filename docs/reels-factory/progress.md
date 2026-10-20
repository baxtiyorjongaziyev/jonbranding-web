# Reels Zavodi — progress

Har bir sessiya oxirida **yuqoriga** yangi yozuv qo'shiladi (eng yangisi tepada).
Format: sana · agent · vazifa · nima qilindi · dalil (buyruq + natija) · keyingi qadam.

---

## 2026-10-20 · claude · F-04 (review)
- Qilindi: `src/sanity/schemaTypes/portfolio.ts` ga ixtiyoriy `reel` maydoni qo'shildi (holat, 4 til video URL, render/reja vaqti, post havolasi, izoh). Mavjud keyslar o'zgarmaydi.
  `REEL_STATUSES` / `REEL_LANGS` eksport qilindi — F-03, F-06, F-07 shu konstantalarni ishlatadi.
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
