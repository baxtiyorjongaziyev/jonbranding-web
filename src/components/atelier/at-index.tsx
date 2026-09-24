'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATIndex: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const indexItems = dictionary?.index || [];

  return (
    <section className="sec wrap">
      <div className="sec-head">
        <h2>
          {dictionary?.index_title?.includes('\n') ? (
            <>
              {dictionary.index_title.split('\n')[0]}
              <br />
              <span className="it">{dictionary.index_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">{dictionary?.index_title || 'Tanlangan ishlar indeksi.'}</span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 03</span>
            <span>{dictionary?.index_archive_eyebrow || 'Arxiv'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html: (
                dictionary?.index_lede ||
                '2022–2025 davrida tanlangan {count} ta loyiha. Har biri real biznes, real raqam, real natija.'
              ).replace('{count}', String(indexItems.length)),
            }}
          />
        </div>
      </div>
      <div className="idx">
        <div className="idx-row head">
          <span>{dictionary?.index_th_year || 'Yil'}</span>
          <span>{dictionary?.index_th_client || 'Mijoz'}</span>
          <span>{dictionary?.index_th_sector || 'Soha · Joy'}</span>
          <span>{dictionary?.index_th_discipline || "Yo'nalish"}</span>
          <span>{dictionary?.index_th_result || 'Natija'}</span>
          <span></span>
        </div>
        {indexItems.map((c: any, i: number) => (
          <div key={i} className="idx-row" onClick={onOpen}>
            <span className="yr">{c.yr}</span>
            <span className="client">{c.client}</span>
            <span className="sector">{c.sector}</span>
            <span className="discipline">{c.discipline}</span>
            <span className="result">{c.result}</span>
            <div className="arr">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
};
