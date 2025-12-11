
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';


const galleryImages: GalleryImage[] = projects.flatMap(p => p.galleryImages);

const MarqueeColumn = ({ images, animationClass }: { images: typeof galleryImages, animationClass: string }) => (
    <div className="flex flex-col gap-6">
        <motion.div className={`flex flex-col gap-6 ${animationClass}`}>
            {images.map((image, index) => (
                <Card key={index} className="overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={400}
                        unoptimized={image.unoptimized}
                        loading="lazy"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={image.hint}
                    />
                </Card>
            ))}
        </motion.div>
        <motion.div className={`flex flex-col gap-6 ${animationClass}`} aria-hidden="true">
            {images.map((image, index) => (
                <Card key={`duplicate-${index}`} className="overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={400}
                        unoptimized={image.unoptimized}
                        loading="lazy"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={image.hint}
                    />
                </Card>
            ))}
        </motion.div>
    </div>
);


const Gallery: React.FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
  const translations = dictionary;
  // To make the columns more balanced
  const midPoint = Math.ceil(galleryImages.length / 2);
  const firstColumn = galleryImages.slice(0, midPoint);
  const secondColumn = galleryImages.slice(midPoint);
  
  if (!translations) return null;

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-12 relative h-[800px] overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-4">
            <MarqueeColumn images={firstColumn} animationClass="animate-marquee-down" />
            <MarqueeColumn images={secondColumn} animationClass="animate-marquee-up" />
         </div>
         <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-secondary to-transparent z-10" />
         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary to-transparent z-10" />
      </div>
    </section>
  );
};

export default Gallery;
