
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
    tasks: ["Briflash", "Biznes muammolari", "Auditoriya ehtiyojlari", "Bozor tahlili", "Raqobatchilar", "Ilhom/g‘oya"],
  },
  {
    phase: "02",
    title: "Strategiya",
    description: "Yo‘l xaritasini belgilash",
    tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Pozitsiyalash", "Asosiy tamoyillar", "Roadmap", "Brend vizyoni"],
  },
  {
    phase: "03",
    title: "Ijodiy Dizayn",
    description: "Brendni shakllantirish",
    tasks: ["Naming", "Logo", "Rang & shrift", "Vizual konsepsiya", "Qadoqlash", "Brandbook asoslari"],
  },
  {
    phase: "04",
    title: "Taqdimot va Fikr",
    description: "Sinov va takomillashtirish",
    tasks: ["Taqdimot", "Fikr-mulohaza", "Iteratsiya", "Moslashtirish"],
  },
  {
    phase: "05",
    title: "Amaliyotga Tatbiq",
    description: "Brendni hayotga tadbiq etish",
    tasks: ["Tayyor fayllar", "Brandbook", "Vizual qo‘llanmalar", "Tatbiq yo‘riqnomasi"],
  },
  {
    phase: "06",
    title: "Qo‘llab-quvvatlash",
    description: "Brend hech qachon to‘xtamaydi",
    tasks: ["Doimiy support", "Fikr yig‘ish", "Trendlarni kuzatish", "Yangilash/kengaytirish"],
  },
];

// Group phases for 4-column layout
const groupedPhases = [
  {
    title: "Kashfiyot",
    description: "Boshlanish nuqtasi",
    tasks: processPhases[0].tasks
  },
  {
    title: "Strategiya",
    description: "Yo‘l xaritasini belgilash",
    tasks: processPhases[1].tasks
  },
  {
    title: "Ijodiy Dizayn & Fikr",
    description: "Shakllantirish va takomillashtirish",
    tasks: [...processPhases[2].tasks, ...processPhases[3].tasks]
  },
  {
    title: "Tatbiq & Rivojlanish",
    description: "Hayotga tadbiq etish va qo'llab-quvvatlash",
    tasks: [...processPhases[4].tasks, ...processPhases[5].tasks]
  }
];


const ProcessCard = ({ title, description, tasks }: (typeof groupedPhases)[0]) => (
    <div className="w-[300px] md:w-[350px] flex-shrink-0">
        <h3 className="text-xl md:text-2xl font-bold text-dark-blue">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {tasks.map((task) => (
                <Badge key={task} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal">
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
    offset: ['start start', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '-80%']);

  return (
    <section id="process" ref={targetRef} className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container mx-auto px-4 absolute top-20 left-0 right-0">
            <div className="max-w-4xl">
                 <h1 className="text-4xl sm:text-5xl font-light text-foreground">
                    G'oyadan mukammallikka
                </h1>
                <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue mt-1">
                    Bizning ish jarayonimiz
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    Biz g'oyalarni ajoyib raqamli mahsulotga aylantirish uchun qulay, shaffof va samarali ish jarayonini taklif etamiz.
                </p>
            </div>
        </div>
        
        <motion.div style={{ x }} className="flex gap-16 pl-8">
            <div className="w-full absolute top-1/2 -translate-y-24 left-0 h-px bg-gray-200">
                <div className="absolute top-1/2 -translate-y-1/2 left-[5%] w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[55%] w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
            </div>
            {groupedPhases.map((phase, index) => (
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

    