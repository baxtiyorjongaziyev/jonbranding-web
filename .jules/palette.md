
## 2024-06-11 - Missing focus rings in customized UI components
**Learning:** Found components (like the Language Switcher) where default focus states were explicitly disabled via Tailwind overrides (e.g., `!ring-0 focus-visible:!ring-0`) to achieve a specific visual look, breaking keyboard navigation entirely as no custom focus states were provided as a fallback.
**Action:** When styling custom dropdowns or buttons, never globally disable `focus-visible` outlines/rings without replacing them. Always provide clear keyboard navigation styles using existing design tokens like `focus-visible:ring-primary focus-visible:ring-offset-2`.
