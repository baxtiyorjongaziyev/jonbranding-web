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
    // 🛡️ Sentinel: Prevent IP spoofing by prioritizing secure proxy headers
    const cfConnectingIp = (request as any).headers?.get?.('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp.trim();

    const xRealIp = (request as any).headers?.get?.('x-real-ip');
    if (xRealIp) return xRealIp.trim();

    const forwarded = (request as any).headers?.get?.('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
