import fs from 'fs';
import path from 'path';
import type { WorkflowConfig, ProcessedPost } from './types.js';
import { parseWithAI } from './ai-processor.js';
import { downloadToTemp, getFolderInfo, listImagesInFolder, findFolderByName } from './drive-finder.js';
import { createPortfolioDocument, findExistingPortfolio } from './sanity.js';
import { fetchInstagramPosts } from './instagram.js';
import { slugify } from './slug.js';

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
  requireDriveLink: process.env.REQUIRE_DRIVE_LINK !== 'false',
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

/**
 * Bir postni to'liq qayta ishlash
 */
async function processSinglePost(
  source: 'telegram' | 'instagram',
  sourceId: string,
  text: string,
  config: WorkflowConfig
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

  try {
    // 1. AI bilan tahlil qilish
    log(`[${source}:${sourceId}] AI analysis...`);
    const aiData = await parseWithAI(text);
    result.aiData = aiData;
    result.driveFolderId = aiData.driveFolderId;

    // Drive linki bormi? Agar yo'q bo'lsa, nomi bo'yicha qidirib ko'ramiz
    if (!aiData.driveFolderId && config.googleDriveParentId) {
      log(`[${source}:${sourceId}] No direct Drive link. Searching by title: "${aiData.title}" or client: "${aiData.client}"...`);
      let foundId = await findFolderByName(config.googleDriveParentId, aiData.title);
      if (!foundId && aiData.client) {
        foundId = await findFolderByName(config.googleDriveParentId, aiData.client);
      }
      if (foundId) {
        aiData.driveFolderId = foundId;
        result.driveFolderId = foundId;
        log(`[${source}:${sourceId}] Matching folder found: ${foundId}`);
      }
    }

    // 2. Agar drive linki kerak bo'lsa va yo'q bo'lsa — skip
    if (config.requireDriveLink && !aiData.driveFolderId) {
      result.status = 'failed';
      result.error = 'No Google Drive folder link or matching folder name found';
      log(`[${source}:${sourceId}] Skipped — no Drive link or matching folder`);
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
      result.status = 'downloaded';

      // 5. Sanity'ga yuklash (autoUpload = true bo'lsa)
      if (config.autoUpload) {
        // Duplikatni tekshirish
        const slug = slugify(aiData.title, aiData.driveFolderId ?? undefined);

        const existingId = await findExistingPortfolio(slug);
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
          aiData.body
        );
        result.sanityId = sanityId;
        result.status = 'uploaded';
        log(`[${source}:${sourceId}] ✅ Uploaded to Sanity: ${sanityId}`);
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    result.status = 'failed';
    result.error = error;
    log(`[${source}:${sourceId}] ❌ Error: ${error}`);
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

        const result = await processSinglePost('instagram', post.id, post.caption, config);
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

        const result = await processSinglePost('instagram', key, post.caption, config);
        state[key] = result;
        saveState(state);
      }
    } catch (err) {
      log(`[instagram] Error searching ${hashtag}: ${err}`);
    }
  }
}

import { parseDriveFolderWithOisha } from './oisha.js';
import { listSubfolders, getTextFileContent } from './drive-finder.js';

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

        // Check early if already exists in Sanity to save Gemini API calls
        // We'll do a quick rough slugification of folder name if we don't have aiData yet
        // However, it's safer to use the exact AI title. But to save API we can guess from folder name
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
        result.status = 'downloaded';

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

            // Apply AI image ordering
            let orderedFiles = [...downloadedFiles];
            if (aiData.imageOrder && Array.isArray(aiData.imageOrder)) {
              orderedFiles = aiData.imageOrder
                .filter(idx => idx >= 0 && idx < downloadedFiles.length)
                .map(idx => downloadedFiles[idx]);
                
              // Append any missing images at the end just in case AI skipped them
              const mappedIndexes = new Set(aiData.imageOrder);
              downloadedFiles.forEach((file, idx) => {
                if (!mappedIndexes.has(idx)) {
                  orderedFiles.push(file);
                }
              });
            }

            // Apply Cover Image
            if (typeof aiData.coverImageIndex === 'number' && aiData.coverImageIndex >= 0 && aiData.coverImageIndex < downloadedFiles.length) {
              const coverFile = downloadedFiles[aiData.coverImageIndex];
              // Remove cover from its current position in ordered array and unshift to front
              orderedFiles = orderedFiles.filter(f => f.path !== coverFile.path);
              orderedFiles.unshift(coverFile);
            }

            const sanityId = await createPortfolioDocument(aiData, orderedFiles);
            result.sanityId = sanityId;
            result.status = 'uploaded';
            log(`[drive:${folder.id}] ✅ Uploaded: ${sanityId}`);
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