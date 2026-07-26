# Jon Branding CSP and Spam Monitoring Design

Date: 2026-07-26
Status: Approved for planning

## Purpose

Strengthen Jon Branding's browser security policy and make every spam-protection fallback visible, measurable, and actionable without breaking lead delivery.

## Scope

1. Move from a static CSP with `unsafe-inline` toward nonce/hash-based enforcement.
2. Add CSP violation reporting and rollout controls.
3. Replace silent spam-protection fallbacks with structured delivery and security telemetry.
4. Enforce origin validation in production.
5. Alert when Turnstile, Firestore rate limiting, or other anti-spam controls degrade.
6. Add staging security and permission tests for lead submission flows.

## Non-goals

- No immediate removal of all inline styles before compatibility is measured.
- No production denial-of-service testing.
- No logging of submitted message bodies, tokens, or personal data in security telemetry.
- No change to the existing truthful analytics delivery response contract except where shared monitoring primitives are reused.

## Delivery sequence

1. `security/csp-reporting`
2. `security/csp-nonce-enforcement`
3. `security/spam-fallback-monitoring`
4. `security/staging-lead-pentest`

Each phase is independently deployable and reversible.

---

## 1. CSP reporting phase

### Current issue

The current production policy permits inline scripts/styles. Removing these directives without observing actual runtime requirements risks breaking Next.js, third-party analytics, form behavior, and embedded services.

### Report-only policy

Add `Content-Security-Policy-Report-Only` before tightening enforcement. The policy must explicitly list required origins for:

- scripts;
- styles;
- images;
- fonts;
- connections/API calls;
- frames;
- workers;
- form actions;
- base URI;
- object sources.

Minimum baseline:

```text
default-src 'self'
base-uri 'self'
object-src 'none'
frame-ancestors 'none'
form-action 'self'
```

Existing third-party domains are admitted only when verified as necessary.

### Violation endpoint

Add a server endpoint for CSP reports.

Requirements:

- accepts standard CSP report payloads;
- validates request size and content type;
- rate limits reports;
- strips query strings and sensitive values where possible;
- records directive, blocked origin, document path, disposition, and timestamp;
- never records cookies, authorization headers, form bodies, or access tokens;
- deduplicates repeated violations;
- emits an alert only after a threshold, not for every event.

### Reporting acceptance criteria

- Report-only policy is present in staging and production.
- Valid reports are stored or forwarded to monitoring.
- Malformed and oversized reports are rejected safely.
- No user-entered lead text is captured.
- A report dashboard identifies all remaining inline and third-party requirements.

---

## 2. Nonce/hash CSP enforcement

### Request-scoped nonce

Generate a cryptographically random nonce for each HTML request at the middleware/server boundary. Pass it through the rendering path to framework and application scripts that need it.

The enforced script policy becomes equivalent to:

```text
script-src 'self' 'nonce-<request-value>' 'strict-dynamic'
```

Exact directives depend on verified Next.js runtime behavior in the deployed version.

### Inline code handling

- Application inline scripts receive a nonce or move into external modules.
- Stable third-party snippets may use reviewed hashes when nonce propagation is not possible.
- Unused snippets are removed.
- `unsafe-eval` is prohibited in production unless a documented framework requirement proves unavoidable.

### Styles

Styles are tightened separately:

1. Inventory runtime style injection.
2. Move application inline styles into CSS/classes.
3. Use nonces or hashes where the framework supports them.
4. Keep a temporary style exception only while report data proves it is required.
5. Remove the exception after compatibility tests pass.

### Rollout

- Staging report-only.
- Staging enforcement.
- Production report-only comparison.
- Production enforcement behind a rollback switch.

### CSP enforcement acceptance criteria

- Core pages render correctly under enforcement.
- Forms, language switching, analytics, and navigation work.
- No enforced `unsafe-inline` remains in `script-src`.
- Style exceptions are documented and minimized.
- CSP violations remain below the agreed threshold for seven consecutive staging test runs.
- Rollback restores the previous header without a code rollback.

---

## 3. Spam protection telemetry

### Structured decision report

Every lead submission produces an internal security decision report:

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
turnstile:
- verified
- rejected
- skipped_missing_secret
- provider_failed
- malformed_response

origin:
- valid
- invalid
- missing

