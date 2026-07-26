# Jon Branding CSP Reporting and Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove production `script-src 'unsafe-inline'` without breaking pages, forms, analytics, localization, or static-site performance unnecessarily.

**Architecture:** First extract CSP generation and ship report-only telemetry. Inventory real violations. Then choose the approved enforcement path per route group: request nonce through Next.js 16 `proxy.ts` for dynamic pages that need it, and reviewed static/hash-compatible policy for static pages. Keep enforcement behind an environment rollback switch.

**Tech Stack:** Next.js 16.2, TypeScript, App Router, Next.js Proxy, Vitest, Playwright, Firestore/monitoring transport.

## Global Constraints

- Production `script-src` must not rely on `unsafe-inline` at completion.
- Report-only ships before enforcement.
- CSP reports have strict content type, size, rate limit, redaction, deduplication, and retention.
- Cookies, authorization headers, query strings containing secrets, lead content, and tokens are never stored.
- Third-party origins are allowed only when current runtime evidence proves necessity.
- Development may include `unsafe-eval`; production may not.
- Nonce-based pages are dynamically rendered; do not convert the whole site without measuring caching/performance impact.
- Production enforcement has an environment-controlled rollback to report-only/legacy policy.

---

## File Structure

- Create `src/lib/csp.ts`: policy builder, directives, report URI, mode selection.
- Create `src/lib/csp.test.ts`.
- Create `src/proxy.ts`: request-scoped nonce and headers for selected routes.
- Modify `next.config.js`: remove duplicated CSP assembly; retain non-CSP security headers.
- Create `src/app/api/security/csp-report/route.ts`.
- Create `src/lib/csp-report.ts` and tests.
- Create `src/lib/security-alerts.ts` only if no shared alert transport exists.
- Modify third-party script components to accept/read nonce where required.
- Modify Playwright tests and add CSP-specific browser tests.
- Create `docs/security/csp-rollout.md`.

---

### Task 1: Extract a testable CSP policy builder

**Files:**
- Create: `src/lib/csp.ts`
- Create: `src/lib/csp.test.ts`
- Modify: `next.config.js`

**Interfaces:**
- Produces: `buildCsp({ mode, nonce, environment }): string`.
- Consumes: environment and optional nonce.

- [ ] **Step 1: Write failing policy tests**

```ts
import { buildCsp } from './csp';

describe('buildCsp', () => {
  it('has a strict baseline', () => {
    const csp = buildCsp({ mode: 'report-only', environment: 'production' });
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('uses a nonce and strict-dynamic for nonce enforcement', () => {
    const csp = buildCsp({ mode: 'enforce-nonce', nonce: 'abc123', environment: 'production' });
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it('allows unsafe-eval only in development', () => {
    expect(buildCsp({ mode: 'enforce-nonce', nonce: 'x', environment: 'development' })).toContain("'unsafe-eval'");
    expect(buildCsp({ mode: 'enforce-nonce', nonce: 'x', environment: 'production' })).not.toContain("'unsafe-eval'");
  });
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/csp.test.ts`
Expected: FAIL because `csp.ts` does not exist.

- [ ] **Step 3: Implement typed CSP modes**

```ts
export type CspMode = 'legacy' | 'report-only' | 'enforce-nonce';

export function buildCsp({ mode, nonce, environment }: {
  mode: CspMode;
  nonce?: string;
  environment: 'development' | 'production' | 'test';
}): string {
  if (mode === 'enforce-nonce' && !nonce) throw new Error('nonce is required');
  // Assemble normalized directives from verified origin arrays.
}
```

Keep external domains in named arrays by directive. Include `report-to`/`report-uri` according to browser compatibility, pointing to `/api/security/csp-report`.

- [ ] **Step 4: Remove static CSP duplication from next.config.js**

`next.config.js` keeps HSTS, nosniff, referrer policy, cache headers, and other non-CSP headers. During reporting rollout it may add a static report-only policy only for routes excluded from `proxy.ts`; the builder remains the single policy source.

- [ ] **Step 5: Verify pass**

Run: `npm test -- src/lib/csp.test.ts && npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/csp.ts src/lib/csp.test.ts next.config.js
git commit -m "refactor(security): centralize CSP policy"
```

---

### Task 2: Add sanitized CSP report ingestion

**Files:**
- Create: `src/lib/csp-report.ts`
- Create: `src/lib/csp-report.test.ts`
- Create: `src/app/api/security/csp-report/route.ts`

**Interfaces:**
- Produces: `parseCspReport()`, `sanitizeCspReport()`, POST report endpoint.
- Consumes: standard `application/csp-report` and Reporting API JSON payloads.

- [ ] **Step 1: Write failing parser/redaction tests**

