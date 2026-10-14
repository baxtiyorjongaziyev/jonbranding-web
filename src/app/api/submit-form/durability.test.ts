import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/amocrm-token', () => ({
  getValidAccessToken: vi.fn().mockRejectedValue(new Error('no token')),
  forceRefresh: vi.fn(),
}));

vi.mock('@/lib/firebase-admin', () => ({
  getDb: vi.fn(),
}));

vi.mock('@/lib/services/lead-queue-service', () => ({
  queueFailedAmoCrmLead: vi.fn().mockResolvedValue(false),
  describeAmoCrmError: vi.fn().mockReturnValue('down'),
}));

const saveLeadToInbox = vi.fn();
const markLeadDelivery = vi.fn();
vi.mock('@/lib/services/lead-inbox', () => ({
  saveLeadToInbox: (...args: unknown[]) => saveLeadToInbox(...args),
  markLeadDelivery: (...args: unknown[]) => markLeadDelivery(...args),
}));

import { POST } from './route';

function submit(eventId = 'lead_test_1') {
  return POST(new Request('http://localhost/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Sardor',
      phone: '90 123 45 67',
      source: 'at_modal',
      lang: 'uz',
      eventId,
    }),
  }));
}

describe('POST /api/submit-form — durable acceptance', () => {
  const originalEnv = process.env;
  const fetchMock = vi.fn(async () => {
    throw new Error('network down');
  });

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      AMOCRM_SUBDOMAIN: 'example',
      TELEGRAM_BOT_TOKEN: 'bot-token',
      TELEGRAM_CHAT_ID: '-100123',
    };
    delete process.env.META_API_ACCESS_TOKEN;
    delete process.env.GA_API_SECRET;
    delete process.env.N8N_WEBHOOK_URL;
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns 503 when every downstream fails and the inbox is unavailable', async () => {
    saveLeadToInbox.mockResolvedValue({ saved: false });

    const response = await submit();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.error).toBe('lead_not_saved');
  });

  it('accepts the lead when it is saved in the inbox even if delivery fails', async () => {
    saveLeadToInbox.mockResolvedValue({ saved: true, duplicate: false, delivered: false });

    const response = await submit();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.saved).toBe(true);
    expect(markLeadDelivery).toHaveBeenCalledWith(
      'lead_test_1',
      expect.objectContaining({ telegram: false, amoCrm: false }),
      1,
    );
  });

  it('does not re-deliver a lead whose eventId was already delivered', async () => {
    saveLeadToInbox.mockResolvedValue({ saved: true, duplicate: true, delivered: true });

    const response = await submit();
    const body = await response.json();

    expect(body).toMatchObject({ ok: true, duplicate: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(markLeadDelivery).not.toHaveBeenCalled();
  });
});
