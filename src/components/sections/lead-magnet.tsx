
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, Film, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';
import type { LeadMagnetDictionary } from '@/lib/types/dictionary';

interface LeadMagnetProps {
    onCtaClick: () => void;
    lang: string;
    dictionary: LeadMagnetDictionary;
}

const LeadMagnet: FC<LeadMagnetProps> = ({ onCtaClick, lang, dictionary }) => {
  const translations = dictionary;
  
  if (!translations) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'pdf': return FileText;
      case 'quiz': return ListChecks;
      case 'video': return Film;
      default: return FileText;
    }
  };

  const handleClick = (magnet: NonNullable<LeadMagnetDictionary['magnets']>[number]) => {
    if (magnet.action === 'onCtaClick') {
      onCtaClick();
    } else if (magnet.href?.startsWith('#')) {
        const elementId = magnet.href.substring(1);
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <BrandSection id="lead-magnet" tone="soft">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="Free resources" title={translations.title} description={translations.subtitle} />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {(translations.magnets ?? []).map((magnet) => {
            const Icon = getIcon(magnet.id);
            const isLink = magnet.href && !magnet.href.startsWith('#');
            const buttonContent = (
              <>
                {magnet.id === 'quiz' ? <ListChecks className="w-4 h-4 mr-2" /> : magnet.id === 'pdf' ? <FileText className="w-4 h-4 mr-2" /> : <Film className="w-4 h-4 mr-2" />}
                {magnet.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            );

            return (
              <BrandCard key={magnet.id} className="group relative flex flex-col text-center overflow-hidden p-6 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex flex-col items-center pb-4">
                  <div className="bg-brand-blue/10 p-4 rounded-2xl ring-1 ring-brand-blue/15">
                    <Icon className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-brand-ink">{magnet.title}</h3>
                  <p className="mt-2 px-4 font-bold text-brand-blue">{magnet.subtitle}</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <p className="text-brand-slate mb-6 leading-7">{magnet.description}</p>
                  {isLink ? (
                      <Link href={(magnet.href ?? '').replace('{lang}', lang)} passHref>
                          <Button asChild className="w-full rounded-2xl bg-brand-ink hover:bg-brand-blue shadow-none">
                            <span>{buttonContent}</span>
                          </Button>
                      </Link>
                  ) : (
                      <Button onClick={() => handleClick(magnet)} className="w-full rounded-2xl bg-brand-ink hover:bg-brand-blue shadow-none">
                          {buttonContent}
                      </Button>
                  )}
                </div>
              </BrandCard>
            )
          })}
        </div>
      </div>
    </BrandSection>
    </>
  );
};

export default LeadMagnet;
