'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { DesktopNav } from './header-desktop-nav';
import { MobileMenu } from './header-mobile-menu';

type Dictionary = {
  portfolio: string;
  online_brief: string;
  founder: string;
  process: string;
  blog: string;
  about: string;
  contacts: string;
  services: string;
  naming: string;
  naming_desc: string;
  logo_design: string;
  logo_design_desc: string;
  brandbook: string;
  brandbook_desc: string;
  corporate_style: string;
  corporate_style_desc: string;
  packaging_design: string;
  packaging_design_desc: string;
  services_and_prices: string;
  services_and_prices_desc: string;
  contact_by_phone: string;
  contact_by_telegram: string;
  free_consultation: string;
  open_menu: string;
  switch_lang: string;
  urgencyBadge?: string;
};

const Header: FC<{ lang: string; dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 5);
    const previous = scrollY.getPrevious() || 0;
    const diff = Math.abs(latest - previous);
    if (isMobileMenuOpen || latest <= 80) {
      setVisible(true);
    } else if (latest > previous && diff > 10) {
      setVisible(false);
    } else if (latest < previous && diff > 5) {
      setVisible(true);
    }
  });

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent('openContactModal', {
        detail: { section: 'header', ctaText: dictionary.free_consultation, source: 'header' },
      })
    );
  };

  const handleLinkClick = (label: string) => {
    setMobileMenuOpen(false);
    trackEvent({ action: 'nav_click', category: 'Navigation', label });
  };

  const getLocalizedPath = (path: string) => {
    if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === 'uz') return cleanPath;
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  };

  if (!dictionary) return null;

  const pathnameWithoutLocale = pathname.replace(/^\/(uz|ru|en|zh)(?=\/|$)/, '') || '/';
  if (pathnameWithoutLocale === '/pro-preview') return null;
  if (pathnameWithoutLocale === '/') return null;

  const isHomepage = pathnameWithoutLocale === '/';
  const isDarkPage = pathname.includes('/portfolio') || pathname.includes('/sotuvchi-kartochka');
  const useDarkHeaderText = isDarkPage ? false : (isHomepage ? scrolled : true);

  const navItems = [
    { href: getLocalizedPath('/portfolio'), label: dictionary.portfolio },
    { href: getLocalizedPath('/online-brief'), label: dictionary.online_brief },
    { href: getLocalizedPath('/#founder'), label: dictionary.founder },
    { href: getLocalizedPath('/#process'), label: dictionary.process },
    { href: getLocalizedPath('/blog'), label: dictionary.blog },
    { href: getLocalizedPath('/haqimizda'), label: dictionary.about },
    { href: getLocalizedPath('/aloqa'), label: dictionary.contacts },
  ];

  const services = [
    { title: dictionary.naming, href: getLocalizedPath('/xizmatlar/neyming'), description: dictionary.naming_desc },
    { title: dictionary.logo_design, href: getLocalizedPath('/xizmatlar/logo-dizayni'), description: dictionary.logo_design_desc },
    { title: dictionary.corporate_style, href: getLocalizedPath('/xizmatlar/firmenniy-stil'), description: dictionary.corporate_style_desc },
    { title: dictionary.brandbook, href: getLocalizedPath('/xizmatlar/brandbook'), description: dictionary.brandbook_desc },
    { title: dictionary.packaging_design, href: getLocalizedPath('/xizmatlar/qadoq-dizayni'), description: dictionary.packaging_design_desc },
    { title: dictionary.services_and_prices, href: getLocalizedPath('/xizmatlar'), description: dictionary.services_and_prices_desc },
  ];

  return (
    <>
      {dictionary.urgencyBadge && (
        <div
          className="fixed top-0 left-0 right-0 z-50 h-10 w-full bg-[#ef4444] flex items-center justify-center overflow-hidden border-b border-white/10 group cursor-pointer"
          onClick={handleContactClick}
          style={{ top: visible ? (scrolled ? -40 : 0) : -40 }}
        >
          <div className="flex items-center justify-center gap-2 relative z-10 px-4">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
            <p className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-white/95 group-hover:text-white transition-all duration-300">
              {dictionary.urgencyBadge}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}

      <header
        className={cn(
          'fixed left-0 right-0 z-50 flex flex-col items-center transition-[top] duration-300 ease-out'
        )}
        style={{ top: visible ? (dictionary.urgencyBadge && !scrolled ? 40 : 0) : -120 }}
        suppressHydrationWarning
      >
        <div
          className={cn(
            'flex h-16 w-full items-center justify-between transition-[background-color,border-color,box-shadow,border-radius,max-width,margin,padding] duration-500',
            scrolled
              ? cn('mx-auto max-w-[95%] rounded-full liquid-glass-header px-5 py-2 lg:max-w-6xl lg:px-7', isDarkPage && 'dark-glass')
              : 'mx-auto max-w-[1240px] border-b border-transparent bg-transparent px-4 sm:px-6 lg:px-7'
          )}
          suppressHydrationWarning
        >
          <Link
            href={getLocalizedPath('/')}
            className="flex items-center shrink-0"
            aria-label="Jon Branding - Bosh sahifa"
          >
            <Logo isWhite={!useDarkHeaderText} />
          </Link>

          {mounted && (
            <DesktopNav
              lang={lang}
              navItems={navItems}
              services={services}
              scrolled={scrolled}
              useDarkHeaderText={useDarkHeaderText}
              onContactClick={handleContactClick}
              dictionary={dictionary}
            />
          )}

          <MobileMenu
            lang={lang}
            navItems={navItems}
            services={services}
            isOpen={isMobileMenuOpen}
            useDarkHeaderText={useDarkHeaderText}
            onOpenChange={setMobileMenuOpen}
            onContactClick={handleContactClick}
            onLinkClick={handleLinkClick}
            dictionary={dictionary}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
