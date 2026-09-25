import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));

const fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }));

beforeEach(() => {
  process.env.TELEGRAM_BOT_TOKEN = 'bot';
  process.env.TELEGRAM_CHAT_ID = 'chat';
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('POST /api/report-error', () => {
  it('sends an escaped HTML message that fits Telegram limits', async () => {
    const { POST } = await import('./route');
    const res = await POST(
      new Request('http://localhost/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Cannot read property *foo_bar* of <undefined>',
          stack: 'at x_y (file.js:1:1)\n'.repeat(200),
          pathname: '/narxlar',
        }),
      }),
    );
    expect(res.status).toBe(200);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const payload = JSON.parse(String(init.body));
    expect(payload.parse_mode).toBe('HTML');
    expect(payload.text).toContain('&lt;undefined&gt;');
    expect(payload.text.length).toBeLessThan(4096);
  });
});
