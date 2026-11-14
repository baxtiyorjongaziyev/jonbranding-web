# AGENT_EXPERIENCE — jonbranding-web

Tekshirilgan tajribalar. Har bir yozuv aniq buyruq yoki xato bilan tasdiqlangan.

## 2026-11-09 — GitHub PR va Dependabot

- ✅ **Ishladi:** Dependabot alertlarini to'liq ro'yxat olish —
  `gh api -H "Accept: application/vnd.github+json" "repos/OWNER/REPO/dependabot/alerts?state=open&per_page=100" --paginate`.
  PowerShell'da `&` uziladi; shuning uchun buyruqni Node `execSync` ichida bajarish ishonchli.
- ✅ **Ishladi:** PR'dagi CodeQL `FAILURE` sababini ko'rish —
  `gh api "repos/OWNER/REPO/check-runs/<id>/annotations"`. `services/case-reels/scripts/lib/telegram.test.ts` dagi eski ogohlantirish PR #400 kodi bilan bog'liq emas.
- ✅ **Ishladi:** Draft PR'ni merge qilish — `gh pr ready <n>`, keyin `gh pr merge <n> --squash --delete-branch`.
- ❌ **Ishlamadi:** `npm audit --json > audit.json` — PowerShell UTF-16 yozadi, `JSON.parse` xato beradi.
- ✅ **Yechim:** Node ichida `execSync('npm audit --json')`, xato bo'lsa `e.stdout`, keyin `JSON.parse`.
- ✅ **Ishladi:** Eski fayl versiyasini olish — `git show <rev>~1:path` (`^` PowerShell/cmd orqali uziladi).
- ➡️ **Qoida:** Vercel statusi `failure` va URL `vercel.com/knowledge/why-is-my-account-deployment-blocked` bo'lsa — bu account/billing bloki, kod xatosi emas; repo'da tuzatib bo'lmaydi.
- ➡️ **Qoida:** Dependabot holatini har doim default branch bo'yicha tekshir: `state=open` 0 bo'lsa, masala yopilgan.
