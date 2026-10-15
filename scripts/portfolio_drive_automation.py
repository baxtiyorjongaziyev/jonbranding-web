#!/usr/bin/env python3
"""
Jon Branding — Google Drive to Portfolio Live Automation
=========================================================
Monitors `G:\\My Drive\\JonBranding\\Portfolio` (Google Drive for Desktop).
When new project images/folders are added:
1. Discovers genuine case texts from Telegram (@JonBranding, dialogs) and Instagram.
2. Uses Gemini 2.5 Flash for multimodal structuring (Uzbek-first, zero fabrication).
3. Uploads assets and creates documents in Sanity CMS production.
4. Integrates case into site static fallbacks (src/lib/portfolio-fallbacks.ts) and public/images/cms/.
5. Sends Telegram notification with live link.

Usage:
  python scripts/portfolio_drive_automation.py --once
  python scripts/portfolio_drive_automation.py --watch
  python scripts/portfolio_drive_automation.py --target Shirona
"""

import os
import sys
import glob
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
from slugify import slugify

# --- Configuration ---
PORTFOLIO_DIR = Path(r"G:\My Drive\JonBranding\Portfolio")
REPO_DIR = Path(__file__).resolve().parent.parent
FALLBACKS_FILE = REPO_DIR / "src" / "lib" / "portfolio-fallbacks.ts"
PUBLIC_CMS_DIR = REPO_DIR / "public" / "images" / "cms" / "portfolio"
STATE_FILE = REPO_DIR / "services" / "portfolio-bot" / "workflow-state.json"

# Telegram API credentials
TG_API_ID = 30643078
TG_API_HASH = "e5850001c1d86ac0fb439fbd8319cb7f"
TG_SESSION = "1ApWapzMBu1aY9VN4lKnpfegWbWWRK1p59pZVnB3ZWnw8Ry-YzrSN5uE935sEYZcVIuemyqDX3uNEKDLBkgBWZeRC5sVUC-4Fw_mFJTOQxEvJ6rEIzgCsVZ6VaYwlEvOmTCvw8GNSXcMbZqLL2s5yFCgoiWm9xAq4v5Wbk1OOs6P0IDr7kI8nWHZxR4pevbwgdK-HfQDrOJEMAc0ZWmXFm2053ivfgBaNeZYigCtCLPnXdtI0ync0-F8lMizVE3fndOXje9uCr3UBu95XcIO21c03jhn24ewnddIp0QY3CYzB2Kau6UtPPvIN4_abPsUEOD462vmvozOWjvr42onh_T4D6IZfu1E="
TG_NOTIFY_CHAT_ID = 150074828

# Sanity CMS credentials
SANITY_PROJECT_ID = "h6ymmj0v"
SANITY_DATASET = "production"
SANITY_TOKEN = "skTXHuxRBpcHUhnUq6T00dtW7yqzGPyhx1Gz0C41lRdkaDUapgNd0uhDEVHrl5YiFnwozBvVxi5vgjvJHiRIbSvIxp2eCAQ04nVJ27j7tspiRQBSSld4AumIXSL6NRLItrCsFXstCjW8fGUTOOULvkMIaZ39V5TCXTHInSQrqIbc3Az6ylSA"

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


def fetch_sanity_portfolios() -> List[Dict[str, Any]]:
    """Fetch existing portfolios from Sanity CMS"""
    query = '*[_type == "portfolio"]{_id, title, "slug": slug.current, client, category, googleDriveFolderId}'
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-04-14/data/query/{SANITY_DATASET}?query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {SANITY_TOKEN}"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
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
        async for m in client.iter_messages(None, search=brand_name, limit=15):
            if m.text and len(m.text) > 150:
                # Prioritize structured case texts with headers or hashtags
                if any(w in m.text.lower() for w in ["brend", "logo", "identika", "brandbook", "naming", "qadoq", "patent"]):
                    chat = await m.get_chat()
                    title = getattr(chat, 'title', 'Chat')
                    log(f"✅ Found case text in [{title}] (msg ID: {m.id})")
                    await client.disconnect()
                    return m.text

        await client.disconnect()
    except Exception as e:
        log(f"Error during Telegram search: {e}")
    return None


def parse_case_with_gemini(brand_name: str, raw_text: str, image_names: List[str]) -> Dict[str, Any]:
    """Structure case study data with Gemini 2.5 Flash adhering to zero-hallucination rules."""
    log(f"🤖 Structuring case with Gemini 2.5 Flash for: {brand_name}...")
    ai_client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""
