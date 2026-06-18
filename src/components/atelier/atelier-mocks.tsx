'use client';

import type { FC } from 'react';

interface MockProps {
  large?: boolean;
}

export const ATMockCoffee: FC<MockProps> = ({ large = false }) => {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #F2DDC2 0%, #E5C6A0 50%, #D9B486 100%)',
      display: 'grid', placeItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Coffee bag */}
      <div style={{
        width: large ? '52%' : '60%',
        aspectRatio: '3/4.4',
        background: 'linear-gradient(180deg, #6B4423 0%, #4A2C18 100%)',
        borderRadius: '8px 8px 28px 28px',
        padding: '14% 12%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        transform: 'rotate(-4deg)',
        boxShadow: '0 40px 80px -20px rgba(74,44,24,.5), inset 0 1px 0 rgba(255,255,255,.08)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#F3E7D3', opacity: .7, letterSpacing: '.15em', lineHeight: 1.2 }}>№001<br/>250g</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#F3E7D3', opacity: .55, letterSpacing: '.15em', textAlign: 'right', lineHeight: 1.2 }}>SMQ<br/>2025</div>
        </div>
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontStyle: 'italic',
          fontSize: large ? 'clamp(48px, 6vw, 88px)' : 'clamp(32px, 4vw, 60px)',
          color: '#F3E7D3',
          lineHeight: 0.85,
          textAlign: 'center',
        }}>Qumri</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8,
          color: '#F3E7D3',
          opacity: .6,
          letterSpacing: '.3em',
          textAlign: 'center',
        }}>—  ARABICA  ·  100%  —</div>
      </div>
      {/* Bean shadow */}
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '8%',
        width: 60, height: 80,
        background: 'radial-gradient(ellipse at center, rgba(74,44,24,.3), transparent 60%)',
        filter: 'blur(20px)',
      }}/>
    </div>
  );
};

export const ATMockOsh: FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#E8A14F' }}>
      <div style={{ background: '#E8A14F', display: 'grid', placeItems: 'center', padding: '8%' }}>
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(28px, 3.6vw, 56px)',
          color: '#1A1410',
          textAlign: 'center',
          lineHeight: 0.9,
          fontWeight: 400,
          letterSpacing: '-0.02em',
        }}>Teshabay</div>
      </div>
      <div style={{
        background: '#1A1410', color: '#E8A14F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8%',
        position: 'relative',
      }}>
        <div style={{
          fontFamily: 'Instrument Serif, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(48px, 6vw, 96px)',
          lineHeight: 1,
        }}>osh.</div>
        <div style={{
          position: 'absolute', bottom: '8%', right: '8%',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          color: '#E8A14F',
          opacity: .5,
          letterSpacing: '.15em',
        }}>EST 2014</div>
      </div>
    </div>
  );
};

export const ATMockDairy: FC = () => {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #F4F9F2 0%, #E9F3EC 100%)',
      display: 'flex', gap: '5%', alignItems: 'end', justifyContent: 'center',
      padding: '12% 12% 8%',
    }}>
      {[.75, .95, .68].map((h, i) => (
        <div key={i} style={{
          width: '22%', height: (h * 100) + '%',
          background: 'linear-gradient(180deg, #138746 0%, #0E6D38 100%)',
          borderRadius: '50% 50% 8px 8px / 18% 18% 4% 4%',
          padding: '22% 10% 8%',
          boxShadow: '0 20px 40px -10px rgba(14,109,56,.4)',
          position: 'relative',
        }}>
          <div style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(9px, 1.2vw, 14px)',
            color: '#E9F3EC',
            lineHeight: 0.95,
            textAlign: 'center',
          }}>Oltin<br/>Bulut</div>
        </div>
      ))}
    </div>
  );
};

export const ATMockFintech: FC = () => {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0A0A0C',
      display: 'grid', placeItems: 'center',
      padding: '10%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(79,123,255,.3) 0%, transparent 50%)',
      }}/>
      <div style={{
        width: '88%', aspectRatio: '1.586/1',
        background: 'linear-gradient(135deg, #5B7CFF 0%, #2D4ECC 50%, #1B2D8E 100%)',
        borderRadius: 16,
        padding: '6%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: '#fff',
        transform: 'rotate(-4deg)',
        boxShadow: '0 40px 80px -20px rgba(91,124,255,.5), inset 0 1px 0 rgba(255,255,255,.15)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(20px, 2.8vw, 34px)', lineHeight: 1 }}>humo</div>
          <div style={{ width: 32, height: 22, background: 'linear-gradient(135deg, #F4D572 0%, #B8923A 100%)', borderRadius: 3 }}/>
        </div>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(11px, 1.3vw, 16px)',
            letterSpacing: '.18em',
            opacity: .92,
            marginBottom: 8,
          }}>4242 1209 8814 2025</div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            opacity: .55,
            letterSpacing: '.1em',
          }}>
            <span>SARDOR R</span>
            <span>12/27</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ATMockCeramic: FC = () => {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #E8E2D0 0%, #D8CFB8 100%)',
      display: 'grid', placeItems: 'center',
      padding: '10%',
      position: 'relative',
    }}>
      <div style={{
        width: '70%', aspectRatio: '1/1',
        background: 'radial-gradient(ellipse at 30% 30%, #4A6FA5 0%, #2C4E7E 70%, #1A3258 100%)',
        borderRadius: '50%',
        boxShadow: '0 30px 60px -20px rgba(26,50,88,.4), inset -20px -20px 40px rgba(0,0,0,.2), inset 10px 10px 20px rgba(255,255,255,.1)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '15%', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Instrument Serif, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(16px, 2vw, 28px)',
          color: '#F4F1E8',
          opacity: .9,
        }}>Nur</div>
      </div>
    </div>
  );
};

export const ATMockChilla: FC = () => {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #F4F1E8 0%, #E5DCC5 100%)',
      display: 'flex', flexDirection: 'column',
      padding: '14%',
      justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '.15em',
        color: '#8B7A5C',
      }}>SS · 2024</div>
      <div style={{
        fontFamily: 'Instrument Serif, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(40px, 5vw, 88px)',
        color: '#1A1410',
        lineHeight: 0.9,
      }}>Chilla<span style={{ color: '#C2552A' }}>.</span></div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '.15em',
        color: '#8B7A5C',
        textAlign: 'right',
      }}>YOZGI KIYIM · TOSHKENT</div>
    </div>
  );
};

interface ATMockDispatcherProps {
  kind: string;
  large?: boolean;
}

export const ATMock: FC<ATMockDispatcherProps> = ({ kind, large = false }) => {
  if (kind === 'coffee') return <ATMockCoffee large={large} />;
  if (kind === 'osh') return <ATMockOsh />;
  if (kind === 'dairy') return <ATMockDairy />;
  if (kind === 'fintech') return <ATMockFintech />;
  if (kind === 'ceramic') return <ATMockCeramic />;
  if (kind === 'chilla') return <ATMockChilla />;
  return <div style={{ width: '100%', height: '100%', background: '#E5E2D8' }} />;
};
