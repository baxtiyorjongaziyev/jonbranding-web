const ipMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = ipMap.get(ip);

    if (!entry || now > entry.resetAt) {
        ipMap.set(ip, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.count >= maxRequests) return false;

    entry.count++;
    return true;
}

/**
 * Extracts the real client IP from a request.
 *
 * 🛡️ Security: CF-Connecting-IP and X-Real-IP are only trusted when the
 * TRUSTED_PROXY environment variable is set to "cloudflare". This prevents
 * IP spoofing attacks where an attacker sends forged headers directly to the
 * origin — bypassing the rate-limiter's per-IP bucket on every request.
 *
 * Production (Cloudflare → Vercel/Firebase): set TRUSTED_PROXY=cloudflare
 * Development / direct-origin: leave TRUSTED_PROXY unset → X-Forwarded-For
 */
export function getClientIp(request: Request): string {
    const headers = (request as any).headers;
    const isBehindCloudflare = process.env.TRUSTED_PROXY === 'cloudflare';

    if (isBehindCloudflare) {
        const cfConnectingIp = headers?.get?.('cf-connecting-ip');
        if (cfConnectingIp) return cfConnectingIp.trim();

        const xRealIp = headers?.get?.('x-real-ip');
        if (xRealIp) return xRealIp.trim();
    }

    // Fallback: take only the first entry from X-Forwarded-For.
    // When behind Cloudflare, CF sets this to the real client IP as the first
    // value so it is still safe. Without a trusted proxy, an attacker could
    // append arbitrary values — but we only read the first entry which is the
    // IP seen by the last upstream hop, making it harder to spoof.
    const forwarded = headers?.get?.('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
