# Hosting ko'chishi (Vercel ⇄ Cloudflare Workers)

2026-11-05: Vercel `402 DEPLOYMENT_DISABLED` sabab sayt o'chdi, production Cloudflare Workers'ga
ko'chirildi. Shu tajriba asosida hujjat: keyingi ko'chish soatlarda, tunda emas.

## Muhim holat (2026-11-05)
- Vercel Hobby: "Fast Origin Transfer" limiti oshgani uchun **2026-12-04 gacha** pauza. Qaytsangiz ham Cloudflare'ni oldida qoldiring (trafik kamayadi).
- Cloudflare **Free** tarif (10 ms CPU, `limits.cpu_ms` mumkin emas). **Next 16.4.1 Worker'ni CPU chegarasidan oshiradi (500)** — Next `16.3.8`da qoladi. Shu sabab `npm audit` Next bo'yicha critical (RCE/DoS) ko'rsatadi; to'liq yechim — Workers Paid ($5/oy) yoki Vercel'ga qaytgach yangilash.
- Production versiyasini `npx wrangler versions deploy <id>@100% --name jonbranding-web --message "..." -y` bilan almashtirish/qaytarish mumkin; yangi build'ni avval `npx wrangler versions upload` (preview URL) bilan sinang.
- `open-next.config.ts`dagi static-assets keshi sinaldi, foydasi isbotlanmadi va Sanity kontentini muzlatadi — yoqilmagan.

## Hozirgi holat
- Hosting: Cloudflare Worker `jonbranding-web` (OpenNext adapter), hisob `e29fda2e66e08927a6423c2d8d7320ce`.
- Domenlar: `jonbranding.uz`, `www`, `patent` — `wrangler.jsonc` ichidagi `routes` (custom domain).
- Test: Worker `jonbranding-web-staging` → `staging.jonbranding.uz` (Cloudflare Access OTP bilan yopiq).
- DNS: Cloudflare (nameserver `karl`/`katja`). Pochta (Zoho MX/SPF/DKIM/DMARC), `crm`, `oisha`, `n8n` — tegilmaydi.
- Vercel: to'xtatilgan, zaxira emas.

