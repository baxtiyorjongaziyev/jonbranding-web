
'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu, Phone, Send, Languages, ChevronsUpDown } from 'lucide-react';
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
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import LanguageSwitcher from '../language-switcher';
import { Locale, locales, localeNames, setLocaleCookie } from '@/lib/i18n/locale';
import { UzFlagIcon } from '../icons/uz-flag';
import { RuFlagIcon } from '../icons/ru-flag';
import { GbFlagIcon } from '../icons/gb-flag';

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
    lang_ru: string;
    lang_uz: string;
    lang_en: string;
}

const localeIcons: Record<Locale, React.FC<{ className?: string }>> = {
  uz: UzFlagIcon,
  ru: RuFlagIcon,
  en: GbFlagIcon,
};

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
  text 
}: { 
  href: string; 
  target?: string; 
  icon: React.ReactNode; 
  text: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={target}
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ width: isHovered ? 'auto' : 40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex h-10 items-center justify-start rounded-full border border-black/10 bg-white/50 text-foreground shadow-md backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/20 overflow-hidden px-2.5"
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 h-5 w-5">{icon}</div>
        <motion.span 
          className="whitespace-nowrap text-sm font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        >
          {text}
        </motion.span>
      </div>
    </motion.a>
  );
};


const Header: FC<{ lang: string, dictionary: Dictionary }> = ({ lang = 'uz', dictionary }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();


  const top = useTransform(scrollY, [0, 80], [0, 16]);
  const borderRadius = useTransform(scrollY, [0, 80], [0, 9999]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)']
  );
  
  const [scrolled, setScrolled] = useState(false);
   useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    
    const currentPathWithoutLocale = pathname.startsWith(`/${lang}`) ? pathname.substring(`/${lang}`.length) : pathname;
    const newPath = `/${newLocale}${currentPathWithoutLocale || '/'}`;
    
    router.push(newPath);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { href: `/${lang}/#portfolio`, label: dictionary.portfolio },
    { href: `/${lang}/#founder`, label: dictionary.founder },
    { href: `/${lang}/#process`, label: dictionary.process },
    { href: `/${lang}/blog`, label: dictionary.blog },
  ];

  const services = [
    { title: dictionary.brand_strategy, href: `/${lang}/xizmatlar/brand-strategy`, description: dictionary.brand_strategy_desc },
    { title: dictionary.naming, href: `/${lang}/xizmatlar/neyming`, description: dictionary.naming_desc },
    { title: dictionary.corporate_style, href: `/${lang}/xizmatlar/firmenniy-stil`, description: dictionary.corporate_style_desc },
    { title: dictionary.packaging_design, href: `/${lang}/xizmatlar/qadoq-dizayni`, description: dictionary.packaging_design_desc },
    { title: dictionary.services_and_prices, href: `/${lang}/xizmatlar`, description: dictionary.services_and_prices_desc },
  ];
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{ top }}
    >
      <motion.div
        className={cn(
          "container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
          "backdrop-blur-lg border border-transparent"
        )}
        style={{ 
          borderRadius,
          backgroundColor,
          borderColor: useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)']),
          boxShadow: useTransform(scrollY, [0, 80], ['none', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'])
        }}
      >
        <Link href={`/${lang}`} className="flex items-center" aria-label="Bosh sahifa">
          <Logo isWhite={false} />
        </Link>
        <NavigationMenu className="hidden lg:flex">
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

        <div className="hidden items-center space-x-2 lg:flex">
          <LanguageSwitcher lang={lang as 'uz' | 'ru' | 'en'} />
           
            <ExpandingButton 
              href="tel:+998336450097"
              icon={<Phone className="h-5 w-5" />}
              text="+998336450097"
            />
            
            <ExpandingButton 
              href="https://t.me/baxtiyorjon_gaziyev"
              target="_blank"
              icon={<Send className="h-5 w-5" />}
              text={dictionary.contact_by_telegram}
            />

          <Button 
            onClick={handleContactClick} 
            className="shadow-ocean"
          >
             {dictionary.free_consultation}
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher lang={lang as 'uz' | 'ru' | 'en'} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn("text-foreground border-border/50", scrolled && "text-foreground border-black/20 hover:bg-black/10 hover:text-foreground")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">{dictionary.open_menu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Menyu</SheetTitle>
              </SheetHeader>
               <ScrollArea className="h-full">
                <nav className="flex flex-col gap-6 pt-10 pr-6">
                    <div className="text-xl font-medium text-foreground">{dictionary.services}</div>
                    <ul className="pl-4 space-y-4">
                        {services.map((service) => (
                        <li key={service.title}>
                            <Link href={service.href} onClick={handleLinkClick} className="text-lg font-normal text-muted-foreground hover:text-accent">{service.title}</Link>
                        </li>
                        ))}
                    </ul>
                    {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className="text-xl font-medium text-foreground transition-colors hover:text-accent"
                    >
                        {item.label}
                    </Link>
                    ))}
                    <div className="border-t pt-6 mt-4 space-y-4">
                        <a href="tel:+998336450097" className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent">
                        <Phone size={20} />
                        +998 33 645 00 97
                        </a>
                        <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent">
                        <Send size={20} />
                        {dictionary.contact_by_telegram}
                        </a>
                    </div>
                    <div className="pt-6">
                        <Button onClick={handleContactClick} className="w-full shadow-ocean mt-4 py-6 text-lg">
                        {dictionary.free_consultation}
                        </Button>
                    </div>
                </nav>
               </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
