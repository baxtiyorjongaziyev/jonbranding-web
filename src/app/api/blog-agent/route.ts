import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { safeCompare } from '@/lib/security';
import { logger } from '@/lib/logger';
import {
  getSanityWriteDiagnostic,
  getSanityWriteToken,
  SANITY_WRITE_TOKEN_ENV,
} from '@/lib/sanity-write';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const AMOCRM_CRON_SECRET = process.env.AMOCRM_CRON_SECRET || '';

if (!GEMINI_API_KEY) {
  logger.warn('[blog-agent] GEMINI_API_KEY not configured');
}
function verifyAuth(req: NextRequest): boolean {
  if (!CRON_SECRET && !AMOCRM_CRON_SECRET) return false;
  const auth = req.headers.get('authorization');
  const providedBearerToken = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
  const url = new URL(req.url);
  const providedQuerySecret = url.searchParams.get('secret');
  const providedSecret = providedBearerToken || providedQuerySecret;
  if (!providedSecret) return false;

  const isValidCronSecret = Boolean(CRON_SECRET) && safeCompare(providedSecret, CRON_SECRET);
  const isValidAmocrmCronSecret = Boolean(AMOCRM_CRON_SECRET) && safeCompare(providedSecret, AMOCRM_CRON_SECRET);
  return isValidCronSecret || isValidAmocrmCronSecret;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96);
}

// Generate Blog Post Content with Gemini 2.5 Flash
async function generateBlogPost(topic: string, language: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `You are an expert branding and marketing copywriter for "Jon.Branding" agency.
Write a professional, SEO-optimized blog article about "${topic}".
The article must be written in the following language code: ${language} (uz = Uzbek, ru = Russian, en = English, zh = Chinese).
Format the response strictly as a JSON object with the following structure:
{
  "title": "Catchy article title",
  "description": "A self-contained 1-2 sentence direct answer to the main topic (120-180 characters)",
  "content": "Full article content in Markdown format. Start with the direct answer, then use question-shaped ## headings, numbered steps, practical criteria, and a concise conclusion.",
  "keywords": ["3-6 specific topic entities"]
}
IMPORTANT:
- Only return the JSON object, no markdown code blocks around it.
- Do not invent statistics, client results, awards, quotations, or external sources.
- Avoid keyword stuffing and generic filler.
- Use plain customer language and explain professional terms when necessary.
- Write as Jon.Branding's experienced design team, without claiming sales guarantees.`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);
  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  
  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse Gemini response as JSON');
  
  return JSON.parse(jsonMatch[0]);
}

// Simple Unsplash fetcher for cover image
async function fetchUnsplashImage(query: string): Promise<string | null> {
  // If Unsplash API key exists, use it. Otherwise, return a fallback Unsplash source URL.
  // This URL automatically redirects to a random image matching the query.
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sanityWriteToken = getSanityWriteToken();
  if (!sanityWriteToken) {
    logger.error(`[blog-agent] ${SANITY_WRITE_TOKEN_ENV} not configured`);
    return NextResponse.json(
      {
        error: {
          code: 'SANITY_WRITE_TOKEN_MISSING',
          message: 'Sanity yozish tokeni sozlanmagan.',
          hint: `Vercel Production env'ga ${SANITY_WRITE_TOKEN_ENV} nomi bilan Sanity Editor tokenini kiriting va redeploy qiling.`,
        },
      },
      { status: 503 },
    );
  }

  const sanityWriteClient = client.withConfig({
    token: sanityWriteToken,
    apiVersion: '2024-04-14',
    useCdn: false,
  });

  try {
    const topics = [
      "The importance of naming in branding",
      "How a strong logo increases sales",
      "Rebranding: When is it time to change?",
      "Packaging design that sells",
      "Corporate identity for startups"
    ];
    // Pick a random topic for today
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    const languages = ['uz', 'ru', 'en', 'zh'];
    const results = [];
    
    // Generate a unique slug based on the English version or random string to link them
    const baseSlug = `blog-${Date.now()}`;

    // Get an image
    const imageUrl = await fetchUnsplashImage("branding,design");

    for (const lang of languages) {
      logger.info(`[blog-agent] Generating article for topic: ${topic} in ${lang}`);
      const generated = await generateBlogPost(topic, lang);
      
      const slug = lang === 'en' ? slugify(generated.title) : `${slugify(generated.title)}-${lang}`;

      // Convert Markdown to Sanity Portable Text blocks (basic mapping)
      // For a robust solution, use markdown-to-portable-text library. Here we do a basic split by paragraph.
      const contentBlocks = generated.content.split('\n\n').map((paragraph: string) => {
        if (paragraph.startsWith('## ')) {
          return {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: paragraph.replace('## ', '') }]
          };
        } else if (paragraph.startsWith('### ')) {
          return {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: paragraph.replace('### ', '') }]
          };
        } else {
          return {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: paragraph }]
          };
        }
      });

      const payload = {
        _type: 'post',
        title: generated.title,
        slug: { _type: 'slug', current: slug },
        description: generated.description,
        author: 'Baxtiyorjon Gaziyev',
        keywords: Array.isArray(generated.keywords) ? generated.keywords.slice(0, 8) : [],
        language: lang,
        content: contentBlocks,
        publishedAt: new Date().toISOString(),
      };

      logger.info(`[blog-agent] Saving to Sanity: ${slug}`);
      const doc = await sanityWriteClient.create(payload);
      results.push({ lang, id: doc._id, title: generated.title });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully generated and published blog posts.',
      topic,
      results
    });
  } catch (error) {
    logger.error('[blog-agent] Error:', error);
    const diagnostic = getSanityWriteDiagnostic(error);
    if (diagnostic) {
      return NextResponse.json(
        {
          error: {
            code: diagnostic.code,
            message: diagnostic.message,
            hint: diagnostic.hint,
          },
        },
        { status: diagnostic.status },
      );
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
