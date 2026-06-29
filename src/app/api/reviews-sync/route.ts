import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { findFolderByName, listSubfolders, listFiles, downloadFileBuffer } from '@/lib/google-drive';
import { parseReviewMetadata } from '@/lib/gemini';
import { safeCompare } from '@/lib/security';

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

    // Fix: securely verify Vercel Cron auth header to prevent 'Bearer undefined' bypass
    const vercelCronSecret = process.env.CRON_SECRET;
    const isVercelCron =
      Boolean(vercelCronSecret) &&
      Boolean(authHeader) &&
      authHeader?.startsWith('Bearer ') &&
      safeCompare(authHeader.substring(7), vercelCronSecret as string);

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

    if (!process.env.SANITY_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'SANITY_TOKEN is not configured' },
        { status: 500 }
      );
    }

    console.log('[reviews-sync] Searching for "Mijozdan otziv feedback" folder on Google Drive...');
    const parentFolderId = await findFolderByName('Mijozdan otziv feedback');

    if (!parentFolderId) {
      // Return the email of the service account so the user knows who to share it with
      let saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
      let serviceAccountEmail = 'Noma\'lum';
      if (saJson) {
        try {
          if (!saJson.trim().startsWith('{')) {
            saJson = Buffer.from(saJson.trim(), 'base64').toString('utf8');
          }
          const key = JSON.parse(saJson);
          serviceAccountEmail = key.client_email || 'Noma\'lum';
        } catch (e) {
          console.error('[reviews-sync] Error parsing service account email:', e);
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Google Drive folder "Mijozdan otziv feedback" not found. Please create it and share it with the service account email.',
          serviceAccountEmail
        },
        { status: 404 }
      );
    }

    console.log(`[reviews-sync] Found parent folder ID: ${parentFolderId}. Listing subfolders...`);
    const folders = await listSubfolders(parentFolderId);
    console.log(`[reviews-sync] Found ${folders.length} client subfolders`);

    const results = [];

    for (const folder of folders) {
      try {
        // 2. Check if already processed in Sanity
        const query = `*[_type == "testimonial" && googleDriveFolderId == $folderId][0]`;
        const existingDoc = await sanityWriteClient.fetch(query, { folderId: folder.id });

        const forceUpdate = request.nextUrl.searchParams.get('force') === 'true';

        if (existingDoc) {
          if (forceUpdate) {
            console.log(`[reviews-sync] Force update: Deleting existing testimonial ${existingDoc._id}`);
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

        console.log(`[reviews-sync] Syncing folder: "${folder.name}" (${folder.id})`);

        // 3. List files inside folder
        const files = await listFiles(folder.id);
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const textFiles = files.filter(f => 
          f.mimeType.startsWith('text/') || 
          f.name.endsWith('.txt') || 
          f.name.endsWith('.md')
        );
        const audioFiles = files.filter(f => 
          f.mimeType.startsWith('audio/') || 
          ['.mp3', '.wav', '.m4a', '.ogg', '.aac'].some(ext => f.name.toLowerCase().endsWith(ext))
        );
        const videoFiles = files.filter(f => 
          f.mimeType.startsWith('video/') || 
          ['.mp4', '.mov', '.webm', '.avi', '.mkv'].some(ext => f.name.toLowerCase().endsWith(ext))
        );

        // 4. Extract metadata description
        let textContent = `Mijoz ismi va loyiha: ${folder.name}`;
        if (textFiles.length > 0) {
          const textFile = textFiles[0];
          const textBuffer = await downloadFileBuffer(textFile.id);
          textContent = textBuffer.toString('utf8');
          console.log(`[reviews-sync] Read review text from file: ${textFile.name}`);
        } else {
          console.log(`[reviews-sync] No info.txt text file found, fallback to folder name`);
        }

        // 5. Parse and translate metadata using Gemini
        console.log(`[reviews-sync] Sending text to Gemini 2.5 Flash for translation and parsing...`);
        const parsedMeta = await parseReviewMetadata(textContent);
        console.log(`[reviews-sync] Successfully parsed review for client: "${parsedMeta.name}"`);

        // 6. Upload avatar image if exists
        let avatarAsset = null;
        if (imageFiles.length > 0) {
          const avatarFile = imageFiles[0];
          console.log(`[reviews-sync] Uploading avatar image: ${avatarFile.name}`);
          const avatarBuffer = await downloadFileBuffer(avatarFile.id);
          avatarAsset = await sanityWriteClient.assets.upload('image', avatarBuffer, {
            filename: avatarFile.name,
            contentType: avatarFile.mimeType,
          });
        }

        // 7. Upload audio file if exists
        let audioAsset = null;
        if (audioFiles.length > 0) {
          const audioFile = audioFiles[0];
          console.log(`[reviews-sync] Uploading audio feedback file: ${audioFile.name}`);
          const audioBuffer = await downloadFileBuffer(audioFile.id);
          audioAsset = await sanityWriteClient.assets.upload('file', audioBuffer, {
            filename: audioFile.name,
            contentType: audioFile.mimeType || 'audio/mp3',
          });
        }

        // 8. Upload video file if exists
        let videoAsset = null;
        if (videoFiles.length > 0) {
          const videoFile = videoFiles[0];
          console.log(`[reviews-sync] Uploading video feedback file: ${videoFile.name}`);
          const videoBuffer = await downloadFileBuffer(videoFile.id);
          videoAsset = await sanityWriteClient.assets.upload('file', videoBuffer, {
            filename: videoFile.name,
            contentType: videoFile.mimeType || 'video/mp4',
          });
        }

        // 9. Create Sanity testimonial document
        const testimonialPayload = {
          _type: 'testimonial',
          name: parsedMeta.name,
          company: parsedMeta.company,
          quote: parsedMeta.quote,
          rating: parsedMeta.rating,
          featured: false,
          googleDriveFolderId: folder.id,
          order: 99,
          // Conditionally attach assets
          ...(avatarAsset && {
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: avatarAsset._id }
            }
          }),
          ...(audioAsset && {
            audioFile: {
              _type: 'file',
              asset: { _type: 'reference', _ref: audioAsset._id }
            }
          }),
          ...(videoAsset && {
            videoFile: {
              _type: 'file',
              asset: { _type: 'reference', _ref: videoAsset._id }
            }
          }),
          publishedAt: new Date().toISOString(),
        };

        console.log(`[reviews-sync] Saving testimonial document to Sanity...`);
        const createdDoc = await sanityWriteClient.create(testimonialPayload);
        console.log(`[reviews-sync] Created Sanity Testimonial: ${createdDoc._id}`);

        results.push({
          folderName: folder.name,
          folderId: folder.id,
          status: 'success',
          sanityId: createdDoc._id,
          name: parsedMeta.name,
          hasAudio: !!audioAsset,
          hasVideo: !!videoAsset,
        });
      } catch (folderError) {
        console.error(`[reviews-sync] Error syncing folder ${folder.name}:`, folderError);
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
    console.error('[reviews-sync] Global sync error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
