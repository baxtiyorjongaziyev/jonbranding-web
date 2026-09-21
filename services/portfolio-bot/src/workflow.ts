import fs from 'fs';
import os from 'os';
import path from 'path';
import type { WorkflowConfig, ProcessedPost } from './types.js';
import { parseWithAI, parseFullCase } from './ai-processor.js';
import {
  downloadToTemp,
  getFolderInfo,
  getTextFileContent,
  listImagesInFolder,
  findFolderByName,
  listSubfolders,
} from './drive-finder.js';
import {
  createPortfolioDocument,
  findExistingPortfolio,
  findPortfolioById,
  getAllPortfolioSlugsAndTitles,
  portfolioDocId,
} from './sanity.js';
import { fetchInstagramPosts } from './instagram.js';
import { slugify } from './slug.js';
import { sendTelegramMessage } from './userbot.js';
import { parseDriveFolderWithOisha } from './oisha.js';

/**
 * Workflow log fayli
 */
const LOG_FILE = path.join(process.cwd(), 'workflow.log');

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

/**
 * Default konfiguratsiya
 */
export const DEFAULT_CONFIG: WorkflowConfig = {
  telegramChannels: process.env.TELEGRAM_CHANNELS ? process.env.TELEGRAM_CHANNELS.split(',') : ['@JonBranding'],
  instagramAccounts: process.env.INSTAGRAM_ACCOUNTS ? process.env.INSTAGRAM_ACCOUNTS.split(',') : ['jonbranding'],
  instagramHashtags: process.env.INSTAGRAM_HASHTAGS ? process.env.INSTAGRAM_HASHTAGS.split(',') : ['#jonbranding', '#brandinguz', '#logodesignuz'],
  googleDriveParentId: process.env.DRIVE_PARENT_FOLDER_ID,
  postsPerSource: process.env.POSTS_PER_SOURCE ? parseInt(process.env.POSTS_PER_SOURCE, 10) : 10,
  requireDriveLink: process.env.REQUIRE_DRIVE_LINK === 'true',
  autoUpload: process.env.AUTO_UPLOAD !== 'false',
  intervalMinutes: process.env.INTERVAL_MINUTES ? parseInt(process.env.INTERVAL_MINUTES, 10) : 60,
};

/**
 * Workflow state fayli — qaysi postlar allaqachon ishlanganligini saqlaydi
 */
const STATE_FILE = path.join(process.cwd(), 'workflow-state.json');

