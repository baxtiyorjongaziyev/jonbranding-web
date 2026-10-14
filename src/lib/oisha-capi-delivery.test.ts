import { describe, expect, it, vi } from 'vitest';
import { runAnalyticsDeliveries } from './analytics-delivery';

const synthetic = {
  eventId: 'synthetic-lead-1', phone: '+998901234567', analyticsConsent: true,
  pageLocation: 'https://jonbranding.uz/contact?email=private#section', userAgent: 'Synthetic/1',
};
const env = { OISHA_CAPI_URL: 'https://oisha.example.test/api/marketing/capi/events',
  OISHA_CAPI_INGEST_SECRET: 'synthetic-secret', META_CAPI_ACCESS_TOKEN: 'synthetic-meta' };

describe('Oisha CAPI server adapter (synthetic only)', () => {
  it('routes once through Oisha and reports queued rather than delivered', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: 'queued', event_id: synthetic.eventId,
    }), { status: 202 }));
    const report = await runAnalyticsDeliveries(synthetic, { env, fetcher });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, request] = fetcher.mock.calls[0];
    expect(String(url)).toBe(env.OISHA_CAPI_URL);
    expect(request.headers.Authorization).toBe('Bearer synthetic-secret');
    expect(request.redirect).toBe('error');
    expect(JSON.parse(request.body)).toMatchObject({
      event_id: synthetic.eventId, event_source_url: 'https://jonbranding.uz/contact', consent: true,
    });
    expect(report.channels.meta.state).toBe('queued');
    expect(report.summary.delivered).toBe(0);
    expect(report.summary.queued).toBe(1);
  });

  it('does not bypass Oisha failure by sending directly to Meta', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
    const report = await runAnalyticsDeliveries(synthetic, { env, fetcher });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(report.channels.meta.state).toBe('failed');
    expect(report.ok).toBe(false);
  });

  it('requires an observed consent cookie', async () => {
    const fetcher = vi.fn();
    const report = await runAnalyticsDeliveries({ ...synthetic, analyticsConsent: false }, { env, fetcher });
    expect(fetcher).not.toHaveBeenCalled();
    expect(report.channels.meta.reason).toBe('consent_required');
  });

  it('rejects partial configuration and unconfirmed receipt', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 202 }));
    const missing = await runAnalyticsDeliveries(synthetic, {
      env: { OISHA_CAPI_URL: env.OISHA_CAPI_URL }, fetcher,
    });
    expect(missing.channels.meta.reason).toBe('oisha_not_configured');
    expect(fetcher).not.toHaveBeenCalled();
    const response = await runAnalyticsDeliveries(synthetic, { env, fetcher });
    expect(response.channels.meta.reason).toBe('oisha_receipt_unconfirmed');
  });
});
