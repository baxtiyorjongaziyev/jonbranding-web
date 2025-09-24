
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const galleryImages = [
  { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/6747f48137e17a98411d6346_LOGO.gif', alt: 'Animatsion logo', hint: 'animated logo' },
  { src: 'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png', alt: 'Loyiha 4', hint: 'corporate style' },
  { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/67513d8fe1caee5495e0f9bd_ezgif-6-3f24b1faa6.gif', alt: 'Animatsion logo', hint: 'gif logo' },
  { src: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', alt: 'Loyiha 5', hint: 'brandbook example' },
  { src: 'https://img1.teletype.in/files/88/92/8892f18d-a298-485d-8fe5-7d0444defd89.png', alt: 'Loyiha 3', hint: 'branding identity' },
  { src: 'https://img2.teletype.in/files/19/49/1949747d-4381-489d-87bf-753a9fac573a.jpeg', alt: 'Loyiha 7', hint: 'website branding' },
  { src: 'https://img1.teletype.in/files/83/c2/83c2c300-af89-482e-8052-15189ac22aff.jpeg', alt: 'Loyiha 6', hint: 'logo concept' },
  { src: 'https://img2.teletype.in/files/51/45/5145b60e-aca5-4225-8564-a4d601a148a7.jpeg', alt: 'Loyiha 8', hint: 'minimalist logo' },
];

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
                        unoptimized={image.src.endsWith('.gif')}
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
                        unoptimized={image.src.endsWith('.gif')}
                        loading="lazy"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={image.hint}
                    />
                </Card>
            ))}
        </motion.div>
    </div>
);


const Gallery: React.FC = () => {
  const firstColumn = galleryImages.slice(0, 4);
  const secondColumn = galleryImages.slice(4);

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ishlarimizdan namunalar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Biz yaratgan brendlar o'z sohasida qanday ajralib turishini ko'ring.
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
