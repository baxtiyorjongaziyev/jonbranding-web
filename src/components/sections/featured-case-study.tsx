
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, CaseUpper } from 'lucide-react';

const FeaturedCaseStudy = ({ lang, dictionary }: { lang: string, dictionary: any}) => {
    const caseData = {
        uz: {
            title: "Noldan mashhurlikkacha: Den Aroma",
            description: "'3 atirchi'dan premium brendga aylanish hikoyasi. Qanday qilib to'g'ri rebranding o'rtacha chekni 60%ga oshirdi va mijozlar e'tirozlarini keskin kamaytirdi.",
            buttonText: "Keys-stadini to'liq o'qish",
            videoUrl: "https://player.vimeo.com/video/1141138719?h=fdc64d08aa&autoplay=1&muted=1&loop=1&background=1"
        },
        ru: {
            title: "С нуля до популярности: Den Aroma",
            description: "История превращения из '3 парфюмеров' в премиум-бренд. Как правильный ребрендинг увеличил средний чек на 60% и резко сократил возражения клиентов.",
            buttonText: "Читать кейс-стади полностью",
            videoUrl: "https://player.vimeo.com/video/1141138719?h=fdc64d08aa&autoplay=1&muted=1&loop=1&background=1"
        },
        en: {
            title: "From Zero to Hero: Den Aroma",
            description: "The story of transformation from '3 perfumers' to a premium brand. How proper rebranding increased the average check by 60% and drastically reduced customer objections.",
            buttonText: "Read the full case study",
            videoUrl: "https://player.vimeo.com/video/1141138719?h=fdc64d08aa&autoplay=1&muted=1&loop=1&background=1"
        }
    };
    const t = caseData[lang as keyof typeof caseData] || caseData.uz;

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <Card className="max-w-5xl mx-auto bg-gradient-to-br from-dark-blue to-blue-950 text-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 sm:p-12 flex flex-col justify-center">
                            <CardHeader className="p-0 mb-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                                    <CaseUpper className="w-5 h-5"/>
                                    <span>Case Study</span>
                                </div>
                                <CardTitle className="text-3xl font-extrabold text-white">{t.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-blue-200">{t.description}</p>
                                <Button asChild className="mt-6 bg-white text-primary hover:bg-gray-200">
                                    <Link href={`/${lang}/blog/den-aroma-case-study`}>
                                        {t.buttonText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </div>
                        <div className="relative min-h-[300px] lg:min-h-full">
                             <iframe
                                src={t.videoUrl}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                className="absolute inset-0 w-full h-full"
                                title="Den Aroma Case Study Video"
                            ></iframe>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default FeaturedCaseStudy;
