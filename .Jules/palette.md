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

## 2026-05-18 - Adding `aria-pressed` and `focus-visible` to DynamicToggle component
**Learning:** The `DynamicToggle` component in `src/components/sections/trademark-calculator.tsx` visually indicated selected states but lacked semantic meaning for screen readers. It also failed to show keyboard focus properly due to the absence of `focus-visible` utility classes, degrading the keyboard navigation experience.
**Action:** Always add `aria-pressed` to custom toggle buttons to convey state and include standard `focus-visible` Tailwind utilities to guarantee accessible keyboard interactions.
