import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => '1.2.3.4',
}));

const storeMock = {
  findReferralByLeadId: vi.fn(),
  markReferralWon: vi.fn(async () => {}),
  markReferralLost: vi.fn(async () => {}),
  createPayoutIfAbsent: vi.fn(async () => ({ id: 'p1', amount: 800_000 })),
};
vi.mock('@/lib/affiliate/store', () => storeMock);

const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.AMOCRM_WEBHOOK_SECRET = 'secret';
  process.env.TELEGRAM_BOT_TOKEN = 'bot';
  process.env.TELEGRAM_CHAT_ID = 'chat';
  process.env.AMOCRM_WON_STATUS_ID = '142';
  process.env.AMOCRM_LOST_STATUS_ID = '143';
  global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as any;
  storeMock.findReferralByLeadId.mockResolvedValue({
    id: 'ref-1',
    affiliateId: 'aff-1',
    status: 'new',
    serviceHint: 'Logo VIP + Packaging',
    amocrmLeadId: 555,
    leadName: 'X',
    leadPhone: '+998900000000',
    createdAt: '2026-09-04T00:00:00Z',
    wonAt: null,
  });
});
afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.AMOCRM_WON_STATUS_ID;
  delete process.env.AMOCRM_LOST_STATUS_ID;
});

async function callWebhook(body: unknown) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/amocrm-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-jonbranding-webhook-secret': 'secret' },
      body: JSON.stringify(body),
    }),
  );
}

describe('amocrm-webhook affiliate payout', () => {
  it('marks referral won and creates a payout on won status', async () => {
    const res = await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(res.status).toBe(200);
    expect(storeMock.markReferralWon).toHaveBeenCalledWith('ref-1');
    expect(storeMock.createPayoutIfAbsent).toHaveBeenCalledWith({
      referralId: 'ref-1',
      affiliateId: 'aff-1',
      service: 'packaging', // Logo+Packaging → eng qimmati
    });
  });

  it('is idempotent — already-won referral does not re-pay', async () => {
    storeMock.findReferralByLeadId.mockResolvedValue({
      id: 'ref-1',
      affiliateId: 'aff-1',
      status: 'won',
      serviceHint: 'logo',
      amocrmLeadId: 555,
      leadName: 'X',
      leadPhone: 'x',
      createdAt: 'x',
      wonAt: '2026-09-04T01:00:00Z',
    });
    await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(storeMock.markReferralWon).not.toHaveBeenCalled();
    expect(storeMock.createPayoutIfAbsent).not.toHaveBeenCalled();
  });

  it('marks referral lost on lost status, no payout', async () => {
    await callWebhook({ leads: { status: [{ id: 555, status_id: 143 }] } });
    expect(storeMock.markReferralLost).toHaveBeenCalledWith('ref-1');
    expect(storeMock.createPayoutIfAbsent).not.toHaveBeenCalled();
  });

  it('does nothing affiliate-related for an unrelated lead', async () => {
    storeMock.findReferralByLeadId.mockResolvedValue(null);
    const res = await callWebhook({ leads: { status: [{ id: 999, status_id: 142 }] } });
    expect(res.status).toBe(200);
    expect(storeMock.markReferralWon).not.toHaveBeenCalled();
  });

  it('still returns 200 when the store throws', async () => {
    storeMock.findReferralByLeadId.mockRejectedValue(new Error('db down'));
    const res = await callWebhook({ leads: { status: [{ id: 555, status_id: 142 }] } });
    expect(res.status).toBe(200);
  });
});
