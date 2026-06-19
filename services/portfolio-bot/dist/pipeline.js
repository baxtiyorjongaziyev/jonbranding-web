import fs from 'fs';
import { parseWithAI } from './ai-processor.js';
import { downloadToTemp, getFolderInfo, listImagesInFolder } from './drive-finder.js';
import { createPortfolioDocument, findExistingPortfolio } from './sanity.js';
export async function processPost(messageText, channelId) {
    let tmpDir;
    try {
        console.log('[pipeline] Step 1/5: AI parsing post...');
        const aiData = await parseWithAI(messageText);
        console.log(`[pipeline] Step 2/5: Parsed → "${aiData.title}" (${aiData.category})`);
        // Drive linki bormi?
        if (!aiData.driveFolderId) {
            console.log('[pipeline] No Drive folder link — skipping image download');
            return {
                success: false,
                error: 'No Google Drive folder URL in post',
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
        const slug = aiData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 96);
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
    }
    catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        console.error('[pipeline] ❌ Error:', error);
        return { success: false, error, title: 'Error' };
    }
    finally {
        if (tmpDir && fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    }
}
