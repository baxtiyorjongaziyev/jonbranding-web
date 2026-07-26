# Jon Branding P1 Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make production builds strict, run browser regression tests in CI, and return truthful analytics delivery results.

**Architecture:** Keep analytics transport in a focused server-side module that returns a per-channel report. The form route awaits the three deliveries concurrently and exposes the report without leaking credentials. Playwright runs as a separate Chromium job after unit/build checks.

**Tech Stack:** Next.js, TypeScript, Vitest, Playwright, GitHub Actions.

## Tasks

- [x] Add failing tests for strict build configuration, Playwright CI, and analytics delivery reporting.
- [x] Add `analytics-delivery.ts` with delivered/failed/skipped states.
- [ ] Integrate the delivery report into `submit-form` and log failed channels.
- [ ] Remove `ignoreBuildErrors`.
- [ ] Add local Playwright web server and Chromium CI job.
- [ ] Run typecheck, lint, unit tests, build, and Playwright checks.

The scoped one-shot workflow applies only to the same-repository `p1/reliability-ci-monitoring` branch and aborts if any expected source fragment is not unique.
