
'use client';

import { FC, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { Logo } from '../icons/logo';
import { Button } from '../ui/button';

interface PersonalOfferBlockProps {
    onCtaClick: () => void;
}

const PersonalOfferBlock: FC<PersonalOfferBlockProps> = ({ onCtaClick }) => {
    const params = useParams();
    const lang = params.lang as Locale;
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        if (lang) {
            getDictionary(lang).then(dict => setTranslations(dict.personalOfferBlock));
        }
    }, [lang]);

    if (!translations) {
        return (
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-96 w-full" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto bg-dark-blue text-white rounded-[2.5rem] shadow-2xl p-8 sm:p-14 text-center relative overflow-hidden border-none">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
                        <Logo isWhite={true} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                           {translations.title}
                        </h2>
                        <p className="mt-4 text-xl text-blue-200 font-medium opacity-90">{translations.subtitle}</p>
                        
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {translations.sections.map((section: any, index: number) => (
                                <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                                    <h3 className="font-black text-sm text-sky-blue mb-3 uppercase tracking-widest">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.points.map((point: string, pIndex: number) => (
                                            <li key={pIndex} className="flex items-start gap-2.5 text-sm text-blue-100 font-medium leading-tight">
                                                <div className="mt-1 shrink-0 bg-sky-blue/20 rounded-full p-0.5">
                                                    <ArrowRight className="h-3 w-3 text-sky-blue" />
                                                </div>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                             <Button
                                variant="default"
                                size="lg"
                                onClick={onCtaClick}
                                className="px-10 py-6 text-lg shadow-xl rounded-full"
                                >
                                {translations.ctaButton}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PersonalOfferBlock;
