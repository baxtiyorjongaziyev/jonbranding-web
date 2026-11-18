import { afterEach, describe, expect, it, vi } from 'vitest';

const {
  kvGetMock,
  kvDeleteMock,
  staticGetMock,
  getCloudflareContextMock,
  computeCacheKeyMock,
} = vi.hoisted(() => ({
  kvGetMock: vi.fn(),
  kvDeleteMock: vi.fn(),
  staticGetMock: vi.fn(),
  getCloudflareContextMock: vi.fn(),
  computeCacheKeyMock: vi.fn(() => 'incremental-cache/build-1/hash.cache'),
}));

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: getCloudflareContextMock,
}));

vi.mock('@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache', () => ({
  BINDING_NAME: 'NEXT_INC_CACHE_KV',
  PREFIX_ENV_NAME: 'NEXT_INC_CACHE_KV_PREFIX',
  default: {
    get: kvGetMock,
    delete: kvDeleteMock,
  },
}));

vi.mock('@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache', () => ({
  default: {
    get: staticGetMock,
  },
}));

vi.mock('@opennextjs/cloudflare/overrides/internal', () => ({
  computeCacheKey: computeCacheKeyMock,
}));

import { HybridKvStaticIncrementalCache } from './hybrid-incremental-cache';

afterEach(() => {
  kvGetMock.mockReset();
  kvDeleteMock.mockReset();
  staticGetMock.mockReset();
  getCloudflareContextMock.mockReset();
  computeCacheKeyMock.mockClear();
});

describe('HybridKvStaticIncrementalCache', () => {
  it('prefers KV hits over static build assets', async () => {
    const cache = new HybridKvStaticIncrementalCache();
    const kvEntry = { value: { kind: 'APP_PAGE', html: 'fresh' }, lastModified: 2000 };
    kvGetMock.mockResolvedValueOnce(kvEntry);

    const result = await cache.get('/uz', 'cache');

    expect(result).toEqual(kvEntry);
    expect(staticGetMock).not.toHaveBeenCalled();
  });

  it('falls back to static build assets on KV miss without throwing', async () => {
    const cache = new HybridKvStaticIncrementalCache();
    const staticEntry = { value: { kind: 'APP_PAGE', html: 'build' }, lastModified: 1000 };
    kvGetMock.mockRejectedValueOnce(new Error('No KV Namespace'));
    staticGetMock.mockResolvedValueOnce(staticEntry);

    const result = await cache.get('/uz', 'cache');

    expect(result).toEqual(staticEntry);
    expect(staticGetMock).toHaveBeenCalledWith('/uz', 'cache');
  });

  it('writes updates to NEXT_INC_CACHE_KV with bounded expirationTtl', async () => {
    const cache = new HybridKvStaticIncrementalCache();
    const putMock = vi.fn().mockResolvedValue(undefined);
    getCloudflareContextMock.mockReturnValue({
      env: { NEXT_INC_CACHE_KV: { put: putMock } },
    });

    await cache.set('/uz/portfolio', { html: 'updated' } as never, 'cache');

    expect(putMock).toHaveBeenCalledTimes(1);
    const [key, rawBody, options] = putMock.mock.calls[0];
    expect(key).toBe('incremental-cache/build-1/hash.cache');
    expect(JSON.parse(rawBody)).toMatchObject({ value: { html: 'updated' } });
    expect(options).toEqual({ expirationTtl: 14 * 24 * 60 * 60 });
  });

  it('skips KV delete errors safely when binding is absent', async () => {
    const cache = new HybridKvStaticIncrementalCache();
    kvDeleteMock.mockRejectedValueOnce(new Error('No KV Namespace'));

    await expect(cache.delete('/uz')).resolves.toBeUndefined();
  });
});
