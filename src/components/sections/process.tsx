'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

interface ProcessProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: any;
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

const Process: React.FC<ProcessProps> = ({ onCtaClick, dictionary }) => {
  const translations = dictionary;

  if (!translations || !translations.phases) return null;

  const processProof = translations.proofItems || [];

  return (
    <BrandSection id="process" tone="light" className="bg-[#fbfaf7] py-20 sm:py-28 overflow-hidden" suppressHydrationWarning>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container mx-auto px-4"
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div variants={itemVariants} className="lg:sticky lg:top-28">
            <SectionIntro eyebrow={translations.eyebrow} title={translations.title} description={translations.subtitle} align="left" />
            {processProof.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2">
                {processProof.map((item: string, index: number) => (
                  <div key={item} className="rounded-xl border border-brand-line bg-white px-4 py-3 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">0{index + 1}</div>
                    <div className="mt-1 text-sm font-black text-brand-ink">{item}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid gap-4">
            {translations.phases.map((phase: any, index: number) => (
              <motion.div 
                key={phase.title || index} 
                variants={itemVariants}
                className="group grid gap-5 rounded-2xl border border-brand-line bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.05)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.09)] sm:grid-cols-[120px_1fr_auto] sm:items-start sm:p-6"
              >
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-ink text-sm font-black text-white">
                    0{index + 1}
                  </div>
                  <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue">{phase.phase}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-brand-ink">{phase.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-brand-slate">{phase.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {phase.tasks?.map((task: string) => (
                      <Badge key={task} variant="secondary" className="rounded-full border border-brand-line bg-brand-mist px-3 py-1 text-xs font-bold text-brand-slate">
                        {task}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-brand-slate/35 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-blue sm:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {processProof.length > 0 && (
          <div className="mt-10 grid gap-3 rounded-2xl border border-brand-line bg-white p-4 sm:grid-cols-4">
            {processProof.map((item: string) => (
              <div key={item} className="flex items-center gap-2 text-sm font-black text-brand-ink">
                <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                {item}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <CtaBlock
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={onCtaClick}
        ctaSection="process"
        ctaSource="homepage"
      />
    </BrandSection>
  );
};

export default Process;
