
'use client';

import { Card, CardContent } from '@/components/ui/card';
import CtaBlock from './cta-block';
import ImageComparisonSlider from '@/components/image-comparison-slider';

const comparisons = [
  { brand: "Fidda", oldImg: "https://img2.teletype.in/files/9c/66/9c66a85f-486c-4f54-9682-fb4838061ab2.jpeg", newImg: "https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png", oldHint: "old logo design", newHint: "modern new logo" },
  { brand: "Incontrol", oldImg: "https://img1.teletype.in/files/83/47/83479180-eeb6-4e39-9169-c4f4fb22e375.jpeg", newImg: "https://img2.teletype.in/files/17/9c/179c7811-8cf7-4ee9-87ad-66709208b115.png", oldHint: "outdated branding", newHint: "sleek professional branding" },
  { brand: "Barakah", oldImg: "https://img2.teletype.in/files/55/fe/55fe2252-db0f-4fd2-8ee8-d674bffab68a.png", newImg: "https://img2.teletype.in/files/dc/5c/dc5cd481-115e-4d57-ac2a-3ea3142e5f54.png", newHint: "generic restaurant logo", newHint: "unique restaurant branding" },
];

interface BeforeAfterProps {
  onCtaClick: () => void;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Avval va Hozir</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            To'g'ri brending biznesingizni qanday o'zgartirishi mumkinligini o'z ko'zingiz bilan ko'ring.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comparisons.map((item, index) => (
            <Card key={index} className="overflow-hidden shadow-lg rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-0">
                <ImageComparisonSlider 
                  beforeImage={{src: item.oldImg, alt: `${item.brand} eski brendingi`, 'data-ai-hint': item.oldHint}}
                  afterImage={{src: item.newImg, alt: `${item.brand} yangi brendingi`, 'data-ai-hint': item.newHint}}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <CtaBlock 
        title="Sizning brendingiz ham o'zgarishga tayyormi?"
        description="Keling, brendingizni tahlil qilib, uni yangi bosqichga olib chiqish rejasini tuzamiz."
        buttonText="Mening brendimni ham o'zgartiring"
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default BeforeAfter;
