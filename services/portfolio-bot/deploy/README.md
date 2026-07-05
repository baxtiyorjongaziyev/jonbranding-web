# Portfolio-bot — Oracle/GCE VM'ga bepul deploy

Railway ($5/oy) o'rniga mavjud always-on VM (masalan, Oracle Cloud Free Tier —
umrbod bepul) ustida ishga tushirish. Xarajat: $0.

## 1-qadam: VM'ga kiring va skriptni ishga tushiring

```bash
ssh oracle-oisha   # yoki sizning VM ulanish buyrug'ingiz
curl -fsSL https://raw.githubusercontent.com/baxtiyorjongaziyev/jonbranding-web/main/services/portfolio-bot/deploy/setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

Birinchi ishga tushirishda skript repo'ni clone qiladi, bog'liqliklarni
o'rnatadi, build qiladi va `.env` faylini `.env.example` dan yaratib, keyingi
qadam uchun to'xtaydi.

## 2-qadam: `.env` faylini to'ldiring

```bash
nano ~/jonbranding-web/services/portfolio-bot/.env
```

| Kalit | Qayerdan olinadi |
|---|---|
| `TG_API_ID`, `TG_API_HASH` | https://my.telegram.org → API development tools (bepul) |
| `TG_SESSION` | 3-qadamda generatsiya qilinadi (bo'sh qoldiring) |
| `TG_CHANNEL_IDS` | Kuzatiladigan kanal, masalan `@JonBranding` |
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey (bepul) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Cloud Console → IAM → Service Accounts → yangi key (JSON) → shu VM'ga yuklab, yo'lini yozing (masalan `/home/ubuntu/service-account.json`). Drive API'ni **Enable** qilishni unutmang, va queue papkani shu service account emailiga (`...@...iam.gserviceaccount.com`) "Viewer" sifatida ulashing |
| `SANITY_PROJECT_ID` | `h6ymmj0v` (loyihada allaqachon shu) |
| `SANITY_DATASET` | `production` |
| `SANITY_TOKEN` | sanity.io/manage → loyiha → API → Tokens → Add API token → **Editor** huquqi |
| `APIFY_API_KEY` | (ixtiyoriy, Instagram uchun) https://console.apify.com — bo'sh qoldirsa mock data ishlatiladi |
| `DRIVE_PARENT_FOLDER_ID` | **Majburiy.** Har bir loyiha uchun rasm subfolder'lari shu papka ichida bo'lishi kerak. Telegram postidan olingan loyiha/mijoz nomi shu subfolder'lar nomi bilan solishtirilib qidiriladi (link shart emas) — subfolder nomini loyiha nomiga imkon qadar yaqin qiling |
| `TG_NOTIFY_CHAT_ID` | Natija xabarlari yuboriladigan Telegram chat ID (o'zingizga yozib qo'yish uchun) |

## 3-qadam: Telegram sessiyasini generatsiya qiling (bir martalik, interaktiv)

```bash
cd ~/jonbranding-web/services/portfolio-bot
npm run auth
```

Telefon raqamingiz va SMS kod so'raladi. Oxirida chiqqan `TG_SESSION`
qatorini nusxalab, `.env` faylidagi `TG_SESSION=` ga qo'ying.

## 4-qadam: Xizmatni ishga tushiring

```bash
cd ~/jonbranding-web/services/portfolio-bot/deploy
./setup.sh
```

Bu safar `.env` mavjud bo'lgani uchun skript to'g'ridan-to'g'ri systemd
xizmatini o'rnatib, ishga tushiradi.

## Holatni tekshirish

```bash
sudo systemctl status portfolio-bot
journalctl -u portfolio-bot -f          # jonli loglar
```

## Yangilash (kod o'zgarganda)

```bash
cd ~/jonbranding-web/services/portfolio-bot/deploy
./setup.sh
```

Skript qayta ishga tushirilganda avtomatik `git pull` qiladi, qayta build
qiladi va xizmatni qayta ishga tushiradi. `.env` va Telegram sessiyasi
saqlanib qoladi.

## Qanday ishlaydi

- **Telegram** — `@JonBranding` kanaliga oddiy matn bilan post tashlansa
  (Drive linki shart emas), bot darhol o'qiydi:
  1. Gemini postdan loyiha/mijoz nomini ajratadi (tezkor chaqiruv).
  2. `DRIVE_PARENT_FOLDER_ID` ichidagi subfolder'lar orasidan shu nomga
     eng mos kelganini so'z-ustma-ustlik bo'yicha qidiradi.
  3. Topilgan papkadagi rasmlarni yuklab, Gemini'ga matn + barcha rasmlarni
     birga beradi — u to'liq case matnini, SEO meta-data'ni (sarlavha,
     tavsif, kalit so'zlar) va rasmlar ichidan eng mos **cover**'ni hamda
     qolganlarining ko'rsatilish tartibini bitta chaqiruvda aniqlaydi.
- **Instagram / Google Drive** — har soatda (`INTERVAL_MINUTES=60`, `.env`da
  o'zgartirish mumkin) tekshiriladi, xuddi shu tarzda cover/tartib va SEO
  meta-data bilan.
- Har ikkala holatda ham natija Sanity'ga case sifatida **to'g'ridan-to'g'ri
  publish** qilinadi (qo'lda tasdiqlash shart emas) → saytda 60 soniya
  ichida chiqadi.

**Muhim:** qidiruv nom bo'yicha ishlagani uchun Drive'dagi subfolder nomi
loyiha yoki mijoz nomiga imkon qadar yaqin bo'lishi kerak (masalan
"Fidda by Sevara" posti uchun `Fidda_Sevara` yoki `Fidda by Sevara` nomli
papka mos keladi, lekin butunlay bog'liqsiz nom — masalan sana yoki
raqam — topilmaydi).
