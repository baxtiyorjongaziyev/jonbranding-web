'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATSampleReport: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="sample">
      <div className="wrap">
        <div className="sample-grid">
          <div className="sample-left">
            <span className="eb">
              <span className="dot" />
              <span>
                {dictionary?.sample_report_title || 'Hisobot misoli · Qumri Coffee, 2025'}
              </span>
            </span>
            <h2
              style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                fontWeight: 700,
                margin: '18px 0 24px',
              }}
              dangerouslySetInnerHTML={{
                __html: (
                  dictionary?.sample_report_title_h2 ||
                  'Hisobot<br/><span class="serif" style="color: var(--accent)">shunday</span> ko\'rinadi.'
                ).replace(/\n/g, '<br/>'),
              }}
            />
            <p
              style={{
                color: 'var(--ink-2)',
                fontSize: 16,
                lineHeight: 1.65,
                marginBottom: 24,
                maxWidth: 380,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  dictionary?.sample_report_lede ||
                  '30—50 betlik PDF. Har sahifada aniq holat, aniq tavsiya, aniq raqam. <strong style="color: var(--ink)"> "Yaxshilash kerak" emas — "filan narsani filan kuni qiling".</strong>',
              }}
            />
            <ul className="sample-toc">
              {[
                { n: '01', t: dictionary?.sample_toc_1 || "Boshlang'ich tahlil va xulosalar" },
                { n: '02', t: dictionary?.sample_toc_2 || 'Pozitsiya va auditoriya kartasi' },
                { n: '03', t: dictionary?.sample_toc_3 || 'Vizual aydentika baholash' },
                { n: '04', t: dictionary?.sample_toc_4 || 'Raqobat tahlili (5 brend)' },
                { n: '05', t: dictionary?.sample_toc_5 || "Yo'qotishlar va imkoniyatlar" },
                { n: '06', t: dictionary?.sample_toc_6 || '90 kunlik harakat rejasi' },
              ].map((s) => (
                <li key={s.n}>
                  <span className="n">{s.n}</span>
                  <span>{s.t}</span>
                </li>
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
                  <div className="rp-h1">
                    Qumri
                    <br />
                    <em>Coffee.</em>
                  </div>
                  <div className="rp-grade">
                    <div className="rp-grade-n">
                      68<span>/100</span>
                    </div>
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
                    { l: "O'qish", v: 82, c: 'var(--green)' },
                    { l: 'Esda qolish', v: 64, c: 'var(--accent)' },
                    { l: 'Farqlanish', v: 38, c: 'var(--terra)' },
                    { l: 'Masshtablanish', v: 91, c: 'var(--green)' },
                    { l: 'Konseptual', v: 55, c: 'var(--accent)' },
                  ].map((b, i) => (
                    <div key={i} className="rp-bar">
                      <div className="rp-bar-l">{b.l}</div>
                      <div className="rp-bar-track">
                        <div
                          className="rp-bar-fill"
                          style={{ width: b.v + '%', background: b.c }}
                        />
                      </div>
                      <div className="rp-bar-v">{b.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rp-recs">
                  <div className="rp-recs-head">Tavsiyalar</div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-urgent" />
                    <span>Belgi nisbatlari qayta hisoblanishi kerak (—2 hafta)</span>
                  </div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-mid" />
                    <span>Mono versiya yetishmaydi (—1 hafta)</span>
                  </div>
                  <div className="rp-rec">
                    <span className="rp-rec-dot rp-rec-low" />
                    <span>Ikonografik mark — strategik (3 oy)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sample-tag">
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                }}
              >
                ↳ Bu sahifa 12-bet. Hisobotda yana 38 sahifa shunaqa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
