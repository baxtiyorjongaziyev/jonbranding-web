'use client';
import Link from 'next/link';
import { getSalesContent } from '@/lib/sales-content';
import type { FC } from 'react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props { onOpen: () => void; lang?: string; dictionary?: any; }
interface ServiceItem { num: string; name: string; desc: string; time: string; }

const HEADING: Record<string, { h: string; italic: string; sub: string; desc: string }> = {
  uz: { h: 'Brend — boshidan', italic: 'oxirigacha.', sub: '§ 04 Xizmatlar', desc: "Neyming, aydentika, qadoq, tovar belgisi va raqamli ko'rinish — bir joyda, bir jamoa, bir narxda. Har biri alohida ham buyurtma qilinadi." },
  ru: { h: 'Бренд — с начала', italic: 'до конца.', sub: '§ 04 Услуги', desc: 'Нейминг, айдентика, упаковка, товарный знак и digital-присутствие — в одном месте, одна команда, одна цена. Каждая услуга заказывается отдельно.' },
  en: { h: 'Brand — from start', italic: 'to finish.', sub: '§ 04 Services', desc: 'Naming, identity, packaging, trademark and digital presence — one place, one team, one price. Each service can be ordered separately.' },
  zh: { h: '品牌——从开始', italic: '到结束。', sub: '§ 04 服务', desc: '命名、视觉识别、包装、商标注册和数字形象——一站式，一个团队，一个价格。每项服务均可单独订购。' },
};

const AtServices: FC<Props> = ({ lang = 'uz', dictionary }) => {
  const services = getSalesContent(lang).serviceGroups.flatMap(group => group.items);
  const SERVICES: ServiceItem[] = ['visual-identity', 'brandbook', 'packaging'].map((id, index) => {
    const service = services.find(item => item.id === id)!;
    return { num: String(index + 1).padStart(2, '0'), name: service.name, desc: service.lead, time: service.duration || '' };
  });
  const h = HEADING[lang] ?? HEADING.uz;
  const headingLines = String(dictionary?.services_title ?? `${h.h}\n${h.italic}`).split('\n');
  const headingFirst = headingLines[0];
  const headingLast = headingLines.slice(1).join(' ') || h.italic;
  const sectionLabel = dictionary?.services_label ?? h.sub;
  const sectionDescription = dictionary?.services_lede ?? h.desc;
  const timelineNote = dictionary?.services_timeline_note ?? '';
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll('.service-row');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(rows,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: listRef });

  return (
  <section className="home-contrast py-20 md:py-[120px] relative z-[2]" id="xizmat">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-16">
        <h2
          className="font-bold text-[var(--at-ink)]"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
        >
          {headingFirst}
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal">{headingLast}</span>
        </h2>
        <div>
          <span className="inline-flex items-center gap-2 mb-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block" />
            <span>{sectionLabel}</span>
          </span>
          <p className="text-[var(--at-ink-2)] text-sm leading-[1.55]">{sectionDescription}</p>
        </div>
      </div>

      <div ref={listRef} className="border-t border-[var(--at-ink)]">
        {SERVICES.map((s, i) => (
          <Link
            key={s.num}
            href={`/${lang}/narxlar#service-${['visual-identity', 'brandbook', 'packaging'][i]}`}
            className="service-row group block w-full border-b border-[var(--at-line)] cursor-pointer text-left hover:bg-[var(--at-paper)] transition-[background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--at-accent)]"
          >
            <div
              className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 px-2 py-6 transition-[padding] duration-300 group-hover:px-3 md:grid-cols-[90px_minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,.8fr)_80px] md:gap-6 md:py-8 md:group-hover:px-6 motion-reduce:transition-none"
            >
              <div
                className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-muted)] leading-none group-hover:text-[var(--at-accent)] transition-colors"
                style={{ fontSize: 36 }}
              >
                {s.num}
              </div>
              <div
                className="min-w-0 break-words font-semibold text-[var(--at-ink)]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
              >
                {s.name}
              </div>
              <div className="text-sm text-[var(--at-ink-2)] leading-[1.55] hidden md:block">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)] hidden md:block relative group/time">
                <span className="border-b border-dashed border-[var(--at-muted)] cursor-help pb-0.5 transition-colors group-hover/time:text-[var(--at-accent)] group-hover/time:border-[var(--at-accent)]">{s.time}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-[var(--at-ink)] text-white text-[11px] normal-case tracking-normal p-2 rounded shadow-xl opacity-0 pointer-events-none group-hover/time:opacity-100 group-hover/time:-translate-y-1 transition-[opacity,transform] duration-300 z-10 motion-reduce:transition-none">
                  {timelineNote}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[var(--at-ink)]"></div>
                </div>
              </div>
              <div aria-hidden="true" className="justify-self-end w-11 h-11 rounded-full border border-[var(--at-line)] grid place-items-center text-sm group-hover:bg-[var(--at-accent)] group-hover:text-white group-hover:border-[var(--at-accent)] group-hover:-rotate-45 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-[background-color,border-color,color,transform,box-shadow] duration-300 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                ↗
              </div>
            </div>
            <div className="grid w-full min-w-0 grid-cols-3 gap-x-3 px-2 pb-4 -mt-2 md:hidden">
              <div className="col-span-3 min-w-0 break-words text-xs text-[var(--at-ink-2)] leading-[1.55]">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)] mt-2">{s.time}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
  );
};

export default AtServices;
