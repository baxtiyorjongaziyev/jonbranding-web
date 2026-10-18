import { createClient, SanityClient } from '@sanity/client';
import { DriveImage } from './drive-fetcher';
import { SanityPortfolioItem } from './gemini-processor';

export class SanityUploader {
  private client: SanityClient;

  constructor(projectId: string, dataset: string, token: string) {
    if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing");
    
    this.client = createClient({
      projectId,
      dataset,
      useCdn: false, // We need to write, so no CDN
      token,
      apiVersion: '2023-05-03',
    });
  }

  async uploadImage(image: DriveImage): Promise<string> {
    console.log(`[Sanity] Uploading image: ${image.name}...`);
    try {
      const asset = await this.client.assets.upload('image', image.buffer, {
        filename: image.name,
        contentType: image.mimeType,
      });
      console.log(`[Sanity] Uploaded asset ID: ${asset._id}`);
      return asset._id;
    } catch (e) {
      console.error(`[Sanity] Failed to upload image ${image.name}`, e);
      throw e;
    }
  }

  async createPortfolioDocument(data: SanityPortfolioItem, coverImageId: string, galleryImageIds: string[]) {
    console.log(`[Sanity] Creating portfolio document for ${data.title}...`);
    
    const doc = {
      ...data,
      coverImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: coverImageId
        }
      },
      galleryImages: galleryImageIds.map(id => ({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: id
        }
      })),
      publishedAt: new Date().toISOString()
    };

    try {
      const response = await this.client.create(doc);
      console.log(`[Sanity] Document created successfully! ID: ${response._id}`);
      return response;
    } catch (e) {
      console.error(`[Sanity] Failed to create document`, e);
      throw e;
    }
  }
}
