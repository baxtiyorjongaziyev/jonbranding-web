'use client';

import { FC } from 'react';

export const ATFooter: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <footer className="foot">
      <div className="foot-cta">
        <div className="wrap">
          <div className="foot-cta-inner">
            <div
              className="foot-cta-text"
              dangerouslySetInnerHTML={{
                __html: (
                  dictionary?.footer_ask ||
                  'Sahifa oxirigacha tushdingiz —<br/><span class="it">savol bormi?</span>'
                ).replace(/\n/g, '<br/>'),
              }}
            />
            <div className="foot-cta-btns">
              <a
                className="foot-cta-btn tg"
                href="https://t.me/jonbranding_bot"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dictionary?.footer_write_tg || "Telegram'da yozish →"}
              </a>
              <a className="foot-cta-btn" href="tel:+998792000097">
                {dictionary?.footer_call_phone || "Qo'ng'iroq qilish"}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-col">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 2,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: '-0.035em',
                marginBottom: 18,
                color: 'var(--bg)',
              }}
            >
              <span>jon</span>
              <span
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'Instrument Serif, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 36,
                  lineHeight: 0.7,
                }}
              >
                .
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(244,241,232,.6)',
                maxWidth: 320,
                lineHeight: 1.65,
              }}
            >
              {dictionary?.footer_about ||
                'Markaziy Osiyo brending atelyesi. 2019-yildan beri biznesni mijoz xayolida qoldiramiz.'}
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 8 }}>
              {['IG', 'TG', 'Be', 'Yt'].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    border: '1px solid rgba(244,241,232,.15)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    transition: 'border-color .2s, background .2s',
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_pages_title || 'Sahifalar'}</h4>
            <ul>
              <li>
                <a href="#tashxis">{dictionary?.nav?.[0]?.label || 'Tashxis'}</a>
              </li>
              <li>
                <a href="#belgilar">{dictionary?.nav?.[1]?.label || 'Belgilar'}</a>
              </li>
              <li>
                <a href="#ishlar">{dictionary?.nav?.[2]?.label || 'Ishlar'}</a>
              </li>
              <li>
                <a href="#narxlar">{dictionary?.nav?.[3]?.label || 'Narxlar'}</a>
              </li>
              <li>
                <a href="#jarayon">{dictionary?.nav?.[4]?.label || 'Jarayon'}</a>
              </li>
              <li>
                <a href="#savol">{dictionary?.nav?.[5]?.label || 'Savollar'}</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_contact_title || 'Aloqa'}</h4>
            <ul>
              <li>
                <a href="tel:+998792000097">+998 79 200 00 97</a>
              </li>
              <li>
                <a href="mailto:salom@jon.uz">salom@jon.uz</a>
              </li>
              <li>
                <span style={{ color: 'rgba(244,241,232,.55)' }}>Toshkent, O'zbekiston</span>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>{dictionary?.footer_office_title || 'Ofis'}</h4>
            <ul>
              <li>
                <span style={{ color: 'rgba(244,241,232,.55)' }}>
                  {dictionary?.footer_office_days || 'Du–Ju · 10:00–19:00'}
                </span>
              </li>
              <li>
                <span style={{ color: 'rgba(244,241,232,.55)' }}>
                  {dictionary?.footer_office_weekend || 'Sha–Ya · dam olish'}
                </span>
              </li>
              <li>
                <span
                  style={{
                    color: 'var(--accent)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                  }}
                >
                  {dictionary?.footer_office_status || 'Yangi loyihalar uchun ochiq'}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-strip">
          <span>
            {dictionary?.footer_copyright || '© MMXIX—MMXXVI · Jon Branding Atelier · Toshkent'}
          </span>
          <span>{dictionary?.footer_made_in || 'Made in Tashkent with care'}</span>
        </div>
      </div>
    </footer>
  );
};
