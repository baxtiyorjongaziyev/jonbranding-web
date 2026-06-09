
## 2024-06-25 - Lightbox Navigation Accessibility
**Learning:** Custom lightbox components often rely heavily on icon-only navigational buttons (like 'X' for close, chevrons for prev/next). These are completely inaccessible to screen reader users without proper `aria-label`s, and keyboard users can easily lose track of where they are if custom styled buttons drop the browser's default focus outlines.
**Action:** Always provide descriptive `aria-label` properties (translating them when multi-language routing is active) and ensure explicit `focus-visible` styling (like `focus-visible:ring-2`) is defined for any interactive overlays.
