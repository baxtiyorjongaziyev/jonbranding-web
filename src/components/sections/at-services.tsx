'use client';
import type { FC } from 'react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props { onOpen: () => void; lang?: string; }

const SERVICES_UZ = [
  { num: '01', name: 'Neyming', desc: "Biznesingizga to'g'ri nom berish — esda qolarli, yuridik toza, va domen hamda Instagram handle bilan.", time: '2–4 hafta' },
  { num: '02', name: 'Logotip & Aydentika', desc: "Chiroyli logo + vizitkada, veb-saytda, ijtimoiy tarmoqda bir xil ko'rinis uchun ranglar va shriftlar.", time: '3–5 hafta' },
  { num: '03', name: 'Brendbuk', desc: "Hamkasblar uchun: logotip, ranglar, shriftlarni qanday ishlatish kerakligini tushuntiradigan qo'llanma.", time: '2–3 hafta' },
  { num: '04', name: 'Qadoq dizayni', desc: 'Mahsulot qadoqini sotish kerak shunchalik chiroyli qilish + bosmaga tayyor fayl.', time: '4–8 hafta' },
  { num: '05', name: 'Tovar belgisi', desc: "Biznesingizni qonuniy tarzda himoya qilish — O'zbekiston, CIS va boshqa mamlakatlar.", time: '4–9 oy' },
  { num: '06', name: 'Raqamli brend', desc: 'Veb-sayt, ijtimoiy tarmoqlar uchun dizayn, animatsiyalar — internetda shirinli ko'rinish.', time: '4–8 hafta' },
];

const SERVICES_RU = [
  { num: '01', name: 'Нейминг', desc: 'Правильное имя для вашего бизнеса — запоминающееся, законное, готовое для домена и Instagram.', time: '2–4 недели' },
  { num: '02', name: 'Логотип & Айдентика', desc: 'Красивый логотип + единый стиль на визитке, сайте, в соцсетях (цвета и шрифты).', time: '3–5 недель' },
  { num: '03', name: 'Брендбук', desc: 'Инструкция для команды: как правильно использовать логотип, цвета и шрифты.', time: '2–3 недели' },
  { num: '04', name: 'Дизайн упаковки', desc: 'Красивая упаковка продукта, которая продаёт сама по себе + файл для типографии.', time: '4–8 недель' },
  { num: '05', name: 'Товарный знак', desc: 'Юридическая защита вашего бренда — в Узбекистане, СНГ и мире.', time: '4–9 мес.' },
  { num: '06', name: 'Цифровой бренд', desc: 'Сайт, дизайн для соцсетей, анимация — красивый вид в интернете.', time: '4–8 недель' },
];

const SERVICES_EN = [
  { num: '01', name: 'Naming', desc: 'The perfect name for your business — memorable, legal, ready for domain and social media.', time: '2–4 weeks' },
  { num: '02', name: 'Logo & Identity', desc: 'Beautiful logo + consistent look on business cards, website, Instagram (colors & fonts).', time: '3–5 weeks' },
  { num: '03', name: 'Brand Book', desc: 'Instructions for your team: how to properly use the logo, colors, and fonts.', time: '2–3 weeks' },
  { num: '04', name: 'Packaging Design', desc: 'Eye-catching product packaging that sells itself + print-ready file for production.', time: '4–8 weeks' },
  { num: '05', name: 'Trademark', desc: 'Legal protection for your brand — in Uzbekistan, CIS countries, and worldwide.', time: '4–9 mo.' },
  { num: '06', name: 'Digital Brand', desc: 'Website, social media design, animations — a professional look online.', time: '4–8 weeks' },
];

const SERVICES_ZH = [
  { num: '01', name: '品牌命名', desc: '为您的企业取一个好名字——易记、合法、准备好域名和社交账号。', time: '2–4周' },
  { num: '02', name: '标志与视觉识别', desc: '漂亮的标志 + 名片、网站、Instagram上的统一风格（颜色和字体）。', time: '3–5周' },
  { num: '03', name: '品牌手册', desc: '您的团队指南：如何正确使用标志、颜色和字体。', time: '2–3周' },
  { num: '04', name: '包装设计', desc: '抢眼的产品包装能自己销售 + 可用于印刷的文件。', time: '4–8周' },
  { num: '05', name: '商标注册', desc: '保护您的品牌——在乌兹别克斯坦、独联体和全球范围内。', time: '4–9月' },
  { num: '06', name: '数字品牌', desc: '网站、社交媒体设计、动画——专业的网络形象。', time: '4–8周' },
];

const SERVICES_MAP: Record<string, typeof SERVICES_UZ> = { uz: SERVICES_UZ, ru: SERVICES_RU, en: SERVICES_EN, zh: SERVICES_ZH };

const HEADING: Record<string, { h: string; italic: string; sub: string; desc: string }> = {
  uz: { h: 'Brend — boshidan', italic: 'oxirigacha.', sub: '§ 04 Xizmatlar', desc: "Neyming, aydentika, qadoq, tovar belgisi va raqamli ko'rinish — bir joyda, bir jamoa, bir narxda. Har biri alohida ham buyurtma qilinadi." },
  ru: { h: 'Бренд — с начала', italic: 'до конца.', sub: '§ 04 Услуги', desc: 'Нейминг, айдентика, упаковка, товарный знак и digital-присутствие — в одном месте, одна команда, одна цена. Каждая услуга заказывается отдельно.' },
  en: { h: 'Brand — from start', italic: 'to finish.', sub: '§ 04 Services', desc: 'Naming, identity, packaging, trademark and digital presence — one place, one team, one price. Each service can be ordered separately.' },
  zh: { h: '品牌——从开始', italic: '到结束。', sub: '§ 04 服务', desc: '命名、视觉识别、包装、商标注册和数字形象——一站式，一个团队，一个价格。每项服务均可单独订购。' },
};

const AtServices: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const SERVICES = SERVICES_MAP[lang] ?? SERVICES_UZ;
  const h = HEADING[lang] ?? HEADING.uz;
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll('.service-row');
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
  <section className="py-[120px] relative z-[2]" id="xizmat">
    <div className="max-w-[1320px] mx-auto px-5 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-16">
        <h2
          className="font-bold text-[var(--at-ink)]"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
        >
          {h.h}
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal">{h.italic}</span>
        </h2>
        <div>
          <span className="inline-flex items-center gap-2 mb-3.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--at-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--at-accent)] inline-block" />
            <span>{h.sub}</span>
          </span>
          <p className="text-[var(--at-ink-2)] text-sm leading-[1.55]">{h.desc}</p>
        </div>
      </div>

      <div ref={listRef} className="border-t border-[var(--at-ink)]">
        {SERVICES.map((s) => (
          <div
            key={s.num}
            onClick={onOpen}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
            role="button"
            tabIndex={0}
            className="service-row group border-b border-[var(--at-line)] cursor-pointer hover:bg-[var(--at-paper)] transition-all duration-300"
          >
            <div
              className="grid items-center gap-6 py-8 px-2 group-hover:px-6 transition-all duration-300"
              style={{ gridTemplateColumns: '90px 1.4fr 2fr 0.8fr 80px' }}
            >
              <div
                className="font-[family-name:var(--font-serif)] italic font-normal text-[var(--at-muted)] leading-none group-hover:text-[var(--at-accent)] transition-colors"
                style={{ fontSize: 36 }}
              >
                {s.num}
              </div>
              <div
                className="font-semibold text-[var(--at-ink)]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
              >
                {s.name}
              </div>
              <div className="text-sm text-[var(--at-ink-2)] leading-[1.55] hidden md:block">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)] hidden md:block relative group/time">
                <span className="border-b border-dashed border-[var(--at-muted)] cursor-help pb-0.5 transition-colors group-hover/time:text-[var(--at-accent)] group-hover/time:border-[var(--at-accent)]">{s.time}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-[var(--at-ink)] text-white text-[10px] normal-case tracking-normal p-2 rounded shadow-xl opacity-0 pointer-events-none group-hover/time:opacity-100 group-hover/time:-translate-y-1 transition-all duration-300 z-10">
                  {lang === 'uz' ? 'Muddat loyiha hajmiga qarab belgilanadi' : lang === 'ru' ? 'Сроки зависят от объема проекта' : lang === 'en' ? 'Timeline depends on project scope' : '时间表取决于项目范围'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[var(--at-ink)]"></div>
                </div>
              </div>
              <div className="justify-self-end w-11 h-11 rounded-full border border-[var(--at-line)] grid place-items-center text-sm group-hover:bg-[var(--at-accent)] group-hover:text-white group-hover:border-[var(--at-accent)] group-hover:-rotate-45 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all duration-300">
                ↗
              </div>
            </div>
            <div className="md:hidden px-2 pb-4 -mt-2 grid grid-cols-2 gap-x-4">
              <div className="text-xs text-[var(--at-ink-2)] leading-[1.55] col-span-2">{s.desc}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--at-muted)] mt-2">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default AtServices;
