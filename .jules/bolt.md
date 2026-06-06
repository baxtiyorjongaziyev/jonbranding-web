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

## 2026-06-06 - Optimizing Unnecessary Animations with Framer Motion `useInView`
**Learning:** Heavy framer-motion animations like continuous transforms/rotations (e.g., fluid/blob background animations) running inside `<AnimatePresence>` consume CPU/GPU even when the container section is scrolled far out of the viewport. React doesn't automatically pause these. We also found that unpausing `setInterval` manually requires wrapping logic properly when tracking element visibility.
**Action:** Use Framer Motion's `useInView` hook not just to pause timers, but also to conditionally unmount expensive decorative animation nodes `{isInView && (<motion.div>...)}` inside `<AnimatePresence>` to completely free up compositing resources off-screen. Apply this aggressively to background loops.
