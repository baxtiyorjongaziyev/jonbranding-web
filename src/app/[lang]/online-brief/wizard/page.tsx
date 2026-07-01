'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/dictionaries';
import OnlineBriefWizard from '@/components/sections/online-brief-wizard';

const OnlineBriefWizardPage: FC = () => {
  const params = useParams();
  const lang = params.lang as Locale;

  return (
    <main className="flex-grow bg-[#F2EFE6] py-10 sm:py-20 min-h-screen">
      <OnlineBriefWizard lang={lang} />
    </main>
  );
};

export default OnlineBriefWizardPage;
