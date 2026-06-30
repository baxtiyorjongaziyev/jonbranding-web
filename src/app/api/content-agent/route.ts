import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { google } from 'googleapis';
import { safeCompare } from '@/lib/security';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const APIFY_API_KEY = process.env.APIFY_API_KEY || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SANITY_TOKEN = process.env.SANITY_TOKEN || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const AMOCRM_CRON_SECRET = process.env.AMOCRM_CRON_SECRET || '';

const TG_CHANNELS = ['@JonBranding'];
const IG_ACCOUNTS = ['jonbranding'];
const IG_HASHTAGS = ['#jonbranding', '#brandinguz', '#logodesignuz'];

const sanityClient = client.withConfig({
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/* ── Auth ─────────────────────────────────────── */
function verifyAuth(req: NextRequest): boolean {
  // Fail securely if no secrets are configured
  if (!CRON_SECRET && !AMOCRM_CRON_SECRET) {
    return false;
  }

  const auth = req.headers.get('authorization');
  const providedBearerToken = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
  const url = new URL(req.url);
  const providedQuerySecret = url.searchParams.get('secret');

  const providedSecret = providedBearerToken || providedQuerySecret;

  if (!providedSecret) {
    return false;
  }

  // Use timing-safe comparison
  const isValidCronSecret = Boolean(CRON_SECRET) && safeCompare(providedSecret, CRON_SECRET);
  const isValidAmocrmCronSecret =
    Boolean(AMOCRM_CRON_SECRET) && safeCompare(providedSecret, AMOCRM_CRON_SECRET);

  return isValidCronSecret || isValidAmocrmCronSecret;
}

/* ── Helpers ──────────────────────────────────── */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

function extractDriveFolderId(text: string): string | null {
  const match = text.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/* ── Gemini AI Parser ─────────────────────────── */
interface AIParsed {
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
  driveFolderId: string | null;
  city?: string;
  industry?: string;
}

async function parseWithGemini(text: string): Promise<AIParsed> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Quyidagi postdan loyiha ma'lumotlarini ajratib, FAQAT JSON formatda qaytar:

POST MATNI:
"""
${text}
"""

Qaytarish formati:
{
  "title": "Loyiha nomi (qisqa, 2-5 so'z)",
  "client": "Mijoz/kompaniya nomi",
  "category": "logo-design | naming | brandbook | corporate-style | packaging | brand-strategy",
  "description": "1-2 jumlada qisqa tavsif",
  "tags": ["3-5 ta teg"],
  "results": [{"metric": "Ko'rsatkich", "value": "Qiymat"}],
  "driveFolderId": "Google Drive folder ID yoki null",
  "city": "Shahar (agar ma'lum bo'lsa)",
  "industry": "food | fmcg | fintech | fashion (agar aniqlasa"
}

QOIDALAR:
1. category faqat berilgan ro'yxatdan
2. Agar Drive linki bo'lsa, folder ID ni ajratib ol
3. Ma'lumotlar aniq bo'lishi kerak`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  const reply: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini JSON qaytarmadi');

  const parsed = JSON.parse(jsonMatch[0]) as AIParsed;
  if (!parsed.driveFolderId) parsed.driveFolderId = extractDriveFolderId(text);
  return parsed;
}

/* ── Google Drive ─────────────────────────────── */
function getDriveAuth() {
  let saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!saJson) throw new Error('No service account');
  saJson = saJson.trim();
  if (!saJson.startsWith('{')) {
    try {
      saJson = Buffer.from(saJson, 'base64').toString('utf8');
    } catch {}
  }
  const key = JSON.parse(saJson);
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}

async function listDriveImages(
  folderId: string
): Promise<{ id: string; name: string; mimeType: string }[]> {
  const auth = getDriveAuth();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
    fields: 'files(id, name, mimeType)',
    orderBy: 'name',
    pageSize: 50,
  });
  return (res.data.files ?? [])
    .filter((f) => f.id && f.name)
    .map((f) => ({ id: f.id!, name: f.name!, mimeType: f.mimeType ?? 'image/jpeg' }));
}

async function downloadDriveImage(fileId: string): Promise<Buffer> {
  const auth = getDriveAuth();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  return Buffer.from(res.data as ArrayBuffer);
}

/* ── Sanity Upload ────────────────────────────── */
async function uploadImageToSanity(buffer: Buffer, filename: string): Promise<string> {
  const asset = await sanityClient.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  });
  return asset._id;
}

async function createPortfolioDoc(parsed: AIParsed, imageIds: string[]): Promise<string> {
  const slug = slugify(parsed.title);
  const existing = await sanityClient.fetch<string | null>(
    `*[_type == 'portfolio' && slug.current == $slug][0]._id`,
    { slug }
  );
  if (existing) return existing;

  const doc = await sanityClient.create({
    _type: 'portfolio',
    title: parsed.title,
    slug: { _type: 'slug', current: slug },
    client: parsed.client,
    category: parsed.category,
    city: parsed.city || '',
    industry: parsed.industry || '',
    tags: parsed.tags,
    description: parsed.description,
    coverImage: { _type: 'image', asset: { _type: 'reference', _ref: imageIds[0] } },
    galleryImages: imageIds
      .slice(1)
      .map((id) => ({ _type: 'image', asset: { _type: 'reference', _ref: id } })),
    results: parsed.results.map((r, i) => ({ _key: `r${i}`, metric: r.metric, value: r.value })),
    featured: false,
    publishedAt: new Date().toISOString(),
    order: Math.floor(Date.now() / 1000),
  });
  return doc._id;
}

/* ── Instagram (Apify) ───────────────────────── */
interface IGPost {
  id: string;
  caption: string;
  timestamp: string;
}

async function fetchInstagramPosts(account: string, limit: number): Promise<IGPost[]> {
  if (!APIFY_API_KEY) return [];
  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: account, resultsLimit: limit }),
      }
    );
    const runData = await runRes.json();
    const runId = runData?.data?.id;
    if (!runId) return [];

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      );
      const statusData = await statusRes.json();
      if (statusData?.data?.status === 'SUCCEEDED') {
        const dataRes = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}&format=json`
        );
        const items = await dataRes.json();
        return (items || []).map((item: any) => ({
          id: item.id || `ig_${Date.now()}`,
          caption: item.caption || '',
          timestamp: item.timestamp || new Date().toISOString(),
        }));
      }
      if (statusData?.data?.status === 'FAILED') return [];
    }
    return [];
  } catch {
    return [];
  }
}

