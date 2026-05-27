'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Phone, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/analytics';
import LanguageSwitcher from '../language-switcher';

type NavItem = { href: string; label: string };
type Service = { title: string; href: string; description: string };

interface MobileMenuProps {
  lang: string;
  navItems: NavItem[];
  services: Service[];
  isOpen: boolean;
  useDarkHeaderText: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: () => void;
  onLinkClick: (label: string) => void;
  dictionary: {
    services: string;
    free_consultation: string;
    open_menu: string;
    contact_by_telegram: string;
  };
}

export function MobileMenu({
  lang,
  navItems,
  services,
  isOpen,
  useDarkHeaderText,
  onOpenChange,
  onContactClick,
  onLinkClick,
  dictionary,
}: MobileMenuProps) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <LanguageSwitcher lang={lang as any} isInverted={!useDarkHeaderText} />
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={dictionary.open_menu}
            className={cn(
              'rounded-full',
              useDarkHeaderText
                ? 'text-foreground border-black/20 hover:bg-black/10 hover:text-foreground'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white'
            )}
          >
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
                    <Link
                      href={service.href}
                      onClick={() => onLinkClick(service.title)}
                      className="text-lg font-normal text-muted-foreground hover:text-accent"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onLinkClick(item.label)}
                  className="text-xl font-medium text-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t pt-6 mt-4 space-y-4">
                <a
                  href="tel:+998336450097"
                  onClick={() => trackContactClick('phone', 'mobile_menu')}
                  className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent"
                >
                  <Phone size={20} aria-hidden="true" />
                  +998 33 645 00 97
                </a>
                <a
                  href="https://t.me/baxtiyorjon_gaziyev"
                  onClick={() => trackContactClick('telegram', 'mobile_menu')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-accent"
                >
                  <Send size={20} aria-hidden="true" />
                  {dictionary.contact_by_telegram}
                </a>
              </div>
              <div className="pt-6">
                <Button
                  onClick={onContactClick}
                  className="w-full shadow-ocean mt-4 py-6 text-lg rounded-full"
                  aria-label={dictionary.free_consultation}
                >
                  {dictionary.free_consultation}
                </Button>
              </div>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
