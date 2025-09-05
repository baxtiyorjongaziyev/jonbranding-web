
'use client';

import { useCallback } from 'react';
import PackageBuilder from '@/components/sections/package-builder';
import Comparison from '@/components/sections/comparison';

const XizmatlarPage = () => {
    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    return (
        <main className="flex-grow">
            <PackageBuilder onOrderNow={handleOpenModal} />
            <Comparison onCtaClick={handleOpenModal} />
        </main>
    );
};

export default XizmatlarPage;
