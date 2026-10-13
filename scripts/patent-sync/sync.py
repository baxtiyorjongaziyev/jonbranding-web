"""
Patent guvohnomalarini Google Drive papkasidan saytga qo'shish.

Drive'dagi `JonBranding/Patent` papkasiga Adliya vazirligining guvohnoma va
ilova PDF'lari tushadi. Skript:

  1. PDF'larni Drive API orqali yuklab oladi (yoki `--src` bilan lokal papkadan o'qiydi).
  2. Har bir guvohnomadan raqam, ega, talabnoma, sanalar va sinflarni o'qiydi.
  3. Ilovadan ro'yxatdan o'tgan belgi tasvirini olib, oq chetlarini kesib,
     `public/images/patent/mgu-XXXXX.webp` ga saqlaydi.
  4. `src/data/patent-certificates.json` ga faqat YANGI guvohnomalarni qo'shadi
     (mavjud yozuvlarga tegmaydi; logosi yo'q yozuvga ilova kelsa — logo qo'shadi).

Git (commit/push) skriptda emas — `.github/workflows/patent-sync.yml` bajaradi.
Maxfiylik: ega to'liq F.I.Sh. bilan saqlanmaydi — "ISM F. O." ko'rinishida.

Drive rejimi (GitHub Actions):
    GDRIVE_SERVICE_ACCOUNT_JSON='{...}' GDRIVE_FOLDER_ID=... python scripts/patent-sync/sync.py
Lokal papka:
    python scripts/patent-sync/sync.py --src "G:\\My Drive\\JonBranding\\Patent"

Natija: o'zgarish bo'lsa `$GITHUB_OUTPUT` ga `changed=true` va `summary=...` yoziladi.
Talablar: `pip install -r scripts/patent-sync/requirements.txt`.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import tempfile
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "src/data/patent-certificates.json"
IMAGES = REPO / "public/images/patent"

# Nitstsa tasnifi (MKTU) — sohani birinchi sinfdan aniqlash uchun qisqa nomlar.
NICE = {
    1: "Kimyo", 2: "Bo‘yoqlar", 3: "Kosmetika", 4: "Moylar va yoqilg‘i", 5: "Farmatsevtika",
    6: "Metall buyumlar", 7: "Mashinasozlik", 8: "Asboblar", 9: "Elektronika", 10: "Tibbiy jihozlar",
    11: "Isitish va yoritish", 12: "Transport", 13: "Pirotexnika", 14: "Zargarlik", 15: "Musiqa asboblari",
    16: "Poligrafiya", 17: "Rezina va plastmassa", 18: "Charm buyumlar", 19: "Qurilish materiallari",
    20: "Mebel", 21: "Uy-ro‘zg‘or buyumlari", 22: "To‘qimachilik xomashyosi", 23: "Iplar",
    24: "To‘qimachilik", 25: "Kiyim va poyabzal", 26: "Galantereya", 27: "Gilam va qoplamalar",
    28: "O‘yinchoqlar va sport", 29: "Oziq-ovqat", 30: "Oziq-ovqat", 31: "Qishloq xo‘jaligi",
    32: "Ichimliklar", 33: "Alkogolli ichimliklar", 34: "Tamaki", 35: "Savdo va reklama",
    36: "Moliya va ko‘chmas mulk", 37: "Qurilish va ta’mirlash", 38: "Telekommunikatsiya",
    39: "Logistika", 40: "Ishlov berish", 41: "Ta’lim va ko‘ngilochar", 42: "IT va ilmiy xizmatlar",
    43: "Restoran va mehmonxona", 44: "Tibbiyot va go‘zallik", 45: "Yuridik va xavfsizlik",
}


def to_iso(ddmmyyyy: str) -> str:
    d, m, y = ddmmyyyy.split(".")
    return f"{y}-{m}-{d}"


def short_owner(raw: str) -> str:
    """'RAXIMOV UMID NURMAXAMMATOVICH' -> 'UMID R. N.'; tashkilot nomi qisqartiriladi, o'zi qoladi."""
    name = re.sub(r",\s*UZ\s*$", "", raw.strip())
    if re.search(r"MAS.ULIYATI CHEKLANGAN JAMIYAT", name, re.I):
        return re.sub(r"\s*MAS.ULIYATI CHEKLANGAN JAMIYAT", " MCHJ", name, flags=re.I).strip()
    if re.search(r"\b(MCHJ|AJ|XK|QK|OOO|LLC)\b", name):
        return name
    parts = name.split()
    if len(parts) < 2:
        return name
    family, first, *rest = parts
    return f"{first} " + " ".join(f"{p[0]}." for p in [family, *rest[:1]])


def parse_certificate(text: str) -> dict | None:
    head = text[:300]
    if "GUVOHNOMA" not in head or "ILOVA" in head:
        return None
    fields = {
        "number": re.search(r"MGU\s*(\d+)", text),
        "owner": re.search(r"Huquq egasi:\s*(.+)", text),
        "app": re.search(r"Talabnoma raqami:\s*(TB\s*\d+)", text),
        "filed": re.search(r"Talabnoma qabul qilingan sana:\s*(\d{2}\.\d{2}\.\d{4})", text),
        "reg": re.search(r"reestrida\s*(\d{2}\.\d{2}\.\d{4})", text),
        "classes": re.search(r"xizmatlarga doir:\s*([\d,\s]+)", text),
    }
    if not all(fields.values()):
        return None
    cls = [int(c) for c in re.findall(r"\d+", fields["classes"].group(1))]
    number = f"MGU {fields['number'].group(1)}"
    return {
        "number": number,
        "brand": "",
        "owner": short_owner(fields["owner"].group(1)),
        "application": re.sub(r"\s+", " ", fields["app"].group(1)),
        "filed": to_iso(fields["filed"].group(1)),
        "registered": to_iso(fields["reg"].group(1)),
        "classes": cls,
        "industry": NICE.get(cls[0], "Boshqa") if cls else "Boshqa",
        "logo": None,
    }


