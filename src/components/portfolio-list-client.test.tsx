import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PortfolioListClient from './portfolio-list-client';

vi.mock('next/image', () => ({ default: () => null }));

const dictionary = {
  all: 'Barchasi',
  logoDesign: 'Logotip dizayni',
  packaging: 'Qadoq dizayni',
  naming: 'Neyming',
  viewCase: "Keysni ko'rish",
  resultsTitle: 'Natijalar',
  ctaTitle: 'Biznesingizga ham shunday ko‘rinish kerakmi?',
  ctaText: 'Bepul.',
  ctaButton: '20 daqiqalik bepul maslahat',
};

const projects = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `p${i}`,
    title: `Keys ${i}`,
    slug: `keys-${i}`,
    client: `Mijoz ${i}`,
    category: 'logo-design',
    coverImage: '/images/cover.jpg',
    description: 'Tavsif',
  }));

afterEach(cleanup);

describe('portfolio list call to action', () => {
  it('offers a consultation inside a long list and at its end', () => {
    const { container } = render(<PortfolioListClient projects={projects(14) as any} lang="uz" dictionary={dictionary} />);
    expect(container.querySelector('[data-portfolio-cta="grid"]')).not.toBeNull();
    expect(container.querySelector('[data-portfolio-cta="end"]')).not.toBeNull();
  });

  it('stays out of the way for a short filtered list', () => {
    const { container } = render(<PortfolioListClient projects={projects(3) as any} lang="uz" dictionary={dictionary} />);
    expect(container.querySelector('[data-portfolio-cta]')).toBeNull();
  });

  it('opens the consultation form with the portfolio as the source', () => {
    const listener = vi.fn();
    window.addEventListener('openContactModal', listener);
    render(<PortfolioListClient projects={projects(7) as any} lang="uz" dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: dictionary.ctaButton }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      source: 'portfolio_list',
      intent: 'consultation',
    });
    window.removeEventListener('openContactModal', listener);
  });
});
