## 2026-05-16 - Rate Limiter IP Spoofing
**Vulnerability:** The `getClientIp` function in the rate limiter was blindly trusting the `x-forwarded-for` header to identify clients, which can be easily spoofed by malicious users to bypass rate limits.
**Learning:** In edge-deployed applications (like Cloudflare), relying solely on `x-forwarded-for` is a security risk. The first value is controlled by the client.
**Prevention:** Prioritize headers injected by trusted reverse proxies, such as `cf-connecting-ip` (Cloudflare) or `x-real-ip`, falling back to `x-forwarded-for` only if those are not present.
