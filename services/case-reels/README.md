# Case Reels — portfolio keysidan avtomat Reels

Remotion yordamida Sanity'dagi portfolio keysidan 9:16 (1080×1920) video yasaydi.
Dizayn sayt bilan bir xil Atelier tokenlarida: Inter Tight, Instrument Serif, JetBrains Mono, `#1B4DFF`.

## Sahnalar
1. **Hook** (2 s): kategoriya, mijoz nomi, sarlavha
2. **Oldin → Keyin** (4 s): ikkala rasm ham bo'lsa, "Keyin" rasmi chapdan ochiladi
3. **Galereya**: har bir rasm 1.5 s, ko'pi bilan 4 ta
4. **Natija** (2.5 s): faqat `approved` va manbali natija bo'lsa (saytdagi qoida bilan bir xil)
5. **CTA** (2.5 s): "Sizning brendingiz navbatda." · jonbranding.uz

Davomiylik keysdagi ma'lumotga qarab o'zgaradi (taxminan 7–20 s).

## Ishlatish
```bash
cd services/case-reels
npm install
npm run studio                 # brauzerda ko'rish va tahrirlash
npm run render -- den-aroma       # out/den-aroma-uz.mp4
npm run render -- den-aroma ru    # out/den-aroma-ru.mp4 (uz | ru | en | zh)
```

Litsenziya: Remotion 3 kishigacha bo'lgan jamoaga bepul. Undan katta bo'lsa, remotion.pro'dan kompaniya litsenziyasi kerak.

## Caption (F-05)
```bash
npm run caption -- den-aroma   # out/den-aroma-captions.json (uz, ru, en, zh)
```
LLM (Gemini, `GEMINI_API_KEY`) erkin matn emas, JSON qaytaradi: ilmoq (raqamsiz) + ko'pi bilan 2 jumla,
har biri bitta Sanity faktiga bog'langan. Jumladagi raqam o'sha faktda bo'lmasa (xitoycha va to'liq kenglikdagi
raqamlar ham), javob rad etiladi; 2 urinishdan keyin yoki provayder xatosida — faktlardan shablon.
Shablon uz'dan boshqa tillarda faktlarni tarjima qilmaydi va `needsReview` bilan belgilanadi.
**Har qanday caption — draft.** Egasi Telegram'da tasdiqlamaguncha chiqmaydi (F-06).
