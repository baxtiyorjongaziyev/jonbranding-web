'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';

const processSteps = [
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

const Timeline = () => (
  <div className="absolute top-0 left-0 right-0 h-10 w-full">
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200" />
      <div className="absolute top-1/2 left-[25%] w-6 h-6 -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full rounded-full bg-primary" />
      </div>
      <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500 bg-white px-2">
         To‘g‘ri Brendni Loyihalash
      </div>
       <div className="absolute top-1/2 left-[75%] w-6 h-6 -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full rounded-full bg-primary" />
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
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-83.33%']); // (1 - 1/6) * -100%

  return (
    <>
      <section ref={targetRef} id="process" className="relative h-[400vh] bg-white">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
           <div className="container mx-auto px-4 text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                G'oyadan Mukammallikka
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
              </p>
           </div>
          
          <motion.div style={{ x }} className="flex gap-12">
            {processSteps.map((step, index) => (
              <div key={index} className="w-[90vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="relative pt-12 h-full">
                   {index < 4 && (
                      <div className="absolute top-[2px] left-1/2 w-[calc(100%+3rem)] h-[1px] bg-gray-200">
                          <div className="absolute top-1/2 left-0 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary" />
                      </div>
                   )}
                   {index === 3 && (
                       <div className="absolute top-[2px] right-[-3rem] w-1/2 h-[1px] bg-gray-200">
                           <div className="absolute top-1/2 right-0 w-3 h-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary" />
                       </div>
                   )}

                    <h3 className="text-gray-500 text-sm mb-6 relative bg-white px-2 w-fit mx-auto">{step.phase}</h3>
                    
                    <div className="h-full">
                        <h4 className="text-2xl font-bold text-dark-blue">{step.title}</h4>
                        <p className="text-gray-500 mt-1 mb-4">{step.subtitle}</p>
                        <div className="flex flex-wrap gap-2">
                        {step.tasks.map(task => (
                            <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-1 text-sm">
                            {task}
                            </Badge>
                        ))}
                        </div>
                    </div>
                </div>
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
