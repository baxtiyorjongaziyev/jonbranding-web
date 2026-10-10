// @vitest-environment node
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const origin = 'https://www.jonbranding.uz';
function worker() {
  const handlers = new Map<string, (event: unknown) => void>();
  const stores = new Map<string, Map<string, Response>>();
  const address = (request: { url: string } | string) => typeof request === 'string' ? new URL(request, origin).href : request.url;
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const entries = stores.get(name)!;
    return {
      keys: async () => [...entries.keys()].map((url) => new Request(url)),
      match: async (request: Request | string) => entries.get(address(request))?.clone(),
      put: async (request: Request | string, response: Response) => { entries.set(address(request), response.clone()); },
      addAll: vi.fn(),
    };
  };
  const caches = {
    open,
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    match: async (request: Request | string) => {
      for (const entries of stores.values()) {
        const response = entries.get(address(request));
        if (response) return response.clone();
      }
    },
  };
  const fetch = vi.fn(async () => new Response('network'));
  const claim = vi.fn();
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { addEventListener: (name: string, handler: (event: unknown) => void) => handlers.set(name, handler), location: { origin }, clients: { claim }, skipWaiting: vi.fn() },
    caches, fetch, URL, Response, console,
  });
  return { handlers, caches, fetch, claim };
}

describe('installed PWA cache upgrades', () => {
  it('keeps old build chunks for an open app while replacing old HTML', async () => {
    const w = worker();
    const previous = await w.caches.open('jonbranding-v2-icons');
    const oldChunk = new Request(`${origin}/_next/static/chunks/old.js`);
    await previous.put(oldChunk, new Response('old build JS'));
    await previous.put('/', new Response('stale HTML'));
    await w.caches.open('other-app-cache');
    let activation: Promise<unknown> | undefined;
    w.handlers.get('activate')!({ waitUntil: (promise: Promise<unknown>) => { activation = promise; } });
    await activation;
    expect(await (await w.caches.match(oldChunk))?.text()).toBe('old build JS');
    expect(await w.caches.match('/')).toBeUndefined();
    expect(await w.caches.keys()).toContain('other-app-cache');
    expect(w.claim).toHaveBeenCalledOnce();
    let response: Promise<Response> | undefined;
    w.fetch.mockRejectedValueOnce(new Error('old deployment unavailable'));
    w.handlers.get('fetch')!({ request: oldChunk, respondWith: (promise: Promise<Response>) => { response = promise; } });
    expect(await (await response)?.text()).toBe('old build JS');
    expect(w.fetch).not.toHaveBeenCalled();
  });

  it('loads navigation from the network without HTTP cache and retains offline fallback', async () => {
    const w = worker();
    const request = { url: `${origin}/`, method: 'GET', mode: 'navigate' };
    let response: Promise<Response> | undefined;
    w.handlers.get('fetch')!({ request, respondWith: (promise: Promise<Response>) => { response = promise; } });
    expect(await (await response)?.text()).toBe('network');
    expect(w.fetch).toHaveBeenCalledWith(request, { cache: 'no-store' });
    w.fetch.mockRejectedValueOnce(new Error('offline'));
    w.handlers.get('fetch')!({ request, respondWith: (promise: Promise<Response>) => { response = promise; } });
    expect(await (await response)?.text()).toBe('network');
  });

  it('returns a real 503 response for an uncached offline asset', async () => {
    const w = worker();
    w.fetch.mockRejectedValue(new Error('offline'));
    let response: Promise<Response> | undefined;
    w.handlers.get('fetch')!({ request: new Request(`${origin}/_next/static/chunks/missing.js`), respondWith: (promise: Promise<Response>) => { response = promise; } });
    expect((await response)?.status).toBe(503);
  });
});
