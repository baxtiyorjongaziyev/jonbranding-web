
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { Card } from '../ui/card';

interface ProcessProps {
  onCtaClick: () => void;
}

const processPhases = [
    {
        phase: "01",
        title: "Kashfiyot",
        description: "Boshlanish nuqtasi",
        tasks: [
            "Briflash", 
            "Biznes muammolarini aniqlash", 
            "Auditoriya ehtiyojlari", 
            "Bozor va raqobatchilar tahlili", 
            "Ilhom va g‘oyalar yig‘ish"
        ],
    },
    {
        phase: "02",
        title: "Strategiya",
        description: "Yo‘l xaritasini belgilash",
        tasks: [
            "Maqsad qo‘yish", 
            "Brendni joylashtirish (pozitsiyalash)", 
            "Asosiy tamoyillar", 
            "Rejalashtirish (roadmap)", 
            "Brend vizyoni"
        ],
    },
    {
        phase: "03",
        title: "Ijodiy Dizayn & Taqdimot",
        description: "Brendni shakllantirish va sinov",
        tasks: [
            "Neyming", 
            "Logo ishlanmalari", 
            "Rang va shrift tizimi", 
            "Vizual konsepsiya", 
            "Qadoqlash dizayni",
            "Dizayn taqdimoti", 
            "Mijozdan fikr olish",
        ],
    },
    {
        phase: "04",
        title: "Tatbiq & Rivojlanish",
        description: "Hayotga tadbiq etish va qo‘llab-quvvatlash",
        tasks: [
            "Tayyor dizayn fayllari", 
            "Brandbook topshirish", 
            "Vizual qo‘llanmalar", 
            "Doimiy qo‘llab-quvvatlash", 
            "Brendni yangilash"
        ],
    },
];

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "-77%"]);

  return (
    <section ref={targetRef} id="process" className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pt-16 sm:pt-24 pb-12 text-center w-full z-10 bg-white">
            <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                G‘oyalarni ajoyib natijaga aylantirish uchun qulay va proaktiv jarayonni taklif etamiz.
            </p>
        </div>
        
        <motion.div style={{ x }} className="flex gap-8 pl-[5vw] sm:pl-[10vw]">
          {processPhases.map((phase, index) => (
            <div key={index} className="w-[80vw] md:w-[45vw] lg:w-[24vw] flex-shrink-0">
              <Card className="h-full rounded-2xl flex flex-col p-6 sm:p-8 bg-secondary/50 border-gray-200/80">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-dark-blue">{phase.title}</h3>
                    <span className="text-4xl font-extrabold text-primary/10">{phase.phase}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">{phase.description}</p>
                <div className="flex flex-wrap gap-2 justify-start">
                  {phase.tasks.map((task) => (
                    <Badge key={task} variant="outline" className="font-normal bg-white text-gray-600 border-gray-200/80">
                      {task}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>
       <CtaBlock
            title="Loyihangizni muhokama qilishga tayyormisiz?"
            description="Biznesingiz uchun qanday yechimlar taklif qila olishimizni bilish uchun bepul konsultatsiyaga yoziling."
            buttonText="LOYIHANI MUHOKAMA QILISH"
            onCtaClick={onCtaClick}
        />
    </section>
  );
};

export default Process;
