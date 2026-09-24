'use client';

import { FC } from 'react';

export const ATManifesto: FC<{ dictionary: any }> = ({ dictionary }) => {
  return (
    <section className="manifesto wrap">
      <div className="manifesto-grid">
        <div className="manifesto-meta">
          <div className="k">— {dictionary?.manifesto_label || 'Manifest'}</div>
          <div className="v">
            {dictionary?.manifesto_desc ||
              "Tashxis — bu professional ko'rik. Aniq raqamlar, aniq xulosalar, aniq harakat. Taxmin va his bilan biznesni yo'qotmaymiz."}
          </div>
        </div>
        <div
          className="manifesto-text"
          dangerouslySetInnerHTML={{
            __html: (
              dictionary?.manifesto_text ||
              "Tashxissiz <s>tuzatish</s> —<br/>bu <em>qorong'ida</em> o'q otish.<br/>Avval ko'rinmagan teshikni topamiz, keyin yopamiz. Tartib shu —<br/>aks holda <strong>siz pul to'laysiz, raqib daromad oladi.</strong>"
            ).replace(/\n/g, '<br/>'),
          }}
        />
      </div>
    </section>
  );
};
