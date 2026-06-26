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

## 2024-05-18 - Fix XSS in JSON-LD `<script>` Injection and Edge crypto incompatibility
**Vulnerability:** `JSON.stringify` was used directly inside `dangerouslySetInnerHTML` for injecting JSON-LD `<script>` tags, and standard Node.js `crypto.timingSafeEqual` was used for comparison which is often not supported in Cloudflare Edge environments.
**Learning:** `JSON.stringify` does not escape HTML characters like `<`, `>`, `&`, or `'`. Injecting untrusted JSON directly into a script tag using `dangerouslySetInnerHTML` can lead to Cross-Site Scripting (XSS). Node.js built-in `crypto` may fail in edge environments.
**Prevention:** Use a custom sanitization function `safeJsonStringify` to escape HTML entities and replace `crypto.timingSafeEqual` with a custom constant-time bitwise XOR comparison that works across environments.
## 2025-06-24 - Fix XSS vulnerability in JSON-LD scripts
**Vulnerability:** XSS vulnerability through direct JSON.stringify inside `dangerouslySetInnerHTML` for JSON-LD structured data.
**Learning:** When using `dangerouslySetInnerHTML`, directly using `JSON.stringify` can lead to XSS attacks since it does not escape HTML-sensitive characters (like `<`, `>`, `&`, `'`).
**Prevention:** Use a safe alternative like `safeJsonStringify` which escapes these characters.

## 2025-02-18 - [Fix Authorization Bypass in Content Agent API]
**Vulnerability:** The `verifyAuth` function in `src/app/api/content-agent/route.ts` used strict equality (`===`) for secret comparison, making it susceptible to timing attacks. More critically, it failed open if `CRON_SECRET` or `AMOCRM_CRON_SECRET` environment variables were not configured (evaluating to empty strings), allowing an attacker to bypass authentication by providing an empty secret parameter (e.g., `?secret=`).
**Learning:** Hardcoded comparisons can fail open if configuration is missing and standard string comparisons are vulnerable to timing attacks. Default values or environment variable fallbacks should never result in empty strings being valid secrets.
**Prevention:** Always implement fail-secure logic: check if the configured secrets are truthy before proceeding. Use timing-safe comparison utilities like `safeCompare` for evaluating secrets. Ensure that provided inputs are validated and not empty.

## 2026-06-25 - Fix XSS in dangerouslySetInnerHTML
**Vulnerability:** Dynamic HTML content was injected directly into dangerouslySetInnerHTML without sanitization, leading to a potential Cross-Site Scripting (XSS) vulnerability.
**Learning:** Always sanitize user-provided or external HTML content before injecting it into the DOM to prevent malicious scripts from executing.
**Prevention:** Use a library like DOMPurify to sanitize HTML content before passing it to dangerouslySetInnerHTML.

## 2026-06-23 - Timing Attacks in API Routes
**Vulnerability:** API routes comparing secrets using standard inequality operators (e.g. `!==`) are vulnerable to timing attacks.
**Learning:** Standard string comparison operators return early when a mismatched character is found, leaking the length of the matching prefix through execution time.
**Prevention:** Always use a constant-time comparison utility, such as `safeCompare` from `@/lib/security`, when verifying secrets or tokens.
