
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '../ui/badge';
import CtaBlock from './cta-block';

const processPhases = [
  {
    phase: "01",
    title: "Kashfiyot",
    description: "Boshlanish nuqtasi",
    tasks: ["Briflash", "Biznes muammolarini aniqlash", "Auditoriya ehtiyojlari", "Bozor va raqobatchilar tahlili", "Ilhom va g‘oyalar yig‘ish"],
  },
  {
    phase: "02",
    title: "Strategiya",
    description: "Yo‘l xaritasini belgilash",
    tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Brendni joylashtirish", "Asosiy tamoyillar", "Rejalashtirish", "Brend vizyoni"],
  },
  {
    phase: "03",
    title: "Ijodiy Dizayn",
    description: "Brendni shakllantirish",
    tasks: ["Naming ishlanmalari", "Logo dizayni", "Rang va shrift tizimi", "Vizual konsepsiya", "Qadoqlash dizayni", "Brandbook asoslari"],
  },
  {
    phase: "04",
    title: "Taqdimot va Fikr",
    description: "Sinov va takomillashtirish",
    tasks: ["Dizayn taqdimoti", "Mijozdan fikr olish", "Taklif va variantlarni moslashtirish", "Yakuniy yechimni tanlash"],
  },
  {
    phase: "05",
    title: "Amaliyotga Tatbiq",
    description: "Brendni hayotga tadbiq etish",
    tasks: ["Tayyor dizayn fayllari", "Brandbook topshirish", "Vizual qo‘llanmalar va kontent", "Tatbiq qilish bo‘yicha yo‘riqnoma"],
  },
  {
    phase: "06",
    title: "Qo‘llab-quvvatlash va Rivojlanish",
    description: "Brend hech qachon to‘xtamaydi",
    tasks: ["Doimiy qo‘llab-quvvatlash", "Mijozlardan fikr yig‘ish", "Trend va yangiliklarni kuzatish", "Brendni yangilash va kengaytirish"],
  },
];


const ProcessCard = ({ title, description, tasks, phase }: (typeof processPhases)[0]) => (
    <div className="w-[300px] md:w-[350px] flex-shrink-0">
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

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  
  // 6 cards, so we need to scroll more.
  // The value '-125%' is an approximation that should work for 6 cards of 350px width + gaps
  // It might need fine-tuning based on the exact width and gap values.
  const x = useTransform(scrollYProgress, [0.1, 0.9], ['5%', '-125%']);

  return (
    <section id="process" ref={targetRef} className="relative h-[600vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-1/4 left-0 right-0 z-20">
             <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                     <h1 className="text-4xl sm:text-5xl font-light text-foreground">
                        To‘g‘ri Brendni Loyihalash
                    </h1>
                    <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue mt-1">
                        Bizning ish jarayonimiz
                    </h2>
                </div>
            </div>
        </div>
        
        <motion.div style={{ x }} className="flex items-start gap-16 pl-8">
            {processPhases.map((phase, index) => (
                <div key={index} className="pt-24">
                  <ProcessCard {...phase} />
                </div>
            ))}
        </motion.div>
      </div>

       <div className="absolute bottom-16 left-0 right-0 z-10">
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
