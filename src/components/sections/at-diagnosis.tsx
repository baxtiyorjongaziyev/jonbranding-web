'use client';
import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { onOpen: () => void; lang?: string; }

const t = {
  uz: {
    sectionLabel: '§ 01 · Belgilar',
    heading: 'Brendingiz siz uchun\nishlaydimi?',
    badLabel: '● Hozirgi holat',
    goodLabel: '● Keyin bo\'ladi',
    cta: 'Belgilarni topish · Bepul ↗',
    bad: [
      { ix: '01', t: "Mijozlar sizni ko'rib qaramaydi — chunki ko'rinishingiz oddiy." },
      { ix: '02', t: "Raqibingiz yomonroq, lekin ko'proq sotadi — chunki professional ko'rinadi." },
      { ix: '03', t: "Mijoz bir marta keladi va qaytmaydi — chunki esda qolmaysiz." },
      { ix: '04', t: "Nomingizni o'g'irlashlari mumkin — chunki davlatda ro'yxatdan o'tmagansiz." },
    ],
    good: [
      { ix: '01', t: "Mijoz 2 soniyada sizni tanib qoladi va eslab qoladi." },
      { ix: '02', t: "Do'kon javonida birinchi bo'lib ko'zga tashlanasiz." },
      { ix: '03', t: "Brendingiz davlat himoyasiga olinadi — qonuniy va abadiy." },
      { ix: '04', t: "Nom, logo, qadoq, sayt — bir uslubda, bir paketda, bir jamoa." },
    ],
  },
  ru: {
    sectionLabel: '§ 01 · Симптомы',
    heading: 'Ваш бренд работает\nна вас?',
    badLabel: '● Сейчас',
    goodLabel: '● После',
    cta: 'Найти симптомы · Бесплатно ↗',
    bad: [
      { ix: '01', t: "Клиенты смотрят сквозь вас — потому что внешний вид слишком обычный." },
      { ix: '02', t: "Конкурент хуже вас, но продаёт больше — потому что выглядит профессионально." },
      { ix: '03', t: "Клиент приходит один раз и не возвращается — потому что вас не запоминают." },
      { ix: '04', t: "Ваше название могут украсть — потому что вы не зарегистрированы в государстве." },
    ],
    good: [
      { ix: '01', t: "Клиент узнаёт и запоминает вас за 2 секунды." },
      { ix: '02', t: "Ваш продукт первым бросается в глаза на полке магазина." },
      { ix: '03', t: "Ваш бренд под государственной защитой — законно и навсегда." },
      { ix: '04', t: "Название, логотип, упаковка, сайт — в одном стиле, одном пакете, одной командой." },
    ],
  },
  en: {
    sectionLabel: '§ 01 · Symptoms',
    heading: 'Is your brand working\nfor you?',
    badLabel: '● Current state',
    goodLabel: '● After',
    cta: 'Find symptoms · Free ↗',
    bad: [
      { ix: '01', t: "Customers look past you — because your appearance is too ordinary." },
      { ix: '02', t: "Your competitor is worse but sells more — because they look professional." },
      { ix: '03', t: "Customers come once and don't return — because you're not memorable." },
      { ix: '04', t: "Your name could be stolen — because you're not registered with the state." },
    ],
    good: [
      { ix: '01', t: "Customers recognize and remember you in 2 seconds." },
      { ix: '02', t: "Your product is the first thing noticed on the store shelf." },
      { ix: '03', t: "Your brand is under state protection — legally and permanently." },
      { ix: '04', t: "Name, logo, packaging, website — one style, one package, one team." },
    ],
  },
  zh: {
    sectionLabel: '§ 01 · 症状',
    heading: '您的品牌在为\n您工作吗？',
    badLabel: '● 当前状态',
    goodLabel: '● 之后',
    cta: '发现症状 · 免费 ↗',
    bad: [
      { ix: '01', t: "客户看不到您——因为您的外观太普通了。" },
      { ix: '02', t: "竞争对手比您差，但卖得更多——因为他们看起来很专业。" },
      { ix: '03', t: "客户来一次就不回来了——因为您不令人难忘。" },
      { ix: '04', t: "您的名称可能被窃取——因为您没有在国家注册。" },
    ],
    good: [
      { ix: '01', t: "客户在2秒内认出并记住您。" },
      { ix: '02', t: "您的产品在商店货架上第一眼就能看到。" },
      { ix: '03', t: "您的品牌受到国家保护——合法且永久。" },
      { ix: '04', t: "名称、标志、包装、网站——统一风格，一个套餐，一个团队。" },
    ],
  },
} as const;

const AtDiagnosis: FC<Props> = ({ onOpen, lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section id="belgilar" className="py-16 md:py-24 border-t border-[var(--at-line)] bg-[var(--at-bg)]">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16">
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--at-muted)]">{l.sectionLabel}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--at-ink)] leading-tight" style={{ letterSpacing: '-0.02em' }}>
            {l.heading.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6"><span className="text-[var(--at-red)] text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">{l.badLabel}</span></div>
            <div className="space-y-0">{l.bad.map((item) => (<div key={item.ix} className="flex gap-4 py-4 border-b border-[var(--at-line)] last:border-0"><span className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mt-0.5 flex-shrink-0">{item.ix}</span><p className="text-[var(--at-ink-2)] leading-relaxed">{item.t}</p></div>))}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-6"><span className="text-[var(--at-green)] text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">{l.goodLabel}</span></div>
            <div className="space-y-0">{l.good.map((item) => (<div key={item.ix} className="flex gap-4 py-4 border-b border-[var(--at-line)] last:border-0"><span className="font-[family-name:var(--font-mono)] text-xs text-[var(--at-muted)] mt-0.5 flex-shrink-0">{item.ix}</span><p className="text-[var(--at-ink-2)] leading-relaxed">{item.t}</p></div>))}</div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--at-line)]"><button onClick={onOpen} className="bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">{l.cta}</button></div>
      </div>
    </section>
  );
};

export default AtDiagnosis;
