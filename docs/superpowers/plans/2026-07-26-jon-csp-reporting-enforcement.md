# Jon Branding CSP Reporting and Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove production `script-src 'unsafe-inline'` without breaking pages, forms, analytics, localization, structured data, or static-site performance unnecessarily.

**Architecture:** Extract CSP generation, ship report-only telemetry, and inventory real violations. Add request-scoped nonces through Next.js 16 `src/proxy.ts` only to route groups that need dynamic nonce rendering. Move known JSON-LD scripts into nonce-aware components, measure cache/TTFB impact, then enable enforcement behind an environment rollback switch.

**Tech Stack:** Next.js 16.2, TypeScript, App Router, Next.js Proxy, Vitest, Playwright, Firestore/monitoring transport.

## Global Constraints

- Production `script-src` does not rely on `unsafe-inline` at completion.
- Report-only ships before enforcement.
- CSP reports have strict content type, size, rate limit, redaction, deduplication, and retention.
- Cookies, authorization headers, secret-bearing query strings, lead content, and tokens are never stored.
- Third-party origins are allowed only when runtime evidence proves necessity.
- Development may include `unsafe-eval`; production may not.
- Nonce-based routes are dynamically rendered; do not convert the whole site without measuring caching and performance impact.
- Production enforcement has an environment-controlled rollback to report-only mode.

---

## File Structure

- Create `src/lib/csp.ts` and `src/lib/csp.test.ts`.
- Create `src/lib/csp-report.ts` and `src/lib/csp-report.test.ts`.
- Create `src/app/api/security/csp-report/route.ts` and `route.test.ts`.
- Create `src/proxy.ts` and `src/proxy.test.ts`.
- Modify `next.config.js`.
- Create `src/components/seo/StructuredData.tsx` and `StructuredData.test.tsx`.
- Modify `src/app/[lang]/layout.tsx`.
- Modify `src/app/[lang]/blog/[slug]/page.tsx`.
- Audit and modify these exact pages if their existing `Script` usage is confirmed by the report inventory:
  - `src/app/[lang]/narxlar/page.tsx`
  - `src/app/[lang]/xizmatlar/page.tsx`
  - `src/app/[lang]/blog/page.tsx`
  - `src/app/[lang]/pricing/sotuvchi-kartochka/page.tsx`
