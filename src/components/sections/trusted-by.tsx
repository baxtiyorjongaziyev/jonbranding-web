import React from 'react';
import Image from 'next/image';
import { staticBrands } from '@/lib/static-data';
import { BrandSection } from '@/components/ui/design-system';
import { Marquee } from '@/components/ui/marquee';
import type { Brand } from '@/lib/types';

import { renderHeadline } from '@/lib/headline';

type TrustedByDictionary = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  metrics?: Array<{ value: string; label: string }>;
};

const defaultMetrics = [
  { value: '150+', label: 'Loyihalar' },
  { value: '9 yil', label: 'Tajriba' },
  { value: '30+', label: 'Soha' },
  { value: '4 til', label: 'Bozor tili' },
];

const TrustedBy: React.FC<{ lang: string; dictionary: TrustedByDictionary; brands?: Brand[] }> = ({ dictionary, brands: brandsProp }) => {
  const brands = (brandsProp ?? staticBrands).filter((brand) => !brand.hiddenInHero).slice(0, 18);
  const metrics = dictionary?.metrics?.length ? dictionary.metrics : defaultMetrics;

  if (!dictionary?.title) return null;

  return (
    <BrandSection tone="light" className="border-y border-brand-line/80 bg-white py-20 sm:py-24" aria-labelledby="trusted-by-title">
      <div className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            {dictionary.eyebrow && (
              <div className="jb-eyebrow mb-5">
                {dictionary.eyebrow}
              </div>
            )}
            <h2 id="trusted-by-title" className="max-w-2xl text-balance text-foreground">
              {typeof dictionary.title === 'string' ? renderHeadline(dictionary.title, 'text-brand-blue') : dictionary.title}
            </h2>
            {dictionary.subtitle && <p className="mt-5 max-w-xl text-base leading-8 text-brand-slate sm:text-lg">{dictionary.subtitle}</p>}
          </div>

          <div className="grid grid-cols-2 border-y border-brand-line sm:grid-cols-4 lg:border-y-0 lg:border-l">
            {metrics.map((metric) => (
              <div key={metric.label} className="border-brand-line px-4 py-5 sm:border-r lg:border-r-0 lg:border-l lg:py-3">
                <div className="font-headline text-2xl font-black tracking-normal text-brand-ink tabular-nums sm:text-3xl">{metric.value}</div>
                <div className="mt-2 text-[13px] font-bold uppercase tracking-normal text-brand-slate">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden border-y border-brand-line">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
          <Marquee pauseOnHover repeat={3} className="[--duration:54s] py-5">
            {brands.map((brand) => (
              <div key={brand.name} className="mx-2 flex h-16 w-36 shrink-0 items-center justify-center border-r border-brand-line px-5 py-3 transition-opacity duration-200 hover:opacity-100 sm:w-40">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={120}
                    height={48}
                    loading="lazy"
                    className="max-h-9 max-w-full object-contain grayscale opacity-70 transition-all duration-200 hover:grayscale-0 hover:opacity-100"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <span className="text-center text-sm font-extrabold text-brand-slate">{brand.name}</span>
                )}
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </BrandSection>
  );
};

export default TrustedBy;
