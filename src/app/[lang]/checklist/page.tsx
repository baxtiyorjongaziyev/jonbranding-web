
'use client';

import { FC, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import CtaBlock from '@/components/sections/cta-block';

const ChecklistContent = ({ lang, translations }: { lang: string, translations: any }) => {
    const content = translations.checklistContent;

    if (!content) return null;

    return (
        <div className="prose lg:prose-xl max-w-none">
            <p className="lead">{content.intro}</p>

            <h2>{content.mistake1.title}</h2>
            <p>{content.mistake1.description}</p>
            <blockquote>{content.mistake1.solution}</blockquote>

            <h2>{content.mistake2.title}</h2>
            <p>{content.mistake2.description}</p>
            <blockquote>{content.mistake2.solution}</blockquote>

            <h2>{content.mistake3.title}</h2>
            <p>{content.mistake3.description}</p>
            <blockquote>{content.mistake3.solution}</blockquote>

            <h2>{content.mistake4.title}</h2>
            <p>{content.mistake4.description}</p>
            <blockquote>{content.mistake4.solution}</blockquote>

            <h2>{content.mistake5.title}</h2>
            <p>{content.mistake5.description}</p>
            <blockquote>{content.mistake5.solution}</blockquote>

            <h2>{content.mistake6.title}</h2>
            <p>{content.mistake6.description}</p>
            <blockquote>{content.mistake6.solution}</blockquote>

            <h2>{content.mistake7.title}</h2>
            <p>{content.mistake7.description}</p>
            <blockquote>{content.mistake7.solution}</blockquote>
            
            <hr />

            <h3>{content.conclusion_title}</h3>
            <p>{content.conclusion_text}</p>
        </div>
    );
};


const ChecklistPage: FC = () => {
  const [translations, setTranslations] = useState<any>(null);
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    getDictionary(lang as Locale).then(dict => {
        setTranslations(dict.leadMagnet);
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
        <div className="max-w-3xl mx-auto">
           <ChecklistContent lang={lang} translations={translations} />
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
