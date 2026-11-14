type PrivilegedEnvironment = { ADMIN_SECRET?: string; SALES_TEAM_SECRET?: string };

/** Matches the existing server-issued cookies; never treats an intake cookie as authorization. */
export async function verifiedWebsiteRole(request: Request, env: PrivilegedEnvironment, role: 'admin' | 'team' = 'admin', now = Date.now()): Promise<boolean> {
  const cookies = request.headers.get('cookie')?.split(';').map(value => value.trim()) || [];
  const candidates = role === 'team' ? ['admin', 'team'] : ['admin'];
  for (const candidate of candidates) {
    const secret = (candidate === 'admin' ? env.ADMIN_SECRET : env.SALES_TEAM_SECRET)?.trim();
    const raw = cookies.find(value => value.startsWith(`${candidate}_session=`))?.slice(candidate.length + 9);
    if (!secret || !raw || !/^\d{13}\.[a-f0-9]{64}$/.test(raw)) continue;
    const [expires, supplied] = raw.split('.');
    if (Number(expires) <= now || Number(expires) > now + 7 * 24 * 3600_000) continue;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(candidate === 'team' ? `team:${expires}` : expires));
    const expected = Array.from(new Uint8Array(signature), value => value.toString(16).padStart(2, '0')).join('');
    let difference = 0;
    for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ supplied.charCodeAt(index);
    if (!difference) return true;
  }
  return false;
}
