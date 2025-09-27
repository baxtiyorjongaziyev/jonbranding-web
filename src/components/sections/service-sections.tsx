'use client';

import { FC, useCallback } from "react";
import dynamic from 'next/dynamic';
import CtaBlock from "./cta-block";
import { getDictionary, Locale } from "@/lib/dictionaries";

const Gallery = dynamic(() => import('@/components/sections/gallery'));
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Video = dynamic(() => import('@/components/sections/video'));

const ServiceSections: FC<{ lang: string }> = ({ lang }) => {
    
    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    const [dictionary, setDictionary] = React.useState<any>(null);

    React.useEffect(() => {
        getDictionary(lang as Locale).then(setDictionary);
    }, [lang]);

    if (!dictionary) {
        return null; // Or a loading skeleton
    }

    const translations = dictionary.serviceSections;

    return (
        <>
            <Gallery lang={lang} dictionary={dictionary.gallery} />
            <Video />
            <CtaBlock 
                title={translations.cta1_title}
                description={translations.cta1_desc}
                buttonText={translations.cta1_button}
                onCtaClick={handleOpenModal}
            />
            <TrustedBy lang={lang} dictionary={dictionary.trustedBy}/>
            <CtaBlock 
                title={translations.cta2_title}
                description={translations.cta2_desc}
                buttonText={translations.cta2_button}
                onCtaClick={handleOpenModal}
            />
        </>
    );
};

export default ServiceSections;
