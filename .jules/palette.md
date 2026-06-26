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
