'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATServices: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const servicesItems = dictionary?.services || [];

  return (
    <section className="sec wrap" id="xizmat">
      <div className="sec-head">
        <h2
          dangerouslySetInnerHTML={{
            __html: (
              dictionary?.services_title ||
              'Brend — boshidan<br/><span class="it">oxirigacha.</span>'
            ).replace(/\n/g, '<br/>'),
          }}
        />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 02</span>
            <span>{dictionary?.nav?.[1]?.label || 'Xizmatlar'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.services_lede ||
                "Neyming, aydentika, qadoq, tovar belgisi va raqamli ko'rinish — <strong> bir joyda, bir jamoa, bir narxda.</strong> Har biri alohida ham buyurtma qilinadi.",
            }}
          />
        </div>
      </div>
      <div className="svc-table">
        {servicesItems.map((s: any) => (
          <div key={s.num} className="svc-row" onClick={onOpen}>
            <div className="num">{s.num}</div>
            <div className="name">{s.name}</div>
            <div className="desc">{s.desc}</div>
            <div className="time">{s.time}</div>
            <div className="arr">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── FEATURED ──────────────────────────────────── */
interface ATFeaturedProps {
  dictionary: any;
  comparison?: any;
  lang: string;
}
