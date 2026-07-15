import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/amocrm-token', () => ({
  getValidAccessToken: vi.fn().mockResolvedValue('access-token'),
  forceRefresh: vi.fn(),
}));

vi.mock('@/lib/firebase-admin', () => ({
  getDb: vi.fn(),
}));

import { POST } from './route';

function apiResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('POST /api/submit-form', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      AMOCRM_SUBDOMAIN: 'example',
      TELEGRAM_BOT_TOKEN: 'bot-token',
      TELEGRAM_CHAT_ID: '-100123',
      TELEGRAM_MESSAGE_THREAD_ID: '42',
    };
    delete process.env.META_API_ACCESS_TOKEN;
    delete process.env.GA_API_SECRET;
    delete process.env.N8N_WEBHOOK_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('starts Telegram and AmoCRM delivery in parallel', async () => {
    let resolveTelegram!: (response: Response) => void;
    const telegramResponse = new Promise<Response>((resolve) => {
      resolveTelegram = resolve;
    });

    const fetchMock = vi.fn((input: string | URL | Request, _init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith('https://api.telegram.org/')) return telegramResponse;
      if (url.endsWith('/api/v4/leads/complex')) {
        return Promise.resolve(apiResponse([{ id: 101, contact_id: 202, merged: false }]));
      }
      if (url.endsWith('/api/v4/leads/101/notes')) {
        return Promise.resolve(apiResponse({ ok: true }));
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const responsePromise = POST(new Request('http://localhost/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Sardor',
        phone: '90 123 45 67',
        telegram: '@Sardor',
        source: 'at_modal',
        lang: 'ru',
      }),
    }));

    await vi.waitFor(() => {
      expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/api/v4/leads/complex'))).toBe(true);
    });

    resolveTelegram(apiResponse({ ok: true }));
    const response = await responsePromise;
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.integrations).toMatchObject({ telegram: true, amoCrm: true });

    const telegramCall = fetchMock.mock.calls.find(([url]) => String(url).startsWith('https://api.telegram.org/'));
    const telegramPayload = JSON.parse(String(telegramCall?.[1]?.body));
    expect(telegramPayload).toMatchObject({ chat_id: '-100123', message_thread_id: 42 });

    const amoCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/api/v4/leads/complex'));
    const amoPayload = JSON.parse(String(amoCall?.[1]?.body));
    expect(amoPayload[0]._embedded.contacts[0].custom_fields_values[0]).toEqual({
      field_code: 'PHONE',
      values: [{ value: '+998901234567', enum_code: 'MOB' }],
    });
  });
});
