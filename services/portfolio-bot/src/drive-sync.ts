import 'dotenv/config';
import { parseFullCase } from './ai-processor.js';
import { downloadToTemp, getTextFileContent, listSubfolders, nameSimilarity } from './drive-finder.js';
import { createPortfolioDocument, findPortfolioById, getAllPortfolioSlugsAndTitles } from './sanity.js';

/**
 * Drive → Sanity portfolio sinxroni (Telegram'siz, GitHub Actions uchun).
 *
 * `DRIVE_PARENT_FOLDER_ID` ichidagi har bir papka = bitta loyiha. Papka nomi —
 * loyiha/mijoz nomi; ichida rasmlar va ixtiyoriy `.txt` (loyiha haqida qisqa
 * matn: vazifa, nima qilindi, natija). Gemini rasmlar va matndan to'liq keys
 * (sarlavha, tavsif, SEO, cover) yasaydi va Sanity'ga yozadi. Sayt 60 soniyada
 * yangilanadi (ISR) — deploy kerak emas.
 *
 * Takrorlanishdan himoya:
 *  - hujjat ID'si `drive-<papkaId>` — bir papka faqat bir marta yoziladi;
 *  - `PORTFOLIO_SYNC_SINCE` (YYYY-MM-DD) dan oldin yaratilgan papkalar olinmaydi
 *    — eski loyihalar qayta yozilmaydi;
 *  - Sanity'da nomi o'xshash keys bo'lsa, papka o'tkazib yuboriladi.
 */

const PARENT = process.env.DRIVE_PARENT_FOLDER_ID;
const SINCE = process.env.PORTFOLIO_SYNC_SINCE ?? '';
const MIN_IMAGES = 2;
const MAX_PER_RUN = Number(process.env.PORTFOLIO_SYNC_MAX ?? 5);

async function main(): Promise<void> {
  if (!PARENT) throw new Error('DRIVE_PARENT_FOLDER_ID kerak');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(SINCE)) {
    throw new Error('PORTFOLIO_SYNC_SINCE (YYYY-MM-DD) kerak — eski papkalar qayta yozilmasligi uchun');
  }

  const folders = (await listSubfolders(PARENT)).filter((f) => f.createdTime.slice(0, 10) >= SINCE);
  const existing = await getAllPortfolioSlugsAndTitles();
  const published: string[] = [];

  for (const folder of folders) {
    if (published.length >= MAX_PER_RUN) break;
    const docId = `drive-${folder.id}`;
    if (await findPortfolioById(docId)) continue;

    const twin = existing.find((p) => nameSimilarity(p.title, folder.name) >= 0.6);
    if (twin) {
      console.log(`[drive-sync] o'tkazildi: "${folder.name}" — saytda o'xshash keys bor ("${twin.title}")`);
      continue;
    }

    const images = await downloadToTemp(folder.id);
    if (images.length < MIN_IMAGES) {
      console.log(`[drive-sync] kutilmoqda: "${folder.name}" — rasm ${images.length} ta (kamida ${MIN_IMAGES})`);
      continue;
    }

    const brief = (await getTextFileContent(folder.id)) ?? '';
    const parsed = await parseFullCase(brief || folder.name, folder.name, images);
    const id = await createPortfolioDocument(parsed, images, undefined, undefined, docId);
    published.push(`${parsed.title} (${images.length} rasm) → ${id}`);
    console.log(`[drive-sync] JOYLANDI: ${parsed.title}`);
  }

  const summary = published.length ? published.map((p) => `- ${p}`).join('\n') : '';
  console.log(summary || `[drive-sync] yangi loyiha yo'q (${folders.length} ta papka tekshirildi)`);
  if (process.env.GITHUB_STEP_SUMMARY && summary) {
    const fs = await import('fs');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Portfolio'ga joylandi\n${summary}\n`);
  }
}

main().catch((err) => {
  console.error('[drive-sync] xato:', err);
  process.exit(1);
});
