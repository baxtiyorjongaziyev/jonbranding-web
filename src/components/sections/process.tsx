
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';

interface ProcessProps {
  onCtaClick: () => void;
}

const processPhases = [
  {
    title: 'Kashfiyot',
    subtitle: 'Boshlanish nuqtasi',
    tasks: ['Briflash', 'Biznes muammolarini aniqlash', 'Auditoriya ehtiyojlari', 'Bozor va raqobatchilar tahlili', 'Ilhom va g‘oyalar yig‘ish'],
  },
  {
    title: 'Strategiya',
    subtitle: 'Yo‘l xaritasini belgilash',
    tasks: ['Maqsad qo‘yish', 'Auditoriya tahlili', 'Brendni joylashtirish (pozitsiyalash)', 'Asosiy tamoyillar', 'Rejalashtirish (roadmap)', 'Brend vizyoni'],
  },
  {
    title: 'Ijodiy Dizayn',
    subtitle: 'Brendni shakllantirish',
    tasks: ['Nomingizni yaratish (naming)', 'Logo ishlanmalari', 'Rang va shrift tizimi', 'Vizual konsepsiya', 'Qadoqlash dizayni', 'Brandbook asoslari'],
  },
  {
    title: 'Taqdimot va Fikr',
    subtitle: 'Sinov va takomillashtirish',
    tasks: ['Dizayn taqdimoti', 'Mijozdan fikr olish', 'Taklif va variantlarni moslashtirish', 'Yakuniy yechimni tanlash'],
  },
  {
    title: 'Amaliyotga Tatbiq',
    subtitle: 'Brendni hayotga tadbiq etish',
    tasks: ['Tayyor dizayn fayllari', 'Brandbook topshirish', 'Vizual qo‘llanmalar va kontent', 'Tatbiq qilish bo‘yicha yo‘riqnoma'],
  },
  {
    title: 'Qo‘llab-quvvatlash va Rivojlanish',
    subtitle: 'Brend hech qachon to‘xtamaydi',
    tasks: ['Doimiy qo‘llab-quvvatlash', 'Mijozlardan fikr yig‘ish', 'Trend va yangiliklarni kuzatish', 'Brendni yangilash va kengaytirish'],
  },
];

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0.05, 0.8], ["5%", "-88%"]);

  return (
    <>
      <section ref={targetRef} id="process" className="relative h-[500vh] bg-white">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 pt-16 sm:pt-24 pb-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Bizning ish jarayonimiz
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
              </p>
            </div>
          </div>
        
          <motion.div style={{ x }} className="flex gap-8 pl-8 sm:pl-16 md:pl-24">
            {processPhases.map((phase, index) => (
              <div key={index} className="w-[80vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0">
                <div className="relative pt-16">
                  {/* Bu joy bo'sh qolishi mumkin yoki timeline chizig'i qo'shilishi */}
                </div>
                <div className="h-full rounded-2xl flex flex-col items-start p-4 bg-secondary/50 border border-gray-200/80 shadow-sm">
                  <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{phase.subtitle}</p>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {phase.tasks.map((task) => (
                      <Badge key={task} variant="secondary" className="font-normal bg-white text-gray-700 hover:bg-gray-200/50 rounded-lg px-3 py-1 text-sm border-gray-200/80">
                        {task}
                      </Badge>
                    ))}
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
