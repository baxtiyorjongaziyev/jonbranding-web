import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ATGallery } from './atelier-sections';
import uz from '@/locales/uz.json';

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('next/link', () => ({ default: ({ children, ...props }: any) => <a {...props}>{children}</a> }));

describe('home portfolio filters', () => {
  it('filters by recorded service, without assigning unknown industries to food', () => {
    render(<ATGallery lang="uz" dictionary={uz.atelier} onOpen={vi.fn()} projects={[
      { _id: '1', title: 'IT mahsulot', slug: 'it', client: 'IT', category: 'logo-design', coverImage: '/it.png' },
      { _id: '2', title: 'Sut qadog‘i', slug: 'milk', client: 'Sut', category: 'packaging', coverImage: '/milk.png' },
    ]} />);
    expect(screen.getAllByRole('link').filter((link) => link.classList.contains('gal-tile'))).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Qadoq' }));
    expect(screen.queryByText('IT mahsulot')).toBeNull();
    expect(screen.getByText('Sut qadog‘i')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Qadoq' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByRole('button', { name: 'Oziq-ovqat' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Hammasi' }));
    expect(screen.getByText('IT mahsulot')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Barcha loyihalarni ko‘rish' }).getAttribute('href')).toBe('/portfolio');
  });
});
