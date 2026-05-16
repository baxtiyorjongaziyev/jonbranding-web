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

export function getClientIp(request: Request): string {
    const headers = (request as any).headers;
    if (!headers || typeof headers.get !== 'function') return 'unknown';

    // Prioritize headers injected by trusted proxies (e.g., Cloudflare) to prevent IP spoofing
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp.trim();

    const xRealIp = headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();

    const forwarded = headers.get('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
