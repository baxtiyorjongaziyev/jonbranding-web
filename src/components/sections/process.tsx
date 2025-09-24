
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const processSteps = [
    {
        title: "Kashfiyot",
        subtitle: "Boshlanish nuqtasi",
        tasks: ["Briflash", "Biznes muammolarini aniqlash", "Auditoriya ehtiyojlari", "Bozor va raqobatchilar tahlili", "Ilhom va g‘oyalar yig‘ish"]
    },
    {
        title: "Strategiya",
        subtitle: "Yo‘l xaritasini belgilash",
        tasks: ["Maqsad qo‘yish", "Auditoriya tahlili", "Brendni joylashtirish (pozitsiyalash)", "Asosiy tamoyillar", "Rejalashtirish (roadmap)", "Brend vizyoni"]
    },
     {
        title: "Ijodiy Dizayn",
        subtitle: "Brendni shakllantirish",
        tasks: ["Nomingizni yaratish (naming)", "Logo ishlanmalari", "Rang va shrift tizimi", "Vizual konsepsiya", "Qadoqlash dizayni", "Brandbook asoslari"]
    },
    {
        title: "Taqdimot va Fikr",
        subtitle: "Sinov va takomillashtirish",
        tasks: ["Dizayn taqdimoti", "Mijozdan fikr olish", "Taklif va variantlarni moslashtirish", "Yakuniy yechimni tanlash"]
    },
     {
        title: "Amaliyotga Tatbiq",
        subtitle: "Brendni hayotga tadbiq etish",
        tasks: ["Tayyor dizayn fayllari", "Brandbook topshirish", "Vizual qo‘llanmalar va kontent", "Tatbiq qilish bo‘yicha yo‘riqnoma"]
    },
    {
        title: "Qo‘llab-quvvatlash va Rivojlanish",
        subtitle: "Brend hech qachon to‘xtamaydi",
        tasks: ["Doimiy qo‘llab-quvvatlash", "Mijozlardan fikr yig‘ish", "Trend va yangiliklarni kuzatish", "Brendni yangilash va kengaytirish"]
    },
];

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(-100% + 100vw)"]); 

    return (
    <>
        <section ref={targetRef} id="process" className="relative h-[300vh] bg-white">
             <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-16 left-0 right-0 z-10">
                     <div className="container mx-auto px-4 text-center">
                        <p className="font-semibold text-primary">Bizning ish jarayonimiz</p>
                        <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue mt-2">
                           G'oyadan Mukammallikka
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                           Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
                        </p>
                    </div>
                </div>

                <motion.div style={{ x }} className="flex pl-4">
                   {processSteps.map((step, index) => (
                       <div key={index} className="flex-shrink-0 w-[90vw] lg:w-[30vw] px-4">
                           <Card className="h-full rounded-2xl shadow-lg border border-gray-200/80">
                               <CardHeader>
                                   <Badge variant="outline" className="w-fit text-primary border-primary/50 mb-2">{`0${index + 1}-bosqich`}</Badge>
                                   <CardTitle className="text-2xl font-bold text-dark-blue">{step.title}</CardTitle>
                                   <p className="text-gray-500 !mt-1">{step.subtitle}</p>
                               </CardHeader>
                               <CardContent>
                                   <div className="flex flex-wrap gap-2">
                                       {step.tasks.map(task => (
                                           <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-1">
                                               {task}
                                           </Badge>
                                       ))}
                                   </div>
                               </CardContent>
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
