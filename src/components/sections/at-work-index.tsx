import type { FC } from 'react';

interface Props { onOpen: () => void; }

const PROJECTS = [
  { year: '2026', name: 'ARFADEL', scope: 'Parfyumeriya · Toshkent', work: 'Logotip · Firma uslubi', result: '8 500+ obunachilar' },
  { year: '2026', name: 'Boyarin', scope: 'Sutchilik · Farg\'ona', work: 'Qadoq dizayni · 2 SKU', result: 'Yangilangan aydentika' },
  { year: '2026', name: 'Beyaz', scope: 'Premium brend', work: 'Logotip · Rang tizimi', result: 'Gold/Green variantlar' },
  { year: '2026', name: 'Estem', scope: 'Savdo markasi', work: 'Logotip · Variantlar', result: 'To\'liq aydentika' },
  { year: '2026', name: 'Geonest Engineering', scope: 'Muhandislik · Toshkent', work: 'Korporativ logotip', result: 'B2B brending' },
  { year: '2026', name: 'Master Mould', scope: 'Ishlab chiqarish', work: 'Korporativ logotip', result: 'Firma uslubi' },
  { year: '2025', name: 'Rutera', scope: 'Savdo kompaniyasi', work: 'Logotip · Brendbuk', result: 'To\'liq brendbuk' },
  { year: '2025', name: 'Doctor Fresh', scope: 'Tijorat tozalash', work: 'Katalog · Brending', result: 'Chakana tarmoq' },
];

const AtWorkIndex: FC<Props> = ({ onOpen }) => (
  <section className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="mb-10">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">§ 07 · Loyihalar</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>Ishlar indeksi</h2>
      </div>
      <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--at-line)]">
              {["Yil","Mijoz","Soha · Joy","Yo'nalish",'Natija',''].map((h,i)=>(<th key={i} className="text-left font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--at-muted)] pb-3 pr-6 last:pr-0 font-normal">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p,i)=>(
              <tr key={i} onClick={onOpen} className="border-b border-[var(--at-line)] last:border-0 cursor-pointer group hover:bg-[var(--at-paper)] transition-colors">
                <td className="py-4 pr-6 font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)]">{p.year}</td>
                <td className="py-4 pr-6 font-semibold text-[var(--at-ink)] text-sm">{p.name}</td>
                <td className="py-4 pr-6 text-xs text-[var(--at-ink-2)]">{p.scope}</td>
                <td className="py-4 pr-6 text-xs text-[var(--at-ink-2)]">{p.work}</td>
                <td className="py-4 pr-6"><span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--at-green)]">{p.result}</span></td>
                <td className="py-4 text-[var(--at-muted)] group-hover:text-[var(--at-ink)] transition-colors text-right">→</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default AtWorkIndex;