def mark_image(doc: pymupdf.Document) -> Image.Image | None:
    """Ilovadagi eng katta rasm — ro'yxatdan o'tgan belgi. Oq fondagi chetlar kesiladi."""
    images = doc[0].get_images()
    if not images:
        return None
    best = max(images, key=lambda im: im[2] * im[3])
    if best[2] * best[3] <= 156 * 156:  # faqat QR-kod bor
        return None
    pix = pymupdf.Pixmap(doc, best[0])
    if pix.alpha or pix.n > 3:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    corner = img.getpixel((2, 2))
    if sum(corner) > 700:
        diff = ImageChops.difference(img, Image.new("RGB", img.size, corner)).convert("L").point(lambda p: 255 if p > 18 else 0)
        box = diff.getbbox()
        if box:
            pad = int(max(box[2] - box[0], box[3] - box[1]) * 0.06)
            img = img.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(img.width, box[2] + pad), min(img.height, box[3] + pad)))
    img.thumbnail((900, 900))
    return img


def download_from_drive(folder_id: str, target: Path) -> None:
    """Papkadagi barcha PDF'larni yuklab oladi (faqat o'qish huquqi yetarli)."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload

    info = json.loads(os.environ["GDRIVE_SERVICE_ACCOUNT_JSON"])
    creds = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    drive = build("drive", "v3", credentials=creds, cache_discovery=False)
    query = f"'{folder_id}' in parents and mimeType='application/pdf' and trashed=false"
    token = None
    count = 0
    while True:
        res = drive.files().list(
            q=query, fields="nextPageToken, files(id, name)", pageSize=200, pageToken=token,
            supportsAllDrives=True, includeItemsFromAllDrives=True,
        ).execute()
        for f in res.get("files", []):
            buf = io.FileIO(target / f"{f['id']}.pdf", "wb")
            downloader = MediaIoBaseDownload(buf, drive.files().get_media(fileId=f["id"], supportsAllDrives=True))
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buf.close()
            count += 1
        token = res.get("nextPageToken")
        if not token:
            break
    print(f"Drive: {count} ta PDF yuklandi")


def scan(src: Path) -> tuple[dict[str, dict], dict[str, Image.Image]]:
    certs: dict[str, dict] = {}
    marks: dict[str, Image.Image] = {}
    for pdf in sorted(src.glob("*.pdf")):
        try:
            doc = pymupdf.open(pdf)
            text = doc[0].get_text()
        except Exception as exc:  # buzilgan yoki chala yuklangan fayl — o'tkazib yuboramiz
            print(f"o'qib bo'lmadi: {pdf.name} ({exc})")
            continue
        if "ILOVA" in text[:300]:
            num = re.search(r"MGU\s*(\d+)", text)
            img = mark_image(doc)
            if num and img is not None:
                marks[f"MGU {num.group(1)}"] = img
            continue
        cert = parse_certificate(text)
        if cert:
            certs[cert["number"]] = cert
    return certs, marks


def logo_path(number: str) -> str:
    return f"/images/patent/{number.lower().replace(' ', '-')}.webp"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", help="lokal papka (berilmasa — GDRIVE_FOLDER_ID orqali Drive)")
    ap.add_argument("--dry-run", action="store_true", help="hech narsa yozmaydi, faqat hisobot")
    args = ap.parse_args()

    if args.src:
        src = Path(args.src)
    else:
        folder = os.environ.get("GDRIVE_FOLDER_ID")
        if not folder or "GDRIVE_SERVICE_ACCOUNT_JSON" not in os.environ:
            print("GDRIVE_FOLDER_ID va GDRIVE_SERVICE_ACCOUNT_JSON kerak (yoki --src)")
            return 1
        src = Path(tempfile.mkdtemp(prefix="patent-pdf-"))
        download_from_drive(folder, src)

    current = json.loads(DATA.read_text(encoding="utf-8"))
    by_number = {c["number"]: c for c in current}
    found, marks = scan(src)

    added = [c for n, c in sorted(found.items()) if n not in by_number]
    for c in added:
        c["logo"] = logo_path(c["number"]) if c["number"] in marks else None
    logos = [n for n, c in by_number.items() if c.get("logo") is None and n in marks]

    lines = [
        f"{c['number']} — {c['industry']}, sinflar {', '.join(map(str, c['classes']))}, "
        f"{c['filed']} → {c['registered']}, logo: {'bor' if c['logo'] else 'yo‘q'}"
        for c in added
    ] + [f"{n} — ilova keldi, logo qo'shildi" for n in logos]

    if not lines:
        print(f"Yangi guvohnoma yo'q ({len(found)} ta topildi, hammasi saytda)")
        return 0
    print("\n".join(lines))
    if args.dry_run:
        return 0

    for n in logos:
        by_number[n]["logo"] = logo_path(n)
    DATA.write_text(json.dumps(current + added, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    IMAGES.mkdir(parents=True, exist_ok=True)
    for n in [c["number"] for c in added if c["logo"]] + logos:
        marks[n].save(REPO / "public" / logo_path(n).lstrip("/"), quality=90)

    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write("changed=true\n")
            fh.write("summary<<EOF\n" + "\n".join(f"- {line}" for line in lines) + "\nEOF\n")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")  # Windows konsoli (cp1252) uchun
    sys.exit(main())
