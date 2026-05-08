# GitHub Operating System

This repository uses GitHub as the source of truth for code, product tasks, reviews, CI, and production deployment.

## Branches

- `main` is production and deploys to `jonbranding.uz`.
- Use short-lived branches for all work.
- Recommended branch prefixes:
  - `codex/` for Codex work
  - `fix/` for bugs
  - `feature/` for new functionality
  - `design/` for UX/UI work
  - `docs/` for documentation

## Pull requests

Every code change should go through a pull request.

Required before merge:
- CI is green.
- Screenshots are attached for UI changes.
- Mobile layout is checked.
- Contact modal or primary CTA is checked when conversion paths change.
- Deployment risk is documented.

## Issues

Use issues for all meaningful work. Recommended labels:
- `bug`
- `conversion`
- `design-system`
- `security`
- `performance`
- `seo`
- `content`
- `ci-cd`
- `dependencies`
- `P0`
- `P1`
- `P2`
- `P3`

## Deployments

- Pull requests receive preview deployments.
- Merges to `main` trigger Firebase App Hosting deployment for the `jonbranding-web` backend.
- Production is available at https://jonbranding.uz/.

## Weekly review

Every week, review:
- Open P0/P1 issues.
- Failed GitHub Actions runs.
- Dependabot PRs.
- Security alerts.
- Conversion tasks stuck in review.
- Production deployment history.
