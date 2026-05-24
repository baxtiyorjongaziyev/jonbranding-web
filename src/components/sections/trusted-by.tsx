import React from 'react';
import Image from 'next/image';
import { staticBrands } from '@/lib/static-data';
import { BrandSection } from '@/components/ui/design-system';
import { Marquee } from '@/components/ui/marquee';

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

const TrustedBy: React.FC<{ lang: string; dictionary: TrustedByDictionary }> = ({ dictionary }) => {
  const brands = staticBrands.filter((brand) => !brand.hiddenInHero).slice(0, 18);
  const metrics = dictionary?.metrics?.length ? dictionary.metrics : defaultMetrics;

  if (!dictionary?.title) return null;

  return (
    <BrandSection tone="light" className="border-y border-brand-line/80 bg-brand-paper py-16 sm:py-20" aria-labelledby="trusted-by-title">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            {dictionary.eyebrow && (
              <div className="jb-eyebrow mb-4">
                {dictionary.eyebrow}
              </div>
            )}
            <h2 id="trusted-by-title" className="max-w-xl text-balance text-3xl font-black tracking-normal text-brand-ink sm:text-5xl">
              {dictionary.title}
            </h2>
            {dictionary.subtitle && <p className="mt-5 max-w-xl text-base leading-8 text-brand-slate sm:text-lg">{dictionary.subtitle}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="jb-warm-panel px-4 py-5">
                <div className="text-2xl font-black tracking-normal text-brand-ink sm:text-3xl">{metric.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-normal text-brand-slate">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-brand-line shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-paper to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-paper to-transparent" />
          <Marquee pauseOnHover repeat={3} className="[--duration:50s] py-3">
            {brands.map((brand) => (
              <div key={brand.name} className="mx-3 flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-brand-line bg-white px-5 py-4 transition-colors duration-200 hover:bg-brand-mist/70">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={120}
                    height={48}
                    loading="lazy"
                    className="max-h-10 max-w-full object-contain grayscale transition-all duration-200 hover:grayscale-0"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <span className="text-center text-sm font-black text-brand-slate">{brand.name}</span>
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
