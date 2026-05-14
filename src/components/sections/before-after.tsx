'use client';

import ImageComparisonSlider from '@/components/image-comparison-slider';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';

interface SanityComparison {
  brand: string;
  oldImg: string;
  newImg: string;
  oldHint: string;
  newHint: string;
  order: number;
}

interface BeforeAfterProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
  comparisons?: SanityComparison[];
}

const DEFAULT_COMPARISONS: SanityComparison[] = [
  {
    brand: "Den Aroma",
    oldImg: "https://images.unsplash.com/photo-1583522676223-93740e630d74?q=80&w=800",
    newImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
    oldHint: "Oddiy ko'rinish",
    newHint: "Premium butik",
    order: 1
  },
  {
    brand: "Food Logistics",
    oldImg: "https://images.unsplash.com/photo-1586528116311-ad86d7c7ce80?q=80&w=800",
    newImg: "https://images.unsplash.com/photo-1566576721346-d4a3b4ea353a?q=80&w=800",
    oldHint: "Eski logistika",
    newHint: "Zamonaviy ECO-tizim",
    order: 2
  },
  {
    brand: "Fashion House",
    oldImg: "https://images.unsplash.com/photo-1513506490281-05251d30717f?q=80&w=800",
    newImg: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800",
    oldHint: "Tizimsiz brend",
    newHint: "Yaxlit vizual uslub",
    order: 3
  }
];

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang, dictionary, comparisons }) => {
  const translations = dictionary;
  const displayItems = comparisons && comparisons.length > 0 ? comparisons : DEFAULT_COMPARISONS;

  if (!translations) return null;

  return (
    <BrandSection tone="light" className="relative">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Proof"
          title={translations.title}
          description={translations.subtitle}
        />

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
          {displayItems.map((item, index) => {
            if (typeof item.oldImg !== 'string' || typeof item.newImg !== 'string') return null;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-brand-line bg-white shadow-[0_8px_40px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="p-1.5">
                  <ImageComparisonSlider
                    beforeImage={{ src: item.oldImg, alt: `${item.brand} old`, 'data-ai-hint': item.oldHint || '', unoptimized: true }}
                    afterImage={{ src: item.newImg, alt: `${item.brand} new`, 'data-ai-hint': item.newHint || '', unoptimized: true }}
                    lang={lang}
                  />
                </div>
                <div className="px-5 pb-5 pt-3">
                  <p className="text-sm font-black text-brand-ink">{item.brand}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrandSection>
  );
};

export default BeforeAfter;
