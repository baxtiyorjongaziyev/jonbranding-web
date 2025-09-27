
'use client';

import { Card, CardContent } from '@/components/ui/card';
import CtaBlock from './cta-block';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { projects } from '@/lib/static-data';

const comparisons = projects.filter(p => p.oldImg && p.newImg);

interface BeforeAfterProps {
  onCtaClick: () => void;
  lang: string;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang }) => {
  const t = {
    uz: {
      title: "Avval va Hozir",
      subtitle: "To'g'ri brending biznesingizni qanday o'zgartirishi mumkinligini o'z ko'zingiz bilan ko'ring.",
      ctaTitle: "Sizning brendingiz ham o'zgarishga tayyormi?",
      ctaDesc: "Keling, brendingizni tahlil qilib, uni yangi bosqichga olib chiqish rejasini tuzamiz.",
      ctaButton: "Mening brendimni ham o'zgartiring"
    },
    ru: {
      title: "До и После",
      subtitle: "Убедитесь сами, как правильный брендинг может преобразить ваш бизнес.",
      ctaTitle: "Ваш бренд тоже готов к переменам?",
      ctaDesc: "Давайте проанализируем ваш бренд и составим план по его выводу на новый уровень.",
      ctaButton: "Измените и мой бренд тоже"
    }
  }
  const translations = lang === 'ru' ? t.ru : t.uz;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{translations.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            {translations.subtitle}
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
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={onCtaClick}
      />
    </section>
  );
};

export default BeforeAfter;
