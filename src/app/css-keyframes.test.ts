import { readdirSync, readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * CSS `@keyframes` global: bir xil nom keyinroq yuklangan faylda qayta e'lon qilinsa,
 * Tailwind'ning `animate-*` sinflari jim o'zgarib qoladi. `atelier.css`dagi `pulse`
 * (scale 1.35) bosh sahifa skeletonlarini kattalashtirib, 320px'da gorizontal toshish
 * berardi va E2E testni tasodifiy yiqitardi.
 *
 * Yo'llar literal: yangi CSS fayl qo'shilsa, birinchi test uni shu ro'yxatga qo'shishni talab qiladi.
 */
const STYLESHEETS: Record<string, string> = {
  'app/globals.css': readFileSync('src/app/globals.css', 'utf8'),
  'app/atelier.css': readFileSync('src/app/atelier.css', 'utf8'),
  'app/[lang]/pro-preview/pro-preview.module.css': readFileSync('src/app/[lang]/pro-preview/pro-preview.module.css', 'utf8'),
};

const TAILWIND_ANIMATIONS = new Set(['spin', 'ping', 'pulse', 'bounce']);

describe('global CSS keyframes', () => {
  it('covers every stylesheet in src', () => {
    const onDisk = readdirSync('src', { recursive: true, encoding: 'utf8' })
      .map((path) => path.replaceAll('\\', '/'))
      .filter((path) => path.endsWith('.css'))
      .sort();
    expect(onDisk).toEqual(Object.keys(STYLESHEETS).sort());
  });

  it("do not redefine Tailwind's built-in animations", () => {
    const clashes = Object.entries(STYLESHEETS).flatMap(([file, css]) =>
      Array.from(css.matchAll(/@keyframes\s+([\w-]+)/g), (match) => match[1])
        .filter((name) => TAILWIND_ANIMATIONS.has(name))
        .map((name) => `${file}: @keyframes ${name}`),
    );
    expect(clashes).toEqual([]);
  });
});
