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
    if (!headers) return 'unknown';

    // Prioritize Cloudflare and standard proxy headers over x-forwarded-for
    // to prevent IP spoofing attacks
    const cfIp = headers.get?.('cf-connecting-ip');
    if (cfIp) return cfIp.trim();

    const realIp = headers.get?.('x-real-ip');
    if (realIp) return realIp.trim();

    const forwarded = headers.get?.('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
