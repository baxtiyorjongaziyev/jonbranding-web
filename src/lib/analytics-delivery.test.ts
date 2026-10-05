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

  it('surfaces the Meta Graph API error body without leaking the token', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({
      error: {
        message: 'Error validating access token: Session has expired. access_token=meta-secret {"access_token":"meta-secret"}',
        type: 'OAuthException',
        code: 190,
        error_subcode: 463,
      },
    }), { status: 400 }));

    const report = await runAnalyticsDeliveries(lead, {
      fetcher: fetcher as typeof fetch,
      env: { META_CAPI_ACCESS_TOKEN: 'meta-secret' },
    });

    expect(report.channels.meta.state).toBe('failed');
    expect(report.channels.meta.reason).toContain('OAuthException code=190 subcode=463');
    expect(report.channels.meta.reason).not.toContain('meta-secret');
  });

  it('sends a clean Meta payload: numeric value, no empty arrays, valid fbc only', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));

    await runAnalyticsDeliveries(
      { ...lead, fullName: '', fbp: 'fb.1.1791182326681.123456789', fbc: 'garbage', pageLocation: '' },
      { fetcher: fetcher as typeof fetch, env: { META_CAPI_ACCESS_TOKEN: 't', META_TEST_EVENT_CODE: 'TEST1' } },
    );

    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    const event = body.data[0];
    expect(body.test_event_code).toBe('TEST1');
    expect(event.custom_data.value).toBe(10);
    expect(event.user_data.fn).toBeUndefined();
    expect(event.user_data.ph).toHaveLength(1);
    expect(event.user_data.fbp).toBe('fb.1.1791182326681.123456789');
    expect(event.user_data.fbc).toBeUndefined();
    expect(event.event_source_url).toBeUndefined();
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
