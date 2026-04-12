
'use client';

import { useState, useEffect, useMemo, type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Lightbulb, CheckCircle, Gem, Rocket, Tags, type LucideIcon } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';

type OptionKey = 'cheap' | 'quality' | 'fast';

interface PickTwoSelectorProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary?: any;
}

const PickTwoSelector: FC<PickTwoSelectorProps> = ({
  onCtaClick,
  lang,
  dictionary: initialDictionary,
}) => {
  const [selected, setSelected] = useState<OptionKey[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [translations, setTranslations] = useState<any>(initialDictionary || null);

  useEffect(() => {
    if (!initialDictionary) {
      getDictionary(lang as Locale).then(dict => setTranslations(dict.pickTwoSelector));
    } else {
      setTranslations(initialDictionary);
    }
  }, [lang, initialDictionary]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const stored = localStorage.getItem('pick2_pref');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length <= 2) {
            setSelected(parsed);
          }
        } catch (e) {
          console.error("Failed to parse localStorage item 'pick2_pref'", e);
        }
      }
    }
  }, [isClient]);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem('pick2_pref', JSON.stringify(selected));
    }
  }, [selected, isClient]);

  const result = useMemo(() => {
    if (!translations) {
      return { key: 'default', message: translations?.loading || '...' };
    }
    const messages = translations.messages;
    if (selected.length < 2) {
      return { key: 'default', message: messages.default };
    }
    const sorted = [...selected].sort().join('_') as keyof typeof messages;
    return { key: sorted, message: messages[sorted] || messages.default };
  }, [selected, translations]);

  if (!translations) {
    return <section className="py-16 sm:py-24 bg-white"><div className="container">{translations?.loading || '...'}</div></section>;
  }

  const optionDetails: Record<OptionKey, { label: string, icon: LucideIcon }> = {
    cheap: { label: translations.options.cheap, icon: Tags },
    quality: { label: translations.options.quality, icon: Gem },
    fast: { label: translations.options.fast, icon: Rocket },
  };

  const messages = translations.messages;
  
  const handleSelect = (option: OptionKey) => {
    setSelected(prev => {
      const newSelection = prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option];
      
      return newSelection.length > 2 ? prev : newSelection;
    });
  };
  
  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
        const el = document.getElementById('package-builder');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">{translations.subtitle}</p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(Object.keys(optionDetails) as OptionKey[]).map(key => {
                const isSelected = selected.includes(key);
                const isDisabled = !isSelected && selected.length >= 2;
                const Icon = optionDetails[key].icon;

                const card = (
                  <Card
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-pressed={isSelected}
                    aria-label={`${optionDetails[key].label}${isDisabled ? ' (limit reached)' : ''}`}
                    onKeyDown={(e) => {
                      if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSelect(key);
                      }
                    }}
                    onClick={() => !isDisabled && handleSelect(key)}
                    className={cn(
                      "text-center p-8 rounded-2xl shadow-sm transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 outline-none focus:ring-2 focus:ring-primary/40",
                      isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary/50 shadow-lg' : 'bg-secondary hover:shadow-md',
                      isDisabled && 'opacity-50 cursor-not-allowed bg-gray-100 hover:translate-y-0 focus:ring-0'
                    )}
                  >
                     {isSelected && (
                        <div className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-1" aria-hidden="true">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    )}
                    <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                       <Icon className="w-12 h-12" aria-hidden="true" />
                      <p className="text-2xl font-bold">{optionDetails[key].label}</p>
                    </CardContent>
                  </Card>
                );

                if (isDisabled) {
                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <div>{card}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{translations.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={key}>{card}</div>;
              })}
            </div>
          </TooltipProvider>

          <Card className="mt-8 bg-sky-blue/30 border-primary/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full mt-1">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base text-dark-blue font-medium">{result.message}</p>
              </div>
            </div>
          </Card>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="text-lg shadow-ocean animate-subtle-pulse disabled:shadow-none disabled:animate-none"
              disabled={selected.length !== 2}
              onClick={handleCta}
            >
              {translations.ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickTwoSelector;
