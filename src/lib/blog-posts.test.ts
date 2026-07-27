import { describe, expect, it } from 'vitest';
import {
  getAllPostSlugs,
  getPostData,
  getSortedPostsData,
} from './blog-posts';

describe('repository blog posts', () => {
  it('discovers only localized markdown files', () => {
    const slugs = getAllPostSlugs();
    expect(slugs).toContainEqual({
      lang: 'uz',
      slug: 'brending-nima-va-u-biznesga-qanday-yordam-beradi',
    });
    expect(slugs.every((item) => item.slug && item.lang)).toBe(true);
  });

  it('returns valid posts in newest-first order', () => {
    const posts = getSortedPostsData('uz');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        date: expect.any(String),
        source: 'markdown',
      }),
    );
    expect(
      posts.every(
        (post, index) =>
          index === 0 ||
          new Date(posts[index - 1].date).getTime() >= new Date(post.date).getTime(),
      ),
    ).toBe(true);
  });

  it('renders markdown content while dropping embedded raw HTML', async () => {
    const post = await getPostData(
      'uz',
      'brending-nima-va-u-biznesga-qanday-yordam-beradi',
    );
    expect(post?.htmlContent).toContain('<h2>');
    expect(post?.htmlContent).not.toContain('<script');
  });
});
