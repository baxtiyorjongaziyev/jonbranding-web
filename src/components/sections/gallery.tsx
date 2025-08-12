import Image from 'next/image';
import { Card } from '@/components/ui/card';

const galleryImages = [
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 1', hint: 'modern logo design' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 2', hint: 'branding identity' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 3', hint: 'corporate style' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 4', hint: 'brandbook example' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 5', hint: 'logo concept' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 6', hint: 'website branding' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 7', hint: 'minimalist logo' },
  { src: 'https://placehold.co/600x400.png', alt: 'Loyiha 8', hint: 'app icon design' },
];

const Gallery = () => {
  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Ishlarimizdan namunalar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Biz yaratgan brendlar o'z sohasida qanday ajralib turishini ko'ring.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index} className="overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={image.hint}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
