'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATHero: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="hero wrap" id="top">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-eyebrows">
            <span className="eb">
              <span className="dot" />
              <span>
                {dictionary?.hero_eyebrow || 'Markaziy Osiyo · Brand atelier · Est. 2019'}
              </span>
            </span>
            <div className="pill">
              <span className="b">2026</span>
              <span>{dictionary?.hero_pill || 'Yangi paketlar endi mavjud'}</span>
            </div>
          </div>
          <h1
            className="hero-title"
            dangerouslySetInnerHTML={{
              __html: (
                dictionary?.hero_title || "Brendingiz<br/>aslida<br/>qancha yo'qotyapti?"
              ).replace(/\n/g, '<br/>'),
            }}
          />
        </div>

        <div className="hero-right">
          <p
            className="hero-lede"
            dangerouslySetInnerHTML={{
              __html: (
                dictionary?.hero_lede ||
                "<strong>Brend tashxisi</strong> — biznesingizning ko'rinmas yo'qotishlarini topish.<br/>14 kun · 12 mezon · 30—50 betlik hisobot · aniq raqamlarda.<br/><br/>Bepul mini-tashxis bilan boshlang — keyin xohlasangiz to'liqqa o'tasiz."
              ).replace(/\n/g, '<br/>'),
            }}
          />
          <div className="hero-cta-row">
            <button className="btn btn-primary btn-xl" onClick={onOpen}>
              {dictionary?.hero_cta || 'Bepul mini-tashxis boshlash'} <span className="ar">↗</span>
            </button>
            <a
              href="#narxlar"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('narxlar')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-link"
            >
              {dictionary?.hero_cta_sub || "yoki paketlarni ko'ring"} →
            </a>
          </div>
          <div className="hero-micro">
            <span>↳</span>
            <span>30 daq</span>
            <span className="sep">·</span>
            <span>Spamsiz</span>
            <span className="sep">·</span>
            <span>Majburiyatsiz</span>
            <span className="sep">·</span>
            <span className="hl">{dictionary?.hero_micro_label || 'Iyul oyida 4 joy qoldi'}</span>
          </div>
          <div className="hero-meta">
            <div>
              <div className="k">{dictionary?.hero_stat_conducted || "O'tkazildi"}</div>
              <div className="v">
                <span className="s">240</span>+ tashxis
              </div>
            </div>
            <div>
              <div className="k">{dictionary?.hero_stat_left || 'Bu oyda'}</div>
              <div className="v">
                <span className="s">4</span> joy qoldi
              </div>
            </div>
            <div>
              <div className="k">{dictionary?.hero_stat_ready || 'Hisobot tayyor'}</div>
              <div className="v">14 kun</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
