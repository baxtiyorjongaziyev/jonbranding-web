
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';

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
    }
];

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", `calc(-100% + 100vw)`]);

    return (
    <>
        <section ref={targetRef} id="process" className="relative h-[300vh] bg-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Bizning ish jarayonimiz</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
                            </p>
                        </div>
                    </div>
                </div>

                <motion.div style={{ x }} className="flex gap-8 pl-16">
                    {processSteps.map((step, index) => (
                        <div key={index} className="flex-shrink-0 w-[90vw] lg:w-[35vw] pr-8">
                            <div className="bg-secondary/70 p-8 rounded-2xl h-full">
                                <h3 className="text-2xl font-bold text-dark-blue">{step.title}</h3>
                                <p className="text-gray-500 mt-1">{step.subtitle}</p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {step.tasks.map(task => (
                                        <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">
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
        
        <div className='bg-white'>
            <CtaBlock 
              title="Jarayon bilan tanishdingizmi? Endi natijaga o'tish vaqti!"
              description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
              buttonText="Keling, birinchi qadamni tashlaymiz!"
              onCtaClick={onCtaClick}
            />
        </div>
    </>
    );
};

export default Process;
