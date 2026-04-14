'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, Ghost, TrendingDown, Tag, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
    <section id="target-audience" className="snap-section py-0 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="mt-12 max-w-4xl mx-auto"
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((problem: any, index: number) => {
                    const Icon = icons[index] || Ghost;
                    return (
                        <motion.div key={index} variants={itemVariants}>
                          <Card className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border-none h-full">
                               <div className="flex items-start gap-4">
                                  <Icon className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" aria-hidden="true" />
                                  <p className="text-base font-medium text-gray-800">{problem.text}</p>
                              </div>
                          </Card>
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
          <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-primary to-dark-blue text-white p-8 rounded-2xl shadow-xl overflow-hidden relative text-center border-none">
               <div className="relative z-10">
                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-white">{translations.solutionTitle}</h3>
                  <p className="mt-4 text-blue-200 text-lg max-w-2xl mx-auto">
                     {translations.solutionSubtitle}
                  </p>
                   <div className="mt-8 flex justify-center">
                       <Button 
                          onClick={handleOpenModal} 
                          size="lg" 
                          variant="default"
                          className="rounded-full shadow-lg"
                          aria-label={translations.solutionButton}
                      >
                          {translations.solutionButton} <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                  </div>
               </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudience;