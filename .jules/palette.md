
## 2024-05-18 - Ensure Custom Lightbox Controls Are Accessible
**Learning:** Custom UI controls within lightboxes and galleries (like next/prev or close buttons), often constructed from raw `<button>` elements, frequently lack `type="button"`, ARIA labels, and explicit focus-visibility styling, making them difficult or impossible to use for keyboard navigators and screen readers.
**Action:** When implementing or updating custom gallery/lightbox components, always ensure navigation controls have clear `aria-label`s, `type="button"`, `aria-hidden="true"` on inner icons, and explicit `focus-visible` utility classes for keyboard navigation.
## 2024-05-18 - [Accessibility] Explicit IDs and ARIA labels for Custom Modals
**Learning:** Custom interactive components like `AtModal` often lack the inherent semantic structure of standard forms, resulting in disconnected `label`/`input` pairs and icon-only close buttons lacking `aria-label`s.
**Action:** Always verify that inputs/selects in custom dialogs have `id` attributes that strictly map to the `htmlFor` of their corresponding `label` elements, and ensure icon-only close buttons have explicit `aria-label` attributes and focus visibility styling (`focus-visible:ring-primary`).
