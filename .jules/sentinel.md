## 2025-05-15 - Fail-open webhook authorization
**Vulnerability:** The amoCRM webhook authorization function returned `true` if the server's expected secret environment variable was missing, allowing unauthenticated access if misconfigured. The secret comparison also used the standard `===` operator, which is susceptible to timing attacks.
**Learning:** Default-allow/fail-open designs in security checks are dangerous because misconfigurations (like a missing environment variable) directly lead to authentication bypasses. Security checks must fail securely (fail-closed).
**Prevention:** Always write authorization logic such that if preconditions (like secrets) are missing, the function throws an error or explicitly returns `false`. Utilize timing-safe comparison methods for evaluating secrets.

## 2024-05-18 - IP Spoofing via X-Forwarded-For
**Vulnerability:** The rate limiting logic relied primarily on the `x-forwarded-for` header for client IP identification, which is easily spoofed by malicious actors.
**Learning:** Relying on spoofable headers like `x-forwarded-for` can lead to IP spoofing attacks, rendering rate limiting ineffective. Secure proxy headers should be prioritized.
**Prevention:** Prioritize secure proxy headers like `cf-connecting-ip` and `x-real-ip` over `x-forwarded-for` for client IP identification.

## 2026-05-21 - Error information leakage on API 500 responses
**Vulnerability:** API endpoints were returning internal error details directly to the client (e.g., `error.message` in `src/app/api/submit-form/route.ts`). This can expose sensitive architectural information or stack traces.
**Learning:** Returning unhandled exception messages or internal states in error responses compromises security. Even simple error messages might give away too much context about the backend infrastructure or internal states.
**Prevention:** API routes must fail securely by logging exact error details internally (e.g., using `console.error`) and returning generic, safe error messages to clients on 500 errors.
## 2026-05-22 - Missing HTTP Security Headers\n**Vulnerability:** Application missing standard HTTP security headers (X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options, etc).\n**Learning:** Next.js application needs explicit configuration for security headers using the `async headers()` function in `next.config.js`.\n**Prevention:** Added security headers to `next.config.js` targeting all paths (`/(.*)`) to ensure full coverage across the application.

## 2026-05-26 - Missing rel="noopener noreferrer" on external links
**Vulnerability:** External links using `target="_blank"` were missing `rel="noopener"` and `rel="noreferrer"`.
**Learning:** Missing these attributes on `target="_blank"` links can lead to reverse tabnabbing vulnerabilities, where the newly opened page can exploit the `window.opener` object to redirect the original page to a malicious site.
**Prevention:** Always add `rel="noopener noreferrer"` when using `target="_blank"`.

## 2026-06-05 - Timing Attack Vulnerabilities in Edge Runtimes
**Vulnerability:** String equality operators (`===`, `!==`) were being used for secret and token comparisons across various API endpoints (e.g., cron secrets, authorization headers). This is susceptible to timing attacks where attackers can guess secrets character by character based on response times.
**Learning:** In Edge environments (like Cloudflare Workers/Pages), Node.js's `crypto.timingSafeEqual` may not be available or fully compatible. A custom constant-time string comparison utility must be implemented to prevent timing attacks securely across all environments.
**Prevention:** Centralized a `timingSafeEqual` utility in `src/lib/utils.ts` and refactored API routes to consistently use this function for all secret and token verifications.
