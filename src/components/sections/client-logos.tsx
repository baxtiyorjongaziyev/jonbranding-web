'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FC } from 'react';
import { staticBrands } from '@/lib/static-data';

const names = ['Rash Milk', 'Goodwell', 'Rahimov School', 'Savod'];
const brands = [
  ...names.map((name) => staticBrands.find((brand) => brand.name === name)),
  ...staticBrands.filter((brand) => !names.includes(brand.name) && !brand.hiddenInHero),
].filter((brand) => brand !== undefined && brand.logo);
const rows = [0, 1, 2].map((row) => brands.filter((_, index) => index % 3 === row));

const ClientLogos: FC<{ title: string; pauseLabel: string; resumeLabel: string }> = ({ title, pauseLabel, resumeLabel }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-label={title} className="client-logos overflow-hidden py-10 md:py-14" data-running={visible && !paused}>
      <h2 className="mb-6 px-5 text-center text-sm font-medium text-[var(--at-muted)]">{title}</h2>
      <div className="space-y-5 md:space-y-7">
        {rows.map((row, index) => (
          <div key={index} className="client-logos-row overflow-hidden" data-direction={index === 1 ? 'right' : 'left'}>
            <div className="client-logos-track">
              {[false, true].map((clone) => (
                <div key={String(clone)} className={`client-logos-group${clone ? ' client-logos-clone' : ''}`} aria-hidden={clone || undefined}>
                  {row.map((brand) => brand?.logo && (
                    <div key={brand.name} className="flex h-20 w-36 shrink-0 items-center justify-center md:h-24 md:w-44">
                      <Image src={brand.logo} alt={clone ? '' : brand.name} width={180} height={100} sizes="(max-width: 767px) 144px, 176px" className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center motion-reduce:hidden">
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="min-h-11 rounded-full px-5 text-xs text-[var(--at-ink-2)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--at-accent)]">
          {paused ? resumeLabel : pauseLabel}
        </button>
      </div>
    </section>
  );
};

export default ClientLogos;
