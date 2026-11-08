import { describe, expect, it, vi } from 'vitest';
import { igCaption, mockGraph, publishReel, slotKey, type GraphCall, type PublishDeps } from './meta';

const noSleep = async () => {};
const base = (graph: GraphCall, over: Partial<PublishDeps> = {}): PublishDeps => ({
  graph, igUserId: 'ig', sleep: noSleep, stillClaimed: async () => true, onPublished: async () => {}, ...over,
});

describe('publishReel', () => {
  it('creates a REELS container, waits for FINISHED, publishes and returns the permalink', async () => {
    const statuses = ['IN_PROGRESS', 'FINISHED'];
    const graph = vi.fn<GraphCall>(async (method, path, params) => {
      if (path === 'ig/media') return { id: 'c1' };
      if (params.fields === 'status_code') return { status_code: statuses.shift() };
      if (path === 'ig/media_publish') return { id: 'm1' };
      if (params.fields === 'permalink') return { permalink: 'https://instagram.com/reel/x' };
      throw new Error(`unexpected ${method} ${path}`);
    });
    const r = await publishReel('https://cdn/v.mp4', 'cap', base(graph));
    expect(r).toEqual({ mediaId: 'm1', permalink: 'https://instagram.com/reel/x' });
    expect(graph).toHaveBeenCalledWith('POST', 'ig/media', expect.objectContaining({ media_type: 'REELS', video_url: 'https://cdn/v.mp4' }));
    expect(graph).toHaveBeenCalledWith('POST', 'ig/media_publish', { creation_id: 'c1' });
  });

  it('does not publish when Instagram reports ERROR', async () => {
    const graph = vi.fn<GraphCall>(async (_m, path, params) =>
      path.endsWith('/media') ? { id: 'c1' } : params.fields === 'status_code' ? { status_code: 'ERROR' } : {},
    );
    await expect(publishReel('u', 'c', base(graph))).rejects.toThrow(/ERROR/);
    expect(graph).not.toHaveBeenCalledWith('POST', 'ig/media_publish', expect.anything());
  });

  it('gives up after maxPolls', async () => {
    const graph = vi.fn<GraphCall>(async (_m, path) => (path.endsWith('/media') ? { id: 'c1' } : { status_code: 'IN_PROGRESS' }));
    await expect(publishReel('u', 'c', base(graph, { maxPolls: 3 }))).rejects.toThrow(/timeout/);
  });

  it('mock graph never touches the network', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const r = await publishReel('u', 'c', base(mockGraph(() => {})));
    expect(r.permalink).toMatch(/mock/);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe('publishReel safety', () => {
  const ok: GraphCall = async (_m, path, params) =>
    path.endsWith('/media') ? { id: 'c1' } : params.fields === 'status_code' ? { status_code: 'FINISHED' }
    : path.endsWith('/media_publish') ? { id: 'm1' } : { permalink: 'p' };

  it('does not publish if the claim was lost (e.g. owner rejected)', async () => {
    const graph = vi.fn(ok);
    await expect(publishReel('u', 'c', base(graph, { stillClaimed: async () => false }))).rejects.toThrow();
    expect(graph).not.toHaveBeenCalledWith('POST', 'ig/media_publish', expect.anything());
  });

  it('records the media id before the permalink lookup, and survives a permalink failure', async () => {
    const order: string[] = [];
    const graph: GraphCall = async (m, path, params) => {
      if (params.fields === 'permalink') { order.push('permalink'); throw new Error('timeout'); }
      return ok(m, path, params);
    };
    const r = await publishReel('u', 'c', base(graph, { onPublished: async (id) => { order.push(`saved:${id}`); } }));
    expect(order).toEqual(['saved:m1', 'permalink']);
    expect(r).toEqual({ mediaId: 'm1', permalink: null });
  });
});

describe('igCaption', () => {
  it('joins text and hashtags', () => expect(igCaption('Salom', ['#a', '#b'])).toBe('Salom\n\n#a #b'));
  it('refuses captions over 2200 chars', () => expect(() => igCaption('x'.repeat(2300), [])).toThrow(/2200/));
});

describe('slotKey (Tashkent = UTC+5; slots 09/13/19)', () => {
  const at = (iso: string) => new Date(iso);
  it('null before the first slot', () => expect(slotKey(at('2026-10-26T03:30:00Z'))).toBeNull()); // 08:30
  it('morning slot', () => expect(slotKey(at('2026-10-26T04:00:00Z'))).toBe('2026-10-26T09'));
  it('midday slot', () => expect(slotKey(at('2026-10-26T08:05:00Z'))).toBe('2026-10-26T13'));
  it('evening slot', () => expect(slotKey(at('2026-10-26T14:30:00Z'))).toBe('2026-10-26T19'));
  it('after Tashkent midnight it is the next day, before its first slot', () => expect(slotKey(at('2026-10-26T19:30:00Z'))).toBeNull());
});
