import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('blog-agent Sanity write configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('fails before generation with an actionable error when write token is missing', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    vi.stubEnv('SANITY_API_WRITE_TOKEN', '');
    const { GET } = await import('./route');
    const request = new NextRequest('https://example.com/api/blog-agent', {
      headers: { Authorization: 'Bearer cron-secret' },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: {
        code: 'SANITY_WRITE_TOKEN_MISSING',
        message: 'Sanity yozish tokeni sozlanmagan.',
        hint: expect.stringContaining('SANITY_API_WRITE_TOKEN'),
      },
    });
  });
});
