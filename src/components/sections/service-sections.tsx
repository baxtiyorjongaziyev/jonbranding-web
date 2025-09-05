
import { FC, useCallback } from "react";
import dynamic from 'next/dynamic';
import { type Brand } from '@/lib/types';
import { staticBrands } from '@/lib/static-data';

const Gallery = dynamic(() => import('@/components/sections/gallery'));
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Video = dynamic(() => import('@/components/sections/video'));

const getBrands = async (): Promise<Brand[]> => {
    return staticBrands;
}

const ServiceSections = async () => {
    const brands = await getBrands();
    const handleOpenModal = () => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    };

    return (
        <>
            <Gallery onCtaClick={handleOpenModal} />
            <TrustedBy brands={brands} />
            <Video />
        </>
    );
};

export default ServiceSections;
