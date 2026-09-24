
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
        if (lang) {
            getDictionary(lang).then(dict => setTranslations(dict.urgencyBlock));
        }
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
                <Card className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-blue-50/70 p-8 text-center shadow-[0_24px_70px_rgba(37,99,235,0.12)] sm:p-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-blue/15 bg-brand-blue">
                        <Flame className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-brand-blue sm:text-2xl">
                        {translations.title}
                    </h2>
                    <p className="mt-4 text-2xl font-semibold leading-tight text-blue-950 sm:text-3xl">
                        {translations.subtitle}
                    </p>
                    <div className="mt-6 space-y-4 border-t border-blue-100 pt-6 text-lg text-slate-600">
                        <p>{translations.line1}</p>
                        <p>{translations.line2}</p>
                        <p className="font-bold text-blue-950">{translations.line3}</p>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default UrgencyBlock;
