
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '../ui/badge';
import CtaBlock from './cta-block';
import { cn } from '@/lib/utils';

interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const ProcessCard = ({ title, description, tasks, phase }: {title: string, description: string, tasks: string[], phase: string}) => (
    <div className="w-[320px] md:w-[350px] flex-shrink-0 px-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">{phase}</span>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        <h3 className="mt-6 text-2xl md:text-3xl font-bold text-dark-blue">{title}</h3>
        <p className="mt-2 text-base text-gray-500 leading-relaxed">{description}</p>
        <div className="mt-8 flex flex-wrap gap-2">
            {tasks.map((task) => (
                <Badge key={task} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-4 py-1.5 text-sm rounded-full border-none">
                    {task}
                </Badge>
            ))}
        </div>
    </div>
);

const MobileProcessView = ({ phases, title, subtitle }: { phases: any[], title: string, subtitle: string }) => (
    <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">{title}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">{subtitle}</p>
        </div>
        <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            <div className="space-y-16">
                 {phases.map((phase) => (
                    <div key={phase.phase} className="relative pl-12">
                        <div className="absolute left-4 top-1 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md"></div>
                        <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                        <p className="mt-2 text-gray-500 leading-relaxed">{phase.description}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {phase.tasks.map((task: string) => (
                                <Badge key={task} variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/50 border-none">{task}</Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Process: React.FC<ProcessProps> = ({ onCtaClick, lang, dictionary }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const translations = dictionary;

  const x = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '-83.33%']);
  const ctaOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.9, 1], ["50px", "0px"]);

  if (!translations || !translations.phases) return null;

  return (
    <section id="process" className="bg-white">
        <div ref={targetRef} className="relative h-[450vh] hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-start overflow-hidden pt-40">
                <div className="w-full mb-10 px-4">
                    <div className="container mx-auto text-center">
                        <h2 className="text-5xl sm:text-6xl font-black text-dark-blue tracking-tighter">{translations.title}</h2>
                        <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-500 font-medium">{translations.subtitle}</p>
                    </div>
                </div>
                <div className="relative mt-12">
                    <motion.div style={{ x }} className="flex">
                        {translations.phases.map((phase: any, index: number) => (
                            <ProcessCard key={index} {...phase} />
                        ))}
                    </motion.div>
                </div>
                <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute bottom-0 left-0 right-0 z-10 bg-white">
                    <div className={cn(scrollYProgress.get() < 0.9 && "pointer-events-none")}>
                        <CtaBlock title={translations.ctaTitle} description={translations.ctaDesc} buttonText={translations.ctaButton} onCtaClick={onCtaClick} />
                    </div>
                </motion.div>
            </div>
        </div>
        <div className="lg:hidden py-24">
            <MobileProcessView phases={translations.phases} title={translations.title} subtitle={translations.subtitle} />
             <CtaBlock title={translations.ctaTitle} description={translations.ctaDesc} buttonText={translations.ctaButton} onCtaClick={onCtaClick} />
        </div>
    </section>
  );
};

export default Process;
