# 🚀 Jon Branding — Universal Hosting Portability & Automated Migration
========================================================================

Ushbu tizim saytni istalgan paytda boshqa hostingga (**Vercel ⇄ Cloudflare Workers ⇄ Docker / VPS / Coolify / Railway**) bir necha daqiqada va **avtomatlashtirilgan tarzda** ko'chirish imkonini beradi.

---

## 🏗️ 100% Ko'chuvchanlik Arxitekturasi (Zero-Lock-in)

Loyiha hech bir xususiy hosting provayderiga bog'lanmagan:
1. **Web Standards:** Barcha kodlar universal Web API (Fetch, Request, Response, Edge Middleware) ga asoslangan.
2. **Multi-Target Build:**
   - **Cloudflare Workers:** OpenNext adapteri (`npm run deploy:cloudflare`).
   - **Vercel:** Vercel native build (`npm run deploy:vercel`).
   - **Mustaqil Server (VPS / Docker / Coolify):** Next.js 16 `output: 'standalone'` va `Dockerfile` + `docker-compose.yml` (`npm run deploy:docker`).
3. **Universal Cron & Background Tasks:**
   - `.github/workflows/cron-cloudflare.yml` (Universal runner) — qaysi hostingda bo'lishidan qat'i nazar, `https://www.jonbranding.uz` orqali content-agent, lead-retry va portfolio vazifalarini avtomatik chaqiradi. DNS o'zgarganda cron o'z-o'zidan yangi hostingga ulanadi.

---

## ⚡ Avtomatlashtirilgan Ko'chish Jarayoni (4 Qadam)

### 1-qadam: Ko'chishdan oldingi Pre-flight tekshiruv
Yangi hostingga o'tishdan oldin barcha zaruriy o'zgaruvchilar va servislar ulanishini tekshiring:
```bash
npm run migration:check
```
*Bu buyruq `.env.example` dagi 94 ta kalitni tekshirib, qaysi biri yetishmayotganini va tizimning tayyorlik darajasini ko'rsatadi.*

---

### 2-qadam: Maxfiy sozlamalar (Secrets)ni avtomatik o'tkazish
Lokal `.env.production.local` dagi kalitlarni yangi hosting platformasiga bir zumda yuklash:

* **Vercel'ga ko'chganda:**
  ```bash
  npm run migration:sync vercel
  ```
  *(Vercel CLI orqali barcha production muhit o'zgaruvchilarini avtomatik yaratadi)*

* **Cloudflare Workers'ga ko'chganda:**
  ```bash
  npm run migration:sync cloudflare
  ```
  *(Wrangler secret put orqali barcha production secretlarini Worker'ga avtomat yuklaydi)*

* **Docker / Coolify / VPS ga ko'chganda:**
  ```bash
  npm run migration:sync docker
  ```
  *(Konteynerlar uchun toza va to'liq `.env.production` faylini generatsiya qiladi)*

---

### 3-qadam: Yangi hostingga Deploy qilish

* **Vercel'ga deploy:**
  ```bash
  npm run deploy:vercel
  ```

* **Cloudflare'ga deploy:**
  ```bash
  npm run deploy:cloudflare
  ```

* **Mustaqil Server (Docker / VPS / Coolify):**
  ```bash
  npm run deploy:docker
  ```

---

### 4-qadam: Ko'chishdan keyingi Smoke-test (Avtomatik Verifikatsiya)
Yangi hostingda barcha sahifalar, xavfsizlik filtrlari, Oisha AI va formalar to'liq ishlayotganini avtomatik tekshirish:
```bash
npm run migration:smoke
```
*Ushbu skript saytdagi barcha 30+ yo'nalishlarni, statik assetlarni, intake cookie va API xavfsizligini tekshiradi.*

---

## 📋 Qaysi Servislar Qanday Ko'chadi?

| Tizim | Qanday avtomatlashgan? | Qo'lda bajariladigan amal |
|---|---|---|
| **amoCRM & Telegram** | `.env` orqali avtomatik yangi hostga o'tadi | Yo'q (Webhooklar asosiy domenga ulangan) |
| **Sanity CMS** | CMS bulutda joylashgan, tokenlar yangi hostga o'tadi | Yo'q |
| **Oisha AI & CAPI** | Backend Cloud Run'da, API proxy orqali ulanadi | Yo'q |
| **Cron Jobs** | GitHub Actions orqali universal chaqiriladi | Yo'q |
| **DNS (Cloudflare)** | Domen yozuvlari (A / CNAME) | Yangi host IP/CNAME'iga yo'naltirish |
