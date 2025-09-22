
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

const navItems = [
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#founder', label: 'Asoschi' },
  { href: '/#process', label: 'Jarayon' },
];

const services: { title: string; href: string; description: string }[] = [
  {
    title: "Brend Strategiyasi",
    href: "/xizmatlar/brand-strategy",
    description: "Brendingiz uchun poydevor — bozor tahlili, pozitsiyalash va kommunikatsiya.",
  },
  {
    title: "Neyming",
    href: "/xizmatlar/neyming",
    description: "Brendingiz uchun unutilmas, kuchli va huquqiy jihatdan toza nom tanlash.",
  },
  {
    title: "Firma Uslubi",
    href: "/xizmatlar/firmenniy-stil",
    description: "Brendingizni taniladigan qiluvchi logotip, ranglar va shriftlar tizimi.",
  },
  {
    title: "Qadoq dizayni",
    href: "/xizmatlar/qadoq-dizayni",
    description: "Mahsulotingizni javonda ajralib turadigan qiluvchi jozibador dizayn.",
  },
   {
    title: "Xizmatlar va Narxlar",
    href: "/xizmatlar",
    description: "Xizmatlar to'plamini o'zingiz yig'ing va narxni darhol bilib oling.",
  },
];


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


const Header: FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleContactClick = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "top-4" : "top-0"
    )}>
      <div className={cn(
        "container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
        scrolled ? "bg-white/20 backdrop-blur-lg rounded-full shadow-2xl border border-white/30" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center" aria-label="Bosh sahifa">
          <Logo isWhite={false} />
        </Link>
        <NavigationMenu className="hidden lg:flex">
           <NavigationMenuList>
             <NavigationMenuItem>
              <NavigationMenuTrigger className={cn("bg-transparent", scrolled && "text-foreground hover:bg-black/10 hover:text-foreground focus:bg-black/10 focus:text-foreground data-[state=open]:bg-black/10")}>Xizmatlar</NavigationMenuTrigger>
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

        <div className="hidden items-center space-x-6 lg:flex">
           <div className="flex items-center gap-6 ml-4">
             <a href="tel:+998336450097" className={cn("flex items-center gap-2 text-base font-medium transition-colors hover:text-accent", scrolled ? "text-foreground" : "text-foreground")}>
                <Phone size={16} />
                +998 33 645 00 97
              </a>
              <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 text-base font-medium transition-colors hover:text-accent", scrolled ? "text-foreground" : "text-foreground")}>
                <Send size={16} />
                Telegram
              </a>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleContactClick} className={cn("hidden md:flex shadow-ocean animate-breathing relative group overflow-hidden")}>
             <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700"></span>
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:bg-black/20">
                Bepul konsultatsiya olish
              </span>
              <span className="absolute w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full skew-x-[-25deg]"></span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn("lg:hidden", scrolled && "text-foreground border-black/20 hover:bg-black/10 hover:text-foreground")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menyuni ochish</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Menyu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 pt-10">
                 <div className="text-xl font-medium text-foreground">Xizmatlar</div>
                 <ul className="pl-4 space-y-4">
                    {services.map((service) => (
                       <li key={service.title}>
                         <Link href={service.href} className="text-lg font-normal text-muted-foreground hover:text-accent">{service.title}</Link>
                       </li>
                    ))}
                 </ul>
                {navItems.map((item) => (
                   <Link
                    key={item.label}
                    href={item.href}
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
                      Telegram orqali bog'lanish
                    </a>
                 </div>
                 <Button onClick={handleContactClick} className="w-full shadow-ocean mt-4 animate-breathing">
                  Bepul konsultatsiya olish
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
