import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LOGO_PAGE } from '@/lib/service-pages/logo';

vi.mock('next/image', () => ({ default: (props: { alt: string }) => <span role="img" aria-label={props.alt} /> }));
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn(), trackLead: vi.fn(), generateEventId: () => 'e', getGaClientId: () => undefined }));

const { ServiceLanding } = await import('./service-landing');

const works = [
  { slug: 'rash-milk', client: 'Rash Milk', categoryLabel: 'Logotip', coverImage: '/a.jpg' },
  { slug: 'savod', client: 'Savod', categoryLabel: 'Logotip', coverImage: '/b.jpg' },
];

afterEach(cleanup);

describe('service page first screen and proof (conversion audit K-9)', () => {
  it('shows real portfolio work next to the price, linked to the case', () => {
    const { container } = render(<ServiceLanding content={LOGO_PAGE} works={works} />);
    const hero = container.querySelector('[data-service-hero-works]') as HTMLElement;
    expect(hero).not.toBeNull();
    expect(within(hero).getByRole('link', { name: /Rash Milk/ })).toHaveAttribute('href', '/portfolio/rash-milk');
    expect(within(hero).getAllByRole('img')).toHaveLength(2);
  });

  it('keeps the single-column hero when there is no matching work', () => {
    const { container } = render(<ServiceLanding content={LOGO_PAGE} />);
    expect(container.querySelector('[data-service-hero-works]')).toBeNull();
  });

  it('offers the service consultation right after the reviews', () => {
    const { container } = render(<ServiceLanding content={LOGO_PAGE} />);
    const cta = container.querySelector('[data-service-proof-cta]');
    expect(cta).toHaveTextContent('Logotip bo‘yicha maslahat');
    expect(screen.getAllByRole('button', { name: LOGO_PAGE.hero.primaryCta })).toHaveLength(2);
  });
});
