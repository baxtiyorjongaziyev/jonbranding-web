'use client';

import { FC } from 'react';
import type { ATTweaksProps } from './types';

export const ATTweaks: FC<ATTweaksProps> = ({
  visible,
  onClose,
  theme,
  setTheme,
  grain,
  setGrain,
  accent,
  setAccent,
}) => {
  if (!visible) return null;

  return (
    <div className="tw">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontWeight: 600,
          }}
        >
          Tweaks
        </span>
        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
          }}
        >
          ✕
        </button>
      </div>
      <div className="tw-r">
        <span>Rejim</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['light', "yorug'"],
            ['dark', "qorong'i"],
          ].map(([t, l]) => (
            <button
              key={t}
              className={`tw-pill ${theme === t ? 'on' : ''}`}
              onClick={() => setTheme(t)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="tw-r">
        <span>Aksent</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['cobalt', 'kobalt'],
            ['terra', 'terra'],
            ['ink', 'siyoh'],
          ].map(([t, l]) => (
            <button
              key={t}
              className={`tw-pill ${accent === t ? 'on' : ''}`}
              onClick={() => setAccent(t)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="tw-r">
        <span>Don (grain)</span>
        <button className={`tw-pill ${grain ? 'on' : ''}`} onClick={() => setGrain(!grain)}>
          {grain ? 'yoqilgan' : "o'chirilgan"}
        </button>
      </div>
    </div>
  );
};
