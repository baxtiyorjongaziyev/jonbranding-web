
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ListChecks, Star } from 'lucide-react';
import CtaBlock from './cta-block';
import TiltCard from '@/components/ui/tilt-card';
import { FC } from 'react';

interface WhyUsProps {
  onCtaClick: () => void;
  lang: string;
}


const WhyUs: FC<WhyUsProps> = ({ onCtaClick, lang }) => {
  const t = {
    uz: {
        title: "Nima uchun aynan biz?",
        subtitle: "Biz shunchaki va'da bermaymiz. Biz tizimli yondashuv orqali brendingiz uchun aniq qiymat yaratamiz.",
        values: [
            { icon: Target, title: "Strategik yondashuv", description: "Biz shunchaki chiroyli rasm chizmaymiz. Har bir dizayn elementi sotuvingizni oshirishga va brendingizni mustahkamlashga xizmat qiladi." },
            { icon: ListChecks, title: "Shaffof jarayon", description: "Brief → Tahlil → Strategiya → Dizayn → Topshirish. Har bir bosqichda siz bilan yaqin aloqada bo'lamiz va jarayonni to'liq nazorat qilasiz." },
            { icon: Star, title: "Natija va Sadoqat", description: "50 dan ortiq loyiha va eng muhimi - mijozlarimizning 90% bizni o'z tanishlariga tavsiya qilishadi. Bu biz uchun eng katta yutuq." }
        ],
        ctaTitle: "Bizning yondashuvimiz sizga ma'qul keldimi?",
        ctaDesc: "Keling, brendingizni bepul tahlil qilib, uning kuchli va zaif tomonlarini aniqlaymiz. Bu siz uchun hech qanday majburiyat yuklamaydi.",
        ctaButton: "Brendimni bepul tahlil qiling"
    },
    ru: {
        title: "Почему именно мы?",
        subtitle: "Мы не просто даем обещания. Мы создаем реальную ценность для вашего бренда через системный подход.",
        values: [
            { icon: Target, title: "Стратегический подход", description: "Мы не просто рисуем красивые картинки. Каждый элемент дизайна служит для увеличения ваших продаж и укрепления вашего бренда." },
            { icon: ListChecks, title: "Прозрачный процесс", description: "Бриф → Анализ → Стратегия → Дизайн → Сдача. На каждом этапе мы тесно сотрудничаем с вами, и вы полностью контролируете процесс." },
            { icon: Star, title: "Результат и Лояльность", description: "Более 50 проектов, и самое главное - 90% наших клиентов рекомендуют нас своим знакомым. Это для нас самое большое достижение." }
        ],
        ctaTitle: "Вам нравится наш подход?",
        ctaDesc: "Давайте бесплатно проанализируем ваш бренд, определим его сильные и слабые стороны. Это не накладывает на вас никаких обязательств.",
        ctaButton: "Проанализировать мой бренд бесплатно"
    },
    en: {
        title: "Why Us?",
        subtitle: "We don't just make promises. We create tangible value for your brand through a systematic approach.",
        values: [
            { icon: Target, title: "Strategic Approach", description: "We don't just draw pretty pictures. Every design element serves to increase your sales and strengthen your brand." },
            { icon: ListChecks, title: "Transparent Process", description: "Brief → Analysis → Strategy → Design → Delivery. We work closely with you at every stage, giving you full control." },
            { icon: Star, title: "Results and Loyalty", description: "Over 50 projects, and most importantly - 90% of our clients recommend us. This is our greatest achievement." }
        ],
        ctaTitle: "Do you like our approach?",
        ctaDesc: "Let's analyze your brand for free to identify its strengths and weaknesses. No strings attached.",
        ctaButton: "Analyze My Brand for Free"
    }
  }

  const translations = t[lang as 'uz' | 'ru' | 'en'];
  const values = translations.values;
  
  return (
    <>
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
             <TiltCard key={index} strength={10}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl h-full">
                  <CardHeader className="items-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="!mt-4 text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
    <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={onCtaClick}
      />
    </>
  );
};

export default WhyUs;
