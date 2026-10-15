import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './header';

let currentPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => null,
}));

vi.mock('@/lib/use-main-site-origin', () => ({
  useMainSiteOrigin: () => '',
}));

beforeEach(() => {
  currentPathname = '/';
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

const mockDictionary: any = {
  portfolio: 'Portfolio',
  online_brief: 'Online brief',
  founder: 'Asoschi',
  process: 'Jarayon',
  blog: 'Blog',
  about: 'Haqimizda',
  contacts: 'Aloqa',
  services: 'Xizmatlar',
  naming: 'Neyming',
  naming_desc: 'Neyming tavsifi',
  logo_design: 'Logo dizayni',
  logo_design_desc: 'Logo tavsifi',
  brandbook: 'Brandbook',
  brandbook_desc: 'Brandbook tavsifi',
  corporate_style: 'Korporativ stil',
  corporate_style_desc: 'Stil tavsifi',
  packaging_design: 'Qadoq dizayni',
  packaging_design_desc: 'Qadoq tavsifi',
  services_and_prices: 'Xizmatlar va narxlar',
  services_and_prices_desc: 'Narxlar tavsifi',
  contact_by_phone: "Qo'ng'iroq",
  contact_by_telegram: 'Telegram',
  free_consultation: '20 daqiqalik bepul maslahat',
  open_menu: 'Menyuni ochish',
  close_menu: 'Menyuni yopish',
  install_app: "Ilovani o'rnatish",
  install_app_hint: 'Tezkor kirish',
  switch_lang: "Tilni o'zgartirish",
};

describe('Header component — dark / light page contrast', () => {
  beforeEach(() => {
    currentPathname = '/';
  });

  it('renders dark logo and dark navigation on light home page', () => {
    currentPathname = '/';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-black.svg');
  });

  it('renders white logo and inverted header on /portfolio', () => {
    currentPathname = '/portfolio';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });

  it('renders white logo and inverted header on localized /uz/portfolio/fidda case study', () => {
    currentPathname = '/uz/portfolio/fidda';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });

  it('renders white logo and inverted header on /blog', () => {
    currentPathname = '/blog';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });

  it('renders white logo and inverted header on localized /uz/blog/rebrending-qachon-kerak', () => {
    currentPathname = '/uz/blog/rebrending-qachon-kerak';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });

  it('renders white logo and inverted header on /pricing', () => {
    currentPathname = '/pricing';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });

  it('renders dark logo on /avans when system dark mode is false', () => {
    currentPathname = '/avans';
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-black.svg');
  });

  it('renders white logo on /avans when system dark mode is true', () => {
    currentPathname = '/avans';
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Header lang="uz" dictionary={mockDictionary} />);
    const logoImg = screen.getByAltText('Jon Branding');
    expect(logoImg.getAttribute('src')).toBe('/assets/logos/logo-white.svg');
  });
});

