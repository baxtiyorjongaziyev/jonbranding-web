import { createHmac, randomUUID } from 'node:crypto';
import { safeCompare } from '@/lib/security';

const COOKIE = 'oisha_session';
const TTL_SECONDS = 86400;

/** A visitor cannot select another chat or a Telegram recipient via user_id. */
export function getOishaSession(request: Request, secret: string | undefined) {
  const sign = (value: string) => createHmac('sha256', secret || '').update(value).digest('hex');
  const cookie = (request.headers.get('cookie') || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const parts = cookie?.split('.') || [];
  let id = '';
  let expiry = 0;
  if (secret && parts.length === 3 && /^web_[0-9a-f-]{36}$/.test(parts[0])) {
    const payload = `${parts[0]}.${parts[1]}`;
    if (Number(parts[1]) > Date.now() && safeCompare(parts[2], sign(payload))) {
      id = parts[0];
      expiry = Number(parts[1]);
    }
  }
  if (!id) {
    id = `web_${randomUUID()}`;
    expiry = Date.now() + TTL_SECONDS * 1000;
  }
  return {
    userId: id,
    attach<T extends Response>(response: T): T {
      if (secret) {
        const payload = `${id}.${expiry}`;
        response.headers.append('Set-Cookie', `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL_SECONDS}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`);
      }
      return response;
    },
  };
}
