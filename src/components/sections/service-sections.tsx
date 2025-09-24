
'use client';

import { FC, useCallback } from "react";
import dynamic from 'next/dynamic';
import { type Brand } from '@/lib/types';
import { staticBrands } from '@/lib/static-data';
import CtaBlock from "./cta-block";

const Gallery = dynamic(() => import('@/components/sections/gallery'));
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Video = dynamic(() => import('@/components/sections/video'));

const getBrands = (): Brand[] => {
    return staticBrands;
}

const ServiceSections = () => {
    const brands = getBrands();
    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    return (
        <>
            <Gallery onCtaClick={handleOpenModal} />
            <Video />
            <TrustedBy brands={brands} />
            <CtaBlock 
                title="Loyihangizni muhokama qilishga tayyormisiz?"
                description="Biznesingiz uchun qanday yechimlar taklif qila olishimizni bilish uchun bepul konsultatsiyaga yoziling."
                buttonText="Bepul konsultatsiya olish"
                onCtaClick={handleOpenModal}
            />
        </>
    );
};

export default ServiceSections;
