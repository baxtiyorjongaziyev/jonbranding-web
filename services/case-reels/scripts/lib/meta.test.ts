import { describe, expect, it, vi } from 'vitest';
import { igCaption, mockGraph, publishReel, slotOpen, type GraphCall } from './meta';

const noSleep = async () => {};

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
    const r = await publishReel('https://cdn/v.mp4', 'cap', { graph, igUserId: 'ig', sleep: noSleep });
    expect(r).toEqual({ mediaId: 'm1', permalink: 'https://instagram.com/reel/x' });
    expect(graph).toHaveBeenCalledWith('POST', 'ig/media', expect.objectContaining({ media_type: 'REELS', video_url: 'https://cdn/v.mp4' }));
    expect(graph).toHaveBeenCalledWith('POST', 'ig/media_publish', { creation_id: 'c1' });
  });

  it('does not publish when Instagram reports ERROR', async () => {
    const graph = vi.fn<GraphCall>(async (_m, path, params) =>
      path.endsWith('/media') ? { id: 'c1' } : params.fields === 'status_code' ? { status_code: 'ERROR' } : {},
    );
    await expect(publishReel('u', 'c', { graph, igUserId: 'ig', sleep: noSleep })).rejects.toThrow(/ERROR/);
    expect(graph).not.toHaveBeenCalledWith('POST', 'ig/media_publish', expect.anything());
  });

  it('gives up after maxPolls', async () => {
    const graph = vi.fn<GraphCall>(async (_m, path) => (path.endsWith('/media') ? { id: 'c1' } : { status_code: 'IN_PROGRESS' }));
    await expect(publishReel('u', 'c', { graph, igUserId: 'ig', sleep: noSleep, maxPolls: 3 })).rejects.toThrow(/timeout/);
  });

  it('mock graph never touches the network', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const r = await publishReel('u', 'c', { graph: mockGraph(() => {}), igUserId: 'ig', sleep: noSleep });
    expect(r.permalink).toMatch(/mock/);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe('igCaption', () => {
  it('joins text and hashtags', () => expect(igCaption('Salom', ['#a', '#b'])).toBe('Salom\n\n#a #b'));
  it('refuses captions over 2200 chars', () => expect(() => igCaption('x'.repeat(2300), [])).toThrow(/2200/));
});

describe('slotOpen (Tashkent = UTC+5; slots 09/13/19)', () => {
  const at = (utc: string) => new Date(`2026-10-26T${utc}:00Z`);
  it('closed before the first slot', () => expect(slotOpen(at('03:30'), null)).toBe(false)); // 08:30 Toshkent
  it('open at 09:00 when nothing published yet', () => expect(slotOpen(at('04:00'), null)).toBe(true));
  it('closed if already published in this slot', () => expect(slotOpen(at('05:00'), '2026-10-26T04:10:00Z')).toBe(false));
  it('open in the next slot', () => expect(slotOpen(at('08:05'), '2026-10-26T04:10:00Z')).toBe(true)); // 13:05 Toshkent
  it('evening slot after midday post', () => expect(slotOpen(at('14:30'), '2026-10-26T08:05:00Z')).toBe(true)); // 19:30
});
