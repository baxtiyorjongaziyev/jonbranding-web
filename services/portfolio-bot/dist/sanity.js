import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 96);
}
async function uploadImageFile(filePath, mime) {
    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType: mime,
    });
    return { _type: 'reference', _ref: asset._id };
}
/**
 * Portfolio dokumentini yaratish (rasmlarni upload qilib, Sanity'ga saqlaydi)
 */
export async function createPortfolioDocument(parsed, imageFiles, bodyBlocks) {
    if (imageFiles.length === 0) {
        throw new Error('No images provided for portfolio document');
    }
    const [cover, ...rest] = imageFiles;
    const coverAsset = await uploadImageFile(cover.path, cover.mime);
    // Galereya rasmlari
    const galleryAssets = await Promise.all(rest.map((f) => uploadImageFile(f.path, f.mime)));
    // After image (2-rasmni after sifatida ishlatish, agar ikkita bo'lsa)
    let afterAsset;
    if (rest.length >= 1) {
        afterAsset = await uploadImageFile(rest[0].path, rest[0].mime);
    }
    const slug = slugify(parsed.title);
    const payload = {
        _type: 'portfolio',
        title: parsed.title,
        slug: { _type: 'slug', current: slug },
        client: parsed.client,
        category: parsed.category,
        tags: parsed.tags,
        description: parsed.description,
        coverImage: { _type: 'image', asset: coverAsset },
        galleryImages: galleryAssets.map((a) => ({ _type: 'image', asset: a })),
        afterImage: afterAsset ? { _type: 'image', asset: afterAsset } : undefined,
        results: parsed.results.map((r, i) => ({ _key: `result_${i}`, metric: r.metric, value: r.value })),
        body: bodyBlocks && bodyBlocks.length > 0 ? bodyBlocks : undefined,
        featured: false,
        publishedAt: new Date().toISOString(),
        order: Math.floor(Date.now() / 1000),
    };
    const doc = await client.create(payload);
    return doc._id;
}
/**
 * Mavjud portfolio dokumentni yangilash (body qo'shish uchun)
 */
export async function updatePortfolioBody(documentId, bodyBlocks) {
    await client
        .patch(documentId)
        .set({ body: bodyBlocks })
        .commit();
}
/**
 * Portfolio mavjudligini tekshirish (slug bo'yicha)
 */
export async function findExistingPortfolio(slug) {
    const query = `*[_type == 'portfolio' && slug.current == $slug][0]._id`;
    const result = await client.fetch(query, { slug });
    return result ?? null;
}
