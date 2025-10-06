
'use client';

import { FC, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
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
                <Card className="max-w-3xl mx-auto bg-dark-blue text-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
                        <Logo isWhite={true} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                           {translations.title}
                        </h2>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-left max-w-lg mx-auto">
                            {translations.points.map((point: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-lg text-blue-100">{point}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-2xl text-blue-200">
                           {translations.price}
                        </p>
                        <div className="mt-8">
                             <Button
                                size="lg"
                                onClick={onCtaClick}
                                className="bg-white text-primary hover:bg-gray-200 shadow-lg transform hover:scale-105 transition-transform text-lg px-8 py-6"
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
