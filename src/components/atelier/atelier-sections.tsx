'use client';

import { FC, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, Pause, Play, X } from 'lucide-react';
import {
  staticTestimonials,
  staticTestimonialsEn,
  staticTestimonialsRu,
  staticTestimonialsZh,
} from '@/lib/static-data';


/* ── GALLERY (editorial work grid) ─────────────── */
interface ATGalleryProject {
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
}

interface ATGalleryProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
  projects?: ATGalleryProject[];
}

const TILE_CLASSES = ['t-1', 't-2', 't-3', 't-4', 't-5'];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  uz: {
    'brand-strategy': 'Brend-strategiya',
    'logo-design': 'Logotip dizayni',
    brandbook: 'Brendbuk',
    'corporate-style': 'Firma uslubi',
    packaging: 'Qadoq dizayni',
    naming: 'Neyming',
  },
  ru: {
    'brand-strategy': 'Бренд-стратегия',
    'logo-design': 'Дизайн логотипа',
    brandbook: 'Брендбук',
    'corporate-style': 'Фирменный стиль',
    packaging: 'Дизайн упаковки',
    naming: 'Нейминг',
  },
  en: {
    'brand-strategy': 'Brand Strategy',
    'logo-design': 'Logo Design',
    brandbook: 'Brandbook',
    'corporate-style': 'Corporate Style',
    packaging: 'Packaging Design',
    naming: 'Naming',
  },
  zh: {
    'brand-strategy': '品牌战略',
    'logo-design': '标志设计',
    brandbook: '品牌手册',
    'corporate-style': '企业风格',
    packaging: '包装设计',
    naming: '命名',
  },
};

function getCategoryLabel(category: string | undefined, lang: string): string {
  if (!category) return '';
  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.uz;
  return labels[category] || category;
}

function getFirstResult(project: ATGalleryProject): string {
  if (project.results && project.results.length > 0) {
    return project.results[0].value;
  }
  return '';
}

function getYear(project: ATGalleryProject): string {
  const d = (project as any).publishedAt;
  if (d) return new Date(d).getFullYear().toString();
  return '2025';
}

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

