import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import { BlogPostCta } from './blog-post-cta';
import { PREFERRED_SOURCES_URL, PreferredSourcesCard } from './preferred-sources-card';

describe('Blog PreferredSourcesCard & BlogPostCta', () => {
  it('renders Google Preferred Sources button container, deeplink fallback, and localized RSS feed link', () => {
    const { container } = render(<PreferredSourcesCard lang="uz" copy={uz.blog} />);

    const sdkContainer = container.querySelector('[google-add-preferred-source-btn]');
    expect(sdkContainer).not.toBeNull();
    expect(sdkContainer?.getAttribute('data-lang')).toBe('uz');

    const deeplink = screen.getByRole('link', { name: uz.blog.preferredAction });
    expect(deeplink).toHaveAttribute('href', PREFERRED_SOURCES_URL);

    const rssLink = screen.getByRole('link', { name: uz.blog.rssLabel });
    expect(rssLink).toHaveAttribute('href', '/feed.xml?lang=uz');
  });

  it('dispatches openContactModal with patent context and links to patent calculator for trademark articles', () => {
    const listener = vi.fn();
    window.addEventListener('openContactModal', listener);

    render(
      <BlogPostCta
        lang="ru"
        slug="skolko-stoit-patent-2026"
        title="Сколько стоит патент"
        keywords={['товарный знак']}
        copy={ru.blogPost}
      />,
    );

    const consultButton = screen.getByRole('button', { name: ru.blogPost.ctaButton });
    fireEvent.click(consultButton);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({
      section: 'blog_post_cta',
      source: 'blog_patent',
      service: ru.blogPost.ctaServicePatent,
      intent: 'consultation',
    });

    const secondaryLink = screen.getByRole('link', { name: ru.blogPost.ctaSecondaryPatent });
    expect(secondaryLink).toHaveAttribute('href', '/ru/xizmatlar/patent-kalkulyatori');

    window.removeEventListener('openContactModal', listener);
  });
});
