import { describe, expect, it } from 'vitest';
import { buildRssFeedXml, escapeXml, type BlogFeedItem } from './blog-feed';
import { getSortedPostsData } from './blog-posts';
import bundledMarkdownIndex from './blog-markdown-index.json';

describe('blog-feed RSS builder', () => {
  it('escapes XML special characters safely', () => {
    expect(escapeXml(`Brend & "Logotip" <2026> 'test'`)).toBe(
      'Brend &amp; &quot;Logotip&quot; &lt;2026&gt; &apos;test&apos;',
    );
  });

  it('builds valid RSS 2.0 XML sorted newest-first with localized canonical URLs', () => {
    const items: BlogFeedItem[] = [
      {
        slug: 'old-post',
        lang: 'uz',
        title: 'Eski & <test> maqola',
        description: 'Tavsif "bir"',
        date: '2025-01-10T00:00:00.000Z',
        author: 'Baxtiyorjon Gaziyev',
      },
      {
        slug: 'new-post-ru',
        lang: 'ru',
        title: 'Новая статья',
        description: 'Описание статьи',
        date: '2026-04-10T00:00:00.000Z',
        author: 'Baxtiyorjon Gaziyev',
      },
    ];

    const xml = buildRssFeedXml(items);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">');
    expect(xml).toContain('href="https://www.jonbranding.uz/feed.xml"');
    expect(xml).toContain('<link>https://www.jonbranding.uz/blog/old-post</link>');
    expect(xml).toContain('<link>https://www.jonbranding.uz/ru/blog/new-post-ru</link>');
    expect(xml).toContain('<title>Eski &amp; &lt;test&gt; maqola</title>');
    expect(xml).toContain('<description>Tavsif &quot;bir&quot;</description>');
    expect(xml).toContain('<dc:creator>Baxtiyorjon Gaziyev</dc:creator>');

    const newerIndex = xml.indexOf('new-post-ru');
    const olderIndex = xml.indexOf('old-post');
    expect(newerIndex).toBeGreaterThan(-1);
    expect(olderIndex).toBeGreaterThan(newerIndex);
  });

  it('deduplicates items by locale and slug and filters invalid dates', () => {
    const items: BlogFeedItem[] = [
      {
        slug: 'same-slug',
        lang: 'uz',
        title: 'Markdown title',
        date: '2026-04-01',
      },
      {
        slug: 'same-slug',
        lang: 'uz',
        title: 'Sanity override title',
        date: '2026-04-05',
      },
      {
        slug: 'broken-date',
        lang: 'uz',
        title: 'Broken',
        date: 'not-a-date',
      },
    ];

    const xml = buildRssFeedXml(items, { lang: 'uz', feedUrl: 'https://www.jonbranding.uz/feed.xml?lang=uz' });
    expect(xml).toContain('Sanity override title');
    expect(xml).not.toContain('Markdown title');
    expect(xml).not.toContain('broken-date');
    expect(xml).toContain('href="https://www.jonbranding.uz/feed.xml?lang=uz"');
  });

  it('keeps bundled blog-markdown-index.json synchronized with src/posts markdown files', () => {
    for (const lang of ['uz', 'ru', 'en', 'zh'] as const) {
      expect(bundledMarkdownIndex[lang]).toEqual(getSortedPostsData(lang));
    }
  });
});
