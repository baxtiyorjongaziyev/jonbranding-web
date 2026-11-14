import { describe, expect, it, vi } from 'vitest';
import { guardOishaRequest } from './oisha-edge-guard';

function env() { return { OISHA_CHAT_BURST: { limit: vi.fn(async () => ({ success: true })) }, OISHA_CHAT_MINUTE: { limit: vi.fn(async () => ({ success: true })) } }; }
function req(body: unknown, headers = {}, url = 'https://jonbranding.uz/api/oisha') {
  return new Request(url, { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1', ...headers }, body: JSON.stringify(body) });
}
describe('deployed Oisha edge guard', () => {
  it.each(["';print(md5(31337));$a='", '";print(md5(31337));$a="', '${@print(md5(31337))}', 'e', 'Testing', '1}dfb{{98991*97996}}xca'])('blocks observed scanner input %s', async text => {
    expect((await guardOishaRequest(req({ user_id: 'web_test', text }), env()) as Response).status).toBe(400);
  });
  it('blocks the known abusive scanner user_id', async () => {
    expect((await guardOishaRequest(req({ user_id: 'web_1a7ae654-dac2-41a0-aedf-b31564803674', text: 'Salom' }), env()) as Response).status).toBe(403);
  });
  it('preserves valid chat body and headers for the original handler', async () => {
    const body = { user_id: 'web_test', text: "O‘zbekcha logo kerak", lang: 'uz' };
    const result = await guardOishaRequest(req(body), env()) as Request;
    expect(await result.json()).toEqual(body);
    expect(result.headers.get('cf-connecting-ip')).toBe('192.0.2.1');
  });
  it('leaves other endpoints untouched', async () => {
    const request = req({}, {}, 'https://jonbranding.uz/api/submit-form');
    const bindings = env();
    expect(await guardOishaRequest(request, bindings)).toBe(request);
    expect(bindings.OISHA_CHAT_BURST.limit).not.toHaveBeenCalled();
  });
  it('blocks bursts using the connecting IP', async () => {
    const bindings = env(); bindings.OISHA_CHAT_BURST.limit.mockResolvedValue({ success: false });
    const result = await guardOishaRequest(req({}), bindings) as Response;
    expect(result.status).toBe(429); expect(result.headers.get('retry-after')).toBe('10');
    expect(bindings.OISHA_CHAT_BURST.limit).toHaveBeenCalledWith({ key: '192.0.2.1' });
  });
  it('enforces minute quota independently', async () => {
    const bindings = env(); bindings.OISHA_CHAT_MINUTE.limit.mockResolvedValue({ success: false });
    expect((await guardOishaRequest(req({}), bindings) as Response).status).toBe(429);
  });
  it('rejects oversized streamed input', async () => {
    expect((await guardOishaRequest(req({ text: 'a'.repeat(9000) }), env()) as Response).status).toBe(413);
  });
  it.each([null, [], 42])('rejects malformed schema %s', async body => {
    expect((await guardOishaRequest(req(body), env()) as Response).status).toBe(400);
  });
  it('blocks cross-site browser requests', async () => {
    expect((await guardOishaRequest(req({}, { 'sec-fetch-site': 'cross-site' }), env()) as Response).status).toBe(403);
  });
  it('fails closed when rate limiting is unavailable', async () => {
    const bindings = env(); bindings.OISHA_CHAT_BURST.limit.mockRejectedValue(new Error('offline'));
    expect((await guardOishaRequest(req({}), bindings) as Response).status).toBe(503);
  });
});
