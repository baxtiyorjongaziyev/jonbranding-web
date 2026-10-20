# Reels Zavodi — Agent Loop (Claude Code · Codex · Antigravity)

Bu fayl uchala agent uchun **bitta umumiy ish tsikli**. Holat chat tarixida emas, faqat
`feature_list.json` va `progress.md` da saqlanadi. Shuning uchun istalgan agent istalgan
paytda ishni davom ettira oladi.

## Rollar

| Agent | Kuchli tomoni | Asosiy vazifalar |
|---|---|---|
| **Claude Code** | Arxitektura, kontent, brend ovozi, integratsiya, review | F-04, F-05, F-09, har PR'ni yakuniy review |
| **Codex** | Aniq spec bo'yicha skript va testlar, tez iteratsiya | F-02, F-03, F-06, F-10 |
| **Antigravity** | Brauzer/vizual QA, tashqi xizmatlar, media | F-07, F-08, F-11 |
| **Inson (Baxtiyorjon)** | Tasdiq, litsenziya, akkauntlar | F-12, PRD §10 savollari |

## Tsikl (har bir sessiya)

```
1. SYNC     git fetch origin main && git checkout -b <agent>/<F-id> origin/main
2. PICK     feature_list.json: status=todo, deps hammasi done, blockedBy yo'q, owner = sen
3. LOCK     status → "in_progress", "lockedBy": "<agent>@<sana>" — commit + push (boshqalar ko'radi)
4. READ     PRD.md tegishli FR, AGENTS.md, CLAUDE.md, CONTRIBUTING-agents.md
5. BUILD    faqat "files" ichida ishlash. Doiradan tashqari narsa topsang → progress.md "Topildi" bo'limiga yoz, tuzatma
6. VERIFY   bash scripts/reels-factory/verify.sh  (+ vazifaning o'z "verify" buyrug'i)
7. EVIDENCE feature_list.json: status → "review", "evidence": "<buyruq → natija, commit sha>"
8. HANDOFF  progress.md tepasiga yozuv; PR ochiladi (draft emas), sarlavha: "[F-id] ..."
9. REVIEW   boshqa agent review qiladi (Codex yozganini Claude, Claude yozganini Codex)
10. DONE    review o'tdi + CI yashil → status "done". Faqat shunda.
```

**Qizil chiziqlar** (hech bir agent buzmaydi):
- Verify o'tmasa, "done" yozilmaydi. Muvaffaqiyatsiz natija ham `evidence`ga yoziladi.
- Bir vaqtda bitta agentda faqat bitta `in_progress` vazifa bo'ladi.
- Boshqa agent qulflagan (`lockedBy`) faylga tegilmaydi. 24 soat yangilanmagan qulf "stale" hisoblanadi va progress.md'da aytib olinadi.
- Tashqi xizmatga (Telegram, Postiz, Instagram) haqiqiy so'rov faqat egasi ruxsat bergandan keyin yuboriladi. Ungacha `MOCK_*=true`.
- Sanity'ga faqat draft yoziladi, publish qilinmaydi (AGENTS.md: Human-in-the-loop).
- Fakt to'qilmaydi. Ma'lumot yo'q bo'lsa, "mavjud emas" deb yoziladi.

## Har bir agentni ishga tushirish

Barcha agentlar bir xil prompt bilan ishga tushiriladi, faqat `<AGENT>` o'zgaradi:

> Sen `<AGENT>`san. `docs/reels-factory/LOOP.md` ni o'qi va tsiklni bir marta to'liq bajar:
> o'zingga tegishli keyingi vazifani ol, qulfla, bajar, `scripts/reels-factory/verify.sh`
> bilan tekshir, dalil yoz, PR och. Bajaradigan vazifa yo'q bo'lsa, sababini progress.md'ga yoz va to'xta.

- **Claude Code:** repoda shu promptni yozing. `/loop` bilan doimiy aylanishga qo'yish mumkin.
- **Codex:** ChatGPT Codex → repo → shu prompt. Yoki PR izohida `@codex` + prompt.
  Joriy topshiriq: [briefs/codex-F02-F03-F06.md](briefs/codex-F02-F03-F06.md).
- **Antigravity:** workspace'da repo ochiladi, Agent Manager'ga shu prompt beriladi.

## Konflikt bo'lsa

1. Ikki agent bir vazifani olgan bo'lsa, `lockedBy` vaqti oldin bo'lgani yutadi. Ikkinchisi to'xtaydi va progress.md'ga yozadi.
2. Spec noaniq bo'lsa, taxmin qilinmaydi. Savol `PRD.md §10` ga qo'shiladi va vazifa `blocked` holatiga o'tadi.
