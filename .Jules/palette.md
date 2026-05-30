## 2026-05-14 - Adding aria-labels to icon-only buttons\n**Learning:** The `OishaWidget` component utilized several icon-only buttons (open widget, close, and send message) that lacked descriptive text. These buttons are inaccessible to screen readers without explicitly declared `aria-label` attributes.\n**Action:** Add descriptive `aria-label` attributes to all icon-only buttons to ensure they can be meaningfully interpreted by assistive technologies.

## 2026-05-15 - Enhancing toggle buttons with ARIA states and focus visibility
**Learning:** Custom toggle buttons (like `DynamicToggle` and `DiscountSelector`) visually indicate their selected state but fail to communicate this to screen readers. Furthermore, using `outline-none` without providing a `focus-visible` fallback makes keyboard navigation difficult and inaccessible.
**Action:** Always include `aria-pressed={selected === option.value}` on custom toggle buttons and add `focus-visible:ring-2` (and related offset utilities) to ensure the selected state is conveyed semantically and keyboard focus is visually apparent.

## 2026-05-16 - Adding aria-labels to custom increment/decrement icon buttons
**Learning:** The `trademark-calculator` component used custom icon-only buttons (plus and minus) to control a slider input. While visually clear to sighted users, these custom controls lacked `aria-label` attributes, making them confusing or unusable for screen reader users who could focus on them but wouldn't know their function.
**Action:** Ensure all interactive icon-only elements, especially those used as custom form controls (like increment/decrement buttons), have explicit `aria-label` attributes describing their action.

## 2026-05-17 - Enhancing custom animated toggle components with proper ARIA attributes and keyboard support
**Learning:** Custom interactive components like `KnobToggle` often lack essential accessibility features when built using `motion.div`. They fail to convey their role, state, and are not navigable via keyboard.
**Action:** When building custom toggle components (e.g. `KnobToggle`), always include `role="switch"`, `aria-checked={isOn}`, `tabIndex={0}`, keyboard handlers (for 'Enter' and 'Space'), and `focus-visible` styles to ensure full accessibility and usability.

## 2026-05-18 - Adding ARIA expanded states and keyboard focus to interactive widgets
**Learning:** When building floating widgets or interactive modals (like `OishaWidget`), it's crucial to semantically link the toggle button to the expanding container using `aria-controls` and `aria-expanded`. Without these attributes, screen readers may not understand the relationship between the button and the content it reveals. Furthermore, custom interactive buttons lack default focus outlines when styled extensively, hindering keyboard accessibility.
**Action:** Always include `aria-expanded` and `aria-controls` on the toggle button (linking it to the container's `id`), and ensure all interactive elements within the widget have explicit `focus-visible` Tailwind classes (like `focus-visible:ring-2`) to provide clear visual feedback during keyboard navigation.

## 2026-05-22 - Using existing design tokens for focus states
**Learning:** When adding focus styles to interactive elements for keyboard accessibility, it's crucial to use the established Tailwind design tokens in the codebase (e.g., `focus-visible:ring-primary`, `focus-visible:ring-offset-background`) rather than generic colors like `blue-500` or `black`. This ensures consistency with the site's overall theme, including light/dark modes.
**Action:** Always check existing components for focus state patterns before applying new ones, and strictly adhere to using semantic design tokens from the Tailwind configuration.
## 2026-05-30 - Adding aria-labels and focus-visible to lightbox navigation buttons\n**Learning:** The portfolio detail component's image lightbox used custom icon-only buttons for navigation (Previous, Next, Close) that lacked `aria-label` attributes and visible focus states. This makes navigating the gallery inaccessible for screen reader and keyboard users.\n**Action:** Ensure all interactive icon-only elements within modals and lightboxes have explicit `aria-label` attributes and implement visible focus rings using existing Tailwind tokens (`focus-visible:ring-white focus-visible:ring-offset-black`).