```ts
import { sanitizeCspReport } from './csp-report';

it('removes query strings and sensitive fields', () => {
  const report = sanitizeCspReport({
    'document-uri': 'https://jonbranding.uz/uz/contact?token=secret',
    'blocked-uri': 'https://example.com/script.js?key=secret',
    'violated-directive': 'script-src-elem',
    sourceFile: 'https://jonbranding.uz/app.js?x=1',
  });
  expect(report.documentPath).toBe('/uz/contact');
  expect(JSON.stringify(report)).not.toContain('secret');
});

it('rejects payloads larger than 16KB', () => {
  expect(() => parseCspReport('x'.repeat(16_385), 'application/csp-report')).toThrow('payload_too_large');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/csp-report.test.ts`
Expected: FAIL because parser does not exist.

- [ ] **Step 3: Implement a minimal report model**

Store only:

```ts
export type SanitizedCspReport = {
  requestId: string;
  documentPath: string;
  effectiveDirective: string;
  blockedOrigin: string;
  sourcePath?: string;
  disposition: 'report' | 'enforce' | 'unknown';
  statusCode?: number;
  receivedAt: string;
};
```

Normalize blocked URLs to origin or `'inline'`, `'eval'`, `'data'`, `'blob'`. Strip query and fragment. Never copy arbitrary report keys.

- [ ] **Step 4: Implement endpoint controls**

```text
POST only
Content-Type application/csp-report or application/reports+json
Content-Length maximum 16384 bytes
rate limit 30 reports/minute per privacy-preserving client key
deduplicate by directive + blocked origin + document path for 10 minutes
return 204 for accepted and duplicate reports
return 400/413/415 for invalid input
```

- [ ] **Step 5: Verify route tests**

Create route tests for valid, malformed, wrong content type, oversized, duplicate, and rate-limited requests.

Run: `npm test -- src/lib/csp-report.test.ts src/app/api/security/csp-report/route.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/csp-report.ts src/lib/csp-report.test.ts src/app/api/security/csp-report
git commit -m "feat(security): ingest sanitized CSP reports"
```

---

### Task 3: Ship report-only policy and collect an inventory

**Files:**
- Create: `src/proxy.ts`
- Create: `src/proxy.test.ts`
- Modify: `.env.example`
- Create: `docs/security/csp-rollout.md`

**Interfaces:**
- Produces: CSP report-only header and nonce request header on selected HTML routes.
- Consumes: `buildCsp()`.

- [ ] **Step 1: Write failing proxy tests**

```ts
import { proxy } from '../src/proxy';

it('adds report-only CSP in reporting mode', async () => {
  process.env.CSP_MODE = 'report-only';
  const response = proxy(makeRequest('/uz'));
  expect(response.headers.get('Content-Security-Policy-Report-Only')).toContain("default-src 'self'");
  expect(response.headers.get('Content-Security-Policy')).toBeNull();
});

it('does not run for API and static assets', () => {
  expect(proxyConfig.matcher).toExclude('/api/submit-form');
  expect(proxyConfig.matcher).toExclude('/_next/static/app.js');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/proxy.test.ts`
Expected: FAIL because proxy does not exist.

- [ ] **Step 3: Implement Next.js 16 proxy**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { buildCsp } from '@/lib/csp';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const mode = parseCspMode(process.env.CSP_MODE || 'report-only');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const header = mode === 'report-only' ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  response.headers.set(header, buildCsp({ mode, nonce, environment: process.env.NODE_ENV === 'production' ? 'production' : 'development' }));
  return response;
}
```

Matcher excludes API, `_next/static`, `_next/image`, favicon, robots, sitemap, and prefetches.

- [ ] **Step 4: Add rollout configuration**

```dotenv
CSP_MODE=report-only
CSP_REPORT_ALERT_THRESHOLD=20
```

Document modes `legacy`, `report-only`, and `enforce-nonce` plus rollback procedure.

- [ ] **Step 5: Deploy report-only and collect evidence**

Collect at least seven representative staging runs covering home, services, cases, diagnostics, lead form, locale switch, analytics, and video/media. Classify each violation as required, removable, or third-party configuration.

- [ ] **Step 6: Commit**

```bash
git add src/proxy.ts src/proxy.test.ts .env.example docs/security/csp-rollout.md
git commit -m "feat(security): deploy CSP report-only mode"
```

---

### Task 4: Inventory and fix inline/third-party requirements

**Files:**
- Modify exact components identified by report evidence.
- Create `docs/security/csp-origin-inventory.md`.
- Modify analytics/third-party script components that use `next/script`.

**Interfaces:**
- Consumes: sanitized CSP reports.
- Produces: reviewed origin list and nonce-compatible scripts.

- [ ] **Step 1: Build the inventory table**

For each blocked source record:

```text
directive | blocked origin/value | page | owner component | required? | remediation | test
```

- [ ] **Step 2: Remove unused third-party origins**

Delete policy origins with no observed and no documented use. Do not keep broad wildcards.

- [ ] **Step 3: Make required scripts nonce-compatible**

For server components:

```tsx
import { headers } from 'next/headers';
import Script from 'next/script';

