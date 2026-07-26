# Jon Branding Spam Fallback Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every lead-protection decision and degraded fallback observable, block invalid production origins, and alert on Turnstile or Firestore degradation without leaking lead data.

**Architecture:** Replace boolean guard/rate-limit results with typed decision reports. Build a privacy-safe telemetry sink and deduplicated alert dispatcher, then integrate it into `lead-guard.ts`, `rate-limit.ts`, diagnostics, and submit-form routes. Public responses remain minimal.

**Tech Stack:** Next.js 16, TypeScript, Cloudflare Turnstile, Firebase Admin/Firestore, Vitest, Playwright, Telegram/admin monitoring.

## Global Constraints

- Every lead submission emits exactly one internal `SpamProtectionReport`.
- Production invalid origins are blocked.
- Missing production Turnstile secret is a configuration incident, not silent success.
- Turnstile outage policy is explicit: `strict` or `business_continuity`.
- Firestore fallback is visible and alerted.
- Alerts are deduplicated and rate-limited.
- Telemetry never contains lead message text, phone, email, Telegram username, Turnstile token, cookie, authorization header, or raw IP.
- Public responses do not expose internal control status.

---

## File Structure

- Create `src/lib/spam-protection-report.ts` and tests.
- Modify `src/lib/lead-guard.ts` and `lead-guard.test.ts`.
- Modify `src/lib/rate-limit.ts`; create/modify rate-limit tests.
- Create `src/lib/security-telemetry.ts` and tests.
- Create `src/lib/security-alerts.ts` and tests.
- Modify `src/app/api/submit-form/route.ts` and diagnostics route.
- Create `src/app/api/security/health/route.ts` for authenticated/internal monitoring only if an existing health surface cannot be extended.
- Modify `.env.example`.
- Add integration and Playwright tests.
- Create `docs/security/spam-protection-operations.md`.

---

### Task 1: Define the structured decision report

**Files:**
- Create: `src/lib/spam-protection-report.ts`
- Create: `src/lib/spam-protection-report.test.ts`

**Interfaces:**
- Produces: `SpamProtectionReport`, status unions, `createSpamProtectionReport()`.
- Consumes: request ID, environment, control results.

- [ ] **Step 1: Write failing report tests**

```ts
import { createSpamProtectionReport } from './spam-protection-report';

it('contains only approved fields', () => {
  const report = createSpamProtectionReport({
    requestId: 'req-1',
    environment: 'production',
    turnstileStatus: 'verified',
    originStatus: 'valid',
    rateLimitStatus: 'firestore_allowed',
    honeypotStatus: 'clean',
    finalDecision: 'allow',
    durationMs: 12,
  });
  expect(Object.keys(report).sort()).toEqual([
    'degradedControls','durationMs','environment','finalDecision','honeypotStatus',
    'originStatus','rateLimitStatus','requestId','turnstileStatus','version',
  ].sort());
});

it('marks degraded controls deterministically', () => {
  const report = createSpamProtectionReport({
    requestId: 'req-2', environment: 'production',
    turnstileStatus: 'provider_failed', originStatus: 'valid',
    rateLimitStatus: 'memory_fallback_allowed', honeypotStatus: 'clean',
    finalDecision: 'allow_degraded', durationMs: 30,
  });
  expect(report.degradedControls).toEqual(['turnstile','rate_limit']);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/spam-protection-report.test.ts`
Expected: FAIL because module does not exist.

- [ ] **Step 3: Implement exact status unions**

```ts
export type TurnstileStatus =
  | 'verified' | 'rejected' | 'skipped_missing_secret'
  | 'provider_failed' | 'malformed_response';
export type OriginStatus = 'valid' | 'invalid' | 'missing';
export type RateLimitStatus =
  | 'firestore_allowed' | 'firestore_blocked'
  | 'memory_fallback_allowed' | 'memory_fallback_blocked' | 'unavailable';
export type HoneypotStatus = 'clean' | 'triggered';
export type FinalDecision = 'allow' | 'allow_degraded' | 'drop' | 'reject' | 'rate_limited';
```

`degradedControls` is computed, sorted, and contains no duplicates.

- [ ] **Step 4: Verify pass**

Run: `npm test -- src/lib/spam-protection-report.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spam-protection-report.ts src/lib/spam-protection-report.test.ts
git commit -m "feat(security): define spam protection reports"
```

