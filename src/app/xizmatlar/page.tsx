
'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import PackageBuilder from '@/components/sections/package-builder';
import { Skeleton } from '@/components/ui/skeleton';

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
        <main className="flex-grow">
            <PackageBuilder onOrderNow={handleOpenModal} />
            <Comparison onCtaClick={handleOpenModal} />
            <Offer onCTAClick={handleOpenModal} />
            <QueueStatus onCtaClick={handleOpenModal} />
        </main>
    );
};

export default XizmatlarPage;
