# Reels Zavodi — PRD

**Status:** Draft v1 · **Egasi:** Baxtiyorjon Gaziyev · **Sana:** 2026-10-19
**Kod:** `services/case-reels/` (Remotion) + `services/portfolio-bot/` (Sanity yozuvchi)
**Harness:** [LOOP.md](LOOP.md) · [feature_list.json](feature_list.json) · [progress.md](progress.md)

---

## 1. Muammo

Jon Branding'da 1000+ loyiha bor, lekin Instagram va Telegram'da ularning juda kami ko'rinadi.
Har bir keys uchun Reels yasash dizaynerning 2–4 soatini oladi, shuning uchun portfolio
"javonda turibdi". Raqobatchilar har kuni kontent chiqaradi, biz esa haftada 1–2 marta.

## 2. Maqsad

Sanity'dagi **tasdiqlangan** har bir portfolio keysidan 4 tilda (uz/ru/en/zh)
9:16 Reels avtomatik yasash va egasi bir tugma bosgandan keyin uni rejalashtirib chiqarish.

| Metrika | Hozir | Maqsad (90 kun) |
|---|---|---|
| Bitta keysdan Reels gacha vaqt | 2–4 soat | ≤ 10 daqiqa (shundan inson vaqti ≤ 2 daqiqa) |
| Haftalik Reels soni | 1–2 | 7 (har kuni bittadan) |
| Videodagi to'qima ma'lumot | — | **0** (faqat Sanity'dagi tasdiqlangan fakt) |
| Render xatosi | — | < 5% |

Instagram qamrovi va lid soni kabi metrikalar **o'lchanadi**. Lekin ular uchun hozir raqamli
maqsad qo'yilmaydi: bunga baza ma'lumot yo'q. Baza 30 kundan keyin aniqlanadi (F-10).

## 3. Doiradan tashqari (Non-goals)

- Ovozli dublyaj va AI avatar (HeyGen) — v2.
- Tasdiqsiz avtomatik chiqarish. **Hech qachon** (AGENTS.md: Human-in-the-loop qoidasi).
- Mijozning shaxsiy ma'lumotlari, CRM havolalari va telefon raqamlari videoda chiqmaydi.
- TikTok va YouTube Shorts — v2 (format bir xil, kanal keyin qo'shiladi).

## 4. Foydalanuvchilar

1. **Egasi (Baxtiyorjon):** Telegram'da preview ko'radi, "✅ Chiqar" yoki "✏️ Qayta" tugmasini bosadi.
2. **SMM menejer:** reja (kalendar) va caption'larni tahrirlaydi.
3. **Agentlar (Claude Code, Codex, Antigravity):** zavodni quradi va ishlatib turadi.

## 5. Asosiy oqim

```
Sanity: portfolio keys (approved)
   │  1. Tanlash: hali Reels'i yo'q keyslar
   ▼
render-case.ts  ──►  Remotion  ──►  out/<slug>-<til>.mp4  (+ cover.jpg)
   │  2. Sifat darvozasi: davomiylik, o'lcham, bo'sh kadr, matn sig'ishi
   ▼
Caption generator (brend ovozi, 4 til, CTA, hashtag)
   │  3. Telegram'ga preview → egasi tasdig'i
   ▼
Postiz (reja) ──► Instagram Reels / Telegram kanal
   │  4. Holat Sanity'ga yoziladi: reel.status, reel.publishedAt, reel.postUrl
   ▼
Haftalik hisobot (qamrov, saqlash, lid)
```

## 6. Funksional talablar

| ID | Talab | Ustuvorlik |
|---|---|---|
| FR-1 | `npm run render -- <slug> [til]` bitta keysdan MP4 yasaydi *(bor)* | P0 |
| FR-2 | `npm run batch` hali Reels'i yo'q barcha keyslarni navbat bilan render qiladi | P0 |
| FR-3 | Natija sahnasi faqat `approved` + manbali + davrli natijada chiqadi *(bor)* | P0 |
| FR-4 | Sifat darvozasi: 1080×1920, 7–20 s, matn kadrdan chiqmaydi, rasm yuklanadi | P0 |
| FR-5 | Cover (birinchi kadr) JPG alohida chiqadi | P1 |
| FR-6 | Caption: 4 tilda, `docs/BAXTIYOR_TONE_OF_VOICE.md` uslubida, CTA va 5–8 hashtag | P0 |
| FR-7 | Telegram preview: video, caption va "Chiqar / Qayta / O'tkazib yubor" tugmalari | P0 |
| FR-8 | Faqat tasdiqdan keyin Postiz'ga reja qo'shiladi | P0 |
| FR-9 | Sanity: `portfolio.reel.status` (draft → approved → scheduled → published), `reel.videos.<til>`, `reel.publishedAt`; konstantalar `src/lib/reels.ts` | P1 |
| FR-10 | Fon musiqasi: litsenziyasi toza kutubxonadan, so'kinishsiz, beat'ga mos kesish | P2 |
| FR-11 | Shablon variantlari: "Oldin/Keyin", "Jarayon", "Raqam" — keysga qarab avtomatik tanlanadi | P2 |

## 7. Nofunksional talablar

- **Haqiqat:** videodagi har bir matn Sanity maydonidan olinadi. LLM faqat caption yozadi va
  u ham Sanity'dagi faktlar bilan cheklanadi. Raqamni o'zidan to'qib chiqarmaydi.
- **Brend:** Atelier tokenlari (`#1B4DFF`, Inter Tight 700, Instrument Serif kursiv urg'u).
  Instrument Serif'ni sun'iy qalinlashtirish (faux bold) taqiqlangan.
- **Animatsiya:** Emil Kowalski qoidalari: ease-out (0.23, 1, 0.32, 1), kirish ≤ 600 ms,
  faqat transform va opacity.
- **Xavfsizlik:** tokenlar `.env`da saqlanadi va repoga tushmaydi. Postiz va Telegram uchun mock rejim bor (`MOCK_POSTIZ`, `MOCK_TELEGRAM`).
- **Narx:** render lokal yoki bitta VPS'da bo'ladi. Remotion litsenziyasi jamoa hajmiga qarab tekshiriladi (F-12).

## 8. Muvaffaqiyat mezoni (v1 tayyor)

1. 10 ta haqiqiy keysdan 40 ta video (4 tilda) xatosiz render bo'ldi.
2. Egasi 7 kun ketma-ket Telegram'dan tasdiqlab, Reels chiqardi.
3. Hech bir videoda Sanity'da yo'q fakt chiqmadi (avtomatik test + qo'lda 10 ta tekshiruv).

## 9. Xavflar

| Xavf | Yechim |
|---|---|
| Sanity'da keyslarning rasmlari kam yoki past sifatli | Sifat darvozasi rasmni o'tkazib yuboradi; 2 tadan kam rasm bo'lsa keys navbatga qo'yilmaydi |
| Instagram API cheklovi | Postiz orqali chiqariladi, kuniga 1 ta post |
| Musiqa mualliflik huquqi | Faqat litsenziyasi toza kutubxona ishlatiladi; ro'yxat repoga yoziladi |
| Agentlar bir faylga tegib ketadi | LOOP.md'dagi qulf (lock) va hudud egaligi |

## 10. Ochiq savollar (egasining qarori kerak)

- ~~Q1~~ **Qaror (2026-10-20):** preview Marketing bo'limining yopiq Telegram guruhiga boradi (`TELEGRAM_REELS_CHAT_ID`). Tasdiqlash/rad tugmasini faqat egasi bosa oladi (`TELEGRAM_OWNER_USER_ID` tekshiriladi); bo'lim xodimlari ko'radi va izoh qoldiradi. Instagram Business akkaunt Facebook sahifaga bog'langan — tasdiqlandi.
- ~~Q2~~ **Qaror (2026-10-20):** Meta Graph API (Instagram Content Publishing) to'g'ridan-to'g'ri. Talab: Instagram Business akkaunt + Facebook sahifa + Meta app (`instagram_content_publish`). Limit 50 post/24 soat — yetarli.
- ~~Q3~~ **Qaror:** kuniga 3 ta post. Aniq soatlar: 09:00 / 13:00 / 19:00 (Toshkent) — taklif, egasi alohida tasdiqlamagan. Eslatma: tasdiqlangan portfolio keyslari soni cheklangan, shuning uchun bir keysdan 4 til + har xil formatlar (F-09 shablonlari) aylantiriladi; keys takrori orasida kamida 14 kun.
- ~~Q4~~ **Qaror:** faqat bepul musiqa. Meta API Instagram kutubxonasi musiqasini qo'sha olmaydi, shuning uchun trek render paytida videoga tikiladi. Manba: tijoriy foydalanishga ruxsat beruvchi royalty-free (masalan Pixabay Music, YouTube Audio Library "attribution not required"). Har trek litsenziyasi `services/case-reels/music/LICENSES.md` da yoziladi.
