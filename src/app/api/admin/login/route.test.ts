import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));

beforeEach(() => {
  process.env.ADMIN_SECRET = 'top-secret-value';
});
afterEach(() => {
  delete process.env.ADMIN_SECRET;
  vi.clearAllMocks();
});

async function login(secret: string) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    }),
  );
}

describe('POST /api/admin/login', () => {
  it('sets a session cookie for the correct secret', async () => {
    const res = await login('top-secret-value');
    expect(res.status).toBe(200);
    const cookie = res.headers.get('set-cookie') || '';
    expect(cookie).toMatch(/admin_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('rejects a wrong secret with 401 and no cookie', async () => {
    const res = await login('wrong');
    expect(res.status).toBe(401);
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('rejects when ADMIN_SECRET is unset', async () => {
    delete process.env.ADMIN_SECRET;
    const res = await login('anything');
    expect(res.status).toBe(401);
  });
});