## Buyruqlar
```bash
npm run build:cloudflare           # .open-next/ yaratadi
npx wrangler deploy                # production (jonbranding-web)
npx wrangler deploy -c wrangler.staging.json   # staging (config'ni docs ichidagi namunadan yarating)
npx wrangler tail jonbranding-web --format json  # jonli xatolar
```
CI: `.github/workflows/deploy-cloudflare.yml` (kerakli GitHub secret'lar pastda).

## Secret'lar (nomlari; qiymatlar repo'da YO'Q)
Worker'da hozir: `AMOCRM_SUBDOMAIN`, `OISHA_API_URL`, `OISHA_SECRET_KEY`, `OISHA_CAPI_URL`,
`OISHA_CAPI_INGEST_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_MESSAGE_THREAD_ID`,
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.

**Hali ko'chirilmagan** (Vercel'da bor edi): `FIREBASE_SERVICE_ACCOUNT_JSON` (lead zaxira navbati;
yo'qligida javobda `saved:false`), `TURNSTILE_SECRET_KEY`, `ADMIN_SECRET`, `CRON_SECRET`, Sanity/Gemini/
Instagram/Vimeo kalitlari. Ko'chishdan OLDIN Vercel'dan to'liq ro'yxatni eksport qilib qo'ying
(Vercel → Settings → Environment Variables), keyin `wrangler secret put` / `wrangler secret bulk`.
`NEXT_PUBLIC_*` qiymatlar build paytida kerak (lokal `.env.production.local`).

Cloudflare Worker secret'larini O'QIB bo'lmaydi — qiymatlarni parol menejerida ham saqlang.

## Ko'chish tartibi (har qanday yo'nalishda)
1. Yangi hostda STAGING: build, deploy, secret'lar.
2. Sinov ro'yxati (pastda) staging'da to'liq o'tsin.
3. Eski DNS yozuvlarining qiymatlarini yozib oling (qaytarish uchun).
4. Eski redirect/page qoidalarini tekshiring (Cloudflare → Rules). 2026-11-05'da apex'ni eski
   `brandboost-landing` ilovasiga yo'naltiruvchi **Redirect Rule** topildi va o'chirildi.
5. DNS: custom domain ulash uchun Cloudflare mavjud A/CNAME yozuvlarini o'chirishni talab qiladi
   (`code 100117`). O'chiring → `wrangler deploy` yozuvlarni o'zi yaratadi.
6. Tekshiruv, keyin eski hostni zaxirada ushlang (to'lov/limit muammosi bo'lmasa).

## Sinov ro'yxati
- `/`, `/ru`, `/en`, `/zh`, `/narxlar`, `/portfolio`, `/blog`, `sitemap.xml`, `robots.txt` — 200
- `patent.` bosh sahifa menejer kalkulyatori, boshqa yo'llar `www`ga yo'naladi
- Rasmlar (`/_next/image`) — brauzerda `naturalWidth > 0`
- `/api/oisha?user_id=web_00000000-0000-4000-8000-000000000001` — 200 (proxy faqat `web_<UUID>` qabul qiladi)
- Forma → amoCRM + Telegram (test lid: `TEXNIK TEST ...`, keyin CRM'dan o'chirish)
- Konsolda React #418 yo'q

## Tuzoqlar (2026-11-05'da topilgan)
| Alomat | Sabab | Yechim |
|---|---|---|
| `/api/*` 500, logda `EvalError: Code generation from strings` | `firebase-admin` → protobufjs `eval` import paytida | Faqat lazy `require` (`src/lib/integrations/firebase.ts`). Test: `portability.test.ts` |
| Build: `Node.js middleware is not supported` | Next 16 `proxy.ts` Node runtime | `src/middleware.ts` (Edge) |
| Rasmlar ko'rinmaydi | `wrangler.jsonc`da `IMAGES` binding yo'q | `"images": {"binding": "IMAGES"}` |
| Turso build xatosi | libsql web transport trace'ga kirmaydi | `@libsql/client/web` + `outputFileTracingIncludes` |
| Oisha 401 | Backend `Authorization: Bearer` talab qiladi | route.ts ikkala sarlavhani yuboradi |
| Hero tugmasi formani ochmaydi | Oisha skripti hydration'dan oldin DOM'ga qo'shilgan | `next/script` `afterInteractive` |
| Apex boshqa saytga o'tadi | Cloudflare Redirect Rule | Rules'dan o'chirish |
| `www` brauzerda `NXDOMAIN`, serverda OK | Provayder DNS keshi (10–30 daq) | `ipconfig /flushdns`, kuting |
| `workers.dev` 404 | Qisman trigger yangilanishida o'chadi | `"workers_dev": true` |

## Qo'lda bajariladigan (Claude/agent qila olmaydi)
DNS yozuvlarini o'zgartirish va Cloudflare Rules tahriri xavfsizlik siyosati bo'yicha bloklangan;
wrangler OAuth'da DNS-yozish ruxsati yo'q. Ularni Dashboard'da egasi bajaradi.

## Hosting'dan mustaqillik qoidalari (kodda)
- Faqat Web API: Node-only modul (`fs`, `net`, gRPC, `eval`/`new Function` ishlatuvchi paketlar) top-level import qilinmaydi.
- Env faqat `process.env` orqali, `src/lib/` ichida bitta joyda o'qiladi.
- Cron: `vercel.json` cron'lari Cloudflare'da ishlamaydi → `wrangler.jsonc` `triggers.crons` yoki GitHub Actions (`amocrm-keepalive.yml`) ishlating. **Hozir Cloudflare'da cron sozlanmagan:** `vercel.json`dagi 3 ta cron (`/api/content-agent` 01:00, `/api/portfolio-telegram` 09:00, `/api/cron/lead-retry` 04:00 UTC) to'xtagan. Ular `CRON_SECRET` Bearer talab qiladi (Worker'da hali yo'q) — avval secret qo'ying, keyin GitHub Actions `schedule` orqali chaqiring.
