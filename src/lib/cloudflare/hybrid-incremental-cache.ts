import { error as logCacheError } from '@opennextjs/aws/adapters/logger.js';
import type {
  CacheEntryType,
  CacheValue,
  IncrementalCache,
  WithLastModified,
} from '@opennextjs/aws/types/overrides.js';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import kvIncrementalCache, {
  BINDING_NAME as KV_BINDING_NAME,
  PREFIX_ENV_NAME as KV_PREFIX_ENV_NAME,
} from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';
import { computeCacheKey } from '@opennextjs/cloudflare/overrides/internal';

export const NAME = 'cf-kv-hybrid-incremental-cache';
// Expire runtime KV revalidation entries after 14 days so old deploy buildIds do not accumulate indefinitely.
const KV_CACHE_TTL_SECONDS = 14 * 24 * 60 * 60;

type KvPutBinding = {
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
};

/**
 * 3-tier Free-tier friendly IncrementalCache store:
 * - Reads check Workers KV first (capturing on-demand / Sanity ISR updates),
 * - Falls back to build-time Workers Static Assets (`cdn-cgi/_next_cache`) so deploys require 0 KV writes,
 * - Writes updated entries to Workers KV with bounded TTL (no deploy bulk-PUT needed).
 */
export class HybridKvStaticIncrementalCache implements IncrementalCache {
  readonly name = NAME;

  async get<CacheType extends CacheEntryType = 'cache'>(
    key: string,
    cacheType?: CacheType,
  ): Promise<WithLastModified<CacheValue<CacheType>> | null> {
    try {
      const kvHit = await kvIncrementalCache.get(key, cacheType);
      if (kvHit) {
        return kvHit;
      }
    } catch {
      // Fall back to static assets when KV binding is absent (e.g., isolated preview/tests).
    }

    try {
      return await staticAssetsIncrementalCache.get(key, cacheType);
    } catch {
      return null;
    }
  }

  async set<CacheType extends CacheEntryType = 'cache'>(
    key: string,
    value: CacheValue<CacheType>,
    cacheType?: CacheType,
  ): Promise<void> {
    const cfEnv = getCloudflareContext().env as unknown as Record<string, unknown>;
    const kv = cfEnv[KV_BINDING_NAME] as KvPutBinding | undefined;
    if (!kv) {
      return;
    }

    const prefix = cfEnv[KV_PREFIX_ENV_NAME];
    const kvKey = computeCacheKey(key, {
      prefix: typeof prefix === 'string' ? prefix : undefined,
      buildId: process.env.OPEN_NEXT_BUILD_ID,
      cacheType,
    });

    try {
      await kv.put(
        kvKey,
        JSON.stringify({
          value,
          lastModified: Date.now(),
        }),
        { expirationTtl: KV_CACHE_TTL_SECONDS },
      );
    } catch (err) {
      logCacheError('[hybrid-cache] Failed to write KV entry:', err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await kvIncrementalCache.delete(key);
    } catch {
      // Ignore missing KV binding or already-absent key during delete.
    }
  }
}

const hybridKvStaticIncrementalCache = new HybridKvStaticIncrementalCache();

export default hybridKvStaticIncrementalCache;
