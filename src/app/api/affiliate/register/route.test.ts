import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => '1.2.3.4',
}));

const storeMocks = {
  findAffiliateByPhone: vi.fn(),
  isPromoCodeTaken: vi.fn(async () => false),
  createAffiliate: vi.fn(),
};
vi.mock('@/lib/affiliate/store', () => storeMocks);

// Telegram fetch — no-op
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  storeMocks.findAffiliateByPhone.mockResolvedValue(null);
  storeMocks.isPromoCodeTaken.mockResolvedValue(false);
  storeMocks.createAffiliate.mockResolvedValue({
    id: 'a1',
    fullName: 'Sherbek',
    phone: '+998901234567',
    telegramUsername: null,
    promoCode: 'SHERBEK',
    accessToken: 'tok_abc',
    createdAt: '2026-09-04T00:00:00Z',
  });
  global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as any;
});
afterEach(() => {
  global.fetch = originalFetch;
});

async function callRegister(body: unknown) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/affiliate/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
}

describe('POST /api/affiliate/register', () => {
  it('creates a new affiliate and returns promo code + access url', async () => {
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, promoCode: 'SHERBEK', accessUrl: '/hamkor/tok_abc' });
    expect(storeMocks.createAffiliate).toHaveBeenCalledOnce();
  });

  it('returns the existing affiliate on duplicate phone (no new row)', async () => {
    storeMocks.findAffiliateByPhone.mockResolvedValue({
      id: 'a0',
      fullName: 'Sherbek',
      phone: '+998901234567',
      telegramUsername: null,
      promoCode: 'SHERBEKOLD',
      accessToken: 'tok_old',
      createdAt: '2026-01-01T00:00:00Z',
    });
    const res = await callRegister({ fullName: 'Sherbek', phone: '901234567' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, promoCode: 'SHERBEKOLD', accessUrl: '/hamkor/tok_old' });
    expect(storeMocks.createAffiliate).not.toHaveBeenCalled();
  });

  it('rejects invalid input', async () => {
    const res = await callRegister({ fullName: 'A', phone: 'nope' });
    expect(res.status).toBe(400);
  });

  it('returns 503 when supabase is unavailable', async () => {
    storeMocks.createAffiliate.mockResolvedValue(null);
    storeMocks.findAffiliateByPhone.mockResolvedValue(null);
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(503);
  });

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = await import('@/lib/rate-limit');
    (rateLimit as any).mockResolvedValueOnce(false);
    const res = await callRegister({ fullName: 'Sherbek Aliyev', phone: '901234567' });
    expect(res.status).toBe(429);
  });
});
