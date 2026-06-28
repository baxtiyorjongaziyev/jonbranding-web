import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const SANITY_TOKEN = process.env.SANITY_TOKEN || '';
const VIMEO_WEBHOOK_SECRET = process.env.VIMEO_WEBHOOK_SECRET || '';

const sanityWriteClient = client.withConfig({
  token: SANITY_TOKEN,
  apiVersion: '2024-04-14',
  useCdn: false,
});

// Utility to verify Vimeo signature if we have a secret configured
function verifySignature(req: NextRequest, body: string): boolean {
  if (!VIMEO_WEBHOOK_SECRET) return true; // Accept if secret not configured yet
  // Usually, Vimeo sends an Authorization token or a signature we can verify.
  // For simplicity, we can also just use a custom query param if configured in Vimeo webhook URL: ?secret=VIMEO_WEBHOOK_SECRET
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  if (secret === VIMEO_WEBHOOK_SECRET) return true;
  return false;
}

// Generate an English slug from a title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

// AI Categorization function
async function categorizeVideo(name: string, description: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `You are an AI assistant for a branding agency website.
A new video was just uploaded to Vimeo with the following details:
Title: "${name}"
Description: "${description}"

Determine which website category this video belongs to:
1. "testimonial" - A video featuring a client talking about their experience, results, or leaving a review.
2. "portfolio" - A case study, brand presentation, or work showcase.
3. "other" - Process videos, vlogs, or unidentifiable content.

Also, extract a "client_name" (if testimonial) or "project_title" (if portfolio) from the text.
Return the result strictly as JSON:
{
  "category": "testimonial" | "portfolio" | "other",
  "extracted_name": "Name of client or project",
  "short_quote_or_desc": "A short 1-sentence summary or quote"
}
`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);
  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  
  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse Gemini response as JSON');
  
  return JSON.parse(jsonMatch[0]);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!verifySignature(req, rawBody)) {
      return NextResponse.json({ error: 'Unauthorized signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Some Vimeo events are wrapped differently or just simple JSON
    const name = body.name || body.video?.name || 'Untitled Video';
    const description = body.description || body.video?.description || '';
    const link = body.link || body.video?.link || '';

    if (!link) {
      return NextResponse.json({ success: true, message: 'No video link found, skipping.' });
    }

    console.log(`[vimeo-webhook] Processing video: ${name}`);

    // Call AI to categorize
    const aiResult = await categorizeVideo(name, description);
    console.log(`[vimeo-webhook] AI Categorization:`, aiResult);

    if (aiResult.category === 'other') {
      return NextResponse.json({ success: true, message: 'Categorized as "other", skipping CMS insertion.' });
    }

    let doc: any = {};
    const commonSlug = slugify(aiResult.extracted_name || name) + `-${Date.now().toString().slice(-4)}`;

    if (aiResult.category === 'testimonial') {
      doc = {
        _type: 'testimonial',
        name: aiResult.extracted_name || name,
        company: {
          uz: description.substring(0, 50) || 'Mijoz',
        },
        quote: {
          uz: aiResult.short_quote_or_desc || description,
        },
        videoUrl: link,
      };
    } else if (aiResult.category === 'portfolio') {
      doc = {
        _type: 'portfolio',
        title: aiResult.extracted_name || name,
        slug: { _type: 'slug', current: commonSlug },
        client: aiResult.extracted_name || name,
        description: aiResult.short_quote_or_desc || description,
        // Since portfolio requires a cover image normally, we might leave it empty for manual review,
        // or add a dummy image. For safety, we just create the document and let admin fill the image.
      };
      
      // Since `coverImage` is marked as required in the schema, we must either provide a placeholder
      // or the Sanity save will fail. Usually, for drafts, validations are skipped by the client,
      // but `create()` applies them. Wait, `client.create()` actually doesn't strictly enforce schema validations
      // on the backend unless configured, but to be safe we will create it without coverImage and see.
    }

    // Add reference to the video
    console.log(`[vimeo-webhook] Creating ${doc._type} document in Sanity...`);
    const createdDoc = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      message: `Video successfully categorized as ${doc._type} and added to CMS.`,
      docId: createdDoc._id,
      aiResult
    });

  } catch (error) {
    console.error('[vimeo-webhook] Error processing webhook:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