Siz Jon Branding agentligi uchun professional keys tahlilchisisiz.
Quyida haqiqiy mijoz keysi haqidagi asl matn va Google Drive'dagi rasm fayllari ro'yxati berilgan:

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
  "title": "Masalan: Shirona Café & Bakery: Samarqand xarakterida pishgan brend",
  "client": "Mijoz nomi (masalan: Shirona Café & Bakery)",
  "category": "corporate-style (yoki mos biri)",
  "categoryLabel": "Firma uslubi va Identika",
  "city": "Samarqand (agar matnda bo'lsa)",
  "industry": "food (food / fmcg / fintech / fashion)",
  "tags": ["Samarqand", "Kafe", "Qadoq dizayni", "Firma uslubi", "Brandbook", "Patent"],
  "description": "2-3 jumlada loyihaning mohiyati va natijasi",
  "coverImageFile": "Eng mos muqova rasm fayli nomi (masalan: Brandbook_Page_45_Cafe_facade.jpeg yoki Registon rasmi)",
  "results": [
    {{"metric": "Qamrov", "value": "To'liq Brandbook & Identika tizimi"}},
    {{"metric": "Patent", "value": "Tovar belgisi himoyasi"}}
  ],
  "body": [
    {{"heading": "Vazifa va Muammo", "paragraph": "..."}},
    {{"heading": "Konseptsiya va Yechim", "paragraph": "..."}},
    {{"heading": "Natija va Fasad", "paragraph": "..."}}
  ],
  "metaTitle": "SEO title (60 belgigacha)",
  "metaDescription": "SEO description (150 belgigacha)",
  "seoKeywords": ["shirona", "samarqand kafe brending", "jon branding"],
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


import requests

SANITY_SESSION = requests.Session()
SANITY_SESSION.headers.update({"Authorization": f"Bearer {SANITY_TOKEN}"})


def upload_image_to_sanity(file_path: Path) -> Optional[Dict[str, Any]]:
    """Upload an image to Sanity CMS asset store using requests with timeout"""
    mime = "image/jpeg"
    if file_path.suffix.lower() == ".png":
        mime = "image/png"
    elif file_path.suffix.lower() == ".webp":
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
    
    # Body blocks in Sanity Portable Text
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
    """Ensure the project is in src/lib/portfolio-fallbacks.ts for all 4 languages."""
    log(f"📝 Syncing case study '{slug}' into src/lib/portfolio-fallbacks.ts...")
    if not FALLBACKS_FILE.exists():
        log(f"Warning: {FALLBACKS_FILE} not found")
        return

    content = FALLBACKS_FILE.read_text(encoding="utf-8")
    
    # Check if already present in fallbacks
    if f"slug: '{slug}'" in content or f'slug: "{slug}"' in content:
        log(f"Slug '{slug}' already exists in fallbacks file.")
        return

    # Prepare project entry for Uzbek
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

    # Format into TS object
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

    # Insert into FALLBACK_PORTFOLIO.uz
    uz_marker = "  uz: ["
    if uz_marker in content:
        content = content.replace(uz_marker, f"{uz_marker}\n{format_ts_obj(uz_entry)}\n", 1)

    # Also insert for ru, en, zh if translations exist
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
                f"💡 _Google Drive'dan rasmlar o'qildi, Telegram'dan matn topildi va Sanity CMS hamda saytga to'liq ulandi._"
            )
            await client.send_message(TG_NOTIFY_CHAT_ID, msg)
            log("📢 Telegram notification sent to Baxtiyorjon!")
        await client.disconnect()
    except Exception as e:
        log(f"Failed to send Telegram alert: {e}")


