# GSAP ScrollTrigger Animations — Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task-by-task.

**Goal:** Add scroll-triggered reveal animations to 4 key Atelier sections using GSAP ScrollTrigger (already installed).

**Architecture:** Each section gets a `useGSAP` hook with `ScrollTrigger` — elements fade/slide in as they enter viewport. No dependency changes needed (`gsap@3.15` already in package.json). Framer Motion is installed but unused in sections — GSAP used for scroll animations.

**Tech Stack:** `gsap`, `gsap/ScrollTrigger`, `@gsap/react` (useGSAP hook)

---

## Task 1: Install @gsap/react

**Files:**
- Modify: `package.json` (add @gsap/react)

- [ ] Check if @gsap/react installed
```bash
cat package.json | grep gsap
```

- [ ] Install
```bash
npm install @gsap/react
```

- [ ] Verify
```bash
cat node_modules/@gsap/react/package.json | grep '"version"'
```

- [ ] Commit
```bash
git add package.json package-lock.json
git commit -m "deps: add @gsap/react for ScrollTrigger hooks"
```

---

## Task 2: at-stats.tsx — Counter animation

**Files:**
- Modify: `src/components/sections/at-stats.tsx`

Stats (240+, 4 joy, 14 kun) scroll'da counter effect bilan chiqadi.

- [ ] Read current file
```bash
cat src/components/sections/at-stats.tsx
```

- [ ] Add GSAP counter animation — replace static value display with animated counter:

```tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

Inside component, add ref to container and animate:
```tsx
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  if (!containerRef.current) return;
  const cards = containerRef.current.querySelectorAll('.stat-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      }
    }
  );
}, { scope: containerRef });
```

Add `ref={containerRef}` to stats grid container, `className="stat-card"` to each stat item.

- [ ] Build check
```bash
npm run build 2>&1 | tail -10
```

- [ ] Commit
```bash
git add src/components/sections/at-stats.tsx
git commit -m "feat(anim): GSAP scroll reveal on stats section"
```

---

## Task 3: at-work-index.tsx — Stagger row reveal

**Files:**
- Modify: `src/components/sections/at-work-index.tsx`

Table rows stagger reveal as user scrolls down.

- [ ] Add GSAP imports and ref:
```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

- [ ] In component, add:
```tsx
const tableRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  if (!tableRef.current) return;
  const rows = tableRef.current.querySelectorAll('tbody tr');
  gsap.fromTo(rows,
    { opacity: 0, x: -20 },
    {
      opacity: 1, x: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: tableRef.current,
        start: 'top 85%',
        once: true,
      }
    }
  );
}, { scope: tableRef });
```

Add `ref={tableRef}` to the `div.overflow-x-auto` wrapper.

- [ ] Build check
```bash
npm run build 2>&1 | tail -10
```

- [ ] Commit
```bash
git add src/components/sections/at-work-index.tsx
git commit -m "feat(anim): GSAP stagger reveal on work index rows"
```

---

## Task 4: at-services.tsx — Service row slide-in

**Files:**
- Modify: `src/components/sections/at-services.tsx`

Service rows slide in from bottom with stagger.

- [ ] Add GSAP imports + ref:
```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

- [ ] In component:
```tsx
const listRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  if (!listRef.current) return;
  const rows = listRef.current.querySelectorAll('.service-row');
  gsap.fromTo(rows,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: listRef.current,
        start: 'top 80%',
        once: true,
      }
    }
  );
}, { scope: listRef });
```

Add `ref={listRef}` to `div.border-t`, add `className="service-row ..."` to each service div (keep existing classes).

- [ ] Build check + commit
```bash
npm run build 2>&1 | tail -10
git add src/components/sections/at-services.tsx
git commit -m "feat(anim): GSAP stagger reveal on services list"
```

---

## Task 5: at-process.tsx — Steps fade-in

**Files:**
- Modify: `src/components/sections/at-process.tsx`

Each accordion step fades in as it enters viewport.

- [ ] Add GSAP imports + ref:
```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

- [ ] In component:
```tsx
const stepsRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  if (!stepsRef.current) return;
  const steps = stepsRef.current.querySelectorAll('.process-step');
  gsap.fromTo(steps,
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stepsRef.current,
        start: 'top 80%',
        once: true,
      }
    }
  );
}, { scope: stepsRef });
```

Add `ref={stepsRef}` to the `div.flex.flex-col` steps container, add `className="process-step"` to each step `div`.

- [ ] Final build check
```bash
npm run build 2>&1 | tail -5
```

- [ ] Push
```bash
git push -u origin claude/caveman-speech-pattern-lK79q
```

---

## Verification

1. `npm run build` — 0 error
2. `npm run dev` → localhost:9002 — scroll qilib har section animatsiyasini ko'r
3. Stats: 3 card stagger fade-in
4. Work Index: rows left-slide stagger
5. Services: rows bottom-slide stagger
6. Process: steps fade-in stagger
