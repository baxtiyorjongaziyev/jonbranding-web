'use client';

import { Target, ListChecks, Star } from 'lucide-react';
import CtaBlock from './cta-block';
import TiltCard from '@/components/ui/tilt-card';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

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
  
  if (!translations) {
    return null;
  }

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const event = new CustomEvent('openContactModal');
      window.dispatchEvent(event);
    }
  };
  
  const values = [
      { icon: Target, ...translations.values[0] },
      { icon: ListChecks, ...translations.values[1] },
      { icon: Star, ...translations.values[2] }
  ];
  
  return (
    <>
    <BrandSection tone="light">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Jon.Branding system"
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
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
             <motion.div key={index} variants={itemVariants} className="h-full">
               <TiltCard strength={10} className="h-full">
                  <BrandCard className="h-full p-7 text-center transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center">
                      <div className="bg-brand-blue/10 p-4 rounded-2xl ring-1 ring-brand-blue/15">
                        <value.icon className="w-8 h-8 text-brand-blue" />
                      </div>
                      <h3 className="mt-5 text-xl font-black tracking-[-0.02em] text-brand-ink">{value.title}</h3>
                      <p className="mt-3 text-brand-slate leading-7">{value.description}</p>
                    </div>
                  </BrandCard>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </BrandSection>
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
