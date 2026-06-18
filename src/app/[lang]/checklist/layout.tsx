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
  return { title: titles[safeLang] || titles.uz };
}

export default function ChecklistLayout({ children }: Props) {
  return <>{children}</>;
}
