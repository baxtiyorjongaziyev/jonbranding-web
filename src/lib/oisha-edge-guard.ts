import { isChatProbe, readChatBody } from './oisha-input';

type Limiter = { limit(input: { key: string }): Promise<{ success: boolean }> };
type GuardEnv = { OISHA_CHAT_BURST: Limiter; OISHA_CHAT_MINUTE: Limiter };
const blockedOishaUsers = new Set(['web_1a7ae654-dac2-41a0-aedf-b31564803674', 'web_fc166ee6-a3c9-44c6-b3e7-39a64e61a867']);
const reject = (status: number, error: string, retry?: string) =>
  Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store', ...(retry ? { 'Retry-After': retry } : {}) } });

/** Runs before the existing deployed Next handler; unrelated routes pass through. */
export async function guardOishaRequest(request: Request, env: GuardEnv): Promise<Request | Response> {
  let pathname = new URL(request.url).pathname;
  try { pathname = decodeURIComponent(pathname); } catch { return reject(400, 'Invalid path'); }
  if (pathname.replace(/\/+$/, '') !== '/api/oisha' || request.method !== 'POST') return request;
  if (request.headers.get('sec-fetch-site') === 'cross-site') return reject(403, 'Forbidden');
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reject(415, 'JSON required');
  const key = request.headers.get('cf-connecting-ip') || 'unknown';
  try {
    if (!(await env.OISHA_CHAT_BURST.limit({ key })).success) return reject(429, 'Too many requests', '10');
    if (!(await env.OISHA_CHAT_MINUTE.limit({ key })).success) return reject(429, 'Too many requests', '60');
  } catch {
    // Protect downstream notification/cost paths when the protection binding is unavailable.
    return reject(503, 'Chat temporarily unavailable', '10');
  }
  let body: unknown;
  try { body = await readChatBody(request); }
  catch (error) { return reject(error instanceof RangeError ? 413 : 400, 'Invalid request body'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reject(400, 'Invalid request body');
  const { user_id, text } = body as { user_id?: unknown; text?: unknown };
  if (typeof user_id === 'string' && blockedOishaUsers.has(user_id)) return reject(403, 'Forbidden');
  if (typeof user_id !== 'string' || !/^[a-zA-Z0-9_-]{3,80}$/.test(user_id)
    || typeof text !== 'string' || !text.trim()) return reject(400, 'Invalid chat message');
  if (text.length > 1500) return reject(413, 'Text too long');
  if (isChatProbe(text)) return reject(400, 'Invalid chat message');
  return new Request(request, { body: JSON.stringify(body) });
}
