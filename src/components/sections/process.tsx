
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
    title: 'Kashfiyot',
    subtitle: 'Boshlanish nuqtasi',
    tasks: ['Briflash', 'Biznes muammolarini aniqlash', 'Auditoriya ehtiyojlari', 'Bozor va raqobatchilar tahlili', 'Ilhom va g‘oyalar yig‘ish'],
    milestone: 'To‘g‘ri mahsulotni loyihalash'
  },
  {
    title: 'Strategiya',
    subtitle: 'Yo‘l xaritasini belgilash',
    tasks: ['Maqsad qo‘yish', 'Auditoriya tahlili', 'Brendni joylashtirish (pozitsiyalash)', 'Asosiy tamoyillar', 'Rejalashtirish (roadmap)', 'Brend vizyoni'],
    milestone: 'To‘g‘ri mahsulotni loyihalash'
  },
  {
    title: 'Ijodiy Dizayn & Taqdimot',
    subtitle: 'Brendni shakllantirish va sinov',
    tasks: ['Nomingizni yaratish (naming)', 'Logo ishlanmalari', 'Rang va shrift tizimi', 'Vizual konsepsiya', 'Qadoqlash dizayni', 'Dizayn taqdimoti', 'Mijozdan fikr olish'],
    milestone: 'Mahsulotni to‘g‘ri loyihalash'
  },
  {
    title: 'Tatbiq & Rivojlanish',
    subtitle: 'Hayotga tadbiq etish va qo‘llab-quvvatlash',
    tasks: ['Tayyor dizayn fayllari', 'Brandbook topshirish', 'Vizual qo‘llanmalar', 'Doimiy qo‘llab-quvvatlash', 'Trendlarni kuzatish', 'Brendni yangilash'],
    milestone: 'Mahsulotni to‘g‘ri loyihalash'
  },
];

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Adjusting the transformation to ensure it doesn't cut off at the start
  // The range [0.05, 0.95] means animation starts a bit after the section sticks and ends a bit before it unsticks.
  // The output range is calculated to move 3 out of 4 cards. (100% / 4 cards * 3 moves = 75%)
  const x = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '-78%']);

  return (
    <section ref={targetRef} id="process" className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex flex-col items-center justify-start h-screen overflow-hidden">
        {/* Header Section */}
        <div className="pt-24 pb-12 text-center w-full">
            <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                G‘oyalarni ajoyib raqamli mahsulotga aylantirish uchun qulay va proaktiv jarayonni taklif etamiz.
            </p>
        </div>

        {/* Timeline Bar */}
        <div className="w-full max-w-6xl mx-auto px-8 sm:px-16 md:px-24">
            <div className="relative w-full h-1 bg-gray-200">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex justify-between items-center">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
                    <p className="text-sm text-gray-500 mx-4">To‘g‘ri yechimni loyihalash</p>
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
                </div>
                 <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/2 flex justify-end items-center">
                    <p className="text-sm text-gray-500 mx-4">Yechimni to‘g‘ri loyihalash</p>
                </div>
            </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <motion.div style={{ x }} className="flex gap-8 pl-8 sm:pl-16 md:pl-24 mt-8">
          {processPhases.map((phase, index) => (
            <div key={index} className="w-[80vw] md:w-[45vw] lg:w-[24vw] flex-shrink-0">
              <Card className="h-full rounded-2xl flex flex-col items-start p-6 bg-white border-none shadow-none">
                <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{phase.subtitle}</p>
                <div className="flex flex-wrap gap-2 justify-start">
                  {phase.tasks.map((task) => (
                    <Badge key={task} variant="outline" className="font-normal bg-gray-100 text-gray-600 hover:bg-gray-200/80 rounded-lg px-3 py-1 text-sm border-gray-200/80">
                      {task}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </motion.div>
        
         <div className="absolute bottom-16">
             <CtaBlock
                title=""
                description=""
                buttonText="LOYIHANI MUHOKAMA QILISH"
                onCtaClick={onCtaClick}
            />
        </div>

      </div>
    </section>
  );
};

export default Process;
