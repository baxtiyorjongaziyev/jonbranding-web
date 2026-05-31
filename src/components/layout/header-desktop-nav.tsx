'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Phone, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackContactClick } from '@/lib/analytics';
import LanguageSwitcher from '../language-switcher';
import React from 'react';
import { NavigationMenuLink as NMLink } from '@radix-ui/react-navigation-menu';

type NavItem = { href: string; label: string };
type Service = { title: string; href: string; description: string };

interface DesktopNavProps {
  lang: string;
  navItems: NavItem[];
  services: Service[];
  scrolled: boolean;
  useDarkHeaderText: boolean;
  onContactClick: () => void;
  dictionary: {
    services: string;
    free_consultation: string;
    contact_by_phone: string;
    contact_by_telegram: string;
  };
  settings?: { phone?: string; telegramPersonal?: string };
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; children: React.ReactNode }
>(({ className, title, children, href, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        href={href!}
        ref={ref}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary focus:bg-secondary',
          className
        )}
        {...props}
      >
        <div className="text-base font-semibold leading-none text-foreground">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">{children}</p>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = 'ListItem';

const ExpandingButton = ({
  href,
  target,
  rel,
  icon,
  text,
  ariaLabel,
  onClick,
}: {
  href: string;
  target?: string;
  rel?: string;
  icon: React.ReactNode;
  text: string;
  ariaLabel: string;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onClick}
      style={{ width: isHovered ? 160 : 44 }}
      className={cn(
        'relative flex h-11 items-center justify-start overflow-hidden rounded-full bg-white/40 text-foreground backdrop-blur-md transition-[background-color,box-shadow,width] duration-300 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 group shrink-0',
        "before:absolute before:-inset-2 before:content-['']"
      )}
    >
      <div className="flex items-center px-3 w-full">
        <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center" aria-hidden="true">
          {icon}
        </div>
        <span
          className="whitespace-nowrap text-sm font-medium ml-3 overflow-hidden transition-[max-width,opacity,transform] duration-200"
          style={{
            maxWidth: isHovered ? 108 : 0,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0)' : 'translateX(-5px)',
          }}
        >
          {text}
        </span>
      </div>
    </a>
  );
};

export function DesktopNav({
  lang,
  navItems,
  services,
  scrolled,
  useDarkHeaderText,
  onContactClick,
  dictionary,
  settings,
}: DesktopNavProps) {
  const navTextClass = useDarkHeaderText
    ? 'text-[#23232c] hover:bg-[#eceeff] hover:text-[#2c2bf5]'
    : 'text-white/88 hover:bg-white/10 hover:text-white';

  return (
    <div
      className={cn(
        'hidden lg:flex items-center transition-all duration-500 flex-1',
        scrolled ? 'lg:ml-4 lg:mr-2 xl:ml-12 xl:mr-8' : 'lg:ml-8'
      )}
    >
      <div className="flex items-center justify-between w-full">
        <NavigationMenu aria-label="Asosiy navigatsiya" className="shrink-0">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  'rounded-full bg-transparent px-2.5 text-xs font-bold xl:px-4 xl:text-sm',
                  navTextClass
                )}
              >
                {dictionary.services}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {services.map((component) => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'rounded-full bg-transparent px-2.5 text-xs font-bold xl:px-4 xl:text-sm whitespace-nowrap',
                    navTextClass
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-1.5 xl:space-x-2 h-11 shrink-0">
          <LanguageSwitcher lang={lang as any} isInverted={!useDarkHeaderText} />
          <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
            <ExpandingButton
              href={`tel:${settings?.phone ?? '+998336450097'}`}
              ariaLabel={dictionary.contact_by_phone}
              icon={<Phone className="h-4.5 w-4.5" />}
              text={dictionary.contact_by_phone}
              onClick={() => trackContactClick('phone', 'header')}
            />
            <ExpandingButton
              href={settings?.telegramPersonal ?? 'https://t.me/baxtiyorjon_gaziyev'}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel={dictionary.contact_by_telegram}
              icon={<Send className="h-4.5 w-4.5" />}
              text={dictionary.contact_by_telegram}
              onClick={() => trackContactClick('telegram', 'header')}
            />
          </div>
          <div className="rounded-full bg-transparent shrink-0">
            <Button
              onClick={onContactClick}
              className={cn(
                'h-11 rounded-full px-3 text-xs font-extrabold uppercase tracking-[0.04em] shadow-[0_14px_32px_-18px_rgba(44,43,245,0.85)] transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 active:scale-[0.98] xl:px-6 xl:text-sm shrink-0 whitespace-nowrap',
                scrolled
                  ? 'bg-[#2c2bf5] text-white hover:bg-[#1b18c2] shadow-[0_10px_25px_rgba(44,43,245,0.3)]'
                  : 'bg-[linear-gradient(135deg,#3d3aff_0%,#1b18c2_100%)] text-white hover:shadow-[0_18px_38px_-16px_rgba(44,43,245,0.9)]'
              )}
              aria-label={dictionary.free_consultation}
            >
              {dictionary.free_consultation}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
