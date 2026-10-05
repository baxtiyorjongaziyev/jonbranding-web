import { FC } from 'react';
import { ArrowDown } from 'lucide-react';
import { mono } from '../data';
import { Tag } from './ui';

export const HeroStrategyMap: FC = () => {
  const steps = [
    { key: '01', title: 'Business', desc: 'Biznes modeli va maqsadlar' },
    { key: '02', title: 'Market', desc: 'Kategoriya va tendensiyalar' },
    { key: '03', title: 'Audience', desc: 'Segmentlar va JTBD ehtiyojlar' },
    { key: '04', title: 'Positioning', desc: 'Bozordagi aniq o‘rin' },
    { key: '05', title: 'Value Proposition', desc: 'Uch qatlamli foyda tizimi' },
    { key: '06', title: 'Differentiation', desc: 'Asoslangan farq' },
    { key: '07', title: 'Brand Idea', desc: 'Bitta markaziy g‘oya' },
  ];

  return (
    <figure
      aria-label="Brand Strategy Map"
      className="relative rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.18)] sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase text-neutral-400" style={mono}>
            Strategic Framework
          </span>
          <p className="text-base font-bold text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
            Brand Strategy Map
          </p>
        </div>
        <Tag tone="blue">Editorial</Tag>
      </div>

      <div className="space-y-2">
        {steps.map((st, i) => (
          <div key={st.title} className="group relative">
            <div
              className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors ${
                i === 3
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                  : i === 6
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-mono ${
                    i === 6 ? 'text-neutral-400' : i === 3 ? 'text-blue-700 font-bold' : 'text-neutral-400'
                  }`}
                >
                  {st.key}
                </span>
                <span className="text-sm font-semibold">{st.title}</span>
              </div>
              <span
                className={`text-[12px] ${
                  i === 6 ? 'text-neutral-300' : i === 3 ? 'text-blue-800' : 'text-neutral-500'
                }`}
              >
                {st.desc}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown className="h-3 w-3 text-neutral-300" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
        <p className="text-center text-[13px] font-medium leading-relaxed text-neutral-700">
          Dizaynni boshlashdan oldin, nimani va kim uchun qurayotganimizni aniqlaymiz.
        </p>
      </div>
      <figcaption className="sr-only">
        Brand Strategy Map biznesdan boshlab to to‘g‘ridan-to‘g‘ri brend g‘oyasigacha bo‘lgan strategik zanjirni ko‘rsatadi.
      </figcaption>
    </figure>
  );
};
