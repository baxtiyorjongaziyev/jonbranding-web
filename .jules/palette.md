
## 2024-05-18 - Ensure Custom Lightbox Controls Are Accessible
**Learning:** Custom UI controls within lightboxes and galleries (like next/prev or close buttons), often constructed from raw `<button>` elements, frequently lack `type="button"`, ARIA labels, and explicit focus-visibility styling, making them difficult or impossible to use for keyboard navigators and screen readers.
**Action:** When implementing or updating custom gallery/lightbox components, always ensure navigation controls have clear `aria-label`s, `type="button"`, `aria-hidden="true"` on inner icons, and explicit `focus-visible` utility classes for keyboard navigation.
## 2026-06-20 - Prevent Repository Pollution
**Learning:** When using temporary Node.js scripts (like `patch.js`) to automate file edits, leaving them in the directory pollutes the git working tree and risks committing them by mistake.
**Action:** Always clean up temporary automation scripts (e.g., `rm patch.js`) before running tests or committing changes.
