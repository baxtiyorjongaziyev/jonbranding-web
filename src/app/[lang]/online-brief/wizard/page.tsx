'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/dictionaries';
import OnlineBriefWizard from '@/components/sections/online-brief-wizard';

const OnlineBriefWizardPage: FC = () => {
  const params = useParams();
  const lang = params.lang as Locale;

  const h1Text = {
    uz: 'Onlayn-brief | Jon.Branding',
    ru: 'Онлайн-бриф | Jon.Branding',
    en: 'Online Brief | Jon.Branding',
    zh: '在线简报 | Jon.Branding'
  }[lang] || 'Online Brief | Jon.Branding';

  return (
    <div className="flex-grow bg-[#F4F5F7] py-10 sm:py-20 min-h-screen">
      <h1 className="sr-only">{h1Text}</h1>
      <OnlineBriefWizard lang={lang} />
    </div>
  );
};

export default OnlineBriefWizardPage;
