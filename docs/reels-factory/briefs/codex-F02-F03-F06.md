# Codex topshirig'i: F-02 → F-03 → F-06

**Tartib qat'iy:** bitta vaqtda bitta vazifa (`feature_list.json` → `status: in_progress`, `lockedBy: codex`).
Har biri alohida PR, sarlavha `[F-0X] ...`. LOOP.md 1–9 qadamlariga amal qil.
Har PR'dan keyin Claude review qiladi.

## Umumiy qoidalar
- Kod faqat `services/case-reels/` ichida. Shared fayllarga (`src/**`) tegma; kerak bo'lsa PR'da ayt.
- To'qima fakt yo'q: hamma matn Sanity'dan (`scripts/lib/sanity.ts` → `sanity`, `approvedResult`).
- Sanity'ga faqat `reel.*` maydonlari yoziladi (`src/lib/reels.ts` konstantalari). Production'ga
  avtomatik "published" yozilmaydi — faqat egasi tasdig'idan keyin.
- Tashqi xizmatlar uchun mock: `MOCK_TELEGRAM=true`, `MOCK_SANITY_WRITE=true` — testlar tarmoqqa chiqmaydi.
- Tekshiruv: `cd services/case-reels && npx tsc --noEmit && npx vitest run` va `bash scripts/reels-factory/verify.sh`.
- Commit/PR'da model nomi yozilmaydi.

## F-02 — Sifat darvozasi
Fayl: `scripts/quality-gate.ts` (+ `scripts/lib/quality-gate.ts` sof funksiyalar, `*.test.ts`).
- Kirish: render qilingan MP4 yo'li + keys ma'lumoti.
- `ffprobe` orqali: 1080×1920, 30fps, davomiylik 7–20 s. Aks holda `{ok:false, reasons:[...]}`.
- Render'dan **oldin**: galereyada 2 tadan kam rasm bo'lsa keys rad etiladi (`reason: "gallery<2"`).
- ffprobe chaqiruvi injeksiya qilinadigan funksiya — testlarda soxta natija bilan.
- Testlar: chegaraviy holatlar (6.9 s, 20.1 s, 1080×1919, 29.97fps, 1 rasm).

## F-03 — Batch render
Fayl: `scripts/batch.ts`, `npm run batch -- [--dry-run] [--langs uz,ru,en,zh] [--limit N]`.
- Tanlov: `portfolio` hujjatlari, `reel.status` yo'q yoki `none`, tasdiqlangan.
- Har keys: F-02 oldingi tekshiruvi → render (mavjud `render-case.ts` mantiqi, funksiyaga ajrat) → F-02 keyingi tekshiruvi → caption (F-05 `makeCaption`).
- Bir keys xato bersa qolganlari davom etadi.
- `out/manifest.json`: `[{slug, lang, file, captionFile, gate:{ok,reasons}, error?}]`.
- `--dry-run` faqat ro'yxatni chiqaradi, hech narsa render qilmaydi va yozmaydi.
- Muvaffaqiyatda Sanity: `reel.status = "draft"`, `reel.renderedAt` (MOCK_SANITY_WRITE bo'lsa yozilmaydi, logga chiqadi).

## F-06 — Telegram preview + tasdiq
Fayl: `scripts/telegram-review.ts` (+ `scripts/lib/telegram.ts`).
- Egasi qarori (PRD §10 Q1): preview **Marketing bo'limining yopiq guruhiga** boradi:
  `TELEGRAM_REELS_CHAT_ID`. Tugmalarni faqat egasi bosa oladi: `callback_query.from.id === TELEGRAM_OWNER_USER_ID`,
  boshqalarga "Faqat egasi tasdiqlaydi" javobi, holat o'zgarmaydi.
- `manifest.json` dagi `gate.ok` yozuvlar uchun: video + caption + `needsReview` belgilari ko'rsatiladi.
- Tugmalar: ✅ Chiqar → `reel.status=approved`; ✏️ Qayta → `draft` + `reel.note`; ⏭ O'tkazib yubor → `rejected`.
- Callback idempotent (ikki marta bosish holatni buzmaydi).
- `MOCK_TELEGRAM=true` da tashqariga hech narsa ketmaydi; testlar shu rejimda.
- Token va chat ID `.env` da, repoga tushmaydi; `.env.example` ga kalit nomlari qo'shiladi.

## Kontekst (egasi qarorlari, PRD §10)
Joylash: Meta Graph API (F-07, Antigravity). Jadval: kuniga 3 post, 09:00 / 13:00 / 19:00 Toshkent.
Musiqa: faqat bepul, render paytida videoga tikiladi (F-11).
