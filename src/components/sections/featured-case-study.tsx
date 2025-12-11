'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, CaseUpper, CheckCircle } from 'lucide-react';

const FeaturedCaseStudy = ({ lang, dictionary }: { lang: string, dictionary: any}) => {
    const caseData = {
        uz: {
            title: "Premium brend = Premium narx",
            description: "Mahsulot yoki xizmatingizni premium narxda sotmoqchimisiz? Unda hamma narsa premium bo'lishi kerak. Brend nomingizdan tortib, logotipingizgacha, mebeldan tortib xizmat ko'rsatishgacha, qadoq dizaynlaridan paket dizaynlarigacha — hamma narsasi. Biz Den Aroma brendiga nom tanlash, logotip, firma uslubi va brendbuklarini ishlab chiqishda yordam berdik. Natijada o'rta chek oshdi, 'qimmat' degan e'tirozlar kamaydi va mijozlarda brendga nisbatan ishonch ortdi.",
            buttonText: "Batafsil ma'lumot",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1",
            ctaButton: "Mening brendim uchun ham",
            results: [
                "O'rtacha chekning 60% ga oshishi",
                "“Qimmat” e'tirozlarining keskin kamayishi",
                "Mijozlar ishonchining ortishi"
            ]
        },
        ru: {
            title: "Премиум бренд = Премиум цена",
            description: "Хотите продавать свой продукт или услугу по премиальной цене? Тогда все должно быть премиальным. От названия вашего бренда до логотипа, от мебели до обслуживания, от дизайна упаковки до пакетов — все. Мы помогли бренду Den Aroma с выбором названия, разработкой логотипа, фирменного стиля и брендбука. В результате средний чек вырос, возражения 'дорого' уменьшились, а доверие клиентов к бренду возросло.",
            buttonText: "Подробнее",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1",
            ctaButton: "И для моего бренда",
            results: [
                "Увеличение среднего чека на 60%",
                "Резкое снижение возражений «дорого»",
                "Рост доверия клиентов к бренду"
            ]
        },
        en: {
            title: "Premium Brand = Premium Price",
            description: "Want to sell your product or service at a premium price? Then everything has to be premium. From your brand name to your logo, from furniture to service, from packaging design to bags. We helped the Den Aroma brand with naming, logo design, corporate identity, and brandbooks. As a result, the average check increased, 'it's expensive' objections decreased, and customer trust in the brand grew.",
            buttonText: "Learn More",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1",
            ctaButton: "For my brand too",
            results: [
                "60% increase in average check",
                "Drastic reduction in 'it's expensive' objections",
                "Increased customer trust in the brand"
            ]
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
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-dark-blue text-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-0">
                    <div className="lg:p-12">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                            <CaseUpper className="w-5 h-5"/>
                            <span>Case Study: Den Aroma</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white">{t.title}</h2>
                        <p className="mt-4 text-blue-200">{t.description}</p>
                        
                        <div className="mt-6 space-y-3">
                            {t.results.map((result, index) => (
                                <div key={index} className="flex items-center gap-3 text-green-300">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{result}</span>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleCtaClick} className="mt-8 bg-white text-primary hover:bg-gray-200">
                            {t.ctaButton}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative w-full aspect-w-9 aspect-h-16 lg:aspect-none lg:h-full min-h-[400px] lg:min-h-[500px]">
                        <iframe
                            src={t.videoUrl}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                            className="absolute inset-0 w-full h-full lg:rounded-r-3xl"
                            title="Den Aroma Case Study Video"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturedCaseStudy;
