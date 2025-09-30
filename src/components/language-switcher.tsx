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
import { ChevronsUpDown } from 'lucide-react';

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
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
                "w-auto justify-start gap-2 font-semibold",
                scrolled ? "bg-white/20 hover:bg-white/30 text-foreground" : "bg-black/5 hover:bg-black/10 text-foreground"
            )}
          >
            <CurrentLangIcon />
            <span className="hidden sm:inline">{localeNames[lang]}</span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 border-border/20 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col">
          {locales.map((locale) => {
            const Icon = localeIcons[locale];
            return (
              <Button
                  key={locale}
                  variant="ghost"
                  className={cn(
                    "justify-start gap-2 font-normal",
                    lang === locale ? "bg-accent/80 text-accent-foreground" : "hover:bg-secondary"
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
