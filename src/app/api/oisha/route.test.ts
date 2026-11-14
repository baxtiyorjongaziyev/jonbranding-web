import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import { rateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(async () => true),
  getClientIp: () => 'ip',
}));

// `after()` faqat so'rov kontekstida ishlaydi — testda darhol bajaramiz.
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  after: (task: () => unknown) => task(),
}));

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
    const response = await send({ user_id: 'web_auth_test', text: 'Salom' });
    expect(response.status).toBe(200);
    expect((await response.json()).response).toBe('authenticated');
  });

  it('authenticates chat history at the same backend boundary', async () => {
    const { GET } = await import('./route');
    const response = await GET(new Request('http://localhost/api/oisha?user_id=web_auth_test'));
    expect(response.status).toBe(200);
    expect((await response.json()).history).toEqual([]);
  });

  it('never forwards a caller-selected Telegram recipient to the backend', async () => {
    await send({ user_id: '123456789', text: 'Salom' });
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(init?.body));
    expect(body.user_id).toMatch(/^web_[0-9a-f-]{36}$/);
    expect(body.user_id).not.toBe('123456789');
  });

  it('never reads history for the caller-selected identity', async () => {
    const { GET } = await import('./route');
    await GET(new Request('https://example.com/api/oisha?user_id=123456789'));
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/chat\/history\/web_[0-9a-f-]{36}$/);
  });
});
afterEach(() => {
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
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
  it.each(["';print(md5(31337));$a='", '";print(md5(31337));$a="', '${@print(md5(31337))}', 'e', 'Testing', '1}dfb{{98991*97996}}xca'])('rejects scanner payload %s before any external call', async (text) => {
    const res = await send({ user_id: 'web_abc', text });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks the known abusive scanner user_id on GET and POST', async () => {
    const { GET } = await import('./route');
    expect((await GET(new Request('http://localhost/api/oisha?user_id=web_1a7ae654-dac2-41a0-aedf-b31564803674'))).status).toBe(403);
    expect((await send({ user_id: 'web_1a7ae654-dac2-41a0-aedf-b31564803674', text: 'Salom' })).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([null, [], 42])('rejects invalid object %s', async (body) => {
    expect((await send(body)).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects oversized streams without Content-Length', async () => {
    expect((await send({ user_id: 'web_abc', text: 'a'.repeat(9000) })).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stops bursts before forwarding and returns retry guidance', async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce(false);
    const res = await send({ user_id: 'web_abc', text: 'Salom' });
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('10');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks for a phone or Telegram instead of promising a callback it cannot make', async () => {
    const res = await send({ user_id: 'web_abc', text: 'Logo narxi qancha?' });
    expect(res.status).toBe(200);
    expect((await res.json()).response).toBe(uz.oishaWidget.offlineAskContact);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(telegramText()).toContain("kontakt hali yo'q");
  });

  it('confirms the callback once the visitor has left a phone number', async () => {
    const res = await send({ user_id: 'web_abc', text: 'Qo‘ng‘iroq qiling: +998 90 123 45 67' });
    expect((await res.json()).response).toBe(uz.oishaWidget.offlineThanks);
    expect(telegramText()).not.toContain("kontakt hali yo'q");
  });

  it('answers in the visitor language', async () => {
    const res = await send({ user_id: 'web_abc', text: 'Сколько стоит логотип?', lang: 'ru' });
    expect((await res.json()).response).toBe(ru.oishaWidget.offlineAskContact);
  });

  it('escapes HTML so Telegram does not reject the message', async () => {
    await send({ user_id: 'web_abc', text: '<b>salom</b> & rahmat' });
    expect(telegramText()).toContain('&lt;b&gt;salom&lt;/b&gt; &amp; rahmat');
  });

  it('rejects malformed JSON with 400 instead of crashing', async () => {
    const res = await send('{not json');
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
