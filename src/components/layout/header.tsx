'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Menu, Phone, Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  onContactClick: () => void;
}

const navItems = [
  { href: '#services', label: 'Xizmatlar' },
  { href: '#founder', label: 'Asoschi' },
  { href: '#process', label: 'Jarayon' },
];

const Header: FC<HeaderProps> = ({ onContactClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Bosh sahifa">
          <Logo />
        </Link>
        <nav className="hidden items-center space-x-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-base font-medium text-gray-600 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
           <div className="flex items-center gap-6 ml-4">
             <a href="tel:+998336450097" className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-primary">
                <Phone size={16} />
                +998 33 645 00 97
              </a>
              <a href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-primary">
                <Send size={16} />
                Telegram
              </a>
           </div>
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={onContactClick} className="hidden md:flex shadow-ocean">
            Hoziroq buyurtma berish
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menyuni ochish</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 pt-10">
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
                    <a href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-gray-800 transition-colors hover:text-primary">
                      <Send size={20} />
                      Telegram orqali bog'lanish
                    </a>
                 </div>
                 <Button onClick={onContactClick} className="w-full shadow-ocean mt-4">
                  Hoziroq buyurtma berish
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
