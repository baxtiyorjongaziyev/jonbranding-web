'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, Ghost, TrendingDown, Tag, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const }
  }
};

const TargetAudience = ({ lang, dictionary }: { lang: string, dictionary: any }) => {
  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openContactModal'));
    }
  };
  
  const translations = dictionary;

  if (!translations || !translations.problems) return null;

  const icons = [Ghost, TrendingDown, Tag, BarChart];
  const problems = translations.problems || [];

  return (
    <section id="target-audience" className="py-14 sm:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 sm:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
          >
            {translations.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground font-medium"
          >
            {translations.subtitle}
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="max-w-5xl mx-auto"
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((problem: any, index: number) => {
                    const Icon = icons[index] || Ghost;
                    return (
                        <motion.div key={index} variants={itemVariants}>
                          <div className="premium-card p-8 flex items-start gap-6 group h-full">
                               <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500">
                                  <Icon className="h-7 w-7 text-red-500 group-hover:text-white" aria-hidden="true" />
                               </div>
                               <p className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{problem.text}</p>
                          </div>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] as const }}
           className="max-w-5xl mx-auto mt-16"
        >
          <div className="premium-card bg-primary p-12 sm:p-16 text-center text-white relative overflow-hidden group">
               {/* Background mesh for premium feel */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-50 group-hover:scale-110 transition-transform duration-1000" />
               
               <div className="relative z-10">
                  <h3 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">{translations.solutionTitle}</h3>
                  <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                     {translations.solutionSubtitle}
                  </p>
                  <Button 
                      onClick={handleOpenModal} 
                      size="lg" 
                      className="h-16 px-12 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-2xl text-base"
                  >
                      {translations.solutionButton} <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
               </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudience;