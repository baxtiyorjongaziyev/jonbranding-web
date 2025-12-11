
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const FeaturedCaseStudy = ({ lang, dictionary }: { lang: string, dictionary: any}) => {
    const caseData = {
        uz: {
            title: "Nega ba'zi brendlar qimmat sota oladi, sizniki esa yo'q?",
            description: "Javob oddiy: ular shunchaki mahsulot sotmaydi, ular <strong>tajriba, obro' va ishonch</strong> sotadi. Bularning barchasi kuchli brending orqali yaratiladi.",
            case_desc: "'Den Aroma' misolida biz oddiy atir do'konini premium boutique'ga aylantirdik. Natijada ular endi yuqori narxda sota oladi, 'qimmat' degan e'tirozlarsiz.",
            buttonText: "Batafsil ma'lumot",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479",
            ctaButton: "Mening brendim uchun ham",
            results: [
                "O'rtacha chekning 60% ga oshishi",
                "“Qimmat” e'tirozlarining keskin kamayishi",
                "Mijozlar ishonchining ortishi"
            ]
        },
        ru: {
            title: "Почему одни бренды могут продавать дорого, а ваш — нет?",
            description: "Ответ прост: они продают не просто продукт, они продают <strong>опыт, репутацию и доверие</strong>. Все это создается через сильный брендинг.",
            case_desc: "На примере 'Den Aroma' мы превратили обычный парфюмерный магазин в премиальный бутик. В результате они теперь могут продавать по высокой цене, без возражений 'дорого'.",
            buttonText: "Подробнее",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479",
            ctaButton: "И для моего бренда",
            results: [
                "Увеличение среднего чека на 60%",
                "Резкое снижение возражений «дорого»",
                "Рост доверия клиентов к бренду"
            ]
        },
        en: {
            title: "Why can some brands sell at a premium, but yours can't?",
            description: "The answer is simple: they don't just sell a product; they sell an <strong>experience, reputation, and trust</strong>. All of this is created through strong branding.",
            case_desc: "Using 'Den Aroma' as an example, we transformed an ordinary perfume shop into a premium boutique. As a result, they can now sell at a high price without 'it's expensive' objections.",
            buttonText: "Learn More",
            videoUrl: "https://player.vimeo.com/video/1145610708?badge=0&autopause=0&player_id=0&app_id=58479",
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
                <Card className="max-w-4xl mx-auto bg-dark-blue text-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                               <img src="https://img3.teletype.in/files/e2/90/e290fd28-87f2-4175-bc39-f15f945ac215.png" alt="Den Aroma Logo" className="h-6 w-auto" />
                               <span className="border-l border-accent/50 pl-3">Case Study</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">{t.title}</h2>
                            <p className="mt-4 text-blue-200" dangerouslySetInnerHTML={{ __html: t.description }} />
                            <p className="mt-4 text-blue-200">{t.case_desc}</p>
                            
                            <ul className="mt-6 space-y-2 text-left max-w-md mx-auto lg:mx-0">
                                {t.results.map((result: string, index: number) => (
                                    <li key={index} className="flex items-center gap-3 text-green-300">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">{result}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button onClick={handleCtaClick} className="mt-8 bg-accent text-white hover:bg-accent/90">
                                {t.ctaButton}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full max-w-sm mx-auto">
                            <div className="bg-black/20 p-2 rounded-2xl">
                                <div className="w-full aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
                                    <iframe
                                        src={t.videoUrl}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                        className="w-full h-full"
                                        title="Den Aroma Case Study Video"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default FeaturedCaseStudy;
