import type { FC } from 'react';

interface Props { onOpen: () => void; }

const PROJECTS = [
  { year: '2025', name: 'Qumri Coffee', scope: 'Kofexona · Samarqand', work: 'Neyming · Aydentika · Qadoq', result: '+41% sotuv' },
  { year: '2025', name: 'Teshabay osh', scope: 'Restoran · Toshkent', work: 'Rebrending · Menyu', result: '3× takror' },
  { year: '2024', name: 'Oltin Bulut', scope: 'Sutchilik · Buxoro', work: 'Qadoq · 12 SKU', result: '+31% sotuv' },
  { year: '2024', name: 'Humo', scope: 'Fintech · Toshkent', work: 'Brend · Ilova · Sayt', result: '180K foydalanuvchi' },
  { year: '2023', name: 'Nur Sopol', scope: 'Sopol idishlar · Rishton', work: 'Aydentika · Qadoq', result: "2× ko'rinish" },
  { year: '2023', name: 'Chilla', scope: 'Yozgi kiyim · Toshkent', work: 'Neyming · Aydentika', result: 'Yangi bozor' },
  { year: '2022', name: 'Asaka Co.', scope: 'Avtomobil servisi', work: 'Rebrending · Sayt', result: '+22% mijoz' },
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
