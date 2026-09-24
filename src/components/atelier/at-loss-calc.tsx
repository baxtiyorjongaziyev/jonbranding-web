'use client';

import { FC, useState } from 'react';
import type { ATLossCalcProps } from './types';

export const ATLossCalc: FC<ATLossCalcProps> = ({ dictionary, onOpen, lang = 'uz' }) => {
  const [clients, setClients] = useState(300);
  const [check, setCheck] = useState(80);
  const [industry, setIndustry] = useState(15); // brand impact %

  const loss = Math.round(clients * check * 1000 * (industry / 100));
  const fmtSom = (n: number) => {
    if (lang === 'en') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (n >= 1_000) return Math.round(n / 1_000) + 'K';
      return n.toString();
    }
    if (lang === 'ru') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' млн';
      if (n >= 1_000) return Math.round(n / 1_000) + ' тыс';
      return n.toString();
    }
    if (lang === 'zh') {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + '百万';
      if (n >= 1_000) return Math.round(n / 1_000) + '千';
      return n.toString();
    }
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' mln';
    if (n >= 1_000) return Math.round(n / 1_000) + ' ming';
    return n.toString();
  };

  return (
    <section className="calc">
      <div className="calc-bg" />
      <div className="wrap">
        <div className="calc-grid">
          <div className="calc-left">
            <span className="calc-eb">
              <span className="dot" />
              <span>
                {dictionary?.loss_calc_eyebrow || "Yo'qotish kalkulyatori · oraliq hisob"}
              </span>
            </span>
            {dictionary?.loss_calc_title?.includes('\n') ? (
              <h2>
                {dictionary.loss_calc_title.split('\n')[0]}
                <br />
                <span className="it">{dictionary.loss_calc_title.split('\n')[1]}</span>
              </h2>
            ) : (
              <h2>{dictionary?.loss_calc_title || "Brendingiz qancha yo'qotyapti?"}</h2>
            )}
            <p>
              {dictionary?.loss_calc_lede ||
                "3 ta savolga javob bering — hozirgi brend tufayli oyiga qancha daromad yo'qolayotganini taxminlaymiz. Bu — biz auditda aniq raqam bilan ko'rsatadigan narsamiz."}
            </p>
          </div>
          <div className="calc-form">
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q1 || 'Oyiga necha mijoz keladi?'}</span>
                <span className="v">{clients}</span>
              </label>
              <input
                className="calc-slider"
                type="range"
                min={50}
                max={3000}
                step={50}
                value={clients}
                onChange={(e) => setClients(+e.target.value)}
              />
            </div>
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q2 || "O'rtacha chek (ming so'm)"}</span>
                <span className="v">{check}</span>
              </label>
              <input
                className="calc-slider"
                type="range"
                min={20}
                max={500}
                step={5}
                value={check}
                onChange={(e) => setCheck(+e.target.value)}
              />
            </div>
            <div className="calc-field">
              <label>
                <span>{dictionary?.loss_calc_q3 || "Brend ta'siri darajasi"}</span>
                <span className="v">{industry}%</span>
              </label>
              <input
                className="calc-slider"
                type="range"
                min={5}
                max={35}
                step={1}
                value={industry}
                onChange={(e) => setIndustry(+e.target.value)}
              />
            </div>
            <div className="calc-out">
              <div className="k">{dictionary?.loss_calc_result || "Taxminiy oylik yo'qotish"}</div>
              <div className="n">
                ~{fmtSom(loss)}
                <span className="s"> {dictionary?.loss_calc_result_val || "so'm"}</span>
              </div>
              <div className="pl">
                ↳ {dictionary?.loss_calc_result_note || 'yiliga'} ~{fmtSom(loss * 12)}{' '}
                {dictionary?.loss_calc_result_note_2 || "so'm · auditda aniq raqamda hisoblaymiz"}
              </div>
              <button className="calc-cta" onClick={onOpen}>
                {dictionary?.loss_calc_cta || 'Mening biznesim uchun aniqlash'} <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
