
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

    const cleanTitle = String(translations.title || '').replace(/^💎\s*/, '');

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <Card className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-blue-900/40 bg-[linear-gradient(145deg,#050583_0%,#09113f_58%,#111a52_100%)] p-8 text-center text-white shadow-2xl sm:p-14">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
                        <Logo isWhite={true} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                           {cleanTitle}
                        </h2>
                        <p className="mt-4 text-xl text-blue-200 font-medium opacity-90">{translations.subtitle}</p>
                        
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {translations.sections.map((section: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-inner backdrop-blur-sm">
                                    <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-sky-blue">
                                      <span className="mr-2 text-white/55">0{index + 1}</span>
                                      {String(section.title).replace(/^[1-9]️⃣\s*/, '')}
                                    </h3>
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
