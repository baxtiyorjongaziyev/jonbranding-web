
'use client';

import { Card, CardContent } from '@/components/ui/card';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { useEffect, useState } from 'react';
import { client, urlFor } from '@/sanity/lib/client';

interface SanityComparison {
  brand: string;
  oldImg: any;
  newImg: any;
  oldHint: string;
  newHint: string;
  order: number;
}

interface BeforeAfterProps {
  onCtaClick: () => void;
  lang: string;
  dictionary: any;
}

const DEFAULT_COMPARISONS: SanityComparison[] = [
  {
    brand: "Den Aroma",
    oldImg: "https://images.unsplash.com/photo-1583522676223-93740e630d74?q=80&w=800", // Perfume
    newImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800", // Office
    oldHint: "Oddiy ko'rinish",
    newHint: "Premium butik",
    order: 1
  },
  {
    brand: "Food Logistics",
    oldImg: "https://images.unsplash.com/photo-1586528116311-ad86d7c7ce80?q=80&w=800", // Warehouse
    newImg: "https://images.unsplash.com/photo-1566576721346-d4a3b4ea353a?q=80&w=800", // Logistics
    oldHint: "Eski logistika",
    newHint: "Zamonaviy ECO-tizim",
    order: 2
  },
  {
    brand: "Fashion House",
    oldImg: "https://images.unsplash.com/photo-1513506490281-05251d30717f?q=80&w=800", // Shop
    newImg: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800", // Visual ID
    oldHint: "Tizimsiz brend",
    newHint: "Yaxlit vizual uslub",
    order: 3
  }
];

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang, dictionary }) => {
  const [items, setItems] = useState<SanityComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const translations = dictionary;
  
  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const query = `*[_type == "comparison"] | order(order asc)`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch {
        // The local fallback keeps this conversion section usable if Sanity is unavailable.
      } finally {
        setLoading(false);
      }
    };
    fetchComparisons();
  }, []);

  const displayItems = items.length > 0 ? items : DEFAULT_COMPARISONS;

  if (!translations) return null;
  
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
            {translations.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, index) => {
            const isValidSanityImage = (img: any) => img && (typeof img === 'string' || img.asset);
            if (!isValidSanityImage(item.oldImg) || !isValidSanityImage(item.newImg)) return null;
            
            let beforeSrc = '';
            let afterSrc = '';
            try {
              beforeSrc = typeof item.oldImg === 'string' ? item.oldImg : urlFor(item.oldImg).url();
              afterSrc = typeof item.newImg === 'string' ? item.newImg : urlFor(item.newImg).url();
            } catch (e) {
              console.error('Invalid image source in before-after', e);
              return null;
            }
            return (
              <div
                key={index}
                className="liquid-glass liquid-glass-hover rounded-[2.5rem] overflow-hidden"
              >
                <ImageComparisonSlider
                  beforeImage={{ src: beforeSrc, alt: `${item.brand} old`, 'data-ai-hint': item.oldHint, unoptimized: true }}
                  afterImage={{ src: afterSrc, alt: `${item.brand} new`, 'data-ai-hint': item.newHint, unoptimized: true }}
                  lang={lang}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
