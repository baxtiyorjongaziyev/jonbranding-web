import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getClientIp, rateLimit } from './rate-limit';

describe('rate-limit', () => {
    describe('getClientIp', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            process.env = { ...originalEnv };
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
            expect(getClientIp(req)).toBe('192.0.2.1');
        });

        it('should return the first IP from x-forwarded-for', () => {
            delete process.env.TRUSTED_PROXY;
            const req = mockRequest({
                'x-forwarded-for': '192.0.2.1, 198.51.100.1',
            });
            expect(getClientIp(req)).toBe('192.0.2.1');
        });

        it('should trim whitespace from x-forwarded-for IP', () => {
            delete process.env.TRUSTED_PROXY;
            const req = mockRequest({
                'x-forwarded-for': ' 192.0.2.1 ',
            });
            expect(getClientIp(req)).toBe('192.0.2.1');
        });

        it('should return "unknown" when no recognized headers are present', () => {
            const req = mockRequest({});
            expect(getClientIp(req)).toBe('unknown');
        });

        it('should handle undefined headers object gracefully', () => {
            expect(getClientIp({} as Request)).toBe('unknown');
        });
    });

    describe('rateLimit', () => {
        beforeEach(() => {
             // Reset the internal ipMap if we can, but it's module scoped.
             // We can use random IPs for each test instead.
        });

        it('should allow first request', () => {
            const ip = `192.168.1.${Math.floor(Math.random() * 1000)}`;
            expect(rateLimit(ip, 5, 1000)).toBe(true);
        });

        it('should allow requests up to maxRequests', () => {
            const ip = `192.168.2.${Math.floor(Math.random() * 1000)}`;
            expect(rateLimit(ip, 3, 1000)).toBe(true); // 1
            expect(rateLimit(ip, 3, 1000)).toBe(true); // 2
            expect(rateLimit(ip, 3, 1000)).toBe(true); // 3
        });

        it('should reject requests exceeding maxRequests', () => {
            const ip = `192.168.3.${Math.floor(Math.random() * 1000)}`;
            expect(rateLimit(ip, 2, 1000)).toBe(true); // 1
            expect(rateLimit(ip, 2, 1000)).toBe(true); // 2
            expect(rateLimit(ip, 2, 1000)).toBe(false); // 3
        });
    });
});
