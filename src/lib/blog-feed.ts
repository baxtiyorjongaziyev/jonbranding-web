import { getLocalizedAbsoluteUrl, type Locale } from '@/lib/i18n/locale';
import { SITE_URL } from '@/lib/seo';

export interface BlogFeedItem {
  slug: string;
  lang: Locale;
  title: string;
  description?: string;
  date: string;
  author?: string;
}

const FEED_META: Record<Locale | 'all', { title: string; description: string; language: string }> = {
  all: {
    title: 'Jon.Branding — Blog',
    description:
      'Brending, neyming, logotip, brendbuk, qadoq dizayni va tovar belgisini ro‘yxatdan o‘tkazish bo‘yicha ekspert maqolalari.',
    language: 'uz',
  },
  uz: {
    title: 'Jon.Branding — Blog (O‘zbekcha)',
    description:
      'Brending, neyming, logotip, brendbuk, qadoq dizayni va tovar belgisini patentlash bo‘yicha maqolalar.',
    language: 'uz',
  },
  ru: {
    title: 'Jon.Branding — Блог',
    description:
      'Статьи о брендинге, нейминге, логотипах, брендбуках, дизайне упаковки и регистрации товарных знаков.',
    language: 'ru',
  },
  en: {
    title: 'Jon.Branding — Branding Blog',
    description:
      'Actionable articles on branding, naming, logo design, brand guidelines, packaging, and trademark protection.',
    language: 'en',
  },
  zh: {
    title: 'Jon.Branding — 品牌博客',
    description: '关于品牌塑造、命名、标志设计、品牌手册、包装设计和商标注册的实用文章。',
    language: 'zh',
  },
};

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildRssFeedXml(
  items: BlogFeedItem[],
  options: { lang?: Locale; feedUrl?: string; maxItems?: number } = {},
): string {
  const maxItems = options.maxItems ?? 50;
  const deduped = new Map<string, BlogFeedItem & { timestamp: number }>();

  for (const item of items) {
    if (!item.slug || !item.title || !item.date) continue;
    const timestamp = new Date(item.date).getTime();
    if (Number.isNaN(timestamp)) continue;

    deduped.set(`${item.lang}:${item.slug}`, { ...item, timestamp });
  }

  const sorted = Array.from(deduped.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxItems);

  const meta = options.lang ? FEED_META[options.lang] : FEED_META.all;
  const channelLink = options.lang
    ? getLocalizedAbsoluteUrl(SITE_URL, options.lang, '/blog')
    : `${SITE_URL}/blog`;
  const selfFeedUrl = options.feedUrl || `${SITE_URL}/feed.xml`;
  const lastBuildDate =
    sorted.length > 0 ? new Date(sorted[0].timestamp).toUTCString() : new Date().toUTCString();

  const itemsXml = sorted
    .map((item) => {
      const link = getLocalizedAbsoluteUrl(SITE_URL, item.lang, `/blog/${item.slug}`);
      const pubDate = new Date(item.timestamp).toUTCString();
      const author = item.author?.trim() || 'Baxtiyorjon Gaziyev';
      const description = (item.description || item.title).trim();

      return [
        '    <item>',
        `      <title>${escapeXml(item.title.trim())}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        `      <dc:creator>${escapeXml(author)}</dc:creator>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(meta.title)}</title>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <description>${escapeXml(meta.description)}</description>`,
    `    <language>${escapeXml(meta.language)}</language>`,
    `    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(selfFeedUrl)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    '  </channel>',
    '</rss>',
  ].join('\n');
}
