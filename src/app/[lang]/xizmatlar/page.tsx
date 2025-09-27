'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import PackageBuilder from '@/components/sections/package-builder';
import { Skeleton } from '@/components/ui/skeleton';
import Head from 'next/head';
import MobileCtaBar from '@/components/sections/mobile-cta-bar';
import { useParams } from 'next/navigation';


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

    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    return (
        <>
            <Head>
                <title>Xizmatlar va Narxlar | Jon.Branding</title>
                <meta name="description" content="Bizning barcha xizmatlarimiz bilan tanishing va o'zingizga mos bo'lgan brending to'plamini yarating. Onlayn kalkulyator yordamida narxlarni darhol hisoblang." />
            </Head>
            <main className="flex-grow">
                <PackageBuilder onOrderNow={handleOpenModal} lang={lang} />
                <Comparison onCtaClick={handleOpenModal} lang={lang} />
                <Offer onCTAClick={handleOpenServiceModal} lang={lang}/>
                <QueueStatus onCtaClick={handleOpenModal} lang={lang} />
            </main>
            <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} />
        </>
    );
};

function handleOpenServiceModal() {
    const servicesSection = document.getElementById('package-builder');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}


export default XizmatlarPage;
