import { getDb } from './firebase';
import { getTursoClient, isTursoConfigured } from '@/lib/turso';
import { logger } from '@/lib/logger';

interface InstagramTokenDoc {
  accessToken: string;
  expiresAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms
}

async function readInstagramFromTurso(): Promise<InstagramTokenDoc | null> {
  const client = getTursoClient();
  if (!client) return null;
  try {
    const res = await client.execute({
      sql: `SELECT access_token, expires_at FROM oauth_tokens WHERE service_name = 'instagram' LIMIT 1`,
      args: [],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const token = String(row.access_token || '').trim();
    if (!token) return null;
    const rawExp = row.expires_at;
    const exp = typeof rawExp === 'number' ? rawExp : new Date(String(rawExp || '')).getTime();
    return {
      accessToken: token,
      expiresAt: Number.isNaN(exp) ? Date.now() + 60 * 86400 * 1000 : exp,
      updatedAt: Date.now(),
    };
  } catch (err) {
    logger.error('[Turso] Error reading Instagram token:', err);
    return null;
  }
}

async function saveInstagramToTurso(data: InstagramTokenDoc): Promise<void> {
  const client = getTursoClient();
  if (!client) return;
  try {
    await client.execute({
      sql: `INSERT INTO oauth_tokens (service_name, access_token, refresh_token, expires_at, updated_at, extra_data)
            VALUES ('instagram', ?, '', ?, ?, ?)
            ON CONFLICT(service_name) DO UPDATE SET
              access_token = excluded.access_token,
              expires_at = excluded.expires_at,
              updated_at = excluded.updated_at`,
      args: [
        data.accessToken,
        new Date(data.expiresAt).toISOString(),
        new Date().toISOString(),
        JSON.stringify({ source: 'instagram_oauth' }),
      ],
    });
  } catch (err) {
    logger.error('[Turso] Error saving Instagram token:', err);
  }
}

/**
 * Turso/Firebase'dan Instagram OAuth tokenini oladi va kerak bo'lsa uni avtomatik yangilaydi (Refresh).
 */
export async function getInstagramToken(): Promise<string | null> {
  try {
    let data: InstagramTokenDoc | null = null;

    if (isTursoConfigured()) {
      data = await readInstagramFromTurso();
    }

    if (!data && process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
      const db = getDb();
      const docSnap = await db.collection('settings').doc('instagram').get();
      if (docSnap.exists) {
        data = docSnap.data() as InstagramTokenDoc;
      }
    }

    if (!data) {
      logger.info('[Instagram API] No token stored in Turso or Firestore');
      return null;
    }

    const now = Date.now();
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;

    if (data.expiresAt - now < fifteenDaysInMs) {
      logger.info('[Instagram API] Token expires soon, attempting auto-refresh');
      const newTokenData = await refreshLongLivedToken(data.accessToken);
      if (newTokenData) {
        const expiresAtVal = Date.now() + (newTokenData.expiresInSeconds * 1000);
        const updated: InstagramTokenDoc = {
          accessToken: newTokenData.accessToken,
          expiresAt: expiresAtVal,
          updatedAt: Date.now(),
        };

        if (isTursoConfigured()) {
          await saveInstagramToTurso(updated);
        }

        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
          try {
            await getDb().collection('settings').doc('instagram').set(updated, { merge: true });
          } catch {
            // fail soft
          }
        }

        return newTokenData.accessToken;
      }
    }

    return data.accessToken;
  } catch (error) {
    logger.error('[Instagram API] Error getting token from DB:', error);
    return null;
  }
}

/**
 * graph.instagram.com orqali 60 kunlik token muddatini uzaytiradi (Refresh).
 */
async function refreshLongLivedToken(accessToken: string): Promise<{ accessToken: string; expiresInSeconds: number } | null> {
  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      logger.error('[Instagram API] Refresh token error:', errText);
      return null;
    }
    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresInSeconds: data.expires_in,
    };
  } catch (error) {
    logger.error('[Instagram API] Network error during token refresh:', error);
    return null;
  }
}

/**
 * Berilgan kalit so'z (keyword) bo'yicha Instagram postini qidiradi va uning permalink'ini qaytaradi.
 */
export async function getInstagramPostByKeyword(keyword: string): Promise<{ permalink: string; id: string } | null> {
  const token = await getInstagramToken();
  if (!token) {
    logger.info('[Instagram API] Cannot search Instagram posts, no access token available');
    return null;
  }

  try {
    const fields = 'id,caption,permalink,media_type,timestamp';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=25`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error('[Instagram API] Failed to fetch media from Graph API:', await response.text());
      return null;
    }

    const result = await response.json();
    const posts: Array<{ id: string; caption?: string; permalink: string }> = result.data || [];

    const lowerKeyword = keyword.toLowerCase();
    for (const post of posts) {
      if (post.caption && post.caption.toLowerCase().includes(lowerKeyword)) {
        logger.info(`[Instagram API] Found matching Instagram post for: ${keyword}`);
        return { permalink: post.permalink, id: post.id };
      }
    }

    logger.info(`[Instagram API] No matching Instagram post found for: ${keyword}`);
    return null;
  } catch (error) {
    logger.error('[Instagram API] Error fetching Instagram posts:', error);
    return null;
  }
}

/**
 * Kalit so'z bo'yicha Instagram postlari ichidan qidirib topadi va post matnini (caption) qaytaradi.
 */
export async function scrapeInstagramPosts(keyword: string): Promise<string | null> {
  const token = await getInstagramToken();
  if (!token) {
    logger.info('[Instagram API] Cannot search Instagram posts, no access token available');
    return null;
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      logger.error('[Instagram API] Failed to fetch media from Graph API:', await response.text());
      return null;
    }

    const data = await response.json();
    const media = data.data || [];
    const lowerKeyword = keyword.toLowerCase();

    for (const post of media) {
      if (post.caption && post.caption.toLowerCase().includes(lowerKeyword)) {
        logger.info(`[Instagram API] Found matching Instagram post for: ${keyword}`);
        return post.caption;
      }
    }

    logger.info(`[Instagram API] No matching Instagram post found for: ${keyword}`);
    return null;
  } catch (error) {
    logger.error('[Instagram API] Error fetching Instagram posts:', error);
    return null;
  }
}
