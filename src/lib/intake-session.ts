const INTAKE_COOKIE = '__Host-jb-intake';
const SESSION_AGE_SECONDS = 6 * 60 * 60;
type IntakeEnvironment = { OISHA_SECRET_KEY?: string };

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, '0')).join('');
}

async function signature(request: Request, secret: string, value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const material = ['jonbranding:intake:v1', new URL(request.url).host, value,
    request.headers.get('cf-connecting-ip') || '', request.headers.get('user-agent') || ''].join('\n');
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(material)));
}

export async function validIntakeSession(request: Request, env: IntakeEnvironment, now = Date.now(), minimumAge = 2000): Promise<boolean> {
  const secret = env.OISHA_SECRET_KEY?.trim();
  const raw = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${INTAKE_COOKIE}=`))?.slice(INTAKE_COOKIE.length + 1);
  if (!secret || !raw || !/^\d{13}\.[0-9a-f-]{36}\.[0-9a-f]{64}$/.test(raw)) return false;
  const [issued, nonce, sig] = raw.split('.');
  const age = now - Number(issued);
  if (age < minimumAge || age > SESSION_AGE_SECONDS * 1000) return false;
  const expected = await signature(request, secret, `${issued}.${nonce}`);
  let difference = expected.length ^ sig.length;
  for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ sig.charCodeAt(index);
  return difference === 0;
}

/** Set only on HTML documents, never cached/shared between visitors. No frontend change required. */
export async function attachIntakeSession(request: Request, response: Response, env: IntakeEnvironment, now = Date.now()): Promise<Response> {
  if (request.method !== 'GET' || !response.headers.get('content-type')?.includes('text/html')
    || response.status >= 400 || !env.OISHA_SECRET_KEY?.trim()) return response;
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('CDN-Cache-Control', 'no-store');
  if (!(await validIntakeSession(request, env, now, 0))) {
    const value = `${now}.${crypto.randomUUID()}`;
    const sig = await signature(request, env.OISHA_SECRET_KEY.trim(), value);
    headers.append('Set-Cookie', `${INTAKE_COOKIE}=${value}.${sig}; Path=/; Max-Age=${SESSION_AGE_SECONDS}; Secure; HttpOnly; SameSite=Strict`);
  }
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
