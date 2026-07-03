'use client';

import { motion } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { projects } from '@/lib/static-data';
import { trackEvent } from '@/lib/analytics';
import { renderHeadline } from '@/lib/headline';

interface SanityComparison {
  brand: string;
  oldImg: string;
  newImg: string;
  oldHint: string;
  newHint: string;
  order: number;
  services?: string[];
}

interface BeforeAfterDictionary {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  ctaButton?: string;
  caseLabel?: string;
  proofCards?: Array<{ value: string; label: string }>;
}

interface BeforeAfterProps {
  lang: string;
  dictionary: BeforeAfterDictionary & { beforeAfter?: BeforeAfterDictionary };
  comparisons?: SanityComparison[];
}

const SERVICE_MAPPING: Record<string, string[]> = {
  'Incontrol': ['Logo Dizayni', 'Aydentika'],
  'Barakah': ['Logotip', 'Brendbuk', 'Qadoq'],
  'Fidda by Sevara': ['Neyming', 'Logo & Aydentika'],
};

const DEFAULT_COMPARISONS: SanityComparison[] = projects
  .filter((project) => project.oldImg && project.newImg)
  .map((project, index) => ({
    brand: project.brand,
    oldImg: project.oldImg,
    newImg: project.newImg,
    oldHint: project.oldHint || '',
    newHint: project.newHint || '',
    order: index + 1,
    services: SERVICE_MAPPING[project.brand] || ['Logo Dizayni', 'Brending'],
  }));

const BeforeAfter: React.FC<BeforeAfterProps> = ({ lang, dictionary, comparisons }) => {
  // O'z bo'limi kaliti bilan ham, to'liq lug'at bilan ham ishlaydi
  const t = (dictionary?.title ? dictionary : dictionary?.beforeAfter) || {};
  const displayItems = comparisons && comparisons.length > 0 ? comparisons : DEFAULT_COMPARISONS;

  const handleCtaClick = () => {
    trackEvent({
      action: 'cta_click',
      category: 'CTA',
      label: t.cta || t.ctaButton || 'before_after',
      section: 'before_after',
    });
    window.dispatchEvent(new CustomEvent('openContactModal', {
      detail: {
        section: 'before_after',
        ctaText: t.cta || t.ctaButton,
        source: 'homepage',
      },
    }));
  };

  if (!displayItems || displayItems.length === 0) return null;

  return (
    <section style={{ background: 'var(--at-bg)', borderTop: '1px solid var(--at-line)' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '88px 32px' }}>

        {/* Header */}
        <div className="at-ba-head" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 64,
          alignItems: 'end',
          marginBottom: 44,
        }}>
          <div>
            {t.eyebrow && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--at-muted)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--at-green)', display: 'inline-block' }} />
                § {t.eyebrow}
              </span>
            )}

            <h2 style={{
              fontSize: 'clamp(30px, 3.8vw, 52px)',
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              fontWeight: 800,
              margin: '16px 0 0',
              color: 'var(--at-ink)',
            }}>
              {renderHeadline(t.title ?? '', '')}
            </h2>
          </div>

          <div>
            {t.subtitle && (
              <p style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: 'var(--at-ink-2)',
                margin: '0 0 24px',
              }}>
                {t.subtitle}
              </p>
            )}

            {t.proofCards?.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {t.proofCards.map((card) => (
                  <div key={card.label} style={{ borderTop: '1px solid var(--at-line)', paddingTop: 14 }}>
                    <div style={{
                      fontSize: 24, fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: 'var(--at-ink)',
                    }}>{card.value}</div>
                    <div style={{
                      marginTop: 4,
                      fontFamily: 'var(--font-mono)', fontSize: 9.5,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: 'var(--at-muted)',
                    }}>{card.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Cards: mobilda swipe, desktopda 2x2 grid */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:snap-none">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.brand || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (idx % 2) * 0.08 }}
              className="w-[85vw] shrink-0 snap-center md:w-auto md:shrink"
              style={{
                background: 'var(--at-paper)',
                border: '1px solid var(--at-line)',
                borderRadius: 20,
                padding: 10,
              }}
            >
              <ImageComparisonSlider
                beforeImage={{
                  src: item.oldImg,
                  alt: `${item.brand} — ${lang === 'uz' ? 'avval' : 'before'}`,
                  'data-ai-hint': item.oldHint || '',
                  unoptimized: true,
                }}
                afterImage={{
                  src: item.newImg,
                  alt: `${item.brand} — ${lang === 'uz' ? 'hozir' : 'after'}`,
                  'data-ai-hint': item.newHint || '',
                  unoptimized: true,
                }}
                lang={lang}
                className="border-0"
              />

              <div style={{
                display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 8px 6px',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'var(--at-muted)',
                  }}>{String(idx + 1).padStart(2, '0')}</span>
                  <span style={{
                    fontWeight: 700, fontSize: 15,
                    letterSpacing: '-0.01em',
                    color: 'var(--at-ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{item.brand}</span>
                </div>

                {item.services && item.services.length > 0 && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                  }}>
                    {item.services.map((service) => (
                      <span key={service} style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)', fontSize: 8,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        color: 'var(--at-accent)',
                        padding: '4px 8px',
                        background: 'var(--at-accent-soft, rgba(59,130,246,0.08))',
                        borderRadius: '4px',
                        border: '1px solid var(--at-accent-soft, rgba(59,130,246,0.16))',
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                )}

                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--at-muted)',
                }}>
                  {t.caseLabel}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="var(--at-accent-soft, rgba(59,130,246,0.12))" />
                    <path d="M8 12l3 3 5-5" stroke="var(--at-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {(t.cta || t.ctaButton) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
            <button
              onClick={handleCtaClick}
              className="transition-all hover:-translate-y-0.5"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--at-accent)', color: '#fff',
                border: 'none', borderRadius: 999,
                padding: '16px 30px',
                fontSize: 15, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t.cta || t.ctaButton} ↗
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .at-ba-head { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </section>
  );
};

export default BeforeAfter;
