
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu, Phone, Send, ChevronDown } from 'lucide-react';
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
    title: "Logotip va Dizayn-tizim",
    href: "/#package-builder",
    description: "Tizimli yondashuv orqali brendingizning vizual qiyofasini yaratish.",
  },
  {
    title: "Qadoq dizayni",
    href: "/#package-builder",
    description: "Mahsulotingizni javonda ajralib turadigan qiluvchi jozibador dizayn.",
  },
   {
    title: "Barcha narxlar",
    href: "/#package-builder",
    description: "Xizmatlar to'plamini o'zingiz yig'ing va narxni darhol bilib oling.",
  },
];


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


const Header: FC = () => {
  const handleContactClick = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Bosh sahifa">
          <Logo />
        </Link>
        <NavigationMenu className="hidden lg:flex">
           <NavigationMenuList>
             <NavigationMenuItem>
              <NavigationMenuTrigger>Xizmatlar</NavigationMenuTrigger>
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
                <Link href={item.href} passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center space-x-6 lg:flex">
           <div className="flex items-center gap-6 ml-4">
             <a href="tel:+998336450097" className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-primary">
                <Phone size={16} />
                +998 33 645 00 97
              </a>
              <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-primary">
                <Send size={16} />
                Telegram
              </a>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleContactClick} className="hidden md:flex shadow-ocean animate-subtle-pulse">
            Bepul konsultatsiya olish
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menyuni ochish</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Menyu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 pt-10">
                {/* Mobile nav needs to be updated too */}
                 <div className="text-xl font-medium text-gray-800">Xizmatlar</div>
                 <ul className="pl-4 space-y-4">
                    {services.map((service) => (
                       <li key={service.title}>
                         <Link href={service.href} className="text-lg font-normal text-gray-600 hover:text-primary">{service.title}</Link>
                       </li>
                    ))}
                 </ul>
                {navItems.map((item) => (
                   <Link
                    key={item.label}
                    href={item.href}
                    className="text-xl font-medium text-gray-800 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                 <div className="border-t pt-6 mt-4 space-y-4">
                    <a href="tel:+998336450097" className="flex items-center gap-3 text-lg font-medium text-gray-800 transition-colors hover:text-primary">
                      <Phone size={20} />
                      +998 33 645 00 97
                    </a>
                    <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-gray-800 transition-colors hover:text-primary">
                      <Send size={20} />
                      Telegram orqali bog'lanish
                    </a>
                 </div>
                 <Button onClick={handleContactClick} className="w-full shadow-ocean mt-4 animate-subtle-pulse">
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
