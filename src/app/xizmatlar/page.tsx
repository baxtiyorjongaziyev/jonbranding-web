
'use client';

import { useCallback } from 'react';
import PackageBuilder from '@/components/sections/package-builder';

const XizmatlarPage = () => {
    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    return (
        <main className="flex-grow">
            <PackageBuilder onOrderNow={handleOpenModal} />
        </main>
    );
};

export default XizmatlarPage;
