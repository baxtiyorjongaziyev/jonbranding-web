## 2024-05-14 - Optimized scroll listeners with Framer Motion
**Learning:** Found multiple instances where native \`window.addEventListener('scroll')\` was causing unnecessary React re-renders for scroll-dependent logic (e.g., sticky headers and scroll-to-top switches) by running synchronously on every pixel scrolled. This is a common performance anti-pattern.
**Action:** Replaced native scroll event listeners with Framer Motion's \`useMotionValueEvent(scrollY, "change", ...)\`. This hooks into Framer Motion's internal, optimized requestAnimationFrame loop, decoupling the event tracking from direct main-thread blocking, and reduces state update frequency. Next time I see a scroll event listener in a codebase using framer-motion, replace it!

**Important Refinement:** When optimizing scroll logic with Framer Motion, it's crucial to completely eliminate intermediate React states (like `lastScrollY`). Storing the previous scroll position in state forces a React re-render on *every* scroll frame, completely defeating the purpose of moving away from native listeners. Use `scrollY.getPrevious()` inside `useMotionValueEvent` to calculate scroll direction without triggering re-renders!

## 2024-05-21 - Derived State with useMemo
**Learning:** Found an instance in `src/components/sections/testimonials.tsx` where derived state (filtering and sorting testimonials) was managed using `useEffect` and multiple `useState` calls. This causes unnecessary secondary re-renders (mount -> render empty -> useEffect -> update state -> re-render with items).
**Action:** Replaced the `useEffect` and `useState` pattern with a single `useMemo` block that derives the required values directly from props. This prevents the flash of empty content and eliminates the extra render cycle. Always look for opportunities to derive state synchronously with `useMemo` instead of async with `useEffect`!

## 2024-05-24 - Pausing background intervals with useInView
**Learning:** Discovered that global `setInterval` for UI updates (like fake online users counters) runs continuously, causing unnecessary React re-renders even when the component is not visible on screen, draining CPU and battery.
**Action:** Use Framer Motion's `useInView` to pause/resume intervals based on component visibility. This ensures we only pay the cost of rendering when the user is actually looking at it.
