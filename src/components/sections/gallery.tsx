
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

const galleryImages: GalleryImage[] = projects.flatMap(p => p.galleryImages);

const MarqueeColumn = ({ images, animationClass }: { images: typeof galleryImages, animationClass: string }) => (
    <div className="flex flex-col gap-6">
        <motion.div className={`flex flex-col gap-6 ${animationClass}`}>
            {images.map((image, index) => (
                <BrandCard key={index} className="overflow-hidden group rounded-2xl p-0 transition-all duration-300">
                    {image.src && (
                        <Image
                            src={image.src}
                            alt={image.alt || 'Jon Branding project'}
                            width={600}
                            height={400}
                            unoptimized={image.unoptimized}
                            loading="lazy"
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.hint}
                        />
                    )}
                </BrandCard>
            ))}
        </motion.div>
        <motion.div className={`flex flex-col gap-6 ${animationClass}`} aria-hidden="true">
            {images.map((image, index) => (
                <BrandCard key={`duplicate-${index}`} className="overflow-hidden group rounded-2xl p-0 transition-all duration-300">
                    {image.src && (
                        <Image
                            src={image.src}
                            alt={image.alt || 'Jon Branding project'}
                            width={600}
                            height={400}
                            unoptimized={image.unoptimized}
                            loading="lazy"
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={image.hint}
                        />
                    )}
                </BrandCard>
            ))}
        </motion.div>
    </div>
);

const Gallery: React.FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
  const translations = dictionary;
  if (!translations) return null;

  const midPoint = Math.ceil(galleryImages.length / 2);
  const firstColumn = galleryImages.slice(0, midPoint);
  const secondColumn = galleryImages.slice(midPoint);
  const proofLabels =
    lang === 'uz'
      ? ['Logo', 'Qadoq', 'Brandbook', 'Sotuvchi vizual tizim']
      : lang === 'ru'
        ? ['Логотип', 'Упаковка', 'Брендбук', 'Продающая визуальная система']
        : lang === 'zh'
          ? ['标志', '包装', '品牌手册', '销售型视觉系统']
          : ['Logo', 'Packaging', 'Brandbook', 'Sales-ready identity'];

  return (
    <BrandSection id="portfolio" tone="soft" className="overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="Portfolio wall" title={translations.title} description={translations.subtitle} />
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
          {proofLabels.map((label) => (
            <span key={label} className="brand-badge bg-white/75">
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 relative h-[calc(100svh-260px)] overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-4">
            <MarqueeColumn images={firstColumn} animationClass="animate-marquee-down" />
            <MarqueeColumn images={secondColumn} animationClass="animate-marquee-up" />
         </div>
         <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-mist to-transparent z-10" />
         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-mist to-transparent z-10" />
      </div>
    </BrandSection>
  );
};

export default Gallery;
