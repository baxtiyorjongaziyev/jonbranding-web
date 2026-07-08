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
## 2024-07-01 - Pausing continuous intervals when off-screen
**Learning:** Automatically updating active indices via `setInterval` for components outside the viewport triggers unnecessary layout and render cycles, especially when integrated with computationally expensive transition handlers like `framer-motion`.
**Action:** Utilize `useInView` from `framer-motion` tied to a section's top-level ref. Modify the interval's dependencies to include the `isInView` boolean and add an early return within the `useEffect` hook. This ensures background animations are paused when users aren't looking at them, freeing up the main thread.

## 2026-07-08 - [N+1 Query in Drive File Download]
**Learning:** Sequential downloading inside a `for...of` loop can severely impact performance due to blocked network I/O.
**Action:** Replaced sequential `fs.writeFileSync` loop with concurrent `Promise.all` and asynchronous `fs.promises.writeFile` in `services/portfolio-bot/src/drive.ts` to reduce download time by >18x.
