import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import { resetOishaAlertThrottle } from '@/lib/oisha-alert-throttle';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));

// `after()` faqat so'rov kontekstida ishlaydi — testda darhol bajaramiz.
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  after: (task: () => unknown) => task(),
}));

// Vidjet beradigan haqiqiy format: `web_` + crypto.randomUUID().
const WEB_USER = 'web_3f2b8c1e-9a4d-4e6f-8b2a-1c5d7e9f0a3b';

const defaultFetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
const fetchMock = vi.fn<typeof fetch>(defaultFetch);

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(defaultFetch);
  delete process.env.OISHA_API_URL;
  delete process.env.OISHA_SECRET_KEY;
  process.env.TELEGRAM_BOT_TOKEN = 'bot-token';
  process.env.TELEGRAM_CHAT_ID = '-100';
  vi.stubGlobal('fetch', fetchMock);
});

describe('Oisha service authentication', () => {
  beforeEach(() => {
    process.env.OISHA_API_URL = 'https://oisha.example';
    process.env.OISHA_SECRET_KEY = 'test-service-key';
    fetchMock.mockImplementation(async (_url, init) => {
      if (new Headers(init?.headers).get('authorization') !== 'Bearer test-service-key') {
        return new Response(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 });
      }
      return new Response(JSON.stringify({ response: 'authenticated', history: [] }), { status: 200 });
    });
  });

  it('authenticates chat messages at the backend service boundary', async () => {
    const response = await send({ user_id: WEB_USER, text: 'Salom' });
    expect(response.status).toBe(200);
    expect((await response.json()).response).toBe('authenticated');
  });

  it('authenticates chat history at the same backend boundary', async () => {
    const { GET } = await import('./route');
    const response = await GET(new Request(`http://localhost/api/oisha?user_id=${WEB_USER}`));
    expect(response.status).toBe(200);
    expect((await response.json()).history).toEqual([]);
  });
});

// Proxy so'rovga secret qo'shadi. Vidjet bermaydigan ID (masalan, Telegram
// foydalanuvchisining raqamli ID'si) backend'ga yetib bormasligi kerak — aks
// holda begona odamning tarixini o'qish yoki uning nomidan yozish mumkin bo'ladi.
describe('Oisha proxy accepts only widget-issued IDs', () => {
  const foreignIds = ['150074828', 'web_abc', 'tg_150074828', `${WEB_USER}x`, 'WEB_3F2B8C1E-9A4D-4E6F-8B2A-1C5D7E9F0A3B'];

  beforeEach(() => {
    process.env.OISHA_API_URL = 'https://oisha.example';
    process.env.OISHA_SECRET_KEY = 'test-service-key';
  });

  it.each(foreignIds)('does not read history for %s', async (userId) => {
    const { GET } = await import('./route');
    const response = await GET(
      new Request(`http://localhost/api/oisha?user_id=${encodeURIComponent(userId)}`),
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(foreignIds)('does not send a message as %s', async (userId) => {
    const response = await send({ user_id: userId, text: 'Salom' });
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
afterEach(() => {
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  delete process.env.TURNSTILE_SECRET_KEY;
  resetOishaAlertThrottle();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

async function send(body: unknown) {
  const { POST } = await import('./route');
  return POST(
    new Request('http://localhost/api/oisha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

function telegramText(): string {
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  return JSON.parse(String(init.body)).text;
}

describe('POST /api/oisha while the assistant is offline', () => {
  it('asks for a phone or Telegram instead of promising a callback it cannot make', async () => {
    const res = await send({ user_id: WEB_USER, text: 'Logo narxi qancha?' });
    expect(res.status).toBe(200);
    expect((await res.json()).response).toBe(uz.oishaWidget.offlineAskContact);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(telegramText()).toContain("kontakt hali yo'q");
  });

  it('confirms the callback once the visitor has left a phone number', async () => {
    const res = await send({ user_id: WEB_USER, text: 'Qo‘ng‘iroq qiling: +998 90 123 45 67' });
    expect((await res.json()).response).toBe(uz.oishaWidget.offlineThanks);
    expect(telegramText()).not.toContain("kontakt hali yo'q");
  });

  it('answers in the visitor language', async () => {
    const res = await send({ user_id: WEB_USER, text: 'Сколько стоит логотип?', lang: 'ru' });
    expect((await res.json()).response).toBe(ru.oishaWidget.offlineAskContact);
  });

  it('escapes HTML so Telegram does not reject the message', async () => {
    await send({ user_id: WEB_USER, text: '<b>salom</b> & rahmat' });
    expect(telegramText()).toContain('&lt;b&gt;salom&lt;/b&gt; &amp; rahmat');
  });

  it('rejects malformed JSON with 400 instead of crashing', async () => {
    const res = await send('{not json');
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/oisha bot defenses', () => {
  it('drops a message when the honeypot is filled, without alerting', async () => {
    const res = await send({ user_id: WEB_USER, text: 'Salom', companyWebsite: 'spam.example' });
    expect(res.status).toBe(200);
    expect((await res.json()).response).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects single-character messages like the "e" flood', async () => {
    const res = await send({ user_id: WEB_USER, text: 'e' });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects with 403 when Turnstile is configured and the token is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    const res = await send({ user_id: WEB_USER, text: 'Logo narxi qancha?' });
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('still alerts a contact follow-up after the IP alert was throttled', async () => {
    await send({ user_id: WEB_USER, text: 'Logo narxi qancha?' });
    await send({ user_id: WEB_USER, text: 'Qo‘ng‘iroq qiling: +998 90 123 45 67' });
    const telegramCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('api.telegram.org'),
    );
    expect(telegramCalls).toHaveLength(2);
  });

  it('sends at most one Telegram alert per IP within the window', async () => {
    await send({ user_id: WEB_USER, text: 'Logo narxi qancha?' });
    await send({ user_id: WEB_USER, text: 'Logo narxi qancha?' });
    const telegramCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('api.telegram.org'),
    );
    expect(telegramCalls).toHaveLength(1);
  });
});
