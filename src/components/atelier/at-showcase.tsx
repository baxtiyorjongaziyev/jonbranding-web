'use client';

import { FC } from 'react';
import Image from 'next/image';
import type { ATShowcaseProps } from './types';

export const ATShowcase: FC<ATShowcaseProps> = ({ dictionary, onOpen, lang }) => {
  const items = [
    {
      img: '/images/cms/denaroma-hozir.webp',
      name: 'Den Aroma',
      yr: "'25",
      cat: 'Aydentika & Qadoq',
    },
    { img: '/images/cms/savod-hozir.webp', name: 'Savod', yr: "'25", cat: 'Brending' },
    { img: '/images/cms/fidda-hozir.webp', name: 'Fidda', yr: "'24", cat: 'Aydentika' },
    { img: '/images/cms/boyarin-hozir.webp', name: 'Boyarin', yr: "'24", cat: 'Qadoq dizayni' },
  ];

  return (
    <section className="showcase wrap">
      <div className="sc-strip-head">
        <span className="eb">
          <span className="dot" />
          <span>{dictionary?.showcase_title || "So'nggi 4 ta loyiha · 2023—2025"}</span>
        </span>
        <a
          href="#ishlar"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('ishlar')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="seemore"
        >
          {dictionary?.showcase_seemore || "Barchasini ko'rish — 120+"} <span>↗</span>
        </a>
      </div>
      <div className="showcase-inner">
        {items.map((it, i) => (
          <div key={i} className={`sc-card sc-${i + 1}`} onClick={onOpen}>
            <div
              className="body"
              style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
            >
              <Image
                src={it.img}
                alt={it.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="name">{it.name}</div>
            <div className="meta">
              <span>{it.cat}</span>
              <span className="yr">{it.yr}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
