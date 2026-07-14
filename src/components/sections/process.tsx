'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import type { ProcessDictionary } from '@/lib/types/dictionary';

interface ProcessProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: ProcessDictionary;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 160,
    },
  },
};

const Process: React.FC<ProcessProps> = ({ dictionary }) => {
  const translations = dictionary;

  if (!translations || !translations.phases) return null;

  const processProof = translations.proofItems || [];

  return (
    <BrandSection id="process" tone="light" className="overflow-hidden bg-white py-12 sm:py-20" suppressHydrationWarning>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
          <motion.div variants={itemVariants} className="lg:sticky lg:top-28">
            <SectionIntro eyebrow={translations.eyebrow} title={translations.title} description={translations.subtitle} align="left" />
            {processProof.length > 0 && (
              <div className="mt-8 grid grid-cols-2 border-y border-brand-line sm:mt-10">
                {processProof.map((item: string, index: number) => (
                  <div key={item} className="border-brand-line px-1 py-4 odd:border-r sm:px-4 sm:py-5">
                    <div className="font-mono text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue tabular-nums">0{index + 1}</div>
                    <div className="mt-2 text-sm font-extrabold leading-5 text-brand-ink">{item}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {(translations.phases ?? []).map((phase, index: number) => (
              <div key={index} className="group relative grid gap-4 border-t border-brand-line py-6 first:border-t-0 md:grid-cols-[4.5rem_1fr] md:py-8">
                <div className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-line/60 bg-white/80 text-sm font-black text-brand-blue shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-[background-color,color,transform,border-color] duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white sm:h-12 sm:w-12">
                    0{index + 1}
                  </div>
                  <div className="min-w-0 rounded-3xl border border-transparent bg-[#fbfbfd] p-4 transition-[background-color,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-line/60 group-hover:bg-white sm:p-7 shadow-sm group-hover:shadow-md">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <h3 className="text-xl font-black leading-tight tracking-tight text-brand-ink sm:text-2xl lg:text-3xl">{phase.title}</h3>
                      {phase.badge && <Badge variant="outline" className="rounded-full border-brand-line bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-slate">{phase.badge}</Badge>}
                    </div>
                    <p className="mt-2.5 max-w-2xl text-sm leading-7 text-brand-slate sm:mt-3 sm:text-base">{phase.description}</p>
                    {phase.steps && (
                      <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
                        {phase.steps.map((step: string) => (
                          <li key={step} className="flex items-start gap-2.5 rounded-2xl bg-white/85 px-4.5 py-3 text-sm font-semibold leading-6 text-brand-slate border border-brand-line/50 shadow-sm">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
            ))}
          </motion.div>
        </div>

      </motion.div>
    </BrandSection>
  );
};

export default Process;
