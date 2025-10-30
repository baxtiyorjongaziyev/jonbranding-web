
'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import CtaBlock from '@/components/sections/cta-block';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChecklistItem: FC<{
  item: { title: string; description: string; solution: string };
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ item, isChecked, onCheckedChange }) => {
  return (
    <Card className={cn("transition-all duration-300", isChecked ? 'bg-green-50 border-green-200' : 'bg-white')}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Checkbox
            id={item.title}
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            className="w-6 h-6 mt-1"
          />
          <div className="flex-1">
            <label htmlFor={item.title} className="text-lg font-bold text-dark-blue cursor-pointer">
              {item.title}
            </label>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <blockquote className="mt-3 border-l-4 border-green-500 pl-4 text-green-800 bg-green-50 p-2 rounded-r-lg">
              {item.solution}
            </blockquote>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const ChecklistPage: FC = () => {
  const [translations, setTranslations] = useState<any>(null);
  const params = useParams();
  const lang = params.lang as string;
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getDictionary(lang as Locale).then(dict => {
        setTranslations(dict.leadMagnet);
    });
  }, [lang]);

  const handleCheckedChange = (title: string, checked: boolean) => {
    setCheckedState(prev => ({ ...prev, [title]: checked }));
  };

  const handleOpenContact = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  };
  
  const checklistItems = translations?.checklistContent.items || [];
  
  const checkedCount = useMemo(() => Object.values(checkedState).filter(Boolean).length, [checkedState]);
  const progressPercentage = checklistItems.length > 0 ? (checkedCount / checklistItems.length) * 100 : 0;
  
  const result = useMemo(() => {
    if (!translations) return null;

    if (progressPercentage < 50) {
      return {
        Icon: ThumbsDown,
        title: translations.checklistContent.result.bad.title,
        description: translations.checklistContent.result.bad.description,
        color: 'text-red-500',
        bgColor: 'bg-red-50'
      };
    } else if (progressPercentage < 100) {
      return {
        Icon: ThumbsUp,
        title: translations.checklistContent.result.good.title,
        description: translations.checklistContent.result.good.description,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50'
      };
    } else {
      return {
        Icon: PartyPopper,
        title: translations.checklistContent.result.perfect.title,
        description: translations.checklistContent.result.perfect.description,
        color: 'text-green-500',
        bgColor: 'bg-green-50'
      };
    }
  }, [progressPercentage, translations]);


  if (!translations) {
    return <main className="flex-grow pt-20"><Skeleton className="w-full h-screen" /></main>;
  }

  const checklistData = translations.magnets.find((m: any) => m.id === 'pdf');

  return (
    <main className="flex-grow bg-white pt-20">
      <header className="py-16 sm:py-24 bg-secondary/70">
        <div className="container mx-auto px-4 text-center">
            {checklistData && (
                <>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-blue leading-tight">
                        {checklistData.title}
                    </h1>
                    <p className="mt-6 text-lg text-primary font-bold">
                        {checklistData.subtitle}
                    </p>
                </>
            )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
            <div className="sticky top-20 z-10 py-4 bg-white/80 backdrop-blur-sm mb-8">
                 <p className="text-center text-muted-foreground mb-2">{translations.checklistContent.progress_text.replace('{checkedCount}', checkedCount).replace('{total}', checklistItems.length)}</p>
                <Progress value={progressPercentage} />
            </div>

            <div className="space-y-6">
                {checklistItems.map((item: any, index: number) => (
                    <ChecklistItem 
                        key={index}
                        item={item}
                        isChecked={!!checkedState[item.title]}
                        onCheckedChange={(checked) => handleCheckedChange(item.title, !!checked)}
                    />
                ))}
            </div>

            {progressPercentage > 0 && result && (
                 <Card className={cn("mt-12 p-8 text-center transition-all duration-500", result.bgColor)}>
                    <result.Icon className={cn("w-16 h-16 mx-auto mb-4", result.color)} />
                    <h3 className="text-2xl font-bold text-dark-blue">{result.title}</h3>
                    <p className="text-gray-700 mt-2">{result.description}</p>
                 </Card>
            )}
        </div>
      </div>
      
       <CtaBlock 
            title={translations.cta.title}
            description={translations.cta.description}
            buttonText={translations.cta.button}
            onCtaClick={handleOpenContact}
        />
    </main>
  );
};

export default ChecklistPage;
