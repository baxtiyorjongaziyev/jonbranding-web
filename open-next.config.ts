import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import queueCache from '@opennextjs/cloudflare/overrides/queue/queue-cache';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';
import hybridKvStaticCache from './src/lib/cloudflare/hybrid-incremental-cache';

// Cloudflare Workers Free 3-tier cache:
// Edge Regional Cache -> Workers KV (runtime ISR/Sanity updates) -> Build Static Assets (0 KV writes on deploy).
// Revalidation queue and tag invalidation use SQLite Durable Objects (available on Workers Free).
export default defineCloudflareConfig({
  incrementalCache: () =>
    withRegionalCache(hybridKvStaticCache, {
      mode: 'long-lived',
      defaultLongLivedTtlSec: 3600,
    }),
  tagCache: () =>
    doShardedTagCache({
      baseShardSize: 2,
      regionalCache: true,
      regionalCacheTtlSec: 60,
    }),
  queue: () =>
    queueCache(doQueue, {
      regionalCacheTtlSec: 10,
    }),
  enableCacheInterception: true,
});
