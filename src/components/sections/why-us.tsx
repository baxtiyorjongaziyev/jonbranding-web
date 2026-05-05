'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ListChecks, Star } from 'lucide-react';
import CtaBlock from './cta-block';
import TiltCard from '@/components/ui/tilt-card';
import { FC, useEffect, useState } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }
};


interface WhyUsProps {
  onCtaClick?: () => void;
  lang: string;
  dictionary: any;
}


const WhyUs: FC<WhyUsProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  
  if (!translations) return null;

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      window.dispatchEvent(new CustomEvent('openContactModal'));
    }
  };
  
  const values = [
      { icon: Target, ...translations.values[0] },
      { icon: ListChecks, ...translations.values[1] },
      { icon: Star, ...translations.values[2] }
  ];
  
  return (
    <>
    <section className="py-24 sm:py-32 bg-slate-50/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard strength={5} className="h-full">
                <div className="premium-card h-full p-10 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                    <value.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-6 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    {value.description}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={handleCta}
      />
    </>
  );
};

export default WhyUs;
