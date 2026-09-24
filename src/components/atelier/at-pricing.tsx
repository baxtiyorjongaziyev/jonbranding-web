'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATPricing: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const packagesItems = dictionary?.packages || [];

  return (
    <section className="sec wrap" id="narxlar">
      <div className="sec-head">
        <h2>
          {dictionary?.pricing_title?.includes('\n') ? (
            <>
              {dictionary.pricing_title.split('\n')[0]}
              <br />
              <span className="it">{dictionary.pricing_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">
              {dictionary?.pricing_title || "Aniq narx, yashirin xarajat yo'q."}
            </span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 05</span>
            <span>{dictionary?.nav?.[3]?.label || 'Narxlar'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.pricing_lede ||
                "Paketni tanlaysiz, to'lov jadvalini kelishamiz, boshlaymiz. <strong>Hech qanday tushuntirilmagan summa qo'shilmaydi.</strong>",
            }}
          />
        </div>
      </div>
      <div className="guarantee">
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text">
            <span className="l">{dictionary?.pricing_guarantee_1_lbl || 'Kafolat'}</span>{' '}
            {dictionary?.pricing_guarantee_1_val || '100% pul qaytarish'}
          </div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text">
            <span className="l">{dictionary?.pricing_guarantee_2_lbl || 'Muddati'}</span>{' '}
            {dictionary?.pricing_guarantee_2_val || '14 kun · 0 ta kechikish'}
          </div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text">
            <span className="l">{dictionary?.pricing_guarantee_3_lbl || 'Hujjat'}</span>{' '}
            {dictionary?.pricing_guarantee_3_val || '30—50 betlik PDF'}
          </div>
        </div>
        <div className="guarantee-item">
          <div className="guarantee-ck">✓</div>
          <div className="guarantee-text">
            <span className="l">{dictionary?.pricing_guarantee_4_lbl || 'Tajriba'}</span>{' '}
            {dictionary?.pricing_guarantee_4_val || '6 yil · 240+ tashxis'}
          </div>
        </div>
      </div>
      <div className="price-grid">
        {packagesItems.map((p: any) => (
          <div key={p.name} className={`price-card ${p.featured ? 'featured' : ''}`}>
            {p.featured && (
              <div className="price-badge">
                {dictionary?.pricing_featured_badge || '87% mijoz tanlaydi'}
              </div>
            )}
            <div className="price-head">
              <span className="price-tag">{p.tag}</span>
              <h3>{p.name}</h3>
            </div>
            <div className="price-desc">{p.desc}</div>
            <div className="price-num">
              {p.price === 'Kelishiladi' ||
              p.price === 'Договорная' ||
              p.price === 'Negotiable' ||
              p.price === '面议' ? (
                <span
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--ink-2)',
                  }}
                >
                  {p.price}
                </span>
              ) : (
                <>
                  {p.price}
                  <span className="s">.</span>
                </>
              )}
            </div>
            <div className="price-unit">{p.unit}</div>
            <div className="price-rule" />
            <ul>
              {p.incl.map((x: any, i: number) => (
                <li key={i}>
                  <span className="ck">✓</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <button className="price-cta" onClick={onOpen}>
              <span>
                {p.featured
                  ? dictionary?.pricing_cta_featured || 'Hozir boshlash'
                  : dictionary?.pricing_cta_standard || 'Tanlash'}
              </span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 32,
          padding: '24px 32px',
          borderRadius: 16,
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8,
            }}
          >
            {dictionary?.pricing_payment_schedule || "To'lov jadvali"}
          </div>
          <div style={{ fontSize: 15 }}>
            {dictionary?.pricing_payment_schedule_val ||
              '40% boshida · 30% birinchi variant tasdiqlanganda · 30% topshirishda'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Payme', 'Click', 'Bank'].map((p) => (
            <span
              key={p}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                color: 'var(--muted)',
                padding: '6px 12px',
                background: 'var(--bg)',
                borderRadius: 999,
                border: '1px solid var(--line)',
              }}
            >
              {p}
            </span>
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
