'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ArrowRight, CheckCircle, CaseUpper } from 'lucide-react';

const FeaturedCaseStudy = ({ lang, dictionary }: { lang: string, dictionary: any}) => {
    const caseData = {
        uz: {
            title: "Nega ba'zi brendlar qimmat sota oladi, sizniki esa yo'q?",
            description: "Javob oddiy: ular shunchaki mahsulot sotmaydi, ular **tajriba, obro' va ishonch** sotadi. Bularning barchasi kuchli brending orqali yaratiladi.",
            case_desc: "'Den Aroma' misolida biz oddiy atir do'konini premium boutique'ga aylantirdik. Natijada ular endi yuqori narxda sota oladi, 'qimmat' degan e'tirozlarsiz.",
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
            title: "Почему одни бренды могут продавать дорого, а ваш — нет?",
            description: "Ответ прост: они продают не просто продукт, они продают **опыт, репутацию и доверие**. Все это создается через сильный брендинг.",
            case_desc: "На примере 'Den Aroma' мы превратили обычный парфюмерный магазин в премиальный бутик. В результате они теперь могут продавать по высокой цене, без возражений 'дорого'.",
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
            title: "Why can some brands sell at a premium, but yours can't?",
            description: "The answer is simple: they don't just sell a product; they sell an **experience, reputation, and trust**. All of this is created through strong branding.",
            case_desc: "Using 'Den Aroma' as an example, we transformed an ordinary perfume shop into a premium boutique. As a result, they can now sell at a high price without 'it's expensive' objections.",
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
                <Card className="max-w-6xl mx-auto bg-dark-blue text-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="p-8 lg:p-12">
                            <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                                <CaseUpper className="w-5 h-5"/>
                                <span>Case Study: Den Aroma</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">{t.title}</h2>
                            <p className="mt-4 text-blue-200" dangerouslySetInnerHTML={{ __html: t.description }} />
                            <p className="mt-4 text-blue-200">{t.case_desc}</p>
                            
                            <Button onClick={handleCtaClick} className="mt-8 bg-white text-primary hover:bg-gray-200">
                                {t.ctaButton}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="relative w-full h-full min-h-[450px] p-4 lg:p-0">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                <iframe
                                    src={t.videoUrl}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                    className="w-full h-full aspect-video"
                                    title="Den Aroma Case Study Video"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default FeaturedCaseStudy;
