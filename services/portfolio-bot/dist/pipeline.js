import fs from 'fs';
import { extractSearchTerms, parseFullCase } from './ai-processor.js';
import { downloadToTemp, findFolderByName, listImagesInFolder } from './drive-finder.js';
import { createPortfolioDocument, findExistingPortfolio } from './sanity.js';
import { slugify } from './slug.js';
/**
 * Telegram/Instagram post matnidan boshlab, Google Drive'da nom bo'yicha
 * rasm papkasini qidiradi yoki bevosita postga ilova qilingan rasmlardan
 * foydalanib, to'liq SEO-boy portfolio case yaratadi.
 */
export async function processPost(messageText, channelId, localImages) {
    let tmpDir;
    const driveParentId = process.env.DRIVE_PARENT_FOLDER_ID;
    try {
        console.log('[pipeline] Step 1/6: Qidiruv atamalarini ajratish...');
        const searchTerms = await extractSearchTerms(messageText);
        console.log(`[pipeline] Qidirilmoqda: title="${searchTerms.title}" client="${searchTerms.client}"`);
        let imageFiles = [];
        let folderName = searchTerms.title || 'Loyiha';
        let folderId;
        // 1. Avval Google Drive'dan original yuqori sifatli rasmlarni qidirib ko'ramiz
        if (driveParentId) {
            console.log('[pipeline] Step 2/6: Google Drive\'da nom bo\'yicha papka qidirilmoqda...');
            try {
                const folder = await findFolderByName(driveParentId, [searchTerms.title, searchTerms.client]);
                if (folder) {
                    folderName = folder.name;
                    folderId = folder.id;
                    console.log(`[pipeline] Drive'da mos papka topildi: "${folder.name}" (${folder.id})`);
                    const images = await listImagesInFolder(folder.id);
                    if (images.length > 0) {
                        console.log(`[pipeline] Drive'dan ${images.length} ta rasm yuklab olinmoqda...`);
                        imageFiles = await downloadToTemp(folder.id);
                        tmpDir = imageFiles[0]?.path ? imageFiles[0].path.replace(/\/[^\/]+$/, '') : undefined;
                    }
                }
            }
            catch (driveErr) {
                console.warn('[pipeline] Drive qidirishda xatolik (davom etiladi):', driveErr);
            }
        }
        // 2. Agar Drive'da papka topilmasa, lekin postga rasm(lar) ilova qilingan bo'lsa
        if (imageFiles.length === 0 && localImages && localImages.length > 0) {
            console.log(`[pipeline] Drive'dan rasm topilmadi. Postga ilova qilingan ${localImages.length} ta rasmdan foydalaniladi.`);
            imageFiles = localImages;
        }
        // 3. Agar umuman rasm bo'lmasa — xato qaytaramiz
        if (imageFiles.length === 0) {
            return {
                success: false,
                error: `Drive'da ham, postning o'zida ham rasm topilmadi (qidirildi: "${searchTerms.title}" / "${searchTerms.client}")`,
                hasDriveLink: Boolean(folderId),
                title: searchTerms.title,
            };
        }
        // Duplikatni erta tekshirish (Gemini chaqiruvlarini tejash uchun)
        const roughSlug = slugify(searchTerms.title, folderId);
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
        console.log('[pipeline] Step 5/6: Matn + rasmlar asosida to\'liq AI tahlili (SEO bilan)...');
        const aiData = await parseFullCase(messageText, folderName, imageFiles);
        console.log(`[pipeline] Tahlil qilindi → "${aiData.title}" (${aiData.category}), cover=${aiData.coverImageIndex}`);
        // Yakuniy slug AI aniqlagan sarlavha bo'yicha — qayta tekshirish
        const finalSlug = slugify(aiData.title, folderId);
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
