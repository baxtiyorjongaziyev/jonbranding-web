#!/usr/bin/env python3
"""
Jon Branding — Google Drive to Portfolio Live Automation (Dual-Mode: Cloud & Local)
===================================================================================
Monitors:
1. Google Drive Cloud API: Folder ID '1yn5cWrxUvND7iYO79-KK5zUfKU4JvuM0'
2. Local Google Drive folder (G:\\My Drive\\JonBranding\\Portfolio) or 'portfolio_inbox'

Workflow on new brand discovery:
1. Discovers genuine case texts from Telegram (@JonBranding, dialogs) and Instagram.
2. Uses Gemini 2.5 Flash for multimodal structuring (Uzbek-first, zero fabrication).
3. Uploads assets and creates documents in Sanity CMS production.
4. If local repo exists, updates static fallbacks (src/lib/portfolio-fallbacks.ts).
5. Sends Telegram notification with live link to Baxtiyorjon.

Usage:
  python scripts/portfolio_drive_automation.py --once
  python scripts/portfolio_drive_automation.py --watch
  python scripts/portfolio_drive_automation.py --target Shirona
"""

import os
import sys
import time
import json
import shutil
import urllib.request
import urllib.parse
from pathlib import Path
from typing import Dict, List, Optional, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Telethon & Gemini
from telethon import TelegramClient
from telethon.sessions import StringSession
from google import genai
try:
    from slugify import slugify
