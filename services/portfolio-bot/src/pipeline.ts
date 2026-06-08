import fs from 'fs';
import { parsePostWithOisha } from './oisha.js';
import { downloadToTemp } from './drive.js';
import { createPortfolioDocument } from './sanity.js';

export interface PipelineResult {
  success: boolean;
  sanityId?: string;
  title?: string;
  error?: string;
}

export async function processPost(messageText: string, channelId: string | number): Promise<PipelineResult> {
  let tmpDir: string | undefined;

  try {
    console.log('[pipeline] Parsing post with Oisha...');
    const parsed = await parsePostWithOisha(messageText);
    console.log(`[pipeline] Parsed: ${parsed.title} (${parsed.category})`);

    if (!parsed.driveFolderId) {
      return { success: false, error: 'No Google Drive folder URL in post' };
    }

    console.log(`[pipeline] Downloading images from Drive folder: ${parsed.driveFolderId}`);
    const imageFiles = await downloadToTemp(parsed.driveFolderId);

    if (imageFiles.length === 0) {
      return { success: false, error: 'No images found in Drive folder' };
    }

    tmpDir = imageFiles[0]?.path ? imageFiles[0].path.replace(/\/[^\/]+$/, '') : undefined;
    console.log(`[pipeline] Downloaded ${imageFiles.length} images`);

    console.log('[pipeline] Creating Sanity portfolio document...');
    const sanityId = await createPortfolioDocument(parsed, imageFiles);
    console.log(`[pipeline] Created: ${sanityId}`);

    return { success: true, sanityId, title: parsed.title };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[pipeline] Error:', error);
    return { success: false, error };
  } finally {
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}
