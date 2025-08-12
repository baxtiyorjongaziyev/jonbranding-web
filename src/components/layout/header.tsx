'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';

interface HeaderProps {
  onContactClick: () => void;
}

const navItems = [
  { href: '#services', label: 'Xizmatlar' },
  { href: '#founder', label: 'Asoschi' },
  { href: '#process', label: 'Jarayon' },
  { href: '#faq', label: 'FAQ' },
];

const Header: FC<HeaderProps> = ({ onContactClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Bosh sahifa">
          <Logo />
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-base font-medium text-gray-600 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <Button onClick={onContactClick} className="hidden md:flex shadow-ocean">
            Sotib olish
          </Button>
          <Button onClick={onContactClick} size="sm" className="md:hidden">
            Aloqa
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
