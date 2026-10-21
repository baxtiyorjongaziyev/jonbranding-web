'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioYear } from '@/lib/portfolio-presentation';
import { CASE_CATEGORY_LABELS, caseBrandName, caseCategoryLabel } from '@/lib/case-naming';

export interface ATGalleryProject {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category?: string;
  city?: string;
  industry?: string;
  coverImage: string;
  results?: { metric: string; value: string }[];
  featured?: boolean;
  order?: number;
  publishedAt?: string;
}

export interface ATGalleryProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
  projects?: ATGalleryProject[];
}

const TILE_CLASSES = ['t-1', 't-2', 't-3', 't-4', 't-5'];

const getCategoryLabel = caseCategoryLabel;

function getFirstResult(project: ATGalleryProject): string {
  if (project.results && project.results.length > 0) {
    return project.results[0].value;
  }
  return '';
}

export const ATGallery: FC<ATGalleryProps> = ({ dictionary, onOpen, lang, projects = [] }) => {
  const [filter, setFilter] = useState('all');

  const items = projects
    .filter((p) => p.coverImage)
    .map((p, i) => ({
      cls: TILE_CLASSES[i % TILE_CLASSES.length],
      img: p.coverImage,
      name: caseBrandName(p.title),
      yr: portfolioYear(p.publishedAt),
      city: p.city || '',
      cat: getCategoryLabel(p.category, lang),
      res: getFirstResult(p),
      category: p.category,
      slug: p.slug,
    }));

  const filters = [
    { id: 'all', l: dictionary.gallery_filters.all },
    ...Object.keys(CASE_CATEGORY_LABELS.uz)
      .filter((category) => items.some((item) => item.category === category))
      .map((category) => ({ id: category, l: dictionary.gallery_filters[category] })),
  ];

  const tiles = filter === 'all' ? items : items.filter((t) => t.category === filter);

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
              <span>{dictionary.gallery_label}</span>
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
              type="button"
              aria-pressed={filter === f.id}
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
              key={t.slug}
              href={`/${lang}/portfolio/${t.slug}`}
              className={`gal-tile ${t.cls}`}
            >
              <div
                className="body"
                style={{ overflow: 'hidden' }}
              >
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  quality={75}
                  priority={i < 2}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  unoptimized={t.img.startsWith('https://cdn.sanity.io/')}
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(5,7,15,0.45) 0%, transparent 30%)',
                  }}
                />
              </div>
              <div className="head">
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white/80">{t.cat}</span>
                {t.city && <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white/50">{t.city}</span>}
              </div>
              <div className="arr">↗</div>
              <div className="foot">
                <div className="name">{t.name}</div>
                <div className="meta">
                  <span>{t.cat}</span>
                  {t.res && (
                    <span className="res">
                      {t.res}{t.yr ? ` · ${t.yr}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {tiles.length === 0 && (
          <p role="status" className="py-8">{dictionary.gallery_empty}</p>
        )}
        <div className="mt-8 flex justify-center">
          <Link className="btn btn-primary" href={lang === 'uz' ? '/portfolio' : `/${lang}/portfolio`}>
            {dictionary.gallery_view_all}<span aria-hidden="true"> →</span>
          </Link>
        </div>
        {filter !== 'all' && tiles.length > 0 && (
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
