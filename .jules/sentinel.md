## 2025-05-15 - Fail-open webhook authorization
**Vulnerability:** The amoCRM webhook authorization function returned `true` if the server's expected secret environment variable was missing, allowing unauthenticated access if misconfigured. The secret comparison also used the standard `===` operator, which is susceptible to timing attacks.
**Learning:** Default-allow/fail-open designs in security checks are dangerous because misconfigurations (like a missing environment variable) directly lead to authentication bypasses. Security checks must fail securely (fail-closed).
**Prevention:** Always write authorization logic such that if preconditions (like secrets) are missing, the function throws an error or explicitly returns `false`. Utilize timing-safe comparison methods for evaluating secrets.
## 2024-05-18 - Prioritize Secure Proxy Headers for IP Rate Limiting
**Vulnerability:** IP spoofing via `x-forwarded-for` header manipulation. The rate limiting mechanism in `src/lib/rate-limit.ts` relied solely on `x-forwarded-for`, which can be easily spoofed by attackers to bypass rate limits.
**Learning:** In environments like Cloudflare, `cf-connecting-ip` and `x-real-ip` are more secure and harder to spoof than `x-forwarded-for`, which is an append-only header that any client can manipulate.
**Prevention:** Always prioritize trusted proxy headers (`cf-connecting-ip`, `x-real-ip`) over `x-forwarded-for` when identifying client IPs for security mechanisms like rate limiting.