rate_limit:
- firestore_allowed
- firestore_blocked
- memory_fallback_allowed
- memory_fallback_blocked
- unavailable

honeypot:
- clean
- triggered
```

### Production policies

- Missing Turnstile secret is a configuration incident, not a silent success.
- Invalid origin is blocked in production.
- Missing origin follows a documented policy for trusted clients; browser lead endpoints fail closed unless explicitly allowed.
- Turnstile provider failure follows a configuration switch:
  - `strict`: reject temporarily;
  - `business_continuity`: accept only when other controls pass, mark degraded, queue for review, and alert.
- Firestore failure may fall back to memory for continuity, but the degraded state is recorded and alerted.
- Honeypot triggers remain non-descriptive to the client.

### Monitoring and alerts

Alerts are sent for:

- Turnstile secret missing in production;
- repeated Turnstile provider failures;
- repeated origin violations;
- sustained Firestore-to-memory fallback;
- rate limiter unavailable;
- sudden spike in rejected or degraded submissions.

Alert behavior:

- deduplicate by type and environment;
- use a cooldown window;
- include counts and first/last occurrence;
- exclude personal data and submitted message text;
- route to the existing admin channel or monitoring integration.

### User-facing response

The public response remains minimal. Internal degradation details are not exposed to attackers. A request ID may be returned for support correlation.

### Spam monitoring acceptance criteria

- Every submission has one internal decision report.
- Production origin violations are blocked.
- Missing Turnstile secret generates an alert.
- Provider failure behavior follows the configured policy.
- Firestore fallback is visible in monitoring.
- Alerts do not contain lead content, tokens, or contact details.
- Repeated incidents do not spam the admin channel.

---

## 4. Data retention and privacy

Security telemetry stores only what is necessary:

- request ID;
- coarse route/path;
- status categories;
- durations;
- hashed or truncated technical identifiers when needed;
- timestamps and environment.

Do not store:

- full IP addresses beyond the existing lawful security policy;
- lead message body;
- phone/email values;
- Turnstile tokens;
- cookies;
- authorization headers;
- analytics secrets.

Retention defaults to 30 days unless an incident requires a documented extension.

---

## 5. Testing strategy

### Unit tests

- CSP report validation and redaction.
- Nonce generation uniqueness and format.
- Header assembly.
- Each Turnstile outcome.
- Origin policy.
- Firestore fallback outcomes.
- Alert deduplication and cooldown.
- No sensitive fields in telemetry.

### Integration tests

- Lead accepted with all controls healthy.
- Invalid Turnstile rejected.
- Invalid origin rejected.
- Missing production secret handled as configured and alerted.
- Turnstile provider outage in both strict and continuity modes.
- Firestore outage with monitored memory fallback.
- Honeypot submission blocked without revealing the rule.

### Browser tests

Under enforced CSP, verify:

- home and service pages render;
- locale switching works;
- CTA navigation works;
- diagnostic and lead forms submit;
- analytics requests are not unexpectedly blocked;
- no critical console CSP errors occur.

---

## 6. Staging security test

Use a staging deployment and synthetic leads.

Test cases:

- missing and invalid Origin;
- forged forwarding headers;
- missing, invalid, replayed, and expired Turnstile responses where test tooling permits;
- burst submissions and distributed rate-limit scenarios;
- Firestore unavailable;
- CSP inline-script injection attempts;
- CSP report flooding within safe limits;
- malformed JSON and oversized payloads;
- analytics and CRM downstream failure combinations.

No destructive load testing is allowed.

### Staging acceptance criteria

- No unauthorized cross-origin lead submission.
- No executable inline injection under enforced CSP.
- No silent anti-spam degradation.
- No sensitive data in security logs or alerts.
- Core business flows pass Playwright under CSP enforcement.
- No unresolved high or critical finding remains.

---

## Rollout and rollback

- Deploy report-only CSP first.
- Compare violation data before enforcement.
- Enable enforced CSP in staging, then production.
- Keep an environment-controlled rollback to the previous policy during rollout.
- Spam monitoring ships before stricter failure behavior so impact is measurable.
- Strict Turnstile mode can be changed independently of code deployment.

## Completion definition

This work is complete when production script CSP no longer relies on `unsafe-inline`, all spam-control fallbacks emit structured monitoring, invalid production origins are blocked, Playwright passes under enforced CSP, and staging security testing has no unresolved high or critical finding.