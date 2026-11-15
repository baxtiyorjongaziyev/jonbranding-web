import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

describe('SEO operational assets', () => {
  it('keeps public/llms.txt aligned with official company facts and all four locales', () => {
    const llms = readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf8');

    expect(llms).not.toMatch(/\b9\+\s*yil\b|\b150\+\s*loyiha\b|\b500\+\s*mijoz\b/i);
    expect(llms).toContain('600+');
    expect(llms).toContain('1200+');
    expect(llms).toContain('2018');
    expect(llms).toContain('https://www.jonbranding.uz/feed.xml');
    expect(llms).toContain('https://www.jonbranding.uz/blog');
    expect(llms).toContain('https://www.jonbranding.uz/ru');
    expect(llms).toContain('https://www.jonbranding.uz/en');
    expect(llms).toContain('https://www.jonbranding.uz/zh');
  });

  it('schedules weekly draft blog generation in vercel.json without bypassing drafts', () => {
    const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
      crons?: Array<{ path: string; schedule: string }>;
    };
    const blogCron = vercel.crons?.find((entry) => entry.path === '/api/blog-agent');
    expect(blogCron).toBeDefined();
    expect(blogCron?.schedule).toBeTruthy();

    const blogAgentSource = readFileSync(
      path.join(ROOT, 'src/app/api/blog-agent/route.ts'),
      'utf8',
    );
    expect(blogAgentSource).toContain('drafts.${randomUUID()}');
    expect(blogAgentSource).toContain('Tovar belgisini');
    expect(blogAgentSource).toContain('Brendbuk');
  });
});
