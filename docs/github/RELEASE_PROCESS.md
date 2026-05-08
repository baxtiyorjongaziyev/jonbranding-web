# Release Process

Use releases to mark meaningful production milestones.

## Version naming

Use semantic-style names:
- `v1.2.0` for visible product or funnel changes
- `v1.2.1` for fixes
- `v2.0.0` for major redesigns or architecture changes

## Release checklist

- CI passed on `main`.
- Firebase App Hosting deployment succeeded.
- `jonbranding.uz` returns `200`.
- Primary CTA opens the contact modal.
- Mobile hero and sticky CTA are visually checked.
- Known risks are documented.

## Release notes format

```md
## What changed
- 

## Conversion impact
- 

## Verification
- 

## Rollback
- Previous stable commit:
```
