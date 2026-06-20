'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

const errorText: Record<string, { title: string; desc: string; retry: string; home: string }> = {
  uz: { title: "Nimadir noto'g'ri ketdi", desc: "Tizimda kutilmagan xatolik yuz berdi. Biz buni allaqachon qayd etdik va bartaraf etish ustida ishlayapmiz.", retry: 'Qayta urinish', home: 'Bosh sahifa' },
  ru: { title: 'Что-то пошло не так', desc: 'Произошла непредвиденная ошибка. Мы уже зафиксировали её и работаем над устранением.', retry: 'Повторить', home: 'Главная' },
  en: { title: 'Something went wrong', desc: 'An unexpected error occurred. We have already logged it and are working on a fix.', retry: 'Try again', home: 'Home' },
  zh: { title: '出了点问题', desc: '发生意外错误。我们已经记录并正在修复。', retry: '重试', home: '首页' },
};

function getLang(): string {
  if (typeof window === 'undefined') return 'uz';
  const match = window.location.pathname.match(/^\/(uz|ru|en|zh)/);
  return match ? match[1] : 'uz';
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  const lang = getLang();
  const t = errorText[lang] || errorText.uz;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t.title}</h1>
          <p className="text-gray-600">{t.desc}</p>
          {error.digest && <p className="text-xs text-gray-400 font-mono">Error ID: {error.digest}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => reset()} variant="default" className="rounded-full px-8 py-6 bg-dark-blue hover:bg-blue-900 transition-all flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            {t.retry}
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2" asChild>
            <Link href={`/${lang}`}>
              <Home className="h-4 w-4" />
              {t.home}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