- Create `scripts/security/csp-performance-check.mjs`.
- Create `e2e/csp.spec.ts`.
- Create `docs/security/csp-rollout.md`, `csp-origin-inventory.md`, and `csp-rendering-decision.md`.

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
  it('has the strict baseline', () => {
    const csp = buildCsp({ mode: 'report-only', environment: 'production' });
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('uses nonce and strict-dynamic in enforcement mode', () => {
    const csp = buildCsp({ mode: 'enforce-nonce', nonce: 'abc123', environment: 'production' });
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it('allows unsafe-eval only during development', () => {
    expect(buildCsp({ mode: 'enforce-nonce', nonce: 'abc123', environment: 'development' })).toContain("'unsafe-eval'");
    expect(buildCsp({ mode: 'enforce-nonce', nonce: 'abc123', environment: 'production' })).not.toContain("'unsafe-eval'");
  });
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/csp.test.ts`
Expected: FAIL because `src/lib/csp.ts` does not exist.

- [ ] **Step 3: Implement typed policy modes**

```ts
export type CspMode = 'report-only' | 'enforce-nonce';

export function buildCsp({ mode, nonce, environment }: {
  mode: CspMode;
  nonce?: string;
  environment: 'development' | 'production' | 'test';
}): string {
  if (mode === 'enforce-nonce' && !nonce) {
    throw new Error('nonce is required');
  }

  const scriptSources = mode === 'enforce-nonce'
    ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"]
    : ["'self'", "'unsafe-inline'"];

  if (environment === 'development') scriptSources.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "report-uri /api/security/csp-report",
  ].join('; ');
}
```

Replace the minimal origin list with named directive arrays copied from the current policy only after each origin is assigned an owner/use in Task 4.

- [ ] **Step 4: Remove CSP duplication from `next.config.js`**

Keep HSTS, nosniff, referrer policy, permissions policy, and cache headers. CSP is generated only through `src/lib/csp.ts`.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/lib/csp.test.ts
npm run typecheck
npm run lint
git add src/lib/csp.ts src/lib/csp.test.ts next.config.js
git commit -m "refactor(security): centralize CSP policy"
```

---

### Task 2: Add sanitized CSP report ingestion

**Files:**
- Create: `src/lib/csp-report.ts`
- Create: `src/lib/csp-report.test.ts`
- Create: `src/app/api/security/csp-report/route.ts`
- Create: `src/app/api/security/csp-report/route.test.ts`

**Interfaces:**
- Produces: `parseCspReport()`, `sanitizeCspReport()`, and a POST report endpoint.
- Consumes: `application/csp-report` and `application/reports+json` payloads.

- [ ] **Step 1: Write failing parser/redaction tests**

```ts
import { parseCspReport, sanitizeCspReport } from './csp-report';

it('removes query strings and arbitrary fields', () => {
  const report = sanitizeCspReport({
    'document-uri': 'https://jonbranding.uz/uz/contact?token=secret',
    'blocked-uri': 'https://example.com/script.js?key=secret',
    'violated-directive': 'script-src-elem',
    sourceFile: 'https://jonbranding.uz/app.js?x=1',
    cookie: 'must-not-survive',
  });
  expect(report.documentPath).toBe('/uz/contact');
  expect(JSON.stringify(report)).not.toContain('secret');
  expect(JSON.stringify(report)).not.toContain('must-not-survive');
});

it('rejects payloads above 16 KiB', () => {
  expect(() => parseCspReport('x'.repeat(16_385), 'application/csp-report')).toThrow('payload_too_large');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/lib/csp-report.test.ts`
Expected: FAIL because the report module does not exist.

- [ ] **Step 3: Implement the minimal report model**

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

Normalize blocked values to a URL origin or one of `inline`, `eval`, `data`, `blob`, `self`, and `unknown`. Strip query and fragment. Never copy unrecognized keys.

- [ ] **Step 4: Implement endpoint controls**

```text
POST only
accepted content types: application/csp-report, application/reports+json
maximum body: 16384 bytes
rate limit: 30 reports/minute per HMAC client key
deduplication: directive + blocked origin + document path for 10 minutes
accepted/duplicate response: 204
invalid response: 400, 413, or 415
retention: 30 days
```

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/lib/csp-report.test.ts src/app/api/security/csp-report/route.test.ts
git add src/lib/csp-report.ts src/lib/csp-report.test.ts src/app/api/security/csp-report
git commit -m "feat(security): ingest sanitized CSP reports"
```

---

### Task 3: Ship report-only policy through Next.js Proxy

**Files:**
- Create: `src/proxy.ts`
- Create: `src/proxy.test.ts`
- Modify: `.env.example`
- Create: `docs/security/csp-rollout.md`

**Interfaces:**
- Produces: request nonce header plus report-only/enforced CSP response header.
- Consumes: `buildCsp()`.

- [ ] **Step 1: Write failing proxy tests**

```ts
import { config, proxy } from './proxy';

it('adds report-only header in reporting mode', () => {
  process.env.CSP_MODE = 'report-only';
  const response = proxy(makeNextRequest('/uz'));
  expect(response.headers.get('Content-Security-Policy-Report-Only')).toContain("default-src 'self'");
  expect(response.headers.get('Content-Security-Policy')).toBeNull();
});

it('excludes API and Next static assets from the matcher', () => {
  const matcher = JSON.stringify(config.matcher);
  expect(matcher).toContain('api');
  expect(matcher).toContain('_next/static');
  expect(matcher).toContain('_next/image');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/proxy.test.ts`
Expected: FAIL because `src/proxy.ts` does not exist.

- [ ] **Step 3: Implement `src/proxy.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { buildCsp, parseCspMode } from '@/lib/csp';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const mode = parseCspMode(process.env.CSP_MODE ?? 'report-only');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const headerName = mode === 'report-only'
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy';

  response.headers.set(headerName, buildCsp({
    mode,
    nonce,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }));
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
```

- [ ] **Step 4: Add rollout configuration**

```dotenv
CSP_MODE=report-only
CSP_REPORT_ALERT_THRESHOLD=20
CSP_REPORT_HMAC_KEY=
```

Require a 32-byte-or-longer HMAC key in production. Document rollback by changing `CSP_MODE` from `enforce-nonce` to `report-only`.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/proxy.test.ts
npm run typecheck
npm run lint
git add src/proxy.ts src/proxy.test.ts .env.example docs/security/csp-rollout.md
git commit -m "feat(security): deploy CSP report-only mode"
```

---

### Task 4: Move known inline structured data into nonce-aware components

**Files:**
- Create: `src/components/seo/StructuredData.tsx`
- Create: `src/components/seo/StructuredData.test.tsx`
- Modify: `src/app/[lang]/layout.tsx`
- Modify: `src/app/[lang]/blog/[slug]/page.tsx`
- Inspect and modify only when confirmed by report inventory:
  - `src/app/[lang]/narxlar/page.tsx`
  - `src/app/[lang]/xizmatlar/page.tsx`
  - `src/app/[lang]/blog/page.tsx`
  - `src/app/[lang]/pricing/sotuvchi-kartochka/page.tsx`
- Create: `docs/security/csp-origin-inventory.md`

**Interfaces:**
- Produces: `<StructuredData id value nonce />`.
- Consumes: `safeJsonStringify()` and request nonce.

- [ ] **Step 1: Write failing component tests**

```tsx
import { render } from '@testing-library/react';
import { StructuredData } from './StructuredData';

it('places the request nonce on JSON-LD script', () => {
  const { container } = render(
    <StructuredData id="business-json-ld" nonce="abc123" value={{ '@type': 'LocalBusiness' }} />,
  );
  const script = container.querySelector('script');
  expect(script).toHaveAttribute('nonce', 'abc123');
  expect(script?.textContent).toContain('LocalBusiness');
});

it('escapes closing script sequences', () => {
  const { container } = render(
    <StructuredData id="safe-json-ld" nonce="abc123" value={{ text: '</script><script>alert(1)</script>' }} />,
  );
  expect(container.innerHTML).not.toContain('</script><script>alert');
});
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- src/components/seo/StructuredData.test.tsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the component**

```tsx
import Script from 'next/script';
import { safeJsonStringify } from '@/lib/security';

export function StructuredData({ id, value, nonce }: {
  id: string;
  value: Record<string, unknown>;
  nonce?: string;
}) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(value) }}
    />
  );
}
```

- [ ] **Step 4: Update the two confirmed script owners**

In `src/app/[lang]/layout.tsx` and `src/app/[lang]/blog/[slug]/page.tsx`, read `x-nonce` using `await headers()` and pass it to every `StructuredData` instance. Remove direct JSON-LD `Script` blocks.

- [ ] **Step 5: Audit the four additional exact pages**

For each page, record the script ID, directive, whether it is required, and the exact remediation in `docs/security/csp-origin-inventory.md`. Modify only pages with confirmed executable/JSON-LD script usage; mark pages with no relevant script as `no CSP script change required`.

- [ ] **Step 6: Move the inline root style**

Move the `body` inline style currently emitted in `src/app/[lang]/layout.tsx` into `src/app/globals.css` or an existing stylesheet class so it no longer requires an inline style block from application code.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- src/components/seo/StructuredData.test.tsx
npm run typecheck
npm run lint
git add src/components/seo/StructuredData.tsx src/components/seo/StructuredData.test.tsx 'src/app/[lang]/layout.tsx' 'src/app/[lang]/blog/[slug]/page.tsx' src/app/globals.css docs/security/csp-origin-inventory.md
git commit -m "fix(security): make structured data nonce aware"
```

---

### Task 5: Measure the dynamic-rendering impact

**Files:**
- Create: `scripts/security/csp-performance-check.mjs`
- Create: `docs/security/csp-rendering-decision.md`

**Interfaces:**
- Produces: route-group decision and before/after TTFB/cache evidence.
- Consumes: staging routes and build output.

- [ ] **Step 1: Measure the current baseline**

Record build rendering mode, response cache headers, and median TTFB over 20 requests for:

```text
/uz
/uz/xizmatlar
/uz/narxlar
/uz/blog
/uz/blog/security-fixture-post
/uz/diagnostika
```

- [ ] **Step 2: Measure report-only nonce propagation**

Deploy the Proxy branch to staging and repeat the same measurements. Record whether each route became dynamic and whether hosting cache behavior changed.

- [ ] **Step 3: Decide every route group**

`docs/security/csp-rendering-decision.md` assigns each route group exactly one strategy:

```text
request nonce with dynamic rendering
or
static/hash-compatible policy with reviewed script hashes
```

No route group remains undecided.

- [ ] **Step 4: Commit**

```bash
git add scripts/security/csp-performance-check.mjs docs/security/csp-rendering-decision.md
git commit -m "docs(security): decide CSP rendering strategy"
```

---

### Task 6: Enable enforced CSP and verify core flows

**Files:**
- Modify: `src/lib/csp.ts`
- Modify: `src/proxy.ts`
- Modify route/layout files named in `docs/security/csp-rendering-decision.md`.
- Create: `e2e/csp.spec.ts`

**Interfaces:**
- Consumes: report inventory and route rendering decision.
- Produces: enforced production policy without script `unsafe-inline`.

- [ ] **Step 1: Write failing browser tests**

```ts
import { expect, test } from '@playwright/test';

test('core flows work under enforced CSP', async ({ page }) => {
  const scriptViolations: string[] = [];
  page.on('console', message => {
    if (/content security policy/i.test(message.text()) && /script-src/i.test(message.text())) {
      scriptViolations.push(message.text());
    }
  });

  await page.goto('/uz');
  await page.goto('/uz/xizmatlar');
  await page.goto('/uz/diagnostika');
  expect(scriptViolations).toEqual([]);
});
```

Add tests for locale switching, CTA navigation, lead/diagnostic forms, analytics requests, structured data, images, fonts, and video/media.

- [ ] **Step 2: Verify failure before remediation is complete**

Run: `CSP_MODE=enforce-nonce npm run test:e2e`
Expected: FAIL while unreviewed script violations remain.

- [ ] **Step 3: Enable enforcement**

Set `Content-Security-Policy` in `enforce-nonce` mode. Assert the production `script-src` contains neither `unsafe-inline` nor `unsafe-eval`.

- [ ] **Step 4: Keep rollback tested**

Run one test with `CSP_MODE=report-only` and assert enforcement header is absent while the report-only header is present. Rollback requires an environment change, not a code rollback.

- [ ] **Step 5: Run full verification**

```bash
npm run typecheck
npm run lint
npm test
CSP_MODE=enforce-nonce npm run build
CSP_MODE=enforce-nonce npm run test:e2e
```

Expected: PASS.

- [ ] **Step 6: Require seven clean staging runs**

Each run covers the six representative routes and core form flow. Acceptance requires no unreviewed script violation and no broken core flow for seven consecutive runs.

- [ ] **Step 7: Commit and open PR**

```bash
git add src e2e docs/security
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
git commit -m "fix(security): enforce strict CSP"
```

PR title: `fix(security): enforce nonce-aware CSP`

Evidence: report inventory, rendering decision, before/after measurements, unit tests, build, Playwright, and rollback test.
