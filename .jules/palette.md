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
