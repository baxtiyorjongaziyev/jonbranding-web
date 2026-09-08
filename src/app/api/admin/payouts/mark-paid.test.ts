import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));
const storeMock = { markPayoutPaid: vi.fn(async () => {}) };
vi.mock('@/lib/affiliate/store', () => storeMock);

let validCookie = '';
beforeEach(async () => {
  process.env.ADMIN_SECRET = 'sekret';
  const { createAdminSession } = await import('@/lib/admin/auth');
  validCookie = `admin_session=${createAdminSession()}`;
  vi.clearAllMocks();
});
afterEach(() => {
  delete process.env.ADMIN_SECRET;
});

async function markPaid(id: string, cookie?: string) {
  const { POST } = await import('./[id]/mark-paid/route');
  return POST(
    new Request(`http://localhost/api/admin/payouts/${id}/mark-paid`, {
      method: 'POST',
      headers: cookie ? { cookie } : {},
    }),
    { params: Promise.resolve({ id }) },
  );
}

describe('POST /api/admin/payouts/[id]/mark-paid', () => {
  it('marks paid with a valid session', async () => {
    const res = await markPaid('p1', validCookie);
    expect(res.status).toBe(200);
    expect(storeMock.markPayoutPaid).toHaveBeenCalledWith('p1');
  });

  it('rejects without a session', async () => {
    const res = await markPaid('p1');
    expect(res.status).toBe(401);
    expect(storeMock.markPayoutPaid).not.toHaveBeenCalled();
  });

  it('rejects a tampered session', async () => {
    const res = await markPaid('p1', 'admin_session=123.deadbeef');
    expect(res.status).toBe(401);
  });
});
