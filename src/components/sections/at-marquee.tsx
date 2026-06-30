'use client';
import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

const ITEMS: Record<Lang, string[]> = {
  uz: [
    'Qumri Coffee — +41% sotuv',
    'Teshabay osh — 3× takroriy mijoz',
    'Humo Fintech — 180K foydalanuvchi',
    'Oltin Bulut — +31% qadoqdan keyin',
    "Nur Sopol — 2× ko'rinish javonda",
    'Chilla — yangi shahar bozori',
  ],
  ru: [
    'Qumri Coffee — продажи +41%',
    'Teshabay osh — 3× повторных клиентов',
    'Humo Fintech — 180K пользователей',
    'Oltin Bulut — +31% после ребрендинга упаковки',
    'Nur Sopol — 2× видимость на полке',
    'Chilla — новый городской рынок',
  ],
  en: [
    'Qumri Coffee — +41% sales',
    'Teshabay osh — 3× repeat clients',
    'Humo Fintech — 180K users',
    'Oltin Bulut — +31% after packaging rebrand',
    'Nur Sopol — 2× shelf visibility',
    'Chilla — new city market',
  ],
  zh: [
    'Qumri Coffee — 销售额+41%',
    'Teshabay osh — 3×复购客户',
    'Humo Fintech — 18万用户',
    'Oltin Bulut — 重新包装后+31%',
    'Nur Sopol — 货架可见度2×',
    'Chilla — 开拓新城市市场',
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
