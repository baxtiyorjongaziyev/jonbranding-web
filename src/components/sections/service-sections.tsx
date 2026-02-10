'use client';

import { FC, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ScanText, Package, Paintbrush, Fingerprint, Book } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';

const serviceIcons: { [key: string]: React.ElementType } = {
    'naming': ScanText,
    'logo-dizayni': Fingerprint,
    'firmenniy-stil': Paintbrush,
    'brandbook': Book,
    'qadoq-dizayni': Package,
};

const ServiceSections: FC<{ lang: string }> = ({ lang }) => {
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang as Locale).then(dict => setTranslations(dict.serviceSections));
    }, [lang]);

    if (!translations) {
        return (
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                    Bu blokda nima bor edi?
                </div>
            </section>
        );
    }

    const orderedServices = [
        translations.services.find((s: any) => s.id === 'naming'),
        translations.services.find((s: any) => s.id === 'logo-dizayni'),
        translations.services.find((s: any) => s.id === 'firmenniy-stil'),
        translations.services.find((s: any) => s.id === 'brandbook'),
        translations.services.find((s: any) => s.id === 'qadoq-dizayni'),
    ].filter(Boolean);
    
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {orderedServices.map((service: any) => {
                        const Icon = serviceIcons[service.id] || Paintbrush;
                        return (
                             <Card key={service.id} className="group relative flex flex-col text-center shadow-lg rounded-2xl bg-secondary/50 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 max-w-sm mx-auto">
                                <CardContent className="p-8 flex flex-col items-center flex-grow">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-blue">{service.title}</h3>
                                    <p className="text-gray-600 mt-2 flex-grow">{service.description}</p>
                                    <Button asChild variant="ghost" className="mt-6 text-primary hover:text-primary">
                                        <Link href={`/${lang}/xizmatlar/${service.id}`}>
                                            {service.buttonText}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServiceSections;
