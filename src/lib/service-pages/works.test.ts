import { describe, expect, it, vi } from 'vitest';
import { fetchPortfolioList } from '@/lib/data/portfolio';
import { fetchServiceWorks, pickServiceWorks } from './works';

vi.mock('@/lib/data/portfolio', () => ({ fetchPortfolioList: vi.fn() }));

type Category = 'brand-strategy' | 'logo-design' | 'brandbook' | 'corporate-style' | 'packaging' | 'naming';
const project = (slug: string, category: Category, coverImage = `/images/${slug}.jpg`) => ({
  slug,
  title: slug,
  client: `${slug} client`,
  category,
  categoryLabel: category,
  coverImage,
});

describe('service page works (conversion audit K-9)', () => {
  it('takes up to three covered cases of the service category', () => {
    const works = pickServiceWorks(
      [project('a', 'logo-design'), project('b', 'packaging'), project('c', 'logo-design', ''), project('d', 'logo-design'), project('e', 'logo-design'), project('f', 'logo-design')],
      'logo',
    );
    expect(works).toEqual([
      { slug: 'a', client: 'a client', categoryLabel: 'logo-design', coverImage: '/images/a.jpg' },
      { slug: 'd', client: 'd client', categoryLabel: 'logo-design', coverImage: '/images/d.jpg' },
      { slug: 'e', client: 'e client', categoryLabel: 'logo-design', coverImage: '/images/e.jpg' },
    ]);
  });

  it('prefers the first category: naming cases before brand strategy', () => {
    const works = pickServiceWorks([project('s', 'brand-strategy'), project('n', 'naming')], 'naming');
    expect(works.map((work) => work.slug)).toEqual(['n', 's']);
  });

  it('skips the portfolio request for a service without portfolio categories', async () => {
    await expect(fetchServiceWorks('trademark-standard', 'uz')).resolves.toEqual([]);
    expect(vi.mocked(fetchPortfolioList)).not.toHaveBeenCalled();
  });
});
