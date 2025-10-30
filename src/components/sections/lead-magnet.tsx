
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, Film, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ChecklistModal from '@/components/checklist-modal';

interface LeadMagnetProps {
    onCtaClick: () => void;
    lang: string;
    dictionary: any;
}

const LeadMagnet: FC<LeadMagnetProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  const [isChecklistOpen, setChecklistOpen] = useState(false);
  
  if (!translations) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'pdf': return FileText;
      case 'quiz': return ListChecks;
      case 'video': return Film;
      default: return FileText;
    }
  };

  const handleClick = (magnet: any) => {
    if (magnet.id === 'pdf') {
        setChecklistOpen(true);
    } else if (magnet.action === 'onCtaClick') {
      onCtaClick();
    } else if (magnet.href?.startsWith('#')) {
        const elementId = magnet.href.substring(1);
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <section id="lead-magnet" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {translations.title}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {translations.magnets.map((magnet: any) => {
            const Icon = getIcon(magnet.id);
            
            return (
              <Card key={magnet.id} className="flex flex-col text-center shadow-lg rounded-2xl hover:shadow-xl transition-shadow bg-secondary/50">
                <CardHeader className="items-center pb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="!mt-4 text-xl">{magnet.title}</CardTitle>
                  <CardDescription className="font-bold text-primary !mt-1 px-4">{magnet.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                  <p className="text-gray-600 mb-6">{magnet.description}</p>
                  {magnet.href && !magnet.href.startsWith('#') ? (
                      <Link href={magnet.href} passHref>
                          <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                            <span>
                                {magnet.id === 'quiz' ? <ListChecks className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                                {magnet.cta}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </span>
                          </Button>
                      </Link>
                  ) : (
                      <Button onClick={() => handleClick(magnet)} className="w-full shadow-md hover:shadow-lg transition-shadow">
                          {magnet.id === 'video' ? <Film className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                          {magnet.cta}
                          {magnet.id === 'pdf' && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
    <ChecklistModal lang={lang} isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
    </>
  );
};

export default LeadMagnet;
