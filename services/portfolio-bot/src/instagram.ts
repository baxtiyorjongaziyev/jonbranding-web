import axios from 'axios';

/**
 * Instagram post ma'lumotlarini olish
 * Instagram Graph API (yoki Apify scraper fallback) orqali ishlaydi
 */

export interface InstagramPost {
  id: string;
  caption: string;
  mediaUrls: string[];
  mediaType: 'image' | 'carousel' | 'video';
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  ownerUsername: string;
  hashtags: string[];
}

interface ApifyRunResult {
  items: Array<{
    id: string;
    caption: string;
    displayUrl: string;
    mediaType: number; // 1=image, 8=carousel, 2=video
    timestamp: string;
    likesCount: number;
    commentsCount: number;
    ownerUsername: string;
    hashtags: string[];
    children?: Array<{ displayUrl: string }>;
  }>;
}

export async function fetchInstagramPosts(
  usernameOrHashtag: string,
  limit: number = 20
): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apifyKey = process.env.APIFY_API_KEY;

  // 1. Agar Instagram Graph API tokeni bo'lsa — eng to'g'ridan-to'g'ri va rasmiy usul
  if (token) {
    try {
      console.log('[instagram] Fetching posts via Instagram Graph API...');
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url}&limit=${limit}&access_token=${token}`;
      const res = await axios.get(url, { timeout: 30_000 });
      const items = res.data?.data || [];

      return items.map((item: any): InstagramPost => {
        const mediaUrls: string[] = [];
        if (item.children?.data && Array.isArray(item.children.data)) {
          for (const child of item.children.data) {
            if (child.media_url) mediaUrls.push(child.media_url);
          }
        } else if (item.media_url) {
          mediaUrls.push(item.media_url);
        } else if (item.thumbnail_url) {
          mediaUrls.push(item.thumbnail_url);
        }

        const caption = item.caption || '';
        const hashtags = (caption.match(/#[\p{L}\w_-]+/gu) || []).map((h: string) => h.toLowerCase());

        let mediaType: InstagramPost['mediaType'] = 'image';
        if (item.media_type === 'VIDEO') mediaType = 'video';
        else if (item.media_type === 'CAROUSEL_ALBUM') mediaType = 'carousel';

        return {
          id: item.id,
          caption,
          mediaUrls,
          mediaType,
          timestamp: item.timestamp || new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          ownerUsername: 'jonbranding',
          hashtags,
        };
      });
    } catch (graphErr) {
      console.warn('[instagram] Instagram Graph API error:', graphErr instanceof Error ? graphErr.message : graphErr);
      // Apify ga o'tamiz
    }
  }

  // 2. Apify orqali scraping (agar APIFY_API_KEY mavjud bo'lsa)
  if (apifyKey) {
    const isHashtag = usernameOrHashtag.startsWith('#');
    const actorId = isHashtag
      ? 'apify~instagram-hashtag-scraper'
      : 'apify~instagram-profile-scraper';

    const input = isHashtag
      ? { hashtag: usernameOrHashtag.replace('#', ''), resultsLimit: limit }
      : { username: usernameOrHashtag, resultsLimit: limit };

    try {
      const runRes = await axios.post(
        `https://api.apify.com/v2/acts/${actorId}/runs`,
        input,
        {
          params: { token: apifyKey },
          timeout: 60_000,
        }
      );

      const runId = runRes.data?.data?.id;
      if (!runId) throw new Error('No run ID returned');

      // Wait for run to finish (max 60s)
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const statusRes = await axios.get(
          `https://api.apify.com/v2/acts/${actorId}/runs/${runId}`,
          { params: { token: apifyKey } }
        );
        const status = statusRes.data?.data?.status;
        if (status === 'SUCCEEDED') {
          const dataRes = await axios.get(
            `https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items`,
            { params: { token: apifyKey, format: 'json' } }
          );
          const items: ApifyRunResult['items'] = dataRes.data;
          return items.map(formatPost);
        }
        if (status === 'FAILED' || status === 'ABORTED') {
          throw new Error(`Apify run failed with status: ${status}`);
        }
      }
      throw new Error('Apify run timed out');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Apify Instagram sync failed: ${message}`);
    }
  }

  console.warn('[instagram] Neither INSTAGRAM_ACCESS_TOKEN nor APIFY_API_KEY is configured. Skipping Instagram sync.');
  return [];
}

function formatPost(item: ApifyRunResult['items'][0]): InstagramPost {
  const mediaUrls: string[] = [];
  if (item.displayUrl) mediaUrls.push(item.displayUrl);
  if (item.children) {
    item.children.forEach((child) => {
      if (child.displayUrl) mediaUrls.push(child.displayUrl);
    });
  }

  let mediaType: InstagramPost['mediaType'] = 'image';
  if (item.mediaType === 2) mediaType = 'video';
  else if (item.mediaType === 8) mediaType = 'carousel';

  return {
    id: item.id,
    caption: item.caption || '',
    mediaUrls,
    mediaType,
    timestamp: item.timestamp,
    likesCount: item.likesCount || 0,
    commentsCount: item.commentsCount || 0,
    ownerUsername: item.ownerUsername || 'unknown',
    hashtags: item.hashtags || [],
  };
}
