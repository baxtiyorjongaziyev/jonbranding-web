
## 2024-05-18 - Accessible Navigational Controls in Image Galleries
**Learning:** Custom image galleries and lightboxes utilizing icon-only buttons for navigation (e.g., Previous, Next, Close) lack context for screen readers and miss visible focus states for keyboard users.
**Action:** Always provide explicit `aria-label`s on the control elements, add `aria-hidden="true"` to decorative inner icons, and ensure keyboard focus states are clearly delineated using standard utility classes like `focus-visible:ring-2 focus-visible:ring-primary`.
