'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu, Phone, Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';
import LanguageSwitcher from '../language-switcher';
import Magnetic from '../ui/magnetic';
import { trackContactClick, trackEvent } from '@/lib/analytics';

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
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; children: React.ReactNode }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary focus:bg-secondary",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"

const ExpandingButton = ({ 
  href, 
  target, 
  icon, 
  text,
  ariaLabel,
  onClick,
  isHovered: externalIsHovered
}: { 
  href: string; 
  target?: string; 
  icon: React.ReactNode; 
  text: string;
  ariaLabel: string;
  onClick?: () => void;
  isHovered?: boolean;
}) => {
  const [internalIsHovered, setInternalIsHovered] = useState(false);
  const isHovered = externalIsHovered ?? internalIsHovered;

  return (
    <motion.a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      onHoverStart={() => setInternalIsHovered(true)}
      onHoverEnd={() => setInternalIsHovered(false)}
      onClick={onClick}
      // Fixed width expansion prevent layout 'jitter' compared to 'auto'
      animate={{ width: isHovered ? 160 : 44 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex h-11 items-center justify-start rounded-full bg-white/40 text-foreground backdrop-blur-md transition-colors duration-300 hover:bg-white/60 overflow-hidden !ring-0 !ring-offset-0 !outline-none group",
        // Invisible hit area extension to make it easier to "catch" the button
        "before:absolute before:-inset-2 before:content-['']"
      )}
    >
      <div className="flex items-center px-3 w-full">
        <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center" aria-hidden="true">
          {icon}
        </div>
        <motion.span 
          className="whitespace-nowrap text-sm font-medium ml-3 overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            width: isHovered ? 'auto' : 0,
            x: isHovered ? 0 : -5
          }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      </div>
    </motion.a>
  );
};

