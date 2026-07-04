import fs from 'fs';
import { parseWithAI } from './ai-processor.js';
import { downloadToTemp, getFolderInfo, listImagesInFolder, findFolderByName } from './drive-finder.js';
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

export async function processPost(messageText: string, channelId: string | number): Promise<PipelineResult> {
  let tmpDir: string | undefined;

  try {
    console.log('[pipeline] Step 1/5: AI parsing post...');
    const aiData = await parseWithAI(messageText);
    console.log(`[pipeline] Step 2/5: Parsed → "${aiData.title}" (${aiData.category})`);

    // Drive linki bormi? Agar yo'q bo'lsa, nomi bo'yicha qidirib ko'ramiz
    if (!aiData.driveFolderId) {
      const parentFolderId = process.env.DRIVE_PARENT_FOLDER_ID;
      if (parentFolderId) {
        console.log(`[pipeline] No direct Drive link. Searching under parent folder by title: "${aiData.title}" or client: "${aiData.client}"...`);
        // Avval title bo'yicha
        let foundId = await findFolderByName(parentFolderId, aiData.title);
        // Topilmasa client bo'yicha
        if (!foundId && aiData.client) {
          foundId = await findFolderByName(parentFolderId, aiData.client);
        }
        if (foundId) {
          aiData.driveFolderId = foundId;
          console.log(`[pipeline] Found matching folder from name: ${foundId}`);
        }
      }
    }

    if (!aiData.driveFolderId) {
      console.log('[pipeline] No Drive folder found by name or link — skipping image download');
      return {
        success: false,
        error: 'No Google Drive folder link or matching folder name found for post',
        hasDriveLink: false,
        title: aiData.title,
      };
    }

    console.log(`[pipeline] Step 3/5: Drive folder ID: ${aiData.driveFolderId}`);

    // Folder ma'lumotini olish
    const folderInfo = await getFolderInfo(aiData.driveFolderId);
    console.log(`[pipeline] Folder: "${folderInfo.name}"`);

    // Rasmlarni list qilish
    const images = await listImagesInFolder(aiData.driveFolderId);
    console.log(`[pipeline] Found ${images.length} images in Drive folder`);
    
    if (images.length === 0) {
      return { success: false, error: 'No images found in Drive folder', title: aiData.title, hasDriveLink: true };
    }

    // Rasmlarni yuklab olish
    console.log(`[pipeline] Step 4/5: Downloading ${images.length} images...`);
    const imageFiles = await downloadToTemp(aiData.driveFolderId);
    
    if (imageFiles.length === 0) {
      return { success: false, error: 'Failed to download images', title: aiData.title, imageCount: 0, hasDriveLink: true };
    }

    tmpDir = imageFiles[0]?.path ? imageFiles[0].path.replace(/\/[^\/]+$/, '') : undefined;

    // Duplikatni tekshirish
    const slug = slugify(aiData.title, aiData.driveFolderId ?? undefined);

    console.log(`[pipeline] Checking for duplicate: "${slug}"`);
    const existingId = await findExistingPortfolio(slug);
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

    // Sanity'ga yuklash
    console.log(`[pipeline] Step 5/5: Uploading to Sanity with body content...`);
    const sanityId = await createPortfolioDocument(aiData, imageFiles, aiData.body);
    console.log(`[pipeline] ✅ Portfolio created: ${sanityId} (${sanityId})`);

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