---

### Task 2: Return typed Turnstile and origin outcomes

**Files:**
- Modify: `src/lib/lead-guard.ts`
- Modify: `src/lib/lead-guard.test.ts`

**Interfaces:**
- Produces: `LeadGuardResult` containing verdict plus Turnstile/origin/honeypot statuses.
- Consumes: policy mode from environment.

- [ ] **Step 1: Add failing production-policy tests**

```ts
it('rejects invalid production origin', async () => {
  process.env.NODE_ENV = 'production';
  const result = await guardLeadRequest(requestFrom('https://evil.example'), validBody, 'anonymous:x', 'test');
  expect(result.verdict).toEqual({ action: 'reject', reason: 'invalid-origin' });
  expect(result.originStatus).toBe('invalid');
});

it('reports missing production Turnstile secret', async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  const result = await verifyTurnstile('token');
  expect(result.status).toBe('skipped_missing_secret');
});

it('strict mode rejects provider outage', async () => {
  process.env.TURNSTILE_FAILURE_MODE = 'strict';
  mockFetchNetworkError();
  const result = await guardLeadRequest(validRequest, validBody, 'anonymous:x', 'test');
  expect(result.verdict.action).toBe('reject');
  expect(result.turnstileStatus).toBe('provider_failed');
});

it('continuity mode allows degraded only when other controls pass', async () => {
  process.env.TURNSTILE_FAILURE_MODE = 'business_continuity';
  mockFetchNetworkError();
  const result = await guardLeadRequest(validRequest, validBody, 'anonymous:x', 'test');
  expect(result.verdict.action).toBe('allow');
  expect(result.degraded).toBe(true);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/lead-guard.test.ts`
Expected: FAIL because current origin only logs and Turnstile failures silently allow.

- [ ] **Step 3: Implement explicit policy**

Environment:

```dotenv
TURNSTILE_FAILURE_MODE=strict
ALLOW_MISSING_BROWSER_ORIGIN=false
```

Rules:

```text
honeypot triggered -> drop
origin invalid in production -> reject
origin missing in production browser route -> reject unless explicit trusted-client exception
Turnstile missing secret -> status skipped_missing_secret; production final policy rejects and alerts
Turnstile rejected -> reject
provider failed + strict -> reject
provider failed + business_continuity + origin valid + rate limit healthy + honeypot clean -> allow_degraded
```

Do not log raw IP in `lead-guard.ts`.

- [ ] **Step 4: Verify pass**

Run: `npm test -- src/lib/lead-guard.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/lead-guard.ts src/lib/lead-guard.test.ts .env.example
git commit -m "fix(security): enforce explicit lead guard policy"
```

---

### Task 3: Return typed rate-limit outcomes

**Files:**
- Modify: `src/lib/rate-limit.ts`
- Create: `src/lib/rate-limit.test.ts`

**Interfaces:**
- Produces: `RateLimitResult` instead of boolean.
- Consumes: Firestore and local bucket implementations.

- [ ] **Step 1: Write failing rate-limit tests**

```ts
it('reports Firestore allow', async () => {
  const result = await rateLimit('key', 5, 60_000);
  expect(result).toEqual({ allowed: true, status: 'firestore_allowed' });
});

it('reports memory fallback after Firestore error', async () => {
  mockFirestoreFailure();
  const result = await rateLimit('key', 5, 60_000);
  expect(result.status).toBe('memory_fallback_allowed');
});

it('reports unavailable when fallback is disabled', async () => {
  process.env.RATE_LIMIT_FAILURE_MODE = 'strict';
  mockFirestoreFailure();
  const result = await rateLimit('key', 5, 60_000);
  expect(result).toEqual({ allowed: false, status: 'unavailable' });
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/rate-limit.test.ts`
Expected: FAIL because `rateLimit()` returns boolean.

- [ ] **Step 3: Implement typed result**

```ts
export type RateLimitResult = {
  allowed: boolean;
  status: RateLimitStatus;
  resetAt?: number;
};
```

Environment:

```dotenv
RATE_LIMIT_FAILURE_MODE=memory_fallback
```

Use `strict` to reject when Firestore is unavailable. Use `memory_fallback` to preserve continuity while reporting degradation.

- [ ] **Step 4: Replace raw-IP keying with a privacy-safe key**

Derive the bucket key from a daily-rotated HMAC secret:

