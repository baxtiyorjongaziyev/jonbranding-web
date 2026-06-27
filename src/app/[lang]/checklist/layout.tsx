import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz';
  const titles: Record<string, string> = {
    uz: 'Brending Checklist | Jon.Branding',
    ru: 'Чеклист по Брендингу | Jon.Branding',
    en: 'Branding Checklist | Jon.Branding',
    zh: '品牌核查清单 | Jon.Branding',
  };
  const descriptions: Record<string, string> = {
    uz: 'Brending checklist — biznesingizni tashxisdan o\'tkazish uchun 12 mezondan iborat tezkor ro\'yxat. Neyming, logotip, qadoq va huquqiy himoyani tekshiring.',
    ru: 'Чеклист по брендингу — быстрая проверка вашего бизнеса по 12 критериям: нейминг, логотип, упаковка и правовая защита.',
    en: 'Branding checklist — a quick 12-criteria diagnostic for your business: naming, logo, packaging, and legal protection.',
    zh: '品牌核查清单 — 通过12项标准快速诊断您的业务：命名、标志、包装和法律保护。',
  };
  return { title: titles[safeLang] || titles.uz, description: descriptions[safeLang] || descriptions.uz };
}

export default function ChecklistLayout({ children }: Props) {
  return <>{children}</>;
}
