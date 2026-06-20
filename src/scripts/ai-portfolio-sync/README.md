# AI Portfolio Workflow

Ushbu skriptlar to'plami Telegram (yoki Instagram) dagi postlarni o'qib, Google Drive'dan tegishli loyiha rasmlarini tortib, Gemini AI yordamida qayta ishlagach, Sanity CMS ga avtomatik Portfolio tarzida joylaydi.

## Qanday ishlaydi?
1. **TelegramFetcher**: Berilgan kanal yoki botdan so'nggi xabarlarni oladi.
2. **GeminiProcessor**: Olingan xabardagi matnni (masalan: "Fidda loyihasi +40% foyda keltirdi") o'qib, Sanity talab qiladigan strukturali ma'lumotga (title, slug, category, va hokazo) aylantiradi.
3. **DriveFetcher**: Google Drive'dagi belgilangan papkadan rasmlarni yuklab oladi.
4. **SanityUploader**: Yuklab olingan rasmlarni Sanity Assets omboriga joylaydi va Gemini generatsiya qilgan ma'lumotlar bilan bog'lab, yangi `portfolio` hujjatini yaratadi.

## O'rnatish va sozlash

Ushbu jarayon to'liq avtomatik ishlashi uchun quyidagi ma'lumotlarni to'ldirishingiz kerak:

1. `.env.local` fayliga quyidagi o'zgaruvchilarni qo'shing:
   - `GEMINI_API_KEY=sizning_kalitingiz` (bu allaqachon mavjud)
   - `SANITY_API_WRITE_TOKEN=sizning_kalitingiz` (Sanity Studio -> API -> Tokens bo'limidan "Editor" ruxsati bilan oling)
   - `TELEGRAM_BOT_TOKEN=sizning_bot_tokeningiz` (agar Telegramdan olinadigan bo'lsa)

2. **Google Drive ulanishi:**
   - Google Cloud Console orqali "Service Account" yarating.
   - Unga `Google Drive API` ruxsatini bering.
   - JSON formatdagi kalitni yuklab oling va loyihaning asosiy papkasiga `service-account.json` nomi bilan saqlang.

## Ishga tushirish

Barcha ma'lumotlar to'g'ri o'rnatilgach, terminal orqali quyidagi buyruq bilan ishga tushiring:

```bash
npx tsx src/scripts/ai-portfolio-sync/index.ts
```