```ts
createHmac('sha256', process.env.SECURITY_TELEMETRY_HMAC_KEY!).update(clientIdentifier).digest('hex').slice(0, 32)
```

Do not persist the raw input. Require a strong secret in production.

- [ ] **Step 5: Verify pass**

Run: `npm test -- src/lib/rate-limit.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/rate-limit.test.ts .env.example
git commit -m "feat(security): expose rate limiter degradation"
```

---

### Task 4: Persist privacy-safe telemetry

**Files:**
- Create: `src/lib/security-telemetry.ts`
- Create: `src/lib/security-telemetry.test.ts`

**Interfaces:**
- Produces: `recordSpamProtectionReport(report)` and aggregate queries.
- Consumes: Firestore/admin monitoring store.

- [ ] **Step 1: Write failing telemetry tests**

```ts
it('stores no personal or credential fields', async () => {
  await recordSpamProtectionReport(report);
  const stored = fakeStore.lastWrite;
  const serialized = JSON.stringify(stored);
  for (const forbidden of ['phone','email','telegram','token','cookie','authorization','message','ip']) {
    expect(serialized.toLowerCase()).not.toContain(forbidden);
  }
});

it('uses a 30 day expiry', async () => {
  await recordSpamProtectionReport(report);
  expect(fakeStore.lastWrite.expiresAt.getTime() - Date.now()).toBeWithin(29, 31, 'days');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/security-telemetry.test.ts`
Expected: FAIL because telemetry module does not exist.

- [ ] **Step 3: Implement Firestore record**

Collection: `_security_spam_reports`.

Stored fields:

```text
version, requestId, environment, turnstileStatus, originStatus,
rateLimitStatus, honeypotStatus, finalDecision, degradedControls,
durationMs, createdAt, expiresAt, coarse route/context
```

If telemetry storage fails, log a sanitized one-line error and include `telemetry_failed` in the alert path; do not change the already-decided public lead response.

- [ ] **Step 4: Verify pass**

Run: `npm test -- src/lib/security-telemetry.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/security-telemetry.ts src/lib/security-telemetry.test.ts
git commit -m "feat(security): record privacy-safe spam telemetry"
```

---

### Task 5: Add deduplicated security alerts

**Files:**
- Create: `src/lib/security-alerts.ts`
- Create: `src/lib/security-alerts.test.ts`

**Interfaces:**
- Produces: `evaluateSecurityAlerts(report)` and `sendSecurityAlert()`.
- Consumes: telemetry report and existing Telegram/admin channel configuration.

- [ ] **Step 1: Write failing alert tests**

```ts
it('alerts when Turnstile secret is missing in production', async () => {
  await evaluateSecurityAlerts(report({ turnstileStatus: 'skipped_missing_secret' }));
  expect(fakeSender.messages).toHaveLength(1);
});

it('deduplicates repeated incidents during cooldown', async () => {
  const incident = report({ rateLimitStatus: 'memory_fallback_allowed' });
  await evaluateSecurityAlerts(incident);
  await evaluateSecurityAlerts(incident);
  expect(fakeSender.messages).toHaveLength(1);
});

it('does not include lead data', async () => {
  await evaluateSecurityAlerts(report({ turnstileStatus: 'provider_failed' }));
  expect(fakeSender.messages[0]).not.toMatch(/phone|email|message|token/i);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/security-alerts.test.ts`
Expected: FAIL because alert module does not exist.

- [ ] **Step 3: Implement incident types and cooldown**

Alert types:

```text
turnstile_secret_missing
turnstile_provider_failure_spike
origin_violation_spike
firestore_rate_limit_degraded
rate_limit_unavailable
rejected_submission_spike
telemetry_storage_failed
```

Use Firestore `_security_alert_state` to store first occurrence, last occurrence, count, cooldown until, and environment. Default cooldown: 15 minutes. Thresholds come from validated environment variables.

- [ ] **Step 4: Use existing admin channel safely**

Send only type, environment, count, first/last occurrence, and request IDs/count. Escape Telegram HTML. Alert delivery failure is logged but never recursively triggers another Telegram alert.

- [ ] **Step 5: Verify pass**

Run: `npm test -- src/lib/security-alerts.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/security-alerts.ts src/lib/security-alerts.test.ts .env.example
git commit -m "feat(security): alert on anti-spam degradation"
```

