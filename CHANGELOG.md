# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-06

### Added
- Multi-language SEO with `hreflang` alternates in sitemap.
- Global error boundary (`src/app/error.tsx`).
- Security middleware with rate limiting and security headers.
- Chinese localization for all sections and testimonials.
- Unit tests for localization system.
- Prettier and Husky configuration for better DX.
- `SECURITY.md` and `CODE_OF_CONDUCT.md`.

### Changed
- Refactored all scripts to use relative paths for portability.
- Made Google Analytics ID and API Secret dynamic via environment variables.
- Enhanced form submission validation with Zod.
- Optimized script loading for 100/100 Lighthouse score.

### Fixed
- Sync issues between `ru.json` and other locales.
- Missing translations in `zh.json`.
- Hardcoded absolute paths in asset download scripts.

## [1.0.0] - 2026-03-24
- Initial release of Jon Branding Web.
