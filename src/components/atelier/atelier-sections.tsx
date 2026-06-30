'use client';

import { FC, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { PlayCircle, Pause, Volume2, X, Star } from 'lucide-react';
import { ATMock } from './atelier-mocks';
import { staticTestimonials, staticTestimonialsEn, staticTestimonialsRu, staticTestimonialsZh } from '@/lib/static-data';

interface SectionProps {
  dictionary: any;
  onOpen: () => void;
}

/* ── MASTHEAD ──────────────────────────────────── */
export const ATMasthead: FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tashkent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tashkent',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setTime(tashkent);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="masthead">
      <div className="wrap">
        <div className="masthead-row">
          <div className="masthead-left">
            <span>Jon · Atelier</span>
            <span className="hide-m">Toshkent · 41.3°N 69.3°E</span>
            <span>{time} TST</span>
          </div>
          <div className="masthead-right">
            <span className="hide-m">MMXXVI · vol. VI</span>
            <span className="live">Yangi loyihalar uchun ochiq</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── NAV ───────────────────────────────────────── */
interface ATNavProps {
  dictionary: any;
  onOpen: () => void;
  theme: string;
  setTheme: (t: string) => void;
}

export const ATNav: FC<ATNavProps> = ({ dictionary, onOpen, theme, setTheme }) => {
  const [scroll, setScroll] = useState(false);
  const navItems = dictionary?.nav || [];

  useEffect(() => {
    const on = () => setScroll(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scroll ? 'scroll' : ''}`}>
      <div className="wrap">
        <div className="nav-inner">
          <a href="#top" className="brand" onClick={go('top')}>
            <span>jon</span>
            <span className="dot">.</span>
          </a>
          <div className="nav-links">
            {navItems.map((n: any) => (
              <a key={n.id} className="nav-link" href={n.href} onClick={n.href.startsWith('#') ? go(n.href.slice(1)) : undefined}>
                {n.label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="theme">
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button className="btn btn-primary" onClick={onOpen}>
              {dictionary?.hero_cta || "Bepul tahlil"} <span className="ar">↗</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/* ── HERO ──────────────────────────────────────── */
export const ATHero: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="hero wrap" id="top">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-eyebrows">
            <span className="eb">
              <span className="dot"/>
              <span>{dictionary?.hero_eyebrow || "Markaziy Osiyo · Brand atelier · Est. 2019"}</span>
            </span>
            <div className="pill">
              <span className="b">2026</span>
              <span>{dictionary?.hero_pill || "Yangi paketlar endi mavjud"}</span>
            </div>
          </div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: (dictionary?.hero_title || "Brendingiz<br/>aslida<br/>qancha yo'qotyapti?").replace(/\n/g, '<br/>') }} />
        </div>

        <div className="hero-right">
          <p className="hero-lede" dangerouslySetInnerHTML={{ __html: (dictionary?.hero_lede || "<strong>Brend tashxisi</strong> — biznesingizning ko'rinmas yo'qotishlarini topish.<br/>14 kun · 12 mezon · 30—50 betlik hisobot · aniq raqamlarda.<br/><br/>Bepul mini-tashxis bilan boshlang — keyin xohlasangiz to'liqqa o'tasiz.").replace(/\n/g, '<br/>') }} />
          <div className="hero-cta-row">
            <button className="btn btn-primary btn-xl" onClick={onOpen}>
              {dictionary?.hero_cta || "Bepul mini-tashxis boshlash"} <span className="ar">↗</span>
            </button>
            <a href="#narxlar" onClick={(e) => { e.preventDefault(); document.getElementById('narxlar')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-link">
              {dictionary?.hero_cta_sub || "yoki paketlarni ko'ring"} →
            </a>
          </div>
          <div className="hero-micro">
            <span>↳</span>
            <span>30 daq</span>
            <span className="sep">·</span>
            <span>Spamsiz</span>
            <span className="sep">·</span>
            <span>Majburiyatsiz</span>
            <span className="sep">·</span>
            <span className="hl">{dictionary?.hero_micro_label || "Iyul oyida 4 joy qoldi"}</span>
          </div>
          <div className="hero-meta">
            <div>
              <div className="k">{dictionary?.hero_stat_conducted || "O'tkazildi"}</div>
              <div className="v"><span className="s">240</span>+ tashxis</div>
            </div>
            <div>
              <div className="k">{dictionary?.hero_stat_left || "Bu oyda"}</div>
              <div className="v"><span className="s">4</span> joy qoldi</div>
            </div>
            <div>
              <div className="k">{dictionary?.hero_stat_ready || "Hisobot tayyor"}</div>
              <div className="v">14 kun</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── MARQUEE ───────────────────────────────────── */
export const ATMarquee: FC<{ dictionary: any }> = ({ dictionary }) => {
  const list = dictionary?.marquee || [];
  const items = [...list, ...list];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((it: any, i: number) => (
          <div key={i} className="marquee-item">
            <span>{it.name}</span>
            <span className="res">— {it.res}</span>
            <span className="star">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── MANIFESTO ─────────────────────────────────── */
export const ATManifesto: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <section className="manifesto wrap">
      <div className="manifesto-grid">
        <div className="manifesto-meta">
          <div className="k">— {dictionary?.manifesto_label || "Manifest"}</div>
          <div className="v">
            {dictionary?.manifesto_desc || "Tashxis — bu professional ko'rik. Aniq raqamlar, aniq xulosalar, aniq harakat. Taxmin va his bilan biznesni yo'qotmaymiz."}
          </div>
        </div>
        <div className="manifesto-text" dangerouslySetInnerHTML={{ __html: (dictionary?.manifesto_text || "Tashxissiz <s>tuzatish</s> —<br/>bu <em>qorong'ida</em> o'q otish.<br/>Avval ko'rinmagan teshikni topamiz, keyin yopamiz. Tartib shu —<br/>aks holda <strong>siz pul to'laysiz, raqib daromad oladi.</strong>").replace(/\n/g, '<br/>') }} />
      </div>
    </section>
  );
};

/* ── LEDGER ────────────────────────────────────── */
export const ATLedger: FC<{ dictionary: any }> = ({ dictionary }) => {
  const ledgerItems = dictionary?.ledger || [];

  return (
    <section className="ledger">
      <div className="wrap">
        <div className="ledger-inner">
          <div className="ledger-label">
            <span>{dictionary?.brand_system_primary || "Tanlangan mijozlar"}</span>
            <span className="n">120+ brend</span>
          </div>
          <div className="ledger-logos">
            {ledgerItems.map((l: any) => (
              <span key={l.name} className="ledger-logo">
                {l.name}<span className="yr">'{l.yr}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── STATS ─────────────────────────────────────── */
export const ATStats: FC<{ dictionary: any }> = ({ dictionary }) => {
  const statsItems = dictionary?.stats || [];
  const tips = [
    dictionary?.stats_tip_1 || "2019—2026 davrida 240 ta haqiqiy mijoz. Mahalliy ro'yxat va sharhlar bilan tasdiqlangan.",
    dictionary?.stats_tip_2 || "Qumri Coffee (2.8M), Oltin Bulut (3.7M), Humo (4.1M) o'rtachasi. Auditda aniq raqam.",
    dictionary?.stats_tip_3 || "Brif yuborilgandan so'ng — birinchi tavsiya 21 kun ichida amalga oshadi.",
    dictionary?.stats_tip_4 || "PDF hisobotdagi tavsiyalarning kamida 60% 90 kun ichida amalga oshiriladi.",
  ];

  return (
    <section className="stats wrap">
      <div className="stats-row">
        {statsItems.map((s: any, i: number) => (
          <div key={i} className="stat">
            <div className="n">{s.n}<span className="s">{s.s}</span></div>
            <div className="l">{s.l}</div>
            <div className="stat-tip">{tips[i] || ""}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── DIAGNOSIS ─────────────────────────────────── */
export const ATDiagnosis: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const badItems = dictionary?.bad || [];
  const goodItems = dictionary?.good || [];

  return (
    <section className="sec wrap" id="belgilar">
      <div className="sec-head">
        <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.diagnosis_title || "Hozir biznesingizda<br/><span class=\"it\">aslida</span> nima bo'lyapti?").replace(/\n/g, '<br/>') }} />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" style={{ background: 'var(--terra)' }}/>
            <span className="ix">§ 01</span>
            <span>{dictionary?.nav?.[0]?.label || "Belgilar"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.diagnosis_lede || "Brendingiz <strong>ko'rinmas yo'qotishlar</strong> keltiryapti. Mijoz bu yo'qotishlarni sezmaydi — siz ham. Lekin raqib mijozni siz emas, o'ziga olib ketadi." }} />
        </div>
      </div>

      <div className="diag">
        <div className="diag-col bad">
          <div className="diag-head">
            <span className="tag"><span className="x">●</span> {dictionary?.bad_tag || "Jon'siz · oldindan"}</span>
            <h3>{dictionary?.diagnosis_bad_title || "Yashirin yo'qotish"}</h3>
          </div>
          <ul className="diag-list">
            {badItems.map((b: any) => (
              <li key={b.ix}>
                <span className="ix">{b.ix}</span>
                <span>{b.t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="diag-col good">
          <div className="diag-head">
            <span className="tag"><span className="v">●</span> {dictionary?.good_tag || "Jon bilan · keyin"}</span>
            <h3>{dictionary?.diagnosis_good_title || "Aniq natija"}</h3>
          </div>
          <ul className="diag-list">
            {goodItems.map((g: any) => (
              <li key={g.ix}>
                <span className="ix">{g.ix}</span>
                <span>{g.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(22px, 2.4vw, 32px)', color: 'var(--ink)', lineHeight: 1.3, maxWidth: 540, textWrap: 'balance' }}>
          {dictionary?.diagnosis_ogriq || "Sizning biznesingizda qaysi nuqta og'riyapti? 30 daqiqada aniqlaymiz."}
        </p>
        <button className="btn btn-primary btn-lg" onClick={onOpen}>
          {dictionary?.diagnosis_cta || "Belgilarni topish · Bepul"} <span className="ar">↗</span>
        </button>
      </div>
    </section>
  );
};

/* ── SERVICES ──────────────────────────────────── */
export const ATServices: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const servicesItems = dictionary?.services || [];

  return (
    <section className="sec wrap" id="xizmat">
      <div className="sec-head">
        <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.services_title || "Brend — boshidan<br/><span class=\"it\">oxirigacha.</span>").replace(/\n/g, '<br/>') }} />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 02</span>
            <span>{dictionary?.nav?.[1]?.label || "Xizmatlar"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.services_lede || "Neyming, aydentika, qadoq, tovar belgisi va raqamli ko'rinish — <strong> bir joyda, bir jamoa, bir narxda.</strong> Har biri alohida ham buyurtma qilinadi." }} />
        </div>
      </div>
      <div className="svc-table">
        {servicesItems.map((s: any) => (
          <div key={s.num} className="svc-row" onClick={onOpen}>
            <div className="num">{s.num}</div>
            <div className="name">{s.name}</div>
            <div className="desc">{s.desc}</div>
            <div className="time">{s.time}</div>
            <div className="arr">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── FEATURED ──────────────────────────────────── */
interface ATFeaturedProps {
  dictionary: any;
  comparison?: any;
  lang: string;
}

export const ATFeatured: FC<ATFeaturedProps> = ({ dictionary, comparison, lang }) => {
  const c = dictionary?.featured || {
    name: "Den Aroma",
    city: "Samarqand",
    year: "2025",
    cat: "Neyming · Aydentika · Qadoq · Tovar belgisi",
    story: "Samarqanddagi mahalliy kofexona. Eski nom shevali va eslab qolinmaydigan edi. Yangi nom — joy va o'zbek qushini birga olib keldi. Qadoq, menyu va interyer bir uslubda yangilandi.",
    metrics: [
      { n: "+41%", l: "Sotuv 3 oyda" },
      { n: "3×", l: "Takroriy mijozlar" },
      { n: "2", l: "Yangi filial" }
    ]
  };

  const comp = comparison || {
    brand: 'Den Aroma',
    oldImg: '/images/cms/denaroma-avval.png',
    newImg: '/images/cms/denaroma-hozir.png',
    oldHint: '3 Atirchi (Eski brending)',
    newHint: 'Den Aroma (Yangi brending)',
  };

  return (
    <section className="feat" id="ishlar">
      <div className="feat-inner">
        <div className="feat-img" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
          <div className="tag" style={{ zIndex: 20 }}>
            <span>{dictionary?.featured_title || "Asosiy keys"} · {c.year}</span>
            <span className="live">{dictionary?.featured_live || "Davom etmoqda"}</span>
          </div>
          <div style={{ width: '100%', maxWidth: '480px', margin: 'auto' }}>
            <ImageComparisonSlider
              beforeImage={{
                src: comp.oldImg,
                alt: `${comp.brand} old`,
                unoptimized: true
              }}
              afterImage={{
                src: comp.newImg,
                alt: `${comp.brand} new`,
                unoptimized: true
              }}
              lang={lang}
            />
          </div>
        </div>
        <div className="feat-body">
          <span className="eb">
            <span className="dot"/>
            <span>{dictionary?.featured_title || "Asosiy keys"} · {c.year}</span>
          </span>
          <h2 className="feat-title">
            {c.name}<br/>
            <span className="it">{c.city}.</span>
          </h2>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(244,241,232,.55)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.cat}</div>
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

export const ATShowcase: FC<ATShowcaseProps> = ({ dictionary, onOpen, lang }) => {
  const items = [
    { img: '/images/cms/denaroma-hozir.png',  name: 'Den Aroma',     yr: "'25", cat: 'Aydentika & Qadoq' },
    { img: '/images/cms/savod-hozir.png',     name: 'Savod',         yr: "'25", cat: 'Brending' },
    { img: '/images/cms/fidda-hozir.png',     name: 'Fidda',         yr: "'24", cat: 'Aydentika' },
    { img: '/images/cms/boyarin-hozir.png',   name: 'Boyarin',       yr: "'24", cat: 'Qadoq dizayni' },
  ];

  return (
    <section className="showcase wrap">
      <div className="sc-strip-head">
        <span className="eb">
          <span className="dot"/>
          <span>{dictionary?.showcase_title || "So'nggi 4 ta loyiha · 2023—2025"}</span>
        </span>
        <a href="#ishlar" onClick={(e) => { e.preventDefault(); document.getElementById('ishlar')?.scrollIntoView({ behavior: 'smooth' }); }} className="seemore">
          {dictionary?.showcase_seemore || "Barchasini ko'rish — 120+"} <span>↗</span>
        </a>
      </div>
      <div className="showcase-inner">
        {items.map((it, i) => (
          <div key={i} className={`sc-card sc-${i+1}`} onClick={onOpen}>
            <div className="body" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
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

/* ── BRAND SYSTEM ──────────────────────────────── */
export const ATBrandSystem: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <section className="bsys">
      <div className="wrap">
        <div className="bsys-grid">
          <div className="bsys-side">
            <span className="eb">
              <span className="dot"/>
              <span style={{ color: 'var(--ink-2)' }}>§ {dictionary?.brand_system_title?.split('—')?.[0]?.trim() || "Brend tizimi"}</span>
            </span>
            <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.brand_system_title || "Logotip emas —<br/><span class=\"it\">tizim.</span>").replace(/\n/g, '<br/>') }} />
            <p>
              {dictionary?.brand_system_lede || "Rang, shrift, belgi, sayt, qadoq — barchasi bir til, bir ovoz, bir taassurot. Brendbukda har bir foydalanish qoidasi yozilgan."}
            </p>
            <a href="#xizmat" onClick={(e) => { e.preventDefault(); document.getElementById('xizmat')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 28, fontWeight: 600, fontSize: 14,
              padding: '12px 18px', border: '1px solid var(--line)',
              borderRadius: 999, background: 'var(--bg)',
              color: 'var(--ink)',
            }}>
              {dictionary?.brand_system_cta || "Xizmatlar ro'yxati"} <span style={{ color: 'var(--accent)' }}>↗</span>
            </a>
          </div>
          <div className="bsys-grid-r">
            {/* Ink primary */}
            <div className="bs-cell bs-c1 bs-color">
              <div>
                <div className="lbl">{dictionary?.brand_system_primary || "Asosiy"}</div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 36, lineHeight: 1, marginTop: 8 }}>{dictionary?.brand_system_siyoh || "Siyoh"}</div>
              </div>
              <div className="hex">#0E1015</div>
            </div>
            {/* Cobalt */}
            <div className="bs-cell bs-c2 bs-color" style={{ background: 'var(--accent)' }}>
              <div className="lbl">{dictionary?.brand_system_accent || "Aksent"}</div>
              <div className="hex">#1B4DFF</div>
            </div>
            {/* Terra */}
            <div className="bs-cell bs-c3 bs-color">
              <div className="lbl">{dictionary?.brand_system_issiq || "Issiq"}</div>
              <div className="hex">#C2552A</div>
            </div>
            {/* Green */}
            <div className="bs-cell bs-c4 bs-color">
              <div className="lbl">{dictionary?.brand_system_tirik || "Tirik"}</div>
              <div className="hex">#2C6E49</div>
            </div>
            {/* Paper */}
            <div className="bs-cell bs-c5">
              <div className="lbl">{dictionary?.brand_system_qogoz || "Qog'oz"}</div>
              <div className="hex">#F2EFE6</div>
            </div>

            {/* Type sample */}
            <div className="bs-cell bs-type bs-type-cell">
              <div className="lbl">{dictionary?.brand_system_typography || "Tipografika"}</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div className="big sans">Aa</div>
                <div className="big">Aa</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>SANS · INTER TIGHT</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>SERIF · INSTRUMENT</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>MONO · JETBRAINS</div>
                </div>
              </div>
              <div className="val">↳ display 64—156 · body 15—18</div>
            </div>

            {/* Mark */}
            <div className="bs-cell bs-mark bs-mark-cell">
              <div className="lbl">{dictionary?.brand_system_mark || "Belgi"}</div>
              <div className="glyph">jon<span className="d">.</span></div>
              <div className="val">primary mark</div>
            </div>

            {/* Lockup */}
            <div className="bs-cell bs-lock bs-lock-cell">
              <div className="lbl">{dictionary?.brand_system_lockup || "Lockup"}</div>
              <div className="lock">jon<span className="s">.</span> branding atelier · est. mmxix</div>
              <div className="val">extended horizontal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── GALLERY (editorial work grid) ─────────────── */
interface ATGalleryProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
}

export const ATGallery: FC<ATGalleryProps> = ({ dictionary, onOpen, lang }) => {
  const [filter, setFilter] = useState('all');
  
  const all = [
    { cls: 't-1', img: '/images/cms/denaroma-hozir.png',  name: 'Den Aroma',  yr: '2025', city: lang === 'uz' ? 'Samarqand' : lang === 'ru' ? 'Самарканд' : lang === 'zh' ? '撒马尔罕' : 'Samarkand', cat: 'Neyming · Qadoq', res: '+41% sotuv', dark: false, ind: 'food' },
    { cls: 't-2', img: 'https://cdn.sanity.io/images/h6ymmj0v/production/f4763a990390239063c4cb13fa0f3d4b1446b9e0-2560x1440.jpg', name: 'Incontrol', yr: '2024', city: lang === 'uz' ? 'Toshkent' : lang === 'ru' ? 'Ташкент' : lang === 'zh' ? '塔什干' : 'Tashkent',  cat: 'Brend · Ilova',    res: '180K user',  dark: false, ind: 'fintech' },
    { cls: 't-3', img: 'https://cdn.sanity.io/images/h6ymmj0v/production/c02f0468758f0231648b33324f08f7fa8d74ef8d-608x614.png', name: 'Barakah', yr: '2025', city: lang === 'uz' ? 'Toshkent' : lang === 'ru' ? 'Ташкент' : lang === 'zh' ? '塔什干' : 'Tashkent',  cat: 'Rebrending',       res: '3× takror',  dark: false, ind: 'food' },
    { cls: 't-4', img: '/images/cms/boyarin-hozir.png', name: 'Boyarin', yr: '2024', city: lang === 'uz' ? 'Buxoro' : lang === 'ru' ? 'Бухара' : lang === 'zh' ? '布哈拉' : 'Bukhara',    cat: 'Qadoq · 12 SKU',   res: '+31% sotuv', dark: true,  ind: 'fmcg' },
    { cls: 't-5', img: 'https://cdn.sanity.io/images/h6ymmj0v/production/ad4e5b4a2b5e1044accc01c93ab3b837a7b6c408-2570x1729.png', name: 'Nur Sopol',  yr: '2023', city: lang === 'uz' ? 'Rishton' : lang === 'ru' ? 'Риштан' : lang === 'zh' ? '里什坦' : 'Rishtan',   cat: 'Aydentika',        res: '2× ko\'rinish', dark: false, ind: 'fmcg' },
    { cls: 't-6', img: '/images/cms/fidda-hozir.png',  name: 'Fidda',     yr: '2023', city: lang === 'uz' ? 'Toshkent' : lang === 'ru' ? 'Ташкент' : lang === 'zh' ? '塔什干' : 'Tashkent',  cat: 'Neyming · Aydentika', res: 'Yangi bozor', dark: true,  ind: 'fashion' },
  ];

  const filters = [
    { id: 'all', l: lang === 'uz' ? 'Hammasi' : lang === 'ru' ? 'Все' : lang === 'zh' ? '全部' : 'All' },
    { id: 'food', l: lang === 'uz' ? 'Oziq-ovqat' : lang === 'ru' ? 'Еда' : lang === 'zh' ? '食品' : 'Food' },
    { id: 'fmcg', l: 'FMCG' },
    { id: 'fintech', l: 'Fintech' },
    { id: 'fashion', l: lang === 'uz' ? 'Moda' : lang === 'ru' ? 'Мода' : lang === 'zh' ? '时尚' : 'Fashion' },
  ];

  const tiles = filter === 'all' ? all : all.filter(t => t.ind === filter);

  return (
    <section className="gal" id="ishlar">
      <div className="wrap">
        <div className="sec-head">
          <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.gallery_title || "Tanlangan<br/><span class=\"it\">ishlar.</span>").replace(/\n/g, '<br/>') }} />
          <div className="lede">
            <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
              <span className="dot"/>
              <span className="ix">§ 03</span>
              <span>{dictionary?.nav?.[1]?.label || "Portfolio"}</span>
            </span>
            <p>
              {dictionary?.gallery_lede || "2023—2025 davrida tanlangan 6 ta loyiha. Har biri real biznes, real qadoq, real natija. Sohaga qarab filterlang."}
            </p>
          </div>
        </div>
        <div className="ind-filter">
          {filters.map(f => (
            <button key={f.id} className={`ind-pill ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>{f.l}</button>
          ))}
        </div>
        <div className="gal-grid">
          {tiles.map((t, i) => (
            <div key={t.name} className={`gal-tile ${t.cls}`} onClick={onOpen}>
              <div className="body" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={`head ${t.dark ? 'dark' : ''}`}>
                <span>№ {String(i+1).padStart(2, '0')}</span>
                <span>{t.city}</span>
              </div>
              <div className={`arr ${t.dark ? 'dark' : ''}`}>↗</div>
              <div className={`foot ${t.dark ? 'dark' : ''}`}>
                <div className="name">{t.name}</div>
                <div className="meta">
                  <span>{t.cat}</span>
                  <span className="res">{t.res} · {t.yr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filter !== 'all' && (
          <div style={{ marginTop: 32, padding: '20px 28px', borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15 }}>{dictionary?.gallery_similar || "O'xshash biznesmisiz? Sizga ham shunday natija mumkin."}</span>
            <button className="btn btn-primary" onClick={onOpen}>{dictionary?.gallery_cta || "Mening biznesim uchun tashxis"} <span className="ar">↗</span></button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── AUDIT (12 points + 6 deliverables) ────────── */
export const ATAudit: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const auditPoints = dictionary?.auditPoints || [];
  const auditDeliverables = dictionary?.auditDeliverables || [];

  // Group points
  const groups: Record<string, any[]> = {};
  auditPoints.forEach((p: any) => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });
  const order = ['POZITSIYA', 'VIZUAL', 'RAQAMLI', 'HUQUQ'];
  const labels: Record<string, string> = {
    POZITSIYA: dictionary?.brand_system_primary?.includes('Mijoz') ? 'Pozitsiya & Strategiya' : (dictionary?.audit_group_1 || 'Pozitsiya & Strategiya'),
    VIZUAL: dictionary?.audit_group_2 || 'Vizual aydentika',
    RAQAMLI: dictionary?.audit_group_3 || 'Raqamli ko\'rinish',
    HUQUQ: dictionary?.audit_group_4 || 'Huquqiy himoya',
  };

  return (
    <section className="sec wrap" id="tashxis">
      <div className="sec-head">
        <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.audit_title || "Tashxisda<br/><span class=\"it\">nimalarni</span> tekshiramiz.").replace(/\n/g, '<br/>') }} />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 02</span>
            <span>{dictionary?.audit_section_badge || "Tashxis"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.audit_lede || "12 mezon · 4 yo'nalish · 14 kun. Har bir nuqta 0—100 baholanadi, <strong>yo'qotilayotgan daromad esa aniq raqamda</strong> hisoblanadi. Hech bir tomon e'tibordan chetda qolmaydi." }} />
        </div>
      </div>

      {/* 12-point grouped checklist */}
      <div className="audit-grid">
        {order.map((g, gi) => (
          <div key={g} className="audit-group">
            <div className="audit-group-head">
              <span className="audit-ix">0{gi + 1}</span>
              <div>
                <div className="audit-glabel">{g}</div>
                <div className="audit-gname">{labels[g]}</div>
              </div>
              <div className="audit-count">{(groups[g] || []).length} {dictionary?.audit_count_suffix || "mezon"}</div>
            </div>
            <ul className="audit-list">
              {(groups[g] || []).map((p: any) => (
                <li key={p.ix}>
                  <span className="audit-num">{p.ix}</span>
                  <span>{p.t}</span>
                  <span className="audit-check">✓</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Deliverables — what you get */}
      <div className="audit-deliv-wrap">
        <div className="audit-deliv-head">
          <div>
            <span className="eb">
              <span className="dot"/>
              <span>{dictionary?.audit_deliv_title || "Tashxis yakuni · Sizga nima beriladi"}</span>
            </span>
            <h3 style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, marginTop: 14 }}>
              {dictionary?.audit_deliv_h3 || "6 ta aniq"} <span className="serif" style={{ color: 'var(--accent)' }}>{dictionary?.audit_deliv_h3_span || "natija."}</span>
            </h3>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onOpen}>
            {dictionary?.audit_cta || "Tashxisni boshlash"} <span className="ar">↗</span>
          </button>
        </div>
        <div className="audit-deliv-grid">
          {auditDeliverables.map((d: any) => (
            <div key={d.n} className="audit-deliv-card">
              <div className="audit-deliv-n">{d.n}</div>
              <div>
                <div className="audit-deliv-t">{d.t}</div>
                <div className="audit-deliv-note">{d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── SAMPLE REPORT (audit document preview) ────── */
export const ATSampleReport: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="sample">
      <div className="wrap">
        <div className="sample-grid">
          <div className="sample-left">
            <span className="eb">
              <span className="dot"/>
              <span>{dictionary?.sample_report_title || "Hisobot misoli · Qumri Coffee, 2025"}</span>
            </span>
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, margin: '18px 0 24px' }} dangerouslySetInnerHTML={{ __html: (dictionary?.sample_report_title_h2 || "Hisobot<br/><span class=\"serif\" style=\"color: var(--accent)\">shunday</span> ko'rinadi.").replace(/\n/g, '<br/>') }} />
            <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.65, marginBottom: 24, maxWidth: 380 }} dangerouslySetInnerHTML={{ __html: dictionary?.sample_report_lede || "30—50 betlik PDF. Har sahifada aniq holat, aniq tavsiya, aniq raqam. <strong style=\"color: var(--ink)\"> \"Yaxshilash kerak\" emas — \"filan narsani filan kuni qiling\".</strong>" }} />
            <ul className="sample-toc">
              {[
                { n: '01', t: dictionary?.sample_toc_1 || "Boshlang'ich tahlil va xulosalar" },
                { n: '02', t: dictionary?.sample_toc_2 || "Pozitsiya va auditoriya kartasi" },
                { n: '03', t: dictionary?.sample_toc_3 || "Vizual aydentika baholash" },
                { n: '04', t: dictionary?.sample_toc_4 || "Raqobat tahlili (5 brend)" },
                { n: '05', t: dictionary?.sample_toc_5 || "Yo'qotishlar va imkoniyatlar" },
                { n: '06', t: dictionary?.sample_toc_6 || "90 kunlik harakat rejasi" },
              ].map(s => (
                <li key={s.n}><span className="n">{s.n}</span><span>{s.t}</span></li>
              ))}
            </ul>
            <button className="btn btn-ghost btn-lg" onClick={onOpen} style={{ marginTop: 28 }}>
              {dictionary?.sample_report_cta || "Namuna so'rash"} <span className="ar">↗</span>
            </button>
          </div>
          <div className="sample-right">
            {/* Audit report mock */}
            <div className="report-doc">
              <div className="report-page report-cover">
                <div className="rp-top">
                  <span className="rp-stamp">CONFIDENTIAL · 2025</span>
                  <span className="rp-vol">VOL. 14</span>
                </div>
                <div className="rp-mid">
                  <div className="rp-eb">Brend Tashxis Hisoboti</div>
                  <div className="rp-h1">Qumri<br/><em>Coffee.</em></div>
                  <div className="rp-grade">
                    <div className="rp-grade-n">68<span>/100</span></div>
                    <div className="rp-grade-l">Umumiy baho</div>
                  </div>
                </div>
                <div className="rp-bot">
                  <span>Toshkent · 14 mart 2025</span>
                  <span>Jon · Atelier</span>
                </div>
              </div>
              <div className="report-page report-inner">
                <div className="rp-inner-head">
                  <span className="rp-page">SAH. 12</span>
                  <span className="rp-section">§ Vizual</span>
                </div>
                <div className="rp-inner-title">Logotip — texnik baho</div>
                <div className="rp-bars">
                  {[
                    { l: 'O\'qish', v: 82, c: 'var(--green)' },
                    { l: 'Esda qolish', v: 64, c: 'var(--accent)' },
                    { l: 'Farqlanish', v: 38, c: 'var(--terra)' },
                    { l: 'Masshtablanish', v: 91, c: 'var(--green)' },
                    { l: 'Konseptual', v: 55, c: 'var(--accent)' },
                  ].map((b, i) => (
                    <div key={i} className="rp-bar">
                      <div className="rp-bar-l">{b.l}</div>
                      <div className="rp-bar-track">
                        <div className="rp-bar-fill" style={{ width: b.v + '%', background: b.c }}/>
                      </div>
                      <div className="rp-bar-v">{b.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rp-recs">
                  <div className="rp-recs-head">Tavsiyalar</div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-urgent"/>
                    <span>Belgi nisbatlari qayta hisoblanishi kerak (—2 hafta)</span>
                  </div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-mid"/>
                    <span>Mono versiya yetishmaydi (—1 hafta)</span>
                  </div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-low"/>
                    <span>Ikonografik mark — strategik (3 oy)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sample-tag">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                ↳ Bu sahifa 12-bet. Hisobotda yana 38 sahifa shunaqa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── MINI QUOTES STRIP ─────────────────────────── */
export const ATMiniQuotes: FC = () => {
  const items = [
    { avatar: 'S', color: '#C2552A', text: '"3 oyda sotuv 41% oshdi"', who: 'Sardor R. · Qumri Coffee', res: '+41% sotuv' },
    { avatar: 'M', color: '#1B4DFF', text: '"Nomimizni saqlab qoldi"',     who: 'Malika K. · Oltin Bulut', res: 'Himoyalandi' },
    { avatar: 'R', color: '#2C6E49', text: '"Javonda 2× ko\'rindik"',        who: "Rustam X. · Nur Sopol",  res: '2× ko\'rinish' },
  ];

  return (
    <section className="miniq">
      <div className="wrap">
        <div className="miniq-inner">
          <div className="miniq-label">
            <span className="miniq-stars">★★★★★</span>
            <span>240+ mijoz · 4.9/5</span>
          </div>
          <div className="miniq-list">
            {items.map((q, i) => (
              <div key={i} className="miniq-q">
                <div className="miniq-avatar" style={{ background: q.color }}>{q.avatar}</div>
                <div>
                  <div className="miniq-text">{q.text}</div>
                  <div className="miniq-who">{q.who}</div>
                  <div className="miniq-res">↳ {q.res}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── LOSS CALCULATOR ───────────────────────────── */
interface ATLossCalcProps {
  dictionary: any;
  onOpen: () => void;
  lang?: string;
}

export const ATLossCalc: FC<ATLossCalcProps> = ({ dictionary, onOpen, lang = 'uz' }) => {
  const [clients, setClients] = useState(300);
  const [check, setCheck] = useState(80);
  const [industry, setIndustry] = useState(15); // brand impact %

  const loss = Math.round(clients * check * 1000 * (industry / 100));
  const fmtSom = (n: number) => {
    if (lang === 'en') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (n >= 1_000) return Math.round(n / 1_000) + 'K';
      return n.toString();
    }
    if (lang === 'ru') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' млн';
      if (n >= 1_000) return Math.round(n / 1_000) + ' тыс';
      return n.toString();
    }
    if (lang === 'zh') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + '百万';
      if (n >= 1_000) return Math.round(n / 1_000) + '千';
      return n.toString();
    }
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' mln';
    if (n >= 1_000) return Math.round(n / 1_000) + ' ming';
    return n.toString();
  };

  return (
    <section className="calc">
      <div className="calc-bg"/>
      <div className="wrap">
        <div className="calc-grid">
          <div className="calc-left">
            <span className="calc-eb">
              <span className="dot"/>
              <span>{dictionary?.loss_calc_eyebrow || "Yo'qotish kalkulyatori · oraliq hisob"}</span>
            </span>
            {dictionary?.loss_calc_title?.includes('\n') ? (
              <h2>
                {dictionary.loss_calc_title.split('\n')[0]}<br/>
                <span className="it">{dictionary.loss_calc_title.split('\n')[1]}</span>
              </h2>
            ) : (
              <h2>
                {dictionary?.loss_calc_title || "Brendingiz qancha yo'qotyapti?"}
              </h2>
            )}
            <p>
              {dictionary?.loss_calc_lede || "3 ta savolga javob bering — hozirgi brend tufayli oyiga qancha daromad yo'qolayotganini taxminlaymiz. Bu — biz auditda aniq raqam bilan ko'rsatadigan narsamiz."}
            </p>
          </div>
          <div className="calc-form">
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q1 || "Oyiga necha mijoz keladi?"}</span>
                <span className="v">{clients}</span>
              </label>
              <input className="calc-slider" type="range" min={50} max={3000} step={50}
                value={clients} onChange={e => setClients(+e.target.value)}/>
            </div>
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q2 || "O'rtacha chek (ming so'm)"}</span>
                <span className="v">{check}</span>
              </label>
              <input className="calc-slider" type="range" min={20} max={500} step={5}
                value={check} onChange={e => setCheck(+e.target.value)}/>
            </div>
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q3 || "Brend ta'siri darajasi"}</span>
                <span className="v">{industry}%</span>
              </label>
              <input className="calc-slider" type="range" min={5} max={35} step={1}
                value={industry} onChange={e => setIndustry(+e.target.value)}/>
            </div>
            <div className="calc-out">
              <div className="k">{dictionary?.loss_calc_result || "Taxminiy oylik yo'qotish"}</div>
              <div className="n">~{fmtSom(loss)}<span className="s"> {dictionary?.loss_calc_result_val || "so'm"}</span></div>
              <div className="pl">↳ {dictionary?.loss_calc_result_note || "yiliga"} ~{fmtSom(loss * 12)} {dictionary?.loss_calc_result_note_2 || "so'm · auditda aniq raqamda hisoblaymiz"}</div>
              <button className="calc-cta" onClick={onOpen}>
                {dictionary?.loss_calc_cta || "Mening biznesim uchun aniqlash"} <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── INDEX (selected work table) ───────────────── */
export const ATIndex: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const indexItems = dictionary?.index || [];

  return (
    <section className="sec wrap">
      <div className="sec-head">
        <h2>
          {dictionary?.index_title?.includes('\n') ? (
            <>
              {dictionary.index_title.split('\n')[0]}<br/>
              <span className="it">{dictionary.index_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">{dictionary?.index_title || "Tanlangan ishlar indeksi."}</span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 03</span>
            <span>{dictionary?.index_archive_eyebrow || "Arxiv"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: (dictionary?.index_lede || "2022–2025 davrida tanlangan {count} ta loyiha. Har biri real biznes, real raqam, real natija.").replace('{count}', String(indexItems.length)) }} />
        </div>
      </div>
      <div className="idx">
        <div className="idx-row head">
          <span>{dictionary?.index_th_year || "Yil"}</span>
          <span>{dictionary?.index_th_client || "Mijoz"}</span>
          <span>{dictionary?.index_th_sector || "Soha · Joy"}</span>
          <span>{dictionary?.index_th_discipline || "Yo'nalish"}</span>
          <span>{dictionary?.index_th_result || "Natija"}</span>
          <span></span>
        </div>
        {indexItems.map((c: any, i: number) => (
          <div key={i} className="idx-row" onClick={onOpen}>
            <span className="yr">{c.yr}</span>
            <span className="client">{c.client}</span>
            <span className="sector">{c.sector}</span>
            <span className="discipline">{c.discipline}</span>
            <span className="result">{c.result}</span>
            <div className="arr">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── PROCESS ───────────────────────────────────── */
export const ATProcess: FC<{ dictionary: any; lang?: string }> = ({ dictionary, lang = 'uz' }) => {
  const [open, setOpen] = useState<number | null>(null);
  const processItems = dictionary?.process || [];

  const extra = [
    { 
      ex: lang === 'ru' ? "Пример: Qumri Coffee" : lang === 'en' ? "Example: Qumri Coffee" : lang === 'zh' ? "示例：Qumri Coffee" : "Misol: Qumri Coffee", 
      t: lang === 'ru' ? "7 страниц онлайн-анкеты, запрошено 12 материалов. Техническое задание утверждено на 2-й день." : lang === 'en' ? "7 pages of online questionnaire, 12 materials requested. Technical specification approved on day 2." : lang === 'zh' ? "7页在线问卷，索取12份材料。技术规范在第2天获得批准。" : "7 betlik onlayn anketa, 12 ta materiallar so'raldi. 2-kunga texnik topshiriq tasdiqlandi." 
    },
    { 
      ex: lang === 'ru' ? "Пример: Oltin Bulut" : lang === 'en' ? "Example: Oltin Bulut" : lang === 'zh' ? "示例：Oltin Bulut" : "Misol: Oltin Bulut", 
      t: lang === 'ru' ? "Проанализировано 5 конкурентов, 6 интервью с клиентами, 12 упаковок продуктов. Упущенная выгода: 3.7 млн в месяц." : lang === 'en' ? "5 competitors, 6 customer interviews, 12 product packaging analyzed. Lost revenue: 3.7M/month." : lang === 'zh' ? "分析了5个竞争对手，6个客户访谈，12个产品包装。每月流失：370万。" : "5 raqobatchi, 6 ta mijoz interviyu, 12 ta mahsulot qadog'i tahlil qilindi. Yo'qotish: oyiga 3.7M." 
    },
    { 
      ex: lang === 'ru' ? "Пример: Humo" : lang === 'en' ? "Example: Humo" : lang === 'zh' ? "示例：Humo" : "Misol: Humo", 
      t: lang === 'ru' ? "PDF + 1 час онлайн-презентации. 90-дневный план с 12 конкретными действиями." : lang === 'en' ? "PDF + 1-hour online presentation. 90-day plan with 12 specific actions." : lang === 'zh' ? "PDF + 1小时在线展示。90天计划，包含12个具体行动。" : "PDF + 1 soatlik onlayn prezentatsiya. 90 kunlik reja 12 ta aniq harakat bilan." 
    },
  ];

  return (
    <section className="sec wrap" id="jarayon">
      <div className="sec-head">
        <h2>
          {dictionary?.process_title?.includes('\n') ? (
            <>
              {dictionary.process_title.split('\n')[0]}<br/>
              <span className="it">{dictionary.process_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">{dictionary?.process_title || "3 qadam, hech narsa yashirin emas."}</span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 04</span>
            <span>{dictionary?.nav?.[4]?.label || "Jarayon"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.process_lede || "Har bosqichda sizning fikringizni olamiz. Yoqtirmaganingizni qayta ishlaymiz. <strong>Mamnun bo'lmasangiz, pulni qaytaramiz.</strong>" }} />
        </div>
      </div>
      <div className="proc">
        {processItems.map((p: any, i: number) => (
          <div key={p.n} className={`proc-col ${open === i ? 'open' : ''}`}
               onClick={() => setOpen(open === i ? null : i)}>
            <div className="plus-toggle">+</div>
            <div className="num">{p.n}</div>
            <h3>{p.name}</h3>
            <p>{p.note}</p>
            <div className="reveal">
              <div className="reveal-inner">
                {extra[i] ? extra[i].t : ""}
                <em>— {extra[i] ? extra[i].ex : ""}</em>
              </div>
            </div>
            <div className="meta">
              <span>{dictionary?.process_step_label || "Bosqich"} · {p.n}</span>
              <span className="v">{p.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── PRICING ───────────────────────────────────── */
export const ATPricing: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const packagesItems = dictionary?.packages || [];

  return (
    <section className="sec wrap" id="narxlar">
      <div className="sec-head">
        <h2>
          {dictionary?.pricing_title?.includes('\n') ? (
            <>
              {dictionary.pricing_title.split('\n')[0]}<br/>
              <span className="it">{dictionary.pricing_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">{dictionary?.pricing_title || "Aniq narx, yashirin xarajat yo'q."}</span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 05</span>
            <span>{dictionary?.nav?.[3]?.label || "Narxlar"}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.pricing_lede || "Paketni tanlaysiz, to'lov jadvalini kelishamiz, boshlaymiz. <strong>Hech qanday tushuntirilmagan summa qo'shilmaydi.</strong>" }} />
        </div>
      </div>
      <div className="guarantee">
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text"><span className="l">{dictionary?.pricing_guarantee_1_lbl || "Kafolat"}</span> {dictionary?.pricing_guarantee_1_val || "100% pul qaytarish"}</div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text"><span className="l">{dictionary?.pricing_guarantee_2_lbl || "Muddati"}</span> {dictionary?.pricing_guarantee_2_val || "14 kun · 0 ta kechikish"}</div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text"><span className="l">{dictionary?.pricing_guarantee_3_lbl || "Hujjat"}</span> {dictionary?.pricing_guarantee_3_val || "30—50 betlik PDF"}</div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text"><span className="l">{dictionary?.pricing_guarantee_4_lbl || "Tajriba"}</span> {dictionary?.pricing_guarantee_4_val || "6 yil · 240+ tashxis"}</div>
        </div>
      </div>
      <div className="price-grid">
        {packagesItems.map((p: any) => (
          <div key={p.name} className={`price-card ${p.featured ? 'featured' : ''}`}>
            {p.featured && <div className="price-badge">{dictionary?.pricing_featured_badge || "87% mijoz tanlaydi"}</div>}
            <div className="price-head">
              <span className="price-tag">{p.tag}</span>
              <h3>{p.name}</h3>
            </div>
            <div className="price-desc">{p.desc}</div>
            <div className="price-num">
              {p.price === 'Kelishiladi' || p.price === 'Договорная' || p.price === 'Negotiable' || p.price === '面议' ? (
                <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, color: 'var(--ink-2)' }}>{p.price}</span>
              ) : (
                <>{p.price}<span className="s">.</span></>
              )}
            </div>
            <div className="price-unit">{p.unit}</div>
            <div className="price-rule"/>
            <ul>
              {p.incl.map((x: any, i: number) => (
                <li key={i}><span className="ck">✓</span><span>{x}</span></li>
              ))}
            </ul>
            <button className="price-cta" onClick={onOpen}>
              <span>{p.featured ? (dictionary?.pricing_cta_featured || "Hozir boshlash") : (dictionary?.pricing_cta_standard || "Tanlash")}</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 32,
        padding: '24px 32px',
        borderRadius: 16,
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 20,
        flexWrap: 'wrap', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            {dictionary?.pricing_payment_schedule || "To'lov jadvali"}
          </div>
          <div style={{ fontSize: 15 }}>{dictionary?.pricing_payment_schedule_val || "40% boshida · 30% birinchi variant tasdiqlanganda · 30% topshirishda"}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Payme', 'Click', 'Bank'].map(p => (
            <span key={p} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', padding: '6px 12px', background: 'var(--bg)', borderRadius: 999, border: '1px solid var(--line)' }}>{p}</span>
          ))}
        </div>
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

export const ATQuotes: FC<ATQuotesProps> = ({ dictionary, testimonials: testimonialsProp, lang }) => {
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const list = testimonialsProp && testimonialsProp.length > 0 ? testimonialsProp : (() => {
    switch (lang) {
      case 'ru': return staticTestimonialsRu;
      case 'en': return staticTestimonialsEn;
      case 'zh': return staticTestimonialsZh;
      default: return staticTestimonials;
    }
  })();

  const videoTestimonials = list.filter((t) => t.videoUrl);
  const audioTestimonials = list.filter((t) => !t.videoUrl && t.audioUrl);
  const textTestimonials = list.filter((t) => !t.videoUrl && !t.audioUrl && t.quote?.trim());

  const getVimeoVideoId = (url?: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (!hostname.includes('vimeo.com')) return '';
      const parts = parsed.pathname.split('/').filter(Boolean);
      const videoIndex = parts.indexOf('video');
      return videoIndex >= 0 ? parts[videoIndex + 1] || '' : parts[0] || '';
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
      <div className="sec-head">
        <h2>
          {dictionary?.quotes_title?.includes('\n') ? (
            <>
              {dictionary.quotes_title.split('\n')[0]}<br/>
              <span className="it">{dictionary.quotes_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">{dictionary?.quotes_title || "Mijozlar o'z so'zlari bilan."}</span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 06</span>
            <span>{dictionary?.footer_pages_title?.includes('Sharh') ? dictionary.footer_pages_title : 'Sharhlar'}</span>
          </span>
          <p dangerouslySetInnerHTML={{ __html: dictionary?.quotes_lede || "Har bir gap real biznes egasidan, real loyiha haqida. <strong>Yolg'on yoki bo'rttirma yo'q</strong> — tekshirishingiz mumkin." }} />
        </div>
      </div>

      {videoTestimonials.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            ↳ {lang === 'ru' ? 'Видео отзывы' : lang === 'en' ? 'Video reviews' : lang === 'zh' ? '视频反馈' : 'Video sharhlar'}
          </div>
          <div className="quotes-video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {videoTestimonials.map((t, idx) => (
              <div key={idx} className="quote-video-card" onClick={() => setActiveVideo(t)} style={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#0E1015',
                cursor: 'pointer',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                {t.image ? (
                  <Image src={t.image} alt={t.name} fill className="object-cover opacity-80 transition-transform duration-300 hover:scale-105" sizes="220px" />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1B4DFF20, #C2552A20)' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,16,21,0.95), rgba(14,16,21,0.2) 60%, transparent)' }} />
                
                <div style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', color: '#0E1015', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <PlayCircle size={20} />
                </div>
                
                <div style={{ position: 'relative', zIndex: 2, padding: '16px', color: '#FFF' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.company}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {audioTestimonials.map((t, idx) => (
          <div key={idx} className="quote-audio-card" style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}>
            <audio ref={el => { audioRefs.current[t.audioUrl] = el; }} src={t.audioUrl} preload="none" onEnded={() => handleAudioEnded(t.audioUrl)} />
            <div>
              <div style={{ display: 'flex', gap: 2, color: 'var(--accent)', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: 14, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--ink-2)' }}>
                "{t.quote}"
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <button onClick={() => toggleAudio(t.audioUrl)} style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: playingAudio === t.audioUrl ? 'var(--accent)' : 'var(--bg)',
                color: playingAudio === t.audioUrl ? '#FFF' : 'var(--ink)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {playingAudio === t.audioUrl ? <Pause size={18} /> : <Volume2 size={18} />}
              </button>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{t.company}</div>
              </div>
            </div>
          </div>
        ))}

        {textTestimonials.map((t, idx) => (
          <div key={idx} className="quote-text-card" style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}>
            <div>
              <div style={{ display: 'flex', gap: 2, color: 'var(--accent)', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: 14, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--ink-2)' }}>
                "{t.quote}"
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{t.company}</div>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(14, 16, 21, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'relative',
            width: '100%',
            maxWidth: 360,
            aspectRatio: '9/16',
            background: '#0E1015',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <iframe
              src={getVimeoEmbedUrl(activeVideo.videoUrl)}
              title={`${activeVideo.name} video testimonial`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            <button onClick={() => setActiveVideo(null)} style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(14,16,21,0.8)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}>
              <X size={18} />
            </button>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              background: 'linear-gradient(to top, rgba(14,16,21,0.95), rgba(14,16,21,0.4) 60%, transparent)',
              padding: 24,
              color: '#FFF',
            }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{activeVideo.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{activeVideo.company}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* ── FAQ ───────────────────────────────────────── */
export const ATFAQ: FC<{ dictionary: any }> = ({ dictionary }) => {
  const [open, setOpen] = useState(0);
  const faqItems = dictionary?.faq || [];

  return (
    <section className="sec wrap" id="savol">
      <div className="faq-grid">
        <div>
          <span className="eb" style={{ marginBottom: 18, display: 'inline-flex' }}>
            <span className="dot"/>
            <span className="ix">§ 07</span>
            <span>{dictionary?.faq_section_badge || "Savol-javob"}</span>
          </span>
          <h2 style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, marginBottom: 24 }}>
            {dictionary?.faq_title?.includes('\n') ? (
              <>
                {dictionary.faq_title.split('\n')[0]}<br/>
                <span className="serif" style={{ color: 'var(--accent)' }}>{dictionary.faq_title.split('\n')[1]}</span>
              </>
            ) : (
              <span className="serif" style={{ color: 'var(--accent)' }}>{dictionary?.faq_title || "Tez-tez so'raladi."}</span>
            )}
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            {dictionary?.faq_lede || "Javob topa olmadingizmi? Yozing — jamoamiz 24 soat ichida javob beradi."}
          </p>
          <a href="mailto:salom@jon.uz" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 24, fontWeight: 600, fontSize: 14,
            padding: '12px 18px', border: '1px solid var(--line)',
            borderRadius: 999, background: 'var(--paper)',
          }}>
            salom@jon.uz <span style={{ color: 'var(--accent)' }}>↗</span>
          </a>
        </div>
        <div className="faq-list">
          {faqItems.map((f: any, i: number) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.q}</h3>
                <div className="faq-plus">+</div>
              </div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── FINAL CTA ─────────────────────────────────── */
export const ATFinal: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="final">
      <div className="final-bg"/>
      <div className="wrap">
        <div className="final-eb">
          <span>{dictionary?.final_cta_badge || "Boshlashga tayyormisiz?"}</span>
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: (dictionary?.final_cta_title || "Tashxis qiling —<br/>keyin tuzating.").replace(/\n/g, '<br/>') }} />
        <p dangerouslySetInnerHTML={{ __html: dictionary?.final_cta_lede || "14 kun ichida hisobot tayyor. 50% boshida, 50% prezentatsiyada. Foydali tavsiya topilmasa — <strong>100% pulni qaytaramiz.</strong>" }} />
        <div className="final-row">
          <button className="btn btn-primary btn-lg" onClick={onOpen}>
            {dictionary?.final_cta_cta || "Bepul mini-tashxis olish"} <span className="ar">↗</span>
          </button>
          <a href="mailto:salom@jon.uz" className="btn btn-ghost btn-lg">salom@jon.uz</a>
        </div>
        <div className="final-meta">
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_left || "Bu oyda"}</div>
            <div className="v"><span className="s">4</span>{dictionary?.final_cta_stat_left_val || "/6 joy qoldi"}</div>
          </div>
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_time || "Tashxis muddati"}</div>
            <div className="v">{dictionary?.final_cta_stat_time_val || "14 kun ichida"}</div>
          </div>
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_dur || "Mini-tashxis davomiyligi"}</div>
            <div className="v">{dictionary?.final_cta_stat_dur_val || "30 daqiqa"}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── FOOTER ────────────────────────────────────── */
export const ATFooter: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <footer className="foot">
      <div className="foot-cta">
        <div className="wrap">
          <div className="foot-cta-inner">
            <div className="foot-cta-text" dangerouslySetInnerHTML={{ __html: (dictionary?.footer_ask || "Sahifa oxirigacha tushdingiz —<br/><span class=\"it\">savol bormi?</span>").replace(/\n/g, '<br/>') }} />
            <div className="foot-cta-btns">
              <a className="foot-cta-btn tg" href="https://t.me/jonbranding_bot" target="_blank" rel="noreferrer">
                {dictionary?.footer_write_tg || "Telegram'da yozish →"}
              </a>
              <a className="foot-cta-btn" href="tel:+998336450097">
                {dictionary?.footer_call_phone || "Qo'ng'iroq qilish"}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-col">
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 2,
              fontWeight: 700, fontSize: 28, letterSpacing: '-0.035em',
              marginBottom: 18,
              color: 'var(--bg)',
            }}>
              <span>jon</span>
              <span style={{ color: 'var(--accent)', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 36, lineHeight: .7 }}>.</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(244,241,232,.6)', maxWidth: 320, lineHeight: 1.65 }}>
              {dictionary?.footer_about || "Markaziy Osiyo brending atelyesi. 2019-yildan beri biznesni mijoz xayolida qoldiramiz."}
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 8 }}>
              {['IG', 'TG', 'Be', 'Yt'].map(s => (
                <a key={s} href="#" style={{
                  width: 38, height: 38,
                  borderRadius: 999,
                  border: '1px solid rgba(244,241,232,.15)',
                  display: 'grid', placeItems: 'center',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.05em',
                  transition: 'border-color .2s, background .2s',
                }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_pages_title || "Sahifalar"}</h4>
            <ul>
              <li><a href="#tashxis">{dictionary?.nav?.[0]?.label || "Tashxis"}</a></li>
              <li><a href="#belgilar">{dictionary?.nav?.[1]?.label || "Belgilar"}</a></li>
              <li><a href="#ishlar">{dictionary?.nav?.[2]?.label || "Ishlar"}</a></li>
              <li><a href="#narxlar">{dictionary?.nav?.[3]?.label || "Narxlar"}</a></li>
              <li><a href="#jarayon">{dictionary?.nav?.[4]?.label || "Jarayon"}</a></li>
              <li><a href="#savol">{dictionary?.nav?.[5]?.label || "Savollar"}</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_contact_title || "Aloqa"}</h4>
            <ul>
              <li><a href="tel:+998336450097">+998 33 645 00 97</a></li>
              <li><a href="mailto:salom@jon.uz">salom@jon.uz</a></li>
              <li><span style={{ color: 'rgba(244,241,232,.55)' }}>Toshkent, O'zbekiston</span></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_office_title || "Ofis"}</h4>
            <ul>
              <li><span style={{ color: 'rgba(244,241,232,.55)' }}>{dictionary?.footer_office_days || "Du–Ju · 10:00–19:00"}</span></li>
              <li><span style={{ color: 'rgba(244,241,232,.55)' }}>{dictionary?.footer_office_weekend || "Sha–Ya · dam olish"}</span></li>
              <li><span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{dictionary?.footer_office_status || "Yangi loyihalar uchun ochiq"}</span></li>
            </ul>
          </div>
        </div>
        <div className="foot-strip">
          <span>{dictionary?.footer_copyright || "© MMXIX—MMXXVI · Jon Branding Atelier · Toshkent"}</span>
          <span>{dictionary?.footer_made_in || "Made in Tashkent with care"}</span>
        </div>
      </div>
    </footer>
  );
};

/* ── STICKY ────────────────────────────────────── */
export const ATStickyCta: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState('belgilar');
  const sections = ['belgilar', 'tashxis', 'narxlar', 'jarayon', 'savol'];
  const variants = dictionary?.sticky_cta?.variants || {};

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setShow(y > h * 0.6);
      
      let active = 'belgilar';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) active = id;
      }
      setStage(active);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const v = variants[stage] || variants.belgilar;

  if (!v) return null;

  return (
    <div className={`stick ${show ? 'show' : ''}`}>
      <span className="num">{v.num}</span>
      <span>{v.text}</span>
      <button onClick={onOpen}>{v.cta}</button>
    </div>
  );
};

/* ── TWEAKS ────────────────────────────────────── */
interface ATTweaksProps {
  visible: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (t: string) => void;
  grain: boolean;
  setGrain: (g: boolean) => void;
  accent: string;
  setAccent: (a: string) => void;
}

export const ATTweaks: FC<ATTweaksProps> = ({
  visible,
  onClose,
  theme,
  setTheme,
  grain,
  setGrain,
  accent,
  setAccent
}) => {
  if (!visible) return null;

  return (
    <div className="tw">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Tweaks</span>
        <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 11 }}>✕</button>
      </div>
      <div className="tw-r">
        <span>Rejim</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['light', "yorug'"], ['dark', "qorong'i"]].map(([t, l]) => (
            <button key={t} className={`tw-pill ${theme === t ? 'on' : ''}`} onClick={() => setTheme(t)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="tw-r">
        <span>Aksent</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['cobalt', 'kobalt'], ['terra', 'terra'], ['ink', 'siyoh']].map(([t, l]) => (
            <button key={t} className={`tw-pill ${accent === t ? 'on' : ''}`} onClick={() => setAccent(t)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="tw-r">
        <span>Don (grain)</span>
        <button className={`tw-pill ${grain ? 'on' : ''}`} onClick={() => setGrain(!grain)}>
          {grain ? 'yoqilgan' : "o'chirilgan"}
        </button>
      </div>
    </div>
  );
};
