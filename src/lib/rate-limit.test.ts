import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getClientIp, rateLimit } from './rate-limit';

describe('rate-limit', () => {
    describe('getClientIp', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            process.env = { ...originalEnv };
            delete process.env.VERCEL;
            delete process.env.VERCEL_ENV;
        });

        afterEach(() => {
            process.env = originalEnv;
        });

        function mockRequest(headersRecord: Record<string, string>): Request {
            return {
                headers: {
                    get: (name: string) => headersRecord[name.toLowerCase()] || null,
                },
            } as any as Request;
        }

        it('should return IP from cf-connecting-ip when TRUSTED_PROXY=cloudflare', () => {
            process.env.TRUSTED_PROXY = 'cloudflare';
            const req = mockRequest({
                'cf-connecting-ip': '203.0.113.1',
                'x-real-ip': '198.51.100.1',
                'x-forwarded-for': '192.0.2.1',
            });
            expect(getClientIp(req)).toBe('203.0.113.1');
        });

        it('should return IP from x-real-ip when cf-connecting-ip is absent and TRUSTED_PROXY=cloudflare', () => {
            process.env.TRUSTED_PROXY = 'cloudflare';
            const req = mockRequest({
                'x-real-ip': '198.51.100.1',
                'x-forwarded-for': '192.0.2.1',
            });
            expect(getClientIp(req)).toBe('198.51.100.1');
        });

        it('should ignore cf-connecting-ip and x-real-ip when TRUSTED_PROXY is unset', () => {
            delete process.env.TRUSTED_PROXY;
            const req = mockRequest({
                'cf-connecting-ip': '203.0.113.1',
                'x-real-ip': '198.51.100.1',
                'x-forwarded-for': '192.0.2.1',
            });
            expect(getClientIp(req)).toMatch(/^anonymous:[a-f0-9]{24}$/);
        });

        it('should return request.ip if present when TRUSTED_PROXY is unset', () => {
            delete process.env.TRUSTED_PROXY;
            const req = mockRequest({});
            (req as any).ip = '192.0.2.5';
            expect(getClientIp(req)).toBe('192.0.2.5');
        });

        it('should return a stable anonymous fingerprint when no trusted IP is present', () => {
            const req = mockRequest({});
            expect(getClientIp(req)).toMatch(/^anonymous:[a-f0-9]{24}$/);
            expect(getClientIp(req)).toBe(getClientIp(req));
        });

        it('should handle undefined headers object gracefully', () => {
            expect(getClientIp({} as Request)).toMatch(/^anonymous:[a-f0-9]{24}$/);
        });

        it('should trust Vercel forwarded IP only on Vercel', () => {
            process.env.VERCEL = '1';
            const req = mockRequest({
                'x-vercel-forwarded-for': '203.0.113.20',
                'x-forwarded-for': '198.51.100.7',
            });
            expect(getClientIp(req)).toBe('203.0.113.20');
        });

        it('should reject malformed trusted-proxy IP values', () => {
            process.env.VERCEL = '1';
            const req = mockRequest({
                'x-vercel-forwarded-for': 'not-an-ip',
                'user-agent': 'test-agent',
            });
            expect(getClientIp(req)).toMatch(/^anonymous:[a-f0-9]{24}$/);
        });
    });

    describe('rateLimit', () => {
        it('should allow first request', async () => {
            const ip = `192.168.1.${Math.floor(Math.random() * 1000)}`;
            await expect(rateLimit(ip, 5, 1000)).resolves.toBe(true);
        });

        it('should allow requests up to maxRequests', async () => {
            const ip = `192.168.2.${Math.floor(Math.random() * 1000)}`;
            await expect(rateLimit(ip, 3, 1000)).resolves.toBe(true); // 1
            await expect(rateLimit(ip, 3, 1000)).resolves.toBe(true); // 2
            await expect(rateLimit(ip, 3, 1000)).resolves.toBe(true); // 3
        });

        it('should reject requests exceeding maxRequests', async () => {
            const ip = `192.168.3.${Math.floor(Math.random() * 1000)}`;
            await expect(rateLimit(ip, 2, 1000)).resolves.toBe(true); // 1
            await expect(rateLimit(ip, 2, 1000)).resolves.toBe(true); // 2
            await expect(rateLimit(ip, 2, 1000)).resolves.toBe(false); // 3
        });
    });
});
