import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { slugify } from './slug.js';
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});
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
 * AI aniqlagan `coverImageIndex` / `imageOrder` asosida rasmlarni tartiblab,
 * muqova rasmini eng boshiga chiqaradi. Agar AI hech narsa aniqlamagan
 * bo'lsa, asl tartib (birinchi rasm = muqova) saqlanadi.
 */
function applyCoverAndOrder(imageFiles, coverImageIndex, imageOrder) {
    let ordered = imageFiles;
    if (imageOrder && Array.isArray(imageOrder) && imageOrder.length > 0) {
        const seen = new Set();
        ordered = imageOrder
            .filter((idx) => idx >= 0 && idx < imageFiles.length && !seen.has(idx) && seen.add(idx))
            .map((idx) => imageFiles[idx]);
        // AI o'tkazib yuborgan rasmlarni oxiriga qo'shib qo'yamiz
        imageFiles.forEach((file, idx) => {
            if (!seen.has(idx))
                ordered.push(file);
        });
    }
    if (typeof coverImageIndex === 'number' && coverImageIndex >= 0 && coverImageIndex < imageFiles.length) {
        const coverFile = imageFiles[coverImageIndex];
        ordered = ordered.filter((f) => f.path !== coverFile.path);
        ordered.unshift(coverFile);
    }
    return ordered;
}
/**
 * Portfolio dokumentini yaratish (rasmlarni upload qilib, Sanity'ga saqlaydi)
 */
export async function createPortfolioDocument(parsed, imageFiles, bodyBlocks) {
    if (imageFiles.length === 0) {
        throw new Error('No images provided for portfolio document');
    }
    const [cover, ...rest] = applyCoverAndOrder(imageFiles, parsed.coverImageIndex, parsed.imageOrder);
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
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        seoKeywords: parsed.seoKeywords,
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
/**
 * Sanity'dagi barcha mavjud loyihalarning slug va sarlavhalarini qaytaradi
 */
export async function getAllPortfolioSlugsAndTitles() {
    const query = `*[_type == 'portfolio']{ "slug": slug.current, title }`;
    try {
        const results = await client.fetch(query);
        return results ?? [];
    }
    catch (err) {
        console.error('[sanity] Failed to fetch all portfolio slugs:', err);
        return [];
    }
}
