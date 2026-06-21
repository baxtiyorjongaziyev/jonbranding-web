
## 2024-05-18 - Ensure Custom Lightbox Controls Are Accessible
**Learning:** Custom UI controls within lightboxes and galleries (like next/prev or close buttons), often constructed from raw `<button>` elements, frequently lack `type="button"`, ARIA labels, and explicit focus-visibility styling, making them difficult or impossible to use for keyboard navigators and screen readers.
**Action:** When implementing or updating custom gallery/lightbox components, always ensure navigation controls have clear `aria-label`s, `type="button"`, `aria-hidden="true"` on inner icons, and explicit `focus-visible` utility classes for keyboard navigation.
## 2024-06-21 - Form input accessibility in Modals
**Learning:** Modal forms (like `AtModal`) often contain visually implicit labels that screen readers cannot associate with inputs because they lack `htmlFor` on `<label>` elements and matching `id` attributes on `<input>` and `<select>` elements.
**Action:** Always verify and enforce that every `<label>` within modal forms contains an `htmlFor` attribute that strictly corresponds to an explicitly defined `id` attribute on its target input element.
