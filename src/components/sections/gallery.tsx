import Image from 'next/image';
import { Card } from '@/components/ui/card';
import CtaBlock from './cta-block';

const galleryImages = [
  { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/6747f48137e17a98411d6346_LOGO.gif', alt: 'Animatsion logo', hint: 'animated logo' },
  { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/67513d8fe1caee5495e0f9bd_ezgif-6-3f24b1faa6.gif', alt: 'Animatsion logo', hint: 'gif logo' },
  { src: 'https://img1.teletype.in/files/88/92/8892f18d-a298-485d-8fe5-7d0444defd89.png', alt: 'Loyiha 3', hint: 'branding identity' },
  { src: 'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png', alt: 'Loyiha 4', hint: 'corporate style' },
  { src: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', alt: 'Loyiha 5', hint: 'brandbook example' },
  { src: 'https://img1.teletype.in/files/83/c2/83c2c300-af89-482e-8052-15189ac22aff.jpeg', alt: 'Loyiha 6', hint: 'logo concept' },
  { src: 'https://img2.teletype.in/files/19/49/1949747d-4381-489d-87bf-753a9fac573a.jpeg', alt: 'Loyiha 7', hint: 'website branding' },
  { src: 'https://img2.teletype.in/files/51/45/5145b60e-aca5-4225-8564-a4d601a148a7.jpeg', alt: 'Loyiha 8', hint: 'minimalist logo' },
];

interface GalleryProps {
    onCtaClick: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onCtaClick }) => {
  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">Ishlarimizdan namunalar</h2>
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
                unoptimized={image.src.endsWith('.gif')}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={image.hint}
              />
            </Card>
          ))}
        </div>
      </div>
       <CtaBlock 
            title="Sizning brendingiz ham shunday ko'rinishga ega bo'lishi mumkin."
            description="Professional dizayn orqali biznesingizni yangi cho'qqilarga olib chiqing. Biznesingiz uchun mos yechimni topishga yordam beramiz."
            buttonText="Bunday natija mening biznesim uchun ham kerak"
            onCtaClick={onCtaClick}
        />
    </section>
  );
};

export default Gallery;
