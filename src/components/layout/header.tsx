
'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu, Phone, Send, X, Mail, Languages } from 'lucide-react';
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
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { UzFlagIcon } from '../icons/uz-flag';
import { RuFlagIcon } from '../icons/ru-flag';
import { ScrollArea } from '../ui/scroll-area';

const t = {
  uz: {
    portfolio: 'Portfolio',
    founder: 'Asoschi',
    process: 'Jarayon',
    blog: 'Blog',
    services: 'Xizmatlar',
    brand_strategy: 'Brend Strategiyasi',
    brand_strategy_desc: "Brendingiz uchun poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
    naming: 'Neyming',
    naming_desc: "Brendingiz uchun unutilmas, kuchli va huquqiy jihatdan toza nom tanlash.",
    corporate_style: 'Firma Uslubi',
    corporate_style_desc: "Brendingizni taniladigan qiluvchi logotip, ranglar va shriftlar tizimi.",
    packaging_design: 'Qadoq dizayni',
    packaging_design_desc: "Mahsulotingizni javonda ajralib turadigan qiluvchi jozibador dizayn.",
    services_and_prices: 'Xizmatlar va Narxlar',
    services_and_prices_desc: "Xizmatlar to'plamini o'zingiz yig'ing va narxni darhol bilib oling.",
    contact_by_phone: 'Telefon orqali bog\'lanish',
    contact_by_telegram: 'Telegram orqali yozish',
    free_consultation: 'Bepul konsultatsiya',
    open_menu: 'Menyuni ochish',
    switch_lang: "Tilni o'zgartirish",
    lang_ru: "Русский",
    lang_uz: "O'zbekcha"
  },
  ru: {
    portfolio: 'Портфолио',
    founder: 'Основатель',
    process: 'Процесс',
    blog: 'Блог',
    services: 'Услуги',
    brand_strategy: 'Бренд-стратегия',
    brand_strategy_desc: "Фундамент для вашего бренда — анализ рынка, позиционирование и коммуникация.",
    naming: 'Нейминг',
    naming_desc: "Выбор запоминающегося, сильного и юридически чистого названия для вашего бренда.",
    corporate_style: 'Фирменный стиль',
    corporate_style_desc: "Система логотипов, цветов и шрифтов, делающая ваш бренд узнаваемым.",
    packaging_design: 'Дизайн упаковки',
    packaging_design_desc: "Привлекательный дизайн, который выделит ваш продукт на полке.",
    services_and_prices: 'Услуги и цены',
    services_and_prices_desc: "Соберите свой пакет услуг и узнайте цену прямо сейчас.",
    contact_by_phone: 'Связаться по телефону',
    contact_by_telegram: 'Написать в Telegram',
    free_consultation: 'Бесплатная консультация',
    open_menu: 'Открыть меню',
    switch_lang: "Сменить язык",
    lang_ru: "Русский",
    lang_uz: "O'zbekcha"
  }
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

const ExpandingIconButton: FC<{
    icon: React.ElementType,
    text: string,
    href: string,
    isExternal?: boolean,
    isLink?: boolean,
    expandedWidth?: number
}> = ({ icon: Icon, text, href, isExternal = false, isLink = true, expandedWidth = 130 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    rest: { width: 44, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    hover: { width: expandedWidth, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  const textVariants = {
    rest: { opacity: 0, x: -10, transition: { duration: 0.1 } },
    hover: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
  };

  const Component = isLink ? motion(Link) : motion.a;
  const motionProps: any = {
      href: href,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      variants: buttonVariants,
      animate: isHovered ? 'hover' : 'rest',
      initial: "rest",
      className: "relative flex items-center justify-start h-11 rounded-full bg-secondary text-secondary-foreground shadow-sm overflow-hidden"
  };

  if (!isLink) {
    motionProps.target = isExternal ? '_blank' : '_self';
    motionProps.rel = isExternal ? 'noopener noreferrer' : '';
  }

  return (
      <Component {...motionProps}>
        <div className="absolute left-3.5 flex items-center justify-center h-full">
            <Icon size={18} />
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.span
              variants={textVariants}
              initial="rest"
              animate="hover"
              exit="rest"
              className="absolute left-11 text-sm font-medium whitespace-nowrap"
            >
              {text}
            </motion.span>
          )}
        </AnimatePresence>
      </Component>
  );
};


const Header: FC<{ lang: string }> = ({ lang = 'uz' }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

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

  const translations = lang === 'ru' ? t.ru : t.uz;

  const navItems = [
    { href: `/${lang}/#portfolio`, label: translations.portfolio },
    { href: `/${lang}/#founder`, label: translations.founder },
    { href: `/${lang}/#process`, label: translations.process },
    { href: `/${lang}/blog`, label: translations.blog },
  ];

  const services = [
    { title: translations.brand_strategy, href: `/${lang}/xizmatlar/brand-strategy`, description: translations.brand_strategy_desc },
    { title: translations.naming, href: `/${lang}/xizmatlar/neyming`, description: translations.naming_desc },
    { title: translations.corporate_style, href: `/${lang}/xizmatlar/firmenniy-stil`, description: translations.corporate_style_desc },
    { title: translations.packaging_design, href: `/${lang}/xizmatlar/qadoq-dizayni`, description: translations.packaging_design_desc },
    { title: translations.services_and_prices, href: `/${lang}/xizmatlar`, description: translations.services_and_prices_desc },
  ];
  
  const otherLang = lang === 'uz' ? 'ru' : 'uz';
  const newPath = pathname.startsWith(`/${lang}`) ? pathname.replace(`/${lang}`, `/${otherLang}`) : `/${otherLang}${pathname}`;


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
              <NavigationMenuTrigger className={cn("bg-transparent", scrolled && "text-foreground hover:bg-black/10 hover:text-foreground focus:bg-black/10 focus:text-foreground data-[state=open]:bg-black/10")}>
                {translations.services}
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
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent", scrolled && "text-foreground hover:bg-black/10 hover:text-foreground focus:bg-black/10")}>
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center space-x-2 lg:flex">
            <ExpandingIconButton 
              icon={otherLang === 'ru' ? RuFlagIcon : UzFlagIcon}
              text={otherLang === 'ru' ? translations.lang_ru : translations.lang_uz}
              href={newPath}
              isLink={true}
              expandedWidth={120}
            />
           <ExpandingIconButton icon={Phone} text="+998 33 645 00 97" href="tel:+998336450097" isExternal={false} isLink={false} expandedWidth={190}/>
           <ExpandingIconButton icon={Send} text="Telegram" href="https://t.me/baxtiyorjon_gaziyev" isExternal={true} isLink={false} />
           <Button 
            onClick={handleContactClick} 
            className="shadow-ocean"
          >
             {translations.free_consultation}
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn(scrolled && "text-foreground border-black/20 hover:bg-black/10 hover:text-foreground")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">{translations.open_menu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Menyu</SheetTitle>
              </SheetHeader>
               <ScrollArea className="h-full">
                <nav className="flex flex-col gap-6 pt-10 pr-6">
                    <div className="text-xl font-medium text-foreground">{translations.services}</div>
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
                        {translations.contact_by_telegram}
                        </a>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleContactClick} className="w-full shadow-ocean mt-4">
                        {translations.free_consultation}
                        </Button>
                        <Link href={newPath} className="mt-4">
                        <Button variant="outline" size="icon" className="w-12 h-12">
                            {otherLang === 'ru' ? <RuFlagIcon /> : <UzFlagIcon />}
                            <span className="sr-only">{translations.switch_lang}</span>
                        </Button>
                        </Link>
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

    