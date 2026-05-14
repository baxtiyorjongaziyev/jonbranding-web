'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

interface ProcessProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const ProcessCard = ({ title, description, tasks, phase }: { title: string, description: string, tasks: string[], phase: string }) => (
  <div className="mx-3 w-[300px] flex-shrink-0 rounded-3xl border border-brand-line bg-white p-7 shadow-[0_8px_40px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:w-[420px] md:p-8">
    <div className="mb-5 flex items-center gap-3">
      <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">{phase}</span>
      <div className="h-px flex-grow bg-brand-line" />
    </div>
    <h3 className="text-xl font-black tracking-tight text-brand-ink md:text-2xl">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-brand-slate">{description}</p>
    <div className="mt-6 flex flex-wrap gap-2">
      {tasks?.map((task) => (
        <Badge key={task} variant="secondary" className="rounded-full border border-brand-line bg-brand-mist px-3 py-1 text-xs font-medium text-brand-slate">
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

  const processProof =
    lang === 'uz'
      ? ['Avval diagnostika', 'Keyin strategiya', 'So\'ng vizual tizim', 'Oxirida qo\'llash yo\'riqnomasi']
      : lang === 'ru'
        ? ['Сначала диагностика', 'Потом стратегия', 'Затем визуальная система', 'В конце инструкция внедрения']
        : lang === 'zh'
          ? ['先诊断', '再策略', '再视觉系统', '最后交付使用指南']
          : ['Diagnose first', 'Strategy next', 'Visual system after', 'Usage guide at the end'];

  return (
    <BrandSection id="process" tone="light" className="relative overflow-visible p-0" suppressHydrationWarning>
      <div ref={targetRef} className="h-[300vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="container mx-auto mb-12 px-4">
            <SectionIntro eyebrow="Process" title={translations.title} description={translations.subtitle} />
            <div className="mx-auto mt-8 grid max-w-4xl gap-2 rounded-2xl border border-brand-line bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:grid-cols-4">
              {processProof.map((item, index) => (
                <div key={item} className="rounded-xl bg-brand-mist/60 px-3 py-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue">0{index + 1}</div>
                  <div className="mt-1 text-xs font-bold text-brand-ink">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center">
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
