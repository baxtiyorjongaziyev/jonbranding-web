import { validIntakeSession } from './intake-session';

export type HumanEnvironment = {
  OISHA_SECRET_KEY?: string; TURNSTILE_SECRET_KEY?: string; TURNSTILE_SITE_KEY?: string;
  TURNSTILE_ENFORCE?: string;
};
const HUMAN_AGE = 30 * 60 * 1000;
export const humanVerificationRequired = (env: HumanEnvironment) => env.TURNSTILE_ENFORCE === '1';
const intakeId = (request: Request) => request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-jb-intake=\d+\.([0-9a-f-]{36})\./)?.[1];
async function humanSignature(request: Request, secret: string, value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const material = ['jonbranding:human:v1', new URL(request.url).host, value, request.headers.get('cf-connecting-ip') || '', request.headers.get('user-agent') || ''].join('\n');
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(material))), value => value.toString(16).padStart(2, '0')).join('');
}
export async function validHumanSession(request: Request, env: HumanEnvironment, now = Date.now()): Promise<boolean> {
  if (!(await validIntakeSession(request, env, now, 0))) return false;
  const raw = request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-jb-human=(\d{13}\.[0-9a-f-]{36}\.[a-f0-9]{64})(?:;|$)/)?.[1];
  if (!raw || !env.OISHA_SECRET_KEY) return false;
  const [issued, nonce, signature] = raw.split('.');
  if (nonce !== intakeId(request) || now < Number(issued) || now - Number(issued) >= HUMAN_AGE) return false;
  const expected = await humanSignature(request, env.OISHA_SECRET_KEY.trim(), `${issued}.${nonce}`);
  let diff = 0;
  for (let index = 0; index < expected.length; index++) diff |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return diff === 0;
}
export async function humanConfiguration(request: Request, env: HumanEnvironment) {
  if (!humanVerificationRequired(env)) return Response.json({ enabled: false });
  if (!env.TURNSTILE_SITE_KEY?.trim() || !env.TURNSTILE_SECRET_KEY?.trim() || !env.OISHA_SECRET_KEY?.trim()) return Response.json({ error: 'verification_unavailable' }, { status: 503 });
  return Response.json({ enabled: true, siteKey: env.TURNSTILE_SITE_KEY.trim(), verified: await validHumanSession(request, env) });
}
export async function verifyHumanChallenge(request: Request, body: Record<string, unknown>, env: HumanEnvironment) {
  if (!humanVerificationRequired(env) || !env.TURNSTILE_SECRET_KEY?.trim() || !env.TURNSTILE_SITE_KEY?.trim() || !env.OISHA_SECRET_KEY?.trim()) return Response.json({ error: 'verification_unavailable' }, { status: 503 });
  if (!(await validIntakeSession(request, env, Date.now(), 0))) return Response.json({ error: 'reload_required' }, { status: 403 });
  if (typeof body.token !== 'string' || !body.token.trim() || body.token.length > 2048) return Response.json({ error: 'invalid_challenge' }, { status: 400 });
  try {
    const form = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY.trim(), response: body.token.trim(), idempotency_key: crypto.randomUUID() });
    const ip = request.headers.get('cf-connecting-ip');
    if (ip) form.set('remoteip', ip);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return Response.json({ error: 'verification_unavailable' }, { status: 503 });
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string; challenge_ts?: string };
    const age = Date.now() - Date.parse(result.challenge_ts || '');
    if (!result.success || result.hostname !== new URL(request.url).hostname || result.action !== 'website_intake' || !Number.isFinite(age) || age < -30000 || age > 300000) return Response.json({ error: 'invalid_challenge' }, { status: 403 });
    const value = `${Date.now()}.${intakeId(request)}`;
    const signature = await humanSignature(request, env.OISHA_SECRET_KEY.trim(), value);
    return Response.json({ verified: true }, { headers: { 'Set-Cookie': `__Host-jb-human=${value}.${signature}; Path=/; Max-Age=${HUMAN_AGE / 1000}; Secure; HttpOnly; SameSite=Strict`, 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'verification_unavailable' }, { status: 503 }); }
}
