# 🤝 Hissa Qo'shish Qo'llanmasi (Contribution Guidelines)

`jonbranding-web` — Markaziy Osiyo brend-agentligi uchun premium "Sales Machine" veb-platformasi. Loyiha ustida ishlovchi har bir muhandis va AI agent (Antigravity, Codex, Claude, Cursor) quyidagi standartlarga qat'iy amal qilishi shart.

---

## 🚀 Ishni Boshlash (Getting Started)

1. **Reponi klonlash va o'rnatish:**
   ```bash
   git clone https://github.com/baxtiyorjongaziyev/jonbranding-web.git
   cd jonbranding-web
   npm install
   ```

2. **Lokal muhitni ishga tushirish:**
   ```bash
   # Standart port: http://localhost:9002
   npm run dev
   ```

3. **Muhit o'zgaruvchilari (`.env.local`):**
   - `.env.example` faylidan nusxa olib `.env.local` yarating.
   - Hech qachon shaxsiy kalitlar, AmoCRM tokenlari yoki xizmat akkauntlarini gitga commit qilmang.

---

## 🌿 Branch Naming Konvensiyasi

Yangi vazifa yoki muammoni hal qilishda quyidagi shablonlardan foydalaning:

- `feat/<vazifa-nomi>` — Yangi imkoniyat, komponent yoki sahifa
- `fix/<xato-nomi>` — Xatolik yoki regresiyani tuzatish
- `chore/<ish-nomi>` — Qaramliklarni yangilash, konfiguratsiya yoki refaktoring
- `perf/<maqsad>` — Tezlik, animatsiya yoki resurslarni optimallashtirish
- `docs/<mavzu>` — Hujjatlar va qo'llanmalarni yangilash

---

## 📝 Commit Xabarlari (Conventional Commits)

Barcha commitlar xalqaro Conventional Commits formatida yozilishi shart:

```bash
feat(credentials): add 4-language presentation deck
fix(oisha): resolve dynamic state hydration in FoxUI Orb
perf(assets): optimize image loading and webp conversions
chore(deps): bump next to 16.4.5 and patch security advisories
docs(readme): overhaul architecture diagram and installation guide
```

---

## 🇺🇿 Uzbek-First Policy (Majburiy!)

- O'zbek tili saytimizning **asosiy tili** hisoblanadi.
- Har qanday yangi matn, kalit yoki o'zgarish avval `src/locales/uz.json` ga kiritiladi.
- Shundan so'ng boshqa 3 ta tilga (`ru.json`, `en.json`, `zh.json`) to'liq sinxronlashtiriladi.
- Har 4 ta tilda kalitlar soni va iyerarxiyasi 100% bir xil bo'lishi shart (`npm run verify:fast` buni tekshiradi).

---

## 🛡️ Sifat Nazorati va Pre-Push Gate

Har qanday o'zgarishni commit yoki push qilishdan oldin lokal testlar to'liq **yashil** bo'lishi shart:

```bash
# 1. Tezkor tekshiruv (i18n sinxronligi + kod arxitekturasi + Vitest)
npm run verify:fast

# 2. To'liq tip tekshiruvi (TypeScript strict)
npm run typecheck

# 3. Linter tekshiruvi
npm run lint

# 4. Ishlab chiqarish build tekshiruvi
npm run build

# 5. Xavfsizlik auditi (0 ta yuqori/kritik zaiflik)
npm audit --audit-level=high --omit=dev
```

---

## 🎨 Master Design & Anti-AI-Slop Qoidalari

1. **60-30-10 Rang qoidasi:**
   - 60% Fon: Toza oq `#FFFFFF` (`--at-bg`, `--paper`)
   - 30% Struktura: To'q qora siyoh `#0A0B0E` (`--at-ink`), neytral matn `#4B5563`, nozik chegaralar `#E5E7EB`
   - 10% Elektr aksent: Elektr ko'k `#2554FF` (`--at-accent`), hover `#1D4ED8`
2. **Tipografiya:**
   - `Instrument Serif` kursiv sarlavhalarida sun'iy qalinlashuv (faux-bold) taqiqlanadi (`font-weight: 400`).
3. **Anti-Slop detektori:**
   ```bash
   node .agents/skills/impeccable/scripts/detect.mjs
   ```
   Aniqlangan anti-patternlar soni **0** bo'lishi shart.
4. **Touch Targets:** WCAG 2.5.8 bo'yicha barcha bosiladigan elementlar mobil qurilmalarda $\ge 44 \times 44\text{px}$.

---

## 🚫 Zero Hallucination & Ma'lumot Xavfsizligi

- Soxta, to'qima (simulated/fictional) mijozlar, keyslar, dialoglar, narxlar yoki statistika qo'shish **QAT'IYAN TAQIQLANADI**.
- Ichki CRM havolalari, Call Intelligence va mijoz telefon raqamlari hech qachon public sahifalarga yoki gitga chiqmasligi shart.
- Har qanday o'zgarish `docs/DEV_LOG.md` da hujjatlashtirilishi zarur.

---

## 📬 Pull Request Jarayoni

1. Yangi branch yarating va o'zgarishlarni kiriting.
2. Yuqoridagi barcha sifat tekshiruvlaridan muvaffaqiyatli o'ting.
3. PR ochayotganda `.github/pull_request_template.md` shablonidagi barcha katakchalarni to'ldiring.
4. CI pipeline (`Typecheck, lint, test, build` va `Security Audit`) yashil bo'lgach, kod ko'rib chiqiladi va birlashtiriladi.
