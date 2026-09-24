'use client';

import { FC } from 'react';

export const ATMarquee: FC<{ dictionary: any }> = ({ dictionary }) => {
  const list = dictionary?.marquee || [];
  const items = [...list, ...list];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((it: any, i: number) => (
          <div key={i} className="marquee-item">
            <span>{it.name}</span>
            <span className="res">— {it.res}</span>
            <span className="star">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
