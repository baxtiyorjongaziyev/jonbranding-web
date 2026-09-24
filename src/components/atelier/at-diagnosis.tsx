'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATDiagnosis: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const badItems = dictionary?.bad || [];
  const goodItems = dictionary?.good || [];

  return (
    <section className="sec wrap" id="belgilar">
      <div className="sec-head">
        <h2
          dangerouslySetInnerHTML={{
            __html: (
              dictionary?.diagnosis_title ||
              'Hozir biznesingizda<br/><span class="it">aslida</span> nima bo\'lyapti?'
            ).replace(/\n/g, '<br/>'),
          }}
        />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" style={{ background: 'var(--terra)' }} />
            <span className="ix">§ 01</span>
            <span>{dictionary?.nav?.[0]?.label || 'Belgilar'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.diagnosis_lede ||
                "Brendingiz <strong>ko'rinmas yo'qotishlar</strong> keltiryapti. Mijoz bu yo'qotishlarni sezmaydi — siz ham. Lekin raqib mijozni siz emas, o'ziga olib ketadi.",
            }}
          />
        </div>
      </div>

      <div className="diag">
        <div className="diag-col bad">
          <div className="diag-head">
            <span className="tag">
              <span className="x">●</span> {dictionary?.bad_tag || "Jon'siz · oldindan"}
            </span>
            <h3>{dictionary?.diagnosis_bad_title || "Yashirin yo'qotish"}</h3>
          </div>
          <ul className="diag-list">
            {badItems.map((b: any) => (
              <li key={b.ix}>
                <span className="ix">{b.ix}</span>
                <span>{b.t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="diag-col good">
          <div className="diag-head">
            <span className="tag">
              <span className="v">●</span> {dictionary?.good_tag || 'Jon bilan · keyin'}
            </span>
            <h3>{dictionary?.diagnosis_good_title || 'Aniq natija'}</h3>
          </div>
          <ul className="diag-list">
            {goodItems.map((g: any) => (
              <li key={g.ix}>
                <span className="ix">{g.ix}</span>
                <span>{g.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.4vw, 32px)',
            color: 'var(--ink)',
            lineHeight: 1.3,
            maxWidth: 540,
            textWrap: 'balance',
          }}
        >
          {dictionary?.diagnosis_ogriq ||
            "Sizning biznesingizda qaysi nuqta og'riyapti? 30 daqiqada aniqlaymiz."}
        </p>
        <button className="btn btn-primary btn-lg" onClick={onOpen}>
          {dictionary?.diagnosis_cta || 'Belgilarni topish · Bepul'} <span className="ar">↗</span>
        </button>
      </div>
    </section>
  );
};
