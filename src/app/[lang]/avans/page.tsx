import React from 'react';
import { getPageAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/dictionaries';
import AvansClient from './AvansClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const safeLang: Locale = (['uz','ru','en','zh'] as const).includes(lang as Locale) ? (lang as Locale) : 'uz';
  const alternates = await getPageAlternates(safeLang, '/avans');
  return { alternates };
}

export default function AvansPage() {
  return <AvansClient />;
}
