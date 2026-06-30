# 2024-06-17 - Added Focus Visible States to Mobile Menu

**Learning:** Mobile-specific interactive elements (like hamburger menus,
off-canvas close buttons, and inner quick actions) are often built with purely
touch interactions in mind, leading to missing `focus-visible` utility classes
and broken keyboard accessibility. In Next.js/Tailwind codebases, this means
keyboard users cannot perceive focus when using the Tab key.
**Action:** When working on mobile components, always add explicit
`focus-visible` states (e.g., `focus-visible:ring-primary`,
`focus-visible:ring-offset-2`). Do not rely on default browser focus rings
which are often suppressed by reset stylesheets or `outline-none`.

## 2024-08-01 - Added Focus Visible States to Accordion
**Learning:** The Radix UI/Shadcn Accordion component's default styling might not include explicit focus states that are visible enough for keyboard users. To improve keyboard navigation accessibility, always make sure to add `focus-visible` utility classes (e.g., `focus-visible:ring-primary`, `focus-visible:ring-offset-2`) to interactive elements like `AccordionPrimitive.Trigger`.
**Action:** When inspecting components with multiple interactive sections, check for keyboard navigation visibility. Add explicit `focus-visible` utility classes where missing to ensure accessibility.

## 2024-06-26 - Add Focus Visible States to Exit Intent Popup
**Learning:** Similar to mobile navigation items, popups like ExitIntentPopup are prone to missing `focus-visible` utility classes, which impairs keyboard navigation since focus styles are critical for determining the currently active interactive element in modals. Furthermore, custom buttons often lack appropriate aria-labels.
**Action:** Always verify modals and popups have explicit `focus-visible` states on interactive elements and proper `aria-label` for screen readers.

## 2024-05-18 - Ensure Custom Lightbox Controls Are Accessible
**Learning:** Custom UI controls within lightboxes and galleries (like next/prev or close buttons), often constructed from raw `<button>` elements, frequently lack `type="button"`, ARIA labels, and explicit focus-visibility styling, making them difficult or impossible to use for keyboard navigators and screen readers.
**Action:** When implementing or updating custom gallery/lightbox components, always ensure navigation controls have clear `aria-label`s, `type="button"`, `aria-hidden="true"` on inner icons, and explicit `focus-visible` utility classes for keyboard navigation.

## 2024-05-18 - [Accessibility] Explicit IDs and ARIA labels for Custom Modals
**Learning:** Custom interactive components like `AtModal` often lack the inherent semantic structure of standard forms, resulting in disconnected `label`/`input` pairs and icon-only close buttons lacking `aria-label`s.
**Action:** Always verify that inputs/selects in custom dialogs have `id` attributes that strictly map to the `htmlFor` of their corresponding `label` elements, and ensure icon-only close buttons have explicit `aria-label` attributes and focus visibility styling (`focus-visible:ring-primary`).

## 2025-02-12 - Framer Motion AnimatePresence Exit Animations
**Learning:** In this project, when conditionally rendering children inside Framer Motion's `<AnimatePresence>`, the direct conditionally rendered child component MUST have a unique `key` prop. Without it, Framer Motion cannot track the component's presence lifecycle and the `exit` animation will be abruptly skipped. This was observed in floating widgets like OishaWidget.
**Action:** Always verify that the top-level motion component inside `<AnimatePresence>` (like `<motion.div>`) has an explicit, stable `key` prop (e.g. `key="modal-name"`) when creating or fixing interactive modals and widgets.

## 2025-02-12 - Video Lightbox Close Button A11y
**Learning:** The custom video lightbox in the Atelier section (`<button>` at line 1581) lacked essential accessibility attributes, preventing proper keyboard navigation and screen reader support.
**Action:** Added `type="button"`, `aria-label="Close video"`, `aria-hidden="true"` to the inner `<X />` icon, and explicit `focus-visible` utility classes to ensure it behaves like a semantic and accessible button.
