
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessProps {
  onCtaClick: () => void;
}

const phases = [
  {
    phase: 'To‘g‘ri Brendni Loyihalash',
    title: 'Kashfiyot',
    subtitle: 'Boshlanish nuqtasi',
    tasks: [
      'Briflash',
      'Biznes muammolarini aniqlash',
      'Auditoriya ehtiyojlari',
      'Bozor va raqobatchilar tahlili',
      'Ilhom va g‘oyalar yig‘ish',
    ],
  },
  {
    phase: 'To‘g‘ri Brendni Loyihalash',
    title: 'Strategiya',
    subtitle: 'Yo‘l xaritasini belgilash',
    tasks: [
      'Maqsad qo‘yish',
      'Auditoriya tahlili',
      'Brendni joylashtirish (pozitsiyalash)',
      'Asosiy tamoyillar',
      'Rejalashtirish (roadmap)',
      'Brend vizyoni',
    ],
  },
  {
    phase: 'To‘g‘ri Brendni Loyihalash',
    title: 'Ijodiy Dizayn',
    subtitle: 'Brendni shakllantirish',
    tasks: [
      'Nomingizni yaratish (naming)',
      'Logo ishlanmalari',
      'Rang va shrift tizimi',
      'Vizual konsepsiya',
      'Qadoqlash dizayni',
      'Brandbook asoslari',
    ],
  },
  {
    phase: 'To‘g‘ri Brendni Loyihalash',
    title: 'Taqdimot va Fikr',
    subtitle: 'Sinov va takomillashtirish',
    tasks: [
      'Dizayn taqdimoti',
      'Mijozdan fikr olish',
      'Taklif va variantlarni moslashtirish',
      'Yakuniy yechimni tanlash',
    ],
  },
  {
    phase: 'Brendni Hayotga Tadbiq Etish',
    title: 'Amaliyotga Tatbiq',
    subtitle: 'Brendni hayotga tadbiq etish',
    tasks: [
      'Tayyor dizayn fayllari',
      'Brandbook topshirish',
      'Vizual qo‘llanmalar va kontent',
      'Tatbiq qilish bo‘yicha yo‘riqnoma',
    ],
  },
  {
    phase: 'Brendni Hayotga Tadbiq Etish',
    title: 'Qo‘llab-quvvatlash',
    subtitle: 'Brend hech qachon to‘xtamaydi',
    tasks: [
      'Doimiy qo‘llab-quvvatlash',
      'Mijozlardan fikr yig‘ish',
      'Trend va yangiliklarni kuzatish',
      'Brendni yangilash',
    ],
  },
];


const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-83.33%']); // (1 - 1/6) * -100%

  return (
    <>
      <section ref={targetRef} id="process" className="relative h-[300vh] bg-white">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
           <div className="container mx-auto px-4 text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
              </p>
           </div>
          
          <motion.div style={{ x }} className="flex gap-12">
            {phases.map((step, index) => (
              <div key={index} className="w-[90vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0 px-4">
                 <Card className="h-full rounded-2xl border p-6 flex flex-col items-center text-center bg-secondary/50">
                    <div className="text-primary font-bold text-sm mb-2">{step.phase}</div>
                    <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{step.subtitle}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {step.tasks.map(task => (
                        <Badge key={task} variant="secondary" className="font-normal bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg px-3 py-1 text-sm">
                        {task}
                        </Badge>
                    ))}
                    </div>
                </Card>
              </div>
            ))}
          </motion.div>
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
