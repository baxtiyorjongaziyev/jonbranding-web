import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockClient = {
  from: vi.fn(),
};

vi.mock('@/lib/supabase/service', () => ({
  getServiceClient: () => ((mockClient as any).__null ? null : mockClient),
}));

import * as store from './store';

function chain(result: unknown) {
  const c: any = {};
  for (const m of ['select', 'insert', 'update', 'eq', 'ilike', 'order', 'limit']) {
    c[m] = vi.fn(() => c);
  }
  c.single = vi.fn(async () => (result as any));
  c.maybeSingle = vi.fn(async () => (result as any));
  c.then = (resolve: any) => Promise.resolve(result).then(resolve);
  return c;
}

beforeEach(() => {
  (mockClient as any).__null = false;
  mockClient.from.mockReset();
});
afterEach(() => vi.clearAllMocks());

describe('store with no supabase client', () => {
  beforeEach(() => {
    (mockClient as any).__null = true;
  });

  it('findAffiliateByPromoCode returns null', async () => {
    await expect(store.findAffiliateByPromoCode('SHERBEK')).resolves.toBeNull();
  });

  it('createAffiliate returns null', async () => {
    await expect(
      store.createAffiliate({ fullName: 'X', phone: '+998900000000', promoCode: 'X', accessToken: 't' }),
    ).resolves.toBeNull();
  });

  it('getAffiliateDashboard returns empty shape', async () => {
    const dash = await store.getAffiliateDashboard('id');
    expect(dash.referrals).toEqual([]);
    expect(dash.payouts).toEqual([]);
    expect(dash.stats.totalReferrals).toBe(0);
  });

  it('listPayouts returns []', async () => {
    await expect(store.listPayouts('all')).resolves.toEqual([]);
  });
});

describe('findAffiliateByPromoCode', () => {
  it('queries affiliates by upper-cased promo_code', async () => {
    const row = {
      id: 'a1',
      full_name: 'Sherbek',
      phone: '+998900000000',
      telegram_username: null,
      promo_code: 'SHERBEK',
      access_token: 'tok',
      created_at: '2026-09-04T00:00:00Z',
    };
    const c = chain({ data: row, error: null });
    mockClient.from.mockReturnValue(c);

    const result = await store.findAffiliateByPromoCode('sherbek');
    expect(mockClient.from).toHaveBeenCalledWith('affiliates');
    expect(c.eq).toHaveBeenCalledWith('promo_code', 'SHERBEK');
    expect(result).toEqual({
      id: 'a1',
      fullName: 'Sherbek',
      phone: '+998900000000',
      telegramUsername: null,
      promoCode: 'SHERBEK',
      accessToken: 'tok',
      createdAt: '2026-09-04T00:00:00Z',
    });
  });

  it('returns null on error', async () => {
    const c = chain({ data: null, error: { message: 'boom' } });
    mockClient.from.mockReturnValue(c);
    await expect(store.findAffiliateByPromoCode('x')).resolves.toBeNull();
  });
});

describe('createPayoutIfAbsent', () => {
  it('inserts with the resolved amount and ignores unique-violation', async () => {
    const c = chain({ data: null, error: { code: '23505', message: 'duplicate key' } });
    mockClient.from.mockReturnValue(c);
    const result = await store.createPayoutIfAbsent({ referralId: 'r1', affiliateId: 'a1', service: 'logo' });
    expect(c.insert).toHaveBeenCalledWith(
      expect.objectContaining({ referral_id: 'r1', affiliate_id: 'a1', service: 'logo', amount: 500_000, paid: false }),
    );
    expect(result).toBeNull(); // dublikat — yangi qator yoʻq
  });
});
