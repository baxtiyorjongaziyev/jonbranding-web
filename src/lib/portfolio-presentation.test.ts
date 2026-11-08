import { describe, it, expect } from 'vitest';
import { selectHomePortfolioProjects, portfolioYear, presentPortfolioProject, cleanPortfolioTitle } from './portfolio-presentation';
import { getPortfolioFallback, type PortfolioProject } from './portfolio-fallbacks';

describe('portfolio presentation', () => {
  it('limits the home selection to known projects and keeps canonical CMS slugs', () => {
    const input = ['other', 'den-aroma-brend-transformatsiyasi', 'fidda-by-sevara-kumush-brendi', 'boyarin', 'arfadel', 'enros', 'beyaz', 'unrelated']
      .map((slug) => ({ slug, coverImage: '/old.jpg', category: 'naming', publishedAt: '2024-03-01' }));
    const selected = selectHomePortfolioProjects(input);
    expect(selected).toHaveLength(6);
    expect(selected[0].slug).toBe('den-aroma-brend-transformatsiyasi');
    expect(selected[0].coverImage).toBe('/images/cms/denaroma-hozir.webp');
    expect(selected[0].publishedAt).toBe('2024-03-01');
    expect(input[1].coverImage).toBe('/old.jpg');
  });
  it('does not invent project years', () => {
    expect(portfolioYear()).toBe('');
    expect(portfolioYear('invalid')).toBe('');
    expect(portfolioYear('2024-07-01T00:00:00Z')).toBe('2024');
  });
  it('replaces only the inspected old Perfona cover and preserves future CMS edits', () => {
    const project = { ...(getPortfolioFallback('uz', 'boyarin') as PortfolioProject), slug: 'perfona-logotip-va-brending', coverImage: 'https://cdn.sanity.io/24f2d8b6cac168bbdd8fd3619fb58a20cf84e6aa.jpg' };
    expect(presentPortfolioProject(project).coverImage).toContain('d7530f34143051ec24f70aa445b713ad880bd933');
    const updated = { ...project, title: 'Perfona', coverImage: '/new-approved-cover.jpg' };
    expect(presentPortfolioProject(updated)).toBe(updated);
  });
  it('cleans long titles and social media captions into crisp brand names', () => {
    expect(cleanPortfolioTitle("Siz bilan 'Yasira loyihasi ustida ishlash biz uchun katta sharaf bo'ldi...", 'Yasira', 'yasira')).toBe('Yasira');
    expect(cleanPortfolioTitle('Feel it — ingliz tilida SAT tayyorloviga ixtisoslashgan online platforma uchun ishlab chiqilgan logo dizayn.', 'Feel it', 'feel-it')).toBe('Feel It');
    expect(cleanPortfolioTitle('Enros — Nom, Logo, Firma uslubini ishlab chiqdik.', 'Enros', 'enros')).toBe('Enros');
    expect(cleanPortfolioTitle('Sarmilk loyihasi haqida 🧈', 'Sarmilk', 'sarmilk')).toBe('Sarmilk');
    expect(cleanPortfolioTitle('Shirona Café & Bakery - Naming, Logo, Firma uslubi, Brandbook, Patent', 'Shirona', 'shirona')).toBe('Shirona Café & Bakery');
  });
  it('normalizes missing categoryLabel from project category', () => {
    const project = {
      ...(getPortfolioFallback('uz', 'boyarin') as PortfolioProject),
      slug: 'custom-case',
      title: 'Custom Brand',
      category: 'naming' as const,
      categoryLabel: undefined as any,
    };
    const presented = presentPortfolioProject(project);
    expect(presented.categoryLabel).toBe('Neyming');
  });
});
