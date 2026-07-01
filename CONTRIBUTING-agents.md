# AI Agentlar uchun koordinatsiya qoidalari

> **jonbranding-web** repozitoriyasida bir nechta avtonom AI agent parallel ishlaydi.
> Bu hujjat — hamma agent bir tildan gapirishi uchun. Ish boshlashdan **oldin** o'qing.

---

## 1. Manba haqiqat = `main`

Har qanday ish boshlashdan oldin:

```bash
git fetch origin main
git rebase origin/main   # yoki: git checkout -b <branch> origin/main
```

- Hech qachon eski/stale branch ustida ishlamang.
- Squash-merge tufayli eski feature-branch commitlar konflikt beradi — har doim yangi main'dan boshlang.

---

## 2. Rol taqsimoti (hudud egaligi)

Har agent o'z hududida ishlaydi. Bir faylga ikki agent tegishi — istisno, qoida emas.

| Agent | Hudud | Asosiy fayllar |
|-------|-------|----------------|
| 🛡️ **Sentinel** | Xavfsizlik | `src/app/api/**`, auth, middleware, cron endpointlar |
| 🎨 **Palette** | Accessibility / UX | `src/components/ui/**`, focus, aria, klaviatura navigatsiyasi |
| ⚡ **Bolt** | Performans | animatsiya, scroll, lazy-load, bundle |
| 🧭 **Jules** | CI / xavfsizlik alertlari | CI konfiguratsiya, deps, build |
| 🧱 **Claude (integrator)** | Kontent / lead-gen / UX | `src/components/sections/**`, `src/locales/**`, forma, analitika |
| 🤖 **Dependabot** | Bog'liqliklar | `package.json`, `package-lock.json` |

---

## 3. Umumiy (shared) fayllar — ehtiyot bo'ling

Quyidagi fayllarga tegsangiz, PR izohida **ochiq ayting**:

- `src/components/home-component.tsx` — bosh sahifa yig'uvchisi (eng ko'p konflikt shu yerda)
- `src/components/layout/client-enhancements.tsx` — global enhancementlar
- `src/locales/*.json` — i18n (til fayllari)
- `tailwind.config.ts`, `next.config.js` — global konfiguratsiya

**Qoida:** shared faylni o'zgartirsangiz — kichik, izolyatsiya qilingan diff qiling. Butun faylni qayta yozmang.

---

## 4. Branch va PR strategiyasi

1. **Branch nomi:** `<agent>/<qisqa-tavsif>` (masalan `sentinel/fix-xss-jsonld`).
2. **Kichik PR:** bitta PR = bitta maqsad. Aralashtirmang.
3. **Draft bilan boshlang**, tayyor bo'lganda "Ready for review" qiling.
4. **PR tavsifi:** nima, nega, qaysi fayllar, shared faylga tegdimi.
5. **Merge:** squash-merge. Merge'dan keyin branchni o'chiring.

---

## 5. Konflikt hal qilish

- Konflikt chiqsa — **o'z hududingdagi** o'zgarishni saqla, boshqa hududnikini `main`dan ol.
- Ikkilanaslik bo'lsa — merge qilmang, PR izohida integratorni (`Claude`) chaqiring.
- Konflikt markerlarini (`<<<<<<<`, `=======`, `>>>>>>>`) hech qachon commit qilmang.

---

## 6. CI / Deploy

- **Vercel** — asosiy deploy. Yashil bo'lishi shart.
- **Netlify** — hozircha e'tiborsiz (loyiha Vercel'da).
- **CodeRabbit / Gemini** — review beradi; "high priority" topilmalarni tuzating.
- Netlify build xatosi PR'ni bloklamaydi.

---

## 7. Commit uslubi

```
<emoji> <Agent>: <qisqa tavsif>

<batafsil izoh — nega kerak, nima o'zgardi>
```

Masalan:
```
🛡️ Sentinel: Fix auth bypass in cron endpoints
🎨 Palette: Add focus-visible styles to accordion
🧱 Claude: Merge AtAwards + AtRatings into single section
```

---

## 8. Til siyosati (Uzbek-first)

Har qanday matn yoki UI o'zgarishi — **avval o'zbek tilida** (`src/locales/uz.json`),
so'ngra ru / en / zh ga tarjima. O'zbek — saytimizning asosiy tili.

---

_Bu hujjat yangilanib turadi. Savol bo'lsa — PR izohida integratorni chaqiring._