async def process_brand_folder(folder_path: Path) -> bool:
    brand_name = folder_path.name
    log(f"\n=======================================================")
    log(f"📦 Processing brand folder: {brand_name}")
    log(f"📁 Path: {folder_path}")
    log(f"=======================================================")

    # 1. Collect images
    image_files_dict = {}
    for ext in ["*.jpg", "*.jpeg", "*.png", "*.webp"]:
        for f in folder_path.glob(ext):
            image_files_dict[f.name.lower()] = f
        for f in folder_path.glob(ext.upper()):
            image_files_dict[f.name.lower()] = f
    image_files = list(image_files_dict.values())

    if not image_files:
        log(f"⚠️ No images found in {folder_path}, skipping.")
        return False

    log(f"Found {len(image_files)} images in folder.")

    # 2. Search for case study text
    case_text = await search_telegram_for_case(brand_name)
    if not case_text:
        log(f"⚠️ No matching case study text found in Telegram for '{brand_name}'")
        # Try finding a text file in folder
        txt_files = list(folder_path.glob("*.txt")) + list(folder_path.glob("*.md"))
        if txt_files:
            case_text = txt_files[0].read_text(encoding="utf-8")
            log(f"Read case text from local file: {txt_files[0].name}")
        else:
            log(f"❌ Cannot proceed without authentic case text (Zero Hallucination policy).")
            return False

    # 3. Gemini analysis
    image_names = [f.name for f in image_files]
    parsed = parse_case_with_gemini(brand_name, case_text, image_names)
    slug = slugify(brand_name)
    log(f"Title: {parsed['title']}")
    log(f"Category: {parsed.get('category')}")
    log(f"Generated slug: {slug}")

    # 4. Copy images to public/images/cms/portfolio/<slug>/
    local_target_dir = PUBLIC_CMS_DIR / slug
    local_target_dir.mkdir(parents=True, exist_ok=True)

    cover_file_name = parsed.get("coverImageFile")
    cover_path = None
    for img in image_files:
        if cover_file_name and img.name.lower() == cover_file_name.lower():
            cover_path = img
            break
    if not cover_path:
        cover_path = image_files[0]

    log(f"Chosen cover image: {cover_path.name}")

    # Copy files
    cover_local_rel = f"/images/cms/portfolio/{slug}/{cover_path.name}"
    shutil.copy2(cover_path, local_target_dir / cover_path.name)

    gallery_local_rels = []
    for img in image_files:
        shutil.copy2(img, local_target_dir / img.name)
        if img != cover_path:
            gallery_local_rels.append(f"/images/cms/portfolio/{slug}/{img.name}")

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

    # 7. Update static fallbacks
    sync_to_local_fallbacks(slug, parsed, cover_local_rel, gallery_local_rels)

    # 8. Send Telegram Alert
    await send_telegram_alert(brand_name, slug, sanity_id, len(image_files))

    # 9. Update state
    state = load_state()
    state[f"drive:{brand_name}"] = {
        "status": "published",
        "slug": slug,
        "sanityId": sanity_id,
        "imageCount": len(image_files),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    save_state(state)

    log(f"🎉 Fully published '{brand_name}' successfully!")
    return True


async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Jon Branding Portfolio Drive Automation")
    parser.add_argument("--once", action="store_true", help="Run a single scan and exit")
    parser.add_argument("--watch", action="store_true", help="Continuously watch folder for changes")
    parser.add_argument("--target", type=str, help="Process a specific brand folder by name")
    args = parser.parse_args()

    log("🚀 Portfolio Drive Automation initializing...")
    if not PORTFOLIO_DIR.exists():
        log(f"❌ Google Drive portfolio folder not found at: {PORTFOLIO_DIR}")
        sys.exit(1)

    log(f"📂 Google Drive Portfolio folder: {PORTFOLIO_DIR}")

    if args.target:
        target_path = PORTFOLIO_DIR / args.target
        if not target_path.exists():
            log(f"❌ Target folder {target_path} not found.")
            sys.exit(1)
        await process_brand_folder(target_path)
        return

    # Check which folders are unpublished
    existing_sanity = fetch_sanity_portfolios()
    existing_slugs = {p.get("slug") for p in existing_sanity if p.get("slug")}
    existing_clients = {p.get("client", "").lower() for p in existing_sanity if p.get("client")}

    folders = [f for f in PORTFOLIO_DIR.iterdir() if f.is_dir()]
    log(f"Found {len(folders)} brand folders in Google Drive:")
    for f in folders:
        slug = slugify(f.name)
        is_published = slug in existing_slugs or f.name.lower() in existing_clients
        status_tag = "✅ PUBLISHED" if is_published else "🆕 UNPUBLISHED"
        log(f" - {f.name:15} -> {status_tag}")

    for folder in folders:
        slug = slugify(folder.name)
        if slug not in existing_slugs and folder.name.lower() not in existing_clients:
            log(f"\nProcessing unpublished folder: {folder.name}")
            try:
                await process_brand_folder(folder)
            except Exception as e:
                log(f"Error processing {folder.name}: {e}")

    if args.watch:
        log("\n👀 Watching for new folders and files (interval: 60s)... Press Ctrl+C to stop.")
        while True:
            time.sleep(60)
            try:
                existing_sanity = fetch_sanity_portfolios()
                existing_slugs = {p.get("slug") for p in existing_sanity if p.get("slug")}
                for folder in PORTFOLIO_DIR.iterdir():
                    if folder.is_dir() and slugify(folder.name) not in existing_slugs:
                        log(f"New folder detected: {folder.name}")
                        await process_brand_folder(folder)
            except Exception as e:
                log(f"Watcher loop error: {e}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
