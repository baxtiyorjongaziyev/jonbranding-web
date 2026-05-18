## 2026-05-14 - Adding aria-labels to icon-only buttons\n**Learning:** The `OishaWidget` component utilized several icon-only buttons (open widget, close, and send message) that lacked descriptive text. These buttons are inaccessible to screen readers without explicitly declared `aria-label` attributes.\n**Action:** Add descriptive `aria-label` attributes to all icon-only buttons to ensure they can be meaningfully interpreted by assistive technologies.

## 2026-05-15 - Enhancing toggle buttons with ARIA states and focus visibility
**Learning:** Custom toggle buttons (like `DynamicToggle` and `DiscountSelector`) visually indicate their selected state but fail to communicate this to screen readers. Furthermore, using `outline-none` without providing a `focus-visible` fallback makes keyboard navigation difficult and inaccessible.
**Action:** Always include `aria-pressed={selected === option.value}` on custom toggle buttons and add `focus-visible:ring-2` (and related offset utilities) to ensure the selected state is conveyed semantically and keyboard focus is visually apparent.

## 2026-05-16 - Adding aria-labels to custom increment/decrement icon buttons
**Learning:** The `trademark-calculator` component used custom icon-only buttons (plus and minus) to control a slider input. While visually clear to sighted users, these custom controls lacked `aria-label` attributes, making them confusing or unusable for screen reader users who could focus on them but wouldn't know their function.
**Action:** Ensure all interactive icon-only elements, especially those used as custom form controls (like increment/decrement buttons), have explicit `aria-label` attributes describing their action.
## 2026-05-18 - Accessibility for custom div toggles
**Learning:** Custom toggles built with `div` elements in this codebase lack native keyboard accessibility and screen reader support, unlike standard `<input type="checkbox">` or native buttons.
**Action:** Always ensure custom toggles (`div` or `span` based) include `role="switch"`, `aria-checked={state}`, `tabIndex={0}`, keyboard event handlers (`onKeyDown` for Space/Enter), and `focus-visible` utility classes (e.g., `focus-visible:ring-2`) for keyboard navigation visibility.
