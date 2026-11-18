import { afterEach, describe, expect, it, vi } from 'vitest';

const { revalidateTagMock, revalidatePathMock } = vi.hoisted(() => ({
  revalidateTagMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidateTag: revalidateTagMock,
  revalidatePath: revalidatePathMock,
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

const ORIGINAL_REVALIDATE = process.env.REVALIDATE_SECRET;
const ORIGINAL_CRON = process.env.CRON_SECRET;

afterEach(() => {
  revalidateTagMock.mockReset();
  revalidatePathMock.mockReset();
  process.env.REVALIDATE_SECRET = ORIGINAL_REVALIDATE;
  process.env.CRON_SECRET = ORIGINAL_CRON;
});

function postRevalidate(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest('https://jonbranding.uz/api/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

describe('POST /api/revalidate', () => {
  it('returns 401 without valid secret', async () => {
    process.env.REVALIDATE_SECRET = 'secret-123';
    const res = await postRevalidate({ _type: 'portfolio' });
    expect(res.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it('revalidates Sanity type tag in a single tag call when authenticated', async () => {
    process.env.REVALIDATE_SECRET = 'secret-123';
    const res = await postRevalidate(
      { _type: 'portfolio', slug: { current: 'savod' } },
      { 'x-sanity-webhook-secret': 'secret-123' },
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.tags).toEqual(['sanity:portfolio']);
    expect(json.paths).toEqual([]);
    expect(revalidateTagMock).toHaveBeenCalledWith('sanity:portfolio', 'max');
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it('accepts CRON_SECRET via Bearer header and caps optional explicit paths', async () => {
    process.env.CRON_SECRET = 'cron-456';
    const res = await postRevalidate(
      { _type: 'post', paths: ['/uz/blog/yangi-maqola', '/feed.xml'] },
      { authorization: 'Bearer cron-456' },
    );
    expect(res.status).toBe(200);
    expect(revalidateTagMock).toHaveBeenCalledWith('sanity:post', 'max');
    expect(revalidatePathMock).toHaveBeenCalledWith('/uz/blog/yangi-maqola', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/feed.xml', 'page');
  });
});
