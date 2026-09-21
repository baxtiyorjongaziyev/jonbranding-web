import { createClient } from '@sanity/client';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import type { AIEnrichedData, PortfolioPayload, SanityImageAsset } from './types.js';
import { slugify } from './slug.js';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * Telegram postidan barqaror Sanity `_id`.
 *
 * Bu funksiya `src/lib/portfolio-dedup.ts` dagi `portfolioDocId` ning aynan
 * nusxasi. Nusxa kerak, chunki bu alohida TypeScript loyihasi (`rootDir: src`)
 * va asosiy ilovadan import qila olmaydi.
 *
 * Maqsad: webhook (`/api/portfolio-telegram`) va bu bot bir postni ko'rsa ham
 * Sanity'da bitta hujjat qolishi. Ikkalasi postni har xil kalit bilan
 * belgilaydi, shuning uchun ID post matnidan hisoblanadi.
 *
 * DIQQAT: algoritm o'zgarsa, ikkala faylda ham bir xil o'zgarishi shart.
 * Asosiy ilovadagi `portfolio-dedup.test.ts` golden qiymatni ushlab turadi:
 * "Bekmarket Zayyan Naming va Branding loyihasi" -> tg-bef7595f22b63cb44d469111d37ed19e
 */
export function portfolioDocId(caption: string): string | null {
  const normalized = caption
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u0400-\u04FF]+/g, ' ')
    .trim();
  if (normalized.length < 20) return null;
  const hash = createHash('sha1').update(normalized).digest('hex').slice(0, 32);
  return `tg-${hash}`;
}

/** Berilgan ID bilan hujjat bormi — rasmlarni bekorga yuklamaslik uchun. */
export async function findPortfolioById(id: string): Promise<string | null> {
  const result = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id });
  return result ?? null;
}

