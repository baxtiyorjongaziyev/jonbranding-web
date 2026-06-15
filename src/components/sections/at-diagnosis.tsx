'use client';
import type { FC } from 'react';

interface Props { onOpen: () => void; }

const AT_BAD = [
  { ix: '01', t: "Mijozlar sizni ko'rib qaramaydi — chunki ko'rinishingiz oddiy." },
  { ix: '02', t: "Raqibingiz yomonroq, lekin ko'proq sotadi — chunki professional ko'rinadi." },
  { ix: '03', t: "Mijoz bir marta keladi va qaytmaydi — chunki esda qolmaysiz." },
  { ix: '04', t: "Nomingizni o'g'irlashlari mumkin — chunki davlatda ro'yxatdan o'tmagansiz." },
];

const AT_GOOD = [
  { ix: '01', t: "Mijoz 2 soniyada sizni tanib qoladi va eslab qoladi." },
  { ix: '02', t: "Do'kon javonida birinchi bo'lib ko'zga tashlanasiz." },
  { ix: '03', t: "Brendingiz davlat himoyasiga olinadi — qonuniy va abadiy." },
  { ix: '04', t: "Nom, logo, qadoq, sayt — bir uslubda, bir paketda, bir jamoa." },
];

const AtDiagnosis: FC<Props> = ({ onOpen }) => (
  <section id="belgilar" className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="mb-12 md:mb-16">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">§ 01 · Belgilar</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>Brendingiz siz uchun<br />ishlaydimi?</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6"><span className="text-[var(--at-red)] text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">● Hozirgi holat</span></div>
          <div className="space-y-0">{AT_BAD.map((item) => (<div key={item.ix} className="flex gap-4 py-4 border-b border-[var(--at-line)] last:border-0"><span className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mt-0.5 flex-shrink-0">{item.ix}</span><p className="text-[var(--at-ink-2)] leading-relaxed">{item.t}</p></div>))}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-6"><span className="text-[var(--at-green)] text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">● Keyin bo'ladi</span></div>
          <div className="space-y-0">{AT_GOOD.map((item) => (<div key={item.ix} className="flex gap-4 py-4 border-b border-[var(--at-line)] last:border-0"><span className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mt-0.5 flex-shrink-0">{item.ix}</span><p className="text-[var(--at-ink-2)] leading-relaxed">{item.t}</p></div>))}</div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-[var(--at-line)]"><button onClick={onOpen} className="bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">Belgilarni topish · Bepul ↗</button></div>
    </div>
  </section>
);

export default AtDiagnosis;
