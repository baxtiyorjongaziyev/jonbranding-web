
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const ProcessCard = ({ title, description, tasks, phase }: { title: string, description: string, tasks: string[], phase: string }) => (
    <BrandCard className="w-[320px] md:w-[450px] flex-shrink-0 p-8 transition-all mx-4">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-black text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">{phase}</span>
          <div className="h-px flex-grow bg-brand-line"></div>
        </div>
        <h3 className="text-2xl font-black text-brand-ink mb-3 tracking-[-0.03em]">{title}</h3>
        <p className="text-base text-brand-slate leading-relaxed mb-6">{description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
            {tasks?.map((task) => (
                <Badge key={task} variant="secondary" className="bg-white/70 text-brand-slate hover:bg-white font-medium px-3 py-1 text-xs rounded-full border border-brand-line">
                    {task}
                </Badge>
            ))}
        </div>
    </BrandCard>
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
    <BrandSection id="process" tone="light" className="relative overflow-visible p-0" suppressHydrationWarning>
      <div ref={targetRef} className="h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="container mx-auto px-4 mb-16">
            <SectionIntro eyebrow="Process OS" title={translations.title} description={translations.subtitle} />
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
    </BrandSection>
  );
};

export default Process;
