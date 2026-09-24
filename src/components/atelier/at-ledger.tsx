'use client';

import { FC } from 'react';

export const ATLedger: FC<{ dictionary: any }> = ({ dictionary }) => {
  const ledgerItems = dictionary?.ledger || [];

  return (
    <section className="ledger">
      <div className="wrap">
        <div className="ledger-inner">
          <div className="ledger-label">
            <span>{dictionary?.brand_system_primary || 'Tanlangan mijozlar'}</span>
            <span className="n">120+ brend</span>
          </div>
          <div className="ledger-logos">
            {ledgerItems.map((l: any) => (
              <span key={l.name} className="ledger-logo">
                {l.name}
                <span className="yr">'{l.yr}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
