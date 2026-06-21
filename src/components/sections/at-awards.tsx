import type { FC } from 'react';

interface Props { lang?: string; }

const t = {
  uz: {
    eyebrow: 'Yutuqlar va tan olinish',
    heading: 'Agentlik',
    headingItalic: 'g\'olib.',
    items: [
      { x: 'x5',  l: "Brending\nmukofotlari",    icon: 'trophy' },
      { x: 'x34', l: "Xalqaro\ntan olinish",     icon: 'globe'  },
      { x: 'x11', l: "Reyting\ng'oliblari",      icon: 'star'   },
      { x: 'x7',  l: "Soha\nnominatsiyalari",    icon: 'bolt'   },
    ],
    text: '5000+ muvaffaqiyatli keys, ko\'plab xalqaro mukofotlar va kreativlik reytingida birinchi o\'rin.',
    bold: '5000+ muvaffaqiyatli keys',
    rating: 'Kreativlik reytingi',
  },
  ru: {
    eyebrow: 'Достижения и признание',
    heading: 'Агентство',
    headingItalic: 'победитель.',
    items: [
      { x: 'x5',  l: "Брендинг-\nпремии",         icon: 'trophy' },
      { x: 'x34', l: "Международное\nпризнание",   icon: 'globe'  },
      { x: 'x11', l: "Победители\nрейтингов",      icon: 'star'   },
      { x: 'x7',  l: "Отраслевые\nноминации",      icon: 'bolt'   },
    ],
    text: '5000+ успешных кейсов, многочисленные международные премии и первое место в рейтинге креативности.',
    bold: '5000+ успешных кейсов',
    rating: 'Рейтинг креативности',
  },
  en: {
    eyebrow: 'Awards & Recognition',
    heading: 'Agency',
    headingItalic: 'acclaimed.',
    items: [
      { x: 'x5',  l: "Branding\nawards",          icon: 'trophy' },
      { x: 'x34', l: "International\nrecognition", icon: 'globe'  },
      { x: 'x11', l: "Rating\nwinners",            icon: 'star'   },
      { x: 'x7',  l: "Industry\nnominations",      icon: 'bolt'   },
    ],
    text: "5000+ successful cases, numerous international awards and first place in the creativity rating.",
    bold: '5000+ successful cases',
    rating: 'Creativity rating',
  },
  zh: {
    eyebrow: '奖项与认可',
    heading: '机构',
    headingItalic: '获奖。',
    items: [
      { x: 'x5',  l: "品牌\n大奖",   icon: 'trophy' },
      { x: 'x34', l: "国际\n认可",   icon: 'globe'  },
      { x: 'x11', l: "排行榜\n冠军", icon: 'star'   },
      { x: 'x7',  l: "行业\n提名",   icon: 'bolt'   },
    ],
    text: '5000+成功案例，众多国际奖项，创意排名第一。',
    bold: '5000+成功案例',
    rating: '创意评级',
  },
} as const;

type Lang = keyof typeof t;

const Icon: FC<{ name: string }> = ({ name }) => {
  if (name === 'trophy') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/><path d="M7 9a5 5 0 0010 0V5H7v4z"/>
      <path d="M12 14v4M8 18h8"/>
    </svg>
  );
  if (name === 'globe') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
  if (name === 'star') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
  );
};

const AtAwards: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section style={{
      background: '#0E1016',
      color: '#F2EFE6',
      padding: '96px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '30%',
        transform: 'translate(-50%,-50%)',
        width: 700, height: 500,
        background: 'radial-gradient(ellipse, rgba(91,124,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <div className="at-awards-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left: stat cards */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(242,239,230,0.35)', marginBottom: 36,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5B7CFF', display: 'inline-block' }} />
              {l.eyebrow}
            </div>

            <div className="at-awards-stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {l.items.map((item, i) => {
                const radius = [
                  '16px 2px 2px 2px',
                  '2px 16px 2px 2px',
                  '2px 2px 2px 16px',
                  '2px 2px 16px 2px',
                ][i];
                return (
                  <div key={item.x} style={{
                    padding: '26px 22px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: radius,
                    display: 'flex', flexDirection: 'column', gap: 14,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: 'rgba(91,124,255,0.1)',
                      border: '1px solid rgba(91,124,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#5B7CFF',
                    }}>
                      <Icon name={item.icon} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: 'clamp(38px, 4vw, 58px)',
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: '#F2EFE6',
                      }}>{item.x}</div>
                      <div style={{
                        fontSize: 10,
                        color: 'rgba(242,239,230,0.38)',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-line',
                        marginTop: 5,
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                      }}>{item.l}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: description */}
          <div className="at-awards-desc" style={{
            paddingLeft: 48,
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Award seal */}
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.025)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 28,
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(242,239,230,0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
                <path d="M7 9a5 5 0 0010 0V5H7v4z"/>
                <path d="M12 14v4M8 18h8"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: 'clamp(26px, 2.8vw, 38px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#F2EFE6',
              marginBottom: 20,
            }}>
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: '#5B7CFF' }}>
                {l.headingItalic}
              </span>
            </h2>

            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.65,
              color: 'rgba(242,239,230,0.55)',
              marginBottom: 36,
              fontWeight: 300,
            }}>
              {l.text.split(l.bold).map((part, i, arr) => (
                i < arr.length - 1
                  ? <span key={i}>{part}<strong style={{ color: '#F2EFE6', fontWeight: 600 }}>{l.bold}</strong></span>
                  : <span key={i}>{part}</span>
              ))}
            </p>

            <div style={{
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#5B7CFF" opacity="0.75">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <span style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'rgba(242,239,230,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>5.0 · {l.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .at-awards-wrap { grid-template-columns: 1fr !important; gap: 40px !important; }
          .at-awards-desc { padding-left: 0 !important; border-left: none !important; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.07) !important; }
        }
      `}</style>
    </section>
  );
};

export default AtAwards;
