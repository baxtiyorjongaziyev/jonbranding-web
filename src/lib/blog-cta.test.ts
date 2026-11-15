import { describe, expect, it } from 'vitest';
import { resolveBlogCtaTarget } from './blog-cta';

describe('resolveBlogCtaTarget', () => {
  it('routes trademark and patent articles to the patent calculator', () => {
    expect(
      resolveBlogCtaTarget({
        slug: 'patentlash-narxi-qancha-2026',
        keywords: ['tovar belgisi'],
        title: 'Patentlash narxi qancha?',
      }),
    ).toEqual({
      cluster: 'patent',
      href: '/xizmatlar/patent-kalkulyatori',
      secondaryKey: 'ctaSecondaryPatent',
      serviceKey: 'ctaServicePatent',
    });

    expect(
      resolveBlogCtaTarget({
        slug: 'mezhdunarodnaya-registraciya-madrid-2026',
        title: 'Международная регистрация товарного знака',
      }).cluster,
    ).toBe('patent');
  });

  it('routes packaging, naming, and brandbook posts to their matching service pages', () => {
    expect(resolveBlogCtaTarget({ slug: 'packaging-dizayni-sirlari' }).href).toBe(
      '/xizmatlar/qadoq-dizayni',
    );
    expect(resolveBlogCtaTarget({ slug: 'naming-jarayoni' }).href).toBe(
      '/xizmatlar/neyming',
    );
    expect(resolveBlogCtaTarget({ slug: 'brendbuk-nima' }).href).toBe(
      '/xizmatlar/brandbook',
    );
  });

  it('falls back to brand diagnostics for general branding posts', () => {
    expect(resolveBlogCtaTarget({ slug: 'startup-uchun-brend-yaratish' })).toEqual({
      cluster: 'branding',
      href: '/diagnostika',
      secondaryKey: 'ctaSecondaryBranding',
      serviceKey: 'ctaServiceBranding',
    });
  });
});
