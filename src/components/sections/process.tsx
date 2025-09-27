
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '../ui/badge';
import CtaBlock from './cta-block';
import { cn } from '@/lib/utils';


interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
}

const ProcessCard = ({ title, description, tasks, phase }: {title: string, description: string, tasks: string[], phase: string}) => (
    <div className="w-[320px] md:w-[350px] flex-shrink-0 px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">{phase}</span>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        <h3 className="mt-4 text-2xl md:text-3xl font-bold text-dark-blue">{title}</h3>
        <p className="mt-1 text-base text-gray-500">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
            {tasks.map((task) => (
                <Badge key={task} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal px-3 py-1 text-sm">
                    {task}
                </Badge>
            ))}
        </div>
    </div>
);

const MobileProcessView = ({ phases, title, subtitle }: { phases: any[], title: string, subtitle: string }) => (
    <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                {title}
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
              {subtitle}
            </p>
        </div>
        <div className="relative">
             {/* Timeline line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-12">
                 {phases.map((phase) => (
                    <div key={phase.phase} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-1 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                        
                        <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                        <p className="mt-1 text-gray-500">{phase.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {phase.tasks.map((task: string) => (
                                <Badge key={task} variant="secondary">{task}</Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const Process: React.FC<ProcessProps> = ({ onCtaClick, lang }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  
  const t = {
    uz: {
        title: "Bizning ish jarayonimiz",
        subtitle: "Har bir loyihada biz sinovdan o'tgan, shaffof va samarali jarayonni qo'llaymiz.",
        phases: [
          {
            phase: "01",
            title: "Kashfiyot",
            description: "Sayohatning boshlanishi",
            tasks: ["Briflash", "Biznes muammolarini aniqlash", "Auditoriya ehtiyojlari", "Bozor va raqobatchilar tahlili", "Ilhom va g‘oyalar yig‘ish"],
          },
          {
            phase: "02",
            title: "Strategiya",
            description: "Yo‘lni xaritaga solish",
            tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Brendni joylashtirish", "Asosiy tamoyillar", "Rejalashtirish", "Brend vizyoni"],
          },
          {
            phase: "03",
            title: "Ijodiy Dizayn",
            description: "Brendni shakllantirish",
            tasks: ["Neyming", "Logo dizayni", "Vizual konsepsiya", "Qadoqlash dizayni", "Brandbook"],
          },
          {
            phase: "04",
            title: "Taqdimot",
            description: "G'oyalarni sinovdan o'tkazish",
            tasks: ["Dizayn taqdimoti", "Fikr-mulohazalarni moslashtirish", "Yakuniy iteratsiya"],
          },
          {
            phase: "05",
            title: "Amaliyot",
            description: "Brendni hayotga tadbiq etish",
            tasks: ["Tayyor dizayn fayllari", "Brandbook topshirish", "Vizual qo‘llanmalar"],
          },
          {
            phase: "06",
            title: "Rivojlanish",
            description: "Brendni qo'llab-quvvatlash",
            tasks: ["Tatbiq qilish bo‘yicha yo‘riqnoma", "Doimiy qo‘llab-quvvatlash", "Keyingi qadamlar"],
          },
        ],
        ctaTitle: "Loyihangizni muhokama qilishga tayyormisiz?",
        ctaDesc: "Keling, g'oyalaringizni hayotga tatbiq etishni boshlaymiz.",
        ctaButton: "Loyihani muhokama qilish"
    },
    ru: {
        title: "Наш рабочий процесс",
        subtitle: "В каждом проекте мы используем проверенный, прозрачный и эффективный процесс.",
        phases: [
            {
                phase: "01",
                title: "Открытие",
                description: "Начало путешествия",
                tasks: ["Брифинг", "Выявление бизнес-проблем", "Потребности аудитории", "Анализ рынка и конкурентов", "Сбор вдохновения и идей"],
            },
            {
                phase: "02",
                title: "Стратегия",
                description: "Прокладывание пути",
                tasks: ["Постановка целей", "Анализ аудитории", "Позиционирование бренда", "Основные принципы", "Планирование", "Видение бренда"],
            },
            {
                phase: "03",
                title: "Креативный Дизайн",
                description: "Формирование бренда",
                tasks: ["Нейминг", "Дизайн логотипа", "Визуальная концепция", "Дизайн упаковки", "Брендбук"],
            },
            {
                phase: "04",
                title: "Презентация",
                description: "Тестирование идей",
                tasks: ["Презентация дизайна", "Адаптация на основе отзывов", "Финальная итерация"],
            },
            {
                phase: "05",
                title: "Реализация",
                description: "Воплощение бренда в жизнь",
                tasks: ["Готовые файлы дизайна", "Передача брендбука", "Визуальные руководства"],
            },
            {
                phase: "06",
                title: "Развитие",
                description: "Поддержка бренда",
                tasks: ["Инструкции по внедрению", "Постоянная поддержка", "Следующие шаги"],
            },
        ],
        ctaTitle: "Готовы обсудить ваш проект?",
        ctaDesc: "Давайте начнем воплощать ваши идеи в жизнь.",
        ctaButton: "Обсудить проект"
    }
  }
  const translations = lang === 'ru' ? t.ru : t.uz;

  const x = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '-83.33%']);
  const ctaOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.9, 1], ["50px", "0px"]);

  return (
    <section id="process" className="py-16 sm:py-24 bg-white">
        {/* Desktop View with Sticky Horizontal Scroll */}
        <div ref={targetRef} className="relative h-[300vh] hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-24 left-0 right-0">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                            {translations.title}
                        </h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                            {translations.subtitle}
                        </p>
                    </div>
                </div>
                
                <motion.div style={{ x }} className="flex">
                    {translations.phases.map((phase, index) => (
                        <ProcessCard key={index} {...phase} />
                    ))}
                </motion.div>
                
                <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute bottom-0 left-0 right-0 z-10">
                    <div className={cn(scrollYProgress.get() < 0.9 && "pointer-events-none")}>
                        <CtaBlock 
                            title={translations.ctaTitle}
                            description={translations.ctaDesc}
                            buttonText={translations.ctaButton}
                            onCtaClick={onCtaClick}
                        />
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Mobile and Tablet View */}
        <div className="lg:hidden">
            <MobileProcessView phases={translations.phases} title={translations.title} subtitle={translations.subtitle} />
             <CtaBlock 
                title={translations.ctaTitle}
                description={translations.ctaDesc}
                buttonText={translations.ctaButton}
                onCtaClick={onCtaClick}
            />
        </div>
    </section>
  );
};

export default Process;
