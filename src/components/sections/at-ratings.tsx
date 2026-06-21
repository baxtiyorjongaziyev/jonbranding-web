import type { FC } from 'react';

interface Props { lang?: string; }

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
  },
  zh: {
    eyebrow: '§ 排行榜',
    heading: '机构',
    headingItalic: '获得认可。',
    logos: [
      { nm: "中亚品牌协会", pos: "会员 · 2021" },
      { nm: "UZ Branding Top", pos: "前10" },
      { nm: "Runet Rating",    pos: "顶尖" },
      { nm: "Jon Top 100",     pos: "#1品牌" },
    ],
    num1: { n: '514', l: '创建的品牌' },
    num2: { n: '37',  l: '市场行业' },
  },
} as const;

type Lang = keyof typeof t;

const AtRatings: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section style={{
      background: 'var(--at-paper)',
      borderTop: '1px solid var(--at-line)',
      borderBottom: '1px solid var(--at-line)',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 48,
          alignItems: 'center',
          padding: '64px 0',
        }}
          className="at-ratings-in">
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--at-muted)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--at-green)', display: 'inline-block' }} />
              {l.eyebrow}
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 3.4vw, 48px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              fontWeight: 800,
              margin: '14px 0 28px',
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
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              {l.logos.map((logo) => (
                <div key={logo.nm} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: '20px 22px',
                  background: 'var(--at-bg)',
                  border: '1px solid var(--at-line)',
                  borderRadius: 16,
                  minWidth: 150,
                }}>
                  <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--at-ink)' }}>{logo.nm}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{logo.pos}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {[l.num1, l.num2].map((num) => (
              <div key={num.n}>
                <div style={{
                  fontSize: 'clamp(44px, 5vw, 72px)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: 'var(--at-ink)',
                }}>
                  {num.n}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>.</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--at-muted)', marginTop: 6 }}>{num.l}</div>
              </div>
            ))}
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
