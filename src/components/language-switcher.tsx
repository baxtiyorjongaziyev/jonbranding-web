'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { locales, localeNames, setLocaleCookie } from '@/lib/i18n/locale';
import type { Locale } from '@/lib/i18n/locale';
import { UzFlagIcon } from './icons/uz-flag';
import { RuFlagIcon } from './icons/ru-flag';
import { GbFlagIcon } from './icons/gb-flag';

const localeIcons: Record<Locale, React.FC<{ className?: string }>> = {
  uz: UzFlagIcon,
  ru: RuFlagIcon,
  en: GbFlagIcon,
};

interface LanguageSwitcherProps {
  lang: Locale;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    
    const currentPathWithoutLocale = pathname.startsWith(`/${lang}`) ? pathname.substring(`/${lang}`.length) : pathname;
    const newPath = `/${newLocale}${currentPathWithoutLocale || '/'}`;
    
    router.push(newPath);
    setOpen(false);
  };
  
  const [scrolled, setScrolled] = useState(false);
   useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const CurrentLangIcon = localeIcons[lang];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="menu"
            className={cn(
                "w-auto justify-start gap-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                scrolled ? "bg-white/20 hover:bg-white/30" : "bg-black/5 hover:bg-black/10"
                )}
            >
            <CurrentLangIcon />
            <span className="hidden sm:inline">{localeNames[lang]}</span>
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 border-0" role="menu" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <div className="flex flex-col">
          {locales.map((locale) => {
            if (locale === lang) return null; // Don't show current language
            const Icon = localeIcons[locale];
            return (
              <Button
                  key={locale}
                  variant="ghost"
                  role="menuitem"
                  className={cn(
                  "justify-start gap-2 font-normal border-0 hover:bg-secondary focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                  onClick={() => handleLanguageChange(locale)}
              >
                  <Icon />
                  {localeNames[locale]}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
