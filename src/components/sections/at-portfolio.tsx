'use client';
import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PortfolioItem {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  coverImage: string;
  description: string;
  results?: { metric: string; value: string }[];
}

interface Props {
  projects: PortfolioItem[];
  lang?: string;
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    label: 'Portfolio · Tanlangan ishlar',
    viewAll: 'Barcha ishlar ↗',
    viewCase: 'Keysni ko\'rish',
  },
  ru: {
    label: 'Портфолио · Избранные работы',
    viewAll: 'Все работы ↗',
    viewCase: 'Смотреть кейс',
  },
  en: {
    label: 'Portfolio · Selected works',
    viewAll: 'All works ↗',
    viewCase: 'View case',
  },
  zh: {
    label: '作品集 · 精选案例',
    viewAll: '所有作品 ↗',
    viewCase: '查看案例',
  },
} as const;

const OFFSETS = ['md:translate-y-6', '', 'md:translate-y-10', 'md:translate-y-2'];

const AtPortfolio: FC<Props> = ({ projects, lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const items = projects.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="pb-[88px] pt-6 relative z-[2]" id="portfolio">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3.5">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-muted)] inline-block" />
            {l.label}
          </span>
          <Link
            href={`/${lang}/portfolio`}
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-ink-2)] hover:text-[var(--at-accent)] border-b border-[var(--at-line)] hover:border-[var(--at-accent)] pb-0.5 transition-colors"
          >
            {l.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {items.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link
                href={`/${lang}/portfolio/${project.slug}`}
                className={`block relative rounded-2xl overflow-hidden border border-[var(--at-line)] group transition-transform duration-500 hover:-translate-y-2 ${OFFSETS[i]}`}
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

                <div
                  className="absolute top-3 left-3 right-3 font-[family-name:var(--font-serif)] italic text-base z-[3]"
                  style={{ color: 'rgba(255,255,255,.95)', textShadow: '0 1px 3px rgba(0,0,0,.5)' }}
                >
                  {project.title}
                </div>
                <div
                  className="absolute left-3 right-3 bottom-3 flex justify-between items-end font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] z-[3]"
                  style={{ color: 'rgba(255,255,255,.85)' }}
                >
                  <span className="line-clamp-1">{project.client}</span>
                  <span className="opacity-65">{l.viewCase}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtPortfolio;
