
'use client';

import { FileText, Search, Target, Pencil, Send, ClipboardSignature } from 'lucide-react';
import CtaBlock from './cta-block';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';


const steps = [
  {
    icon: FileText,
    title: "Brief",
    description: "Sizning maqsadingiz, kutgan natijalaringiz va biznesingiz haqida ma'lumot to'playmiz."
  },
  {
    icon: ClipboardSignature,
    title: "Shartnoma va Kelishuv",
    description: "Loyiha shartlarini kelishib olamiz, shartnoma imzolaymiz va oldindan to'lovni qabul qilamiz."
  },
  {
    icon: Search,
    title: "Tahlil",
    description: "Bozorni, raqobatchilarni va maqsadli auditoriyangizni chuqur o'rganamiz."
  },
  {
    icon: Target,
    title: "Strategiya",
    description: "Tahlil natijalariga asosan brendingiz uchun yo'l xaritasini ishlab chiqamiz."
  },
  {
    icon: Pencil,
    title: "Dizayn",
    description: "Strategiyaga asoslangan holda vizual elementlarni (logo, uslub) yaratamiz."
  },
  {
    icon: Send,
    title: "Topshirish",
    description: "Barcha tayyor materiallarni sizga taqdim etamiz va qo'llab-quvvatlaymiz."
  },
];

interface ProcessProps {
  onCtaClick: () => void;
}

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start']
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-83.33%"]); // 100% / 6 steps * 5 moves = 83.33%
  const progressBarWidth = useTransform(scrollYProgress, [0.1, 0.9], ['16.66%', '100%']);

  return (
    <section id="process" className="bg-white">
        <div className="container mx-auto px-4 pt-16 sm:pt-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Bizning ish jarayonimiz</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                Har bir loyihada muvaffaqiyatni ta'minlaydigan sinovdan o'tgan bosqichli tizim.
            </p>
        </div>

        <div ref={targetRef} className="relative h-[400vh] mt-12">
            <div className="sticky top-1/4 flex items-center overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-gray-200 hidden lg:block">
                    <motion.div 
                        className="h-full bg-primary"
                        style={{ width: progressBarWidth }}
                    />
                </div>
                <motion.div style={{ x }} className="flex">
                    {steps.map((step, index) => (
                        <div key={index} className="flex-shrink-0 w-screen lg:w-[33.33vw] px-8 md:px-12">
                            <div className="relative text-left lg:text-center max-w-sm mx-auto p-8 rounded-2xl">
                                <div className="flex items-center lg:justify-center gap-4">
                                    <div className="relative z-10 flex-shrink-0">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md border-2 border-gray-100">
                                            <step.icon className="h-10 w-10 text-primary" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-sm z-20">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-blue lg:hidden">{step.title}</h3>
                                </div>

                                <div className="mt-4 text-left lg:text-center">
                                    <h3 className="hidden lg:block text-xl font-bold text-dark-blue">{step.title}</h3>
                                    <p className="mt-2 text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>

      <CtaBlock 
        title="Jarayon bilan tanishdingizmi? Endi natijaga o'tish vaqti!"
        description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
        buttonText="Keling, birinchi qadamni tashlaymiz!"
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default Process;
