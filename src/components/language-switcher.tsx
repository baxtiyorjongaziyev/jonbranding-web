
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { locales, localeNames, setLocaleCookie } from '@/lib/i18n/locale';
import type { Locale } from '@/lib/i18n/locale';
import { UzFlagIcon } from './icons/uz-flag';
import { RuFlagIcon } from './icons/ru-flag';
import { GbFlagIcon } from './icons/gb-flag';
import { CnFlagIcon } from './icons/cn-flag';
import { ChevronsUpDown } from 'lucide-react';

const useHover = () => {
  const [open, setOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  }, []);

  const handleContentMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { open, handleOpen, handleClose, handleContentMouseEnter, setOpen };
};

const localeIcons: Record<Locale, React.FC<{ className?: string }>> = {
  uz: UzFlagIcon,
  ru: RuFlagIcon,
  en: GbFlagIcon,
  zh: CnFlagIcon,
};

interface LanguageSwitcherProps {
  lang: Locale;
  isInverted?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, isInverted = false }) => {
  const { open, handleOpen, handleClose, handleContentMouseEnter, setOpen } = useHover();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    const currentPathWithoutLocale = pathname.startsWith(`/${lang}/`) 
      ? pathname.substring(`/${lang}`.length) 
      : (pathname === `/${lang}` ? '/' : pathname);
    
    // For Uzbek, we want prefix-less root
    const newPath = newLocale === 'uz' 
      ? (currentPathWithoutLocale || '/')
      : `/${newLocale}${currentPathWithoutLocale === '/' ? '' : currentPathWithoutLocale}`;
      
    router.push(newPath || '/');
    setOpen(false);
  };
  
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const CurrentLangIcon = localeIcons[lang];
  const useInvertedTone = isInverted && !scrolled;
  const triggerTone = useInvertedTone
    ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
    : scrolled
      ? "bg-white/20 text-foreground hover:bg-white/30"
      : "bg-black/5 text-foreground hover:bg-black/10";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className={cn(
            "w-auto justify-start gap-2 font-semibold !ring-0 !ring-offset-0 !outline-none !shadow-none rounded-full",
            triggerTone
        )}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        <UzFlagIcon />
        <span className="hidden sm:inline">O‘zbekcha</span>
        <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Tilni o'zgartirish / Change language"
            className={cn(
                "w-auto justify-start gap-2 font-semibold !ring-0 !ring-offset-0 !outline-none !shadow-none focus:!ring-0 focus-visible:!ring-0 focus:!outline-none focus-visible:!outline-none focus-visible:!ring-offset-0 rounded-full",
                triggerTone
            )}
            style={{ border: 'none', boxShadow: 'none' }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            <CurrentLangIcon />
            <span className="hidden sm:inline">{localeNames[lang]}</span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-auto p-1 border-border/20 bg-background/80 backdrop-blur-md"
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleClose}
        align="end"
      >
          {locales
            .filter((locale) => locale !== lang)
            .map((locale) => {
            const Icon = localeIcons[locale];
            return (
              <DropdownMenuItem
                  key={locale}
                  className={cn(
                    "justify-start gap-2 font-normal cursor-pointer",
                    "hover:bg-secondary"
                  )}
                  onClick={() => handleLanguageChange(locale)}
              >
                  <Icon />
                  {localeNames[locale]}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
