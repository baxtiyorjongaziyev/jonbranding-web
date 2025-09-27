
'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PackageBuilder from '@/components/sections/package-builder';
import { Skeleton } from '@/components/ui/skeleton';
import Head from 'next/head';
import MobileCtaBar from '@/components/sections/mobile-cta-bar';
import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';


const Comparison = dynamic(() => import('@/components/sections/comparison'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});
const Offer = dynamic(() => import('@/components/sections/offer'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const XizmatlarPage = () => {
    const params = useParams();
    const lang = params.lang as string;
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        if (lang) {
            getDictionary(lang as Locale).then(setDictionary);
        }
    }, [lang]);

    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    const handleOpenServiceModal = useCallback(() => {
        const servicesSection = document.getElementById('package-builder');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    if (!dictionary || !lang) {
        return <main className="flex-grow"><Skeleton className="h-screen w-full" /></main>
    }

    return (
        <>
            <Head>
                <title>{dictionary.servicesPage.title}</title>
                <meta name="description" content={dictionary.servicesPage.subtitle} />
            </Head>
            <main className="flex-grow">
                <PackageBuilder onOrderNow={handleOpenModal} lang={lang} dictionary={dictionary.packageBuilder} />
                <Comparison onCtaClick={handleOpenModal} lang={lang} />
                <Offer onCTAClick={handleOpenServiceModal} lang={lang} dictionary={dictionary.offer} />
                <QueueStatus onCtaClick={handleOpenModal} />
            </main>
            <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />
        </>
    );
};

export default XizmatlarPage;
