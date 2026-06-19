'use client';
import type { FC } from 'react';

interface Props { onOpen: () => void; lang?: string; }

const SERVICES_UZ = [
  { num: '01', name: 'Neyming', desc: "Bozor tahlili, 40+ variant, tilshunos tekshiruvi, domen va social hisoblari band qilish.", time: '2–4 hafta' },
  { num: '02', name: 'Logotip & Aydentika', desc: "Logotip tizimi, rang palitrasi, tipografika, qo'llash qoidalari, real misollar.", time: '3–5 hafta' },
  { num: '03', name: 'Brendbuk', desc: "40+ betlik to'liq qo'llanma — rang, shrift, ovoz, misollar, qoidalar.", time: '2–3 hafta' },
  { num: '04', name: 'Qadoq dizayni', desc: 'Mokap, bosmaga tayyor fayl, retsept va texnik chizmalar. SKU tizimi.', time: '4–8 hafta' },
  { num: '05', name: 'Tovar belgisi', desc: "O'zbekiston, MDH va xalqaro miqyosda davlat himoyasi. To'liq jarayon.", time: '4–9 oy' },
  { num: '06', name: 'Raqamli brend', desc: 'Sayt, ijtimoiy tarmoq shablonlari, prezentatsiya, banner, motion.', time: '4–8 hafta' },
];

const SERVICES_RU = [
  { num: '01', name: 'Нейминг', desc: 'Анализ рынка, 40+ вариантов, лингвистическая экспертиза, регистрация домена и соцсетей.', time: '2–4 недели' },
  { num: '02', name: 'Логотип & Айдентика', desc: 'Система логотипа, цветовая палитра, типографика, правила применения, реальные примеры.', time: '3–5 недель' },
  { num: '03', name: 'Брендбук', desc: 'Полное руководство 40+ страниц — цвет, шрифт, голос, примеры, правила.', time: '2–3 недели' },
  { num: '04', name: 'Дизайн упаковки', desc: 'Мокап, файл для печати, рецептура и технические чертежи. Система SKU.', time: '4–8 недель' },
  { num: '05', name: 'Товарный знак', desc: 'Государственная защита в Узбекистане, СНГ и на международном уровне. Полный процесс.', time: '4–9 мес.' },
  { num: '06', name: 'Цифровой бренд', desc: 'Сайт, шаблоны для соцсетей, презентация, баннер, motion.', time: '4–8 недель' },
];

const SERVICES_EN = [
  { num: '01', name: 'Naming', desc: 'Market analysis, 40+ variants, linguistic review, domain & social handle registration.', time: '2–4 weeks' },
  { num: '02', name: 'Logo & Identity', desc: 'Logo system, color palette, typography, usage guidelines, real-world examples.', time: '3–5 weeks' },
  { num: '03', name: 'Brand Book', desc: '40+ page complete guide — color, font, voice, examples, rules.', time: '2–3 weeks' },
  { num: '04', name: 'Packaging Design', desc: 'Mockup, print-ready file, recipe and technical drawings. SKU system.', time: '4–8 weeks' },
  { num: '05', name: 'Trademark', desc: 'State protection in Uzbekistan, CIS and internationally. Full process.', time: '4–9 mo.' },
  { num: '06', name: 'Digital Brand', desc: 'Website, social media templates, presentation, banner, motion.', time: '4–8 weeks' },
];

const SERVICES_ZH = [
  { num: '01', name: '品牌命名', desc: '市场分析，40+方案，语言审核，域名及社交账号注册。', time: '2–4周' },
  { num: '02', name: '标志与视觉识别', desc: '标志体系、色彩方案、字体规范、使用指南、真实案例。', time: '3–5周' },
  { num: '03', name: '品牌手册', desc: '40+页完整指南——色彩、字体、语调、案例、规则。', time: '2–3周' },
  { num: '04', name: '包装设计', desc: '效果图、印刷文件、配方及技术图纸。SKU体系。', time: '4–8周' },
  { num: '05', name: '商标注册', desc: '乌兹别克斯坦、独联体及国际范围内的国家保护。全流程。', time: '4–9月' },
  { num: '06', name: '数字品牌', desc: '网站、社交媒体模板、演示文稿、横幅、动效。', time: '4–8周' },
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

      <div className="border-t border-[var(--at-ink)]">
        {SERVICES.map((s) => (
          <div
            key={s.num}
            onClick={onOpen}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
            role="button"
            tabIndex={0}
            className="group border-b border-[var(--at-line)] cursor-pointer hover:bg-[var(--at-paper)] transition-all duration-300"
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
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--at-muted)] hidden md:block">
                {s.time}
              </div>
              <div className="justify-self-end w-11 h-11 rounded-full border border-[var(--at-line)] grid place-items-center text-sm group-hover:bg-[var(--at-accent)] group-hover:text-white group-hover:border-[var(--at-accent)] group-hover:-rotate-45 transition-all duration-300">
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
