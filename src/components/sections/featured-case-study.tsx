'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, CaseUpper } from 'lucide-react';

const FeaturedCaseStudy = ({ lang, dictionary }: { lang: string, dictionary: any}) => {
    const caseData = {
        uz: {
            title: "Premium brend = Premium narx",
            description: "Mahsulot yoki xizmatingizni premium narxda sotmoqchimisiz? Unda hamma narsa premium bo'lishi kerak. Brend nomingizdan tortib, logotipingizgacha, mebeldan tortib xizmat ko'rsatishgacha, qadoq dizaynlaridan paket dizaynlarigacha — hamma narsasi. Biz Den Aroma brendiga nom tanlash, logotip, firma uslubi va brendbuklarini ishlab chiqishda yordam berdik. Natijada o'rta chek oshdi, 'qimmat' degan e'tirozlar kamaydi va mijozlarda brendga nisbatan ishonch ortdi.",
            buttonText: "Batafsil ma'lumot",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
        },
        ru: {
            title: "Премиум бренд = Премиум цена",
            description: "Хотите продавать свой продукт или услугу по премиальной цене? Тогда все должно быть премиальным. От названия вашего бренда до логотипа, от мебели до обслуживания, от дизайна упаковки до пакетов — все. Мы помогли бренду Den Aroma с выбором названия, разработкой логотипа, фирменного стиля и брендбука. В результате средний чек вырос, возражения 'дорого' уменьшились, а доверие клиентов к бренду возросло.",
            buttonText: "Подробнее",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
        },
        en: {
            title: "Premium Brand = Premium Price",
            description: "Want to sell your product or service at a premium price? Then everything has to be premium. From your brand name to your logo, from furniture to service, from packaging design to bags. We helped the Den Aroma brand with naming, logo design, corporate identity, and brandbooks. As a result, the average check increased, 'it's expensive' objections decreased, and customer trust in the brand grew.",
            buttonText: "Learn More",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
        }
    };
    const t = caseData[lang as keyof typeof caseData] || caseData.uz;
    
    const handleCtaClick = () => {
        const event = new CustomEvent('openContactModal');
        window.dispatchEvent(event);
    }

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <Card className="max-w-5xl mx-auto bg-gradient-to-br from-dark-blue to-blue-950 text-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-1">
                         <div className="relative min-h-[300px] lg:min-h-0 w-full aspect-video">
                             <iframe
                                src={t.videoUrl}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                className="absolute inset-0 w-full h-full"
                                title="Den Aroma Case Study Video"
                            ></iframe>
                        </div>
                        <div className="p-8 sm:p-12 flex flex-col justify-center text-center">
                            <CardHeader className="p-0 mb-4">
                                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                                    <CaseUpper className="w-5 h-5"/>
                                    <span>Case Study</span>
                                </div>
                                <CardTitle className="text-3xl font-extrabold text-white">{t.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-blue-200 max-w-3xl mx-auto">{t.description}</p>
                                <Button onClick={handleCtaClick} className="mt-6 bg-white text-primary hover:bg-gray-200">
                                    {t.buttonText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default FeaturedCaseStudy;
