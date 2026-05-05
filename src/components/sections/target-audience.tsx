'use client';

import { ArrowRight, Ghost, TrendingDown, Tag, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }
};

const TargetAudience = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      const contactEvent = new CustomEvent('openContactModal');
      window.dispatchEvent(contactEvent);
    }
  };
  
  const translations = dictionary;

  if (!translations || !translations.problems) return null;

  const icons = [Ghost, TrendingDown, Tag, BarChart];
  const problems = translations.problems || [];

  return (
    <BrandSection id="target-audience" tone="soft">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Brand diagnosis"
          title={translations.title}
          description={translations.subtitle}
        />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="mt-12 max-w-5xl mx-auto"
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((problem: any, index: number) => {
                    const Icon = icons[index] || Ghost;
                    return (
                        <motion.div key={index} variants={itemVariants}>
                          <BrandCard className="p-6 h-full transition-transform duration-300 hover:-translate-y-1">
                               <div className="flex items-start gap-4">
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                  </div>
                                  <p className="text-base font-semibold leading-7 text-brand-ink">{problem.text}</p>
                              </div>
                          </BrandCard>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto mt-8 bg-brand-ink text-white p-8 sm:p-10 rounded-[2rem] shadow-2xl overflow-hidden relative text-center border border-white/10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(58,225,255,0.24),transparent_32rem)]" />
               <div className="relative z-10">
                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-white">{translations.solutionTitle}</h3>
                  <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
                     {translations.solutionSubtitle}
                  </p>
                   <div className="mt-8 flex justify-center">
                       <Button 
                          onClick={handleOpenModal} 
                          size="lg" 
                          variant="default"
                          className="rounded-2xl shadow-lg bg-white text-brand-ink hover:bg-brand-lime"
                          aria-label={translations.solutionButton}
                      >
                          {translations.solutionButton} <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                  </div>
               </div>
          </div>
        </motion.div>
      </div>
    </BrandSection>
  );
};

export default TargetAudience;
