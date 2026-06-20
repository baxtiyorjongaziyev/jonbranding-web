import { google, drive_v3 } from 'googleapis';
import fs from 'fs';
import path from 'path';

export interface DriveImage {
  id: string;
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export class DriveFetcher {
  private drive: drive_v3.Drive;

  constructor(serviceAccountPath: string) {
    if (!fs.existsSync(serviceAccountPath)) {
      console.warn(`[Drive] Warning: Service account file not found at ${serviceAccountPath}. Real Drive fetch will fail.`);
    }
    
    // We try/catch initialization so the script doesn't crash on boot without keys
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
      this.drive = google.drive({ version: 'v3', auth });
    } catch (e) {
      console.error("[Drive] Failed to initialize Google Drive client:", e);
      this.drive = null as any;
    }
  }

  async fetchImagesFromFolder(folderId: string): Promise<DriveImage[]> {
    console.log(`[Drive] Fetching images from folder ${folderId}...`);
    if (!this.drive) {
      console.log(`[Drive] Returning mock images due to missing API auth.`);
      return [
        {
          id: 'mock_id_1',
          name: 'cover.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from([]),
        }
      ];
    }

    try {
      const res = await this.drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
        fields: 'files(id, name, mimeType)',
      });

      const files = res.data.files || [];
      const images: DriveImage[] = [];

      for (const file of files) {
        if (file.id) {
          const response = await this.drive.files.get(
            { fileId: file.id, alt: 'media' },
            { responseType: 'arraybuffer' }
          );
          images.push({
            id: file.id,
            name: file.name || 'image',
            mimeType: file.mimeType || 'image/jpeg',
            buffer: Buffer.from(response.data as ArrayBuffer),
          });
        }
      }

      return images;
    } catch (error) {
      console.error(`[Drive] Error fetching folder ${folderId}:`, error);
      return [];
    }
  }
}
