import { describe, expect, it } from 'vitest';
import {
  FOUNDER_ID,
  identifyAiReferrer,
  ORGANIZATION_ID,
  getPageAlternates,
  stripBrandSuffix,
  pageTitle,
  getSiteEntityGraph,
} from './seo';

describe('getPageAlternates', () => {
  it('points the canonical at the page itself, without a prefix for Uzbek', () => {
    expect(getPageAlternates('uz', '/portfolio/revo').canonical).toBe(
      'https://www.jonbranding.uz/portfolio/revo',
    );
    expect(getPageAlternates('ru', '/portfolio/revo').canonical).toBe(
      'https://www.jonbranding.uz/ru/portfolio/revo',
    );
  });

  it('lists every locale plus x-default for hreflang', () => {
    expect(getPageAlternates('en', '/privacy').languages).toEqual({
      uz: 'https://www.jonbranding.uz/privacy',
      ru: 'https://www.jonbranding.uz/ru/privacy',
      en: 'https://www.jonbranding.uz/en/privacy',
      zh: 'https://www.jonbranding.uz/zh/privacy',
      'x-default': 'https://www.jonbranding.uz/privacy',
    });
  });
});

describe('SEO entity and AI referral helpers', () => {
  it('recognizes supported AI search referrals without accepting lookalike domains', () => {
    expect(identifyAiReferrer('https://chatgpt.com/c/abc')).toBe('chatgpt');
    expect(identifyAiReferrer('https://www.perplexity.ai/search/test')).toBe('perplexity');
    expect(identifyAiReferrer('https://chatgpt.com.evil.example')).toBeNull();
    expect(identifyAiReferrer('not-a-url')).toBeNull();
  });

  it('builds one connected organization-founder graph', () => {
    const graph = getSiteEntityGraph('uz')['@graph'];
    const organization = graph.find((node) => node['@id'] === ORGANIZATION_ID);
    const founder = graph.find((node) => node['@id'] === FOUNDER_ID);
    const website = graph.find((node) => node['@type'] === 'WebSite');

    expect(organization).toEqual(
      expect.objectContaining({
        founder: { '@id': FOUNDER_ID },
        geo: expect.objectContaining({
          '@type': 'GeoCoordinates',
          latitude: 41.2995,
          longitude: 69.2401,
        }),
        openingHoursSpecification: expect.objectContaining({
          '@type': 'OpeningHoursSpecification',
          opens: '09:00',
          closes: '20:00',
        }),
      }),
    );
    expect(founder).toEqual(
      expect.objectContaining({
        worksFor: { '@id': ORGANIZATION_ID },
        jobTitle: 'Brending mutaxassisi, asoschi',
      }),
    );
    expect(website).toEqual(
      expect.objectContaining({
        publisher: { '@id': ORGANIZATION_ID },
      }),
    );
  });

  it('includes foundingDate and full service catalog with naming, brand-strategy, and patent', () => {
    const graph = getSiteEntityGraph('uz')['@graph'];
    const organization = graph.find((node) => node['@id'] === ORGANIZATION_ID) as {
      foundingDate?: string;
      hasOfferCatalog?: { itemListElement?: Array<{ itemOffered?: { url?: string } }> };
    };

    expect(organization.foundingDate).toBe('2018-11-27');
    const urls = organization.hasOfferCatalog?.itemListElement?.map((el) => el.itemOffered?.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        'https://www.jonbranding.uz/brand-strategy',
        'https://www.jonbranding.uz/xizmatlar/neyming',
        'https://www.jonbranding.uz/xizmatlar/logo-dizayni',
        'https://www.jonbranding.uz/xizmatlar/firmenniy-stil',
        'https://www.jonbranding.uz/xizmatlar/brandbook',
        'https://www.jonbranding.uz/xizmatlar/qadoq-dizayni',
        'https://www.jonbranding.uz/xizmatlar/patent',
        'https://www.jonbranding.uz/xizmatlar/posm-materiallar',
        'https://www.jonbranding.uz/xizmatlar/car-wrap-design',
      ]),
    );
  });
});

describe('stripBrandSuffix', () => {
  it.each([
    ['Revo | Jon.Branding Portfolio', 'Revo'],
    ['R Studio uchun premium logo dizayni | Jon Branding', 'R Studio uchun premium logo dizayni'],
    ['Prime Fit Brend Identikasi | Jon Branding tomonidan', 'Prime Fit Brend Identikasi'],
    ['Brendbuk yaratish | Jon.Branding Agentligi', 'Brendbuk yaratish'],
    ['Credentials — Jon Branding', 'Credentials'],
    ['Narxlar — Baxtiyor Gaziyev', 'Narxlar — Baxtiyor Gaziyev'],
  ])('%s → %s', (input, expected) => {
    expect(stripBrandSuffix(input)).toBe(expected);
  });

  it('keeps a title that is only the brand', () => {
    expect(stripBrandSuffix('Jon.Branding')).toBe('Jon.Branding');
  });
});

describe('pageTitle', () => {
  it('leaves the brand to the layout template when the title has none', () => {
    expect(pageTitle('Maxfiylik Siyosati | Jon.Branding')).toBe('Maxfiylik Siyosati');
    expect(pageTitle('Logotip dizayni')).toBe('Logotip dizayni');
  });

  it('opts out of the template when the brand sits mid-title', () => {
    expect(pageTitle('Разработка Брендбука | Агентство Jon.Branding')).toEqual({
      absolute: 'Разработка Брендбука | Агентство Jon.Branding',
    });
    expect(pageTitle('Feel it Logo Dizayni | Jon Branding - SAT Tayyorlovi')).toEqual({
      absolute: 'Feel it Logo Dizayni | Jon Branding - SAT Tayyorlovi',
    });
  });
});
