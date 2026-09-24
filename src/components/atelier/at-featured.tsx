'use client';

import { FC } from 'react';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import type { ATFeaturedProps } from './types';

export const ATFeatured: FC<ATFeaturedProps> = ({ dictionary, comparison, lang }) => {
  const c = dictionary?.featured || {
    name: 'Den Aroma',
    city: 'Samarqand',
    year: '2025',
    cat: 'Neyming · Aydentika · Qadoq · Tovar belgisi',
    story:
      "Samarqanddagi mahalliy kofexona. Eski nom shevali va eslab qolinmaydigan edi. Yangi nom — joy va o'zbek qushini birga olib keldi. Qadoq, menyu va interyer bir uslubda yangilandi.",
    metrics: [
      { n: '+41%', l: 'Sotuv 3 oyda' },
      { n: '3×', l: 'Takroriy mijozlar' },
      { n: '2', l: 'Yangi filial' },
    ],
  };

  const comp = comparison || {
    brand: 'Den Aroma',
    oldImg: '/images/cms/denaroma-avval.webp',
    newImg: '/images/cms/denaroma-hozir.webp',
    oldHint: '3 Atirchi (Eski brending)',
    newHint: 'Den Aroma (Yangi brending)',
  };

  return (
    <section className="feat" id="ishlar">
      <div className="feat-inner">
        <div
          className="feat-img"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
          }}
        >
          <div className="tag" style={{ zIndex: 20 }}>
            <span>
              {dictionary?.featured_title || 'Asosiy keys'} · {c.year}
            </span>
            <span className="live">{dictionary?.featured_live || 'Davom etmoqda'}</span>
          </div>
          <div style={{ width: '100%', maxWidth: '480px', margin: 'auto' }}>
            <ImageComparisonSlider
              beforeImage={{
                src: comp.oldImg,
                alt: `${comp.brand} old`,
              }}
              afterImage={{
                src: comp.newImg,
                alt: `${comp.brand} new`,
              }}
              lang={lang}
            />
          </div>
        </div>
        <div className="feat-body">
          <span className="eb">
            <span className="dot" />
            <span>
              {dictionary?.featured_title || 'Asosiy keys'} · {c.year}
            </span>
          </span>
          <h2 className="feat-title">
            {c.name}
            <br />
            <span className="it">{c.city}.</span>
          </h2>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'rgba(244,241,232,.55)',
              letterSpacing: '.06em',
              textTransform: 'uppercase',
            }}
          >
            {c.cat}
          </div>
          <p className="feat-story">{c.story}</p>
          <div className="feat-metrics">
            {(c.metrics || []).map((m: any, i: number) => (
              <div key={i} className="feat-metric">
                <div className="n">{m.n}</div>
                <div className="l">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── SHOWCASE STRIP ────────────────────────────── */
interface ATShowcaseProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
}