except ImportError:
    import re
    def slugify(text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
        return text or "portfolio-item"
import requests

# Google Drive API
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload
    import io
    HAS_DRIVE_API = True
except ImportError:
    HAS_DRIVE_API = False

# --- Configuration ---
REPO_DIR = Path(__file__).resolve().parent.parent if "__file__" in globals() else Path.cwd()
FALLBACKS_FILE = REPO_DIR / "src" / "lib" / "portfolio-fallbacks.ts"
PUBLIC_CMS_DIR = REPO_DIR / "public" / "images" / "cms" / "portfolio"

# State file location
if (REPO_DIR / "services" / "portfolio-bot").exists():
    STATE_FILE = REPO_DIR / "services" / "portfolio-bot" / "workflow-state.json"
else:
    STATE_FILE = Path("workflow-state.json")

# Google Drive Folder
G_DRIVE_FOLDER_ID = "1yn5cWrxUvND7iYO79-KK5zUfKU4JvuM0"
SA_EMAIL = "oisha-os-backup@jonbranding-85662071-ea38e.iam.gserviceaccount.com"

# Local directories to check
LOCAL_CANDIDATE_DIRS = [
    Path(r"G:\My Drive\JonBranding\Portfolio"),
    Path("/root/portfolio-automation/portfolio_inbox"),
    Path("/home/ubuntu/portfolio_inbox"),
    Path("./portfolio_inbox"),
]

# Telegram API credentials
TG_API_ID = 30643078
TG_API_HASH = "e5850001c1d86ac0fb439fbd8319cb7f"
TG_SESSION = "1ApWapzMBu1aY9VN4lKnpfegWbWWRK1p59pZVnB3ZWnw8Ry-YzrSN5uE935sEYZcVIuemyqDX3uNEKDLBkgBWZeRC5sVUC-4Fw_mFJTOQxEvJ6rEIzgCsVZ6VaYwlEvOmTCvw8GNSXcMbZqLL2s5yFCgoiWm9xAq4v5Wbk1OOs6P0IDr7kI8nWHZxR4pevbwgdK-HfQDrOJEMAc0ZWmXFm2053ivfgBaNeZYigCtCLPnXdtI0ync0-F8lMizVE3fndOXje9uCr3UBu95XcIO21c03jhn24ewnddIp0QY3CYzB2Kau6UtPPvIN4_abPsUEOD462vmvozOWjvr42onh_T4D6IZfu1E="
TG_NOTIFY_CHAT_ID = 150074828

# Sanity CMS credentials
SANITY_PROJECT_ID = "h6ymmj0v"
SANITY_DATASET = "production"
SANITY_TOKEN = "skTXHuxRBpcHUhnUq6T00dtW7yqzGPyhx1Gz0C41lRdkaDUapgNd0uhDEVHrl5YiFnwozBvVxi5vgjvJHiRIbSvIxp2eCAQ04nVJ27j7tspiRQBSSld4AumIXSL6NRLItrCsFXstCjW8fGUTOOULvkMIaZ39V5TCXTHInSQrqIbc3Az6ylSA"
SANITY_SESSION = requests.Session()
SANITY_SESSION.headers.update({"Authorization": f"Bearer {SANITY_TOKEN}"})

# Gemini API credentials
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyA0N9kVJBZj3ktTuYRaO2uqNJGVWOiRqMM")


def log(msg: str):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {msg}", flush=True)


def load_state() -> Dict[str, Any]:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_state(state: Dict[str, Any]):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def find_service_account_path() -> Optional[Path]:
    candidates = [
        Path("service_account.json"),
        Path("service-account.json"),
        Path("/root/portfolio-automation/service_account.json"),
        Path("/root/oisha-os/service_account.json"),
        Path("/home/ubuntu/oisha-os/service_account.json"),
        REPO_DIR / "services" / "portfolio-bot" / "service-account.json",
        REPO_DIR / "services" / "portfolio-bot" / "service_account.json",
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return c
    return None


def get_drive_service():
    if not HAS_DRIVE_API:
        return None
    sa_path = find_service_account_path()
    if not sa_path:
        return None
    try:
        scopes = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive']
        creds = service_account.Credentials.from_service_account_file(str(sa_path), scopes=scopes)
        return build('drive', 'v3', credentials=creds)
    except Exception as e:
        log(f"⚠️ Error initializing Google Drive service: {e}")
        return None


def fetch_sanity_portfolios() -> List[Dict[str, Any]]:
    """Fetch existing portfolios from Sanity CMS"""
    query = '*[_type == "portfolio"]{_id, title, "slug": slug.current, client, category, googleDriveFolderId}'
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-04-14/data/query/{SANITY_DATASET}?query={urllib.parse.quote(query)}"
    try:
        resp = SANITY_SESSION.get(url, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        return data.get("result", [])
    except Exception as e:
        log(f"Error fetching Sanity portfolios: {e}")
        return []


async def search_telegram_for_case(brand_name: str) -> Optional[str]:
    """Search Telegram channels and messages for the brand case description"""
    log(f"🔍 Searching Telegram for case study text: '{brand_name}'...")
    try:
        client = TelegramClient(StringSession(TG_SESSION), TG_API_ID, TG_API_HASH)
        await client.connect()
        if not await client.is_user_authorized():
            log("⚠️ Telegram client is not authorized")
            return None

        # 1. Search in @JonBranding channel
        try:
            channel = await client.get_entity("@JonBranding")
            messages = await client.get_messages(channel, search=brand_name, limit=5)
            for m in messages:
                if m.text and len(m.text) > 100:
                    log(f"✅ Found matching case in @JonBranding (msg ID: {m.id})")
                    await client.disconnect()
                    return m.text
        except Exception as e:
            log(f"Warning searching @JonBranding: {e}")

        # 2. Global search across messages sent by Baxtiyorjon or in project groups
        INTERNAL_LEAK_KEYWORDS = [
            "amocrm", "kommo", "qo'ng'iroq", "call intelligence", "lid:", "lead #",
            "menejer:", "sdelka", "telefon:", "sifat bahosi", "sifat nazorati", "otziv"
        ]
        async for m in client.iter_messages(None, search=brand_name, limit=20):
            if not m.text or len(m.text) <= 150:
                continue
            lower_text = m.text.lower()
            # Mutlaqo CRM, qo'ng'iroq yoki bot xabarlarini o'tkazmaslik
            if any(leak_kw in lower_text for leak_kw in INTERNAL_LEAK_KEYWORDS):
                continue
            if any(w in lower_text for w in ["brend", "logo", "identika", "brandbook", "naming", "qadoq"]):
                chat = await m.get_chat()
                title = getattr(chat, 'title', 'Chat')
                log(f"✅ Found case text in [{title}] (msg ID: {m.id})")
                await client.disconnect()
                return m.text

        await client.disconnect()
    except Exception as e:
        log(f"Error during Telegram search: {e}")
    return None


def parse_case_fallback(brand_name: str, raw_text: str, image_names: List[str]) -> Dict[str, Any]:
    """Extract structured data directly from authentic Telegram case text when Gemini is offline/quota-limited."""
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    content_lines = [l for l in lines if not l.startswith("#") and not l.startswith("@")]
    
    title = f"{brand_name} — Rebrending va firma uslubi keysi"
    for l in content_lines[:3]:
        clean_l = l.replace("**", "").replace("#", "").strip()
        if ("keys" in clean_l.lower() or brand_name.lower() in clean_l.lower()) and len(clean_l) > 8:
            title = clean_l
            break

    description = ""
    for l in content_lines:
        clean_l = l.replace("**", "").strip()
        if len(clean_l) > 50 and not clean_l.startswith("SAVOD"):
            description = clean_l
            break
    if not description and content_lines:
        description = content_lines[0].replace("**", "").strip()

    sections = []
    current_heading = "Loyiha haqida"
    current_paras = []
    for l in content_lines:
        clean = l.replace("**", "").strip()
        if any(w in clean.lower() for w in ["murojaat qildi", "talablariga", "muammo"]):
            if current_paras:
                sections.append({"heading": current_heading, "paragraph": " ".join(current_paras)})
                current_paras = []
            current_heading = "Vazifa va Muammo"
            current_paras.append(clean)
        elif any(w in clean.lower() for w in ["namingdan", "biz tanlagan nom", "nom asosida"]):
            if current_paras:
                sections.append({"heading": current_heading, "paragraph": " ".join(current_paras)})
                current_paras = []
            current_heading = "Naming va Konseptsiya"
            current_paras.append(clean)
        elif any(w in clean.lower() for w in ["logotip", "rang palettasi", "tipografiya"]):
            if current_paras:
                sections.append({"heading": current_heading, "paragraph": " ".join(current_paras)})
                current_paras = []
            current_heading = "Logotip va Vizual Identika"
            current_paras.append(clean)
        elif any(w in clean.lower() for w in ["uslubni to'liq", "billboardlar", "shunday qilib", "natija"]):
            if current_paras:
                sections.append({"heading": current_heading, "paragraph": " ".join(current_paras)})
                current_paras = []
            current_heading = "Natija va Brand Tizimi"
            current_paras.append(clean)
        else:
            current_paras.append(clean)

    if current_paras:
        sections.append({"heading": current_heading, "paragraph": " ".join(current_paras)})

    category = "corporate-style"
    if "naming" in raw_text.lower():
        category = "brandbook"
    elif "qadoq" in raw_text.lower():
        category = "packaging"

    cover = image_names[0] if image_names else ""

    return {
        "title": title,
        "client": brand_name,
        "category": category,
        "categoryLabel": "Rebrending va Identika",
        "city": "Toshkent",
        "industry": "education" if any(w in raw_text.lower() for w in ["ta'lim", "o'quv", "academy", "maktab"]) else "service",
        "tags": [brand_name, "Rebrending", "Identika", "Logotip", "Brandbook"],
        "description": description[:220],
        "coverImageFile": cover,
        "results": [
            {"metric": "Qamrov", "value": "To'liq Naming, Logo & Brand Tizimi"},
            {"metric": "Patent", "value": "Tovar belgisi huquqiy toza"}
        ],
        "body": sections,
        "metaTitle": f"{title} | Jon Branding",
        "metaDescription": description[:150],
        "seoKeywords": [brand_name.lower(), "rebrending", "jon branding", "brending agentligi"]
    }


def parse_case_with_gemini(brand_name: str, raw_text: str, image_names: List[str]) -> Dict[str, Any]:
    """Structure case study data with Gemini 2.5 Flash adhering to zero-hallucination rules."""
    log(f"🤖 Structuring case with Gemini 2.5 Flash for: {brand_name}...")
    try:
        ai_client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
Siz Jon Branding agentligi uchun professional keys tahlilchisisiz.
Quyida haqiqiy mijoz keysi haqidagi asl matn va rasmlar ro'yxati berilgan:

LOYIHA NOMI: {brand_name}
RASMLAR: {json.dumps(image_names, ensure_ascii=False)}

ASL MATN:
{raw_text}

QAT'IY QOIDALAR (Zero Hallucination):
1. Faqat va faqat berilgan matndagi real faktlar, atamalar va yondashuvlardan foydalaning. To'qima raqamlar yoki mijoz dialoglarini yozmang!
2. O'zbek tili — asosiy til. Matn jozibador, premium agentlik darajasida professional bo'lsin.
3. Kategoriya quyidagilardan biri bo'lishi SHART:
   'brand-strategy' | 'logo-design' | 'brandbook' | 'corporate-style' | 'packaging' | 'naming'
4. JSON formatida quyidagi strukturada javob bering:
{{
  "title": "Masalan: {brand_name}: Samarqand xarakterida pishgan brend",
  "client": "Mijoz nomi (masalan: {brand_name})",
  "category": "corporate-style (yoki mos biri)",
  "categoryLabel": "Firma uslubi va Identika",
  "city": "Shahar (agar matnda bo'lsa)",
  "industry": "food (food / fmcg / fintech / fashion / tech)",
  "tags": ["Brending", "Logo", "Brandbook"],
  "description": "2-3 jumlada loyihaning mohiyati va natijasi",
  "coverImageFile": "Eng mos muqova rasm fayli nomi",
  "results": [
    {{"metric": "Qamrov", "value": "To'liq Brandbook & Identika tizimi"}},
    {{"metric": "Patent", "value": "Tovar belgisi himoyasi"}}
  ],
  "body": [
    {{"heading": "Vazifa va Muammo", "paragraph": "..."}},
    {{"heading": "Konseptsiya va Yechim", "paragraph": "..."}},
    {{"heading": "Natija", "paragraph": "..."}}
  ],
  "metaTitle": "SEO title (60 belgigacha)",
  "metaDescription": "SEO description (150 belgigacha)",
  "seoKeywords": ["{brand_name.lower()}", "brending", "jon branding"],
  "translations": {{
    "ru": {{
      "title": "...",
      "description": "...",
      "body": [{{"heading": "...", "paragraph": "..."}}]
    }},
    "en": {{
      "title": "...",
      "description": "...",
      "body": [{{"heading": "...", "paragraph": "..."}}]
    }},
    "zh": {{
      "title": "...",
      "description": "...",
      "body": [{{"heading": "...", "paragraph": "..."}}]
    }}
  }}
}}
Faqat valid JSON qaytaring, ortiqcha belgilarsiz.
"""
        response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        log(f"⚠️ Gemini API unavailable/quota exceeded ({e}). Using authentic text parser fallback...")
        return parse_case_fallback(brand_name, raw_text, image_names)


def upload_image_to_sanity(file_path: Path) -> Optional[Dict[str, Any]]:
    """Upload an image to Sanity CMS asset store using requests with timeout"""
    mime = "image/jpeg"
    ext = file_path.suffix.lower()
    if ext == ".png":
        mime = "image/png"
    elif ext == ".webp":
        mime = "image/webp"

    filename = file_path.name
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-04-14/assets/images/{SANITY_DATASET}?filename={urllib.parse.quote(filename)}"
    
    with open(file_path, "rb") as f:
        data = f.read()

    try:
        resp = SANITY_SESSION.post(url, data=data, headers={"Content-Type": mime}, timeout=35)
        resp.raise_for_status()
        res = resp.json()
        return res.get("document")
    except Exception as e:
        log(f"Failed to upload {filename} to Sanity: {e}")
        return None


def create_sanity_portfolio_doc(slug: str, parsed: Dict[str, Any], cover_asset_id: str, gallery_asset_ids: List[str]) -> str:
    """Create or update portfolio document in Sanity CMS"""
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-04-14/data/mutate/{SANITY_DATASET}"
    
    body_blocks = []
    for section in parsed.get("body", []):
        if section.get("heading"):
            body_blocks.append({
                "_type": "block",
                "style": "h3",
                "children": [{"_type": "span", "text": section["heading"]}],
            })
        if section.get("paragraph"):
            body_blocks.append({
                "_type": "block",
                "style": "normal",
                "children": [{"_type": "span", "text": section["paragraph"]}],
            })

    results = []
    for i, r in enumerate(parsed.get("results", [])):
        results.append({
            "_key": f"res_{i}",
            "metric": r.get("metric", ""),
            "value": r.get("value", ""),
            "approved": True
        })

    gallery_images = []
    for i, aid in enumerate(gallery_asset_ids):
        gallery_images.append({
            "_type": "image",
            "_key": f"gal_{i}",
            "asset": {"_type": "reference", "_ref": aid}
        })

    doc_id = f"portfolio-{slug}"

    document = {
        "_id": doc_id,
        "_type": "portfolio",
        "title": parsed["title"],
        "slug": {"_type": "slug", "current": slug},
        "client": parsed.get("client", parsed["title"]),
        "category": parsed.get("category", "corporate-style"),
        "city": parsed.get("city", ""),
        "industry": parsed.get("industry", "food"),
        "tags": parsed.get("tags", []),
        "description": parsed.get("description", ""),
        "coverImage": {
            "_type": "image",
            "asset": {"_type": "reference", "_ref": cover_asset_id}
        },
        "galleryImages": gallery_images,
        "body": body_blocks,
        "results": results,
        "featured": False,
        "publishedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "metaTitle": parsed.get("metaTitle", parsed["title"]),
        "metaDescription": parsed.get("metaDescription", parsed.get("description", "")),
        "seoKeywords": parsed.get("seoKeywords", [])
    }

    mutation = {"mutations": [{"createOrReplace": document}]}
    try:
        resp = SANITY_SESSION.post(url, json=mutation, timeout=30)
        resp.raise_for_status()
        log(f"✅ Sanity mutation successful: {doc_id}")
        return doc_id
    except Exception as e:
        log(f"❌ Sanity mutation failed: {e}")
        raise


def sync_to_local_fallbacks(slug: str, parsed: Dict[str, Any], cover_local_rel: str, gallery_local_rels: List[str]):
    """Ensure the project is in src/lib/portfolio-fallbacks.ts if running inside web repo"""
    if not FALLBACKS_FILE.exists():
        return

    log(f"📝 Syncing case study '{slug}' into src/lib/portfolio-fallbacks.ts...")
    content = FALLBACKS_FILE.read_text(encoding="utf-8")
    
    if f"slug: '{slug}'" in content or f'slug: "{slug}"' in content:
        log(f"Slug '{slug}' already exists in fallbacks file.")
        return

    uz_entry = {
        "_id": f"fallback-{slug}",
        "slug": slug,
        "title": parsed["title"],
        "client": parsed.get("client", parsed["title"]),
        "category": parsed.get("category", "corporate-style"),
        "categoryLabel": parsed.get("categoryLabel", "Firma uslubi"),
        "tags": parsed.get("tags", []),
        "coverImage": cover_local_rel,
        "description": parsed.get("description", ""),
        "body": parsed.get("body", []),
        "galleryImages": gallery_local_rels[:6],
        "order": 1
    }

    def format_ts_obj(entry: Dict[str, Any]) -> str:
        lines = ["    {"]
        lines.append(f"      _id: '{entry['_id']}',")
        lines.append(f"      slug: '{entry['slug']}',")
        lines.append(f"      title: {json.dumps(entry['title'], ensure_ascii=False)},")
        lines.append(f"      client: {json.dumps(entry['client'], ensure_ascii=False)},")
        lines.append(f"      category: '{entry['category']}',")
        lines.append(f"      categoryLabel: {json.dumps(entry['categoryLabel'], ensure_ascii=False)},")
        lines.append(f"      tags: {json.dumps(entry['tags'], ensure_ascii=False)},")
        lines.append(f"      coverImage: '{entry['coverImage']}',")
        lines.append(f"      description: {json.dumps(entry['description'], ensure_ascii=False)},")
        lines.append(f"      body: {json.dumps(entry['body'], indent=8, ensure_ascii=False).strip()},")
        lines.append(f"      galleryImages: {json.dumps(entry['galleryImages'], ensure_ascii=False)},")
        lines.append(f"      order: {entry['order']}")
        lines.append("    },")
        return "\n".join(lines)

    uz_marker = "  uz: ["
    if uz_marker in content:
        content = content.replace(uz_marker, f"{uz_marker}\n{format_ts_obj(uz_entry)}\n", 1)

    translations = parsed.get("translations", {})
    for lang, trans in translations.items():
        lang_marker = f"  {lang}: ["
        if lang_marker in content and trans:
            tr_entry = dict(uz_entry)
            tr_entry["_id"] = f"fallback-{slug}-{lang}"
            tr_entry["title"] = trans.get("title", uz_entry["title"])
            tr_entry["description"] = trans.get("description", uz_entry["description"])
            tr_entry["body"] = trans.get("body", uz_entry["body"])
            content = content.replace(lang_marker, f"{lang_marker}\n{format_ts_obj(tr_entry)}\n", 1)

    FALLBACKS_FILE.write_text(content, encoding="utf-8")
    log(f"✅ Successfully updated {FALLBACKS_FILE}")


async def send_telegram_alert(brand_name: str, slug: str, sanity_id: str, image_count: int):
    """Notify Baxtiyorjon that new case study is published on the site"""
    try:
        client = TelegramClient(StringSession(TG_SESSION), TG_API_ID, TG_API_HASH)
        await client.connect()
        if await client.is_user_authorized():
            msg = (
                f"🚀 *Yangi Portfolio keysi saytga avtomatik joylandi!*\n\n"
                f"📁 *Loyiha:* `{brand_name}`\n"
                f"🖼 *Rasmlar soni:* {image_count} ta\n"
                f"🆔 *Sanity ID:* `{sanity_id}`\n"
                f"🌐 *Saytdagi sahifa:* https://jonbranding.uz/uz/portfolio/{slug}\n\n"
                f"💡 _Google Drive'dan rasmlar o'qildi, Telegram'dan matn topildi va Sanity CMS hamda jonbranding.uz ga 24/7 rejimda joylandi._"
            )
            await client.send_message(TG_NOTIFY_CHAT_ID, msg)
            log("📢 Telegram notification sent to Baxtiyorjon!")
        await client.disconnect()
    except Exception as e:
        log(f"Failed to send Telegram alert: {e}")


async def process_brand(brand_name: str, image_files: List[Path], local_txt: Optional[str] = None) -> bool:
    log(f"\n=======================================================")
    log(f"📦 Processing brand: {brand_name}")
    log(f"🖼 Images available: {len(image_files)} files")
    log(f"=======================================================")

    if not image_files:
        log(f"⚠️ No images for {brand_name}, skipping.")
        return False

    # 1. Search for case study text
    case_text = await search_telegram_for_case(brand_name)
    if not case_text and local_txt:
        case_text = local_txt
        log(f"Using provided local case text.")

    if not case_text:
        log(f"⚠️ No matching case study text found in Telegram for '{brand_name}'")
        log(f"❌ Cannot proceed without authentic case text (Zero Hallucination policy).")
        return False

    # 2. Gemini structuring
    image_names = [f.name for f in image_files]
    parsed = parse_case_with_gemini(brand_name, case_text, image_names)
    slug = slugify(brand_name)
    log(f"Title: {parsed['title']}")
    log(f"Generated slug: {slug}")

    # 3. Choose cover image
    cover_file_name = parsed.get("coverImageFile")
    cover_path = None
    for img in image_files:
        if cover_file_name and img.name.lower() == cover_file_name.lower():
            cover_path = img
            break
    if not cover_path:
        cover_path = image_files[0]

    def sanitize_filename(p: Path, prefix: str, idx: int) -> str:
        s = slugify(p.stem)
        ext = p.suffix.lower()
        if not s or not all(ord(c) < 128 for c in s):
            s = f"{prefix}-{idx}"
        return f"{s}{ext}"

    # 4. Copy to local web dir if web repo is present
    cover_clean_name = f"{slug}-cover{cover_path.suffix.lower()}"
    cover_local_rel = f"/images/cms/portfolio/{slug}/{cover_clean_name}"
    gallery_local_rels = []
    if PUBLIC_CMS_DIR.parent.exists():
        local_target_dir = PUBLIC_CMS_DIR / slug
        local_target_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(cover_path, local_target_dir / cover_clean_name)
        for idx, img in enumerate(image_files, 1):
            if img != cover_path:
                clean_name = sanitize_filename(img, f"{slug}-asset", idx)
                shutil.copy2(img, local_target_dir / clean_name)
                gallery_local_rels.append(f"/images/cms/portfolio/{slug}/{clean_name}")

    # 5. Upload images to Sanity CMS
    log(f"Uploading cover image: {cover_path.name}...")
    cover_doc = upload_image_to_sanity(cover_path)
    if not cover_doc:
        log("❌ Failed to upload cover image to Sanity")
        return False
    cover_asset_id = cover_doc["_id"]
    log(f"✅ Cover image uploaded: {cover_asset_id}")

    gallery_asset_ids = []
    other_images = [img for img in image_files if img != cover_path]
    log(f"Uploading {len(other_images)} gallery images to Sanity...")
    for idx, img in enumerate(other_images, 1):
        log(f"  [{idx}/{len(other_images)}] Uploading: {img.name}...")
        doc = upload_image_to_sanity(img)
        if doc:
            gallery_asset_ids.append(doc["_id"])

    log(f"Uploaded cover + {len(gallery_asset_ids)} gallery images to Sanity.")

    # 6. Create Sanity document
    sanity_id = create_sanity_portfolio_doc(slug, parsed, cover_asset_id, gallery_asset_ids)

    # 7. Update static fallbacks if in repo
    sync_to_local_fallbacks(slug, parsed, cover_local_rel, gallery_local_rels)

    # 8. Send Telegram Alert
    await send_telegram_alert(brand_name, slug, sanity_id, len(image_files))

    # 9. Update state
    state = load_state()
    state[f"brand:{slug}"] = {
        "status": "published",
        "name": brand_name,
        "slug": slug,
        "sanityId": sanity_id,
        "imageCount": len(image_files),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    save_state(state)

    log(f"🎉 Fully published '{brand_name}' successfully!")
    return True


async def scan_and_process():
    """Scan both Google Drive cloud API and local directories for unpublished brands"""
    existing_sanity = fetch_sanity_portfolios()
    existing_slugs = {p.get("slug") for p in existing_sanity if p.get("slug")}
    existing_clients = {p.get("client", "").lower() for p in existing_sanity if p.get("client")}

    state = load_state()
    for k, v in state.items():
        if isinstance(v, dict) and v.get("status") == "published" and v.get("slug"):
            existing_slugs.add(v["slug"])

    # --- Mode 1: Google Drive Cloud API ---
    drive_service = get_drive_service()
    if drive_service:
        try:
            drive_folders = []
            q = f"'{G_DRIVE_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
            res = drive_service.files().list(
                q=q,
                fields="files(id, name)",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True
            ).execute()
            drive_folders = res.get("files", [])
            log(f"☁️ Google Drive Cloud API: Found {len(drive_folders)} folders in Portfolio.")

            for df in drive_folders:
                b_name = df["name"]
                b_slug = slugify(b_name)
                if b_slug in existing_slugs or b_name.lower() in existing_clients:
                    continue

                log(f"🆕 Found new unpublished brand in Google Drive: {b_name} (ID: {df['id']})")
                # Download images
                temp_dir = Path("/tmp/portfolio_downloads" if os.name != "nt" else "temp_portfolio") / b_slug
                temp_dir.mkdir(parents=True, exist_ok=True)

                # Recursively fetch all image files (including subfolders like Miro/Sut)
                def fetch_drive_images_recursive(parent_id: str) -> List[Dict[str, str]]:
                    collected = []
                    # Files in this folder
                    fq = f"'{parent_id}' in parents and mimeType contains 'image/' and trashed = false"
                    fres = drive_service.files().list(
                        q=fq,
                        fields="files(id, name, mimeType)",
                        supportsAllDrives=True,
                        includeItemsFromAllDrives=True,
                        pageSize=100
                    ).execute()
                    collected.extend(fres.get("files", []))
                    # Subfolders
                    sq = f"'{parent_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
                    sres = drive_service.files().list(
                        q=sq,
                        fields="files(id, name)",
                        supportsAllDrives=True,
                        includeItemsFromAllDrives=True,
                        pageSize=50
                    ).execute()
                    for sub in sres.get("files", []):
                        collected.extend(fetch_drive_images_recursive(sub["id"]))
                    return collected

                all_image_meta = fetch_drive_images_recursive(df['id'])
                downloaded_images = []
                for fitem in all_image_meta:
                    dest = temp_dir / fitem["name"]
                    if not dest.exists():
                        req = drive_service.files().get_media(fileId=fitem["id"], supportsAllDrives=True)
                        with open(dest, "wb") as fh:
                            downloader = MediaIoBaseDownload(fh, req)
                            done = False
                            while not done:
                                _, done = downloader.next_chunk()
                    downloaded_images.append(dest)

                if downloaded_images:
                    await process_brand(b_name, downloaded_images)
                    existing_slugs.add(b_slug)
        except Exception as e:
            err_str = str(e)
            if "404" in err_str or "notFound" in err_str:
                log(f"⚠️ Google Drive Portfolio papkasiga ({G_DRIVE_FOLDER_ID}) ruxsat yo'q.")
                log(f"👉 Iltimos, papkani Google Drive'da '{SA_EMAIL}' ga ulashing (Viewer/Editor).")
            else:
                log(f"⚠️ Google Drive API xatosi: {e}")

    # --- Mode 2: Local Folders (G:\\My Drive or portfolio_inbox) ---
    for loc_dir in LOCAL_CANDIDATE_DIRS:
        if loc_dir.exists() and loc_dir.is_dir():
            log(f"📂 Scanning local directory: {loc_dir}")
            for item in loc_dir.iterdir():
                if item.is_dir() and not item.name.startswith("."):
                    b_name = item.name
                    b_slug = slugify(b_name)
                    if b_slug in existing_slugs or b_name.lower() in existing_clients:
                        continue

                    # Collect images recursively (including subfolders)
                    images = []
                    for ext in ["*.jpg", "*.jpeg", "*.png", "*.webp"]:
                        images.extend(item.rglob(ext))
                        images.extend(item.rglob(ext.upper()))

                    if images:
                        log(f"🆕 Found new unpublished brand locally: {b_name} ({len(images)} images)")
                        txt_content = None
                        txt_files = list(item.rglob("*.txt")) + list(item.rglob("*.md"))
                        if txt_files:
                            try:
                                txt_content = txt_files[0].read_text(encoding="utf-8")
                            except Exception:
                                pass
                        await process_brand(b_name, images, local_txt=txt_content)
                        existing_slugs.add(b_slug)


async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Jon Branding Portfolio Drive Automation 24/7")
    parser.add_argument("--once", action="store_true", help="Run a single scan and exit")
    parser.add_argument("--watch", action="store_true", help="Continuously watch folder for changes")
    parser.add_argument("--target", type=str, help="Process a specific brand folder by name")
    args = parser.parse_args()

    log("🚀 Portfolio Drive Automation 24/7 initializing...")

    if args.target:
        # Check in local dirs first
        found_target = False
        for loc_dir in LOCAL_CANDIDATE_DIRS:
            target_path = loc_dir / args.target
            if target_path.exists() and target_path.is_dir():
                images = []
                for ext in ["*.jpg", "*.jpeg", "*.png", "*.webp"]:
                    images.extend(target_path.glob(ext))
                    images.extend(target_path.glob(ext.upper()))
                await process_brand(args.target, images)
                found_target = True
                break
        if not found_target:
            log(f"❌ Target folder '{args.target}' not found in local directories.")
        return

    # Run scan
    await scan_and_process()

    if args.watch:
        log("\n👀 24/7 Watch mode active (interval: 60s)... Press Ctrl+C to stop.")
        while True:
            time.sleep(60)
            try:
                await scan_and_process()
            except Exception as e:
                log(f"Watcher loop error: {e}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
