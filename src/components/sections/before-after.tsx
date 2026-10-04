'use client';

import { useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getLocalizedPath, locales, type Locale } from '@/lib/i18n/locale';
import type { BeforeAfterDictionary } from '@/lib/types/dictionary';

interface SanityComparison {
  brand: string;
  oldImg: string;
  newImg: string;
  order?: number;
}

interface BeforeAfterProps {
  lang: string;
  dictionary: BeforeAfterDictionary;
  comparisons?: SanityComparison[];
}

interface BrandCase {
  id: string;
  brand: string;
  slug: string;
  oldImg: string;
  newImg: string;
  order: number;
}

// Faqat haqiqiy oldin/keyin rasmlari. Raqamli "natija"lar (savdo %, ROAS, reyting)
// ataylab yo'q: ular tasdiqlanmagan edi. content-integrity testi qaytishiga yo'l qo'ymaydi.
const CASES: BrandCase[] = [
  { id: 'den-aroma', brand: 'Den Aroma', slug: 'den-aroma', oldImg: '/images/cms/denaroma-avval.webp', newImg: '/images/cms/denaroma-hozir.webp', order: 1 },
  { id: 'savod', brand: 'Savod', slug: 'savod', oldImg: '/images/cms/savod-avval.webp', newImg: '/images/cms/savod-hozir.webp', order: 2 },
  { id: 'fidda', brand: 'Fidda by Sevara', slug: 'fidda', oldImg: '/images/cms/fidda-avval.webp', newImg: '/images/cms/fidda-hozir.webp', order: 3 },
  { id: 'boyarin', brand: 'Boyarin', slug: 'boyarin', oldImg: '/images/cms/boyarin-avval.webp', newImg: '/images/cms/boyarin-hozir.webp', order: 4 },
];

/** Sanity'da shu brend uchun yangiroq rasmlar bo'lsa, ular ishlatiladi. */
function mergeWithCms(comparisons: SanityComparison[] = []): BrandCase[] {
  return CASES.map((item) => {
    const match = comparisons.find((c) => {
      const cms = c.brand?.toLowerCase() ?? '';
      const own = item.brand.toLowerCase();
      return cms !== '' && (cms.includes(own) || own.includes(cms));
    });
    if (!match) return item;
    return {
      ...item,
      oldImg: match.oldImg || item.oldImg,
      newImg: match.newImg || item.newImg,
      order: match.order ?? item.order,
    };
  }).sort((a, b) => a.order - b.order);
}

const BeforeAfter: FC<BeforeAfterProps> = ({ lang, dictionary, comparisons }) => {
  const cases = useMemo(() => mergeWithCms(comparisons), [comparisons]);
  const [activeId, setActiveId] = useState(cases[0]?.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const active = cases.find((c) => c.id === activeId) ?? cases[0];
  if (!active) return null;

  const safeLang: Locale = locales.includes(lang as Locale) ? (lang as Locale) : 'uz';
  const before = dictionary.beforeLabel ?? 'Avval';
  const after = dictionary.afterLabel ?? 'Keyin';
  // "Biznes o'sha. Taassurot boshqa." → ikkinchi gap xira rangda, yangi qatorda.
  const titleMatch = (dictionary.title ?? '').match(/^(.+?[.!?])\s+(.+)$/);
  const [titleLead, titleRest] = titleMatch ? [titleMatch[1], titleMatch[2]] : [dictionary.title ?? '', ''];

  // WAI-ARIA tabs: strelkalar bilan keyslar orasida yurish.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + cases.length) % cases.length;
    setActiveId(cases[next].id);
    tabRefs.current[next]?.focus();
  };

  // Tailwind'ning margin/padding sinflari `.atelier-theme *` reset'i tufayli bu yerda
  // ishlamaydi; stil `atelier.css`dagi `.ba-*` sinflarida (qo'shni bo'limlar kabi).
  return (
    <section id="do-posle" aria-labelledby="do-posle-title" className="sec">
      <div className="wrap">
        <header className="ba-head">
          <h2 id="do-posle-title">
            {titleLead}
            {titleRest && <span className="rest">{titleRest}</span>}
          </h2>
          {dictionary.subtitle && <p>{dictionary.subtitle}</p>}
        </header>

        <div className="ba-grid">
          <div role="tablist" aria-label={dictionary.casesLabel} className="ba-tabs">
            {cases.map((item, index) => {
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`do-posle-tab-${item.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="do-posle-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className="ba-tab"
                >
                  <span className="name">{item.brand}</span>
                  {dictionary.cases?.[item.id] && <span className="cat">{dictionary.cases[item.id]}</span>}
                </button>
              );
            })}
          </div>

          <div id="do-posle-panel" role="tabpanel" aria-labelledby={`do-posle-tab-${active.id}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="ba-pair"
              >
                <figure>
                  <div className="ba-frame before">
                    <Image
                      src={active.oldImg}
                      alt={`${active.brand}, ${before.toLowerCase()}`}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 721px) 40vw, 100vw"
                    />
                  </div>
                  <figcaption>{before}</figcaption>
                </figure>
                <figure>
                  <div className="ba-frame after">
                    <Image
                      src={active.newImg}
                      alt={`${active.brand}, ${after.toLowerCase()}`}
                      fill
                      sizes="(min-width: 1024px) 42vw, (min-width: 721px) 58vw, 100vw"
                    />
                  </div>
                  <figcaption className="on">{after}</figcaption>
                </figure>
              </motion.div>
            </AnimatePresence>

            {dictionary.viewCase && (
              <Link href={getLocalizedPath(safeLang, `/portfolio/${active.slug}`)} className="ba-link">
                {dictionary.viewCase.replace('{brand}', active.brand)}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
