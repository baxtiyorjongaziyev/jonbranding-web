
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProcessProps {
  onCtaClick: () => void;
}

const phases = [
  {
    phase: '1-Bosqich',
    title: 'Kashfiyot',
    subtitle: 'Boshlanish nuqtasi',
    tasks: [
      'Briflash',
      'Biznes muammolarini aniqlash',
      'Auditoriya ehtojlari',
      'Bozor va raqobatchilar tahlili',
      'Ilhom va g‘oyalar yig‘ish',
    ],
  },
  {
    phase: '2-Bosqich',
    title: 'Strategiya',
    subtitle: 'Yo‘l xaritasini belgilash',
    tasks: [
      'Maqsad qo‘yish',
      'Brendni joylashtirish (pozitsiyalash)',
      'Asosiy tamoyillar',
      'Rejalashtirish (roadmap)',
      'Brend vizyoni',
    ],
  },
  {
    phase: '3-Bosqich',
    title: 'Ijodiy Dizayn',
    subtitle: 'Brendni shakllantirish',
    tasks: [
      'Neyming',
      'Logo ishlanmalari',
      'Rang va shrift tizimi',
      'Vizual konsepsiya',
      'Brandbook asoslari',
    ],
  },
   {
    phase: '4-Bosqich',
    title: 'Taqdimot va Tatbiq',
    subtitle: 'Sinov va hayotga tadbiq etish',
    tasks: [
      'Dizayn taqdimoti',
      'Mijozdan fikr olish',
      'Yakuniy yechimni tanlash',
      'Tayyor dizayn fayllari',
      'Doimiy qo‘llab-quvvatlash',
    ],
  },
];


const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <>
      <section ref={targetRef} id="process" className="relative h-[300vh] bg-white">
        <div className="sticky top-0 h-screen overflow-hidden">
           <div className="container mx-auto px-4 text-center pt-16 sm:pt-24 pb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
              </p>
           </div>
          
           <div className="relative container mx-auto h-full flex items-start">
               {/* Timeline Line */}
                <div className="absolute top-[calc(theme(spacing.12)+theme(spacing.1))] left-0 right-0 h-0.5 bg-gray-200 w-full" />
                
                <motion.div style={{ x }} className="flex">
                    {phases.map((step, index) => (
                    <div key={index} className="w-[100vw] lg:w-[25vw] flex-shrink-0 px-4">
                        <div className="relative pt-12">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-white z-10" />
                        </div>
                        <Card className="h-full rounded-2xl border p-6 flex flex-col items-center text-center bg-secondary/30">
                            <h3 className="text-2xl font-bold text-dark-blue">{step.title}</h3>
                            <p className="text-gray-500 text-sm mb-4">{step.subtitle}</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                            {step.tasks.map(task => (
                                <Badge key={task} variant="secondary" className="font-normal bg-white text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-1 text-sm">
                                {task}
                                </Badge>
                            ))}
                            </div>
                        </Card>
                    </div>
                    ))}
                </motion.div>
           </div>
        </div>
      </section>
      
      <CtaBlock
        title="Keling, ishni boshlaymiz!"
        description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
        buttonText="Loyihani muhokama qilish"
        onCtaClick={onCtaClick}
      />
    </>
  );
};

export default Process;
