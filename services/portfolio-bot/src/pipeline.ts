import fs from 'fs';
import { extractSearchTerms, parseFullCase } from './ai-processor.js';
import { downloadToTemp, findFolderByName, listImagesInFolder } from './drive-finder.js';
import { createPortfolioDocument, findExistingPortfolio } from './sanity.js';
import { slugify } from './slug.js';

export interface PipelineResult {
  success: boolean;
  sanityId?: string;
  title?: string;
  bodyTitle?: string;
  error?: string;
  imageCount?: number;
  hasDriveLink?: boolean;
}

/**
 * Telegram post matnidan boshlab, Google Drive'da nom bo'yicha (link kerak
 * emas) rasm papkasini qidirib, to'liq SEO-boy portfolio case yaratadi.
 */
export async function processPost(messageText: string, channelId: string | number): Promise<PipelineResult> {
  let tmpDir: string | undefined;
  const driveParentId = process.env.DRIVE_PARENT_FOLDER_ID;

  try {
    if (!driveParentId) {
      return { success: false, error: 'DRIVE_PARENT_FOLDER_ID sozlanmagan' };
    }

    console.log('[pipeline] Step 1/6: Qidiruv atamalarini ajratish...');
    const searchTerms = await extractSearchTerms(messageText);
    console.log(`[pipeline] Qidirilmoqda: title="${searchTerms.title}" client="${searchTerms.client}"`);

    console.log('[pipeline] Step 2/6: Google Drive\'da nom bo\'yicha papka qidirilmoqda...');
    const folder = await findFolderByName(driveParentId, [searchTerms.title, searchTerms.client]);
    if (!folder) {
      return {
        success: false,
        error: `Drive'da mos papka topilmadi (qidirildi: "${searchTerms.title}" / "${searchTerms.client}")`,
        hasDriveLink: false,
        title: searchTerms.title,
      };
    }
    console.log(`[pipeline] Topildi: "${folder.name}" (${folder.id})`);

    // Duplikatni erta tekshirish (Gemini chaqiruvlarini tejash uchun)
    const roughSlug = slugify(searchTerms.title, folder.id);
    const earlyId = await findExistingPortfolio(roughSlug);
    if (earlyId) {
      console.log(`[pipeline] ⚠️ Allaqachon mavjud (taxminiy slug): ${earlyId}`);
      return {
        success: true,
        sanityId: earlyId,
        title: searchTerms.title,
        bodyTitle: '⚠️ Duplicate — already exists in Sanity',
      };
    }

    console.log('[pipeline] Step 3/6: Papkadagi rasmlar ro\'yxati...');
    const images = await listImagesInFolder(folder.id);
    if (images.length === 0) {
      return { success: false, error: `Drive papkasida rasm topilmadi: "${folder.name}"`, title: searchTerms.title, hasDriveLink: true };
    }

    console.log(`[pipeline] Step 4/6: ${images.length} ta rasm yuklab olinmoqda...`);
    const imageFiles = await downloadToTemp(folder.id);
    if (imageFiles.length === 0) {
      return { success: false, error: 'Rasmlarni yuklab olib bo\'lmadi', title: searchTerms.title, imageCount: 0, hasDriveLink: true };
    }

    tmpDir = imageFiles[0]?.path ? imageFiles[0].path.replace(/\/[^\/]+$/, '') : undefined;

    console.log('[pipeline] Step 5/6: Matn + rasmlar asosida to\'liq AI tahlili (SEO bilan)...');
    const aiData = await parseFullCase(messageText, folder.name, imageFiles);
    console.log(`[pipeline] Tahlil qilindi → "${aiData.title}" (${aiData.category}), cover=${aiData.coverImageIndex}`);

    // Yakuniy slug AI aniqlagan sarlavha bo'yicha — qayta tekshirish
    const finalSlug = slugify(aiData.title, folder.id);
    const existingId = await findExistingPortfolio(finalSlug);
    if (existingId) {
      console.log(`[pipeline] ⚠️ Duplicate found: ${existingId}`);
      return {
        success: true,
        sanityId: existingId,
        title: aiData.title,
        imageCount: imageFiles.length,
        bodyTitle: '⚠️ Duplicate — already exists in Sanity',
      };
    }

    console.log('[pipeline] Step 6/6: Sanity\'ga yuklanmoqda...');
    const sanityId = await createPortfolioDocument(aiData, imageFiles, aiData.body);
    console.log(`[pipeline] ✅ Portfolio created: ${sanityId}`);

    return {
      success: true,
      sanityId,
      title: aiData.title,
      imageCount: imageFiles.length,
      hasDriveLink: true,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[pipeline] ❌ Error:', error);
    return { success: false, error, title: 'Error' };
  } finally {
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}