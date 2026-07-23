import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AtHero from './at-hero';

vi.mock('next/image', () => ({
  default: ({ priority, quality, fill: _fill, alt = '', ...props }: any) => (
    <img alt={alt} {...props} data-priority={String(Boolean(priority))} data-quality={String(quality)} />
  ),
}));

describe('AtHero LCP media', () => {
  it('renders one stable preloaded hero image at optimized quality', () => {
    render(
      <AtHero
        onOpen={vi.fn()}
        lang="uz"
        portfolioImages={[
          { src: '/first.webp', name: 'Birinchi', year: '2026' },
          { src: '/second.webp', name: 'Ikkinchi', year: '2025' },
        ]}
      />,
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', '/first.webp');
    expect(images[0]).toHaveAttribute('data-priority', 'true');
    expect(images[0]).toHaveAttribute('data-quality', '75');
    expect(screen.getByRole('link', { name: /Premium brend: Birinchi/ })).toHaveAttribute('href', '#ishlar');
    expect(screen.getByText('aslida')).toBeInTheDocument();
    expect(screen.queryByText('aslida*')).not.toBeInTheDocument();
  });
});
