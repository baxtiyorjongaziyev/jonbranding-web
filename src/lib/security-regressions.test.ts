import { describe, expect, it } from 'vitest';
import { sanitizePlainText } from '@/components/sections/blog-preview';
import { createOishaUserId } from '@/components/oisha-widget';
import { sanitizeText } from './blog-posts';

describe('security regressions', () => {
  it.each([sanitizeText, sanitizePlainText])(
    'plain-text sanitizer cannot reconstruct nested tags',
    (sanitize) => {
      const output = sanitize('<scr<script>ipt>alert(1)</script>');
      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
    },
  );

  it('creates cryptographically random Oisha browser identifiers', () => {
    const first = createOishaUserId();
    const second = createOishaUserId();

    expect(first).toMatch(/^web_[0-9a-f-]{36}$/);
    expect(second).not.toBe(first);
  });
});
