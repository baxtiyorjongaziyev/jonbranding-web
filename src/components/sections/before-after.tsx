
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

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onCtaClick, lang, dictionary }) => {
  const [items, setItems] = useState<SanityComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const translations = dictionary;
  
  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const query = `*[_type == "comparison"] | order(order asc)`;
        const data = await client.fetch(query);
        setItems(data);
      } catch (error) {
        console.error('Error fetching Sanity comparisons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComparisons();
  }, []);

  if (!translations) return null;
  
  return (
    <section className="snap-section py-24 bg-white overflow-hidden relative">
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
          {loading ? (
            // Skeleton loader or empty state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] rounded-[2.5rem] bg-secondary/20 animate-pulse" />
            ))
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div 
                key={index} 
                className="liquid-glass liquid-glass-hover rounded-[2.5rem] overflow-hidden"
              >
                <ImageComparisonSlider 
                  beforeImage={{
                    src: urlFor(item.oldImg).url(), 
                    alt: `${item.brand} old`, 
                    'data-ai-hint': item.oldHint
                  }}
                  afterImage={{
                    src: urlFor(item.newImg).url(), 
                    alt: `${item.brand} new`, 
                    'data-ai-hint': item.newHint
                  }}
                  lang={lang}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-secondary/10 rounded-[2.5rem] border-2 border-dashed border-muted">
              <p className="text-muted-foreground">Hozircha loyihalar yuklanmagan. Sanity Studio orqali loyiha qo'shing.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
