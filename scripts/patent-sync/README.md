# Patent sync — Google Drive → sayt

Google Drive'dagi `JonBranding/Patent` papkasiga yangi guvohnoma (va uning ilovasi)
tushsa, har kuni soat 09:00 da (Toshkent) GitHub Actions uni saytga qo'shadi:
`/xizmatlar/patent` va `/credentials/patent` dagi ma'lumotnoma kartalari, statistika
va muddatlar ro'yxati avtomatik yangilanadi.

```
Drive papka ──(Drive API, faqat o'qish)──▶ GitHub Actions ──▶ src/data/patent-certificates.json
                                                          └─▶ public/images/patent/mgu-XXXXX.webp
                                           ──▶ typecheck + test ──▶ main ga push ──▶ Vercel deploy
```

## Bir martalik sozlash

1. **Google Cloud** → [console.cloud.google.com](https://console.cloud.google.com) → loyiha tanlang
   (yoki yangi) → *APIs & Services* → **Google Drive API** ni yoqing.
2. *IAM & Admin* → *Service Accounts* → **Create service account** (masalan `patent-sync`).
   Rol berish shart emas.
3. Service account → *Keys* → *Add key* → **JSON** → fayl yuklanadi.
4. Drive'da `JonBranding/Patent` papkasini oching → *Share* → service account email'ini
   (`patent-sync@...iam.gserviceaccount.com`) **Viewer** sifatida qo'shing.
5. Papka ID'si — papka URL'idagi oxirgi qism:
   `https://drive.google.com/drive/folders/<PAPKA_ID>`.
6. GitHub → repo → *Settings* → *Secrets and variables* → *Actions* → **New repository secret**:
   - `GDRIVE_SERVICE_ACCOUNT_JSON` — 3-qadamdagi JSON faylning **to'liq matni**
   - `GDRIVE_FOLDER_ID` — 5-qadamdagi ID
7. *Actions* → **Patent sync (Google Drive)** → *Run workflow* — birinchi sinov.

> JSON kalitni hech qayerga (chat, repo, Telegram) qo'ymang — faqat GitHub Secrets'ga.

## Ishlash qoidalari

- Faqat **yangi** guvohnomalar qo'shiladi; mavjud yozuvlarga tegilmaydi.
  Logosi yo'q yozuvga keyin ilova kelsa — logo qo'shiladi.
- Ega to'liq F.I.Sh. bilan saqlanmaydi: `ISM F. O.` ko'rinishida.
- Soha birinchi sinfdan (Nitstsa tasnifi) aniqlanadi.
- **Brend nomi PDF matnida yo'q** (belgi rasm ko'rinishida). Sayt nomsiz ham to'g'ri
  ishlaydi — kartada logo chiqadi. Nom kerak bo'lsa, `src/data/patent-certificates.json`
  da `brand` ni qo'lda to'ldiring.
- Guvohnoma PDF'i ilovasiz kelsa — karta chiqmaydi, faqat statistikada hisoblanadi.

## Lokal sinov

```bash
pip install -r scripts/patent-sync/requirements.txt
python scripts/patent-sync/sync.py --src "G:/My Drive/JonBranding/Patent" --dry-run
```