async function uploadImageFile(filePath: string, mime: string): Promise<SanityImageAsset> {
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
function applyCoverAndOrder(
  imageFiles: { path: string; mime: string }[],
  coverImageIndex?: number,
  imageOrder?: number[]
): { path: string; mime: string }[] {
  let ordered = imageFiles;

  if (imageOrder && Array.isArray(imageOrder) && imageOrder.length > 0) {
    const seen = new Set<number>();
    ordered = imageOrder
      .filter((idx) => idx >= 0 && idx < imageFiles.length && !seen.has(idx) && seen.add(idx))
      .map((idx) => imageFiles[idx]);
    // AI o'tkazib yuborgan rasmlarni oxiriga qo'shib qo'yamiz
    imageFiles.forEach((file, idx) => {
      if (!seen.has(idx)) ordered.push(file);
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
export async function createPortfolioDocument(
  parsed: AIEnrichedData,
  imageFiles: { path: string; mime: string }[],
  bodyBlocks?: Array<{ style: string; children: Array<{ text: string }> }>,
  /** Postning asl matni — dublikatga qarshi barqaror ID shundan hisoblanadi. */
  sourceCaption?: string
): Promise<string> {
  if (imageFiles.length === 0) {
    throw new Error('No images provided for portfolio document');
  }

  const [cover, ...rest] = applyCoverAndOrder(imageFiles, parsed.coverImageIndex, parsed.imageOrder);

  const coverAsset = await uploadImageFile(cover.path, cover.mime);

  // Galereya rasmlari
  const galleryAssets = await Promise.all(
    rest.map((f) => uploadImageFile(f.path, f.mime))
  );

  // After image (2-rasmni after sifatida ishlatish, agar ikkita bo'lsa)
  let afterAsset: SanityImageAsset | undefined;
  if (rest.length >= 1) {
    afterAsset = await uploadImageFile(rest[0].path, rest[0].mime);
  }

  const slug = slugify(parsed.title);

  const payload: PortfolioPayload = {
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
    body: (bodyBlocks && Array.isArray(bodyBlocks) && bodyBlocks.length > 0)
      ? bodyBlocks
      : (parsed.body && Array.isArray(parsed.body) && parsed.body.length > 0)
        ? parsed.body
        : undefined,
    featured: false,
    publishedAt: new Date().toISOString(),
    order: Math.floor(Date.now() / 1000),
    metaTitle: parsed.metaTitle,
    metaDescription: parsed.metaDescription,
    seoKeywords: parsed.seoKeywords,
  };

  // Manba matni bo'lsa, hujjat ID'si o'shandan hisoblanadi va
  // `createIfNotExists` ishlatiladi: webhook allaqachon yozib ulgurgan
  // bo'lsa, yangi hujjat yaratilmaydi. Matnsiz (masalan Drive papkasidan
  // kelgan) hollarda oldingi xatti-harakat saqlanadi.
  const docId = sourceCaption ? portfolioDocId(sourceCaption) : null;
  if (docId) {
    const existingDoc = await client.createIfNotExists({ ...payload, _id: docId });
    return existingDoc._id;
  }

  const doc = await client.create(payload);
  return doc._id;
}

/**
 * Mavjud portfolio dokumentni boyitish (enrich):
 * - Yangi rasmlarni Sanity assetlariga yuklab, galereyaga qo'shadi (mavjudlarini takrorlamasdan)
 * - Teglarni birlashtiradi
 * - Natijalarni (results) to'ldiradi
 * - Agar mavjud matn/tavsif qisqa bo'lsa yoki body bo'lmasa, yangi ma'lumotlarni qo'shadi
 * - SEO meta-ma'lumotlarini to'ldiradi
 */
export async function enrichPortfolioDocument(
  documentId: string,
  parsed: AIEnrichedData,
  imageFiles: { path: string; mime: string }[]
): Promise<string> {
  const existing = await client.fetch<{
    _id: string;
    title?: string;
    client?: string;
    category?: string;
    description?: string;
    body?: Array<{ style: string; children: Array<{ text: string }> }>;
    tags?: string[];
    results?: Array<{ _key: string; metric: string; value: string }>;
    coverImage?: { asset?: { _ref?: string } };
    galleryImages?: Array<{ _key?: string; asset?: { _ref?: string } }>;
    metaTitle?: string;
    metaDescription?: string;
    seoKeywords?: string[];
  }>(`*[_id == $id][0]`, { id: documentId });

  if (!existing) {
    throw new Error(`Sanity document not found: ${documentId}`);
  }

  const patchData: Record<string, any> = {};

  // 1. Rasmlar: yangi rasmlar bo'lsa, ularni yuklab mavjud galereyaga qo'shamiz
  if (imageFiles && imageFiles.length > 0) {
    const existingRefs = new Set<string>();
    if (existing.coverImage?.asset?._ref) {
      existingRefs.add(existing.coverImage.asset._ref);
    }
    if (existing.galleryImages) {
      existing.galleryImages.forEach((img) => {
        if (img.asset?._ref) existingRefs.add(img.asset._ref);
      });
    }

    const newAssets: SanityImageAsset[] = [];
    for (const file of imageFiles) {
      try {
        const asset = await uploadImageFile(file.path, file.mime);
        if (!existingRefs.has(asset._ref)) {
          newAssets.push(asset);
          existingRefs.add(asset._ref);
        }
      } catch (uploadErr) {
        console.warn(`[sanity] Rasm yuklashda xatolik (${file.path}):`, uploadErr);
      }
    }

    if (newAssets.length > 0) {
      const currentGallery = existing.galleryImages || [];
      const updatedGallery = [
        ...currentGallery,
        ...newAssets.map((a, i) => ({
          _type: 'image',
          _key: `gallery_enriched_${Date.now()}_${i}`,
          asset: a,
        })),
      ];
      patchData.galleryImages = updatedGallery;

      if (!existing.coverImage?.asset?._ref && newAssets.length > 0) {
        patchData.coverImage = { _type: 'image', asset: newAssets[0] };
      }
    }
  }

  // 2. Teglar: birlashtirish
  const mergedTags = Array.from(new Set([...(existing.tags || []), ...(parsed.tags || [])])).filter(Boolean);
  if (mergedTags.length > 0 && mergedTags.length !== (existing.tags || []).length) {
    patchData.tags = mergedTags;
  }

  // 3. Natijalar (results): to'ldirish
  const currentResults = existing.results || [];
  const existingMetrics = new Set(currentResults.map((r) => r.metric.toLowerCase().trim()));
  const newResults = (parsed.results || []).filter((r) => !existingMetrics.has(r.metric.toLowerCase().trim()));
  if (newResults.length > 0) {
    patchData.results = [
      ...currentResults,
      ...newResults.map((r, i) => ({
        _key: `result_enriched_${Date.now()}_${i}`,
        metric: r.metric,
        value: r.value,
      })),
    ];
  }

  // 4. Tavsif va Case study body: agar mavjud bo'lmasa yoki qisqa bo'lsa
  if (!existing.description || (parsed.description && parsed.description.length > existing.description.length)) {
    patchData.description = parsed.description;
  }

  if (!existing.body || existing.body.length === 0) {
    if (parsed.body && parsed.body.length > 0) {
      patchData.body = parsed.body;
    }
  }

  // 5. SEO ma'lumotlari
  if (!existing.metaTitle && parsed.metaTitle) {
    patchData.metaTitle = parsed.metaTitle;
  }
  if (!existing.metaDescription && parsed.metaDescription) {
    patchData.metaDescription = parsed.metaDescription;
  }
  const mergedKeywords = Array.from(new Set([...(existing.seoKeywords || []), ...(parsed.seoKeywords || [])])).filter(Boolean);
  if (mergedKeywords.length > 0 && mergedKeywords.length !== (existing.seoKeywords || []).length) {
    patchData.seoKeywords = mergedKeywords;
  }

  // 6. Mijoz va kategoriya (agar bo'sh bo'lsa)
  if (!existing.client && parsed.client) {
    patchData.client = parsed.client;
  }
  const validCategories = ['logo-design', 'naming', 'brandbook', 'corporate-style', 'packaging', 'brand-strategy'];
  if (!existing.category || !validCategories.includes(existing.category)) {
    if (validCategories.includes(parsed.category)) {
      patchData.category = parsed.category;
    }
  }

  if (Object.keys(patchData).length > 0) {
    await client.patch(documentId).set(patchData).commit();
    console.log(`[sanity] ✅ Portfolio muvaffaqiyatli boyitildi (${documentId}):`, Object.keys(patchData));
  } else {
    console.log(`[sanity] ℹ️ Yangilanishi kerak bo'lgan yangi maydon topilmadi (${documentId})`);
  }

  return documentId;
}

/**
 * Mavjud portfolio dokumentni yangilash (body qo'shish uchun)
 */
export async function updatePortfolioBody(
  documentId: string,
  bodyBlocks: Array<{ style: string; children: Array<{ text: string }> }>
): Promise<void> {
  await client
    .patch(documentId)
    .set({ body: bodyBlocks })
    .commit();
}

/**
 * Portfolio mavjudligini tekshirish (slug bo'yicha)
 */
export async function findExistingPortfolio(slug: string): Promise<string | null> {
  const query = `*[_type == 'portfolio' && slug.current == $slug][0]._id`;
  const result = await client.fetch<string | null>(query, { slug });
  return result ?? null;
}

/**
 * Sanity'dagi barcha mavjud loyihalarning slug va sarlavhalarini qaytaradi
 */
export async function getAllPortfolioSlugsAndTitles(): Promise<{ slug: string; title: string }[]> {
  const query = `*[_type == 'portfolio']{ "slug": slug.current, title }`;
  try {
    const results = await client.fetch<Array<{ slug: string; title: string }>>(query);
    return results ?? [];
  } catch (err) {
    console.error('[sanity] Failed to fetch all portfolio slugs:', err);
    return [];
  }
}
