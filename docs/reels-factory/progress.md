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

## 2026-10-20 — F-05 done
- Codex review: 9 + 1 topilma tuzatildi (137e189, 7113f40). Oxirgi review (7113f40): "no major issues".
- CI 7e7d90f da yashil (typecheck, lint, test, build, npm audit, GitGuardian).
- CodeQL workflow egasi qarori bilan olib tashlandi (private repoda code scanning yo'q).
- Keyingi: F-09 (Claude, F-02 dan keyin), F-02/F-03 (Codex), F-06 egasi qarorlarini kutadi (PRD §10).

## 2026-10-26 — F-02, F-03 review'da (Claude)
- Codex F-02 ni o'z sandbox'ida yozdi, lekin branch GitHub'ga push qilinmadi → Claude brief bo'yicha qayta yozdi (0c1f494).
- F-03: `npm run batch -- [--dry-run] [--langs ...] [--limit N]`; Sanity'ga faqat `reel.status=draft` (+renderedAt), token bo'lmasa yoki MOCK_SANITY_WRITE=true bo'lsa mock.
- Dalil: case-reels tsc ✅, vitest 38/38 ✅, verify.sh ✅.
- Keyingi: Codex review (F-02, F-03) → F-06 Telegram tasdiq.

## 2026-10-26 — F-02, F-03 done; F-06 review (Claude)
- F-03 Codex review'dagi 5 topilma tuzatildi; ESM tuzatilgach `npm run batch -- --dry-run` haqiqiy Sanity bilan ishladi.
- F-06: `npm run review -- send|listen`. Preview Marketing guruhiga, tugma faqat egada, holat faqat draft'dan.
- Egasidan kerak: BotFather token, guruh chat ID, o'z Telegram user ID, Sanity write token → `.env`.
- Keyingi: F-07 (Meta Graph API, Antigravity yoki Claude), F-09 shablonlar.

## 2026-10-26 — F-06 done
- Codex yakuniy review (c2ac171): no major issues. 59/59 test.
- Haqiqiy ishga tushirish egasining kalitlarini kutadi: TELEGRAM_BOT_TOKEN, TELEGRAM_REELS_CHAT_ID, TELEGRAM_OWNER_USER_ID, SANITY_WRITE_TOKEN (`.env`).
- Keyingi: F-07 (Meta Graph API joylash, 09/13/19), F-09 shablonlar, F-11 musiqa.
