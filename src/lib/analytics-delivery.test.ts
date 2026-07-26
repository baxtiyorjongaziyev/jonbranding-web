import { describe, expect, it, vi } from 'vitest';
import { runAnalyticsDeliveries } from './analytics-delivery';

const lead = {
  eventId: 'lead_test_1',
  fullName: 'Test Lead',
  phone: '+998901234567',
  totalPrice: 127000,
  source: 'website_contact_form',
  pageLocation: 'https://jonbranding.uz/uz',
};

describe('analytics delivery monitoring', () => {
  it('returns the real delivered, failed and skipped state for every channel', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"events_received":1}', { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 500 }));

    const report = await runAnalyticsDeliveries(lead, {
      fetcher: fetcher as typeof fetch,
      env: {
        META_API_ACCESS_TOKEN: 'meta-secret',
        GA_API_SECRET: 'ga-secret',
        NEXT_PUBLIC_GA_ID: 'G-TEST',
      },
    });

    expect(report.channels.meta).toMatchObject({ state: 'delivered', statusCode: 200 });
    expect(report.channels.ga4).toMatchObject({ state: 'failed', statusCode: 500 });
    expect(report.channels.n8n).toMatchObject({ state: 'skipped', reason: 'not_configured' });
    expect(report.ok).toBe(false);
    expect(report.summary).toEqual({ delivered: 1, failed: 1, skipped: 1 });
  });

  it('does not claim success when every analytics channel is unconfigured', async () => {
    const report = await runAnalyticsDeliveries(lead, {
      fetcher: vi.fn() as unknown as typeof fetch,
      env: {},
    });

    expect(report.ok).toBe(false);
    expect(report.summary).toEqual({ delivered: 0, failed: 0, skipped: 3 });
  });
});
