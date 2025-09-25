
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '../ui/badge';
import CtaBlock from './cta-block';
import { cn } from '@/lib/utils';

const processPhases = [
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
];


const ProcessCard = ({ title, description, tasks, phase }: (typeof processPhases)[0]) => (
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

const MobileProcessView = () => (
    <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
              Har bir loyihada biz sinovdan o'tgan, shaffof va samarali jarayonni qo'llaymiz.
            </p>
        </div>
        <div className="relative">
             {/* Timeline line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-12">
                 {processPhases.map((phase) => (
                    <div key={phase.phase} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-1 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                        
                        <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                        <p className="mt-1 text-gray-500">{phase.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {phase.tasks.map((task) => (
                                <Badge key={task} variant="secondary">{task}</Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the total width of the scrolling content
  // 350px per card * 6 cards + 5 gaps * 16px (approx)
  // This needs to be responsive. Let's make a rough calculation
  // The transform will move the content from 0% to -83.33% (5/6 of the way)
  // This means the last item will be at the start. We need to adjust this.
  // We want the last item to be at the end of the viewport.
  // Total width of carousel is 6 * 350px = 2100px.
  // Viewport width is ~100vw.
  // We need to scroll 2100px - 100vw.
  // It's much simpler to use a percentage that leaves the last item visible.
  // With 6 items, 100% / 6 = 16.66% per item.
  // We want to scroll 5 items past. 5 * 16.66% = 83.33%.
  // So the transform should be from '0%' to '-83.33%'
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
                            Bizning ish jarayonimiz
                        </h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                            Har bir loyihada biz sinovdan o'tgan, shaffof va samarali jarayonni qo'llaymiz.
                        </p>
                    </div>
                </div>
                
                <motion.div style={{ x }} className="flex">
                    {processPhases.map((phase, index) => (
                        <ProcessCard key={index} {...phase} />
                    ))}
                </motion.div>
                
                <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute bottom-0 left-0 right-0 z-10">
                    <div className={cn(scrollYProgress.get() < 0.9 && "pointer-events-none")}>
                        <CtaBlock 
                            title="Loyihangizni muhokama qilishga tayyormisiz?"
                            description="Keling, g'oyalaringizni hayotga tatbiq etishni boshlaymiz."
                            buttonText="Loyihani muhokama qilish"
                            onCtaClick={onCtaClick}
                        />
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Mobile and Tablet View */}
        <div className="lg:hidden">
            <MobileProcessView />
             <CtaBlock 
                title="Loyihangizni muhokama qilishga tayyormisiz?"
                description="Keling, g'oyalaringizni hayotga tatbiq etishni boshlaymiz."
                buttonText="Loyihani muhokama qilish"
                onCtaClick={onCtaClick}
            />
        </div>
    </section>
  );
};

export default Process;

    