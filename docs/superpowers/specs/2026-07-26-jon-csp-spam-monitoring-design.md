# Jon Branding CSP and Spam Monitoring Design

Date: 2026-07-26
Status: Approved for planning

## Purpose

Strengthen browser security and make every spam-protection fallback visible, measurable, and actionable without breaking lead delivery.

## Scope

1. Move from static CSP with `unsafe-inline` toward nonce/hash enforcement.
2. Add CSP reporting and rollback controls.
3. Add structured anti-spam telemetry.
4. Enforce production origin validation.
5. Alert when Turnstile, Firestore rate limiting, or another control degrades.
6. Run staging security tests for lead flows.

## Non-goals

- No immediate removal of all inline styles before compatibility is measured.
- No production denial-of-service testing.
- No lead message bodies, contact details, tokens, or cookies in security telemetry.
- No breaking change to the truthful analytics delivery response contract.

## Delivery sequence

1. `security/csp-reporting`
2. `security/csp-nonce-enforcement`
3. `security/spam-fallback-monitoring`
4. `security/staging-lead-pentest`

Each phase is independently deployable and reversible.

---

## 1. CSP reporting

Add `Content-Security-Policy-Report-Only` before enforcement. The policy explicitly covers scripts, styles, images, fonts, connections, frames, workers, form actions, base URI, and object sources.

Minimum baseline:

```text
default-src 'self'
base-uri 'self'
object-src 'none'
frame-ancestors 'none'
form-action 'self'
```

Only verified required third-party domains are admitted.

### Violation endpoint

The endpoint:

- accepts standard CSP reports;
- validates content type and size;
- rate limits reports;
- removes query strings and sensitive values;
- records directive, blocked origin, coarse document path, disposition, and timestamp;
- never records cookies, auth headers, form bodies, access tokens, or lead content;
- deduplicates repeated events;
- alerts only after a threshold.

Primary alert delivery is the existing Telegram admin channel. If Telegram delivery fails, the incident is written to structured server logs with a delivery-failed status.

### Reporting acceptance criteria

- Report-only policy is active in staging and production.
- Valid reports are stored or forwarded.
- Malformed/oversized reports are rejected.
- No personal lead data is captured.
- The report view identifies remaining inline and third-party requirements.

---

## 2. Nonce/hash enforcement

Generate a cryptographically random nonce for every HTML request and propagate it to required framework/application scripts.

Target script policy:

```text
script-src 'self' 'nonce-<request-value>' 'strict-dynamic'
```

Exact directives are verified against the deployed Next.js version.

### Inline handling

- Application inline scripts receive a nonce or move to external modules.
- Stable third-party snippets may use reviewed hashes.
- Unused snippets are removed.
- `unsafe-eval` is prohibited unless a verified framework requirement is documented.

### Styles

1. Inventory runtime style injection.
2. Move application inline styles into CSS/classes.
3. Use nonce/hash support where available.
4. Keep temporary style exceptions only for an approved allowlist.
5. Remove exceptions after compatibility tests pass.

### Rollout

Staging report-only, staging enforcement, production report-only comparison, then production enforcement behind an environment rollback switch.

### CSP acceptance criteria

- Core routes render and function under enforcement.
- Forms, locale switching, analytics, CTA navigation, and diagnostics work.
- No enforced `unsafe-inline` remains in `script-src`.
- No `script-src`, `connect-src`, `frame-src`, `form-action`, `base-uri`, or `object-src` violation occurs in the core Playwright suite.
- Any remaining style violation matches the documented temporary allowlist; no unexpected style violation is accepted.
- Rollback restores the previous policy without a code rollback.

---

## 3. Spam protection telemetry

Every submission emits one internal report:

```text
SpamProtectionReport
- request_id
- environment
- turnstile_status
- origin_status
- rate_limit_status
- honeypot_status
- final_decision
- degraded_controls[]
- duration_ms
```

Allowed statuses:

```text
turnstile: verified | rejected | skipped_missing_secret | provider_failed | malformed_response
origin: valid | invalid | missing
rate_limit: firestore_allowed | firestore_blocked | memory_fallback_allowed | memory_fallback_blocked | unavailable
honeypot: clean | triggered
```

### Production policy

- Missing Turnstile secret is a configuration incident.
- Invalid origin is blocked.
- Missing origin fails closed for browser lead endpoints unless an explicitly authenticated trusted client policy allows it.
- Turnstile provider failure follows one environment setting:
  - `strict`: reject temporarily;
  - `business_continuity`: accept only when all remaining controls pass, mark degraded, queue for review, and alert.
- Firestore failure may fall back to memory, but always records and alerts the degraded state.
- Honeypot responses remain non-descriptive.

### Alerts

Alert on missing production secret, repeated provider failures, repeated origin violations, sustained Firestore fallback, unavailable limiter, and spikes in rejected/degraded submissions.

Alerts are deduplicated by type/environment, use cooldowns, include counts and first/last occurrence, and exclude personal data.

### Acceptance criteria

- Every submission has one internal decision report.
- Invalid production origins are blocked.
- Missing Turnstile secret alerts.
- Provider failure follows the configured policy.
- Firestore fallback is visible.
- No lead content, token, or contact detail appears in alerts.
- Repeated incidents do not flood Telegram.

---

## 4. Privacy and retention

The new telemetry stores request ID, coarse route, status categories, duration, timestamp, environment, and an HMAC-based short identifier when correlation is needed.

Raw IP addresses are not stored by this new telemetry. Correlation uses an HMAC of the IP with a daily rotating secret, and the hash is not reversible.

Do not store lead messages, phone/email values, Turnstile tokens, cookies, auth headers, analytics secrets, or full query strings.

Default retention is 30 days. Incident extensions require a documented reason and expiry date.

---

## 5. Testing

### Unit

CSP report validation/redaction, nonce uniqueness, header assembly, all Turnstile outcomes, origin policy, Firestore fallback, alert dedupe/cooldown, and sensitive-field exclusion.

### Integration

Healthy acceptance, invalid Turnstile rejection, invalid origin rejection, missing production secret alert, provider outage in both modes, Firestore outage with monitored fallback, and honeypot rejection without rule disclosure.

### Browser

Under enforced CSP verify home/services, locale switching, CTA navigation, diagnostic/lead forms, analytics delivery, and absence of critical CSP console errors.

---

## 6. Staging security test

Use synthetic leads only. Test invalid/missing Origin, forged forwarding headers, Turnstile failure cases where supported, safe burst scenarios, Firestore outage, inline injection, bounded CSP report flooding, malformed/oversized payloads, and analytics/CRM downstream failures.

No destructive load testing.

### Acceptance criteria

- No unauthorized cross-origin lead submission.
- No executable inline injection under enforced CSP.
- No silent anti-spam degradation.
- No sensitive data in logs/alerts.
- Playwright core flows pass under CSP enforcement.
- No unresolved high/critical finding.

---

## Rollout and rollback

Ship report-only first, compare reports, enforce in staging, then production. Keep an environment rollback switch. Ship monitoring before stricter failure behavior. Turnstile strict/continuity mode changes independently of deployment.

## Completion definition

Complete when production `script-src` no longer uses `unsafe-inline`, all anti-spam fallbacks emit structured monitoring, invalid origins are blocked, Playwright passes under enforced CSP, and staging security testing has no unresolved high/critical finding.