function loadState(): Record<string, ProcessedPost> {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveState(state: Record<string, ProcessedPost>) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getProcessedIds(state: Record<string, ProcessedPost>): Set<string> {
  return new Set(Object.keys(state));
}

function extensionFromContentType(contentType: string): string {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

async function downloadRemoteImages(
  urls: string[],
  source: string
): Promise<Array<{ path: string; mime: string }>> {
  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (uniqueUrls.length === 0) return [];

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-social-'));
  const files: Array<{ path: string; mime: string }> = [];

  try {
    for (let index = 0; index < uniqueUrls.length; index++) {
      const url = uniqueUrls[index];
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Image download failed (${response.status}) for ${url}`);
      }

      const mime = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
      if (!mime.startsWith('image/')) {
        throw new Error(`Unsupported media type for portfolio image: ${mime}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = `${source}-${index + 1}.${extensionFromContentType(mime)}`;
      const filePath = path.join(tmpDir, filename);
      fs.writeFileSync(filePath, buffer);
      files.push({ path: filePath, mime });
    }

    return files;
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw err;
  }
}

/**
 * Post matnidan hisoblangan ID bo'yicha hujjat bor-yo'qligini tekshiradi.
 * Webhook (`/api/portfolio-telegram`) shu postni allaqachon joylagan bo'lsa,
 * bot uni qayta yaratmaydi.
 */
async function findByPostText(text: string): Promise<string | null> {
  const docId = portfolioDocId(text);
  if (!docId) return null;
  return findPortfolioById(docId);
}

/**
 * Bir postni to'liq qayta ishlash
 */
async function processSinglePost(
  source: 'telegram' | 'instagram',
  sourceId: string,
  text: string,
  config: WorkflowConfig,
  mediaUrls: string[] = []
): Promise<ProcessedPost> {
  const result: ProcessedPost = {
    source,
    sourceId,
    originalText: text,
    aiData: null as any,
    driveFolderId: null,
    imageCount: 0,
    status: 'new',
    timestamp: new Date().toISOString(),
  };
  let tmpDir: string | undefined;

  try {
    // 1. AI bilan tahlil qilish
    log(`[${source}:${sourceId}] AI analysis...`);
    const aiData = await parseWithAI(text);
    result.aiData = aiData;
    result.driveFolderId = aiData.driveFolderId;

    // Drive linki bormi? Agar yo'q bo'lsa, nomi bo'yicha qidirib ko'ramiz
    if (!aiData.driveFolderId && config.googleDriveParentId) {
      log(`[${source}:${sourceId}] No direct Drive link. Searching by title: "${aiData.title}" or client: "${aiData.client}"...`);
      const found = await findFolderByName(config.googleDriveParentId, [aiData.title, aiData.client]);
      if (found) {
        aiData.driveFolderId = found.id;
        result.driveFolderId = found.id;
        log(`[${source}:${sourceId}] Matching folder found: "${found.name}" (${found.id})`);
      }
    }

    // 2. Agar drive linki talab qilingan bo'lsa va yo'q bo'lsa — skip
    if (config.requireDriveLink && !aiData.driveFolderId) {
      result.status = 'failed';
      result.error = 'No Google Drive folder link or matching folder name found';
      log(`[${source}:${sourceId}] Skipped — requireDriveLink is true and no Drive link`);
      return result;
    }

    // Agar Drive topilmasa va postning o'zida ham rasm bo'lmasa — skip
    if (!aiData.driveFolderId && mediaUrls.length === 0) {
      result.status = 'failed';
      result.error = 'No Google Drive folder and no attached images found';
      log(`[${source}:${sourceId}] Skipped — no Drive folder and no attached images`);
      return result;
    }

    // 3. Google Drive'dan rasmlarni yuklab olish
    if (aiData.driveFolderId) {
      log(`[${source}:${sourceId}] Downloading images from Drive: ${aiData.driveFolderId}`);
      
      // Folder ma'lumotini olish
      const folderInfo = await getFolderInfo(aiData.driveFolderId);
      log(`[${source}:${sourceId}] Folder: ${folderInfo.name}`);

      // Rasmlarni list qilish
      const images = await listImagesInFolder(aiData.driveFolderId);
      log(`[${source}:${sourceId}] Found ${images.length} images in Drive`);

      if (images.length === 0) {
        result.status = 'failed';
        result.error = 'No images found in Drive folder';
        return result;
      }

      result.imageCount = images.length;

      // 4. Rasmlarni yuklab olish
      const imageFiles = await downloadToTemp(aiData.driveFolderId);
      tmpDir = imageFiles[0]?.path ? path.dirname(imageFiles[0].path) : undefined;
      result.status = 'downloaded';

      // 5. Sanity'ga yuklash (autoUpload = true bo'lsa)
      if (config.autoUpload) {
        // Duplikatni tekshirish
        const slug = slugify(aiData.title, aiData.driveFolderId ?? undefined);

        const existingId = (await findByPostText(text)) ?? (await findExistingPortfolio(slug));
        if (existingId) {
          log(`[${source}:${sourceId}] Portfolio already exists: ${existingId}`);
          result.sanityId = existingId;
          result.status = 'uploaded';
          return result;
        }

        log(`[${source}:${sourceId}] Uploading ${imageFiles.length} images to Sanity...`);
        const sanityId = await createPortfolioDocument(
          aiData,
          imageFiles,
          aiData.body,
          text
        );
        result.sanityId = sanityId;
        result.status = 'uploaded';
        log(`[${source}:${sourceId}] ✅ Uploaded to Sanity: ${sanityId}`);

        // Oisha Telegram orqali xabar beradi
        await sendTelegramMessage(
          `🤖 *Oisha:* Yangi portfolio yaratildi (Google Drive orqali)!\n\n` +
          `📁 *${aiData.title}*\n` +
          `🏷 Kategoriya: \`${aiData.category}\`\n` +
          `🆔 Sanity ID: \`${sanityId}\`\n` +
          `🖼 Rasmlar: ${imageFiles.length} ta\n` +
          `🌐 Saytda: https://jonbranding.uz/uz/portfolio/${slug}`
        );
      }
    } else if (mediaUrls.length > 0) {
      log(`[${source}:${sourceId}] No Drive folder. Downloading ${mediaUrls.length} image(s) from ${source}...`);
      const imageFiles = await downloadRemoteImages(mediaUrls, `${source}-${sourceId.replace(/[^a-z0-9_-]/gi, '-')}`);
      tmpDir = imageFiles[0]?.path ? path.dirname(imageFiles[0].path) : undefined;
      result.imageCount = imageFiles.length;
      result.status = 'downloaded';

      // Oisha multimodal tahlili (matn + yuklab olingan rasmlar)
      log(`[${source}:${sourceId}] Oisha multimodal AI tahlili...`);
      const enrichedAiData = await parseFullCase(text, `${source} post: ${aiData.title}`, imageFiles);
      result.aiData = enrichedAiData;

      if (config.autoUpload) {
        const slug = slugify(enrichedAiData.title);
        const existingId = (await findByPostText(text)) ?? (await findExistingPortfolio(slug));
        if (existingId) {
          log(`[${source}:${sourceId}] Portfolio already exists: ${existingId}`);
          result.sanityId = existingId;
          result.status = 'uploaded';
          return result;
        }

        log(`[${source}:${sourceId}] Uploading images to Sanity...`);
        const sanityId = await createPortfolioDocument(enrichedAiData, imageFiles, enrichedAiData.body, text);
        result.sanityId = sanityId;
        result.status = 'uploaded';
        log(`[${source}:${sourceId}] ✅ Uploaded to Sanity: ${sanityId}`);

        // Oisha Telegram orqali xabar beradi
        await sendTelegramMessage(
          `🤖 *Oisha:* ${source === 'instagram' ? 'Instagram' : 'Telegram'}dan yangi portfolio yaratildi!\n\n` +
          `📁 *${enrichedAiData.title}*\n` +
          `🏷 Kategoriya: \`${enrichedAiData.category}\`\n` +
          `🆔 Sanity ID: \`${sanityId}\`\n` +
          `🖼 Rasmlar: ${imageFiles.length} ta\n` +
          `🌐 Saytda: https://jonbranding.uz/uz/portfolio/${slug}`
        );
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    result.status = 'failed';
    result.error = error;
    log(`[${source}:${sourceId}] ❌ Error: ${error}`);
  } finally {
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  return result;
}

/**
 * Instagram'dan postlarni olish va qayta ishlash
 */
async function processInstagram(config: WorkflowConfig, state: Record<string, ProcessedPost>): Promise<void> {
  const processed = getProcessedIds(state);

  for (const account of config.instagramAccounts) {
    try {
      log(`[instagram] Fetching posts from @${account}...`);
      const posts = await fetchInstagramPosts(account, config.postsPerSource);

      for (const post of posts) {
        if (processed.has(`ig:${post.id}`)) continue;
        log(`[instagram] New post: ${post.id} — ${post.caption.slice(0, 60)}...`);

        const result = await processSinglePost('instagram', post.id, post.caption, config, post.mediaUrls);
        state[`ig:${post.id}`] = result;
        saveState(state);
      }
    } catch (err) {
      log(`[instagram] Error fetching @${account}: ${err}`);
    }
  }

  // Hashtag search
  for (const hashtag of config.instagramHashtags) {
    try {
      log(`[instagram] Searching hashtag ${hashtag}...`);
      const posts = await fetchInstagramPosts(hashtag, config.postsPerSource);

      for (const post of posts) {
        const key = `ig:${hashtag}:${post.id}`;
        if (processed.has(key)) continue;
        log(`[instagram] New hashtag post: ${post.id}`);

        const result = await processSinglePost('instagram', key, post.caption, config, post.mediaUrls);
        state[key] = result;
        saveState(state);
      }
    } catch (err) {
      log(`[instagram] Error searching ${hashtag}: ${err}`);
    }
  }
}

/**
 * Google Drive'dagi to'g'ridan-to'g'ri papkalarni tekshirish va yuklash
 */
async function processGoogleDrive(config: WorkflowConfig, state: Record<string, ProcessedPost>): Promise<void> {
  if (!config.googleDriveParentId) {
    log('[drive] No googleDriveParentId configured, skipping direct Drive sync.');
    return;
  }

  const processed = getProcessedIds(state);
  log(`[drive] Scanning parent folder: ${config.googleDriveParentId}`);

  try {
    const folders = await listSubfolders(config.googleDriveParentId);
    log(`[drive] Found ${folders.length} subfolders in parent directory.`);

    for (const folder of folders) {
      const key = `drive:${folder.id}`;
      if (processed.has(key)) continue;

      log(`[drive] New folder found: ${folder.name} (${folder.id})`);

      const result: ProcessedPost = {
        source: 'drive',
        sourceId: folder.id,
        originalText: `Folder name: ${folder.name}`,
        aiData: null as any,
        driveFolderId: folder.id,
        imageCount: 0,
        status: 'new',
        timestamp: new Date().toISOString(),
      };

      try {
        const textContent = await getTextFileContent(folder.id) || '';

        const roughSlug = slugify(folder.name, folder.id);
        const earlyId = await findExistingPortfolio(roughSlug);
        if (earlyId) {
           log(`[drive:${folder.id}] Portfolio already exists in Sanity (by rough slug): ${earlyId}`);
           result.sanityId = earlyId;
           result.status = 'uploaded';
           state[key] = result;
           saveState(state);
           continue;
        }

        // First download images
        const images = await listImagesInFolder(folder.id);
        if (images.length === 0) {
          result.status = 'failed';
          result.error = 'No images found';
          state[key] = result;
          saveState(state);
          continue;
        }

        result.imageCount = images.length;
        log(`[drive:${folder.id}] Downloading ${images.length} images for AI analysis...`);
        const downloadedFiles = await downloadToTemp(folder.id);
        const tmpDir = downloadedFiles[0]?.path ? path.dirname(downloadedFiles[0].path) : undefined;
        result.status = 'downloaded';

        try {
          log(`[drive:${folder.id}] Multimodal AI analysis...`);
          const aiData = await parseDriveFolderWithOisha(folder.name, textContent, downloadedFiles);
          aiData.driveFolderId = folder.id;
          result.aiData = aiData;

          if (config.autoUpload) {
            const slug = slugify(aiData.title, folder.id);

            const existingId = await findExistingPortfolio(slug);
            if (existingId) {
              log(`[drive:${folder.id}] Portfolio already exists: ${existingId}`);
              result.sanityId = existingId;
              result.status = 'uploaded';
            } else {
              log(`[drive:${folder.id}] Uploading to Sanity...`);
              const sanityId = await createPortfolioDocument(aiData, downloadedFiles);
              result.sanityId = sanityId;
              result.status = 'uploaded';
              log(`[drive:${folder.id}] ✅ Uploaded: ${sanityId}`);
            }
          }
        } finally {
          if (tmpDir && fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
          }
        }
      } catch (err) {
        result.status = 'failed';
        result.error = err instanceof Error ? err.message : String(err);
        log(`[drive:${folder.id}] ❌ Error: ${result.error}`);
      }

      state[key] = result;
      saveState(state);
    }
  } catch (err) {
    log(`[drive] Error scanning parent folder: ${err}`);
  }
}

/**
 * Asosiy workflow ishga tushirish
 */
export async function runWorkflow(config: WorkflowConfig = DEFAULT_CONFIG): Promise<void> {
  log('🚀 Portfolio workflow started');
  log(`Config: ${JSON.stringify(config, null, 2)}`);

  const state = loadState();
  log(`Loaded ${Object.keys(state).length} previous processed posts`);

  // 1. Instagram postlarni qayta ishlash
  await processInstagram(config, state);

  // 2. Google Drive to'g'ridan-to'g'ri kuzatish
  await processGoogleDrive(config, state);

  // 3. Natijalarni chiqarish
  const keys = Object.keys(state);
  const uploaded = keys.filter((k) => state[k].status === 'uploaded').length;
  const failed = keys.filter((k) => state[k].status === 'failed').length;
  const total = keys.length;

  log(`📊 Workflow complete: ${total} total, ${uploaded} uploaded, ${failed} failed`);
  
  // 4. Upload qilinganlarni chiqarish
  const recentUploads = keys
    .filter((k) => state[k].status === 'uploaded')
    .slice(-5)
    .map((k) => state[k]);

  if (recentUploads.length > 0) {
    log('--- Latest uploads ---');
    for (const u of recentUploads) {
      log(`✅ ${u.aiData?.title || 'Unknown'} — ID: ${u.sanityId}`);
    }
  }

  // 5. Google Drive vs Sanity taqqoslash
  if (config.googleDriveParentId) {
    try {
      log('[drive-sync] Checking for unpublished works in Google Drive...');
      const driveFolders = await listSubfolders(config.googleDriveParentId);
      const sanityPortfolios = await getAllPortfolioSlugsAndTitles();
      
      const sanitySlugs = new Set(sanityPortfolios.map(p => p.slug));
      
      const unpublishedFolders: string[] = [];
      for (const folder of driveFolders) {
        const folderSlug = slugify(folder.name, folder.id);
        if (!sanitySlugs.has(folderSlug)) {
          unpublishedFolders.push(folder.name);
        }
      }

      if (unpublishedFolders.length > 0) {
        log(`[drive-sync] Found ${unpublishedFolders.length} unpublished works: ${unpublishedFolders.join(', ')}`);
        
        const messageHeader = `📂 *Google Drive'dagi hali saytga chiqmagan ishlar ro'yxati (jami: ${unpublishedFolders.length} ta):*\n\n`;
        const messageBody = unpublishedFolders.map((name, index) => `${index + 1}. \`${name}\``).join('\n');
        const messageFooter = `\n\n💡 _Ushbu ishlarni portfolioga chiqarish uchun, ularning nomi bilan mos keluvchi Telegram postini kanalda e'lon qiling._`;
        
        await sendTelegramMessage(messageHeader + messageBody + messageFooter);
      } else {
        log('[drive-sync] All Google Drive works are published on Sanity.');
      }
    } catch (syncErr) {
      log(`[drive-sync] Error comparing Drive and Sanity: ${syncErr}`);
    }
  }
}

/**
 * CLI uchun — workflow ni interval bilan ishga tushirish
 */
export async function startWorkflowLoop(config: WorkflowConfig = DEFAULT_CONFIG): Promise<void> {
  log('🔄 Starting workflow loop');
  
  // Birinchi marta darhol ishga tushirish
  await runWorkflow(config);

  // Keyin interval bilan
  const intervalMs = config.intervalMinutes * 60 * 1000;
  log(`⏰ Next run in ${config.intervalMinutes} minutes`);

  setInterval(async () => {
    log('⏰ Scheduled run starting...');
    try {
      await runWorkflow(config);
    } catch (err) {
      log(`❌ Scheduled run failed: ${err}`);
    }
    log(`⏰ Next run in ${config.intervalMinutes} minutes`);
  }, intervalMs);
}

// Agar skript to'g'ridan-to'g'ri ishga tushirilsa
const isMainModule = process.argv[1]?.endsWith('workflow.ts') || process.argv[1]?.endsWith('workflow.js');
if (isMainModule) {
  startWorkflowLoop().catch((err) => {
    console.error('[workflow] Fatal error:', err);
    process.exit(1);
  });
}
