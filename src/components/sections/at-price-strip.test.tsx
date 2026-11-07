import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AtPriceStrip, { getPriceStripItems } from './at-price-strip';
import { getSalesContent } from '@/lib/sales-content';

const dictionary = { eyebrow: 'Narxlar ochiq', title: 'Narx va muddat oldindan ma’lum', link: 'Barcha narxlar va paketlar' };

afterEach(cleanup);

describe('home price strip', () => {
  it.each(['uz', 'ru', 'en', 'zh'] as const)('takes every price from sales-content (%s)', (lang) => {
    const content = getSalesContent(lang);
    const services = content.serviceGroups.flatMap((g) => g.items);
    const items = getPriceStripItems(lang);

    expect(items.map((i) => i.anchor)).toEqual([
      'service-logo',
      'service-visual-identity',
      'service-packaging',
      'packages',
    ]);
    for (const id of ['logo', 'visual-identity', 'packaging']) {
      const service = services.find((s) => s.id === id)!;
      expect(items.find((i) => i.key === id)).toMatchObject({ name: service.name, price: service.price });
    }
    // Eng arzon paket — kirish nuqtasi.
    const cheapest = Math.min(...content.packages.map((p) => Number(p.price.replace(/\D/g, ''))));
    expect(Number(items[3].price.replace(/\D/g, ''))).toBe(cheapest);
  });

  it('links each price to its section on the pricing page', () => {
    render(<AtPriceStrip lang="ru" dictionary={dictionary} />);
    expect(screen.getByRole('link', { name: /Barcha narxlar/ })).toHaveAttribute('href', '/ru/narxlar');
    const logo = getPriceStripItems('ru')[0];
    expect(screen.getByRole('link', { name: new RegExp(logo.name) })).toHaveAttribute('href', '/ru/narxlar#service-logo');
  });

  it('uses the root pricing path for Uzbek', () => {
    render(<AtPriceStrip lang="uz" dictionary={dictionary} />);
    expect(screen.getByRole('link', { name: /Barcha narxlar/ })).toHaveAttribute('href', '/narxlar');
  });

  it('renders nothing without its dictionary', () => {
    const { container } = render(<AtPriceStrip lang="uz" />);
    expect(container).toBeEmptyDOMElement();
  });
});
