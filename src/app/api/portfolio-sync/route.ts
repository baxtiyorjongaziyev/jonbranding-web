import { logger } from '@/lib/logger';
// NOTE: superseded by services/portfolio-bot (Railway) — real-time Telegram
// userbot + Instagram/Drive polling with richer multimodal AI parsing.
// No longer cron-triggered (removed from vercel.json); kept for manual/backup use.
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { listSubfolders, listFiles, downloadFileBuffer } from '@/lib/google-drive';
import { parsePortfolioMetadata } from '@/lib/gemini';
import { isAuthorizedCronRequest } from '@/lib/cron-auth';
import { scrapeTelegramPosts } from '@/lib/integrations/telegram';
import { scrapeInstagramPosts } from '@/lib/integrations/instagram';

// Initialize Sanity client with write access token
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-04-14',
  useCdn: false,
});

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    // 1. Faqat `Authorization: Bearer` (src/lib/cron-auth.ts)
    const isAuthorized = isAuthorizedCronRequest(request);

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const queueFolderId = process.env.GOOGLE_DRIVE_QUEUE_FOLDER_ID;
    if (!queueFolderId) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_DRIVE_QUEUE_FOLDER_ID is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SANITY_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'SANITY_TOKEN is not configured' },
        { status: 500 }
      );
    }

    logger.info(`[portfolio-sync] Scanning Google Drive queue folder: ${queueFolderId}`);
    const folders = await listSubfolders(queueFolderId);
    logger.info(`[portfolio-sync] Found ${folders.length} subfolders`);

    const results = [];

    const forceUpdate = request.nextUrl.searchParams.get('force') === 'true';
    const folderIds = folders.map((f) => f.id);

    // Batch fetch existing documents
    const query = `*[_type == "portfolio" && googleDriveFolderId in $folderIds]`;
    const existingDocs = await sanityWriteClient.fetch(query, { folderIds });
    const existingDocMap = new Map<string, any>(existingDocs.map((doc: any) => [doc.googleDriveFolderId, doc]));

    // Batch delete if force update is on
    if (forceUpdate && existingDocs.length > 0) {
      logger.info(
        `[portfolio-sync] Force update: Batch deleting ${existingDocs.length} existing documents`
      );
      const tx = sanityWriteClient.transaction();
      for (const doc of existingDocs) {
        tx.delete(doc._id);
      }
      await tx.commit();
    }

    for (const folder of folders) {
      try {
        // 2. Check if already processed in Sanity
        const existingDoc = existingDocMap.get(folder.id);

        if (existingDoc) {
          if (forceUpdate) {
            // Already deleted in the batch transaction above, proceed with sync
          } else {
            results.push({
              folderName: folder.name,
              folderId: folder.id,
              status: 'skipped',
              reason: 'Already imported (Sanity ID: ' + existingDoc._id + ')',
            });
            continue;
          }
        }

        logger.info(`[portfolio-sync] Syncing folder: "${folder.name}" (${folder.id})`);

        // 3. List files inside folder
        const files = await listFiles(folder.id);
        const imageFiles = files.filter((f) => f.mimeType.startsWith('image/'));
        const textFiles = files.filter(
          (f) => f.mimeType.startsWith('text/') || f.name.endsWith('.txt') || f.name.endsWith('.md')
        );

        if (imageFiles.length === 0) {
          results.push({
            folderName: folder.name,
            folderId: folder.id,
            status: 'failed',
            reason: 'No images found in Drive folder',
          });
          continue;
        }

        // 4. Extract metadata description
        let textContent = `Loyiha nomi: ${folder.name}`;
        if (textFiles.length > 0) {
          // Read first text file found
          const textFile = textFiles[0];
          const textBuffer = await downloadFileBuffer(textFile.id);
          textContent = textBuffer.toString('utf8');
          logger.info(`[portfolio-sync] Read metadata text from file: ${textFile.name}`);
        } else {
          logger.info(
            `[portfolio-sync] No text metadata file found, searching Instagram for project name`
          );
          let postText = await scrapeInstagramPosts(folder.name);
          if (postText) {
            textContent = `Loyiha nomi: ${folder.name}\n\nLoyiha haqida to'liq ma'lumot (Instagramdan olindi):\n${postText}`;
            logger.info(`[portfolio-sync] Successfully fetched case study from Instagram!`);
          } else {
            logger.info(
              `[portfolio-sync] No post found on Instagram, searching Telegram @jonbranding`
            );
            const tgText = await scrapeTelegramPosts('jonbranding', folder.name);
            if (tgText) {
              textContent = `Loyiha nomi: ${folder.name}\n\nLoyiha haqida to'liq ma'lumot (Telegramdan olindi):\n${tgText}`;
              logger.info(`[portfolio-sync] Successfully fetched case study from Telegram!`);
            } else {
              logger.info(
                `[portfolio-sync] No post found on Telegram either, falling back to basic folder name`
              );
            }
          }
        }

        // 5. Parse metadata using Gemini
        logger.info(`[portfolio-sync] Sending metadata text to Gemini 2.5 Flash for parsing...`);
        const parsedMeta = await parsePortfolioMetadata(textContent);
        logger.info(`[portfolio-sync] Successfully parsed metadata: "${parsedMeta.title}"`);

        // 6. Upload images to Sanity
        let coverImage = imageFiles.find((img) => img.name.toLowerCase().includes('cover'));
        let galleryImages = imageFiles.filter((img) => img.id !== coverImage?.id);

        if (!coverImage) {
          coverImage = imageFiles[0];
          galleryImages = imageFiles.slice(1);
        }

        logger.info(`[portfolio-sync] Uploading cover image: ${coverImage.name}`);
        const coverBuffer = await downloadFileBuffer(coverImage.id);
        const coverAsset = await sanityWriteClient.assets.upload('image', coverBuffer, {
          filename: coverImage.name,
          contentType: coverImage.mimeType,
        });

        const galleryAssets = [];
        for (const img of galleryImages) {
          logger.info(`[portfolio-sync] Uploading gallery image: ${img.name}`);
          const imgBuffer = await downloadFileBuffer(img.id);
          const imgAsset = await sanityWriteClient.assets.upload('image', imgBuffer, {
            filename: img.name,
            contentType: img.mimeType,
          });
          galleryAssets.push({
            _type: 'image',
            _key: `gallery_${img.id}`,
            asset: { _type: 'reference', _ref: imgAsset._id },
          });
        }

        // 7. Create Sanity portfolio document
        const slug = parsedMeta.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 96);

        const portfolioPayload = {
          _type: 'portfolio',
          title: parsedMeta.title,
          slug: { _type: 'slug', current: slug },
          client: parsedMeta.client,
          category: parsedMeta.category,
          tags: parsedMeta.tags,
          description: parsedMeta.description,
          coverImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: coverAsset._id },
          },
          galleryImages: galleryAssets,
          results: parsedMeta.results.map((r, i) => ({
            _key: `result_${i}`,
            metric: r.metric,
            value: r.value,
          })),
          featured: false,
          googleDriveFolderId: folder.id,
          publishedAt: new Date().toISOString(),
        };

        logger.info(`[portfolio-sync] Saving portfolio document to Sanity...`);
        const createdDoc = await sanityWriteClient.create(portfolioPayload);
        logger.info(`[portfolio-sync] Created Sanity Document: ${createdDoc._id}`);

        results.push({
          folderName: folder.name,
          folderId: folder.id,
          status: 'success',
          sanityId: createdDoc._id,
          title: parsedMeta.title,
        });
      } catch (folderError) {
        console.error(`[portfolio-sync] Error syncing folder ${folder.name}:`, folderError);
        results.push({
          folderName: folder.name,
          folderId: folder.id,
          status: 'failed',
          reason: folderError instanceof Error ? folderError.message : String(folderError),
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results,
    });
  } catch (error) {
    console.error('[portfolio-sync] Global sync error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
