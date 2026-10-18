#!/usr/bin/env python3
"""
Jon Branding — Automated Portfolio Motion Reel Generator (FFmpeg + Pillow)
========================================================================
Generates a cinematic 60fps MP4 motion video from portfolio images.
Includes:
- Branded intro/outro with Jon Branding identity
- Ken Burns pan & zoom motion
- Dynamic blurred background for non-standard aspect ratios
- Lower third branding pill
- Crossfade transitions
- Output: 1080x1920 (9:16 vertical for Reels/Shorts) or 1920x1080 (16:9 web)

Usage:
  python scripts/generate_portfolio_video.py --slug rashmilk --format reel
  python scripts/generate_portfolio_video.py --slug shirona --format reel
"""

import os
import sys
import argparse
import subprocess
import json
import math
from pathlib import Path
from typing import List, Tuple
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_DIR / "public" / "videos" / "portfolio"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Colors
BG_COLOR = (5, 7, 15)  # #05070f
ACCENT_BLUE = (37, 99, 235)  # #2563eb
TEXT_WHITE = (255, 255, 255)
TEXT_MUTED = (156, 163, 175)

def get_font(size: int, bold: bool = False):
    font_names = [
        "arialbd.ttf" if bold else "arial.ttf",
        "seguiemb.ttf" if bold else "segoeui.ttf",
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
    ]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except Exception:
            continue
    return ImageFont.load_default()

