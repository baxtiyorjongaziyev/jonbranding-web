'use client';

import { Target, ListChecks, Star, ShieldCheck } from 'lucide-react';
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

  const proofPoints =
    lang === 'uz'
      ? ['Strategiyasiz logo chizmaymiz', 'Har qaror biznes maqsadga boglanadi', 'Bepul tahlilda sotishga tosqinlik qilayotgan 3 nuqtani aytamiz']
      : lang === 'ru'
        ? ['Не рисуем логотип без стратегии', 'Каждое решение связано с бизнес-целью', 'На бесплатном анализе покажем 3 точки, которые мешают продажам']
        : lang === 'zh'
          ? ['不脱离策略做标志', '每个设计决策都连接业务目标', '免费分析指出阻碍销售的 3 个问题']
          : ['No logo without strategy', 'Every decision connects to a business goal', 'Free brand analysis reveals 3 sales blockers'];
  
  return (
    <BrandSection tone="light" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-blue/5 blur-[120px]" />
      
      <div className="container relative z-10 mx-auto px-4">
        <SectionIntro eyebrow="Why Jon.Branding" title={translations.title} description={translations.subtitle} />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <BrandCard className="group h-full p-8 text-center">
                  <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-all duration-500 group-hover:rotate-3 group-hover:bg-brand-blue group-hover:text-white">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-black tracking-[-0.03em] text-brand-ink">
                    {value.title}
                  </h3>
                  <p className="text-base font-medium leading-7 text-brand-slate">
                    {value.description}
                  </p>
              </BrandCard>
            </motion.div>
          ))}
        </div>

        <BrandCard className="mx-auto mt-8 grid max-w-5xl gap-3 p-4 md:grid-cols-3">
          {proofPoints.map((point) => (
            <div key={point} className="flex items-center gap-3 rounded-2xl bg-brand-mist/70 px-4 py-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" />
              <span className="text-sm font-bold leading-5 text-brand-ink">{point}</span>
            </div>
          ))}
        </BrandCard>
      </div>
    </BrandSection>
  );
};

export default WhyUs;
