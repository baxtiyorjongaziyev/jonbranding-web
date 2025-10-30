
'use client';

import { FC, useState, useEffect } from 'react';
import { marked } from 'marked';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import CtaBlock from '@/components/sections/cta-block';

const ChecklistPage: FC = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<any>(null);
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    setIsLoading(true);
    getDictionary(lang as Locale).then(dict => {
        setTranslations(dict.leadMagnet);
    });

    const filePath = `/checklists/7-mistakes-in-branding-${lang}.md`;
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
             const cleanText = text.replace(/---[\s\S]*?---/, '');
             const htmlContent = marked(cleanText);
             setContent(htmlContent);
        })
        .catch(error => {
            console.error('Error fetching checklist:', error);
            setContent(`<p>Error loading content.</p>`);
        })
        .finally(() => {
            setIsLoading(false);
        });
  }, [lang]);

  const handleOpenContact = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  };
  
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
        <div className="max-w-3xl mx-auto prose lg:prose-xl">
           {isLoading ? (
              <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-8 w-1/2 mt-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
              </div>
          ) : (
              <div dangerouslySetInnerHTML={{ __html: content }} />
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
