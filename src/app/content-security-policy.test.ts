import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

async function readCsp(): Promise<Map<string, string[]>> {
  const nextConfig = require('../../next.config.js');
  const rules: HeaderRule[] = await nextConfig.headers();
  const header = rules
    .flatMap((rule) => rule.headers)
    .find((item) => item.key === 'Content-Security-Policy');
  if (!header) throw new Error('Content-Security-Policy header is missing');

  return new Map(
    header.value
      .split(';')
      .map((part) => part.trim().split(/\s+/))
      .filter((tokens) => tokens[0])
      .map(([directive, ...sources]) => [directive, sources] as [string, string[]]),
  );
}

/** CSP host-source moslashuvi: aniq origin yoki `https://*.domain` subdomenlari. */
function allows(sources: string[] | undefined, url: string): boolean {
  const { protocol, host } = new URL(url);
  return (sources ?? []).some((source) => {
    const match = source.match(/^(\w+:)\/\/(\*\.)?([^/:]+)(?::\*)?$/);
    if (!match || match[1] !== protocol) return false;
    return match[2] ? host.endsWith(`.${match[3]}`) : host === match[3];
  });
}

describe('Content-Security-Policy', () => {
  it('lets the analytics loader in [lang]/layout.tsx load every tag it injects', async () => {
    const csp = await readCsp();
    for (const url of [
      'https://www.googletagmanager.com/gtm.js?id=GTM-5GRQBW84',
      'https://www.googletagmanager.com/gtag/js?id=G-BTSGJQLMMV',
      'https://www.clarity.ms/tag/w7knsud9mg',
      'https://static.hotjar.com/c/hotjar-6527829.js?sv=6',
      'https://connect.facebook.net/en_US/fbevents.js',
      'https://mc.yandex.ru/metrika/tag.js',
    ]) {
      expect(allows(csp.get('script-src'), url), url).toBe(true);
    }
  });

  it('allows Google Ads conversion and remarketing endpoints', async () => {
    const csp = await readCsp();
    expect(allows(csp.get('script-src'), 'https://www.googleadservices.com/pagead/conversion_async.js')).toBe(true);
    expect(allows(csp.get('img-src'), 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1')).toBe(true);
    expect(allows(csp.get('img-src'), 'https://www.googleadservices.com/pagead/conversion/1')).toBe(true);
    expect(allows(csp.get('connect-src'), 'https://googleads.g.doubleclick.net/pagead/1p-conversion')).toBe(true);
    expect(allows(csp.get('connect-src'), 'https://pagead2.googlesyndication.com/ccm/collect')).toBe(true);
    expect(allows(csp.get('frame-src'), 'https://td.doubleclick.net/td/rul/1')).toBe(true);
  });

  it('allows the Clarity script and its collect endpoint', async () => {
    const csp = await readCsp();
    expect(allows(csp.get('script-src'), 'https://scripts.clarity.ms/0.8.70/clarity.js')).toBe(true);
    expect(allows(csp.get('connect-src'), 'https://h.clarity.ms/collect')).toBe(true);
  });

  it('allows GA4 regional collection and the Amplitude SDK default endpoint', async () => {
    const csp = await readCsp();
    expect(allows(csp.get('connect-src'), 'https://region1.google-analytics.com/g/collect')).toBe(true);
    expect(allows(csp.get('connect-src'), 'https://region1.analytics.google.com/g/collect')).toBe(true);
    expect(allows(csp.get('connect-src'), 'https://api2.amplitude.com/2/httpapi')).toBe(true);
  });

  it('keeps unsafe-eval out of non-development builds and blocks plugins', async () => {
    const csp = await readCsp();
    expect(csp.get('script-src')).not.toContain("'unsafe-eval'");
    expect(csp.get('object-src')).toEqual(["'none'"]);
    expect(csp.get('frame-ancestors')).toEqual(["'self'"]);
  });
});
