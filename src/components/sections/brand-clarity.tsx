'use client';

import type { FC } from 'react';
import { ArrowRight, BadgeCheck, BookOpen, Box, Fingerprint, PenLine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandCard, BrandSection, SectionIntro } from '@/components/ui/design-system';

type BrandClarityProps = {
  lang: string;
  onCtaClick: () => void;
};

const copy = {
  uz: {
    eyebrow: 'Oddiy tushuntirish',
    title: 'Logo, naming va branding bir xil narsa emas.',
    description:
      'Logo belgidir. Naming nomdir. Branding esa mijoz sizni ko‘rganda ishonishi, eslab qolishi va raqobatchidan qimmatroq bo‘lsa ham tanlashi uchun quriladigan tizim.',
    cta: 'Brendimda nima yetishmayotganini bilish',
    items: [
      { title: 'Logo', desc: 'Biznesingizni tanitadigan belgi. Lekin yolg‘iz logo sotuvni ko‘tarmaydi.', icon: Fingerprint },
      { title: 'Naming', desc: 'Eslab qolish, aytish va tavsiya qilish oson bo‘lgan nom tizimi.', icon: PenLine },
      { title: 'Branding', desc: 'Nom, logo, rang, matn, qadoq va mijoz taassurotini bitta ishonch tizimiga yig‘ish.', icon: Sparkles },
      { title: 'Brandbook', desc: 'Brendingiz har joyda bir xil ko‘rinishi uchun qoida va standartlar.', icon: BookOpen },
      { title: 'Qadoq', desc: 'Mahsulot tokchada qimmatroq va ishonchliroq ko‘rinishi uchun vizual yechim.', icon: Box },
      { title: 'Strategiya', desc: 'Kimga, nima uchun va qanday va’da bilan sotishingizni aniqlab beradigan yo‘l xaritasi.', icon: BadgeCheck },
    ],
  },
  ru: {
    eyebrow: 'Простое объяснение',
    title: 'Логотип, нейминг и брендинг — не одно и то же.',
    description:
      'Логотип — это знак. Нейминг — название. Брендинг — система доверия, из-за которой клиент запоминает вас и выбирает не только по цене.',
    cta: 'Понять, чего не хватает бренду',
    items: [
      { title: 'Логотип', desc: 'Знак узнаваемости. Но один логотип не строит доверие.', icon: Fingerprint },
      { title: 'Нейминг', desc: 'Название, которое легко запомнить, произнести и рекомендовать.', icon: PenLine },
      { title: 'Брендинг', desc: 'Единая система: имя, визуал, смысл, упаковка и впечатление клиента.', icon: Sparkles },
      { title: 'Брендбук', desc: 'Правила, чтобы бренд выглядел стабильно на всех носителях.', icon: BookOpen },
      { title: 'Упаковка', desc: 'Визуал, который помогает продукту выглядеть дороже и надежнее.', icon: Box },
      { title: 'Стратегия', desc: 'Кому, зачем и с каким обещанием продает ваш бренд.', icon: BadgeCheck },
    ],
  },
  en: {
    eyebrow: 'Plain explanation',
    title: 'Logo, naming, and branding are not the same thing.',
    description:
      'A logo is a mark. Naming is the name. Branding is the trust system that makes customers remember you and choose you beyond price.',
    cta: 'Find what my brand is missing',
    items: [
      { title: 'Logo', desc: 'A recognition mark. Useful, but not enough to create trust alone.', icon: Fingerprint },
      { title: 'Naming', desc: 'A name people can remember, say, and recommend.', icon: PenLine },
      { title: 'Branding', desc: 'A system of name, visuals, message, packaging, and customer perception.', icon: Sparkles },
      { title: 'Brandbook', desc: 'Rules that keep your brand consistent everywhere.', icon: BookOpen },
      { title: 'Packaging', desc: 'Visual direction that makes a product feel more valuable and trustworthy.', icon: Box },
      { title: 'Strategy', desc: 'Who you sell to, why they should care, and what promise you own.', icon: BadgeCheck },
    ],
  },
  zh: {
    eyebrow: '简单说明',
    title: 'Logo、命名和品牌不是同一件事。',
    description: 'Logo 是标志，命名是名称，品牌是让客户记住、信任并选择你的完整系统。',
    cta: '了解我的品牌缺少什么',
    items: [
      { title: 'Logo', desc: '识别标志，但单独的 Logo 不足以建立信任。', icon: Fingerprint },
      { title: '命名', desc: '容易记住、表达和推荐的名称。', icon: PenLine },
      { title: '品牌', desc: '名称、视觉、信息、包装和客户感受的统一系统。', icon: Sparkles },
      { title: '品牌手册', desc: '保持品牌在所有触点一致的规则。', icon: BookOpen },
      { title: '包装', desc: '让产品看起来更有价值、更可信的视觉方案。', icon: Box },
      { title: '策略', desc: '明确卖给谁、为什么买、品牌承诺是什么。', icon: BadgeCheck },
    ],
  },
};

const BrandClarity: FC<BrandClarityProps> = ({ lang, onCtaClick }) => {
  const t = copy[(lang as keyof typeof copy) || 'uz'] || copy.uz;

  return (
    <BrandSection tone="soft" className="min-h-0">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item) => (
            <BrandCard key={item.title} className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/15">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black tracking-[-0.03em] text-brand-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-slate">{item.desc}</p>
            </BrandCard>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button onClick={onCtaClick} size="lg" className="rounded-2xl bg-brand-ink hover:bg-brand-blue">
            {t.cta}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </BrandSection>
  );
};

export default BrandClarity;
