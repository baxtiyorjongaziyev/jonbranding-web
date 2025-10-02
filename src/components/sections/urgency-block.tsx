'use client';

import { FC, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

const UrgencyBlock: FC = () => {
    const params = useParams();
    const lang = params.lang as Locale;
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang).then(dict => setTranslations(dict.urgencyBlock));
    }, [lang]);

    if (!translations) {
        return (
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-64 w-full" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <Card className="max-w-3xl mx-auto bg-gradient-to-br from-amber-500 to-red-600 text-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-6 border-2 border-white/30">
                        <Flame className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-amber-200">
                        {translations.title}
                    </h2>
                    <p className="mt-4 text-2xl sm:text-3xl font-semibold leading-tight">
                        {translations.subtitle}
                    </p>
                    <div className="mt-6 border-t border-white/20 pt-6 space-y-4 text-lg text-amber-100">
                        <p>{translations.line1}</p>
                        <p>{translations.line2}</p>
                        <p className="font-bold text-white">{translations.line3}</p>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default UrgencyBlock;
