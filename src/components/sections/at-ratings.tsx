import type { FC } from 'react';

interface Props { lang?: string; }

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
const INITIALS = ['CA', 'UZ', 'RR', 'JB'];

const t = {
  uz: {
    eyebrow: '§ Reytinglarda',
    heading: 'Agentlik',
    headingItalic: 'tan olingan.',
    logos: [
      { nm: "Markaziy Osiyo BA", pos: "a'zo · 2021" },
      { nm: "UZ Branding Top",   pos: "top 10" },
      { nm: "Runet Rating",      pos: "eng yaxshilar" },
      { nm: "Jon Top 100",       pos: "№1 brending" },
    ],
    num1: { n: '514', l: 'yaratilgan brend' },
    num2: { n: '37',  l: 'bozor sohasi' },
    clientRating: 'Mijozlar baholashi',
  },
  ru: {
    eyebrow: '§ В рейтингах',
    heading: 'Агентство',
    headingItalic: 'признано.',
    logos: [
      { nm: "ЦА Брендинг Ассоц.", pos: "член · 2021" },
      { nm: "UZ Branding Top",    pos: "топ 10" },
      { nm: "Runet Rating",       pos: "лучшие" },
      { nm: "Jon Top 100",        pos: "№1 брендинг" },
    ],
    num1: { n: '514', l: 'созданных брендов' },
    num2: { n: '37',  l: 'отраслей рынка' },
    clientRating: 'Оценка клиентов',
  },
  en: {
    eyebrow: '§ In ratings',
    heading: 'Agency',
    headingItalic: 'recognised.',
    logos: [
      { nm: "Central Asia BA", pos: "member · 2021" },
      { nm: "UZ Branding Top", pos: "top 10" },
      { nm: "Runet Rating",    pos: "top tier" },
      { nm: "Jon Top 100",     pos: "#1 branding" },
    ],
    num1: { n: '514', l: 'brands created' },
    num2: { n: '37',  l: 'market sectors' },
    clientRating: 'Client rating',
  },
  zh: {
    eyebrow: '§ 排行榜',
    heading: '机构',
    headingItalic: '获得认可。',
    logos: [
      { nm: "中亚品牌协会",    pos: "会员 · 2021" },
      { nm: "UZ Branding Top", pos: "前10" },
      { nm: "Runet Rating",    pos: "顶尖" },
      { nm: "Jon Top 100",     pos: "#1品牌" },
    ],
    num1: { n: '514', l: '创建的品牌' },
    num2: { n: '37',  l: '市场行业' },
    clientRating: '客户评分',
  },
} as const;

type Lang = keyof typeof t;

const AtRatings: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section style={{
      background: 'var(--at-bg)',
      borderTop: '1px solid var(--at-line)',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px' }}>
        <div className="at-ratings-in" style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: 64,
          alignItems: 'center',
          padding: '88px 0',
        }}>

          {/* Left */}
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--at-muted)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--at-green)', display: 'inline-block' }} />
              {l.eyebrow}
            </span>

            <h2 style={{
              fontSize: 'clamp(30px, 3.8vw, 52px)',
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              fontWeight: 800,
              margin: '16px 0 36px',
              color: 'var(--at-ink)',
            }}>
              {l.heading}{' '}
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--at-accent)',
              }}>{l.headingItalic}</span>
            </h2>

            {/* Rating org cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {l.logos.map((logo, i) => {
                const c = COLORS[i % COLORS.length];
                const initials = INITIALS[i % INITIALS.length];
                return (
                <div key={logo.nm} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: 'var(--at-paper)',
                  border: '1px solid var(--at-line)',
                  borderRadius: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: c,
                    borderRadius: '14px 0 0 14px',
                  }} />

                  {/* Initials badge */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                    background: `${c}12`,
                    border: `1px solid ${c}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 11,
                    color: c,
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {initials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 12.5,
                      color: 'var(--at-ink)',
                      letterSpacing: '-0.01em', lineHeight: 1.2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{logo.nm}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: 'var(--at-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      marginTop: 3,
                    }}>{logo.pos}</div>
                  </div>

                  {/* Verified badge */}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" fill={`${c}18`}/>
                    <path d="M8 12l3 3 5-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                );
              })}
            </div>
          </div>

          {/* Right: stats card */}
          <div style={{
            background: 'var(--at-paper)',
            border: '1px solid var(--at-line)',
            borderRadius: 24,
            overflow: 'hidden',
          }}>
            {/* Top: big numbers */}
            <div style={{ padding: '36px 36px 0' }}>
              {[l.num1, l.num2].map((num, i) => (
                <div key={num.n} style={{
                  paddingBottom: i === 0 ? 28 : 0,
                  paddingTop: i === 1 ? 28 : 0,
                  borderBottom: i === 0 ? '1px solid var(--at-line)' : 'none',
                }}>
                  <div style={{
                    fontSize: 'clamp(52px, 5.5vw, 76px)',
                    fontWeight: 800,
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                    color: 'var(--at-ink)',
                  }}>
                    {num.n}
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: 'var(--at-accent)',
                    }}>.</span>
                  </div>
                  <div style={{
                    fontSize: 13, color: 'var(--at-muted)',
                    marginTop: 6, letterSpacing: '0.01em',
                  }}>{num.l}</div>
                </div>
              ))}
            </div>

            {/* Bottom: star rating */}
            <div style={{
              margin: '24px 0 0',
              padding: '20px 36px',
              background: 'var(--at-bg)',
              borderTop: '1px solid var(--at-line)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--at-accent)">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <span style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--at-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>5.0 · {l.clientRating}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .at-ratings-in { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
};

export default AtRatings;
