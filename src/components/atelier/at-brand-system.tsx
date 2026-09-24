'use client';

import { FC } from 'react';

export const ATBrandSystem: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <section className="bsys">
      <div className="wrap">
        <div className="bsys-grid">
          <div className="bsys-side">
            <span className="eb">
              <span className="dot" />
              <span style={{ color: 'var(--ink-2)' }}>
                § {dictionary?.brand_system_title?.split('—')?.[0]?.trim() || 'Brend tizimi'}
              </span>
            </span>
            <h2
              dangerouslySetInnerHTML={{
                __html: (
                  dictionary?.brand_system_title ||
                  'Logotip emas —<br/><span class="it">tizim.</span>'
                ).replace(/\n/g, '<br/>'),
              }}
            />
            <p>
              {dictionary?.brand_system_lede ||
                'Rang, shrift, belgi, sayt, qadoq — barchasi bir til, bir ovoz, bir taassurot. Brendbukda har bir foydalanish qoidasi yozilgan.'}
            </p>
            <a
              href="#xizmat"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('xizmat')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 28,
                fontWeight: 600,
                fontSize: 14,
                padding: '12px 18px',
                border: '1px solid var(--line)',
                borderRadius: 999,
                background: 'var(--bg)',
                color: 'var(--ink)',
              }}
            >
              {dictionary?.brand_system_cta || "Xizmatlar ro'yxati"}{' '}
              <span style={{ color: 'var(--accent)' }}>↗</span>
            </a>
          </div>
          <div className="bsys-grid-r">
            {/* Ink primary */}
            <div className="bs-cell bs-c1 bs-color">
              <div>
                <div className="lbl">{dictionary?.brand_system_primary || 'Asosiy'}</div>
                <div
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontStyle: 'italic',
                    fontSize: 36,
                    lineHeight: 1,
                    marginTop: 8,
                  }}
                >
                  {dictionary?.brand_system_siyoh || 'Siyoh'}
                </div>
              </div>
              <div className="hex">#0E1015</div>
            </div>
            {/* Cobalt */}
            <div className="bs-cell bs-c2 bs-color" style={{ background: 'var(--accent)' }}>
              <div className="lbl">{dictionary?.brand_system_accent || 'Aksent'}</div>
              <div className="hex">#1B4DFF</div>
            </div>
            {/* Terra */}
            <div className="bs-cell bs-c3 bs-color">
              <div className="lbl">{dictionary?.brand_system_issiq || 'Issiq'}</div>
              <div className="hex">#C2552A</div>
            </div>
            {/* Green */}
            <div className="bs-cell bs-c4 bs-color">
              <div className="lbl">{dictionary?.brand_system_tirik || 'Tirik'}</div>
              <div className="hex">#2C6E49</div>
            </div>
            {/* Paper */}
            <div className="bs-cell bs-c5">
              <div className="lbl">{dictionary?.brand_system_qogoz || "Qog'oz"}</div>
              <div className="hex">#F2EFE6</div>
            </div>

            {/* Type sample */}
            <div className="bs-cell bs-type bs-type-cell">
              <div className="lbl">{dictionary?.brand_system_typography || 'Tipografika'}</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div className="big sans">Aa</div>
                <div className="big">Aa</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: 'var(--muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    SANS · INTER TIGHT
                  </div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: 'var(--muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    SERIF · INSTRUMENT
                  </div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      color: 'var(--muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    MONO · JETBRAINS
                  </div>
                </div>
              </div>
              <div className="val">↳ display 64—156 · body 15—18</div>
            </div>

            {/* Mark */}
            <div className="bs-cell bs-mark bs-mark-cell">
              <div className="lbl">{dictionary?.brand_system_mark || 'Belgi'}</div>
              <div className="glyph">
                jon<span className="d">.</span>
              </div>
              <div className="val">primary mark</div>
            </div>

            {/* Lockup */}
            <div className="bs-cell bs-lock bs-lock-cell">
              <div className="lbl">{dictionary?.brand_system_lockup || 'Lockup'}</div>
              <div className="lock">
                jon<span className="s">.</span> branding atelier · est. mmxix
              </div>
              <div className="val">extended horizontal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
