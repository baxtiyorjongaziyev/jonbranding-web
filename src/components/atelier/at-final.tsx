'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATFinal: FC<SectionProps> = ({ dictionary, onOpen }) => {
  return (
    <section className="final">
      <div className="final-bg" />
      <div className="wrap">
        <div className="final-eb">
          <span>{dictionary?.final_cta_badge || 'Boshlashga tayyormisiz?'}</span>
        </div>
        <h2
          dangerouslySetInnerHTML={{
            __html: (dictionary?.final_cta_title || 'Tashxis qiling —<br/>keyin tuzating.').replace(
              /\n/g,
              '<br/>'
            ),
          }}
        />
        <p
          dangerouslySetInnerHTML={{
            __html:
              dictionary?.final_cta_lede ||
              '14 kun ichida hisobot tayyor. 50% boshida, 50% prezentatsiyada. Foydali tavsiya topilmasa — <strong>100% pulni qaytaramiz.</strong>',
          }}
        />
        <div className="final-row">
          <button className="btn btn-primary btn-lg" onClick={onOpen}>
            {dictionary?.final_cta_cta || 'Bepul mini-tashxis olish'} <span className="ar">↗</span>
          </button>
          <a href="mailto:salom@jon.uz" className="btn btn-ghost btn-lg">
            salom@jon.uz
          </a>
        </div>
        <div className="final-meta">
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_left || 'Bu oyda'}</div>
            <div className="v">
              <span className="s">4</span>
              {dictionary?.final_cta_stat_left_val || '/6 joy qoldi'}
            </div>
          </div>
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_time || 'Tashxis muddati'}</div>
            <div className="v">{dictionary?.final_cta_stat_time_val || '14 kun ichida'}</div>
          </div>
          <div className="item">
            <div className="k">{dictionary?.final_cta_stat_dur || 'Mini-tashxis davomiyligi'}</div>
            <div className="v">{dictionary?.final_cta_stat_dur_val || '30 daqiqa'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
