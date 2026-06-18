import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { onOpen: () => void; lang?: string; }

const t = {
  uz: {
    sectionLabel: '§ 07 · Loyihalar',
    heading: 'Ishlar indeksi',
    headers: ["Yil", "Mijoz", "Soha · Joy", "Yo'nalish", 'Natija', ''],
    projects: [
      { year: '2026', name: 'ARFADEL', scope: 'Parfyumeriya · Toshkent', work: 'Logotip · Firma uslubi', result: '8 500+ obunachilar' },
      { year: '2026', name: 'Boyarin', scope: "Sutchilik · Farg'ona", work: 'Qadoq dizayni · 2 SKU', result: 'Yangilangan aydentika' },
      { year: '2026', name: 'Beyaz', scope: 'Premium brend', work: 'Logotip · Rang tizimi', result: 'Gold/Green variantlar' },
      { year: '2026', name: 'Estem', scope: 'Savdo markasi', work: 'Logotip · Variantlar', result: "To'liq aydentika" },
      { year: '2026', name: 'Geonest Engineering', scope: 'Muhandislik · Toshkent', work: 'Korporativ logotip', result: 'B2B brending' },
      { year: '2026', name: 'Master Mould', scope: 'Ishlab chiqarish', work: 'Korporativ logotip', result: 'Firma uslubi' },
      { year: '2025', name: 'Rutera', scope: 'Savdo kompaniyasi', work: 'Logotip · Brendbuk', result: "To'liq brendbuk" },
      { year: '2025', name: 'Doctor Fresh', scope: 'Tijorat tozalash', work: 'Katalog · Brending', result: 'Chakana tarmoq' },
    ],
  },
  ru: {
    sectionLabel: '§ 07 · Проекты',
    heading: 'Индекс работ',
    headers: ["Год", "Клиент", "Отрасль · Место", "Направление", 'Результат', ''],
    projects: [
      { year: '2026', name: 'ARFADEL', scope: 'Парфюмерия · Ташкент', work: 'Логотип · Фирменный стиль', result: '8 500+ подписчиков' },
      { year: '2026', name: 'Boyarin', scope: 'Молочная продукция · Фергана', work: 'Дизайн упаковки · 2 SKU', result: 'Обновлённый айдентика' },
      { year: '2026', name: 'Beyaz', scope: 'Премиум бренд', work: 'Логотип · Цветовая система', result: 'Gold/Green варианты' },
      { year: '2026', name: 'Estem', scope: 'Торговая марка', work: 'Логотип · Варианты', result: 'Полная айдентика' },
      { year: '2026', name: 'Geonest Engineering', scope: 'Инжиниринг · Ташкент', work: 'Корпоративный логотип', result: 'B2B брендинг' },
      { year: '2026', name: 'Master Mould', scope: 'Производство', work: 'Корпоративный логотип', result: 'Фирменный стиль' },
      { year: '2025', name: 'Rutera', scope: 'Торговая компания', work: 'Логотип · Брендбук', result: 'Полный брендбук' },
      { year: '2025', name: 'Doctor Fresh', scope: 'Коммерческая уборка', work: 'Каталог · Брендинг', result: 'Розничная сеть' },
    ],
  },
  en: {
    sectionLabel: '§ 07 · Projects',
    heading: 'Work index',
    headers: ["Year", "Client", "Industry · Location", "Direction", 'Result', ''],
    projects: [
      { year: '2026', name: 'ARFADEL', scope: 'Perfumery · Tashkent', work: 'Logo · Brand identity', result: '8,500+ subscribers' },
      { year: '2026', name: 'Boyarin', scope: 'Dairy · Fergana', work: 'Packaging design · 2 SKU', result: 'Updated identity' },
      { year: '2026', name: 'Beyaz', scope: 'Premium brand', work: 'Logo · Color system', result: 'Gold/Green variants' },
      { year: '2026', name: 'Estem', scope: 'Trade mark', work: 'Logo · Variants', result: 'Full identity' },
      { year: '2026', name: 'Geonest Engineering', scope: 'Engineering · Tashkent', work: 'Corporate logo', result: 'B2B branding' },
      { year: '2026', name: 'Master Mould', scope: 'Manufacturing', work: 'Corporate logo', result: 'Brand identity' },
      { year: '2025', name: 'Rutera', scope: 'Trade company', work: 'Logo · Brand book', result: 'Full brand book' },
      { year: '2025', name: 'Doctor Fresh', scope: 'Commercial cleaning', work: 'Catalog · Branding', result: 'Retail network' },
    ],
  },
  zh: {
    sectionLabel: '§ 07 · 项目',
    heading: '作品索引',
    headers: ["年份", "客户", "行业·地点", "方向", '结果', ''],
    projects: [
      { year: '2026', name: 'ARFADEL', scope: '香水·塔什干', work: '标志·品牌形象', result: '8500+订阅者' },
      { year: '2026', name: 'Boyarin', scope: '乳制品·费尔干纳', work: '包装设计·2个SKU', result: '更新的品牌形象' },
      { year: '2026', name: 'Beyaz', scope: '高端品牌', work: '标志·色彩系统', result: 'Gold/Green变体' },
      { year: '2026', name: 'Estem', scope: '商标', work: '标志·变体', result: '完整形象' },
      { year: '2026', name: 'Geonest Engineering', scope: '工程·塔什干', work: '企业标志', result: 'B2B品牌' },
      { year: '2026', name: 'Master Mould', scope: '制造业', work: '企业标志', result: '企业形象' },
      { year: '2025', name: 'Rutera', scope: '贸易公司', work: '标志·品牌手册', result: '完整品牌手册' },
      { year: '2025', name: 'Doctor Fresh', scope: '商业清洁', work: '目录·品牌', result: '零售网络' },
    ],
  },
} as const;

const AtWorkIndex: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="mb-10">
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">{l.sectionLabel}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>{l.heading}</h2>
        </div>
        <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--at-line)]">
                {l.headers.map((h, i) => (<th key={i} className="text-left font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--at-muted)] pb-3 pr-6 last:pr-0 font-normal">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {l.projects.map((p, i) => (
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
};

export default AtWorkIndex;
