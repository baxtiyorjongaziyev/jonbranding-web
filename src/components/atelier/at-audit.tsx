'use client';

import { FC } from 'react';
import type { SectionProps } from './types';

export const ATAudit: FC<SectionProps> = ({ dictionary, onOpen }) => {
  const auditPoints = dictionary?.auditPoints || [];
  const auditDeliverables = dictionary?.auditDeliverables || [];

  // Group points
  const groups: Record<string, any[]> = {};
  auditPoints.forEach((p: any) => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });
  const order = ['POZITSIYA', 'VIZUAL', 'RAQAMLI', 'HUQUQ'];
  const labels: Record<string, string> = {
    POZITSIYA: dictionary?.brand_system_primary?.includes('Mijoz')
      ? 'Pozitsiya & Strategiya'
      : dictionary?.audit_group_1 || 'Pozitsiya & Strategiya',
    VIZUAL: dictionary?.audit_group_2 || 'Vizual aydentika',
    RAQAMLI: dictionary?.audit_group_3 || "Raqamli ko'rinish",
    HUQUQ: dictionary?.audit_group_4 || 'Huquqiy himoya',
  };

  return (
    <section className="sec wrap" id="tashxis">
      <div className="sec-head">
        <h2
          dangerouslySetInnerHTML={{
            __html: (
              dictionary?.audit_title ||
              'Tashxisda<br/><span class="it">nimalarni</span> tekshiramiz.'
            ).replace(/\n/g, '<br/>'),
          }}
        />
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 02</span>
            <span>{dictionary?.audit_section_badge || 'Tashxis'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.audit_lede ||
                "12 mezon · 4 yo'nalish · 14 kun. Har bir nuqta 0—100 baholanadi, <strong>yo'qotilayotgan daromad esa aniq raqamda</strong> hisoblanadi. Hech bir tomon e'tibordan chetda qolmaydi.",
            }}
          />
        </div>
      </div>

      {/* 12-point grouped checklist */}
      <div className="audit-grid">
        {order.map((g, gi) => (
          <div key={g} className="audit-group">
            <div className="audit-group-head">
              <span className="audit-ix">0{gi + 1}</span>
              <div>
                <div className="audit-glabel">{g}</div>
                <div className="audit-gname">{labels[g]}</div>
              </div>
              <div className="audit-count">
                {(groups[g] || []).length} {dictionary?.audit_count_suffix || 'mezon'}
              </div>
            </div>
            <ul className="audit-list">
              {(groups[g] || []).map((p: any) => (
                <li key={p.ix}>
                  <span className="audit-num">{p.ix}</span>
                  <span>{p.t}</span>
                  <span className="audit-check">✓</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Deliverables — what you get */}
      <div className="audit-deliv-wrap">
        <div className="audit-deliv-head">
          <div>
            <span className="eb">
              <span className="dot" />
              <span>{dictionary?.audit_deliv_title || 'Tashxis yakuni · Sizga nima beriladi'}</span>
            </span>
            <h3
              style={{
                fontSize: 'clamp(32px, 4vw, 56px)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                fontWeight: 700,
                marginTop: 14,
              }}
            >
              {dictionary?.audit_deliv_h3 || '6 ta aniq'}{' '}
              <span className="serif" style={{ color: 'var(--accent)' }}>
                {dictionary?.audit_deliv_h3_span || 'natija.'}
              </span>
            </h3>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onOpen}>
            {dictionary?.audit_cta || 'Tashxisni boshlash'} <span className="ar">↗</span>
          </button>
        </div>
        <div className="audit-deliv-grid">
          {auditDeliverables.map((d: any) => (
            <div key={d.n} className="audit-deliv-card">
              <div className="audit-deliv-n">{d.n}</div>
              <div>
                <div className="audit-deliv-t">{d.t}</div>
                <div className="audit-deliv-note">{d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
