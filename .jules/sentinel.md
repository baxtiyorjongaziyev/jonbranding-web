## 2025-05-15 - Fail-open webhook authorization
**Vulnerability:** The amoCRM webhook authorization function returned `true` if the server's expected secret environment variable was missing, allowing unauthenticated access if misconfigured. The secret comparison also used the standard `===` operator, which is susceptible to timing attacks.
**Learning:** Default-allow/fail-open designs in security checks are dangerous because misconfigurations (like a missing environment variable) directly lead to authentication bypasses. Security checks must fail securely (fail-closed).
**Prevention:** Always write authorization logic such that if preconditions (like secrets) are missing, the function throws an error or explicitly returns `false`. Utilize timing-safe comparison methods for evaluating secrets.

## 2024-05-18 - IP Spoofing via X-Forwarded-For
**Vulnerability:** The rate limiting logic relied primarily on the `x-forwarded-for` header for client IP identification, which is easily spoofed by malicious actors.
**Learning:** Relying on spoofable headers like `x-forwarded-for` can lead to IP spoofing attacks, rendering rate limiting ineffective. Secure proxy headers should be prioritized.
**Prevention:** Prioritize secure proxy headers like `cf-connecting-ip` and `x-real-ip` over `x-forwarded-for` for client IP identification.
