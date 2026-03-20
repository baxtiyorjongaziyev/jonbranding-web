
'use client';

import { Badge } from '@/components/ui/badge';
import React from 'react';
import CtaBlock from './cta-block';

interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const ProcessCard = ({ title, description, tasks, phase }: { title: string, description: string, tasks: string[], phase: string }) => (
    <div className="min-w-[320px] md:min-w-[400px] snap-center flex-shrink-0 bg-secondary/30 p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-all">
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

  if (!translations || !translations.phases) return null;

  return (
    <section id="process" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-blue tracking-tighter">
            {translations.title}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-500 font-medium">
            {translations.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar">
          {translations.phases.map((phase: any, index: number) => (
            <ProcessCard key={index} {...phase} />
          ))}
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