---

### Task 6: Integrate one report per submit request

**Files:**
- Modify: `src/app/api/submit-form/route.ts`
- Modify: `src/app/api/diagnostics/route.ts`
- Create: `src/app/api/submit-form/route.security.test.ts`

**Interfaces:**
- Consumes: typed guard, typed rate limit, telemetry, alerts.
- Produces: one finalized report for every code path.

- [ ] **Step 1: Write failing integration tests**

```ts
it('records exactly one report for a successful lead', async () => {
  await POST(validRequest());
  expect(recordSpamProtectionReport).toHaveBeenCalledTimes(1);
  expect(recordSpamProtectionReport).toHaveBeenCalledWith(expect.objectContaining({ finalDecision: 'allow' }));
});

it('records rate-limited request', async () => {
  mockRateLimit({ allowed: false, status: 'firestore_blocked' });
  const response = await POST(validRequest());
  expect(response.status).toBe(429);
  expect(recordSpamProtectionReport).toHaveBeenCalledWith(expect.objectContaining({ finalDecision: 'rate_limited' }));
});

it('does not expose degradation details publicly', async () => {
  mockTurnstileProviderFailure('business_continuity');
  const response = await POST(validRequest());
  expect(JSON.stringify(await response.json())).not.toMatch(/provider_failed|memory_fallback|missing_secret/);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/app/api/submit-form/route.security.test.ts`
Expected: FAIL because the current route returns early without a unified report.

- [ ] **Step 3: Refactor around a finalizer**

At request start:

```ts
const startedAt = performance.now();
const requestId = crypto.randomUUID();
let reportState = initialReportState(requestId);
```

Before every return, call one finalizer that builds, stores, and evaluates alerts. Guard against duplicate finalization with a boolean or immutable state transition.

- [ ] **Step 4: Preserve current truthful delivery response**

Do not change `integrations.analyticsDelivery`, Telegram, AmoCRM, or queue reporting except adding an optional public `requestId` for support correlation.

- [ ] **Step 5: Update diagnostics flow**

Apply the same report model to diagnostics lead submission, with context `diagnostics`, so monitoring covers both public lead surfaces.

- [ ] **Step 6: Verify pass**

Run: `npm test -- src/app/api/submit-form/route.security.test.ts src/lib/lead-guard.test.ts src/lib/rate-limit.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/submit-form/route.ts src/app/api/diagnostics/route.ts src/app/api/submit-form/route.security.test.ts
git commit -m "feat(security): monitor every lead protection decision"
```

---

### Task 7: Add operational health and staging tests

**Files:**
- Create/Modify: internal security health route.
- Create: `e2e/spam-protection.spec.ts`
- Create: `docs/security/spam-protection-operations.md`

**Interfaces:**
- Produces: authenticated aggregate health and end-to-end evidence.

- [ ] **Step 1: Add internal health contract**

Return aggregate states only:

```json
{
  "turnstile": "healthy|degraded|misconfigured",
  "rateLimit": "healthy|fallback|unavailable",
  "telemetry": "healthy|degraded",
  "lastIncidentAt": "ISO timestamp or null"
}
```

Protect it with an existing internal/admin secret; never expose reports publicly.

- [ ] **Step 2: Write Playwright tests**

Cover:

```text
valid lead accepted
invalid origin rejected
honeypot dropped with non-descriptive success
strict Turnstile outage rejected
continuity outage accepted only with other controls healthy
burst requests eventually return 429
public response contains no internal statuses
```

- [ ] **Step 3: Add operations runbook**

Document environment variables, thresholds, strict/continuity tradeoff, Firestore collections, 30-day retention, alert cooldown, and incident response steps.

- [ ] **Step 4: Run full verification**

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: PASS.

- [ ] **Step 5: Staging failure drills**

In staging only, simulate missing Turnstile secret, provider timeout, Firestore rate-limit failure, invalid origin, and alert delivery failure. Verify each creates one sanitized report and expected deduplicated alert.

- [ ] **Step 6: Commit and open PR**

```bash
git add src e2e docs/security .env.example
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
git commit -m "fix(security): monitor spam protection fallbacks"
```

PR title: `fix(security): monitor and control spam fallbacks`

Evidence: unit/integration/Playwright results, staging drills, sample redacted report, deduplication result, and confirmation that invalid production origins are blocked.