const nonce = (await headers()).get('x-nonce') ?? undefined;
return <Script src="https://example.com/script.js" nonce={nonce} strategy="afterInteractive" />;
```

Move application inline scripts into modules where possible. Stable snippets may use reviewed hashes only when nonce propagation is impossible.

- [ ] **Step 4: Reduce inline styles**

Move application inline style objects that cause violations into classes/CSS. Keep a temporary style exception only when runtime evidence proves framework injection needs it.

- [ ] **Step 5: Add component/browser tests**

Test each changed integration and ensure the CSP report list loses the corresponding violation.

- [ ] **Step 6: Commit**

```bash
git add src docs/security/csp-origin-inventory.md
git commit -m "fix(security): make third-party scripts CSP compatible"
```

---

### Task 5: Evaluate dynamic-rendering cost before nonce enforcement

**Files:**
- Create: `scripts/security/csp-performance-check.mjs`
- Create: `docs/security/csp-rendering-decision.md`

**Interfaces:**
- Produces: route-group decision between nonce enforcement and static/hash-compatible enforcement.

- [ ] **Step 1: Measure current route behavior**

Record build output and response cache headers for representative routes. Measure median TTFB over at least 20 staging requests before enforcement.

- [ ] **Step 2: Enable nonce enforcement on a staging route group**

Use `await connection()` only for pages that need dynamic nonce rendering. Do not blanket-convert all pages.

- [ ] **Step 3: Measure after change**

Record TTFB, cacheability, render errors, and hosting behavior. Accept nonce rendering only when security benefit outweighs measured performance/cost impact.

- [ ] **Step 4: Record exact decision**

For every route group choose:

```text
nonce dynamic enforcement
or
static/hash-compatible enforcement with documented script hashes/SRI path
```

Do not leave an undecided route group.

- [ ] **Step 5: Commit**

```bash
git add scripts/security/csp-performance-check.mjs docs/security/csp-rendering-decision.md
git commit -m "docs(security): decide CSP rendering strategy"
```

---

### Task 6: Enable enforced CSP with rollback

**Files:**
- Modify: `src/proxy.ts`
- Modify: `src/lib/csp.ts`
- Modify selected page/layout/script files.
- Create: `e2e/csp.spec.ts`

**Interfaces:**
- Consumes: inventory and rendering decision.
- Produces: enforced production CSP without script `unsafe-inline`.

- [ ] **Step 1: Write failing browser tests**

```ts
test('core flows work under enforced CSP', async ({ page }) => {
  const cspErrors: string[] = [];
  page.on('console', msg => {
    if (/content security policy/i.test(msg.text())) cspErrors.push(msg.text());
  });
  await page.goto('/uz');
  await page.getByRole('link', { name: /xizmat/i }).first().click();
  await page.goto('/uz/diagnostika');
  expect(cspErrors.filter(error => /script-src/i.test(error))).toEqual([]);
});
```

Add tests for locale switching, navigation, diagnostic/lead forms, analytics requests, and media.

- [ ] **Step 2: Verify failure in enforcement mode**

Run: `CSP_MODE=enforce-nonce npm run test:e2e`
Expected: FAIL until all required scripts/styles are compatible.

- [ ] **Step 3: Enable enforcement**

Set `Content-Security-Policy` in enforcement mode. Assert generated production `script-src` excludes `unsafe-inline` and `unsafe-eval`.

- [ ] **Step 4: Keep rollback switch**

`CSP_MODE=report-only` must restore report-only behavior without code rollback. `legacy` is temporary and documented with removal date after stable rollout.

- [ ] **Step 5: Run full verification**

```bash
npm run typecheck
npm run lint
npm test
CSP_MODE=enforce-nonce npm run build
CSP_MODE=enforce-nonce npm run test:e2e
```

Expected: PASS.

- [ ] **Step 6: Verify seven consecutive staging runs**

Acceptance: no unreviewed script violation, all core flows pass, and report volume stays below the documented alert threshold for seven runs.

- [ ] **Step 7: Commit and open PR**

```bash
git add src e2e docs/security
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
git commit -m "fix(security): enforce strict CSP"
```

PR title: `fix(security): enforce nonce-aware CSP`

Evidence: report inventory, route rendering decision, before/after browser tests, build, Playwright, and rollback test.
