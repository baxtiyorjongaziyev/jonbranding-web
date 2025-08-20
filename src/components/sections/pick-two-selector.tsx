
'use client';

import { useState, useEffect, useMemo, type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Lightbulb, CheckCircle } from 'lucide-react';

type OptionKey = 'cheap' | 'quality' | 'fast';

interface PickTwoSelectorProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const optionDetails: Record<OptionKey, { label: string }> = {
  cheap: { label: 'Arzon' },
  quality: { label: 'Sifatli' },
  fast: { label: 'Tez' },
};

const messages: Record<string, string> = {
  cheap_fast: 'Sifat barqaror bo‘lmasligi mumkin. Bu variant shoshilinch va byudjetli loyihalar uchun mos keladi.',
  cheap_quality: 'Muddat uzunroq bo‘lishi mumkin. Biz byudjetingizga moslashib, sifatni ta\'minlash uchun ko\'proq vaqt sarflaymiz.',
  quality_fast: 'Narx yuqoriroq bo‘lishi mumkin. A\'lo sifat va qisqa muddat uchun resurslarni safarbar qilish qo\'shimcha xarajat talab etadi.',
  default: 'Iltimos, o\'zingiz uchun eng muhim 2 ta ustuvorlikni tanlang.',
};

const PickTwoSelector: FC<PickTwoSelectorProps> = ({
  title = "Uchta ichidan ikkitani tanlang",
  subtitle = "Narx—Sifat—Tezlik: bir vaqtning o‘zida uchtalasi kamdan-kam to‘g‘ri keladi.",
  ctaText = "Taklif so‘rash",
  onCtaClick = () => {
    const el = document.getElementById('package-builder');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
}) => {
  const [selected, setSelected] = useState<OptionKey[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('pick2_pref');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelected(parsed);
        }
      } catch (e) {
        console.error("Failed to parse localStorage item 'pick2_pref'", e);
      }
    }
  }, []);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem('pick2_pref', JSON.stringify(selected));
    }
  }, [selected, isClient]);

  const handleSelect = (option: OptionKey) => {
    setSelected(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      }
      if (prev.length < 2) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const result = useMemo(() => {
    if (selected.length < 2) {
      return { key: 'default', message: messages.default };
    }
    const sorted = [...selected].sort().join('_') as keyof typeof messages;
    return { key: sorted, message: messages[sorted] };
  }, [selected]);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">{subtitle}</p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(Object.keys(optionDetails) as OptionKey[]).map(key => {
                const isSelected = selected.includes(key);
                const isDisabled = !isSelected && selected.length >= 2;

                const card = (
                  <Card
                    onClick={() => !isDisabled && handleSelect(key)}
                    className={cn(
                      "text-center p-8 rounded-2xl shadow-sm transition-all duration-300 relative cursor-pointer",
                      isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary-foreground/50 shadow-lg' : 'bg-secondary hover:bg-secondary/80',
                      isDisabled && 'opacity-50 cursor-not-allowed bg-gray-100'
                    )}
                  >
                     {isSelected && (
                        <div className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-1">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    )}
                    <CardContent className="p-0">
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
                        <p>Avval bitta tanlovni bekor qiling</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={key}>{card}</div>;
              })}
            </div>
          </TooltipProvider>

          <Card className="mt-8 bg-sky-blue/30 border-primary/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                <Lightbulb className="h-6 w-6" />
              </div>
              <p className="text-base text-dark-blue font-medium">{result.message}</p>
            </div>
          </Card>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="text-lg shadow-ocean animate-subtle-pulse"
              disabled={selected.length !== 2}
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickTwoSelector;
