
'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ScanText, Package, Paintbrush, Fingerprint, Book, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const serviceIcons: { [key: string]: React.ElementType } = {
    'neyming': ScanText,
    'logo-dizayni': Fingerprint,
    'firmenniy-stil': Paintbrush,
    'brandbook': Book,
    'qadoq-dizayni': Package,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1] 
    }
  }
};

interface ServiceSectionsProps {
    lang: string;
    dictionary?: any;
}

const ServiceSections: FC<ServiceSectionsProps> = ({ lang, dictionary: initialDictionary }) => {
    const [dictionary, setDictionary] = useState<any>(initialDictionary);

    useEffect(() => {
        if (!initialDictionary && lang) {
            getDictionary(lang as Locale).then(dict => {
                setDictionary(dict.serviceSections || dict);
            });
        } else if (initialDictionary) {
            setDictionary(initialDictionary);
        }
    }, [lang, initialDictionary]);

    if (!dictionary || (!dictionary.services && !dictionary.serviceSections?.services)) {
        return (
            <BrandSection tone="soft">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </BrandSection>
        );
    }

    const services = dictionary?.services || dictionary?.serviceSections?.services || [];

    const orderedServices = [
        services.find((s: any) => s.id === 'neyming'),
        services.find((s: any) => s.id === 'logo-dizayni'),
        services.find((s: any) => s.id === 'firmenniy-stil'),
        services.find((s: any) => s.id === 'brandbook'),
        services.find((s: any) => s.id === 'qadoq-dizayni'),
    ].filter(Boolean);
    
    const servicePromise =
        lang === 'uz'
            ? ['Tushunarli natija', 'Biznes maqsadga boglangan yechim', 'Keyingi qadam aniq']
            : lang === 'ru'
              ? ['Понятный результат', 'Решение связано с бизнес-целью', 'Следующий шаг ясен']
              : lang === 'zh'
                ? ['结果清晰', '方案连接业务目标', '下一步明确']
                : ['Clear outcome', 'Business-linked solution', 'Obvious next step'];

    return (
        <BrandSection tone="soft">
            <div className="container mx-auto px-4">
                <SectionIntro
                  eyebrow="Services system"
                  title={dictionary.title || dictionary.serviceSections?.title || 'Xizmatlarimiz'}
                  description={dictionary.subtitle || dictionary.serviceSections?.subtitle || 'Logo, naming, strategiya va brandbook alohida emas - bitta biznes tizim sifatida ishlaydi.'}
                />
                <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
                  {servicePromise.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-full border border-brand-line bg-white/75 px-4 py-3 text-sm font-black text-brand-ink">
                      <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                      {item}
                    </div>
                  ))}
                </div>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {orderedServices.map((service: any) => {
                        const Icon = serviceIcons[service.id] || Paintbrush;
                        const accessibilityLabel = `${service.title} xizmati haqida batafsil ma'lumot`;
                        return (
                             <motion.article key={service.id} variants={itemVariants}>
                                 <BrandCard className="group relative flex h-full flex-col overflow-hidden p-8">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                                            <Icon className="h-7 w-7" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-[-0.03em] text-brand-ink">{service.title}</h3>
                                        <p className="mt-3 flex-grow text-base leading-7 text-brand-slate">{service.description}</p>
                                        <Button asChild variant="ghost" className="mt-6 justify-start px-0 text-brand-blue hover:bg-transparent hover:text-brand-ink">
                                            <Link href={`/${lang}/xizmatlar/${service.id}`} aria-label={accessibilityLabel}>
                                                {service.buttonText || "Batafsil"}
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                                            </Link>
                                        </Button>
                                </BrandCard>
                             </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </BrandSection>
    );
};

export default ServiceSections;
