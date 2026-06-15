import type { FC } from 'react';

interface Props { onOpen: () => void; }

const AUDIT_GROUPS = [
  { n: '01', group: 'POZITSIYA', items: [{ ix: '01', t: 'Mijoz sizni 3 soniyada qanday tushunadi' },{ ix: '02', t: 'Raqobatchilardan farqlanish darajasi' },{ ix: '03', t: 'Maqsadli auditoriya bilan moslik' }] },
  { n: '02', group: 'VIZUAL', items: [{ ix: '04', t: 'Logotip — texnik va konseptual baho' },{ ix: '05', t: "Rang palitrasi · psixologik mos" },{ ix: '06', t: "Tipografika va o'qish tezligi" },{ ix: '07', t: "Qadoq — javon va raqamli ko'rinish" }] },
  { n: '03', group: 'RAQAMLI', items: [{ ix: '08', t: 'Sayt — birinchi ekran va konversiya' },{ ix: '09', t: 'Instagram, Telegram, profil yaxlitligi' },{ ix: '10', t: 'Mahsulot fotosuratlari sifati' }] },
  { n: '04', group: 'HUQUQ', items: [{ ix: '11', t: 'Tovar belgisi himoyasi · risk darajasi' },{ ix: '12', t: 'Domen, ijtimoiy nom band qilinganmi' }] },
];

const DELIVERABLES = [
  { n: '01', t: 'PDF hisobot', note: "30—50 betlik to'liq tahlil hujjati" },
  { n: '02', t: 'Skor kartochka', note: "12 mezon bo'yicha 0—100 baho" },
  { n: '03', t: "Yo'qotish hisobi", note: "Aniq raqamlarda yo'qotilayotgan daromad" },
  { n: '04', t: 'Aniq tavsiyalar', note: 'Tezkor (1—4 hafta) va strategik' },
  { n: '05', t: 'Vizual moodboard', note: "Yangi yo'nalish uchun ilhom-tizimi" },
  { n: '06', t: "90 kunlik yo'l xaritasi", note: 'Bosqichma-bosqich harakat rejasi' },
];

const AtAudit: FC<Props> = ({ onOpen }) => (
  <section id="tashxis" className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="mb-12 md:mb-16 grid md:grid-cols-2 gap-8 items-end">
        <div>
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">§ 03 · 12 mezon</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>Brend tashxisi:<br />12 nuqta</h2>
        </div>
        <p className="text-[var(--at-ink-2)] leading-relaxed">Har bir nuqta bo'yicha 0—100 baho, muammolar va tavsiyalar. Hech narsa ko'zdan qochmasligi uchun tizimli yondashuv.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
        {AUDIT_GROUPS.map((g) => (
          <div key={g.n} className="border border-[var(--at-line)] rounded-2xl p-6 bg-[var(--at-paper)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)]">{g.n}</span>
              <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-ink)] font-bold">{g.group}</span>
            </div>
            <div className="space-y-3">{g.items.map((item) => (<div key={item.ix} className="flex gap-3 items-start"><span className="text-[var(--at-accent)] mt-0.5 flex-shrink-0">✓</span><span className="text-[var(--at-ink-2)] text-sm leading-relaxed">{item.t}</span></div>))}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--at-line)] pt-12">
        <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)] mb-8">Natijada olasiz</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {DELIVERABLES.map((d) => (<div key={d.n} className="border border-[var(--at-line)] rounded-xl p-4 bg-[var(--at-paper)]"><div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mb-1">{d.n}</div><div className="font-semibold text-[var(--at-ink)] text-sm mb-1">{d.t}</div><div className="text-xs text-[var(--at-muted)] leading-relaxed">{d.note}</div></div>))}
        </div>
        <button onClick={onOpen} className="bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">Tashxisni boshlash ↗</button>
      </div>
    </div>
  </section>
);

export default AtAudit;
