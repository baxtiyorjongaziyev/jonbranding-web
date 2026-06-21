import type { FC } from 'react';

interface Props { lang?: string; }

const t = {
  uz: {
    items: [
      { x: 'x5',  l: "brending\nmukofotlari" },
      { x: 'x34', l: "xalqaro\ntan olinish" },
      { x: 'x11', l: "reyting\ng'oliblari" },
      { x: 'x7',  l: "soha\nnominatsiyalari" },
    ],
    text: 'Agentlik hisobida — 5000+ muvaffaqiyatli keys, ko\'plab xalqaro mukofotlar va kreativlik reytingida birinchi o\'rin.',
    bold: '5000+ muvaffaqiyatli keys',
  },
  ru: {
    items: [
      { x: 'x5',  l: "брендинг-\nпремии" },
      { x: 'x34', l: "международное\nпризнание" },
      { x: 'x11', l: "победители\nрейтингов" },
      { x: 'x7',  l: "отраслевые\nноминации" },
    ],
    text: 'В активе агентства — 5000+ успешных кейсов, многочисленные международные премии и первое место в рейтинге креативности.',
    bold: '5000+ успешных кейсов',
  },
  en: {
    items: [
      { x: 'x5',  l: "branding\nawards" },
      { x: 'x34', l: "international\nrecognition" },
      { x: 'x11', l: "rating\nwinners" },
      { x: 'x7',  l: "industry\nnominations" },
    ],
    text: "The agency's track record — 5000+ successful cases, numerous international awards and first place in the creativity rating.",
    bold: '5000+ successful cases',
  },
  zh: {
    items: [
      { x: 'x5',  l: "品牌\n大奖" },
      { x: 'x34', l: "国际\n认可" },
      { x: 'x11', l: "排行榜\n冠军" },
      { x: 'x7',  l: "行业\n提名" },
    ],
    text: '机构成绩——5000+成功案例，众多国际奖项，创意排名第一。',
    bold: '5000+成功案例',
  },
} as const;

type Lang = keyof typeof t;

const AtAwards: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section style={{ background: '#15171E', color: '#F2EFE6', padding: '56px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, auto) 1fr',
          gap: 32,
          alignItems: 'center',
        }}
          className="at-awards-grid">
          {l.items.map((item) => (
            <div key={item.x} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: '#5B7CFF',
              }}>{item.x}</div>
              <div style={{ fontSize: 12, color: 'rgba(242,239,230,0.7)', lineHeight: 1.35, whiteSpace: 'pre-line' }}>{item.l}</div>
            </div>
          ))}
          <p style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: 'rgba(242,239,230,0.7)',
            maxWidth: 380,
            justifySelf: 'end',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            paddingLeft: 28,
          }}
            className="at-awards-text">
            {l.text.split(l.bold).map((part, i, arr) => (
              i < arr.length - 1
                ? <span key={i}>{part}<strong style={{ color: '#F2EFE6', fontWeight: 600 }}>{l.bold}</strong></span>
                : <span key={i}>{part}</span>
            ))}
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .at-awards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .at-awards-text { grid-column: 1 / -1; justify-self: start !important; border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
        }
      `}</style>
    </section>
  );
};

export default AtAwards;
