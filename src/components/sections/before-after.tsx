
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
    oldImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop", // Generic perfume
    newImg: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop", // Premium boutique
    oldHint: "Oddiy ko'rinish",
    newHint: "Premium butik",
    order: 1
  },
  {
    brand: "Food Logistics",
    oldImg: "https://images.unsplash.com/photo-1586528116311-ad86d7c7ce80?q=80&w=800&auto=format&fit=crop", // Generic warehouse
    newImg: "https://images.unsplash.com/photo-1519055214515-ecba3542247b?q=80&w=800&auto=format&fit=crop", // High-tech logistics
    oldHint: "Eski logistika",
    newHint: "Zamonaviy ECO-tizim",
    order: 2
  },
  {
    brand: "Fashion House",
    oldImg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", // Generic shop
    newImg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=800&auto=format&fit=crop", // Visual identity
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
      } catch (error) {
        console.error('Error fetching Sanity comparisons:', error);
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
            const beforeSrc = typeof item.oldImg === 'string' ? item.oldImg : urlFor(item.oldImg).url();
            const afterSrc = typeof item.newImg === 'string' ? item.newImg : urlFor(item.newImg).url();
            return (
              <div
                key={index}
                className="liquid-glass liquid-glass-hover rounded-[2.5rem] overflow-hidden"
              >
                <ImageComparisonSlider
                  beforeImage={{ src: beforeSrc, alt: `${item.brand} old`, 'data-ai-hint': item.oldHint }}
                  afterImage={{ src: afterSrc, alt: `${item.brand} new`, 'data-ai-hint': item.newHint }}
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
