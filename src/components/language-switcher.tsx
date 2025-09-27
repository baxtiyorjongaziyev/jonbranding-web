
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, localeNames, setLocaleCookie } from '@/lib/i18n/locale';
import type { Locale } from '@/lib/i18n/locale';

interface LanguageSwitcherProps {
  lang: Locale;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    
    const currentPathWithoutLocale = pathname.replace(`/${lang}`, '');
    const newPath = `/${newLocale}${currentPathWithoutLocale || '/'}`;
    
    router.push(newPath);
    router.refresh(); 
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
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
          <Globe className="h-5 w-5" />
          <span className="hidden sm:inline">{localeNames[lang]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1" role="menu">
        {locales.map((locale) => (
          <Button
            key={locale}
            variant="ghost"
            role="menuitem"
            className={cn(
              "w-full justify-start",
              lang === locale ? "font-bold" : "font-normal"
            )}
            onClick={() => handleLanguageChange(locale)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                lang === locale ? "opacity-100" : "opacity-0"
              )}
            />
            {localeNames[locale]}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