/* ── Telegram Bot API ─────────────────────────── */
async function fetchTelegramChannelPosts(channel: string, limit: number): Promise<IGPost[]> {
  if (!TELEGRAM_BOT_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=${limit}&allowed_updates=["channel_post"]`
    );
    const data = await res.json();
    if (!data.ok) return [];
    return (data.result || [])
      .filter(
        (u: any) => u.channel_post?.chat?.username?.replace('@', '') === channel.replace('@', '')
      )
      .map((u: any) => ({
        id: `tg_${u.channel_post.message_id}`,
        caption: u.channel_post.text || u.channel_post.caption || '',
        timestamp: u.channel_post.date
          ? new Date(u.channel_post.date * 1000).toISOString()
          : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

/* ── Main Handler ─────────────────────────────── */
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: string[] = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Instagram posts
  for (const account of IG_ACCOUNTS) {
    const posts = await fetchInstagramPosts(account, 10);
    for (const post of posts) {
      if (!post.caption || post.caption.length < 20) {
        skipped++;
        continue;
      }
      try {
        const parsed = await parseWithGemini(post.caption);
        if (!parsed.driveFolderId) {
          skipped++;
          continue;
        }

        const images = await listDriveImages(parsed.driveFolderId);
        if (images.length === 0) {
          skipped++;
          continue;
        }

        const imageIds: string[] = [];
        for (const img of images.slice(0, 20)) {
          const buf = await downloadDriveImage(img.id);
          const id = await uploadImageToSanity(buf, img.name);
          imageIds.push(id);
        }

        const docId = await createPortfolioDoc(parsed, imageIds);
        results.push(`✅ ${parsed.title} → ${docId}`);
        uploaded++;
      } catch (err: any) {
        results.push(`❌ IG:${post.id} — ${err.message}`);
        failed++;
      }
    }
  }

  // Telegram posts
  for (const channel of TG_CHANNELS) {
    const posts = await fetchTelegramChannelPosts(channel, 10);
    for (const post of posts) {
      if (!post.caption || post.caption.length < 20) {
        skipped++;
        continue;
      }
      try {
        const parsed = await parseWithGemini(post.caption);
        if (!parsed.driveFolderId) {
          skipped++;
          continue;
        }

        const images = await listDriveImages(parsed.driveFolderId);
        if (images.length === 0) {
          skipped++;
          continue;
        }

        const imageIds: string[] = [];
        for (const img of images.slice(0, 20)) {
          const buf = await downloadDriveImage(img.id);
          const id = await uploadImageToSanity(buf, img.name);
          imageIds.push(id);
        }

        const docId = await createPortfolioDoc(parsed, imageIds);
        results.push(`✅ ${parsed.title} → ${docId}`);
        uploaded++;
      } catch (err: any) {
        results.push(`❌ TG:${post.id} — ${err.message}`);
        failed++;
      }
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    uploaded,
    skipped,
    failed,
    results,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