def create_title_slide(width: int, height: int, client: str, title: str, category: str) -> Image.Image:
    img = Image.new("RGB", (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Ambient glow in center
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(
        [width//4, height//3, width*3//4, height*2//3],
        fill=(37, 99, 235, 45)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"))
    draw = ImageDraw.Draw(img)

    # Header branding
    f_brand = get_font(int(height * 0.024), bold=True)
    draw.text((width // 2, int(height * 0.28)), "JON BRANDING", fill=ACCENT_BLUE, font=f_brand, anchor="mm")
    draw.text((width // 2, int(height * 0.32)), "CASE STUDY SHOWCASE", fill=TEXT_MUTED, font=get_font(int(height * 0.016)), anchor="mm")

    # Client Title
    f_client = get_font(int(height * 0.055), bold=True)
    draw.text((width // 2, int(height * 0.46)), client.upper(), fill=TEXT_WHITE, font=f_client, anchor="mm")

    # Category pill
    f_cat = get_font(int(height * 0.02), bold=True)
    pill_text = category.upper()
    pill_box = draw.textbbox((0, 0), pill_text, font=f_cat)
    pw = pill_box[2] - pill_box[0] + 40
    ph = pill_box[3] - pill_box[1] + 20
    px = (width - pw) // 2
    py = int(height * 0.54)
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=ph//2, fill=(255, 255, 255, 20), outline=(255, 255, 255, 40), width=2)
    draw.text((width // 2, py + ph // 2), pill_text, fill=TEXT_WHITE, font=f_cat, anchor="mm")

    # Bottom watermark
    draw.text((width // 2, int(height * 0.88)), "jonbranding.uz", fill=TEXT_MUTED, font=get_font(int(height * 0.018)), anchor="mm")
    return img

def create_outro_slide(width: int, height: int, client: str) -> Image.Image:
    img = Image.new("RGB", (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Ambient glow
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(
        [width//4, height//3, width*3//4, height*2//3],
        fill=(99, 102, 241, 40)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"))
    draw = ImageDraw.Draw(img)

    draw.text((width // 2, int(height * 0.38)), "JON BRANDING", fill=TEXT_WHITE, font=get_font(int(height * 0.045), bold=True), anchor="mm")
    draw.text((width // 2, int(height * 0.44)), "Sales Machine Brand Agency", fill=ACCENT_BLUE, font=get_font(int(height * 0.02), bold=True), anchor="mm")

    draw.text((width // 2, int(height * 0.56)), "Markaziy Osiyo bo'ylab", fill=TEXT_MUTED, font=get_font(int(height * 0.02)), anchor="mm")
    draw.text((width // 2, int(height * 0.60)), "Premium Brending & Qadoq Tizimlari", fill=TEXT_WHITE, font=get_font(int(height * 0.022), bold=True), anchor="mm")

    draw.text((width // 2, int(height * 0.78)), "jonbranding.uz", fill=ACCENT_BLUE, font=get_font(int(height * 0.025), bold=True), anchor="mm")
    draw.text((width // 2, int(height * 0.82)), "@JonBranding", fill=TEXT_MUTED, font=get_font(int(height * 0.018)), anchor="mm")
    return img

def prepare_kenburns_frame(src_img: Image.Image, width: int, height: int, progress: float, client: str, slide_num: int, total_slides: int) -> Image.Image:
    """Compose a frame with Ken Burns zoom, dynamic blurred background, and branding overlay."""
    out = Image.new("RGB", (width, height), BG_COLOR)

    # 1. Blurred background
    # Resize to fill
    bg_ratio = max(width / src_img.width, height / src_img.height)
    bg_w = int(src_img.width * bg_ratio)
    bg_h = int(src_img.height * bg_ratio)
    bg_img = src_img.resize((bg_w, bg_h), Image.Resampling.BILINEAR)
    # Crop to center
    bg_x = (bg_w - width) // 2
    bg_y = (bg_h - height) // 2
    bg_cropped = bg_img.crop((bg_x, bg_y, bg_x + width, bg_y + height))
    bg_blurred = bg_cropped.filter(ImageFilter.GaussianBlur(30))
    # Dim background
    bg_dimmed = ImageEnhance.Brightness(bg_blurred).enhance(0.4)
    out.paste(bg_dimmed, (0, 0))

    # 2. Main foreground image with Ken Burns scale
    # Progress goes 0.0 -> 1.0; zoom from 1.00 -> 1.08
    zoom = 1.0 + (0.08 * progress)
    # Target foreground box: 90% of width, 75% of height
    fg_target_w = int(width * 0.94)
    fg_target_h = int(height * 0.76)

    fg_ratio = min(fg_target_w / src_img.width, fg_target_h / src_img.height) * zoom
    new_w = int(src_img.width * fg_ratio)
    new_h = int(src_img.height * fg_ratio)
    fg_resized = src_img.resize((new_w, new_h), Image.Resampling.BICUBIC)

    # Center placement
    center_y = int(height * 0.48)
    fg_x = (width - new_w) // 2
    fg_y = center_y - (new_h // 2)

    # Rounded corners & shadow on foreground
    mask = Image.new("L", (new_w, new_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    corner_radius = int(min(new_w, new_h) * 0.05)
    mask_draw.rounded_rectangle([0, 0, new_w, new_h], radius=corner_radius, fill=255)

    # Paste foreground
    out.paste(fg_resized, (fg_x, fg_y), mask)

    # 3. Top branding bar
    draw = ImageDraw.Draw(out)
    f_brand = get_font(int(height * 0.018), bold=True)
    draw.text((int(width * 0.06), int(height * 0.05)), "JON BRANDING", fill=TEXT_WHITE, font=f_brand)
    
    # Slide counter
    f_cnt = get_font(int(height * 0.016))
    draw.text((int(width * 0.94), int(height * 0.05)), f"{slide_num}/{total_slides}", fill=TEXT_MUTED, font=f_cnt, anchor="ra")

    # 4. Bottom Lower-Third Pill
    pill_text = f"{client.upper()} · BRAND SHOWCASE"
    f_pill = get_font(int(height * 0.016), bold=True)
    bbox = draw.textbbox((0, 0), pill_text, font=f_pill)
    pw = bbox[2] - bbox[0] + 36
    ph = bbox[3] - bbox[1] + 18
    px = (width - pw) // 2
    py = int(height * 0.90)

    # Glassmorphism pill
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=ph//2, fill=(10, 15, 29, 200), outline=(255, 255, 255, 30), width=1)
    draw.text((width // 2, py + ph // 2), pill_text, fill=TEXT_WHITE, font=f_pill, anchor="mm")

    return out

def generate_video(slug: str, aspect: str = "reel", fps: int = 30):
    # Find images
    candidates = [
        REPO_DIR / "public" / "images" / "cms" / "portfolio" / slug,
        REPO_DIR / "temp_portfolio" / slug,
    ]
    img_dir = None
    for c in candidates:
        if c.exists() and any(c.glob("*.jpg")) or any(c.glob("*.png")):
            img_dir = c
            break

    if not img_dir:
        print(f"Error: No image directory found for slug '{slug}'")
        sys.exit(1)

    images = sorted([
        p for p in img_dir.iterdir()
        if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"] and not p.name.startswith(".")
    ])

    if not images:
        print(f"Error: No images found in {img_dir}")
        sys.exit(1)

    # Resolution
    if aspect == "reel":
        width, height = 1080, 1920
    else:
        width, height = 1920, 1080

    output_filename = f"{slug}-{aspect}.mp4"
    output_path = OUTPUT_DIR / output_filename
    print(f"\n🎬 Generating {aspect} video for '{slug}' ({len(images)} images)...")
    print(f"Dimensions: {width}x{height} @ {fps}fps")
    print(f"Output path: {output_path}")

    # Project metadata
    client_name = slug.replace("-", " ").title()
    category_name = "Brand Identity & Packaging"
    if "rashmilk" in slug:
        client_name = "Rash Milk"
        category_name = "Qadoq Dizayni & Brending"
    elif "shirona" in slug:
        client_name = "Shirona"
        category_name = "Café & Bakery Identika"
    elif "savod" in slug:
        client_name = "Savod"
        category_name = "Ta'lim Rebrending"

    # Limit to top 8-10 best images for dynamic reel (around 20-25 seconds total)
    selected_images = images[:8]

    # Setup FFmpeg pipe
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output_path)
    ]

    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

    # 1. Intro slide (2 seconds = 2 * fps frames)
    intro_img = create_title_slide(width, height, client_name, f"{client_name} Case Study", category_name)
    intro_bytes = intro_img.tobytes()
    print("  • Rendering intro slide (2.0s)...")
    for _ in range(fps * 2):
        pipe.stdin.write(intro_bytes)

    # 2. Each portfolio image with Ken Burns (2.2 seconds each = ~66 frames)
    frames_per_slide = int(fps * 2.2)
    loaded_imgs = [Image.open(p).convert("RGB") for p in selected_images]
    total_slides = len(loaded_imgs)

    for s_idx, src in enumerate(loaded_imgs, 1):
        print(f"  • Rendering slide {s_idx}/{total_slides} ({src.filename if hasattr(src, 'filename') else ''})...")
        for f_idx in range(frames_per_slide):
            progress = f_idx / frames_per_slide
            frame = prepare_kenburns_frame(src, width, height, progress, client_name, s_idx, total_slides)
            pipe.stdin.write(frame.tobytes())

    # 3. Outro slide (2 seconds)
    print("  • Rendering outro slide (2.0s)...")
    outro_img = create_outro_slide(width, height, client_name)
    outro_bytes = outro_img.tobytes()
    for _ in range(fps * 2):
        pipe.stdin.write(outro_bytes)

    pipe.stdin.close()
    pipe.wait()
    stderr = pipe.stderr.read().decode("utf-8", errors="ignore")

    if output_path.exists() and output_path.stat().st_size > 0:
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"\n🎉 Video generated successfully!")
        print(f"📁 File: {output_path}")
        print(f"⚖️ Size: {size_mb:.2f} MB")
        return output_path
    else:
        print(f"❌ Error generating video:\n{stderr}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", default="rashmilk", help="Portfolio slug")
    parser.add_argument("--format", choices=["reel", "widescreen"], default="reel", help="Video format")
    args = parser.parse_args()
    generate_video(args.slug, args.format)