/* ── QUOTES ────────────────────────────────────── */
interface ATQuotesProps {
  dictionary: any;
  testimonials?: any[];
  lang: string;
}
export const ATQuotes: FC<ATQuotesProps> = ({
  dictionary,
  testimonials: testimonialsProp,
  lang,
}) => {
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [apiTestimonials, setApiTestimonials] = useState<any[] | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    const cached = sessionStorage.getItem(`testimonials_${lang}`);
    if (cached) {
      try {
        setApiTestimonials(JSON.parse(cached));
        return;
      } catch {}
    }
    fetch(`/api/testimonials?lang=${lang}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.testimonials?.length) {
          setApiTestimonials(data.testimonials);
          try {
            sessionStorage.setItem(`testimonials_${lang}`, JSON.stringify(data.testimonials));
          } catch {}
        }
      })
      .catch(() => {});
  }, [lang]);

  const list =
    testimonialsProp && testimonialsProp.length > 0
      ? testimonialsProp
      : apiTestimonials && apiTestimonials.length > 0
        ? apiTestimonials
        : (() => {
            switch (lang) {
              case 'ru':
                return staticTestimonialsRu;
              case 'en':
                return staticTestimonialsEn;
              case 'zh':
                return staticTestimonialsZh;
              default:
                return staticTestimonials;
            }
          })();

  const videoTestimonials = list.filter((t) => t.videoUrl);
  const audioTestimonials = list.filter((t) => !t.videoUrl && t.audioUrl);
  const textTestimonials = list.filter((t) => !t.videoUrl && !t.audioUrl && t.quote?.trim());

  const vimeoHosts = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

  const getVimeoVideoId = (url?: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (!vimeoHosts.has(hostname)) return '';
      const match = parsed.pathname.match(/^\/(?:video\/)?(\d+)/i);
      return match ? match[1] : '';
    } catch {
      return '';
    }
  };

  const getVimeoEmbedUrl = (url?: string) => {
    if (!url) return '';
    const videoId = getVimeoVideoId(url);
    if (!videoId) return '';
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&badge=0&autopause=0&dnt=1`;
  };

  const toggleAudio = (audioUrl: string) => {
    const el = audioRefs.current[audioUrl];
    if (!el) return;
    if (playingAudio === audioUrl) {
      el.pause();
      setPlayingAudio(null);
    } else {
      Object.keys(audioRefs.current).forEach((k) => {
        if (k !== audioUrl) {
          audioRefs.current[k]?.pause();
        }
      });
      el.play();
      setPlayingAudio(audioUrl);
    }
  };

  const handleAudioEnded = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    }
  };

  return (
    <section className="sec wrap" id="sharhlar">
      <div
        className="sec-head"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginBottom: 80,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          className="lede"
          style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 06</span>
            <span>
              {dictionary?.footer_pages_title?.includes('Sharh')
                ? dictionary.footer_pages_title
                : 'Sharhlar'}
            </span>
          </span>
        </div>
        <h2 className="it" style={{ maxWidth: 800 }}>
          {dictionary?.quotes_title ? (
            dictionary.quotes_title.includes('\n') ? (
              <>
                {dictionary.quotes_title.split('\n')[0]}
                <br />
                <span className="it">{dictionary.quotes_title.split('\n')[1]}</span>
              </>
            ) : (
              dictionary.quotes_title
            )
          ) : (
            "Mijozlar o'z so'zlari bilan."
          )}
        </h2>
        <div className="lede" style={{ maxWidth: 500 }}>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.quotes_lede ||
                "Har bir gap real biznes egasidan, real loyiha haqida. <br/><strong>Yolg'on yoki bo'rttirma yo'q</strong> — tekshirishingiz mumkin.",
            }}
          />
        </div>
      </div>

      {videoTestimonials.length > 0 && (
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 28, height: 1, background: 'var(--line)' }} />
            {lang === 'ru'
              ? 'Видео отзывы'
              : lang === 'en'
                ? 'Video reviews'
                : lang === 'zh'
                  ? '视频反馈'
                  : 'Video sharhlar'}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            {videoTestimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                onClick={() => setActiveVideo(t)}
                style={{
                  position: 'relative',
                  aspectRatio: '9/16',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: '#0E1015',
                  cursor: 'pointer',
                  border: '1px solid var(--line)',
                  minHeight: 320,
                  flex: '1 1 180px',
                  maxWidth: 240,
                }}
                className="group"
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    quality={85}
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="50vw"
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #1B4DFF15, #C2552A15)',
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(14,16,21,0.9), rgba(14,16,21,0.1) 60%, transparent)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#0E1015',
                    display: 'grid',
                    placeItems: 'center',
                    zIndex: 3,
                  }}
                >
                  <PlayCircle size={16} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 20,
                    color: '#FFF',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: 4,
                    }}
                  >
                    {t.company || t.role}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(audioTestimonials.length > 0 || textTestimonials.length > 0) && (
        <>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 28, height: 1, background: 'var(--line)' }} />
            {lang === 'ru'
              ? 'Отзывы'
              : lang === 'en'
                ? 'Reviews'
                : lang === 'zh'
                  ? '评论'
                  : 'Matnli sharhlar'}
            <span style={{ width: 28, height: 1, background: 'var(--line)' }} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {audioTestimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 32,
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <audio
                  ref={(el) => {
                    audioRefs.current[t.audioUrl] = el;
                  }}
                  src={t.audioUrl}
                  preload="none"
                  onEnded={() => handleAudioEnded(t.audioUrl)}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif, "Instrument Serif", serif)',
                      fontStyle: 'italic',
                      fontSize: 72,
                      lineHeight: 0.8,
                      color: 'var(--accent)',
                      marginBottom: 16,
                    }}
                  >
                    &#8220;
                  </div>
                  <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink)' }}>{t.quote}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 20,
                    width: '100%',
                  }}
                >
                  <button
                    onClick={() => toggleAudio(t.audioUrl)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 28px',
                      borderRadius: 40,
                      background: playingAudio === t.audioUrl ? 'var(--accent)' : 'var(--bg)',
                      color: playingAudio === t.audioUrl ? '#FFF' : 'var(--ink)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow:
                        playingAudio === t.audioUrl ? '0 8px 24px rgba(194, 85, 42, 0.25)' : 'none',
                    }}
                  >
                    {playingAudio === t.audioUrl ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>
                      {playingAudio === t.audioUrl
                        ? lang === 'ru'
                          ? 'Слушаем...'
                          : lang === 'en'
                            ? 'Playing...'
                            : lang === 'zh'
                              ? '播放中...'
                              : 'Tinglanyapti...'
                        : lang === 'ru'
                          ? 'Слушать отзыв'
                          : lang === 'en'
                            ? 'Listen to review'
                            : lang === 'zh'
                              ? '听评论'
                              : 'Ovozli sharhni eshitish'}
                    </span>
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        fontFamily: 'var(--font-mono, monospace)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {textTestimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 32,
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif, "Instrument Serif", serif)',
                      fontStyle: 'italic',
                      fontSize: 72,
                      lineHeight: 0.8,
                      color: 'var(--accent)',
                      marginBottom: 16,
                    }}
                  >
                    &#8220;
                  </div>
                  <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink)' }}>{t.quote}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    width: '100%',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>{t.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--muted)',
                      fontFamily: 'var(--font-mono, monospace)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(14, 16, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 400,
              aspectRatio: '9/16',
              background: '#0E1015',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {activeVideo.videoFileUrl ? (
              <video
                controls
                autoPlay
                playsInline
                src={activeVideo.videoFileUrl}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  background: '#000',
                }}
              />
            ) : (
              <iframe
                src={getVimeoEmbedUrl(activeVideo.videoUrl)}
                title={`${activeVideo.name} video`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
            <button
              onClick={() => setActiveVideo(null)}
              type="button"
              aria-label="Close video"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1015]"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} aria-hidden="true" />
            </button>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
                background: 'linear-gradient(to top, rgba(14,16,21,0.95), transparent)',
                padding: 28,
                color: '#FFF',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>{activeVideo.name}</div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginTop: 4,
                }}
              >
                {activeVideo.company}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
