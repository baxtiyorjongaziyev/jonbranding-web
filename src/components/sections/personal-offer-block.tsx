
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
                <Card className="max-w-4xl mx-auto bg-dark-blue text-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
                        <Logo isWhite={true} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                           {translations.title}
                        </h2>
                        <p className="mt-2 text-xl text-blue-200">{translations.subtitle}</p>
                        
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {translations.sections.map((section: any, index: number) => (
                                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h3 className="font-bold text-base text-accent mb-2">{section.title}</h3>
                                    <ul className="space-y-1">
                                        {section.points.map((point: string, pIndex: number) => (
                                            <li key={pIndex} className="flex items-start gap-2 text-sm text-blue-100">
                                                <ArrowRight className="h-4 w-4 text-green-400 flex-shrink-0 mt-1" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                             <Button
                                variant="outline"
                                size="lg"
                                onClick={onCtaClick}
                                className="bg-white text-dark-blue hover:bg-slate-100 border-none shadow-xl transform hover:scale-105 transition-all text-lg px-10 py-6 font-bold rounded-full"
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
