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
  founder: string;
  process: string;
  blog: string;
  services: string;
  brand_strategy: string;
  brand_strategy_desc: string;
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
    setScrolled(latest > 20);
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

  const useDarkHeaderText = !scrolled;

  const navItems = [
    { href: getLocalizedPath('/portfolio'), label: dictionary.portfolio },
    { href: getLocalizedPath('/#founder'), label: dictionary.founder },
    { href: getLocalizedPath('/#process'), label: dictionary.process },
    { href: getLocalizedPath('/blog'), label: dictionary.blog },
  ];

  const services = [
    { title: dictionary.brand_strategy, href: getLocalizedPath('/xizmatlar/brand-strategiyasi'), description: dictionary.brand_strategy_desc },
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
        <div className="w-full bg-[#0a0c10] text-white py-2.5 text-center border-b border-white/5 relative overflow-hidden group z-[60]">
          <div className="flex items-center justify-center gap-2">
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
          'fixed left-0 right-0 z-50 flex flex-col items-center transition-[transform,top] duration-300 ease-out',
          visible ? 'translate-y-0' : '-translate-y-full'
        )}
        style={{ top: dictionary.urgencyBadge && !scrolled ? 40 : 0 }}
        suppressHydrationWarning
      >
        <div
          className={cn(
            'flex h-16 w-full items-center justify-between transition-[background-color,border-color,box-shadow,border-radius,max-width,margin,padding] duration-500',
            scrolled
              ? 'mx-auto max-w-[95%] rounded-full border border-white/10 bg-[#0c0c12] px-5 py-2 shadow-[0_20px_55px_rgba(12,12,18,0.22)] backdrop-blur-xl lg:max-w-6xl lg:px-7'
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
