
'use client';

import { FC, useCallback } from "react";
import dynamic from 'next/dynamic';
import CtaBlock from "./cta-block";

const Gallery = dynamic(() => import('@/components/sections/gallery'));
const TrustedBy = dynamic(() => import('@/components/sections/trusted-by'));
const Video = dynamic(() => import('@/components/sections/video'));

const ServiceSections: FC<{ lang: string }> = ({ lang }) => {
    
    const handleOpenModal = useCallback(() => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }, []);

    const t = {
        uz: {
            cta1_title: "Sizning brendingiz ham shunday ko'rinishga ega bo'lishi mumkin.",
            cta1_desc: "Professional dizayn orqali biznesingizni yangi cho'qqilarga olib chiqing. Biznesingiz uchun mos yechimni topishga yordam beramiz.",
            cta1_button: "Mening biznesim uchun ham",
            cta2_title: "Loyihangizni muhokama qilishga tayyormisiz?",
            cta2_desc: "Biznesingiz uchun qanday yechimlar taklif qila olishimizni bilish uchun bepul konsultatsiyaga yoziling.",
            cta2_button: "Bepul konsultatsiya olish"
        },
        ru: {
            cta1_title: "Ваш бренд может выглядеть так же.",
            cta1_desc: "Выведите свой бизнес на новый уровень с помощью профессионального дизайна. Мы поможем найти идеальное решение для вашего бизнеса.",
            cta1_button: "И для моего бизнеса тоже",
            cta2_title: "Готовы обсудить ваш проект?",
            cta2_desc: "Запишитесь на бесплатную консультацию, чтобы узнать, какие решения мы можем предложить для вашего бизнеса.",
            cta2_button: "Получить бесплатную консультацию"
        }
    }

    const translations = lang === 'ru' ? t.ru : t.uz;

    return (
        <>
            <Gallery lang={lang} />
            <Video />
            <CtaBlock 
                title={translations.cta1_title}
                description={translations.cta1_desc}
                buttonText={translations.cta1_button}
                onCtaClick={handleOpenModal}
            />
            <TrustedBy lang={lang} />
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
