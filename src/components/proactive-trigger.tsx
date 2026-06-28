'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const messages: Record<Lang, Record<string, string>> = {
  uz: {
    'sotuvchi-kartochka': "Assalomu alaykum! Ko'rib turibman, Uzum/bozor uchun sotuvchi kartochkalarimiz bilan qiziqyapsiz. Sizga shu yo'nalishdagi yopiq portfolio namunalarini tashlab beraymi?",
    xizmatlar: "Assalomu alaykum! Xizmatlarimizni o'rganyapsiz. Qaysi yo'nalish sizni ko'proq qiziqtiradi? Sizga real misollar bilan tanishishingizga yordam beray.",
    quiz: "Testni yakunlashga yaqin qoldingiz! Natijalarni oldinroq ko'rishni xohlaysizmi?",
    blog: "Maqolani o'qiyotganingizdan xursandman. Aytgancha, shu mavzu bo'yicha brendingizni bepul tekshirib olishingiz mumkin.",
  },
  ru: {
    'sotuvchi-kartochka': "Ассаляму алейкум! Вижу, вас интересуют продающие карточки для маркетплейсов. Скинуть закрытое портфолио наших работ?",
    xizmatlar: "Ассаляму алейкум! Изучаете услуги. Какое направление вас больше интересует? Помогу с примерами.",
    quiz: "Почти завершили тест! Хотите узнать результаты раньше?",
    blog: "Читаете статью? Кстати, можете бесплатно проверить бренд по этой теме.",
  },
  en: {
    'sotuvchi-kartochka': "Hey there! I see you're checking out our seller cards for marketplaces. Want me to share some private portfolio samples?",
    xizmatlar: "Hi! Exploring our services. Which area interests you most? Let me show you real examples.",
    quiz: "Almost done with the quiz! Want to see results early?",
    blog: "Enjoying the article? You can get a free brand check on this topic.",
  },
  zh: {
    'sotuvchi-kartochka': "您好！看到您在查看我们的平台卖家卡片。需要我分享一些内部作品案例吗？",
    xizmatlar: "您好！您在浏览我们的服务。哪个领域最让您感兴趣？让我为您展示实际案例。",
    quiz: "测试快完成了！想提前查看结果吗？",
    blog: "正在阅读文章？顺便可以就此主题免费检查您的品牌。",
  },
};

const ROUTE_TIMING: Record<string, { pathTest: (p: string) => boolean; delayMs: number }> = {
  'sotuvchi-kartochka': {
    pathTest: (p) => p.includes('/pricing/sotuvchi-kartochka'),
    delayMs: 30_000,
  },
  xizmatlar: {
    pathTest: (p) => p.includes('/xizmatlar'),
    delayMs: 45_000,
  },
  quiz: {
    pathTest: (p) => p.includes('/quiz'),
    delayMs: 60_000,
  },
  blog: {
    pathTest: (p) => p.includes('/blog'),
    delayMs: 90_000,
  },
};

export default function ProactiveTrigger({ lang }: { lang: string }) {
  const pathname = usePathname();
  const l = messages[(lang as Lang) in messages ? (lang as Lang) : 'uz'];

  useEffect(() => {
    const KEY = 'oisha_proactive_fired';
    if (sessionStorage.getItem(KEY)) return;

    for (const [key, cfg] of Object.entries(ROUTE_TIMING)) {
      if (cfg.pathTest(pathname)) {
        const msg = l[key];
        if (!msg) return;

        const timer = setTimeout(() => {
          if (sessionStorage.getItem(KEY)) return;
          sessionStorage.setItem(KEY, '1');
          window.dispatchEvent(new CustomEvent('oishaProactive', { detail: { message: msg } }));
        }, cfg.delayMs);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname, l]);

  return null;
}
