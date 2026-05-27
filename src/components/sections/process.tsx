'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import type { ProcessDictionary } from '@/lib/types/dictionary';

interface ProcessProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: ProcessDictionary;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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
    <BrandSection id="process" tone="light" className="overflow-hidden bg-[#fbfaf7] py-20 sm:py-28" suppressHydrationWarning>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div variants={itemVariants} className="lg:sticky lg:top-28">
            <SectionIntro eyebrow={translations.eyebrow} title={translations.title} description={translations.subtitle} align="left" />
            {processProof.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2">
                {processProof.map((item: string, index: number) => (
                  <div key={item} className="border-t border-brand-line px-1 py-4">
                    <div className="font-mono text-[10px] font-extrabold uppercase tracking-normal text-brand-blue tabular-nums">0{index + 1}</div>
                    <div className="mt-1 text-sm font-bold text-brand-ink">{item}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {(translations.phases ?? []).map((phase, index: number) => (
              <div key={index} className="rounded-[1.25rem] border border-brand-line bg-white/82 p-5 shadow-[0_20px_65px_rgba(35,41,55,0.055)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-lime text-sm font-extrabold text-brand-ink">
                    0{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-brand-ink">{phase.title}</h3>
                      {phase.badge && <Badge variant="outline" className="text-[10px]">{phase.badge}</Badge>}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-brand-slate">{phase.description}</p>
                    {phase.steps && (
                      <ul className="mt-3 space-y-1.5">
                        {phase.steps.map((step: string) => (
                          <li key={step} className="flex items-start gap-2 text-sm text-brand-slate">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
