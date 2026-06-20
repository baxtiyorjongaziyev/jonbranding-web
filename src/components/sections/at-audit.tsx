import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { onOpen: () => void; lang?: string; }

const t = {
  uz: {
    sectionLabel: '§ 03 · 12 mezon',
    heading: 'Brend tashxisi:\n12 nuqta',
    sub: "Har bir nuqta bo'yicha 0—100 baho, muammolar va tavsiyalar. Hech narsa ko'zdan qochmasligi uchun tizimli yondashuv.",
    deliverablesLabel: 'Natijada olasiz',
    cta: 'Tashxisni boshlash ↗',
    groups: [
      { n: '01', group: 'POZITSIYA', items: [{ ix: '01', t: 'Mijoz sizni 3 soniyada qanday tushunadi' }, { ix: '02', t: 'Raqobatchilardan farqlanish darajasi' }, { ix: '03', t: 'Maqsadli auditoriya bilan moslik' }] },
      { n: '02', group: 'VIZUAL', items: [{ ix: '04', t: 'Logotip — texnik va konseptual baho' }, { ix: '05', t: "Rang palitrasi · psixologik mos" }, { ix: '06', t: "Tipografika va o'qish tezligi" }, { ix: '07', t: "Qadoq — javon va raqamli ko'rinish" }] },
      { n: '03', group: 'RAQAMLI', items: [{ ix: '08', t: 'Sayt — birinchi ekran va konversiya' }, { ix: '09', t: 'Instagram, Telegram, profil yaxlitligi' }, { ix: '10', t: 'Mahsulot fotosuratlari sifati' }] },
      { n: '04', group: 'HUQUQ', items: [{ ix: '11', t: 'Tovar belgisi himoyasi · risk darajasi' }, { ix: '12', t: 'Domen, ijtimoiy nom band qilinganmi' }] },
    ],
    deliverables: [
      { n: '01', t: 'PDF hisobot', note: "30—50 betlik to'liq tahlil hujjati" },
      { n: '02', t: 'Skor kartochka', note: "12 mezon bo'yicha 0—100 baho" },
      { n: '03', t: "Yo'qotish hisobi", note: "Aniq raqamlarda yo'qotilayotgan daromad" },
      { n: '04', t: 'Aniq tavsiyalar', note: 'Tezkor (1—4 hafta) va strategik' },
      { n: '05', t: 'Vizual moodboard', note: "Yangi yo'nalish uchun ilhom-tizimi" },
      { n: '06', t: "90 kunlik yo'l xaritasi", note: 'Bosqichma-bosqich harakat rejasi' },
    ],
  },
  ru: {
    sectionLabel: '§ 03 · 12 критериев',
    heading: 'Бренд-диагностика:\n12 точек',
    sub: 'Оценка 0—100 по каждому критерию, проблемы и рекомендации. Системный подход — ничто не ускользнёт.',
    deliverablesLabel: 'Вы получите',
    cta: 'Начать диагностику ↗',
    groups: [
      { n: '01', group: 'ПОЗИЦИОНИРОВАНИЕ', items: [{ ix: '01', t: 'Как клиент понимает вас за 3 секунды' }, { ix: '02', t: 'Степень отличия от конкурентов' }, { ix: '03', t: 'Соответствие целевой аудитории' }] },
      { n: '02', group: 'ВИЗУАЛ', items: [{ ix: '04', t: 'Логотип — техническая и концептуальная оценка' }, { ix: '05', t: 'Цветовая палитра · психологическое соответствие' }, { ix: '06', t: 'Типографика и скорость чтения' }, { ix: '07', t: 'Упаковка — вид на полке и в диджитал' }] },
      { n: '03', group: 'ДИДЖИТАЛ', items: [{ ix: '08', t: 'Сайт — первый экран и конверсия' }, { ix: '09', t: 'Instagram, Telegram, целостность профиля' }, { ix: '10', t: 'Качество фотографий продукта' }] },
      { n: '04', group: 'ПРАВО', items: [{ ix: '11', t: 'Защита товарного знака · степень риска' }, { ix: '12', t: 'Занят ли домен и соцсети' }] },
    ],
    deliverables: [
      { n: '01', t: 'PDF-отчёт', note: 'Полный аналитический документ 30—50 страниц' },
      { n: '02', t: 'Скор-карточка', note: 'Оценка 0—100 по 12 критериям' },
      { n: '03', t: 'Расчёт потерь', note: 'Упущенная прибыль в конкретных числах' },
      { n: '04', t: 'Чёткие рекомендации', note: 'Срочные (1—4 недели) и стратегические' },
      { n: '05', t: 'Визуальный мудборд', note: 'Система вдохновения для нового направления' },
      { n: '06', t: 'Дорожная карта на 90 дней', note: 'Пошаговый план действий' },
    ],
  },
  en: {
    sectionLabel: '§ 03 · 12 criteria',
    heading: 'Brand diagnosis:\n12 points',
    sub: 'Score 0—100 per criterion, problems and recommendations. Systematic approach — nothing escapes.',
    deliverablesLabel: "You'll receive",
    cta: 'Start diagnosis ↗',
    groups: [
      { n: '01', group: 'POSITIONING', items: [{ ix: '01', t: 'How a client understands you in 3 seconds' }, { ix: '02', t: 'Degree of differentiation from competitors' }, { ix: '03', t: 'Alignment with target audience' }] },
      { n: '02', group: 'VISUAL', items: [{ ix: '04', t: 'Logo — technical and conceptual assessment' }, { ix: '05', t: 'Color palette · psychological fit' }, { ix: '06', t: 'Typography and readability' }, { ix: '07', t: 'Packaging — shelf and digital appearance' }] },
      { n: '03', group: 'DIGITAL', items: [{ ix: '08', t: 'Website — first screen and conversion' }, { ix: '09', t: 'Instagram, Telegram, profile integrity' }, { ix: '10', t: 'Product photo quality' }] },
      { n: '04', group: 'LEGAL', items: [{ ix: '11', t: 'Trademark protection · risk level' }, { ix: '12', t: 'Domain and social handles claimed?' }] },
    ],
    deliverables: [
      { n: '01', t: 'PDF report', note: '30—50 page full analysis document' },
      { n: '02', t: 'Score card', note: '0—100 rating across 12 criteria' },
      { n: '03', t: 'Loss calculation', note: 'Lost revenue in specific numbers' },
      { n: '04', t: 'Clear recommendations', note: 'Quick (1—4 weeks) and strategic' },
      { n: '05', t: 'Visual moodboard', note: 'Inspiration system for new direction' },
      { n: '06', t: '90-day roadmap', note: 'Step-by-step action plan' },
    ],
  },
  zh: {
    sectionLabel: '§ 03 · 12项标准',
    heading: '品牌诊断：\n12个要点',
    sub: '每项标准评分0—100，问题和建议。系统化方法——无一遗漏。',
    deliverablesLabel: '您将获得',
    cta: '开始诊断 ↗',
    groups: [
      { n: '01', group: '定位', items: [{ ix: '01', t: '客户如何在3秒内理解您' }, { ix: '02', t: '与竞争对手的差异化程度' }, { ix: '03', t: '与目标受众的匹配度' }] },
      { n: '02', group: '视觉', items: [{ ix: '04', t: '标志——技术和概念评估' }, { ix: '05', t: '色彩方案·心理契合度' }, { ix: '06', t: '字体排印和可读性' }, { ix: '07', t: '包装——货架和数字外观' }] },
      { n: '03', group: '数字', items: [{ ix: '08', t: '网站——首屏和转化率' }, { ix: '09', t: 'Instagram、Telegram，个人资料完整性' }, { ix: '10', t: '产品照片质量' }] },
      { n: '04', group: '法律', items: [{ ix: '11', t: '商标保护·风险级别' }, { ix: '12', t: '域名和社交账号已注册？' }] },
    ],
    deliverables: [
      { n: '01', t: 'PDF报告', note: '30—50页完整分析文件' },
      { n: '02', t: '评分卡', note: '12项标准各项0—100评分' },
      { n: '03', t: '损失计算', note: '具体数字的收入损失' },
      { n: '04', t: '明确建议', note: '快速（1—4周）和战略性建议' },
      { n: '05', t: '视觉情绪板', note: '新方向的灵感系统' },
      { n: '06', t: '90天路线图', note: '逐步行动计划' },
    ],
  },
} as const;

const AtAudit: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section id="tashxis" className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16 grid md:grid-cols-2 gap-8 items-end">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">{l.sectionLabel}</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>
              {l.heading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </div>
          <p className="text-[var(--at-ink-2)] leading-relaxed">{l.sub}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
          {l.groups.map((g) => (
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
          <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)] mb-8">{l.deliverablesLabel}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {l.deliverables.map((d) => (<div key={d.n} className="border border-[var(--at-line)] rounded-xl p-4 bg-[var(--at-paper)]"><div className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mb-1">{d.n}</div><div className="font-semibold text-[var(--at-ink)] text-sm mb-1">{d.t}</div><div className="text-xs text-[var(--at-muted)] leading-relaxed">{d.note}</div></div>))}
          </div>
          <button onClick={onOpen} className="bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">{l.cta}</button>
        </div>
      </div>
    </section>
  );
};

export default AtAudit;
