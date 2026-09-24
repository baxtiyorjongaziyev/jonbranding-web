'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ATGalleryProps } from './types';
import { TILE_CLASSES, getCategoryLabel, getFirstResult, getYear } from './utils';

export const ATGallery: FC<ATGalleryProps> = ({ dictionary, onOpen, lang, projects = [] }) => {
  const [filter, setFilter] = useState('all');

  const items = projects
    .filter((p) => p.coverImage)
    .map((p, i) => ({
      cls: TILE_CLASSES[i % TILE_CLASSES.length],
      img: p.coverImage,
      name: p.title,
      yr: getYear(p),
      city: p.city || '',
      cat: getCategoryLabel(p.category, lang),
      res: getFirstResult(p),
      ind: p.industry || 'food',
      slug: p.slug,
    }));

  const filters = [
    {
      id: 'all',
      l: lang === 'uz' ? 'Hammasi' : lang === 'ru' ? 'Все' : lang === 'zh' ? '全部' : 'All',
    },
    {
      id: 'food',
      l: lang === 'uz' ? 'Oziq-ovqat' : lang === 'ru' ? 'Еда' : lang === 'zh' ? '食品' : 'Food',
    },
    { id: 'fmcg', l: 'FMCG' },
    { id: 'fintech', l: 'Fintech' },
    {
      id: 'fashion',
      l: lang === 'uz' ? 'Moda' : lang === 'ru' ? 'Мода' : lang === 'zh' ? '时尚' : 'Fashion',
    },
  ];

  const tiles = filter === 'all' ? items : items.filter((t) => t.ind === filter);

  if (items.length === 0) return null;

  return (
    <section className="gal" id="ishlar">
      <div className="wrap">
        <div className="sec-head">
          <h2
            dangerouslySetInnerHTML={{
              __html: (
                dictionary?.gallery_title || 'Tanlangan<br/><span class="it">ishlar.</span>'
              ).replace(/\n/g, '<br/>'),
            }}
          />
          <div className="lede">
            <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
              <span className="dot" />
              <span className="ix">§ 03</span>
              <span>{dictionary?.nav?.[1]?.label || 'Portfolio'}</span>
            </span>
            <p>
              {dictionary?.gallery_lede ||
                '2023—2025 davrida tanlangan loyihalar. Har biri real biznes, real qadoq, real natija. Sohaga qarab filterlang.'}
            </p>
          </div>
        </div>
        <div className="ind-filter">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`ind-pill ${filter === f.id ? 'on' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="gal-grid">
          {tiles.map((t, i) => (
            <Link
              key={t.name}
              href={`/${lang}/portfolio/${t.slug}`}
              className={`gal-tile ${t.cls}`}
            >
              <div
                className="body"
                style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
              >
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  quality={85}
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 100vw"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(5,7,15,0.5) 0%, transparent 30%, transparent 60%, rgba(5,7,15,0.7) 100%)',
                  }}
                />
              </div>
              <div className="head">
                <span>№ {String(i + 1).padStart(2, '0')}</span>
                <span>{t.city}</span>
              </div>
              <div className="arr">↗</div>
              <div className="foot">
                <div className="name">{t.name}</div>
                <div className="meta">
                  <span>{t.cat}</span>
                  {t.res && (
                    <span className="res">
                      {t.res} · {t.yr}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filter !== 'all' && (
          <div
            style={{
              marginTop: 32,
              padding: '20px 28px',
              borderRadius: 14,
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 15 }}>
              {dictionary?.gallery_similar ||
                "O'xshash biznesmisiz? Sizga ham shunday natija mumkin."}
            </span>
            <button className="btn btn-primary" onClick={onOpen}>
              {dictionary?.gallery_cta || 'Mening biznesim uchun tashxis'}{' '}
              <span className="ar">↗</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
