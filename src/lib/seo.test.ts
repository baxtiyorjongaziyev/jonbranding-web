import { describe, expect, it } from 'vitest';
import {
  FOUNDER_ID,
  identifyAiReferrer,
  ORGANIZATION_ID,
  getPageAlternates,
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

    expect(organization).toEqual(
      expect.objectContaining({ founder: { '@id': FOUNDER_ID } }),
    );
    expect(founder).toEqual(
      expect.objectContaining({ worksFor: { '@id': ORGANIZATION_ID } }),
    );
  });
});
