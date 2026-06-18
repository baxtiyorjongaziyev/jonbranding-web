import { describe, it, expect } from 'vitest';
import { getLocalizedPath } from './locale';

describe('getLocalizedPath', () => {
  describe('default locale (uz)', () => {
    it('returns / for empty path', () => {
      expect(getLocalizedPath('uz', '')).toBe('/');
      expect(getLocalizedPath('uz')).toBe('/');
    });

    it('returns / for root path', () => {
      expect(getLocalizedPath('uz', '/')).toBe('/');
    });

    it('preserves paths starting with /', () => {
      expect(getLocalizedPath('uz', '/about')).toBe('/about');
      expect(getLocalizedPath('uz', '/blog/post-1')).toBe('/blog/post-1');
    });

    it('adds leading / to paths not starting with /', () => {
      expect(getLocalizedPath('uz', 'about')).toBe('/about');
      expect(getLocalizedPath('uz', 'blog/post-1')).toBe('/blog/post-1');
    });
  });

  describe('non-default locales (e.g. ru)', () => {
    it('prepends locale to empty path', () => {
      expect(getLocalizedPath('ru', '')).toBe('/ru');
      expect(getLocalizedPath('ru')).toBe('/ru');
    });

    it('prepends locale to root path', () => {
      expect(getLocalizedPath('ru', '/')).toBe('/ru');
    });

    it('prepends locale to paths starting with /', () => {
      expect(getLocalizedPath('ru', '/about')).toBe('/ru/about');
      expect(getLocalizedPath('ru', '/blog/post-1')).toBe('/ru/blog/post-1');
    });

    it('prepends locale and adds leading / to paths not starting with /', () => {
      expect(getLocalizedPath('ru', 'about')).toBe('/ru/about');
      expect(getLocalizedPath('ru', 'blog/post-1')).toBe('/ru/blog/post-1');
    });
  });

  describe('other locales (en, zh)', () => {
    it('works correctly for en', () => {
      expect(getLocalizedPath('en', '/contact')).toBe('/en/contact');
    });

    it('works correctly for zh', () => {
      expect(getLocalizedPath('zh', 'products')).toBe('/zh/products');
    });
  });
});