const Header: FC<{ lang: string, dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  if (!dictionary) return null;
  const { scrollY } = useScroll();
  
  const top = useTransform(scrollY, [0, 80], [0, 16]);
  const announcementTop = useTransform(scrollY, [0, 40], [40, 0]);
  const borderRadius = useTransform(scrollY, [0, 80], [0, 9999]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)']
  );
  const borderColor = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255, 255, 255, 0.25)']);
  const backdropBlur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(24px)']);
  const boxShadow = useTransform(scrollY, [0, 80], ['none', '0 8px 32px 0 rgba(31, 38, 135, 0.15)']);

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      
      // Scrolled state for visual styling (background, border)
      setScrolled(currentScrollY > 20);

      // Visibility logic: hide on scroll down, show on scroll up
      // 1. Never hide if mobile menu is open
      // 2. Only hide if scrolling down significantly (> 10px diff) or past a certain point
      // 3. Always show at the top
      if (isMobileMenuOpen) {
        setVisible(true);
      } else if (currentScrollY <= 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && scrollDiff > 10) {
        // Significant scroll down
        setVisible(false);
      } else if (currentScrollY < lastScrollY && scrollDiff > 5) {
        // Significant scroll up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  const handleLinkClick = (label: string) => {
    setMobileMenuOpen(false);
    trackEvent({ action: 'nav_click', category: 'Navigation', label });
  };
  
  const getLocalizedPath = (path: string) => {
    // If it's already an absolute URL, return it
    if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:')) return path;
    
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (lang === 'uz') return cleanPath;
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
  };

  const navItems = [
    { href: getLocalizedPath('/#portfolio'), label: dictionary.portfolio },
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
      {/* ── Urgency Announcement Bar (Top Ribbon) ── */}
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

      <motion.header 
        className="fixed left-0 right-0 z-50 flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ 
          top: dictionary.urgencyBadge ? announcementTop : 0,
        }}
        suppressHydrationWarning
      >
      <motion.div
        className={cn(
          "mx-auto flex h-16 items-center justify-between transition-all duration-700 w-full",
          scrolled ? "px-6 lg:px-10" : "px-6 lg:px-8",
          scrolled 
            ? "max-w-[95%] lg:max-w-7xl py-2 liquid-glass rounded-full"
            : "max-w-full lg:max-w-screen-2xl bg-white/20 border-b border-white/10"
        )}
        style={{ 
          top: top,
          boxShadow
        }}
        suppressHydrationWarning
      >
        <Link href={getLocalizedPath('/')} className="flex items-center shrink-0" aria-label="Jon Branding - Bosh sahifa">
          <Logo />
        </Link>

        {mounted && (
          <div className={cn(
            "hidden lg:flex items-center transition-all duration-500 flex-1",
            scrolled ? "lg:ml-12 lg:mr-8" : "lg:ml-8"
          )}>
            <div className="flex items-center justify-between w-full">
              <NavigationMenu aria-label="Asosiy navigatsiya">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn("bg-transparent", scrolled ? "text-foreground hover:bg-black/10" : "text-foreground hover:bg-white/10")}>
                      {dictionary.services}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {services.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent", scrolled ? "text-foreground hover:bg-black/10" : "text-foreground hover:bg-white/10")}>
                        <Link href={item.href}>
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center space-x-2 h-11">
                <LanguageSwitcher lang={lang as any} />
                <div className="flex items-center gap-1.5">
                  <ExpandingButton 
                    href="tel:+998336450097"
                    ariaLabel={dictionary.contact_by_phone}
                    icon={<Phone className="h-4.5 w-4.5" />}
                    text={dictionary.contact_by_phone}
                    onClick={() => trackContactClick('phone')}
                  />
                  <ExpandingButton 
                    href="https://t.me/baxtiyorjon_gaziyev"
                    target="_blank"
                    ariaLabel={dictionary.contact_by_telegram}
                    icon={<Send className="h-4.5 w-4.5" />}
                    text={dictionary.contact_by_telegram}
                    onClick={() => trackContactClick('telegram')}
                  />
                </div>
                <motion.div
                  className="rounded-full bg-transparent"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: ["0 0 0 0 rgba(37, 99, 235, 0)", "0 0 20px 5px rgba(37, 99, 235, 0.3)", "0 0 0 0 rgba(37, 99, 235, 0)"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Button 
                    onClick={handleContactClick} 
                    className="shadow-ocean h-11 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold"
                    aria-label={dictionary.free_consultation}
                  >
                    {dictionary.free_consultation}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher lang={lang as any} />
          {mounted && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label={dictionary.open_menu} className={cn("text-foreground border-border/50", scrolled && "text-foreground border-black/20 hover:bg-black/10 hover:text-foreground")}>
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{dictionary.open_menu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Menyu</SheetTitle>
                </SheetHeader>
                 <ScrollArea className="h-full">
                  <nav className="flex flex-col gap-6 pt-10 pr-6">
                      <div className="text-xl font-medium text-foreground">{dictionary.services}</div>
                      <ul className="pl-4 space-y-4">
                          {services.map((service) => (
                          <li key={service.title}>
                              <Link href={service.href} onClick={() => handleLinkClick(service.title)} className="text-lg font-normal text-muted-foreground hover:text-accent">{service.title}</Link>
                          </li>
                          ))}
                      </ul>
                      {navItems.map((item) => (
                      <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => handleLinkClick(item.label)}
                          className="text-xl font-medium text-foreground transition-colors hover:text-accent"
                      >
                          {item.label}
                      </Link>
                      ))}
                      <div className="border-t pt-6 mt-4 space-y-4">
                          <a href="tel:+998336450097" onClick={() => trackContactClick('phone')} className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent">
                          <Phone size={20} aria-hidden="true" />
                          +998 33 645 00 97
                          </a>
                          <a href="https://t.me/baxtiyorjon_gaziyev" onClick={() => trackContactClick('telegram')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent">
                          <Send size={20} aria-hidden="true" />
                          {dictionary.contact_by_telegram}
                          </a>
                      </div>
                      <div className="pt-6">
                          <Button onClick={handleContactClick} className="w-full shadow-ocean mt-4 py-6 text-lg" aria-label={dictionary.free_consultation}>
                          {dictionary.free_consultation}
                          </Button>
                      </div>
                  </nav>
                 </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </motion.div>
    </motion.header>
    </>
  );
};

export default Header;