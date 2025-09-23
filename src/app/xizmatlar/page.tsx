
'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import PackageBuilder from '@/components/sections/package-builder';
import { Skeleton } from '@/components/ui/skeleton';
import Head from 'next/head';


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
                <PackageBuilder onOrderNow={handleOpenModal} />
                <Comparison onCtaClick={handleOpenModal} />
                <Offer onCTAClick={handleOpenModal} />
                <QueueStatus onCtaClick={handleOpenModal} />
            </main>
        </>
    );
};

export default XizmatlarPage;
