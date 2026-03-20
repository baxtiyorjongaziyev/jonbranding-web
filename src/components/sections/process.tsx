
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';

interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const ProcessCard = ({ title, description, tasks, phase }: { title: string, description: string, tasks: string[], phase: string }) => (
    <div className="w-[320px] md:w-[450px] flex-shrink-0 bg-secondary/30 p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-all mx-4">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{phase}</span>
          <div className="h-px flex-grow bg-primary/10"></div>
        </div>
        <h3 className="text-2xl font-bold text-dark-blue mb-3">{title}</h3>
        <p className="text-base text-gray-600 leading-relaxed mb-6">{description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
            {tasks?.map((task) => (
                <Badge key={task} variant="secondary" className="bg-white/50 text-gray-700 hover:bg-gray-200 font-medium px-3 py-1 text-xs rounded-full border-none">
                    {task}
                </Badge>
            ))}
        </div>
    </div>
);

const Process: React.FC<ProcessProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  if (!translations || !translations.phases) return null;

  return (
    <section id="process" className="relative bg-white overflow-visible" suppressHydrationWarning>
      <div ref={targetRef} className="h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="container mx-auto px-4 mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-blue tracking-tighter">
              {translations.title}
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-500 font-medium">
              {translations.subtitle}
            </p>
          </div>

          <div className="flex items-center w-full">
            <motion.div style={{ x }} className="flex px-[10vw]">
              {translations.phases.map((phase: any, index: number) => (
                <ProcessCard key={index} {...phase} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <CtaBlock 
        title={translations.ctaTitle} 
        description={translations.ctaDesc} 
        buttonText={translations.ctaButton} 
        onCtaClick={onCtaClick} 
      />
    </section>
  );
};

export default Process;
