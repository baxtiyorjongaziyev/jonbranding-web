'use client';

import { FC, useState } from 'react';

export const ATFAQ: FC<{ dictionary: any }> = ({ dictionary }) => {
  const [open, setOpen] = useState(0);
  const faqItems = dictionary?.faq || [];

  return (
    <section className="sec wrap" id="savol">
      <div className="faq-grid">
        <div>
          <span className="eb" style={{ marginBottom: 18, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 07</span>
            <span>{dictionary?.faq_section_badge || 'Savol-javob'}</span>
          </span>
          <h2
            style={{
              fontSize: 'clamp(36px, 4.4vw, 64px)',
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            {dictionary?.faq_title?.includes('\n') ? (
              <>
                {dictionary.faq_title.split('\n')[0]}
                <br />
                <span className="serif" style={{ color: 'var(--accent)' }}>
                  {dictionary.faq_title.split('\n')[1]}
                </span>
              </>
            ) : (
              <span className="serif" style={{ color: 'var(--accent)' }}>
                {dictionary?.faq_title || "Tez-tez so'raladi."}
              </span>
            )}
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            {dictionary?.faq_lede ||
              'Javob topa olmadingizmi? Yozing — jamoamiz 24 soat ichida javob beradi.'}
          </p>
          <a
            href="mailto:salom@jon.uz"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 24,
              fontWeight: 600,
              fontSize: 14,
              padding: '12px 18px',
              border: '1px solid var(--line)',
              borderRadius: 999,
              background: 'var(--paper)',
            }}
          >
            salom@jon.uz <span style={{ color: 'var(--accent)' }}>↗</span>
          </a>
        </div>
        <div className="faq-list">
          {faqItems.map((f: any, i: number) => (
            <div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
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
