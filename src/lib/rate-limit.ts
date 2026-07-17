import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { getDb } from '@/lib/firebase-admin';

type LocalEntry = { count: number; resetAt: number };

const localBuckets = new Map<string, LocalEntry>();
let warnedAboutDistributedFallback = false;

function cleanupExpiredLocalBuckets(now: number) {
  if (localBuckets.size < 5_000) return;

  localBuckets.forEach((entry, key) => {
    if (entry.resetAt <= now) localBuckets.delete(key);
  });
}

function checkLocalBucket(key: string, maxRequests: number, windowMs: number, now: number) {
  cleanupExpiredLocalBuckets(now);
  const entry = localBuckets.get(key);

  if (!entry || now >= entry.resetAt) {
    localBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count += 1;
  return true;
}

/**
 * Uses Firestore transactions in production so every serverless instance shares
 * the same bucket. Local memory remains a fail-soft fallback for development and
 * temporary Firestore outages.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  if (!key || maxRequests < 1 || windowMs < 1) return false;

  const now = Date.now();
  const hasDistributedStore =
    process.env.NODE_ENV !== 'test' && Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());

  if (!hasDistributedStore) {
    return checkLocalBucket(key, maxRequests, windowMs, now);
  }

  try {
    const db = getDb();
    const bucketId = createHash('sha256').update(key).digest('hex');
    const bucketRef = db.collection('_rate_limits').doc(bucketId);

    return await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(bucketRef);
      const data = snapshot.data();
      const resetAt = Number(data?.resetAt ?? 0);
      const count = Number(data?.count ?? 0);

      if (!snapshot.exists || now >= resetAt) {
        transaction.set(bucketRef, {
          count: 1,
          resetAt: now + windowMs,
          expiresAt: new Date(now + windowMs * 2),
          updatedAt: new Date(now),
        });
        return true;
      }

      if (count >= maxRequests) return false;

      transaction.update(bucketRef, {
        count: count + 1,
        updatedAt: new Date(now),
      });
      return true;
    });
  } catch (error) {
    if (!warnedAboutDistributedFallback) {
      warnedAboutDistributedFallback = true;
      console.error('[rate-limit] Firestore unavailable; using local fallback.', error);
    }
    return checkLocalBucket(key, maxRequests, windowMs, now);
  }
}

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) return null;
  const candidate = value.split(',')[0]?.trim();
  return candidate && isIP(candidate) ? candidate : null;
}

function anonymousFingerprint(headers: Headers | undefined) {
  const material = [
    headers?.get?.('user-agent') ?? '',
    headers?.get?.('accept-language') ?? '',
    headers?.get?.('sec-ch-ua-platform') ?? '',
  ].join('|');

  return `anonymous:${createHash('sha256').update(material || 'no-client-metadata').digest('hex').slice(0, 24)}`;
}

/**
 * Extracts a trusted client address. Vercel overwrites its forwarded-IP headers,
 * while Cloudflare headers are accepted only when that proxy is explicitly set.
 */
export function getClientIp(request: Request): string {
  const headers = (request as Request | undefined)?.headers;
  const isBehindCloudflare = process.env.TRUSTED_PROXY === 'cloudflare';

  if (isBehindCloudflare) {
    const cloudflareIp = normalizeIp(headers?.get?.('cf-connecting-ip'));
    if (cloudflareIp) return cloudflareIp;

    const realIp = normalizeIp(headers?.get?.('x-real-ip'));
    if (realIp) return realIp;
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    const vercelIp = normalizeIp(headers?.get?.('x-vercel-forwarded-for'));
    if (vercelIp) return vercelIp;

    const forwardedIp = normalizeIp(headers?.get?.('x-forwarded-for'));
    if (forwardedIp) return forwardedIp;

    const realIp = normalizeIp(headers?.get?.('x-real-ip'));
    if (realIp) return realIp;
  }

  const nextIp = normalizeIp((request as Request & { ip?: string })?.ip);
  if (nextIp) return nextIp;

  return anonymousFingerprint(headers);
}
