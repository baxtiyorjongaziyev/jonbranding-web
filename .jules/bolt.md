## 2024-05-14 - Optimized scroll listeners with Framer Motion
**Learning:** Found multiple instances where native \`window.addEventListener('scroll')\` was causing unnecessary React re-renders for scroll-dependent logic (e.g., sticky headers and scroll-to-top switches) by running synchronously on every pixel scrolled. This is a common performance anti-pattern.
**Action:** Replaced native scroll event listeners with Framer Motion's \`useMotionValueEvent(scrollY, "change", ...)\`. This hooks into Framer Motion's internal, optimized requestAnimationFrame loop, decoupling the event tracking from direct main-thread blocking, and reduces state update frequency. Next time I see a scroll event listener in a codebase using framer-motion, replace it!

**Important Refinement:** When optimizing scroll logic with Framer Motion, it's crucial to completely eliminate intermediate React states (like `lastScrollY`). Storing the previous scroll position in state forces a React re-render on *every* scroll frame, completely defeating the purpose of moving away from native listeners. Use `scrollY.getPrevious()` inside `useMotionValueEvent` to calculate scroll direction without triggering re-renders!

## 2024-05-21 - Derived State with useMemo
**Learning:** Found an instance in `src/components/sections/testimonials.tsx` where derived state (filtering and sorting testimonials) was managed using `useEffect` and multiple `useState` calls. This causes unnecessary secondary re-renders (mount -> render empty -> useEffect -> update state -> re-render with items).
**Action:** Replaced the `useEffect` and `useState` pattern with a single `useMemo` block that derives the required values directly from props. This prevents the flash of empty content and eliminates the extra render cycle. Always look for opportunities to derive state synchronously with `useMemo` instead of async with `useEffect`!

## 2024-05-25 - Pausing Continuous Intervals with useInView
**Learning:** Using Framer Motion's `useInView` to pause continuous polling/intervals (like `setInterval`) when a component is off-screen is a great performance optimization to reduce background React re-renders. However, when doing this, it is critical that the tracked element (`ref`) is ALWAYS rendered. Returning `null` early (e.g., while waiting for data) prevents the ref from attaching and permanently breaks the visibility observer.
**Action:** Always render a placeholder or skeleton with the tracked `ref` attached instead of returning `null` when loading components that use `useInView` for performance optimizations.
## 2026-06-25 - Optimized Scroll Listeners with useCallback and Initial State Verification
**Learning:** When replacing native scroll listeners (`window.addEventListener('scroll')`) with Framer Motion's `useMotionValueEvent(scrollY, 'change', handleScroll)`, I discovered that the handler must be wrapped in `useCallback` to prevent unnecessary re-bindings on every render. Furthermore, since the Framer Motion event only fires on *change* (i.e. user scroll), the component might render in an incorrect initial state before the first scroll occurs.
**Action:** When migrating scroll events to Framer Motion, always: 1) Wrap the event handler in `useCallback`, and 2) Include a `useEffect` that fires the handler once with `window.scrollY` on mount to ensure correct initial UI state.

## 2026-06-28 - Optimized Scroll Listeners with useCallback and Initial State Verification
**Learning:** When replacing native scroll listeners (`window.addEventListener('scroll')`) with Framer Motion's `useMotionValueEvent(scrollY, 'change', handleScroll)`, I discovered that the handler must be wrapped in `useCallback` to prevent unnecessary re-bindings on every render. Furthermore, since the Framer Motion event only fires on *change* (i.e. user scroll), the component might render in an incorrect initial state before the first scroll occurs.
**Action:** When migrating scroll events to Framer Motion, always: 1) Wrap the event handler in `useCallback`, and 2) Include a `useEffect` that fires the handler once with `window.scrollY` on mount to ensure correct initial UI state.

## 2026-06-29 - Paused Off-Screen Slideshow Intervals
**Learning:** Background intervals for continuous slideshows (like hero section portfolios or featured projects) consume main-thread execution even when the user has scrolled past them, leading to performance degradation over time on longer pages.
**Action:** Always wrap continuous component-level intervals with Framer Motion's `useInView` to automatically pause the interval when the container element leaves the viewport, saving CPU cycles.
