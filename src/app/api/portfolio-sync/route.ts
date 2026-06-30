import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { listSubfolders, listFiles, downloadFileBuffer } from '@/lib/google-drive';
import { parsePortfolioMetadata } from '@/lib/gemini';
import { safeCompare } from '@/lib/security';
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
    // 1. Authorize the sync request (secret param OR Vercel cron auth)
    const secret = request.nextUrl.searchParams.get('secret');
    const cronSecret = process.env.AMOCRM_CRON_SECRET || process.env.CRON_SECRET || '';
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const isVercelCron = Boolean(process.env.CRON_SECRET) && Boolean(bearerToken) && safeCompare(bearerToken!, process.env.CRON_SECRET!);

    if (!cronSecret && !isVercelCron) {
      return NextResponse.json(
        { success: false, error: 'No auth configured' },
        { status: 500 }
      );
    }

    if (!isVercelCron && (!secret || !safeCompare(secret, cronSecret))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
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

    console.log(`[portfolio-sync] Scanning Google Drive queue folder: ${queueFolderId}`);
    const folders = await listSubfolders(queueFolderId);
    console.log(`[portfolio-sync] Found ${folders.length} subfolders`);

    const results = [];

    for (const folder of folders) {
      try {
        // 2. Check if already processed in Sanity
        const query = `*[_type == "portfolio" && googleDriveFolderId == $folderId][0]`;
        const existingDoc = await sanityWriteClient.fetch(query, { folderId: folder.id });

        const forceUpdate = request.nextUrl.searchParams.get('force') === 'true';

        if (existingDoc) {
          if (forceUpdate) {
            console.log(`[portfolio-sync] Force update: Deleting existing document ${existingDoc._id}`);
            await sanityWriteClient.delete(existingDoc._id);
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

        console.log(`[portfolio-sync] Syncing folder: "${folder.name}" (${folder.id})`);

        // 3. List files inside folder
        const files = await listFiles(folder.id);
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const textFiles = files.filter(f => 
          f.mimeType.startsWith('text/') || 
          f.name.endsWith('.txt') || 
          f.name.endsWith('.md')
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
          console.log(`[portfolio-sync] Read metadata text from file: ${textFile.name}`);
        } else {
          console.log(`[portfolio-sync] No text metadata file found, searching Instagram for project name`);
          let postText = await scrapeInstagramPosts(folder.name);
          if (postText) {
            textContent = `Loyiha nomi: ${folder.name}\n\nLoyiha haqida to'liq ma'lumot (Instagramdan olindi):\n${postText}`;
            console.log(`[portfolio-sync] Successfully fetched case study from Instagram!`);
          } else {
            console.log(`[portfolio-sync] No post found on Instagram, searching Telegram @jonbranding`);
            const tgText = await scrapeTelegramPosts('jonbranding', folder.name);
            if (tgText) {
              textContent = `Loyiha nomi: ${folder.name}\n\nLoyiha haqida to'liq ma'lumot (Telegramdan olindi):\n${tgText}`;
              console.log(`[portfolio-sync] Successfully fetched case study from Telegram!`);
            } else {
              console.log(`[portfolio-sync] No post found on Telegram either, falling back to basic folder name`);
            }
          }
        }

        // 5. Parse metadata using Gemini
        console.log(`[portfolio-sync] Sending metadata text to Gemini 2.5 Flash for parsing...`);
        const parsedMeta = await parsePortfolioMetadata(textContent);
        console.log(`[portfolio-sync] Successfully parsed metadata: "${parsedMeta.title}"`);

        // 6. Upload images to Sanity
        let coverImage = imageFiles.find(img => img.name.toLowerCase().includes('cover'));
        let galleryImages = imageFiles.filter(img => img.id !== coverImage?.id);
        
        if (!coverImage) {
          coverImage = imageFiles[0];
          galleryImages = imageFiles.slice(1);
        }

        console.log(`[portfolio-sync] Uploading cover image: ${coverImage.name}`);
        const coverBuffer = await downloadFileBuffer(coverImage.id);
        const coverAsset = await sanityWriteClient.assets.upload('image', coverBuffer, {
          filename: coverImage.name,
          contentType: coverImage.mimeType,
        });

        const galleryAssets = [];
        for (const img of galleryImages) {
          console.log(`[portfolio-sync] Uploading gallery image: ${img.name}`);
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

        console.log(`[portfolio-sync] Saving portfolio document to Sanity...`);
        const createdDoc = await sanityWriteClient.create(portfolioPayload);
        console.log(`[portfolio-sync] Created Sanity Document: ${createdDoc._id}`);

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
