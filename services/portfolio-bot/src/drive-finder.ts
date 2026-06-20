import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Google Drive'dagi portfolio loyihalarini topish
 * JonBranding Telegram/Instagram kanallarida kelgan linklar bo'yicha
 */

export interface DriveFolder {
  id: string;
  name: string;
  description?: string;
  createdTime: string;
  webViewLink: string;
  imageCount: number;
}

/** Service Account yoki API Key orqali auth */
function getAuth(readOnly = true): any {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (keyFile && fs.existsSync(keyFile)) {
    const key = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
    return new google.auth.JWT(key.client_email, undefined, key.private_key, [
      readOnly
        ? 'https://www.googleapis.com/auth/drive.readonly'
        : 'https://www.googleapis.com/auth/drive',
    ]);
  }

  if (apiKey) {
    return apiKey;
  }

  throw new Error('Neither GOOGLE_SERVICE_ACCOUNT_JSON nor GOOGLE_API_KEY set');
}

/**
 * Google Drive folder ichidagi barcha rasmlarni list qiladi
 */
export async function listImagesInFolder(
  folderId: string
): Promise<{ id: string; name: string; mimeType: string; webViewLink: string }[]> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const all: Array<{ id: string; name: string; mimeType: string; webViewLink: string }> = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
      fields: 'files(id, name, mimeType, webViewLink), nextPageToken',
      orderBy: 'name',
      pageSize: 50,
      pageToken,
    });

    const files = res.data.files ?? [];
    for (const f of files) {
      if (f.id && f.name) {
        all.push({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType ?? 'image/jpeg',
          webViewLink: f.webViewLink ?? '',
        });
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return all;
}

/**
 * Post/Message matnidan Google Drive folder URL larini ajratib oladi
 */
export function extractDriveUrls(text: string): string[] {
  const regex =
    /https:\/\/(?:drive\.google\.com\/drive\/folders\/|drive\.google\.com\/open\?id=|docs\.google\.com\/folderview\?id=)([a-zA-Z0-9_-]+)/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    urls.push(match[0]);
  }
  return urls;
}

/**
 * Drive URL dan folder ID ni ajratib oladi
 */
export function extractFolderId(url: string): string | null {
  const patterns = [
    /folders\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /folderview\?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Drive folder haqida ma'lumot olish
 */
export async function getFolderInfo(
  folderId: string
): Promise<{ name: string; webViewLink: string; createdTime: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.get({
    fileId: folderId,
    fields: 'name, webViewLink, createdTime',
  });

  return {
    name: res.data.name ?? 'Unknown',
    webViewLink: res.data.webViewLink ?? '',
    createdTime: res.data.createdTime ?? '',
  };
}

/**
 * Barcha folder va rasmlarni vaqtinchalik joyga yuklab oladi
 */
export async function downloadToTemp(
  folderId: string
): Promise<{ path: string; mime: string }[]> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const images = await listImagesInFolder(folderId);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-'));
  const result: { path: string; mime: string }[] = [];

  for (const img of images) {
    if (!img.id) continue;
    const dest = path.join(tmpDir, img.name);
    try {
      const res = await drive.files.get(
        { fileId: img.id, alt: 'media' },
        { responseType: 'arraybuffer', timeout: 30_000 }
      );
      fs.writeFileSync(dest, Buffer.from(res.data as ArrayBuffer));
      result.push({ path: dest, mime: img.mimeType });
      console.log(`[drive-finder] Downloaded: ${img.name}`);
    } catch (err) {
      console.warn(`[drive-finder] Failed to download ${img.name}:`, err);
    }
  }

  return result;
}