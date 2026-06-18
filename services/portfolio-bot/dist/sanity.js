import { createClient } from '@sanity/client';
import fs from 'fs';
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
    const filename = filePath.split('/').pop() ?? 'image.jpg';
    const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType: mime,
    });
    return { _type: 'reference', _ref: asset._id };
}
export async function createPortfolioDocument(parsed, imageFiles) {
    if (imageFiles.length === 0) {
        throw new Error('No images provided for portfolio document');
    }
    const [cover, ...gallery] = imageFiles;
    const coverAsset = await uploadImageFile(cover.path, cover.mime);
    const galleryAssets = await Promise.all(gallery.map((f) => uploadImageFile(f.path, f.mime)));
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
        results: parsed.results.map((r, i) => ({ _key: `result_${i}`, metric: r.metric, value: r.value })),
        featured: false,
        publishedAt: new Date().toISOString(),
    };
    const doc = await client.create(payload);
    return doc._id;
}
