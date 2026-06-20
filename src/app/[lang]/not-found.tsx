'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const notFoundText: Record<string, { title: string; desc: string; home: string; back: string }> = {
  uz: { title: 'Sahifa topilmadi', desc: 'Kechirasiz, qidirayotgan sahifangiz mavjud emas yoki ko\'chirilgan.', home: 'Bosh sahifa', back: 'Orqaga qaytish' },
  ru: { title: 'Страница не найдена', desc: 'Извините, запрашиваемая страница не существует или была перемещена.', home: 'Главная', back: 'Назад' },
  en: { title: 'Page not found', desc: 'Sorry, the page you are looking for does not exist or has been moved.', home: 'Home', back: 'Go back' },
  zh: { title: '页面未找到', desc: '抱歉，您查找的页面不存在或已被移动。', home: '首页', back: '返回' },
};

export default function NotFound() {
  const params = useParams();
  const lang = (params?.lang as string) || 'uz';
  const t = notFoundText[lang] || notFoundText.uz;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-8xl font-black text-brand-blue/20 select-none">404</div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.desc}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="rounded-full px-8 py-6">
            <Link href={`/${lang}`}>
              <Home className="h-4 w-4 mr-2" />
              {t.home}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8 py-6" onClick={() => window.history.back()}>
            <span>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
