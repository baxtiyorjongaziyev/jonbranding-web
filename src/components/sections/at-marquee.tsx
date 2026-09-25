'use client';
import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

// Faqat portfolio'dagi haqiqiy keyslar. Tasdiqlanmagan raqam yoki mijoz qo'shmang.
const ITEMS: Record<Lang, string[]> = {
  uz: [
    'Den Aroma — neyming va rebrending',
    'Sarmilk — logotip va firma uslubi',
    'FIDDA by Sevara — rebrending',
    'Rutera — brending va patent',
    'Boyarin — qadoq dizayni',
    'Perfona — logotip va brending',
  ],
  ru: [
    'Den Aroma — нейминг и ребрендинг',
    'Sarmilk — логотип и фирменный стиль',
    'FIDDA by Sevara — ребрендинг',
    'Rutera — брендинг и патент',
    'Boyarin — дизайн упаковки',
    'Perfona — логотип и брендинг',
  ],
  en: [
    'Den Aroma — naming & rebrand',
    'Sarmilk — logo & corporate style',
    'FIDDA by Sevara — rebrand',
    'Rutera — branding & trademark',
    'Boyarin — packaging design',
    'Perfona — logo & branding',
  ],
  zh: [
    'Den Aroma — 命名与品牌重塑',
    'Sarmilk — 标志与企业视觉',
    'FIDDA by Sevara — 品牌重塑',
    'Rutera — 品牌与商标注册',
    'Boyarin — 包装设计',
    'Perfona — 标志与品牌',
  ],
};

const AtMarquee: FC<Props> = ({ lang = 'uz' }) => {
  const items = ITEMS[(lang as Lang) in ITEMS ? (lang as Lang) : 'uz'];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-4" style={{ backgroundColor: 'var(--at-ink)' }}>
      <div className="at-marquee-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-white font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest">
            [{item}]
            <span className="text-[var(--at-muted)] text-base">✶</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AtMarquee;
