'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ScanText, Package, Paintbrush, Fingerprint, Book } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary, Locale } from '@/lib/dictionaries';

const serviceIcons: { [key: string]: React.ElementType } = {
    'neyming': ScanText,
    'logo-dizayni': Fingerprint,
    'firmenniy-stil': Paintbrush,
    'brandbook': Book,
    'qadoq-dizayni': Package,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
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
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
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
    
    return (
        <section className="py-16 sm:py-24 bg-white" aria-label="Xizmatlar bo'limi">
            <div className="container mx-auto px-4">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
                >
                    {orderedServices.map((service: any) => {
                        const Icon = serviceIcons[service.id] || Paintbrush;
                        const accessibilityLabel = `${service.title} xizmati haqida batafsil ma'lumot`;
                        return (
                             <motion.div key={service.id} variants={itemVariants}>
                                 <Card className="group relative flex flex-col text-center shadow-lg rounded-2xl bg-secondary/50 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 max-w-sm mx-auto border-none h-full">
                                    <CardContent className="p-8 flex flex-col items-center flex-grow">
                                        <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-xl font-bold text-dark-blue">{service.title}</h3>
                                        <p className="text-gray-600 mt-2 flex-grow">{service.description}</p>
                                        <Button asChild variant="ghost" className="mt-6 text-primary hover:text-primary hover:bg-primary/5">
                                            <Link href={`/${lang}/xizmatlar/${service.id}`} aria-label={accessibilityLabel}>
                                                {service.buttonText || "Batafsil"}
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                             </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceSections;
