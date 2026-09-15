import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => '1.2.3.4',
}));

const storeMocks = {
  findAffiliateByPromoCode: vi.fn(),
};
vi.mock('@/lib/affiliate/store', () => storeMocks);

beforeEach(() => {
  vi.clearAllMocks();
});

async function callValidate(body: unknown) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/affiliate/validate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
}

describe('POST /api/affiliate/validate-code', () => {
  it('returns valid:true for a known affiliate code, without leaking affiliate details', async () => {
    storeMocks.findAffiliateByPromoCode.mockResolvedValue({
      id: 'a1',
      fullName: 'Sherbek',
      phone: '+998900000000',
      telegramUsername: null,
      promoCode: 'SHERBEK',
      accessToken: 'tok_abc',
      createdAt: '2026-09-04T00:00:00Z',
    });
    const res = await callValidate({ code: 'sherbek' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, valid: true });
    expect(json).not.toHaveProperty('accessToken');
    expect(json).not.toHaveProperty('phone');
    expect(storeMocks.findAffiliateByPromoCode).toHaveBeenCalledWith('SHERBEK');
  });

  it('returns valid:false for an unknown code', async () => {
    storeMocks.findAffiliateByPromoCode.mockResolvedValue(null);
    const res = await callValidate({ code: 'NOTREAL' });
    const json = await res.json();
    expect(json).toEqual({ ok: true, valid: false });
  });

  it('returns valid:false for empty/missing code without querying the store', async () => {
    const res = await callValidate({ code: '' });
    const json = await res.json();
    expect(json).toEqual({ ok: true, valid: false });
    expect(storeMocks.findAffiliateByPromoCode).not.toHaveBeenCalled();
  });

  it('fails closed (valid:false, still 200) when the store throws', async () => {
    storeMocks.findAffiliateByPromoCode.mockRejectedValue(new Error('db down'));
    const res = await callValidate({ code: 'SHERBEK' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, valid: false });
  });

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = await import('@/lib/rate-limit');
    (rateLimit as any).mockResolvedValueOnce(false);
    const res = await callValidate({ code: 'SHERBEK' });
    expect(res.status).toBe(429);
  });

  it('rejects malformed JSON', async () => {
    const { POST } = await import('./route');
    const res = await POST(
      new Request('http://localhost/api/affiliate/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{not json',
      }),
    );
    expect(res.status).toBe(400);
  });
});
