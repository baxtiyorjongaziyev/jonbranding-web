import type { FC } from 'react';

interface Props { lang?: string; }

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
const INITIALS = ['CA', 'UZ', 'RR', 'JB'];

const t = {
  uz: {
    eyebrow: '§ Yutuqlar · Reytinglar',
    heading: 'Agentlik',
    headingItalic: "g'olib tan olingan.",
    stats: [
      { x: 'x5',  l: "Brending\nmukofotlari",  icon: 'trophy' },
      { x: 'x34', l: "Xalqaro\ntan olinish",   icon: 'globe'  },
      { x: 'x11', l: "Reyting\ng'oliblari",    icon: 'star'   },
      { x: 'x7',  l: "Soha\nnominatsiyalari",  icon: 'bolt'   },
      { x: '514', l: "Yaratilgan\nbrend",       icon: null     },
      { x: '37',  l: "Bozor\nsohasi",          icon: null     },
    ],
    orgs: [
      { nm: "Markaziy Osiyo BA", pos: "a'zo · 2021" },
      { nm: "UZ Branding Top",   pos: "top 10"       },
      { nm: "Runet Rating",      pos: "eng yaxshilar" },
      { nm: "Jon Top 100",       pos: "№1 brending"  },
    ],
    clientRating: 'Mijozlar baholashi',
  },
  ru: {
    eyebrow: '§ Достижения · Рейтинги',
    heading: 'Агентство',
    headingItalic: 'победитель, признанное.',
    stats: [
      { x: 'x5',  l: "Брендинг-\nпремии",       icon: 'trophy' },
      { x: 'x34', l: "Международное\nпризнание", icon: 'globe'  },
      { x: 'x11', l: "Победители\nрейтингов",   icon: 'star'   },
      { x: 'x7',  l: "Отраслевые\nноминации",   icon: 'bolt'   },
      { x: '514', l: "Созданных\nбрендов",       icon: null     },
      { x: '37',  l: "Отраслей\nрынка",          icon: null     },
    ],
    orgs: [
      { nm: "ЦА Брендинг Ассоц.", pos: "член · 2021"  },
      { nm: "UZ Branding Top",    pos: "топ 10"        },
      { nm: "Runet Rating",       pos: "лучшие"        },
      { nm: "Jon Top 100",        pos: "№1 брендинг"  },
    ],
    clientRating: 'Оценка клиентов',
  },
  en: {
    eyebrow: '§ Awards · Ratings',
    heading: 'Agency',
    headingItalic: 'acclaimed & recognised.',
    stats: [
      { x: 'x5',  l: "Branding\nawards",          icon: 'trophy' },
      { x: 'x34', l: "International\nrecognition", icon: 'globe'  },
      { x: 'x11', l: "Rating\nwinners",            icon: 'star'   },
      { x: 'x7',  l: "Industry\nnominations",      icon: 'bolt'   },
      { x: '514', l: "Brands\ncreated",            icon: null     },
      { x: '37',  l: "Market\nsectors",            icon: null     },
    ],
    orgs: [
      { nm: "Central Asia BA", pos: "member · 2021" },
      { nm: "UZ Branding Top", pos: "top 10"         },
      { nm: "Runet Rating",    pos: "top tier"        },
      { nm: "Jon Top 100",     pos: "#1 branding"    },
    ],
    clientRating: 'Client rating',
  },
  zh: {
    eyebrow: '§ 奖项 · 排行',
    heading: '机构',
    headingItalic: '获奖并获得认可。',
    stats: [
      { x: 'x5',  l: "品牌\n大奖",   icon: 'trophy' },
      { x: 'x34', l: "国际\n认可",   icon: 'globe'  },
      { x: 'x11', l: "排行榜\n冠军", icon: 'star'   },
      { x: 'x7',  l: "行业\n提名",   icon: 'bolt'   },
      { x: '514', l: "创建的\n品牌",  icon: null     },
      { x: '37',  l: "市场\n行业",   icon: null     },
    ],
    orgs: [
      { nm: "中亚品牌协会",    pos: "会员 · 2021" },
      { nm: "UZ Branding Top", pos: "前10"        },
      { nm: "Runet Rating",    pos: "顶尖"        },
      { nm: "Jon Top 100",     pos: "#1品牌"      },
    ],
    clientRating: '客户评分',
  },
} as const;

type Lang = keyof typeof t;

const Icon: FC<{ name: string }> = ({ name }) => {
  if (name === 'trophy') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
      <path d="M7 9a5 5 0 0010 0V5H7v4z"/><path d="M12 14v4M8 18h8"/>
    </svg>
  );
  if (name === 'globe') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
  if (name === 'star') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      padding: '96px 0 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '25%',
        transform: 'translate(-50%,-50%)',
        width: 800, height: 600,
        background: 'radial-gradient(ellipse, rgba(91,124,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px', position: 'relative' }}>

        {/* Top: heading + org cards */}
        <div className="at-aw-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', paddingBottom: 64 }}>

          {/* Left: heading */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(242,239,230,0.35)', marginBottom: 32,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5B7CFF', display: 'inline-block' }} />
              {l.eyebrow}
            </div>

            <h2 style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              color: '#F2EFE6',
              margin: 0,
            }}>
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: '#5B7CFF' }}>
                {l.headingItalic}
              </span>
            </h2>
          </div>

          {/* Right: org membership cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {l.orgs.map((org, i) => {
              const c = COLORS[i % COLORS.length];
              const ini = INITIALS[i % INITIALS.length];
              return (
                <div key={org.nm} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    background: c, borderRadius: '12px 0 0 12px',
                  }} />
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: `${c}15`, border: `1px solid ${c}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 10, color: c,
                    letterSpacing: '0.04em', fontFamily: 'var(--font-mono)',
                  }}>{ini}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 12.5, color: '#F2EFE6',
                      letterSpacing: '-0.01em', lineHeight: 1.2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{org.nm}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: 'rgba(242,239,230,0.35)',
                      textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2,
                    }}>{org.pos}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" fill={`${c}20`}/>
                    <path d="M8 12l3 3 5-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}

            {/* Star rating */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              marginTop: 4,
            }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#5B7CFF" opacity="0.8">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'rgba(242,239,230,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>5.0 · {l.clientRating}</span>
            </div>
          </div>
        </div>

        {/* Bottom: 6-stat strip */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="at-aw-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {l.stats.map((s, i) => (
              <div key={s.x} style={{
                padding: '28px 20px',
                borderRight: i < 5 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {s.icon && (
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: 'rgba(91,124,255,0.1)',
                    border: '1px solid rgba(91,124,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#5B7CFF',
                  }}>
                    <Icon name={s.icon} />
                  </div>
                )}
                <div>
                  <div style={{
                    fontSize: i >= 4 ? 'clamp(36px, 3.5vw, 52px)' : 'clamp(28px, 2.8vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    color: '#F2EFE6',
                  }}>
                    {s.x}
                    {i >= 4 && (
                      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: '#5B7CFF' }}>.</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 9, color: 'rgba(242,239,230,0.35)',
                    lineHeight: 1.45, whiteSpace: 'pre-line',
                    marginTop: 5,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .at-aw-top { grid-template-columns: 1fr !important; gap: 36px !important; }
          .at-aw-stats { grid-template-columns: repeat(3, 1fr) !important; }
          .at-aw-stats > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
        }
        @media (max-width: 540px) {
          .at-aw-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default AtAwards;
