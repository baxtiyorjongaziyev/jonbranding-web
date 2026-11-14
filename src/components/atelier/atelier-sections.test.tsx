import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ATQuotes } from './atelier-sections';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('homepage testimonials in restricted browser storage', () => {
  it('continues rendering and fetching when sessionStorage is blocked', async () => {
    vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    const fetch = vi.fn().mockResolvedValue({ json: async () => ({ testimonials: [] }) });
    vi.stubGlobal('fetch', fetch);
    render(<ATQuotes lang="uz" dictionary={{ quotes_title: 'Mijoz fikrlari' }} />);
    expect(screen.getByText('Mijoz fikrlari')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/testimonials?lang=uz'));
  });
  it('uses the supplied CMS snapshot without requesting the Worker', () => {
    vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    render(<ATQuotes lang="uz" dictionary={{ quotes_title: 'Mijoz fikrlari' }} testimonials={[]} />);
    expect(screen.getByText('Mijoz fikrlari')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
