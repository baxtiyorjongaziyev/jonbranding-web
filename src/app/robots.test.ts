import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots policy', () => {
  it('keeps public content discoverable while protecting admin and API routes', () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    const defaultRule = rules.find((rule) => rule.userAgent === '*');

    expect(defaultRule).toEqual(
      expect.objectContaining({
        allow: '/',
        disallow: expect.arrayContaining(['/admin/', '/studio/', '/api/']),
      }),
    );
    expect(config.sitemap).toBe('https://www.jonbranding.uz/sitemap.xml');
  });

  it.each(['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot'])(
    'explicitly allows the %s search crawler',
    (userAgent) => {
      const config = robots();
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      expect(rules).toContainEqual(
        expect.objectContaining({ userAgent, allow: '/' }),
      );
    },
  );
});
