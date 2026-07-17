import { getDb } from './firebase';
import { logger } from '@/lib/logger';

interface InstagramTokenDoc {
  accessToken: string;
  expiresAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms
}

/**
 * Firebase'dan Instagram OAuth tokenini oladi va kerak bo'lsa uni avtomatik yangilaydi (Refresh).
 */
export async function getInstagramToken(): Promise<string | null> {
  try {
    const db = getDb();
    const docRef = db.collection('settings').doc('instagram');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log('[Instagram API] No token stored in Firestore');
      return null;
    }

    const data = docSnap.data() as InstagramTokenDoc;
    const now = Date.now();

    // Agar token muddati tugashiga 15 kundan kam qolgan bo'lsa, avtomatik yangilaymiz (15 kun = 15 * 24 * 60 * 60 * 1000 ms)
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
    if (data.expiresAt - now < fifteenDaysInMs) {
      console.log('[Instagram API] Token expires soon, attempting auto-refresh');
      const newTokenData = await refreshLongLivedToken(data.accessToken);
      if (newTokenData) {
        const expiresAtVal = Date.now() + (newTokenData.expiresInSeconds * 1000);
        await docRef.set({
          accessToken: newTokenData.accessToken,
          expiresAt: expiresAtVal,
          updatedAt: Date.now()
        }, { merge: true });
        return newTokenData.accessToken;
      }
    }

    return data.accessToken;
  } catch (error) {
    console.error('[Instagram API] Error getting token from DB:', error);
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
      console.error('[Instagram API] Refresh token error:', errText);
      return null;
    }
    const resData = await response.json();
    return {
      accessToken: resData.access_token,
      expiresInSeconds: resData.expires_in
    };
  } catch (error) {
    console.error('[Instagram API] Network error during token refresh:', error);
    return null;
  }
}

/**
 * Kalit so'z bo'yicha Instagram postlari ichidan qidirib topadi va post matnini (caption) qaytaradi.
 */
export async function scrapeInstagramPosts(keyword: string): Promise<string | null> {
  const token = await getInstagramToken();
  if (!token) {
    console.log('[Instagram API] Cannot search Instagram posts, no access token available');
    return null;
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('[Instagram API] Failed to fetch media from Graph API:', await response.text());
      return null;
    }

    const data = await response.json();
    const media = data.data || [];
    const lowerKeyword = keyword.toLowerCase();

    for (const post of media) {
      if (post.caption && post.caption.toLowerCase().includes(lowerKeyword)) {
        console.log(`[Instagram API] Found matching Instagram post for: ${keyword}`);
        return post.caption;
      }
    }

    console.log(`[Instagram API] No matching Instagram post found for: ${keyword}`);
    return null;
  } catch (error) {
    console.error('[Instagram API] Error fetching Instagram posts:', error);
    return null;
  }
}
